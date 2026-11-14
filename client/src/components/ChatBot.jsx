import {useEffect,useRef,useState} from 'react'
import {Send,Mic,Volume2,Bot,User,Trash2,Sparkles} from 'lucide-react'
const API=import.meta.env.VITE_API_BASE_URL||'https://sahayaai-backend.onrender.com'
const SUGGESTED=['What schemes are for small farmers?','Pension for my 70-year-old father','Housing help for my family','Free health treatment schemes','Documents needed for PM-KISAN']
export default function ChatBot({langName,langSpeech,state,occupation,speak}){
 const [msgs,setMsgs]=useState(()=>{try{return JSON.parse(localStorage.getItem('sahaya_chat')||'[]')}catch{return[]}})
 const [input,setInput]=useState('');const [busy,setBusy]=useState(false);const endRef=useRef()
 useEffect(()=>{localStorage.setItem('sahaya_chat',JSON.stringify(msgs.slice(-30)));endRef.current?.scrollIntoView({behavior:'smooth'})},[msgs])
 async function ask(q){
  const text=(q??input).trim(); if(!text||busy)return; setInput(''); setBusy(true)
  setMsgs(m=>[...m,{role:'user',text}])
  try{ const r=await fetch(API+'/api/ai/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,language:langName,state,occupation})}); const d=await r.json(); if(!r.ok)throw new Error(d.error||'AI busy')
   setMsgs(m=>[...m,{role:'ai',text:d.reply,source:d.source,schemes:d.schemes||[]}])
  }catch(e){ setMsgs(m=>[...m,{role:'ai',text:'Sorry, the AI is waking up (free server can take ~40 seconds). Please try again — meanwhile use Explore Schemes above.',source:'offline'}]) }
  finally{setBusy(false)}
 }
 function voice(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return alert('Voice input needs Chrome on Android');const r=new SR();r.lang=langSpeech;r.onresult=e=>setInput(e.results[0][0].transcript);try{r.start()}catch{}}
 return <section className="bg-white rounded-[1.75rem] border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col" aria-label="SahayaAI chat assistant">
  <div className="p-5 sm:p-6 text-white flex flex-wrap items-center justify-between gap-3" style={{background:'linear-gradient(135deg,#0B2447,#064E3B)'}}>
   <div className="flex items-center gap-3"><span className="w-11 h-11 rounded-2xl bg-white/15 grid place-items-center shrink-0"><Bot size={24}/></span><div><h2 className="font-extrabold text-2xl leading-snug">SahayaAI Assistant</h2><p className="text-emerald-100/85 font-semibold text-sm">Ask in {langName} • Simple answers • Free</p></div></div>
   <button onClick={()=>setMsgs([])} className="min-h-[44px] px-4 py-2 rounded-full bg-white/10 border border-white/25 font-bold inline-flex gap-1.5 items-center"><Trash2 size={16}/>Clear chat</button>
  </div>
  <div className="flex flex-wrap gap-2 p-4 pb-0">{SUGGESTED.map(q=><button key={q} onClick={()=>ask(q)} className="min-h-[44px] h-auto whitespace-normal break-words px-4 py-2 rounded-full bg-slate-50 border border-[#E2E8F0] font-semibold text-sm leading-snug inline-flex gap-1.5 items-center hover:border-emerald-600"><Sparkles size={15} className="text-amber-600 shrink-0"/>{q}</button>)}</div>
  <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3 min-h-[320px] max-h-[520px]" aria-live="polite">
   {msgs.length===0&&<div className="text-center py-10 flex flex-col items-center gap-2"><span className="text-5xl" aria-hidden>🙏</span><p className="font-extrabold text-xl">Namaste! Ask me anything about schemes.</p><p className="text-slate-500 leading-relaxed max-w-md">Try a suggested question above, type below, or tap the mic and speak in your language.</p></div>}
   {msgs.map((m,i)=><div key={i} className={`flex gap-2.5 ${m.role==='user'?'flex-row-reverse':''}`}>
    <span className={`w-9 h-9 rounded-full grid place-items-center shrink-0 text-white ${m.role==='user'?'bg-slate-700':'bg-emerald-700'}`}>{m.role==='user'?<User size={17}/>:<Bot size={17}/>}</span>
    <div className={`max-w-[85%] rounded-3xl p-4 ${m.role==='user'?'bg-slate-900 text-white rounded-tr-md':'bg-slate-50 border border-[#E2E8F0] rounded-tl-md'}`}>
     <p className="leading-relaxed break-words whitespace-pre-line">{m.text}</p>
     {m.schemes?.length>0&&<div className="flex flex-wrap gap-1.5 mt-2.5">{m.schemes.map(s=><span key={s.title} className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 px-2.5 py-1 text-sm font-bold break-words">{s.title} • {s.benefit}</span>)}</div>}
     {m.role==='ai'&&<div className="flex flex-wrap items-center gap-2 mt-2"><button onClick={()=>speak(m.text)} className="min-h-[40px] px-3 rounded-full bg-white border font-bold text-sm inline-flex gap-1 items-center"><Volume2 size={15}/>Listen</button>{m.source&&<small className="text-slate-400 font-semibold">{m.source}</small>}</div>}
    </div></div>)}
   {busy&&<div className="flex gap-2.5"><span className="w-9 h-9 rounded-full bg-emerald-700 text-white grid place-items-center shrink-0"><Bot size={17}/></span><div className="bg-slate-50 border rounded-3xl rounded-tl-md p-4 flex gap-1.5" aria-label="Assistant is typing"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"/><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" style={{animationDelay:'.15s'}}/><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" style={{animationDelay:'.3s'}}/></div></div>}
   <div ref={endRef}/>
  </div>
  <form onSubmit={e=>{e.preventDefault();ask()}} className="p-4 border-t border-[#E2E8F0] flex flex-wrap gap-2.5 bg-white">
   <input value={input} onChange={e=>setInput(e.target.value)} placeholder={`Ask in ${langName}… e.g. schemes for farmers`} aria-label="Type your question" className="flex-1 min-w-[200px] min-h-[52px] rounded-2xl border border-[#E2E8F0] px-4 py-3 text-[1.05rem] outline-none focus:border-emerald-600"/>
   <button type="button" onClick={voice} aria-label="Voice input" className="min-h-[52px] min-w-[52px] px-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 grid place-items-center"><Mic size={21} className="text-amber-700"/></button>
   <button disabled={busy} className="min-h-[52px] px-5 py-3 rounded-2xl text-white font-extrabold inline-flex gap-2 items-center disabled:opacity-50 shadow" style={{background:'#064E3B'}}><Send size={18}/>Send</button>
  </form>
  <p className="px-4 pb-3.5 text-xs text-slate-400 font-semibold leading-relaxed">AI guidance only — final eligibility approval is by the Government on official portals.</p>
 </section>
}
