window.ECHO_DATA = (() => {
  const statMeta = {
    critRate:{label:"CRIT Rate",pct:true}, critDmg:{label:"CRIT DMG",pct:true},
    atkPct:{label:"ATK%",pct:true}, flatAtk:{label:"ATK",pct:false},
    hpPct:{label:"HP%",pct:true}, flatHp:{label:"HP",pct:false},
    defPct:{label:"DEF%",pct:true}, flatDef:{label:"DEF",pct:false},
    energyRegen:{label:"Energy Regen",pct:true},
    basicDmg:{label:"Basic Attack DMG",pct:true}, heavyDmg:{label:"Heavy Attack DMG",pct:true},
    skillDmg:{label:"Resonance Skill DMG",pct:true}, libDmg:{label:"Resonance Liberation DMG",pct:true}
  };

  const rolls = {
    flatAtk:[30,40,50,60], flatHp:[320,360,390,430,470,510,540,580], flatDef:[40,50,60,70],
    atkPct:[6.4,7.1,7.9,8.6,9.4,10.1,10.9,11.6],
    hpPct:[6.4,7.1,7.9,8.6,9.4,10.1,10.9,11.6],
    defPct:[8.1,9.0,10.0,10.9,11.8,12.8,13.8,14.7],
    energyRegen:[6.8,7.6,8.4,9.2,10.0,10.8,11.6,12.4],
    critRate:[6.3,6.9,7.5,8.1,8.7,9.3,9.9,10.5],
    critDmg:[12.6,13.8,15.0,16.2,17.4,18.6,19.8,21.0],
    basicDmg:[6.4,7.1,7.9,8.6,9.4,10.1,10.9,11.6],
    heavyDmg:[6.4,7.1,7.9,8.6,9.4,10.1,10.9,11.6],
    skillDmg:[6.4,7.1,7.9,8.6,9.4,10.1,10.9,11.6],
    libDmg:[6.4,7.1,7.9,8.6,9.4,10.1,10.9,11.6]
  };

  const mains = {
    1:{atkPct:18,hpPct:22.8,defPct:18},
    3:{atkPct:30,hpPct:30,defPct:38,energyRegen:32,attributeDmg:30},
    4:{atkPct:33,hpPct:33,defPct:41.5,critRate:22,critDmg:44,healingBonus:26}
  };

  const secondary = {
    1:{stat:"flatHp",value:2280,label:"HP +2280"},
    3:{stat:"flatAtk",value:100,label:"ATK +100"},
    4:{stat:"flatAtk",value:150,label:"ATK +150"}
  };

  const profiles = [
    {
      id:"jiyan", initials:"JY", name:"Jiyan", attribute:"Aero",
      charBaseAtk:438, weapon:{name:"Verdant Summit",baseAtk:588},
      weaponBuffs:{element:12,heavy:48,atkPct:0},
      erMin:117,
      quality:{primary:1900,cr:65,cd:215},
      shares:{basic:0,heavy:.90,skill:.07,lib:0,intro:.03},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Aero DMG","ATK%"],threeKeys:["attributeDmg","atkPct"],one:"ATK%",
        priority:["CR","CD","ATK%","Heavy","ATK"], preferredSub:"heavyDmg"}
    },
    {
      id:"jinhsi", initials:"JH", name:"Jinhsi", attribute:"Spectro",
      charBaseAtk:413, weapon:{name:"Ages of Harvest",baseAtk:588},
      weaponBuffs:{element:12,skill:48,atkPct:0},
      erMin:100,
      quality:{primary:2000,cr:65,cd:210},
      shares:{basic:.02,heavy:0,skill:.86,lib:.09,intro:.03},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Spectro DMG","Spectro DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","Skill","ATK"], preferredSub:"skillDmg"}
    },
    {
      id:"carlotta", initials:"CA", name:"Carlotta", attribute:"Glacio",
      charBaseAtk:463, weapon:{name:"The Last Dance",baseAtk:500},
      weaponBuffs:{element:0,skill:48,atkPct:12},
      erMin:108,
      quality:{primary:1900,cr:65,cd:210},
      shares:{basic:.02,heavy:0,skill:.84,lib:.11,intro:.03},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Glacio DMG","Glacio DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","Skill","ATK"], preferredSub:"skillDmg"}
    },
    {
      id:"yinlin", initials:"YL", name:"Yinlin", attribute:"Electro",
      charBaseAtk:400, weapon:{name:"Stringmaster",baseAtk:500},
      weaponBuffs:{element:12,skill:0,atkPct:24},
      erMin:128,
      quality:{primary:2000,cr:45,cd:255},
      shares:{basic:.10,heavy:.10,skill:.58,lib:.17,intro:.05},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Electro DMG","Electro DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK","Skill"], preferredSub:"skillDmg"}
    },
    {
      id:"changli", initials:"CH", name:"Changli", attribute:"Fusion",
      charBaseAtk:463, weapon:{name:"Blazing Brilliance",baseAtk:588},
      weaponBuffs:{element:0,skill:56,atkPct:12},
      erMin:108,
      quality:{primary:2000,cr:65,cd:210},
      shares:{basic:.04,heavy:.16,skill:.58,lib:.18,intro:.04},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Fusion DMG","ATK%"],threeKeys:["attributeDmg","atkPct"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK","Skill"], preferredSub:"skillDmg"}
    },
    {
      id:"camellya", initials:"CM", name:"Camellya", attribute:"Havoc",
      charBaseAtk:450, weapon:{name:"Red Spring",baseAtk:588},
      weaponBuffs:{element:0,basic:70,atkPct:12},
      erMin:115,
      quality:{primary:2000,cr:55,cd:220},
      shares:{basic:.86,heavy:.02,skill:.08,lib:.03,intro:.01},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Havoc DMG","ATK%"],threeKeys:["attributeDmg","atkPct"],one:"ATK%",
        priority:["CR","CD","ATK%","Basic","ATK"], preferredSub:"basicDmg"}
    },
    {
      id:"xiangli-yao", initials:"XY", name:"Xiangli Yao", attribute:"Electro",
      charBaseAtk:425, weapon:{name:"Moongazer's Sigil",baseAtk:500},
      weaponBuffs:{atkPct:12,lib:20,element:0},
      erMin:120,
      quality:{primary:1800,cr:60,cd:215},
      shares:{basic:.02,heavy:0,skill:.09,lib:.86,intro:.03},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Electro DMG","ATK%"],threeKeys:["attributeDmg","atkPct"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK","Lib"], preferredSub:"libDmg"}
    },

    {
      id:"sanhua", initials:"SH", name:"Sanhua", attribute:"Glacio",
      rarity:4,
      charBaseAtk:275, weapon:{name:"Blazing Brilliance",baseAtk:588},
      weaponBuffs:{element:0,skill:56,atkPct:12},
      erMin:100,
      quality:{primary:1800,cr:60,cd:210},
      shares:{basic:.03,heavy:.30,skill:.27,lib:.30,intro:.10},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Glacio DMG","Glacio DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK"], preferredSub:"skillDmg"},
    },
    {
      id:"mortefi", initials:"MO", name:"Mortefi", attribute:"Fusion",
      rarity:4,
      charBaseAtk:250, weapon:{name:"Static Mist",baseAtk:588},
      weaponBuffs:{element:0,atkPct:0},
      erMin:115,
      quality:{primary:1900,cr:60,cd:215},
      shares:{basic:.08,heavy:0,skill:.12,lib:.08,intro:.02,coord:.70},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Fusion DMG","Fusion DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK"], preferredSub:"libDmg"},
    },
    {
      id:"danjin", initials:"DJ", name:"Danjin", attribute:"Havoc",
      rarity:4,
      charBaseAtk:263, weapon:{name:"Blazing Brilliance",baseAtk:588},
      weaponBuffs:{element:0,skill:56,atkPct:12},
      erMin:100,
      quality:{primary:2000,cr:60,cd:210},
      shares:{basic:.03,heavy:.45,skill:.35,lib:.15,intro:.02},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Havoc DMG","Havoc DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK","Heavy"], preferredSub:"heavyDmg"},
    },
    {
      id:"yangyang", initials:"YY", name:"Yangyang", attribute:"Aero",
      rarity:4,
      charBaseAtk:250, weapon:{name:"Blazing Brilliance",baseAtk:588},
      weaponBuffs:{element:0,skill:56,atkPct:12},
      erMin:107,
      quality:{primary:1800,cr:60,cd:210},
      shares:{basic:.18,heavy:.18,skill:.20,lib:.39,intro:.05},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Aero DMG","Aero DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK","Lib"], preferredSub:"libDmg"},
    },
    {
      id:"chixia", initials:"CX", name:"Chixia", attribute:"Fusion",
      rarity:4,
      charBaseAtk:300, weapon:{name:"The Last Dance",baseAtk:500},
      weaponBuffs:{element:0,skill:48,atkPct:12},
      erMin:115,
      quality:{primary:1900,cr:55,cd:210},
      shares:{basic:.03,heavy:0,skill:.62,lib:.33,intro:.02},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Fusion DMG","Fusion DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK"], preferredSub:"skillDmg"},
    },
    {
      id:"aalto", initials:"AA", name:"Aalto", attribute:"Aero",
      rarity:4,
      charBaseAtk:263, weapon:{name:"Static Mist",baseAtk:588},
      weaponBuffs:{element:0,atkPct:0},
      erMin:145,
      quality:{primary:1600,cr:60,cd:215},
      shares:{basic:.45,heavy:.03,skill:.28,lib:.14,intro:.10},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Aero DMG","Aero DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK","Basic"], preferredSub:"basicDmg"},
    },

    {
      id:"baizhi", initials:"BZ", name:"Baizhi", attribute:"Glacio",
      rarity:4, scaling:"atk", mode:"damage", defaultPrimary:1500,
      charBaseAtk:213, baseHp:12813, baseDef:1002,
      weapon:{name:"Stellar Symphony",baseAtk:413},
      weaponBuffs:{hpPct:12}, utilityBonus:10,
      erMin:220,
      quality:{primary:1500,cr:60,cd:210},
      shares:{plain:1},
      rec:{four:"HP%",fourKey:"hpPct",three:["Energy Regen","Energy Regen"],threeKeys:["energyRegen","energyRegen"],one:"HP%",
        priority:["HP%","HP"], preferredSub:"hpPct"},
    },
    {
      id:"taoqi", initials:"TQ", name:"Taoqi", attribute:"Havoc",
      rarity:4, scaling:"def", mode:"damage", defaultPrimary:2000,
      charBaseAtk:225, baseHp:8950, baseDef:1564,
      weapon:{name:"Discord",baseAtk:338},
      weaponBuffs:{element:0},
      erMin:100,
      quality:{primary:2000,cr:60,cd:210},
      shares:{basic:.35,heavy:.08,skill:.22,lib:.25,intro:.10},
      rec:{four:"DEF%",fourKey:"defPct",three:["Havoc DMG","Havoc DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"DEF%",
        priority:["CR","CD","DEF%","DEF"], preferredSub:"defPct"},
    },
    {
      id:"yuanwu", initials:"YW", name:"Yuanwu", attribute:"Electro",
      rarity:4, scaling:"def", mode:"damage", defaultPrimary:2100,
      charBaseAtk:225, baseHp:8525, baseDef:1638,
      weapon:{name:"Verity's Handle",baseAtk:588},
      weaponBuffs:{element:12,lib:48},
      erMin:100,
      quality:{primary:1800,cr:60,cd:250},
      shares:{basic:.05,heavy:0,skill:.20,lib:.15,intro:0,coord:.60},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Electro DMG","Electro DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"DEF%",
        priority:["CR","CD","DEF%","DEF"], preferredSub:"defPct"},
    },
    {
      id:"youhu", initials:"YH", name:"Youhu", attribute:"Glacio",
      rarity:4, scaling:"atk", mode:"damage", defaultPrimary:1800,
      charBaseAtk:263, baseHp:9975, baseDef:1051,
      weapon:{name:"Marcato R5",baseAtk:338},
      weaponBuffs:{element:0,atkPct:0},
      erMin:100,
      quality:{primary:1300,cr:60,cd:210},
      shares:{basic:.24,heavy:.08,skill:.36,lib:.22,intro:.10},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Glacio DMG","Glacio DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK","Skill"], preferredSub:"skillDmg"},
    },
    {
      id:"lumi", initials:"LU", name:"Lumi", attribute:"Electro",
      rarity:4, scaling:"atk", mode:"damage", defaultPrimary:2300,
      charBaseAtk:338, baseHp:8500, baseDef:880,
      weapon:{name:"Ages of Harvest",baseAtk:588},
      weaponBuffs:{element:12,skill:48,atkPct:0},
      erMin:142,
      quality:{primary:2000,cr:65,cd:210},
      shares:{basic:.58,heavy:0,skill:.24,lib:.14,intro:.04},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Electro DMG","Energy Regen"],threeKeys:["attributeDmg","energyRegen"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK"], preferredSub:"basicDmg"},
    },
    {
      id:"buling", initials:"BL", name:"Buling", attribute:"Electro",
      rarity:4, scaling:"atk", mode:"damage", defaultPrimary:1800,
      charBaseAtk:225, baseHp:10625, baseDef:1259,
      weapon:{name:"Stringmaster",baseAtk:500},
      weaponBuffs:{element:12,atkPct:24},
      erMin:125,
      quality:{primary:1500,cr:60,cd:215},
      shares:{basic:.22,heavy:.05,skill:.48,lib:.20,intro:.05},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Electro DMG","Electro DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK"], preferredSub:"skillDmg"},
    },

    {
      id:"rover-spectro", initials:"RS", name:"Rover", attribute:"Spectro",
      rarity:5, freeCharacter:true, scaling:"atk", mode:"damage", defaultPrimary:2100,
      charBaseAtk:375, baseHp:11400, baseDef:1369,
      weapon:{name:"Blazing Brilliance",baseAtk:588},
      weaponBuffs:{atkPct:12,skill:56,element:0},
      erMin:120,
      quality:{primary:1800,cr:60,cd:210},
      shares:{basic:.15,heavy:.05,skill:.40,lib:.30,intro:.10},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Spectro DMG","Spectro DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK","Skill"], preferredSub:"skillDmg"},
    },
    {
      id:"rover-havoc", initials:"RH", name:"Rover", attribute:"Havoc",
      rarity:5, freeCharacter:true, scaling:"atk", mode:"damage", defaultPrimary:2100,
      charBaseAtk:413, baseHp:10825, baseDef:1259,
      weapon:{name:"Red Spring",baseAtk:588},
      weaponBuffs:{atkPct:12,basic:30,element:0},
      erMin:140,
      quality:{primary:1800,cr:60,cd:210},
      shares:{basic:.38,heavy:.18,skill:.25,lib:.17,intro:.02},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Havoc DMG","Havoc DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK","Basic"], preferredSub:"basicDmg"},
    },
    {
      id:"rover-aero", initials:"RA", name:"Rover", attribute:"Aero",
      rarity:5, freeCharacter:true, scaling:"atk", mode:"damage", defaultPrimary:2100,
      charBaseAtk:438, baseHp:10775, baseDef:1137,
      weapon:{name:"Bloodpact's Pledge",baseAtk:588},
      weaponBuffs:{skill:10,element:0,atkPct:0},
      erMin:128,
      quality:{primary:2100,cr:65,cd:210},
      shares:{basic:.04,heavy:.02,skill:.68,lib:.21,intro:.05},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Aero DMG","Aero DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","Skill","ATK"], preferredSub:"skillDmg"},
    },
    {
      id:"rover-electro", initials:"RE", name:"Rover", attribute:"Electro",
      rarity:5, freeCharacter:true, scaling:"atk", mode:"damage", defaultPrimary:2250,
      charBaseAtk:438, baseHp:10775, baseDef:1137,
      weapon:{name:"Blazing Brilliance",baseAtk:588},
      weaponBuffs:{atkPct:12,skill:56,element:0},
      erMin:120,
      quality:{primary:2000,cr:60,cd:210},
      shares:{basic:.20,heavy:0,skill:.55,lib:.20,intro:.05},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Electro DMG","Electro DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","Skill","ATK"], preferredSub:"skillDmg"},
    },

    {
      id:"calcharo", initials:"CL", name:"Calcharo", attribute:"Electro",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2200,
      charBaseAtk:438, baseHp:10500, baseDef:1186,
      weapon:{name:"Wildfire Mark",baseAtk:588},
      weaponBuffs:{atkPct:12,lib:24,element:0},
      erMin:120,
      quality:{primary:1800,cr:60,cd:215},
      shares:{basic:.24,heavy:.02,skill:.07,lib:.64,intro:.03},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Electro DMG","Electro DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK","Lib"], preferredSub:"libDmg"},
    },
    {
      id:"encore", initials:"EN", name:"Encore", attribute:"Fusion",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2250,
      charBaseAtk:425, baseHp:10513, baseDef:1247,
      weapon:{name:"Stringmaster",baseAtk:500},
      weaponBuffs:{element:12,atkPct:24},
      erMin:105,
      quality:{primary:2000,cr:60,cd:215},
      shares:{basic:.68,heavy:.06,skill:.22,lib:.02,intro:.02},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Fusion DMG","Fusion DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK","Basic"], preferredSub:"basicDmg"},
    },
    {
      id:"verina", initials:"VE", name:"Verina", attribute:"Spectro",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:1650,
      charBaseAtk:338, baseHp:14238, baseDef:1100,
      weapon:{name:"Variation R5",baseAtk:338},
      weaponBuffs:{element:0,atkPct:0},
      erMin:220,
      quality:{primary:1500,cr:60,cd:210},
      shares:{basic:.55,heavy:.08,skill:.05,lib:.25,intro:.07},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Energy Regen","Spectro DMG"],threeKeys:["energyRegen","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK"], preferredSub:"atkPct"},
    },
    {
      id:"jianxin", initials:"JX", name:"Jianxin", attribute:"Aero",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:1950,
      charBaseAtk:338, baseHp:14113, baseDef:1124,
      weapon:{name:"Verity's Handle",baseAtk:588},
      weaponBuffs:{element:12,lib:48,atkPct:0},
      erMin:155,
      quality:{primary:1700,cr:65,cd:210},
      shares:{basic:.13,heavy:.18,skill:.08,lib:.56,intro:.05},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Aero DMG","Energy Regen"],threeKeys:["attributeDmg","energyRegen"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK","Lib"], preferredSub:"libDmg"},
    },
    {
      id:"lingyang", initials:"LY", name:"Lingyang", attribute:"Glacio",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2350,
      charBaseAtk:438, baseHp:10388, baseDef:1210,
      weapon:{name:"Moongazer's Sigil",baseAtk:500},
      weaponBuffs:{atkPct:12,lib:20,element:0},
      erMin:120,
      quality:{primary:2100,cr:60,cd:215},
      shares:{basic:.50,heavy:.08,skill:.24,lib:.15,intro:.03},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Glacio DMG","Glacio DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK"], preferredSub:"basicDmg"},
    },

    {
      id:"zhezhi", initials:"ZZ", name:"Zhezhi", attribute:"Glacio",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2100,
      charBaseAtk:375, baseHp:12250, baseDef:1198,
      weapon:{name:"Rime-Draped Sprouts",baseAtk:500},
      weaponBuffs:{atkPct:12,basic:52,element:0},
      erMin:116,
      quality:{primary:1900,cr:65,cd:215},
      shares:{basic:.68,heavy:.02,skill:.10,lib:.16,intro:.04},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Glacio DMG","Glacio DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","Basic","ATK"], preferredSub:"basicDmg"},
    },
    {
      id:"shorekeeper", initials:"SK", name:"The Shorekeeper", attribute:"Spectro",
      rarity:5, scaling:"hp", mode:"damage", defaultPrimary:30000,
      charBaseAtk:288, baseHp:16713, baseDef:1100,
      weapon:{name:"Stellar Symphony",baseAtk:413},
      weaponBuffs:{hpPct:12,element:0},
      erMin:230,
      quality:{primary:20000,cr:20,cd:220},
      shares:{fixedLib:.70,skill:.14,basic:.07,heavy:.04,intro:.05},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Energy Regen","Spectro DMG"],threeKeys:["energyRegen","attributeDmg"],one:"HP%",
        priority:["CD","Lib","HP%","CR","HP"], preferredSub:"libDmg"},
    },
    {
      id:"roccia", initials:"RO", name:"Roccia", attribute:"Havoc",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2050,
      charBaseAtk:375, baseHp:12250, baseDef:1198,
      weapon:{name:"Tragicomedy",baseAtk:588},
      weaponBuffs:{atkPct:12,heavy:48,element:0},
      erMin:115,
      quality:{primary:1800,cr:70,cd:210},
      shares:{basic:.04,heavy:.72,skill:.09,lib:.11,intro:.04},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Havoc DMG","Havoc DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","Heavy","ATK"], preferredSub:"heavyDmg"},
    },
    {
      id:"phoebe", initials:"PH", name:"Phoebe", attribute:"Spectro",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2050,
      charBaseAtk:413, baseHp:10825, baseDef:1259,
      weapon:{name:"Luminous Hymn",baseAtk:500},
      weaponBuffs:{atkPct:12,basic:42,heavy:42,element:0},
      erMin:111,
      quality:{primary:1900,cr:60,cd:215},
      shares:{basic:.12,heavy:.72,skill:.05,lib:.09,intro:.02},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Spectro DMG","Spectro DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK","Heavy"], preferredSub:"heavyDmg"},
    },
    {
      id:"brant", initials:"BR", name:"Brant", attribute:"Fusion",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:1800,
      charBaseAtk:375, baseHp:11675, baseDef:1308,
      weapon:{name:"Unflickering Valor",baseAtk:413},
      weaponBuffs:{basic:48,element:0,atkPct:0},
      erMin:250,
      quality:{primary:1600,cr:65,cd:210},
      shares:{basic:.82,heavy:.03,skill:.01,lib:.10,intro:.04},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Energy Regen","Fusion DMG"],threeKeys:["energyRegen","attributeDmg"],one:"ATK%",
        priority:["CR","CD","Basic","ATK%","ATK"], preferredSub:"basicDmg"},
    },
    {
      id:"cantarella", initials:"CT", name:"Cantarella", attribute:"Havoc",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2100,
      charBaseAtk:400, baseHp:11600, baseDef:1100,
      weapon:{name:"Whispers of Sirens",baseAtk:500},
      weaponBuffs:{atkPct:12,basic:40,element:0},
      erMin:120,
      quality:{primary:1950,cr:65,cd:210},
      shares:{basic:.46,heavy:.14,skill:.22,lib:.15,intro:.03},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Havoc DMG","Havoc DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK","Basic"], preferredSub:"basicDmg"},
    },

    {
      id:"zani", initials:"ZA", name:"Zani", attribute:"Spectro",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2150,
      charBaseAtk:438, baseHp:10775, baseDef:1136,
      weapon:{name:"Blazing Justice",baseAtk:588},
      weaponBuffs:{atkPct:12,element:0},
      erMin:115,
      quality:{primary:1800,cr:65,cd:210},
      shares:{heavy:.80,lib:.12,plain:.05,intro:.03},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Spectro DMG","Spectro DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK"], preferredSub:"heavyDmg"},
    },
    {
      id:"ciaccona", initials:"CI", name:"Ciaccona", attribute:"Aero",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2100,
      charBaseAtk:375, baseHp:12238, baseDef:1198,
      weapon:{name:"Woodland Aria",baseAtk:500},
      weaponBuffs:{atkPct:12,element:24},
      erMin:115,
      quality:{primary:2000,cr:55,cd:225},
      shares:{lib:.55,heavy:.24,basic:.16,skill:.03,intro:.02},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Aero DMG","Aero DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK"], preferredSub:"libDmg"},
    },
    {
      id:"cartethyia", initials:"CA", name:"Cartethyia", attribute:"Aero",
      rarity:5, scaling:"hp", mode:"damage", defaultPrimary:42000,
      charBaseAtk:313, baseHp:14800, baseDef:611,
      weapon:{name:"Defier's Thorn",baseAtk:413},
      weaponBuffs:{hpPct:12,element:0},
      erMin:110,
      quality:{primary:35000,cr:65,cd:240},
      slotCosts:[4,4,1,1,1],
      slotMains:["critRate","critDmg","hpPct","hpPct","hpPct"],
      shares:{basic:.45,lib:.45,skill:.04,intro:.03,plain:.03},
      rec:{four:"CR + CD",fourKey:"critRate",three:["—","—"],threeKeys:["attributeDmg","attributeDmg"],one:"HP%",oneDisplay:"HP% ×3",
        priority:["CR","CD","HP%","Basic","Lib"], preferredSub:"basicDmg"},
    },
    {
      id:"lupa", initials:"LU", name:"Lupa", attribute:"Fusion",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2200,
      charBaseAtk:388, baseHp:11913, baseDef:1185,
      weapon:{name:"Wildfire Mark",baseAtk:588},
      weaponBuffs:{atkPct:12,lib:24,element:24},
      erMin:115,
      quality:{primary:1800,cr:65,cd:215},
      shares:{lib:.68,intro:.12,heavy:.08,basic:.07,skill:.05},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Fusion DMG","Fusion DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK","Lib"], preferredSub:"libDmg"},
    },
    {
      id:"phrolova", initials:"PR", name:"Phrolova", attribute:"Havoc",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2250,
      charBaseAtk:438, baseHp:10775, baseDef:1136,
      weapon:{name:"Lethean Elegy",baseAtk:588},
      weaponBuffs:{atkPct:12,skill:32,element:0},
      erMin:100,
      quality:{primary:2000,cr:60,cd:215},
      shares:{plain:.64,skill:.31,intro:.05},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Havoc DMG","Havoc DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","Skill","ATK"], preferredSub:"skillDmg"},
    },
    {
      id:"augusta", initials:"AU", name:"Augusta", attribute:"Electro",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2450,
      charBaseAtk:463, baseHp:10300, baseDef:1112,
      weapon:{name:"Thunderflare Dominion",baseAtk:675},
      weaponBuffs:{atkPct:12,heavy:20,element:0},
      erMin:116,
      quality:{primary:2000,cr:65,cd:210},
      shares:{heavy:.93,skill:.04,intro:.03},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Electro DMG","Electro DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","Heavy","ATK"], preferredSub:"heavyDmg"},
    }
,
    {
      id:"iuno", initials:"IU", name:"Iuno", attribute:"Aero",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2150,
      charBaseAtk:450, baseHp:10525, baseDef:1124,
      weapon:{name:"Moongazer's Sigil",baseAtk:500},
      weaponBuffs:{atkPct:12,lib:20,element:0},
      erMin:120,
      quality:{primary:1800,cr:65,cd:215},
      shares:{lib:.91,skill:.04,intro:.03,plain:.02},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Aero DMG","Aero DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","Lib","ATK%","ATK"], preferredSub:"libDmg"},
    },
    {
      id:"galbrena", initials:"GA", name:"Galbrena", attribute:"Fusion",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2050,
      charBaseAtk:463, baseHp:10300, baseDef:1112,
      weapon:{name:"Lux & Umbra",baseAtk:588},
      weaponBuffs:{atkPct:12,heavy:24,echo:24,element:0},
      erMin:125,
      quality:{primary:1900,cr:60,cd:230},
      shares:{echo:.43,heavy:.35,plain:.16,skill:.03,intro:.03},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Fusion DMG","Fusion DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK","Heavy"], preferredSub:"heavyDmg"},
    },
    {
      id:"qiuyuan", initials:"QY", name:"Qiuyuan", attribute:"Aero",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2050,
      charBaseAtk:375, baseHp:12238, baseDef:1198,
      weapon:{name:"Emerald Sentence",baseAtk:588},
      weaponBuffs:{atkPct:12,heavy:24,element:0},
      erMin:115,
      quality:{primary:1600,cr:65,cd:210},
      shares:{heavy:.55,echo:.20,plain:.14,lib:.05,skill:.03,intro:.03},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Aero DMG","Aero DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","Heavy","ATK"], preferredSub:"heavyDmg"},
    },
    {
      id:"lynae", initials:"LY", name:"Lynae", attribute:"Spectro",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2100,
      charBaseAtk:375, baseHp:12238, baseDef:1198,
      weapon:{name:"Spectrum Blaster",baseAtk:588},
      weaponBuffs:{atkPct:12,basic:36,element:0},
      erMin:120,
      quality:{primary:2000,cr:50,cd:250},
      shares:{basic:.68,heavy:.13,lib:.14,skill:.03,intro:.02},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Spectro DMG","Spectro DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK","Basic"], preferredSub:"basicDmg"},
    },
    {
      id:"mornye", initials:"MR", name:"Mornye", attribute:"Fusion",
      rarity:5, scaling:"def", mode:"damage", defaultPrimary:3000,
      charBaseAtk:288, baseHp:15375, baseDef:1357,
      weapon:{name:"Starfield Calibrator",baseAtk:413},
      weaponBuffs:{defPct:16,element:0},
      utilityBonus:0,
      erMin:240,
      quality:{primary:3000,cr:20,cd:220},
      shares:{lib:.90,plain:.10},
      rec:{four:"DEF%",fourKey:"defPct",three:["Energy Regen","Fusion DMG"],threeKeys:["energyRegen","attributeDmg"],one:"DEF%",
        priority:["Lib","CD","DEF%","CR","DEF"], preferredSub:"libDmg"},
    },
    {
      id:"luuk-herssen", initials:"LH", name:"Luuk Herssen", attribute:"Spectro",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2400,
      charBaseAtk:463, baseHp:10300, baseDef:1112,
      weapon:{name:"Daybreaker's Spine",baseAtk:588},
      weaponBuffs:{atkPct:12,basic:20,element:20},
      erMin:120,
      quality:{primary:2100,cr:65,cd:210},
      shares:{basic:.76,skill:.13,lib:.07,intro:.02,plain:.02},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Spectro DMG","ATK%"],threeKeys:["attributeDmg","atkPct"],one:"ATK%",
        priority:["CD","CR","ATK%","Basic","ATK"], preferredSub:"basicDmg"},
    },

    {
      id:"denia", initials:"DE", name:"Denia", attribute:"Fusion",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2200,
      charBaseAtk:425, baseHp:11025, baseDef:1149,
      weapon:{name:"Forged Dwarf Star",baseAtk:500},
      weaponBuffs:{atkPct:36,lib:36,element:0},
      erMin:108,
      quality:{primary:2100,cr:70,cd:270},
      shares:{lib:.58,basic:.20,skill:.17,intro:.03,plain:.02},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Fusion DMG","Fusion DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","Lib","ATK%","ATK"], preferredSub:"libDmg"},
    },
    {
      id:"aemeath", initials:"AE", name:"Aemeath", attribute:"Fusion",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2200,
      charBaseAtk:425, baseHp:11025, baseDef:1149,
      weapon:{name:"Everbright Polestar",baseAtk:588},
      weaponBuffs:{element:12,lib:20,atkPct:0},
      erMin:120,
      quality:{primary:2000,cr:65,cd:210},
      shares:{lib:.66,basic:.17,skill:.10,plain:.05,intro:.02},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Fusion DMG","ATK%"],threeKeys:["attributeDmg","atkPct"],one:"ATK%",
        priority:["CR","CD","ATK%","Lib","ATK"], preferredSub:"libDmg"},
    },
    {
      id:"hiyuki", initials:"HY", name:"Hiyuki", attribute:"Glacio",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2050,
      charBaseAtk:463, baseHp:10300, baseDef:1112,
      weapon:{name:"Frostburn",baseAtk:588},
      weaponBuffs:{atkPct:12,chafe:20,element:0},
      erMin:120,
      quality:{primary:1800,cr:65,cd:210},
      wishesQuietBranch:"lib",
      shares:{lib:.56,chafe:.34,basic:.07,skill:.03},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Glacio DMG","Glacio DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CD","CR","ATK%","Lib","ATK"], preferredSub:"libDmg"},
    },
    {
      id:"sigrika", initials:"SG", name:"Sigrika", attribute:"Aero",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2600,
      charBaseAtk:438, baseHp:10775, baseDef:1137,
      weapon:{name:"Solsworn Ciphers",baseAtk:588},
      weaponBuffs:{atkPct:12,echo:32,element:0},
      erMin:109,
      quality:{primary:2400,cr:65,cd:210},
      shares:{echo:.90,plain:.06,intro:.04},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["ATK%","ATK%"],threeKeys:["atkPct","atkPct"],one:"ATK%",
        priority:["CD","CR","ATK%","ATK"], preferredSub:"atkPct"},
    },
    {
      id:"lucilla", initials:"LC", name:"Lucilla", attribute:"Glacio",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2050,
      charBaseAtk:375, baseHp:12238, baseDef:1198,
      weapon:{name:"Freeze Frame",baseAtk:588},
      weaponBuffs:{atkPct:12,element:30},
      erMin:100,
      quality:{primary:1900,cr:65,cd:210},
      shares:{basic:.52,skill:.34,plain:.10,intro:.04},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Glacio DMG","Glacio DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","ATK","Basic"], preferredSub:"basicDmg"},
    },
    {
      id:"lucy", initials:"LCY", name:"Lucy", attribute:"Spectro",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2150,
      charBaseAtk:425, baseHp:11025, baseDef:1149,
      weapon:{name:"Spectral Trigger",baseAtk:588},
      weaponBuffs:{atkPct:12,element:40,heavy:30},
      erMin:125,
      quality:{primary:2100,cr:65,cd:210},
      shares:{heavy:.62,basic:.23,lib:.10,skill:.03,intro:.02},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Spectro DMG","Spectro DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","Heavy","ATK"], preferredSub:"heavyDmg"},
    },

    {
      id:"rebecca", initials:"RB", name:"Rebecca", attribute:"Electro",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2150,
      charBaseAtk:400, baseHp:11600, baseDef:1173,
      weapon:{name:"Skull Thrasher",baseAtk:500},
      weaponBuffs:{atkPct:12,basic:36,element:0},
      erMin:117,
      quality:{primary:2000,cr:65,cd:210},
      shares:{basic:.55,plain:.35,skill:.05,intro:.05},
      rec:{four:"CRIT Rate",fourKey:"critRate",three:["Electro DMG","Electro DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","Basic","ATK%","ATK"], preferredSub:"basicDmg"},
    },
    {
      id:"chisa", initials:"CS", name:"Chisa", attribute:"Havoc",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2200,
      charBaseAtk:438, baseHp:10775, baseDef:1137,
      weapon:{name:"Kumokiri",baseAtk:500},
      weaponBuffs:{atkPct:12,lib:24,element:24},
      erMin:125,
      quality:{primary:2000,cr:65,cd:210},
      shares:{lib:.68,basic:.22,skill:.07,intro:.03},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Havoc DMG","Havoc DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","Lib","ATK"], preferredSub:"libDmg"},
    },
    {
      id:"yangyang-xuanling", initials:"YX", name:"Yangyang: Xuanling", attribute:"Havoc",
      songFeatherBranch:"havoc-bane",
      rarity:5, scaling:"atk", mode:"damage", defaultPrimary:2200,
      charBaseAtk:425, baseHp:11025, baseDef:1148,
      weapon:{name:"Azure Oath",baseAtk:588},
      weaponBuffs:{element:12,heavy:36,atkPct:0},
      erMin:107,
      quality:{primary:2100,cr:65,cd:255},
      shares:{heavy:.88,lib:.07,basic:.03,intro:.02},
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Havoc DMG","Havoc DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"ATK%",
        priority:["CR","CD","ATK%","Heavy","ATK"], preferredSub:"heavyDmg"},
    },
    {
      id:"suisui", initials:"SS", name:"Suisui", attribute:"Glacio",
      songFeatherBranch:"glacio-chafe",
      rarity:5, scaling:"hp", mode:"damage", provisional:false, defaultPrimary:36000,
      charBaseAtk:288, baseHp:16712, baseDef:1099,
      weapon:{name:"Firstlight's Herald",baseAtk:413},
      weaponBuffs:{hpPct:24,element:0},
      erMin:260,
      quality:{primary:38000,cr:20,cd:220},
      shares:{skill:.5,intro:.5},
      combatBuffs:{
        typeCritRate:{skill:80,intro:80},
        typeElement:{skill:240,intro:240}
      },
      rec:{four:"CRIT DMG",fourKey:"critDmg",three:["Energy Regen","HP%"],threeKeys:["energyRegen","hpPct"],one:"HP%",
        priority:["HP%","HP","CD","CR"], preferredSub:"hpPct"},
    }

  ];

  const attributeColors = {
    Aero:"#58d8c5",
    Glacio:"#8bd9ff",
    Fusion:"#ff7466",
    Electro:"#b48cff",
    Spectro:"#ffe07a",
    Havoc:"#f0629a"
  };

  const sonataSets = [
    ["rejuvenating-glow","Rejuvenating Glow"],
    ["void-thunder","Void Thunder"],
    ["lingering-tunes","Lingering Tunes"],
    ["moonlit-clouds","Moonlit Clouds"],
    ["molten-rift","Molten Rift"],
    ["sierra-gale","Sierra Gale"],
    ["celestial-light","Celestial Light"],
    ["havoc-eclipse","Havoc Eclipse"],
    ["freezing-frost","Freezing Frost"],
    ["frosty-resolve","Frosty Resolve"],
    ["empyrean-anthem","Empyrean Anthem"],
    ["midnight-veil","Midnight Veil"],
    ["eternal-radiance","Eternal Radiance"],
    ["tidebreaking-courage","Tidebreaking Courage"],
    ["dream-of-the-lost","Dream of the Lost"],
    ["flamewings-shadow","Flamewing's Shadow"],
    ["thread-of-severed-fate","Thread of Severed Fate"],
    ["law-of-harmony","Law of Harmony"],
    ["crown-of-valor","Crown of Valor"],
    ["gusts-of-welkin","Gusts of Welkin"],
    ["flaming-clawprint","Flaming Clawprint"],
    ["windward-pilgrimage","Windward Pilgrimage"],
    ["halo-of-starry-radiance","Halo of Starry Radiance"],
    ["chromatic-foam","Chromatic Foam"],
    ["wishes-of-quiet-snowfall","Wishes of Quiet Snowfall"],
    ["pact-of-neonlight-leap","Pact of Neonlight Leap"],
    ["rite-of-gilded-revelation","Rite of Gilded Revelation"],
    ["sound-of-true-name","Sound of True Name"],
    ["reel-of-spliced-memories","Reel of Spliced Memories"],
    ["trailblazing-star","Trailblazing Star"],
    ["shadow-of-shattered-dreams","Shadow of Shattered Dreams"],
    ["song-of-feathered-trace","Song of Feathered Trace"],
    ["lamp-of-nether-road","Lamp of Nether Road"],
    ["heart-of-evils-purge","Heart of Evil's Purge"]
  ].map(([id,name])=>({id,name,icon:`assets/sets/${id}.webp`}));

  const weaponTypes = {
    "jiyan":"broadblade","jinhsi":"broadblade","carlotta":"pistols","yinlin":"rectifier","changli":"sword","camellya":"sword","xiangli-yao":"gauntlets",
    "sanhua":"sword","mortefi":"pistols","danjin":"sword","yangyang":"sword","chixia":"pistols","aalto":"pistols","baizhi":"rectifier","taoqi":"broadblade","yuanwu":"gauntlets","youhu":"gauntlets","lumi":"broadblade","buling":"rectifier",
    "rover-spectro":"sword","rover-havoc":"sword","rover-aero":"sword","rover-electro":"sword",
    "calcharo":"broadblade","encore":"rectifier","verina":"rectifier","jianxin":"gauntlets","lingyang":"gauntlets","zhezhi":"rectifier","shorekeeper":"rectifier","roccia":"gauntlets","phoebe":"rectifier","brant":"sword","cantarella":"rectifier",
    "zani":"gauntlets","ciaccona":"pistols","cartethyia":"sword","lupa":"broadblade","phrolova":"rectifier","augusta":"broadblade","iuno":"gauntlets","galbrena":"pistols","qiuyuan":"sword","lynae":"pistols","mornye":"broadblade","luuk-herssen":"gauntlets",
    "denia":"rectifier","aemeath":"sword","hiyuki":"sword","sigrika":"gauntlets","lucilla":"rectifier","lucy":"pistols","rebecca":"pistols","chisa":"broadblade","yangyang-xuanling":"sword","suisui":"rectifier"
  };

  const bestSets = {
    "jiyan":"sierra-gale","jinhsi":"celestial-light","carlotta":"frosty-resolve","yinlin":"empyrean-anthem","changli":"molten-rift","camellya":"havoc-eclipse","xiangli-yao":"void-thunder",
    "sanhua":"moonlit-clouds","mortefi":"empyrean-anthem","danjin":"havoc-eclipse","yangyang":"moonlit-clouds","chixia":"molten-rift","aalto":"moonlit-clouds",
    "baizhi":"rejuvenating-glow","taoqi":"moonlit-clouds","yuanwu":"rejuvenating-glow","youhu":"rejuvenating-glow","lumi":"moonlit-clouds","buling":"rejuvenating-glow",
    "rover-spectro":"celestial-light","rover-havoc":"havoc-eclipse","rover-aero":"rejuvenating-glow","rover-electro":"void-thunder",
    "calcharo":"void-thunder","encore":"molten-rift","verina":"rejuvenating-glow","jianxin":"rejuvenating-glow","lingyang":"freezing-frost","zhezhi":"empyrean-anthem","shorekeeper":"rejuvenating-glow","roccia":"midnight-veil","phoebe":"moonlit-clouds","brant":"tidebreaking-courage","cantarella":"midnight-veil",
    "zani":"eternal-radiance","ciaccona":"gusts-of-welkin","cartethyia":"windward-pilgrimage","lupa":"flaming-clawprint","phrolova":"dream-of-the-lost","augusta":"crown-of-valor","iuno":"crown-of-valor","galbrena":"flamewings-shadow","qiuyuan":"law-of-harmony","lynae":"pact-of-neonlight-leap","mornye":"halo-of-starry-radiance","luuk-herssen":"rite-of-gilded-revelation",
    "denia":"chromatic-foam","aemeath":"trailblazing-star","hiyuki":"wishes-of-quiet-snowfall","sigrika":"sound-of-true-name","lucilla":"wishes-of-quiet-snowfall","lucy":"shadow-of-shattered-dreams","rebecca":"shadow-of-shattered-dreams","chisa":"moonlit-clouds","yangyang-xuanling":"song-of-feathered-trace","suisui":"song-of-feathered-trace"
  };

  const slotIds = ["c4","c3a","c3b","c1a","c1b"];
  const fullSet = set => ({
    composition:[{set,pieces:5}],
    slots:Object.fromEntries(slotIds.map(k=>[k,set]))
  });
  const split32 = (threeSet,twoSet) => ({
    composition:[{set:threeSet,pieces:3},{set:twoSet,pieces:2}],
    slots:{c4:threeSet,c3a:threeSet,c3b:twoSet,c1a:threeSet,c1b:twoSet}
  });
  const split122 = (oneSet,twoSetA,twoSetB) => ({
    composition:[{set:oneSet,pieces:1},{set:twoSetA,pieces:2},{set:twoSetB,pieces:2}],
    slots:{c4:oneSet,c3a:twoSetA,c3b:twoSetB,c1a:twoSetA,c1b:twoSetB}
  });

  const buildConfigs = {
    phoebe:[
      {
        id:"zani-support", name:"Zani Support", useCase:"Confession · Zani team", bestSet:"moonlit-clouds", setPlan:fullSet("moonlit-clouds"), erMin:125,
        rec:{three:["Spectro DMG","ATK%"],threeKeys:["attributeDmg","atkPct"],priority:["CR","CD","ATK%","ATK","Heavy"],preferredSub:"heavyDmg"}
      },
      {
        id:"main-dps", name:"Main DPS", useCase:"Absolution · Lynae / Spectro Rover", bestSet:"eternal-radiance", setPlan:fullSet("eternal-radiance"), erMin:111,
        rec:{three:["Spectro DMG","Spectro DMG"],threeKeys:["attributeDmg","attributeDmg"],priority:["CR","CD","ATK%","ATK","Heavy"],preferredSub:"heavyDmg"}
      }
    ],
    zhezhi:[
      {
        id:"empyrean", name:"Empyrean Anthem", useCase:"Max-investment coordinated build", bestSet:"empyrean-anthem", setPlan:fullSet("empyrean-anthem"), erMin:128
      },
      {
        id:"moonlit", name:"Moonlit Clouds", useCase:"Lower ER / classic buffer", bestSet:"moonlit-clouds", setPlan:fullSet("moonlit-clouds"), erMin:116, legacyIds:["endgame"]
      }
    ],
    mortefi:[
      {
        id:"endgame", name:"Empyrean Anthem", useCase:"Max-investment coordinated build", bestSet:"empyrean-anthem", setPlan:fullSet("empyrean-anthem"), erMin:120
      },
      {
        id:"moonlit", name:"Moonlit Clouds", useCase:"Classic Heavy buffer", bestSet:"moonlit-clouds", setPlan:fullSet("moonlit-clouds"), erMin:115
      }
    ],
    lucilla:[
      {
        id:"glacio-chafe", name:"Glacio Chafe", useCase:"Glacio / Chafe teams", bestSet:"wishes-of-quiet-snowfall", setPlan:fullSet("wishes-of-quiet-snowfall"), erMin:100,
        shares:{basic:.52,skill:.34,plain:.10,intro:.04},rec:{priority:["CR","CD","ATK%","ATK","Basic"],preferredSub:"basicDmg"}
      },
      {
        id:"echo-skill", name:"Moonlit Buff", useCase:"General Echo Skill support", bestSet:"moonlit-clouds", setPlan:fullSet("moonlit-clouds"), erMin:100,
        shares:{echo:.84,skill:.08,plain:.05,intro:.03},rec:{priority:["CR","CD","ATK%","ATK"],preferredSub:"atkPct"}
      },
      {
        id:"phrolova", name:"Phrolova", useCase:"Echo Skill damage + Phrolova", bestSet:"dream-of-the-lost", setPlan:split32("dream-of-the-lost","reel-of-spliced-memories"), erMin:100,
        shares:{echo:.84,skill:.08,plain:.05,intro:.03},rec:{priority:["CR","CD","ATK%","ATK"],preferredSub:"atkPct"}
      }
    ],
    iuno:[
      {
        id:"sub-dps",name:"Augusta Sub DPS",useCase:"Augusta + Shorekeeper · Hybrid",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),erMin:120,legacyIds:["endgame"]
      },
      {
        id:"main-dps",name:"Main DPS",useCase:"Lynae + Shorekeeper · DPS",bestSet:"crown-of-valor",setPlan:split32("crown-of-valor","sound-of-true-name"),erMin:100
      }
    ],
    galbrena:[
      {id:"endgame",name:"Flamewing + Fusion",useCase:"Qiuyuan / general endgame DPS",bestSet:"flamewings-shadow",setPlan:split32("flamewings-shadow","chromatic-foam")}
    ],
    qiuyuan:[
      {id:"law",name:"Law of Harmony",useCase:"Phrolova / Sigrika / personal DMG",bestSet:"law-of-harmony",setPlan:split32("law-of-harmony","sound-of-true-name"),erMin:125,legacyIds:["endgame"]},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Galbrena + Shorekeeper",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),erMin:115}
    ],
    phrolova:[
      {id:"endgame",name:"Dream + Havoc",useCase:"Endgame DPS",bestSet:"dream-of-the-lost",setPlan:split32("dream-of-the-lost","midnight-veil")}
    ],
    hiyuki:[
      {id:"endgame",name:"Wishes of Quiet Snowfall",useCase:"Lucilla + Chisa",bestSet:"wishes-of-quiet-snowfall",setPlan:fullSet("wishes-of-quiet-snowfall")}
    ],
    "yangyang-xuanling":[
      {id:"endgame",name:"Song of Feathered Trace",useCase:"Endgame DPS",bestSet:"song-of-feathered-trace",setPlan:fullSet("song-of-feathered-trace")}
    ],
    denia:[
      {id:"fusion-burst",name:"Fusion Burst",useCase:"Aemeath Fusion Burst",bestSet:"chromatic-foam",setPlan:fullSet("chromatic-foam")},
      {id:"tune-strain",name:"Tune Strain",useCase:"Tune Strain teams",bestSet:"reel-of-spliced-memories",setPlan:fullSet("reel-of-spliced-memories"),shares:{lib:.70,basic:.12,skill:.13,intro:.03,plain:.02}}
    ],
    aemeath:[
      {id:"fusion-burst",name:"Trailblazing Star",useCase:"Endgame DPS",bestSet:"trailblazing-star",setPlan:fullSet("trailblazing-star")}
    ],
    augusta:[
      {id:"endgame",name:"Crown + Electro",useCase:"Endgame DPS",bestSet:"crown-of-valor",setPlan:split32("crown-of-valor","void-thunder")}
    ],
    lucy:[
      {id:"endgame",name:"Edgerunner DPS",useCase:"Rebecca + Mornye",bestSet:"shadow-of-shattered-dreams",setPlan:split122("shadow-of-shattered-dreams","celestial-light","rite-of-gilded-revelation")}
    ],
    rebecca:[
      {id:"endgame",name:"Lucy Support",useCase:"Lucy / Heavy DPS teams",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds")},
      {id:"personal-dmg",name:"Personal DMG",useCase:"Sacrifice team buff for own damage",bestSet:"shadow-of-shattered-dreams",setPlan:split122("shadow-of-shattered-dreams","void-thunder","lingering-tunes")}
    ]
  };


  Object.assign(bestSets,{
    "jiyan":"windward-pilgrimage","yinlin":"moonlit-clouds","mortefi":"moonlit-clouds",
    "danjin":"moonlit-clouds","aalto":"sierra-gale","taoqi":"rejuvenating-glow",
    "yuanwu":"rejuvenating-glow","rover-spectro":"moonlit-clouds",
    "rover-aero":"rejuvenating-glow","rover-electro":"moonlit-clouds",
    "verina":"rejuvenating-glow","lingyang":"lingering-tunes",
    "phoebe":"moonlit-clouds"
  });

  Object.assign(buildConfigs,{
    "jiyan":[
      {id:"windward",name:"Windward Pilgrimage",useCase:"Aero Erosion team",bestSet:"windward-pilgrimage",setPlan:fullSet("windward-pilgrimage"),legacyIds:["endgame"]},
      {id:"sierra",name:"Sierra Gale",useCase:"Without Aero Erosion",bestSet:"sierra-gale",setPlan:fullSet("sierra-gale")}
    ],
    "yinlin":[
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Default team-DPS build",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),legacyIds:["endgame"]},
      {id:"empyrean",name:"Empyrean Anthem",useCase:"High-investment Coordinated build",bestSet:"empyrean-anthem",setPlan:fullSet("empyrean-anthem")}
    ],
    "mortefi":[
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Default Heavy-DPS buffer",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),erMin:115,legacyIds:["endgame"]},
      {id:"empyrean",name:"Empyrean Anthem",useCase:"High-investment Coordinated build",bestSet:"empyrean-anthem",setPlan:fullSet("empyrean-anthem"),erMin:120}
    ],
    "danjin":[
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Hybrid / Outro buffer",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),legacyIds:["endgame"]},
      {id:"havoc",name:"Havoc Eclipse",useCase:"On-field Main DPS",bestSet:"havoc-eclipse",setPlan:fullSet("havoc-eclipse")}
    ],
    "aalto":[
      {id:"sierra",name:"Sierra Gale",useCase:"Default DPS",bestSet:"sierra-gale",setPlan:fullSet("sierra-gale"),legacyIds:["endgame"]},
      {id:"windward",name:"Windward Pilgrimage",useCase:"DPS with Ciaccona / Aero Erosion",bestSet:"windward-pilgrimage",setPlan:fullSet("windward-pilgrimage")},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Hybrid buffer",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds")}
    ],
    "taoqi":[
      {id:"rejuv",name:"Rejuvenating Glow",useCase:"Default support",bestSet:"rejuvenating-glow",setPlan:fullSet("rejuvenating-glow"),legacyIds:["endgame"]},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Outro-buffer setup",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds")}
    ],
    "yuanwu":[
      {id:"rejuv",name:"Rejuvenating Glow",useCase:"Default support",bestSet:"rejuvenating-glow",setPlan:fullSet("rejuvenating-glow"),legacyIds:["endgame"]},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Outro-buffer setup",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds")},
      {id:"empyrean",name:"Empyrean Anthem",useCase:"Coordinated-damage setup",bestSet:"empyrean-anthem",setPlan:fullSet("empyrean-anthem")}
    ],
    "rover-spectro":[
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Default hybrid/support",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),legacyIds:["endgame"]},
      {id:"radiance",name:"Eternal Radiance",useCase:"Personal Spectro Frazzle damage",bestSet:"eternal-radiance",setPlan:fullSet("eternal-radiance")}
    ],
    "rover-aero":[
      {id:"rejuv",name:"Rejuvenating Glow",useCase:"Cartethyia support",bestSet:"rejuvenating-glow",setPlan:fullSet("rejuvenating-glow"),legacyIds:["endgame"]},
      {id:"windward",name:"Windward Pilgrimage",useCase:"Personal damage with Aero Erosion",bestSet:"windward-pilgrimage",setPlan:fullSet("windward-pilgrimage")}
    ],
    "verina":[
      {id:"rejuv",name:"Rejuvenating Glow",useCase:"Default universal support",bestSet:"rejuvenating-glow",setPlan:fullSet("rejuvenating-glow"),legacyIds:["endgame"]},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Alternative Outro-buffer setup",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds")}
    ],
    "lingyang":[
      {id:"endless",name:"Lingering Tunes",useCase:"Default on-field DPS",bestSet:"lingering-tunes",setPlan:fullSet("lingering-tunes"),legacyIds:["endgame"]},
      {id:"frosty",name:"Frosty Resolve",useCase:"Quickswap DPS",bestSet:"frosty-resolve",setPlan:fullSet("frosty-resolve")}
    ],
    "zhezhi":[
      {id:"empyrean",name:"Empyrean Anthem",useCase:"Max-investment Coordinated build",bestSet:"empyrean-anthem",setPlan:fullSet("empyrean-anthem")},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Classic buffer / lower investment",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),erMin:116,legacyIds:["endgame"]}
    ],
    "roccia":[
      {id:"midnight",name:"Midnight Veil",useCase:"High-investment Havoc support",bestSet:"midnight-veil",setPlan:fullSet("midnight-veil"),legacyIds:["endgame"]},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"General buffer",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds")}
    ],
    "phoebe":[
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Confession · Zani team",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),erMin:125,legacyIds:["zani-support","endgame"],
       rec:{three:["Spectro DMG","ATK%"],threeKeys:["attributeDmg","atkPct"],priority:["CR","CD","ATK%","ATK","Heavy"],preferredSub:"heavyDmg"}},
      {id:"radiance",name:"Eternal Radiance",useCase:"Absolution · Main DPS",bestSet:"eternal-radiance",setPlan:fullSet("eternal-radiance"),erMin:111,legacyIds:["main-dps"],
       rec:{three:["Spectro DMG","Spectro DMG"],threeKeys:["attributeDmg","attributeDmg"],priority:["CR","CD","ATK%","ATK","Heavy"],preferredSub:"heavyDmg"}}
    ],
    "cantarella":[
      {id:"midnight",name:"Midnight Veil",useCase:"Havoc team",bestSet:"midnight-veil",setPlan:fullSet("midnight-veil"),legacyIds:["endgame"]},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Non-Havoc team",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds")}
    ],
    "ciaccona":[
      {id:"gusts",name:"Gusts of Welkin",useCase:"Aero team support",bestSet:"gusts-of-welkin",setPlan:fullSet("gusts-of-welkin"),legacyIds:["endgame"]},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Non-Aero team support",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds")},
      {id:"windward",name:"Windward Pilgrimage",useCase:"On-field Main DPS",bestSet:"windward-pilgrimage",setPlan:fullSet("windward-pilgrimage")}
    ],
    "iuno":[
      {id:"crown",name:"Crown of Valor + Sierra Gale",useCase:"Main DPS",bestSet:"crown-of-valor",setPlan:split32("crown-of-valor","sierra-gale"),erMin:100,legacyIds:["main-dps","endgame"]},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Augusta Sub DPS",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),erMin:120,legacyIds:["sub-dps"]}
    ],
    "galbrena":[
      {id:"flamewing",name:"Flamewing's Shadow + Molten Rift",useCase:"Qiuyuan / general DPS",bestSet:"flamewings-shadow",setPlan:split32("flamewings-shadow","molten-rift"),legacyIds:["endgame"]}
    ],
    "qiuyuan":[
      {id:"law",name:"Law of Harmony + Sierra Gale",useCase:"Personal damage / Phrolova / Sigrika",bestSet:"law-of-harmony",setPlan:split32("law-of-harmony","sierra-gale"),erMin:125,legacyIds:["endgame"]},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Galbrena + Shorekeeper",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),erMin:115}
    ],
    "phrolova":[
      {id:"dream",name:"Dream of the Lost + Havoc Eclipse",useCase:"Main DPS",bestSet:"dream-of-the-lost",setPlan:split32("dream-of-the-lost","havoc-eclipse"),legacyIds:["endgame"]}
    ],
    "lucilla":[
      {id:"wishes",name:"Wishes of Quiet Snowfall",useCase:"Glacio Chafe teams",bestSet:"wishes-of-quiet-snowfall",setPlan:fullSet("wishes-of-quiet-snowfall"),erMin:100,legacyIds:["glacio-chafe","endgame"],
       shares:{basic:.52,skill:.34,plain:.10,intro:.04},rec:{priority:["CR","CD","ATK%","ATK","Basic"],preferredSub:"basicDmg"}},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"General buff / Echo Skill teams",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),erMin:100,legacyIds:["echo-skill"],
       shares:{echo:.84,skill:.08,plain:.05,intro:.03},rec:{priority:["CR","CD","ATK%","ATK"],preferredSub:"atkPct"}}
    ],
    "denia":[
      {id:"chromatic",name:"Chromatic Foam",useCase:"Fusion Burst",bestSet:"chromatic-foam",setPlan:fullSet("chromatic-foam"),legacyIds:["fusion-burst","endgame"]},
      {id:"reel",name:"Reel of Spliced Memories",useCase:"Tune Strain",bestSet:"reel-of-spliced-memories",setPlan:fullSet("reel-of-spliced-memories"),legacyIds:["tune-strain"],
       shares:{lib:.70,basic:.12,skill:.13,intro:.03,plain:.02}}
    ],
    "augusta":[
      {id:"crown",name:"Crown of Valor + Void Thunder",useCase:"Main DPS",bestSet:"crown-of-valor",setPlan:split32("crown-of-valor","void-thunder"),legacyIds:["endgame"]}
    ],
    "lucy":[
      {id:"shadow",name:"Shadow of Shattered Dreams + Celestial Light + Eternal Radiance",useCase:"Main DPS",bestSet:"shadow-of-shattered-dreams",
       setPlan:split122("shadow-of-shattered-dreams","celestial-light","eternal-radiance"),legacyIds:["endgame"]}
    ],
    "rebecca":[
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Lucy / Heavy-DPS support",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),legacyIds:["endgame"]},
      {id:"shadow",name:"Shadow of Shattered Dreams + Void Thunder + Lingering Tunes",useCase:"Personal damage",bestSet:"shadow-of-shattered-dreams",
       setPlan:split122("shadow-of-shattered-dreams","void-thunder","lingering-tunes"),legacyIds:["personal-dmg"]}
    ]
  });


  buildConfigs["yinlin"] = [
    {id:"moonlit",name:"Moonlit Clouds",useCase:"Default endgame build",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),legacyIds:["endgame","empyrean"]}
  ];
  buildConfigs["chisa"] = [
    {id:"rejuv",name:"Rejuvenating Glow",useCase:"Team-support default",bestSet:"rejuvenating-glow",setPlan:fullSet("rejuvenating-glow"),legacyIds:["endgame"]},
    {id:"thread",name:"Thread of Severed Fate + Havoc Eclipse",useCase:"Personal-damage setup",bestSet:"thread-of-severed-fate",setPlan:split32("thread-of-severed-fate","havoc-eclipse")}
  ];

  Object.assign(bestSets,{
    "jiyan":"sierra-gale",
    "yinlin":"empyrean-anthem",
    "aalto":"moonlit-clouds",
    "taoqi":"moonlit-clouds",
    "yangyang":"sierra-gale",
    "jianxin":"moonlit-clouds",
    "chisa":"moonlit-clouds",
    "rover-spectro":"rejuvenating-glow",
    "rover-aero":"windward-pilgrimage",
    "verina":"rejuvenating-glow",
    "lingyang":"frosty-resolve",
    "ciaccona":"gusts-of-welkin",
    "yuanwu":"rejuvenating-glow"
  });

  Object.assign(buildConfigs,{
    "jiyan":[
      {id:"sierra",name:"Sierra Gale",useCase:"Standard endgame Jiyan",bestSet:"sierra-gale",setPlan:fullSet("sierra-gale"),legacyIds:["endgame","windward"]}
    ],
    "yinlin":[
      {id:"empyrean",name:"Empyrean Anthem",useCase:"Xiangli Yao coordinated build",bestSet:"empyrean-anthem",setPlan:fullSet("empyrean-anthem"),legacyIds:["endgame"]},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Classic general buffer",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds")}
    ],
    "aalto":[
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Lingyang + Sanhua team buffer",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),legacyIds:["endgame","moonlit"]},
      {id:"sierra",name:"Sierra Gale",useCase:"Pseudo-DPS / personal damage",bestSet:"sierra-gale",setPlan:fullSet("sierra-gale"),legacyIds:["windward"]}
    ],
    "taoqi":[
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Danjin + Chixia · Outro into Chixia",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),legacyIds:["endgame","moonlit"]},
      {id:"rejuv",name:"Rejuvenating Glow",useCase:"S4+ teamwide-ATK alternative",bestSet:"rejuvenating-glow",setPlan:fullSet("rejuvenating-glow"),legacyIds:["rejuv"],erMin:126,rec:{priority:["CR","CD","DEF%","DEF"]}}
    ],
    "yangyang":[
      {id:"sierra",name:"Sierra Gale",useCase:"Calcharo + Jianxin · personal damage",bestSet:"sierra-gale",setPlan:fullSet("sierra-gale"),legacyIds:["endgame"]},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Energy-battery / direct Outro buffer",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds")}
    ],
    "rover-spectro":[
      {id:"rejuv",name:"Rejuvenating Glow",useCase:"Zani + Phoebe support",bestSet:"rejuvenating-glow",setPlan:fullSet("rejuvenating-glow"),legacyIds:["endgame"]},
      {id:"radiance",name:"Eternal Radiance",useCase:"Personal Spectro Frazzle damage",bestSet:"eternal-radiance",setPlan:fullSet("eternal-radiance")}
    ],
    "rover-aero":[
      {id:"windward",name:"Windward Pilgrimage",useCase:"Cartethyia / Aero Erosion",bestSet:"windward-pilgrimage",setPlan:fullSet("windward-pilgrimage"),legacyIds:["endgame","rejuv"]}
    ],
    "verina":[
      {id:"rejuv",name:"Rejuvenating Glow",useCase:"Universal support",bestSet:"rejuvenating-glow",setPlan:fullSet("rejuvenating-glow"),legacyIds:["endgame","moonlit"]}
    ],
    "lingyang":[
      {id:"frosty",name:"Frosty Resolve",useCase:"Endgame DPS",bestSet:"frosty-resolve",setPlan:fullSet("frosty-resolve"),legacyIds:["endgame","endless"]}
    ],
    "jianxin":[
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Calcharo + Yangyang · Outro into Calcharo",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),legacyIds:["endgame","moonlit"]},
      {id:"rejuv",name:"Rejuvenating Glow",useCase:"Originite universal-support alternative",bestSet:"rejuvenating-glow",setPlan:fullSet("rejuvenating-glow"),legacyIds:["rejuv"],weapon:{name:"Originite: Type IV",baseAtk:338},weaponBuffs:{element:0,lib:0,atkPct:0}}
    ],
    "ciaccona":[
      {id:"gusts",name:"Gusts of Welkin",useCase:"Aero support / Erosion teams",bestSet:"gusts-of-welkin",setPlan:fullSet("gusts-of-welkin"),legacyIds:["endgame","moonlit","windward"]}
    ],
    "yuanwu":[
      {id:"rejuv",name:"Rejuvenating Glow",useCase:"Jinhsi + Lumi support · low priority",bestSet:"rejuvenating-glow",setPlan:fullSet("rejuvenating-glow"),legacyIds:["endgame"],
       weapon:{name:"Originite: Type IV",baseAtk:338},weaponBuffs:{element:0,lib:0,atkPct:0},
       rec:{four:"CRIT Rate",fourKey:"critRate",three:["Electro DMG","Electro DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"DEF%",priority:["CR","CD","DEF%","DEF"],preferredSub:"defPct"}},
      {id:"empyrean",name:"Empyrean Anthem",useCase:"Invested coordinated-damage build",bestSet:"empyrean-anthem",setPlan:fullSet("empyrean-anthem"),
       rec:{four:"CRIT Rate / CRIT DMG",fourKey:"critDmg",three:["Electro DMG","Electro DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"DEF%",priority:["CR","CD","DEF%","DEF"],preferredSub:"defPct"}}
    ],
    "iuno":[
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Augusta sub-DPS",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),erMin:120,legacyIds:["sub-dps","endgame"]},
      {id:"crown",name:"Crown of Valor",useCase:"Main DPS · 3P Crown + 2P Sierra",bestSet:"crown-of-valor",setPlan:split32("crown-of-valor","sierra-gale"),erMin:100,legacyIds:["main-dps"]}
    ],
    "galbrena":[
      {id:"flamewing",name:"Flamewing's Shadow",useCase:"3P Flamewing + 2P Chromatic Foam",bestSet:"flamewings-shadow",setPlan:split32("flamewings-shadow","chromatic-foam"),legacyIds:["endgame"]}
    ],
    "qiuyuan":[
      {id:"law",name:"Law of Harmony",useCase:"Sigrika · 3P Law + 2P Moonlit",bestSet:"law-of-harmony",setPlan:split32("law-of-harmony","moonlit-clouds"),erMin:125,legacyIds:["endgame"]},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Galbrena team buffer",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),erMin:115}
    ],
    "phrolova":[
      {id:"dream",name:"Dream of the Lost",useCase:"3P Dream + 2P Reel",bestSet:"dream-of-the-lost",setPlan:split32("dream-of-the-lost","reel-of-spliced-memories"),legacyIds:["endgame"]}
    ],
    "augusta":[
      {id:"crown",name:"Crown of Valor",useCase:"3P Crown + 2P Void Thunder",bestSet:"crown-of-valor",setPlan:split32("crown-of-valor","void-thunder"),legacyIds:["endgame"]}
    ],
    "lucy":[
      {id:"shadow",name:"Shadow of Shattered Dreams",useCase:"1P Shadow + 2P Rite + 2P Reel",bestSet:"shadow-of-shattered-dreams",setPlan:split122("shadow-of-shattered-dreams","rite-of-gilded-revelation","reel-of-spliced-memories"),legacyIds:["endgame"]}
    ],
    "rebecca":[
      {id:"shadow",name:"Shadow of Shattered Dreams",useCase:"Lucy team · 1P Shadow + 2P Void + 2P Reel",bestSet:"shadow-of-shattered-dreams",setPlan:split122("shadow-of-shattered-dreams","void-thunder","reel-of-spliced-memories"),legacyIds:["personal-dmg","endgame"]},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Classic single-carry buffer",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds")}
    ],
    "chisa":[
      {id:"thread",name:"Thread of Severed Fate",useCase:"Personal damage",bestSet:"thread-of-severed-fate",setPlan:split32("thread-of-severed-fate","midnight-veil"),legacyIds:["endgame"]},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Outro buffer",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds")},
      {id:"rejuv",name:"Rejuvenating Glow",useCase:"Teamwide ATK support",bestSet:"rejuvenating-glow",setPlan:fullSet("rejuvenating-glow")}
    ]
  });

  const releaseOrderIds = [
    "aalto","baizhi","chixia","danjin","mortefi","sanhua","taoqi","yangyang","yuanwu",
    "rover-havoc","rover-spectro",
    "calcharo","encore","jianxin","lingyang","verina",
    "jiyan","yinlin",
    "jinhsi","changli",
    "zhezhi","xiangli-yao",
    "shorekeeper","youhu",
    "camellya","lumi",
    "carlotta","roccia",
    "phoebe","brant",
    "cantarella","rover-aero",
    "zani","ciaccona",
    "cartethyia","lupa",
    "phrolova",
    "augusta","iuno",
    "galbrena","qiuyuan",
    "chisa","buling",
    "lynae","mornye",
    "aemeath","luuk-herssen",
    "sigrika",
    "hiyuki","denia",
    "lucy","rebecca","lucilla",
    "rover-electro","yangyang-xuanling","suisui"
  ];
  const hallOrderIds = [
    "calcharo","lingyang","jianxin","verina","encore",
    "rover-electro","rover-aero","rover-havoc","rover-spectro",
    "buling","lumi","youhu","yuanwu","danjin","sanhua","mortefi","taoqi","aalto","baizhi","yangyang","chixia"
  ];
  const hallOrderSet = new Set(hallOrderIds);
  const displayOrderIds = [
    ...[...releaseOrderIds].reverse().filter(id=>!hallOrderSet.has(id)),
    ...hallOrderIds
  ];
  const releaseOrder = Object.fromEntries(displayOrderIds.map((id,index)=>[id,index]));


  function reorderBuilds(id, orderedIds) {
    const current = buildConfigs[id] || [];
    const byId = Object.fromEntries(current.map(build => [build.id, build]));
    buildConfigs[id] = orderedIds.map(key => byId[key]).filter(Boolean);
  }

  reorderBuilds("aalto", ["moonlit", "sierra"]);
  reorderBuilds("danjin", ["havoc", "moonlit"]);
  reorderBuilds("mortefi", ["empyrean", "moonlit"]);
  reorderBuilds("taoqi", ["moonlit", "rejuv"]);
  reorderBuilds("chisa", ["thread", "moonlit", "rejuv"]);
  reorderBuilds("rebecca", ["shadow", "moonlit"]);

  Object.assign(bestSets,{
    "yangyang":"moonlit-clouds",
    "danjin":"moonlit-clouds",
    "yuanwu":"rejuvenating-glow",
    "rover-spectro":"rejuvenating-glow",
    "rover-aero":"windward-pilgrimage",
    "jianxin":"moonlit-clouds",
    "lingyang":"frosty-resolve",
    "chisa":"thread-of-severed-fate",
    "iuno":"crown-of-valor",
    "yinlin":"moonlit-clouds"
  });

  Object.assign(buildConfigs,{
    "yangyang":[
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Energy battery / direct Outro buffer",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),legacyIds:["endgame","sierra"]}
    ],
    "danjin":[
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Default Hybrid / Outro buffer",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),legacyIds:["endgame"]},
      {id:"midnight",name:"Midnight Veil",useCase:"Invested Havoc-team Hybrid",bestSet:"midnight-veil",setPlan:fullSet("midnight-veil")},
      {id:"havoc",name:"Havoc Eclipse",useCase:"On-field Main DPS",bestSet:"havoc-eclipse",setPlan:fullSet("havoc-eclipse")}
    ],
    "yuanwu":[
      {id:"rejuv",name:"Rejuvenating Glow",useCase:"Jinhsi support · low field time",bestSet:"rejuvenating-glow",setPlan:fullSet("rejuvenating-glow"),legacyIds:["endgame"],
       weapon:{name:"Originite: Type IV",baseAtk:338},weaponBuffs:{element:0,lib:0,atkPct:0},
       rec:{four:"CRIT Rate",fourKey:"critRate",three:["Electro DMG","Electro DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"DEF%",priority:["CR","CD","DEF%","DEF"],preferredSub:"defPct"}},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Outro-buffer support",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),
       rec:{four:"CRIT Rate OR CRIT DMG",fourKey:"critDmg",three:["Electro DMG","Electro DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"DEF%",priority:["CR","CD","DEF%","DEF"],preferredSub:"defPct"}},
      {id:"empyrean",name:"Empyrean Anthem",useCase:"Invested coordinated support",bestSet:"empyrean-anthem",setPlan:fullSet("empyrean-anthem"),
       rec:{four:"CRIT Rate OR CRIT DMG",fourKey:"critDmg",three:["Electro DMG","Electro DMG"],threeKeys:["attributeDmg","attributeDmg"],one:"DEF%",priority:["CR","CD","DEF%","DEF"],preferredSub:"defPct"}}
    ],
    "rover-spectro":[
      {id:"rejuv",name:"Rejuvenating Glow",useCase:"Frazzle / Zani team support",bestSet:"rejuvenating-glow",setPlan:fullSet("rejuvenating-glow"),legacyIds:["endgame"]},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Outro-buffer support with a healer",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds")},
      {id:"radiance",name:"Eternal Radiance",useCase:"Personal Spectro Frazzle damage",bestSet:"eternal-radiance",setPlan:fullSet("eternal-radiance")}
    ],
    "rover-aero":[
      {id:"windward",name:"Windward Pilgrimage",useCase:"Cartethyia / Aero Erosion",bestSet:"windward-pilgrimage",setPlan:fullSet("windward-pilgrimage"),legacyIds:["endgame"]},
      {id:"rejuv",name:"Rejuvenating Glow",useCase:"General healing support",bestSet:"rejuvenating-glow",setPlan:fullSet("rejuvenating-glow")}
    ],
    "jianxin":[
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Grouping / Outro support",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),legacyIds:["endgame","rejuv"]}
    ],
    "lingyang":[
      {id:"frosty",name:"Frosty Resolve",useCase:"Endgame / quickswap DPS",bestSet:"frosty-resolve",setPlan:fullSet("frosty-resolve"),legacyIds:["endgame","endless"]},
      {id:"freezing",name:"Freezing Frost",useCase:"Classic Glacio DPS",bestSet:"freezing-frost",setPlan:fullSet("freezing-frost")}
    ],
    "chisa":[
      {id:"thread",name:"Thread of Severed Fate",useCase:"Personal damage",bestSet:"thread-of-severed-fate",setPlan:split32("thread-of-severed-fate","midnight-veil"),legacyIds:["endgame"]},
      {id:"rejuv",name:"Rejuvenating Glow",useCase:"Teamwide ATK support",bestSet:"rejuvenating-glow",setPlan:fullSet("rejuvenating-glow")},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Single-carry Outro buffer",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds")}
    ],
    "iuno":[
      {id:"crown",name:"Crown of Valor",useCase:"3P Crown + 2P Sierra",bestSet:"crown-of-valor",setPlan:split32("crown-of-valor","sierra-gale"),erMin:100,legacyIds:["main-dps","endgame"]},
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Augusta sub-DPS",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),erMin:120,legacyIds:["sub-dps"]}
    ],
    "yinlin":[
      {id:"moonlit",name:"Moonlit Clouds",useCase:"Default team-DPS buffer",bestSet:"moonlit-clouds",setPlan:fullSet("moonlit-clouds"),legacyIds:["endgame"]},
      {id:"empyrean",name:"Empyrean Anthem",useCase:"Invested Coordinated build",bestSet:"empyrean-anthem",setPlan:fullSet("empyrean-anthem")}
    ]
  });

  if (buildConfigs.roccia) buildConfigs.roccia = buildConfigs.roccia.filter(b => b.id !== "moonlit");
  if (buildConfigs.cantarella) buildConfigs.cantarella = buildConfigs.cantarella.filter(b => b.id !== "moonlit");

  const mathOverrides = {
    shorekeeper: {
      shares: { fixedLib: 1 },
      guaranteedCritTypes: ["fixedLib"],
      mathConfidence: "high-for-discernment"
    },

    hiyuki: {
      statusTypes: ["chafe"],
      mathConfidence: "mixed-direct-and-status"
    },

    suisui: {
      mathConfidence: "hp-offensive-trigger"
    }
  };

  for (const profile of profiles) {
    const override = mathOverrides[profile.id];
    if (override) Object.assign(profile, override);
  }

  const fourStars = new Set(["sanhua","mortefi","danjin","yangyang","chixia","aalto","baizhi","taoqi","yuanwu","youhu","lumi","buling"]);
  const setById = Object.fromEntries(sonataSets.map(s=>[s.id,s]));
  for(const builds of Object.values(buildConfigs)){
    for(const build of builds){
      build.name = setById[build.bestSet]?.name || build.name;
    }
  }

  const sonataBuffs = {
    "freezing-frost":{2:{element:10},5:{element:30}},
    "molten-rift":{2:{element:10},5:{element:30}},
    "void-thunder":{2:{element:10},5:{element:30}},
    "sierra-gale":{2:{element:10},5:{element:30}},
    "celestial-light":{2:{element:10},5:{element:30}},
    "havoc-eclipse":{2:{element:10},5:{element:30}},
    "rejuvenating-glow":{2:{healingBonus:10},5:{atkPct:15}},
    "moonlit-clouds":{},
    "lingering-tunes":{5:{atkPct:20}},
    "frosty-resolve":{2:{skillDmg:12},5:{element:22.5,skillDmg:36}},
    "eternal-radiance":{2:{element:10},5:{critRate:20,element:15}},
    "midnight-veil":{2:{element:10}},
    "empyrean-anthem":{5:{coord:80}},
    "tidebreaking-courage":{5:{atkPct:15},conditional:[{pieces:5,er:250,buffs:{element:30}}]},
    "gusts-of-welkin":{2:{element:10},5:{element:30}},
    "windward-pilgrimage":{2:{element:10},5:{critRate:10,element:30}},
    "flaming-clawprint":{2:{element:10},5:{element:15,libDmg:20}},
    "dream-of-the-lost":{3:{critRate:20,echo:35}},
    "crown-of-valor":{3:{atkPct:30,critDmg:20}},
    "law-of-harmony":{3:{heavyDmg:30,echo:16}},
    "flamewings-shadow":{3:{element:16,typeCritRate:{heavy:20,echo:20}}},
    "thread-of-severed-fate":{3:{atkPct:20,libDmg:30}},
    "halo-of-starry-radiance":{2:{healingBonus:10},5:{atkPct:25}},
    "pact-of-neonlight-leap":{2:{element:10}},
    "rite-of-gilded-revelation":{2:{element:10},5:{element:30,basicDmg:40}},
    "trailblazing-star":{2:{element:10},5:{critRate:20,element:20}},
    "chromatic-foam":{2:{element:10},5:{element:10}},
    "sound-of-true-name":{2:{element:10},5:{element:15,typeCritRate:{echo:20}}},
    "reel-of-spliced-memories":{},
    "wishes-of-quiet-snowfall":{2:{element:10},5:{element:10},branches:{"lib":{pieces:5,buffs:{critRate:25}}}},
    "shadow-of-shattered-dreams":{1:{critRate:15,basicDmg:35,heavyDmg:35}},
    "song-of-feathered-trace":{
      branches:{
        "havoc-bane":{pieces:5,buffs:{critRate:20,heavyDmg:35}},
        "glacio-chafe":{pieces:5,dynamic:{atkPctPerEr:.1,atkPctCap:25}}
      }
    },
    "lamp-of-nether-road":{5:{critRate:20,element:15}},
    "heart-of-evils-purge":{2:{element:10},5:{critDmg:20,element:30}}
  };

  const secondarySetChoicesByBuild = {
    "phrolova:dream":{
      allowed:["midnight-veil","havoc-eclipse","lingering-tunes","reel-of-spliced-memories","frosty-resolve"],
      preferred:["midnight-veil","havoc-eclipse"]
    },
    "augusta:crown":{
      allowed:["void-thunder","lingering-tunes","reel-of-spliced-memories","moonlit-clouds","empyrean-anthem","tidebreaking-courage"],
      preferred:["void-thunder"]
    },
    "iuno:crown":{
      allowed:["sierra-gale","gusts-of-welkin","windward-pilgrimage","sound-of-true-name","lingering-tunes","reel-of-spliced-memories","moonlit-clouds","empyrean-anthem","tidebreaking-courage"],
      preferred:["sierra-gale","gusts-of-welkin","windward-pilgrimage","sound-of-true-name"]
    },
    "galbrena:flamewing":{
      allowed:["molten-rift","flaming-clawprint","trailblazing-star","chromatic-foam","lingering-tunes","reel-of-spliced-memories","moonlit-clouds","empyrean-anthem","tidebreaking-courage"],
      preferred:["molten-rift","flaming-clawprint","trailblazing-star","chromatic-foam"]
    },
    "qiuyuan:law":{
      allowed:["sierra-gale","gusts-of-welkin","windward-pilgrimage","sound-of-true-name","moonlit-clouds","lingering-tunes","reel-of-spliced-memories","empyrean-anthem","tidebreaking-courage"],
      preferred:["sierra-gale","gusts-of-welkin","windward-pilgrimage","sound-of-true-name","moonlit-clouds"]
    },
    "lucy:shadow":{
      allowed:["rite-of-gilded-revelation","pact-of-neonlight-leap","eternal-radiance","celestial-light","lingering-tunes","reel-of-spliced-memories","moonlit-clouds","empyrean-anthem","tidebreaking-courage"],
      preferred:["rite-of-gilded-revelation","pact-of-neonlight-leap","eternal-radiance","celestial-light"]
    },
    "rebecca:shadow":{
      allowed:["void-thunder","lingering-tunes","reel-of-spliced-memories"],
      preferred:["void-thunder","lingering-tunes","reel-of-spliced-memories"]
    },
    "chisa:thread":{
      allowed:["midnight-veil","havoc-eclipse","lingering-tunes","reel-of-spliced-memories","moonlit-clouds","empyrean-anthem","tidebreaking-courage"],
      preferred:["midnight-veil","havoc-eclipse"]
    }
  };

  const rolesById = {
    "jiyan":["DPS"],"jinhsi":["DPS"],"carlotta":["DPS"],"yinlin":["Hybrid"],"changli":["Hybrid"],"camellya":["DPS"],"xiangli-yao":["DPS"],
    "sanhua":["Hybrid"],"mortefi":["Hybrid"],"danjin":["Hybrid"],"yangyang":["Hybrid"],"chixia":["DPS"],"aalto":["Hybrid"],
    "baizhi":["Support"],"taoqi":["Hybrid"],"yuanwu":["Support"],"youhu":["Support"],"lumi":["Hybrid"],"buling":["Support"],
    "rover-spectro":["Support"],"rover-havoc":["DPS"],"rover-aero":["Support"],"rover-electro":["Hybrid"],
    "calcharo":["DPS"],"encore":["DPS"],"verina":["Support"],"jianxin":["Hybrid"],"lingyang":["DPS"],"zhezhi":["Hybrid"],"shorekeeper":["Support"],
    "roccia":["Hybrid"],"phoebe":["Hybrid"],"brant":["Hybrid"],"cantarella":["Hybrid"],"zani":["DPS"],"ciaccona":["Hybrid"],"cartethyia":["DPS"],"lupa":["Hybrid"],"phrolova":["DPS"],
    "augusta":["DPS"],"iuno":["Hybrid"],"galbrena":["DPS"],"qiuyuan":["Hybrid"],"lynae":["Hybrid"],"mornye":["Support"],"luuk-herssen":["DPS"],"denia":["Hybrid"],"aemeath":["DPS"],
    "hiyuki":["DPS"],"sigrika":["DPS"],"lucilla":["Hybrid"],"lucy":["DPS"],"rebecca":["Hybrid"],"chisa":["Support"],"yangyang-xuanling":["DPS"],"suisui":["Support"]
  };

  profiles.forEach(p=>{
    p.roles = rolesById[p.id] || ["DPS"];
    p.role = p.roles[0];
    p.rarity = p.rarity || (fourStars.has(p.id) ? 4 : 5);
    p.weaponType = weaponTypes[p.id] || "sword";
    p.avatar = p.id.startsWith("rover-") ? "assets/avatars/rover.webp" : `assets/avatars/${p.id}.webp`;
    p.attributeIcon = `assets/attributes/${p.attribute.toLowerCase()}.webp`;
    p.weaponIcon = `assets/weapons/${p.weaponType}.webp`;
    p.bestSet = bestSets[p.id] || "lingering-tunes";
    p.releaseOrder = releaseOrder[p.id] ?? 9999;
    p.builds = (buildConfigs[p.id] || [{
      id:"endgame",
      name:setById[p.bestSet]?.name || p.bestSet,
      useCase:p.provisional?"Pre-release reference":"Recommended build",
      bestSet:p.bestSet,
      setPlan:fullSet(p.bestSet)
    }]).map(b=>({
      ...b,
      bestSet:b.bestSet || p.bestSet,
      setPlan:b.setPlan || fullSet(b.bestSet || p.bestSet),
      secondarySetChoices:secondarySetChoicesByBuild[`${p.id}:${b.id}`] || b.secondarySetChoices || null
    }));
    p.modes = p.builds;
  });

  return {statMeta,rolls,mains,secondary,profiles,attributeColors,sonataSets,setById,sonataBuffs};
})();
