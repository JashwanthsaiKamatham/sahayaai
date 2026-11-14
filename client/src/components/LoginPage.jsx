import {useState} from 'react'
import {Landmark,Eye,EyeOff,ShieldCheck,Sprout,Globe2,ChevronRight,LockKeyhole,ArrowLeft,Mic,BadgeCheck,RefreshCw,Nfc} from 'lucide-react'
import {LOGIN_T} from '../i18n-login.js'
import ThemeBackdrop from './ThemeBackdrop.jsx'

export default function LoginPage({onEmailLogin,onGuest,onDemoLogin,lang,setLang,LANGS}){
 const L=LOGIN_T[lang]||LOGIN_T.en
 const [isSignup,setIsSignup]=useState(false);const [showPw,setShowPw]=useState(false);const [busy,setBusy]=useState(false);const [err,setErr]=useState('')
 const [form,setForm]=useState({full_name:'',email:'',password:''})
 async function submit(e){e.preventDefault();setBusy(true);setErr('');try{await onEmailLogin(form,isSignup)}catch(x){setErr(x.message)}finally{setBusy(false)}}
 const IN='min-h-[52px] h-auto w-full rounded-xl px-4 py-3 text-[1.05rem] outline-none glass-input'
 return <main className="midnight relative min-h-screen text-white overflow-x-clip">
  {/* Full-viewport ambient constellation canvas (same palette as the 3D globe) */}
  <div className="absolute inset-0 pointer-events-none" aria-hidden="true"><ThemeBackdrop density={1.15}/></div>
  {/* Isometric blueprint lattice + mandala, very faint */}
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[.35]" aria-hidden="true">
   <defs>
    <pattern id="isoGridLogin" width="56" height="32" patternUnits="userSpaceOnUse">
     <path d="M28 0L56 16L28 32L0 16Z" fill="none" stroke="rgba(59,130,246,.13)" strokeWidth="1"/>
    </pattern>
   </defs>
   <rect width="100%" height="100%" fill="url(#isoGridLogin)"/>
   <g fill="none" stroke="rgba(59,130,246,.20)">
    <circle cx="88%" cy="16%" r="130"/><circle cx="88%" cy="16%" r="92"/><circle cx="88%" cy="16%" r="54"/>
    <rect x="calc(88% - 92px)" y="calc(16% - 92px)" width="184" height="184"/>
    <rect x="calc(88% - 65px)" y="calc(16% - 65px)" width="130" height="130" transform="rotate(45 0 0)"/>
   </g>
   <g><circle cx="88%" cy="16%" r="5" fill="#F59E0B"/><circle cx="12%" cy="84%" r="5" fill="#10B981"/><circle cx="70%" cy="88%" r="4" fill="#3B82F6"/></g>
  </svg>

  <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-7 min-h-screen flex flex-col">
   {/* Top bar: Back to Home + language switcher (always accessible) */}
   <div className="flex flex-wrap items-center justify-between gap-3">
    <button onClick={onGuest} className="min-h-[44px] px-4 rounded-full glass-dark font-bold text-sm inline-flex items-center gap-2 text-slate-100"><ArrowLeft size={17}/>{L.backHome||'Back to Home'}</button>
    <div className="flex flex-wrap items-center gap-2">
     <Globe2 size={19} className="text-slate-400"/>
     <nav aria-label="Choose language" className="flex flex-wrap gap-1.5 justify-end">
      {Object.entries(LANGS).map(([k,v])=><button key={k} onClick={()=>setLang(k)} aria-pressed={lang===k} className={`min-h-[44px] h-auto whitespace-normal px-3.5 py-2 rounded-full text-sm font-bold border ${lang===k?'text-white depth-btn':'text-slate-300'}`} style={lang===k?{background:'linear-gradient(145deg,#064E3B,#047857)',borderColor:'rgba(16,185,129,.5)'}:{background:'rgba(255,255,255,.06)',borderColor:'rgba(255,255,255,.16)'}}>{v.label}</button>)}
     </nav>
    </div>
   </div>

   <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8">
    {/* LEFT — showcase: Citizen Pass / Digital Shield */}
    <section className="flex flex-col gap-7 min-w-0">
     <div className="flex items-center gap-3">
      <span className="w-14 h-14 rounded-2xl glass-dark grid place-items-center shrink-0"><Landmark size={30} className="text-emerald-300"/></span>
      <div className="leading-tight min-w-0"><b className="text-3xl font-extrabold tracking-tight block">Sahaya<span className="text-emerald-400">AI</span></b><span className="inline-flex mt-1 rounded-full bg-amber-400/15 border border-amber-300/40 text-amber-200 px-3 py-1 text-sm font-bold break-words">{L.portal}</span></div>
     </div>
     <h1 className="font-extrabold tracking-tight leading-tight break-words" style={{fontSize:'clamp(1.85rem,3.6vw,2.9rem)'}}>{L.impact}</h1>

     {/* Floating Citizen Pass graphic with orbital rings */}
     <div className="relative w-full max-w-md mx-auto lg:mx-0 py-4" aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-blue-400/15"/>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[264px] h-[264px] rounded-full border border-emerald-400/15"/>
      <span className="absolute left-[12%] top-[16%] w-3 h-3 rounded-full" style={{background:'#F59E0B',boxShadow:'0 0 14px #F59E0B'}}/>
      <span className="absolute right-[10%] top-[30%] w-2.5 h-2.5 rounded-full" style={{background:'#10B981',boxShadow:'0 0 12px #10B981'}}/>
      <span className="absolute left-[20%] bottom-[10%] w-2.5 h-2.5 rounded-full" style={{background:'#3B82F6',boxShadow:'0 0 12px #3B82F6'}}/>
      <div className="relative glass-dark rounded-[1.6rem] p-6 depth">
       <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 font-extrabold tracking-wide text-slate-100"><Landmark size={19} className="text-blue-300"/>{L.passName||'Sahaya Citizen Pass'}</span>
        <Nfc size={22} className="text-slate-400 shrink-0"/>
       </div>
       <div className="flex items-center gap-5 mt-5">
        <svg width="86" height="98" viewBox="0 0 86 98" className="shrink-0" role="img" aria-label="Digital shield">
         <defs><linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3B82F6"/><stop offset="1" stopColor="#10B981"/></linearGradient></defs>
         <path d="M43 3 L78 15 V48 C78 71 63 86 43 95 C23 86 8 71 8 48 V15 Z" fill="rgba(59,130,246,.14)" stroke="url(#shieldGrad)" strokeWidth="3"/>
         <path d="M28 49 L39 60 L59 38" fill="none" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div className="min-w-0 flex-1">
         <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 border border-emerald-300/40 text-emerald-200 px-3 py-1 text-[.8rem] font-extrabold break-words"><BadgeCheck size={14}/>{L.passTag||'Digital Shield • Verified Citizen'}</span>
         <div className="mt-4 flex flex-col gap-2" aria-hidden="true">
          <span className="block h-3 rounded-full bg-white/25 w-3/4"/><span className="block h-3 rounded-full bg-white/15 w-1/2"/>
          <span className="flex gap-1.5 mt-1">{[0,1,2,3,4,5].map(i=><span key={i} className="w-6 h-4 rounded bg-white/15 border border-white/10"/>)}</span>
         </div>
        </div>
       </div>
       <div className="grid grid-cols-3 gap-2 mt-5 text-center">
        {[[Mic,'Voice AI'],[ShieldCheck,'Verified'],[RefreshCw,'Progress Sync']].map(([Icon,txt])=><span key={txt} className="rounded-xl bg-white/[.06] border border-white/10 px-2 py-2.5 text-[.78rem] font-bold text-slate-200 inline-flex flex-col items-center gap-1"><Icon size={16} className="text-amber-300"/>{txt}</span>)}
       </div>
      </div>
     </div>

     <div className="grid grid-cols-3 gap-3 max-w-lg">
      {[['500+',L.m1],['28 + 8',L.m2],['6',L.m3]].map(m=><div key={m[1]} className="glass-dark rounded-2xl p-4"><b className="block text-2xl sm:text-3xl font-extrabold text-amber-300 leading-tight">{m[0]}</b><span className="text-emerald-50/85 text-sm font-semibold leading-snug break-words block mt-1">{m[1]}</span></div>)}
     </div>
     <ul className="flex flex-col gap-3 max-w-lg">
      {[[Sprout,L.vp1],[ShieldCheck,L.vp2],[Globe2,L.vp3]].map(([Icon,text],i)=><li key={i} className="flex gap-3 items-start glass-dark rounded-2xl p-4"><Icon size={24} className="text-amber-300 shrink-0 mt-0.5"/><span className="text-lg leading-relaxed break-words text-emerald-50">{text}</span></li>)}
     </ul>
    </section>

    {/* RIGHT — frosted glass login card */}
    <section className="flex items-center justify-center min-w-0">
     <div className="w-full max-w-md glass-dark rounded-[1.75rem] p-6 sm:p-8">
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 border border-emerald-300/40 text-emerald-200 px-3 py-1.5 text-sm font-bold break-words"><ShieldCheck size={16}/>{L.portal}</span>
      <h2 className="font-extrabold tracking-tight text-[1.8rem] leading-snug break-words mt-4 text-white">{L.welcome}</h2>
      <p className="text-slate-300 leading-relaxed break-words mt-1">{L.sub}</p>
      {err&&<p role="alert" className="bg-red-500/15 border border-red-400/40 text-red-200 rounded-2xl p-3.5 font-semibold leading-relaxed break-words mt-4">{err}</p>}
      <form onSubmit={submit} className="flex flex-col gap-4 mt-6">
       <label className="flex flex-col gap-1.5"><span className="font-bold text-slate-200">{L.name}{isSignup?' *':''}</span><input required={isSignup} autoComplete="name" placeholder="e.g. Ramesh Patil" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} className={IN}/></label>
       <label className="flex flex-col gap-1.5"><span className="font-bold text-slate-200">{L.email} *</span><input required type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className={IN}/></label>
       <label className="flex flex-col gap-1.5"><span className="font-bold text-slate-200">{L.password} *</span>
        <span className="flex rounded-xl overflow-hidden glass-input focus-within:border-emerald-400"><input required minLength={6} type={showPw?'text':'password'} autoComplete={isSignup?'new-password':'current-password'} placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="flex-1 min-w-0 min-h-[52px] px-4 py-3 text-[1.05rem] outline-none bg-transparent text-slate-100" style={{border:'none',boxShadow:'none'}}/>
        <button type="button" onClick={()=>setShowPw(!showPw)} aria-label={showPw?L.hide:L.show} className="min-h-[52px] px-4 font-bold text-sm text-slate-300 bg-white/[.07] inline-flex items-center gap-1.5 shrink-0">{showPw?<EyeOff size={19}/>:<Eye size={19}/>}{showPw?L.hide:L.show}</button></span></label>
       <button disabled={busy} className="min-h-[52px] h-auto whitespace-normal break-words w-full rounded-xl text-white font-extrabold text-lg leading-snug px-5 py-3 depth-btn disabled:opacity-60 inline-flex justify-center items-center gap-2" style={{background:'linear-gradient(145deg,#065F46,#047857)'}}><LockKeyhole size={20}/>{busy?'Please wait…':(isSignup?L.create:L.signin)}</button>
      </form>
      <button onClick={()=>setIsSignup(!isSignup)} className="min-h-[48px] h-auto whitespace-normal w-full font-bold text-emerald-300 leading-snug mt-2 inline-flex justify-center items-center gap-1">{isSignup?L.have:L.newHere}<ChevronRight size={17}/></button>
      <div className="flex items-center gap-3 my-3" aria-hidden="true"><span className="flex-1 h-px bg-white/15"/><span className="text-sm font-bold text-slate-400">OR</span><span className="flex-1 h-px bg-white/15"/></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
       <button onClick={onGuest} className="min-h-[52px] h-auto whitespace-normal break-words rounded-xl border-2 font-extrabold leading-snug px-4 py-3 text-emerald-200 depth-sm" style={{borderColor:'rgba(16,185,129,.55)',background:'rgba(16,185,129,.08)'}}>{L.guest}</button>
       <button onClick={onDemoLogin} className="min-h-[52px] h-auto whitespace-normal break-words rounded-xl font-extrabold leading-snug px-4 py-3 text-amber-200 depth-sm" style={{background:'rgba(245,158,11,.12)',border:'2px solid rgba(245,158,11,.40)'}}>{L.demo}</button>
      </div>
      <p className="text-sm text-slate-400 font-semibold leading-relaxed break-words text-center mt-5">🔒 {L.safe}</p>
     </div>
    </section>
   </div>

   <p className="relative text-center text-sm text-slate-500 font-semibold pb-2">SahayaAI • A Citizen Welfare Discovery Initiative 🇮🇳</p>
  </div>
 </main>
}
