import {useState} from 'react'
import {motion} from 'framer-motion'
import {X,BadgeCheck,Volume2,ExternalLink,ShieldAlert,FileText,MousePointerClick,ClipboardCheck,Banknote} from 'lucide-react'

export default function GuideModal({scheme,initialTab='guide',state,district,onClose,t,langSpeech}){
 const [tab,setTab]=useState(initialTab)
 if(!scheme) return null
 const isCentral=scheme.origin==='Central Govt'
 let host=scheme.apply; try{host=new URL(scheme.apply).hostname}catch{}
 const steps=[
  {icon:FileText,title:t.stepDocsTitle||'Keep these documents ready',body:(scheme.docs&&scheme.docs.length?scheme.docs.join(', '):'Aadhaar Card, Bank Passbook, Ration Card')+' — originals + 2 photocopies. Keep your mobile phone with you for OTP.'},
  {icon:MousePointerClick,title:t.stepOpenTitle||'Open the official website',body:`${t.stepOpenBody||'Go to Tab 2 (Direct Official Link) below and tap the green button. The official website'} ${host} ${t.stepOpenBody2||'will open in a new tab. This SahayaAI guide will stay open here.'}`},
  {icon:MousePointerClick,title:t.stepFindTitle||'Find your scheme on that website',body:`${t.stepFindBody||'On the government website, look for words like'} “${scheme.name}”, “New Registration / Apply Online”, “Beneficiary” ${t.stepFindBody2||'or'} “Status”. ${t.stepFindBody3||'Tap that button. If the page is in English, ask a family member or CSC staff to help — or come back and tap Read Aloud again.'}`},
  {icon:ClipboardCheck,title:t.stepFillTitle||'Fill the form carefully',body:t.stepFillBody||'Type your Aadhaar number, mobile number, bank account and land details slowly. Check every number twice before submitting. Never share bank OTP or password with anyone.'},
  {icon:Banknote,title:t.stepSubmitTitle||'Submit FREE & save the receipt',body:t.stepSubmitBody||'Tap Submit on the government website. Registration is ₹0 — never pay an agent. Note down / photograph the acknowledgement or registration number. Money comes directly to your bank account.'},
 ]
 const speakText=`${scheme.name}. ${scheme.benefit}. `+steps.map((s,i)=>`${i+1}. ${s.title}. ${s.body}`).join(' ')
 function speak(){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(speakText);u.lang=langSpeech||'en-IN';u.rate=.9;speechSynthesis.speak(u)}catch{}}
 return <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/55 flex items-end sm:items-center justify-center p-3" role="dialog" aria-modal="true" aria-label={scheme.name}>
  <motion.div initial={{y:60,opacity:0}} animate={{y:0,opacity:1}} exit={{y:60,opacity:0}} transition={{type:'spring',stiffness:160,damping:22}} className="bg-[#faf8f5] rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
   {/* Header — all in flow */}
   <div className="bg-[#064e3b] text-white p-6 sm:p-8 rounded-t-[2rem]">
    <div className="flex flex-wrap items-start justify-between gap-3">
     <div className="flex flex-col gap-2 min-w-0 flex-1">
      <span className="inline-flex flex-wrap items-center gap-2 font-extrabold leading-snug break-words"><BadgeCheck size={24} className="text-amber-300 shrink-0"/>{t.officialVerified||'Official Government Scheme'}</span>
      <h3 className="font-extrabold text-2xl sm:text-3xl leading-snug break-words">{scheme.name}</h3>
      <div className="flex flex-wrap gap-2">
       <span className={`rounded-full px-3 py-1.5 text-sm font-extrabold leading-snug break-words border-2 ${isCentral?'bg-amber-300 text-emerald-950 border-amber-200':'bg-white/15 text-white border-white/35'}`}>{isCentral?'🇮🇳 Central Govt':'🏛️ '+scheme.origin}</span>
       <span className="rounded-full px-3 py-1.5 text-sm font-extrabold leading-snug bg-white text-emerald-900">{scheme.match}% Match • {scheme.benefit}</span>
      </div>
     </div>
     <button onClick={onClose} aria-label="Close guide" className="min-w-[52px] min-h-[52px] h-auto px-3 py-3 grid place-items-center rounded-full bg-white/15 border border-white/30 shrink-0"><X size={24}/></button>
    </div>
   </div>

   <div className="p-6 sm:p-8 flex flex-col gap-5">
    {/* Tabs */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="tablist" aria-label="Guide sections">
     <button role="tab" aria-selected={tab==='guide'} onClick={()=>setTab('guide')} className={`min-h-[52px] h-auto whitespace-normal break-words px-5 py-3 rounded-2xl font-extrabold text-lg leading-snug border-2 transition active:scale-[.98] ${tab==='guide'?'text-white shadow-lg':'bg-white text-emerald-900'}`} style={tab==='guide'?{background:'#064e3b',borderColor:'#064e3b'}:{borderColor:'#064e3b'}}>{t.tabGuide||'📋 What to do on the Official Website'}</button>
     <button role="tab" aria-selected={tab==='link'} onClick={()=>setTab('link')} className={`min-h-[52px] h-auto whitespace-normal break-words px-5 py-3 rounded-2xl font-extrabold text-lg leading-snug border-2 transition active:scale-[.98] ${tab==='link'?'text-white shadow-lg':'bg-white'}`} style={tab==='link'?{background:'#d97706',borderColor:'#d97706'}:{borderColor:'#d97706',color:'#92400E'}}>{t.tabLink||'🔗 Direct Official Link'}</button>
    </div>

    {tab==='guide'?<div role="tabpanel" className="flex flex-col gap-4">
     <button onClick={speak} className="min-h-[52px] h-auto whitespace-normal break-words px-5 py-3 w-full rounded-2xl bg-amber-100 border-2 border-amber-300 font-extrabold text-lg leading-snug inline-flex justify-center items-center gap-2 text-amber-900 active:scale-[.98] transition"><Volume2 size={22} className="shrink-0"/> {t.listen} — {t.hearSteps||'Hear these steps'}</button>
     <ol className="flex flex-col gap-3">
      {steps.map((s,i)=>{const Icon=s.icon;return <li key={i} className="bg-white rounded-3xl border-2 border-stone-200/80 p-5 flex flex-wrap sm:flex-nowrap gap-4">
       <span className="w-11 h-11 rounded-full text-white grid place-items-center font-extrabold text-lg shrink-0" style={{background:i===1?'#d97706':'#064e3b'}}>{i+1}</span>
       <span className="min-w-0 flex-1"><b className="block text-lg leading-snug break-words inline-flex flex-wrap items-center gap-2"><Icon size={20} className="text-emerald-800 shrink-0"/>{s.title}</b><span className="block text-stone-600 leading-relaxed break-words mt-1">{s.body}</span></span></li>})}
     </ol>
     <button onClick={()=>setTab('link')} className="min-h-[52px] h-auto whitespace-normal break-words px-5 py-3 rounded-2xl text-white font-extrabold text-lg leading-snug shadow active:scale-[.98] transition" style={{background:'#15803d'}}>{t.tabLink} →</button>
    </div>
    :<div role="tabpanel" className="flex flex-col gap-4">
     <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 flex gap-3"><ShieldAlert size={28} className="text-amber-700 shrink-0 mt-1"/><p className="text-lg leading-relaxed break-words text-amber-900"><b>{t.leavingTitle||'You are now leaving SahayaAI.'}</b> {t.leavingBody||'Please use your credentials carefully on the official government portal. SahayaAI will never ask for your bank password or OTP.'}</p></div>
     <div className="bg-white rounded-3xl border-2 border-emerald-900/15 p-5 flex flex-col gap-2">
      <span className="font-bold text-stone-500 break-words">{t.officialWebsite||'Official Government Website'}</span>
      <span className="font-mono font-extrabold text-lg sm:text-xl break-all leading-relaxed text-emerald-900">{scheme.apply}</span>
      <span className="text-stone-600 leading-relaxed break-words">{scheme.name} • {isCentral?'🇮🇳 Central Government of India':'🏛️ '+scheme.origin+(state?', '+state:'')+(district?', '+district:'')}</span>
     </div>
     {/* Opens new tab, modal STAYS open */}
     <a href={scheme.apply} target="_blank" rel="noopener noreferrer" className="min-h-[52px] h-auto whitespace-normal break-words px-5 py-3 w-full rounded-2xl text-white font-extrabold text-lg leading-snug inline-flex justify-center items-center gap-2 text-center shadow-xl active:scale-[.98] transition" style={{background:'#15803d'}}><ExternalLink size={22} className="shrink-0"/> {t.visitBtn||'Visit Official Government Website & Guide'} ↗</a>
     <p className="text-center font-semibold text-stone-500 leading-relaxed break-words">{t.staysOpen||'The official site opens in a new tab — this guide stays open here. Come back to this tab anytime to re-read the steps.'}</p>
     <button onClick={speak} className="min-h-[52px] h-auto whitespace-normal break-words px-5 py-3 rounded-2xl bg-amber-100 border-2 border-amber-300 font-extrabold text-lg leading-snug inline-flex justify-center items-center gap-2 text-amber-900"><Volume2 size={22} className="shrink-0"/> {t.listen}</button>
     <button onClick={()=>setTab('guide')} className="min-h-[52px] h-auto whitespace-normal break-words px-5 py-3 rounded-2xl bg-white border-2 border-emerald-800 font-extrabold text-lg leading-snug text-emerald-900">← {t.tabGuide}</button>
    </div>}
   </div>
  </motion.div>
 </motion.div>
}
