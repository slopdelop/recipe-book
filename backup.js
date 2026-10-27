window.mountRecipeBackup=function(){
  const D=RecipeData,J=RecipeJournalState,prefix='recipe-book:journal:v1:',hiddenKey='recipe-book:hidden:v1';
  const host=document.createElement('section');host.className='backup-tools';
  host.innerHTML='<details><summary>Backup & restore</summary><p>Keep a copy of your notes, cooking history, ratings and hidden recipes. Optional manual backup, in addition to Cloud sync when connected.</p><div class="journal-actions"><button type="button" class="journal-secondary" data-export>Export backup</button><label class="journal-secondary import-label">Import backup<input type="file" accept=".json,application/json" hidden></label></div><p class="backup-status" role="status"></p></details><dialog class="backup-preview"><h3>Import backup</h3><p class="backup-summary"></p><p>Merge by entry ID, keeping the newer revision. Equal-date conflicts keep the current entry. Existing data will not be cleared. Hidden recipes are combined.</p><div class="journal-actions"><button type="button" class="journal-primary" data-merge>Merge backup</button><button type="button" class="journal-secondary" data-cancel>Cancel</button></div></dialog>';
  document.querySelector('#collection').append(host);
  const status=host.querySelector('.backup-status'),dialog=host.querySelector('dialog');let pending;
  function validate(data){
    if(!data||data.format!=='recipe-book-backup'||data.version!==1||!data.journals||typeof data.journals!=='object'||Array.isArray(data.journals)||!Array.isArray(data.hidden)||data.hidden.some(id=>typeof id!=='string'||!/^[a-z0-9-]+$/.test(id)))throw Error('This is not a supported Recipe Book backup. Nothing was imported.');
    const known=new Set([...window.recipes.map(recipe=>recipe.id),...(window.retiredRecipeIds||[])]);
    if(data.hidden.some(id=>!known.has(id)))throw Error('This backup includes recipes not in this book. Nothing was imported.');
    for(const [id,journal] of Object.entries(data.journals)){if(!known.has(id))throw Error('This backup includes recipes not in this book. Nothing was imported.');J.validate(journal);}
    return data;
  }
  host.querySelector('[data-export]').addEventListener('click',async event=>{
    event.target.disabled=true;
    try{
      const ids=[...window.recipes.map(r=>r.id),...(window.retiredRecipeIds||[])];
      const keys=ids.map(id=>prefix+id),defaults=Object.fromEntries(keys.map(key=>[key,{notes:[],cooks:[]}]));keys.push(hiddenKey);defaults[hiddenKey]=[];
      const out=await D.transaction(keys,defaults,()=>{}),journals={};
      for(const id of ids)journals[id]=J.validate(out.values[prefix+id]);
      const data=validate({format:'recipe-book-backup',version:1,exportedAt:new Date().toISOString(),journals,hidden:out.values[hiddenKey]});
      const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=`recipe-book-backup-${new Date().toISOString().slice(0,10)}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),60000);
      status.textContent='Backup downloaded. Store it somewhere you can find again.';
    }catch(error){D.error(status,error);}finally{event.target.disabled=false;}
  });
  host.querySelector('input').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    try{
      if(file.size>5*1024*1024)throw Error('This backup is too large to import. Limit: 5 MB.');
      pending=validate(JSON.parse(await file.text()));
      let notes=0,cooks=0,deleted=0;
      for(const j of Object.values(pending.journals)){notes+=j.notes.filter(e=>!e.deletedAt).length;cooks+=j.cooks.filter(e=>!e.deletedAt).length;deleted+=[...j.notes,...j.cooks].filter(e=>e.deletedAt).length;}
      host.querySelector('.backup-summary').textContent=`${Object.keys(pending.journals).length} recipe journals, ${notes} notes, ${cooks} cooking sessions, ${deleted} deletion records, and ${new Set(pending.hidden).size} hidden recipes. Nothing has been imported yet.`;
      dialog.showModal();
    }catch(error){pending=null;D.error(status,error);}finally{event.target.value='';}
  });
  host.querySelector('[data-cancel]').addEventListener('click',()=>{pending=null;dialog.close();});
  host.querySelector('[data-merge]').addEventListener('click',async event=>{
    if(!pending)return;event.target.disabled=true;
    try{
      const data=validate(pending),keys=Object.keys(data.journals).map(id=>prefix+id),defaults=Object.fromEntries(keys.map(key=>[key,{notes:[],cooks:[]}]));keys.push(hiddenKey);defaults[hiddenKey]=[];
      const out=await D.transaction(keys,defaults,values=>{
        let added=0,updated=0,conflicts=0;const changed=[];
        for(const [id,journal] of Object.entries(data.journals)){const key=prefix+id,merge=J.merge(values[key],journal);values[key]=merge.value;added+=merge.added;updated+=merge.updated;conflicts+=merge.conflicts;changed.push(key);}
        if(!Array.isArray(values[hiddenKey]))throw Error('Existing hidden recipes could not be read. Nothing was imported.');
        values[hiddenKey]=[...new Set([...values[hiddenKey],...data.hidden])];changed.push(hiddenKey);
        return {changed,result:{added,updated,conflicts}};
      });
      status.textContent=`Imported: ${out.result.added} new entries, ${out.result.updated} newer entries, ${out.result.conflicts} equal-date conflicts kept unchanged. Re-importing will not duplicate entries.`;
      pending=null;dialog.close();
    }catch(error){D.error(status,error);dialog.close();}finally{event.target.disabled=false;}
  });
};
