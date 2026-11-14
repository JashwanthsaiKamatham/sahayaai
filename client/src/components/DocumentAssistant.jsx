import {useRef,useState} from 'react'
import {UploadCloud,FileCheck2,Trash2,ShieldCheck,Loader2,CheckCircle2} from 'lucide-react'
const COMMON=['Aadhaar Card','Bank Passbook','Ration Card','Land Records (RTC / Pahani)','Income Certificate','Passport Photo','Mobile linked to Aadhaar']
export default function DocumentAssistant({schemes,onGuide}){
 const [files,setFiles]=useState([]);const [have,setHave]=useState([]);const [schemeName,setSchemeName]=useState('');const [drag,setDrag]=useState(false);const input=useRef()
 const selected=schemes.find(s=>s.name===schemeName)
 const required=selected?selected.docs:COMMON
 const missing=required.filter(d=>!have.some(h=>d.toLowerCase().includes(h.split(' ')[0].toLowerCase())||h.toLowerCase().includes(d.split(' ')[0].toLowerCase())))
 function add(list){
  const ok=[...list].filter(f=>/pdf|jpe?g|png/i.test(f.type)||/\.(pdf|jpe?g|png)$/i.test(f.name)).slice(0,6)
  ok.forEach(f=>{ const id=Date.now()+Math.random(); setFiles(p=>[...p,{id,name:f.name,size:(f.size/1024).toFixed(0)+' KB',type:f.type||'file',progress:0}]);
   const iv=setInterval(()=>{ setFiles(p=>p.map(x=>x.id===id?{...x,progress:Math.min(100,x.progress+25)}:x)); },220);
   setTimeout(()=>clearInterval(iv),1100); })
 }
 return <section className="bg-white rounded-[1.75rem] border border-[#E2E8F0] shadow-sm p-6 sm:p-8 flex flex-col gap-5">
  <div><h2 className="font-extrabold text-3xl tracking-tight leading-snug">Smart Document Assistant</h2>
  <p className="text-slate-500 leading-relaxed mt-1">Prepare your documents before visiting Grama One / CSC. Tick what you already have — we show exactly what is missing for your scheme.</p></div>
  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-3"><ShieldCheck className="text-emerald-700 shrink-0 mt-0.5" size={24}/><p className="leading-relaxed text-emerald-900"><b>Privacy first:</b> files you pick are listed only in your browser on this device. They are <b>never uploaded to our server and never shown publicly</b>. Automated OCR text extraction needs a separate secure OCR service integration — until then, verify document names yourself using the checklist below. Delete entries anytime.</p></div>
  <label className="flex flex-col gap-1.5 font-bold text-slate-700">Choose your scheme (optional)<select value={schemeName} onChange={e=>setSchemeName(e.target.value)} className="min-h-[52px] rounded-xl border border-[#E2E8F0] px-4 py-3 bg-white outline-none focus:border-emerald-600"><option value="">General document checklist (all schemes)</option>{schemes.map(s=><option key={s.id}>{s.name}</option>)}</select></label>
  <div onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);add(e.dataTransfer.files)}} className={`rounded-3xl border-2 border-dashed p-6 sm:p-8 text-center transition ${drag?'border-emerald-600 bg-emerald-50':'border-slate-300 bg-slate-50'}`}>
   <UploadCloud size={42} className="mx-auto text-emerald-700"/><p className="font-extrabold text-xl mt-2">Drop PDF, JPG or PNG files here</p><p className="text-slate-500">or</p>
   <button onClick={()=>input.current?.click()} className="min-h-[52px] px-6 py-3 rounded-xl text-white font-extrabold shadow mt-1" style={{background:'#064E3B'}}>Choose Files from Phone</button>
   <input ref={input} type="file" accept=".pdf,.jpg,.jpeg,.png" multiple hidden onChange={e=>{add(e.target.files);e.target.value=''}}/>
  </div>
  {files.length>0&&<ul className="flex flex-col gap-2.5">{files.map(f=><li key={f.id} className="flex flex-wrap items-center gap-3 bg-slate-50 border border-[#E2E8F0] rounded-2xl p-3.5">
   {f.progress<100?<Loader2 className="animate-spin text-emerald-700 shrink-0"/>:<FileCheck2 className="text-emerald-700 shrink-0"/>}
   <span className="flex-1 min-w-[160px]"><b className="break-all leading-snug block">{f.name}</b><small className="text-slate-400 font-semibold">{f.size} • {f.progress<100?'Checking file on this device…':'Ready on this device (not uploaded)'}</small><span className="block h-2 bg-slate-200 rounded-full mt-1.5 overflow-hidden"><span className="block h-full bg-emerald-600 rounded-full transition-all" style={{width:f.progress+'%'}}/></span></span>
   <button onClick={()=>setFiles(files.filter(x=>x.id!==f.id))} aria-label={'Delete '+f.name} className="min-h-[44px] px-3.5 rounded-full bg-white border font-bold text-red-700 inline-flex gap-1 items-center"><Trash2 size={16}/>Delete</button></li>)}</ul>}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
   <div className="rounded-3xl border border-[#E2E8F0] p-5"><h3 className="font-extrabold text-xl">✅ Documents I already have</h3><div className="flex flex-col gap-2 mt-3">{COMMON.map(d=><label key={d} className="flex items-center gap-3 bg-slate-50 border rounded-2xl px-4 py-3 font-semibold cursor-pointer min-h-[52px]"><input type="checkbox" checked={have.includes(d)} onChange={e=>setHave(e.target.checked?[...have,d]:have.filter(x=>x!==d))} className="w-5 h-5 accent-emerald-700 shrink-0"/><span className="break-words leading-snug">{d}</span></label>)}</div></div>
   <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-5"><h3 className="font-extrabold text-xl">🧾 {selected?'Missing for '+selected.name:'Usually required documents'}</h3>
    {missing.length===0?<p className="flex gap-2 font-bold text-emerald-800 mt-3 leading-relaxed"><CheckCircle2 className="shrink-0"/> Wonderful! You have ticked all documents in this checklist. Carry originals + 2 photocopies.</p>
    :<ul className="flex flex-col gap-2 mt-3">{missing.map(d=><li key={d} className="bg-white border border-amber-200 rounded-2xl px-4 py-3 font-semibold break-words leading-snug">⚠️ {d}</li>)}</ul>}
    {selected&&<button onClick={()=>onGuide(selected,'guide')} className="min-h-[52px] px-5 py-3 rounded-xl text-white font-extrabold mt-4 w-full" style={{background:'#064E3B'}}>Open {selected.name} Guide</button>}
   </div>
  </div>
 </section>
}
