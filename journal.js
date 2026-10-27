// Private to this browser; recipe notes are never committed to GitHub.
window.mountRecipeJournal = function(recipe) {
  const host = document.createElement('section');
  host.className = 'recipe-journal';
  host.setAttribute('aria-labelledby','journal-title');
  document.querySelector('.recipe-footer').before(host);
  const key = `recipe-book:journal:v1:${recipe.id}`;
  const safe = value => String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const timestamp = date => new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(date));
  const validDate = value => typeof value==='string' && Number.isFinite(Date.parse(value));
  const localTime = () => {const now=new Date();return new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,16);};
  let state = {notes:[],cooks:[]};
  let readError = false;
  try {
    const saved = localStorage.getItem(key);
    if(saved) {
      const data=JSON.parse(saved);
      if(!Array.isArray(data.notes)||!Array.isArray(data.cooks)||data.notes.some(n=>!n.id||typeof n.text!=='string'||!validDate(n.createdAt))||data.cooks.some(c=>!c.id||!validDate(c.cookedAt)||!validDate(c.createdAt)||typeof c.text!=='string'||!Number.isInteger(c.rating)||c.rating<0||c.rating>5)) throw Error('Invalid saved journal');
      state=data;
    }
  } catch {readError=true;}
  host.innerHTML = `<h2 id="journal-title">Your kitchen notes</h2><p class="journal-storage">Saved in this browser on this device.</p><p class="journal-status" role="status" aria-live="polite"></p><div class="journal-grid"><section aria-labelledby="notes-title"><h3 id="notes-title">Notes</h3><form id="note-form"><label for="note-text">What would you like to remember?</label><textarea id="note-text" rows="3" maxlength="10000" required placeholder="Less salt next time, a substitution that worked…"></textarea><button class="journal-primary" type="submit">Save note</button></form><div id="note-history"></div></section><section id="cooking-log" aria-labelledby="cooking-title"><h3 id="cooking-title">Cooking history</h3><div class="made-reminder"><p>Made this? Keep a record of how it turned out.</p><button id="made-this" class="journal-primary" type="button" aria-expanded="false" aria-controls="cook-form">I made this</button></div><form id="cook-form" hidden><label for="cooked-at">When did you make it?</label><input id="cooked-at" type="datetime-local" required><label for="cook-rating">Your rating for this time</label><select id="cook-rating"><option value="0">Not rated yet</option><option value="1">★ · 1 out of 5</option><option value="2">★★ · 2 out of 5</option><option value="3">★★★ · 3 out of 5</option><option value="4">★★★★ · 4 out of 5</option><option value="5">★★★★★ · 5 out of 5</option></select><label for="cook-text">Cooking notes (optional)</label><textarea id="cook-text" rows="2" maxlength="10000" placeholder="How did this batch turn out?"></textarea><div class="journal-actions"><button class="journal-primary" type="submit">Save cooking session</button><button id="cancel-cook" class="journal-secondary" type="button">Cancel</button></div></form><div id="cook-history"></div></section></div>`;
  const status=host.querySelector('.journal-status');
  const cookForm=host.querySelector('#cook-form');
  const madeButton=host.querySelector('#made-this');
  function persist(next, message) {
    if(readError) {status.textContent='Saved notes could not be read. Please keep this page open and try reloading before adding anything.';return false;}
    try {localStorage.setItem(key,JSON.stringify(next));state=next;status.textContent=message;return true;}
    catch {status.textContent='Could not save in this browser. Your text is still here; please copy it before leaving.';return false;}
  }
  function render() {
    host.querySelector('#note-history').innerHTML=state.notes.length ? [...state.notes].sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt)).map(n=>`<article class="journal-entry"><time datetime="${safe(n.createdAt)}">${safe(timestamp(n.createdAt))}</time><p>${safe(n.text)}</p></article>`).join('') : '<p class="journal-empty">No notes yet.</p>';
    host.querySelector('#cook-history').innerHTML=state.cooks.length ? [...state.cooks].sort((a,b)=>Date.parse(b.cookedAt)-Date.parse(a.cookedAt)).map(c=>`<article class="journal-entry"><span class="cook-badge">Made it</span><time datetime="${safe(c.cookedAt)}">${safe(timestamp(c.cookedAt))}</time>${c.text?`<p>${safe(c.text)}</p>`:''}<label class="rating-label" for="rating-${safe(c.id)}">Rating for this cook</label><select class="saved-rating" id="rating-${safe(c.id)}" data-cook="${safe(c.id)}">${[0,1,2,3,4,5].map(r=>`<option value="${r}" ${c.rating===r?'selected':''}>${r?'★'.repeat(r)+' · '+r+' out of 5':'Not rated yet'}</option>`).join('')}</select></article>`).join('') : '<p class="journal-empty">No cooking sessions logged yet.</p>';
    host.querySelectorAll('.saved-rating').forEach(select=>select.addEventListener('change',()=>{
      const old=state.cooks.find(c=>c.id===select.dataset.cook).rating;
      if(!persist({...state,cooks:state.cooks.map(c=>c.id===select.dataset.cook?{...c,rating:Number(select.value)}:c)},'Rating saved.')) select.value=String(old);
    }));
  }
  host.querySelector('#note-form').addEventListener('submit',event=>{
    event.preventDefault();const field=host.querySelector('#note-text');const text=field.value.trim();if(!text){field.focus();return;}
    if(persist({...state,notes:[...state.notes,{id:crypto.randomUUID(),text,createdAt:new Date().toISOString()}]},'Note saved with date and time.')){field.value='';render();}
  });
  function openCook() {cookForm.hidden=false;madeButton.setAttribute('aria-expanded','true');host.querySelector('#cooked-at').value=localTime();host.querySelector('#cooked-at').focus();}
  madeButton.addEventListener('click',()=>{if(cookForm.hidden)openCook();else host.querySelector('#cooked-at').focus();});
  host.querySelector('#cancel-cook').addEventListener('click',()=>{cookForm.hidden=true;madeButton.setAttribute('aria-expanded','false');madeButton.focus();});
  cookForm.addEventListener('submit',event=>{
    event.preventDefault();const cookedAt=new Date(host.querySelector('#cooked-at').value);if(!Number.isFinite(cookedAt.getTime()))return;
    const entry={id:crypto.randomUUID(),cookedAt:cookedAt.toISOString(),createdAt:new Date().toISOString(),rating:Number(host.querySelector('#cook-rating').value),text:host.querySelector('#cook-text').value.trim()};
    if(persist({...state,cooks:[...state.cooks,entry]},'Cooking session saved.')){cookForm.reset();cookForm.hidden=true;madeButton.setAttribute('aria-expanded','false');render();}
  });
  // Ingredient checks are only a cue to ask, never evidence that cooking occurred.
  const checks=[...document.querySelectorAll('.ingredients input')];
  const cue=document.createElement('div');cue.className='completion-cue';cue.hidden=true;
  cue.innerHTML='<p>Everything checked off. Made this?</p><button type="button" class="journal-secondary">Log this cook ↓</button>';
  document.querySelector('.ingredients').after(cue);
  checks.forEach(input=>input.addEventListener('change',()=>{cue.hidden=!checks.every(c=>c.checked);}));
  document.querySelector('#reset').addEventListener('click',()=>cue.hidden=true);
  cue.querySelector('button').addEventListener('click',()=>{host.querySelector('#cooking-log').scrollIntoView({behavior:'smooth',block:'center'});if(cookForm.hidden)openCook();});
  if(readError)status.textContent='Saved notes could not be read. Please reload before adding anything; existing data has not been changed.';
  render();
};
