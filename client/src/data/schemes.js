export const CATEGORIES=[
 {id:'all',label:'All',icon:'LayoutGrid'},
 {id:'farming',label:'Farming & Agriculture',icon:'Sprout'},
 {id:'pension',label:'Senior Citizen Pensions',icon:'HeartHandshake'},
 {id:'housing',label:'Housing',icon:'Home'},
 {id:'women',label:'Women & Child Welfare',icon:'Baby'},
 {id:'wages',label:'Daily Wages',icon:'Hammer'},
]
export const STATE_DISTRICTS={
 'Karnataka':['Bengaluru Urban','Bengaluru Rural','Mysuru','Belagavi','Dharwad','Kalaburagi','Mangaluru (Dakshina Kannada)','Shivamogga','Tumakuru','Ballari','Hubballi-Dharwad'],
 'Maharashtra':['Mumbai','Pune','Nagpur','Nashik','Aurangabad (Sambhajinagar)','Kolhapur','Solapur','Satara','Amravati','Thane'],
 'Uttar Pradesh':['Lucknow','Varanasi','Gorakhpur','Agra','Kanpur Nagar','Prayagraj','Meerut','Bareilly','Aligarh','Moradabad'],
 'Tamil Nadu':['Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Tirunelveli','Thanjavur','Vellore','Erode','Thoothukudi'],
 'Andhra Pradesh':['Visakhapatnam','Vijayawada (NTR)','Guntur','Nellore','Kurnool','Anantapur','Tirupati','Rajahmundry (East Godavari)'],
 'Telangana':['Hyderabad','Warangal','Nizamabad','Karimnagar','Khammam','Nalgonda','Medak','Adilabad'],
}
const central=[
 {name:'PM-KISAN Samman Nidhi',cat:'farming',match:95,benefit:'₹6,000 / year',points:['₹2,000 every 4 months to bank','For land-holding farmer families','Free e-KYC at CSC'],apply:'https://pmkisan.gov.in',docs:['Aadhaar','Land records','Bank passbook']},
 {name:'PM Awas Yojana – Gramin',cat:'housing',match:88,benefit:'Up to ₹1.20 lakh',points:['Money to build pucca house','For homeless / kutcha-house families','Paid in instalments to bank'],apply:'https://pmayg.nic.in',docs:['Aadhaar','Job card / income proof','Bank account','House photo']},
 {name:'Indira Gandhi National Old Age Pension',cat:'pension',match:90,benefit:'Monthly pension',points:['For BPL citizens aged 60+','₹200–₹500/month from Centre + state top-up','Direct to bank / post office'],apply:'https://nsap.nic.in',docs:['Aadhaar','Age proof','BPL ration card','Bank passbook']},
 {name:'e-Shram Card',cat:'wages',match:92,benefit:'₹2 lakh insurance',points:['Free registration for unorganised workers','Accident insurance up to ₹2 lakh','One card for many benefits'],apply:'https://eshram.gov.in',docs:['Aadhaar','Mobile linked to Aadhaar','Bank account']},
 {name:'PM Vishwakarma',cat:'wages',match:84,benefit:'Loan @5% + ₹15,000 toolkit',points:['For artisans & craftspeople','Training with daily stipend','Cheap loan up to ₹3 lakh'],apply:'https://pmvishwakarma.gov.in',docs:['Aadhaar','Ration card','Bank passbook']},
 {name:'Ayushman Bharat (PM-JAY)',cat:'pension',match:86,benefit:'₹5 lakh health cover / year',points:['Free hospital treatment for family','Cashless at listed hospitals','For eligible low-income families'],apply:'https://beneficiary.nha.gov.in',docs:['Aadhaar','Ration card','Mobile number']},
]
const byState={
 'Karnataka':[
  {name:'Sandhya Suraksha Yojane',cat:'pension',match:96,benefit:'₹1,200 / month pension',points:['For Karnataka residents aged 65+','Low annual income families','Apply at Grama One / Nadakacheri'],apply:'https://sevasindhu.karnataka.gov.in',docs:['Aadhaar','Age proof','Income certificate','Bank passbook']},
  {name:'Gruha Lakshmi',cat:'women',match:94,benefit:'₹2,000 / month',points:['To woman head of household','BPL / APL ration card holders','Direct bank transfer'],apply:'https://sevasindhu.karnataka.gov.in',docs:['Aadhaar','Ration card','Bank account in woman name']},
  {name:'Raitha Scholar / Vidya Nidhi',cat:'farming',match:82,benefit:'Scholarship for farmers’ children',points:['For children of land-holding farmers','Study support after 10th standard','Via Seva Sindhu portal'],apply:'https://sevasindhu.karnataka.gov.in',docs:['Aadhaar','Land RTC','Marks card','Bank account']},
  {name:'Shakti – Free Bus Travel',cat:'women',match:93,benefit:'Free bus travel',points:['Free KSRTC bus travel for women','Within Karnataka','Show Aadhaar / ID in bus'],apply:'https://ksrtc.karnataka.gov.in',docs:['Karnataka photo ID / Aadhaar']},
  {name:'Anna Bhagya',cat:'women',match:89,benefit:'Free rice / cash support',points:['Extra rice support for BPL families','Via ration shop / DBT','For ration card holders'],apply:'https://ahara.kar.nic.in',docs:['Ration card','Aadhaar','Bank account']},
 ],
 'Maharashtra':[
  {name:'Mukhyamantri Majhi Ladki Bahin',cat:'women',match:94,benefit:'₹1,500 / month',points:['For women aged 21–65','Maharashtra resident families','Direct to Aadhaar-linked bank'],apply:'https://ladakibahin.maharashtra.gov.in',docs:['Aadhaar','Domicile / ration card','Bank account','Income proof']},
  {name:'Namo Shetkari Mahasanman Nidhi',cat:'farming',match:95,benefit:'₹6,000 / year extra',points:['Top-up over PM-KISAN for farmers','For PM-KISAN beneficiary farmers','Direct bank transfer'],apply:'https://nsmny.mahaitgov.in',docs:['Aadhaar','PM-KISAN ID','Land 7/12','Bank passbook']},
  {name:'Shravanbal Rajya Nivrutti Vetan',cat:'pension',match:91,benefit:'Monthly old-age pension',points:['For destitute citizens aged 65+','Maharashtra residents','Apply via Collector / Aaple Sarkar'],apply:'https://aaplesarkar.mahaonline.gov.in',docs:['Aadhaar','Age proof','Income certificate','Bank account']},
  {name:'Mahatma Jyotiba Phule Jan Arogya',cat:'pension',match:85,benefit:'Free treatment up to ₹5 lakh',points:['Health cover for eligible families','Cashless in listed hospitals','Orange / yellow ration cards'],apply:'https://www.jeevandayee.gov.in',docs:['Ration card','Aadhaar','Income proof']},
 ],
 'Uttar Pradesh':[
  {name:'UP Vridha Pension Yojana',cat:'pension',match:93,benefit:'₹1,000 / month',points:['For UP residents aged 60+','Low-income senior citizens','Quarterly direct transfer'],apply:'https://sspy-up.gov.in',docs:['Aadhaar','Age proof','Income certificate','Bank passbook']},
  {name:'Mukhyamantri Kanya Sumangala',cat:'women',match:90,benefit:'Up to ₹25,000 for girl child',points:['Support from birth to graduation','For UP resident families','Paid in stages to bank'],apply:'https://mksy.up.gov.in',docs:['Aadhaar','Girl birth certificate','Bank account','Domicile']},
  {name:'UP Kisan Kalyan / PM-KISAN help',cat:'farming',match:88,benefit:'Farm income support',points:['PM-KISAN + state farmer services','Land record correction help','Via Jan Seva Kendra'],apply:'https://upkisan kalyan.up.nic.in'.replace(' ',''),docs:['Aadhaar','Khatauni','Bank passbook']},
 ],
 'Tamil Nadu':[
  {name:'Kalaignar Magalir Urimai Thittam',cat:'women',match:95,benefit:'₹1,000 / month',points:['For eligible women family heads','Tamil Nadu ration card families','Direct bank transfer'],apply:'https://www.tnesevai.tn.gov.in',docs:['Aadhaar','Ration card','Bank account']},
  {name:'Tamil Nadu Old Age Pension (OAP)',cat:'pension',match:92,benefit:'₹1,200 / month',points:['For destitute citizens aged 60+','No regular income support','Apply at Taluk office / e-Sevai'],apply:'https://www.tnesevai.tn.gov.in',docs:['Aadhaar','Age proof','Ration card','Bank account']},
  {name:'Uzhavar Paadhukaappu Thittam',cat:'farming',match:87,benefit:'Farmer welfare support',points:['For agricultural labourers & farmers','Marriage, education & accident help','Via VAO / e-Sevai'],apply:'https://www.tnesevai.tn.gov.in',docs:['Aadhaar','Farmer ID','Ration card','Bank account']},
 ],
 'Andhra Pradesh':[
  {name:'YSR Pension Kanuka',cat:'pension',match:94,benefit:'Monthly pension',points:['Old age, widow & disabled pensions','At village / ward secretariat','Direct monthly payment'],apply:'https://sspensions.apcfss.ap.gov.in',docs:['Aadhaar','Ration / rice card','Bank account']},
  {name:'Annadata Sukhibhava',cat:'farming',match:92,benefit:'Farmer investment support',points:['Investment help for farmer families','Including tenant farmers (as notified)','Direct bank transfer'],apply:'https://apfr.apcfss.ap.gov.in',docs:['Aadhaar','Land / tenant proof','Bank passbook']},
  {name:'Thalliki Vandanam',cat:'women',match:85,benefit:'Education support per child',points:['Support to mothers for schooling','For eligible school children','Via secretariat / portal'],apply:'https://gsws.ap.gov.in',docs:['Aadhaar','Student ID','Bank account']},
 ],
 'Telangana':[
  {name:'Aasara Pension',cat:'pension',match:93,benefit:'₹2,016+ / month',points:['Old age, widow, disabled & toddy tapper pensions','Telangana residents','Via MeeSeva'],apply:'https://tgobmms.cgg.gov.in',docs:['Aadhaar','Age proof','Bank account']},
  {name:'Rythu Bharosa',cat:'farming',match:92,benefit:'Farm investment support',points:['Support for pattadar farmers','Season-wise assistance','Direct bank transfer'],apply:'https://rythubharosa.telangana.gov.in',docs:['Aadhaar','Pattadar passbook','Bank account']},
  {name:'Mahalakshmi Scheme',cat:'women',match:90,benefit:'Free bus + LPG support',points:['Free TGSRTC bus travel for women','Subsidised cylinder as notified','Telangana residents'],apply:'https://tgtransport.telangana.gov.in',docs:['Aadhaar','White ration card']},
 ],
}
export function schemesFor(state){
 const list=[...(byState[state]||[]),...central]
 return list.map((s,i)=>({id:(state||'in')+'-'+i,...s,state:state||'All India'}))
}
