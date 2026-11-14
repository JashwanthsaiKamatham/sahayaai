import {motion} from 'framer-motion'
import {Sprout,HeartHandshake,Baby,Hammer,ShieldCheck,CheckCircle2,ExternalLink,Volume2,BookmarkPlus,HeartPulse,Sun} from 'lucide-react'
export const CAT_ICON={farming:Sprout,pension:HeartHandshake,housing:Sun,women:Baby,wages:Hammer,healthcare:HeartPulse}
const CAT_LABEL={farming:'Farming & Crops',pension:'Senior Citizen Pension',housing:'Housing & Solar',women:'Women & Child Welfare',wages:'Daily Wages',healthcare:'Healthcare'}
export default function SchemeCard({scheme,onCheck,onListen,onSave,onApply,t}){
 const Icon=CAT_ICON[scheme.cat]||ShieldCheck
 const color=scheme.match>=90?'#15803d':scheme.match>=85?'#B7791F':'#C2410C'
 const isCentral=scheme.origin==='Central Govt'
 const R=22,CIRC=2*Math.PI*R
 return <motion.article layout initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:.96}} whileHover={{y:-6}} transition={{duration:.3}} className="bg-white rounded-3xl border-2 border-stone-200/80 p-6 flex flex-col justify-between gap-4 shadow-[0_10px_30px_rgba(27,46,32,.07)] hover:shadow-[0_22px_44px_rgba(27,46,32,.15)]">
  <div className="flex flex-col gap-4">
   {/* Top row — all in normal flow, wraps cleanly */}
   <div className="flex flex-wrap items-start justify-between gap-3">
    <span className="inline-flex items-center gap-2 rounded-full px-3 py-2 font-bold text-base leading-snug break-words" style={{background:'#ECFDF5',color:'#14532D'}}><Icon size={19} className="shrink-0"/>{CAT_LABEL[scheme.cat]||scheme.cat}</span>
    <span className="flex items-center gap-2 shrink-0">
     <svg width="52" height="52" viewBox="0 0 52 52" className="-rotate-90 shrink-0" aria-hidden="true"><circle cx="26" cy="26" r={R} fill="none" stroke="#E7E5E4" strokeWidth="6"/><motion.circle cx="26" cy="26" r={R} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={CIRC} initial={{strokeDashoffset:CIRC}} animate={{strokeDashoffset:CIRC-(CIRC*scheme.match/100)}} transition={{duration:1,delay:.15}}/></svg>
     <span className="font-extrabold leading-tight" style={{color}}>{scheme.match}%<span className="block text-sm text-stone-500 font-bold">Match</span></span>
    </span>
   </div>
   <span className={`inline-flex w-fit max-w-full rounded-full px-3 py-1.5 text-sm font-extrabold leading-snug break-words border-2 ${isCentral?'bg-amber-50 text-amber-900 border-amber-300':'bg-emerald-50 text-emerald-900 border-emerald-300'}`}>{isCentral?'🇮🇳 Central Govt':'🏛️ '+scheme.origin}</span>
   <h3 className="font-extrabold text-[1.45rem] leading-snug break-words text-[#292524]">{scheme.name}</h3>
   <p className="font-extrabold text-lg leading-relaxed break-words" style={{color:'#C05621'}}>{scheme.benefit}</p>
   <ul className="space-y-2 text-[1.05rem] leading-relaxed text-stone-700">{scheme.points.slice(0,3).map(p=><li key={p} className="flex gap-2 break-words"><CheckCircle2 size={21} className="text-emerald-700 shrink-0 mt-1"/>{p}</li>)}</ul>
  </div>
  {/* Bottom actions — wrap, never overlap */}
  <div className="flex flex-col gap-3">
   <button onClick={()=>onApply&&onApply(scheme,'guide')} className="min-h-[52px] h-auto whitespace-normal break-words w-full rounded-2xl font-extrabold text-lg leading-snug bg-white border-[3px] px-5 py-3 inline-flex items-center justify-center gap-2 active:scale-[.98] transition" style={{borderColor:'#064e3b',color:'#064e3b'}}>📋 {t.guideBtn||'View Step-by-Step Guide'}</button>
   <button onClick={()=>onApply&&onApply(scheme,'link')} className="min-h-[52px] h-auto whitespace-normal break-words w-full rounded-2xl font-extrabold text-lg leading-snug text-white px-5 py-3 inline-flex items-center justify-center gap-2 shadow-lg active:scale-[.98] transition" style={{background:'#15803d'}}>{t.visitBtn||'Visit Official Government Website & Guide'} <ExternalLink size={20} className="shrink-0"/></button>
   <div className="flex flex-wrap gap-3">
    <button onClick={()=>onListen(scheme)} className="flex-1 min-w-[130px] min-h-[52px] h-auto whitespace-normal break-words rounded-2xl font-bold leading-snug bg-amber-50 border-2 border-amber-200 px-5 py-3 inline-flex items-center justify-center gap-2"><Volume2 size={19} className="shrink-0"/>{t.listen}</button>
    <button onClick={()=>onCheck(scheme)} className="flex-1 min-w-[130px] min-h-[52px] h-auto whitespace-normal break-words rounded-2xl font-bold leading-snug bg-white border-2 border-emerald-700 text-emerald-900 px-5 py-3 inline-flex items-center justify-center gap-2"><ShieldCheck size={19} className="shrink-0"/>{t.check}</button>
    <button onClick={()=>onSave(scheme)} className="flex-1 min-w-[110px] min-h-[52px] h-auto whitespace-normal break-words rounded-2xl font-bold leading-snug bg-emerald-50 border-2 border-emerald-200 px-5 py-3 inline-flex items-center justify-center gap-2"><BookmarkPlus size={19} className="shrink-0"/>{t.save}</button>
   </div>
  </div>
 </motion.article>
}
