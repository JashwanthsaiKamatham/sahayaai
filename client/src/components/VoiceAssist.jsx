import {useEffect,useRef,useState} from 'react'
import {Mic,X,Volume2} from 'lucide-react'

// Voice Assistance: central luminous 3D orb (same family as the hero globe core)
// with live audio-reactive graphics — the orb distorts with speech volume/pitch
// and emits blue/emerald particle trails. Uses the mic analyser when permission
// is granted; falls back to a gentle simulated level while listening.
export default function VoiceAssist({langSpeech,onTranscript,t,openSignal=0}){
 const [open,setOpen]=useState(false);const [listening,setListening]=useState(false);const [heard,setHeard]=useState('')
 const orbRef=useRef(null);const trailRef=useRef(null);const audioRef=useRef(null)
 function start(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition
  if(!SR){setHeard(t.voiceUnsupported);return}
  const r=new SR();r.lang=langSpeech;r.interimResults=false
  r.onstart=()=>setListening(true);r.onend=()=>setListening(false);r.onerror=()=>setListening(false)
  r.onresult=e=>{const txt=e.results[0][0].transcript;setHeard(txt);onTranscript&&onTranscript(txt)}
  try{r.start()}catch{}
 }
 useEffect(()=>{if(openSignal>0){setOpen(true);start()}},[openSignal])

 // ---- Live audio-reactive loop (mic analyser -> orb + particle trails) ----
 useEffect(()=>{
  if(!open) return
  let raf=0,level=0.06,stream=null,ctx=null,analyser=null,data=null,freq=null
  const t0=performance.now()
  async function initMic(){
   try{
    stream=await navigator.mediaDevices.getUserMedia({audio:true})
    ctx=new (window.AudioContext||window.webkitAudioContext)()
    const src=ctx.createMediaStreamSource(stream)
    analyser=ctx.createAnalyser();analyser.fftSize=512
    data=new Uint8Array(analyser.fftSize);freq=new Uint8Array(analyser.frequencyBinCount)
    src.connect(analyser)
    audioRef.current={stream,ctx}
   }catch{ /* no mic permission: simulated level below */ }
  }
  initMic()
  function frame(){
   raf=requestAnimationFrame(frame)
   let target=0.06,pitchN=0.3
   if(analyser){
    analyser.getByteTimeDomainData(data)
    let sum=0;for(let i=0;i<data.length;i++){const v=(data[i]-128)/128;sum+=v*v}
    target=Math.min(1,Math.sqrt(sum/data.length)*3.2)
    analyser.getByteFrequencyData(freq)
    let peak=0,pi=0;for(let i=2;i<freq.length;i++){if(freq[i]>peak){peak=freq[i];pi=i}}
    pitchN=Math.min(1,pi/120)
   }else if(listening){
    const s=(performance.now()-t0)/1000
    target=0.30+0.16*Math.sin(s*2.3)+0.08*Math.sin(s*5.7)
    pitchN=0.45+0.25*Math.sin(s*1.4)
   }
   level+=(target-level)*0.18
   const orb=orbRef.current,trail=trailRef.current
   if(orb){
    orb.style.transform=`scale(${1+level*0.30}) scaleY(${1+level*0.16+pitchN*0.05}) scaleX(${1+level*0.10})`
    orb.style.boxShadow=`0 0 ${34+level*70}px rgba(59,130,246,${0.45+level*0.4}),0 0 ${60+level*110}px rgba(16,185,129,${0.25+level*0.35}),inset 0 2px 0 rgba(255,255,255,.35),inset 0 -10px 22px rgba(2,20,40,.55)`
   }
   if(trail){
    const t=(performance.now()-t0)/1000
    ;[...trail.children].forEach((dot,i)=>{
     const a=(i/trail.children.length)*Math.PI*2+t*(0.25+level*0.7)
     const rad=64+level*52+Math.sin(t*2+i)*6+pitchN*10
     dot.style.transform=`translate(${Math.cos(a)*rad}px,${Math.sin(a)*rad*0.92}px) scale(${0.7+level*1.1})`
     dot.style.opacity=String(0.35+level*0.65)
    })
   }
  }
  raf=requestAnimationFrame(frame)
  return ()=>{
   cancelAnimationFrame(raf)
   if(stream)stream.getTracks().forEach(tr=>tr.stop())
   if(ctx&&ctx.state!=='closed')ctx.close().catch(()=>{})
   audioRef.current=null
  }
 },[open,listening])

 return <>
  <button onClick={()=>{setOpen(true);start()}} aria-label={t.voice} className="voice-orb fixed bottom-6 right-6 z-[1100] min-w-[72px] min-h-[72px] w-[72px] h-[72px] rounded-full text-white grid place-items-center focus:outline-none focus:ring-4 focus:ring-amber-300" style={{background:'linear-gradient(145deg,#C05621,#ED8936)'}}>
   <Mic size={32}/>
   <span className="sr-only">{t.voice}</span>
  </button>
  {open&&<div className="fixed inset-0 z-[1200] bg-black/50 grid place-items-end sm:place-items-center p-3" role="dialog" aria-modal="true" aria-label={t.voice}>
   <div className="depth-card p-6 w-full max-w-md text-center">
    <button onClick={()=>setOpen(false)} aria-label="Close" className="float-right min-w-[48px] min-h-[48px] grid place-items-center rounded-full bg-stone-100 depth-sm"><X/></button>
    {/* Central luminous orb + reactive particle trails */}
    <div className="relative mx-auto w-40 h-40 mt-4 grid place-items-center" aria-hidden="true">
     <span className="orb-rings absolute w-32 h-32 rounded-full"/>
     <div ref={trailRef} className="absolute left-1/2 top-1/2 w-0 h-0">
      {Array.from({length:14}).map((_,i)=><span key={i} className="absolute w-2 h-2 rounded-full" style={{background:i%2?'#10B981':'#3B82F6',boxShadow:`0 0 10px ${i%2?'#10B981':'#3B82F6'}`}}/>)}
     </div>
     <div ref={orbRef} className="orb-core relative w-28 h-28 rounded-full grid place-items-center text-white" style={{background:'radial-gradient(circle at 32% 28%, rgba(147,197,253,.95), rgba(59,130,246,.85) 38%, rgba(6,78,59,.95) 78%, rgba(8,28,56,1))',willChange:'transform'}}>
      <Mic size={46}/>
     </div>
    </div>
    <h3 className="font-extrabold text-2xl mt-4">{listening?t.listening:t.voice}</h3>
    <p className="text-lg text-slate-600 mt-1">{t.voiceHint}</p>
    {heard&&<p className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 font-bold mt-3 break-words">🗣️ “{heard}”</p>}
    <button onClick={start} className="min-h-[56px] w-full rounded-2xl text-white font-extrabold text-lg mt-4 inline-flex justify-center items-center gap-2 depth-btn" style={{background:'linear-gradient(145deg,#9A3412,#C05621)'}}><Volume2/> {listening?t.listening:t.tapSpeak}</button>
   </div></div>}
 </>
}
