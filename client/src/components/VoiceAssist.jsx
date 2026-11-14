import {useState} from 'react'
import {motion,AnimatePresence} from 'framer-motion'
import {Mic,X,Volume2} from 'lucide-react'
export default function VoiceAssist({langSpeech,onTranscript,t}){
 const [open,setOpen]=useState(false);const [listening,setListening]=useState(false);const [heard,setHeard]=useState('')
 function start(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition
  if(!SR){setHeard(t.voiceUnsupported);return}
  const r=new SR();r.lang=langSpeech;r.interimResults=false
  r.onstart=()=>setListening(true);r.onend=()=>setListening(false);r.onerror=()=>setListening(false)
  r.onresult=e=>{const txt=e.results[0][0].transcript;setHeard(txt);onTranscript&&onTranscript(txt)}
  try{r.start()}catch{}
 }
 return <>
  <motion.button initial={{scale:0}} animate={{scale:1}} transition={{delay:.6,type:'spring'}} onClick={()=>{setOpen(true);start()}} aria-label={t.voice} className="fixed bottom-5 right-5 z-50 w-[72px] h-[72px] rounded-full text-white shadow-2xl grid place-items-center focus:outline-none focus:ring-4 focus:ring-amber-300" style={{background:'linear-gradient(135deg,#C05621,#ED8936)'}}>
   <span className="absolute inset-0 rounded-full animate-ping bg-orange-400 opacity-25" aria-hidden/>
   <Mic size={32} className="relative"/>
   <span className="sr-only">{t.voice}</span>
  </motion.button>
  <AnimatePresence>{open&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/50 grid place-items-end sm:place-items-center p-3" role="dialog" aria-modal="true" aria-label={t.voice}>
   <motion.div initial={{y:60,opacity:0}} animate={{y:0,opacity:1}} exit={{y:60,opacity:0}} className="bg-white rounded-[2rem] p-6 w-full max-w-md text-center shadow-2xl">
    <button onClick={()=>setOpen(false)} aria-label="Close" className="float-right min-w-[48px] min-h-[48px] grid place-items-center rounded-full bg-stone-100"><X/></button>
    <div className={`mx-auto w-24 h-24 rounded-full grid place-items-center text-white mt-4 ${listening?'animate-pulse':''}`} style={{background:'#14532D'}}><Mic size={44}/></div>
    <h3 className="font-extrabold text-2xl mt-4">{listening?t.listening:t.voice}</h3>
    <p className="text-lg text-slate-600 mt-1">{t.voiceHint}</p>
    {heard&&<p className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 font-bold mt-3">🗣️ “{heard}”</p>}
    <button onClick={start} className="min-h-[56px] w-full rounded-2xl text-white font-extrabold text-lg mt-4 inline-flex justify-center items-center gap-2" style={{background:'#C05621'}}><Volume2/> {listening?t.listening:t.tapSpeak}</button>
   </motion.div></motion.div>}</AnimatePresence>
 </>
}
