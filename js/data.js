/* ========== palette ========== */
export const P={blue:'#EAF1FF',sky:'#E4F4FB',teal:'#E3F5EF',green:'#EAF6E6',amber:'#FDF1DF',rose:'#FCEAEE',plum:'#F6EAF7',violet:'#EFEBFC',sand:'#F6F1E9'};
export const C={blue:'#2563EB',sky:'#0284C7',teal:'#0D9488',green:'#16A34A',amber:'#D97706',rose:'#E11D48',plum:'#C026D3',violet:'#7C3AED',sand:'#A16207'};

/* ========== families: booking types + units ==========
   type  = [id, label, priceMultiplier]
   unit  = [id, label, countNoun, priceMultiplier, stepSize]
   final price = round(basePrice * typeMult * unitMult) ; total = price * qty      */
export const FAM = {
  ac:{types:[['service','Service',.9],['repair','Repair',1],['gas','Gas refill',3.4],['install','Installation',1.9],['uninstall','Uninstallation',1.2]],
      units:[['split','Split AC','unit',1,1],['window','Window AC','unit',.85,1],['cassette','Cassette AC','unit',1.65,1]]},
  elec:{types:[['repair','Repair',1],['install','Installation',1.3],['inspect','Inspection',.7]],
      units:[['board','Switchboard','point',1,1],['fan','Fan',,'',1],['light','Light point','point',.8,1],['mcb','MCB / Inverter','unit',1.6,1]]},
  plumb:{types:[['repair','Repair',1],['install','Installation',1.35],['inspect','Inspection',.7]],
      units:[['tap','Tap / mixer','fixture',1,1],['basin','Wash basin','fixture',1.2,1],['flush','Flush tank','fixture',1.3,1],['drain','Drain line','line',1.5,1]]},
  clean:{types:[['standard','Standard clean',1],['deep','Deep clean',1.45],['movein','Move-in / move-out',1.75]],
      units:[['bath','Bathroom','bathroom',1,1],['kitchen','Kitchen','kitchen',1.6,1],['bedroom','Bedroom','room',1.3,1],['living','Living room','room',1.5,1]]},
  home:{types:[['standard','Standard clean',1],['deep','Deep clean',1.4],['premium','Premium clean',1.8]],
      units:[['1bhk','1 BHK','home',.75,1],['2bhk','2 BHK','home',1,1],['3bhk','3 BHK','home',1.35,1],['4bhk','4 BHK / villa','home',1.7,1]]},
  uphol:{types:[['shampoo','Shampooing',1],['dry','Dry cleaning',1.25],['stain','Stain treatment',1.4]],
      units:[['sofa','Sofa (5 seat)','set',1,1],['mattress','Mattress','piece',.8,1],['carpet','Carpet','piece',.9,1],['chair','Chair','piece',.4,1]]},
  appl:{types:[['repair','Repair',1],['service','Service',.85],['install','Installation',1.4]],
      units:[['washer','Washing machine','appliance',1,1],['fridge','Refrigerator','appliance',1.15,1],['micro','Microwave','appliance',.7,1],['geyser','Geyser','appliance',.9,1]]},
  ro:{types:[['service','Service',1],['repair','Repair',1.3],['install','Installation',1.6],['amc','Annual AMC',3.2]],
      units:[['wall','Wall-mount RO','unit',1,1],['under','Under-sink RO','unit',1.25,1]]},
  carp:{types:[['repair','Repair',1],['install','Installation',1.4],['polish','Polishing',1.6]],
      units:[['door','Door','item',1,1],['window','Window','item',.9,1],['wardrobe','Wardrobe','item',1.5,1],['bed','Bed','item',1.3,1],['misc','Chair / table','item',.6,1]]},
  cctv:{types:[['install','Installation',1],['repair','Repair',.6],['relocate','Relocation',.8]],
      units:[['c2','2 cameras','set',.7,1],['c4','4 cameras','set',1,1],['c8','8 cameras','set',1.8,1]]},
  tank:{types:[['clean','Cleaning',1],['sanitise','Cleaning + sanitisation',1.25]],
      units:[['t500','Up to 500 L','tank',.7,1],['t1000','Up to 1000 L','tank',1,1],['t2000','Up to 2000 L','tank',1.5,1]]},
  pest:{types:[['once','One-time treatment',1],['quarter','Quarterly AMC',2.6],['annual','Annual AMC',4.2]],
      units:[['1bhk','1 BHK','home',.8,1],['2bhk','2 BHK','home',1,1],['3bhk','3 BHK','home',1.3,1],['villa','Villa','home',1.8,1]]},
  salon:{types:[['single','Single session',1],['pack3','Package of 3',2.7]],
      units:[['standard','Standard kit','session',1,1],['premium','Premium kit','session',1.5,1],['luxury','Luxury kit','session',2.1,1]]},
  paint:{types:[['repaint','Repainting',1],['fresh','Fresh painting',1.3],['texture','Texture / designer',1.9]],
      units:[['interior','Interior wall','sq ft',1,25],['exterior','Exterior wall','sq ft',1.2,25],['ceiling','Ceiling','sq ft',1.1,25],['wood','Wood / metal','sq ft',1.6,10]]},
  laundry:{types:[['fold','Wash & fold',1],['iron','Wash & iron',1.3],['dry','Dry clean',2.2]],
      units:[['regular','Regular load','kg',1,1],['delicate','Delicates','kg',1.6,1]]},
  move:{types:[['city','Within city',1],['inter','Intercity',2.4]],
      units:[['1bhk','1 BHK','home',1,1],['2bhk','2 BHK','home',1.5,1],['3bhk','3 BHK','home',2.1,1]]},
};
/* fix the one shorthand slip above */
FAM.elec.units[1] = ['fan','Fan','unit',1.1,1];

/* id, name, meta, basePrice, mrp, eta, rating, icon, colour, family, tags, image (optional) */
export const S = [
  ['ac1','AC service & repair','Split, window or cassette',599,899,'60 MINS','4.9','snow','blue','ac','ac aircon air conditioner cooling gas split window technician','/assets/services/ac1.webp'],
  ['el1','Electrical work','Boards, fans, points, MCB',199,349,'45 MINS','4.9','zap','amber','elec','electrical electrician wiring switch board fan light mcb inverter socket short circuit','/assets/services/el1.webp'],
  ['pl1','Plumbing work','Taps, basins, drains, tanks',199,349,'45 MINS','4.8','drop','sky','plumb','plumbing plumber leak tap water drain pipe basin flush blockage seepage','/assets/services/pl1.webp'],
  ['cl1','Room & bathroom cleaning','Per room or bathroom',449,699,'90 MINS','4.8','spray','green','clean','cleaning cleaner bathroom kitchen room mopping housekeeping maid toilet','/assets/services/cl1.webp'],
  ['cl3','Full home cleaning','Whole flat, crew of 4',2499,3999,'5 HRS','4.9','spark','teal','home','cleaning deep clean home flat house housekeeping shifting','/assets/services/cl3.webp'],
  ['cl4','Sofa & mattress cleaning','Foam extraction',899,1299,'2 HRS','4.8','spark','teal','uphol','sofa mattress carpet upholstery shampoo cleaning couch','/assets/services/cl4.webp'],
  ['ap1','Appliance repair','Washer, fridge, geyser, oven',349,549,'75 MINS','4.7','machine','blue','appl','appliance repair washing machine fridge refrigerator geyser microwave oven chimney','/assets/services/ap1.webp'],
  ['ap3','RO & water purifier','Filter, TDS, installation',349,499,'60 MINS','4.8','filter','sky','ro','ro water purifier aquaguard filter tds','/assets/services/ap3.webp'],
  ['ho1','Carpentry','Doors, wardrobes, furniture',249,399,'60 MINS','4.8','hammer','violet','carp','carpenter carpentry furniture wood door wardrobe hinge lock drawer','/assets/services/ho1.webp'],
  ['ho2','CCTV & security','Cameras, DVR, wiring',999,1499,'3 HRS','4.7','cam','violet','cctv','cctv camera security dvr surveillance','/assets/services/ho2.webp'],
  ['ho3','Water tank cleaning','Drain, scrub, sanitise',799,1199,'2 HRS','4.8','tank','teal','tank','water tank cleaning sump overhead','/assets/services/ho3.webp'],
  ['ho4','Pest control','Child and pet safe',1299,1999,'2.5 HRS','4.7','bug','green','pest','pest control cockroach termite ant bedbug mosquito rodent','/assets/services/ho4.webp'],
  ['sa1','Salon at home — women','Sealed, single-use kits',699,1099,'2 HRS','4.9','scissors','plum','salon','salon beauty women waxing threading pedicure manicure'],
  ['sa2','Facial & clean-up','Dermat-approved products',799,1199,'75 MINS','4.9','flower','rose','salon','facial cleanup beauty skin glow'],
  ['sa3','Men’s grooming','Haircut, beard, massage',399,599,'60 MINS','4.8','scissors','plum','salon','salon grooming men haircut beard shave massage barber'],
  ['ot1','Painting','Interior, exterior, texture',12,18,'BOOK','4.7','brush','rose','paint','painting painter wall paint whitewash putty texture','/assets/services/ot1.webp'],
  ['ot2','Laundry','Pickup and delivery',99,149,'30 MINS','4.7','shirt','amber','laundry','laundry dhobi wash iron ironing dry clean clothes'],
  ['ot3','House shifting','Packing, loading, transport',2999,4499,'BOOK','4.6','truck','sand','move','movers packers shifting relocation house move transport'],
];
export const byId = Object.fromEntries(S.map(s=>[s[0],s]));

export const CATS=[['Electrical','zap','amber','el1','/assets/categories/electrical.webp'],['Plumbing','drop','sky','pl1','/assets/categories/plumbing.webp'],
  ['AC repair','snow','blue','ac1','/assets/categories/ac-repair.webp'],['Cleaning','spark','teal','cl1','/assets/categories/cleaning.webp'],
  ['Painting','brush','rose','ot1','/assets/categories/painting.webp'],['Carpentry','hammer','violet','ho1','/assets/categories/carpentry.webp'],
  ['Appliances','machine','blue','ap1','/assets/categories/appliances.webp'],['Pest control','bug','green','ho4','/assets/categories/pest-control.webp'],
  ['RO service','filter','sky','ap3','/assets/categories/ro-service.webp'],['CCTV','cam','violet','ho2','/assets/categories/cctv.webp'],
  ['Water tank','tank','teal','ho3','/assets/categories/water-tank.webp'],['Deep clean','spray','green','cl3','/assets/categories/deep-clean.webp'],
  ['Salon','scissors','plum','sa1'],['Beauty','flower','rose','sa2'],['Laundry','shirt','amber','ot2'],['Movers','truck','sand','ot3']];

export const RAILS=[
  ['Fastest — reaches in 60 minutes','Same-day slots open till 8 PM',['ac1','el1','pl1','cl1','ap1','ap3','ho1','sa3']],
  ['Book again','Based on your last 3 bookings',['ac1','cl1','ap3','el1']],
  ['Cleaning & pest','Crews with their own machines',['cl1','cl3','cl4','ho3','ho4']],
  ['Repairs & fittings','Electrical, plumbing, carpentry',['el1','pl1','ho1','ap1','ho2']],
  ['Salon at home','Verified beauticians, sealed kits',['sa1','sa2','sa3']],
  ['Bigger jobs','Quoted by unit, booked by slot',['ot1','ot3','ot2','cl3']],
];
export const BANNERS=[['20% OFF first booking','Auto-applied at checkout','WELCOME20','#2563EB'],
  ['Free inspection','AC & appliances till 31 Aug','No visiting charge','#0D9488'],
  ['Festive cleaning','Up to 50% off packages','Ends this Sunday','#D97706']];

/* ========== pricing helpers ========== */
export const rupee = n => '₹' + Math.round(n).toLocaleString('en-IN');
export const fam = id => FAM[byId[id][9]];
export const typeOf = (id,t) => fam(id).types.find(x=>x[0]===t);
export const unitOf = (id,u) => fam(id).units.find(x=>x[0]===u);
export function priceOf(id, t, u){
  const base = byId[id][3];
  const v = base * typeOf(id,t)[2] * unitOf(id,u)[3];
  return base < 50 ? Math.round(v) : Math.round(v/10)*10;
}
export function minPrice(id){
  const f = fam(id);
  return Math.min(...f.types.flatMap(t=>f.units.map(u=>priceOf(id,t[0],u[0]))));
}
export const plural = (noun,n) => n===1 || noun==='sq ft' || noun==='kg' ? noun : (noun==='bathroom'||noun==='kitchen'?noun+'s':noun+'s');
export const qtyText = (id,u,n) => `${n} ${plural(unitOf(id,u)[2], n)}`;
export const off = (p,m) => Math.round((1-p/m)*100);
