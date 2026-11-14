import {useEffect,useMemo,useState} from 'react'
import {motion,MotionConfig,AnimatePresence} from 'framer-motion'
import {Sprout,Volume2,Type,X,CheckCircle2,ShieldCheck} from 'lucide-react'
import SchemeFinder from './components/SchemeFinder.jsx'
import VoiceAssist from './components/VoiceAssist.jsx'
import TiltCard from './components/TiltCard.jsx'
import GuideModal from './components/GuideModal.jsx'
import {schemesFor} from './data/schemes.js'
const API=import.meta.env.VITE_API_BASE_URL||'https://sahayaai-backend.onrender.com'
const LANGS={en:{label:'English',speech:'en-IN',name:'English'},hi:{label:'हिंदी',speech:'hi-IN',name:'Hindi'},kn:{label:'ಕನ್ನಡ',speech:'kn-IN',name:'Kannada'},te:{label:'తెలుగు',speech:'te-IN',name:'Telugu'},ta:{label:'தமிழ்',speech:'ta-IN',name:'Tamil'},mr:{label:'मराठी',speech:'mr-IN',name:'Marathi'}}
const T={
en:{finderTitle:'Find Government Schemes For You',finderSub:'Namaste 🙏 No login needed. Choose your state and district — schemes will appear in big, simple words.',step1:'Step 1 • Your State',step2:'Step 2 • Your District',step3:'Step 3 • What do you need?',chooseState:'— Select State —',chooseDistrict:'— Select District —',firstState:'First select State above',emptyTitle:'Where do you live?',emptyText:'Please select your State and District above. Then your schemes will appear here — big, clear and easy.',noCat:'No schemes in this category here',noCatSub:'Try “All Schemes” to see everything for your district.',schemesForYou:'schemes for you',check:'Eligibility',apply:'Apply Now',listen:'Read Aloud',save:'Save',voice:'Speak to Search',listening:'Listening… speak now',voiceHint:'Say your state, work, or a scheme. Example: “I am a farmer in Karnataka”.',tapSpeak:'Tap & Speak',voiceUnsupported:'Voice needs Chrome on Android. You can still tap everything easily.',checkTitle:'Eligibility Check',heroTitle:'Government help, in your language.',heroSub:'Big buttons. Simple words. No login. No agent. No fees. Tap, listen, and find money & support for your family.',findBtn:'Find My Schemes',saved:'My Saved Schemes',guide:'Step-by-Step Application Guide'},
hi:{finderTitle:'अपने लिए सरकारी योजनाएँ खोजें',finderSub:'नमस्ते 🙏 लॉगिन की ज़रूरत नहीं। राज्य और ज़िला चुनें — योजनाएँ सरल शब्दों में दिखेंगी।',step1:'चरण 1 • आपका राज्य',step2:'चरण 2 • आपका ज़िला',step3:'चरण 3 • आपको क्या चाहिए?',chooseState:'— राज्य चुनें —',chooseDistrict:'— ज़िला चुनें —',firstState:'पहले ऊपर राज्य चुनें',emptyTitle:'आप कहाँ रहते हैं?',emptyText:'कृपया ऊपर राज्य और ज़िला चुनें। फिर योजनाएँ यहाँ दिखेंगी।',noCat:'इस श्रेणी में योजना नहीं',noCatSub:'“All Schemes” चुनकर सभी देखें।',schemesForYou:'योजनाएँ आपके लिए',check:'पात्रता',apply:'आवेदन करें',listen:'सुनें',save:'सेव करें',voice:'बोलकर खोजें',listening:'सुन रहे हैं… बोलिए',voiceHint:'अपना राज्य, काम या योजना बोलें।',tapSpeak:'दबाकर बोलें',voiceUnsupported:'वॉइस के लिए Chrome उपयोग करें।',checkTitle:'पात्रता जाँच',heroTitle:'सरकारी मदद, आपकी भाषा में।',heroSub:'बड़े बटन। सरल शब्द। कोई लॉगिन नहीं। कोई एजेंट नहीं।',findBtn:'मेरी योजनाएँ खोजें',saved:'मेरी सेव योजनाएँ',guide:'चरण-दर-चरण आवेदन मार्गदर्शिका'},
kn:{finderTitle:'ನಿಮಗಾಗಿ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ',finderSub:'ನಮಸ್ತೆ 🙏 ಲಾಗಿನ್ ಬೇಡ. ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆ ಆರಿಸಿ — ಸರಳವಾಗಿ ತೋರಿಸುತ್ತೇವೆ.',step1:'ಹಂತ 1 • ನಿಮ್ಮ ರಾಜ್ಯ',step2:'ಹಂತ 2 • ನಿಮ್ಮ ಜಿಲ್ಲೆ',step3:'ಹಂತ 3 • ನಿಮಗೆ ಏನು ಬೇಕು?',chooseState:'— ರಾಜ್ಯ ಆರಿಸಿ —',chooseDistrict:'— ಜಿಲ್ಲೆ ಆರಿಸಿ —',firstState:'ಮೊದಲು ರಾಜ್ಯ ಆರಿಸಿ',emptyTitle:'ನೀವು ಎಲ್ಲಿ ವಾಸಿಸುತ್ತೀರಿ?',emptyText:'ದಯವಿಟ್ಟು ಮೇಲೆ ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆ ಆರಿಸಿ.',noCat:'ಈ ವಿಭಾಗದಲ್ಲಿ ಯೋಜನೆ ಇಲ್ಲ',noCatSub:'“All Schemes” ಆರಿಸಿ ಎಲ್ಲಾ ನೋಡಿ.',schemesForYou:'ಯೋಜನೆಗಳು ನಿಮಗಾಗಿ',check:'ಅರ್ಹತೆ',apply:'ಅರ್ಜಿ ಹಾಕಿ',listen:'ಓದಿ ಕೇಳಿಸಿ',save:'ಉಳಿಸಿ',voice:'ಮಾತನಾಡಿ ಹುಡುಕಿ',listening:'ಕೇಳುತ್ತಿದ್ದೇನೆ… ಮಾತನಾಡಿ',voiceHint:'ರಾಜ್ಯ, ಕೆಲಸ ಅಥವಾ ಯೋಜನೆ ಹೇಳಿ.',tapSpeak:'ಒತ್ತಿ ಮಾತನಾಡಿ',voiceUnsupported:'ಧ್ವನಿಗೆ Chrome ಬಳಸಿ.',checkTitle:'ಅರ್ಹತೆ ಪರಿಶೀಲನೆ',heroTitle:'ಸರ್ಕಾರಿ ಸಹಾಯ, ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ.',heroSub:'ದೊಡ್ಡ ಬಟನ್‌ಗಳು. ಸರಳ ಮಾತು. ಲಾಗಿನ್ ಇಲ್ಲ. ಏಜೆಂಟ್ ಇಲ್ಲ.',findBtn:'ನನ್ನ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ',saved:'ನನ್ನ ಉಳಿಸಿದ ಯೋಜನೆಗಳು',guide:'ಹಂತ-ಹಂತದ ಅರ್ಜಿ ಮಾರ್ಗದರ್ಶಿ'},
te:{finderTitle:'మీ కోసం ప్రభుత్వ పథకాలు కనుగొనండి',finderSub:'నమస్తే 🙏 లాగిన్ అవసరం లేదు. రాష్ట్రం, జిల్లా ఎంచుకోండి.',step1:'దశ 1 • మీ రాష్ట్రం',step2:'దశ 2 • మీ జిల్లా',step3:'దశ 3 • మీకు ఏమి కావాలి?',chooseState:'— రాష్ట్రం ఎంచుకోండి —',chooseDistrict:'— జిల్లా ఎంచుకోండి —',firstState:'ముందు రాష్ట్రం ఎంచుకోండి',emptyTitle:'మీరు ఎక్కడ ఉంటారు?',emptyText:'దయచేసి పైన రాష్ట్రం, జిల్లా ఎంచుకోండి.',noCat:'ఈ విభాగంలో పథకం లేదు',noCatSub:'“All Schemes” ఎంచుకుని అన్నీ చూడండి.',schemesForYou:'పథకాలు మీ కోసం',check:'అర్హత',apply:'దరఖాస్తు చేయండి',listen:'చదివి వినిపించు',save:'సేవ్',voice:'మాట్లాడి వెతకండి',listening:'వింటున్నాను… మాట్లాడండి',voiceHint:'రాష్ట్రం, పని లేదా పథకం చెప్పండి.',tapSpeak:'నొక్కి మాట్లాడండి',voiceUnsupported:'వాయిస్ కోసం Chrome వాడండి.',checkTitle:'అర్హత తనిఖీ',heroTitle:'ప్రభుత్వ సహాయం, మీ భాషలో.',heroSub:'పెద్ద బటన్లు. సులభమైన మాటలు. లాగిన్ లేదు.',findBtn:'నా పథకాలు కనుగొనండి',saved:'నా సేవ్ పథకాలు',guide:'దశల వారీ దరఖాస్తు గైడ్'},
ta:{finderTitle:'உங்களுக்கான அரசு திட்டங்களைக் கண்டறியுங்கள்',finderSub:'வணக்கம் 🙏 உள்நுழைவு தேவையில்லை. மாநிலம், மாவட்டம் தேர்ந்தெடுங்கள்.',step1:'படி 1 • உங்கள் மாநிலம்',step2:'படி 2 • உங்கள் மாவட்டம்',step3:'படி 3 • உங்களுக்கு என்ன வேண்டும்?',chooseState:'— மாநிலம் தேர்வு —',chooseDistrict:'— மாவட்டம் தேர்வு —',firstState:'முதலில் மாநிலம் தேர்வு செய்யுங்கள்',emptyTitle:'நீங்கள் எங்கே வசிக்கிறீர்கள்?',emptyText:'மேலே மாநிலம் மற்றும் மாவட்டத்தைத் தேர்ந்தெடுங்கள்.',noCat:'இந்த பிரிவில் திட்டம் இல்லை',noCatSub:'“All Schemes” தேர்ந்து அனைத்தையும் பாருங்கள்.',schemesForYou:'திட்டங்கள் உங்களுக்கு',check:'தகுதி',apply:'விண்ணப்பிக்க',listen:'படித்து கேளுங்கள்',save:'சேமி',voice:'பேசி தேடுங்கள்',listening:'கேட்கிறேன்… பேசுங்கள்',voiceHint:'மாநிலம், வேலை அல்லது திட்டம் சொல்லுங்கள்.',tapSpeak:'தட்டி பேசுங்கள்',voiceUnsupported:'குரலுக்கு Chrome பயன்படுத்துங்கள்.',checkTitle:'தகுதி சரிபார்ப்பு',heroTitle:'அரசு உதவி, உங்கள் மொழியில்.',heroSub:'பெரிய பொத்தான்கள். எளிய வார்த்தைகள். உள்நுழைவு இல்லை.',findBtn:'என் திட்டங்களைக் கண்டறியுங்கள்',saved:'என் சேமித்த திட்டங்கள்',guide:'படிப்படியான விண்ணப்ப வழிகாட்டி'},
mr:{finderTitle:'तुमच्यासाठी सरकारी योजना शोधा',finderSub:'नमस्कार 🙏 लॉगिनची गरज नाही. राज्य आणि जिल्हा निवडा.',step1:'पायरी 1 • तुमचे राज्य',step2:'पायरी 2 • तुमचा जिल्हा',step3:'पायरी 3 • तुम्हाला काय हवे?',chooseState:'— राज्य निवडा —',chooseDistrict:'— जिल्हा निवडा —',firstState:'आधी राज्य निवडा',emptyTitle:'तुम्ही कुठे राहता?',emptyText:'कृपया वर राज्य आणि जिल्हा निवडा.',noCat:'या श्रेणीत योजना नाही',noCatSub:'“All Schemes” निवडून सर्व पहा.',schemesForYou:'योजना तुमच्यासाठी',check:'पात्रता',apply:'अर्ज करा',listen:'वाचून ऐका',save:'जतन करा',voice:'बोलून शोधा',listening:'ऐकत आहे… बोला',voiceHint:'राज्य, काम किंवा योजना सांगा.',tapSpeak:'दाबून बोला',voiceUnsupported:'आवाजासाठी Chrome वापरा.',checkTitle:'पात्रता तपासणी',heroTitle:'सरकारी मदत, तुमच्या भाषेत.',heroSub:'मोठी बटणे. सोपी भाषा. लॉगिन नाही. एजंट नाही.',findBtn:'माझ्या योजना शोधा',saved:'माझ्या जतन योजना',guide:' टप्प्याटप्प्याने अर्ज मार्गदर्शक'}}

const GUIDE_T={
en:{guideBtn:'View Step-by-Step Guide',visitBtn:'Visit Official Government Website & Guide',tabGuide:'What to do on the Official Website',tabLink:'Direct Official Link',hearSteps:'Hear these steps',officialVerified:'Official Government Scheme',leavingTitle:'You are now leaving SahayaAI.',leavingBody:'Please use your credentials carefully on the official government portal. SahayaAI will never ask for your bank password or OTP.',officialWebsite:'Official Government Website',staysOpen:'The official site opens in a new tab — this guide stays open here. Come back to this tab anytime to re-read the steps.'},
hi:{guideBtn:'चरण-दर-चरण मार्गदर्शिका देखें',visitBtn:'आधिकारिक सरकारी वेबसाइट और गाइड खोलें',tabGuide:'आधिकारिक वेबसाइट पर क्या करें',tabLink:'सीधा आधिकारिक लिंक',hearSteps:'ये चरण सुनें'},
kn:{guideBtn:'ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶಿ ನೋಡಿ',visitBtn:'ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್ ಮತ್ತು ಮಾರ್ಗದರ್ಶಿ ತೆರೆಯಿರಿ',tabGuide:'ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಏನು ಮಾಡಬೇಕು',tabLink:'ನೇರ ಅಧಿಕೃತ ಲಿಂಕ್',hearSteps:'ಈ ಹಂತಗಳನ್ನು ಕೇಳಿ'},
te:{guideBtn:'దశల వారీ గైడ్ చూడండి',visitBtn:'అధికారిక ప్రభుత్వ వెబ్‌సైట్ & గైడ్ తెరవండి',tabGuide:'అధికారిక వెబ్‌సైట్‌లో ఏమి చేయాలి',tabLink:'నేరుగా అధికారిక లింక్',hearSteps:'ఈ దశలు వినండి'},
ta:{guideBtn:'படிப்படியான வழிகாட்டியைப் பாருங்கள்',visitBtn:'அதிகாரப்பூர்வ அரசு இணையதளம் & வழிகாட்டி',tabGuide:'அதிகாரப்பூர்வ இணையதளத்தில் என்ன செய்ய வேண்டும்',tabLink:'நேரடி அதிகாரப்பூர்வ இணைப்பு',hearSteps:'இந்த படிகளைக் கேளுங்கள்'},
mr:{guideBtn:'टप्प्याटप्प्याने मार्गदर्शक पहा',visitBtn:'अधिकृत सरकारी वेबसाइट आणि मार्गदर्शक उघडा',tabGuide:'अधिकृत वेबसाइटवर काय करावे',tabLink:'थेट अधिकृत लिंक',hearSteps:'या पायऱ्या ऐका'}}

export default function App(){
 const [lang,setLang]=useState(localStorage.getItem('sahaya_lang')||'en');const t={...(T[lang]||T.en),...(GUIDE_T[lang]||{})}
 const [large,setLarge]=useState(false)
 const [state,setState]=useState('');const [district,setDistrict]=useState('');const [cat,setCat]=useState('all')
 const [selected,setSelected]=useState(null);const [guide,setGuide]=useState(null) // {scheme, tab:'guide'|'link'}
 const [msg,setMsg]=useState('')
 const [items,setItems]=useState(()=>{try{return JSON.parse(localStorage.getItem('sahaya_saved')||'[]')}catch{return[]}})
 const [ai,setAi]=useState(null);const [busy,setBusy]=useState(false)
 useEffect(()=>{localStorage.setItem('sahaya_lang',lang)},[lang])
 useEffect(()=>{localStorage.setItem('sahaya_saved',JSON.stringify(items))},[items])
 const all=useMemo(()=>state?schemesFor(state):[],[state])
 const shown=useMemo(()=>cat==='all'?all:all.filter(s=>s.cat===cat),[all,cat])
 function speak(text){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=LANGS[lang].speech;u.rate=.9;speechSynthesis.speak(u)}catch{alert(t.voiceUnsupported)}}
 const listenScheme=s=>speak(`${s.name}. ${s.benefit}. ${s.points.join('. ')}`)
 function saveScheme(s){ if(items.some(i=>i.title===s.name))return setMsg('Already saved ❤️ '+s.name); setItems([{id:'local-'+Date.now(),title:s.name,description:s.points.join(' • '),ai_summary:`${s.benefit} | ${s.match}% Match | Docs: ${s.docs.join(', ')}`},...items]); setMsg('Saved on this phone ✅ '+s.name) }
 async function askAI(scheme){ setSelected(null); setBusy(true); setMsg('🤖 SahayaAI is thinking…'); try{ const r=await fetch(API+'/api/ai/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({occupation:'Small Farmer',state:state||'Karnataka',income:120000,language:LANGS[lang].name,name:'Citizen'})}); const d=await r.json(); if(!r.ok)throw new Error(d.error||'AI busy'); setAi({...d,for:scheme?.name}); setMsg(''); speak(d.summary) }catch(e){ setMsg('⚠️ AI is waking up (~40s on free plan). Your schemes below are still fully usable. Please tap again.') }finally{setBusy(false)} }
 function onVoice(txt){const low=txt.toLowerCase();const states=['Karnataka','Maharashtra','Uttar Pradesh','Tamil Nadu','Andhra Pradesh','Telangana'];const found=states.find(s=>low.includes(s.toLowerCase().split(' ')[0]));if(found){setState(found);setDistrict('');setMsg('📍 State: '+found+'. Now choose your District in Step 2.')}if(low.includes('pension')||low.includes('senior'))setCat('pension');if(low.includes('farm')||low.includes('kisan'))setCat('farming');if(low.includes('health')||low.includes('hospital'))setCat('healthcare');document.getElementById('finder')?.scrollIntoView({behavior:'smooth'})}

 return <MotionConfig reducedMotion="user"><div className="min-h-screen text-[#292524] leading-relaxed" style={{background:'#faf8f5',fontSize:large?19:18}}>
  <a href="#finder" className="sr-only focus:not-sr-only focus:block focus:bg-white focus:p-4 focus:font-extrabold">Skip to Scheme Finder</a>
  {/* HEADER — logo left, language switcher right, all wrapping in flow */}
  <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b-2 border-emerald-900/10 shadow-sm">
   <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col gap-3">
    <div className="flex flex-wrap items-center justify-between gap-4">
     <a href="#" className="flex items-center gap-3 min-h-[52px] shrink-0"><span className="w-12 h-12 rounded-2xl grid place-items-center text-white shadow shrink-0" style={{background:'#064e3b'}}><Sprout size={26}/></span><span className="leading-tight"><b className="block text-[1.5rem] font-extrabold break-words">SahayaAI</b><small className="text-stone-500 font-bold break-words">For Farmers • Elders • Families — No Login Needed</small></span></a>
     <button onClick={()=>setLarge(!large)} aria-pressed={large} className="min-h-[52px] h-auto whitespace-normal px-5 py-3 rounded-2xl border-2 font-extrabold inline-flex gap-2 items-center bg-white shrink-0"><Type size={20}/>{large?'A':'A+ Large Text'}</button>
    </div>
    <nav aria-label="Choose language" className="flex flex-wrap gap-2">
     {Object.entries(LANGS).map(([k,v])=><button key={k} onClick={()=>setLang(k)} aria-pressed={lang===k} className={`min-h-[52px] h-auto whitespace-normal break-words rounded-full px-5 py-3 font-extrabold border-2 leading-snug transition active:scale-95 ${lang===k?'text-white shadow-lg':'bg-white text-stone-700'}`} style={lang===k?{background:'#d97706',borderColor:'#d97706'}:{borderColor:'#E7E5E4'}}>{v.label}</button>)}
    </nav>
   </div>
  </header>

  {/* HERO — text & photo side-by-side in grid flow, no overlapping text */}
  <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-8">
   <div className="rounded-[2rem] p-6 sm:p-8 text-white shadow-xl" style={{background:'linear-gradient(130deg,#064e3b 0%,#14532D 60%,#92400E 135%)'}}>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
     <div className="flex flex-col gap-4">
      <span className="inline-flex w-fit max-w-full items-center gap-2 bg-white/10 border border-white/25 rounded-full px-4 py-2 font-bold leading-snug break-words">🌾 Free • No Login • In Your Language</span>
      <motion.h1 initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="font-extrabold leading-tight break-words" style={{fontSize:'clamp(2rem,5vw,3.4rem)'}}>{t.heroTitle}</motion.h1>
      <p className="text-emerald-50 text-lg sm:text-xl leading-relaxed break-words">{t.heroSub}</p>
      <div className="flex flex-wrap gap-3">
       <a href="#finder" className="min-h-[52px] h-auto whitespace-normal break-words px-6 py-3 rounded-full font-extrabold text-lg leading-snug inline-flex items-center bg-white text-emerald-950 shadow-xl active:scale-95 transition">🔎 {t.findBtn}</a>
       <button onClick={()=>{setState('Karnataka');setDistrict('Dharwad');document.getElementById('finder')?.scrollIntoView({behavior:'smooth'})}} className="min-h-[52px] h-auto whitespace-normal break-words px-6 py-3 rounded-full font-extrabold text-lg leading-snug inline-flex items-center border-2 border-white/50 bg-white/10 active:scale-95 transition">🌾 Example: Karnataka</button>
      </div>
      <div className="flex flex-wrap gap-3">
       {[['8+','Schemes'],['6','Languages'],['₹0','Always Free']].map(x=><div key={x[1]} className="bg-white/10 border border-white/15 rounded-2xl px-5 py-3 text-center"><b className="block text-xl leading-tight">{x[0]}</b><span className="text-emerald-100 text-sm font-bold break-words">{x[1]}</span></div>)}
      </div>
     </div>
     <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 bg-white/10 border border-white/25 backdrop-blur-xl rounded-3xl p-4">
       <motion.span aria-hidden animate={{y:[0,-8,0],rotate:[0,5,0]}} transition={{duration:6,repeat:Infinity}} className="w-16 h-16 rounded-3xl grid place-items-center bg-emerald-400/25 border border-white/30 shrink-0"><Sprout size={32} color="#A7F3D0"/></motion.span>
       <div className="min-w-0"><b className="block text-lg leading-snug break-words">🛡️ Community Welfare Protection</b><span className="text-emerald-100 font-semibold break-words">Pension • Farm Money • Housing • Healthcare</span></div>
      </div>
      <TiltCard className="rounded-[1.6rem] shadow-2xl overflow-hidden"><img src="/images/woman-phone.jpg" alt="Indian woman happily speaking on a phone in a green field" className="h-64 w-full object-cover" onError={e=>e.currentTarget.src='/images/farmer.jpg'}/></TiltCard>
      <div className="bg-white rounded-3xl px-5 py-4 shadow-xl text-emerald-950 flex flex-wrap items-center gap-2"><span aria-hidden>🛡️</span><b className="break-words">96% Match • PM-KISAN & Sandhya Suraksha</b></div>
     </div>
    </div>
   </div>
  </section>

  {msg&&<div className="max-w-7xl mx-auto px-4 sm:px-6"><p role="status" className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 font-bold leading-relaxed break-words mb-4">{msg}</p></div>}

  <SchemeFinder state={state} setState={setState} district={district} setDistrict={setDistrict} cat={cat} setCat={setCat} schemes={shown} allSchemes={all} onCheck={setSelected} onListen={listenScheme} onSave={saveScheme} onApply={(s,tab)=>setGuide({scheme:s,tab:tab||'guide'})} t={t}/>

  <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-28 flex flex-col gap-6">
   {ai&&<section className="bg-emerald-50 border-2 border-emerald-200 rounded-[2rem] p-6 sm:p-8" aria-live="polite"><div className="flex flex-wrap justify-between items-start gap-3"><h2 className="font-extrabold text-2xl leading-snug break-words">🤖 SahayaAI says {ai.for?`• ${ai.for}`:''}</h2><button onClick={()=>speak(ai.summary)} aria-label={t.listen} className="min-w-[52px] min-h-[52px] h-auto px-5 py-3 rounded-full bg-white border-2 grid place-items-center shrink-0"><Volume2/></button></div><p className="text-lg leading-relaxed break-words mt-3 whitespace-pre-line">{ai.summary}</p><p className="font-extrabold mt-4">Documents to carry:</p><div className="flex flex-wrap gap-2 mt-2">{ai.checklist?.map(d=><span key={d} className="bg-white border rounded-full px-3 py-2 font-semibold leading-snug break-words inline-flex gap-2 items-center"><CheckCircle2 size={18} className="text-emerald-700 shrink-0"/>{d}</span>)}</div><small className="text-stone-500 break-words">{ai.source}</small></section>}

   <section className="bg-white rounded-[2rem] border-2 border-stone-200/70 p-6 sm:p-8 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-4"><h2 className="font-extrabold text-3xl leading-snug break-words">❤️ {t.saved} ({items.length})</h2><button disabled={busy} onClick={()=>askAI(null)} className="min-h-[52px] h-auto whitespace-normal break-words px-5 py-3 rounded-2xl text-white font-extrabold leading-snug disabled:opacity-60" style={{background:'#92400E'}}>🤖 {busy?'Thinking…':'Ask SahayaAI (Free, No Login)'}</button></div>
    {items.length===0?<p className="text-lg leading-relaxed text-stone-600 mt-3">Nothing saved yet. Choose State → District above, then tap <b>Save</b> on any scheme. Saved schemes stay on this phone — no account needed.</p>
    :<ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">{items.map(it=><li key={it.id} className="rounded-3xl bg-[#FFFBEB] border-2 border-amber-200 p-6 flex flex-col gap-3"><b className="text-lg leading-snug break-words">{it.title}</b><p className="text-stone-600 leading-relaxed break-words">{it.ai_summary||it.description}</p><div className="flex flex-wrap gap-3 mt-auto"><button onClick={()=>speak(it.title+'. '+(it.ai_summary||''))} className="min-h-[52px] h-auto whitespace-normal px-5 py-3 rounded-full bg-white border-2 font-bold leading-snug inline-flex gap-2 items-center"><Volume2 size={18}/>{t.listen}</button><button onClick={()=>setItems(items.filter(x=>x.id!==it.id))} className="min-h-[52px] h-auto whitespace-normal px-5 py-3 rounded-full bg-white border-2 font-bold leading-snug text-red-700">🗑️ Remove</button></div></li>)}</ul>}
   </section>

   <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Trust points">{[['🆓','Always Free','Government schemes cost ₹0'],['🔊','Listen, Don’t Read','Every scheme can be heard aloud'],['🛡️','No Agent Needed','Go direct to Grama One / CSC'],['🌐','6 Languages','Your language, your comfort']].map(x=><div key={x[1]} className="bg-white rounded-3xl border-2 border-stone-200/70 p-6 text-center flex flex-col gap-2 items-center"><span className="text-4xl" aria-hidden>{x[0]}</span><b className="text-lg leading-snug break-words">{x[1]}</b><span className="text-stone-600 leading-relaxed break-words">{x[2]}</span></div>)}</section>
  </main>

  <footer className="bg-[#064e3b] text-white"><div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-2"><b className="text-xl break-words">🌾 SahayaAI — No Login, Just Help</b><p className="text-emerald-100/85 leading-relaxed break-words max-w-3xl">⚠️ Information is simplified for guidance. Please confirm on official government websites / Grama One / CSC before applying. Never pay an agent for a free scheme.</p></div></footer>

  {/* ELIGIBILITY MODAL — all text in flow */}
  <AnimatePresence>{selected&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/55 flex items-end sm:items-center justify-center p-3" role="dialog" aria-modal="true" aria-label={t.checkTitle}>
   <motion.div initial={{y:60}} animate={{y:0}} exit={{y:60}} className="bg-white rounded-[2rem] p-6 sm:p-8 w-full max-w-lg max-h-[88vh] overflow-y-auto shadow-2xl flex flex-col gap-4">
    <div className="flex flex-wrap items-start justify-between gap-3"><span className="rounded-full px-4 py-2 font-extrabold text-white leading-snug" style={{background:'#15803d'}}>{selected.match}% Match</span><button onClick={()=>setSelected(null)} aria-label="Close" className="min-w-[52px] min-h-[52px] h-auto px-3 py-3 grid place-items-center rounded-full bg-stone-100 shrink-0"><X size={24}/></button></div>
    <h3 className="font-extrabold text-3xl leading-snug break-words">{selected.name}</h3><p className="font-extrabold text-xl leading-relaxed break-words" style={{color:'#C05621'}}>{selected.benefit}</p>
    <div><h4 className="font-extrabold text-xl">✅ You may be eligible if:</h4><ul className="flex flex-col gap-2 mt-2 text-lg leading-relaxed">{selected.points.map(p=><li key={p} className="flex gap-2 break-words"><CheckCircle2 className="text-emerald-700 shrink-0 mt-1"/>{p}</li>)}</ul></div>
    <div><h4 className="font-extrabold text-xl">🧾 Carry these documents:</h4><div className="flex flex-wrap gap-2 mt-2">{selected.docs.map(d=><span key={d} className="bg-amber-50 border border-amber-200 rounded-full px-3 py-2 font-semibold leading-snug break-words">{d}</span>)}</div></div>
    <p className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 font-semibold leading-relaxed break-words flex gap-2"><ShieldCheck className="shrink-0 text-emerald-800 mt-1"/> Registration is FREE. Take originals + 2 copies to Grama One / CSC.</p>
    <div className="flex flex-wrap gap-3"><button onClick={()=>askAI(selected)} className="flex-1 min-w-[150px] min-h-[52px] h-auto whitespace-normal px-5 py-3 rounded-2xl text-white font-extrabold leading-snug" style={{background:'#064e3b'}}>🤖 Ask AI</button><button onClick={()=>{setGuide({scheme:selected,tab:'link'});setSelected(null)}} className="flex-1 min-w-[150px] min-h-[52px] h-auto whitespace-normal px-5 py-3 rounded-2xl font-extrabold leading-snug border-2 inline-flex justify-center items-center" style={{borderColor:'#C05621',color:'#9C4221'}}>{t.apply} ↗</button></div>
    <button onClick={()=>listenScheme(selected)} className="min-h-[52px] h-auto whitespace-normal px-5 py-3 w-full rounded-2xl bg-amber-100 font-extrabold leading-snug inline-flex justify-center items-center gap-2"><Volume2/> {t.listen}</button>
   </motion.div></motion.div>}</AnimatePresence>

  {/* OFFICIAL WEBSITE & STEP-BY-STEP GUIDE MODAL */}
  <AnimatePresence>{guide&&<GuideModal key={guide.scheme.id+"-"+guide.tab} scheme={guide.scheme} initialTab={guide.tab} state={state} district={district} onClose={()=>setGuide(null)} t={t} langSpeech={LANGS[lang].speech}/>}</AnimatePresence>

  <VoiceAssist langSpeech={LANGS[lang].speech} onTranscript={onVoice} t={t}/>
 </div></MotionConfig>
}
