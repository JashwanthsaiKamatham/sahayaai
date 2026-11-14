import {useState} from 'react'
import {ClipboardCheck,AlertTriangle,CheckCircle2,XCircle,FileText,ArrowRight} from 'lucide-react'
import {STATE_DISTRICTS} from '../data/schemes.js'
import {evaluateProfile} from '../lib/eligibility.js'
const F='w-full min-h-[52px] h-auto rounded-xl border border-[#E2E8F0] px-4 py-3 text-[1.02rem] bg-white outline-none focus:border-emerald-600'
export default function EligibilityChecker({onSave,onGuide,initial={}}){
 const [form,setForm]=useState({age:45,state:'Karnataka',district:'Dharwad',occupation:'Small Farmer',income:150000,education:'Primary (1-5)',family:'Married with children',gender:'Female',...initial})
 const [results,setResults]=useState(null);const [err,setErr]=useState('')
 function run(e){e.preventDefault(); if(!form.age||Number(form.age)<1||Number(form.age)>120)return setErr('Please enter a correct age (1–120).'); if(!form.state||!form.district)return setErr('Please choose your State and District.'); if(Number(form.income)<0)return setErr('Income cannot be negative.'); setErr(''); const r=evaluateProfile(form); setResults(r); localStorage.setItem('sahaya_eligibility',JSON.stringify({form,at:new Date().toISOString(),top:r.slice(0,3).map(x=>x.name)})); }
 const set=(k,v)=>setForm(f=>({...f,[k]:v}))
 return <section className="flex flex-col gap-6">
  <form onSubmit={run} className="bg-white rounded-[1.75rem] border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
   <h2 className="font-extrabold text-3xl tracking-tight leading-snug inline-flex flex-wrap gap-2 items-center"><ClipboardCheck className="text-emerald-700"/> Eligibility Checker</h2>
   <p className="text-slate-500 leading-relaxed mt-1">Answer 7 simple questions. We match you against our verified scheme directory and explain every result.</p>
   {err&&<p role="alert" className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-3.5 font-semibold mt-4">{err}</p>}
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
    <label className="flex flex-col gap-1.5 font-bold text-slate-700">Your Age<input type="number" min="1" max="120" value={form.age} onChange={e=>set('age',e.target.value)} className={F}/></label>
    <label className="flex flex-col gap-1.5 font-bold text-slate-700">State<select value={form.state} onChange={e=>{set('state',e.target.value);set('district','')}} className={F}>{Object.keys(STATE_DISTRICTS).map(s=><option key={s}>{s}</option>)}</select></label>
    <label className="flex flex-col gap-1.5 font-bold text-slate-700">District<select value={form.district} onChange={e=>set('district',e.target.value)} className={F}><option value="">— Select —</option>{(STATE_DISTRICTS[form.state]||[]).map(d=><option key={d}>{d}</option>)}</select></label>
    <label className="flex flex-col gap-1.5 font-bold text-slate-700">Occupation<select value={form.occupation} onChange={e=>set('occupation',e.target.value)} className={F}><option>Small Farmer</option><option>Artisan</option><option>Daily Wage Worker</option><option>Woman</option><option>Student</option><option>Senior Citizen</option></select></label>
    <label className="flex flex-col gap-1.5 font-bold text-slate-700">Annual Family Income (₹)<input type="number" min="0" step="5000" value={form.income} onChange={e=>set('income',e.target.value)} className={F}/></label>
    <label className="flex flex-col gap-1.5 font-bold text-slate-700">Education Level<select value={form.education} onChange={e=>set('education',e.target.value)} className={F}><option>No formal education</option><option>Primary (1-5)</option><option>Secondary (6-10)</option><option>Higher Secondary (11-12)</option><option>Graduate & above</option></select></label>
    <label className="flex flex-col gap-1.5 font-bold text-slate-700">Gender (only where relevant)<select value={form.gender} onChange={e=>set('gender',e.target.value)} className={F}><option>Female</option><option>Male</option><option>Other / Prefer not to say</option></select></label>
    <label className="flex flex-col gap-1.5 font-bold text-slate-700">Family Status<select value={form.family} onChange={e=>set('family',e.target.value)} className={F}><option>Single</option><option>Married with children</option><option>Married, no children</option><option>Widow / Widower</option><option>Senior living with family</option></select></label>
   </div>
   <button className="min-h-[52px] h-auto whitespace-normal px-6 py-3 rounded-xl text-white font-extrabold text-lg shadow-lg mt-6 inline-flex gap-2 items-center" style={{background:'#064E3B'}}>Check My Eligibility <ArrowRight size={19}/></button>
   <p className="flex gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-2xl p-3.5 font-semibold leading-relaxed mt-5"><AlertTriangle size={18} className="shrink-0 mt-0.5"/> Important: This is AI-assisted guidance from public scheme information — NOT official government approval. Final decision is only by the Government department on the official portal.</p>
  </form>
  {results&&<div className="flex flex-col gap-4"><h3 className="font-extrabold text-2xl">Your Results — {results.filter(r=>r.score>=75).length} likely matches</h3>
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{results.slice(0,6).map((r,i)=><article key={r.id} className="depth-card p-6 flex flex-col gap-3">
    <div className="flex flex-wrap justify-between gap-2"><b className="text-xl leading-snug break-words flex-1">{r.name}</b><span className="rounded-full px-3 py-1.5 font-extrabold text-white text-sm shrink-0" style={{background:r.score>=75?'#047857':r.score>=50?'#D97706':'#64748B'}}>{r.status} • {r.score}%</span></div>
    <p className="font-extrabold" style={{color:'#D97706'}}>{r.benefit}</p>
    <div><b className="inline-flex gap-1.5 items-center"><CheckCircle2 size={17} className="text-emerald-600"/> Why you may qualify</b><ul className="mt-1.5 flex flex-col gap-1 text-slate-600 leading-relaxed">{r.reasons.map(x=><li key={x} className="break-words">• {x}</li>)}</ul></div>
    <div><b className="inline-flex gap-1.5 items-center"><XCircle size={17} className="text-amber-600"/> Missing / to confirm</b><ul className="mt-1.5 flex flex-col gap-1 text-slate-600 leading-relaxed">{r.missing.map(x=><li key={x} className="break-words">• {x}</li>)}</ul></div>
    <p className="text-slate-600 leading-relaxed break-words"><b className="inline-flex gap-1.5 items-center text-slate-800"><FileText size={16}/> Documents:</b> {r.docs.join(', ')}</p>
    <p className="text-slate-600 leading-relaxed"><b>Next step:</b> Keep documents ready → open the Step-by-Step Guide → apply FREE on the official portal or at Grama One/CSC.</p>
    <div className="flex flex-wrap gap-2.5 mt-auto"><button onClick={()=>onGuide(r,'guide')} className="flex-1 min-w-[150px] min-h-[52px] h-auto whitespace-normal px-4 py-2.5 rounded-xl border-2 font-extrabold leading-snug" style={{borderColor:'#064E3B',color:'#064E3B'}}>Step-by-Step Guide</button><button onClick={()=>onSave(r)} className="flex-1 min-w-[120px] min-h-[52px] h-auto whitespace-normal px-4 py-2.5 rounded-xl text-white font-extrabold leading-snug" style={{background:'#064E3B'}}>Save Scheme</button></div>
   </article>)}</div></div>}
 </section>
}
