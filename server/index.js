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
function optionalAuth(req,res,next){ const h=req.headers.authorization||''; const t=h.startsWith('Bearer ')?h.slice(7):null; if(t){ try{req.user=jwt.verify(t,process.env.JWT_SECRET||'dev-secret')}catch{} } next(); }
app.post('/api/ai/generate',optionalAuth,async(req,res)=>{
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
// ---- AI Chat (ChatGPT-style assistant; Gemini when configured, honest local fallback otherwise) ----
async function geminiText(prompt, maxTokens=500){
 const key=process.env.GEMINI_API_KEY; if(!key) return null;
 const models=[process.env.GEMINI_MODEL||'gemini-3.8-flash', process.env.GEMINI_FALLBACK_MODEL||'gemini-3.1-flash-lite'];
 for(const model of models){
  try{ const ctrl=new AbortController(); const to=setTimeout(()=>ctrl.abort(),30000);
   const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{method:'POST',signal:ctrl.signal,headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:maxTokens,thinkingConfig:{thinkingBudget:0}}})});
   clearTimeout(to); const data=await r.json(); const text=data?.candidates?.[0]?.content?.parts?.map(p=>p.text).filter(Boolean).join(' ')||''; if(text) return {text,model};
  }catch(e){ continue; }
 }
 return null;
}
app.post('/api/ai/chat',optionalAuth,async(req,res)=>{
 const {message,language,state,occupation}=req.body||{};
 if(!message||String(message).trim().length<2) return res.status(400).json({error:'Please type or speak a question'});
 const lower=String(message).toLowerCase();
 const matched=SCHEMES.filter(s=>lower.includes(s.title.toLowerCase().split(' ')[0].toLowerCase())||s.occupations.some(o=>lower.includes(o.toLowerCase()))||(s.cat&&lower.includes(s.cat))).slice(0,3);
 const recs=(matched.length?matched:SCHEMES.filter(s=>!occupation||s.occupations.includes(occupation)).slice(0,3));
 const localReply=`I can help with government schemes in simple ${language||'English'}. Based on your question, look at: ${recs.map(s=>`${s.title} (${s.benefit})`).join('; ')}. Carry Aadhaar, bank passbook and relevant land/income papers to Grama One/CSC. Registration for government schemes is free — please confirm final eligibility on the official portal, as I cannot give official approval.`;
 const prompt=`You are SahayaAI, a friendly Indian government-scheme assistant. Reply in simple ${language||'English'}, max 130 words, easy words for farmers and senior citizens. Question: "${message}". Relevant verified schemes from our directory: ${recs.map(s=>`${s.title} - ${s.benefit} - docs: ${s.docs.join(', ')}`).join(' | ')}. Explain benefits, who may qualify, documents and next step. End by saying final approval is only by the government.`;
 const g=await geminiText(prompt,450);
 res.json({reply:g?g.text:localReply,source:g?`Gemini ${g.model}`:'Local assistant (Gemini unavailable)',schemes:recs.map(s=>({title:s.title,benefit:s.benefit}))});
});

// ---- Database-backed custom schemes (admin-managed, scalable registry) ----
const memCustom=[];
function shapeCustom(r){ return {id:r.id,name:r.name,level:r.level||'State',state:r.state||'',department:r.department||'',category:r.category||'Social Welfare',description:r.description||'',eligibility:r.eligibility||'Verification Pending',benefits:r.benefits||'',docs:Array.isArray(r.documents)?r.documents:[],apply:r.official_url||'',source_url:r.source_url||'',last_verified:r.last_verified||null,status:r.status||'Verification Pending',origin:r.level==='Central'?'Central Govt':(r.state||'State')+' State',custom:true}; }
app.get('/api/schemes/custom',async(req,res)=>{
 const {state,category,search,page=1,limit=100}=req.query||{};
 if(supabase){ let q=supabase.from('custom_schemes').select('*').order('created_at',{ascending:false}).range((page-1)*limit, page*limit-1);
  if(state) q=q.eq('state',state); if(category) q=q.eq('category',category); if(search) q=q.ilike('name',`%${search}%`);
  const {data,error}=await q; if(error) return res.status(500).json({error:error.message}); return res.json((data||[]).map(shapeCustom)); }
 let out=memCustom.map(shapeCustom); if(state)out=out.filter(s=>s.state===state); if(category)out=out.filter(s=>s.category===category); if(search)out=out.filter(s=>s.name.toLowerCase().includes(String(search).toLowerCase())); res.json(out.slice((page-1)*limit,page*limit));
});
function adminOnly(req,res,next){ const allow=(process.env.ADMIN_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean); if(!allow.includes((req.user.email||'').toLowerCase())) return res.status(403).json({error:'Admin access only. Ask the portal owner to add your email to ADMIN_EMAILS on the server.'}); next(); }
app.post('/api/admin/schemes',auth,adminOnly,async(req,res)=>{
 const b=req.body||{}; if(!b.name||!b.official_url) return res.status(400).json({error:'Scheme name and official application URL are required. Do not add unverified links.'});
 const row={name:b.name,level:b.level||'State',state:b.state||'',department:b.department||'',category:b.category||'Social Welfare',description:b.description||'',eligibility:b.eligibility||'Verification Pending',benefits:b.benefits||'',documents:Array.isArray(b.documents)?b.documents:[],official_url:b.official_url,source_url:b.source_url||'',last_verified:b.last_verified||null,status:b.status||'Verification Pending'};
 if(supabase){ const {data,error}=await supabase.from('custom_schemes').insert(row).select().single(); if(error) return res.status(500).json({error:error.message}); return res.json(shapeCustom(data)); }
 const item={id:'c-'+Date.now(),...row}; memCustom.unshift(item); res.json(shapeCustom(item));
});
app.put('/api/admin/schemes/:id',auth,adminOnly,async(req,res)=>{
 const b=req.body||{}; const row={name:b.name,level:b.level,state:b.state,department:b.department,category:b.category,description:b.description,eligibility:b.eligibility,benefits:b.benefits,documents:b.documents,official_url:b.official_url,source_url:b.source_url,last_verified:b.last_verified||null,status:b.status,updated_at:new Date().toISOString()};
 Object.keys(row).forEach(k=>row[k]===undefined&&delete row[k]);
 if(supabase){ const {data,error}=await supabase.from('custom_schemes').update(row).eq('id',req.params.id).select().single(); if(error) return res.status(500).json({error:error.message}); return res.json(shapeCustom(data)); }
 const it=memCustom.find(x=>x.id===req.params.id); if(!it) return res.status(404).json({error:'Not found'}); Object.assign(it,row); res.json(shapeCustom(it));
});
app.delete('/api/admin/schemes/:id',auth,adminOnly,async(req,res)=>{
 if(supabase){ const {error}=await supabase.from('custom_schemes').delete().eq('id',req.params.id); if(error) return res.status(500).json({error:error.message}); return res.json({ok:true}); }
 const i=memCustom.findIndex(x=>x.id===req.params.id); if(i>=0)memCustom.splice(i,1); res.json({ok:true});
});

// ---- Central scheme registry (directory data; status stays Verification Pending until an admin verifies on the official source) ----
const CENTRAL_EXTRA=[
 {title:'PM Ujjwala Yojana',benefit:'Free LPG connection support',cat:'women',docs:['Aadhaar','Ration Card','Bank Account'],apply:'https://www.pmuy.gov.in',occupations:['Woman'],incomeMax:250000,states:['All India'],desc:'LPG connection support for adult women of eligible households.'},
 {title:'Sukanya Samriddhi Yojana',benefit:'Savings account for girl child',cat:'women',docs:['Girl Birth Certificate','Parent Aadhaar/PAN','Address Proof'],apply:'https://www.nsiindia.gov.in',occupations:['Woman'],incomeMax:9999999,states:['All India'],desc:'Deposit account for a girl child at post office/bank.'},
 {title:'National Scholarship Portal Schemes',benefit:'Scholarships for students',cat:'farming',docs:['Aadhaar','Previous Marks Card','Income Certificate','Bank Account'],apply:'https://scholarships.gov.in',occupations:['Small Farmer','Artisan','Daily Wage Worker','Woman'],incomeMax:9999999,states:['All India'],desc:'Central scholarship application portal for eligible students.'},
 {title:'PM Mudra Yojana (PMMY)',benefit:'Business loans up to ₹20 lakh',cat:'wages',docs:['Aadhaar + PAN','Business Proof','Bank Statements'],apply:'https://www.mudra.org.in',occupations:['Artisan','Daily Wage Worker'],incomeMax:9999999,states:['All India'],desc:'Loans for non-farm micro/small enterprises via banks/NBFCs.'},
 {title:'Atal Pension Yojana',benefit:'Pension after age 60',cat:'pension',docs:['Aadhaar','Bank Savings Account','Mobile Number'],apply:'https://www.npscra.nsdl.co.in',occupations:['Daily Wage Worker','Artisan','Small Farmer','Woman'],incomeMax:9999999,states:['All India'],desc:'Guaranteed pension scheme for unorganised sector workers (enrol 18-40).'},
 {title:'PM SVANidhi',benefit:'Micro-loan for street vendors',cat:'wages',docs:['Aadhaar','Vendor Certificate/ID','Bank Account'],apply:'https://pmsvanidhi.mohua.gov.in',occupations:['Daily Wage Worker'],incomeMax:9999999,states:['All India'],desc:'Working-capital micro-loans for street vendors.'},
 {title:'National Social Assistance Programme (NSAP)',benefit:'Social pensions',cat:'pension',docs:['Aadhaar','Age Proof','BPL Ration Card','Bank Passbook'],apply:'https://nsap.nic.in',occupations:['Woman','Daily Wage Worker'],incomeMax:150000,states:['All India'],desc:'Old-age, widow and disability pensions for BPL households (with state top-ups).'},
 {title:'PM Jan Dhan Yojana (PMJDY)',benefit:'Zero-balance bank account',cat:'wages',docs:['Aadhaar','Address Proof','Passport Photo'],apply:'https://pmjdy.gov.in',occupations:['Small Farmer','Artisan','Daily Wage Worker','Woman'],incomeMax:9999999,states:['All India'],desc:'Basic savings bank account, RuPay card and financial inclusion.'},
];
app.get('/api/schemes/central',(req,res)=>res.json(CENTRAL_EXTRA.map((s,i)=>({id:'central-extra-'+i,...s,origin:'Central Govt',status:'Verification Pending',source_url:'https://myscheme.gov.in'}))));

// ---- Admin stats (secure: JWT + ADMIN_EMAILS allowlist on server) ----
app.get('/api/admin/stats',auth,adminOnly,async(req,res)=>{
 let users=null, items=null;
 if(supabase){ const u=await supabase.from('profiles').select('id',{count:'exact',head:true}); users=u.count; const i=await supabase.from('items').select('id',{count:'exact',head:true}); items=i.count; }
 else { users=memUsers.size; items=memItems.size; }
 res.json({totalUsers:users,totalSavedItems:items,totalSchemes:SCHEMES.length,statesCovered:6,languages:6,aiConfigured:!!process.env.GEMINI_API_KEY,supabase:hasSupabase,generatedAt:new Date().toISOString()});
});

app.listen(PORT,'0.0.0.0',()=>console.log(`🚀 SahayaAI server on ${PORT} | Supabase:${hasSupabase} Gemini:${!!process.env.GEMINI_API_KEY}`));
