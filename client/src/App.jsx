import {useEffect,useMemo,useState} from 'react'
const API = import.meta.env.VITE_API_BASE_URL || 'https://sahayaai-backend.onrender.com'
const LANGS={en:{label:'English',speech:'en-IN'},kn:{label:'ಕನ್ನಡ',speech:'kn-IN'},hi:{label:'हिंदी',speech:'hi-IN'},te:{label:'తెలుగు',speech:'te-IN'}}
const T={
 en:{hero:'Government schemes, in your language.',sub:'Find money & benefits you are eligible for — simple, free, no agent needed.',login:'Login',signup:'Sign Up',sample:'🌾 1-Click Sample Farmer Profile',listen:'🔊 Listen',askAI:'🤖 Ask SahayaAI',save:'Save Scheme',my:'My Saved Schemes & Checklists',docs:'Documents needed'},
 kn:{hero:'ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು.',sub:'ನಿಮಗೆ ಸಿಗುವ ಹಣ ಮತ್ತು ಸೌಲಭ್ಯಗಳನ್ನು ಸರಳವಾಗಿ ತಿಳಿಯಿರಿ — ಉಚಿತ, ಏಜೆಂಟ್ ಬೇಡ.',login:'ಲಾಗಿನ್',signup:'ಸೈನ್ ಅಪ್',sample:'🌾 ಮಾದರಿ ರೈತ ಪ್ರೊಫೈಲ್',listen:'🔊 ಕೇಳಿ',askAI:'🤖 SahayaAI ಕೇಳಿ',save:'ಯೋಜನೆ ಉಳಿಸಿ',my:'ನನ್ನ ಉಳಿಸಿದ ಯೋಜನೆಗಳು',docs:'ಬೇಕಾದ ದಾಖಲೆಗಳು'},
 hi:{hero:'आपकी भाषा में सरकारी योजनाएँ।',sub:'आपको मिलने वाला पैसा और लाभ सरल भाषा में जानें — मुफ़्त, एजेंट की ज़रूरत नहीं।',login:'लॉगिन',signup:'साइन अप',sample:'🌾 नमूना किसान प्रोफ़ाइल',listen:'🔊 सुनें',askAI:'🤖 SahayaAI से पूछें',save:'योजना सेव करें',my:'मेरी सेव की योजनाएँ',docs:'ज़रूरी दस्तावेज़'},
 te:{hero:'మీ భాషలో ప్రభుత్వ పథకాలు.',sub:'మీకు రావాల్సిన డబ్బు & ప్రయోజనాలు సులభంగా తెలుసుకోండి — ఉచితం, ఏజెంట్ అవసరం లేదు.',login:'లాగిన్',signup:'సైన్ అప్',sample:'🌾 నమూనా రైతు ప్రొఫైల్',listen:'🔊 వినండి',askAI:'🤖 SahayaAI అడగండి',save:'పథకం సేవ్ చేయండి',my:'నా సేవ్ చేసిన పథకాలు',docs:'అవసరమైన పత్రాలు'},
}
const FALLBACK=[
 {id:'pm-kisan',title:'PM-KISAN Samman Nidhi',emoji:'🌾',benefit:'₹6,000 / year',occupations:['Small Farmer'],incomeMax:200000,states:['All India'],desc:'₹2,000 every 4 months directly to bank for farmer families.',docs:['Aadhaar Card','Land Records','Bank Passbook']},
 {id:'vishwakarma',title:'PM Vishwakarma',emoji:'🛠️',benefit:'Loan @5% + ₹15,000',occupations:['Artisan','Small Farmer','Daily Wage Worker'],incomeMax:300000,states:['All India'],desc:'Training, toolkit money and cheap loan for artisans.',docs:['Aadhaar Card','Ration Card','Bank Passbook']},
 {id:'eshram',title:'e-Shram Card',emoji:'🪪',benefit:'₹2 Lakh insurance',occupations:['Daily Wage Worker','Artisan','Small Farmer','Woman'],incomeMax:180000,states:['All India'],desc:'Free registration + accident insurance for unorganised workers.',docs:['Aadhaar Card','Bank Account']},
 {id:'gruha',title:'Gruha Lakshmi',emoji:'👩',benefit:'₹2,000 / month',occupations:['Woman'],incomeMax:250000,states:['Karnataka'],desc:'Monthly help to woman head of family in Karnataka.',docs:['Aadhaar Card','Ration Card','Bank Account']},
]
async function api(path,opts={},token){ const r=await fetch(API+path,{...opts,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})}}); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d.error||'Something went wrong'); return d }

export default function App(){
 const [lang,setLang]=useState('en'); const [font,setFont]=useState(16); const t=T[lang]
 const [token,setToken]=useState(localStorage.getItem('sahaya_token')||''); const [user,setUser]=useState(JSON.parse(localStorage.getItem('sahaya_user')||'null'))
 const [authForm,setAuthForm]=useState({full_name:'',email:'',password:''}); const [isSignup,setIsSignup]=useState(true); const [msg,setMsg]=useState('')
 const [profile,setProfile]=useState({occupation:'Small Farmer',state:'Karnataka',income:120000,language:'English'})
 const [schemes,setSchemes]=useState(FALLBACK); const [items,setItems]=useState([]); const [ai,setAi]=useState(null); const [busy,setBusy]=useState(false)
 const [form,setForm]=useState({title:'',description:'',ai_summary:''}); const [editId,setEditId]=useState(null)

 useEffect(()=>{ api('/api/schemes').then(d=>Array.isArray(d)&&setSchemes(d)).catch(()=>{}) },[])
 useEffect(()=>{ if(token) loadItems() },[token])
 const eligible=useMemo(()=>schemes.filter(s=>{const inc=Number(profile.income)||0; return (!s.occupations||s.occupations.includes(profile.occupation))&&(inc<= (s.incomeMax||9999999))&&(s.states?.includes('All India')||s.states?.includes(profile.state))}),[schemes,profile])
 const display=eligible.length?eligible:schemes

 async function loadItems(){ try{ setItems(await api('/api/items',{},token)) }catch(e){ setMsg(e.message)} }
 async function doAuth(e){ e.preventDefault(); try{ const d=await api(isSignup?'/api/auth/signup':'/api/auth/login',{method:'POST',body:JSON.stringify(authForm)}); setToken(d.token); setUser(d.user); localStorage.setItem('sahaya_token',d.token); localStorage.setItem('sahaya_user',JSON.stringify(d.user)); setMsg('Welcome '+d.user.full_name+' ✅') }catch(e){ setMsg('⚠️ '+e.message)} }
 async function demo(){ setAuthForm({full_name:'Demo Farmer',email:'demo@example.com',password:'demo1234'}); try{ const d=await api('/api/auth/login',{method:'POST',body:JSON.stringify({email:'demo@example.com',password:'demo1234'})}); setToken(d.token); setUser(d.user); localStorage.setItem('sahaya_token',d.token); localStorage.setItem('sahaya_user',JSON.stringify(d.user)); setProfile({occupation:'Small Farmer',state:'Karnataka',income:120000,language:LANGS[lang].label}); setMsg('Demo profile loaded 🌾') }catch(e){ setMsg('⚠️ Start backend or Sign Up first: '+e.message)} }
 function logout(){ setToken('');setUser(null);setItems([]);localStorage.removeItem('sahaya_token');localStorage.removeItem('sahaya_user') }
 function speak(text){ try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang=LANGS[lang].speech; u.rate=.92; speechSynthesis.speak(u)}catch{alert('Listen not supported on this browser')} }
 function voiceInput(){ const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR) return alert('Voice input: please use Chrome on Android'); const r=new SR(); r.lang=LANGS[lang].speech; r.onresult=e=>{ const txt=e.results[0][0].transcript; setForm(f=>({...f,description:(f.description+' '+txt).trim()})) }; r.start() }
 async function askAI(){ if(!token) return setMsg('⚠️ Please login / sign up first, then Ask AI'); setBusy(true); try{ const d=await api('/api/ai/generate',{method:'POST',body:JSON.stringify({...profile,name:user?.full_name,language:LANGS[lang].label})},token); setAi(d); speak(d.summary) }catch(e){setMsg('⚠️ '+e.message)} finally{setBusy(false)} }
 async function saveItem(payload){ if(!token) return setMsg('⚠️ Login first to save'); try{ if(editId){ await api('/api/items/'+editId,{method:'PUT',body:JSON.stringify(payload)},token); setEditId(null)} else await api('/api/items',{method:'POST',body:JSON.stringify(payload)},token); setForm({title:'',description:'',ai_summary:''}); loadItems() }catch(e){setMsg('⚠️ '+e.message)} }

 return <div style={{fontSize:font}} className="min-h-screen">
  <header className="sticky top-0 z-20 glass"><div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-2 items-center justify-between">
   <div className="font-black text-xl">🌾 Sahaya<span className="text-emerald-600">AI</span></div>
   <div className="flex gap-1 flex-wrap items-center">
    {Object.entries(LANGS).map(([k,v])=><button key={k} onClick={()=>setLang(k)} className={`px-2 py-1 rounded-full text-sm font-bold ${lang===k?'bg-emerald-600 text-white':'bg-white border'}`}>{v.label}</button>)}
    <button onClick={()=>setFont(Math.max(14,font-1))} className="bg-white border px-2 py-1 rounded-full font-bold">A-</button>
    <button onClick={()=>setFont(Math.min(22,font+1))} className="bg-white border px-2 py-1 rounded-full font-bold">A+</button>
    {user?<><span className="text-sm font-bold hidden sm:inline">👋 {user.full_name}</span><button onClick={logout} className="bg-slate-900 text-white px-3 py-1 rounded-full text-sm">Logout</button></>:null}
   </div></div></header>

  <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
   <section className="rounded-3xl p-6 text-white bg-gradient-to-br from-emerald-600 via-teal-600 to-sky-600 shadow-xl">
    <h1 className="text-3xl sm:text-5xl font-black leading-tight">{t.hero}</h1><p className="mt-2 text-emerald-50 font-semibold">{t.sub}</p>
    <div className="flex gap-2 flex-wrap mt-4"><button onClick={demo} className="btn bg-white text-emerald-700">{t.sample}</button><button onClick={()=>speak(t.hero+' '+t.sub)} className="btn bg-emerald-900/40 border border-white/40">{t.listen}</button></div>
    <div className="grid grid-cols-3 gap-2 mt-5 text-center"><div className="bg-white/15 rounded-2xl p-3"><b>8+</b><br/><small>Schemes</small></div><div className="bg-white/15 rounded-2xl p-3"><b>4</b><br/><small>Languages</small></div><div className="bg-white/15 rounded-2xl p-3"><b>₹0</b><br/><small>Free / No agent</small></div></div>
   </section>
   {msg&&<div className="glass rounded-2xl p-3 font-bold">{msg}</div>}

   {!user&&<section className="glass rounded-3xl p-5">
    <h2 className="font-black text-xl">{isSignup?t.signup:t.login}</h2>
    <form onSubmit={doAuth} className="grid sm:grid-cols-4 gap-2 mt-3">
     {isSignup&&<input required placeholder="Full name" className="border rounded-xl p-3 bg-white" value={authForm.full_name} onChange={e=>setAuthForm({...authForm,full_name:e.target.value})}/>}
     <input required type="email" placeholder="Email" className="border rounded-xl p-3 bg-white" value={authForm.email} onChange={e=>setAuthForm({...authForm,email:e.target.value})}/>
     <input required type="password" placeholder="Password (6+)" className="border rounded-xl p-3 bg-white" value={authForm.password} onChange={e=>setAuthForm({...authForm,password:e.target.value})}/>
     <button className="btn bg-emerald-600 text-white">{isSignup?t.signup:t.login}</button>
    </form>
    <button onClick={()=>setIsSignup(!isSignup)} className="text-emerald-700 font-bold mt-2 text-sm">{isSignup?'Already have account? Login':'New user? Sign Up'} • Demo: demo@example.com / demo1234</button>
   </section>}

   <section className="glass rounded-3xl p-5"><h2 className="font-black text-xl">👤 Your Profile</h2>
    <div className="grid sm:grid-cols-4 gap-2 mt-3">
     <select className="border rounded-xl p-3 bg-white" value={profile.occupation} onChange={e=>setProfile({...profile,occupation:e.target.value})}><option>Small Farmer</option><option>Artisan</option><option>Daily Wage Worker</option><option>Woman</option></select>
     <select className="border rounded-xl p-3 bg-white" value={profile.state} onChange={e=>setProfile({...profile,state:e.target.value})}><option>Karnataka</option><option>Andhra Pradesh</option><option>Telangana</option><option>Tamil Nadu</option><option>Maharashtra</option><option>Uttar Pradesh</option></select>
     <input type="number" className="border rounded-xl p-3 bg-white" placeholder="Annual income ₹" value={profile.income} onChange={e=>setProfile({...profile,income:e.target.value})}/>
     <button disabled={busy} onClick={askAI} className="btn bg-violet-600 text-white">{busy?'Thinking…':t.askAI}</button>
    </div>
    {ai&&<div className="mt-4 bg-violet-50 border border-violet-200 rounded-2xl p-4"><div className="flex justify-between gap-2"><b>🤖 SahayaAI says</b><button onClick={()=>speak(ai.summary)}>🔊</button></div><p className="mt-1 leading-relaxed">{ai.summary}</p><p className="font-bold mt-2">{t.docs}:</p><div className="flex flex-wrap gap-1 mt-1">{ai.checklist?.map((d,i)=><span key={i} className="bg-white border rounded-full px-2 py-1 text-sm">✅ {d}</span>)}</div><small className="text-slate-500">{ai.source} • {ai.tip||''}</small>
    <button onClick={()=>saveItem({title:'AI Checklist - '+profile.occupation,description:ai.eligible?.map(s=>s.title).join(', '),ai_summary:ai.summary})} className="btn bg-emerald-600 text-white mt-3 w-full">{t.save}</button></div>}
   </section>

   <section><h2 className="font-black text-2xl">🎁 {eligible.length} schemes for you</h2><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
    {display.map(s=><article key={s.id} className="glass rounded-3xl p-4 flex flex-col gap-2"><div className="text-4xl">{s.emoji}</div><h3 className="font-black text-lg leading-tight">{s.title}</h3><span className="bg-emerald-100 text-emerald-800 font-black rounded-full px-2 py-1 text-sm w-fit">{s.benefit}</span><p className="text-slate-600">{s.desc}</p><p className="text-sm"><b>{t.docs}:</b> {s.docs?.join(', ')}</p><div className="flex gap-2 mt-auto"><button onClick={()=>speak(s.title+'. '+s.benefit+'. '+s.desc)} className="btn bg-sky-600 text-white flex-1">{t.listen}</button><button onClick={()=>saveItem({title:s.title,description:s.desc,ai_summary:s.benefit+' | Docs: '+(s.docs||[]).join(', ')})} className="btn bg-emerald-600 text-white flex-1">{t.save}</button></div></article>)}
   </div></section>

   <section className="glass rounded-3xl p-5"><h2 className="font-black text-xl">{t.my}</h2>
    <div className="grid gap-2 mt-3"><input placeholder="Scheme title" className="border rounded-xl p-3 bg-white" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
    <div className="flex gap-2"><textarea placeholder="Notes / documents…" className="border rounded-xl p-3 bg-white flex-1" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><button onClick={voiceInput} className="btn bg-rose-600 text-white">🎤 Voice</button></div>
    <button onClick={()=>saveItem(form)} className="btn bg-slate-900 text-white">{editId?'Update':'Add'} ✓</button></div>
    <div className="grid sm:grid-cols-2 gap-3 mt-4">{items.map(it=><div key={it.id} className="bg-white border rounded-2xl p-4"><b>{it.title}</b><p className="text-slate-600 text-sm mt-1">{it.description}</p><p className="text-sm bg-slate-50 rounded-xl p-2 mt-2">{it.ai_summary}</p><div className="flex gap-2 mt-3"><button onClick={()=>speak(it.title+'. '+it.ai_summary)} className="text-sky-700 font-bold">🔊 Listen</button><button onClick={()=>{setEditId(it.id);setForm(it);window.scrollTo({top:600,behavior:'smooth'})}} className="text-amber-700 font-bold">✏️ Edit</button><button onClick={async()=>{await api('/api/items/'+it.id,{method:'DELETE'},token);loadItems()}} className="text-rose-700 font-bold">🗑️ Delete</button></div></div>)}</div>
    {!items.length&&<p className="text-slate-500 mt-3">No saved schemes yet. Login → tap “Save Scheme”.</p>}
   </section>
   <footer className="text-center text-slate-500 text-sm pb-6">SahayaAI • Free help • Never pay an agent for free government schemes • Made for rural India 🇮🇳</footer>
  </main></div>
}
