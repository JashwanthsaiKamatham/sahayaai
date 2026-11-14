import {motion} from 'framer-motion'
import {Sprout,HeartHandshake,Home,Baby,Hammer,ShieldCheck,CheckCircle2,ExternalLink,Volume2,BookmarkPlus} from 'lucide-react'
export const CAT_ICON={farming:Sprout,pension:HeartHandshake,housing:Home,women:Baby,wages:Hammer}
const CAT_LABEL={farming:'Farming & Agriculture',pension:'Senior Citizen Pensions',housing:'Housing',women:'Women & Child Welfare',wages:'Daily Wages'}
export default function SchemeCard({scheme,onCheck,onListen,onSave,t}){
 const Icon=CAT_ICON[scheme.cat]||ShieldCheck
 const color=scheme.match>=90?'#087F5B':scheme.match>=85?'#B7791F':'#C2410C'
 return <motion.article layout initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:.96}} transition={{duration:.35}} className="bg-white rounded-3xl border border-stone-200 p-5 flex flex-col gap-3 shadow-[0_10px_30px_rgba(27,46,32,.07)] hover:shadow-[0_20px_40px_rgba(27,46,32,.13)] hover:-translate-y-1 transition-all">
  <div className="flex items-start justify-between gap-2">
   <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-bold text-sm" style={{background:'#EAF4EC',color:'#14532D'}}><Icon size={18}/>{CAT_LABEL[scheme.cat]}</span>
   <span className="rounded-full px-3 py-1.5 font-extrabold text-white text-sm shrink-0" style={{background:color}} aria-label={`Eligibility match ${scheme.match} percent`}>{scheme.match}% Match</span>
  </div>
  <h3 className="font-extrabold text-[1.35rem] leading-snug text-[#1B2E20]">{scheme.name}</h3>
  <p className="font-extrabold text-lg" style={{color:'#C05621'}}>{scheme.benefit}</p>
  <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={scheme.match} aria-valuemin="0" aria-valuemax="100"><motion.div initial={{width:0}} animate={{width:scheme.match+'%'}} transition={{duration:.8}} className="h-full rounded-full" style={{background:color}}/></div>
  <ul className="space-y-1.5 text-[1.05rem] text-slate-700">{scheme.points.map(p=><li key={p} className="flex gap-2"><CheckCircle2 size={20} className="text-emerald-700 shrink-0 mt-0.5"/>{p}</li>)}</ul>
  <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
   <button onClick={()=>onCheck(scheme)} className="min-h-[52px] rounded-2xl font-extrabold text-white px-3 inline-flex items-center justify-center gap-2 active:scale-[.97] transition" style={{background:'#14532D'}}><ShieldCheck size={20}/>{t.check}</button>
   <a href={scheme.apply} target="_blank" rel="noreferrer" className="min-h-[52px] rounded-2xl font-extrabold px-3 inline-flex items-center justify-center gap-2 border-2 active:scale-[.97] transition" style={{borderColor:'#C05621',color:'#9C4221'}}>{t.apply} <ExternalLink size={18}/></a>
   <button onClick={()=>onListen(scheme)} className="min-h-[52px] rounded-2xl font-bold bg-amber-50 border border-amber-200 px-3 inline-flex items-center justify-center gap-2"><Volume2 size={20}/>{t.listen}</button>
   <button onClick={()=>onSave(scheme)} className="min-h-[52px] rounded-2xl font-bold bg-emerald-50 border border-emerald-200 px-3 inline-flex items-center justify-center gap-2"><BookmarkPlus size={20}/>{t.save}</button>
  </div>
 </motion.article>
}
