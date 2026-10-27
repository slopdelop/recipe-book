// IndexedDB read/write transactions serialize changes across tabs. Legacy
// localStorage is imported lazily and left intact as a recovery copy.
(() => {
  let opening;
  const channel = typeof BroadcastChannel==='function' ? new BroadcastChannel('recipe-book-data-v1') : null;
  const notify = keys => {
    window.dispatchEvent(new CustomEvent('recipe-book-data',{detail:keys}));
  };
  if(channel)channel.onmessage=event=>notify(event.data);
  window.addEventListener('storage',event=>{if(event.key==='recipe-book:change')try{notify(JSON.parse(event.newValue).keys);}catch{}});
  function open(){
    if(!opening)opening=new Promise((resolve,reject)=>{
      const request=indexedDB.open('recipe-book-private',1);
      request.onupgradeneeded=()=>request.result.createObjectStore('records');
      request.onsuccess=()=>{request.result.onversionchange=()=>{request.result.close();opening=null;};resolve(request.result);};
      request.onerror=()=>{opening=null;reject(request.error);};
      request.onblocked=()=>{opening=null;reject(Error('Please close older Recipe Book tabs, then retry.'));};
    });
    return opening;
  }
  const clone=value=>structuredClone(value);
  function legacy(key,fallback){
    const raw=localStorage.getItem(key);
    if(raw===null)return clone(fallback);
    try{return JSON.parse(raw);}catch{throw Error('Existing saved data could not be read. It has not been changed.');}
  }
  async function transact(keys,defaults,mutate){
    const db=await open();
    return new Promise((resolve,reject)=>{
      const transaction=db.transaction('records','readwrite');
      const records=transaction.objectStore('records');
      const values={};let pending=keys.length,result,changed=[];
      transaction.oncomplete=()=>{
        if(changed.length){notify(changed);channel?.postMessage(changed);try{localStorage.setItem('recipe-book:change',JSON.stringify({keys:changed,nonce:crypto.randomUUID()}));}catch{}}
        resolve({values,result});
      };
      transaction.onabort=()=>reject(transaction.error||Error('Could not save. Your existing data is unchanged.'));
      transaction.onerror=()=>{};
      keys.forEach(key=>{
        const request=records.get(key);
        request.onsuccess=()=>{
          try{
            const missing=request.result===undefined;
            values[key]=missing?legacy(key,defaults[key]):request.result;
            if(missing){records.put(values[key],key);changed.push(key);}
            if(--pending===0){
              const outcome=mutate(values)||{};result=outcome.result;
              for(const key of outcome.changed||[]){records.put(values[key],key);if(!changed.includes(key))changed.push(key);}
            }
          }catch(error){result=error;transaction.onabort=()=>reject(error);transaction.abort();}
        };
      });
    });
  }
  const api={
    async read(key,fallback){return (await transact([key],{[key]:fallback},()=>{})).values[key];},
    async update(key,fallback,mutate){
      const out=await transact([key],{[key]:fallback},values=>{
        const change=mutate(values[key]);values[key]=change.value;
        return {changed:change.changed===false?[]:[key],result:change.result};
      });
      return {value:out.values[key],result:out.result};
    },
    transaction:transact,
    subscribe(key,listener){
      const callback=event=>{if(event.detail?.includes(key))listener();};
      window.addEventListener('recipe-book-data',callback);
      return ()=>window.removeEventListener('recipe-book-data',callback);
    },
    escape:value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])),
    error:(element,error)=>{element.textContent=error?.message||'Could not save. Please try again.';}
  };
  window.RecipeData=api;
})();
