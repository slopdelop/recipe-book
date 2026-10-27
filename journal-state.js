((root)=>{
  const date=value=>typeof value==='string'&&Number.isFinite(Date.parse(value));
  const id=value=>typeof value==='string'&&value.length>0&&value.length<=160;
  function validate(data){
    if(!data||!Array.isArray(data.notes)||!Array.isArray(data.cooks))throw Error('Invalid journal data. Existing data has not been changed.');
    for(const [kind,entries] of Object.entries({notes:data.notes,cooks:data.cooks})){
      const seen=new Set();
      for(const item of entries){
        if(!id(item.id)||seen.has(item.id)||typeof item.text!=='string'||item.text.length>10000||!date(item.createdAt)||(item.updatedAt&&!date(item.updatedAt))||(item.deletedAt&&!date(item.deletedAt)))throw Error('Invalid journal entry. Existing data has not been changed.');
        seen.add(item.id);
        if(kind==='cooks'&&(!date(item.cookedAt)||!Number.isInteger(item.rating)||item.rating<0||item.rating>5))throw Error('Invalid cooking entry. Existing data has not been changed.');
      }
    }
    return data;
  }
  const revision=item=>item.updatedAt||item.createdAt;
  function change(data,action,now){
    validate(data);const next=structuredClone(data),items=next[action.kind];
    if(!items)throw Error('Unknown journal section.');
    const existing=items.find(item=>item.id===action.id);
    if(action.type==='add'){
      if(existing)return {value:data,changed:false};
      items.push({...action.entry,createdAt:now,updatedAt:now});
    }else{
      if(!existing)throw Error('This entry no longer exists.');
      if(action.expected&&revision(existing)!==action.expected)throw Error('This entry changed in another tab. Reopen Edit to use the latest version. Your draft is still here.');
      now=new Date(Math.max(Date.parse(now),Date.parse(revision(existing))+1)).toISOString();
      if(action.type==='edit'){
        if(existing.deletedAt)throw Error('This entry was deleted in another tab.');
        for(const field of action.kind==='notes'?['text']:['text','rating','cookedAt'])if(Object.hasOwn(action.patch,field))existing[field]=action.patch[field];
      }else if(action.type==='delete')existing.deletedAt=now;
      else if(action.type==='undo'){
        if(existing.deletedAt!==action.deletedAt)throw Error('This entry changed after deletion. Undo was not applied.');
        delete existing.deletedAt;
      }else throw Error('Unknown journal action.');
      existing.updatedAt=now;
    }
    validate(next);return {value:next,changed:true};
  }
  function merge(current,incoming){
    validate(current);validate(incoming);const next=structuredClone(current);let added=0,updated=0,conflicts=0;
    for(const kind of ['notes','cooks'])for(const entry of incoming[kind]){
      const i=next[kind].findIndex(item=>item.id===entry.id);
      if(i<0){next[kind].push(structuredClone(entry));added++;}
      else if(Date.parse(revision(entry))>Date.parse(revision(next[kind][i]))){next[kind][i]=structuredClone(entry);updated++;}
      else if(revision(entry)===revision(next[kind][i])&&JSON.stringify(entry)!==JSON.stringify(next[kind][i]))conflicts++;
    }
    return {value:next,added,updated,conflicts};
  }
  const api={validate,change,merge,revision};
  if(typeof module!=='undefined')module.exports=api;else root.RecipeJournalState=api;
})(typeof window!=='undefined'?window:globalThis);
