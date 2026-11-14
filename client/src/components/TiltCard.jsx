// Static 3D depth card — layered shadows + inner top highlight, ZERO motion/tilt/animation.
export default function TiltCard({children,className='',style={},onClick,as='div',ariaLabel,pressed}){
 const Comp=as==='button'?'button':'div'
 return <Comp onClick={onClick} aria-label={ariaLabel} aria-pressed={pressed} style={style} className={`depth-card ${className}`}>{children}</Comp>
}
