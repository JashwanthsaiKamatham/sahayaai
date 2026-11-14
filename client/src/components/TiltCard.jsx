import {motion,useMotionValue,useSpring,useTransform,useReducedMotion} from 'framer-motion'
export default function TiltCard({children,className='',style={},onClick,as='div',ariaLabel,pressed}){
 const rm=useReducedMotion();const mx=useMotionValue(0),my=useMotionValue(0)
 const rx=useSpring(useTransform(my,[-.5,.5],[6,-6]),{stiffness:180,damping:18});const ry=useSpring(useTransform(mx,[-.5,.5],[-7,7]),{stiffness:180,damping:18})
 const handlers={onMouseMove:e=>{if(rm)return;const r=e.currentTarget.getBoundingClientRect();mx.set((e.clientX-r.left)/r.width-.5);my.set((e.clientY-r.top)/r.height-.5)},onMouseLeave:()=>{mx.set(0);my.set(0)}}
 const Comp=as==='button'?motion.button:motion.div
 return <Comp {...handlers} onClick={onClick} aria-label={ariaLabel} aria-pressed={pressed} whileTap={{scale:.96}} style={rm?{...style}:{...style,rotateX:rx,rotateY:ry,transformStyle:'preserve-3d'}} className={className}>{children}</Comp>
}
