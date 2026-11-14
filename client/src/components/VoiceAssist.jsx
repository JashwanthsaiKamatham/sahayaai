import {useEffect,useState} from 'react'
import {Mic,X,Volume2} from 'lucide-react'
export default function VoiceAssist({langSpeech,onTranscript,t,openSignal=0}){
 const [open,setOpen]=useState(false);const [listening,setListening]=useState(false);const [heard,setHeard]=useState('')
 function start(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition
  if(!SR){setHeard(t.voiceUnsupported);return}
  const r=new SR();r.lang=langSpeech;r.interimResults=false
  r.onstart=()=>setListening(true);r.onend=()=>setListening(false);r.onerror=()=>setListening(false)
  r.onresult=e=>{const txt=e.results[0][0].transcript;setHeard(txt);onTranscript&&onTranscript(txt)}
  try{r.start()}catch{}
 }
 // "Voice Assistance" in the top navigation opens this assistant (static, no animation)
 useEffect(()=>{if(openSignal>0){setOpen(true);start()}},[openSignal])
 return <>
  <button onClick={()=>{setOpen(true);start()}} aria-label={t.voice} className="voice-orb fixed bottom-6 right-6 z-[1100] min-w-[72px] min-h-[72px] w-[72px] h-[72px] rounded-full text-white grid place-items-center focus:outline-none focus:ring-4 focus:ring-amber-300" style={{background:'linear-gradient(145deg,#C05621,#ED8936)'}}>
   <Mic size={32}/>
   <span className="sr-only">{t.voice}</span>
  </button>
  {open&&<div className="fixed inset-0 z-[1200] bg-black/50 grid place-items-end sm:place-items-center p-3" role="dialog" aria-modal="true" aria-label={t.voice}>
   <div className="depth-card p-6 w-full max-w-md text-center">
    <button onClick={()=>setOpen(false)} aria-label="Close" className="float-right min-w-[48px] min-h-[48px] grid place-items-center rounded-full bg-stone-100 depth-sm"><X/></button>
    <div className="mx-auto w-24 h-24 rounded-full grid place-items-center text-white mt-4 voice-orb" style={{background:listening?'#B45309':'#14532D'}}><Mic size={44}/></div>
    <h3 className="font-extrabold text-2xl mt-4">{listening?t.listening:t.voice}</h3>
    <p className="text-lg text-slate-600 mt-1">{t.voiceHint}</p>
    {heard&&<p className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 font-bold mt-3 break-words">🗣️ “{heard}”</p>}
    <button onClick={start} className="min-h-[56px] w-full rounded-2xl text-white font-extrabold text-lg mt-4 inline-flex justify-center items-center gap-2 depth-btn" style={{background:'linear-gradient(145deg,#9A3412,#C05621)'}}><Volume2/> {listening?t.listening:t.tapSpeak}</button>
   </div></div>}
 </>
}
