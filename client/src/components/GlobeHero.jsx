import {useEffect,useRef,useState} from 'react'
import * as THREE from 'three'

// "Connected Citizen & Scheme Network" — interactive 3D particle globe.
// Fibonacci-sphere particles, glowing gold/emerald nodes, bezier arcs with
// travelling light pulses, dark inner core + atmosphere halo.
// Auto-rotates (0.002 rad/frame), pointer drag with damped inertia,
// ResizeObserver sizing, DPR capped at 2, full dispose on unmount.
const CAPTIONS={
 en:'Citizens, languages & schemes — connected across India',
 kn:'ನಾಗರಿಕರು, ಭಾಷೆಗಳು ಮತ್ತು ಯೋಜನೆಗಳು — ಭಾರತದಾದ್ಯಂತ ಸಂಪರ್ಕಿತ',
 te:'పౌరులు, భాషలు & పథకాలు — భారతదేశమంతటా అనుసంధానం',
 hi:'नागरिक, भाषाएँ और योजनाएँ — पूरे भारत में जुड़े',
 ta:'குடிமக்கள், மொழிகள் & திட்டங்கள் — இந்தியா முழுவும் இணைக்கப்பட்டது',
 mr:'नागरिक, भाषा आणि योजना — संपूर्ण भारतात जोडलेले'
}
const R=1.7, PARTICLES=1600, NODES=22

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function dotTexture(stops){
 const c=document.createElement('canvas');c.width=c.height=64
 const g=c.getContext('2d');const grad=g.createRadialGradient(32,32,0,32,32,32)
 stops.forEach(([o,col])=>grad.addColorStop(o,col))
 g.fillStyle=grad;g.fillRect(0,0,64,64)
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return tex
}

export default function GlobeHero({lang='en'}){
 const mountRef=useRef(null)
 const [failed,setFailed]=useState(false)

 useEffect(()=>{
  const mount=mountRef.current
  if(!mount) return
  let renderer
  try{
   renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'})
  }catch{ setFailed(true); return }
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2))
  renderer.setClearColor(0x000000,0)
  renderer.domElement.style.display='block'
  renderer.domElement.style.width='100%'
  renderer.domElement.style.height='100%'
  renderer.domElement.setAttribute('aria-hidden','true')
  mount.appendChild(renderer.domElement)

  const scene=new THREE.Scene()
  const camera=new THREE.PerspectiveCamera(40,1,0.1,100)
  camera.position.set(0,0.25,5.5)
  camera.lookAt(0,0,0)
  const group=new THREE.Group()
  group.rotation.x=0.18
  scene.add(group)
  const rand=mulberry32(20261114)

  // ---- Atmosphere halo (behind globe) ----
  const atmoTex=dotTexture([[0,'rgba(59,130,246,0.38)'],[0.45,'rgba(59,130,246,0.14)'],[1,'rgba(59,130,246,0)']])
  const atmo=new THREE.Sprite(new THREE.SpriteMaterial({map:atmoTex,transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending}))
  atmo.scale.setScalar(R*3.1);atmo.renderOrder=0
  scene.add(atmo)

  // ---- Dark inner core: occludes back-side particles ----
  const core=new THREE.Mesh(
   new THREE.SphereGeometry(R*0.985,48,48),
   new THREE.MeshBasicMaterial({color:0x081c38,transparent:true,opacity:0.84,depthWrite:true})
  )
  core.renderOrder=1
  group.add(core)

  // ---- Particle sphere (Fibonacci distribution, no polar clustering) ----
  const pos=new Float32Array(PARTICLES*3)
  const golden=Math.PI*(3-Math.sqrt(5))
  const spherePts=[]
  for(let i=0;i<PARTICLES;i++){
   const y=1-(i/(PARTICLES-1))*2
   const rad=Math.sqrt(Math.max(0,1-y*y))
   const theta=golden*i
   const p=new THREE.Vector3(Math.cos(theta)*rad*R,y*R,Math.sin(theta)*rad*R)
   spherePts.push(p)
   pos[i*3]=p.x;pos[i*3+1]=p.y;pos[i*3+2]=p.z
  }
  const pGeo=new THREE.BufferGeometry()
  pGeo.setAttribute('position',new THREE.BufferAttribute(pos,3))
  const pTex=dotTexture([[0,'rgba(255,255,255,1)'],[0.35,'rgba(147,197,253,0.9)'],[1,'rgba(59,130,246,0)']])
  const points=new THREE.Points(pGeo,new THREE.PointsMaterial({size:0.06,map:pTex,color:0x3B82F6,transparent:true,opacity:0.95,depthWrite:false,blending:THREE.AdditiveBlending,sizeAttenuation:true}))
  points.renderOrder=2
  group.add(points)

  // ---- Glowing nodes (gold / emerald halo sprites) ----
  const goldTex=dotTexture([[0,'rgba(255,255,255,1)'],[0.25,'rgba(245,158,11,0.95)'],[0.6,'rgba(245,158,11,0.35)'],[1,'rgba(245,158,11,0)']])
  const emerTex=dotTexture([[0,'rgba(255,255,255,1)'],[0.25,'rgba(16,185,129,0.95)'],[0.6,'rgba(16,185,129,0.35)'],[1,'rgba(16,185,129,0)']])
  const nodePts=[]
  const usedIdx=new Set()
  while(nodePts.length<NODES){
   const idx=Math.floor(rand()*PARTICLES)
   if(usedIdx.has(idx)) continue
   usedIdx.add(idx);nodePts.push(spherePts[idx].clone())
  }
  nodePts.forEach((p,i)=>{
   const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:i%2?emerTex:goldTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}))
   spr.position.copy(p);spr.scale.setScalar(0.26);spr.renderOrder=3
   group.add(spr)
  })

  // ---- Curved arcs between nearby nodes + travelling pulses ----
  const curves=[]
  const lineMat=new THREE.LineBasicMaterial({color:0x7dd3fc,transparent:true,opacity:0.32,blending:THREE.AdditiveBlending,depthWrite:false})
  const maxArcs=34
  for(let i=0;i<nodePts.length&&curves.length<maxArcs;i++){
   const near=nodePts.map((q,j)=>({j,d:nodePts[i].distanceTo(q)})).filter(x=>x.j!==i).sort((a,b)=>a.d-b.d).slice(0,2)
   for(const {j,d} of near){
    if(j<i||d>R*0.95) continue
    const a=nodePts[i],b=nodePts[j]
    const mid=a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R*(1.12+d*0.12))
    const curve=new THREE.QuadraticBezierCurve3(a,mid,b)
    curves.push(curve)
    const geo=new THREE.BufferGeometry().setFromPoints(curve.getPoints(40))
    const line=new THREE.Line(geo,lineMat);line.renderOrder=2
    group.add(line)
    if(curves.length>=maxArcs) break
   }
  }
  const pulseTex=dotTexture([[0,'rgba(255,255,255,1)'],[0.4,'rgba(253,224,71,0.9)'],[1,'rgba(253,224,71,0)']])
  const pulses=[]
  for(let i=0;i<Math.min(18,curves.length);i++){
   const spr=new THREE.Sprite(new THREE.SpriteMaterial({map:pulseTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}))
   spr.scale.setScalar(0.13);spr.renderOrder=4
   group.add(spr)
   pulses.push({spr,curve:curves[i%curves.length],off:rand(),speed:0.05+rand()*0.08})
  }

  // ---- Sizing (ResizeObserver) ----
  function resize(){
   const w=mount.clientWidth||480,h=mount.clientHeight||420
   renderer.setSize(w,h,false)
   camera.aspect=w/h;camera.updateProjectionMatrix()
  }
  resize()
  const ro=new ResizeObserver(resize);ro.observe(mount)

  // ---- Pause when off-screen / tab hidden ----
  let visible=true
  const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting},{threshold:0.02})
  io.observe(mount)

  // ---- Drag rotate with damped inertia + gentle parallax ----
  let dragging=false,lastX=0,lastY=0,spin=0,curX=0,curY=0,tgtX=0,tgtY=0
  const el=renderer.domElement
  function onDown(e){dragging=true;lastX=e.clientX;lastY=e.clientY;try{el.setPointerCapture(e.pointerId)}catch{}}
  function onMove(e){
   if(dragging){
    tgtY+=(e.clientX-lastX)*0.005
    tgtX=THREE.MathUtils.clamp(tgtX+(e.clientY-lastY)*0.003,-0.65,0.65)
    lastX=e.clientX;lastY=e.clientY
   }else{
    const r=el.getBoundingClientRect()
    tgtX=THREE.MathUtils.clamp(((e.clientY-r.top)/r.height-0.5)*0.22,-0.2,0.2)
    tgtY+=(((e.clientX-r.left)/r.width-0.5)*0.3-tgtY)*0.02
   }
  }
  function onUp(){dragging=false}
  el.addEventListener('pointerdown',onDown)
  el.addEventListener('pointermove',onMove)
  el.addEventListener('pointerup',onUp)
  el.addEventListener('pointercancel',onUp)

  // ---- Render loop ----
  let raf=0
  const startMs=performance.now()
  function tick(){
   raf=requestAnimationFrame(tick)
   if(!visible||document.hidden) return
   const t=(performance.now()-startMs)/1000
   if(!dragging&&!reduced) spin+=0.002
   curX+=(tgtX-curX)*0.06;curY+=(tgtY-curY)*0.06
   group.rotation.y=spin+curY
   group.rotation.x=0.18+curX
   if(!reduced) for(const p of pulses){p.spr.position.copy(p.curve.getPoint((t*p.speed+p.off)%1))}
   else pulses.forEach((p,i)=>p.spr.position.copy(p.curve.getPoint(p.off)))
   renderer.render(scene,camera)
  }
  tick()

  // ---- Cleanup: zero leaks ----
  return ()=>{
   cancelAnimationFrame(raf)
   ro.disconnect();io.disconnect()
   el.removeEventListener('pointerdown',onDown)
   el.removeEventListener('pointermove',onMove)
   el.removeEventListener('pointerup',onUp)
   el.removeEventListener('pointercancel',onUp)
   scene.traverse(o=>{
    if(o.geometry) o.geometry.dispose()
    if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(m.map)m.map.dispose();m.dispose()})}
   })
   renderer.dispose()
   if(el.parentNode===mount) mount.removeChild(el)
  }
 },[])

 if(failed) return <div className="w-full h-full flex flex-col min-w-0">
   <div className="flex-1 grid place-items-center" role="img" aria-label="Globe of connected citizens and schemes across India"><span className="text-[7rem] leading-none" aria-hidden="true">🌐</span></div>
   <p className="text-center text-emerald-100/80 text-sm font-semibold pt-2">{CAPTIONS[lang]||CAPTIONS.en}</p>
  </div>

 return <div className="w-full h-full flex flex-col min-w-0">
   <div ref={mountRef} className="relative flex-1 min-h-0 w-full cursor-grab active:cursor-grabbing" style={{touchAction:'pan-y'}} role="img" aria-label="Interactive 3D globe showing citizens, languages and government schemes connected across India"/>
   <p className="text-center text-emerald-100/80 text-sm font-semibold pt-2 leading-relaxed">{CAPTIONS[lang]||CAPTIONS.en}</p>
 </div>
}
