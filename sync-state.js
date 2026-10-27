// Three-way synchronization: the last downloaded document is the common base.
((root)=>{
  const empty=()=>({version:1,journals:{},hidden:[]});
  const date=v=>typeof v==='string'&&Number.isFinite(Date.parse(v));
  const recipeId=v=>typeof v==='string'&&/^[a-z0-9-]{1,100}$/.test(v);
  function validate(doc){
    if(!doc||doc.version!==1||!doc.journals||typeof doc.journals!=='object'||Array.isArray(doc.journals)||Object.keys(doc.journals).length>500||!Array.isArray(doc.hidden)||doc.hidden.length>500||doc.hidden.some(id=>!recipeId(id)))throw Error('Invalid recipe sync document.');
    let count=0;
    for(const [id,j] of Object.entries(doc.journals)){
      if(!recipeId(id)||!j||!Array.isArray(j.notes)||!Array.isArray(j.cooks))throw Error('Invalid recipe journal.');
      for(const kind of ['notes','cooks']){
        const seen=new Set();
        for(const e of j[kind]){
          if(!e||typeof e.id!=='string'||!e.id||e.id.length>160||seen.has(e.id)||typeof e.text!=='string'||e.text.length>10000||!date(e.createdAt)||(e.updatedAt&&!date(e.updatedAt))||(e.deletedAt&&!date(e.deletedAt))||(e.syncConflict&& (typeof e.syncConflict!=='string'||e.syncConflict.length>300)))throw Error('Invalid synced entry.');
          if(kind==='cooks'&&(!date(e.cookedAt)||!Number.isInteger(e.rating)||e.rating<0||e.rating>5))throw Error('Invalid synced cooking session.');
          seen.add(e.id);if(++count>10000)throw Error('Too many recipe journal entries.');
        }
      }
    }
    if(JSON.stringify(doc).length>2000000)throw Error('Recipe sync document is too large.');return doc;
  }
  const canonical=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
  const equal=(a,b)=>canonical(a)===canonical(b);
  const revision=e=>e?.updatedAt||e?.createdAt||'';
  function fingerprint(value){let a=2166136261,b=3339675911;for(const c of canonical(value)){a=Math.imul(a^c.charCodeAt(0),16777619);b=Math.imul(b^c.charCodeAt(0),2246822519);}return (a>>>0).toString(16)+(b>>>0).toString(16);}
  function merge(base,local,remote){
    [base,local,remote].forEach(validate);const result=empty();let conflicts=0;
    const recipeIds=new Set([...Object.keys(base.journals),...Object.keys(local.journals),...Object.keys(remote.journals)]);
    for(const recipe of [...recipeIds].sort()){
      const journal={notes:[],cooks:[]};result.journals[recipe]=journal;
      for(const kind of ['notes','cooks']){
        const map=doc=>new Map((doc.journals[recipe]?.[kind]||[]).map(e=>[e.id,e]));
        const B=map(base),L=map(local),R=map(remote),entries=new Map(),copies=[];
        for(const id of new Set([...B.keys(),...L.keys(),...R.keys()])){
          const b=B.get(id),l=L.get(id),r=R.get(id);
          if(!l||!r){entries.set(id,structuredClone(l||r||b));continue;}
          if(equal(l,r)){entries.set(id,structuredClone(l));continue;}
          if(equal(l,b)){entries.set(id,structuredClone(r));continue;}
          if(equal(r,b)){entries.set(id,structuredClone(l));continue;}
          const rank=e=>revision(e)+'|'+canonical(e),winner=rank(l)>rank(r)?l:r,loser=winner===l?r:l;
          const merged={...winner},fields=kind==='notes'?['text','deletedAt']:['text','rating','cookedAt','deletedAt'];const disputed=[];
          for(const field of fields){
            if(equal(l[field],r[field]))merged[field]=l[field];
            else if(equal(l[field],b?.[field]))merged[field]=r[field];
            else if(equal(r[field],b?.[field]))merged[field]=l[field];
            else{merged[field]=winner[field];disputed.push(field);}
            if(merged[field]===undefined)delete merged[field];
          }
          const deleteConflict=!!l.deletedAt!==!!r.deletedAt&&((l.deletedAt&&!equal(r,b))||(r.deletedAt&&!equal(l,b)));
          if(deleteConflict){merged.deletedAt=l.deletedAt||r.deletedAt;disputed.push('deletion');}
          merged.createdAt=b?.createdAt||[l.createdAt,r.createdAt].sort()[0];merged.updatedAt=[revision(l),revision(r)].sort().at(-1);
          entries.set(id,merged);
          if(disputed.length){
            const preserved=deleteConflict?(l.deletedAt?r:l):loser;
            const copy={...structuredClone(preserved),id:'conflict-'+fingerprint({recipe,kind,id,entry:preserved}),syncConflict:'Another computer changed this entry too. Preserved version; review alongside the original.'};delete copy.deletedAt;
            copies.push(copy);conflicts++;
          }
        }
        for(const copy of copies)if(!entries.has(copy.id))entries.set(copy.id,copy);
        journal[kind]=[...entries.values()].sort((a,b)=>a.id.localeCompare(b.id));
      }
    }
    for(const id of [...new Set([...base.hidden,...local.hidden,...remote.hidden])].sort()){
      const b=base.hidden.includes(id),l=local.hidden.includes(id),r=remote.hidden.includes(id);
      if(l===b?r:l)result.hidden.push(id);
    }
    return {value:validate(result),conflicts};
  }
  const api={empty,validate,merge,equal,canonical};root.RecipeSyncState=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
