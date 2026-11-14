import {useEffect,useState} from 'react'
import {ShieldCheck,BarChart3,Users,LayoutGrid,Bot,FileWarning,Trash2,PlusCircle} from 'lucide-react'
const API=import.meta.env.VITE_API_BASE_URL||'https://sahayaai-backend.onrender.com'
export function TrackingPage({schemes}){
 const [list,setList]=useState(()=>{try{return JSON.parse(localStorage.getItem('sahaya_tracking')||'[]')}catch{return[]}})
 const [f,setF]=useState({scheme:'PM-KISAN Samman Nidhi',ref:'',date:new Date().toISOString().slice(0,10),status:'Submitted',pending:''})
 useEffect(()=>{localStorage.setItem('sahaya_tracking',JSON.stringify(list))},[list])
 const STEPS=['Submitted','Documents Pending','Under Review','Approved']
 function add(e){e.preventDefault(); if(!f.ref.trim())return alert('Please type the Application Reference Number exactly as on your official receipt. We never create one for you.'); setList([{...f,id:Date.now()},...list]); setF({...f,ref:'',pending:''}); log('Added application tracking (your update)')}
 function log(msg){try{const a=JSON.parse(localStorage.getItem('sahaya_activity')||'[]');a.unshift({msg,at:new Date().toLocaleString()});localStorage.setItem('sahaya_activity',JSON.stringify(a.slice(0,12)))}catch{}}
 return <section className="flex flex-col gap-6">
  <div className="bg-white dark-card rounded-[1.75rem] border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
   <h2 className="font-extrabold text-3xl tracking-tight">Application Tracking</h2>
   <p className="text-slate-500 leading-relaxed mt-1 flex gap-2"><FileWarning className="text-amber-600 shrink-0 mt-0.5"/> <span><b>Honest tracking:</b> SahayaAI has no official government status integration. This tracker shows <b>only updates you enter yourself</b> from official receipts/portals. We never invent a status or reference number.</span></p>
   <form onSubmit={add} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-5">
    <label className="flex flex-col gap-1 font-bold text-sm">Scheme<select value={f.scheme} onChange={e=>setF({...f,scheme:e.target.value})} className="min-h-[52px] rounded-xl border border-[#E2E8F0] px-3 bg-white">{schemes.map(s=><option key={s.name}>{s.name}</option>)}</select></label>
    <label className="flex flex-col gap-1 font-bold text-sm">Reference Number (from receipt) *<input required value={f.ref} onChange={e=>setF({...f,ref:e.target.value})} placeholder="e.g. as printed officially" className="min-h-[52px] rounded-xl border border-[#E2E8F0] px-3"/></label>
    <label className="flex flex-col gap-1 font-bold text-sm">Submission Date<input type="date" value={f.date} onChange={e=>setF({...f,date:e.target.value})} className="min-h-[52px] rounded-xl border border-[#E2E8F0] px-3"/></label>
    <label className="flex flex-col gap-1 font-bold text-sm">Status (you saw officially)<select value={f.status} onChange={e=>setF({...f,status:e.target.value})} className="min-h-[52px] rounded-xl border border-[#E2E8F0] px-3 bg-white">{[...STEPS,'Rejected'].map(s=><option key={s}>{s}</option>)}</select></label>
    <label className="flex flex-col gap-1 font-bold text-sm">Pending Documents<input value={f.pending} onChange={e=>setF({...f,pending:e.target.value})} placeholder="None / Land RTC…" className="min-h-[52px] rounded-xl border border-[#E2E8F0] px-3"/></label>
    <button className="min-h-[52px] px-5 rounded-xl text-white font-extrabold inline-flex gap-2 items-center justify-center lg:col-span-5" style={{background:'#064E3B'}}><PlusCircle size={19}/> Add My Application</button>
   </form>
  </div>
  {list.length===0?<div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500 font-semibold">No applications added yet. After applying on an official portal, add your receipt details here to track them yourself.</div>
  :<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{list.map(a=>{const idx=STEPS.indexOf(a.status);return <article key={a.id} className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 flex flex-col gap-3">
   <div className="flex flex-wrap justify-between gap-2"><b className="text-xl leading-snug break-words flex-1">{a.scheme}</b><span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-1.5 font-extrabold text-sm shrink-0 h-fit">{a.status}</span></div>
   <p className="text-slate-600 leading-relaxed break-words"><b>Ref:</b> {a.ref} • <b>Submitted:</b> {a.date}<br/><b>Pending documents:</b> {a.pending||'None reported by you'}</p>
   <ol className="flex flex-col gap-2.5 mt-1">{STEPS.map((s,i)=><li key={s} className="flex items-center gap-3"><span className={`w-8 h-8 rounded-full grid place-items-center font-extrabold text-sm shrink-0 ${i<=idx?'text-white':'bg-slate-100 text-slate-400'}`} style={i<=idx?{background:'#047857'}:{}}>{i<=idx?'✓':i+1}</span><span className={`font-semibold ${i<=idx?'text-slate-800':'text-slate-400'}`}>{s}</span>{i<STEPS.length-1&&''}</li>)}</ol>
   {a.status==='Rejected'&&<p className="text-red-700 font-bold bg-red-50 border border-red-200 rounded-2xl p-3">Status marked Rejected by you. Please check the official portal for the reason and re-apply if allowed.</p>}
   <button onClick={()=>setList(list.filter(x=>x.id!==a.id))} className="min-h-[44px] px-4 rounded-full bg-white border font-bold text-red-700 inline-flex gap-1.5 items-center w-fit"><Trash2 size={16}/>Remove</button>
  </article>})}</div>}
 </section>
}
export function AdminPage({token,catalog}){
 const [stats,setStats]=useState(null);const [err,setErr]=useState('');const [q,setQ]=useState('')
 useEffect(()=>{ if(!token){setErr('Please sign in with an administrator account.');return}
  fetch(API+'/api/admin/stats',{headers:{Authorization:'Bearer '+token}}).then(async r=>{const d=await r.json(); if(!r.ok)throw new Error(d.error||'Denied'); setStats(d)}).catch(e=>setErr(e.message)) },[token])
 const cats={}; catalog.forEach(s=>cats[s.cat||'general']=(cats[s.cat||'general']||0)+1)
 return <section className="flex flex-col gap-6">
  <div className="rounded-[1.75rem] p-6 sm:p-8 text-white" style={{background:'linear-gradient(135deg,#0B2447,#064E3B)'}}><h2 className="font-extrabold text-3xl tracking-tight inline-flex gap-2 items-center flex-wrap"><ShieldCheck/> Admin Dashboard</h2><p className="text-emerald-100/85 leading-relaxed mt-1">Secure area — protected by login + server-side ADMIN_EMAILS allowlist. User emails are never listed here for privacy.</p></div>
  {err&&<p role="alert" className="bg-amber-50 border border-amber-300 text-amber-900 rounded-3xl p-5 font-semibold leading-relaxed">🔒 {err}<br/><span className="text-sm">Portal owner: add the admin email to the <code>ADMIN_EMAILS</code> environment variable on the backend server (Render), then sign in again. No admin access is granted from the browser alone.</span></p>}
  {stats&&<>
   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[[Users,'Total Registered Users',stats.totalUsers],[LayoutGrid,'Schemes in Directory',stats.totalSchemes],[FileWarning,'Saved Items (all users)',stats.totalSavedItems],[Bot,'AI Assistant',stats.aiConfigured?'Gemini Connected':'Local Fallback']].map(([Icon,l,v])=><div key={l} className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-5"><Icon className="text-emerald-700" size={26}/><b className="block text-3xl font-extrabold mt-2 break-words">{v}</b><span className="text-slate-500 font-semibold text-sm leading-snug block">{l}</span></div>)}</div>
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6"><h3 className="font-extrabold text-xl inline-flex gap-2 items-center"><BarChart3 size={20}/> Analytics & Reports</h3><ul className="mt-3 flex flex-col gap-2 text-slate-600 leading-relaxed"><li>• Database: {stats.supabase?'Supabase Postgres (live)':'Demo memory mode'}</li><li>• Coverage in directory: {stats.statesCovered} states • {stats.languages} languages</li><li>• Report generated: {new Date(stats.generatedAt).toLocaleString()}</li><li>• Export: use Supabase dashboard for full CSV exports (admin only).</li></ul></div>
    <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6"><h3 className="font-extrabold text-xl">Category Management</h3><div className="flex flex-wrap gap-2 mt-3">{Object.entries(cats).map(([c,n])=><span key={c} className="rounded-full bg-slate-50 border px-3.5 py-2 font-bold text-sm">{c}: {n} schemes</span>)}</div><p className="text-sm text-slate-500 mt-3 leading-relaxed">Categories are managed in the version-controlled scheme directory (<code>client/src/data/schemes.js</code>) so every change is reviewed before publishing.</p></div>
   </div>
   <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6"><h3 className="font-extrabold text-xl">Scheme Management & Verification</h3>
    <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search schemes to verify…" className="min-h-[52px] w-full rounded-xl border border-[#E2E8F0] px-4 mt-3 outline-none focus:border-emerald-600"/>
    <div className="overflow-x-auto mt-3"><table className="w-full text-left min-w-[560px]"><thead><tr className="text-slate-400 text-sm border-b"><th className="py-2 pr-3">Scheme</th><th className="pr-3">Origin</th><th className="pr-3">Official Portal</th><th>Verification</th></tr></thead>
    <tbody>{catalog.filter(s=>s.name.toLowerCase().includes(q.toLowerCase())).slice(0,12).map(s=><tr key={s.name} className="border-b last:border-0"><td className="py-2.5 pr-3 font-semibold break-words">{s.name}</td><td className="pr-3">{s.origin}</td><td className="pr-3"><a className="text-emerald-800 font-bold break-all" href={s.apply} target="_blank" rel="noreferrer">{s.apply}</a></td><td><span className="rounded-full bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 text-xs font-bold whitespace-normal">Verify on official portal before publishing updates</span></td></tr>)}</tbody></table></div>
    <p className="text-sm text-slate-500 mt-3 leading-relaxed">User Management & Content Management are handled through the secure Supabase console by the portal owner; AI monitoring (model, usage, errors) through Google AI Studio / Render logs. This separation keeps citizen data out of the public web app.</p>
   </div>{token&&<CustomSchemeManager token={token}/>}</>}
 </section>
}

import {STATES_UTS,CATEGORIES12} from './data/states.js'
import {MapPin,Search,ExternalLink,BadgeCheck,Clock3} from 'lucide-react'
export function StatesPage({catalog,onOpenScheme,onSelectState}){
 const [q,setQ]=useState('');const [sel,setSel]=useState(null);const [catF,setCatF]=useState('All Categories');const [visible,setVisible]=useState(6)
 const filtered=STATES_UTS.filter(s=>s.name.toLowerCase().includes(q.toLowerCase())||s.districts.some(d=>d.toLowerCase().includes(q.toLowerCase())))
 const stateSchemes=sel?catalog.filter(s=>s.origin==='Central Govt'||s.homeState===sel.name):[]
 const shownSchemes=stateSchemes.filter(s=>catF==='All Categories'||(s.tags||[]).includes(catF))
 return <section className="flex flex-col gap-6">
  <div className="rounded-[1.75rem] p-6 sm:p-8 text-white shadow-lg" style={{background:'linear-gradient(120deg,#0B2447,#064E3B)'}}>
   <h2 className="font-extrabold text-3xl sm:text-4xl tracking-tight leading-snug break-words">All India Scheme Directory</h2>
   <p className="text-emerald-100/85 leading-relaxed mt-2 max-w-3xl break-words">28 States & 8 Union Territories. Central schemes are available across India. State schemes in this directory are listed only where we have source information — everything else is honestly marked <b>Verification Pending</b> and is being added through official sources (myscheme.gov.in, india.gov.in, state portals). No scheme, benefit or count is invented.</p>
   <div className="flex items-center gap-2 bg-white rounded-2xl px-4 mt-5 max-w-xl shadow"><Search className="text-slate-400 shrink-0"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by state or district… e.g. Mysuru, Pune, Patna" aria-label="Search state or district" className="flex-1 min-w-0 min-h-[52px] outline-none text-slate-900"/></div>
  </div>
  {/* Stylised India coverage visual (interactive grid, not a geographic map) */}
  <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-5">
   <div className="flex flex-wrap justify-between gap-2"><b className="text-lg">India Coverage — tap your State / UT</b><span className="text-sm font-bold text-slate-400">{filtered.length} of 36 regions</span></div>
   <div className="flex flex-wrap gap-1.5 mt-3" role="list" aria-label="States and Union Territories">{filtered.map(s=>{const n=catalog.filter(x=>x.homeState===s.name).length;return <button key={s.name} onClick={()=>{setSel(s);setVisible(6)}} className={`min-h-[44px] px-3 py-2 rounded-full border font-bold text-sm leading-snug ${sel?.name===s.name?'text-white shadow':'bg-slate-50 hover:border-emerald-600'}`} style={sel?.name===s.name?{background:'#064E3B',borderColor:'#064E3B'}:{borderColor:'#E2E8F0'}}>{s.name} <span className="opacity-60 font-extrabold">{n||''}</span></button>})}</div>
   {filtered.length===0&&<p className="font-bold text-slate-400 mt-3">No state/district matches that search.</p>}
  </div>
  {sel&&<div className="bg-white rounded-[1.75rem] border border-[#E2E8F0] shadow-sm p-6 sm:p-8 flex flex-col gap-5">
   <div className="flex flex-wrap justify-between gap-3">
    <div className="min-w-0"><p className="font-extrabold tracking-widest text-sm" style={{color:'#047857'}}>{sel.type.toUpperCase()} • CAPITAL: {sel.capital.toUpperCase()}</p><h3 className="font-extrabold text-3xl sm:text-4xl tracking-tight leading-snug break-words mt-1">{sel.name}</h3>
    <p className="text-slate-500 leading-relaxed break-words mt-1">Government portal: <a href={sel.portal} target="_blank" rel="noopener noreferrer" className="text-emerald-800 font-bold break-all inline-flex items-center gap-1">{sel.portal} <ExternalLink size={14}/></a> • Districts in directory: {sel.districts.join(', ')} <span className="text-slate-400">(major districts, expanding)</span></p></div>
    <button onClick={()=>onSelectState(sel)} className="min-h-[52px] h-fit px-5 py-3 rounded-xl text-white font-extrabold shadow shrink-0" style={{background:'#D97706'}}>Find Schemes for {sel.name}</button>
   </div>
   <div className="flex flex-wrap gap-2.5">{['All Categories',...CATEGORIES12].map(c=><button key={c} onClick={()=>setCatF(c)} className={`min-h-[44px] h-auto whitespace-normal px-4 py-2 rounded-full border font-bold text-sm leading-snug ${catF===c?'text-white shadow':'bg-white text-slate-500'}`} style={catF===c?{background:'#0B2447',borderColor:'#0B2447'}:{borderColor:'#E2E8F0'}}>{c}</button>)}</div>
   <div className="flex flex-wrap gap-2.5">
    <span className="rounded-2xl bg-slate-50 border border-[#E2E8F0] px-4 py-3 font-bold">{shownSchemes.length} schemes listed for {sel.name}</span>
    <span className="rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 font-bold inline-flex gap-1.5 items-center"><BadgeCheck size={17}/> {shownSchemes.filter(s=>s.status==='Active').length} marked Active</span>
    <span className="rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 font-bold inline-flex gap-1.5 items-center"><Clock3 size={17}/> {shownSchemes.filter(s=>s.status!=='Active').length} Verification Pending</span>
   </div>
   {shownSchemes.filter(s=>s.homeState===sel.name).length===0&&<p className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 font-semibold leading-relaxed break-words">State-specific schemes for {sel.name} are being verified from the official state portal and myscheme.gov.in. Until verification is complete we list only Central Government schemes below — we will not invent state scheme details. Administrators can add verified {sel.name} schemes from the Admin Dashboard.</p>}
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{shownSchemes.slice(0,visible).map(s=><article key={s.name} className="rounded-3xl border border-[#E2E8F0] shadow-sm hover:shadow-xl p-5 flex flex-col gap-2.5 bg-white min-w-0">
     <div className="flex flex-wrap gap-2"><span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-extrabold">{s.origin}</span><span className="rounded-md bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 text-xs font-extrabold">{s.status||'Verification Pending'}</span></div>
     <h4 className="font-extrabold text-[1.2rem] leading-snug break-words">{s.name}</h4><p className="font-extrabold break-words" style={{color:'#D97706'}}>{s.benefit||s.benefits||''}</p>
     <ul className="text-slate-600 leading-relaxed flex flex-col gap-1">{(s.points||[]).slice(0,3).map(p=><li key={p} className="break-words">• {p}</li>)}{s.description&&<li className="break-words">{s.description}</li>}</ul>
     <p className="text-sm text-slate-500 break-words"><b>Documents:</b> {(s.docs||[]).join(', ')||'As per official portal'}</p>
     <button onClick={()=>onOpenScheme(s)} className="mt-auto min-h-[52px] px-4 py-2.5 rounded-xl text-white font-extrabold w-full" style={{background:'#064E3B'}}>View Guide & Official Link</button>
    </article>)}</div>
   {visible<shownSchemes.length&&<button onClick={()=>setVisible(v=>v+6)} className="min-h-[52px] px-6 rounded-full border-2 font-extrabold self-center" style={{borderColor:'#0B2447',color:'#0B2447'}}>Load more schemes ({shownSchemes.length-visible} remaining)</button>}
  </div>}
 </section>
}

export function CustomSchemeManager({token}){
 const API2=API; const [list,setList]=useState([]);const [msg,setMsg]=useState('')
 const empty={name:'',level:'State',state:'Karnataka',department:'',category:'Social Welfare',description:'',eligibility:'Verification Pending',benefits:'',documents:'',official_url:'',source_url:'https://myscheme.gov.in',last_verified:'',status:'Verification Pending'}
 const [f,setF]=useState(empty);const [editId,setEditId]=useState(null)
 async function load(){try{const r=await fetch(API2+'/api/schemes/custom?limit=200');const d=await r.json();if(Array.isArray(d))setList(d)}catch{}}
 useEffect(()=>{load()},[])
 async function submit(e){e.preventDefault(); const body={...f,documents:String(f.documents).split(',').map(s=>s.trim()).filter(Boolean)};
  const r=await fetch(API2+'/api/admin/schemes'+(editId?'/'+editId:''),{method:editId?'PUT':'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify(body)}); const d=await r.json(); if(!r.ok)return setMsg('⚠️ '+(d.error||'Failed')); setMsg(editId?'Scheme updated ✓':'Scheme added to database ✓'); setF(empty);setEditId(null);load(); }
 async function del(id){ if(!confirm('Delete this scheme from the database?'))return; await fetch(API2+'/api/admin/schemes/'+id,{method:'DELETE',headers:{Authorization:'Bearer '+token}}); load(); }
 const IN='min-h-[48px] rounded-xl border border-[#E2E8F0] px-3.5 bg-white w-full outline-none focus:border-emerald-600'
 return <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6">
  <h3 className="font-extrabold text-xl">Scheme Database Manager (Add / Edit / Delete)</h3>
  <p className="text-sm text-slate-500 leading-relaxed mt-1">Saved directly to the Supabase <code>custom_schemes</code> table and shown across the portal immediately. Duplicates by name are hidden on the public site. Only add schemes you have checked on an official source — otherwise keep status <b>Verification Pending</b>.</p>
  {msg&&<p className="font-bold bg-slate-50 border rounded-2xl p-3 mt-3 break-words">{msg}</p>}
  <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
   <input required placeholder="Scheme name *" value={f.name} onChange={e=>setF({...f,name:e.target.value})} className={IN}/>
   <select value={f.level} onChange={e=>setF({...f,level:e.target.value})} className={IN}><option>Central</option><option>State</option><option>UT</option></select>
   <select value={f.state} onChange={e=>setF({...f,state:e.target.value})} className={IN}>{STATES_UTS.map(s=><option key={s.name}>{s.name}</option>)}</select>
   <input placeholder="Department" value={f.department} onChange={e=>setF({...f,department:e.target.value})} className={IN}/>
   <select value={f.category} onChange={e=>setF({...f,category:e.target.value})} className={IN}>{CATEGORIES12.map(c=><option key={c}>{c}</option>)}</select>
   <select value={f.status} onChange={e=>setF({...f,status:e.target.value})} className={IN}><option>Verification Pending</option><option>Active</option><option>Closed</option><option>Status Unknown</option></select>
   <input placeholder="Benefits (short)" value={f.benefits} onChange={e=>setF({...f,benefits:e.target.value})} className={IN}/>
   <input placeholder="Documents (comma separated)" value={f.documents} onChange={e=>setF({...f,documents:e.target.value})} className={IN}/>
   <input type="date" aria-label="Last verified date" value={f.last_verified} onChange={e=>setF({...f,last_verified:e.target.value})} className={IN}/>
   <input required placeholder="Official application URL (https://…gov.in) *" value={f.official_url} onChange={e=>setF({...f,official_url:e.target.value})} className={IN}/>
   <input placeholder="Source URL" value={f.source_url} onChange={e=>setF({...f,source_url:e.target.value})} className={IN}/>
   <input placeholder="Eligibility (or Verification Pending)" value={f.eligibility} onChange={e=>setF({...f,eligibility:e.target.value})} className={IN}/>
   <textarea placeholder="Description" value={f.description} onChange={e=>setF({...f,description:e.target.value})} className={IN+' sm:col-span-2 lg:col-span-3 min-h-[80px] py-3'} rows={2}/>
   <button className="min-h-[52px] rounded-xl text-white font-extrabold lg:col-span-3" style={{background:'#064E3B'}}>{editId?'Update Scheme':'Add Scheme to Database'}</button>
   {editId&&<button type="button" onClick={()=>{setEditId(null);setF(empty)}} className="min-h-[48px] rounded-xl border-2 font-extrabold lg:col-span-3">Cancel edit</button>}
  </form>
  <ul className="flex flex-col gap-2 mt-5">{list.map(s=><li key={s.id} className="flex flex-wrap items-center gap-2.5 bg-slate-50 border rounded-2xl p-3.5"><span className="flex-1 min-w-[180px]"><b className="break-words block leading-snug">{s.name}</b><small className="text-slate-400 font-semibold">{s.level} • {s.state} • {s.status}</small></span>
   <button onClick={()=>{setEditId(s.id);setF({...empty,...s,documents:(s.docs||[]).join(', '),official_url:s.apply||''})}} className="min-h-[44px] px-4 rounded-full bg-white border font-bold">Edit</button>
   <button onClick={()=>del(s.id)} className="min-h-[44px] px-4 rounded-full bg-white border font-bold text-red-700">Delete</button></li>)}
  {list.length===0&&<li className="text-slate-400 font-semibold">No admin-added schemes yet. Built-in directory schemes are managed in code; new verified schemes added here appear instantly.</li>}</ul>
 </div>
}
