import {MapPin,SearchX,Sprout} from 'lucide-react'
import SchemeCard from './SchemeCard.jsx'
import {CATEGORIES,STATE_DISTRICTS} from '../data/schemes.js'
import {CAT_ICON} from './SchemeCard.jsx'
import {LayoutGrid} from 'lucide-react'
const ICONS={...CAT_ICON,LayoutGrid}
export default function SchemeFinder({state,setState,district,setDistrict,cat,setCat,schemes,allSchemes=[],onCheck,onListen,onSave,onApply,t}){
 const counts={}; allSchemes.forEach(s=>counts[s.cat]=(counts[s.cat]||0)+1); const allCount=allSchemes.length
 return <section id="finder" aria-labelledby="finder-title" className="w-full min-w-0">
  <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-[#E2E8F0] shadow-[0_24px_60px_rgba(6,78,59,.12)] p-6 sm:p-8">
   <h2 id="finder-title" className="font-extrabold text-[2rem] sm:text-4xl leading-snug break-words text-[#1B2E20]">{t.finderTitle}</h2>
   <p className="text-lg text-slate-600 mt-1">{t.finderSub}</p>
   <div className="grid md:grid-cols-2 gap-3 mt-6">
    <label className="block"><span className="font-extrabold text-lg flex gap-2 items-center"><span className="w-8 h-8 rounded-full text-white grid place-items-center" style={{background:'#14532D'}}>1</span>{t.step1}</span>
     <span className="block mt-2"><select value={state} onChange={e=>{setState(e.target.value);setDistrict('')}} aria-label={t.step1} className="w-full min-h-[52px] h-auto whitespace-normal rounded-2xl border-2 border-stone-300 px-5 py-3 text-lg font-bold leading-relaxed bg-white focus:border-emerald-700"><option value="">{t.chooseState}</option>{Object.keys(STATE_DISTRICTS).map(s=><option key={s}>{s}</option>)}</select></span></label>
    <label className="block"><span className="font-extrabold text-lg flex gap-2 items-center"><span className="w-8 h-8 rounded-full text-white grid place-items-center" style={{background:'#C05621'}}>2</span>{t.step2}</span>
     <span className="block mt-2"><select value={district} disabled={!state} onChange={e=>setDistrict(e.target.value)} aria-label={t.step2} className="w-full min-h-[52px] h-auto whitespace-normal rounded-2xl border-2 border-stone-300 px-5 py-3 text-lg font-bold leading-relaxed bg-white disabled:bg-stone-100 disabled:text-slate-400 focus:border-emerald-700"><option value="">{state?t.chooseDistrict:t.firstState}</option>{(STATE_DISTRICTS[state]||[]).map(d=><option key={d}>{d}</option>)}</select></span></label>
   </div>
   <div className="mt-6"><p className="font-extrabold text-lg flex gap-2 items-center"><span className="w-8 h-8 rounded-full grid place-items-center text-white" style={{background:'#744210'}}>3</span>{t.step3}</p>
    <div className="flex flex-wrap gap-2.5 mt-3" role="tablist" aria-label="Scheme categories">{CATEGORIES.map(c=>{const I=ICONS[c.icon]||Sprout;const active=cat===c.id;const n=c.id==='all'?allCount:(counts[c.id]||0);return <button key={c.id} role="tab" aria-selected={active} onClick={()=>setCat(c.id)} className={`min-h-[52px] h-auto whitespace-normal break-words rounded-full px-5 py-3 font-bold leading-snug inline-flex items-center gap-2 border ${active?'text-white shadow-lg':'bg-white text-slate-600 hover:border-emerald-700 hover:text-emerald-900'}`} style={active?{background:'#064E3B',borderColor:'#064E3B'}:{borderColor:'#E2E8F0'}}><I size={19} className="shrink-0"/>{c.label}<span className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${active?'bg-white/20 text-white':'bg-slate-100 text-slate-500'}`}>{n}</span></button>})}</div></div></div>
  {!state||!district ? (
   <div className="text-center py-14 px-4" role="status">
    <div className="mx-auto w-28 h-28 rounded-full grid place-items-center" style={{background:'#FFF3E2'}}><MapPin size={52} color="#C05621"/></div>
    <h3 className="font-extrabold text-2xl mt-4 text-[#1B2E20]">{t.emptyTitle}</h3><p className="text-lg text-slate-600 max-w-md mx-auto mt-1">{t.emptyText}</p>
    <div className="flex justify-center gap-2 mt-4 text-4xl" aria-hidden>🌾 👵🏽 🏠 👩🏽‍🌾</div>
   </div>) : schemes.length===0 ? (
   <div className="text-center py-14"><SearchX size={48} className="mx-auto text-stone-400"/><h3 className="font-extrabold text-2xl mt-3">{t.noCat}</h3><p className="text-lg text-slate-600">{t.noCatSub}</p></div>) : (
   <><p className="font-bold text-lg mt-7 mb-3" role="status">📍 {district}, {state} — {schemes.length} {t.schemesForYou}</p>
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{schemes.map(s=><SchemeCard key={s.id} scheme={s} onCheck={onCheck} onListen={onListen} onSave={onSave} onApply={onApply} t={t}/>)}</div></>)}
 </section>
}
