import '../sync-state.js';
const S=globalThis.RecipeSyncState;
const ORIGINS=new Set(['https://slopdelop.github.io','http://127.0.0.1:4371','http://localhost:4371']);
export async function tokenHash(token){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token)))].map(n=>n.toString(16).padStart(2,'0')).join('');}
export default {async fetch(request,env){
  const origin=request.headers.get('Origin'),headers={'Cache-Control':'no-store','Vary':'Origin'};
  if(ORIGINS.has(origin))headers['Access-Control-Allow-Origin']=origin;
  const reply=(body,status=200)=>Response.json(body,{status,headers});
  if(origin&&!ORIGINS.has(origin))return reply({error:'Origin not allowed.'},403);
  if(new URL(request.url).pathname!=='/sync')return reply({error:'Not found.'},404);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'GET, PUT, OPTIONS','Access-Control-Allow-Headers':'Authorization, Content-Type'}});
  if(!['GET','PUT'].includes(request.method))return reply({error:'Method not allowed.'},405);
  const auth=request.headers.get('Authorization')||'';if(!/^Bearer [a-f0-9]{64}$/.test(auth))return reply({error:'Invalid recipe connection code.'},401);
  try{
    const hash=await tokenHash(auth.slice(7));
    const row=await env.DB.prepare('SELECT * FROM recipe_libraries WHERE token_hash = ?').bind(hash).first();
    if(!row)return reply({error:'Invalid recipe connection code.'},401);
    if(request.method==='GET')return reply({data:JSON.parse(row.payload),revision:row.revision,updatedAt:row.updated_at});
    if(Number(request.headers.get('Content-Length')||0)>2200000)return reply({error:'Recipe data is too large.'},413);
    const text=await request.text();if(new TextEncoder().encode(text).length>2200000)return reply({error:'Recipe data is too large.'},413);
    let body;try{body=JSON.parse(text);if(!Number.isSafeInteger(body.revision)||body.revision<0)throw Error();S.validate(body.data);}catch{return reply({error:'Invalid recipe sync data.'},400);}
    const updatedAt=new Date().toISOString();
    const result=await env.DB.prepare('UPDATE recipe_libraries SET payload = ?, revision = revision + 1, updated_at = ? WHERE id = ? AND revision = ?').bind(JSON.stringify(body.data),updatedAt,row.id,body.revision).run();
    if(result.meta.changes!==1)return reply({error:'Newer changes are available. Download and merge before retrying.'},409);
    return reply({revision:body.revision+1,updatedAt});
  }catch{return reply({error:'Recipe sync is temporarily unavailable.'},503);}
}};
