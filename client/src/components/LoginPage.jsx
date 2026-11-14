import {useEffect,useRef,useState} from 'react'
import {motion,AnimatePresence} from 'framer-motion'
import {Sprout,Phone,Mic,FastForward,Mail,ChevronRight,MessageSquareText,Loader2,IdCard} from 'lucide-react'
import {LOGIN_T} from '../i18n.js'

export default function LoginPage({onGuest,onEmailLogin,onDemoLogin,lang,setLang,LANGS}){
 const L=LOGIN_T[lang]||LOGIN_T.en
 const [phone,setPhone]=useState('');const [otp,setOtp]=useState(['','','','']);const [code,setCode]=useState('');const [stage,setStage]=useState('phone') // phone|sending|otp
 const [toast,setToast]=useState(false);const [seconds,setSeconds]=useState(30);const [err,setErr]=useState('')
 const [citizen,setCitizen]=useState(false);const [citizenId,setCitizenId]=useState('')
 const [showEmail,setShowEmail]=useState(false);const [emailForm,setEmailForm]=useState({full_name:'',email:'',password:''});const [isSignup,setIsSignup]=useState(false);const [busy,setBusy]=useState(false)
 const refs=[useRef(),useRef(),useRef(),useRef()];const timers=useRef([])
 useEffect(()=>()=>timers.current.forEach(clearTimeout),[])
 useEffect(()=>{ if(stage!=='otp'||seconds<=0) return; const id=setInterval(()=>setSeconds(s=>Math.max(0,s-1)),1000); return ()=>clearInterval(id)},[stage,seconds])
 const phoneOk=/^[6-9]\d{9}$/.test(phone.replace(/\s/g,''))
 function genCode(){return String(Math.floor(1000+Math.random()*9000))}
 function sendOtp(){
  if(!phoneOk){setErr(L.invalidPhone);return}
  setErr('');setStage('sending');setToast(false)
  const c=genCode()
  timers.current.push(setTimeout(()=>{setCode(c);setStage('otp');setSeconds(30);setOtp(['','','','']);setToast(true);timers.current.push(setTimeout(()=>refs[0].current?.focus(),150));timers.current.push(setTimeout(()=>setToast(false),12000))},1400))
 }
 function resend(){ if(seconds>0)return; setCode(genCode());setSeconds(30);setOtp(['','','','']);setToast(true);setErr('');timers.current.push(setTimeout(()=>setToast(false),12000));setTimeout(()=>refs[0].current?.focus(),100) }
 function otpChange(i,v){const d=v.replace(/\D/g,'').slice(-1);const n=[...otp];n[i]=d;setOtp(n);setErr('');if(d&&i<3)refs[i+1].current?.focus()}
 function otpKey(i,e){if(e.key==='Backspace'&&!otp[i]&&i>0)refs[i-1].current?.focus()}
 function verify(){
  if(otp.some(d=>!d)||otp.join('')!==code){ if(seconds===0&&code) setErr(L.expired); else setErr(L.wrongOtp); return }
  onGuest({full_name:'Mobile Citizen (+91 •••'+phone.replace(/\s/g,'').slice(-4)+')',method:'OTP'})
 }
 function voice(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return setErr('Voice: Chrome on Android please. Or tap Skip to Guest Demo.');const r=new SR();r.lang=(LANGS[lang]&&LANGS[lang].speech)||'en-IN';r.onresult=e=>{const txt=e.results[0][0].transcript.replace(/\D/g,'');if(txt.length>=10){setPhone(txt.slice(-10));setErr('')}else setErr('Heard: '+e.results[0][0].transcript)};try{r.start()}catch{}}
 async function emailSubmit(e){e.preventDefault();setBusy(true);setErr('');try{await onEmailLogin(emailForm,isSignup)}catch(x){setErr(x.message)}finally{setBusy(false)}}

 return <main className="min-h-screen" style={{background:'#faf8f5'}}>
  {/* simulated SMS toast */}
  <AnimatePresence>{toast&&code&&<motion.div initial={{y:-90,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-90,opacity:0}} transition={{type:'spring',stiffness:160,damping:20}} role="alert" className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-24px)] max-w-md bg-[#064e3b] text-white rounded-3xl p-4 shadow-2xl border border-white/30">
   <p className="font-extrabold flex items-center gap-2"><MessageSquareText/> {L.smsFrom}</p><p className="text-lg mt-1 leading-snug">{L.smsBody(code)}</p><p className="font-mono font-extrabold text-2xl tracking-[.3em] mt-1 text-amber-300">{code}</p></motion.div>}</AnimatePresence>

  <div className="max-w-xl mx-auto px-4 py-6 sm:py-10">
   <div className="flex items-center gap-3 justify-center"><span className="w-14 h-14 rounded-3xl grid place-items-center text-white shadow-lg" style={{background:'#064e3b'}}><Sprout size={30}/></span><div><b className="text-3xl font-extrabold text-[#292524] block leading-none">SahayaAI</b><small className="font-bold text-stone-500">For Farmers • Elders • Families</small></div></div>

   <motion.section initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.45}} className="bg-white rounded-[2rem] border-2 border-emerald-900/10 shadow-[0_24px_60px_rgba(6,78,59,.12)] p-5 sm:p-7 mt-6" aria-label="Login">
    {/* Language pills — top of card */}
    <nav aria-label="Choose language" className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-2">
     {Object.entries(LANGS).map(([k,v])=><button key={k} onClick={()=>{setLang(k);setErr('')}} aria-pressed={lang===k} className={`min-h-[52px] shrink-0 rounded-full px-4 font-extrabold border-2 transition active:scale-95 ${lang===k?'text-white shadow-lg':'bg-[#faf8f5] text-stone-700'}`} style={lang===k?{background:'#d97706',borderColor:'#d97706'}:{borderColor:'#E7E5E4'}}>{v.label}</button>)}
    </nav>

    <h1 className="font-extrabold text-[1.9rem] sm:text-4xl leading-tight text-[#292524] mt-3">{L.title}</h1>
    <p className="text-lg text-stone-600 mt-2 leading-relaxed">{L.sub}</p>
    {err&&<p role="alert" className="bg-red-50 border-2 border-red-200 text-red-800 rounded-2xl p-3 font-bold mt-4">{err}</p>}

    {!citizen?<>
     <label htmlFor="phone" className="font-extrabold text-xl block mt-6">{L.phone}</label>
     <div className="flex mt-2 rounded-2xl border-[3px] border-stone-300 focus-within:border-amber-500 overflow-hidden bg-white transition">
      <span className="grid place-items-center px-4 font-extrabold text-xl bg-[#faf8f5] border-r" aria-hidden>+91</span>
      <input id="phone" inputMode="numeric" autoComplete="tel" aria-label={L.phone} placeholder="98765 43210" value={phone} disabled={stage==='otp'||stage==='sending'} onChange={e=>setPhone(e.target.value.replace(/[^\d\s]/g,''))} className="flex-1 min-h-[64px] min-w-0 px-3 text-[1.35rem] font-extrabold placeholder:text-stone-400 outline-none disabled:bg-stone-50"/>
     </div>
     {stage==='phone'&&<motion.button whileTap={{scale:.97}} onClick={sendOtp} className="min-h-[64px] w-full rounded-2xl mt-4 font-extrabold text-xl text-white shadow-xl inline-flex justify-center items-center gap-2" style={{background:'#064e3b'}}><Phone size={22}/> {L.send}</motion.button>}
     {stage==='sending'&&<p role="status" className="min-h-[64px] rounded-2xl mt-4 font-extrabold text-lg bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center gap-3 text-emerald-900"><Loader2 className="animate-spin" size={26}/> {L.sending}</p>}
     <AnimatePresence>{stage==='otp'&&<motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0}} className="overflow-hidden">
      <p className="font-extrabold text-xl mt-6">{L.otpTitle}</p><p className="text-stone-600 text-lg mt-1">{L.otpHint}</p>
      <div className="grid grid-cols-4 gap-3 mt-3">{otp.map((d,i)=><input key={i} ref={refs[i]} value={d} onChange={e=>otpChange(i,e.target.value)} onKeyDown={e=>otpKey(i,e)} aria-label={`OTP ${i+1}`} inputMode="numeric" autoComplete={i===0?'one-time-code':'off'} className="min-h-[76px] w-full rounded-2xl border-[3px] border-stone-300 focus:border-amber-500 bg-[#faf8f5] text-4xl font-extrabold text-center outline-none transition"/>)}</div>
      <div className="flex items-center justify-between mt-3 min-h-[52px]"><span className="font-bold text-stone-600" aria-live="polite">{seconds>0?`⏳ ${L.resendIn} ${seconds} ${L.sec}`:'⏰'}</span>
       <button onClick={resend} disabled={seconds>0} className="min-h-[52px] px-3 font-extrabold text-amber-700 disabled:text-stone-400 disabled:no-underline underline underline-offset-4">{L.resend}</button></div>
      <motion.button whileTap={{scale:.97}} onClick={verify} className="min-h-[64px] w-full rounded-2xl font-extrabold text-xl text-white shadow-xl" style={{background:'#d97706'}}>{L.verify} ✓</motion.button>
      <button onClick={()=>{setStage('phone');setToast(false);setCode('')}} className="min-h-[48px] font-bold text-stone-500 w-full">← Change mobile number</button>
     </motion.div>}</AnimatePresence>
    </>:<>
     <label htmlFor="cid" className="font-extrabold text-xl block mt-6">🪪 Citizen ID (Demo only)</label>
     <input id="cid" inputMode="numeric" placeholder="Do NOT enter real Aadhaar — demo only" value={citizenId} onChange={e=>setCitizenId(e.target.value)} className="mt-2 w-full min-h-[64px] rounded-2xl border-[3px] border-stone-300 focus:border-amber-500 px-4 text-xl font-bold outline-none"/>
     <button onClick={()=>{if(citizenId.replace(/\s/g,'').length<8)return setErr('Demo: type any 8+ digits, or use Guest Demo. Real Aadhaar is never saved.');onGuest({full_name:'Citizen Demo User',method:'Citizen ID demo'})}} className="min-h-[64px] w-full rounded-2xl mt-3 font-extrabold text-xl text-white shadow" style={{background:'#064e3b'}}>Login with Citizen ID →</button>
    </>}

    <div className="grid sm:grid-cols-2 gap-2 mt-5">
     <button onClick={voice} className="min-h-[60px] rounded-2xl bg-amber-50 border-2 border-amber-300 font-extrabold text-lg inline-flex justify-center items-center gap-2 active:scale-95 transition text-amber-900"><Mic size={22}/> {L.voice}</button>
     <button onClick={()=>onGuest({full_name:'Guest Demo Farmer',method:'Guest'})} className="min-h-[60px] rounded-2xl bg-emerald-50 border-2 border-emerald-300 font-extrabold text-lg inline-flex justify-center items-center gap-2 active:scale-95 transition text-emerald-900"><FastForward size={21}/> {L.guest}</button>
    </div>
    <button onClick={()=>setCitizen(!citizen)} className="min-h-[52px] w-full font-extrabold text-emerald-800 mt-1 inline-flex justify-center items-center gap-2"><IdCard size={20}/> {citizen?'← Back to Mobile OTP':'Aadhaar / Citizen ID Login'}</button>
    <button onClick={onDemoLogin} className="min-h-[52px] w-full font-extrabold text-amber-700">🌾 {L.demo}</button>
    <button onClick={()=>setShowEmail(!showEmail)} className="min-h-[48px] font-bold text-stone-600 inline-flex items-center gap-1"><Mail size={18}/> {L.email} <ChevronRight size={18}/></button>
    {showEmail&&<form onSubmit={emailSubmit} className="grid gap-2 bg-[#faf8f5] border-2 rounded-3xl p-4">
     {isSignup&&<input required placeholder="Full name" value={emailForm.full_name} onChange={e=>setEmailForm({...emailForm,full_name:e.target.value})} className="min-h-[56px] rounded-2xl border-2 px-4 text-lg font-semibold bg-white"/>}
     <input required type="email" placeholder="Email" value={emailForm.email} onChange={e=>setEmailForm({...emailForm,email:e.target.value})} className="min-h-[56px] rounded-2xl border-2 px-4 text-lg font-semibold bg-white"/>
     <input required minLength={6} type="password" placeholder="Password (6+)" value={emailForm.password} onChange={e=>setEmailForm({...emailForm,password:e.target.value})} className="min-h-[56px] rounded-2xl border-2 px-4 text-lg font-semibold bg-white"/>
     <button disabled={busy} className="min-h-[56px] rounded-2xl text-white font-extrabold text-lg disabled:opacity-60" style={{background:'#064e3b'}}>{busy?'Please wait…':isSignup?'Create Account':'Login with Email'}</button>
     <button type="button" onClick={()=>setIsSignup(!isSignup)} className="min-h-[48px] font-bold text-amber-700">{isSignup?'Already have account? Login':'New? Create free account'}</button></form>}
   </motion.section>
   <p className="text-center font-bold text-stone-500 mt-5">🔒 {L.safe} • Made for rural India 🇮🇳</p>
  </div>
 </main>
}
