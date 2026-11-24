const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const S=require('../sync-state.js'),J=require('../journal-state.js');
const key='recipe-book:promotions:v1',first='2026-11-24T10:00:00.000Z',later='2026-11-24T11:00:00.000Z';
const choice=(promoted,updatedAt=first)=>({promoted,updatedAt});
function browser(initial={}){
  const data=structuredClone(initial),elements=new Map();let exported;
  const element=()=>({handlers:{},textContent:'',value:'',hidden:false,addEventListener(type,callback){this.handlers[type]=callback;},showModal(){this.open=true;},close(){this.open=false;},click(){}});
  const host=element();host.querySelector=selector=>{if(!elements.has(selector))elements.set(selector,element());return elements.get(selector);};
  const D={
    async transaction(keys,defaults,mutate){
      const values=Object.fromEntries(keys.map(k=>[k,structuredClone(Object.hasOwn(data,k)?data[k]:defaults[k])])),result=mutate(values)||{};
      for(const k of result.changed||[])data[k]=structuredClone(values[k]);
      return {values,result:result.result};
    },error:(status,error)=>status.textContent=error.message
  };
  const context={window:{recipes:[{id:'squash'}],retiredRecipeIds:['onions']},RecipeData:D,RecipeJournalState:J,RecipeSyncState:S,Blob,Date,Map,Set,structuredClone,setTimeout:()=>0,
    URL:{createObjectURL(blob){exported=blob;return 'blob:test';},revokeObjectURL(){}},
    document:{createElement:tag=>tag==='section'?host:element(),querySelector:()=>({append(){}})}
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../backup.js'),'utf8'),context);context.window.mountRecipeBackup();
  return {
    data,host,elements,
    async export(){const button=host.querySelector('[data-export]');await button.handlers.click({target:button});return JSON.parse(await exported.text());},
    async import(payload){const input=host.querySelector('input');input.files=[{size:JSON.stringify(payload).length,text:async()=>JSON.stringify(payload)}];await input.handlers.change({target:input});},
    async confirm(){const button=host.querySelector('[data-merge]');await button.handlers.click({target:button});}
  };
}
const backup=promotions=>({format:'recipe-book-backup',version:1,journals:{squash:{notes:[],cooks:[]}},hidden:[],...(promotions===undefined?{}:{promotions})});

test('backup export includes positive and reversed collection choices',async()=>{
  const promotions={squash:choice(true),onions:choice(false,later)},b=browser({[key]:promotions});
  const out=await b.export();assert.deepEqual(out.promotions,promotions);assert.equal(out.version,1);
});

test('legacy backups remain importable and leave collection choices intact',async()=>{
  const promotions={squash:choice(true)},b=browser({[key]:promotions});
  await b.import(backup());assert.equal(b.host.querySelector('dialog').open,true);await b.confirm();
  assert.deepEqual(b.data[key],promotions);
});

test('newer reversals import, stale promotions cannot undo them, and retries are idempotent',async()=>{
  const b=browser({[key]:{squash:choice(true)}}),reversed=backup({squash:choice(false,later)});
  await b.import(reversed);await b.confirm();assert.deepEqual(b.data[key],reversed.promotions);
  await b.import(backup({squash:choice(true)}));await b.confirm();assert.deepEqual(b.data[key],reversed.promotions);
  await b.import(reversed);await b.confirm();assert.deepEqual(b.data[key],reversed.promotions);
});

test('invalid and unknown-recipe collection choices are rejected before import',async()=>{
  const original={squash:choice(true)},b=browser({[key]:original});
  await b.import(backup({squash:{promoted:true,updatedAt:'not-a-date'}}));
  assert.match(b.host.querySelector('.backup-status').textContent,/Invalid recipe promotion/);assert.notEqual(b.host.querySelector('dialog').open,true);assert.deepEqual(b.data[key],original);
  await b.import(backup({missing:choice(true)}));assert.match(b.host.querySelector('.backup-status').textContent,/recipes not in this book/);assert.deepEqual(b.data[key],original);
});
