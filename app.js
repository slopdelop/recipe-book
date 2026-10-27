const list = document.querySelector('#recipe-list');
const search = document.querySelector('#search');
const clock = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>';
const bowl = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10h18c0 6-4 9-9 9s-9-3-9-9zm5 11h8M8 3v4m4-4v4m4-4v4"/></svg>';
const selectedTags=new Set();
let showHidden=false;
const tagTools=window.RecipeTags;
const filters=document.querySelector('.filters');
const filterHint=document.createElement('p');filterHint.className='filter-hint';filterHint.setAttribute('role','status');filters.closest('.collection-controls').after(filterHint);
let active;
const recipeURL = id => `recipes/${id}/`;

const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
filters.innerHTML='<button type="button" aria-pressed="true" data-filter="All">All</button>'+tagTools.availableTags(window.recipes).map(tag=>`<button type="button" aria-pressed="false" data-tag="${escape(tag)}">${escape(tag)}</button>`).join('')+'<button type="button" aria-pressed="false" data-filter="Hidden">Hidden</button>';
const hiddenKey='recipe-book:hidden:v1';
let hiddenRecipes=new Set();
const validateHidden=value=>{if(!Array.isArray(value)||value.some(id=>typeof id!=='string'))throw Error('Hidden recipes could not be read. Existing data is unchanged.');return value;};
async function refreshHidden(){
  try{hiddenRecipes=new Set(validateHidden(await RecipeData.read(hiddenKey,[])));if(!document.body.dataset.recipe)renderList();const button=document.querySelector('.recipe-preference button');if(button)button.textContent=hiddenRecipes.has(active.id)?'Restore recipe':'Hide recipe';}
  catch(error){RecipeData.error(document.querySelector('.collection-status'),error);}
}
async function setRecipeHidden(id,hidden,status){
  try{
    const out=await RecipeData.update(hiddenKey,[],current=>{const next=new Set(validateHidden(current));hidden?next.add(id):next.delete(id);return {value:[...next]};});
    hiddenRecipes=new Set(out.value);return true;
  }catch(error){RecipeData.error(status,error);return false;}
}
RecipeData.subscribe(hiddenKey,refreshHidden);
function renderList() {
  const matches=tagTools.filterRecipes(window.recipes,{query:search.value,selectedTags:[...selectedTags],hiddenIds:[...hiddenRecipes],showHidden});
  document.querySelector('#count').textContent = matches.length;
  document.querySelector('[data-filter="Hidden"]').textContent = `Hidden${window.recipes.some(r=>hiddenRecipes.has(r.id)) ? ` (${window.recipes.filter(r=>hiddenRecipes.has(r.id)).length})` : ''}`;
  filters.querySelector('[data-filter="All"]').setAttribute('aria-pressed',String(!showHidden&&!selectedTags.size));
  filters.querySelector('[data-filter="Hidden"]').setAttribute('aria-pressed',String(showHidden));
  filters.querySelectorAll('[data-tag]').forEach(button=>button.setAttribute('aria-pressed',String(selectedTags.has(button.dataset.tag))));
  filterHint.textContent=selectedTags.size?'Matching every selected tag: '+[...selectedTags].join(' + ')+'. Select All to reset.':'Choose one or more tags to narrow the collection.';
  list.innerHTML = matches.map(r => `<article class="recipe-card"><a href="${recipeURL(r.id)}"><div class="recipe-thumb-frame"><img class="recipe-thumb ${escape(r.photoClass||'')}" src="images/${r.image || r.id}.webp" alt="" width="600" height="400"></div><span>${escape(r.name)}<small>${escape(r.time)}</small><span class="recipe-tags">${tagTools.tagsFor(r).map(tag=>`<span class="recipe-tag">${escape(tag)}</span>`).join('')}</span></span></a>${hiddenRecipes.has(r.id)?`<button class="restore-recipe" type="button" data-restore="${r.id}" aria-label="Restore ${escape(r.name)}">Restore recipe</button>`:''}</article>`).join('') || `<p class="empty">${showHidden?'No hidden recipes match.':'No recipes found. Try fewer tags or another ingredient.'}</p>`;
  list.querySelectorAll('[data-restore]').forEach(button=>button.addEventListener('click',async()=>{
    const id=button.dataset.restore;const hide=false;const status=document.querySelector('.collection-status');
    if(await setRecipeHidden(id,hide,status)){renderList();status.textContent=`${window.recipes.find(r=>r.id===id).name} ${hide?'hidden. You can restore it from Hidden.':'restored.'}`;}
  }));
}
async function selectRecipe() {
  active = window.recipes.find(r => r.id === document.body.dataset.recipe);
  if (!active) return;
  const done = new Set();
  document.title = `${active.name} · Recipe Book`;
  document.querySelector('#recipe').innerHTML = `<header class="recipe-hero"><img class="recipe-photo ${escape(active.photoClass||'')}" src="images/${active.image || active.id}.webp" alt="${escape(active.name)}" width="1600" height="700" fetchpriority="high"><div class="hero-tools"><a class="back-link" href="./">← All recipes</a><button id="print" class="print-button">Print recipe</button></div><div class="hero-caption"><div class="caption-panel"><div class="eyebrow">${escape(tagTools.tagsFor(active).join(' · '))}</div><h1>${escape(active.name)}</h1>${active.subtitle ? `<p class="subtitle">${escape(active.subtitle)}</p>` : ''}<div class="meta"><span>${clock}${escape(active.time)}</span><span>${bowl}${escape(active.yield)}</span></div></div></div></header><div class="recipe-body"><section aria-labelledby="ingredients-title"><div class="section-head"><h2 id="ingredients-title">Ingredients</h2><button id="reset">Reset checks</button></div><ul class="ingredients">${active.ingredients.map((item,i) => item.group ? `<li class="group">${escape(item.group)}</li>` : `<li><label><input type="checkbox" data-index="${i}" ${done.has(i)?'checked':''}><span>${item[0] ? `<span class="amount">${escape(item[0])}</span> ` : ''}${window.colorIngredients(item[1], active.id)}</span></label></li>`).join('')}</ul></section><section aria-labelledby="steps-title"><div class="section-head"><h2 id="steps-title">Steps</h2></div><ol class="steps">${active.steps.map((step,i) => `<li data-step="${step[2].id}"><button type="button" class="step-marker" aria-label="Mark ${escape(step[0])} as current step">${i+1}</button><div><h3>${window.colorIngredients(step[0], active.id)}</h3><p>${window.colorIngredients(step[1], active.id)}</p></div></li>`).join('')}</ol></section></div><footer class="recipe-footer">${active.sourceUrl?`<a href="${escape(active.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escape(active.source)}</a>`:escape(active.source)}${active.photoCredit ? ` · Photo: ${active.photoSource?`<a href="${escape(active.photoSource)}" target="_blank" rel="noopener noreferrer">${escape(active.photoCredit)}</a>`:escape(active.photoCredit)}` : ''}</footer>`;
  document.querySelector('#print').addEventListener('click',()=>window.print());
  await window.mountRecipeJournal(active);
  await window.mountCookView(active);
  const preference=document.createElement('div');preference.className='recipe-preference';
  preference.innerHTML='<button type="button" class="journal-secondary"></button><span role="status" aria-live="polite"></span>';
  document.querySelector('.recipe-footer').after(preference);
  const visibilityButton=preference.querySelector('button');
  const refreshVisibility=()=>visibilityButton.textContent=hiddenRecipes.has(active.id)?'Restore recipe':'Hide recipe';
  refreshVisibility();
  visibilityButton.addEventListener('click',async()=>{
    const hide=!hiddenRecipes.has(active.id);const status=preference.querySelector('[role="status"]');
    if(await setRecipeHidden(active.id,hide,status)){refreshVisibility();status.textContent=hide?'Hidden from your collection. Notes and cooking history are kept.':'Restored to your collection.';}
  });
}
search.addEventListener('input',renderList);
filters.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.filter==='All'){selectedTags.clear();showHidden=false;search.value='';}
  else if(button.dataset.filter==='Hidden')showHidden=!showHidden;
  else if(button.dataset.tag){const tag=button.dataset.tag;selectedTags.has(tag)?selectedTags.delete(tag):selectedTags.add(tag);}
  renderList();
});

document.addEventListener('keydown',event=>{if(!document.body.dataset.recipe&&(event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();search.focus();}});
(async()=>{
  await refreshHidden();
  const legacyRecipe=window.recipes.find(r=>r.id===location.hash.slice(1));
  if(!document.body.dataset.recipe&&legacyRecipe){location.replace(new URL(recipeURL(legacyRecipe.id),document.baseURI).href);return;}
  if(document.body.dataset.recipe){document.querySelector('#collection').hidden=true;document.querySelector('#recipe').hidden=false;await selectRecipe();}
  else{renderList();window.mountRecipeBackup();}
  await window.mountRecipeTimers(active||null);
  await window.mountRecipeSync();
})().catch(error=>{const status=document.createElement('p');status.className='app-error';status.setAttribute('role','alert');status.textContent=error.message||'This page could not finish loading. Please reload.';document.querySelector('main').append(status);});
window.addEventListener('hashchange',()=>{
  const recipe = window.recipes.find(r=>r.id===location.hash.slice(1));
  if (!document.body.dataset.recipe && recipe) location.replace(new URL(recipeURL(recipe.id),document.baseURI).href);
});
