const test=require('node:test'),assert=require('node:assert/strict'),S=require('../sync-state.js');
const first='2026-10-26T10:00:00.000Z',later='2026-10-26T10:01:00.000Z',last='2026-10-26T10:02:00.000Z';
const entry=(id,text)=>({id,text,createdAt:first,updatedAt:first});
const doc=(notes=[],cooks=[],hidden=[])=>({version:1,journals:{squash:{notes,cooks}},hidden,promotions:{}});
const cook=()=>({...entry('cook','Original'),cookedAt:first,rating:3});
test('two offline computers add notes without overwriting either',()=>{const merged=S.merge(doc(),doc([entry('a','A')]),doc([entry('b','B')]));assert.deepEqual(merged.value.journals.squash.notes.map(n=>n.text),['A','B']);assert.equal(merged.conflicts,0);});
test('rating and text changes on the same cook merge field by field',()=>{const original=cook(),base=doc([],[original]),local=doc([],[{...original,rating:5,updatedAt:later}]),remote=doc([],[{...original,text:'Less salt',updatedAt:last}]);const out=S.merge(base,local,remote);assert.equal(out.conflicts,0);assert.equal(out.value.journals.squash.cooks[0].text,'Less salt');assert.equal(out.value.journals.squash.cooks[0].rating,5);});
test('conflicting text preserves both versions with an explicit conflict label',()=>{const n=entry('n','Original'),base=doc([n]),local=doc([{...n,text:'From A',updatedAt:later}]),remote=doc([{...n,text:'From B',updatedAt:last}]);const a=S.merge(base,local,remote),b=S.merge(base,remote,local);assert.equal(a.conflicts,1);assert.equal(a.value.journals.squash.notes.length,2);assert.deepEqual(a.value,b.value);assert.ok(a.value.journals.squash.notes.some(n=>n.syncConflict));assert.deepEqual(new Set(a.value.journals.squash.notes.map(n=>n.text)),new Set(['From A','From B']));assert.deepEqual(S.merge(a.value,a.value,a.value).value,a.value);});
test('conflicting ratings keep a clearly marked alternate cooking record',()=>{const c=cook(),base=doc([],[c]),a=doc([],[{...c,rating:1,updatedAt:later}]),b=doc([],[{...c,rating:5,updatedAt:last}]);const out=S.merge(base,a,b);assert.deepEqual(new Set(out.value.journals.squash.cooks.map(c=>c.rating)),new Set([1,5]));});
test('deletion versus stale unchanged copy stays deleted',()=>{const n=entry('n','Original'),base=doc([n]),deleted=doc([{...n,deletedAt:later,updatedAt:later}]);const out=S.merge(base,base,deleted);assert.equal(out.value.journals.squash.notes.length,1);assert.equal(out.value.journals.squash.notes[0].deletedAt,later);});
test('deletion versus offline edit preserves edited text as conflict copy',()=>{const n=entry('n','Original'),base=doc([n]),deleted=doc([{...n,deletedAt:later,updatedAt:later}]),edited=doc([{...n,text:'Keep my edit',updatedAt:last}]);const out=S.merge(base,deleted,edited);assert.equal(out.value.journals.squash.notes.filter(n=>!n.deletedAt).length,1);assert.equal(out.value.journals.squash.notes.find(n=>!n.deletedAt).text,'Keep my edit');assert.ok(out.value.journals.squash.notes.find(n=>!n.deletedAt).syncConflict);});
test('hide and restore sync independently for each recipe',()=>{const base=doc([],[],['squash']),local=doc([],[],['onions']),remote=doc([],[],['squash','mushrooms']);assert.deepEqual(S.merge(base,local,remote).value.hidden,['mushrooms','onions']);});
test('an edit made while upload is in flight survives its acknowledgement',()=>{const n=entry('n','Before'),sent=doc([n]),current=doc([{...n,text:'Typed during upload',updatedAt:later}]);assert.equal(S.merge(sent,current,sent).value.journals.squash.notes[0].text,'Typed during upload');});
test('retry after a lost acknowledgement is idempotent',()=>{const current=doc([entry('n','Saved once')]),out=S.merge(doc(),current,current);assert.deepEqual(out.value,current);assert.equal(out.conflicts,0);});
test('workout payloads, invalid ratings and oversized fields are rejected',()=>{assert.throws(()=>S.validate({version:1,machines:[],sets:[]}));assert.throws(()=>S.validate(doc([],[{...cook(),rating:6}])));assert.throws(()=>S.validate(doc([entry('n','a'.repeat(10001))])));});

const promotion=(promoted,updatedAt=first)=>({promoted,updatedAt});
const choice=(id,record)=>({...doc(),promotions:{[id]:record}});

test('legacy v1 documents without collection choices still validate and merge',()=>{
  const legacy={version:1,journals:{},hidden:[]};assert.equal(S.validate(legacy),legacy);
  assert.deepEqual(S.merge(legacy,legacy,legacy).value,S.empty());
});

test('collection choices validate per-recipe state and reversal timestamps',()=>{
  assert.doesNotThrow(()=>S.validate(choice('squash',promotion(false))));
  for(const promotions of [null,[],{'bad/id':promotion(true)},{squash:{promoted:'yes',updatedAt:first}},{squash:{promoted:true,updatedAt:'not-a-date'}}])assert.throws(()=>S.validate({...doc(),promotions}));
});

test('two computers promote different recipes without losing either choice',()=>{
  const out=S.merge(doc(),choice('squash',promotion(true)),choice('mushrooms',promotion(true,later)));
  assert.deepEqual(out.value.promotions,{mushrooms:promotion(true,later),squash:promotion(true)});
});

test('mark to try again is a retained reversal and survives stale computers',()=>{
  const base=choice('squash',promotion(true)),reversed=choice('squash',promotion(false,later));
  assert.deepEqual(S.merge(base,reversed,base).value.promotions,reversed.promotions);
  assert.deepEqual(S.merge(base,base,reversed).value.promotions,reversed.promotions);
  const old={version:1,journals:{},hidden:[]};
  assert.deepEqual(S.merge(base,old,reversed).value.promotions,reversed.promotions);
});

test('concurrent opposite choices use actual timestamp order deterministically',()=>{
  const local=choice('squash',promotion(true,'2026-10-26T12:00:00-07:00'));
  const remote=choice('squash',promotion(false,'2026-10-26T18:30:00.000Z'));
  const a=S.merge(doc(),local,remote),b=S.merge(doc(),remote,local);
  assert.deepEqual(a.value,b.value);assert.equal(a.value.promotions.squash.promoted,true);
  const tie=choice('squash',promotion(false,'2026-10-26T19:00:00.000Z'));
  assert.equal(S.merge(doc(),local,tie).value.promotions.squash.promoted,false);
  assert.deepEqual(S.merge(doc(),local,tie).value,S.merge(doc(),tie,local).value);
});

test('in-flight promotion edits survive upload acknowledgement and retries converge',()=>{
  const sent=choice('squash',promotion(true)),current=choice('squash',promotion(false,later));
  const ack=S.merge(sent,current,sent).value;assert.deepEqual(ack.promotions,current.promotions);
  assert.deepEqual(S.merge(doc(),ack,ack).value,ack);
  assert.deepEqual(S.merge(ack,ack,ack).value,ack);
});
