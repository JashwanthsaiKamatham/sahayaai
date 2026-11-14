require('dotenv').config();
const express=require('express'), cors=require('cors'), bcrypt=require('bcryptjs'), jwt=require('jsonwebtoken');
const {createClient}=require('@supabase/supabase-js');
const app=express();
const PORT=process.env.PORT||5000;
const CLIENT_URL=process.env.CLIENT_URL||'http://localhost:5173';
app.use(cors({origin:(o,cb)=>cb(null,true),credentials:true}));
app.use(express.json({limit:'1mb'}));

const hasSupabase=!!(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY);
let supabase=null;
let _hasSB=hasSupabase;
if(hasSupabase){ try{const WebSocket=require('ws'); global.WebSocket=WebSocket; supabase=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false},realtime:{transport:WebSocket},global:{WebSocket}}); console.log('✅ Supabase connected');}catch(e){console.log('Supabase init failed',e.message); supabase=null; _hasSB=false;} }
else console.log('⚠️ Demo mode: in-memory DB (add Supabase keys for production persistence)');

// In-memory fallback (works instantly, no keys needed)
const memUsers=new Map(), memItems=new Map();
const DEMO_ID='demo-user-id';
memUsers.set('demo@example.com',{id:DEMO_ID,email:'demo@example.com',full_name:'Demo Farmer',password_hash:bcrypt.hashSync('demo1234',10)});

const SCHEMES=[
 {id:'pm-kisan',title:'PM-KISAN Samman Nidhi',emoji:'🌾',benefit:'₹6,000 / year',occupations:['Small Farmer'],incomeMax:200000,states:['All India'],desc:'₹2,000 every 4 months directly to bank for land-holding farmer families.',docs:['Aadhaar Card','Land Records (RTC / Khata)','Bank Passbook','Mobile linked to Aadhaar']},
 {id:'vishwakarma',title:'PM Vishwakarma',emoji:'🛠️',benefit:'Loan @5% + ₹15,000 toolkit',occupations:['Artisan','Small Farmer','Daily Wage Worker'],incomeMax:300000,states:['All India'],desc:'For traditional artisans & craftspeople — training, toolkit money and cheap loan.',docs:['Aadhaar Card','Ration Card','Bank Passbook','Occupation Proof']},
 {id:'eshram',title:'e-Shram Card',emoji:'🪪',benefit:'₹2 Lakh insurance',occupations:['Daily Wage Worker','Artisan','Small Farmer','Woman'],incomeMax:180000,states:['All India'],desc:'Free registration for unorganised workers. Accident insurance up to ₹2 lakh.',docs:['Aadhaar Card','Bank Account','Mobile linked to Aadhaar']},
 {id:'gruha',title:'Gruha Lakshmi (Karnataka)',emoji:'👩',benefit:'₹2,000 / month',occupations:['Woman'],incomeMax:250000,states:['Karnataka'],desc:'Monthly help to woman head of family in Karnataka.',docs:['Aadhaar Card','Ration Card (BPL/APL)','Bank Account in woman name','Husband Aadhaar (if applicable)']},
 {id:'rythu',title:'Rythu Bharosa (AP)',emoji:'🚜',benefit:'₹13,500 / year',occupations:['Small Farmer'],incomeMax:200000,states:['Andhra Pradesh'],desc:'Investment support for farmers including tenant farmers in Andhra Pradesh.',docs:['Aadhaar Card','Pattadar Passbook / Land Record','Bank Passbook']},
 {id:'shakti',title:'Gruha Jyothi + Shakti',emoji:'💡',benefit:'Free bus + 200 units power',occupations:['Woman','Daily Wage Worker','Artisan','Small Farmer'],incomeMax:300000,states:['Karnataka','Telangana'],desc:'Free bus travel for women and free electricity up to 200 units for households.',docs:['Aadhaar Card','Electricity Bill / RR Number','Ration Card']},
 {id:'fasal',title:'PM Fasal Bima (Crop Insurance)',emoji:'🌦️',benefit:'Crop loss protection',occupations:['Small Farmer'],incomeMax:9999999,states:['All India'],desc:'Very low premium crop insurance. Get money if crop fails due to rain/drought.',docs:['Aadhaar Card','Land Records','Bank Passbook','Sowing Certificate']},
 {id:'kcc',title:'Kisan Credit Card',emoji:'💳',benefit:'Loan up to ₹3 Lakh @4%',occupations:['Small Farmer','Artisan'],incomeMax:300000,states:['All India'],desc:'Cheap farm loan for seeds, fertiliser and equipment.',docs:['Aadhaar + PAN','Land Records','Bank Passbook','Passport Photo']},
];
function auth(req,res,next){ const h=req.headers.authorization||''; const t=h.startsWith('Bearer ')?h.slice(7):null; if(!t) return res.status(401).json({error:'Please login first'}); try{req.user=jwt.verify(t,process.env.JWT_SECRET||'dev-secret'); next()}catch{return res.status(401).json({error:'Session expired, login again'})} }
function publicUser(u){return{id:u.id,email:u.email,full_name:u.full_name}}

app.get('/',(req,res)=>res.json({ok:true,app:'SahayaAI',supabase:hasSupabase,gemini:!!process.env.GEMINI_API_KEY,time:new Date().toISOString()}));
app.get('/api/health',(req,res)=>res.json({ok:true,supabase:hasSupabase,gemini:!!process.env.GEMINI_API_KEY,demoMode:!hasSupabase}));
app.get('/api/schemes',(req,res)=>res.json(SCHEMES));

app.post('/api/auth/signup',async(req,res)=>{
 try{ const {email,full_name,password}=req.body||{}; if(!email||!password||password.length<6) return res.status(400).json({error:'Email and 6+ character password required'});
 const em=email.toLowerCase().trim(); const hash=await bcrypt.hash(password,10);
 if(supabase){ const {data:ex}=await supabase.from('profiles').select('id').eq('email',em).maybeSingle(); if(ex) return res.status(409).json({error:'Account already exists. Please login.'});
  const {data,error}=await supabase.from('profiles').insert({email:em,full_name:full_name||'Sahaya User',password_hash:hash}).select().single(); if(error) throw error;
  const token=jwt.sign({id:data.id,email:em},process.env.JWT_SECRET,{expiresIn:'7d'}); return res.json({token,user:publicUser(data)}); }
 if(memUsers.has(em)) return res.status(409).json({error:'Account already exists. Please login.'});
 const user={id:'u-'+Date.now(),email:em,full_name:full_name||'Sahaya User',password_hash:hash}; memUsers.set(em,user);
 const token=jwt.sign({id:user.id,email:em},process.env.JWT_SECRET,{expiresIn:'7d'}); res.json({token,user:publicUser(user)}); }catch(e){res.status(500).json({error:e.message})}
});
app.post('/api/auth/login',async(req,res)=>{
 try{ const {email,password}=req.body||{}; const em=(email||'').toLowerCase().trim();
 let user=null;
 if(supabase){ const {data}=await supabase.from('profiles').select('*').eq('email',em).maybeSingle(); user=data; } else user=memUsers.get(em);
 if(!user) return res.status(401).json({error:'No account found. Please Sign Up first.'});
 const ok=await bcrypt.compare(password||'',user.password_hash); if(!ok) return res.status(401).json({error:'Wrong password'});
 const token=jwt.sign({id:user.id,email:em},process.env.JWT_SECRET,{expiresIn:'7d'}); res.json({token,user:publicUser(user)}); }catch(e){res.status(500).json({error:e.message})}
});
app.get('/api/auth/me',auth,(req,res)=>res.json({user:req.user}));
const memProfiles=new Map();
app.get('/api/profile',auth,async(req,res)=>{
 if(supabase){ const {data,error}=await supabase.from('profiles').select('id,email,full_name,state,district,preferred_language,age_group,occupation,income_range,is_farmer,landholding,created_at').eq('id',req.user.id).maybeSingle(); if(error) return res.status(500).json({error:error.message}); return res.json(data||{}); }
 res.json(memProfiles.get(req.user.id)||{occupation:'Small Farmer'});
});
app.put('/api/profile',auth,async(req,res)=>{
 const f=['state','district','preferred_language','age_group','occupation','income_range','is_farmer','landholding']; const upd={}; f.forEach(k=>{if(req.body&&k in req.body) upd[k]=req.body[k]});
 if(supabase){ const {data,error}=await supabase.from('profiles').update(upd).eq('id',req.user.id).select('id,email,full_name,state,district,preferred_language,age_group,occupation,income_range,is_farmer,landholding,created_at').single(); if(error) return res.status(500).json({error:error.message}); return res.json(data); }
 const cur={...(memProfiles.get(req.user.id)||{}),...upd,id:req.user.id}; memProfiles.set(req.user.id,cur); res.json(cur);
});

app.get('/api/items',auth,async(req,res)=>{
 if(supabase){ const {data,error}=await supabase.from('items').select('*').eq('user_id',req.user.id).order('created_at',{ascending:false}); if(error) return res.status(500).json({error:error.message}); return res.json(data||[]); }
 res.json([...memItems.values()].filter(x=>x.user_id===req.user.id).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)));
});
app.post('/api/items',auth,async(req,res)=>{
 const {title,description,ai_summary}=req.body||{}; if(!title) return res.status(400).json({error:'Title required'});
 if(supabase){ const {data,error}=await supabase.from('items').insert({user_id:req.user.id,title,description:description||'',ai_summary:ai_summary||''}).select().single(); if(error) return res.status(500).json({error:error.message}); return res.json(data); }
 const item={id:'i-'+Date.now(),user_id:req.user.id,title,description:description||'',ai_summary:ai_summary||'',created_at:new Date().toISOString()}; memItems.set(item.id,item); res.json(item);
});
app.put('/api/items/:id',auth,async(req,res)=>{
 const {title,description,ai_summary}=req.body||{};
 if(supabase){ const {data,error}=await supabase.from('items').update({title,description,ai_summary}).eq('id',req.params.id).eq('user_id',req.user.id).select().single(); if(error) return res.status(500).json({error:error.message}); return res.json(data); }
 const it=memItems.get(req.params.id); if(!it||it.user_id!==req.user.id) return res.status(404).json({error:'Not found'}); Object.assign(it,{title:title??it.title,description:description??it.description,ai_summary:ai_summary??it.ai_summary}); res.json(it);
});
app.delete('/api/items/:id',auth,async(req,res)=>{
 if(supabase){ const {error}=await supabase.from('items').delete().eq('id',req.params.id).eq('user_id',req.user.id); if(error) return res.status(500).json({error:error.message}); return res.json({ok:true}); }
 memItems.delete(req.params.id); res.json({ok:true});
});

// ---- AI ----
function localAI({occupation,state,income,language,name}){
 const inc=Number(income)||0;
 const eligible=SCHEMES.filter(s=>(!s.occupations||s.occupations.includes(occupation))&&(inc===0||inc<=s.incomeMax)&&(s.states.includes('All India')||s.states.includes(state)));
 const list=(eligible.length?eligible:SCHEMES.slice(0,3));
 const summary=`Namaste ${name||'friend'} 🙏 Based on your profile (${occupation||'Worker'}, ${state||'India'}, income ₹${inc||'—'}), you may be eligible for ${list.length} schemes: ${list.map(s=>s.title).join(', ')}. Take Aadhaar, Ration Card, Bank Passbook and Land/ Occupation proof to your nearest Grama One / CSC centre. Registration is FREE — do not pay any agent.`;
 const checklist=[...new Set(list.flatMap(s=>s.docs))];
 return {summary,eligible:list,checklist,tip:'Go on Tuesday–Friday morning to avoid crowd. Carry originals + 2 photocopies + passport photo.'};
}
app.post('/api/ai/generate',auth,async(req,res)=>{
 const body=req.body||{}; const fallback=localAI(body);
 const key=process.env.GEMINI_API_KEY;
 if(!key) return res.json({...fallback,source:'smart-local (add GEMINI_API_KEY for Gemini AI)'});
 try{
  const prompt=`You are SahayaAI, friendly rural welfare helper in India. Reply in simple everyday ${body.language||'English'}. Profile: name ${body.name||''}, occupation ${body.occupation}, state ${body.state}, annual income ${body.income}. Eligible schemes context: ${fallback.eligible.map(s=>s.title).join(', ')}. In max 120 words: 1) which schemes they likely qualify for and why 2) money/benefit 3) exact documents for Grama One/CSC 4) warn registration is free. Simple words, no jargon.`;
  const models=[process.env.GEMINI_MODEL||'gemini-3.8-flash', process.env.GEMINI_FALLBACK_MODEL||'gemini-3.1-flash-lite'];
  let lastErr='';
  for(const model of models){
    try{
      const ctrl=new AbortController(); const to=setTimeout(()=>ctrl.abort(),55000);
      const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{method:'POST',signal:ctrl.signal,headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:400,thinkingConfig:{thinkingBudget:0}}})});
      clearTimeout(to);
      const data=await r.json();
      const text=data?.candidates?.[0]?.content?.parts?.map(p=>p.text).filter(Boolean).join(' ')||'';
      if(!text){ lastErr=data?.error?.message||'empty'; continue; }
      return res.json({...fallback,summary:text,source:`Gemini ${model}`});
    }catch(e){ lastErr=e.message; continue; }
  }
  throw new Error(lastErr||'Gemini failed');
 }catch(e){ res.json({...fallback,source:'smart-local fallback',note:e.message}); }
});

(async()=>{ if(supabase){ try{ const {data}=await supabase.from('profiles').select('id').eq('email','demo@example.com').maybeSingle(); if(!data){ const hash=await bcrypt.hash('demo1234',10); await supabase.from('profiles').insert({email:'demo@example.com',full_name:'Demo Farmer',password_hash:hash}); console.log('🌱 Demo user seeded in Supabase'); } }catch(e){console.log('demo seed',e.message)} } })();
app.listen(PORT,'0.0.0.0',()=>console.log(`🚀 SahayaAI server on ${PORT} | Supabase:${hasSupabase} Gemini:${!!process.env.GEMINI_API_KEY}`));
