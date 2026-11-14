import {ShieldCheck} from 'lucide-react'
// Stylised 3D isometric category icon: metallic three-face cube (light-catching
// top face, mid left, deep right) with a white glyph — matches the neural theme.
const FACES={
 farming:['#6EE7B7','#10B981','#065F46'],
 pension:['#FDE68A','#F59E0B','#92400E'],
 housing:['#93C5FD','#3B82F6','#1E3A8A'],
 women:['#A7F3D0','#10B981','#064E3B'],
 wages:['#FDE68A','#D97706','#78350F'],
 healthcare:['#93C5FD','#2563EB','#172554'],
 default:['#BFDBFE','#3B82F6','#1E40AF']
}
export default function IsoIcon({kind='default',Icon=ShieldCheck,size=46}){
 const [top,left,right]=FACES[kind]||FACES.default
 return <span className="relative inline-grid place-items-center shrink-0" style={{width:size,height:size}} aria-hidden="true">
  <svg width={size} height={size} viewBox="0 0 48 48" className="absolute inset-0" aria-hidden="true" style={{filter:'drop-shadow(0 6px 10px rgba(2,6,17,.45))'}}>
   <polygon points="24,3 43,13.5 24,24 5,13.5" fill={top}/>
   <polygon points="5,13.5 24,24 24,45 5,34.5" fill={left}/>
   <polygon points="24,24 43,13.5 43,34.5 24,45" fill={right}/>
   <polygon points="24,3 43,13.5 24,24 5,13.5" fill="rgba(255,255,255,.16)"/>
   <polyline points="5,13.5 24,24 43,13.5" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1"/>
  </svg>
  <Icon size={Math.round(size*0.4)} className="relative text-white" style={{filter:'drop-shadow(0 2px 3px rgba(0,0,0,.45))'}}/>
 </span>
}
