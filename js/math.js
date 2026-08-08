(() => {
  "use strict";

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function critAverage(crPct, cdPct) {
    const cr = clamp(Number(crPct) || 0, 0, 100) / 100;
    const cd = Math.max(100, Number(cdPct) || 100) / 100;
    return (1 - cr) + cr * cd;
  }

  function baseForScaler(profile) {
    const scaler = profile.scaling || "atk";
    if (scaler === "hp") return Number(profile.baseHp) || 0;
    if (scaler === "def") return Number(profile.baseDef) || 0;
    return (Number(profile.charBaseAtk) || 0) + (Number(profile.weapon?.baseAtk) || 0);
  }

  function primaryDelta(profile, echoA, echoB) {
    const scaler = profile.scaling || "atk";
    const base = baseForScaler(profile);

    if (scaler === "hp") {
      return base * (((echoB.hpPct || 0) - (echoA.hpPct || 0)) / 100)
        + ((echoB.flatHp || 0) - (echoA.flatHp || 0));
    }

    if (scaler === "def") {
      return base * (((echoB.defPct || 0) - (echoA.defPct || 0)) / 100)
        + ((echoB.flatDef || 0) - (echoA.flatDef || 0));
    }

    return base * (((echoB.atkPct || 0) - (echoA.atkPct || 0)) / 100)
      + ((echoB.flatAtk || 0) - (echoA.flatAtk || 0));
  }

  function candidateBuild(profile, current, echoA, echoB) {
    return {
      primary: current.primary + primaryDelta(profile, echoA, echoB),
      cr: current.cr + ((echoB.critRate || 0) - (echoA.critRate || 0)),
      cd: current.cd + ((echoB.critDmg || 0) - (echoA.critDmg || 0)),
      er: current.er + ((echoB.energyRegen || 0) - (echoA.energyRegen || 0))
    };
  }

  function addBuffs(target, source) {
    if (!source) return target;
    const nestedKeys = new Set(["typeCritRate", "typeElement", "typeAmplify", "typeSpecial"]);

    for (const [key, value] of Object.entries(source)) {
      if (nestedKeys.has(key)) {
        target[key] = target[key] || {};
        for (const [type, amount] of Object.entries(value || {})) {
          target[key][type] = (target[key][type] || 0) + Number(amount || 0);
        }
      } else if (typeof value === "number") {
        target[key] = (target[key] || 0) + value;
      }
    }
    return target;
  }

  function uniqueSonataComposition(profile, equippedEchoes) {
    if (!Array.isArray(equippedEchoes) || !equippedEchoes.length) {
      return (profile.setPlan?.composition || []).map(group => ({
        set: group.set,
        pieces: Number(group.pieces) || 0,
        unique: Number(group.pieces) || 0
      }));
    }

    const groups = new Map();
    equippedEchoes.forEach((echo,index) => {
      const set = echo?.set;
      if (!set) return;
      if (!groups.has(set)) groups.set(set,{set,pieces:0,ids:new Set()});
      const group = groups.get(set);
      group.pieces += 1;
      group.ids.add(echo.echoId || `legacy-unique-${set}-${index}`);
    });

    return [...groups.values()].map(group => ({
      set: group.set,
      pieces: group.pieces,
      unique: group.ids.size
    }));
  }

  function sonataCombatBuffs(profile, build, sonataBuffs, equippedEchoes) {
    const out = {
      typeCritRate: {},
      typeElement: {},
      typeAmplify: {},
      typeSpecial: {}
    };
    const groups = uniqueSonataComposition(profile,equippedEchoes);

    for (const group of groups) {
      const effect = sonataBuffs?.[group.set];
      if (!effect) continue;
      for (const threshold of [1, 2, 3, 5]) {
        if (group.unique >= threshold && effect[threshold]) addBuffs(out,effect[threshold]);
      }
    }

    addBuffs(out, profile.combatBuffs || {});
    const effectiveEr = Number(build.er) || 0;

    const songGroup = groups.find(group => group.set === "song-of-feathered-trace");
    const songEffect = sonataBuffs?.["song-of-feathered-trace"];
    const songBranch = songEffect?.branches?.[profile.songFeatherBranch];
    if (songGroup && songBranch && songGroup.unique >= Number(songBranch.pieces || 5)) {
      addBuffs(out,songBranch.buffs || {});
      const dynamic=songBranch.dynamic || {};
      if (Number.isFinite(Number(dynamic.atkPctPerEr))) {
        const scaledAtk=effectiveEr*Number(dynamic.atkPctPerEr);
        const cap=Number.isFinite(Number(dynamic.atkPctCap)) ? Number(dynamic.atkPctCap) : scaledAtk;
        addBuffs(out,{atkPct:Math.min(cap,scaledAtk)});
      }
    }

    const wishesGroup = groups.find(group => group.set === "wishes-of-quiet-snowfall");
    const wishesEffect = sonataBuffs?.["wishes-of-quiet-snowfall"];
    const wishesBranch = wishesEffect?.branches?.[profile.wishesQuietBranch];
    if (wishesGroup && wishesBranch && wishesGroup.unique >= Number(wishesBranch.pieces || 5)) {
      addBuffs(out,wishesBranch.buffs || {});
    }

    for (const group of groups) {
      const effect = sonataBuffs?.[group.set];
      if (!effect) continue;
      for (const conditional of effect.conditional || []) {
        const piecesPass = conditional.pieces == null || group.unique >= Number(conditional.pieces);
        const erPass = conditional.er == null || effectiveEr >= Number(conditional.er);
        if (piecesPass && erPass) addBuffs(out,conditional.buffs);
      }
    }
    return out;
  }

  function effectiveSheetBuild(profile, build, sonataBuffs, equippedEchoes) {
    return {...build,er:Number(build.er)||0};
  }

  function effectivePrimary(profile, build, combat) {
    let primary = Number(build.primary) || 0;
    const base = baseForScaler(profile);
    const weapon = profile.weaponBuffs || {};

    if ((profile.scaling || "atk") === "hp") {
      primary += base * (((weapon.hpPct || 0) + (combat.hpPct || 0)) / 100);
    } else if ((profile.scaling || "atk") === "def") {
      primary += base * (((weapon.defPct || 0) + (combat.defPct || 0)) / 100);
    } else {
      primary += base * (((weapon.atkPct || 0) + (combat.atkPct || 0)) / 100);
    }

    return primary;
  }

  function typeStatKey(type) {
    if (type === "basic") return "basicDmg";
    if (type === "heavy") return "heavyDmg";
    if (type === "skill") return "skillDmg";
    if (type === "lib" || type === "fixedLib") return "libDmg";
    return null;
  }

  function isStatusType(profile, type) {
    return (profile.statusTypes || []).includes(type);
  }

  function isGuaranteedCrit(profile, type) {
    return type === "fixedLib" || (profile.guaranteedCritTypes || []).includes(type);
  }

  function critFactor(profile, build, combat, type) {
    if (isStatusType(profile, type) || (profile.noCritTypes || []).includes(type)) return 1;

    const cd = (Number(build.cd) || 0) + (combat.critDmg || 0);
    if (isGuaranteedCrit(profile, type)) {
      return Math.max(100, cd) / 100;
    }

    const cr = (Number(build.cr) || 0)
      + (combat.critRate || 0)
      + (combat.typeCritRate?.[type] || 0);

    return critAverage(cr, cd);
  }

  function damageBonusFactor(profile, echo, combat, type) {
    if (isStatusType(profile, type)) return 1;

    const weapon = profile.weaponBuffs || {};
    const typeKey = typeStatKey(type);

    const allDmg = (weapon.allDmg || 0) + (combat.allDmg || 0);
    const element = (echo.attributeDmg || 0)
      + (weapon.element || 0)
      + (combat.element || 0)
      + (combat.typeElement?.[type] || 0);

    const weaponType = type === "fixedLib"
      ? (weapon.lib || 0)
      : (weapon[type] || 0);

    const echoType = typeKey ? (echo[typeKey] || 0) : 0;
    const combatType = typeKey ? (combat[typeKey] || 0) : (combat[type] || 0);

    return 1 + (allDmg + element + weaponType + echoType + combatType) / 100;
  }

  function amplifyFactor(profile, combat, type) {
    if (isStatusType(profile, type)) {
      return 1 + ((combat.negativeStatusAmplify || 0) / 100);
    }

    const weapon = profile.weaponBuffs || {};
    const generic = (weapon.amplify || 0) + (combat.amplify || 0);
    const typed = (weapon.typeAmplify?.[type] || 0) + (combat.typeAmplify?.[type] || 0);
    return 1 + (generic + typed) / 100;
  }

  function specialFactor(profile, combat, type) {
    if (isStatusType(profile, type)) return 1;
    const weapon = profile.weaponBuffs || {};
    const generic = (weapon.special || 0) + (combat.special || 0);
    const typed = (weapon.typeSpecial?.[type] || 0) + (combat.typeSpecial?.[type] || 0);
    return 1 + (generic + typed) / 100;
  }

  function bucketRatio(profile, type, current, candidate, echoA, echoB, combatA, combatB) {
    if (isStatusType(profile, type)) {
      const ampA = amplifyFactor(profile, combatA, type);
      const ampB = amplifyFactor(profile, combatB, type);
      return ampA > 0 ? ampB / ampA : 1;
    }

    const primaryA = effectivePrimary(profile, current, combatA);
    const primaryB = effectivePrimary(profile, candidate, combatB);
    const primaryRatio = primaryA > 0 ? primaryB / primaryA : 1;

    const critA = critFactor(profile, current, combatA, type);
    const critB = critFactor(profile, candidate, combatB, type);
    const critRatio = critA > 0 ? critB / critA : 1;

    const bonusA = damageBonusFactor(profile, echoA, combatA, type);
    const bonusB = damageBonusFactor(profile, echoB, combatB, type);
    const bonusRatio = bonusA > 0 ? bonusB / bonusA : 1;

    const ampA = amplifyFactor(profile, combatA, type);
    const ampB = amplifyFactor(profile, combatB, type);
    const ampRatio = ampA > 0 ? ampB / ampA : 1;

    const specialA = specialFactor(profile, combatA, type);
    const specialB = specialFactor(profile, combatB, type);
    const specialRatio = specialA > 0 ? specialB / specialA : 1;

    return primaryRatio * critRatio * bonusRatio * ampRatio * specialRatio;
  }

  function expectedDamageRatio(profile, current, candidate, echoA, echoB, sonataBuffs, loadoutA, loadoutB) {
    const shares = profile.shares || {};
    const entries = Object.entries(shares).filter(([, share]) => Number(share) > 0);
    if (!entries.length) return 1;

    const combatA = sonataCombatBuffs(profile, current, sonataBuffs, loadoutA);
    const combatB = sonataCombatBuffs(profile, candidate, sonataBuffs, loadoutB);

    let weightedRatio = 0;
    let totalWeight = 0;

    for (const [type, rawShare] of entries) {
      const share = Number(rawShare) || 0;
      weightedRatio += share * bucketRatio(
        profile, type, current, candidate, echoA, echoB, combatA, combatB
      );
      totalWeight += share;
    }

    return totalWeight > 0 ? weightedRatio / totalWeight : 1;
  }

  window.ECHO_MATH = {
    critAverage,
    primaryDelta,
    candidateBuild,
    addBuffs,
    uniqueSonataComposition,
    sonataCombatBuffs,
    effectiveSheetBuild,
    effectivePrimary,
    expectedDamageRatio
  };
})();