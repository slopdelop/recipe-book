window.mountRecipeJournal = async function(recipe) {
  const D=RecipeData,J=RecipeJournalState,safe=D.escape;
  const key=`recipe-book:journal:v1:${recipe.id}`;
  const empty={notes:[],cooks:[]};
  const host=document.createElement('section');host.className='recipe-journal';host.setAttribute('aria-labelledby','journal-title');
  document.querySelector('.recipe-footer').before(host);
  host.innerHTML=`<h2 id="journal-title">Your kitchen notes</h2><p class="journal-storage">Saved in this browser on this device. Back up from the collection page.</p><p class="journal-status" role="status" aria-live="polite"></p><button class="journal-secondary journal-undo" hidden type="button">Undo deletion</button><div class="journal-grid"><section aria-labelledby="notes-title"><h3 id="notes-title">Notes</h3><form id="note-form"><label for="note-text">What would you like to remember?</label><textarea id="note-text" rows="3" maxlength="10000" required placeholder="Less salt next time, a substitution that worked…"></textarea><button class="journal-primary" type="submit">Save note</button></form><div id="note-history"></div></section><section id="cooking-log" aria-labelledby="cooking-title"><h3 id="cooking-title">Cooking history</h3><div class="made-reminder"><p>Made this? Keep a record of how it turned out.</p><button id="made-this" class="journal-primary" type="button" aria-expanded="false" aria-controls="cook-form">I made this</button></div><form id="cook-form" hidden><label for="cooked-at">When did you make it?</label><input id="cooked-at" type="datetime-local" required><label for="cook-rating">Your rating for this time</label><select id="cook-rating">${ratings(0)}</select><label for="cook-text">Cooking notes (optional)</label><textarea id="cook-text" rows="2" maxlength="10000"></textarea><div class="journal-actions"><button class="journal-primary" type="submit">Save cooking session</button><button id="cancel-cook" class="journal-secondary" type="button">Cancel</button></div></form><div id="cook-history"></div></section></div><dialog class="entry-editor"><form method="dialog"><h3>Edit entry</h3><div class="edit-cook-fields"><label>Cooking date and time<input name="cookedAt" type="datetime-local"></label><label>Rating<select name="rating">${ratings(0)}</select></label></div><label>Notes<textarea name="text" maxlength="10000" rows="5"></textarea></label><p class="edit-status" role="status"></p><div class="journal-actions"><button class="journal-primary" type="submit" value="save">Save changes</button><button class="journal-secondary" type="button" data-close>Cancel</button></div></form></dialog>`;
  const status=host.querySelector('.journal-status'),noteField=host.querySelector('#note-text'),cookForm=host.querySelector('#cook-form'),made=host.querySelector('#made-this');
  const editor=host.querySelector('.entry-editor'),editForm=editor.querySelector('form');
  let state=empty,editing,undo=[];
  function ratings(selected){return [0,1,2,3,4,5].map(n=>`<option value="${n}" ${n===selected?'selected':''}>${n?'★'.repeat(n)+' · '+n+' out of 5':'Not rated yet'}</option>`).join('');}
  const stamp=date=>new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(date));
  const local=date=>{const d=new Date(date);return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16);};
  const draftKey=`recipe-book:draft:${recipe.id}`;
  function saveDraft(){try{sessionStorage.setItem(draftKey,JSON.stringify({note:noteField.value,open:!cookForm.hidden,date:host.querySelector('#cooked-at').value,rating:host.querySelector('#cook-rating').value,text:host.querySelector('#cook-text').value}));}catch{}}
  try{const draft=JSON.parse(sessionStorage.getItem(draftKey)||'null');if(draft){noteField.value=draft.note||'';host.querySelector('#cooked-at').value=draft.date||'';host.querySelector('#cook-rating').value=draft.rating||'0';host.querySelector('#cook-text').value=draft.text||'';cookForm.hidden=!draft.open;made.setAttribute('aria-expanded',String(!!draft.open));}}catch{}
  host.querySelector('#note-form').addEventListener('input',saveDraft);cookForm.addEventListener('input',saveDraft);
  async function refresh(){try{state=J.validate(await D.read(key,empty));render();}catch(error){D.error(status,error);}}
  async function change(action,message){
    const out=await D.update(key,empty,current=>J.change(current,action,new Date().toISOString()));
    state=out.value;render();status.textContent=message;return out;
  }
  function render(){
    for(const kind of ['notes','cooks']){
      const entries=state[kind].filter(e=>!e.deletedAt).sort((a,b)=>Date.parse(kind==='notes'?b.createdAt:b.cookedAt)-Date.parse(kind==='notes'?a.createdAt:a.cookedAt));
      host.querySelector(kind==='notes'?'#note-history':'#cook-history').innerHTML=entries.length?entries.map(e=>`<article class="journal-entry">${kind==='cooks'?'<span class="cook-badge">Made it</span>':''}<time datetime="${safe(kind==='notes'?e.createdAt:e.cookedAt)}">${safe(stamp(kind==='notes'?e.createdAt:e.cookedAt))}</time>${e.updatedAt&&e.updatedAt!==e.createdAt?`<small class="entry-edited">Edited ${safe(stamp(e.updatedAt))}</small>`:''}<p>${safe(e.text)}</p>${kind==='cooks'?`<label class="rating-label">Rating for this cook<select class="saved-rating" data-rating="${safe(e.id)}">${ratings(e.rating)}</select></label>`:''}<div class="entry-actions"><button type="button" data-edit="${safe(e.id)}" data-kind="${kind}">Edit</button><button type="button" data-delete="${safe(e.id)}" data-kind="${kind}">Delete</button></div></article>`).join(''):`<p class="journal-empty">${kind==='notes'?'No notes yet.':'No cooking sessions logged yet.'}</p>`;
    }
    host.querySelectorAll('[data-rating]').forEach(select=>select.addEventListener('change',async()=>{
      try{await change({type:'edit',kind:'cooks',id:select.dataset.rating,patch:{rating:Number(select.value)}},'Rating saved.');}catch(error){D.error(status,error);await refresh();}
    }));
    host.querySelectorAll('[data-edit]').forEach(button=>button.addEventListener('click',()=>{
      const kind=button.dataset.kind,entry=state[kind].find(e=>e.id===button.dataset.edit);
      editing={kind,id:entry.id,expected:J.revision(entry)};
      editor.querySelector('.edit-cook-fields').hidden=kind!=='cooks';
      editForm.elements.cookedAt.required=kind==='cooks';
      editForm.elements.text.required=kind==='notes';
      editForm.elements.text.value=entry.text;editForm.elements.rating.value=String(entry.rating||0);editForm.elements.cookedAt.value=entry.cookedAt?local(entry.cookedAt):'';
      editor.querySelector('.edit-status').textContent='';editor.showModal();editForm.elements.text.focus();
    }));
    host.querySelectorAll('[data-delete]').forEach(button=>button.addEventListener('click',async()=>{
      const kind=button.dataset.kind,id=button.dataset.delete;
      try{const out=await change({type:'delete',kind,id},'Entry deleted. You can undo this.');undo.push({kind,id,deletedAt:out.value[kind].find(e=>e.id===id).deletedAt});host.querySelector('.journal-undo').hidden=false;}
      catch(error){D.error(status,error);}
    }));
  }
  host.querySelector('.journal-undo').addEventListener('click',async()=>{
    const entry=undo.at(-1);if(!entry)return;
    try{await change({type:'undo',...entry},'Entry restored.');undo.pop();host.querySelector('.journal-undo').hidden=!undo.length;}catch(error){D.error(status,error);}
  });
  editForm.addEventListener('submit',async event=>{
    event.preventDefault();const patch={text:editForm.elements.text.value.trim()};
    if(editing.kind==='cooks'){patch.rating=Number(editForm.elements.rating.value);patch.cookedAt=new Date(editForm.elements.cookedAt.value).toISOString();}
    const button=editForm.querySelector('[value=save]');button.disabled=true;
    try{await change({type:'edit',...editing,patch},'Entry updated. Original creation time kept.');editor.close();}
    catch(error){D.error(editor.querySelector('.edit-status'),error);}finally{button.disabled=false;}
  });
  editor.querySelector('[data-close]').addEventListener('click',()=>editor.close());
  host.querySelector('#note-form').addEventListener('submit',async event=>{
    event.preventDefault();const text=noteField.value.trim();if(!text)return;const button=event.target.querySelector('button');button.disabled=true;
    const id=crypto.randomUUID();
    try{await change({type:'add',kind:'notes',id,entry:{id,text}},'Note saved with date and time.');if(noteField.value.trim()===text)noteField.value='';saveDraft();}
    catch(error){D.error(status,error);}finally{button.disabled=false;}
  });
  function openCook(){cookForm.hidden=false;made.setAttribute('aria-expanded','true');if(!host.querySelector('#cooked-at').value)host.querySelector('#cooked-at').value=local(new Date());saveDraft();host.querySelector('#cooked-at').focus();}
  made.addEventListener('click',openCook);
  host.querySelector('#cancel-cook').addEventListener('click',()=>{cookForm.hidden=true;made.setAttribute('aria-expanded','false');saveDraft();made.focus();});
  cookForm.addEventListener('submit',async event=>{
    event.preventDefault();const id=crypto.randomUUID(),entry={id,cookedAt:new Date(host.querySelector('#cooked-at').value).toISOString(),rating:Number(host.querySelector('#cook-rating').value),text:host.querySelector('#cook-text').value.trim()};
    const button=cookForm.querySelector('[type=submit]');button.disabled=true;
    try{await change({type:'add',kind:'cooks',id,entry},'Cooking session saved.');cookForm.reset();cookForm.hidden=true;made.setAttribute('aria-expanded','false');saveDraft();}
    catch(error){D.error(status,error);}finally{button.disabled=false;}
  });
  const cue=document.createElement('div');cue.className='completion-cue';cue.hidden=true;cue.innerHTML='<p>Everything checked off. Made this?</p><button type="button" class="journal-secondary">Log this cook ↓</button>';document.querySelector('.ingredients').after(cue);
  cue.querySelector('button').addEventListener('click',()=>{openCook();host.querySelector('#cooking-log').scrollIntoView({behavior:'smooth',block:'center'});});
  D.subscribe(key,refresh);await refresh();
};
