import {useEffect,useMemo,useState} from 'react'
import {Sprout,Volume2,Type,X,CheckCircle2,ShieldCheck,Landmark,LogOut,UserRound,Search,Menu,Moon,Share2,GitCompareArrows,BookmarkPlus,Bot,Home,Compass,ClipboardCheck,FolderUp,LayoutDashboard,Route,ShieldEllipsis,Info,HelpCircle,GraduationCap,HeartPulse,Hammer,HandCoins,Briefcase,HeartHandshake,House,Baby,Accessibility,Map as MapIcon,Mic,ChevronDown,LayoutGrid} from 'lucide-react'
import SchemeFinder from './components/SchemeFinder.jsx'
import VoiceAssist from './components/VoiceAssist.jsx'
import TiltCard from './components/TiltCard.jsx'
import GuideModal from './components/GuideModal.jsx'
import LoginPage from './components/LoginPage.jsx'
import ChatBot from './components/ChatBot.jsx'
import EligibilityChecker from './components/EligibilityChecker.jsx'
import DocumentAssistant from './components/DocumentAssistant.jsx'
import {TrackingPage,AdminPage,StatesPage} from './pages-extra.jsx'
import {schemesFor,STATE_DISTRICTS} from './data/schemes.js'
import {evaluateProfile} from './lib/eligibility.js'
const API=import.meta.env.VITE_API_BASE_URL||'https://sahayaai-backend.onrender.com'
const LANGS={en:{label:'English',speech:'en-IN',name:'English'},kn:{label:'ಕನ್ನಡ',speech:'kn-IN',name:'Kannada'},te:{label:'తెలుగు',speech:'te-IN',name:'Telugu'},hi:{label:'हिंदी',speech:'hi-IN',name:'Hindi'},ta:{label:'தமிழ்',speech:'ta-IN',name:'Tamil'},mr:{label:'मराठी',speech:'mr-IN',name:'Marathi'}}
const NAV_LANGS=['en','kn','te','hi']
const T={
en:{finderTitle:'Find Government Schemes For You',finderSub:'Choose your state and district — schemes appear in big, simple words.',step1:'Step 1 • Your State',step2:'Step 2 • Your District',step3:'Step 3 • What do you need?',chooseState:'— Select State —',chooseDistrict:'— Select District —',firstState:'First select State above',emptyTitle:'Where do you live?',emptyText:'Please select your State and District above. Then your schemes will appear here.',noCat:'No schemes in this category here',noCatSub:'Try “All Schemes” to see everything.',schemesForYou:'schemes for you',check:'Eligibility',apply:'Official Portal & Apply',listen:'Read Aloud',save:'Save',voice:'Speak to Search',listening:'Listening… speak now',voiceHint:'Say your state, work, or a scheme name.',tapSpeak:'Tap & Speak',voiceUnsupported:'Voice needs Chrome on Android.',checkTitle:'Eligibility Check',guide:'Application Guide'},
kn:{finderTitle:'ನಿಮಗಾಗಿ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',finderSub:'ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆ ಆರಿಸಿ — ಸರಳವಾಗಿ ತೋರಿಸುತ್ತೇವೆ.',step1:'ಹಂತ 1 • ರಾಜ್ಯ',step2:'ಹಂತ 2 • ಜಿಲ್ಲೆ',step3:'ಹಂತ 3 • ಏನು ಬೇಕು?',chooseState:'— ರಾಜ್ಯ ಆರಿಸಿ —',chooseDistrict:'— ಜಿಲ್ಲೆ ಆರಿಸಿ —',firstState:'ಮೊದಲು ರಾಜ್ಯ ಆರಿಸಿ',emptyTitle:'ನೀವು ಎಲ್ಲಿ ವಾಸುತ್ತೀರಿ?',emptyText:'ಮೇಲೆ ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆ ಆರಿಸಿ.',noCat:'ಈ ವಿಭಾಗದಲ್ಲಿ ಯೋಜನೆ ಇಲ್ಲ',noCatSub:'“All Schemes” ಆರಿಸಿ.',schemesForYou:'ಯೋಜನೆಗಳು ನಿಮಗಾಗಿ',check:'ಅರ್ಹತೆ',apply:'ಅಧಿಕೃತ ಪೋರ್ಟಲ್ & ಅರ್ಜಿ',listen:'ಓದಿ ಕೇಳಿಸಿ',save:'ಉಳಿಸಿ',voice:'ಮಾತನಾಡಿ ಹುಡುಕಿ',listening:'ಕೇಳುತ್ತಿದ್ದೇನೆ…',voiceHint:'ರಾಜ್ಯ ಅಥವಾ ಯೋಜನೆ ಹೇಳಿ.',tapSpeak:'ಒತ್ತಿ ಮಾತನಾಡಿ',voiceUnsupported:'Chrome ಬಳಸಿ.',checkTitle:'ಅರ್ಹತೆ ಪರಿಶೀಲನೆ',guide:'ಅರ್ಜಿ ಮಾರ್ಗದರ್ಶಿ'},
te:{finderTitle:'మీ కోసం ప్రభుత్వ పథకాలు',finderSub:'రాష్ట్రం, జిల్లా ఎంచుకోండి — సులభంగా చూపిస్తాం.',step1:'దశ 1 • రాష్ట్రం',step2:'దశ 2 • జిల్లా',step3:'దశ 3 • ఏమి కావాలి?',chooseState:'— రాష్ట్రం —',chooseDistrict:'— జిల్లా —',firstState:'ముందు రాష్ట్రం ఎంచుకోండి',emptyTitle:'మీరు ఎక్కడ ఉంటారు?',emptyText:'పైన రాష్ట్రం, జిల్లా ఎంచుకోండి.',noCat:'ఈ విభాగంలో పథకం లేదు',noCatSub:'“All Schemes” చూడండి.',schemesForYou:'పథకాలు మీ కోసం',check:'అర్హత',apply:'అధికారిక పోర్టల్ & దరఖాస్తు',listen:'చదివి వినిపించు',save:'సేవ్',voice:'మాట్లాడి వెతకండి',listening:'వింటున్నాను…',voiceHint:'రాష్ట్రం లేదా పథకం చెప్పండి.',tapSpeak:'నొక్కి మాట్లాడండి',voiceUnsupported:'Chrome వాడండి.',checkTitle:'అర్హత తనిఖీ',guide:'దరఖాస్తు గైడ్'},
hi:{finderTitle:'अपने लिए सरकारी योजनाएँ खोजें',finderSub:'राज्य और ज़िला चुनें — सरल शब्दों में दिखाएँगे।',step1:'चरण 1 • राज्य',step2:'चरण 2 • ज़िला',step3:'चरण 3 • क्या चाहिए?',chooseState:'— राज्य चुनें —',chooseDistrict:'— ज़िला चुनें —',firstState:'पहले राज्य चुनें',emptyTitle:'आप कहाँ रहते हैं?',emptyText:'ऊपर राज्य और ज़िला चुनें।',noCat:'इस श्रेणी में योजना नहीं',noCatSub:'“All Schemes” देखें।',schemesForYou:'योजनाएँ आपके लिए',check:'पात्रता',apply:'आधिकारिक पोर्टल और आवेदन',listen:'सुनें',save:'सेव करें',voice:'बोलकर खोजें',listening:'सुन रहे हैं…',voiceHint:'राज्य या योजना का नाम बोलें।',tapSpeak:'दबाकर बोलें',voiceUnsupported:'Chrome उपयोग करें।',checkTitle:'पात्रता जाँच',guide:'आवेदन गाइड'}}
const GUIDE_T={en:{guideBtn:'Step-by-Step Guide',visitBtn:'Official Portal & Apply',tabGuide:'What to do on the Official Website',tabLink:'Direct Official Link',hearSteps:'Hear these steps',officialVerified:'Official Government Scheme',leavingTitle:'You are now leaving SahayaAI.',leavingBody:'Please use your credentials carefully on the official government portal. SahayaAI will never ask for your bank password or OTP.',officialWebsite:'Official Government Website',staysOpen:'The official site opens in a new tab — this guide stays open here.'},
kn:{guideBtn:'ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶಿ',visitBtn:'ಅಧಿಕೃತ ಪೋರ್ಟಲ್ & ಅರ್ಜಿ',tabGuide:'ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಏನು ಮಾಡಬೇಕು',tabLink:'ನೇರ ಅಧಿಕೃತ ಲಿಂಕ್',hearSteps:'ಈ ಹಂತಗಳನ್ನು ಕೇಳಿ'},
te:{guideBtn:'దశల వారీ గైడ్',visitBtn:'అధికారిక పోర్టల్ & దరఖాస్తు',tabGuide:'అధికారిక వెబ్‌సైట్‌లో ఏమి చేయాలి',tabLink:'నేరుగా అధికారిక లింక్',hearSteps:'ఈ దశలు వినండి'},
hi:{guideBtn:'चरण-दर-चरण गाइड',visitBtn:'आधिकारिक पोर्टल और आवेदन',tabGuide:'आधिकारिक वेबसाइट पर क्या करें',tabLink:'सीधा आधिकारिक लिंक',hearSteps:'ये चरण सुनें'}}
const CAT10=[['Education and Scholarships',GraduationCap],['Agriculture and Farmers',Sprout],['Healthcare and Medical Assistance',HeartPulse],['Employment and Skill Development',Hammer],['Housing and Infrastructure',House],['Women Empowerment',HeartHandshake],['Senior Citizens',HeartHandshake],['Financial Assistance',HandCoins],['Small Business and Entrepreneurs',Briefcase],['Children and Family Welfare',Baby],['Disability Assistance',Accessibility],['Social Welfare',ShieldCheck]]
function tagsOf(s){const set=new Set();const map={farming:'Agriculture and Farmers',pension:'Senior Citizens',housing:'Housing and Infrastructure',healthcare:'Healthcare and Medical Assistance',women:'Women Empowerment',wages:'Employment and Skill Development'};if(map[s.cat])set.add(map[s.cat]);if(/scholar|vidya|kanya|thalliki|education|student/i.test(s.name))set.add('Education and Scholarships'); if(/sukanya|kanya|bhagyalakshmi|children/i.test(s.name))set.add('Children and Family Welfare');if(/₹|pension|lakshmi|bahin|urimai/i.test(s.name+' '+s.benefit))set.add('Financial Assistance');if(/vishwakarma|artisan|business|mudra/i.test(s.name))set.add('Small Business and Entrepreneurs');if(['pension','women','wages'].includes(s.cat))set.add('Social Welfare');if(s.cat==='wages')set.add('Financial Assistance');return[...set]}
function buildCatalog(){const m=new Map();Object.keys(STATE_DISTRICTS).forEach(st=>schemesFor(st).forEach(s=>{if(!m.has(s.name))m.set(s.name,{...s,homeState:st,tags:tagsOf(s)})}));return[...m.values()]}

export default function App(){
 const [token,setToken]=useState(localStorage.getItem('sahaya_token')||'')
 const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('sahaya_user'))}catch{return null}})
 const [view,setView]=useState(()=>localStorage.getItem('sahaya_token')?'app':'login')
 const [page,setPage]=useState('home');const [menu,setMenu]=useState(false);const [dark,setDark]=useState(false);const [moreOpen,setMoreOpen]=useState(false);const [voiceSignal,setVoiceSignal]=useState(0)
 const [lang,setLang]=useState(localStorage.getItem('sahaya_lang')||'en');const t={...(T[lang]||T.en),...(GUIDE_T[lang]||GUIDE_T.en)}
 const [large,setLarge]=useState(false)
 const [state,setState]=useState('Karnataka');const [district,setDistrict]=useState('Dharwad');const [cat,setCat]=useState('all')
 const [selected,setSelected]=useState(null);const [guide,setGuide]=useState(null);const [msg,setMsg]=useState('')
 const [query,setQuery]=useState('');const [exState,setExState]=useState('All States');const [exCat,setExCat]=useState('All Categories');const [exIncome,setExIncome]=useState('Any income');const [exAge,setExAge]=useState('Any age');const [exOcc,setExOcc]=useState('Any occupation')
 const [compare,setCompare]=useState([])
 const [items,setItems]=useState(()=>{try{return JSON.parse(localStorage.getItem('sahaya_saved')||'[]')}catch{return[]}})
 const [profile,setProfile]=useState(()=>{try{return JSON.parse(localStorage.getItem('sahaya_profile')||'{"state":"Karnataka","district":"Dharwad","occupation":"Small Farmer","income":150000,"age":45}')}catch{return{state:'Karnataka',district:'Dharwad',occupation:'Small Farmer',income:150000,age:45}}})
 const [ai,setAi]=useState(null);const [busy,setBusy]=useState(false)
 const [customSchemes,setCustomSchemes]=useState([])
 useEffect(()=>{fetch(API+'/api/schemes/custom?limit=200').then(r=>r.json()).then(d=>{if(Array.isArray(d))setCustomSchemes(d)}).catch(()=>{})},[])
 const catalog=useMemo(()=>{const base=buildCatalog();const seen=new Set(base.map(s=>s.name.toLowerCase()));const extra=customSchemes.filter(s=>!seen.has(s.name.toLowerCase())).map(s=>({...s,homeState:s.state,tags:s.tags||[s.category]}));return[...extra,...base]},[customSchemes])
 useEffect(()=>{localStorage.setItem('sahaya_lang',lang)},[lang]);useEffect(()=>{localStorage.setItem('sahaya_saved',JSON.stringify(items))},[items]);useEffect(()=>{document.documentElement.classList.toggle('dark',dark)},[dark])
 const all=useMemo(()=>schemesFor(state),[state]);const shown=useMemo(()=>cat==='all'?all:all.filter(s=>s.cat===cat),[all,cat])
 const explorerResults=useMemo(()=>catalog.filter(s=>{
  if(exState!=='All States'&&s.homeState!==exState&&s.origin!=='Central Govt')return false
  if(exCat!=='All Categories'&&!s.tags.includes(exCat))return false
  if(exOcc!=='Any occupation'&&!(s.occupations||[]).includes(exOcc))return false
  if(exAge==='60+'&&s.cat!=='pension'&&s.cat!=='healthcare')return false
  if(exIncome==='Up to ₹1 Lakh'&&(s.incomeMax||0)<50000)return false
  if(query&&!(s.name+' '+s.benefit+' '+s.tags.join(' ')).toLowerCase().includes(query.toLowerCase()))return false
  return true}),[catalog,exState,exCat,exIncome,exAge,exOcc,query])
 function activity(msgText){try{const a=JSON.parse(localStorage.getItem('sahaya_activity')||'[]');a.unshift({msg:msgText,at:new Date().toLocaleString()});localStorage.setItem('sahaya_activity',JSON.stringify(a.slice(0,12)))}catch{}}
 function speak(text){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text).slice(0,900));u.lang=LANGS[lang].speech;u.rate=.9;speechSynthesis.speak(u)}catch{alert(t.voiceUnsupported)}}
 const listenScheme=s=>speak(`${s.name}. ${s.benefit}. ${s.points.join('. ')}`)
 function saveScheme(s){if(items.some(i=>i.title===s.name))return setMsg('Already saved: '+s.name);const item={id:'local-'+Date.now(),title:s.name,description:(s.points||[]).join(' • '),ai_summary:`${s.benefit} | ${s.match||s.score||''}% Match | Docs: ${(s.docs||[]).join(', ')}`};setItems([item,...items]);activity('Saved scheme: '+s.name);setMsg('Saved: '+s.name)}
 async function shareScheme(s){const text=`${s.name} — ${s.benefit}. Official: ${s.apply} (via SahayaAI)`;try{if(navigator.share)await navigator.share({title:s.name,text,url:s.apply});else{await navigator.clipboard.writeText(text);setMsg('Scheme details copied — you can paste & share anywhere.')}}catch{}}
 function toggleCompare(s){setCompare(c=>c.some(x=>x.name===s.name)?c.filter(x=>x.name!==s.name):c.length>=3?(setMsg('You can compare up to 3 schemes. Remove one first.'),c):[...c,s])}
 async function emailLogin(form,signup){const r=await fetch(API+(signup?'/api/auth/signup':'/api/auth/login'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Login failed. Please check email & password.');setToken(d.token);setUser(d.user);localStorage.setItem('sahaya_token',d.token);localStorage.setItem('sahaya_user',JSON.stringify(d.user));setView('app');activity('Signed in')}
 function guestLogin(){setUser({full_name:'Guest Citizen',email:'guest@sahaya.ai',guest:true});setView('app')}
 async function demoLogin(){try{const r=await fetch(API+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'demo@example.com',password:'demo1234'})});const d=await r.json();if(!r.ok)throw new Error('demo');setToken(d.token);setUser(d.user);localStorage.setItem('sahaya_token',d.token);localStorage.setItem('sahaya_user',JSON.stringify(d.user));setView('app')}catch{guestLogin()}}
 function signOut(){setToken('');setUser(null);localStorage.removeItem('sahaya_token');localStorage.removeItem('sahaya_user');setView('login')}
 async function askAI(scheme){setSelected(null);setBusy(true);try{const r=await fetch(API+'/api/ai/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({occupation:profile.occupation,state:state,income:profile.income,language:LANGS[lang].name,name:user?.full_name||'Citizen'})});const d=await r.json();if(!r.ok)throw new Error('ai');setAi({...d,for:scheme?.name});speak(d.summary);activity('Asked SahayaAI assistant')}catch{setMsg('AI is waking up (~40s on free plan). Please try again.')}finally{setBusy(false)}}
 function onVoice(txt){const low=txt.toLowerCase();const found=Object.keys(STATE_DISTRICTS).find(s=>low.includes(s.toLowerCase().split(' ')[0]));if(found){setState(found);setDistrict('')}if(low.includes('pension'))setCat('pension');if(low.includes('farm'))setCat('farming');setPage('finder');setTimeout(()=>document.getElementById('finder')?.scrollIntoView(),80)}
 const go=p=>{setPage(p);setMenu(false);setMoreOpen(false);window.scrollTo(0,0)}
 const PRIMARY_NAV=[['home','Home',Home,'home'],['explore','Explore',Compass,'explore'],['schemes','Schemes',MapIcon,'states'],['voice','Voice Assistance',Mic,null],['progress','Progress',Route,'tracking']]
 const MORE_NAV=[['finder','AI Scheme Finder',Sprout],['chat','AI Assistant',Bot],['eligibility','Eligibility Checker',ClipboardCheck],['documents','Documents',FolderUp],['dashboard','My Dashboard',LayoutDashboard],['about','About Us',Info],['admin','Admin',ShieldEllipsis]]
 const NAV=[['home','Home',Home],['explore','Explore Schemes',Compass],['states','All India States',MapIcon],['finder','AI Scheme Finder',Sprout],['chat','AI Assistant',Bot],['eligibility','Eligibility Checker',ClipboardCheck],['documents','Documents',FolderUp],['dashboard','My Dashboard',LayoutDashboard],['tracking','Track Application',Route],['about','About Us',Info]]
 const recommended=useMemo(()=>evaluateProfile(profile).slice(0,3),[profile])
 const eligibilitySaved=(()=>{try{return JSON.parse(localStorage.getItem('sahaya_eligibility')||'null')}catch{return null}})()
 const trackingList=(()=>{try{return JSON.parse(localStorage.getItem('sahaya_tracking')||'[]')}catch{return[]}})()
 const activities=(()=>{try{return JSON.parse(localStorage.getItem('sahaya_activity')||'[]')}catch{return[]}})()

 if(view==='login')return <LoginPage lang={lang} setLang={setLang} LANGS={LANGS} onEmailLogin={emailLogin} onGuest={guestLogin} onDemoLogin={demoLogin}/>

 return <div className="min-h-screen bg-[#F8FAFC] text-slate-900 leading-relaxed pt-[72px]" style={{fontSize:large?19:17}}>
  {/* NAV — fixed glassmorphic header: 3-zone grid, pill nav, static 3D, no animations */}
  <header className="glass-header">
   <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-[72px] grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 sm:gap-4">
    {/* LEFT — brand */}
    <button onClick={()=>go('home')} aria-label="Sahaya AI — Home" className="flex items-center gap-2.5 min-h-[52px] text-left shrink-0">
     <span className="w-10 h-10 rounded-xl grid place-items-center text-white shrink-0 depth" style={{background:'linear-gradient(145deg,#0B2447,#064E3B)'}}><Landmark size={21}/></span>
     <span className="leading-tight min-w-0"><b className="text-[1.25rem] font-extrabold tracking-tight block whitespace-nowrap">Sahaya <span style={{color:'#047857'}}>AI</span></b><small className="text-slate-400 font-bold text-[.66rem] tracking-wide hidden 2xl:block whitespace-nowrap">GOVERNMENT SCHEME DISCOVERY</small></span>
    </button>
    {/* CENTER — unified pill navigation */}
    <nav className="hidden xl:flex justify-center min-w-0" aria-label="Main">
     <div className="flex items-center gap-[10px] rounded-full bg-white/70 border border-white/60 p-1.5 depth-sm">
      {PRIMARY_NAV.map(([key,label,Icon,target])=>{const active=!!target&&page===target;return <button key={key} onClick={()=>key==='voice'?setVoiceSignal(n=>n+1):go(target)} aria-current={active?'page':undefined} className={`nav-link min-h-[44px] px-3 py-2 rounded-full font-bold text-[.93rem] inline-flex gap-1.5 items-center ${active?'text-white depth-btn':'text-slate-600 hover:text-emerald-900 hover:bg-white'}`} style={active?{background:'linear-gradient(145deg,#0B2447,#064E3B)'}:{}}><Icon size={16} className="shrink-0"/>{label}</button>})}
      <button onClick={()=>setMoreOpen(!moreOpen)} aria-expanded={moreOpen} className={`nav-link min-h-[44px] px-3 py-2 rounded-full font-bold text-[.93rem] inline-flex gap-1.5 items-center ${moreOpen?'text-white depth-btn':'text-slate-600 hover:text-emerald-900 hover:bg-white'}`} style={moreOpen?{background:'linear-gradient(145deg,#0B2447,#064E3B)'}:{}}><LayoutGrid size={16} className="shrink-0"/>More<ChevronDown size={15} className="shrink-0"/></button>
     </div>
    </nav>
    {/* RIGHT — language / display / profile (never crowds the nav) */}
    <div className="flex items-center gap-2 justify-self-end">
     <select value={lang} onChange={e=>setLang(e.target.value)} aria-label="Language" className="min-h-[44px] rounded-full font-bold px-2.5 text-white outline-none cursor-pointer text-sm hidden md:block max-w-[108px] depth-sm" style={{background:'linear-gradient(145deg,#064E3B,#047857)'}}>{NAV_LANGS.map(k=><option key={k} value={k} className="bg-white text-slate-900">{LANGS[k].label}</option>)}</select>
     <button onClick={()=>setDark(!dark)} aria-label="Toggle dark mode" className="min-h-[44px] min-w-[44px] px-2.5 rounded-full border border-[#E2E8F0] bg-white grid place-items-center depth-sm"><Moon size={18} className="text-slate-600"/></button>
     <button onClick={()=>setLarge(!large)} aria-pressed={large} className="min-h-[44px] px-3 rounded-full border border-[#E2E8F0] bg-white font-extrabold text-slate-600 hidden 2xl:block depth-sm">{large?'A':'A+'}</button>
     {user&&<span className="hidden 2xl:inline-flex items-center gap-2 rounded-full bg-slate-900 text-white pl-1.5 pr-3.5 py-1.5 max-w-[200px] depth-sm"><span className="w-7 h-7 rounded-full grid place-items-center shrink-0" style={{background:'#D97706'}}><UserRound size={14}/></span><span className="leading-tight min-w-0"><b className="block text-[.8rem] truncate">{user.full_name}</b></span></span>}
     <button onClick={signOut} className="min-h-[44px] px-3.5 rounded-full border-2 font-extrabold text-sm hidden md:inline-flex gap-1.5 items-center bg-white depth-sm" style={{borderColor:'#0B2447',color:'#0B2447'}}><LogOut size={15}/>Sign Out</button>
     <button onClick={()=>setMenu(!menu)} aria-label="Open menu" aria-expanded={menu} className="min-h-[44px] min-w-[44px] px-2.5 rounded-full border border-[#E2E8F0] bg-white grid place-items-center xl:hidden depth-sm"><Menu size={20}/></button>
    </div>
   </div>
   {/* MORE — remaining platform pages, in-flow panel (desktop) */}
   {moreOpen&&<nav className="hidden xl:block border-t border-[#E2E8F0]/70 bg-white/90" aria-label="More pages"><div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap gap-2">{MORE_NAV.map(([id,label,Icon])=><button key={id} onClick={()=>go(id)} aria-current={page===id?'page':undefined} className={`nav-link min-h-[44px] px-3 py-2 rounded-full font-bold text-[.93rem] inline-flex gap-1.5 items-center border ${page===id?'text-white depth-btn':'bg-white text-slate-600 hover:text-emerald-900'}`} style={page===id?{background:'linear-gradient(145deg,#0B2447,#064E3B)',borderColor:'transparent'}:{borderColor:'#E2E8F0'}}><Icon size={16} className="shrink-0"/>{label}</button>)}</div></nav>}
   {/* Mobile / tablet drawer — structured grid, header stays pinned */}
   {menu&&<nav className="xl:hidden border-t border-[#E2E8F0]/70 bg-white/95 max-h-[calc(100vh-72px)] overflow-y-auto" aria-label="Mobile menu"><div className="px-4 py-3 grid grid-cols-2 gap-2">{[...NAV,['admin','Admin',ShieldEllipsis]].map(([id,label,Icon])=><button key={id} onClick={()=>go(id)} aria-current={page===id?'page':undefined} className={`min-h-[48px] px-3.5 py-2.5 rounded-2xl font-bold inline-flex gap-2 items-center border ${page===id?'text-white depth-btn':'bg-slate-50 text-slate-600'}`} style={page===id?{background:'linear-gradient(145deg,#0B2447,#064E3B)',borderColor:'#0B2447'}:{borderColor:'#E2E8F0'}}><Icon size={17} className="shrink-0"/><span className="text-left leading-snug break-words">{label}</span></button>)}
    <select value={lang} onChange={e=>setLang(e.target.value)} aria-label="Language" className="min-h-[48px] rounded-2xl font-bold px-3 text-white col-span-2 depth-sm" style={{background:'linear-gradient(145deg,#064E3B,#047857)'}}>{Object.entries(LANGS).map(([k,v])=><option key={k} value={k} className="bg-white text-slate-900">{v.label}</option>)}</select>
    <button onClick={signOut} className="min-h-[48px] rounded-2xl border-2 font-extrabold col-span-2 depth-sm bg-white" style={{borderColor:'#0B2447',color:'#0B2447'}}>Sign Out</button></div></nav>}
  </header>

  <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8 pb-28">
   {msg&&<p role="status" className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 font-semibold leading-relaxed break-words">{msg}<button onClick={()=>setMsg('')} className="float-right font-extrabold px-2" aria-label="Dismiss">✕</button></p>}

   {page==='home'&&<>
    {/* HERO */}
    <section className="rounded-[2rem] overflow-hidden text-white shadow-xl" style={{background:'linear-gradient(120deg,#0B2447 0%,#123B63 48%,#064E3B 100%)'}}>
     <div className="p-6 sm:p-10 lg:p-12 flex flex-col gap-6 max-w-3xl">
      <span className="inline-flex w-fit items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-bold break-words"><ShieldCheck size={16} className="text-amber-300 shrink-0"/> Verified scheme information • Free forever</span>
      <h1 className="font-extrabold tracking-tight leading-[1.08] break-words" style={{fontSize:'clamp(2.1rem,5.5vw,3.6rem)'}}>Government Benefits, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-amber-300">Made Simple.</span></h1>
      <p className="text-lg sm:text-xl text-slate-200 leading-relaxed break-words">Discover government schemes, check your eligibility and access the benefits you deserve.</p>
      <form onSubmit={e=>{e.preventDefault();go('explore')}} className="flex flex-wrap gap-2.5 bg-white rounded-2xl p-2 shadow-2xl">
       <span className="flex items-center flex-1 min-w-[210px] gap-2 px-3"><Search className="text-slate-400 shrink-0"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search schemes… e.g. PM-KISAN, pension, housing" aria-label="Search schemes" className="flex-1 min-w-0 min-h-[48px] text-slate-900 text-[1.02rem] outline-none placeholder:text-slate-400"/></span>
       <button className="min-h-[52px] px-6 py-3 rounded-xl text-white font-extrabold shadow inline-flex items-center gap-2" style={{background:'#047857'}}>Search</button>
      </form>
      <div className="flex flex-wrap gap-3">
       <button onClick={()=>go('finder')} className="min-h-[52px] h-auto whitespace-normal px-6 py-3 rounded-full font-extrabold text-lg leading-snug depth-btn" style={{background:'#D97706',color:'#fff'}}>Find My Schemes</button>
       <button onClick={()=>go('explore')} className="min-h-[52px] h-auto whitespace-normal px-6 py-3 rounded-full font-extrabold text-lg leading-snug bg-white/10 border border-white/35">Explore All Schemes</button>
      </div>
      <div className="grid grid-cols-3 gap-3 max-w-md">{[[catalog.length,'Schemes in directory'],[Object.keys(STATE_DISTRICTS).length,'States covered'],['4','Languages']].map(x=><div key={x[1]} className="bg-white/[.08] border border-white/15 rounded-2xl p-3.5 text-center"><b className="block text-2xl leading-tight">{x[0]}</b><span className="text-slate-300 text-xs font-bold break-words block">{x[1]}</span></div>)}</div>
      <p className="text-xs text-slate-400 font-semibold">Directory statistics above are counted live from the SahayaAI scheme directory on this website — not national beneficiary figures.</p>
     </div>
    </section>

    {/* POPULAR */}
    <section><div className="flex flex-wrap justify-between items-end gap-3"><div><p className="font-extrabold tracking-widest text-sm" style={{color:'#047857'}}>POPULAR GOVERNMENT SCHEMES</p><h2 className="font-extrabold text-3xl tracking-tight mt-1">Most sought-after right now</h2></div><button onClick={()=>go('explore')} className="min-h-[48px] px-5 rounded-full border-2 font-extrabold" style={{borderColor:'#0B2447',color:'#0B2447'}}>View all →</button></div>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">{catalog.slice(0,6).map(s=><MiniCard key={s.name} s={s} onGuide={()=>setGuide({scheme:s,tab:'guide'})} onSave={()=>saveScheme(s)} onListen={()=>listenScheme(s)}/>)}</div></section>

    {/* CATEGORIES */}
    <section><p className="font-extrabold tracking-widest text-sm" style={{color:'#047857'}}>BROWSE BY CATEGORY</p><h2 className="font-extrabold text-3xl tracking-tight mt-1">What support does your family need?</h2>
     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-5">{CAT10.map(([c,Icon])=>{const n=catalog.filter(s=>s.tags.includes(c)).length;return <TiltCard key={c} onClick={()=>{setExCat(c);go('explore')}} className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm hover:shadow-xl p-5 text-left cursor-pointer w-full"><span className="w-11 h-11 rounded-2xl bg-emerald-50 grid place-items-center"><Icon size={22} className="text-emerald-700"/></span><b className="block mt-2.5 leading-snug break-words">{c}</b><span className="text-sm text-slate-400 font-semibold">{n} schemes</span></TiltCard>})}</div></section>

    {/* HOW + WHY */}
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
     <div className="bg-white rounded-[1.75rem] border border-[#E2E8F0] shadow-sm p-6 sm:p-8"><p className="font-extrabold tracking-widest text-sm" style={{color:'#047857'}}>HOW SAHAYAAI WORKS</p><ol className="flex flex-col gap-4 mt-4">{[['Tell us about yourself','Age, state, occupation & income — no Aadhaar or bank details, ever.'],['Get matched schemes','Our rules + AI explain why each scheme fits you.'],['Follow the step-by-step guide','Documents, exact portal clicks and free submission.'],['Track it yourself','Add your official receipt details and follow progress.']].map((s,i)=><li key={s[0]} className="flex gap-3.5"><span className="w-9 h-9 rounded-full text-white grid place-items-center font-extrabold shrink-0" style={{background:'#0B2447'}}>{i+1}</span><span><b className="block leading-snug">{s[0]}</b><span className="text-slate-500 leading-relaxed break-words">{s[1]}</span></span></li>)}</ol></div>
     <div className="rounded-[1.75rem] p-6 sm:p-8 text-white shadow-lg" style={{background:'linear-gradient(140deg,#064E3B,#047857)'}}><p className="font-extrabold tracking-widest text-sm text-amber-300">WHY CHOOSE SAHAYAAI</p><ul className="flex flex-col gap-3.5 mt-4">{[['Verified official links only','Every Apply button goes to the real government portal.'],['Made for low-literacy users','Read-aloud, voice search and 52px+ buttons everywhere.'],['Private by design','Documents never leave your phone. No hidden charges.'],['AI that explains, not decides','Final approval is always by the Government — we say so clearly.']].map(x=><li key={x[0]} className="flex gap-3"><CheckCircle2 className="text-amber-300 shrink-0 mt-1"/><span><b className="block leading-snug">{x[0]}</b><span className="text-emerald-100/85 leading-relaxed break-words">{x[1]}</span></span></li>)}</ul></div>
    </section>

    {/* TESTIMONIALS — authentic only */}
    <section className="bg-white rounded-[1.75rem] border border-dashed border-slate-300 p-6 sm:p-8 text-center"><p className="font-extrabold tracking-widest text-sm" style={{color:'#047857'}}>CITIZEN STORIES</p><h2 className="font-extrabold text-2xl tracking-tight mt-1.5">Real stories, only with real consent</h2><p className="text-slate-500 leading-relaxed max-w-xl mx-auto mt-2">We do not publish invented testimonials. Verified citizen stories will appear here only after written consent and fact-checking. Want to share yours? Use Help & Support in the footer.</p></section>
   </>}

   {page==='explore'&&<section className="flex flex-col gap-5">
    <div><p className="font-extrabold tracking-widest text-sm" style={{color:'#047857'}}>SCHEME EXPLORER</p><h2 className="font-extrabold text-3xl sm:text-4xl tracking-tight mt-1">Searchable Scheme Directory</h2><p className="text-slate-500 leading-relaxed mt-1">Demo directory of verified schemes with official portal links. Always confirm details on the official website before applying.</p></div>
    <div className="bg-white/85 backdrop-blur-xl rounded-3xl border border-[#E2E8F0] shadow-sm p-5 flex flex-col gap-3">
     <div className="flex items-center gap-2 rounded-2xl border border-[#E2E8F0] px-4 bg-white"><Search className="text-slate-400 shrink-0"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by scheme name or benefit…" aria-label="Search schemes" className="flex-1 min-w-0 min-h-[52px] outline-none text-[1.02rem]"/></div>
     <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5">
      <select value={exState} onChange={e=>setExState(e.target.value)} aria-label="Filter by state" className="min-h-[52px] rounded-xl border border-[#E2E8F0] px-3 bg-white font-semibold"><option>All States</option>{Object.keys(STATE_DISTRICTS).map(s=><option key={s}>{s}</option>)}</select>
      <select value={exCat} onChange={e=>setExCat(e.target.value)} aria-label="Filter by category" className="min-h-[52px] rounded-xl border border-[#E2E8F0] px-3 bg-white font-semibold"><option>All Categories</option>{CAT10.map(([c])=><option key={c}>{c}</option>)}</select>
      <select value={exIncome} onChange={e=>setExIncome(e.target.value)} aria-label="Filter by income" className="min-h-[52px] rounded-xl border border-[#E2E8F0] px-3 bg-white font-semibold"><option>Any income</option><option>Up to ₹1 Lakh</option><option>₹1–3 Lakh</option></select>
      <select value={exAge} onChange={e=>setExAge(e.target.value)} aria-label="Filter by age group" className="min-h-[52px] rounded-xl border border-[#E2E8F0] px-3 bg-white font-semibold"><option>Any age</option><option>18–35</option><option>36–59</option><option>60+</option></select>
      <select value={exOcc} onChange={e=>setExOcc(e.target.value)} aria-label="Filter by occupation" className="min-h-[52px] rounded-xl border border-[#E2E8F0] px-3 bg-white font-semibold"><option>Any occupation</option><option>Small Farmer</option><option>Artisan</option><option>Daily Wage Worker</option><option>Woman</option></select>
     </div></div>
    <p className="font-bold text-slate-600" role="status">{explorerResults.length} schemes found</p>
    {compare.length>0&&<div className="bg-white rounded-3xl border-2 border-emerald-700/30 shadow-sm p-5 overflow-x-auto"><h3 className="font-extrabold text-xl inline-flex gap-2 items-center"><GitCompareArrows size={20}/> Scheme Comparison ({compare.length}/3)</h3>
     <table className="w-full min-w-[540px] mt-3 text-left"><thead><tr className="border-b text-slate-400 text-sm"><th className="py-2 pr-3">Feature</th>{compare.map(s=><th key={s.name} className="pr-3 break-words">{s.name}</th>)}</tr></thead><tbody>
      {[['Benefit',s=>s.benefit],['Match in directory',s=>(s.match||'—')+'%'],['Origin',s=>s.origin],['Documents',s=>(s.docs||[]).join(', ')],['Official portal',s=>s.apply]].map(([l,f])=><tr key={l} className="border-b last:border-0"><td className="py-2.5 pr-3 font-bold">{l}</td>{compare.map(s=><td key={s.name} className="pr-3 break-words leading-relaxed py-2.5">{f(s)}</td>)}</tr>)}</tbody></table>
     <button onClick={()=>setCompare([])} className="min-h-[44px] px-4 rounded-full border font-bold mt-2">Clear comparison</button></div>}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{explorerResults.map(s=><MiniCard key={s.name} s={s} onGuide={()=>setGuide({scheme:s,tab:'guide'})} onSave={()=>saveScheme(s)} onListen={()=>listenScheme(s)} onShare={()=>shareScheme(s)} onCompare={()=>toggleCompare(s)} compared={compare.some(x=>x.name===s.name)}/>)}</div>
    {explorerResults.length===0&&<p className="text-center font-bold text-slate-400 py-10">No schemes match those filters. Try clearing one filter.</p>}
   </section>}

   {page==='finder'&&<><SchemeFinder state={state} setState={setState} district={district} setDistrict={setDistrict} cat={cat} setCat={setCat} schemes={shown} allSchemes={all} onCheck={setSelected} onListen={listenScheme} onSave={saveScheme} onApply={(s,tab)=>setGuide({scheme:s,tab:tab||'guide'})} t={t}/>
    <div className="bg-white rounded-[1.75rem] border border-[#E2E8F0] shadow-sm p-6 flex flex-wrap items-center gap-4 justify-between"><div><h3 className="font-extrabold text-2xl">Want a personalised answer?</h3><p className="text-slate-500 leading-relaxed">Answer 7 questions and get reasons, missing items and next steps for every scheme.</p></div><button onClick={()=>go('eligibility')} className="min-h-[52px] px-6 py-3 rounded-xl text-white font-extrabold shadow" style={{background:'#D97706'}}>Open Eligibility Checker</button></div></>}

   {page==='states'&&<StatesPage catalog={catalog} onOpenScheme={s=>setGuide({scheme:s,tab:'guide'})} onSelectState={s=>{ if(STATE_DISTRICTS[s.name]){setState(s.name);setDistrict('');setExState(s.name);go('finder')} else go('explore') }}/>}
   {page==='chat'&&<ChatBot langName={LANGS[lang].name} langSpeech={LANGS[lang].speech} state={state} occupation={profile.occupation} speak={speak}/>}
   {page==='eligibility'&&<EligibilityChecker onSave={saveScheme} onGuide={(s,tab)=>setGuide({scheme:s,tab})} initial={profile}/>}
   {page==='documents'&&<DocumentAssistant schemes={catalog} onGuide={(s,tab)=>setGuide({scheme:s,tab})}/>}

   {page==='dashboard'&&<section className="flex flex-col gap-5">
    <div className="rounded-[1.75rem] p-6 sm:p-8 text-white shadow-lg" style={{background:'linear-gradient(120deg,#0B2447,#064E3B)'}}><h2 className="font-extrabold text-3xl tracking-tight break-words">Welcome{user?', '+user.full_name:''} 🙏</h2><p className="text-emerald-100/85 leading-relaxed mt-1">Your personal SahayaAI dashboard — recommendations, saved schemes, results and activity in one place.</p></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
     <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 lg:col-span-2"><h3 className="font-extrabold text-xl">Recommended for You</h3><div className="flex flex-col gap-3 mt-3">{recommended.map(s=><div key={s.name} className="flex flex-wrap items-center gap-3 bg-slate-50 border border-[#E2E8F0] rounded-2xl p-4"><span className="rounded-full text-white font-extrabold px-3 py-1 text-sm shrink-0" style={{background:'#047857'}}>{s.score}%</span><span className="flex-1 min-w-[170px]"><b className="block leading-snug break-words">{s.name}</b><small className="text-slate-500 font-semibold break-words">{s.reasons[0]}</small></span><button onClick={()=>setGuide({scheme:s,tab:'guide'})} className="min-h-[44px] px-4 rounded-full border-2 font-extrabold text-sm" style={{borderColor:'#064E3B',color:'#064E3B'}}>Guide</button></div>)}</div>
      <h3 className="font-extrabold text-xl mt-6">Eligibility Results</h3>{eligibilitySaved?<p className="text-slate-600 leading-relaxed mt-1.5 break-words">Last checked {new Date(eligibilitySaved.at).toLocaleString()} for {eligibilitySaved.form.state} — top matches: <b>{eligibilitySaved.top.join(', ')}</b>. <button onClick={()=>go('eligibility')} className="text-emerald-800 font-extrabold underline">Check again</button></p>:<p className="text-slate-500 mt-1.5">No check yet. <button onClick={()=>go('eligibility')} className="text-emerald-800 font-extrabold underline">Run your first check (2 minutes)</button></p>}
      <h3 className="font-extrabold text-xl mt-6">Recent Activity</h3>{activities.length?<ul className="mt-2 flex flex-col gap-1.5 text-slate-600">{activities.slice(0,6).map((a,i)=><li key={i} className="break-words">• {a.msg} <small className="text-slate-400">({a.at})</small></li>)}</ul>:<p className="text-slate-400 mt-1.5 font-semibold">Your saved schemes, checks and tracking updates will appear here.</p>}</div>
     <div className="flex flex-col gap-4">
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6"><h3 className="font-extrabold text-xl">Notifications</h3><ul className="mt-2.5 flex flex-col gap-2 text-slate-600 leading-relaxed">{trackingList.filter(a=>a.pending&&a.pending.toLowerCase()!=='none').map(a=><li key={a.id} className="break-words">📄 <b>{a.scheme}:</b> documents pending — {a.pending}</li>)}{items.length>0&&<li className="break-words">❤️ You have {items.length} saved scheme(s) ready to apply.</li>}{!eligibilitySaved&&<li>✅ Tip: run the Eligibility Checker for personalised reasons.</li>}{trackingList.length===0&&items.length===0&&<li>No notifications yet — you are all caught up.</li>}</ul></div>
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6"><h3 className="font-extrabold text-xl">Application Tracking</h3><p className="text-slate-600 leading-relaxed mt-1.5">{trackingList.length} application(s) being tracked by you.</p><button onClick={()=>go('tracking')} className="min-h-[48px] px-5 rounded-xl text-white font-extrabold mt-3 w-full" style={{background:'#0B2447'}}>Open Tracker</button></div>
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6"><h3 className="font-extrabold text-xl">Profile Settings</h3>
       <div className="flex flex-col gap-2.5 mt-3">
        <select value={profile.state} onChange={e=>setProfile({...profile,state:e.target.value,district:''})} className="min-h-[48px] rounded-xl border border-[#E2E8F0] px-3 bg-white" aria-label="Profile state">{Object.keys(STATE_DISTRICTS).map(s=><option key={s}>{s}</option>)}</select>
        <select value={profile.district} onChange={e=>setProfile({...profile,district:e.target.value})} className="min-h-[48px] rounded-xl border border-[#E2E8F0] px-3 bg-white" aria-label="Profile district"><option value="">— District —</option>{(STATE_DISTRICTS[profile.state]||[]).map(d=><option key={d}>{d}</option>)}</select>
        <select value={profile.occupation} onChange={e=>setProfile({...profile,occupation:e.target.value})} className="min-h-[48px] rounded-xl border border-[#E2E8F0] px-3 bg-white" aria-label="Profile occupation"><option>Small Farmer</option><option>Artisan</option><option>Daily Wage Worker</option><option>Woman</option></select>
        <input type="number" value={profile.income} onChange={e=>setProfile({...profile,income:e.target.value})} placeholder="Annual income ₹" aria-label="Profile income" className="min-h-[48px] rounded-xl border border-[#E2E8F0] px-3"/>
        <button onClick={async()=>{localStorage.setItem('sahaya_profile',JSON.stringify(profile));setState(profile.state);setDistrict(profile.district||'');activity('Updated profile settings');if(token){try{await fetch(API+'/api/profile',{method:'PUT',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({state:profile.state,district:profile.district,occupation:profile.occupation,income_range:String(profile.income),preferred_language:LANGS[lang].name})});setMsg('Profile saved to your account ✓')}catch{setMsg('Profile saved on this device ✓')}}else setMsg('Profile saved on this device ✓')}} className="min-h-[48px] rounded-xl text-white font-extrabold" style={{background:'#047857'}}>Save Profile</button>
       </div></div>
     </div>
    </div>
    <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6"><div className="flex flex-wrap justify-between gap-3"><h3 className="font-extrabold text-xl">Saved Schemes ({items.length})</h3><button disabled={busy} onClick={()=>askAI(null)} className="min-h-[48px] px-5 rounded-xl text-white font-extrabold disabled:opacity-50" style={{background:'#D97706'}}>{busy?'Thinking…':'Ask AI About My Profile'}</button></div>
     {ai&&<div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mt-3"><p className="leading-relaxed whitespace-pre-line break-words">{ai.summary}</p><small className="text-slate-400 font-semibold">{ai.source}</small></div>}
     {items.length===0?<p className="text-slate-500 mt-2 leading-relaxed">Nothing saved yet — tap Save on any scheme.</p>:<ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">{items.map(it=><li key={it.id} className="rounded-2xl bg-amber-50/70 border border-amber-200 p-4 flex flex-col gap-2"><b className="break-words leading-snug">{it.title}</b><p className="text-slate-600 text-sm leading-relaxed break-words">{it.ai_summary||it.description}</p><div className="flex flex-wrap gap-2"><button onClick={()=>speak(it.title+'. '+(it.ai_summary||''))} className="min-h-[42px] px-3.5 rounded-full bg-white border font-bold text-sm inline-flex gap-1 items-center"><Volume2 size={15}/>Listen</button><button onClick={()=>setItems(items.filter(x=>x.id!==it.id))} className="min-h-[42px] px-3.5 rounded-full bg-white border font-bold text-sm text-red-700">Remove</button></div></li>)}</ul>}
    </div>
   </section>}

   {page==='tracking'&&<TrackingPage schemes={catalog}/>}
   {page==='admin'&&<AdminPage token={token} catalog={catalog}/>}
   {page==='about'&&<section className="flex flex-col gap-5">
    <div className="bg-white rounded-[1.75rem] border border-[#E2E8F0] shadow-sm p-6 sm:p-8"><h2 className="font-extrabold text-3xl sm:text-4xl tracking-tight">About SahayaAI</h2><p className="text-slate-600 text-lg leading-relaxed mt-3 max-w-3xl">SahayaAI is a citizen-first digital platform that helps farmers, senior citizens, women, workers and families across India discover government welfare schemes, understand eligibility in simple language, and apply confidently on official portals — free, without middlemen.</p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6">{[['Our Mission','Bring every entitled benefit within reach of every citizen, in their own language.'],['Our Promise','Verified official links, honest AI guidance, and privacy by design — always.'],['Who We Serve','Farmers, grandparents, women, artisans, daily-wage workers and students.']].map(x=><div key={x[0]} className="rounded-3xl bg-slate-50 border border-[#E2E8F0] p-5"><b className="block text-lg">{x[0]}</b><p className="text-slate-500 leading-relaxed mt-1 break-words">{x[1]}</p></div>)}</div></div>
    <div id="help" className="bg-white rounded-[1.75rem] border border-[#E2E8F0] shadow-sm p-6 sm:p-8"><h3 className="font-extrabold text-2xl inline-flex gap-2 items-center"><HelpCircle className="text-emerald-700"/> Help & Support</h3>
     <ul className="mt-3 flex flex-col gap-2.5 text-slate-600 leading-relaxed"><li>• <b>Applying:</b> Use the Step-by-Step Guide on any scheme, then apply FREE at your nearest Grama One / CSC / Seva Sindhu centre.</li><li>• <b>Documents:</b> Open the Documents page for a personalised checklist. Your files never leave your phone.</li><li>• <b>Scheme doubts:</b> Ask the AI Assistant (nav above) in Kannada, Telugu, Hindi or English.</li><li>• <b>Official help:</b> For application status, only the official portal / department helpline on that portal can confirm.</li></ul></div>
   </section>}
  </main>

  <footer className="text-white" style={{background:'#0B2447'}}>
   <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
    <div className="col-span-2 md:col-span-1"><b className="text-xl">SahayaAI</b><p className="text-slate-400 text-sm leading-relaxed mt-1.5 break-words">Government benefits, made simple for every Indian citizen.</p></div>
    {[['Platform',['Home','Explore Schemes','AI Scheme Finder','Eligibility Checker'],['home','explore','finder','eligibility']],['Services',['AI Assistant','Document Assistant','Application Tracking','My Dashboard'],['chat','documents','tracking','dashboard']],['Support',['About Us','Help & Support','Admin','Official Portals'],['about','about','admin','explore']]].map(([h,links,pages])=><div key={h}><b className="text-slate-200">{h}</b>{links.map((l,i)=><button key={l} onClick={()=>go(pages[i])} className="block text-slate-400 py-1 hover:text-white font-semibold text-left min-h-[36px]">{l}</button>)}</div>)}
   </div>
   <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 text-slate-400 text-sm border-t border-white/10 pt-5 leading-relaxed">Disclaimer: SahayaAI simplifies public government information and is not an official government website. Eligibility shown is guidance only — final approval rests solely with the Government department. Always verify on official .gov.in / .nic.in portals. Never pay anyone for free schemes. • Made in India 🇮🇳</div>
  </footer>

  {selected&&<div className="fixed inset-0 z-[1200] bg-black/55 flex items-end sm:items-center justify-center p-3" role="dialog" aria-modal="true" aria-label={t.checkTitle}>
   <div className="bg-white rounded-[2rem] p-6 sm:p-8 w-full max-w-lg max-h-[88vh] overflow-y-auto shadow-2xl flex flex-col gap-4">
    <div className="flex flex-wrap items-start justify-between gap-3"><span className="rounded-full px-4 py-2 font-extrabold text-white leading-snug" style={{background:'#047857'}}>{selected.match}% Match</span><button onClick={()=>setSelected(null)} aria-label="Close" className="min-w-[52px] min-h-[52px] px-3 py-3 grid place-items-center rounded-full bg-slate-100 shrink-0"><X size={24}/></button></div>
    <h3 className="font-extrabold text-3xl leading-snug break-words">{selected.name}</h3><p className="font-extrabold text-xl leading-relaxed break-words" style={{color:'#D97706'}}>{selected.benefit}</p>
    <div><h4 className="font-extrabold text-xl">You may be eligible if:</h4><ul className="flex flex-col gap-2 mt-2 text-lg leading-relaxed">{selected.points.map(p=><li key={p} className="flex gap-2 break-words"><CheckCircle2 className="text-emerald-700 shrink-0 mt-1"/>{p}</li>)}</ul></div>
    <div><h4 className="font-extrabold text-xl">Documents:</h4><div className="flex flex-wrap gap-2 mt-2">{selected.docs.map(d=><span key={d} className="bg-amber-50 border border-amber-200 rounded-full px-3 py-2 font-semibold leading-snug break-words">{d}</span>)}</div></div>
    <div className="flex flex-wrap gap-3"><button onClick={()=>askAI(selected)} className="flex-1 min-w-[150px] min-h-[52px] h-auto whitespace-normal px-5 py-3 rounded-2xl text-white font-extrabold leading-snug" style={{background:'#0B2447'}}>Ask AI</button><button onClick={()=>{setGuide({scheme:selected,tab:'link'});setSelected(null)}} className="flex-1 min-w-[150px] min-h-[52px] h-auto whitespace-normal px-5 py-3 rounded-2xl font-extrabold leading-snug border-2 inline-flex justify-center items-center" style={{borderColor:'#D97706',color:'#92400E'}}>{t.apply}</button></div>
    <button onClick={()=>listenScheme(selected)} className="min-h-[52px] h-auto whitespace-normal px-5 py-3 w-full rounded-2xl bg-amber-100 font-extrabold leading-snug inline-flex justify-center items-center gap-2"><Volume2/> {t.listen}</button>
   </div></div>}
  {guide&&<GuideModal key={guide.scheme.name+'-'+guide.tab} scheme={guide.scheme} initialTab={guide.tab} state={state} district={district} onClose={()=>setGuide(null)} t={t} langSpeech={LANGS[lang].speech}/>}
  <VoiceAssist langSpeech={LANGS[lang].speech} onTranscript={onVoice} t={t} openSignal={voiceSignal}/>
 </div>
}
function MiniCard({s,onGuide,onSave,onListen,onShare,onCompare,compared}){
 return <article className="depth-card p-6 flex flex-col gap-3">
  <div className="flex flex-wrap justify-between gap-2"><span className="rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1.5 text-[.8rem] font-bold break-words">{s.origin}</span><span className="rounded-full px-3 py-1.5 text-sm font-extrabold text-white shrink-0" style={{background:(s.match||80)>=90?'#047857':'#D97706'}}>{s.match||'—'}% Match</span></div>
  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-sm"><ShieldCheck size={15}/>Verified Official Scheme</span>
  <h3 className="font-extrabold text-[1.3rem] leading-snug break-words">{s.name}</h3>
  <p className="font-extrabold break-words" style={{color:'#D97706'}}>{s.benefit}</p>
  <ul className="flex flex-col gap-1.5 text-slate-600 leading-relaxed">{(s.points||[]).slice(0,3).map(p=><li key={p} className="flex gap-2 break-words"><CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5"/>{p}</li>)}</ul>
  <div className="flex flex-wrap gap-2 mt-auto pt-1">
   <button onClick={onGuide} className="flex-1 min-w-[130px] min-h-[52px] h-auto whitespace-normal px-4 py-2.5 rounded-xl border-2 font-extrabold leading-snug" style={{borderColor:'#0B2447',color:'#0B2447'}}>Step-by-Step Guide</button>
   <a href={s.apply} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[130px] min-h-[52px] h-auto whitespace-normal px-4 py-2.5 rounded-xl text-white font-extrabold leading-snug inline-flex justify-center items-center text-center shadow" style={{background:'#047857'}}>Official Portal & Apply</a>
  </div>
  <div className="flex flex-wrap gap-2">
   {onListen&&<button onClick={onListen} className="min-h-[44px] px-3.5 rounded-full bg-amber-50 border border-amber-200 font-bold text-sm inline-flex gap-1.5 items-center"><Volume2 size={15}/>Listen</button>}
   <button onClick={onSave} className="min-h-[44px] px-3.5 rounded-full bg-emerald-50 border border-emerald-200 font-bold text-sm inline-flex gap-1.5 items-center"><BookmarkPlus size={15}/>Save</button>
   {onShare&&<button onClick={onShare} className="min-h-[44px] px-3.5 rounded-full bg-slate-50 border font-bold text-sm inline-flex gap-1.5 items-center"><Share2 size={15}/>Share</button>}
   {onCompare&&<button onClick={onCompare} aria-pressed={!!compared} className={`min-h-[44px] px-3.5 rounded-full border font-bold text-sm inline-flex gap-1.5 items-center ${compared?'bg-slate-900 text-white':'bg-slate-50'}`}><GitCompareArrows size={15}/>{compared?'Comparing ✓':'Compare'}</button>}
  </div>
 </article>
}
