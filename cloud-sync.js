(() => {
  const D=RecipeData,S=RecipeSyncState,prefix='recipe-book:journal:v1:',hiddenKey='recipe-book:hidden:v1',authKey='recipe-book:sync-auth:v1',metaKey='recipe-book:sync-meta:v1';
  let host,status,summary,auth=null,running=false,again=false,timer,retry=5000,lastSync=null,requestController;
  const initialMeta=()=>({base:S.empty(),revision:0});
  const isJournal=key=>key.startsWith(prefix);
  const endpoint=()=>window.RECIPE_SYNC_ENDPOINT;
  function paint(text){
    if(!host)return;status.textContent=text;
    summary.textContent='Cloud sync · '+(auth?(text.startsWith('Synced')?'connected':/^(Syncing|Checking|Connected)/.test(text)?'syncing':'needs attention'): 'not connected');
    host.querySelector('form').hidden=!!auth;host.querySelector('.sync-connected').hidden=!auth;
    const copy=document.querySelector('.journal-storage');if(copy)copy.textContent=auth?'Saved here and synced privately between connected computers. See Cloud sync for status.':'Saved in this browser. Connect Cloud sync below to keep notes and ratings on other computers.';
  }
  async function request(method,token,body){
    requestController=new AbortController();const timeout=setTimeout(()=>requestController?.abort(),15000);
    try{
      const response=await fetch(endpoint()+'/sync',{method,headers:{Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:requestController.signal,cache:'no-store'});
      let data;try{data=await response.json();}catch{throw Error('Cloud sync returned an unreadable response. Local data is safe.');}
      if(!response.ok){const error=Error(data.error||'Cloud sync could not finish.');error.status=response.status;throw error;}
      return data;
    }finally{clearTimeout(timeout);requestController=null;}
  }
  function schedule(delay=1500){clearTimeout(timer);timer=setTimeout(()=>sync(),delay);}
  const snapshotKeys=remote=>[...new Set([...window.recipes.map(r=>r.id),...(window.retiredRecipeIds||[]),...Object.keys(remote.journals)])].map(id=>prefix+id);
  async function integrate(remote,revision,token){
    S.validate(remote);const journalKeys=snapshotKeys(remote),keys=[...journalKeys,hiddenKey,metaKey,authKey];
    const defaults=Object.fromEntries(journalKeys.map(key=>[key,{notes:[],cooks:[]}]));Object.assign(defaults,{[hiddenKey]:[],[metaKey]:initialMeta(),[authKey]:null});
    return D.transaction(keys,defaults,values=>{
      if(values[authKey]?.token!==token)throw Error('Cloud connection changed. Local data was kept.');
      const meta=values[metaKey];if(revision<meta.revision)return {result:{stale:true}};
      const local=S.empty();for(const key of journalKeys)local.journals[key.slice(prefix.length)]=values[key];local.hidden=values[hiddenKey];
      // The merge happens inside the same transaction as local edits. Unsent changes
      // made while a request was in flight are included, never replaced by a snapshot.
      const merge=S.merge(meta.base,local,remote),changed=[];
      for(const [id,journal] of Object.entries(merge.value.journals)){const key=prefix+id;if(!S.equal(values[key],journal)){values[key]=journal;changed.push(key);}}
      if(!S.equal(values[hiddenKey],merge.value.hidden)){values[hiddenKey]=merge.value.hidden;changed.push(hiddenKey);}
      values[metaKey]={...meta,base:remote,revision};changed.push(metaKey);
      return {changed,result:{data:merge.value,conflicts:merge.conflicts,pending:!S.equal(merge.value,remote)}};
    });
  }
  async function roundTrip(token){
    for(let attempt=0;attempt<5;attempt++){
      const remote=await request('GET',token);if(!Number.isSafeInteger(remote.revision)||remote.revision<0)throw Error('Invalid cloud revision. Local data is safe.');
      const merged=(await integrate(remote.data,remote.revision,token)).result;if(merged.stale)continue;
      if(merged.pending){
        if((await D.read(authKey,null))?.token!==token)return;
        let saved;try{saved=await request('PUT',token,{revision:remote.revision,data:merged.data});}catch(error){if(error.status===409)continue;throw error;}
        const after=(await integrate(merged.data,saved.revision,token)).result;
        if(after.pending){again=true;}
      }
      lastSync=new Date();retry=5000;
      paint('Synced '+lastSync.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})+'. Changes from other computers appear automatically.');return;
    }
    throw Error('Other changes are arriving. Retrying shortly; local data is safe.');
  }
  async function sync(){
    if(running){again=true;return;}if(!auth)return;
    if(!navigator.onLine){paint('Offline. Changes are saved here and will sync when you reconnect.');schedule(retry);return;}
    running=true;again=false;paint('Syncing… Your local changes are saved.');
    try{
      const token=auth.token;
      if(navigator.locks)await navigator.locks.request('recipe-book-cloud-sync',()=>roundTrip(token));else await roundTrip(token);
    }catch(error){
      if(auth){paint(error.status===401?'Connection code was rejected. Disconnect and enter the correct recipe code. Local data is safe.':(error.name==='AbortError'?'Cloud sync timed out.':error.message)+' Will retry; local data is safe.');retry=Math.min(60000,retry*2);}
    }finally{running=false;if(auth)schedule(again?500:retry===5000?20000:retry);}
  }
  window.mountRecipeSync=async()=>{
    host=document.createElement('section');host.className='sync-tools';host.innerHTML='<details><summary>Cloud sync · not connected</summary><p>Connect each computer with the same private recipe code. Notes, cooking history, ratings and hidden recipes merge automatically. Your workout data is separate.</p><form><label>Recipe connection code<input name="code" type="password" autocomplete="off" spellcheck="false" pattern="[a-fA-F0-9]{64}" minlength="64" maxlength="64" required></label><p class="sync-hint">Connecting merges this browser’s existing recipe data into your cloud recipe book. Keep the code private: anyone with it can read and edit this book.</p><button type="submit" class="journal-primary">Connect cloud sync</button></form><div class="sync-connected" hidden><div class="journal-actions"><button type="button" class="journal-secondary" data-sync-now>Sync now</button><button type="button" class="journal-secondary" data-show-code>Show connection code</button><button type="button" class="journal-secondary" data-disconnect>Disconnect this browser</button></div><label class="sync-code" hidden>Use this code on your other computers<input readonly type="text" aria-label="Your private recipe connection code" spellcheck="false"></label><p>Timers and cooking progress stay on this computer.</p></div><p class="sync-status" role="status" aria-live="polite"></p></details>';
    const journal=document.querySelector('.recipe-journal');if(journal)journal.after(host);else document.querySelector('#collection').append(host);
    status=host.querySelector('.sync-status');summary=host.querySelector('summary');
    host.querySelector('form').addEventListener('submit',async event=>{
      event.preventDefault();const field=event.target.elements.code,token=field.value.trim().toLowerCase(),button=event.target.querySelector('button');button.disabled=true;
      try{
        paint('Checking connection code…');const check=await request('GET',token);S.validate(check.data);
        const library=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token)))].map(n=>n.toString(16).padStart(2,'0')).join('');
        await D.transaction([authKey,metaKey],{[authKey]:null,[metaKey]:initialMeta()},values=>{values[authKey]={token};if(values[metaKey].library!==library)values[metaKey]={...initialMeta(),library};return {changed:[authKey,metaKey]};});
        auth={token};field.value='';paint('Connected. Merging this browser’s recipes…');await sync();
      }catch(error){paint(error.message||'Could not connect. Local data is safe.');}finally{button.disabled=false;}
    });
    host.querySelector('[data-sync-now]').addEventListener('click',()=>sync());
    host.querySelector('[data-show-code]').addEventListener('click',()=>{const label=host.querySelector('.sync-code');label.hidden=!label.hidden;label.querySelector('input').value=label.hidden?'':auth.token;host.querySelector('[data-show-code]').textContent=label.hidden?'Show connection code':'Hide connection code';});
    host.querySelector('[data-disconnect]').addEventListener('click',async()=>{
      try{await D.update(authKey,null,()=>({value:null}));auth=null;requestController?.abort();clearTimeout(timer);host.querySelector('.sync-code').hidden=true;host.querySelector('.sync-code input').value='';paint('Disconnected. Local notes and cloud data were kept.');}catch(error){D.error(status,error);}
    });
    D.subscribe(authKey,async()=>{const next=await D.read(authKey,null);if(next?.token!==auth?.token){requestController?.abort();auth=next;paint(auth?'Connected. Checking changes…':'Not connected. Notes are saved only in this browser.');if(auth)schedule(100);}});
    window.addEventListener('recipe-book-data',event=>{if(event.detail?.some(key=>isJournal(key)||key===hiddenKey)){if(auth)schedule();}});
    window.addEventListener('online',()=>schedule(100));window.addEventListener('focus',()=>{if(auth)schedule(100);});document.addEventListener('visibilitychange',()=>{if(!document.hidden&&auth)schedule(100);});
    try{auth=await D.read(authKey,null);paint(auth?'Checking cloud changes…':'Not connected. Notes are saved only in this browser.');if(auth)schedule(100);}catch(error){paint(error.message);}
  };
})();
