(() => {
  "use strict";

  const D = window.ECHO_DATA;
  if (!D) throw new Error("ECHO_DATA must load before equipment.js");


  const slug = value => String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const compact = value => slug(value).replace(/-/g, "");
  const assetName = value => String(value || "")
    .replace(/\s+R\d+$/i, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map(word => word ? word[0].toUpperCase() + word.slice(1) : "")
    .join("");

  const weaponAssetById = {
    "bloodpact-s-pledge":"BloodpactsPledge",
    "daybreaker-s-spine":"DaybreakersSpine",
    "defier-s-thorn":"DefiersThorn",
    "firstlight-s-herald":"FirstlightsHerald",
    "moongazer-s-sigil":"MoongazersSigil",
    "verity-s-handle":"VeritysHandle",
    "whispers-of-sirens":"WhispersofSirens",
    "rime-draped-sprouts":"RimeDrapedSprouts",
    "originite-type-iv":"OriginiteTypeIV",
    "lux-umbra":"LuxUmbra"
  };
  const LOCAL_WEAPON_DIR = "assets/recommended-weapons";
  const LOCAL_ECHO_DIR = "assets/echoes";
  const localWeaponFiles = new Set(["AbyssSurges.webp", "AgesOfHarvest.webp", "AzureOath.webp", "BlazingBrilliance.webp", "BlazingJustice.webp", "BloodpactsPledge.webp", "DaybreakersSpine.webp", "DefiersThorn.webp", "EmeraldSentence.webp", "EverbrightPolestar.webp", "FirstlightsHerald.webp", "ForgedDwarfStar.webp", "FreezeFrame.webp", "Frostburn.webp", "Kumokiri.webp", "LetheanElegy.webp", "LuminousHymn.webp", "LuxUmbra.webp", "Marcato.webp", "MoongazersSigil.webp", "OriginiteTypeIV.webp", "RedSpring.webp", "RimeDrapedSprouts.webp", "SkullThrasher.webp", "SolswornCiphers.webp", "SpectralTrigger.webp", "SpectrumBlaster.webp", "StarfieldCalibrator.webp", "StaticMist.webp", "StellarSymphony.webp", "Stringmaster.webp", "TheLastDance.webp", "ThunderflareDominion.webp", "Tragicomedy.webp", "UnflickeringValor.webp", "Variation.webp", "VerdantSummit.webp", "VeritysHandle.webp", "WildfireMark.webp", "WoodlandAria.webp"]);
  const weaponIcon = (name, override) => {
    const file = `${override || assetName(name)}.webp`;
    return localWeaponFiles.has(file) ? `${LOCAL_WEAPON_DIR}/${file}` : "";
  };
  const echoIcon = (key, override) => `${LOCAL_ECHO_DIR}/${override || key}.webp`;

  const weaponSecondaryById = {
    "ages-of-harvest":{stat:"critRate",value:24.3},
    "azure-oath":{stat:"critRate",value:24.3},
    "blazing-brilliance":{stat:"critDmg",value:48.6},
    "blazing-justice":{stat:"critDmg",value:48.6},
    "bloodpact-s-pledge":{stat:"energyRegen",value:38.9},
    "boson-astrolabe":{stat:"energyRegen",value:38.8},
    "daybreaker-s-spine":{stat:"critRate",value:24.3},
    "defier-s-thorn":{stat:"hpPct",value:72.2},
    "discord":{stat:"energyRegen",value:51.8},
    "emerald-sentence":{stat:"critRate",value:24.3},
    "emerald-of-genesis":{stat:"critRate",value:24.3},
    "everbright-polestar":{stat:"critRate",value:24.3},
    "firstlight-s-herald":{stat:"energyRegen",value:77},
    "forged-dwarf-star":{stat:"critRate",value:36},
    "freeze-frame":{stat:"critRate",value:24.3},
    "frostburn":{stat:"critRate",value:24.3},
    "kumokiri":{stat:"critRate",value:36},
    "laser-shearer":{stat:"energyRegen",value:38.8},
    "lethean-elegy":{stat:"critRate",value:24.3},
    "luminous-hymn":{stat:"critRate",value:36},
    "lustrous-razor":{stat:"atkPct",value:36.4},
    "lux-umbra":{stat:"critDmg",value:48.6},
    "marcato-r5":{stat:"energyRegen",value:51.8},
    "moongazer-s-sigil":{stat:"critRate",value:36},
    "overture-r5":{stat:"energyRegen",value:51.8},
    "phasic-homogenizer":{stat:"critDmg",value:48.6},
    "pulsation-bracer":{stat:"critRate",value:24.3},
    "radiance-cleaver":{stat:"critDmg",value:48.6},
    "red-spring":{stat:"critRate",value:24.3},
    "rime-draped-sprouts":{stat:"critDmg",value:72},
    "skull-thrasher":{stat:"critDmg",value:72},
    "solsworn-ciphers":{stat:"critDmg",value:48.6},
    "spectral-trigger":{stat:"critDmg",value:48.6},
    "spectrum-blaster":{stat:"critRate",value:24.3},
    "starfield-calibrator":{stat:"energyRegen",value:77},
    "static-mist":{stat:"critRate",value:24.3},
    "stellar-symphony":{stat:"energyRegen",value:77},
    "stringmaster":{stat:"critRate",value:36},
    "the-last-dance":{stat:"critDmg",value:72},
    "thunderflare-dominion":{stat:"critRate",value:12.1},
    "tragicomedy":{stat:"critRate",value:24.3},
    "unflickering-valor":{stat:"energyRegen",value:77},
    "variation-r5":{stat:"energyRegen",value:51.8},
    "verdant-summit":{stat:"critDmg",value:48.6},
    "verity-s-handle":{stat:"critRate",value:24.3},
    "whispers-of-sirens":{stat:"critDmg",value:72},
    "wildfire-mark":{stat:"critDmg",value:48.6},
    "woodland-aria":{stat:"critRate",value:36},
    "abyss-surges":{stat:"atkPct",value:36.4},
    "cosmic-ripples":{stat:"atkPct",value:54},
    "cadenza-r5":{stat:"energyRegen",value:51.8},
    "originite-type-iv":{stat:"critDmg",value:40.5},
    "dauntless-evernight":{stat:"defPct",value:61.5},
    "amity-accord":{stat:"defPct",value:61.5}
  };

  const weaponCatalog = {};
  const addWeapon = weapon => {
    const id = weapon.id || slug(weapon.name);
    const secondary = weapon.secondary || weaponSecondaryById[id] || null;
    weaponCatalog[id] = {
      rarity:5,
      buffs:{},
      conditionalBuffs:{},
      ...weapon,
      id,
      secondary,
      erSupport:secondary?.stat === "energyRegen" ? secondary.value : 0,
      icon:weapon.icon || weaponIcon(weapon.name,weapon.asset || weaponAssetById[id])
    };
    return id;
  };

  addWeapon({id:"emerald-of-genesis",name:"Emerald of Genesis",type:"sword",baseAtk:588,buffs:{atkPct:12}});
  addWeapon({id:"overture-r5",name:"Overture R5",asset:"Overture",type:"sword",baseAtk:338,rarity:4,buffs:{}});
  addWeapon({id:"laser-shearer",name:"Laser Shearer",type:"sword",baseAtk:587,buffs:{atkPct:12},conditionalBuffs:{interfered:{skill:24}},icon:"assets/weapon-icons/LaserShearer.webp"});

  addWeapon({id:"lustrous-razor",name:"Lustrous Razor",type:"broadblade",baseAtk:588,buffs:{lib:24}});
  addWeapon({id:"discord",name:"Discord",type:"broadblade",baseAtk:338,rarity:4,buffs:{}});
  addWeapon({id:"radiance-cleaver",name:"Radiance Cleaver",type:"broadblade",baseAtk:587,buffs:{atkPct:12},conditionalBuffs:{interfered:{lib:24}},icon:"assets/weapon-icons/RadianceCleaver.webp"});
  addWeapon({id:"dauntless-evernight",name:"Dauntless Evernight",type:"broadblade",baseAtk:337,rarity:4,buffs:{}});

  addWeapon({id:"static-mist",name:"Static Mist",type:"pistols",baseAtk:588,buffs:{}});
  addWeapon({id:"cadenza-r5",name:"Cadenza R5",asset:"Cadenza",type:"pistols",baseAtk:338,rarity:4,buffs:{}});
  addWeapon({id:"phasic-homogenizer",name:"Phasic Homogenizer",type:"pistols",baseAtk:587,buffs:{atkPct:12},conditionalBuffs:{tuneBreak:{element:20}},icon:"assets/weapon-icons/PhasicHomogenizer.webp"});

  addWeapon({id:"abyss-surges",name:"Abyss Surges",type:"gauntlets",baseAtk:588,buffs:{basic:10,skill:10}});
  addWeapon({id:"marcato-r5",name:"Marcato R5",asset:"Marcato",type:"gauntlets",baseAtk:338,rarity:4,buffs:{}});
  addWeapon({id:"pulsation-bracer",name:"Pulsation Bracer",type:"gauntlets",baseAtk:587,buffs:{atkPct:12},conditionalBuffs:{interfered:{basic:24}},icon:"assets/weapon-icons/PulsationBracer.webp"});
  addWeapon({id:"amity-accord",name:"Amity Accord",type:"gauntlets",baseAtk:337,rarity:4,buffs:{}});

  addWeapon({id:"cosmic-ripples",name:"Cosmic Ripples",type:"rectifier",baseAtk:500,buffs:{basic:16}});
  addWeapon({id:"variation-r5",name:"Variation R5",asset:"Variation",type:"rectifier",baseAtk:338,rarity:4,buffs:{}});
  addWeapon({id:"boson-astrolabe",name:"Boson Astrolabe",type:"rectifier",baseAtk:525,buffs:{atkPct:12},conditionalBuffs:{tuneBreak:{atkPct:12,basic:12}},icon:"assets/weapon-icons/BosonAstrolabe.webp"});

  addWeapon({id:"originite-type-iv",name:"Originite: Type IV",asset:"OriginiteTypeIV",type:"gauntlets",baseAtk:300,rarity:3,buffs:{},healingTrigger:true});

  D.profiles.forEach(profile => {
    const id = slug(profile.weapon?.name || `${profile.id}-weapon`);
    if (!weaponCatalog[id]) {
      addWeapon({
        id,
        name:profile.weapon.name,
        type:profile.weaponType,
        baseAtk:profile.weapon.baseAtk,
        buffs:{...(profile.weaponBuffs || {})},
        note:"Curated profile reference weapon"
      });
    }
    profile.defaultWeaponId = id;
    for (const build of profile.builds || []) {
      if (!build.weapon?.name) continue;
      const buildWeaponId = slug(build.weapon.name);
      if (!weaponCatalog[buildWeaponId]) {
        addWeapon({
          id:buildWeaponId,
          name:build.weapon.name,
          type:profile.weaponType,
          baseAtk:build.weapon.baseAtk || profile.weapon.baseAtk,
          buffs:{...(build.weaponBuffs || {})}
        });
      }
    }
  });

  if(weaponCatalog["whispers-of-sirens"]) weaponCatalog["whispers-of-sirens"].icon="assets/recommended-weapons/WhispersofSirens.webp";

  const oldStandardByType = {
    sword:"emerald-of-genesis", broadblade:"lustrous-razor", pistols:"static-mist",
    gauntlets:"abyss-surges", rectifier:"cosmic-ripples"
  };
  const synthStandardByType = {
    sword:"laser-shearer", broadblade:"radiance-cleaver", pistols:"phasic-homogenizer",
    gauntlets:"pulsation-bracer", rectifier:"boson-astrolabe"
  };
  const utilityByType = {
    sword:"overture-r5", broadblade:"discord", pistols:"cadenza-r5",
    gauntlets:"marcato-r5", rectifier:"variation-r5"
  };

  function getCompatibleWeapons(profile) {
    return Object.values(weaponCatalog)
      .filter(weapon => weapon.type === profile.weaponType)
      .sort((a,b) => b.rarity-a.rarity || a.name.localeCompare(b.name));
  }

  const weaponCandidates = {
    "aalto:moonlit":["static-mist","phasic-homogenizer","cadenza-r5"],
    "aalto:sierra":["the-last-dance","phasic-homogenizer","static-mist"],
    "aemeath":["everbright-polestar","blazing-brilliance","laser-shearer"],
    "augusta":["thunderflare-dominion","ages-of-harvest","radiance-cleaver"],
    "baizhi":["stellar-symphony","variation-r5","boson-astrolabe"],
    "brant":["unflickering-valor","laser-shearer","emerald-of-genesis"],
    "buling":["stringmaster","lethean-elegy","rime-draped-sprouts"],
    "calcharo":["wildfire-mark","radiance-cleaver","lustrous-razor"],
    "camellya":["red-spring","blazing-brilliance","emerald-of-genesis"],
    "cantarella":["whispers-of-sirens","rime-draped-sprouts","stringmaster"],
    "carlotta":["the-last-dance","phasic-homogenizer","woodland-aria"],
    "cartethyia":["defier-s-thorn","bloodpact-s-pledge","emerald-of-genesis"],
    "changli":["blazing-brilliance","emerald-of-genesis","laser-shearer"],
    "chisa":["kumokiri","wildfire-mark","ages-of-harvest"],
    "chixia":["the-last-dance","phasic-homogenizer","static-mist"],
    "ciaccona":["woodland-aria","phasic-homogenizer","lux-umbra"],
    "danjin":["blazing-brilliance","red-spring","emerald-of-genesis"],
    "denia":["forged-dwarf-star","stringmaster","boson-astrolabe"],
    "encore":["stringmaster","cosmic-ripples","boson-astrolabe"],
    "galbrena":["lux-umbra","phasic-homogenizer","the-last-dance"],
    "hiyuki":["frostburn","blazing-brilliance","emerald-of-genesis"],
    "iuno":["moongazer-s-sigil","pulsation-bracer","verity-s-handle"],
    "jianxin:moonlit":["verity-s-handle","abyss-surges","marcato-r5"],
    "jianxin:rejuv":["abyss-surges","verity-s-handle","originite-type-iv"],
    "jinhsi":["ages-of-harvest","verdant-summit","radiance-cleaver"],
    "jiyan":["verdant-summit","radiance-cleaver","lustrous-razor"],
    "lingyang":["moongazer-s-sigil","pulsation-bracer","abyss-surges"],
    "lucilla":["freeze-frame","stringmaster","boson-astrolabe"],
    "lucy":["spectral-trigger","phasic-homogenizer","skull-thrasher"],
    "lumi":["ages-of-harvest","radiance-cleaver","discord"],
    "lupa":["wildfire-mark","ages-of-harvest","kumokiri"],
    "luuk-herssen":["daybreaker-s-spine","pulsation-bracer","verity-s-handle"],
    "lynae":["spectrum-blaster","phasic-homogenizer","static-mist"],
    "mornye":["starfield-calibrator","discord","dauntless-evernight"],
    "mortefi":["static-mist","phasic-homogenizer","cadenza-r5"],
    "phoebe":["luminous-hymn","stringmaster","boson-astrolabe"],
    "phrolova":["lethean-elegy","stringmaster","cosmic-ripples"],
    "qiuyuan":["emerald-sentence","blazing-brilliance","emerald-of-genesis"],
    "rebecca:shadow":["skull-thrasher","phasic-homogenizer","the-last-dance"],
    "rebecca:moonlit":["skull-thrasher","static-mist","phasic-homogenizer"],
    "roccia":["tragicomedy","pulsation-bracer","verity-s-handle"],
    "rover-aero":["bloodpact-s-pledge","laser-shearer","emerald-of-genesis"],
    "rover-electro":["blazing-brilliance","laser-shearer","emerald-of-genesis"],
    "rover-havoc":["red-spring","blazing-brilliance","emerald-of-genesis"],
    "rover-spectro":["blazing-brilliance","laser-shearer","emerald-of-genesis"],
    "sanhua":["blazing-brilliance","red-spring","overture-r5"],
    "shorekeeper":["stellar-symphony","variation-r5","boson-astrolabe"],
    "sigrika":["solsworn-ciphers","pulsation-bracer","verity-s-handle"],
    "suisui":["firstlight-s-herald","stellar-symphony","variation-r5"],
    "taoqi":["starfield-calibrator","discord","dauntless-evernight"],
    "verina":["variation-r5","stellar-symphony","boson-astrolabe"],
    "xiangli-yao":["moongazer-s-sigil","verity-s-handle","blazing-justice"],
    "yangyang":["blazing-brilliance","emerald-of-genesis","overture-r5"],
    "yangyang-xuanling":["azure-oath","blazing-brilliance","emerald-of-genesis"],
    "yinlin":["stringmaster","cosmic-ripples","boson-astrolabe"],
    "youhu":["marcato-r5","pulsation-bracer","abyss-surges"],
    "yuanwu:rejuv":["originite-type-iv"],
    "yuanwu:empyrean":["verity-s-handle","amity-accord","pulsation-bracer"],
    "zani":["blazing-justice","verity-s-handle","pulsation-bracer"],
    "zhezhi":["rime-draped-sprouts","stringmaster","boson-astrolabe"]
  };

  const interferedProfiles = new Set([
    "aemeath","chisa","denia","lucy","luuk-herssen","lynae","mornye",
    "rebecca","sigrika","suisui","yangyang-xuanling"
  ]);

  const mergeBuffs = (...sources) => {
    const out={};
    for(const source of sources){
      for(const [key,value] of Object.entries(source||{})){
        if(typeof value==="number") out[key]=(out[key]||0)+value;
      }
    }
    return out;
  };

  function resolvedWeaponBuffs(profile,build,weapon) {
    const conditional=weapon?.conditionalBuffs||{};
    const uptime=Math.max(0,Math.min(1,Number(build?.tuneBreakUptime)||0));
    const tuneBreak=Object.fromEntries(Object.entries(conditional.tuneBreak||{}).map(([key,value])=>[key,Number(value||0)*uptime]));
    return mergeBuffs(
      weapon?.buffs,
      tuneBreak,
      interferedProfiles.has(profile.id) ? conditional.interfered : null
    );
  }

  function weaponSecondaryTotals(weaponOrId) {
    const weapon = typeof weaponOrId === "string" ? weaponCatalog[weaponOrId] : weaponOrId;
    const totals = {cr:0,cd:0,er:0,atkPct:0,hpPct:0,defPct:0};
    if (!weapon?.secondary) return totals;
    const value=Number(weapon.secondary.value)||0;
    if (weapon.secondary.stat === "critRate") totals.cr = value;
    if (weapon.secondary.stat === "critDmg") totals.cd = value;
    if (weapon.secondary.stat === "energyRegen") totals.er = value;
    if (weapon.secondary.stat === "atkPct") totals.atkPct = value;
    if (weapon.secondary.stat === "hpPct") totals.hpPct = value;
    if (weapon.secondary.stat === "defPct") totals.defPct = value;
    return totals;
  }

  function critAverage(cr,cd) {
    const rate=Math.max(0,Math.min(100,Number(cr)||0))/100;
    const damage=Math.max(100,Number(cd)||100)/100;
    return (1-rate)+(rate*damage);
  }

  function weaponScore(profile,build,weapon) {
    const reference=weaponCatalog[profile.defaultWeaponId]||weapon;
    const refSecondary=weaponSecondaryTotals(reference);
    const secondary=weaponSecondaryTotals(weapon);
    const buffs=resolvedWeaponBuffs(profile,build,weapon);
    const scaler=profile.scaling||"atk";

    let primary=Number(profile.defaultPrimary)||2000;
    if(scaler==="atk"){
      const oldBase=(Number(profile.charBaseAtk)||0)+(Number(reference.baseAtk)||0);
      const newBase=(Number(profile.charBaseAtk)||0)+(Number(weapon.baseAtk)||0);
      if(oldBase>0) primary*=newBase/oldBase;
      primary+=newBase*((secondary.atkPct-refSecondary.atkPct+(buffs.atkPct||0))/100);
    }else if(scaler==="hp"){
      primary+=(Number(profile.baseHp)||0)*((secondary.hpPct-refSecondary.hpPct+(buffs.hpPct||0))/100);
    }else if(scaler==="def"){
      primary+=(Number(profile.baseDef)||0)*((secondary.defPct-refSecondary.defPct+(buffs.defPct||0))/100);
    }

    const cr=70-refSecondary.cr+secondary.cr;
    const cd=250-refSecondary.cd+secondary.cd;
    const er=(Number(profile.erMin)||100)-refSecondary.er+secondary.er;
    const erTarget=Number(build.erMin??profile.erMin)||100;
    const erPenalty=er>=erTarget ? 1 : Math.max(.42,1-((erTarget-er)/Math.max(50,erTarget))*1.65);

    let weightedBonus=0,totalShare=0;
    for(const [type,rawShare] of Object.entries(build.shares||profile.shares||{})){
      const share=Number(rawShare)||0;
      if(share<=0) continue;
      const typeKey=type==="fixedLib"?"lib":type;
      weightedBonus+=share*(1+((buffs.allDmg||0)+(buffs.element||0)+(buffs[typeKey]||0))/100);
      totalShare+=share;
    }
    if(!totalShare) weightedBonus=1; else weightedBonus/=totalShare;
    return Math.max(1,primary)*critAverage(cr,cd)*weightedBonus*erPenalty;
  }

  function candidateIds(profile,build) {
    if(profile.id==="yuanwu" && build.id==="rejuv") return ["originite-type-iv"];
    const exact=weaponCandidates[`${profile.id}:${build.id}`]||weaponCandidates[profile.id];
    const fallback=[profile.defaultWeaponId,synthStandardByType[profile.weaponType],oldStandardByType[profile.weaponType],utilityByType[profile.weaponType]];
    return [...new Set((exact||fallback).filter(id=>weaponCatalog[id]?.type===profile.weaponType))].slice(0,5);
  }

  function getRecommendedWeapon(profile,build) {
    const id=candidateIds(profile,build)[0];
    return weaponCatalog[id]||weaponCatalog[profile.defaultWeaponId]||getCompatibleWeapons(profile)[0]||null;
  }

  function getWeaponRecommendations(profile,build) {
    const ids=candidateIds(profile,build);
    if(!ids.length) return [];
    const primary=weaponCatalog[ids[0]];
    const alternatives=ids.slice(1).map(id=>weaponCatalog[id]).filter(Boolean);
    const list=[primary,...alternatives].filter(Boolean).slice(0,3);
    const labels=["★","◆","◇"];
    const tiers=["recommended","viable","utility"];
    return list.map((weapon,index)=>({
      ...weapon,
      recommendationTier:tiers[index],
      recommendationLabel:labels[index],
      rankScore:weaponScore(profile,build,weapon)
    }));
  }

  function getWeaponOptions(profile,build=profile.builds?.[0]||{}) {
    return getWeaponRecommendations(profile,build);
  }

  function adjustBuildForWeapon(build,fromWeaponId,toWeaponId) {
    const from = weaponSecondaryTotals(fromWeaponId);
    const to = weaponSecondaryTotals(toWeaponId);
    return {
      ...build,
      cr:Number(((Number(build.cr)||0)-from.cr+to.cr).toFixed(1)),
      cd:Number(((Number(build.cd)||0)-from.cd+to.cd).toFixed(1)),
      er:Number(((Number(build.er)||0)-from.er+to.er).toFixed(1))
    };
  }

  function selectedWeaponProfile(baseProfile,build,weaponId) {
    const weapon=weaponCatalog[weaponId]||weaponCatalog[baseProfile.defaultWeaponId];
    if(!weapon) return null;
    return {
      weapon:{name:weapon.name,baseAtk:weapon.baseAtk},
      weaponBuffs:resolvedWeaponBuffs(baseProfile,build,weapon),
      selectedWeapon:weapon
    };
  }

  const sourceEchoCatalog = Array.isArray(window.LOCAL_ECHO_CATALOG) ? window.LOCAL_ECHO_CATALOG : [];
  const echoCatalog = sourceEchoCatalog.map(item=>({
    ...item,
    id:item.id || slug(item.name),
    asset:item.asset || item.key,
    icon:echoIcon(item.key,item.asset),
    source:"local-catalog"
  })).sort((a,b)=>a.cost-b.cost || a.name.localeCompare(b.name));
  const echoCatalogState = {status:"local",count:echoCatalog.length,updatedAt:0,error:null};

  const mainEchoDefaults = {
    "rejuvenating-glow":"fallacy-of-no-return",
    "void-thunder":"nightmare-thundering-mephis",
    "lingering-tunes":"mech-abomination",
    "moonlit-clouds":"impermanence-heron",
    "molten-rift":"nightmare-inferno-rider",
    "sierra-gale":"nightmare-feilian-beringal",
    "celestial-light":"jue",
    "havoc-eclipse":"dreamless",
    "freezing-frost":"lampylumen-myriad",
    "frosty-resolve":"sentry-construct",
    "empyrean-anthem":"hecate",
    "midnight-veil":"lorelei",
    "eternal-radiance":"nightmare-mourning-aix",
    "tidebreaking-courage":"dragon-of-dirge",
    "dream-of-the-lost":"nightmare-hecate",
    "flamewings-shadow":"corrosaurus",
    "thread-of-severed-fate":"threnodian-leviathan",
    "law-of-harmony":"reminiscence-fenrico",
    "crown-of-valor":"the-false-sovereign",
    "gusts-of-welkin":"nightmare-kelpie",
    "flaming-clawprint":"lioness-of-glory",
    "windward-pilgrimage":"reminiscence-fleurdelys",
    "halo-of-starry-radiance":"reactor-husk",
    "chromatic-foam":"reminiscence-denia",
    "wishes-of-quiet-snowfall":"threnodian-voidborne-construct",
    "pact-of-neonlight-leap":"hyvatia",
    "rite-of-gilded-revelation":"twin-nova-nebulous-cannon",
    "sound-of-true-name":"nameless-explorer",
    "reel-of-spliced-memories":"voidwing-moth",
    "trailblazing-star":"sigillum",
    "shadow-of-shattered-dreams":"nightmare-adam-smasher",
    "song-of-feathered-trace":"thousand-puppet-pavilion",
    "lamp-of-nether-road":"myriad-snare-rustfire-chassis",
    "heart-of-evils-purge":"myriad-snare-rustfire-chassis"
  };


  function getEchoOptions(setId,cost) {
    return echoCatalog.filter(e=>e.cost===cost&&e.sets.includes(setId));
  }

  function getEchoById(id,setId,cost) {
    return echoCatalog.find(e=>e.id===id || e.aliases?.includes(id)) || getEchoOptions(setId,cost)[0] || null;
  }

  function getMainEchoOptions(setId,cost=null) {
    const preferred=mainEchoDefaults[setId];
    const preferredEcho=preferred ? findEchoByFlexibleId(preferred) : null;
    const resolvedCost=cost ?? preferredEcho?.cost ?? 4;
    const options=getEchoOptions(setId,resolvedCost);
    return [...options].sort((a,b)=>Number(b.id===preferred)-Number(a.id===preferred)||a.name.localeCompare(b.name));
  }

  const recommendedEchoOverrides = {
    "zhezhi:empyrean":"nightmare-lampylumen-myriad",
    "yinlin:empyrean":"nightmare-tempest-mephis",
    "yuanwu:empyrean":"nightmare-tempest-mephis",
    "camellya:endgame":"nightmare-crownless",
    "danjin:havoc":"nightmare-crownless",
    "danjin:midnight":"nightmare-impermanence-heron",
    "roccia:midnight":"nightmare-impermanence-heron",
    "phoebe:radiance":"capitaneus",
    "zani:endgame":"capitaneus",
    "encore:endgame":"inferno-rider",
    "iuno:crown":"lady-of-the-sea",
    "lucilla:wishes":"glommoth",
    "rebecca:moonlit":"bell-borne-geochelone",
    "suisui:endgame":"forbidden-bastion"
  };

  function findEchoByFlexibleId(id) {
    if(!id) return null;
    const target=slug(id.replace(/^api-|^wt-/,""));
    return echoCatalog.find(e=>e.id===id || e.aliases?.includes(id) || slug(e.key||e.name)===target || slug(e.name)===target) || null;
  }

  function getRecommendedMainEcho(profile,build) {
    const overrideId=recommendedEchoOverrides[`${profile.id}:${build.id}`]||build.recommendedMainEchoId;
    const planSetIds=[...new Set(Object.values(build.setPlan?.slots||{c4:build.bestSet}))];
    if(overrideId){
      const explicit=findEchoByFlexibleId(overrideId);
      if(explicit) return {...explicit,setId:explicit.sets.find(id=>planSetIds.includes(id))||explicit.sets[0]};
    }
    for(const setId of planSetIds){
      const echo=findEchoByFlexibleId(mainEchoDefaults[setId]);
      if(echo) return {...echo,setId};
    }
    for(const setId of planSetIds){
      const options=getMainEchoOptions(setId);
      if(options[0]) return {...options[0],setId};
    }
    return null;
  }

  const recPolicies = {
    "shorekeeper":{default:["energyRegen","attributeDmg"],"cosmic-ripples":["energyRegen","energyRegen"]},
    "verina":{default:["energyRegen","attributeDmg"],"cosmic-ripples":["energyRegen","energyRegen"]},
    "baizhi":{default:["energyRegen","energyRegen"]},
    "suisui":{default:["energyRegen","hpPct"],"cosmic-ripples":["energyRegen","energyRegen"]},
    "mornye":{default:["energyRegen","attributeDmg"],"lustrous-razor":["energyRegen","energyRegen"]},
    "brant":{default:["energyRegen","attributeDmg"],"emerald-of-genesis":["energyRegen","energyRegen"]},
    "taoqi":{default:["energyRegen","energyRegen"]},
    "jianxin":{default:["attributeDmg","energyRegen"]},
    "lumi":{default:["attributeDmg","energyRegen"],"lustrous-razor":["energyRegen","energyRegen"]}
  };

  function recommendationLabel(profile,key) {
    return key==="attributeDmg"?`${profile.attribute} DMG`
      :key==="energyRegen"?"Energy Regen"
      :key==="hpPct"?"HP%"
      :key==="defPct"?"DEF%"
      :key==="atkPct"?"ATK%"
      :(D.statMeta[key]?.label||key);
  }

  function repeatedMainDisplay(profile,keys) {
    const labels=(keys||[]).map(key=>recommendationLabel(profile,key));
    if(!labels.length) return "NONE";
    if(labels.length>1 && labels.every(label=>label===labels[0])) return `${labels.length} × ${labels[0]}`;
    return labels.join(" + ");
  }

  function cleanPriority(priority) {
    const seen=new Set();
    const out=[];
    for(const raw of priority||[]){
      let value=String(raw||"").trim();
      if(!value || /^(?:ER|Energy Regen)(?:\b|\s+to\b)/i.test(value)) continue;
      if(/^Complete\s+\d+P\s+set$/i.test(value)) continue;
      if(/^CR(?:IT Rate)?\s+to\s+\d+(?:\.\d+)?%$/i.test(value)) value="CR";
      if(/^CD(?:IT DMG)?\s+to\s+\d+(?:\.\d+)?%$/i.test(value)) value="CD";
      const key=value.toLowerCase();
      if(seen.has(key)) continue;
      seen.add(key);
      out.push(value);
      if(out.length===5) break;
    }
    return out;
  }

  function resolveRecommendation(profile,weaponId) {
    const rec={...profile.rec,three:[...(profile.rec.three||[])],threeKeys:[...(profile.rec.threeKeys||[])],priority:[...(profile.rec.priority||[])]};
    const policy=recPolicies[profile.id];
    const policyKeys=policy && (policy[weaponId]||policy.default);
    if(policyKeys) rec.threeKeys=[...policyKeys];

    const costs=profile.slotCosts || [4,3,3,1,1];
    const fourCount=costs.filter(cost=>cost===4).length;
    const threeCount=costs.filter(cost=>cost===3).length;
    const oneCount=costs.filter(cost=>cost===1).length;
    const fixedCrit=profile.id==="shorekeeper";

    if(fourCount>1){
      rec.four="CRIT Rate + CRIT DMG";
    }else if(fixedCrit){
      rec.four="CRIT DMG";
      rec.fourKey="critDmg";
    }else if(["critRate","critDmg"].includes(rec.fourKey)){
      rec.four="CRIT Rate OR CRIT DMG";
    }

    rec.threeKeys=threeCount ? rec.threeKeys.slice(0,threeCount) : [];
    rec.three=rec.threeKeys.map(key=>recommendationLabel(profile,key));
    rec.threeDisplay=repeatedMainDisplay(profile,rec.threeKeys);
    rec.oneDisplay=oneCount>1 ? `${oneCount} × ${rec.one}` : rec.one;
    rec.priority=cleanPriority(rec.priority);
    return rec;
  }

  const assetCache=new Map();
  function loadAsset(src) {
    if(!src) return Promise.reject(new Error("Missing asset URL"));
    if(assetCache.has(src)) return assetCache.get(src).promise;
    if(typeof Image==="undefined"){
      const promise=Promise.resolve(src);
      assetCache.set(src,{status:"ready",promise});
      return promise;
    }
    const img=new Image();
    img.decoding="async";
    const promise=new Promise((resolve,reject)=>{
      img.onload=async()=>{
        try{if(img.decode) await img.decode();}catch(_){}
        const entry=assetCache.get(src); if(entry) entry.status="ready";
        resolve(src);
      };
      img.onerror=()=>{const entry=assetCache.get(src);if(entry)entry.status="error";reject(new Error(`Asset failed: ${src}`));};
    });
    assetCache.set(src,{status:"loading",promise,img});
    img.src=src;
    return promise;
  }
  const isAssetReady=src=>assetCache.get(src)?.status==="ready";
  function preloadEquipmentAssets() {
    const sources=new Set();
  
    for(const profile of D.profiles){
      for(const build of profile.builds||[]){
        const weapon=getRecommendedWeapon(profile,build);
        const echo=getRecommendedMainEcho(profile,build);
  
        if(weapon?.icon) sources.add(weapon.icon);
        if(echo?.icon) sources.add(echo.icon);
      }
    }
  
    const queue=[...sources];
    let index=0;
  
    const pump=()=>{
      const stop=Math.min(index+6,queue.length);
  
      while(index<stop){
        loadAsset(queue[index++]).catch(()=>{});
      }
  
      if(index<queue.length){
        if("requestIdleCallback" in window){
          requestIdleCallback(pump,{timeout:500});
        }else{
          setTimeout(pump,60);
        }
      }
    };
  
    const start=()=>{
      if("requestIdleCallback" in window){
        requestIdleCallback(pump,{timeout:800});
      }else{
        setTimeout(pump,250);
      }
    };
  
    if(document.readyState==="complete"){
      start();
    }else{
      window.addEventListener("load",start,{once:true});
    }
  }

  Object.assign(D,{
    weaponCatalog,
    getCompatibleWeapons,
    getWeaponOptions,
    getRecommendedWeapon,
    getWeaponRecommendations,
    weaponScore,
    resolvedWeaponBuffs,
    weaponSecondaryTotals,
    adjustBuildForWeapon,
    selectedWeaponProfile,
    resolveRecommendation,
    getEchoOptions,
    getEchoById,
    getMainEchoOptions,
    getRecommendedMainEcho,
    mainEchoDefaults,
    echoCatalog,
    echoCatalogState,
    loadAsset,
    isAssetReady,
    preloadEquipmentAssets
  });
})();
