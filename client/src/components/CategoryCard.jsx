import TiltCard from './TiltCard.jsx'
export default function CategoryCard({icon:Icon,label,count,active,onClick}){
 return <TiltCard as="button" onClick={onClick} pressed={active} ariaLabel={label} className={`min-h-[118px] w-full rounded-3xl border-2 p-4 text-left transition-shadow ${active?'text-white shadow-[0_18px_35px_rgba(6,78,59,.35)]':'bg-white/85 backdrop-blur-xl text-stone-800 shadow-[0_10px_25px_rgba(6,78,59,.10)]'}`} style={active?{background:'linear-gradient(135deg,#064e3b,#15803d)',borderColor:'#064e3b'}:{borderColor:'#E7E5E4'}}>
  <span className={`w-12 h-12 rounded-2xl grid place-items-center ${active?'bg-white/20':'bg-amber-100'}`} style={{transform:'translateZ(28px)'}}><Icon size={26} color={active?'#FDE68A':'#92400E'}/></span>
  <span className="block font-extrabold text-[1.05rem] leading-tight mt-2" style={{transform:'translateZ(18px)'}}>{label}</span>
  <span className={`text-sm font-bold ${active?'text-emerald-100':'text-stone-500'}`} style={{transform:'translateZ(12px)'}}>{count} schemes</span>
 </TiltCard>
}
