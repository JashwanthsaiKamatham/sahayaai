import {useRef,useState} from 'react'
import {motion,useMotionValue,useSpring,useTransform,useReducedMotion} from 'framer-motion'
import {Sprout,ShieldCheck,Sun,Phone,IdCard,Mic,ChevronRight,FastForward,Mail} from 'lucide-react'

const particles=Array.from({length:26},(_,i)=>({left:(i*37)%100,top:(i*53)%100,size:2+(i%4),delay:(i%7)*.7,dur:7+(i%5)}))

export default function LoginPage({onGuest,onEmailLogin,onDemoLogin,lang,setLang,LANGS}){
 const [tab,setTab]=useState('mobile') // mobile | citizen
 const [phone,setPhone]=useState('');const [otpSent,setOtpSent]=useState(false);const [otp,setOtp]=useState(['','','','']);const [err,setErr]=useState('')
 const [citizenId,setCitizenId]=useState('');const [showEmail,setShowEmail]=useState(false);const [emailForm,setEmailForm]=useState({full_name:'',email:'',password:''});const [isSignup,setIsSignup]=useState(false);const [busy,setBusy]=useState(false)
 const otpRefs=[useRef(),useRef(),useRef(),useRef()]
 const rm=useReducedMotion()
 const mx=useMotionValue(0),my=useMotionValue(0)
 const rx=useSpring(useTransform(my,[-.5,.5],[7,-7]),{stiffness:120,damping:16});const ry=useSpring(useTransform(mx,[-.5,.5],[-9,9]),{stiffness:120,damping:16})
 function tilt(e){if(rm)return;const r=e.currentTarget.getBoundingClientRect();mx.set((e.clientX-r.left)/r.width-.5);my.set((e.clientY-r.top)/r.height-.5)}
 function reset(){mx.set(0);my.set(0)}
 const phoneOk=/^[6-9]\d{9}$/.test(phone.replace(/\s/g,''))
 function sendOtp(){if(!phoneOk)return setErr('Please enter a correct 10-digit mobile number');setErr('');setOtpSent(true);setTimeout(()=>otpRefs[0].current?.focus(),100)}
 function otpChange(i,v){const d=v.replace(/\D/g,'').slice(-1);const n=[...otp];n[i]=d;setOtp(n);if(d&&i<3)otpRefs[i+1].current?.focus()}
 function verifyOtp(){if(otp.some(d=>!d))return setErr('Please enter all 4 OTP numbers');onGuest({full_name:'Mobile Citizen (+91 '+phone.slice(-4)+')',method:'OTP'})}
 function citizenLogin(){const d=citizenId.replace(/\s/g,'');if(d.length<8)return setErr('For demo, please do NOT type your real Aadhaar. Type any 8+ digit demo ID, or use Guest Demo.');onGuest({full_name:'Citizen Demo User',method:'Citizen ID (demo)'})}
 async function emailSubmit(e){e.preventDefault();setBusy(true);setErr('');try{await onEmailLogin(emailForm,isSignup)}catch(err){setErr(err.message)}finally{setBusy(false)}}
 function voice(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return setErr('Voice needs Chrome. You can tap Guest Demo instead.');const r=new SR();r.lang='en-IN';r.onresult=e=>{const txt=e.results[0][0].transcript.replace(/\D/g,'');if(txt.length>=10)setPhone(txt.slice(-10));else setErr('Heard: “'+e.results[0][0].transcript+'” — please say your 10-digit mobile number, or tap Guest.')};try{r.start()}catch{}}

 return <main className="min-h-screen relative overflow-hidden text-white" style={{background:'linear-gradient(135deg,#062c1e 0%,#0a3d29 45%,#0f4c36 100%)'}}>
  {/* particles */}
  <div aria-hidden className="absolute inset-0">{particles.map((p,i)=><motion.span key={i} className="absolute rounded-full bg-amber-200" style={{left:p.left+'%',top:p.top+'%',width:p.size,height:p.size,opacity:.5}} animate={rm?{}:{y:[0,-24,0],opacity:[.2,.8,.2]}} transition={{duration:p.dur,repeat:Infinity,delay:p.delay}}/>)}</div>
  <div aria-hidden className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-emerald-400/20 blur-3xl"/><div aria-hidden className="absolute -bottom-40 -left-24 w-[420px] h-[420px] rounded-full bg-amber-400/15 blur-3xl"/>
  {/* floating 3D emblems */}
  <motion.div aria-hidden animate={rm?{}:{y:[0,-14,0],rotate:[0,6,0]}} transition={{duration:7,repeat:Infinity}} className="hidden md:grid absolute left-[7%] top-[22%] w-24 h-24 rounded-[2rem] place-items-center bg-white/10 border border-white/25 backdrop-blur-xl shadow-2xl" style={{transform:'rotateX(18deg) rotateY(-18deg)'}}><Sprout size={44} color="#6EE7B7"/></motion.div>
  <motion.div aria-hidden animate={rm?{}:{y:[0,12,0],rotate:[0,-8,0]}} transition={{duration:8,repeat:Infinity}} className="hidden md:grid absolute right-[8%] top-[18%] w-20 h-20 rounded-full place-items-center bg-amber-300/20 border border-amber-200/40 backdrop-blur-xl shadow-[0_0_60px_rgba(251,191,36,.35)]"><Sun size={36} color="#FCD34D"/></motion.div>
  <motion.div aria-hidden animate={rm?{}:{y:[0,-10,0]}} transition={{duration:6,repeat:Infinity}} className="hidden lg:grid absolute right-[13%] bottom-[16%] w-[74px] h-[74px] rounded-full place-items-center bg-emerald-300/15 border border-emerald-200/35 backdrop-blur-xl"><ShieldCheck size={32} color="#A7F3D0"/></motion.div>
  <motion.div aria-hidden animate={rm?{}:{rotate:360}} transition={{duration:40,repeat:Infinity,ease:'linear'}} className="hidden lg:block absolute left-[10%] bottom-[14%] w-28 h-28 rounded-full border-2 border-dashed border-amber-300/40"/>

  <div className="relative max-w-6xl mx-auto px-4 py-6 min-h-screen flex flex-col">
   <header className="flex items-center justify-between gap-3 flex-wrap">
    <div className="flex items-center gap-3"><span className="w-12 h-12 rounded-2xl grid place-items-center bg-emerald-400/20 border border-white/25 backdrop-blur"><Sprout size={26}/></span><div><b className="text-2xl font-extrabold block leading-none">SahayaAI</b><small className="text-emerald-100/85 font-semibold">सरकारी योजनाएँ • ನಿಮ್ಮ ಯೋಜನೆಗಳು • உங்கள் திட்டங்கள்</small></div></div>
    <label className="flex items-center gap-2 font-bold bg-white/10 border border-white/20 rounded-full pl-3 pr-1 py-1 backdrop-blur"><span className="sr-only">Language</span>🌐<select value={lang} onChange={e=>setLang(e.target.value)} aria-label="Language" className="min-h-[44px] rounded-full bg-white text-emerald-950 font-extrabold px-3">{Object.entries(LANGS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></label>
   </header>

   <div className="flex-1 grid lg:grid-cols-2 gap-8 items-center py-8">
    <motion.div initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} transition={{duration:.7}}>
     <span className="inline-flex bg-amber-300/15 border border-amber-200/35 text-amber-100 rounded-full px-4 py-2 font-bold">🌾 For Farmers, Elders & Every Family</span>
     <h1 className="font-extrabold leading-[1.05] mt-5" style={{fontSize:'clamp(2.3rem,6vw,4.2rem)'}}>Namaste 🙏<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-amber-300">Your Government Benefits Are Waiting.</span></h1>
     <p className="text-emerald-50/90 text-xl leading-relaxed mt-4 max-w-lg">Big buttons. Your language. Listen instead of reading. Find pensions, farm money, housing & healthcare — free, with no agent.</p>
     <ul className="mt-6 space-y-2 text-lg font-semibold">{['✅ 100% Free — never pay anyone','🔊 Listen to every scheme aloud','🛡️ Safe: we never ask bank password / OTP of bank'].map(x=><li key={x}>{x}</li>)}</ul>
    </motion.div>

    {/* 3D tilt glass card */}
    <div style={{perspective:1200}} onMouseMove={tilt} onMouseLeave={reset}>
     <motion.section initial={{opacity:0,y:32,rotateX:6}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.12}} style={rm?{}:{rotateX:rx,rotateY:ry,transformStyle:'preserve-3d'}} className="rounded-[2rem] bg-white/[.09] border border-white/35 backdrop-blur-xl shadow-[0_35px_80px_rgba(0,0,0,.45)] p-5 sm:p-7" aria-label="Login">
      <h2 className="font-extrabold text-3xl">Welcome! Login here</h2><p className="text-emerald-100/85 text-lg mt-1">Choose the easiest way for you 👇</p>
      <div className="grid grid-cols-2 gap-2 mt-5" role="tablist" aria-label="Login method">
       <button role="tab" aria-selected={tab==='mobile'} onClick={()=>setTab('mobile')} className={`min-h-[56px] rounded-2xl font-extrabold text-base sm:text-lg inline-flex items-center justify-center gap-2 transition active:scale-95 ${tab==='mobile'?'bg-amber-300 text-emerald-950 shadow-lg':'bg-white/10 border border-white/25 text-white'}`}><Phone size={21}/> Mobile OTP</button>
       <button role="tab" aria-selected={tab==='citizen'} onClick={()=>setTab('citizen')} className={`min-h-[56px] rounded-2xl font-extrabold text-base sm:text-lg inline-flex items-center justify-center gap-2 transition active:scale-95 ${tab==='citizen'?'bg-amber-300 text-emerald-950 shadow-lg':'bg-white/10 border border-white/25 text-white'}`}><IdCard size={21}/> Citizen ID</button>
      </div>

      {err&&<p role="alert" className="bg-red-500/20 border border-red-300/50 text-red-50 rounded-2xl p-3 font-bold mt-4">{err}</p>}

      {tab==='mobile'?<div className="mt-5">
       <label htmlFor="phone" className="font-extrabold text-lg">📱 Your 10-digit Mobile Number</label>
       <input id="phone" inputMode="numeric" autoComplete="tel" placeholder="Example: 98765 43210" value={phone} onChange={e=>setPhone(e.target.value.replace(/[^\d\s]/g,''))} className="mt-2 w-full min-h-[60px] rounded-2xl bg-white text-emerald-950 text-[1.25rem] font-bold px-4 placeholder:text-slate-400 border-4 border-transparent focus:border-amber-300 outline-none transition"/>
       {!otpSent?<button onClick={sendOtp} className="min-h-[60px] w-full rounded-2xl mt-3 font-extrabold text-xl text-emerald-950 bg-gradient-to-r from-amber-300 to-amber-400 shadow-xl active:scale-[.98] transition">Send OTP →</button>
       :<><p className="font-bold mt-4 text-lg">🔢 Type the 4 OTP numbers <span className="text-amber-200">(Demo: any 4 numbers)</span></p>
        <div className="grid grid-cols-4 gap-3 mt-2">{otp.map((d,i)=><input key={i} ref={otpRefs[i]} aria-label={`OTP digit ${i+1}`} inputMode="numeric" value={d} onChange={e=>otpChange(i,e.target.value)} className="min-h-[68px] rounded-2xl bg-white text-emerald-950 text-3xl font-extrabold text-center border-4 border-transparent focus:border-amber-300 outline-none"/>)}</div>
        <button onClick={verifyOtp} className="min-h-[60px] w-full rounded-2xl mt-4 font-extrabold text-xl text-white bg-emerald-500 shadow-xl active:scale-[.98] transition">Verify & Enter ✓</button>
        <button onClick={sendOtp} className="min-h-[48px] font-bold text-amber-200 mt-1">Resend OTP</button></>}
      </div>:<div className="mt-5">
       <label htmlFor="cid" className="font-extrabold text-lg">🪪 Aadhaar / Citizen ID Login</label>
       <input id="cid" inputMode="numeric" placeholder="Demo ID only — do NOT enter real Aadhaar" value={citizenId} onChange={e=>setCitizenId(e.target.value)} className="mt-2 w-full min-h-[60px] rounded-2xl bg-white text-emerald-950 text-[1.2rem] font-bold px-4 placeholder:text-slate-400 border-4 border-transparent focus:border-amber-300 outline-none"/>
       <p className="text-amber-100/90 font-semibold mt-2">🔒 For your safety, this demo never sends or saves your ID number.</p>
       <button onClick={citizenLogin} className="min-h-[60px] w-full rounded-2xl mt-3 font-extrabold text-xl text-emerald-950 bg-gradient-to-r from-amber-300 to-amber-400 shadow-xl active:scale-[.98] transition">Login with Citizen ID →</button>
      </div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-5">
       <button onClick={voice} className="min-h-[60px] rounded-2xl bg-white text-emerald-950 font-extrabold text-lg inline-flex justify-center items-center gap-2 shadow active:scale-95 transition"><Mic size={22} color="#C05621"/> Voice Assist</button>
       <button onClick={()=>onGuest({full_name:'Guest Demo Farmer',method:'Guest'})} className="min-h-[60px] rounded-2xl border-2 border-white/45 bg-white/10 font-extrabold text-lg inline-flex justify-center items-center gap-2 active:scale-95 transition"><FastForward size={21}/> Skip to Guest Demo</button>
      </div>
      <button onClick={onDemoLogin} className="min-h-[52px] w-full font-extrabold text-amber-200 mt-2">🌾 1-Tap Full Demo Account (saves schemes)</button>

      <button onClick={()=>setShowEmail(!showEmail)} className="min-h-[48px] font-bold text-emerald-100 inline-flex items-center gap-1"><Mail size={18}/> Have an email account? Login / Sign up <ChevronRight size={18}/></button>
      {showEmail&&<form onSubmit={emailSubmit} className="grid gap-2 bg-white/10 border border-white/20 rounded-3xl p-4">
       {isSignup&&<input required placeholder="Full name" value={emailForm.full_name} onChange={e=>setEmailForm({...emailForm,full_name:e.target.value})} className="min-h-[56px] rounded-2xl bg-white text-emerald-950 text-lg font-semibold px-4"/>}
       <input required type="email" placeholder="Email" value={emailForm.email} onChange={e=>setEmailForm({...emailForm,email:e.target.value})} className="min-h-[56px] rounded-2xl bg-white text-emerald-950 text-lg font-semibold px-4"/>
       <input required minLength={6} type="password" placeholder="Password (6+)" value={emailForm.password} onChange={e=>setEmailForm({...emailForm,password:e.target.value})} className="min-h-[56px] rounded-2xl bg-white text-emerald-950 text-lg font-semibold px-4"/>
       <button disabled={busy} className="min-h-[56px] rounded-2xl bg-emerald-500 text-white font-extrabold text-lg disabled:opacity-60">{busy?'Please wait…':isSignup?'Create Account':'Login with Email'}</button>
       <button type="button" onClick={()=>setIsSignup(!isSignup)} className="min-h-[48px] font-bold text-amber-200">{isSignup?'Already have account? Login':'New? Create free account'}</button>
      </form>}
     </motion.section>
    </div>
   </div>
   <footer className="relative text-center text-emerald-100/75 font-semibold pb-2">🔒 Safe & Free • Made for rural India 🇮🇳 • Demo OTP — any 4 digits works</footer>
  </div>
 </main>
}
