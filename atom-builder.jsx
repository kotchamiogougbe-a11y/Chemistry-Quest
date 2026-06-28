import React, { useState, useMemo, useRef, useEffect } from "react";

/* =========================================================================
   CHEMISTRY QUEST — Le Constructeur d'Atomes (Module 1 · Royaume de la Matière)
   Kotchami Ogougbe
   Soli Deo Gloria
   ========================================================================= */

/* --- Données : symbole, nom (FR), nombre de masse A de l'isotope courant --- */
const ELEMENTS = [
  ["H","Hydrogène",1],["He","Hélium",4],["Li","Lithium",7],["Be","Béryllium",9],
  ["B","Bore",11],["C","Carbone",12],["N","Azote",14],["O","Oxygène",16],
  ["F","Fluor",19],["Ne","Néon",20],["Na","Sodium",23],["Mg","Magnésium",24],
  ["Al","Aluminium",27],["Si","Silicium",28],["P","Phosphore",31],["S","Soufre",32],
  ["Cl","Chlore",35],["Ar","Argon",40],["K","Potassium",39],["Ca","Calcium",40],
  ["Sc","Scandium",45],["Ti","Titane",48],["V","Vanadium",51],["Cr","Chrome",52],
  ["Mn","Manganèse",55],["Fe","Fer",56],["Co","Cobalt",59],["Ni","Nickel",58],
  ["Cu","Cuivre",64],["Zn","Zinc",65],["Ga","Gallium",70],["Ge","Germanium",73],
  ["As","Arsenic",75],["Se","Sélénium",79],["Br","Brome",80],["Kr","Krypton",84],
  ["Rb","Rubidium",85],["Sr","Strontium",88],["Y","Yttrium",89],["Zr","Zirconium",91],
  ["Nb","Niobium",93],["Mo","Molybdène",96],["Tc","Technétium",98],["Ru","Ruthénium",101],
  ["Rh","Rhodium",103],["Pd","Palladium",106],["Ag","Argent",108],["Cd","Cadmium",112],
  ["In","Indium",115],["Sn","Étain",119],["Sb","Antimoine",122],["Te","Tellure",128],
  ["I","Iode",127],["Xe","Xénon",131],["Cs","Césium",133],["Ba","Baryum",137],
  ["La","Lanthane",139],["Ce","Cérium",140],["Pr","Praséodyme",141],["Nd","Néodyme",144],
  ["Pm","Prométhium",145],["Sm","Samarium",150],["Eu","Europium",152],["Gd","Gadolinium",157],
  ["Tb","Terbium",159],["Dy","Dysprosium",163],["Ho","Holmium",165],["Er","Erbium",167],
  ["Tm","Thulium",169],["Yb","Ytterbium",173],["Lu","Lutécium",175],["Hf","Hafnium",178],
  ["Ta","Tantale",181],["W","Tungstène",184],["Re","Rhénium",186],["Os","Osmium",190],
  ["Ir","Iridium",192],["Pt","Platine",195],["Au","Or",197],["Hg","Mercure",201],
  ["Tl","Thallium",204],["Pb","Plomb",207],["Bi","Bismuth",209],["Po","Polonium",209],
  ["At","Astate",210],["Rn","Radon",222],["Fr","Francium",223],["Ra","Radium",226],
  ["Ac","Actinium",227],["Th","Thorium",232],["Pa","Protactinium",231],["U","Uranium",238],
  ["Np","Neptunium",237],["Pu","Plutonium",244],["Am","Américium",243],["Cm","Curium",247],
  ["Bk","Berkélium",247],["Cf","Californium",251],["Es","Einsteinium",252],["Fm","Fermium",257],
  ["Md","Mendélévium",258],["No","Nobélium",259],["Lr","Lawrencium",262],["Rf","Rutherfordium",267],
  ["Db","Dubnium",270],["Sg","Seaborgium",271],["Bh","Bohrium",270],["Hs","Hassium",277],
  ["Mt","Meitnérium",276],["Ds","Darmstadtium",281],["Rg","Roentgenium",282],["Cn","Copernicium",285],
  ["Nh","Nihonium",286],["Fl","Flérovium",289],["Mc","Moscovium",290],["Lv","Livermorium",293],
  ["Ts","Tennesse",294],["Og","Oganesson",294],
];

/* --- Familles chimiques : libellé + couleur --- */
const CATS = {
  nonmetal:   { l: "Non-métal",            le: "Nonmetal", la: "لا فلز",              c: "#54BF5E" },
  noble:      { l: "Gaz noble",            le: "Noble gas", la: "غاز نبيل",             c: "#3CA0D6" },
  alcalin:    { l: "Métal alcalin",        le: "Alkali metal", la: "فلز قلوي",          c: "#DC4F86" },
  alcalino:   { l: "Alcalino-terreux",     le: "Alkaline-earth", la: "فلز قلوي ترابي",        c: "#E07E40" },
  metalloide: { l: "Métalloïde",           le: "Metalloid", la: "شبه فلز",             c: "#9A78D6" },
  halogene:   { l: "Halogène",             le: "Halogen", la: "هالوجين",               c: "#D8A93A" },
  transition: { l: "Métal de transition",  le: "Transition metal", la: "فلز انتقالي",      c: "#4683C9" },
  posttrans:  { l: "Métal pauvre",         le: "Post-transition metal", la: "فلز ما بعد انتقالي", c: "#3FAE93" },
  lanthanide: { l: "Lanthanide",           le: "Lanthanide", la: "لانثانيد",            c: "#D06AA0" },
  actinide:   { l: "Actinide",             le: "Actinide", la: "أكتينيد",              c: "#B057C9" },
};

function catOf(Z) {
  const set = (a) => a.includes(Z);
  if (set([3,11,19,37,55,87])) return "alcalin";
  if (set([4,12,20,38,56,88])) return "alcalino";
  if (set([5,14,32,33,51,52])) return "metalloide";
  if (set([1,6,7,8,15,16,34])) return "nonmetal";
  if (set([9,17,35,53,85,117])) return "halogene";
  if (set([2,10,18,36,54,86,118])) return "noble";
  if (set([13,31,49,50,81,82,83,84,113,114,115,116])) return "posttrans";
  if (Z >= 57 && Z <= 71) return "lanthanide";
  if (Z >= 89 && Z <= 103) return "actinide";
  return "transition";
}

/* --- Le savais-tu : quelques éléments phares --- */
const FACTS = {
  1: "L'élément le plus abondant de l'Univers — le carburant des étoiles.",
  2: "Si léger qu'il s'échappe lentement de l'atmosphère vers l'espace.",
  6: "La colonne vertébrale de toute la chimie du vivant.",
  7: "78 % de l'air que tu respires.",
  8: "Indispensable à la respiration et à la combustion.",
  11: "Un métal mou qui réagit violemment au contact de l'eau.",
  13: "Léger et abondant : des avions jusqu'aux canettes.",
  17: "Désinfecte l'eau potable… mais fut aussi un gaz de combat.",
  26: "Le cœur de l'acier et de l'hémoglobine de ton sang.",
  29: "Conduit l'électricité dans presque tous tes câbles.",
  47: "Le meilleur conducteur électrique connu.",
  79: "Si stable qu'il résiste à la corrosion depuis des millénaires.",
  82: "Dense et toxique : longtemps utilisé, aujourd'hui surveillé.",
  92: "Sa fission libère l'énergie nucléaire.",
  94: "Combustible de certains réacteurs et sondes spatiales.",
};

/* --- Utilité dans la vie réelle (sélection d'éléments) --- */
const USAGE = {
  1: "le carburant des fusées et des piles à combustible",
  2: "le gonflage des ballons et le refroidissement des appareils d'IRM",
  3: "les batteries des téléphones et des voitures électriques",
  4: "les alliages légers de l'aérospatiale",
  5: "le verre résistant (Pyrex) et les détergents",
  6: "toute la matière vivante, du diamant au graphite, et l'acier",
  7: "les engrais et la conservation des aliments",
  8: "la respiration, la soudure et la médecine",
  9: "le dentifrice et les revêtements antiadhésifs (Téflon)",
  10: "les enseignes lumineuses",
  11: "le sel de table et l'éclairage des villes",
  12: "les alliages légers et les feux d'artifice",
  13: "les canettes, les avions et les emballages",
  14: "les puces électroniques et le verre",
  15: "les engrais et les allumettes",
  16: "la fabrication du caoutchouc et de l'acide sulfurique",
  17: "la désinfection de l'eau et l'eau de Javel",
  18: "les ampoules et la soudure sous atmosphère protectrice",
  19: "les engrais et le bon fonctionnement des muscles",
  20: "les os, les dents, le ciment et la craie",
  22: "les prothèses médicales et les avions",
  23: "les aciers très résistants des outils",
  24: "le chromage et l'acier inoxydable",
  25: "les aciers solides et certaines piles",
  26: "l'acier, la construction et l'hémoglobine du sang",
  27: "les aimants puissants et les batteries",
  28: "les pièces de monnaie et l'acier inoxydable",
  29: "les fils électriques et la plomberie",
  30: "la galvanisation anti-rouille et les piles",
  31: "les LED et les semi-conducteurs",
  32: "les fibres optiques et l'électronique",
  33: "les semi-conducteurs (et c'est un poison célèbre)",
  34: "les cellules solaires et les photocopieurs",
  35: "les retardateurs de flamme et la photographie",
  36: "certains éclairages et lasers",
  37: "les horloges atomiques",
  38: "la couleur rouge des feux d'artifice",
  47: "les bijoux, les miroirs et la photographie",
  48: "les piles rechargeables",
  50: "la soudure et les boîtes de conserve (fer-blanc)",
  51: "les alliages et certains semi-conducteurs",
  53: "l'antiseptique et la santé de la thyroïde",
  54: "les phares de voiture et l'anesthésie",
  55: "les horloges atomiques qui définissent la seconde",
  56: "l'imagerie médicale de l'estomac (radiographies)",
  74: "les filaments d'ampoules et les outils de coupe",
  78: "les bijoux et les pots catalytiques des voitures",
  79: "les bijoux, l'électronique et les réserves financières",
  80: "les anciens thermomètres et certaines lampes",
  82: "les batteries de voiture et la protection contre les rayons X",
  83: "certains médicaments pour l'estomac",
  84: "les sources de chaleur de quelques sondes spatiales",
  86: "un gaz radioactif à surveiller dans les habitations",
  88: "autrefois les peintures luminescentes (très radioactif)",
  92: "le combustible des centrales nucléaires",
  94: "les réacteurs et les sondes spatiales lointaines",
};

/* --- Savants qui ont découvert / marqué certains éléments --- */
const SAVANTS = {
  1: ["Henry Cavendish", "Il identifie l'« air inflammable » en 1766."],
  2: ["Janssen & Lockyer", "Repéré dans le Soleil avant d'être trouvé sur Terre."],
  7: ["Daniel Rutherford", "Il isole l'azote en 1772."],
  8: ["Antoine Lavoisier", "Il le nomme « oxygène » et fonde la chimie moderne."],
  11: ["Humphry Davy", "Isolé par électrolyse en 1807."],
  15: ["Hennig Brand", "Premier élément découvert par une personne nommée (1669)."],
  17: ["Carl Wilhelm Scheele", "Chimiste qui découvrit aussi l'oxygène."],
  19: ["Humphry Davy", "Isolé par électrolyse, comme le sodium."],
  20: ["Humphry Davy", "Isolé par électrolyse en 1808."],
  43: ["Emilio Segrè", "Premier élément entièrement fabriqué par l'homme."],
  53: ["Bernard Courtois", "Découvert par hasard à partir d'algues (1811)."],
  84: ["Marie & Pierre Curie", "Nommé en l'honneur de la Pologne (1898)."],
  88: ["Marie & Pierre Curie", "Sa radioactivité a révolutionné la science."],
  92: ["Martin Klaproth", "Nommé d'après la planète Uranus (1789)."],
  94: ["Glenn Seaborg", "Pionnier des éléments synthétiques."],
};

/* --- Éléments nommés en l'honneur de grands savants --- */
const NAMED_AFTER = {
  64: "Johan Gadolin, pionnier des terres rares",
  96: "Marie et Pierre Curie",
  99: "Albert Einstein",
  100: "Enrico Fermi",
  101: "Dmitri Mendeleïev, créateur du tableau périodique",
  102: "Alfred Nobel",
  103: "Ernest Lawrence",
  104: "Ernest Rutherford",
  106: "Glenn Seaborg",
  107: "Niels Bohr",
  109: "Lise Meitner",
  111: "Wilhelm Röntgen, découvreur des rayons X",
  112: "Nicolas Copernic",
  118: "Iouri Oganessian",
};

/* --- Mise en garde : éléments toxiques ou radioactifs --- */
const DANGER = {
  4: "Poussières toxiques.",
  9: "Très corrosif et réactif.",
  17: "Gaz irritant et toxique.",
  33: "Toxique — un poison historique.",
  35: "Corrosif et irritant.",
  48: "Toxique pour les reins.",
  55: "Réagit violemment avec l'eau.",
  80: "Toxique — vapeurs dangereuses.",
  82: "Toxique — affecte le système nerveux.",
  84: "Extrêmement radioactif.",
  85: "Très radioactif.",
  86: "Gaz radioactif — risque pour les poumons.",
  87: "Extrêmement radioactif.",
  88: "Hautement radioactif.",
  92: "Radioactif et toxique.",
  94: "Radioactif et très toxique.",
};
const ELDATA = [
  [1.008,-259.2,-252.9,0.0,2.2,"gaz",1766,"Henry Cavendish"],
  [4.003,null,-268.9,0.0,null,"gaz",1895,"Sir William Ramsey, Nils Langet, P.T.Cleve"],
  [6.94,180.5,1342.0,0.534,0.98,"solide",1817,"Johann Arfwedson"],
  [9.012,1287.0,2468.0,1.85,1.57,"solide",1798,"Fredrich Wöhler, A.A.Bussy"],
  [10.81,2077.0,4000.0,2.34,2.04,"solide",1808,"Sir H. Davy, J.L. Gay-Lussac, L.J. Thénard"],
  [12.011,null,3825.0,2.2,2.55,"solide",null,"Connu depuis l'Antiquité"],
  [14.007,-210.0,-195.8,0.001,3.04,"gaz",1772,"Daniel Rutherford"],
  [15.999,-218.8,-183.0,0.001,3.44,"gaz",1774,"Joseph Priestly, Carl Wilhelm Scheele"],
  [18.998,-219.7,-188.1,0.002,3.98,"gaz",1886,"Henri Moissan"],
  [20.18,-248.6,-246.0,0.001,null,"gaz",1898,"Sir William Ramsey, M.W. Travers"],
  [22.99,97.8,882.9,0.97,0.93,"solide",1807,"Sir Humphrey Davy"],
  [24.305,650.0,1090.0,1.74,1.31,"solide",1808,"Sir Humphrey Davy"],
  [26.982,660.3,2519.0,2.7,1.61,"solide",1825,"Hans Christian Oersted"],
  [28.085,1414.0,3265.0,2.33,1.9,"solide",1824,"Jöns Berzelius"],
  [30.974,null,null,1.823,2.19,"?",1669,"Hennig Brand"],
  [32.06,null,444.6,2.07,2.58,"solide",null,"Connu depuis l'Antiquité"],
  [35.45,-101.5,-34.0,0.003,3.16,"gaz",1774,"Carl Wilhelm Scheele"],
  [39.948,-189.3,-185.8,0.002,null,"gaz",1894,"Sir William Ramsey, Baron Rayleigh"],
  [39.098,63.5,759.0,0.89,0.82,"solide",1807,"Sir Humphrey Davy"],
  [40.078,842.0,1484.0,1.54,1.0,"solide",1808,"Sir Humphrey Davy"],
  [44.956,1541.0,2836.0,2.99,1.36,"solide",1879,"Lars Nilson"],
  [47.867,1670.0,3287.0,4.506,1.54,"solide",1791,"William Gregor"],
  [50.941,1910.0,3407.0,6.0,1.63,"solide",1830,"Nils Sefström"],
  [51.996,1907.0,2671.0,7.15,1.66,"solide",1797,"Louis Vauquelin"],
  [54.938,1246.0,2061.0,7.3,1.55,"solide",1774,"Johann Gahn"],
  [55.845,1538.0,2861.0,7.87,1.83,"solide",null,"Connu depuis l'Antiquité"],
  [58.933,1495.0,2927.0,8.86,1.88,"solide",1739,"George Brandt"],
  [58.693,1455.0,2913.0,8.9,1.91,"solide",1751,"Axel Cronstedt"],
  [63.546,1084.6,2560.0,8.96,1.9,"solide",null,"Connu depuis l'Antiquité"],
  [65.38,419.5,907.0,7.134,1.65,"solide",null,"Connu depuis l'Antiquité"],
  [69.723,29.8,2229.0,5.91,1.81,"solide",1875,"Paul Émile Lecoq de Boisbaudran"],
  [72.63,938.3,2833.0,5.323,2.01,"solide",1886,"Clemens Winkler"],
  [74.922,817.0,616.0,5.75,2.18,"solide",null,"Connu depuis l'Antiquité"],
  [78.971,null,685.0,4.809,2.55,"solide",1818,"Jöns Berzelius"],
  [79.904,-7.2,58.8,3.103,2.96,"liquide",1826,"Antoine J. Balard"],
  [83.798,-157.4,-153.4,0.003,null,"gaz",1898,"Sir William Ramsey, M.W. Travers"],
  [85.468,39.3,688.0,1.53,0.82,"solide",1861,"R. Bunsen, G. Kirchoff"],
  [87.62,777.0,1377.0,2.64,0.95,"solide",1790,"A. Crawford"],
  [88.906,1522.0,3345.0,4.47,1.22,"solide",1789,"Johann Gadolin"],
  [91.224,1854.0,4406.0,6.52,1.33,"solide",1789,"Martin Klaproth"],
  [92.906,2477.0,4741.0,8.57,1.6,"solide",1801,"Charles Hatchet"],
  [95.95,2622.0,4639.0,10.2,2.16,"solide",1778,"Carl Wilhelm Scheele"],
  [97.907,2157.0,4262.0,11.0,2.1,"solide",1937,"Carlo Perrier, Émillo Segrè"],
  [101.07,2333.0,4147.0,12.1,2.2,"solide",1844,"Karl Klaus"],
  [102.906,1963.0,3695.0,12.4,2.28,"solide",1803,"William Wollaston"],
  [106.42,1554.8,2963.0,12.0,2.2,"solide",1803,"William Wollaston"],
  [107.868,961.8,2162.0,10.5,1.93,"solide",null,"Connu depuis l'Antiquité"],
  [112.414,321.1,767.0,8.69,1.69,"solide",1817,"Fredrich Stromeyer"],
  [114.818,156.6,2027.0,7.31,1.78,"solide",1863,"Ferdinand Reich, T. Richter"],
  [118.71,null,2586.0,7.287,1.96,"solide",null,"Connu depuis l'Antiquité"],
  [121.76,630.6,1587.0,6.68,2.05,"solide",null,"Connu depuis l'Antiquité"],
  [127.6,449.5,988.0,6.232,2.1,"solide",1782,"Franz Müller von Reichenstein"],
  [126.904,113.7,184.4,4.933,2.66,"solide",1811,"Bernard Courtois"],
  [131.293,-111.8,-108.1,0.005,2.6,"gaz",1898,"Sir William Ramsay; M. W. Travers"],
  [132.905,28.5,671.0,1.873,0.79,"solide",1860,"Gustov Kirchoff, Robert Bunsen"],
  [137.327,727.0,1845.0,3.62,0.89,"solide",1808,"Sir Humphrey Davy"],
  [138.905,920.0,3464.0,6.15,1.1,"solide",1839,"Carl Mosander"],
  [140.116,799.0,3443.0,6.77,1.12,"solide",1803,"W. von Hisinger, J. Berzelius, M. Klaproth"],
  [140.908,931.0,3520.0,6.773,1.13,"solide",1885,"C.F. Aver von Welsbach"],
  [144.242,1016.0,3074.0,7.01,1.14,"solide",1925,"C.F. Aver von Welsbach"],
  [144.913,1042.0,null,7.26,null,"solide",1945,"J.A. Marinsky, L.E. Glendenin, C.D. Coryell"],
  [150.36,1072.0,1794.0,7.52,1.17,"solide",1879,"Paul Émile Lecoq de Boisbaudran"],
  [151.964,822.0,1529.0,5.24,null,"solide",1901,"Eugène Demarçay"],
  [157.25,1313.0,3273.0,7.9,1.2,"solide",1880,"Jean de Marignac"],
  [158.925,1359.0,3230.0,8.23,null,"solide",1843,"Carl Mosander"],
  [162.5,1412.0,2567.0,8.55,1.22,"solide",1886,"Paul Émile Lecoq de Boisbaudran"],
  [164.93,1472.0,2700.0,8.8,1.23,"solide",1878,"J.L. Soret"],
  [167.259,1529.0,2868.0,9.07,1.24,"solide",1843,"Carl Mosander"],
  [168.934,1545.0,1950.0,9.321,1.25,"solide",1879,"Per Theodor Cleve"],
  [173.045,824.0,1196.0,6.9,null,"solide",1878,"Jean de Marignac"],
  [174.967,1663.0,3402.0,9.84,1.0,"solide",1907,"Georges Urbain"],
  [178.49,2233.0,4600.0,13.3,1.3,"solide",1923,"Dirk Coster, Georg von Hevesy"],
  [180.948,3017.0,5455.0,16.4,1.5,"solide",1802,"Anders Ekeberg"],
  [183.84,3414.0,5555.0,19.3,1.7,"solide",1783,"Fausto and Juan José de Elhuyar"],
  [186.207,3185.0,5590.0,20.8,1.9,"solide",1925,"Walter Noddack, Ida Tacke, Otto Berg"],
  [190.23,3033.0,5008.0,22.587,2.2,"solide",1804,"Smithson Tenant"],
  [192.217,2446.0,4428.0,22.562,2.2,"solide",1804,"S.Tenant, A.F.Fourcory, L.N.Vauquelin, H.V.Collet-Descoltils"],
  [195.084,1768.2,3825.0,21.5,2.2,"solide",1735,"Julius Scaliger"],
  [196.967,1064.2,2836.0,19.3,2.4,"solide",null,"Connu depuis l'Antiquité"],
  [200.592,-38.8,356.6,13.534,1.9,"liquide",null,"Connu depuis l'Antiquité"],
  [204.38,304.0,1473.0,11.8,1.8,"solide",1861,"Sir William Crookes"],
  [207.2,327.5,1749.0,11.3,1.8,"solide",null,"Connu depuis l'Antiquité"],
  [208.98,271.4,1564.0,9.79,1.9,"solide",null,"Connu depuis l'Antiquité"],
  [209.0,254.0,962.0,9.2,2.0,"solide",1898,"Pierre and Marie Curie"],
  [210.0,302.0,null,7.0,2.2,"solide",1940,"D.R.Corson, K.R.MacKenzie, E.Segré"],
  [222.0,-71.0,-61.7,0.009,null,"gaz",1898,"Fredrich Ernst Dorn"],
  [223.0,21.0,null,1.87,0.7,"liquide",1939,"Marguerite Derey"],
  [226.0,696.0,null,5.0,0.9,"solide",1898,"Pierre and Marie Curie"],
  [227.0,1050.0,3200.0,10.0,1.1,"solide",1899,"André Debierne"],
  [232.038,1750.0,4785.0,11.7,1.3,"solide",1828,"Jöns Berzelius"],
  [231.036,1572.0,null,15.4,1.5,"solide",1917,"Fredrich Soddy, John Cranston, Otto Hahn, Lise Meitner"],
  [238.029,1135.0,4131.0,19.1,1.7,"solide",1789,"Martin Klaproth"],
  [237.0,644.0,null,20.2,1.3,"solide",1940,"E.M. McMillan, P.H. Abelson"],
  [244.0,640.0,3228.0,19.7,1.3,"solide",1940,"G.T.Seaborg, J.W.Kennedy, E.M.McMillan, A.C.Wohl"],
  [243.0,1176.0,null,12.0,null,"solide",1945,"G.T.Seaborg, R.A.James, L.O.Morgan, A.Ghiorso"],
  [247.0,1345.0,null,13.51,null,"solide",1944,"G.T.Seaborg, R.A.James, A.Ghiorso"],
  [247.0,986.0,null,14.78,null,"solide",1949,"G.T.Seaborg, S.G.Tompson, A.Ghiorso"],
  [251.0,900.0,null,15.1,null,"solide",1950,"G.T.Seaborg, S.G.Tompson, A.Ghiorso, K.Street Jr"],
  [252.0,860.0,null,8.84,null,"solide",1952,"Argonne, Los Alamos, U of Calif"],
  [257.0,1527.0,null,9.7,null,"solide",1953,"Argonne, Los Alamos, U of Calif"],
  [258.0,827.0,null,10.3,null,"solide",1955,"G.T.Seaborg, S.G.Tompson, A.Ghiorso, K.Street Jr"],
  [259.0,827.0,null,9.9,null,"solide",1957,"Nobel Institute for Physics"],
  [262.0,1627.0,null,15.6,null,"solide",1961,"A.Ghiorso, T.Sikkeland, A.E.Larsh, R.M.Latimer"],
  [267.0,null,null,23.3,null,"?",1969,"A. Ghiorso, et al"],
  [268.0,null,null,29.3,null,"?",1970,"A. Ghiorso, et al"],
  [271.0,null,null,35.0,null,"?",1974,"Soviet Nuclear Research/ U. of Cal at Berkeley"],
  [274.0,null,null,37.1,null,"?",1976,"Heavy Ion Research Laboratory (HIRL)"],
  [269.0,null,null,40.7,null,"?",1984,"Heavy Ion Research Laboratory (HIRL)"],
  [276.0,null,null,37.4,null,"?",1982,"Heavy Ion Research Laboratory (HIRL)"],
  [281.0,null,null,34.8,null,"?",1994,"Heavy Ion Research Laboratory (HIRL)"],
  [281.0,null,null,28.7,null,"?",1994,"Heavy Ion Research Laboratory (HIRL)"],
  [285.0,null,null,14.0,null,"?",1996,"GSI Helmholtz Centre for Heavy Ion Research"],
  [286.0,null,null,16.0,null,"?",2015,"RIKEN"],
  [289.0,null,null,9.928,null,"?",1998,"Joint Institute for Nuclear Research"],
  [288.0,null,null,13.5,null,"?",2003,"Joint Institute for Nuclear Research"],
  [293.0,null,null,12.9,null,"?",2000,"Lawrence Livermore National Laboratory"],
  [294.0,null,null,7.2,null,"?",2010,"Joint Institute for Nuclear Research/Oak Ridge National Laboratory"],
  [294.0,null,null,7.0,null,"?",2002,"Joint Institute for Nuclear Research"]
];

/* --- Configuration électronique (couches) par remplissage d'Aufbau --- */
function shellsFor(Z) {
  const order = [
    [1,0],[2,0],[2,1],[3,0],[3,1],[4,0],[3,2],[4,1],[5,0],[4,2],[5,1],
    [6,0],[4,3],[5,2],[6,1],[7,0],[5,3],[6,2],[7,1],
  ];
  const cap = { 0: 2, 1: 6, 2: 10, 3: 14 };
  let e = Z;
  const byN = {};
  for (const [n, l] of order) {
    if (e <= 0) break;
    const c = Math.min(cap[l], e);
    byN[n] = (byN[n] || 0) + c;
    e -= c;
  }
  const arr = [];
  for (let n = 1; n <= 7; n++) if (byN[n]) arr.push(byN[n]);
  return arr;
}

const SHELL_LETTERS = ["K", "L", "M", "N", "O", "P", "Q"];

/* --- Configuration en sous-couches (n, l) par remplissage d'Aufbau --- */
const AUFBAU = [
  [1,0],[2,0],[2,1],[3,0],[3,1],[4,0],[3,2],[4,1],[5,0],[4,2],[5,1],
  [6,0],[4,3],[5,2],[6,1],[7,0],[5,3],[6,2],[7,1],
];
const SUBCAP = { 0: 2, 1: 6, 2: 10, 3: 14 };
const SUB = {
  0: { k: "s", c: "#E8C778" },
  1: { k: "p", c: "#6FD3E8" },
  2: { k: "d", c: "#86D79A" },
  3: { k: "f", c: "#B98AE0" },
};
function subshellsFor(Z) {
  let e = Z;
  const out = [];
  for (const [n, l] of AUFBAU) {
    if (e <= 0) break;
    const c = Math.min(SUBCAP[l], e);
    out.push({ n, l, count: c });
    e -= c;
  }
  return out;
}

/* --- Position dans le tableau périodique (grille 18 colonnes) --- */
/* Élément radioactif = sans aucun isotope stable : Tc(43), Pm(61) et tout à partir de Po(84) */
const isRadio = (z) => z === 43 || z === 61 || z >= 84;

function gridPos(Z) {
  if (Z >= 57 && Z <= 71) return { r: 8, c: 3 + (Z - 57) };
  if (Z >= 89 && Z <= 103) return { r: 9, c: 3 + (Z - 89) };
  if (Z === 1) return { r: 1, c: 1 };
  if (Z === 2) return { r: 1, c: 18 };
  if (Z >= 3 && Z <= 10) { const o = Z - 3; return { r: 2, c: o < 2 ? o + 1 : o + 11 }; }
  if (Z >= 11 && Z <= 18) { const o = Z - 11; return { r: 3, c: o < 2 ? o + 1 : o + 11 }; }
  if (Z >= 19 && Z <= 36) return { r: 4, c: Z - 18 };
  if (Z >= 37 && Z <= 54) return { r: 5, c: Z - 36 };
  if (Z >= 55 && Z <= 56) return { r: 6, c: Z - 54 };
  if (Z >= 72 && Z <= 86) return { r: 6, c: Z - 68 };
  if (Z >= 87 && Z <= 88) return { r: 7, c: Z - 86 };
  if (Z >= 104 && Z <= 118) return { r: 7, c: Z - 100 };
  return null;
}

/* === Atome dessiné en SVG : orbites planétaires + noyau manipulable === */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// --- petites matrices de rotation 3D (row-major) ---
const IDENTITY = [1, 0, 0, 0, 1, 0, 0, 0, 1];
const matMul = (a, b) => {
  const r = new Array(9);
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      r[i * 3 + j] = a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j];
  return r;
};
const rotX = (t) => { const c = Math.cos(t), s = Math.sin(t); return [1, 0, 0, 0, c, -s, 0, s, c]; };
const rotY = (t) => { const c = Math.cos(t), s = Math.sin(t); return [c, 0, s, 0, 1, 0, -s, 0, c]; };
const rotZ = (t) => { const c = Math.cos(t), s = Math.sin(t); return [c, -s, 0, s, c, 0, 0, 0, 1]; };

function AtomView({ Z, neutrons, color, lang }) {
  const L = I18N[lang];
  const shells = useMemo(() => shellsFor(Z), [Z]);
  const protons = Z;
  const [target, setTarget] = useState("orbits"); // 'orbits' | 'nucleus'

  // Un anneau par SOUS-COUCHE (s, p, d, f), regroupés par couche et espacés
  const orbits = useMemo(() => {
    const subs = subshellsFor(Z).slice().sort((a, b) => a.n - b.n || a.l - b.l);
    if (!subs.length) return [];
    const big = 26, small = 12;     // grand écart entre couches, petit entre sous-couches
    let raw = 0, prevN = subs[0].n;
    const r0 = subs.map((s, i) => {
      if (i > 0) raw += (s.n !== prevN ? big : small);
      prevN = s.n;
      return raw;
    });
    const inner = 64, budget = 212; // anneau interne toujours hors du noyau
    const spread = Math.max(1, r0[r0.length - 1]);
    const scale = Math.min(1, (budget - inner) / spread);
    return subs.map((s, i) => {
      const R = inner + r0[i] * scale;
      const ax = 1.18 - Math.min(i, 7) * 0.05; // inclinaison du plan
      return {
        count: s.count, n: s.n, l: s.l, R,
        sinAx: Math.sin(ax), cosAx: Math.cos(ax),
        ay0: i * 0.7, ay: 0.14 + (i % 5) * 0.03,
        espeed: 0.6 / (1 + i * 0.16),
      };
    });
  }, [Z]);

  const electronsMeta = useMemo(() => {
    const list = [];
    orbits.forEach((o, oi) => {
      for (let j = 0; j < o.count; j++) {
        list.push({ oi, l: o.l, color: SUB[o.l].c,
                    base: (j / o.count) * Math.PI * 2, speed: o.espeed });
      }
    });
    return list;
  }, [orbits]);

  const nodeRefs = useRef([]);
  const orbitPathRefs = useRef([]);
  const nucleusRefs = useRef([]);
  const quarkRefs = useRef([]);
  const quarkLabelRefs = useRef([]);
  const quarkGroupRef = useRef(null);
  const sceneRef = useRef(null);
  const svgRef = useRef(null);

  // État de manipulation (hors React pour rester fluide)
  const view = useRef({ Ro: IDENTITY.slice(), Rn: IDENTITY.slice(), zoom: 1, dragging: false,
                        lx: 0, ly: 0, pinchD: 0, pinchZoom: 1, target: "orbits" });
  view.current.target = target; // garde la cible de rotation à jour pour la boucle
  const pointers = useRef(new Map());

  const focal = 440; // perspective compacte → noyau structuré et contenu

  // Nucléons remplissant le VOLUME d'une sphère (cœur compact), pas seulement la surface
  const nucleus = useMemo(() => {
    const total = protons + neutrons;
    const sphereR = Math.min(48, 13 + Math.cbrt(total) * 7.5);
    const dotR = clamp((sphereR / Math.cbrt(total)) * 0.62, 2, 7);
    const golden = Math.PI * (3 - Math.sqrt(5));
    const pts = [];
    let pc = 0;
    for (let k = 0; k < total; k++) {
      const rr = Math.cbrt((k + 0.5) / total);          // densité uniforme dans le volume
      const y = 1 - 2 * ((k * 0.6180339887) % 1);       // direction décorrélée du rayon
      const s = Math.sqrt(Math.max(0, 1 - y * y));
      const phi = k * golden;
      const want = Math.round(((k + 1) * protons) / total);
      const isProton = want > pc;
      if (isProton) pc++;
      pts.push({ x: rr * s * Math.cos(phi), y: rr * y, z: rr * s * Math.sin(phi), p: isProton });
    }
    return { pts, sphereR, dotR, coreR: sphereR * (focal / (focal - sphereR)) + dotR * 1.6 + 3 };
  }, [protons, neutrons]);

  // Molette = zoom (écouteur natif non passif)
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const v = view.current;
      v.zoom = clamp(v.zoom * (1 - e.deltaY * 0.0015), 0.6, 30);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Boucle d'animation : l'atome entier (orbites + électrons + noyau) zoome ensemble
  useEffect(() => {
    const reduce = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const meta = electronsMeta;
    const { pts, sphereR, dotR } = nucleus;
    // focal défini au niveau du composant (noyau compact et structuré)
    const order = pts.map((_, i) => i);
    const parent = () => nucleusRefs.current.find(Boolean)?.parentNode;
    let prevT = 0;

    const place = (t) => {
      const dt = Math.min(0.05, t - prevT);
      prevT = t;
      const v = view.current;
      // rotation automatique douce, indépendante pour orbites et noyau ;
      // on n'auto-anime pas la cible qu'on manipule à l'instant
      const dragT = v.dragging ? v.target : null;
      if (!reduce) {
        const ao = matMul(rotY(dt * 0.16), rotX(dt * 0.05));
        const an = matMul(rotY(dt * 0.20), rotZ(dt * 0.10));
        if (dragT !== "orbits")  v.Ro = matMul(ao, v.Ro);
        if (dragT !== "nucleus") v.Rn = matMul(an, v.Rn);
      }
      // zoom appliqué à TOUTE la scène (noyau + orbites + électrons)
      if (sceneRef.current) sceneRef.current.setAttribute("transform", `scale(${v.zoom.toFixed(3)})`);

      const Ro = v.Ro; // matrice des orbites + électrons
      const Rn = v.Rn; // matrice du noyau + quarks

      // --- orbites mobiles : anneaux 3D qui précessent ET suivent le geste ---
      const focalE = 520, N = 40;
      const tE = reduce ? 0.6 : t;
      const ost = [];
      for (let i = 0; i < orbits.length; i++) {
        const o = orbits[i];
        const ang = o.ay0 + o.ay * tE;
        const cAng = Math.cos(ang), sAng = Math.sin(ang);
        ost.push({ R: o.R, sAx: o.sinAx, cAx: o.cosAx, cAng, sAng });
        const path = orbitPathRefs.current[i];
        if (path) {
          let d = "";
          for (let k = 0; k <= N; k++) {
            const th = (k / N) * Math.PI * 2;
            const ct = Math.cos(th), st = Math.sin(th);
            const ox = o.R * (ct * cAng + st * o.sinAx * sAng);
            const oy = o.R * st * o.cosAx;
            const oz = o.R * (-ct * sAng + st * o.sinAx * cAng);
            const X = Ro[0] * ox + Ro[1] * oy + Ro[2] * oz;
            const Y = Ro[3] * ox + Ro[4] * oy + Ro[5] * oz;
            const Z = Ro[6] * ox + Ro[7] * oy + Ro[8] * oz;
            const pp = focalE / (focalE - Z);
            d += (k === 0 ? "M" : "L") + (X * pp).toFixed(1) + " " + (Y * pp).toFixed(1);
          }
          path.setAttribute("d", d + "Z");
        }
      }
      // --- électrons : voyagent sur l'anneau mobile, eux aussi tournés par le geste ---
      for (let i = 0; i < meta.length; i++) {
        const n = nodeRefs.current[i];
        if (!n) continue;
        const m = meta[i];
        const s = ost[m.oi];
        if (!s) continue;
        const th = m.base + m.speed * tE;
        const ct = Math.cos(th), st = Math.sin(th);
        const ex = s.R * (ct * s.cAng + st * s.sAx * s.sAng);
        const ey = s.R * st * s.cAx;
        const ez = s.R * (-ct * s.sAng + st * s.sAx * s.cAng);
        const X = Ro[0] * ex + Ro[1] * ey + Ro[2] * ez;
        const Y = Ro[3] * ex + Ro[4] * ey + Ro[5] * ez;
        const Z = Ro[6] * ex + Ro[7] * ey + Ro[8] * ez;
        const pp = focalE / (focalE - Z);
        const depth = (Z / s.R + 1) / 2;
        n.setAttribute("cx", (X * pp).toFixed(2));
        n.setAttribute("cy", (Y * pp).toFixed(2));
        n.setAttribute("r", (3 + depth * 2.8).toFixed(2));
        n.style.opacity = (0.45 + depth * 0.55).toFixed(2);
      }

      // --- noyau : rotation 3D libre via matrice (horizontale, verticale, oblique) ---
      const depths = new Array(pts.length);
      const sxA = new Array(pts.length), syA = new Array(pts.length);
      const rrA = new Array(pts.length), dpA = new Array(pts.length);
      const showQ = v.zoom >= 2.4;
      for (let i = 0; i < pts.length; i++) {
        const node = nucleusRefs.current[i];
        if (!node) continue;
        const p = pts[i];
        const xr = Rn[0] * p.x + Rn[1] * p.y + Rn[2] * p.z;
        const yr = Rn[3] * p.x + Rn[4] * p.y + Rn[5] * p.z;
        const zr = Rn[6] * p.x + Rn[7] * p.y + Rn[8] * p.z;
        const persp = focal / (focal - zr * sphereR);
        const depth = (zr + 1) / 2;
        depths[i] = zr;
        const sx = xr * sphereR * persp, sy = yr * sphereR * persp;
        const rr = dotR * persp * (0.85 + depth * 0.2);
        sxA[i] = sx; syA[i] = sy; rrA[i] = rr; dpA[i] = depth;
        node.setAttribute("cx", sx.toFixed(2));
        node.setAttribute("cy", sy.toFixed(2));
        node.setAttribute("r", rr.toFixed(2));
        node.style.opacity = (0.4 + depth * 0.6).toFixed(2);
      }

      // quarks : pool fixe des QCAP nucléons les plus en avant (fonctionne pour TOUS les éléments)
      if (showQ) {
        const QCAP = 120;  // couvre le front des noyaux lourds (jusqu'a l'uranium)
        const ord = pts.map((_, i) => i).sort((a, b) => depths[a] - depths[b]); // arrière -> avant
        const start = Math.max(0, ord.length - QCAP);
        let slot = 0;
        for (let k = ord.length - 1; k >= start; k--) { // les plus en avant d'abord
          const i = ord[k];
          const p = pts[i];
          const sx = sxA[i], sy = syA[i], rr = rrA[i], depth = dpA[i];
          for (let q = 0; q < 3; q++) {
            const idx = slot * 3 + q;
            const flavor = p.p ? (q < 2 ? "u" : "d") : (q < 1 ? "u" : "d");
            const a = q * 2.0944; // 120°
            const qx = sx + rr * 0.4 * Math.cos(a);
            const qy = sy + rr * 0.4 * Math.sin(a);
            const qn = quarkRefs.current[idx];
            if (qn) {
              qn.setAttribute("class", flavor === "u" ? "cq-quark-u" : "cq-quark-d");
              qn.setAttribute("cx", qx.toFixed(2));
              qn.setAttribute("cy", qy.toFixed(2));
              qn.setAttribute("r", (rr * 0.42).toFixed(2));
              qn.style.opacity = (0.55 + depth * 0.45).toFixed(2);
              qn.style.display = "";
            }
            const lb = quarkLabelRefs.current[idx];
            if (lb) {
              lb.textContent = flavor;
              lb.setAttribute("x", qx.toFixed(2));
              lb.setAttribute("y", qy.toFixed(2));
              lb.setAttribute("font-size", (rr * 0.6).toFixed(2));
              lb.style.opacity = (0.7 + depth * 0.3).toFixed(2);
              lb.style.display = "";
            }
          }
          slot++;
        }
        for (let s = slot; s < QCAP; s++) { // masquer les slots non utilisés
          for (let q = 0; q < 3; q++) {
            const idx = s * 3 + q;
            const qn = quarkRefs.current[idx]; if (qn) qn.style.display = "none";
            const lb = quarkLabelRefs.current[idx]; if (lb) lb.style.display = "none";
          }
        }
      }
      if (quarkGroupRef.current) quarkGroupRef.current.style.display = showQ ? "" : "none";
      // ordre de tracé : fond d'abord (effet de volume)
      if (pts.length <= 400) {  // trie toujours en profondeur (volume net meme pour les noyaux denses)
        const par = parent();
        if (par) {
          order.sort((a, b) => depths[a] - depths[b]);
          for (const idx of order) {
            const nd = nucleusRefs.current[idx];
            if (nd) par.appendChild(nd);
          }
          if (quarkGroupRef.current) par.appendChild(quarkGroupRef.current); // quarks au-dessus
        }
      }
    };

    let raf;
    const loop = (ts) => {
      place(ts / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [electronsMeta, nucleus]);

  // --- gestes tactiles / souris ---
  const onPointerDown = (e) => {
    if (e.pointerType !== "touch") e.currentTarget.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const v = view.current;
    if (pointers.current.size === 1) {
      v.dragging = true; v.lx = e.clientX; v.ly = e.clientY;
    } else if (pointers.current.size === 2) {
      v.dragging = false;
      const [a, b] = [...pointers.current.values()];
      v.pinchD = Math.hypot(a.x - b.x, a.y - b.y);
      v.pinchZoom = v.zoom;
    }
  };
  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const v = view.current;
    if (pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (v.pinchD) v.zoom = clamp(v.pinchZoom * (d / v.pinchD), 0.6, 30);
    } else if (v.dragging) {
      // trackball : glissement horizontal → axe vertical ; vertical → axe horizontal
      const dx = (e.clientX - v.lx) * 0.01;
      const dy = (e.clientY - v.ly) * 0.01;
      const delta = matMul(rotY(dx), rotX(dy));
      if (v.target === "nucleus") v.Rn = matMul(delta, v.Rn);
      else v.Ro = matMul(delta, v.Ro);
      v.lx = e.clientX; v.ly = e.clientY;
    }
  };
  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId);
    const v = view.current;
    if (pointers.current.size === 0) { v.dragging = false; v.pinchD = 0; }
    else if (pointers.current.size === 1) {
      const [p] = [...pointers.current.values()];
      v.dragging = true; v.lx = p.x; v.ly = p.y; v.pinchD = 0;
    }
  };
  const setZoom = (f) => { const v = view.current; v.zoom = clamp(v.zoom * f, 0.6, 30); };
  const resetView = () => { const v = view.current; v.zoom = 1; v.Ro = IDENTITY.slice(); v.Rn = IDENTITY.slice(); };

  return (
    <>
      <svg ref={svgRef} viewBox="-250 -250 500 500" className="cq-atom" role="img"
           aria-label={`${NM(Z, lang)} — ${protons}p / ${neutrons}n`}
           onPointerDown={onPointerDown} onPointerMove={onPointerMove}
           onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        <rect x="-250" y="-250" width="500" height="500" fill="transparent" />
        <g ref={sceneRef}>
          {/* orbites mobiles (une par sous-couche, colorées s/p/d/f) + électrons */}
          <g>
            {orbits.map((o, i) => (
              <path key={i} className="cq-orbit" fill="none"
                    style={{ stroke: SUB[o.l].c, strokeOpacity: 0.5 }}
                    ref={(el) => { orbitPathRefs.current[i] = el; }} />
            ))}
            {electronsMeta.map((m, i) => (
              <circle key={i} r="5" className="cq-electron"
                      style={{ fill: m.color, filter: `drop-shadow(0 0 3px ${m.color}cc)` }}
                      ref={(el) => { nodeRefs.current[i] = el; }} />
            ))}
          </g>
          {/* noyau compact manipulable */}
          <g className="cq-nucleus">
            <defs>
              <radialGradient id={`core-${Z}`} cx="40%" cy="36%" r="68%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.40" />
                <stop offset="34%" stopColor={color} stopOpacity="0.34" />
                <stop offset="100%" stopColor="#070d1e" stopOpacity="0.92" />
              </radialGradient>
            </defs>
            <circle cx="0" cy="0" r={nucleus.coreR + 5} className="cq-nucleus-glow"
                    style={{ fill: color }} />
            <circle cx="0" cy="0" r={nucleus.coreR} fill={`url(#core-${Z})`} />
            {nucleus.pts.map((n, i) => (
              <circle key={i} r={nucleus.dotR}
                      className={n.p ? "cq-proton" : "cq-neutron"}
                      ref={(el) => { nucleusRefs.current[i] = el; }} />
            ))}
            <g ref={quarkGroupRef} style={{ display: "none" }}>
              {Array.from({ length: 120 }).map((_, s) =>
                [0, 1, 2].map((q) => {
                  const idx = s * 3 + q;
                  return (
                    <React.Fragment key={idx}>
                      <circle r="1" className="cq-quark-u" style={{ display: "none" }}
                              ref={(el) => { quarkRefs.current[idx] = el; }} />
                      <text className="cq-quark-lbl" textAnchor="middle"
                            dominantBaseline="central" style={{ display: "none" }}
                            ref={(el) => { quarkLabelRefs.current[idx] = el; }}>u</text>
                    </React.Fragment>
                  );
                })
              )}
            </g>
          </g>
        </g>
      </svg>

      <div className="cq-atom-controls">
        <div className="cq-rot-grp" role="group" aria-label={L.rotate}>
          <span className="cq-rot-lab">{L.rotate} :</span>
          <button className={"cq-rot-btn" + (target === "orbits" ? " on" : "")}
                  onClick={() => setTarget("orbits")}>{L.orbits}</button>
          <button className={"cq-rot-btn" + (target === "nucleus" ? " on" : "")}
                  onClick={() => setTarget("nucleus")}>{L.nucleus}</button>
        </div>
        <span className="cq-hint">{L.atomHint}</span>
        <div className="cq-zoom-grp">
          <button className="cq-zoom-btn" onClick={() => setZoom(0.72)}
                  aria-label="Zoom −">−</button>
          <button className="cq-zoom-btn" onClick={resetView}
                  aria-label="Reset">⌖</button>
          <button className="cq-zoom-btn" onClick={() => setZoom(1.4)}
                  aria-label="Zoom +">+</button>
        </div>
      </div>

      <div className="cq-sub-legend">
        <span className="cq-sub-lab">{L.nucleus}</span>
        <span className="cq-sub-chip"><i style={{ background: "#E85A47" }} />{L.protons} ({protons})</span>
        <span className="cq-sub-chip"><i style={{ background: "#8C9AB4" }} />{L.neutrons} ({neutrons})</span>
      </div>

      <div className="cq-sub-legend">
        <span className="cq-sub-lab">{L.quarks}</span>
        <span className="cq-sub-chip"><i style={{ background: "#F2A65A" }} />up (u)</span>
        <span className="cq-sub-chip"><i style={{ background: "#5A8CF2" }} />down (d)</span>
        <span className="cq-quark-note">— p = u·u·d · n = u·d·d</span>
      </div>

      <div className="cq-sub-legend">
        <span className="cq-sub-lab">{L.subshells}</span>
        {[...new Set(orbits.map((o) => o.l))].sort().map((l) => (
          <span key={l} className="cq-sub-chip">
            <i style={{ background: SUB[l].c }} />{SUB[l].k}
          </span>
        ))}
      </div>
    </>
  );
}

/* === Tableau périodique compact === */
function PeriodicTable({ Z, onPick, lang }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current?.querySelector(`[data-z="${Z}"]`);
    if (el) el.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [Z]);

  return (
    <div className="cq-ptable-scroll" ref={ref}>
      <div className="cq-ptable">
        {ELEMENTS.map((el, i) => {
          const z = i + 1;
          const pos = gridPos(z);
          if (!pos) return null;
          const cat = catOf(z);
          const active = z === Z;
          const m = ELDATA[z - 1][0];
          const mass = m < 10 ? m.toFixed(2) : m < 100 ? m.toFixed(1) : Math.round(m);
          return (
            <button
              key={z}
              data-z={z}
              onClick={() => onPick(z)}
              className={"cq-cell" + (active ? " is-active" : "")}
              style={{
                gridRow: pos.r, gridColumn: pos.c,
                "--cc": CATS[cat].c,
              }}
              title={`${NM(z, lang)} (Z=${z}) · ${m} u`}
              aria-label={`${NM(z, lang)} · Z=${z} · ${m} u`}
              aria-pressed={active}
            >
              <div className="cq-cell-head">
                <span className="cq-cell-z">{z}</span>
                <span className="cq-cell-mass">{mass}</span>
              </div>
              <span className="cq-cell-sym">{el[0]}</span>
              {isRadio(z) && <span className="cq-cell-radio" aria-hidden="true">☢</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* === Mode Défi : génération des missions et vérification === */
/* ===================== VERSION ANGLAISE (i18n) ===================== */
const EL_EN = ["Hydrogen","Helium","Lithium","Beryllium","Boron","Carbon","Nitrogen","Oxygen","Fluorine","Neon","Sodium","Magnesium","Aluminium","Silicon","Phosphorus","Sulfur","Chlorine","Argon","Potassium","Calcium","Scandium","Titanium","Vanadium","Chromium","Manganese","Iron","Cobalt","Nickel","Copper","Zinc","Gallium","Germanium","Arsenic","Selenium","Bromine","Krypton","Rubidium","Strontium","Yttrium","Zirconium","Niobium","Molybdenum","Technetium","Ruthenium","Rhodium","Palladium","Silver","Cadmium","Indium","Tin","Antimony","Tellurium","Iodine","Xenon","Caesium","Barium","Lanthanum","Cerium","Praseodymium","Neodymium","Promethium","Samarium","Europium","Gadolinium","Terbium","Dysprosium","Holmium","Erbium","Thulium","Ytterbium","Lutetium","Hafnium","Tantalum","Tungsten","Rhenium","Osmium","Iridium","Platinum","Gold","Mercury","Thallium","Lead","Bismuth","Polonium","Astatine","Radon","Francium","Radium","Actinium","Thorium","Protactinium","Uranium","Neptunium","Plutonium","Americium","Curium","Berkelium","Californium","Einsteinium","Fermium","Mendelevium","Nobelium","Lawrencium","Rutherfordium","Dubnium","Seaborgium","Bohrium","Hassium","Meitnerium","Darmstadtium","Roentgenium","Copernicium","Nihonium","Flerovium","Moscovium","Livermorium","Tennessine","Oganesson"];

const USAGE_EN = {
  1:"fuel for rockets and fuel cells",2:"filling balloons and cooling MRI machines",
  3:"the batteries of phones and electric cars",4:"the lightweight alloys of aerospace",
  5:"heat-resistant glass (Pyrex) and detergents",6:"all living matter, from diamond to graphite, and steel",
  7:"fertilisers and food preservation",8:"breathing, welding and medicine",
  9:"toothpaste and non-stick coatings (Teflon)",10:"glowing neon signs",
  11:"table salt and city street lighting",12:"lightweight alloys and fireworks",
  13:"cans, aeroplanes and packaging",14:"computer chips and glass",
  15:"fertilisers and matches",16:"making rubber and sulfuric acid",
  17:"disinfecting water and household bleach",18:"light bulbs and shielded welding",
  19:"fertilisers and healthy muscle function",20:"bones, teeth, cement and chalk",
  22:"medical implants and aeroplanes",23:"the very strong steels of tools",
  24:"chrome plating and stainless steel",25:"strong steels and some batteries",
  26:"steel, construction and the haemoglobin in blood",27:"powerful magnets and batteries",
  28:"coins and stainless steel",29:"electrical wires and plumbing",
  30:"anti-rust galvanising and batteries",31:"LEDs and semiconductors",
  32:"optical fibres and electronics",33:"semiconductors (and a famous poison)",
  34:"solar cells and photocopiers",35:"flame retardants and photography",
  36:"certain lights and lasers",37:"atomic clocks",38:"the red colour of fireworks",
  47:"jewellery, mirrors and photography",48:"rechargeable batteries",
  50:"soldering and tin cans (tinplate)",51:"alloys and some semiconductors",
  53:"antiseptic and thyroid health",54:"car headlights and anaesthesia",
  55:"the atomic clocks that define the second",56:"medical imaging of the stomach (X-rays)",
  74:"light-bulb filaments and cutting tools",78:"jewellery and catalytic converters",
  79:"jewellery, electronics and financial reserves",80:"old thermometers and certain lamps",
  82:"car batteries and protection from X-rays",83:"certain stomach medicines",
  84:"the heat source of a few space probes",86:"a radioactive gas to watch for in homes",
  88:"once luminous paints (highly radioactive)",92:"the fuel of nuclear power plants",
  94:"reactors and deep-space probes",
};

const SAVANTS_EN = {
  1:"He identified \u00ab inflammable air \u00bb in 1766.",
  2:"Spotted in the Sun before being found on Earth.",
  7:"He isolated nitrogen in 1772.",
  8:"He named it \u00ab oxygen \u00bb and founded modern chemistry.",
  11:"Isolated by electrolysis in 1807.",
  15:"The first element discovered by a named person (1669).",
  17:"A chemist who also discovered oxygen.",
  19:"Isolated by electrolysis, like sodium.",
  20:"Isolated by electrolysis in 1808.",
  43:"The first element entirely made by humans.",
  53:"Discovered by chance from seaweed (1811).",
  84:"Named in honour of Poland (1898).",
  88:"Its radioactivity revolutionised science.",
  92:"Named after the planet Uranus (1789).",
  94:"A pioneer of synthetic elements.",
};

const NAMED_AFTER_EN = {
  64:"Johan Gadolin, a pioneer of rare earths",96:"Marie and Pierre Curie",
  99:"Albert Einstein",100:"Enrico Fermi",101:"Dmitri Mendeleev, creator of the periodic table",
  102:"Alfred Nobel",103:"Ernest Lawrence",104:"Ernest Rutherford",106:"Glenn Seaborg",
  107:"Niels Bohr",109:"Lise Meitner",111:"Wilhelm R\u00f6ntgen, who discovered X-rays",
  112:"Nicolaus Copernicus",118:"Yuri Oganessian",
};

const DANGER_EN = {
  4:"Toxic dust.",9:"Highly corrosive and reactive.",17:"Irritating, toxic gas.",
  33:"Toxic \u2014 a historic poison.",35:"Corrosive and irritating.",48:"Toxic to the kidneys.",
  55:"Reacts violently with water.",80:"Toxic \u2014 dangerous vapours.",
  82:"Toxic \u2014 affects the nervous system.",84:"Extremely radioactive.",85:"Highly radioactive.",
  86:"Radioactive gas \u2014 a risk to the lungs.",87:"Extremely radioactive.",88:"Highly radioactive.",
  92:"Radioactive and toxic.",94:"Radioactive and very toxic.",
};

/* Libellés d'interface (FR / EN) */
const I18N = {
  fr: {
    eyebrow:"Le Royaume de la Mati\u00e8re \u00b7 Module 1", title:"Chemistry Quest", subtitle:"Le Constructeur d'Atomes", install:"Installer l'application", defsTitle:"Définitions essentielles", isotopesLabel:"Isotopes notables :", radioactive:"Élément radioactif (aucun isotope stable)", defsNote:"Les orbites et les quarks sont représentés de façon simplifiée : la réalité quantique est plus subtile.",
    lede:"Ajoute un proton. Regarde la mati\u00e8re changer d'identit\u00e9, sous tes yeux.",
    explore:"Explorer", defi:"Mode D\u00e9fi", categories:"\u2190 Cat\u00e9gories", pts:"pts", serie:"s\u00e9rie",
    defiN:"D\u00e9fi", correct:"\u2713 Bravo, c'est exact !", next:"D\u00e9fi suivant \u2192", needHint:"Besoin d'un indice ?",
    protons:"protons", neutrons:"neutrons", electrons:"\u00e9lectrons",
    configuration:"Configuration", place:"Place", period:"P\u00e9riode", group:"Groupe", blockF:"Bloc f",
    nucleus:"Noyau", isotope:"Isotope", commonIsotope:"Isotope courant",
    sheet:"Fiche", at25:"\u00e0 25 \u00b0C", undetermined:"ind\u00e9termin\u00e9",
    atomicMass:"Masse atomique", electroneg:"\u00c9lectron\u00e9gativit\u00e9", melting:"Point de fusion",
    boiling:"Point d'\u00e9bullition", density:"Masse volumique", family:"Famille", discovery:"D\u00e9couverte",
    realLife:"Dans la vie r\u00e9elle :", where:"O\u00f9 le trouve-t-on :", techInterest:"Int\u00e9r\u00eat technologique :", namedAfter:"Nomm\u00e9 en l'honneur de",
    proton:"Proton", neutronsLab:"Neutrons", reset:"r\u00e9initialiser", goTo:"Aller \u00e0 l'\u00e9l\u00e9ment",
    mapTitle:"La carte se r\u00e9v\u00e8le", explored:"explor\u00e9s", mapHint:"Touche un \u00e9l\u00e9ment pour l'explorer.",
    supportTitle:"Soutenir Chemistry Quest", supportText:"Derri\u00e8re cette app, une conviction : la science appartient \u00e0 tout le monde. Soutenez le projet, et devenez passeur \u00e0 votre tour.", supportPick:"Choisissez le moyen qui vous convient :", supportHint:"Touchez un logo pour afficher le num\u00e9ro", supportCopied:"Num\u00e9ro copi\u00e9 \u2713", supportThanks:"Merci d'\u00eatre un passeur, vous aussi. \ud83d\ude4f",
    contactTitle:"Contact", contactLine:"Une question ? Appelle ou \u00e9cris :",
    antiquity:"Connu depuis l'Antiquit\u00e9",
    atomHint:"Glisse pour faire tourner — pince/molette pour zoomer jusque dans le noyau", rotate:"Rotation", orbits:"Orbites", quarks:"Quarks", subshells:"Sous-couches",
    atomicNumber:"numéro atomique",
    states:{gaz:"gazeux",liquide:"liquide",solide:"solide"},
  },
  en: {
    eyebrow:"The Realm of Matter \u00b7 Module 1", title:"Chemistry Quest", subtitle:"The Atom Builder", install:"Install the app", defsTitle:"Key definitions", isotopesLabel:"Notable isotopes:", radioactive:"Radioactive element (no stable isotope)", defsNote:"Orbits and quarks are shown in a simplified way: quantum reality is more subtle.",
    lede:"Add a proton. Watch matter change its identity, before your eyes.",
    explore:"Explore", defi:"Challenge Mode", categories:"\u2190 Categories", pts:"pts", serie:"streak",
    defiN:"Challenge", correct:"\u2713 Well done, that's correct!", next:"Next challenge \u2192", needHint:"Need a hint?",
    protons:"protons", neutrons:"neutrons", electrons:"electrons",
    configuration:"Configuration", place:"Position", period:"Period", group:"Group", blockF:"f-block",
    nucleus:"Nucleus", isotope:"Isotope", commonIsotope:"Common isotope",
    sheet:"Card", at25:"at 25 \u00b0C", undetermined:"unknown",
    atomicMass:"Atomic mass", electroneg:"Electronegativity", melting:"Melting point",
    boiling:"Boiling point", density:"Density", family:"Family", discovery:"Discovery",
    realLife:"In real life:", where:"Where it's found:", techInterest:"Tech importance:", namedAfter:"Named in honour of",
    proton:"Proton", neutronsLab:"Neutrons", reset:"reset", goTo:"Go to element",
    mapTitle:"The map unfolds", explored:"explored", mapHint:"Tap an element to explore it.",
    supportTitle:"Support Chemistry Quest", supportText:"Behind this app, one belief: science belongs to everyone. Support the project and become a passeur in turn.", supportPick:"Choose the method that suits you:", supportHint:"Tap a logo to reveal the number", supportCopied:"Number copied \u2713", supportThanks:"Thank you for being a passeur too. \ud83d\ude4f",
    contactTitle:"Contact", contactLine:"A question? Call or write:",
    antiquity:"Known since antiquity",
    atomHint:"Drag to rotate — pinch/scroll to zoom into the nucleus", rotate:"Rotate", orbits:"Orbits", quarks:"Quarks", subshells:"Subshells",
    atomicNumber:"atomic number",
    states:{gaz:"gaseous",liquide:"liquid",solide:"solid"},
  },
  ar: {
    eyebrow:"مملكة المادة · الوحدة 1", title:"Chemistry Quest", subtitle:"باني الذرّات", install:"تثبيت التطبيق", defsTitle:"تعريفات أساسية", isotopesLabel:"نظائر بارزة:", radioactive:"عنصر مشعّ (لا نظير مستقرّ)", defsNote:"تُعرض المدارات والكواركات بشكل مبسّط: الواقع الكمومي أدقّ من ذلك.",
    lede:"أضِف بروتونًا. شاهِد المادة تُغيّر هويتها أمام عينيك.",
    explore:"استكشاف", defi:"وضع التحدّي", categories:"الفئات", pts:"نقطة", serie:"سلسلة",
    defiN:"تحدٍّ", correct:"✓ أحسنت، إجابة صحيحة!", next:"التحدّي التالي", needHint:"تحتاج تلميحًا؟",
    protons:"بروتونات", neutrons:"نيوترونات", electrons:"إلكترونات",
    configuration:"التوزيع الإلكتروني", place:"الموقع", period:"الدور", group:"المجموعة", blockF:"الكتلة f",
    nucleus:"النواة", isotope:"نظير", commonIsotope:"النظير الشائع",
    sheet:"بطاقة", at25:"عند 25 °م", undetermined:"غير محدّد",
    atomicMass:"الكتلة الذرّية", electroneg:"الكهرسلبية", melting:"نقطة الانصهار",
    boiling:"نقطة الغليان", density:"الكثافة", family:"العائلة", discovery:"الاكتشاف",
    realLife:"في الحياة الواقعية:", where:"أين يوجد:", techInterest:"الأهمية التقنية:", namedAfter:"سُمّي تكريمًا لـ",
    proton:"بروتون", neutronsLab:"نيوترونات", reset:"إعادة", goTo:"اذهب إلى العنصر",
    mapTitle:"الخريطة تنكشف", explored:"مُستكشَف", mapHint:"اضغط على عنصر لاستكشافه.",
    supportTitle:"ادعم Chemistry Quest", supportText:"وراء هذا التطبيق قناعة: العلم مِلكٌ للجميع. ادعم المشروع، وكن ناقلًا للمعرفة بدورك.", supportPick:"اختر الوسيلة التي تناسبك:", supportHint:"اضغط على شعار لإظهار الرقم", supportCopied:"تم نسخ الرقم \u2713", supportThanks:"شكرًا لأنك ناقلٌ للمعرفة أيضًا. \ud83d\ude4f",
    contactTitle:"تواصل", contactLine:"سؤال؟ اتصل أو اكتب:",
    atomHint:"اسحب للتدوير — اقرص/مرّر للتكبير حتى داخل النواة", rotate:"التدوير", orbits:"المدارات", quarks:"كواركات", subshells:"الأغلفة الفرعية",
    atomicNumber:"العدد الذرّي", antiquity:"معروف منذ العصور القديمة",
    states:{gaz:"غازي",liquide:"سائل",solide:"صلب"},
  },
};
const ST_ADJ = { fr:{gaz:"gazeux",liquide:"liquide",solide:"solide"}, en:{gaz:"gaseous",liquide:"liquid",solide:"solid"}, ar:{gaz:"غازي",liquide:"سائل",solide:"صلب"} };
const NM = (Z,lang)=> lang==="ar" ? EL_AR[Z-1] : lang==="en" ? EL_EN[Z-1] : ELEMENTS[Z-1][1];
const T3 = (lang,fr,en,ar)=> lang==="ar" ? ar : lang==="en" ? en : fr;
const SY = (Z)=> ELEMENTS[Z-1][0];

/* ===================== VERSION ARABE (i18n) ===================== */
const EL_AR = ["الهيدروجين","الهيليوم","الليثيوم","البيريليوم","البورون","الكربون","النيتروجين","الأكسجين","الفلور","النيون","الصوديوم","المغنيسيوم","الألمنيوم","السيليكون","الفوسفور","الكبريت","الكلور","الأرغون","البوتاسيوم","الكالسيوم","السكانديوم","التيتانيوم","الفاناديوم","الكروم","المنغنيز","الحديد","الكوبالت","النيكل","النحاس","الزنك","الغاليوم","الجرمانيوم","الزرنيخ","السيلينيوم","البروم","الكريبتون","الروبيديوم","السترونشيوم","الإيتريوم","الزركونيوم","النيوبيوم","الموليبدينوم","التكنيشيوم","الروثينيوم","الروديوم","البلاديوم","الفضة","الكادميوم","الإنديوم","القصدير","الأنتيمون","التيلوريوم","اليود","الزينون","السيزيوم","الباريوم","اللانثانم","السيريوم","البراسيوديميوم","النيوديميوم","البروميثيوم","الساماريوم","اليوروبيوم","الغادولينيوم","التيربيوم","الديسبروسيوم","الهولميوم","الإربيوم","الثوليوم","الإتيربيوم","اللوتيشيوم","الهافنيوم","التانتالوم","التنغستن","الرينيوم","الأوزميوم","الإيريديوم","البلاتين","الذهب","الزئبق","الثاليوم","الرصاص","البزموت","البولونيوم","الأستاتين","الرادون","الفرانسيوم","الراديوم","الأكتينيوم","الثوريوم","البروتكتينيوم","اليورانيوم","النبتونيوم","البلوتونيوم","الأمريسيوم","الكوريوم","البركيليوم","الكاليفورنيوم","الأينشتاينيوم","الفيرميوم","المندليفيوم","النوبيليوم","اللورنسيوم","الرذرفورديوم","الدوبنيوم","السيبورجيوم","البوريوم","الهاسيوم","المايتنريوم","الدارمشتاتيوم","الرونتجينيوم","الكوبرنيسيوم","النيهونيوم","الفليروفيوم","الموسكوفيوم","الليفرموريوم","التينيسين","الأوغانيسون"];

const USAGE_AR = {
  1:"وقود الصواريخ وخلايا الوقود",2:"نفخ البالونات وتبريد أجهزة الرنين المغناطيسي",
  3:"بطاريات الهواتف والسيارات الكهربائية",4:"السبائك الخفيفة في صناعة الطيران والفضاء",
  5:"الزجاج المقاوم للحرارة (بايركس) والمنظّفات",6:"كل المادة الحية، من الألماس إلى الغرافيت، والفولاذ",
  7:"الأسمدة وحفظ الأغذية",8:"التنفّس واللحام والطب",
  9:"معجون الأسنان والطلاءات غير اللاصقة (تفلون)",10:"لافتات النيون المضيئة",
  11:"ملح الطعام وإنارة المدن",12:"السبائك الخفيفة والألعاب النارية",
  13:"العلب والطائرات والتغليف",14:"الرقائق الإلكترونية والزجاج",
  15:"الأسمدة وأعواد الثقاب",16:"صناعة المطّاط وحمض الكبريتيك",
  17:"تعقيم الماء ومبيّض الغسيل",18:"المصابيح واللحام المحمي",
  19:"الأسمدة وعمل العضلات السليم",20:"العظام والأسنان والإسمنت والطباشير",
  22:"الزراعات الطبية والطائرات",23:"الفولاذ القوي جدًا للأدوات",
  24:"الطلاء بالكروم والفولاذ المقاوم للصدأ",25:"أنواع الفولاذ القوية وبعض البطاريات",
  26:"الفولاذ والبناء وهيموغلوبين الدم",27:"المغناطيسات القوية والبطاريات",
  28:"العملات المعدنية والفولاذ المقاوم للصدأ",29:"الأسلاك الكهربائية والسباكة",
  30:"الجلفنة المانعة للصدأ والبطاريات",31:"مصابيح LED وأشباه الموصلات",
  32:"الألياف الضوئية والإلكترونيات",33:"أشباه الموصلات (وسمٌّ شهير)",
  34:"الخلايا الشمسية وآلات النسخ",35:"مثبّطات اللهب والتصوير الفوتوغرافي",
  36:"بعض الإضاءات والليزر",37:"الساعات الذرّية",38:"اللون الأحمر في الألعاب النارية",
  47:"المجوهرات والمرايا والتصوير",48:"البطاريات القابلة للشحن",
  50:"اللحام وعلب الصفيح",51:"السبائك وبعض أشباه الموصلات",
  53:"المطهّر وصحة الغدة الدرقية",54:"مصابيح السيارات الأمامية والتخدير",
  55:"الساعات الذرّية التي تُعرّف الثانية",56:"التصوير الطبي للمعدة (الأشعة السينية)",
  74:"خيوط المصابيح وأدوات القطع",78:"المجوهرات والمحوّلات الحفّازة",
  79:"المجوهرات والإلكترونيات والاحتياطيات المالية",80:"موازين الحرارة القديمة وبعض المصابيح",
  82:"بطاريات السيارات والحماية من الأشعة السينية",83:"بعض أدوية المعدة",
  84:"مصدر حرارة لبعض المسبارات الفضائية",86:"غاز مشعّ يجب الحذر منه في المنازل",
  88:"قديمًا الدهانات المضيئة (شديد الإشعاع)",92:"وقود محطّات الطاقة النووية",
  94:"المفاعلات ومسبارات الفضاء البعيد",
};

const SAVANTS_AR = {
  1:"حدّد «الهواء القابل للاشتعال» عام 1766.",
  2:"رُصد في الشمس قبل أن يُكتشف على الأرض.",
  7:"عزل النيتروجين عام 1772.",
  8:"أطلق عليه اسم «الأكسجين» وأسّس الكيمياء الحديثة.",
  11:"عُزل بالتحليل الكهربائي عام 1807.",
  15:"أول عنصر يكتشفه شخص معروف (1669).",
  17:"كيميائي اكتشف الأكسجين أيضًا.",
  19:"عُزل بالتحليل الكهربائي، مثل الصوديوم.",
  20:"عُزل بالتحليل الكهربائي عام 1808.",
  43:"أول عنصر يُصنَع بالكامل بيد الإنسان.",
  53:"اكتُشف مصادفةً من الأعشاب البحرية (1811).",
  84:"سُمّي تكريمًا لبولندا (1898).",
  88:"أحدث نشاطه الإشعاعي ثورة في العلم.",
  92:"سُمّي على اسم كوكب أورانوس (1789).",
  94:"رائد العناصر الاصطناعية.",
};

const NAMED_AFTER_AR = {
  64:"يوهان غادولين، رائد العناصر الأرضية النادرة",96:"ماري وبيير كوري",
  99:"ألبرت أينشتاين",100:"إنريكو فيرمي",101:"ديمتري مندليف، واضع الجدول الدوري",
  102:"ألفريد نوبل",103:"إرنست لورنس",104:"إرنست رذرفورد",106:"غلين سيبورغ",
  107:"نيلز بور",109:"ليزه مايتنر",111:"فيلهلم رونتغن، مكتشف الأشعة السينية",
  112:"نيكولاس كوبرنيكوس",118:"يوري أوغانيسيان",
};

const DANGER_AR = {
  4:"غبار سامّ.",9:"شديد التآكل والتفاعل.",17:"غاز مهيّج وسامّ.",
  33:"سامّ — سمٌّ تاريخي.",35:"مآكل ومهيّج.",48:"سامّ للكليتين.",
  55:"يتفاعل بعنف مع الماء.",80:"سامّ — أبخرة خطِرة.",
  82:"سامّ — يؤثّر على الجهاز العصبي.",84:"مشعّ للغاية.",85:"شديد الإشعاع.",
  86:"غاز مشعّ — خطر على الرئتين.",87:"مشعّ للغاية.",88:"عالي الإشعاع.",
  92:"مشعّ وسامّ.",94:"مشعّ وشديد السمّية.",
};

/* ===================== Géographie & intérêt technologique ===================== */
const GEO = {
  3:{fr:"Australie, Chili, Argentine et Chine (le « triangle du lithium »)",en:"Australia, Chile, Argentina and China (the « lithium triangle »)",ar:"أستراليا وتشيلي والأرجنتين والصين («مثلث الليثيوم»)"},
  5:{fr:"Turquie et États-Unis",en:"Turkey and the USA",ar:"تركيا والولايات المتحدة"},
  6:{fr:"Chine, Mozambique, Madagascar (graphite)",en:"China, Mozambique, Madagascar (graphite)",ar:"الصين وموزمبيق ومدغشقر (الغرافيت)"},
  13:{fr:"Guinée, Australie et Chine (bauxite)",en:"Guinea, Australia and China (bauxite)",ar:"غينيا وأستراليا والصين (البوكسيت)"},
  14:{fr:"Chine surtout, à partir du sable et du quartz",en:"Mainly China, from sand and quartz",ar:"الصين أساسًا، من الرمل والكوارتز"},
  15:{fr:"Maroc (l'essentiel des réserves mondiales), Chine, États-Unis",en:"Morocco (most of the world's reserves), China, USA",ar:"المغرب (معظم الاحتياطي العالمي) والصين والولايات المتحدة"},
  19:{fr:"Canada, Russie, Biélorussie (potasse)",en:"Canada, Russia, Belarus (potash)",ar:"كندا وروسيا وبيلاروسيا (البوتاس)"},
  22:{fr:"Australie, Afrique du Sud, Chine",en:"Australia, South Africa, China",ar:"أستراليا وجنوب أفريقيا والصين"},
  24:{fr:"Afrique du Sud et Kazakhstan",en:"South Africa and Kazakhstan",ar:"جنوب أفريقيا وكازاخستان"},
  25:{fr:"Afrique du Sud, Gabon, Australie",en:"South Africa, Gabon, Australia",ar:"جنوب أفريقيا والغابون وأستراليا"},
  26:{fr:"Australie, Brésil, Chine",en:"Australia, Brazil, China",ar:"أستراليا والبرازيل والصين"},
  27:{fr:"République démocratique du Congo (plus des deux tiers du monde)",en:"Democratic Republic of the Congo (over two-thirds of the world)",ar:"جمهورية الكونغو الديمقراطية (أكثر من ثلثي العالم)"},
  28:{fr:"Indonésie, Philippines, Russie",en:"Indonesia, Philippines, Russia",ar:"إندونيسيا والفلبين وروسيا"},
  29:{fr:"Chili, Pérou et République démocratique du Congo",en:"Chile, Peru and the Democratic Republic of the Congo",ar:"تشيلي وبيرو وجمهورية الكونغو الديمقراطية"},
  30:{fr:"Chine, Pérou, Australie",en:"China, Peru, Australia",ar:"الصين وبيرو وأستراليا"},
  31:{fr:"Chine (sous-produit de l'aluminium)",en:"China (by-product of aluminium)",ar:"الصين (ناتج ثانوي للألمنيوم)"},
  32:{fr:"Chine, Russie",en:"China, Russia",ar:"الصين وروسيا"},
  39:{fr:"Chine (terres rares)",en:"China (rare earths)",ar:"الصين (العناصر الأرضية النادرة)"},
  41:{fr:"Brésil (à lui seul près de 90 % du monde)",en:"Brazil (alone nearly 90% of the world)",ar:"البرازيل (وحدها قرابة 90٪ من العالم)"},
  42:{fr:"Chine, Chili, Pérou",en:"China, Chile, Peru",ar:"الصين وتشيلي وبيرو"},
  46:{fr:"Russie et Afrique du Sud",en:"Russia and South Africa",ar:"روسيا وجنوب أفريقيا"},
  47:{fr:"Mexique, Pérou, Chine",en:"Mexico, Peru, China",ar:"المكسيك وبيرو والصين"},
  50:{fr:"Chine, Indonésie, Myanmar",en:"China, Indonesia, Myanmar",ar:"الصين وإندونيسيا وميانمار"},
  51:{fr:"Chine surtout",en:"Mainly China",ar:"الصين أساسًا"},
  53:{fr:"Chili et Japon",en:"Chile and Japan",ar:"تشيلي واليابان"},
  60:{fr:"Chine surtout (terres rares)",en:"Mainly China (rare earths)",ar:"الصين أساسًا (العناصر الأرضية النادرة)"},
  73:{fr:"République démocratique du Congo et Rwanda (le coltan)",en:"Democratic Republic of the Congo and Rwanda (coltan)",ar:"جمهورية الكونغو الديمقراطية ورواندا (الكولتان)"},
  74:{fr:"Chine très majoritairement",en:"Overwhelmingly China",ar:"الصين بأغلبية ساحقة"},
  78:{fr:"Afrique du Sud (la grande majorité du monde)",en:"South Africa (the great majority of the world)",ar:"جنوب أفريقيا (الغالبية العظمى من العالم)"},
  79:{fr:"Chine, Australie, Russie, et plusieurs pays d'Afrique (Ghana, Mali…)",en:"China, Australia, Russia, and several African countries (Ghana, Mali…)",ar:"الصين وأستراليا وروسيا وعدة دول أفريقية (غانا، مالي…)"},
  80:{fr:"Chine surtout",en:"Mainly China",ar:"الصين أساسًا"},
  92:{fr:"Kazakhstan, Canada, Namibie — et le Niger, grand producteur africain",en:"Kazakhstan, Canada, Namibia — and Niger, a major African producer",ar:"كازاخستان وكندا وناميبيا — والنيجر، منتج أفريقي كبير"},
};

const TECH = {
  2:{fr:"indispensable pour refroidir les aimants supraconducteurs (IRM, accélérateurs)",en:"essential for cooling superconducting magnets (MRI, accelerators)",ar:"ضروري لتبريد المغناطيسات فائقة التوصيل (الرنين المغناطيسي، المسرّعات)"},
  3:{fr:"le cœur des batteries — pilier de la transition énergétique",en:"the heart of batteries — a pillar of the energy transition",ar:"قلب البطاريات — ركيزة التحوّل في الطاقة"},
  5:{fr:"fibres ultra-résistantes et contrôle des réacteurs nucléaires",en:"ultra-strong fibres and control of nuclear reactors",ar:"ألياف فائقة المتانة والتحكّم في المفاعلات النووية"},
  9:{fr:"électrolytes des batteries au lithium et polymères techniques",en:"lithium-battery electrolytes and technical polymers",ar:"إلكتروليتات بطاريات الليثيوم والبوليمرات التقنية"},
  14:{fr:"la base de toute l'électronique et des panneaux solaires",en:"the foundation of all electronics and solar panels",ar:"أساس كل الإلكترونيات والألواح الشمسية"},
  15:{fr:"engrais — clé de la sécurité alimentaire mondiale",en:"fertilisers — key to global food security",ar:"الأسمدة — مفتاح الأمن الغذائي العالمي"},
  22:{fr:"aérospatiale et implants biomédicaux",en:"aerospace and biomedical implants",ar:"الفضاء والزراعات الطبية الحيوية"},
  26:{fr:"l'acier — colonne vertébrale de l'industrie et du bâtiment",en:"steel — the backbone of industry and construction",ar:"الفولاذ — العمود الفقري للصناعة والبناء"},
  27:{fr:"batteries des véhicules électriques (avec de réels enjeux éthiques)",en:"electric-vehicle batteries (with real ethical stakes)",ar:"بطاريات السيارات الكهربائية (مع قضايا أخلاقية حقيقية)"},
  29:{fr:"l'électrification : réseaux, moteurs, énergies renouvelables",en:"electrification: grids, motors, renewables",ar:"الكهربة: الشبكات والمحرّكات والطاقات المتجدّدة"},
  31:{fr:"semi-conducteurs avancés (5G, LED, radars)",en:"advanced semiconductors (5G, LEDs, radar)",ar:"أشباه الموصلات المتقدّمة (الجيل الخامس، LED، الرادار)"},
  32:{fr:"fibres optiques et optique infrarouge",en:"optical fibres and infrared optics",ar:"الألياف الضوئية والبصريات تحت الحمراء"},
  39:{fr:"lasers, supraconducteurs et écrans",en:"lasers, superconductors and displays",ar:"الليزر والموصّلات الفائقة والشاشات"},
  41:{fr:"aciers haute performance pour oléoducs et aéronautique",en:"high-performance steels for pipelines and aviation",ar:"أنواع الفولاذ عالية الأداء لخطوط الأنابيب والطيران"},
  47:{fr:"meilleur conducteur électrique — électronique et solaire",en:"the best electrical conductor — electronics and solar",ar:"أفضل موصل كهربائي — الإلكترونيات والطاقة الشمسية"},
  53:{fr:"imagerie médicale et désinfection",en:"medical imaging and disinfection",ar:"التصوير الطبي والتعقيم"},
  60:{fr:"aimants permanents puissants : moteurs électriques, éoliennes",en:"powerful permanent magnets: electric motors, wind turbines",ar:"مغناطيسات دائمة قوية: المحرّكات الكهربائية وتوربينات الرياح"},
  73:{fr:"condensateurs miniatures des smartphones",en:"the tiny capacitors in smartphones",ar:"المكثّفات الصغيرة في الهواتف الذكية"},
  74:{fr:"outils de coupe et applications à très haute température",en:"cutting tools and very-high-temperature applications",ar:"أدوات القطع والتطبيقات فائقة الحرارة"},
  78:{fr:"catalyse, pots catalytiques et piles à hydrogène",en:"catalysis, catalytic converters and hydrogen fuel cells",ar:"الحفز والمحوّلات الحفّازة وخلايا وقود الهيدروجين"},
  79:{fr:"contacts électroniques fiables et réserve de valeur",en:"reliable electronic contacts and a store of value",ar:"وصلات إلكترونية موثوقة ومخزن للقيمة"},
  92:{fr:"énergie nucléaire — électricité bas-carbone",en:"nuclear energy — low-carbon electricity",ar:"الطاقة النووية — كهرباء منخفضة الكربون"},
};

const GEO_QUIZ = [
  {z:27, fr:"la République démocratique du Congo", en:"the Democratic Republic of the Congo", ar:"جمهورية الكونغو الديمقراطية"},
  {z:41, fr:"le Brésil", en:"Brazil", ar:"البرازيل"},
  {z:78, fr:"l'Afrique du Sud", en:"South Africa", ar:"جنوب أفريقيا"},
  {z:15, fr:"le Maroc", en:"Morocco", ar:"المغرب"},
  {z:92, fr:"le Niger", en:"Niger", ar:"النيجر"},
  {z:29, fr:"le Chili", en:"Chile", ar:"تشيلي"},
  {z:13, fr:"la Guinée", en:"Guinea", ar:"غينيا"},
];

/* ===================== Définitions essentielles ===================== */
const DEFINITIONS = [
  { id:"electron",
    term:{fr:"Électron",en:"Electron",ar:"إلكترون"},
    def:{fr:"Particule élémentaire de charge négative qui entoure le noyau. La façon dont les électrons remplissent les couches détermine les propriétés chimiques de l'atome.",
         en:"A negatively charged elementary particle that surrounds the nucleus. How electrons fill the shells determines the atom's chemical properties.",
         ar:"جسيم أوّلي سالب الشحنة يحيط بالنواة. وطريقة امتلاء الأغلفة بالإلكترونات تحدّد الخواص الكيميائية للذرّة."} },
  { id:"proton",
    term:{fr:"Proton",en:"Proton",ar:"بروتون"},
    def:{fr:"Particule de charge positive située dans le noyau. Le nombre de protons (le numéro atomique Z) définit l'identité même de l'élément.",
         en:"A positively charged particle located in the nucleus. The number of protons (the atomic number Z) defines the very identity of the element.",
         ar:"جسيم موجب الشحنة يقع في النواة. وعدد البروتونات (العدد الذرّي Z) يحدّد هوية العنصر نفسها."} },
  { id:"neutron",
    term:{fr:"Neutron",en:"Neutron",ar:"نيوترون"},
    def:{fr:"Particule sans charge électrique, elle aussi dans le noyau. Elle stabilise le noyau, et son nombre distingue les isotopes d'un même élément.",
         en:"An electrically neutral particle, also in the nucleus. It stabilises the nucleus, and its count distinguishes the isotopes of a single element.",
         ar:"جسيم متعادل الشحنة، يوجد أيضًا في النواة. يثبّت النواة، وعدده يميّز نظائر العنصر الواحد."} },
  { id:"quark",
    term:{fr:"Quark",en:"Quark",ar:"كوارك"},
    def:{fr:"Constituant encore plus petit : chaque proton et chaque neutron est formé de trois quarks (up et down). C'est l'un des plus petits composants connus de la matière.",
         en:"An even smaller building block: each proton and each neutron is made of three quarks (up and down). It is one of the smallest known components of matter.",
         ar:"مكوّن أصغر بعدُ: يتكوّن كل بروتون وكل نيوترون من ثلاثة كواركات (علوي وسفلي). وهو من أصغر مكوّنات المادة المعروفة."} },
  { id:"isotope",
    term:{fr:"Isotope",en:"Isotope",ar:"نظير"},
    def:{fr:"Atomes d'un même élément (même nombre de protons) mais avec un nombre de neutrons différent. Tu en fabriques en ajoutant ou retirant des neutrons avec les boutons + / −.",
         en:"Atoms of the same element (same number of protons) but with a different number of neutrons. You build them by adding or removing neutrons with the + / − buttons.",
         ar:"ذرّات العنصر نفسه (العدد ذاته من البروتونات) لكن بعدد مختلف من النيوترونات. تُكوّنها بإضافة النيوترونات أو إزالتها بالزرّين + / −."} },
  { id:"radioactivite",
    term:{fr:"Radioactivité",en:"Radioactivity",ar:"النشاط الإشعاعي"},
    def:{fr:"Propriété de certains noyaux instables qui se transforment en émettant un rayonnement. Un élément est dit radioactif lorsqu'il ne possède aucun isotope stable (repère ☢).",
         en:"A property of some unstable nuclei that transform by emitting radiation. An element is called radioactive when it has no stable isotope (marked ☢).",
         ar:"خاصية بعض النوى غير المستقرّة التي تتحوّل بإصدار إشعاع. ويُسمّى العنصر مشعًّا عندما لا يملك أيّ نظير مستقرّ (الرمز ☢)."} },
  { id:"ion",
    term:{fr:"Ion",en:"Ion",ar:"أيون"},
    def:{fr:"Atome qui a gagné ou perdu un ou plusieurs électrons ; il porte alors une charge électrique, positive ou négative.",
         en:"An atom that has gained or lost one or more electrons; it then carries an electric charge, positive or negative.",
         ar:"ذرّة اكتسبت أو فقدت إلكترونًا أو أكثر، فأصبحت تحمل شحنة كهربائية، موجبة أو سالبة."} },
  { id:"molecule",
    term:{fr:"Molécule",en:"Molecule",ar:"جزيء"},
    def:{fr:"Assemblage de plusieurs atomes liés ensemble, comme l'eau (H₂O), formée de deux hydrogènes et un oxygène.",
         en:"A group of several atoms bonded together, like water (H₂O), made of two hydrogens and one oxygen.",
         ar:"تجمّع من عدّة ذرّات مرتبطة معًا، مثل الماء (H₂O) المكوّن من ذرّتي هيدروجين وذرّة أكسجين."} },
  { id:"demivie",
    term:{fr:"Demi-vie",en:"Half-life",ar:"عمر النصف"},
    def:{fr:"Temps au bout duquel la moitié des noyaux radioactifs d'un échantillon se sont désintégrés. Elle va de fractions de seconde à des milliards d'années.",
         en:"The time after which half of the radioactive nuclei in a sample have decayed. It ranges from fractions of a second to billions of years.",
         ar:"الزمن الذي يضمحلّ بعده نصف النوى المشعّة في العيّنة. ويتراوح من أجزاء من الثانية إلى مليارات السنين."} },
];

/* ===================== Isotopes notables ===================== */
const NOTABLE_ISOTOPES = {
  1:{fr:"le deutérium (²H) et le tritium (³H, radioactif)",en:"deuterium (²H) and tritium (³H, radioactive)",ar:"الديوتيريوم (²H) والتريتيوم (³H، مشعّ)"},
  2:{fr:"l'hélium-4 (très stable) et l'hélium-3 (rare)",en:"helium-4 (very stable) and helium-3 (rare)",ar:"الهيليوم-4 (مستقرّ جدًا) والهيليوم-3 (نادر)"},
  6:{fr:"le carbone-14, qui sert à dater les fossiles et les vestiges",en:"carbon-14, used to date fossils and archaeological remains",ar:"الكربون-14 المستخدم لتأريخ الأحافير والآثار"},
  8:{fr:"l'oxygène-18, traceur précieux en climatologie",en:"oxygen-18, a valuable tracer in climate science",ar:"الأكسجين-18، كاشف ثمين في علم المناخ"},
  17:{fr:"le chlore-35 et le chlore-37 (d'où sa masse ≈ 35,5)",en:"chlorine-35 and chlorine-37 (hence its mass ≈ 35.5)",ar:"الكلور-35 والكلور-37 (ومن هنا كتلته ≈ 35.5)"},
  19:{fr:"le potassium-40, radioactif naturel, utile pour dater les roches",en:"potassium-40, naturally radioactive, useful for dating rocks",ar:"البوتاسيوم-40، مشعّ طبيعيًا، يُستخدم لتأريخ الصخور"},
  26:{fr:"le fer-56, parmi les noyaux les plus stables de l'Univers",en:"iron-56, among the most stable nuclei in the Universe",ar:"الحديد-56، من أكثر النوى استقرارًا في الكون"},
  27:{fr:"le cobalt-60, source de rayons gamma en radiothérapie",en:"cobalt-60, a gamma-ray source in radiotherapy",ar:"الكوبالت-60، مصدر لأشعة غاما في العلاج الإشعاعي"},
  38:{fr:"le strontium-90, produit lors des accidents nucléaires",en:"strontium-90, produced in nuclear accidents",ar:"السترونشيوم-90، ينتج في الحوادث النووية"},
  43:{fr:"le technétium-99m, le radio-isotope le plus utilisé en imagerie médicale",en:"technetium-99m, the most-used radioisotope in medical imaging",ar:"التكنيشيوم-99m، أكثر النظائر المشعّة استخدامًا في التصوير الطبي"},
  53:{fr:"l'iode-131, employé pour soigner la thyroïde",en:"iodine-131, used to treat the thyroid",ar:"اليود-131، يُستخدم لعلاج الغدة الدرقية"},
  55:{fr:"le césium-137, marqueur des retombées nucléaires",en:"caesium-137, a marker of nuclear fallout",ar:"السيزيوم-137، مؤشّر على السقاطة النووية"},
  82:{fr:"le plomb-206, terme final de la désintégration de l'uranium",en:"lead-206, the final product of uranium decay",ar:"الرصاص-206، الناتج النهائي لاضمحلال اليورانيوم"},
  86:{fr:"le radon-222, gaz radioactif issu du radium",en:"radon-222, a radioactive gas from radium",ar:"الرادون-222، غاز مشعّ ناتج عن الراديوم"},
  90:{fr:"le thorium-232, combustible nucléaire d'avenir",en:"thorium-232, a promising nuclear fuel",ar:"الثوريوم-232، وقود نووي واعد"},
  92:{fr:"l'uranium-235 (fissile) et l'uranium-238 (le plus abondant)",en:"uranium-235 (fissile) and uranium-238 (most abundant)",ar:"اليورانيوم-235 (انشطاري) واليورانيوم-238 (الأكثر وفرة)"},
  94:{fr:"le plutonium-239, utilisé dans les réacteurs",en:"plutonium-239, used in reactors",ar:"البلوتونيوم-239، يُستخدم في المفاعلات"},
};

const FAMILY_POOL = [
  { key:"alcalin",    fr:"métal alcalin",          en:"alkali metal",          ar:"فلز قلوي" },
  { key:"alcalino",   fr:"métal alcalino-terreux", en:"alkaline-earth metal",  ar:"فلز قلوي ترابي" },
  { key:"halogene",   fr:"halogène",               en:"halogen",               ar:"هالوجين" },
  { key:"noble",      fr:"gaz noble",              en:"noble gas",             ar:"غاز نبيل" },
  { key:"transition", fr:"métal de transition",    en:"transition metal",      ar:"فلز انتقالي" },
];
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function genProtons(lang) {
  const Z = rnd(1, 40);
  return {
    prompt: T3(lang, `Construis un atome qui possède ${Z} protons.`,
      `Build an atom that has ${Z} protons.`, `ابنِ ذرّة تحتوي على ${Z} بروتونًا.`),
    hint: T3(lang, `Le nombre de protons définit l'élément : ici, c'est ${NM(Z,lang)} (${SY(Z)}).`,
      `The number of protons defines the element: here it's ${NM(Z,lang)} (${SY(Z)}).`,
      `عدد البروتونات يحدّد العنصر: هنا هو ${NM(Z,lang)} (${SY(Z)}).`),
    check: (z) => z === Z,
  };
}
function genNeutrons(lang) {
  const Z = rnd(1, 30);
  const n = Z + pick([0, 0, 1, 1, 2, 3]);
  return {
    prompt: T3(lang, `Construis le noyau de ${NM(Z,lang)} : ${Z} protons et ${n} neutrons.`,
      `Build the nucleus of ${NM(Z,lang)}: ${Z} protons and ${n} neutrons.`,
      `ابنِ نواة ${NM(Z,lang)}: ${Z} بروتونًا و${n} نيوترونًا.`),
    hint: T3(lang, `Place-toi sur ${NM(Z,lang)} (Z=${Z}), puis ajuste les neutrons avec les boutons + / −.`,
      `Go to ${NM(Z,lang)} (Z=${Z}), then adjust the neutrons with the + / − buttons.`,
      `اذهب إلى ${NM(Z,lang)} (Z=${Z})، ثم اضبط النيوترونات بالزرّين + / −.`),
    check: (z, neu) => z === Z && neu === n,
  };
}
function genElectrons(lang) {
  const sub = pick(["valence", "full", "shells"]);
  if (sub === "valence") {
    const v = rnd(1, 8);
    return {
      prompt: T3(lang, `Construis un atome neutre avec ${v} électron${v>1?"s":""} sur sa couche externe.`,
        `Build a neutral atom with ${v} electron${v>1?"s":""} in its outer shell.`,
        `ابنِ ذرّة متعادلة بها ${v} إلكترونًا في غلافها الخارجي.`),
      hint: T3(lang, `La couche externe est la dernière de la configuration (K, L, M…).`,
        `The outer shell is the last one in the configuration (K, L, M…).`,
        `الغلاف الخارجي هو الأخير في التوزيع (K، L، M…).`),
      check: (z) => { const sh = shellsFor(z); return sh[sh.length - 1] === v; },
    };
  }
  if (sub === "full") {
    const o = pick([["K", 0, 2], ["L", 1, 8], ["M", 2, 18]]);
    return {
      prompt: T3(lang, `Sature complètement la couche ${o[0]} (${o[2]} électrons).`,
        `Completely fill shell ${o[0]} (${o[2]} electrons).`,
        `املأ الغلاف ${o[0]} بالكامل (${o[2]} إلكترونًا).`),
      hint: T3(lang, `Atteins l'élément où cette couche atteint sa capacité maximale.`,
        `Reach the element where this shell reaches its maximum capacity.`,
        `صِل إلى العنصر الذي يبلغ فيه هذا الغلاف سعته القصوى.`),
      check: (z) => { const sh = shellsFor(z); return sh[o[1]] === o[2]; },
    };
  }
  const k = rnd(1, 4);
  return {
    prompt: T3(lang, `Construis un atome avec exactement ${k} couche${k>1?"s":""} électronique${k>1?"s":""}.`,
      `Build an atom with exactly ${k} electron shell${k>1?"s":""}.`,
      `ابنِ ذرّة لها ${k} أغلفة إلكترونية بالضبط.`),
    hint: T3(lang, `Le nombre de couches occupées = le numéro de période.`,
      `The number of occupied shells = the period number.`,
      `عدد الأغلفة المملوءة = رقم الدور.`),
    check: (z) => shellsFor(z).length === k,
  };
}
function genFamilles(lang) {
  const f = pick(FAMILY_POOL);
  return {
    prompt: T3(lang, `Amène-toi sur un ${f.fr}.`, `Go to a ${f.en}.`, `اذهب إلى ${f.ar}.`),
    hint: T3(lang, `Repère la couleur de cette famille dans le tableau périodique.`,
      `Spot this family's colour in the periodic table.`,
      `لاحظ لون هذه العائلة في الجدول الدوري.`),
    check: (z) => catOf(z) === f.key,
  };
}
function genProprietes(lang) {
  const sub = pick(["state", "state", "mass"]);
  if (sub === "state") {
    const st = pick(["gaz", "liquide", "solide"]);
    return {
      prompt: T3(lang, `Trouve un élément ${ST_ADJ.fr[st]} à 25 °C.`,
        `Find an element that is ${ST_ADJ.en[st]} at 25 °C.`,
        `جِد عنصرًا ${ST_ADJ.ar[st]} عند 25 °م.`),
      hint: st === "liquide"
        ? T3(lang, `Il n'y en a que deux dans tout le tableau…`,
            `There are only two in the whole table…`, `لا يوجد سوى عنصرين في الجدول كلّه…`)
        : T3(lang, `Regarde la pastille d'état dans la fiche de l'élément.`,
            `Look at the state dot in the element's card.`, `انظر إلى نقطة الحالة في بطاقة العنصر.`),
      check: (z) => ELDATA[z - 1][5] === st,
    };
  }
  const Z = rnd(1, 30);
  const m = ELDATA[Z - 1][0];
  return {
    prompt: T3(lang, `Trouve l'élément dont la masse molaire est proche de ${m} u.`,
      `Find the element whose molar mass is close to ${m} u.`,
      `جِد العنصر الذي كتلته الذرّية قريبة من ${m} u.`),
    hint: T3(lang, `Compare les masses molaires affichées dans le tableau.`,
      `Compare the molar masses shown in the table.`, `قارن الكتل المولية المعروضة في الجدول.`),
    check: (z) => z === Z,
  };
}
function genUsages(lang) {
  const sub = pick(["usage", "usage", "savant", "named", "geo", "antiquite"]);
  if (sub === "usage") {
    const Z = pick(Object.keys(USAGE).map(Number));
    return {
      prompt: T3(lang, `Quel élément correspond à cet usage : « ${USAGE[Z]} » ? Construis-le.`,
        `Which element matches this use: « ${USAGE_EN[Z]} »? Build it.`,
        `أيّ عنصر يوافق هذا الاستخدام: «${USAGE_AR[Z]}»؟ ابنِه.`),
      hint: T3(lang, `C'est ${NM(Z,lang)} (${SY(Z)}, Z=${Z}).`,
        `It's ${NM(Z,lang)} (${SY(Z)}, Z=${Z}).`, `إنه ${NM(Z,lang)} (${SY(Z)}، Z=${Z}).`),
      check: (z) => z === Z,
    };
  }
  if (sub === "savant") {
    const Z = pick(Object.keys(SAVANTS).map(Number));
    return {
      prompt: T3(lang, `Construis l'élément lié au savant : ${SAVANTS[Z][0]}.`,
        `Build the element linked to the scientist: ${SAVANTS[Z][0]}.`,
        `ابنِ العنصر المرتبط بالعالِم: ${SAVANTS[Z][0]}.`),
      hint: T3(lang, `${SAVANTS[Z][1]} Il s'agit de ${NM(Z,lang)}.`,
        `${SAVANTS_EN[Z]} It is ${NM(Z,lang)}.`, `${SAVANTS_AR[Z]} إنه ${NM(Z,lang)}.`),
      check: (z) => z === Z,
    };
  }
  if (sub === "named") {
    const Z = pick(Object.keys(NAMED_AFTER).map(Number));
    return {
      prompt: T3(lang, `Quel élément a été nommé en l'honneur de ${NAMED_AFTER[Z]} ? Construis-le.`,
        `Which element was named in honour of ${NAMED_AFTER_EN[Z]}? Build it.`,
        `أيّ عنصر سُمّي تكريمًا لـ ${NAMED_AFTER_AR[Z]}؟ ابنِه.`),
      hint: T3(lang, `Il s'agit de ${NM(Z,lang)} (${SY(Z)}, Z=${Z}).`,
        `It is ${NM(Z,lang)} (${SY(Z)}, Z=${Z}).`, `إنه ${NM(Z,lang)} (${SY(Z)}، Z=${Z}).`),
      check: (z) => z === Z,
    };
  }
  if (sub === "geo") {
    const g = pick(GEO_QUIZ);
    return {
      prompt: T3(lang, `Quel élément provient surtout de ${g.fr} ? Construis-le.`,
        `Which element comes mainly from ${g.en}? Build it.`,
        `أيّ عنصر يأتي أساسًا من ${g.ar}؟ ابنِه.`),
      hint: T3(lang, `Il s'agit de ${NM(g.z,lang)} (${SY(g.z)}, Z=${g.z}).`,
        `It is ${NM(g.z,lang)} (${SY(g.z)}, Z=${g.z}).`,
        `إنه ${NM(g.z,lang)} (${SY(g.z)}، Z=${g.z}).`),
      check: (z) => z === g.z,
    };
  }
  return {
    prompt: T3(lang, `Trouve un élément connu depuis l'Antiquité.`,
      `Find an element known since antiquity.`, `جِد عنصرًا معروفًا منذ العصور القديمة.`),
    hint: T3(lang, `Or, fer, cuivre, argent, plomb, étain, soufre, mercure… les Anciens les connaissaient déjà.`,
      `Gold, iron, copper, silver, lead, tin, sulfur, mercury… the Ancients already knew them.`,
      `الذهب، الحديد، النحاس، الفضة، الرصاص، القصدير، الكبريت، الزئبق… عرفها القدماء.`),
    check: (z) => ELDATA[z - 1][7] === "Connu depuis l'Antiquité",
  };
}
function genMixte(lang) {
  return pick([genProtons, genNeutrons, genElectrons, genFamilles, genProprietes, genUsages])(lang);
}
const CATEGORIES = [
  { id:"protons",   label:{fr:"Par protons",en:"By protons",ar:"حسب البروتونات"},     desc:{fr:"Le nombre qui définit l'élément",en:"The number that defines the element",ar:"العدد الذي يحدّد العنصر"}, gen:genProtons },
  { id:"neutrons",  label:{fr:"Par neutrons",en:"By neutrons",ar:"حسب النيوترونات"},   desc:{fr:"Construis des isotopes",en:"Build isotopes",ar:"ابنِ النظائر"}, gen:genNeutrons },
  { id:"electrons", label:{fr:"Par électrons",en:"By electrons",ar:"حسب الإلكترونات"}, desc:{fr:"Couches & configuration",en:"Shells & configuration",ar:"الأغلفة والتوزيع"}, gen:genElectrons },
  { id:"familles",  label:{fr:"Familles",en:"Families",ar:"العائلات"},                 desc:{fr:"Alcalins, halogènes, gaz nobles…",en:"Alkali, halogens, noble gases…",ar:"قلوية، هالوجينات، غازات نبيلة…"}, gen:genFamilles },
  { id:"proprietes",label:{fr:"Propriétés",en:"Properties",ar:"الخصائص"},               desc:{fr:"État, masse molaire…",en:"State, molar mass…",ar:"الحالة، الكتلة المولية…"}, gen:genProprietes },
  { id:"usages",    label:{fr:"Usages & savants",en:"Uses & scientists",ar:"الاستخدامات والعلماء"}, desc:{fr:"Vie réelle, origines, savants & hommages",en:"Real life, origins, scientists & tributes",ar:"الحياة الواقعية، المصادر، العلماء والتكريمات"}, gen:genUsages },
  { id:"mixte",     label:{fr:"Mixte",en:"Mixed",ar:"منوّع"},                           desc:{fr:"Un peu de tout",en:"A bit of everything",ar:"قليل من كل شيء"}, gen:genMixte },
];
const catGen = (id) => (CATEGORIES.find((c) => c.id === id) || CATEGORIES[5]).gen;
const catLabel = (id, lang) => { const c = CATEGORIES.find((c) => c.id === id); return c ? c.label[lang] : ""; };

/* ===== Moyens de soutien (même numéro pour les 3 réseaux) ===== */
const SUPPORT = [
  { id: "wave",  label: "Wave",  kind: "tel", value: "+22788961209", display: "+227 88 96 12 09", color: "#1DC8FF", logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAIAAABt+uBvAAAI9klEQVR42u3ae7BXVRUH8O/ae5/zez/uvVwuIojQBZR0VCQQHB0Qe8z4JGfQRMfBaip7qM1EZoqJDdmMTanTmI6i+OiPpqEJLciyUSrAIAwJBBoQuARc7uv3/p3H3nv1B2K++rPfr7ns9eeZM/M75/Nbe+21zjk0ef0gXPz3EI7AATkgB+SAHJADckAOyIUDckAOyAE5IAfkgByQCwfkgByQA3JADsgBOSAX6v/lQphhDUiACGzBgBQAOSAAgDVQPuU7oGMYA+VBSK6XYQyEOOWBrKF0zpYGw7VPxG9u4GZV5Lu9mQv9hYspmeKgASHbeHXU5o8XrKF0Xr+1pfbgUnN4HzwJIlgLbdWMObm7nxE9EzhotjGP2grEFl6Ch46Wb7+MKwPIFslaZkskIIQdGVBTZ+YfWg8pYS2oPfWorSvcWkpmmr981A4eMalcVK+FzQasDRr1oFblQpfevS383XOUKcDaU3Kbl4rrFbNrUyxEd7Fj546di665pl6p3PmN27e8voWsZUV6x19gTRt3s5YDMcNosAUzpOLqiC0NCM+PonDLtjf2HR6Ijfhn37Ft27dbY8nzTP9BbtbaWKdbW4PYQvmUznFQR7NOmYLe+7fKtz4D5ZE1zWp17uT0OadlNr5d3XEkyHYUTKxFtrPw6KuU74KO21KGVCt1KJG2/Yea6571539W9Z4HY+zgUYqaDfIvPyPxxNWd4zsBWCC9o4+X/rq2awip+ggP94vOcRxHoxqIGUJxo1p94KZ417Zw/dPZbz6WuGKR6dtrtU1nxasH41vWVK+e7ncmcKDCa3ZHe4Zs0pemWjXH++T0WQCP6kbRWsoVw/W/0ru3iXE9tlGtfO+GXP0xHjoKEAO+xGuH9CsHrRIUG5tQnPaIQTDW9vdBCvDoBgKDBJcGIAlak0pAyOqPbhP5DspmYTQDxbQKms0gDArptO8nYm0AgGCO7GtT9rRyFyOBKFQfvwhSwhqAISQlU9ysgwQAIWhweGTSmVOuvPLazq7u4ZGSlBLMEMIOHIbRo71RFIKbVTXjovSSu7lUOoEC5hP7txCiXK7eteyuTZs2r1mzZtPGzdcvvn5kpCSlgPLssYPcqECqtpShFvZBQnKjklq6PLX0HlsaBghEAEspS6XyjZ+7ceXKldlsVmvd09OzevWzc+bMqVUq0k/Y8iDXKpCyLQuttY0iEVeG07fen/3SSq6WARCRNjqfyy1fvpyZjTFKqTiOlVL33nOv1oak4nrFDh0h6bWlTre4kyYQcWkgdfN30l94gOs1oVS9Vp89e05vby8zSykBKKWYef78BVN7e5thhKhh+w9BeaN9iZ1MIkhpS4OpxXeq6RciaGhtZs+eDcCenEiJiJlTqeR5550fhIEAzPE+kDgVMuhkHrGFlGLsROgYwJgxYz7UV/KJ49ZYEmQP7wO4LU9g2zTNk0AU8shxSPkux0e133yiIbBD/2rXLNYWIIaQHNRs6RikB0YQBh9pFAQBGFCe7e/jRg1Str4Mibb4QAgOA240IQRJ2vHmm0Qk3vNcVUpprd258x+JhM9ENmhw2IAQrS/Toi0lCGzJS1AiYbXOZDIbN24slUrvrjVjDDPv2rVr565dqVTaGkOJJPlJWG59FWpTkdaa8h3y9F4bBalU+tDBg6tWPSWEiONYa83MRPTwwz9pNuqe53EUyjOmU64DJm59nW5TkWYL5fuXLpKRacZGpXP3rVjx6h9f8X1fKaWUembVU08+vdrPFoJYS20TCxa3axZr61sNIY7cfcOE/a+N7SrsG2wMBvS1L94ybdpZr7+++bnnfzF5bLon5/UdLw1fcO34+1bZMBjtTxQ/8M+wDbzCiiXn3ty3JVnIlpup7/6h+cgjPxWSrZHLFo69Y66f9GR5WD8y49IXKJ3juiV1qmSQZFPyOj5/eNWDu7+s/W6jdcIjEF3+XLBhf3zrzMTPrvN1gw0jIQHTWHz+ixuKF2d1zZI4RTKIiM246OiW4oKazCmY2KCYpmmXxH9KNidfnN6aVlXJSiCGLOjSpOYB3XHpiVmDR2sG0XvujQCAI/IjkhJMRNqyIPiClEDT8IkNnQEBGJDPcQomZliGL2C5dUwtyiAGQoZPAGABMBQRmygvoS03DAoeVWMOGSQpTYiYFUgSAsu+gEdiMOKCR2lJA5HNSFLUIqP/+ZKWhLLmZVPTa2bnK5ovLKrfX1z8dI/fH9nnZ+W/f3aWSDw5M799Yde6eR0//0RhxdnZ605P/mZeR8YTgxEvnpB6eV6HBb46JbVtQeffL+tYNTOXUqRb1TOK1uTPnpqZ0+lNSIl5Xd60rFzY7XUlxPxuf3tFP3hO9qrTEvfvbmwt6cvG+tMycvOwPjevLhnj1S3u+Fjq7YZd0O0/MCPzw72NJVsrF3V6Pz43WzMsaFQAWUZW0br+sGn4ip7ErKL3VkX3ZuRV4xKR5S0j+rrxiR/saTy0t/H17dWNw3GnL/46HL9R0otOS5yVkxPT8uH9zWvHJ5qGP9Xj3zYlHVl8sts/IylC24okEi2oPr7A8ZBfG4y/cmZySlrcv6dR9MQdU1JbS3pn1RDQkxREyHtU9EgzC8LqvmBW0fv21HR/YP88FCUEjMW6Y+Hao+HaI+Hj+5uRhWhJGWpRWyGAtUfDiRkZMl46Fh2PbG9Wvtwf9YfmyQPNWyclX5pbeHlecUZOEVD0aN2xSDMvmZh8vi8INJ45EPgSc7u8KRl586RkE9wfWa8lS0x23LSsFT8jaCi0GUkvHo3eKMeRRTnmF/pCgDYMxYORvaDobS/r3x4L99XNtrKpGS7HPBDapw4FAthbN5uG9fwx3vSsWn0oePztICFaNHa0qA8iwDJKmn2BvKKa5qZFQb2zW5djNgABAiBCXpEAqoZDi6IiQRCEuuamfScZi17rhrLW9UGC0O2TBTQjoygHmJP9Xqf/vhs2DAvkFdHJcywjoyj7nhNG4ajBgOb/ZJN9v8iH4wMHbZtez7sv7R2QA3JADsgBOSAH5IBcOCAH5IAckANyQA7IAblwQA7IATkgB+SAHJADcuGAHJADckBtjX8DWIJksnXHP0AAAAAASUVORK5CYII=" },
  { id: "nita",  label: "NITA",  kind: "tel", value: "+22788961209", display: "+227 88 96 12 09", color: "#1B5FA8", logo: "data:image/png;base64,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" },
  { id: "amana", label: "AMANA", kind: "tel", value: "+22788961209", display: "+227 88 96 12 09", color: "#2FA84F", logo: "data:image/png;base64,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" },
];

export default function ChemistryQuest() {
  const [Z, setZ] = useState(6); // on démarre sur le carbone, cœur du vivant
  const elem = ELEMENTS[Z - 1];
  const [sym, name, A] = elem;
  const cat = catOf(Z);
  const color = CATS[cat].c;
  const shells = useMemo(() => shellsFor(Z), [Z]);
  const typicalN = A - Z;
  const [neutrons, setNeutrons] = useState(typicalN);
  const [visited, setVisited] = useState(() => new Set([6]));

  // Mode Défi
  const [mode, setMode] = useState("explore"); // 'explore' | 'defi'
  const [partie, setPartie] = useState(null);   // catégorie choisie
  const [challenge, setChallenge] = useState(null);
  const [solved, setSolved] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(0);

  // Langue (FR / EN)
  const [lang, setLang] = useState("fr");
  const L = I18N[lang];
  const isEN = lang === "en";
  const m3 = (fr, en, ar) => (lang === "ar" ? ar : lang === "en" ? en : fr);
  const catL = (k) => m3(CATS[k].l, CATS[k].le, CATS[k].la);
  const dispName = NM(Z, lang);

  // Définitions repliables (anti-encombrement)
  const [showDefs, setShowDefs] = useState(false);

  // Soutien : on révèle (et copie) le numéro au toucher d'un logo
  const [revealed, setRevealed] = useState(null);
  const pickSupport = async (m) => {
    setRevealed(m);
    try { await navigator.clipboard.writeText(m.value); } catch (e) {}
  };

  // Bouton d'installation PWA : on capte l'événement natif du navigateur
  const [installEvt, setInstallEvt] = useState(null);
  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); setInstallEvt(e); };
    const onInstalled = () => setInstallEvt(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);
  const doInstall = async () => {
    if (!installEvt) return;
    installEvt.prompt();
    try { await installEvt.userChoice; } catch (e) {}
    setInstallEvt(null);
  };

  const startDefi = () => { setMode("defi"); setPartie(null); setChallenge(null); };
  const selectPartie = (id) => {
    setPartie(id); setChallenge(catGen(id)(lang));
    setSolved(false); setHintShown(false);
  };
  const backToMenu = () => { setPartie(null); setChallenge(null); setSolved(false); };
  const nextChallenge = () => {
    setChallenge(catGen(partie)(lang));
    setSolved(false); setHintShown(false);
  };

  // Vérification en direct du défi courant
  useEffect(() => {
    if (mode !== "defi" || !challenge || solved) return;
    if (challenge.check(Z, neutrons)) {
      setSolved(true);
      setScore((s) => s + (hintShown ? 5 : 10));
      setStreak((k) => k + 1);
      setDone((d) => d + 1);
    }
  }, [Z, neutrons, mode, challenge, solved, hintShown]);

  // Propriétés physico-chimiques de l'élément courant
  const [mass, mp, bp, dens, en, state, dy, who] = ELDATA[Z - 1];
  const STATE_COLOR = { solide: "#9FB0C8", liquide: "#7FD3E8", gaz: "#E8C778", "?": "#6A7894" };
  const stLabel = state === "?" ? L.undetermined : L.states[state];
  const fmtT = (v) => (v === null ? "—" : `${v} °C`);
  const fmtDens = (v) =>
    v === null ? "—" : state === "gaz" ? `${(v * 1000).toFixed(2)} g/L` : `${v} g/cm³`;
  const fmtEN = (v) => (v === null ? "—" : v);
  const whoDisp = who === "Connu depuis l'Antiquité" ? L.antiquity : who;
  const discovery =
    dy === null ? (whoDisp || "—") : `${dy}${whoDisp ? " · " + whoDisp : ""}`;

  // À chaque changement d'élément : neutrons = isotope courant + mémoire d'exploration
  useEffect(() => {
    setNeutrons(A - Z);
    setVisited((s) => { const n = new Set(s); n.add(Z); return n; });
  }, [Z, A]);

  const pos = gridPos(Z);
  const period = shells.length;
  const groupLabel = pos && pos.r <= 7 ? `${L.group} ${pos.c}` : L.blockF;
  const config = shells.map((c, i) => `(${SHELL_LETTERS[i]})${c}`).join(" ");
  const isIsotope = neutrons !== typicalN;

  const jump = (z) => setZ(Math.max(1, Math.min(118, z)));

  return (
    <div className={"cq-root" + (lang === "ar" ? " cq-rtl" : "")} dir={lang === "ar" ? "rtl" : "ltr"}>
      <style>{CSS}</style>
      <div className="cq-stars" aria-hidden="true" />

      <header className="cq-header">
        <div className="cq-logo">K</div>
        <div className="cq-head-txt">
          <div className="cq-eyebrow">{L.eyebrow}</div>
          <h1 className="cq-title">{L.title}</h1>
          <div className="cq-subtitle">{L.subtitle}</div>
        </div>
        <div className="cq-lang" role="group" aria-label="Language">
          <button className={"cq-lang-btn" + (lang === "fr" ? " on" : "")}
                  onClick={() => setLang("fr")}>FR</button>
          <button className={"cq-lang-btn" + (lang === "en" ? " on" : "")}
                  onClick={() => setLang("en")}>EN</button>
          <button className={"cq-lang-btn" + (lang === "ar" ? " on" : "")}
                  onClick={() => setLang("ar")}>ع</button>
        </div>
      </header>

      <p className="cq-lede">{L.lede}</p>

      {installEvt && (
        <button className="cq-install" onClick={doInstall}>⤓ {L.install}</button>
      )}

      {/* SÉLECTEUR DE MODE */}
      <div className="cq-modes">
        <button className={"cq-mode" + (mode === "explore" ? " on" : "")}
                onClick={() => setMode("explore")}>{L.explore}</button>
        <button className={"cq-mode" + (mode === "defi" ? " on" : "")}
                onClick={startDefi}>{L.defi}</button>
      </div>

      {/* MENU DES CATÉGORIES */}
      {mode === "defi" && !partie && (
        <div className="cq-parties">
          {CATEGORIES.map((c) => (
            <button key={c.id} className="cq-partie" onClick={() => selectPartie(c.id)}>
              <span className="cq-partie-label">{c.label[lang]}</span>
              <span className="cq-partie-desc">{c.desc[lang]}</span>
            </button>
          ))}
        </div>
      )}

      {/* CARTE DE DÉFI */}
      {mode === "defi" && partie && challenge && (
        <div className={"cq-quest" + (solved ? " solved" : "")}>
          <div className="cq-quest-head">
            <button className="cq-quest-back" onClick={backToMenu}>{L.categories}</button>
            <span className="cq-quest-stats"><b>{score}</b> {L.pts} · {L.serie} {streak}</span>
          </div>
          <div className="cq-quest-cat">{catLabel(partie, lang)} · {L.defiN} {done + 1}</div>
          <div className="cq-quest-prompt">{challenge.prompt}</div>
          {solved ? (
            <div className="cq-quest-foot">
              <span className="cq-quest-win">{L.correct}</span>
              <button className="cq-quest-next" onClick={nextChallenge}>{L.next}</button>
            </div>
          ) : (
            <div className="cq-quest-foot">
              {hintShown
                ? <span className="cq-quest-hint">{challenge.hint}</span>
                : <button className="cq-quest-hintbtn" onClick={() => setHintShown(true)}>{L.needHint}</button>}
            </div>
          )}
        </div>
      )}

      <div className="cq-cols">
      <div className="cq-left">
      {/* SCÈNE PRINCIPALE */}
      <div className="cq-stage">
        <AtomView key={Z} Z={Z} neutrons={neutrons} color={color} lang={lang} />

        <div className="cq-id" style={{ "--cc": color }}>
          <div className="cq-id-sym">{sym}</div>
          <div className="cq-id-main">
            <div className="cq-id-name">{dispName}</div>
            <span className="cq-badge">{catL(cat)}</span>
          </div>
          <div className="cq-id-z">
            <span className="cq-z-num">{Z}</span>
            <span className="cq-z-lab">{L.atomicNumber}</span>
          </div>
        </div>
      </div>

      {/* COMPTEURS */}
      <div className="cq-counts">
        <div className="cq-count"><b style={{ color: "#E8C778" }}>{Z}</b> {L.protons}</div>
        <div className="cq-count"><b style={{ color: "#9FB0C8" }}>{neutrons}</b> {L.neutrons}</div>
        <div className="cq-count"><b style={{ color: "#7FD3E8" }}>{Z}</b> {L.electrons}</div>
      </div>
      </div>

      <div className="cq-right">
      {/* CONFIGURATION */}
      <div className="cq-info">
        <div className="cq-info-row">
          <span className="cq-info-lab">{L.configuration}</span>
          <span className="cq-config">{config}</span>
        </div>
        <div className="cq-info-row">
          <span className="cq-info-lab">{L.place}</span>
          <span>{L.period} {period} · {groupLabel}</span>
        </div>
        <div className="cq-info-row">
          <span className="cq-info-lab">{L.nucleus}</span>
          <span className="cq-mono">
            {isIsotope ? L.isotope : L.commonIsotope} :
            {" "}<sup>{Z + neutrons}</sup>{sym}
          </span>
        </div>
      </div>

      {/* FICHE DÉTAILLÉE */}
      <div className="cq-sheet" style={{ "--cc": color }}>
        <div className="cq-sheet-head">
          <span className="cq-sheet-title">{L.sheet} · {dispName}</span>
          <span className="cq-state">
            <i style={{ background: STATE_COLOR[state] }} />
            {stLabel} {L.at25}
          </span>
        </div>
        <div className="cq-sheet-grid">
          <div className="cq-tile">
            <span className="cq-tile-lab">{L.atomicMass}</span>
            <span className="cq-tile-val">{mass} u</span>
          </div>
          <div className="cq-tile">
            <span className="cq-tile-lab">{L.electroneg}</span>
            <span className="cq-tile-val">{fmtEN(en)}</span>
          </div>
          <div className="cq-tile">
            <span className="cq-tile-lab">{L.melting}</span>
            <span className="cq-tile-val">{fmtT(mp)}</span>
          </div>
          <div className="cq-tile">
            <span className="cq-tile-lab">{L.boiling}</span>
            <span className="cq-tile-val">{fmtT(bp)}</span>
          </div>
          <div className="cq-tile">
            <span className="cq-tile-lab">{L.density}</span>
            <span className="cq-tile-val">{fmtDens(dens)}</span>
          </div>
          <div className="cq-tile">
            <span className="cq-tile-lab">{L.family}</span>
            <span className="cq-tile-val" style={{ color }}>{catL(cat)}</span>
          </div>
        </div>
        <div className="cq-disc">
          <span className="cq-info-lab">{L.discovery}</span>
          <span>{discovery}</span>
        </div>
        {USAGE[Z] && <div className="cq-fact"><b>{L.realLife}</b> {m3(USAGE[Z], USAGE_EN[Z], USAGE_AR[Z])}.</div>}
        {GEO[Z] && <div className="cq-fact"><b>🌍 {L.where}</b> {m3(GEO[Z].fr, GEO[Z].en, GEO[Z].ar)}.</div>}
        {TECH[Z] && <div className="cq-fact"><b>⚙ {L.techInterest}</b> {m3(TECH[Z].fr, TECH[Z].en, TECH[Z].ar)}.</div>}
        {NOTABLE_ISOTOPES[Z] && <div className="cq-fact"><b>⚛ {L.isotopesLabel}</b> {m3(NOTABLE_ISOTOPES[Z].fr, NOTABLE_ISOTOPES[Z].en, NOTABLE_ISOTOPES[Z].ar)}.</div>}
        {isRadio(Z) && <div className="cq-radio">☢ {L.radioactive}</div>}
        {SAVANTS[Z] && (
          <div className="cq-savant">★ {SAVANTS[Z][0]} — {m3(SAVANTS[Z][1], SAVANTS_EN[Z], SAVANTS_AR[Z])}</div>
        )}
        {NAMED_AFTER[Z] && (
          <div className="cq-savant">✦ {L.namedAfter} {m3(NAMED_AFTER[Z], NAMED_AFTER_EN[Z], NAMED_AFTER_AR[Z])}.</div>
        )}
        {DANGER[Z] && <div className="cq-danger">⚠ {m3(DANGER[Z], DANGER_EN[Z], DANGER_AR[Z])}</div>}
      </div>

      {/* COMMANDES */}
      <div className="cq-controls">
        <div className="cq-ctrl-line">
          <button className="cq-btn" onClick={() => jump(Z - 1)} disabled={Z <= 1}
                  aria-label="-1">−</button>
          <button className="cq-btn cq-btn-gold" onClick={() => jump(Z + 1)}
                  disabled={Z >= 118}>+ {L.proton}</button>
          <button className="cq-btn" onClick={() => jump(Z + 1)} disabled={Z >= 118}
                  aria-label="+1">+</button>
        </div>

        <div className="cq-ctrl-line cq-ctrl-neutron">
          <span className="cq-ctrl-lab">{L.neutronsLab}</span>
          <button className="cq-btn cq-btn-sm" onClick={() => setNeutrons((n) => Math.max(0, n - 1))}
                  aria-label="-1">−</button>
          <span className="cq-neutron-val">{neutrons}</span>
          <button className="cq-btn cq-btn-sm" onClick={() => setNeutrons((n) => n + 1)}
                  aria-label="+1">+</button>
          {isIsotope && (
            <button className="cq-reset" onClick={() => setNeutrons(typicalN)}>{L.reset}</button>
          )}
        </div>

        <label className="cq-slider-wrap">
          <span className="cq-ctrl-lab">{L.goTo}</span>
          <input type="range" min="1" max="118" value={Z}
                 onChange={(e) => jump(parseInt(e.target.value, 10))}
                 className="cq-slider" aria-label={L.goTo} />
          <span className="cq-mono cq-slider-z">Z {Z}</span>
        </label>
      </div>
      </div>
      </div>

      {/* DÉFINITIONS ESSENTIELLES */}
      <section className="cq-defs">
        <button className={"cq-defs-toggle" + (showDefs ? " open" : "")}
                onClick={() => setShowDefs((v) => !v)}
                aria-expanded={showDefs}>
          <span className="cq-defs-title">{L.defsTitle}</span>
          <span className="cq-defs-chev" aria-hidden="true">{showDefs ? "▾" : "▸"}</span>
        </button>
        {showDefs && (
          <>
            <div className="cq-defs-grid">
              {DEFINITIONS.map((d) => (
                <div key={d.id} className="cq-def">
                  <span className="cq-def-term">{m3(d.term.fr, d.term.en, d.term.ar)}</span>
                  <span className="cq-def-text">{m3(d.def.fr, d.def.en, d.def.ar)}</span>
                </div>
              ))}
            </div>
            <p className="cq-defs-note">{L.defsNote}</p>
          </>
        )}
      </section>

      {/* TABLEAU PÉRIODIQUE */}
      <section className="cq-map">
        <div className="cq-map-head">
          <h2 className="cq-map-title">{L.mapTitle}</h2>
          <span className="cq-progress">{visited.size} / 118 {L.explored}</span>
        </div>
        <p className="cq-map-hint">{L.mapHint}</p>
        <PeriodicTable Z={Z} onPick={jump} lang={lang} />
        <div className="cq-legend">
          {Object.entries(CATS).map(([k, v]) => (
            <span key={k} className="cq-leg-item">
              <i style={{ background: v.c }} />{m3(v.l, v.le, v.la)}
            </span>
          ))}
        </div>
      </section>

      {/* SOUTIEN */}
      <section className="cq-support">
        <div className="cq-support-title">{L.supportTitle}</div>
        <p className="cq-support-text">{L.supportText}</p>
        <div className="cq-support-pick">{L.supportPick}</div>
        <div className="cq-support-logos">
          {SUPPORT.map((m) => (
            <button key={m.id}
                    className={"cq-logo-btn" + (revealed && revealed.id === m.id ? " on" : "")}
                    onClick={() => pickSupport(m)} style={{ "--mc": m.color }}
                    aria-label={m.label}>
              <img className="cq-logo-img" src={m.logo} alt={m.label} />
              <span className="cq-logo-name">{m.label}</span>
            </button>
          ))}
        </div>
        <div className={"cq-support-reveal" + (revealed ? " show" : "")}>
          {revealed ? (
            <>
              <span className="cq-reveal-num">{revealed.display || revealed.value}</span>
              <span className="cq-reveal-copied">{L.supportCopied}</span>
            </>
          ) : (
            <span className="cq-reveal-hint">{L.supportHint}</span>
          )}
        </div>
        <div className="cq-support-thanks">{L.supportThanks}</div>
      </section>

      {/* CONTACT */}
      <section className="cq-contact">
        <div className="cq-contact-title">{L.contactTitle}</div>
        <div className="cq-contact-line">{L.contactLine}</div>
        <div className="cq-contact-links">
          <a className="cq-contact-link" href="tel:+22788961209">📞 +227 88 96 12 09</a>
          <a className="cq-contact-link" href="mailto:kotchamiogougbe@gmail.com">✉ kotchamiogougbe@gmail.com</a>
        </div>
      </section>

      <footer className="cq-footer">
        <div className="cq-foot-brand">Kotchami Ogougbe</div>
        <div className="cq-foot-sdg">Soli Deo Gloria</div>
      </footer>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Space+Grotesk:wght@300;400;500;600&family=Space+Mono&display=swap');

.cq-root{
  --navy0:#070f24; --navy1:#0c1838; --navy2:#142a52;
  --gold:#d8b15a; --gold-bright:#E8C778; --ink:#EAF0FB; --muted:#9FB0C8;
  position:relative; min-height:100vh; width:100%;
  margin:0 auto; max-width:720px; padding:22px 18px 40px;
  background:radial-gradient(120% 80% at 50% -10%, #16306044 0%, transparent 55%),
             linear-gradient(180deg, var(--navy1) 0%, var(--navy0) 100%);
  color:var(--ink);
  font-family:'Space Grotesk',system-ui,sans-serif;
  box-sizing:border-box; overflow:hidden;
}
.cq-root *{box-sizing:border-box;}

/* mise en page deux colonnes (paysage / ordinateur) */
.cq-cols{display:flex;flex-direction:column;}
.cq-left,.cq-right{min-width:0;}

.cq-stars{position:absolute; inset:0; pointer-events:none; opacity:.5;
  background-image:
    radial-gradient(1px 1px at 12% 18%, #fff7, transparent),
    radial-gradient(1px 1px at 80% 12%, #cfe3ff8a, transparent),
    radial-gradient(1px 1px at 30% 42%, #fff6, transparent),
    radial-gradient(1.5px 1.5px at 66% 30%, #ffe9b07a, transparent),
    radial-gradient(1px 1px at 90% 55%, #fff5, transparent),
    radial-gradient(1px 1px at 18% 70%, #fff5, transparent),
    radial-gradient(1.5px 1.5px at 50% 85%, #cfe3ff6a, transparent),
    radial-gradient(1px 1px at 74% 80%, #fff5, transparent);
}

.cq-header{display:flex; align-items:center; gap:13px; position:relative; z-index:1;}
.cq-logo{width:42px;height:42px;flex:none;border-radius:11px;
  display:grid;place-items:center;font-family:'Cormorant Garamond',serif;
  font-weight:700;font-size:24px;color:var(--gold-bright);
  background:linear-gradient(150deg,#1a2c54,#0a1430);
  border:1px solid #d8b15a44; box-shadow:0 0 18px #d8b15a22;}
.cq-eyebrow{font-size:11px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--gold);font-weight:500;}
.cq-title{margin:1px 0 0;font-family:'Cormorant Garamond',serif;
  font-weight:600;font-size:30px;line-height:1;letter-spacing:.01em;color:#fff;}
.cq-lede{position:relative;z-index:1;margin:14px 2px 8px;color:var(--muted);
  font-size:14.5px;font-weight:300;}

/* mode défi */
.cq-modes{display:flex;gap:8px;margin:6px 2px 0;position:relative;z-index:1;}
.cq-mode{flex:1;padding:11px;border-radius:12px;font-family:'Space Grotesk',sans-serif;
  font-size:14px;font-weight:500;cursor:pointer;color:var(--muted);
  background:#ffffff09;border:1px solid #ffffff14;transition:all .15s;}
.cq-mode.on{color:#1a1304;background:linear-gradient(135deg,#E8C778,#d8b15a);
  border-color:transparent;font-weight:600;box-shadow:0 3px 14px #d8b15a33;}
.cq-quest{margin:12px 2px 0;padding:15px 16px;border-radius:16px;position:relative;z-index:1;
  background:linear-gradient(160deg,#1a2c5455,#0c193877);
  border:1px solid #d8b15a3a;box-shadow:0 0 22px #00000033;}
.cq-quest.solved{border-color:#54bf5e88;background:linear-gradient(160deg,#16361f88,#0c193877);}
.cq-quest-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px;}
.cq-quest-eyebrow{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);}
.cq-parties{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 2px 0;
  position:relative;z-index:1;}
.cq-partie{display:flex;flex-direction:column;gap:3px;text-align:left;padding:13px 14px;
  border-radius:14px;cursor:pointer;background:linear-gradient(160deg,#1a2c5444,#0c193866);
  border:1px solid #ffffff14;transition:transform .1s,border-color .15s,background .15s;}
.cq-partie:hover{transform:translateY(-2px);border-color:#d8b15a55;
  background:linear-gradient(160deg,#20366088,#0c193899);}
.cq-partie:active{transform:translateY(0);}
.cq-partie-label{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:#fff;}
.cq-partie-desc{font-size:11.5px;color:var(--muted);line-height:1.25;}
.cq-quest-back{background:none;border:none;color:var(--gold);cursor:pointer;
  font-size:12.5px;font-family:inherit;padding:0;}
.cq-quest-cat{font-size:11px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--gold);margin-bottom:6px;}
.cq-quest-stats{font-family:'Space Mono',monospace;font-size:12px;color:var(--muted);}
.cq-quest-stats b{color:#fff;font-size:14px;}
.cq-quest-prompt{font-family:'Cormorant Garamond',serif;font-size:22px;line-height:1.2;
  color:#fff;font-weight:600;}
.cq-quest-foot{margin-top:12px;display:flex;align-items:center;gap:10px;
  justify-content:space-between;flex-wrap:wrap;}
.cq-quest-win{color:#7ee08a;font-weight:600;font-size:15px;}
.cq-quest-next{padding:9px 15px;border-radius:11px;cursor:pointer;font-weight:600;
  color:#1a1304;background:linear-gradient(135deg,#E8C778,#d8b15a);border:none;
  font-family:'Space Grotesk',sans-serif;font-size:14px;box-shadow:0 3px 12px #d8b15a33;}
.cq-quest-hintbtn{background:none;border:none;color:var(--gold);cursor:pointer;
  font-size:13px;text-decoration:underline;font-family:inherit;padding:0;}
.cq-quest-hint{font-size:13.5px;color:#cfe0ff;font-style:italic;line-height:1.4;}

/* scène */
.cq-stage{position:relative;z-index:1;margin-top:6px;}
.cq-atom{width:100%;height:auto;max-height:52vh;display:block;overflow:hidden;
  animation:cq-enter .5s ease-out;transform-box:view-box;transform-origin:center;
  touch-action:pan-y;cursor:grab;-webkit-user-select:none;user-select:none;}
.cq-atom:active{cursor:grabbing;}
@keyframes cq-enter{from{opacity:.15;transform:scale(.9);}to{opacity:1;transform:scale(1);}}
.cq-orbit{fill:none;stroke:#9fb6e236;stroke-width:1.1;}
.cq-electron{fill:#bfe6ff;filter:drop-shadow(0 0 5px #7fd3e8cc);}

/* contrôles de manipulation */
.cq-atom-controls{display:flex;align-items:center;justify-content:space-between;
  gap:10px;margin:-2px 6px 0;position:relative;z-index:1;}
.cq-hint{font-size:11px;color:var(--muted);font-weight:300;letter-spacing:.01em;}
.cq-zoom-grp{display:flex;gap:6px;}
.cq-zoom-btn{width:34px;height:34px;border-radius:9px;flex:none;
  display:grid;place-items:center;font-size:16px;line-height:1;
  color:var(--ink);background:#15264a;border:1px solid #ffffff1c;cursor:pointer;
  transition:background .15s,transform .08s;}
.cq-zoom-btn:hover{background:#1c3160;}
.cq-zoom-btn:active{transform:translateY(1px) scale(.96);}

/* légende des sous-couches */
.cq-sub-legend{display:flex;align-items:center;gap:10px;margin:8px 6px 0;
  position:relative;z-index:1;flex-wrap:wrap;}
.cq-sub-lab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);}
.cq-sub-chip{display:flex;align-items:center;gap:5px;font-family:'Space Mono',monospace;
  font-size:13px;color:#dfe8f7;}
.cq-sub-chip i{width:11px;height:11px;border-radius:50%;display:inline-block;
  box-shadow:0 0 6px currentColor;}
.cq-quark-note{font-size:11px;color:var(--muted);font-style:italic;}
.cq-nucleus{transform-box:view-box;transform-origin:center;
  animation:cq-pulse 4s ease-in-out infinite;}
@keyframes cq-pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.045);}}
.cq-nucleus-glow{opacity:.14;filter:blur(8px);}
.cq-proton{fill:#E85A47;stroke:#3a0f08;stroke-width:.4;}
.cq-neutron{fill:#8C9AB4;stroke:#1a2536;stroke-width:.4;}
.cq-quark-u{fill:#F2A65A;stroke:#5a2a0a;stroke-width:.3;}
.cq-quark-d{fill:#5A8CF2;stroke:#0a1a40;stroke-width:.3;}
.cq-quark-lbl{fill:#0a0e1a;font-family:'Space Mono',monospace;font-weight:700;
  pointer-events:none;}

/* carte d'identité */
.cq-id{display:flex;align-items:center;gap:14px;
  margin:8px 4px 0;padding:14px 16px;border-radius:16px;
  background:linear-gradient(160deg,#1a2c5444,#0c193866);
  border:1px solid #ffffff14;backdrop-filter:blur(6px);}
.cq-id-sym{font-family:'Cormorant Garamond',serif;font-weight:700;
  font-size:52px;line-height:.9;color:var(--cc);
  text-shadow:0 0 22px color-mix(in srgb,var(--cc) 45%,transparent);min-width:64px;}
.cq-id-main{flex:1;}
.cq-id-name{font-family:'Cormorant Garamond',serif;font-size:26px;
  font-weight:600;line-height:1;color:#fff;margin-bottom:7px;}
.cq-badge{display:inline-block;font-size:11px;letter-spacing:.04em;
  padding:3px 9px;border-radius:20px;color:var(--cc);
  background:color-mix(in srgb,var(--cc) 14%,transparent);
  border:1px solid color-mix(in srgb,var(--cc) 35%,transparent);}
.cq-id-z{text-align:center;}
.cq-z-num{display:block;font-family:'Space Mono',monospace;font-size:30px;
  font-weight:700;color:#fff;line-height:1;}
.cq-z-lab{font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);}

/* compteurs */
.cq-counts{display:flex;gap:8px;margin:12px 2px 0;position:relative;z-index:1;}
.cq-count{flex:1;text-align:center;padding:9px 4px;border-radius:11px;
  background:#ffffff09;border:1px solid #ffffff10;font-size:12.5px;color:var(--muted);}
.cq-count b{display:block;font-family:'Space Mono',monospace;font-size:19px;margin-bottom:2px;}

/* infos */
.cq-info{margin:12px 2px 0;padding:13px 15px;border-radius:14px;
  background:#0a142e7a;border:1px solid #ffffff0f;position:relative;z-index:1;}
.cq-info-row{display:flex;justify-content:space-between;align-items:baseline;
  gap:12px;padding:5px 0;font-size:13.5px;border-bottom:1px solid #ffffff08;}
.cq-info-row:last-of-type{border-bottom:none;}
.cq-info-lab{font-size:11px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--gold);flex:none;}
.cq-config{font-family:'Space Mono',monospace;font-size:13px;color:#cfe0ff;
  text-align:right;}
.cq-mono{font-family:'Space Mono',monospace;font-size:13px;color:#cfe0ff;}
.cq-mono sup{font-size:9px;}
.cq-fact{margin-top:9px;padding-top:10px;border-top:1px solid #ffffff0d;
  font-family:'Cormorant Garamond',serif;font-style:italic;font-size:17px;
  line-height:1.35;color:#e7eefb;}
.cq-fact b{font-style:normal;color:var(--gold);font-family:'Space Grotesk',sans-serif;
  font-size:12px;letter-spacing:.04em;text-transform:uppercase;}
.cq-savant{margin-top:8px;font-size:13.5px;color:#cfe0ff;line-height:1.4;}
.cq-danger{margin-top:8px;font-size:13px;color:#f0a58f;line-height:1.4;font-weight:500;}

/* fiche détaillée */
.cq-sheet{margin:12px 2px 0;padding:14px 15px;border-radius:14px;position:relative;z-index:1;
  background:linear-gradient(165deg,#101f44a8,#0a142e9c);
  border:1px solid #ffffff10;
  box-shadow:inset 0 1px 0 #ffffff0a;}
.cq-sheet-head{display:flex;align-items:center;justify-content:space-between;
  gap:10px;margin-bottom:12px;flex-wrap:wrap;}
.cq-sheet-title{font-family:'Cormorant Garamond',serif;font-size:21px;font-weight:600;color:#fff;}
.cq-state{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted);
  text-transform:capitalize;}
.cq-state i{width:9px;height:9px;border-radius:50%;display:inline-block;
  box-shadow:0 0 7px currentColor;}
.cq-sheet-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.cq-tile{padding:9px 11px;border-radius:10px;background:#ffffff08;
  border:1px solid #ffffff0d;}
.cq-tile-lab{display:block;font-size:10px;letter-spacing:.08em;text-transform:uppercase;
  color:var(--gold);margin-bottom:3px;}
.cq-tile-val{font-family:'Space Mono',monospace;font-size:15px;color:#eaf0fb;}
.cq-disc{display:flex;flex-direction:column;gap:3px;margin-top:11px;
  padding-top:11px;border-top:1px solid #ffffff0d;font-size:13.5px;color:#cfe0ff;}

/* commandes */
.cq-controls{margin:14px 2px 0;position:relative;z-index:1;}
.cq-ctrl-line{display:flex;align-items:center;gap:9px;margin-bottom:11px;}
.cq-btn{font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:500;
  color:var(--ink);background:#15264a;border:1px solid #ffffff1c;border-radius:12px;
  padding:13px 16px;cursor:pointer;transition:transform .08s, background .15s, border-color .15s;
  min-width:52px;}
.cq-btn:hover:not(:disabled){background:#1c3160;border-color:#ffffff33;}
.cq-btn:active:not(:disabled){transform:translateY(1px) scale(.98);}
.cq-btn:disabled{opacity:.35;cursor:not-allowed;}
.cq-btn-gold{flex:1;font-weight:600;font-size:16.5px;color:#1a1304;
  background:linear-gradient(135deg,#E8C778,#d8b15a);border:none;
  box-shadow:0 4px 18px #d8b15a3a;letter-spacing:.01em;}
.cq-btn-gold:hover:not(:disabled){background:linear-gradient(135deg,#f2d488,#e0bb63);}
.cq-btn-sm{padding:8px 13px;min-width:42px;font-size:15px;}
.cq-ctrl-neutron{gap:10px;}
.cq-ctrl-lab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);}
.cq-neutron-val{font-family:'Space Mono',monospace;font-size:17px;min-width:30px;
  text-align:center;color:#cfe0ff;}
.cq-reset{margin-left:auto;background:none;border:none;color:var(--gold);
  font-size:12px;cursor:pointer;text-decoration:underline;font-family:inherit;}
.cq-slider-wrap{display:flex;align-items:center;gap:11px;margin-top:4px;}
.cq-slider{flex:1;-webkit-appearance:none;appearance:none;height:4px;border-radius:4px;
  background:linear-gradient(90deg,var(--gold),#3a4f7e);outline:none;}
.cq-slider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;
  border-radius:50%;background:#fff;border:3px solid var(--gold);cursor:pointer;
  box-shadow:0 0 10px #d8b15a88;}
.cq-slider::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#fff;
  border:3px solid var(--gold);cursor:pointer;}
.cq-slider-z{min-width:42px;text-align:right;color:var(--gold-bright);}

/* tableau périodique */
.cq-map{margin:24px 2px 0;position:relative;z-index:1;}
.cq-map-head{display:flex;align-items:baseline;justify-content:space-between;}
.cq-map-title{margin:0;font-family:'Cormorant Garamond',serif;font-weight:600;
  font-size:22px;color:#fff;}
.cq-progress{font-family:'Space Mono',monospace;font-size:12px;color:var(--gold);}
.cq-map-hint{margin:2px 0 11px;font-size:12.5px;color:var(--muted);font-weight:300;}
.cq-ptable-scroll{overflow-x:auto;padding-bottom:8px;
  -webkit-overflow-scrolling:touch;scrollbar-width:thin;}
.cq-ptable{display:grid;grid-template-columns:repeat(18,46px);
  grid-auto-rows:46px;gap:4px;width:max-content;padding:2px;}
.cq-cell{position:relative;border-radius:7px;cursor:pointer;padding:3px 4px 4px;
  background:color-mix(in srgb,var(--cc) 42%,#0a142e);
  border:1px solid color-mix(in srgb,var(--cc) 72%,transparent);
  display:flex;flex-direction:column;align-items:stretch;justify-content:space-between;
  transition:transform .1s, box-shadow .15s;color:#f3f7ff;}
.cq-cell:hover{transform:translateY(-2px);
  background:color-mix(in srgb,var(--cc) 55%,#0a142e);
  box-shadow:0 4px 14px color-mix(in srgb,var(--cc) 55%,transparent);}
.cq-cell.is-active{border-color:var(--gold-bright);
  box-shadow:0 0 0 2px var(--gold-bright),0 0 16px #e8c77866;
  background:color-mix(in srgb,var(--cc) 62%,#0a142e);transform:translateY(-2px);}
.cq-cell-head{display:flex;align-items:center;justify-content:space-between;
  font-family:'Space Mono',monospace;line-height:1;}
.cq-cell-z{font-size:9px;font-weight:700;opacity:.95;}
.cq-cell-mass{font-size:7.5px;opacity:.72;}
.cq-cell-sym{font-size:16px;font-weight:700;line-height:1;color:#fff;text-align:center;
  text-shadow:0 1px 2px #00000055;margin-bottom:1px;}
.cq-legend{display:flex;flex-wrap:wrap;gap:8px 13px;margin-top:13px;}
.cq-leg-item{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--muted);}
.cq-leg-item i{width:10px;height:10px;border-radius:3px;display:inline-block;flex:none;}

/* footer */
.cq-footer{margin-top:28px;padding-top:16px;border-top:1px solid #ffffff12;
  text-align:center;position:relative;z-index:1;}
.cq-foot-brand{font-size:12px;color:var(--muted);letter-spacing:.03em;}
.cq-foot-sdg{margin-top:5px;font-family:'Cormorant Garamond',serif;font-style:italic;
  font-size:15px;color:var(--gold);}

:focus-visible{outline:2px solid var(--gold-bright);outline-offset:2px;border-radius:6px;}

/* GRAND ÉCRAN / PAYSAGE : remplir l'écran, deux colonnes, tableau pleine largeur.
   Se déclenche dès 700px de large, OU dès qu'on est en paysage (≥560px) —
   ce qui couvre les téléphones tournés à l'horizontale. */
@media (min-width:700px), (orientation:landscape) and (min-width:560px){
  .cq-root{max-width:min(1600px,96vw);padding:24px clamp(16px,3vw,46px) 50px;}
  .cq-cols{flex-direction:row;gap:clamp(16px,2.4vw,34px);align-items:flex-start;}
  .cq-left{flex:1.05;}
  .cq-right{flex:1;}
  .cq-atom{max-height:58vh;}
  .cq-ptable-scroll{overflow-x:visible;display:block;padding-bottom:0;}
  .cq-ptable{grid-template-columns:repeat(18,minmax(0,1fr));
    grid-auto-rows:clamp(38px,5vw,82px);width:100%;gap:clamp(3px,0.5vw,6px);}
  .cq-cell-sym{font-size:clamp(13px,1.55vw,22px);}
  .cq-cell-z{font-size:clamp(8px,0.8vw,12px);}
  .cq-cell-mass{font-size:clamp(6.5px,0.62vw,10px);}
  .cq-id,.cq-counts,.cq-info,.cq-sheet,.cq-controls,.cq-atom-controls,.cq-sub-legend{margin-left:0;margin-right:0;}
}

/* PAYSAGE COURT (téléphone tourné) : compacter la hauteur pour tout voir */
@media (orientation:landscape) and (max-height:560px){
  .cq-root{padding-top:12px;}
  .cq-lede{display:none;}
  .cq-atom{max-height:78vh;}
}

@media (max-width:420px){
  .cq-title{font-size:26px;}
  .cq-id-sym{font-size:44px;min-width:54px;}
  .cq-ptable{grid-template-columns:repeat(18,42px);grid-auto-rows:42px;}
}
@media (prefers-reduced-motion:reduce){
  .cq-nucleus,.cq-atom{animation:none!important;}
}

/* bascule de langue */
.cq-head-txt{flex:1;min-width:0;}
.cq-lang{display:flex;gap:4px;flex:none;background:#ffffff0d;border:1px solid #ffffff1a;
  border-radius:10px;padding:3px;}
.cq-lang-btn{padding:5px 9px;border-radius:7px;font-family:'Space Grotesk',sans-serif;
  font-size:12px;font-weight:600;letter-spacing:.04em;color:var(--muted);cursor:pointer;
  background:transparent;border:none;transition:all .15s;}
.cq-lang-btn.on{color:#1a1304;background:linear-gradient(135deg,#E8C778,#d8b15a);
  box-shadow:0 2px 8px #d8b15a33;}

/* contact */
.cq-contact{margin:26px 2px 0;padding:16px 18px;border-radius:16px;position:relative;z-index:1;
  text-align:center;background:linear-gradient(160deg,#16264e55,#0c193866);
  border:1px solid #ffffff14;}
.cq-contact-title{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:19px;color:#fff;}
.cq-contact-line{font-size:13px;color:var(--muted);margin:3px 0 11px;font-weight:300;}
.cq-contact-links{display:flex;flex-wrap:wrap;gap:9px 14px;justify-content:center;}
.cq-contact-link{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:10px;
  font-size:13.5px;font-weight:500;color:var(--gold-bright);text-decoration:none;
  background:#ffffff0d;border:1px solid #d8b15a33;transition:all .15s;}
.cq-contact-link:hover{background:#d8b15a22;border-color:#d8b15a66;}

/* SOUTIEN */
.cq-support{margin:26px 2px 0;padding:18px;border-radius:16px;position:relative;z-index:1;
  text-align:center;background:linear-gradient(160deg,#1c2a5455,#0c193877);border:1px solid #E8C77822;}
.cq-support-title{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:21px;color:var(--gold-bright);}
.cq-support-text{font-size:13.5px;line-height:1.55;color:#d7def0;font-weight:300;margin:7px auto 0;max-width:520px;}
.cq-support-pick{font-size:12px;color:var(--muted);margin:13px 0 11px;font-weight:400;}
.cq-support-logos{display:flex;justify-content:center;gap:14px;flex-wrap:wrap;}
.cq-logo-btn{display:flex;flex-direction:column;align-items:center;gap:7px;padding:11px 9px;
  border-radius:15px;background:#ffffff0c;border:1px solid var(--mc,#ffffff22);cursor:pointer;
  transition:all .15s;width:104px;font-family:inherit;}
.cq-logo-btn:hover{background:color-mix(in srgb,var(--mc) 16%,transparent);transform:translateY(-1px);}
.cq-logo-btn.on{border-color:var(--mc);
  box-shadow:0 0 0 2px color-mix(in srgb,var(--mc) 38%,transparent);}
.cq-logo-img{width:56px;height:56px;border-radius:13px;object-fit:cover;background:#fff;
  box-shadow:0 1px 5px #00000044;}
.cq-logo-name{font-size:12.5px;font-weight:600;color:#eef2fb;letter-spacing:.02em;}
.cq-support-reveal{min-height:38px;margin-top:15px;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:3px;}
.cq-reveal-num{font-family:'Space Mono','Courier New',monospace;font-size:19px;font-weight:600;
  color:var(--gold-bright);letter-spacing:1.5px;}
.cq-reveal-copied{font-size:12px;color:#7ee0a0;font-weight:500;}
.cq-reveal-hint{font-size:12.5px;color:var(--muted);font-style:italic;}
.cq-support-thanks{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:15px;
  color:#cdab63;margin-top:14px;}


/* ARABE — lecture droite à gauche, en gardant la partie scientifique en LTR */
.cq-rtl{direction:rtl;}
.cq-rtl .cq-ptable,.cq-rtl .cq-stage,.cq-rtl .cq-id,.cq-rtl .cq-counts,
.cq-rtl .cq-modes,.cq-rtl .cq-lang,.cq-rtl .cq-controls,.cq-rtl .cq-ctrl-line,
.cq-rtl .cq-sheet-grid,.cq-rtl .cq-config,.cq-rtl .cq-mono,.cq-rtl .cq-slider-wrap,
.cq-rtl .cq-quest-head,.cq-rtl .cq-quest-foot,.cq-rtl .cq-header,
.cq-rtl .cq-legend,.cq-rtl .cq-contact-links{direction:ltr;}
.cq-rtl .cq-head-txt,.cq-rtl .cq-lede,.cq-rtl .cq-quest-prompt,.cq-rtl .cq-quest-hint,
.cq-rtl .cq-quest-cat,.cq-rtl .cq-map-hint,.cq-rtl .cq-map-title,.cq-rtl .cq-fact,
.cq-rtl .cq-savant,.cq-rtl .cq-danger,.cq-rtl .cq-partie,.cq-rtl .cq-contact-title,
.cq-rtl .cq-contact-line,.cq-rtl .cq-info-row{text-align:right;}
.cq-rtl .cq-tile{align-items:flex-end;text-align:right;}
.cq-rtl .cq-badge{margin-left:0;margin-right:8px;}

/* sélecteur de cible de rotation (orbites / noyau) */
.cq-rot-grp{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:7px;}
.cq-rot-lab{font-family:'Space Grotesk',sans-serif;font-size:11px;letter-spacing:.06em;
  text-transform:uppercase;color:var(--muted);}
.cq-rot-btn{padding:5px 11px;border-radius:8px;font-family:'Space Grotesk',sans-serif;
  font-size:12.5px;font-weight:600;color:var(--muted);cursor:pointer;background:#ffffff0d;
  border:1px solid #ffffff1a;transition:all .15s;}
.cq-subtitle{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:15px;
  color:var(--muted);margin-top:1px;line-height:1.2;}
.cq-rtl .cq-subtitle{text-align:right;}
.cq-rot-btn.on{color:#1a1304;background:linear-gradient(135deg,#E8C778,#d8b15a);
  border-color:#d8b15a;box-shadow:0 2px 8px #d8b15a33;}

/* définitions essentielles */
.cq-defs{margin:26px 2px 0;position:relative;z-index:1;}
.cq-defs-title{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:21px;margin:0;
  color:#fff;margin:0 0 12px;}
.cq-install{display:inline-flex;align-items:center;gap:8px;margin:0 2px 4px;
  font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:600;cursor:pointer;
  color:#1a1304;background:linear-gradient(135deg,#E8C778,#d8b15a);
  border:none;border-radius:11px;padding:10px 16px;
  box-shadow:0 6px 18px -6px rgba(232,199,120,.5);}
.cq-install:hover{filter:brightness(1.05);}
.cq-defs-toggle{display:flex;align-items:center;justify-content:space-between;gap:12px;
  width:100%;cursor:pointer;background:rgba(255,255,255,.03);
  border:1px solid rgba(232,199,120,.18);border-radius:12px;padding:11px 15px;text-align:start;}
.cq-defs-toggle:hover{background:rgba(232,199,120,.08);border-color:rgba(232,199,120,.34);}
.cq-defs-chev{color:#E8C778;font-size:14px;}
.cq-defs-grid{display:grid;grid-template-columns:1fr;gap:10px;}
.cq-def{padding:13px 15px;border-radius:14px;background:linear-gradient(160deg,#16264e44,#0c193855);
  border:1px solid #ffffff12;}
.cq-def-term{display:block;font-family:'Space Grotesk',sans-serif;font-weight:600;
  font-size:14px;color:var(--gold-bright);letter-spacing:.02em;margin-bottom:4px;}
.cq-def-text{display:block;font-size:13.5px;line-height:1.5;color:#dfe7f5;font-weight:300;}
.cq-defs-note{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:15px;
  color:var(--muted);margin:11px 2px 0;}
@media (min-width:700px){ .cq-defs-grid{grid-template-columns:1fr 1fr;gap:12px;} }
.cq-rtl .cq-defs-title,.cq-rtl .cq-def,.cq-rtl .cq-defs-note{text-align:right;}

/* radioactivité */
.cq-cell-radio{position:absolute;top:2px;right:3px;font-size:8px;line-height:1;
  opacity:.85;pointer-events:none;}
.cq-radio{margin-top:8px;font-size:13px;font-weight:600;color:#ffd54a;line-height:1.4;
  display:flex;align-items:center;gap:5px;}
.cq-rtl .cq-radio{flex-direction:row-reverse;text-align:right;}
`;
