import {useState} from 'react'
import {Landmark,Eye,EyeOff,ShieldCheck,Sprout,HeartHandshake,Globe2,ChevronRight,LockKeyhole} from 'lucide-react'
import {LOGIN_T} from '../i18n-login.js'

export default function LoginPage({onEmailLogin,onGuest,onDemoLogin,lang,setLang,LANGS}){
 const L=LOGIN_T[lang]||LOGIN_T.en
 const [isSignup,setIsSignup]=useState(false);const [showPw,setShowPw]=useState(false);const [busy,setBusy]=useState(false);const [err,setErr]=useState('')
 const [form,setForm]=useState({full_name:'',email:'',password:''})
 async function submit(e){e.preventDefault();setBusy(true);setErr('');try{await onEmailLogin(form,isSignup)}catch(x){setErr(x.message)}finally{setBusy(false)}}
 return <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2" style={{background:'#F8FAFC'}}>
  {/* LEFT — brand & trust (desktop showcase, compact banner on mobile) */}
  <section className="text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between gap-10" style={{background:'linear-gradient(160deg,#064E3B 0%,#065F46 55%,#047857 100%)'}}>
   <div className="flex flex-col gap-8">
    <div className="flex items-center gap-3">
     <span className="w-14 h-14 rounded-2xl bg-white/10 border border-white/25 grid place-items-center shrink-0"><Landmark size={30}/></span>
     <div className="leading-tight"><b className="text-3xl font-extrabold tracking-tight block">SahayaAI</b><span className="inline-flex mt-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 px-3 py-1 text-sm font-bold break-words">{L.portal}</span></div>
    </div>
    <div><h1 className="font-extrabold tracking-tight leading-tight break-words" style={{fontSize:'clamp(1.9rem,4vw,3rem)'}}>{L.impact}</h1></div>
    <div className="grid grid-cols-3 gap-3 max-w-lg">
     {[['500+',L.m1],['28 + 8',L.m2],['6',L.m3]].map(m=><div key={m[1]} className="bg-white/[.08] border border-white/15 rounded-2xl p-4"><b className="block text-2xl sm:text-3xl font-extrabold text-amber-300 leading-tight">{m[0]}</b><span className="text-emerald-50/85 text-sm font-semibold leading-snug break-words block mt-1">{m[1]}</span></div>)}
    </div>
    <ul className="flex flex-col gap-3 max-w-lg">
     {[[Sprout,L.vp1],[ShieldCheck,L.vp2],[Globe2,L.vp3]].map(([Icon,text],i)=><li key={i} className="flex gap-3 items-start bg-white/[.06] border border-white/10 rounded-2xl p-4"><Icon size={24} className="text-amber-300 shrink-0 mt-0.5"/><span className="text-lg leading-relaxed break-words text-emerald-50">{text}</span></li>)}
    </ul>
   </div>
   <p className="text-emerald-100/70 font-semibold text-sm leading-relaxed break-words hidden lg:block">Digital Public Infrastructure for Citizen Welfare • Government of India scheme information, simplified.</p>
  </section>

  {/* RIGHT — clean login */}
  <section className="flex flex-col p-5 sm:p-8 lg:p-12">
   <div className="flex flex-wrap items-center justify-end gap-2">
    <Globe2 size={19} className="text-slate-500"/>
    <nav aria-label="Choose language" className="flex flex-wrap gap-1.5 justify-end">
     {Object.entries(LANGS).map(([k,v])=><button key={k} onClick={()=>setLang(k)} aria-pressed={lang===k} className={`min-h-[44px] h-auto whitespace-normal px-3.5 py-2 rounded-full text-sm font-bold border ${lang===k?'text-white shadow':'bg-white text-slate-600'}`} style={lang===k?{background:'#064E3B',borderColor:'#064E3B'}:{borderColor:'#E2E8F0'}}>{v.label}</button>)}
    </nav>
   </div>

   <div className="flex-1 flex items-center justify-center py-8">
    <div className="w-full max-w-md bg-white rounded-3xl border shadow-[0_20px_50px_rgba(6,78,59,.10)] p-6 sm:p-8" style={{borderColor:'#E2E8F0'}}>
     <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-1.5 text-sm font-bold"><ShieldCheck size={16}/>{L.portal}</span>
     <h2 className="font-extrabold tracking-tight text-[1.8rem] leading-snug break-words mt-4 text-slate-900">{L.welcome}</h2>
     <p className="text-slate-500 leading-relaxed break-words mt-1">{L.sub}</p>
     {err&&<p role="alert" className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-3.5 font-semibold leading-relaxed break-words mt-4">{err}</p>}
     <form onSubmit={submit} className="flex flex-col gap-4 mt-6">
      <label className="flex flex-col gap-1.5"><span className="font-bold text-slate-700">{L.name}{isSignup?' *':''}</span><input required={isSignup} autoComplete="name" placeholder="e.g. Ramesh Patil" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} className="min-h-[52px] h-auto w-full rounded-xl border px-4 py-3 text-[1.05rem] bg-white focus:border-emerald-600 outline-none" style={{borderColor:'#E2E8F0'}}/></label>
      <label className="flex flex-col gap-1.5"><span className="font-bold text-slate-700">{L.email} *</span><input required type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="min-h-[52px] h-auto w-full rounded-xl border px-4 py-3 text-[1.05rem] bg-white focus:border-emerald-600 outline-none" style={{borderColor:'#E2E8F0'}}/></label>
      <label className="flex flex-col gap-1.5"><span className="font-bold text-slate-700">{L.password} *</span>
       <span className="flex rounded-xl border overflow-hidden focus-within:border-emerald-600" style={{borderColor:'#E2E8F0'}}><input required minLength={6} type={showPw?'text':'password'} autoComplete={isSignup?'new-password':'current-password'} placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="flex-1 min-w-0 min-h-[52px] px-4 py-3 text-[1.05rem] outline-none"/>
       <button type="button" onClick={()=>setShowPw(!showPw)} aria-label={showPw?L.hide:L.show} className="min-h-[52px] px-4 font-bold text-sm text-slate-500 bg-slate-50 inline-flex items-center gap-1.5 shrink-0">{showPw?<EyeOff size={19}/>:<Eye size={19}/>}{showPw?L.hide:L.show}</button></span></label>
      <button disabled={busy} className="min-h-[52px] h-auto whitespace-normal break-words w-full rounded-xl text-white font-extrabold text-lg leading-snug px-5 py-3 depth-btn disabled:opacity-60 inline-flex justify-center items-center gap-2" style={{background:'#064E3B'}}><LockKeyhole size={20}/>{busy?'Please wait…':(isSignup?L.create:L.signin)}</button>
     </form>
     <button onClick={()=>setIsSignup(!isSignup)} className="min-h-[48px] h-auto whitespace-normal w-full font-bold text-emerald-800 leading-snug mt-2 inline-flex justify-center items-center gap-1">{isSignup?L.have:L.newHere}<ChevronRight size={17}/></button>
     <div className="flex items-center gap-3 my-3" aria-hidden><span className="flex-1 h-px bg-slate-200"/><span className="text-sm font-bold text-slate-400">OR</span><span className="flex-1 h-px bg-slate-200"/></div>
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      <button onClick={onGuest} className="min-h-[52px] h-auto whitespace-normal break-words rounded-xl border-2 font-extrabold leading-snug px-4 py-3" style={{borderColor:'#064E3B',color:'#064E3B'}}>{L.guest}</button>
      <button onClick={onDemoLogin} className="min-h-[52px] h-auto whitespace-normal break-words rounded-xl font-extrabold leading-snug px-4 py-3 text-amber-900" style={{background:'#FEF3C7',border:'2px solid #FDE68A'}}>{L.demo}</button>
     </div>
     <p className="text-sm text-slate-400 font-semibold leading-relaxed break-words text-center mt-5">🔒 {L.safe}</p>
    </div>
   </div>
   <p className="text-center text-sm text-slate-400 font-semibold">SahayaAI • A Citizen Welfare Discovery Initiative 🇮🇳</p>
  </section>
 </main>
}
