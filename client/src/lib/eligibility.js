import {schemesFor} from '../data/schemes.js'
// Transparent rule-based matching (NOT official approval). Reasons/missing are derived
// only from the verified directory fields: occupation list, income ceiling, state coverage.
export function evaluateProfile(profile){
 const income=Number(profile.income)||0
 const age=Number(profile.age)||0
 return schemesFor(profile.state||'Karnataka').map(s=>{
  const reasons=[]; const missing=[]
  if(s.occupations?.includes(profile.occupation)) reasons.push(`Your occupation (${profile.occupation}) is listed for this scheme`)
  else missing.push(`Mainly for: ${(s.occupations||[]).join(', ')}`)
  if(income && income<=(s.incomeMax||Infinity)) reasons.push(`Family income ₹${income.toLocaleString('en-IN')} is within the ₹${(s.incomeMax||0).toLocaleString('en-IN')} limit in our directory`)
  else if(income) missing.push(`Directory income limit is ₹${(s.incomeMax||0).toLocaleString('en-IN')}/year; yours is ₹${income.toLocaleString('en-IN')}`)
  if(s.states?.includes('All India')) reasons.push('Central scheme — available in all states')
  else if(s.states?.includes(profile.state)) reasons.push(`State scheme for ${profile.state}`)
  if(s.cat==='pension'&&age>=60) reasons.push('You are 60+, the senior-citizen age group')
  if(s.cat==='pension'&&age&&age<60) missing.push('Usually needs age 60/65+ — please confirm on official portal')
  const score=Math.max(35,Math.min(98,Math.round((reasons.length/(reasons.length+missing.length||1))*100)))
  return {...s,score,reasons,missing:missing.length?missing:['No missing item found in our directory rules'],status:score>=75?'Likely Eligible':score>=50?'Possibly Eligible':'Less Likely'}
 }).sort((a,b)=>b.score-a.score)
}
