import {motion} from 'framer-motion'
import {Sprout,HeartHandshake,Home,Baby,Hammer,ShieldCheck,CheckCircle2,ExternalLink,Volume2,BookmarkPlus,HeartPulse,Sun} from 'lucide-react'
export const CAT_ICON={farming:Sprout,pension:HeartHandshake,housing:Sun,women:Baby,wages:Hammer,healthcare:HeartPulse}
const CAT_LABEL={farming:'Farming & Crops',pension:'Senior Citizen Pension',housing:'Housing & Solar',women:'Women & Child Welfare',wages:'Daily Wages',healthcare:'Healthcare'}
export default function SchemeCard({scheme,onCheck,onListen,onSave,t}){
 const Icon=CAT_ICON[scheme.cat]||ShieldCheck
 const color=scheme.match>=90?'#15803d':scheme.match>=85?'#B7791F':'#C2410C'
 const isCentral=scheme.origin==='Central Govt'
 return <motion.article layout initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:.96}} transition={{duration:.35}} className="bg-white rounded-3xl border-2 border-stone-200/80 p-5 flex flex-col gap-3 shadow-[0_10px_30px_rgba(27,46,32,.07)] hover:shadow-[0_20px_40px_rgba(27,46,32,.14)] hover:-translate-y-1 transition-all">
  <div className="flex items-start justify-between gap-2">
   <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-bold text-sm" style={{background:'#ECFDF5',color:'#14532D'}}><Icon size={18}/>{CAT_LABEL[scheme.cat]||scheme.cat}</span>
   <span className="rounded-full px-3 py-1.5 font-extrabold text-white text-sm shrink-0 shadow" style={{background:color}}>{scheme.match}% Match</span>
  </div>
  <span className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-extrabold border-2 ${isCentral?'bg-amber-50 text-amber-900 border-amber-300':'bg-emerald-50 text-emerald-900 border-emerald-300'}`}>{isCentral?'🇮🇳 Central Govt':'🏛️ '+scheme.origin}</span>
  <h3 className="font-extrabold text-[1.4rem] leading-snug text-[#292524]">{scheme.name}</h3>
  <p className="font-extrabold text-lg" style={{color:'#C05621'}}>{scheme.benefit}</p>
  <div className="h-3 bg-stone-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={scheme.match} aria-valuemin="0" aria-valuemax="100"><motion.div initial={{width:0}} animate={{width:scheme.match+'%'}} transition={{duration:.8}} className="h-full rounded-full" style={{background:color}}/></div>
  <ul className="space-y-1.5 text-[1.05rem] text-stone-700">{scheme.points.slice(0,3).map(p=><li key={p} className="flex gap-2"><CheckCircle2 size={20} className="text-emerald-700 shrink-0 mt-0.5"/>{p}</li>)}</ul>
  <div className="mt-auto pt-2 space-y-2">
   <a href={scheme.apply} target="_blank" rel="noreferrer" className="min-h-[56px] w-full rounded-2xl font-extrabold text-lg text-white px-3 inline-flex items-center justify-center gap-2 shadow active:scale-[.98] transition" style={{background:'#15803d'}}>{t.apply} <ExternalLink size={20}/></a>
   <div className="grid grid-cols-3 gap-2">
    <button onClick={()=>onListen(scheme)} className="min-h-[52px] rounded-2xl font-bold bg-amber-50 border-2 border-amber-200 px-2 inline-flex items-center justify-center gap-1.5"><Volume2 size={19}/>{t.listen}</button>
    <button onClick={()=>onCheck(scheme)} className="min-h-[52px] rounded-2xl font-bold bg-white border-2 border-emerald-700 text-emerald-900 px-2 inline-flex items-center justify-center gap-1.5"><ShieldCheck size={19}/>{t.check}</button>
    <button onClick={()=>onSave(scheme)} className="min-h-[52px] rounded-2xl font-bold bg-emerald-50 border-2 border-emerald-200 px-2 inline-flex items-center justify-center gap-1.5"><BookmarkPlus size={19}/>{t.save}</button>
   </div>
  </div>
 </motion.article>
}
