const list = document.querySelector('#recipe-list');
const search = document.querySelector('#search');
const clock = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>';
const bowl = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10h18c0 6-4 9-9 9s-9-3-9-9zm5 11h8M8 3v4m4-4v4m4-4v4"/></svg>';
let filter = 'All';
let active;
const recipeURL = id => `recipes/${id}/`;
const checked = new Map();
const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const hiddenKey = 'recipe-book:hidden:v1';
let hiddenRecipes = new Set();
let hiddenReadError = false;
try {
  const saved = JSON.parse(localStorage.getItem(hiddenKey) || '[]');
  if (!Array.isArray(saved) || saved.some(id=>typeof id!=='string')) throw Error('Invalid hidden recipe list');
  hiddenRecipes = new Set(saved);
} catch {hiddenReadError=true;}
function setRecipeHidden(id, hidden, status) {
  if(hiddenReadError){status.textContent='Could not read hidden recipes. Please reload before changing visibility.';return false;}
  const next = new Set(hiddenRecipes);
  hidden ? next.add(id) : next.delete(id);
  try {localStorage.setItem(hiddenKey,JSON.stringify([...next]));hiddenRecipes=next;return true;}
  catch {status.textContent='Could not save this change in your browser. Please try again.';return false;}
}
function renderList() {
  const query = search.value.trim().toLocaleLowerCase();
  const matches = window.recipes.filter(r => (filter === 'Hidden' ? hiddenRecipes.has(r.id) : !hiddenRecipes.has(r.id) && (filter === 'All' || r.category === filter)) && [r.name,r.subtitle || '',...r.ingredients.filter(Array.isArray).map(i=>i.join(' '))].join(' ').toLocaleLowerCase().includes(query));
  document.querySelector('#count').textContent = matches.length;
  document.querySelector('[data-filter="Hidden"]').textContent = `Hidden${hiddenRecipes.size ? ` (${hiddenRecipes.size})` : ''}`;
  list.innerHTML = matches.map(r => `<article class="recipe-card"><a href="${recipeURL(r.id)}"><img class="recipe-thumb" src="images/${r.image || r.id}.webp" alt="" width="46" height="46"><span>${escape(r.name)}<small>${escape(r.category)} · ${escape(r.time)}</small></span></a><button class="hide-recipe" type="button" data-visibility="${r.id}" aria-label="${hiddenRecipes.has(r.id)?'Restore':'Hide'} ${escape(r.name)}">${hiddenRecipes.has(r.id)?'Restore recipe':'Hide recipe'}</button></article>`).join('') || `<p class="empty">${filter==='Hidden'?'No hidden recipes match.':'No recipes found. Try another ingredient or category.'}</p>`;
  list.querySelectorAll('[data-visibility]').forEach(button=>button.addEventListener('click',()=>{
    const id=button.dataset.visibility;const hide=!hiddenRecipes.has(id);const status=document.querySelector('.collection-status');
    if(setRecipeHidden(id,hide,status)){renderList();status.textContent=`${window.recipes.find(r=>r.id===id).name} ${hide?'hidden. You can restore it from Hidden.':'restored.'}`;}
  }));
  if(hiddenReadError)document.querySelector('.collection-status').textContent='Hidden recipes could not be read. Your recipe notes are unchanged.';
}
function selectRecipe() {
  active = window.recipes.find(r => r.id === document.body.dataset.recipe);
  if (!active) return;
  const done = checked.get(active.id) || new Set();
  document.title = `${active.name} · Recipe Book`;
  document.querySelector('#recipe').innerHTML = `<header class="recipe-hero"><img class="recipe-photo" src="images/${active.image || active.id}.webp" alt="${escape(active.name)}" width="1600" height="700" fetchpriority="high"><div class="hero-tools"><a class="back-link" href="./">← All recipes</a><button id="print" class="print-button">Print recipe</button></div><div class="hero-caption"><div class="caption-panel"><div class="eyebrow">${escape(active.category)}</div><h1>${escape(active.name)}</h1>${active.subtitle ? `<p class="subtitle">${escape(active.subtitle)}</p>` : ''}<div class="meta"><span>${clock}${escape(active.time)}</span><span>${bowl}${escape(active.yield)}</span></div></div></div></header><div class="recipe-body"><section aria-labelledby="ingredients-title"><div class="section-head"><h2 id="ingredients-title">Ingredients</h2><button id="reset">Reset checks</button></div><ul class="ingredients">${active.ingredients.map((item,i) => item.group ? `<li class="group">${escape(item.group)}</li>` : `<li><label><input type="checkbox" data-index="${i}" ${done.has(i)?'checked':''}><span>${item[0] ? `<span class="amount">${escape(item[0])}</span> ` : ''}${window.colorIngredients(item[1], active.id)}</span></label></li>`).join('')}</ul></section><section aria-labelledby="steps-title"><div class="section-head"><h2 id="steps-title">Steps</h2></div><ol class="steps">${active.steps.map((step,i) => `<li><span class="step-marker" aria-hidden="true">${i+1}</span><div><h3>${window.colorIngredients(step[0], active.id)}</h3><p>${window.colorIngredients(step[1], active.id)}</p></div></li>`).join('')}</ol></section></div><footer class="recipe-footer">${escape(active.source)}${active.photoCredit ? ` · Photo: <a href="${escape(active.photoSource)}" target="_blank" rel="noopener noreferrer">${escape(active.photoCredit)}</a>` : ''}</footer>`;
  document.querySelector('#reset').addEventListener('click', () => {checked.delete(active.id);document.querySelectorAll('.ingredients input').forEach(input=>input.checked=false);});
  document.querySelectorAll('.ingredients input').forEach(input=>input.addEventListener('change',()=>{const state=checked.get(active.id)||new Set();const i=Number(input.dataset.index);input.checked?state.add(i):state.delete(i);checked.set(active.id,state);}));
  document.querySelector('#print').addEventListener('click',()=>window.print());
  window.mountRecipeJournal(active);
  const preference=document.createElement('div');preference.className='recipe-preference';
  preference.innerHTML='<button type="button" class="journal-secondary"></button><span role="status" aria-live="polite"></span>';
  document.querySelector('.recipe-footer').before(preference);
  const visibilityButton=preference.querySelector('button');
  const refreshVisibility=()=>visibilityButton.textContent=hiddenRecipes.has(active.id)?'Restore recipe':'Hide recipe';
  refreshVisibility();
  visibilityButton.addEventListener('click',()=>{
    const hide=!hiddenRecipes.has(active.id);const status=preference.querySelector('[role="status"]');
    if(setRecipeHidden(active.id,hide,status)){refreshVisibility();status.textContent=hide?'Hidden from your collection. Notes and cooking history are kept.':'Restored to your collection.';}
  });
}
search.addEventListener('input',renderList);
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderList();}));

document.addEventListener('keydown',event=>{if(!document.body.dataset.recipe&&(event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();search.focus();}});
const legacyRecipe = window.recipes.find(r=>r.id===location.hash.slice(1));
if (!document.body.dataset.recipe && legacyRecipe) {
  location.replace(new URL(recipeURL(legacyRecipe.id),document.baseURI).href);
} else if (document.body.dataset.recipe) {
  document.querySelector('#collection').hidden = true;
  document.querySelector('#recipe').hidden = false;
  selectRecipe();
} else {
  renderList();
}
window.addEventListener('hashchange',()=>{
  const recipe = window.recipes.find(r=>r.id===location.hash.slice(1));
  if (!document.body.dataset.recipe && recipe) location.replace(new URL(recipeURL(recipe.id),document.baseURI).href);
});
