import {useEffect,useRef} from 'react'

// Shared "Luminous Neural Mesh" ambient canvas — same palette as the 3D globe:
// royal blue #3B82F6 nodes, gold #F59E0B and emerald #10B981 accents, faint
// constellation lines, gentle cursor parallax. Lightweight 2D canvas:
// DPR capped at 2, pauses off-screen/hidden, static frame on reduced-motion,
// full cleanup on unmount.
const COLORS=['#3B82F6','#3B82F6','#3B82F6','#3B82F6','#3B82F6','#3B82F6','#3B82F6','#F59E0B','#F59E0B','#10B981']
export default function ThemeBackdrop({density=1,opacity=1}){
 const ref=useRef(null)
 useEffect(()=>{
  const canvas=ref.current
  if(!canvas) return
  const ctx=canvas.getContext('2d')
  if(!ctx) return
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let w=0,h=0,nodes=[],raf=0,visible=true,mx=-9999,my=-9999
  const DPR=Math.min(window.devicePixelRatio||1,2)
  function build(){
   const n=Math.round(Math.min(110,Math.max(24,(w*h)/16000))*density)
   nodes=Array.from({length:n},()=>({
    x:Math.random()*w,y:Math.random()*h,
    vx:(Math.random()-0.5)*0.22,vy:(Math.random()-0.5)*0.22,
    r:0.8+Math.random()*1.5,z:0.3+Math.random()*0.7,
    c:COLORS[Math.floor(Math.random()*COLORS.length)]
   }))
  }
  function resize(){
   const rect=canvas.getBoundingClientRect()
   w=rect.width;h=rect.height
   canvas.width=Math.max(1,w*DPR);canvas.height=Math.max(1,h*DPR)
   ctx.setTransform(DPR,0,0,DPR,0,0)
   if(!nodes.length) build()
   if(reduced) draw(0)
  }
  function draw(t){
   ctx.clearRect(0,0,w,h)
   const px=(mx/w-0.5)||0, py=(my/h-0.5)||0
   // constellation lines
   for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
    const a=nodes[i],b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=dx*dx+dy*dy
    if(d<16900){
     ctx.strokeStyle=`rgba(59,130,246,${(1-d/16900)*0.16})`
     ctx.lineWidth=1
     ctx.beginPath();ctx.moveTo(a.x+px*14*a.z,a.y+py*14*a.z);ctx.lineTo(b.x+px*14*b.z,b.y+py*14*b.z);ctx.stroke()
    }
   }
   // nodes with soft halo
   for(const n of nodes){
    const x=n.x+px*14*n.z, y=n.y+py*14*n.z
    const g=ctx.createRadialGradient(x,y,0,x,y,n.r*5)
    g.addColorStop(0,n.c);g.addColorStop(0.35,n.c+'55');g.addColorStop(1,'transparent')
    ctx.fillStyle=g
    ctx.beginPath();ctx.arc(x,y,n.r*5,0,6.2832);ctx.fill()
    ctx.fillStyle='#E0F2FE'
    ctx.beginPath();ctx.arc(x,y,n.r*0.55,0,6.2832);ctx.fill()
    if(!reduced){
     n.x+=n.vx;n.y+=n.vy
     // gentle cursor drift-away within 120px
     const dx=n.x-mx,dy=n.y-my,d2=dx*dx+dy*dy
     if(d2<14400&&d2>1){const d=Math.sqrt(d2);n.x+=dx/d*0.35;n.y+=dy/d*0.35}
     if(n.x<-10)n.x=w+10;if(n.x>w+10)n.x=-10;if(n.y<-10)n.y=h+10;if(n.y>h+10)n.y=-10
    }
   }
  }
  function loop(t){raf=requestAnimationFrame(loop);if(!visible||document.hidden)return;draw(t)}
  function onMove(e){const r=canvas.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top}
  function onLeave(){mx=-9999;my=-9999}
  resize()
  const ro=new ResizeObserver(resize);ro.observe(canvas)
  const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting},{threshold:0.01});io.observe(canvas)
  const parent=canvas.parentElement
  if(parent){parent.addEventListener('pointermove',onMove);parent.addEventListener('pointerleave',onLeave)}
  if(reduced) draw(0); else raf=requestAnimationFrame(loop)
  return ()=>{
   cancelAnimationFrame(raf);ro.disconnect();io.disconnect()
   if(parent){parent.removeEventListener('pointermove',onMove);parent.removeEventListener('pointerleave',onLeave)}
  }
 },[density])
 return <canvas ref={ref} aria-hidden="true" className="block w-full h-full" style={{opacity}}/>
}
