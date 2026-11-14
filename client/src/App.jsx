import {useEffect,useMemo,useState} from 'react'
import {motion,MotionConfig,AnimatePresence} from 'framer-motion'
import {Sprout,Volume2,Type,User,LogOut,X,CheckCircle2,ShieldCheck,PhoneCall} from 'lucide-react'
import SchemeFinder from './components/SchemeFinder.jsx'
import VoiceAssist from './components/VoiceAssist.jsx'
import LoginPage from './components/LoginPage.jsx'
import TiltCard from './components/TiltCard.jsx'
import {schemesFor} from './data/schemes.js'
const API=import.meta.env.VITE_API_BASE_URL||'https://sahayaai-backend.onrender.com'
const LANGS={en:{label:'English',speech:'en-IN',name:'English'},hi:{label:'हिंदी',speech:'hi-IN',name:'Hindi'},kn:{label:'ಕನ್ನಡ',speech:'kn-IN',name:'Kannada'},te:{label:'తెలుగు',speech:'te-IN',name:'Telugu'},ta:{label:'தமிழ்',speech:'ta-IN',name:'Tamil'},mr:{label:'मराठी',speech:'mr-IN',name:'Marathi'}}
const T={
en:{finderTitle:'Find Government Schemes For You',finderSub:'Namaste 🙏 Choose your state and district — we will show schemes made for people like you, in simple words.',step1:'Your State',step2:'Your District',step3:'What do you need?',chooseState:'— Select State —',chooseDistrict:'— Select District —',firstState:'First select State above',emptyTitle:'Where do you live?',emptyText:'Please select your State and District above. Then your schemes will appear here — big, clear and easy.',noCat:'No schemes in this category here',noCatSub:'Try “All” to see every scheme for your district.',schemesForYou:'schemes for you',check:'Check Eligibility',apply:'Apply Now',listen:'Listen',save:'Save',voice:'Voice Assist',listening:'Listening… speak now',voiceHint:'Say your state, work, or a scheme name. Example: “I am a farmer in Karnataka”.',tapSpeak:'Tap & Speak',voiceUnsupported:'Voice needs Chrome on Android. You can still tap everything easily.',checkTitle:'Eligibility Check'},
hi:{finderTitle:'अपने लिए सरकारी योजनाएँ खोजें',finderSub:'नमस्ते 🙏 अपना राज्य और ज़िला चुनें — सरल शब्दों में योजनाएँ दिखाएँगे।',step1:'आपका राज्य',step2:'आपका ज़िला',step3:'आपको क्या चाहिए?',chooseState:'— राज्य चुनें —',chooseDistrict:'— ज़िला चुनें —',firstState:'पहले ऊपर राज्य चुनें',emptyTitle:'आप कहाँ रहते हैं?',emptyText:'कृपया ऊपर राज्य और ज़िला चुनें। फिर आपकी योजनाएँ यहाँ दिखेंगी।',noCat:'इस श्रेणी में योजना नहीं',noCatSub:'“All” चुनकर सभी योजनाएँ देखें।',schemesForYou:'योजनाएँ आपके लिए',check:'पात्रता देखें',apply:'आवेदन करें',listen:'सुनें',save:'सेव करें',voice:'वॉइस सहायता',listening:'सुन रहे हैं… बोलिए',voiceHint:'अपना राज्य, काम या योजना का नाम बोलें।',tapSpeak:'बोलने के लिए दबाएँ',voiceUnsupported:'वॉइस के लिए Chrome उपयोग करें।',checkTitle:'पात्रता जाँच'},
kn:{finderTitle:'ನಿಮಗಾಗಿ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ',finderSub:'ನಮಸ್ತೆ 🙏 ನಿಮ್ಮ ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆ ಆರಿಸಿ — ಸರಳವಾಗಿ ತೋರಿಸುತ್ತೇವೆ.',step1:'ನಿಮ್ಮ ರಾಜ್ಯ',step2:'ನಿಮ್ಮ ಜಿಲ್ಲೆ',step3:'ನಿಮಗೆ ಏನು ಬೇಕು?',chooseState:'— ರಾಜ್ಯ ಆರಿಸಿ —',chooseDistrict:'— ಜಿಲ್ಲೆ ಆರಿಸಿ —',firstState:'ಮೊದಲು ರಾಜ್ಯ ಆರಿಸಿ',emptyTitle:'ನೀವು ಎಲ್ಲಿ ವಾಸಿಸುತ್ತೀರಿ?',emptyText:'ದಯವಿಟ್ಟು ಮೇಲೆ ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆ ಆರಿಸಿ. ನಂತರ ಯೋಜನೆಗಳು ಇಲ್ಲಿ ಕಾಣುತ್ತವೆ.',noCat:'ಈ ವಿಭಾಗದಲ್ಲಿ ಯೋಜನೆ ಇಲ್ಲ',noCatSub:'“All” ಆರಿಸಿ ಎಲ್ಲಾ ಯೋಜನೆಗಳನ್ನು ನೋಡಿ.',schemesForYou:'ಯೋಜನೆಗಳು ನಿಮಗಾಗಿ',check:'ಅರ್ಹತೆ ನೋಡಿ',apply:'ಅರ್ಜಿ ಹಾಕಿ',listen:'ಕೇಳಿ',save:'ಉಳಿಸಿ',voice:'ಧ್ವನಿ ಸಹಾಯ',listening:'ಕೇಳುತ್ತಿದ್ದೇನೆ… ಮಾತನಾಡಿ',voiceHint:'ನಿಮ್ಮ ರಾಜ್ಯ, ಕೆಲಸ ಅಥವಾ ಯೋಜನೆಯ ಹೆಸರು ಹೇಳಿ.',tapSpeak:'ಮಾತನಾಡಲು ಒತ್ತಿ',voiceUnsupported:'ಧ್ವನಿಗೆ Chrome ಬಳಸಿ.',checkTitle:'ಅರ್ಹತೆ ಪರಿಶೀಲನೆ'},
te:{finderTitle:'మీ కోసం ప్రభుత్వ పథకాలు కనుగొనండి',finderSub:'నమస్తే 🙏 మీ రాష్ట్రం, జిల్లా ఎంచుకోండి — సులభంగా చూపిస్తాం.',step1:'మీ రాష్ట్రం',step2:'మీ జిల్లా',step3:'మీకు ఏమి కావాలి?',chooseState:'— రాష్ట్రం ఎంచుకోండి —',chooseDistrict:'— జిల్లా ఎంచుకోండి —',firstState:'ముందు రాష్ట్రం ఎంచుకోండి',emptyTitle:'మీరు ఎక్కడ ఉంటారు?',emptyText:'దయచేసి పైన రాష్ట్రం, జిల్లా ఎంచుకోండి.',noCat:'ఈ విభాగంలో పథకం లేదు',noCatSub:'“All” ఎంచుకుని అన్నీ చూడండి.',schemesForYou:'పథకాలు మీ కోసం',check:'అర్హత చూడండి',apply:'దరఖాస్తు',listen:'వినండి',save:'సేవ్',voice:'వాయిస్ సహాయం',listening:'వింటున్నాను… మాట్లాడండి',voiceHint:'మీ రాష్ట్రం, పని లేదా పథకం పేరు చెప్పండి.',tapSpeak:'మాట్లాడటానికి నొక్కండి',voiceUnsupported:'వాయిస్ కోసం Chrome వాడండి.',checkTitle:'అర్హత తనిఖీ'},
ta:{finderTitle:'உங்களுக்கான அரசு திட்டங்களைக் கண்டறியுங்கள்',finderSub:'வணக்கம் 🙏 மாநிலம் மற்றும் மாவட்டத்தைத் தேர்ந்தெடுங்கள்.',step1:'உங்கள் மாநிலம்',step2:'உங்கள் மாவட்டம்',step3:'உங்களுக்கு என்ன வேண்டும்?',chooseState:'— மாநிலம் தேர்வு —',chooseDistrict:'— மாவட்டம் தேர்வு —',firstState:'முதலில் மாநிலம் தேர்வு செய்யுங்கள்',emptyTitle:'நீங்கள் எங்கே வசிக்கிறீர்கள்?',emptyText:'மேலே மாநிலம் மற்றும் மாவட்டத்தைத் தேர்ந்தெடுங்கள்.',noCat:'இந்த பிரிவில் திட்டம் இல்லை',noCatSub:'“All” தேர்ந்து அனைத்தையும் பாருங்கள்.',schemesForYou:'திட்டங்கள் உங்களுக்கு',check:'தகுதி பார்க்க',apply:'விண்ணப்பிக்க',listen:'கேளுங்கள்',save:'சேமி',voice:'குரல் உதவி',listening:'கேட்கிறேன்… பேசுங்கள்',voiceHint:'மாநிலம், வேலை அல்லது திட்டம் பெயரைச் சொல்லுங்கள்.',tapSpeak:'பேச தட்டுங்கள்',voiceUnsupported:'குரலுக்கு Chrome பயன்படுத்துங்கள்.',checkTitle:'தகுதி சரிபார்ப்பு'},
mr:{finderTitle:'तुमच्यासाठी सरकारी योजना शोधा',finderSub:'नमस्कार 🙏 तुमचे राज्य आणि जिल्हा निवडा — सोप्या भाषेत दाखवू.',step1:'तुमचे राज्य',step2:'तुमचा जिल्हा',step3:'तुम्हाला काय हवे?',chooseState:'— राज्य निवडा —',chooseDistrict:'— जिल्हा निवडा —',firstState:'आधी राज्य निवडा',emptyTitle:'तुम्ही कुठे राहता?',emptyText:'कृपया वर राज्य आणि जिल्हा निवडा.',noCat:'या श्रेणीत योजना नाही',noCatSub:'“All” निवडून सर्व योजना पहा.',schemesForYou:'योजना तुमच्यासाठी',check:'पात्रता पहा',apply:'अर्ज करा',listen:'ऐका',save:'जतन करा',voice:'आवाज मदत',listening:'ऐकत आहे… बोला',voiceHint:'राज्य, काम किंवा योजनेचे नाव सांगा.',tapSpeak:'बोलण्यासाठी दाबा',voiceUnsupported:'आवाजासाठी Chrome वापरा.',checkTitle:'पात्रता तपासणी'}}
async function api(path,opts={},token){const r=await fetch(API+path,{...opts,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})}});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Something went wrong');return d}

export default function App(){
 const [lang,setLang]=useState(localStorage.getItem('sahaya_lang')||'en');const t=T[lang]||T.en
 const [large,setLarge]=useState(false)
 const [state,setState]=useState('');const [district,setDistrict]=useState('');const [cat,setCat]=useState('all')
 const [selected,setSelected]=useState(null);const [applyScheme,setApplyScheme]=useState(null)
 const [token,setToken]=useState(localStorage.getItem('sahaya_token')||'');const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('sahaya_user'))}catch{return null}})
 const [view,setView]=useState(()=>localStorage.getItem('sahaya_token')?'dashboard':'login');
 const [authForm,setAuthForm]=useState({full_name:'',email:'',password:''});const [isSignup,setIsSignup]=useState(false);const [msg,setMsg]=useState('');const [items,setItems]=useState([]);const [ai,setAi]=useState(null);const [busy,setBusy]=useState(false)
 useEffect(()=>{localStorage.setItem('sahaya_lang',lang)},[lang])
 useEffect(()=>{if(token)loadItems()},[token])
 const all=useMemo(()=>state?schemesFor(state):[],[state])
 const shown=useMemo(()=>cat==='all'?all:all.filter(s=>s.cat===cat),[all,cat])
 async function loadItems(){try{setItems(await api('/api/items',{},token))}catch{}}
 function speak(text){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=LANGS[lang].speech;u.rate=.9;speechSynthesis.speak(u)}catch{alert(t.voiceUnsupported)}}
 const listenScheme=s=>speak(`${s.name}. ${s.benefit}. ${s.points.join('. ')}`)
 async function doAuth(e){e.preventDefault();try{const d=await api(isSignup?'/api/auth/signup':'/api/auth/login',{method:'POST',body:JSON.stringify(authForm)});setToken(d.token);setUser(d.user);localStorage.setItem('sahaya_token',d.token);localStorage.setItem('sahaya_user',JSON.stringify(d.user));setMsg('Welcome '+d.user.full_name+' 🙏')}catch(e){setMsg('⚠️ '+e.message)}}
 async function demo(){try{const d=await api('/api/auth/login',{method:'POST',body:JSON.stringify({email:'demo@example.com',password:'demo1234'})});setToken(d.token);setUser(d.user);localStorage.setItem('sahaya_token',d.token);localStorage.setItem('sahaya_user',JSON.stringify(d.user));setState('Karnataka');setDistrict('Dharwad');setView('dashboard')}catch(e){setMsg('⚠️ Backend waking up (~40s on free plan), please try again')}}
 function logout(){setToken('');setUser(null);setItems([]);localStorage.removeItem('sahaya_token');localStorage.removeItem('sahaya_user');setView('login')}
 async function emailLogin(form,signup){const d=await api(signup?'/api/auth/signup':'/api/auth/login',{method:'POST',body:JSON.stringify(form)});setToken(d.token);setUser(d.user);localStorage.setItem('sahaya_token',d.token);localStorage.setItem('sahaya_user',JSON.stringify(d.user));setView('dashboard');setMsg('Welcome '+d.user.full_name+' 🙏')}
 function guestLogin(g){setUser({full_name:g.full_name||'Guest',guest:true});setMsg('Guest Demo 🙏 Explore freely — Sign In with email from dashboard to save schemes permanently.');setView('dashboard')}
 async function saveScheme(s){if(!token){setMsg('⚠️ Guest mode: please login with email to SAVE permanently. Taking you to login…');setTimeout(()=>setView('login'),900);return}try{await api('/api/items',{method:'POST',body:JSON.stringify({title:s.name,description:s.points.join(' • '),ai_summary:`${s.benefit} | ${s.match}% Match | Docs: ${s.docs.join(', ')}`})},token);loadItems();setMsg('Saved ✅ '+s.name)}catch(e){setMsg('⚠️ '+e.message)}}
 async function askAI(scheme){setSelected(null);if(!token)return setMsg('⚠️ Please Sign In below first');setBusy(true);try{const d=await api('/api/ai/generate',{method:'POST',body:JSON.stringify({occupation:'Small Farmer',state:state||'Karnataka',income:120000,language:LANGS[lang].name,name:user?.full_name})},token);setAi({...d,for:scheme?.name});speak(d.summary)}catch(e){setMsg('⚠️ '+e.message)}finally{setBusy(false)}}
 function onVoice(txt){const low=txt.toLowerCase();const states=['Karnataka','Maharashtra','Uttar Pradesh','Tamil Nadu','Andhra Pradesh','Telangana'];const found=states.find(s=>low.includes(s.toLowerCase().split(' ')[0]));if(found){setState(found);setDistrict('');setMsg('📍 State set to '+found+'. Now choose your District.')}if(low.includes('pension')||low.includes('senior'))setCat('pension');if(low.includes('farm')||low.includes('किसान')||low.includes('ರೈತ'))setCat('farming');document.getElementById('finder')?.scrollIntoView({behavior:'smooth'})}

 if(view==='login') return <MotionConfig reducedMotion="user"><LoginPage lang={lang} setLang={setLang} LANGS={LANGS} onGuest={guestLogin} onEmailLogin={emailLogin} onDemoLogin={demo}/></MotionConfig>
 return <MotionConfig reducedMotion="user"><div className={`min-h-screen bg-[#FFFEF9] text-[#1B2E20] ${large?'text-[1.13rem]':''}`} style={{fontSize:large?19:17}}>
  <a href="#finder" className="sr-only focus:not-sr-only focus:absolute focus:bg-white focus:p-3 focus:z-[60] font-bold">Skip to Scheme Finder</a>
  {/* TOP BAR */}
  <header className="sticky top-0 z-40 bg-white/92 backdrop-blur border-b-2 border-emerald-900/10 shadow-sm">
   <div className="max-w-7xl mx-auto px-4 py-3">
    <div className="flex items-center justify-between gap-3">
     <a href="#" className="flex items-center gap-2 min-h-[52px]"><span className="w-12 h-12 rounded-2xl grid place-items-center text-white shadow" style={{background:'#14532D'}}><Sprout size={26}/></span><span className="leading-none"><b className="block text-[1.45rem] font-extrabold">SahayaAI</b><small className="text-slate-500 font-semibold">For Farmers • Elders • Families</small></span></a>
     <div className="flex items-center gap-2">
      <button onClick={()=>setLarge(!large)} aria-pressed={large} className="min-h-[52px] px-3 rounded-2xl border-2 font-extrabold inline-flex gap-1 items-center bg-white"><Type size={20}/> {large?'A':'A+'}</button>
      {user?<><span className="hidden sm:inline font-bold">🙏 {user.full_name}{user.guest?' (Guest)':''}</span><button onClick={logout} className="min-h-[52px] px-3 rounded-2xl text-white font-bold inline-flex gap-1 items-center" style={{background:'#1B2E20'}}><LogOut size={18}/>Out</button></>:<a href="#account" className="min-h-[52px] px-4 rounded-2xl text-white font-extrabold inline-flex items-center gap-2" style={{background:'#14532D'}}><User size={20}/>Sign In</a>}
     </div>
    </div>
    {/* Language toggle — right at the top, scrollable on mobile */}
    <nav aria-label="Choose language" className="flex gap-2 overflow-x-auto mt-3 pb-1 -mx-1 px-1">
     {Object.entries(LANGS).map(([k,v])=><button key={k} onClick={()=>setLang(k)} aria-pressed={lang===k} className={`min-h-[48px] shrink-0 rounded-full px-4 font-extrabold border-2 transition active:scale-95 ${lang===k?'text-white shadow':'bg-white text-slate-700'}`} style={lang===k?{background:'#C05621',borderColor:'#C05621'}:{borderColor:'#D6D3CD'}}>{v.label}</button>)}
    </nav>
   </div>
  </header>

  {/* HERO */}
  <section className="max-w-7xl mx-auto px-4 pt-5 pb-7">
   <div className="relative overflow-hidden rounded-[2rem] p-6 sm:p-10 text-white" style={{background:'linear-gradient(130deg,#14532D 0%,#1B4332 55%,#7C2D12 130%)'}}>
    <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-amber-400/20 blur-2xl" aria-hidden/>
    <div className="relative grid md:grid-cols-[1.2fr_.8fr] gap-6 items-center">
     <div><motion.h1 initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} className="font-extrabold leading-[1.08]" style={{fontSize:'clamp(2rem,6vw,3.6rem)'}}>Government help,<br/><span style={{color:'#FBD38D'}}>in your language.</span></motion.h1>
     <p className="text-emerald-50 text-lg sm:text-xl mt-3 max-w-xl">Big buttons. Simple words. No agent. No fees. Tap, listen, and find money & support for your family.</p>
     <div className="flex flex-wrap gap-3 mt-6"><a href="#finder" className="min-h-[56px] px-6 rounded-full font-extrabold text-lg inline-flex items-center bg-white text-emerald-950 shadow-xl active:scale-95 transition">🔎 Find My Schemes</a><button onClick={demo} className="min-h-[56px] px-6 rounded-full font-extrabold text-lg inline-flex items-center gap-2 border-2 border-white/50 bg-white/10 active:scale-95 transition">🌾 Try Demo (1 tap)</button></div>
     <p className="mt-4 font-semibold text-emerald-100 inline-flex items-center gap-2"><PhoneCall size={20}/> Helpline style help — tap the orange mic button anytime</p></div>
     <div className="hidden md:block relative" style={{perspective:1000}}>
      <motion.div aria-hidden animate={{y:[0,-12,0],rotate:[0,5,0]}} transition={{duration:6,repeat:Infinity}} className="absolute -top-5 -left-4 z-10 w-20 h-20 rounded-[1.4rem] grid place-items-center bg-white/15 border border-white/40 backdrop-blur-xl shadow-2xl"><Sprout size={38} color="#A7F3D0"/></motion.div>
      <TiltCard className="rounded-[1.6rem] shadow-2xl"><img src="/images/woman-phone.jpg" alt="Indian woman happily speaking on a phone in a green field" className="rounded-[1.6rem] h-64 w-full object-cover border-4 border-white/25" onError={e=>e.currentTarget.src='/images/farmer.jpg'}/></TiltCard>
      <motion.div aria-hidden animate={{y:[0,9,0]}} transition={{duration:5,repeat:Infinity}} className="absolute -bottom-4 right-4 bg-white/90 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-2xl text-emerald-950 font-extrabold">🛡️ 96% Match • PM-KISAN</motion.div>
     </div>
    </div>
   </div>
  </section>

  {msg&&<div className="max-w-7xl mx-auto px-4"><p role="status" className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 font-bold mb-4">{msg}</p></div>}

  <SchemeFinder state={state} setState={setState} district={district} setDistrict={setDistrict} cat={cat} setCat={setCat} schemes={shown} allSchemes={all} onCheck={setSelected} onListen={listenScheme} onSave={saveScheme} onApply={setApplyScheme} t={t}/>

  {/* AI RESULT + ACCOUNT + SAVED */}
  <main className="max-w-7xl mx-auto px-4 pb-24">
   {ai&&<section className="bg-emerald-50 border-2 border-emerald-200 rounded-[2rem] p-6 mt-8" aria-live="polite"><div className="flex justify-between gap-2"><h2 className="font-extrabold text-2xl">🤖 SahayaAI says {ai.for?`• ${ai.for}`:''}</h2><button onClick={()=>speak(ai.summary)} aria-label="Listen" className="min-w-[52px] min-h-[52px] rounded-full bg-white border grid place-items-center"><Volume2/></button></div><p className="text-lg leading-relaxed mt-2 whitespace-pre-line">{ai.summary}</p><p className="font-extrabold mt-3">Documents to carry:</p><div className="flex flex-wrap gap-2 mt-1">{ai.checklist?.map(d=><span key={d} className="bg-white border rounded-full px-3 py-2 font-semibold inline-flex gap-1 items-center"><CheckCircle2 size={18} className="text-emerald-700"/>{d}</span>)}</div><small className="text-slate-500">{ai.source}</small></section>}

   <section id="account" className="grid lg:grid-cols-2 gap-4 mt-8">
    {(!user||user.guest)?<div className="bg-white rounded-[2rem] border p-6 sm:p-8"><h2 className="font-extrabold text-3xl">{isSignup?'Create free account':'Namaste! Sign In'}</h2><p className="text-slate-600 text-lg mt-1">Save schemes & get AI help. Password is safely hidden (bcrypt). We never ask Aadhaar number or bank password.</p>
     <form onSubmit={doAuth} className="grid gap-3 mt-5">{isSignup&&<input required placeholder="Your full name" aria-label="Full name" className="min-h-[56px] rounded-2xl border-2 px-4 text-lg w-full" value={authForm.full_name} onChange={e=>setAuthForm({...authForm,full_name:e.target.value})}/>}<input required type="email" placeholder="Email (example: name@gmail.com)" aria-label="Email" className="min-h-[56px] rounded-2xl border-2 px-4 text-lg w-full" value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})}/><input required minLength={6} type="password" placeholder="Password (at least 6 letters)" aria-label="Password" className="min-h-[56px] rounded-2xl border-2 px-4 text-lg w-full" value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})}/><button className="min-h-[56px] rounded-2xl text-white font-extrabold text-lg" style={{background:'#14532D'}}>{isSignup?'Create Account ✓':'Sign In →'}</button></form>
     <button onClick={()=>setIsSignup(!isSignup)} className="min-h-[48px] font-extrabold text-emerald-800 mt-2">{isSignup?'Already have account? Sign In':'New here? Create free account'}</button>
     <button onClick={demo} className="block min-h-[48px] font-bold text-orange-800">or try Demo: demo@example.com / demo1234</button></div>
    :<div className="bg-white rounded-[2rem] border p-6 sm:p-8"><h2 className="font-extrabold text-3xl">🙏 Namaste, {user.full_name}</h2><p className="text-lg text-slate-600 mt-1">You are signed in. Your saved schemes are safe in the database — even on another phone.</p><button disabled={busy} onClick={()=>askAI(null)} className="min-h-[56px] px-6 rounded-2xl text-white font-extrabold text-lg mt-4 disabled:opacity-60" style={{background:'#7C2D12'}}>🤖 {busy?'Thinking, please wait…':'Ask SahayaAI About My Schemes'}</button></div>}

    <div className="bg-white rounded-[2rem] border p-6 sm:p-8"><h2 className="font-extrabold text-3xl">❤️ My Saved Schemes ({items.length})</h2>
     {items.length===0?<p className="text-lg text-slate-600 mt-2">Nothing saved yet. Choose State → District above, then tap <b>Save</b> on any scheme.</p>:<ul className="space-y-3 mt-4">{items.map(it=><li key={it.id} className="rounded-3xl bg-[#FFFBEB] border border-amber-200 p-4"><b className="text-lg">{it.title}</b><p className="text-slate-600">{it.ai_summary||it.description}</p><div className="flex gap-2 mt-2"><button onClick={()=>speak(it.title+'. '+(it.ai_summary||''))} className="min-h-[48px] px-4 rounded-full bg-white border-2 font-bold inline-flex gap-1 items-center"><Volume2 size={18}/> Listen</button><button onClick={async()=>{await api('/api/items/'+it.id,{method:'DELETE'},token);loadItems()}} className="min-h-[48px] px-4 rounded-full bg-white border-2 font-bold text-red-700">🗑️ Remove</button></div></li>)}</ul>}
    </div>
   </section>

   <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6" aria-label="Trust points">{[['🆓','Always Free','Government schemes cost ₹0'],['🔊','Listen, Don’t Read','Every scheme can be heard'],['🛡️','No Agent Needed','Go direct to Grama One / CSC'],['🌐','6 Languages','Your language, your comfort']].map(x=><div key={x[1]} className="bg-white rounded-3xl border p-5 text-center"><div className="text-4xl">{x[0]}</div><b className="block text-lg mt-1">{x[1]}</b><span className="text-slate-600">{x[2]}</span></div>)}</section>
  </main>

  <footer className="bg-[#1B2E20] text-white"><div className="max-w-7xl mx-auto px-4 py-8"><b className="text-xl">🌾 SahayaAI</b><p className="text-emerald-100/80 mt-1 max-w-2xl">⚠️ Information is simplified for guidance. Please confirm on official government websites / Grama One / CSC before applying. Never pay an agent for a free scheme.</p></div></footer>

  {/* ELIGIBILITY MODAL */}
  <AnimatePresence>{selected&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/55 grid place-items-end sm:place-items-center p-3" role="dialog" aria-modal="true" aria-label={t.checkTitle}>
   <motion.div initial={{y:70}} animate={{y:0}} exit={{y:70}} className="bg-white rounded-[2rem] p-6 w-full max-w-lg max-h-[88vh] overflow-y-auto shadow-2xl">
    <button onClick={()=>setSelected(null)} aria-label="Close" className="float-right min-w-[52px] min-h-[52px] grid place-items-center rounded-full bg-stone-100"><X size={24}/></button>
    <span className="inline-block rounded-full px-3 py-1 font-extrabold text-white" style={{background:'#087F5B'}}>{selected.match}% Match</span>
    <h3 className="font-extrabold text-3xl mt-3 leading-tight">{selected.name}</h3><p className="font-extrabold text-xl mt-1" style={{color:'#C05621'}}>{selected.benefit}</p>
    <h4 className="font-extrabold text-xl mt-5">✅ You may be eligible if:</h4><ul className="space-y-2 mt-2 text-lg">{selected.points.map(p=><li key={p} className="flex gap-2"><CheckCircle2 className="text-emerald-700 shrink-0 mt-1"/>{p}</li>)}</ul>
    <h4 className="font-extrabold text-xl mt-5">🧾 Carry these documents:</h4><div className="flex flex-wrap gap-2 mt-2">{selected.docs.map(d=><span key={d} className="bg-amber-50 border border-amber-200 rounded-full px-3 py-2 font-semibold">{d}</span>)}</div>
    <p className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 font-semibold mt-4 inline-flex gap-2"><ShieldCheck className="shrink-0 text-emerald-800"/> Registration is FREE. Take originals + 2 copies to Grama One / CSC.</p>
    <div className="grid grid-cols-2 gap-2 mt-4"><button onClick={()=>askAI(selected)} className="min-h-[56px] rounded-2xl text-white font-extrabold" style={{background:'#14532D'}}>🤖 Ask AI</button><button onClick={()=>{setApplyScheme(selected);setSelected(null)}} className="min-h-[56px] rounded-2xl font-extrabold border-2 inline-flex justify-center items-center" style={{borderColor:'#C05621',color:'#9C4221'}}>{t.apply} ↗</button></div>
    <button onClick={()=>listenScheme(selected)} className="min-h-[56px] w-full rounded-2xl bg-amber-100 font-extrabold mt-2 inline-flex justify-center items-center gap-2"><Volume2/> {t.listen}</button>
   </motion.div></motion.div>}</AnimatePresence>

  <AnimatePresence>{applyScheme&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/55 grid place-items-end sm:place-items-center p-3" role="dialog" aria-modal="true" aria-label="Apply confirmation">
   <motion.div initial={{y:60}} animate={{y:0}} exit={{y:60}} className="bg-white rounded-[2rem] p-6 w-full max-w-md shadow-2xl text-center">
    <div className="text-5xl">🌾</div><h3 className="font-extrabold text-2xl mt-2">Apply for {applyScheme.name}?</h3>
    <p className="text-lg text-stone-600 mt-2">You will go to the <b>official government website</b>. Registration is <b>FREE</b> — never pay anyone. Carry: {applyScheme.docs.join(', ')}.</p>
    <a href={applyScheme.apply} target="_blank" rel="noreferrer" onClick={()=>setApplyScheme(null)} className="min-h-[60px] w-full rounded-2xl text-white font-extrabold text-lg inline-flex justify-center items-center mt-4 shadow" style={{background:'#15803d'}}>Yes, Go to Official Website ↗</a>
    <button onClick={()=>setApplyScheme(null)} className="min-h-[56px] w-full rounded-2xl border-2 font-extrabold text-lg mt-2">Not Now, Go Back</button>
   </motion.div></motion.div>}</AnimatePresence>
  <VoiceAssist langSpeech={LANGS[lang].speech} onTranscript={onVoice} t={t}/>
 </div></MotionConfig>
}
