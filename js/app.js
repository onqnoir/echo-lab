(() => {
  "use strict";

  const D = window.ECHO_DATA;
  const M = window.ECHO_MATH;
  const $ = id => document.getElementById(id);
  const slotKeys = ["c4","c3a","c3b","c1a","c1b"];
  const allSubstats = Object.keys(D.statMeta);
  const pctStats = new Set(Object.entries(D.statMeta).filter(([,v])=>v.pct).map(([k])=>k));
  const weaponLabels = {sword:"Sword",broadblade:"Broadblade",pistols:"Pistols",gauntlets:"Gauntlets",rectifier:"Rectifier"};

  const activeProfileStorageKey="wuwaEchoLab.activeProfile";
  const sortedProfiles=[...D.profiles].sort((a,b)=>(a.releaseOrder??9999)-(b.releaseOrder??9999)||a.name.localeCompare(b.name));
  let rememberedProfileId=null;
  try{rememberedProfileId=localStorage.getItem(activeProfileStorageKey);}catch{}
  let baseProfile = D.profiles.find(p=>p.id===rememberedProfileId) || sortedProfiles[0];
  let buildId = baseProfile.builds[0].id;
  let weaponId = baseProfile.defaultWeaponId || null;
  let mainEchoId = null;
  let profileSelectionToken = 0;
  const filters = {attribute:"All",rarity:"All",weapon:"All",role:"All"};

  const n = id => Number($(id).value) || 0;
  const fmt = (v,d=2) => Number.isFinite(v) ? v.toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d}) : "—";
  const signed = (v,suffix="",d=2) => `${v>0?"+":""}${fmt(v,d)}${suffix}`;

  function storageKey(){ return `wuwaEchoLab.profile.${baseProfile.id}`; }
  function legacyKey(){ return `wuwaEchoLab.alpha04.${baseProfile.id}`; }

  function activeBuild(){ return baseProfile.builds.find(b=>b.id===buildId) || baseProfile.builds[0]; }

  function mergeProfile(base, build){
    const merged = {
      ...base,
      ...build,
      id:base.id,
      buildId:build.id,
      weapon:{...base.weapon,...(build.weapon||{})},
      weaponBuffs:{...(base.weaponBuffs||{}),...(build.weaponBuffs||{})},
      combatBuffs:{...(base.combatBuffs||{}),...(build.combatBuffs||{})},
      rec:{...base.rec,...(build.rec||{})},
      shares:build.shares || base.shares,
      bestSet:build.bestSet || base.bestSet,
      setPlan:build.setPlan || base.setPlan
    };
    const equipment = D.selectedWeaponProfile?.(base,build,weaponId);
    if(equipment){
      merged.weapon=equipment.weapon;
      merged.weaponBuffs=equipment.weaponBuffs;
      merged.selectedWeapon=equipment.selectedWeapon;
    }
    merged.rec=D.resolveRecommendation?.(merged,weaponId) || merged.rec;
    return merged;
  }

  function P(){ return mergeProfile(baseProfile,activeBuild()); }
  function attrColor(p=baseProfile){ return D.attributeColors[p.attribute] || "#7ce8ef"; }
  function setInfo(id){ return D.setById[id] || D.sonataSets[0]; }
  function scaler(){ return P().scaling || "atk"; }
  function primaryLabel(){ return scaler()==="hp" ? "HP" : scaler()==="def" ? "DEF" : "ATK"; }

  function slotMeta(){
    const p=P();
    const costs=p.slotCosts || [4,3,3,1,1];
    const totals=costs.reduce((o,c)=>(o[c]=(o[c]||0)+1,o),{});
    const seen={};
    const out={};
    slotKeys.forEach((key,i)=>{
      const cost=costs[i] ?? [4,3,3,1,1][i];
      seen[cost]=(seen[cost]||0)+1;
      const suffix=totals[cost]>1 ? ` ${String.fromCharCode(64+seen[cost])}` : "";
      out[key]={label:`${cost}-Cost${suffix}`,cost,index:i};
    });
    return out;
  }

  function slotCostsForBuild(build=activeBuild()){
    return build?.slotCosts || baseProfile.slotCosts || [4,3,3,1,1];
  }

  function slotCostForBuild(build,slotKey){
    const index=slotKeys.indexOf(slotKey);
    return slotCostsForBuild(build)[index] ?? [4,3,3,1,1][index];
  }

  function planKind(plan=activeBuild().setPlan){
    const composition=plan?.composition || [];
    const pieces=composition.map(x=>Number(x.pieces)).sort((a,b)=>a-b).join("+");
    if(pieces==="5") return "full";
    if(pieces==="2+3") return "split32";
    if(pieces==="1+2+2") return "split122";
    return "custom";
  }

  function rawDefaultSetConfig(build=activeBuild()){
    const plan=build.setPlan || {composition:[{set:build.bestSet,pieces:5}],slots:Object.fromEntries(slotKeys.map(k=>[k,build.bestSet]))};
    const kind=planKind(plan);
    const composition=plan.composition || [];
    if(kind==="split32"){
      return {kind,secondarySet:composition.find(x=>x.pieces===2)?.set || plan.slots?.c3b || build.bestSet,layout:"mixed"};
    }
    if(kind==="split122"){
      const pairs=composition.filter(x=>x.pieces===2);
      return {kind,setA:pairs[0]?.set || plan.slots?.c3a || build.bestSet,setB:pairs[1]?.set || plan.slots?.c3b || build.bestSet,layout:"paired"};
    }
    return {kind};
  }

  function secondarySetOptions(build=activeBuild()){
    const defaults=rawDefaultSetConfig(build);
    const fallbackIds=[defaults.secondarySet,defaults.setA,defaults.setB].filter(Boolean);
    const allowed=build.secondarySetChoices?.allowed?.length ? build.secondarySetChoices.allowed : fallbackIds;
    const allowedSet=new Set(allowed);
    return D.sonataSets.filter(set=>allowedSet.has(set.id));
  }

  function preferredSecondarySets(build=activeBuild()){
    return new Set(build.secondarySetChoices?.preferred || []);
  }

  function normalizeSetConfig(build=activeBuild(),raw={}){
    const defaults=rawDefaultSetConfig(build);
    const kind=defaults.kind;
    const options=secondarySetOptions(build).map(set=>set.id);
    const choose=(value,fallback,exclude=null)=>{
      if(value && options.includes(value) && value!==exclude) return value;
      if(fallback && options.includes(fallback) && fallback!==exclude) return fallback;
      return options.find(id=>id!==exclude) || fallback || value || null;
    };
    if(kind==="split32"){
      return {
        kind,
        secondarySet:choose(raw?.secondarySet,defaults.secondarySet),
        layout:raw?.layout==="cost-split"?"cost-split":"mixed"
      };
    }
    if(kind==="split122"){
      const setA=choose(raw?.setA,defaults.setA);
      const setB=choose(raw?.setB,defaults.setB,setA);
      return {
        kind,
        setA,
        setB,
        layout:raw?.layout==="cost-split"?"cost-split":"paired"
      };
    }
    return {kind};
  }

  function defaultSetConfig(build=activeBuild()){
    return normalizeSetConfig(build,rawDefaultSetConfig(build));
  }

  function buildSetPlan(build=activeBuild(),config=defaultSetConfig(build)){
    const original=build.setPlan || {composition:[{set:build.bestSet,pieces:5}],slots:Object.fromEntries(slotKeys.map(k=>[k,build.bestSet]))};
    const kind=planKind(original);
    const normalized=normalizeSetConfig(build,config);
    if(kind==="split32"){
      const core=original.composition?.find(x=>x.pieces===3)?.set || build.bestSet;
      const secondary=normalized.secondarySet || original.composition?.find(x=>x.pieces===2)?.set || core;
      const slots=normalized.layout==="cost-split"
        ? {c4:core,c3a:core,c3b:core,c1a:secondary,c1b:secondary}
        : {c4:core,c3a:core,c3b:secondary,c1a:core,c1b:secondary};
      return {composition:[{set:core,pieces:3},{set:secondary,pieces:2}],slots};
    }
    if(kind==="split122"){
      const one=original.composition?.find(x=>x.pieces===1)?.set || build.bestSet;
      const pairs=original.composition?.filter(x=>x.pieces===2) || [];
      const setA=normalized.setA || pairs[0]?.set || original.slots?.c3a || build.bestSet;
      const setB=normalized.setB || pairs[1]?.set || original.slots?.c3b || build.bestSet;
      const slots=normalized.layout==="cost-split"
        ? {c4:one,c3a:setA,c3b:setA,c1a:setB,c1b:setB}
        : {c4:one,c3a:setA,c3b:setB,c1a:setA,c1b:setB};
      return {composition:[{set:one,pieces:1},{set:setA,pieces:2},{set:setB,pieces:2}],slots};
    }
    return original;
  }

  function effectiveSetPlan(configOverride=null,build=activeBuild()){
    const config=configOverride || currentBuildState().buildState.setConfig || defaultSetConfig(build);
    return buildSetPlan(build,config);
  }

  function setForSlot(slotKey){
    const p=P();
    return effectiveSetPlan()?.slots?.[slotKey] || p.bestSet;
  }

  function setCounts(){
    const counts={};
    for(const key of slotKeys){
      const id=setForSlot(key);
      counts[id]=(counts[id]||0)+1;
    }
    return counts;
  }

  function setPieceLabel(slotKey){
    const id=setForSlot(slotKey);
    const count=setCounts()[id] || 1;
    return `${count}P`;
  }

  function setPlanGroups(){
    const groups=[];
    const counts=setCounts();
    for(const key of slotKeys){
      const id=setForSlot(key);
      if(groups.some(g=>g.id===id)) continue;
      groups.push({id,count:counts[id],set:setInfo(id)});
    }
    return groups;
  }

  function emptyBuildState(){
    return {
      weaponId:null,
      mainEchoId:null,
      setConfig:null,
      build:{primary:null,atk:null,cr:null,cd:null,er:null},
      echoes:{c4:null,c3a:null,c3b:null,c1a:null,c1b:null}
    };
  }

  function emptyCharacterState(){
    return {activeBuildId:baseProfile.builds[0].id,builds:{}};
  }

  function findLegacySaved(parsed, build){
    const candidates=[build.id,...(build.legacyIds||[])];
    const oldMap=parsed?.builds || parsed?.modes || null;
    if(oldMap && typeof oldMap==="object"){
      for(const id of candidates){
        if(oldMap[id]) return oldMap[id];
      }
    }
    return null;
  }

  function finiteImportedNumber(value){
    if(value===null || value===undefined || value==="") return null;
    const number=Number(value);
    return Number.isFinite(number) && number>0 ? number : null;
  }

  function sanitizeImportedBuild(raw={}){
    const source=raw&&typeof raw==="object"?raw:{};
    return {
      primary:finiteImportedNumber(source.primary),
      atk:finiteImportedNumber(source.atk),
      cr:finiteImportedNumber(source.cr),
      cd:finiteImportedNumber(source.cd),
      er:finiteImportedNumber(source.er)
    };
  }

  function sanitizeImportedEcho(raw,expectedSet,expectedCost){
    if(!raw||typeof raw!=="object") return null;
    const cost=Number(expectedCost);
    const catalog=(D.echoCatalog||[]).find(e=>
      Number(e.cost)===cost &&
      e.sets?.includes(expectedSet) &&
      (e.id===raw.echoId || e.aliases?.includes(raw.echoId) || (!raw.echoId && e.name===raw.echoName))
    );
    if(!catalog) return null;

    const main=typeof raw.main==="string"&&Object.prototype.hasOwnProperty.call(D.mains?.[cost]||{},raw.main)?raw.main:null;
    if(!main) return null;
    const rawSubs=Array.isArray(raw.subs)?raw.subs:[];
    if(rawSubs.length!==5) return null;
    const seen=new Set();
    const subs=[];
    for(const sub of rawSubs){
      const stat=typeof sub?.stat==="string"?sub.stat:"";
      const allowed=D.rolls?.[stat];
      const value=Number(sub?.value);
      if(!D.statMeta?.[stat]||!Array.isArray(allowed)||seen.has(stat)||!Number.isFinite(value)) return null;
      const canonical=allowed.find(roll=>Math.abs(Number(roll)-value)<1e-6);
      if(canonical==null) return null;
      seen.add(stat);
      subs.push({stat,value:Number(canonical)});
    }

    return {
      cost,
      set:expectedSet,
      echoId:catalog.id,
      echoName:catalog.name,
      echoIcon:catalog.icon,
      main,
      mainValue:Number(D.mains[cost][main])||0,
      secondary:{...D.secondary[cost]},
      subs
    };
  }

  function sanitizeSavedBuildState(build,saved={}){
    const setConfig=normalizeSetConfig(build,{...defaultSetConfig(build),...(saved?.setConfig||{})});
    const plan=buildSetPlan(build,setConfig);
    const echoes={...emptyBuildState().echoes};
    for(const key of slotKeys){
      const expectedSet=plan?.slots?.[key]||build.bestSet;
      const expectedCost=slotCostForBuild(build,key);
      echoes[key]=sanitizeImportedEcho(saved?.echoes?.[key],expectedSet,expectedCost);
    }
    const weaponId=typeof saved?.weaponId==="string"&&D.weaponCatalog?.[saved.weaponId]?saved.weaponId:null;
    const savedMainEcho=typeof saved?.mainEchoId==="string"
      ? (D.echoCatalog||[]).find(e=>e.id===saved.mainEchoId || e.aliases?.includes(saved.mainEchoId))
      : null;
    const mainEchoId=savedMainEcho?.id||null;
    return {weaponId,mainEchoId,setConfig,build:sanitizeImportedBuild(saved?.build),echoes};
  }

  function normalizeCharacterState(parsed){
    const state=emptyCharacterState();
    if(!parsed || typeof parsed!=="object") return state;

    for(const build of baseProfile.builds){
      const saved=findLegacySaved(parsed,build) || {};
      state.builds[build.id]=sanitizeSavedBuildState(build,saved);
    }

    if(!parsed.builds && !parsed.modes && (parsed.build || parsed.echoes)){
      const firstBuild=baseProfile.builds[0];
      state.builds[firstBuild.id]=sanitizeSavedBuildState(firstBuild,parsed);
    }

    const requested=parsed.activeBuildId || parsed.activeModeId;
    if(requested){
      const direct=baseProfile.builds.find(b=>b.id===requested);
      const legacy=baseProfile.builds.find(b=>(b.legacyIds||[]).includes(requested));
      state.activeBuildId=(direct||legacy||baseProfile.builds[0]).id;
    }
    return state;
  }

  function loadCharacterState(){
    try{
      const raw=localStorage.getItem(storageKey()) || localStorage.getItem(legacyKey());
      return normalizeCharacterState(raw?JSON.parse(raw):null);
    }catch{
      return emptyCharacterState();
    }
  }

  function ensureBuildState(state,id=buildId){
    if(!state.builds[id]) state.builds[id]=emptyBuildState();
    const build=baseProfile.builds.find(b=>b.id===id)||activeBuild();
    const buildState=state.builds[id];
    buildState.weaponId=buildState.weaponId || null;
    buildState.mainEchoId=buildState.mainEchoId || null;
    buildState.setConfig=normalizeSetConfig(build,{...defaultSetConfig(build),...(buildState.setConfig||{})});
    buildState.build={...emptyBuildState().build,...(buildState.build||{})};
    buildState.echoes={...emptyBuildState().echoes,...(buildState.echoes||{})};
    const plan=buildSetPlan(build,buildState.setConfig);
    for(const key of slotKeys){
      const echo=buildState.echoes[key];
      if(!echo) continue;
      const expectedSet=plan?.slots?.[key] || build.bestSet;
      const expectedCost=slotCostForBuild(build,key);
      if(!echo.set) echo.set=expectedSet;
      if(echo.set!==expectedSet || Number(echo.cost)!==Number(expectedCost)) buildState.echoes[key]=null;
    }
    return buildState;
  }

  function saveCharacterState(state){
    state.activeBuildId=buildId;
    try{
      localStorage.setItem(storageKey(),JSON.stringify(state));
    }catch{
    }
  }

  function currentBuildState(){
    const state=loadCharacterState();
    return {state,buildState:ensureBuildState(state)};
  }

  function syncEquipmentState(state=loadCharacterState()){
    const buildState=ensureBuildState(state);
    const recommendedWeapon=D.getRecommendedWeapon?.(baseProfile,activeBuild());
    weaponId=recommendedWeapon?.id || activeBuild().weaponId || baseProfile.defaultWeaponId || null;
    buildState.weaponId=weaponId;

    const recommendedEcho=D.getRecommendedMainEcho?.(baseProfile,activeBuild());
    mainEchoId=recommendedEcho?.id || null;
    return buildState;
  }

  function imageWithFallback(src,alt,klass,fallback){
    return `<img src="${src}" alt="${alt}" class="${klass}" width="256" height="256" loading="lazy" decoding="async" fetchpriority="low" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="${fallback}" style="display:none">${alt.slice(0,2).toUpperCase()}</span>`;
  }

function setImageSource(img,src,fallback){
  if(!img) return;

  const target=src || fallback || "";
  const token=String(Date.now())+Math.random();

  img.dataset.assetToken=token;

  if(!target){
    img.removeAttribute("src");
    return;
  }

  const apply=value=>{
    if(img.dataset.assetToken!==token || !value) return;

    img.onerror=()=>{
      if(img.dataset.assetToken!==token || !fallback || value===fallback) return;
      img.onerror=null;
      img.src=fallback;
    };

    img.src=value;
  };

  if(D.isAssetReady?.(target)){
    apply(target);
    return;
  }

  if(!D.loadAsset){
    apply(target);
    return;
  }

  D.loadAsset(target)
    .then(()=>apply(target))
    .catch(()=>{
      if(img.dataset.assetToken!==token || !fallback || target===fallback) return;

      if(D.isAssetReady?.(fallback)){
        apply(fallback);
        return;
      }

      D.loadAsset?.(fallback)
        ?.then(()=>apply(fallback))
        .catch(()=>{});
    });
}

function preloadSources(sources){
  const unique=[...new Set((sources||[]).filter(Boolean))];

  if(!D.loadAsset || !unique.length){
    return Promise.resolve();
  }

  return Promise.allSettled(
    unique.map(src=>D.loadAsset(src))
  );
}

function profileAssetSources(profile){
  if(!profile) return [];

  const sources=[];

  for(const build of profile.builds||[]){
    const setIds=new Set([
      build.bestSet,
      ...Object.values(build.setPlan?.slots||{}),
      ...(build.secondarySetChoices?.allowed||[])
    ].filter(Boolean));

    for(const setId of setIds){
      const set=D.setById?.[setId];
      if(set?.icon) sources.push(set.icon);
    }

    const weapon=D.getRecommendedWeapon?.(profile,build);
    const echo=D.getRecommendedMainEcho?.(profile,build);

    if(weapon?.icon) sources.push(weapon.icon);
    if(echo?.icon) sources.push(echo.icon);
  }

  return sources;
}

function warmProfileAssets(profile){
  return preloadSources(profileAssetSources(profile));
}

function preloadEchoOptionsForSlot(slotKey=$("slot")?.value){
  if(!slotKey) return Promise.resolve();

  const meta=slotMeta()[slotKey];
  if(!meta) return Promise.resolve();

  const set=setInfo(setForSlot(slotKey));
  const echoes=D.getEchoOptions?.(set.id,meta.cost)||[];

  return preloadSources([
    set.icon,
    ...echoes.map(echo=>echo.icon)
  ]);
}

  function renderFilters(){
    const attrs=["All","Aero","Glacio","Fusion","Electro","Spectro","Havoc"];
    $("attributeFilters").innerHTML=attrs.map(a=>{
      const label=a==="All"?"All attributes":a;
      const icon=a==="All"?"":`<img src="assets/attributes/${a.toLowerCase()}.webp" alt="">`;
      const content=a==="All"?'<span>ALL</span>':icon;
      return `<button class="filter-btn attribute-filter ${filters.attribute===a?"active":""}" data-attribute="${a}" title="${label}" aria-label="${label}">${content}</button>`;
    }).join("");

    $("rarityFilters").innerHTML=["All","4","5"].map(r=>{
      const label=r==="All"?"All stars":`${r}-stars`;
      return `<button class="filter-btn rarity-filter ${filters.rarity===r?"active":""}" data-rarity="${r}" title="${label}" aria-label="${label}"><span class="stars">${r==="All"?"ALL":`${r}★`}</span></button>`;
    }).join("");

    const weapons=["All","sword","broadblade","pistols","gauntlets","rectifier"];
    $("weaponFilters").innerHTML=weapons.map(w=>{
      const label=w==="All"?"All weapons":weaponLabels[w];
      const content = w==="All"
        ? `<span>ALL</span>`
        : `<img src="assets/weapons/${w}.webp" alt="">`;
      return `<button class="filter-btn weapon ${filters.weapon===w?"active":""}" data-weapon="${w}" title="${label}" aria-label="${label}">${content}</button>`;
    }).join("");

    const roles=["All","DPS","Hybrid","Support"];
    const roleLabels={All:"All roles",DPS:"DPS",Hybrid:"Hybrid",Support:"Support"};
    const roleIcons={DPS:"dps",Hybrid:"hybrid",Support:"support"};
    $("roleFilters").innerHTML=roles.map(role=>{
      const label=roleLabels[role];
      const content=role==="All"?"<span>ALL</span>":`<img src="assets/roles/${roleIcons[role]}.webp" alt="">`;
      return `<button class="filter-btn role ${filters.role===role?"active":""}" data-role="${role}" title="${label}" aria-label="${label}">${content}</button>`;
    }).join("");

    [...document.querySelectorAll("[data-attribute]")].forEach(b=>b.addEventListener("click",()=>{filters.attribute=b.dataset.attribute;renderFilters();renderRoster();}));
    [...document.querySelectorAll("[data-rarity]")].forEach(b=>b.addEventListener("click",()=>{filters.rarity=b.dataset.rarity;renderFilters();renderRoster();}));
    [...document.querySelectorAll("[data-weapon]")].forEach(b=>b.addEventListener("click",()=>{filters.weapon=b.dataset.weapon;renderFilters();renderRoster();}));
    [...document.querySelectorAll("[data-role]")].forEach(b=>b.addEventListener("click",()=>{filters.role=b.dataset.role;renderFilters();renderRoster();}));
  }

  function filteredProfiles(){
    return D.profiles.filter(p=>
      (filters.attribute==="All"||p.attribute===filters.attribute) &&
      (filters.rarity==="All"||String(p.rarity)===filters.rarity) &&
      (filters.weapon==="All"||p.weaponType===filters.weapon) &&
      (filters.role==="All"||(p.roles||[p.role]).includes(filters.role))
    ).sort((a,b)=>
      (a.releaseOrder ?? 9999) - (b.releaseOrder ?? 9999) ||
      a.name.localeCompare(b.name)
    );
  }

  function rosterMetrics(){
    return {targetCard:114,gap:8,pad:9,overlay:68,side:17};
  }

  function updateRosterLayout(itemCount=filteredProfiles().length){
    const panel=document.querySelector(".roster-panel"),wrap=document.querySelector(".roster-wrap"),grid=$("roster"),shell=document.querySelector(".shell");
    if(!panel||!wrap||!grid||!shell) return;

    const m=rosterMetrics();
    const viewport=Math.max(320,window.innerWidth||document.documentElement.clientWidth||320);
    const available=Math.max(280,viewport-(m.side*2));
    const outerBorder=2;
    const gutter=12;
    const targetWidthFor=cols=>cols*m.targetCard+((cols-1)*m.gap)+(m.pad*2)+outerBorder+gutter;

    let cols=13;
    while(cols>3 && targetWidthFor(cols)>available) cols--;

    let card=m.targetCard;
    const widthAtTarget=targetWidthFor(cols);
    if(widthAtTarget>available){
      card=Math.floor((available-outerBorder-gutter-(m.pad*2)-((cols-1)*m.gap))/cols);
    }
    card=Math.max(68,card);

    const shellWidth=cols*card+((cols-1)*m.gap)+(m.pad*2)+outerBorder+gutter;
    const visibleRows=itemCount>cols?2:1;
    const totalRows=Math.max(1,Math.ceil(Math.max(1,itemCount)/cols));
    const needsScroll=totalRows>visibleRows;
    const mode=cols>=10?"wide":cols>=6?"mid":"narrow";
    const overlay=m.overlay;
    const cardHeight=card+overlay;
    const wrapHeight=Math.max(cardHeight,(visibleRows*cardHeight)+((visibleRows-1)*m.gap)+(m.pad*2)+2);

    shell.style.setProperty("--app-shell-width",`${shellWidth}px`);
    shell.style.setProperty("--app-shell-side",`${m.side}px`);
    panel.style.setProperty("--roster-cols",String(cols));
    panel.style.setProperty("--roster-card",`${card}px`);
    panel.style.setProperty("--roster-gap",`${m.gap}px`);
    panel.style.setProperty("--roster-pad",`${m.pad}px`);
    panel.style.setProperty("--roster-overlay",`${overlay}px`);
    panel.style.setProperty("--roster-scale","1");
    panel.style.setProperty("--roster-name-size",mode==="narrow"?"11px":"12px");
    panel.style.setProperty("--roster-icon-size",mode==="narrow"?"15px":"17px");
    panel.style.setProperty("--roster-meta-size",mode==="narrow"?"9.5px":"10px");
    panel.style.setProperty("--roster-overlay-pad-y",mode==="narrow"?"8px":"10px");
    panel.style.setProperty("--roster-overlay-pad-x",mode==="narrow"?"7px":"9px");
    panel.style.setProperty("--roster-content-gap",mode==="narrow"?"6px":"8px");
    panel.style.setProperty("--roster-icon-gap",mode==="narrow"?"4px":"6px");
    panel.style.setProperty("--roster-height",`${wrapHeight}px`);
    panel.style.setProperty("--roster-gutter",`${gutter}px`);
    panel.classList.toggle("roster-scrolls",needsScroll);
    document.body.classList.toggle("roster-wide",cols>=10);
    document.body.classList.toggle("roster-mid",cols>=6&&cols<=9);
    document.body.classList.toggle("roster-narrow",cols<=5);
    document.body.dataset.rosterCols=String(cols);
  }

  function renderRoster(){
    const list=filteredProfiles();
    $("roster").classList.toggle("is-empty",list.length===0);
    $("roster").innerHTML=list.length ? list.map(p=>`
      <button class="res-card rarity-${p.rarity} ${p.id===baseProfile.id?"active":""}" data-id="${p.id}" aria-pressed="${p.id===baseProfile.id}" title="${p.name} · ${(p.roles||[p.role]).join(" / ")}" style="--attr:${D.attributeColors[p.attribute]}">
        <span class="avatar-stage">
          ${imageWithFallback(p.avatar,p.name,"res-avatar","res-fallback")}
          <span class="selection-trace left"></span>
          <span class="selection-trace right"></span>
          <span class="avatar-ripple"></span>
        </span>
        ${p.provisional?'<span class="pre-mark">PRE</span>':""}
        <span class="res-overlay">
          <span class="res-name">${p.name}</span>
          <span class="res-icons">
            <img src="${p.attributeIcon}" alt="${p.attribute}" title="${p.attribute}">
            <img src="${p.weaponIcon}" alt="${weaponLabels[p.weaponType]}" title="${weaponLabels[p.weaponType]}">
            <span class="rarity">${p.rarity}★</span>
          </span>
        </span>
      </button>`).join("") : `
      <div class="roster-empty">
        <strong>NO RESONATORS</strong>
        <span>Change one of the filters above.</span>
      </div>`;

    [...$("roster").querySelectorAll(".res-card")].forEach(card=>{
  const warm=()=>{
    const profile=D.profiles.find(p=>p.id===card.dataset.id);
    warmProfileAssets(profile);
  };

  card.addEventListener("pointerenter",warm,{once:true});
  card.addEventListener("pointerdown",warm,{once:true});
  card.addEventListener("focus",warm,{once:true});

  card.addEventListener("click",()=>{
    requestCharacterSelection(card.dataset.id);
  });
});
    requestAnimationFrame(()=>updateRosterLayout(list.length));
  }

  async function requestCharacterSelection(id){
  const token=++profileSelectionToken;

  if(id===baseProfile.id) return;

  const next=D.profiles.find(p=>p.id===id);
  if(!next) return;

  const active=$("roster").querySelector(".res-card.active");
  const target=$("roster").querySelector(`.res-card[data-id="${id}"]`);

  if(active){
    active.classList.remove("active","selecting");
    active.classList.add("leaving");
    active.setAttribute("aria-pressed","false");

    window.setTimeout(
      ()=>active.classList.remove("leaving"),
      240
    );
  }

  target?.classList.remove("leaving");
  target?.classList.add("active","selecting");
  target?.setAttribute("aria-pressed","true");

  await warmProfileAssets(next);

  if(token!==profileSelectionToken) return;

  selectCharacter(id);

  window.setTimeout(
    ()=>target?.classList.remove("selecting"),
    620
  );
}

  function triggerProfileSwap(){
    const panel=document.querySelector(".profile-panel");
    if(!panel) return;
    panel.classList.remove("swap-flash");
    void panel.offsetWidth;
    panel.classList.add("swap-flash");
    setTimeout(()=>panel.classList.remove("swap-flash"),520);
  }

  function selectCharacter(id){
    const next=D.profiles.find(p=>p.id===id);
    if(!next) return;
    baseProfile=next;
    try{localStorage.setItem(activeProfileStorageKey,baseProfile.id);}catch{}
    const state=loadCharacterState();
    buildId=baseProfile.builds.some(b=>b.id===state.activeBuildId) ? state.activeBuildId : baseProfile.builds[0].id;
    syncEquipmentState(state);
    renderProfile();
    renderSlotOptions();
    loadSavedBuild();
    $("slot").value=slotKeys[0];
    loadSelectedSlot();
  }

  function renderBuildSwitch(){
    const builds=baseProfile.builds;
    const root=$("buildSwitch");
    root.className=`build-switch count-${builds.length}`;
    root.innerHTML=builds.map(b=>{
      const set=setInfo(b.bestSet);
      return `<button class="build-btn ${b.id===buildId?"active":""}" data-build="${b.id}" title="${set.name}" aria-label="${set.name}"><img src="${set.icon}" alt=""><span>${set.name}</span></button>`;
    }).join("");
    [...root.querySelectorAll(".build-btn")].forEach(b=>b.addEventListener("click",()=>switchBuild(b.dataset.build)));
  }

  function switchBuild(id){
    if(id===buildId || !baseProfile.builds.some(b=>b.id===id)) return;
    buildId=id;
    const state=loadCharacterState();
    state.activeBuildId=id;
    ensureBuildState(state,id);
    syncEquipmentState(state);
    saveCharacterState(state);
    renderProfile();
    renderSlotOptions();
    loadSavedBuild();
    $("slot").value=slotKeys[0];
    loadSelectedSlot();
  }

  function selectedWeaponData(){
    return D.weaponCatalog?.[weaponId] || D.getWeaponOptions?.(baseProfile,activeBuild())?.[0] || null;
  }

  function recommendedMainEchoData(){
    return D.getRecommendedMainEcho?.(baseProfile,activeBuild()) || null;
  }

  function recommendedMainEchoSlotKey(){
    const recommended=recommendedMainEchoData();
    if(!recommended) return null;
    const meta=slotMeta();
    return slotKeys.find(key=>meta[key]?.cost===recommended.cost && setForSlot(key)===recommended.setId) || null;
  }

  function renderEquipment(){
    const build=activeBuild();
    const recommendedWeapon=D.getRecommendedWeapon?.(baseProfile,build) || selectedWeaponData();
    const recommendedEcho=recommendedMainEchoData();
    weaponId=recommendedWeapon?.id || baseProfile.defaultWeaponId || null;

    const weaponName=recommendedWeapon?.name || "—";
    $("recommendedWeaponName").textContent=weaponName;
    $("recommendedWeaponIcon").alt=recommendedWeapon?.name || "Recommended weapon";
    document.querySelector(".weapon-recommendation-card")?.classList.remove("ultra-long-name");
    setImageSource($("recommendedWeaponIcon"),recommendedWeapon?.icon,baseProfile.weaponIcon);

    const echoSet=recommendedEcho?.setId ? setInfo(recommendedEcho.setId) : setInfo(build.bestSet);
    const echoName=recommendedEcho?.name || "—";
    $("recommendedEchoName").textContent=echoName;
    $("recommendedEchoIcon").alt=recommendedEcho?.name || "Recommended Main Echo";
    document.querySelector(".echo-recommendation-card")?.classList.remove("ultra-long-name");
    document.querySelector(".echo-recommendation-card")?.classList.toggle("adam-smasher-name",/Adam Smasher/i.test(echoName));
    setImageSource($("recommendedEchoIcon"),recommendedEcho?.icon,echoSet.icon);
  }

  function renderProfile(){
    const color=attrColor();
    $("selectedAvatarWrap").style.setProperty("--attr",color);
    document.querySelector(".profile-panel")?.style.setProperty("--swap-attr",color);
    $("selectedAvatar").alt=baseProfile.name;
    setImageSource($("selectedAvatar"),baseProfile.avatar,baseProfile.avatar);
    $("selectedAvatar").style.display="block";
    $("selectedFallback").style.display="none";
    $("selectedFallback").textContent=baseProfile.initials;
    $("selectedAvatar").onerror=()=>{$("selectedAvatar").style.display="none";$("selectedFallback").style.display="grid";};
    $("selectedName").textContent=baseProfile.name + (baseProfile.provisional?" · PRE":"");
    $("rarityBadge").textContent=`${baseProfile.rarity}★`;
    $("selectedAttributeIcon").src=baseProfile.attributeIcon;
    $("selectedAttribute").textContent=baseProfile.attribute;
    $("selectedWeaponIcon").src=baseProfile.weaponIcon;
    $("selectedWeapon").textContent=weaponLabels[baseProfile.weaponType];

    renderBuildSwitch();
    renderEquipment();
    const p=P();

    $("rec4").textContent=p.rec.four;
    $("rec3").textContent=p.rec.threeDisplay || `${p.rec.three[0]} + ${p.rec.three[1]}`;
    $("rec1").textContent=p.rec.oneDisplay || `${p.rec.one} + ${p.rec.one}`;
    $("recEr").textContent=Number(p.erMin)>100?`≥ ${p.erMin}%`:"NO EXTRA ER";
    $("recSubs").textContent=p.rec.priority.join(" > ");
    $("primaryLabel").textContent=primaryLabel();
    $("loadoutBuildName").textContent=activeBuild().name.toUpperCase();
    renderSetControls();
  }

  function renderSlotOptions(){
    const meta=slotMeta();
    const current=$("slot").value;
    $("slot").innerHTML=slotKeys.map(key=>`<option value="${key}">${meta[key].label}</option>`).join("");
    $("slot").value=meta[current] ? current : slotKeys[0];
  }

  function twoPieceSetOptions(build=activeBuild()){
    return secondarySetOptions(build);
  }

  function setSelectOptions(selected,exclude=null,build=activeBuild()){
    const preferred=preferredSecondarySets(build);
    return twoPieceSetOptions(build).map(set=>{
      const mark=preferred.has(set.id)?"★ ":"";
      return `<option value="${set.id}" ${set.id===selected?"selected":""} ${set.id===exclude?"disabled":""}>${mark}${set.name}</option>`;
    }).join("");
  }

  function changedSavedSlots(buildState,oldPlan,newPlan){
    return slotKeys.filter(key=>buildState.echoes?.[key] && oldPlan?.slots?.[key]!==newPlan?.slots?.[key]);
  }

  function setChangeWarning(slots,oldPlan,newPlan){
    const meta=slotMeta();
    const details=slots.map(key=>{
      const from=setInfo(oldPlan.slots[key]).name;
      const to=setInfo(newPlan.slots[key]).name;
      return `${meta[key].label}: ${from} → ${to}`;
    }).join("\n");
    return `This Sonata change makes saved Echoes incompatible with their new slots:\n\n${details}\n\nContinue and clear those saved Echoes?`;
  }

  function commitSetConfig(patch){
    const {state,buildState}=currentBuildState();
    const build=activeBuild();
    const oldConfig=normalizeSetConfig(build,buildState.setConfig||defaultSetConfig(build));
    const nextConfig=normalizeSetConfig(build,{...oldConfig,...patch});
    const oldPlan=buildSetPlan(build,oldConfig);
    const nextPlan=buildSetPlan(build,nextConfig);
    const incompatible=changedSavedSlots(buildState,oldPlan,nextPlan);
    if(incompatible.length && !window.confirm(setChangeWarning(incompatible,oldPlan,nextPlan))){
      renderSetControls();
      return false;
    }
    incompatible.forEach(key=>{ buildState.echoes[key]=null; });
    buildState.setConfig=nextConfig;
    saveCharacterState(state);
    renderSetControls();
    renderLoadout();
    loadSelectedSlot();
    return true;
  }

  function renderSetControls(){
    const root=$("setControls");
    if(!root) return;
    const build=activeBuild();
    const original=build.setPlan;
    const kind=planKind(original);
    const {buildState}=currentBuildState();
    const cfg=normalizeSetConfig(build,buildState.setConfig||defaultSetConfig(build));
    root.className="set-controls";
    document.querySelector(".loadout-panel")?.classList.toggle("set-controls-empty",kind!=="split32"&&kind!=="split122");
    if(kind==="split32"){
      const core=original.composition?.find(x=>x.pieces===3)?.set || build.bestSet;
      root.classList.add("count-2");
      root.innerHTML=`
        <label><span>2P SET</span><select aria-label="Secondary 2-piece Sonata" data-set-control="secondarySet">${setSelectOptions(cfg.secondarySet,core,build)}</select></label>
        <label><span>SLOT LAYOUT</span><select aria-label="3-cost and 1-cost distribution" data-set-control="layout">
          <option value="mixed" ${cfg.layout!=="cost-split"?"selected":""}>MIXED 3C / 1C</option>
          <option value="cost-split" ${cfg.layout==="cost-split"?"selected":""}>2P = 1C + 1C</option>
        </select></label>`;
    }else if(kind==="split122"){
      root.classList.add("count-3");
      root.innerHTML=`
        <label><span>2P SET A</span><select aria-label="First 2-piece Sonata" data-set-control="setA">${setSelectOptions(cfg.setA,cfg.setB,build)}</select></label>
        <label><span>2P SET B</span><select aria-label="Second 2-piece Sonata" data-set-control="setB">${setSelectOptions(cfg.setB,cfg.setA,build)}</select></label>
        <label><span>SLOT LAYOUT</span><select aria-label="3-cost and 1-cost distribution" data-set-control="layout">
          <option value="paired" ${cfg.layout!=="cost-split"?"selected":""}>PAIRED 3C + 1C</option>
          <option value="cost-split" ${cfg.layout==="cost-split"?"selected":""}>3C SET / 1C SET</option>
        </select></label>`;
    }else{
      root.classList.add("is-empty");
      root.innerHTML="";
    }
    root.querySelectorAll("[data-set-control]").forEach(control=>control.addEventListener("change",()=>{
      commitSetConfig({[control.dataset.setControl]:control.value});
    }));
  }

  function mainOptions(cost,selected){
    const p=P();
    return Object.entries(D.mains[cost]).map(([k])=>{
      const label=k==="attributeDmg"?`${p.attribute} DMG`:k==="healingBonus"?"Healing Bonus":(D.statMeta[k]?.label||k);
      return `<option value="${k}" ${k===selected?"selected":""}>${label}</option>`;
    }).join("");
  }

  function subOptions(selected=""){
    return allSubstats.map(k=>`<option value="${k}" ${k===selected?"selected":""}>${D.statMeta[k].label}</option>`).join("");
  }

  function rollOptions(stat,selected=""){
    const values=D.rolls[stat] || [];
    return values.map(v=>`<option value="${v}" ${String(v)===String(selected)?"selected":""}>${v}${pctStats.has(stat)?"%":""}</option>`).join("");
  }

  function defaultMain(cost,slotKey=$("slot").value){
    const p=P();
    const meta=slotMeta();
    const idx=meta[slotKey]?.index ?? 0;
    const slotMain=p.slotMains?.[idx];
    if(slotMain && D.mains[cost]?.[slotMain]!==undefined) return slotMain;
    if(cost===4) return p.rec.fourKey;
    if(cost===3){
      const slot3Index=Object.values(meta).filter(m=>m.cost===3 && m.index<=idx).length-1;
      const preferred=p.rec.threeKeys?.[Math.max(0,slot3Index)] || p.rec.threeKeys?.[0];
      if(preferred && D.mains[cost]?.[preferred]!==undefined) return preferred;
      return p.rec.threeKeys?.[0] || "attributeDmg";
    }
    return scaler()==="hp" ? "hpPct" : scaler()==="def" ? "defPct" : "atkPct";
  }

  function defaultSubs(){
    const p=P();
    const scalePct=scaler()==="hp"?"hpPct":scaler()==="def"?"defPct":"atkPct";
    const wanted=["critRate","critDmg",scalePct,"energyRegen",p.rec.preferredSub];
    const out=[];
    for(const s of wanted) if(s&&!out.includes(s)) out.push(s);
    for(const s of allSubstats){ if(out.length>=5) break; if(!out.includes(s)) out.push(s); }
    return out.slice(0,5);
  }

  function defaultRoll(stat,index){
    const a=D.rolls[stat] || [0];
    return a[Math.min(a.length-1,Math.max(0,4+(index%2)))];
  }

  function echoOptionsForSlot(slotKey,cost){
    const options=D.getEchoOptions?.(setForSlot(slotKey),cost) || [];
    const recommended=recommendedMainEchoData();
    if(!recommended || slotKey!==recommendedMainEchoSlotKey()) return options;
    return [...options].sort((a,b)=>Number(b.id===recommended.id)-Number(a.id===recommended.id));
  }

  function defaultEchoIdentity(slotKey,cost,sourceEcho=null){
    const options=echoOptionsForSlot(slotKey,cost);
    if(sourceEcho?.echoId && options.some(e=>e.id===sourceEcho.echoId)) return sourceEcho.echoId;
    const recommended=recommendedMainEchoData();
    if(recommended && slotKey===recommendedMainEchoSlotKey() && options.some(e=>e.id===recommended.id)) return recommended.id;
    const idx=Math.max(0,slotKeys.indexOf(slotKey));
    return options[idx%Math.max(1,options.length)]?.id || null;
  }

  function renderEcho(id,label,costOverride=null,sourceEcho=null){
    const root=$(id);
    const slotKey=$("slot").value;
    const meta=slotMeta();
    const cost=costOverride ?? meta[slotKey].cost;
    const main=sourceEcho?.main ?? defaultMain(cost,slotKey);
    const set=setInfo(setForSlot(slotKey));
    const piece=setPieceLabel(slotKey);
    const subs=sourceEcho?.subs?.length===5 ? sourceEcho.subs : defaultSubs().map((s,i)=>({stat:s,value:defaultRoll(s,i)}));
    const echoOptions=echoOptionsForSlot(slotKey,cost);
    const echoId=defaultEchoIdentity(slotKey,cost,sourceEcho);
    const echoData=D.getEchoById?.(echoId,set.id,cost) || echoOptions.find(e=>e.id===echoId) || echoOptions[0] || {id:"",name:"Echo artwork not installed",icon:""};
    const recommended=recommendedMainEchoData();
    const recommendedSlot=Boolean(recommended && slotKey===recommendedMainEchoSlotKey());
    const recommendedSelected=Boolean(recommendedSlot && echoData.id===recommended.id);

    root.innerHTML=`
      <div class="echo-head">
        <h2>${label}</h2>
        <div class="tag">${id==="echoA"?"CURRENT SLOT":"CANDIDATE"}</div>
      </div>
      <div class="echo-set-locked">
        <img src="${set.icon}" alt="${set.name}">
        <div class="locked-set-copy"><span>LOCKED BY PRESET · ${piece}</span><strong>${set.name}</strong></div>
        <div class="sonata-state" data-sonata-state>CHECKING SET</div>
      </div>
      <div class="echo-identity-row ${recommendedSelected?"recommended-selected":""}">
        <span class="echo-identity-frame"><img class="echo-identity-icon" src="${set.icon}" alt="${echoData.name}"></span>
        <label><span class="echo-select-title">Echo</span><select class="echoIdentity" ${echoOptions.length?"":"disabled"}>${echoOptions.length?echoOptions.map(e=>`<option value="${e.id}" ${e.id===echoData.id?"selected":""}>${recommendedSlot&&e.id===recommended.id?"★ ":""}${e.name}</option>`).join(""):`<option value="">Echo artwork not installed</option>`}</select></label>
      </div>
      <div class="echo-main">
        <label>Cost<select class="cost" disabled><option value="${cost}">${cost}-Cost</option></select></label>
        <label>Main stat<select class="main">${mainOptions(cost,main)}</select></label>
      </div>
      <div class="echo-secondary">+25 · ${D.secondary[cost].label}</div>
      <div class="subs">
        ${subs.map((s,i)=>`<div class="sub"><select class="subStat" data-i="${i}">${subOptions(s.stat)}</select><select class="subValue" data-i="${i}">${rollOptions(s.stat,s.value)}</select></div>`).join("")}
      </div>`;

    const identity=root.querySelector(".echoIdentity");
    identity?.addEventListener("change",()=>{
      const selected=D.getEchoById?.(identity.value,set.id,cost) || echoOptions.find(e=>e.id===identity.value);
      const img=root.querySelector(".echo-identity-icon");
      img.alt=selected?.name || "Echo";
      setImageSource(img,selected?.icon,set.icon);
      const row=root.querySelector(".echo-identity-row");
      row?.classList.toggle("recommended-selected",Boolean(recommendedSlot && selected?.id===recommended?.id));
      compare();
    });
    const identityImg=root.querySelector(".echo-identity-icon");
    setImageSource(identityImg,echoData.icon,set.icon);
    root.querySelector(".main").addEventListener("change",compare);
    [...root.querySelectorAll(".subStat")].forEach((el,i)=>el.addEventListener("change",()=>{
      const val=root.querySelector(`.subValue[data-i="${i}"]`);
      val.innerHTML=rollOptions(el.value);
      refreshSubstatLocks(root);
      compare();
    }));
    [...root.querySelectorAll(".subValue")].forEach(el=>el.addEventListener("change",compare));
    refreshSubstatLocks(root);
  }

  function refreshSubstatLocks(root){
    const selects=[...root.querySelectorAll(".subStat")];
    const selected=selects.map(x=>x.value);
    selects.forEach((select,idx)=>{
      [...select.options].forEach(opt=>{ opt.disabled=selected.some((v,j)=>j!==idx&&v===opt.value); });
    });
  }

  function readEcho(id){
    const root=$(id),cost=Number(root.querySelector(".cost").value);
    const set=setForSlot($("slot").value);
    const echoId=root.querySelector(".echoIdentity")?.value || `unassigned-${baseProfile.id}-${buildId}-${$("slot").value}-${id}`;
    const echoData=D.getEchoById?.(echoId,set,cost);
    return {
      cost,
      set,
      echoId,
      echoName:echoData?.name || root.querySelector(".echoIdentity")?.selectedOptions?.[0]?.textContent || "Unassigned Echo",
      echoIcon:echoData?.icon || setInfo(set).icon,
      main:root.querySelector(".main").value,
      mainValue:D.mains[cost][root.querySelector(".main").value]??0,
      secondary:D.secondary[cost],
      subs:[...root.querySelectorAll(".subStat")].map((el,i)=>({stat:el.value,value:Number(root.querySelector(`.subValue[data-i="${i}"]`).value)||0}))
    };
  }

  function validateEcho(e){
    const keys=e.subs.map(s=>s.stat);
    return keys.length===5 && new Set(keys).size===5;
  }

  function agg(e){
    const out={};
    const add=(k,v)=>{if(k)out[k]=(out[k]||0)+v};
    add(e.main,e.mainValue);add(e.secondary.stat,e.secondary.value);e.subs.forEach(s=>add(s.stat,s.value));
    return out;
  }

  function universalStatFloor(){
    const p=P();
    const scaling=scaler();
    const primary=scaling==="hp"
      ? Number(p.baseHp)||1
      : scaling==="def"
        ? Number(p.baseDef)||1
        : Number(p.charBaseAtk)||1;
    return {
      primary:Math.max(1,primary),
      cr:5,
      cd:150,
      er:100
    };
  }

  function recommendedMainKeys(){
    const p=P();
    const costs=slotCostsForBuild();
    const scalePct=scaler()==="hp"?"hpPct":scaler()==="def"?"defPct":"atkPct";
    let threeIndex=0;
    return costs.map((cost,index)=>{
      const fixed=p.slotMains?.[index];
      if(fixed && D.mains[cost]?.[fixed]!==undefined) return fixed;
      if(cost===4) return p.rec.fourKey;
      if(cost===3) return p.rec.threeKeys?.[threeIndex++] || "attributeDmg";
      return scalePct;
    });
  }

  function computedPrimaryTarget(minimum,mains){
    const p=P();
    const costs=slotCostsForBuild();
    const scaling=scaler();
    const scalePct=scaling==="hp"?"hpPct":scaling==="def"?"defPct":"atkPct";
    const flat=scaling==="hp"?"flatHp":scaling==="def"?"flatDef":"flatAtk";
    const weapon=selectedWeaponData();
    const charBase=scaling==="hp"
      ? Number(p.baseHp)||0
      : scaling==="def"
        ? Number(p.baseDef)||0
        : Number(p.charBaseAtk)||0;
    const base=scaling==="atk"?charBase+(Number(weapon?.baseAtk)||0):charBase;
    let target=base||minimum;
    costs.forEach((cost,index)=>{
      const main=mains[index];
      if(main===scalePct) target+=base*((Number(D.mains[cost]?.[main])||0)/100);
      const secondary=D.secondary[cost];
      if(secondary?.stat===flat) target+=Number(secondary.value)||0;
    });
    if(weapon?.secondary?.stat===scalePct) target+=base*((Number(weapon.secondary.value)||0)/100);
    const rolls=D.rolls[scalePct]||[];
    const representative=Number(rolls[Math.min(3,Math.max(0,rolls.length-1))])||0;
    target+=base*((representative*3)/100);
    const step=scaling==="hp"?500:50;
    return Math.max(minimum,Math.round(target/step)*step);
  }

  function practicalStatTargets(){
    const p=P();
    const minimum=universalStatFloor();
    const mains=recommendedMainKeys();
    const costs=slotCostsForBuild();
    const quality=p.quality||{};
    let mainCr=0,mainCd=0;
    costs.forEach((cost,index)=>{
      const key=mains[index];
      if(key==="critRate") mainCr+=Number(D.mains[cost]?.critRate)||0;
      if(key==="critDmg") mainCd+=Number(D.mains[cost]?.critDmg)||0;
    });
    const weapon=selectedWeaponData();
    const weaponCr=weapon?.secondary?.stat==="critRate"?(Number(weapon.secondary.value)||0):0;
    const weaponCd=weapon?.secondary?.stat==="critDmg"?(Number(weapon.secondary.value)||0):0;
    const crRoll=Number(D.rolls.critRate?.[3])||8.1;
    const cdRoll=Number(D.rolls.critDmg?.[3])||16.2;
    const fallbackPrimary=Number.isFinite(Number(p.defaultPrimary))
      ? Number(p.defaultPrimary)
      : computedPrimaryTarget(minimum.primary,mains);
    const fallbackCr=Math.min(100,Math.max(50,Math.round((minimum.cr+weaponCr+mainCr+(4*crRoll))/5)*5));
    const fallbackCd=Math.max(200,Math.round((minimum.cd+weaponCd+mainCd+(4*cdRoll))/5)*5);
    return {
      primary:Number.isFinite(Number(quality.primary))?Number(quality.primary):fallbackPrimary,
      cr:Number.isFinite(Number(quality.cr))?Number(quality.cr):fallbackCr,
      cd:Number.isFinite(Number(quality.cd))?Number(quality.cd):fallbackCd,
      er:Number.isFinite(Number(quality.er))?Number(quality.er):(Number(p.erMin)||100)
    };
  }

  function qualityTargets(){
    return practicalStatTargets();
  }

  function recommendedBuildDefaults(){
    const minimum=universalStatFloor();
    const target=practicalStatTargets();
    return {
      primary:Number.isFinite(target.primary)?target.primary:minimum.primary,
      cr:Number.isFinite(target.cr)?target.cr:minimum.cr,
      cd:Number.isFinite(target.cd)?target.cd:minimum.cd,
      er:Number.isFinite(target.er)?target.er:minimum.er
    };
  }

  function applyBuildInputBounds(clampValues=false){
    const minimum=universalStatFloor();
    const recommended=recommendedBuildDefaults();
    const config={atk:[minimum.primary,recommended.primary,0],cr:[minimum.cr,recommended.cr,1],cd:[minimum.cd,recommended.cd,1],er:[minimum.er,recommended.er,1]};
    Object.entries(config).forEach(([id,[value,target,digits]])=>{
      const input=$(id);
      if(!input) return;
      const factor=10**digits;
      const rounded=Math.ceil(value*factor-1e-9)/factor;
      const targetRounded=Math.round(target*factor)/factor;
      input.min=String(rounded);
      input.dataset.minimum=String(rounded);
      input.dataset.recommended=String(targetRounded);
      input.removeAttribute("title");
      if(clampValues && Number(input.value)<rounded) input.value=String(rounded);
    });
  }

  function clampBuildInput(input){
    const minimum=Number(input?.dataset?.minimum);
    if(!input||!Number.isFinite(minimum)) return;
    if(!Number.isFinite(Number(input.value))||Number(input.value)<minimum) input.value=String(minimum);
  }

  function currentBuild(){
    const minimum=universalStatFloor();
    return {
      primary:Math.max(minimum.primary,n("atk")),
      cr:Math.max(minimum.cr,n("cr")),
      cd:Math.max(minimum.cd,n("cd")),
      er:Math.max(minimum.er,n("er"))
    };
  }

  function candidateBuild(cur,a,b){
    const candidate=M.candidateBuild(P(),cur,a,b);
    const minimum=universalStatFloor();
    return {
      primary:Math.max(minimum.primary,candidate.primary),
      cr:Math.max(minimum.cr,candidate.cr),
      cd:Math.max(minimum.cd,candidate.cd),
      er:Math.max(minimum.er,candidate.er)
    };
  }

  function comparisonLoadout(candidateEcho){
    const {buildState}=currentBuildState();
    const selectedSlot=$("slot").value;
    return slotKeys.map(key=>{
      if(key===selectedSlot) return {...candidateEcho,set:setForSlot(key)};
      const saved=buildState.echoes?.[key];
      return {
        ...(saved || {}),
        set:setForSlot(key),
        echoId:saved?.echoId || `assumed-${baseProfile.id}-${buildId}-${key}`,
        echoName:saved?.echoName || "Preset-assumed unique Echo"
      };
    });
  }

  function updateSonataBadge(rootId,loadout){
    const badge=$(rootId)?.querySelector("[data-sonata-state]");
    if(!badge) return;
    const groups=M.uniqueSonataComposition?.(P(),loadout) || [];
    const hasDuplicate=groups.some(g=>g.pieces>g.unique);
    badge.classList.toggle("invalid",hasDuplicate);
    badge.classList.toggle("valid",!hasDuplicate);
    const labels=groups.map(g=>hasDuplicate && g.pieces>g.unique
      ? `${g.unique}/${g.pieces} UNIQUE`
      : `${g.unique}P ACTIVE`);
    badge.innerHTML=(labels.length?labels:["NO SET"]).map(label=>`<span>${label}</span>`).join("");
  }

  function expectedDamageRatio(cur,cand,a,b,loadoutA,loadoutB){
    return M.expectedDamageRatio(P(),cur,cand,a,b,D.sonataBuffs,loadoutA,loadoutB);
  }

  function erState(curEr,candEr){
    const target=Number(P().erMin)||100;
    return {aPass:curEr>=target,bPass:candEr>=target,target};
  }

  function renderStatShift(id,label,current,candidate,target,suffix="",digits=1){
    const root=$(id);
    if(!root) return;
    const delta=candidate-current;
    const hasTarget=Number.isFinite(target);
    const currentLow=hasTarget&&current<target-1e-6;
    root.classList.remove("current-low","candidate-up","candidate-down","candidate-improving","candidate-low","candidate-flat");
    if(currentLow) root.classList.add("current-low");
    if(delta<-1e-6) root.classList.add("candidate-down");
    else if(delta>1e-6) root.classList.add(hasTarget&&candidate<target-1e-6?"candidate-improving":"candidate-up");
    else root.classList.add(hasTarget&&candidate<target-1e-6?"candidate-low":"candidate-flat");
    root.removeAttribute("title");
    const labelNode=root.querySelector("small");
    if(labelNode) labelNode.textContent=label;
    const currentNode=root.querySelector(".stat-flow span");
    const candidateNode=root.querySelector(".stat-flow strong");
    if(currentNode) currentNode.textContent=`${fmt(current,digits)}${suffix}`;
    if(candidateNode) candidateNode.textContent=`${fmt(candidate,digits)}${suffix}`;
  }

  function updateBuildInputQuality(){
    const values=currentBuild();
    const targets=qualityTargets();
    const config={atk:[values.primary,targets.primary],cr:[values.cr,targets.cr],cd:[values.cd,targets.cd],er:[values.er,targets.er]};
    Object.entries(config).forEach(([id,[value,target]])=>{
      const input=$(id);
      if(!input) return;
      input.classList.remove("quality-low","quality-met");
      if(!Number.isFinite(target)) return;
      input.classList.add(value<target-1e-6?"quality-low":"quality-met");
      input.dataset.qualityTarget=String(target);
    });
  }

  function clearStatShifts(){
    updateBuildInputQuality();
    const cur=currentBuild();
    const targets=qualityTargets();
    const values={shiftPrimary:[primaryLabel(),cur.primary,targets.primary,"",0],shiftCr:["CRIT RATE",cur.cr,targets.cr,"%",1],shiftCd:["CRIT DMG",cur.cd,targets.cd,"%",1],shiftEr:["ENERGY REGEN",cur.er,targets.er,"%",1]};
    Object.entries(values).forEach(([id,[label,value,target,suffix,digits]])=>{
      const root=$(id);
      if(!root) return;
      const hasTarget=Number.isFinite(target);
      root.classList.remove("current-low","candidate-up","candidate-down","candidate-improving","candidate-low","candidate-flat");
      if(hasTarget&&value<target-1e-6) root.classList.add("current-low");
      root.classList.add("candidate-flat");
      root.removeAttribute("title");
      const labelNode=root.querySelector("small");
      const current=root.querySelector(".stat-flow span");
      const candidate=root.querySelector(".stat-flow strong");
      if(labelNode) labelNode.textContent=label;
      if(current) current.textContent=`${fmt(value,digits)}${suffix}`;
      if(candidate) candidate.textContent="—";
    });
  }

  function compare(){
    const eA=readEcho("echoA"),eB=readEcho("echoB");
    if(!validateEcho(eA)||!validateEcho(eB)){
      clearStatShifts();
      $("verdict").textContent="INVALID ECHO · DUPLICATE SUBSTATS";$("verdict").className="fail";$("delta").textContent="—";$("delta").className="delta muted";$("changes").innerHTML="";
      document.querySelector(".result-inline")?.classList.remove("has-changes");
      return null;
    }

    const p=P(),a=agg(eA),b=agg(eB),cur=currentBuild(),cand=candidateBuild(cur,a,b),targets=qualityTargets();
    updateBuildInputQuality();
    const loadoutA=comparisonLoadout(eA),loadoutB=comparisonLoadout(eB);
    const sheetA=M.effectiveSheetBuild?.(p,cur,D.sonataBuffs,loadoutA)||cur;
    const sheetB=M.effectiveSheetBuild?.(p,cand,D.sonataBuffs,loadoutB)||cand;
    renderStatShift("shiftPrimary",primaryLabel(),cur.primary,cand.primary,targets.primary,"",0);
    renderStatShift("shiftCr","CRIT RATE",cur.cr,cand.cr,targets.cr,"%",1);
    renderStatShift("shiftCd","CRIT DMG",cur.cd,cand.cd,targets.cd,"%",1);
    renderStatShift("shiftEr","ENERGY REGEN",sheetA.er,sheetB.er,targets.er,"%",1);

    updateSonataBadge("echoA",loadoutA);
    updateSonataBadge("echoB",loadoutB);
    const er=erState(sheetA.er,sheetB.er);
    const damageRatio=expectedDamageRatio(cur,cand,a,b,loadoutA,loadoutB),delta=(damageRatio-1)*100;
    const band=.5;
    let damageVerdict="SIDEGRADE";
    if(delta>band){
      damageVerdict=er.aPass&&!er.bPass?"MORE DAMAGE · ER TARGET MISSED":(!er.bPass?"MORE DAMAGE · ER STILL LOW":"USE ECHO B");
    }else if(delta<-band){
      damageVerdict="KEEP ECHO A";
    }else if(er.aPass&&!er.bPass){
      damageVerdict="KEEP ECHO A · ER TARGET MISSED";
    }

    $("verdict").textContent=damageVerdict;$("verdict").className=er.bPass?"":"warn";
    $("delta").textContent=signed(delta,"%",2);$("delta").className="delta";

    const changes=[
      [p.attribute,(b.attributeDmg||0)-(a.attributeDmg||0),"%",1],
      ["Basic",(b.basicDmg||0)-(a.basicDmg||0),"%",1],["Heavy",(b.heavyDmg||0)-(a.heavyDmg||0),"%",1],["Skill",(b.skillDmg||0)-(a.skillDmg||0),"%",1],["Liberation",(b.libDmg||0)-(a.libDmg||0),"%",1]
    ].filter(([,v])=>Math.abs(v)>1e-6);
    const resultPanel=document.querySelector(".result-inline");
    resultPanel?.classList.toggle("has-changes",changes.length>0);
    $("changes").innerHTML=changes.map(([l,v,s,d])=>`<div class="change">${l}<strong>${signed(v,s,d)}</strong></div>`).join("");
    return {eA,eB,cur,cand,delta,er,loadoutA,loadoutB};
  }

  function echoSummary(e,slotKey){
    const set=setInfo(setForSlot(slotKey));
    if(!e) return {main:"Empty",detail:`${setPieceLabel(slotKey)} · ${set.name}`,set,icon:set.icon};
    const main=e.main==="attributeDmg"?`${P().attribute} DMG`:(D.statMeta[e.main]?.label||e.main);
    const crits=(e.subs||[]).filter(s=>s.stat==="critRate"||s.stat==="critDmg").length;
    const echoName=e.echoName || "Legacy Echo";
    return {main,detail:`${echoName} · ${set.name} · ${crits===2?"Double Crit":`${crits} Crit`}`,set,icon:e.echoIcon||set.icon};
  }

  function renderLoadout(){
    const {buildState}=currentBuildState(),selected=$("slot").value,meta=slotMeta();
    $("loadoutStrip").innerHTML=Object.entries(meta).map(([key,m])=>{
      const e=buildState.echoes?.[key],summary=echoSummary(e,key);
      const iconMarkup=e
        ? `<span class="slot-icon-frame"><img class="slot-set-icon" src="${summary.icon}" alt="${summary.set.name}" onerror="this.src='${summary.set.icon}'"></span>`
        : `<img class="slot-set-placeholder" src="${summary.set.icon}" alt="${summary.set.name}">`;
      return `<div class="slot-card ${selected===key?"active":""} ${e?"has-echo":"is-empty"}" data-slot="${key}">
        ${iconMarkup}
        <div class="slot-copy"><span>${m.label}</span><strong>${summary.main}</strong><small>${summary.detail}</small></div>
        ${e?`<button type="button" class="clear-slot" data-clear-slot="${key}" title="Clear saved Echo" aria-label="Clear ${m.label} saved Echo">×</button>`:""}
      </div>`;
    }).join("");
    [...$("loadoutStrip").querySelectorAll(".slot-card")].forEach(card=>card.addEventListener("click",()=>{$("slot").value=card.dataset.slot;loadSelectedSlot();}));
    [...$("loadoutStrip").querySelectorAll("[data-clear-slot]")].forEach(button=>button.addEventListener("click",event=>{
      event.stopPropagation();
      clearSavedSlot(button.dataset.clearSlot);
    }));
  }

  function clearSavedSlot(slotKey){
    const {state,buildState}=currentBuildState();
    const saved=buildState.echoes?.[slotKey];
    if(!saved) return;
    const label=slotMeta()[slotKey]?.label || slotKey;
    const name=saved.echoName || "saved Echo";
    if(!window.confirm(`Remove ${name} from ${label}?`)) return;
    buildState.echoes[slotKey]=null;
    saveCharacterState(state);
    if($("slot").value===slotKey) loadSelectedSlot();
    else renderLoadout();
  }

  function loadSelectedSlot(){
  const {buildState}=currentBuildState();
  const slot=$("slot").value;
  const meta=slotMeta()[slot];
  const saved=buildState.echoes?.[slot]||null;

  preloadEchoOptionsForSlot(slot);

  renderEcho("echoA","Echo A",meta.cost,saved);
  renderEcho("echoB","Echo B",meta.cost,saved);
  renderLoadout();
  compare();
}

  function loadSavedBuild(){
    const {buildState}=currentBuildState();
    const legacyPrimary=buildState.build?.primary!=null?buildState.build.primary:buildState.build?.atk;
    const fallback=recommendedBuildDefaults();
    $("atk").value=legacyPrimary!=null?legacyPrimary:fallback.primary;
    $("cr").value=buildState.build?.cr!=null?buildState.build.cr:fallback.cr;
    $("cd").value=buildState.build?.cd!=null?buildState.build.cd:fallback.cd;
    $("er").value=buildState.build?.er!=null?buildState.build.er:fallback.er;
    $("primaryLabel").textContent=primaryLabel();
    applyBuildInputBounds(true);
    updateBuildInputQuality();
  }

  function saveBuild(){
    const {state,buildState}=currentBuildState();
    buildState.weaponId=weaponId;
    buildState.build=currentBuild();
    saveCharacterState(state);
    updateBuildInputQuality();
  }

  function saveA(){
    const e=readEcho("echoA");
    if(!validateEcho(e)) return alert("Duplicate substats are not allowed.");
    const slot=$("slot").value;
    if(e.cost!==slotMeta()[slot].cost) return alert("Echo cost does not match this slot.");
    const {state,buildState}=currentBuildState();buildState.echoes[slot]=e;buildState.build=currentBuild();saveCharacterState(state);renderLoadout();
  }

  function equipB(){
    const r=compare();if(!r)return;
    const slot=$("slot").value;
    if(r.eB.cost!==slotMeta()[slot].cost) return alert("Echo B cost does not match this slot.");
    const {state,buildState}=currentBuildState();
    const previousA={...r.eA,subs:r.eA.subs.map(sub=>({...sub}))};
    const equippedB={...r.eB,subs:r.eB.subs.map(sub=>({...sub}))};
    buildState.echoes[slot]=equippedB;
    buildState.build={primary:Math.round(r.cand.primary),cr:Number(r.cand.cr.toFixed(1)),cd:Number(r.cand.cd.toFixed(1)),er:Number(r.cand.er.toFixed(1))};
    saveCharacterState(state);
    loadSavedBuild();
    renderEcho("echoA","Echo A",slotMeta()[slot].cost,equippedB);
    renderEcho("echoB","Echo B",slotMeta()[slot].cost,previousA);
    renderLoadout();
    compare();
  }

  function exportProfile(){
    const state=loadCharacterState();state.profileId=baseProfile.id;
    const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download=`wuwa-echo-lab-${baseProfile.id}.json`;a.click();URL.revokeObjectURL(url);
  }

  async function importProfile(file){
    const d=JSON.parse(await file.text());
    if(d.profileId&&d.profileId!==baseProfile.id) throw new Error(`This profile belongs to ${d.profileId}.`);
    const state=normalizeCharacterState(d);
    buildId=baseProfile.builds.some(b=>b.id===state.activeBuildId)?state.activeBuildId:baseProfile.builds[0].id;
    syncEquipmentState(state);
    saveCharacterState(state);
    renderProfile();renderSlotOptions();loadSavedBuild();$("slot").value=slotKeys[0];loadSelectedSlot();
  }


  function initVisibilityPerformance(){
    const sync=()=>{
      document.body.classList.toggle("app-paused",document.hidden);
      if(!document.hidden){
        document.body.classList.add("app-resuming");
        requestAnimationFrame(()=>requestAnimationFrame(()=>{
          document.body.classList.remove("app-resuming");
          updateRosterLayout();
        }));
      }
    };
    document.addEventListener("visibilitychange",sync,{passive:true});
    sync();
  }

  function init(){
    renderFilters();
    initVisibilityPerformance();
    const state=loadCharacterState();
    buildId=baseProfile.builds.some(b=>b.id===state.activeBuildId)?state.activeBuildId:baseProfile.builds[0].id;
    syncEquipmentState(state);
    renderRoster();renderProfile();renderSlotOptions();loadSavedBuild();$("slot").value=slotKeys[0];loadSelectedSlot();

    $("slot").addEventListener("change",loadSelectedSlot);
    ["atk","cr","cd","er"].forEach(id=>{
      const input=$(id);
      input.addEventListener("input",compare);
      const clamp=()=>{clampBuildInput(input);compare();};
      input.addEventListener("change",clamp);
      input.addEventListener("blur",clamp);
    });
    $("saveBuild").addEventListener("click",saveBuild);
    $("saveA").addEventListener("click",saveA);
    $("equipB").addEventListener("click",equipB);
    $("export").addEventListener("click",exportProfile);
    $("importFile").addEventListener("change",async e=>{try{const f=e.target.files?.[0];if(f)await importProfile(f);}catch(err){alert(`Import failed: ${err.message}`);}finally{e.target.value="";}});
    const refreshEquipmentCatalog=()=>{
      renderEquipment();
      loadSelectedSlot();
    };
    window.addEventListener("echoCatalogReady",refreshEquipmentCatalog);
    window.addEventListener("equipmentCatalogReady",refreshEquipmentCatalog);
    let resizeFrame=0;
    window.addEventListener("resize",()=>{
      cancelAnimationFrame(resizeFrame);
      resizeFrame=requestAnimationFrame(()=>updateRosterLayout());
    },{passive:true});
  }

  init();
})();
