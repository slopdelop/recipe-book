import test from 'node:test';import assert from 'node:assert/strict';import {DatabaseSync} from 'node:sqlite';import fs from 'node:fs';import worker,{tokenHash} from './worker.js';
const token='a'.repeat(64),other='b'.repeat(64),endpoint='https://example.test/sync';
async function setup(){const db=new DatabaseSync(':memory:');db.exec(fs.readFileSync(new URL('schema.sql',import.meta.url),'utf8'));db.prepare('INSERT INTO recipe_libraries(id,token_hash) VALUES (?,?)').run('main',await tokenHash(token));const env={DB:{prepare(sql){let args=[];return {bind(...values){args=values;return this;},async first(){return db.prepare(sql).get(...args)||null;},async run(){const result=db.prepare(sql).run(...args);return {meta:{changes:result.changes}};}};}}};return {db,env};}
const request=(method,code=token,body,origin='https://slopdelop.github.io')=>new Request(endpoint,{method,headers:{Origin:origin,Authorization:'Bearer '+code,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});
const empty=()=>({version:1,journals:{},hidden:[]});
test('only the recipe credential accesses the recipe library',async()=>{const {env}=await setup();assert.equal((await worker.fetch(request('GET'),env)).status,200);assert.equal((await worker.fetch(request('GET',other),env)).status,401);assert.equal((await worker.fetch(request('GET','not-a-code'),env)).status,401);});
test('origin, methods and payload validation reject unsafe requests',async()=>{const {env}=await setup();assert.equal((await worker.fetch(request('GET',token,null,'https://untrusted.test'),env)).status,403);assert.equal((await worker.fetch(request('DELETE'),env)).status,405);assert.equal((await worker.fetch(request('PUT',token,{revision:0,data:{version:1,machines:[],sets:[]}}),env)).status,400);});
test('compare-and-swap prevents two computers overwriting the same revision',async()=>{const {env}=await setup();const responses=await Promise.all([worker.fetch(request('PUT',token,{revision:0,data:empty()}),env),worker.fetch(request('PUT',token,{revision:0,data:{...empty(),hidden:['onions']}}),env)]);assert.deepEqual(responses.map(r=>r.status).sort(),[200,409]);const data=await (await worker.fetch(request('GET'),env)).json();assert.equal(data.revision,1);});
test('private responses are never cached and allow the published origin',async()=>{const {env}=await setup(),response=await worker.fetch(request('GET'),env);assert.equal(response.headers.get('Cache-Control'),'no-store');assert.equal(response.headers.get('Access-Control-Allow-Origin'),'https://slopdelop.github.io');});

test('collection choices and explicit reversals round trip through the cloud',async()=>{
  const {env}=await setup(),promotions={squash:{promoted:true,updatedAt:'2026-11-24T10:00:00.000Z'}};
  assert.equal((await worker.fetch(request('PUT',token,{revision:0,data:{...empty(),promotions}}),env)).status,200);
  assert.deepEqual((await (await worker.fetch(request('GET'),env)).json()).data.promotions,promotions);
  promotions.squash={promoted:false,updatedAt:'2026-11-24T11:00:00.000Z'};
  assert.equal((await worker.fetch(request('PUT',token,{revision:1,data:{...empty(),promotions}}),env)).status,200);
  assert.equal((await (await worker.fetch(request('GET'),env)).json()).data.promotions.squash.promoted,false);
});

test('old client PUTs cannot erase richer collection choices',async()=>{
  const {env}=await setup(),promotions={squash:{promoted:false,updatedAt:'2026-11-24T10:00:00.000Z'}};
  await worker.fetch(request('PUT',token,{revision:0,data:{...empty(),promotions}}),env);
  const legacyWrite={...empty(),hidden:['mushrooms']};
  assert.equal((await worker.fetch(request('PUT',token,{revision:1,data:legacyWrite}),env)).status,200);
  const saved=await (await worker.fetch(request('GET'),env)).json();
  assert.deepEqual(saved.data.promotions,promotions);assert.deepEqual(saved.data.hidden,['mushrooms']);
});

test('old client compare-and-swap still protects concurrent new choices',async()=>{
  const {env}=await setup(),promotions={squash:{promoted:true,updatedAt:'2026-11-24T10:00:00.000Z'}};
  await worker.fetch(request('PUT',token,{revision:0,data:{...empty(),promotions}}),env);
  assert.equal((await worker.fetch(request('PUT',token,{revision:0,data:empty()}),env)).status,409);
  assert.deepEqual((await (await worker.fetch(request('GET'),env)).json()).data.promotions,promotions);
});

test('invalid collection choices do not replace cloud data',async()=>{
  const {env}=await setup();
  assert.equal((await worker.fetch(request('PUT',token,{revision:0,data:{...empty(),promotions:{squash:{promoted:'true',updatedAt:'bad'}}}}),env)).status,400);
  assert.equal((await (await worker.fetch(request('GET'),env)).json()).revision,0);
});
