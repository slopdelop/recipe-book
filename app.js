const list = document.querySelector('#recipe-list');
const search = document.querySelector('#search');
const clock = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>';
const bowl = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10h18c0 6-4 9-9 9s-9-3-9-9zm5 11h8M8 3v4m4-4v4m4-4v4"/></svg>';
const selectedTags=new Set();
let showHidden=false;
let selectedMeal='';
const tagTools=window.RecipeTags;
const filters=document.querySelector('.filters');
const filterHint=document.createElement('p');filterHint.className='filter-hint';filterHint.setAttribute('role','status');filters.closest('.collection-controls').after(filterHint);
let active;
const requestedCollection = new URLSearchParams(location.search).get('collection');
const collectionNames = {all: 'All recipes', tried: 'Tried & good', 'to-try': 'Recipes to Try'};
const collection = ['tried', 'to-try'].includes(requestedCollection) ? requestedCollection : 'all';
const collectionQuery = collection === 'all' ? '' : `?collection=${collection}`;
const recipeURL = (id, query = '') => `recipes/${id}/${query}`;
const promotionKey = 'recipe-book:promotions:v1';
let promotions = {};
const isToTry = recipe => recipe.toTry === true && promotions[recipe.id]?.promoted !== true;
function recipesForCollection() {
  if (collection === 'tried') return window.recipes.filter(recipe => !isToTry(recipe));
  if (collection === 'to-try') return window.recipes.filter(isToTry);
  return [...window.recipes].sort((a, b) => Number(isToTry(a)) - Number(isToTry(b)));
}
const collectionSwitch = document.querySelector('.collection-switch');
if (collectionSwitch && collection !== 'all') {
  collectionSwitch.querySelector('[aria-current]').removeAttribute('aria-current');
  collectionSwitch.querySelector(`[data-collection="${collection}"]`).setAttribute('aria-current', 'page');
  document.querySelector('.collection-heading h1').textContent = collectionNames[collection];
  document.title = `${collectionNames[collection]} · Recipe Book`;
}

const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const mealFilters=document.createElement('div');mealFilters.className='meal-filters';mealFilters.setAttribute('aria-label','Filter recipes by meal');
mealFilters.innerHTML='<span class="filter-label">Meal</span>'+['','Breakfast','Lunch','Dinner','Dessert','Snack'].map(meal=>`<button type="button" data-meal="${meal}" aria-pressed="${!meal}">${meal||'Any meal'}</button>`).join('');
filters.before(mealFilters);
mealFilters.addEventListener('click',event=>{const button=event.target.closest('[data-meal]');if(button){selectedMeal=button.dataset.meal;renderList();}});
function updateTagFilters(recipes) {
  const tags = tagTools.availableTags(recipes);
  const currentTags = [...filters.querySelectorAll('[data-tag]')].map(button => button.dataset.tag);
  if (filters.childElementCount && tags.join('\n') === currentTags.join('\n')) return;
  for (const tag of selectedTags) if (!tags.includes(tag)) selectedTags.delete(tag);
  filters.innerHTML = '<button type="button" aria-pressed="true" data-filter="All">All</button>'
    + tags.map(tag => `<button type="button" aria-pressed="false" data-tag="${escape(tag)}">${escape(tag)}</button>`).join('')
    + '<button type="button" aria-pressed="false" data-filter="Hidden">Hidden</button>';
}
function refreshRecipeStatus() {
  if (!active) return;
  const untried = isToTry(active);
  document.querySelector('.hero-caption .eyebrow').textContent =
    [...(untried ? ['Recipe to try'] : []), ...tagTools.tagsFor(active)].join(' · ');
  const button = document.querySelector('#change-recipe-status');
  if (button) {
    button.textContent = untried ? 'Move to Tried & good' : 'Move back to Recipes to Try';
    button.classList.toggle('is-untried', untried);
  }
}
async function refreshPromotions() {
  try {
    promotions = RecipeSyncState.validatePromotions(await RecipeData.read(promotionKey, {}));
    if (document.body.dataset.recipe) refreshRecipeStatus();
    else renderList();
  } catch (error) {
    const status = document.querySelector('.recipe-preference [role="status"]') || document.querySelector('.collection-status');
    RecipeData.error(status, error);
  }
}
RecipeData.subscribe(promotionKey, refreshPromotions);
window.addEventListener('pageshow', event => {
  if (event.persisted) refreshPromotions();
});
const hiddenKey='recipe-book:hidden:v1';
let hiddenRecipes=new Set();
const validateHidden=value=>{if(!Array.isArray(value)||value.some(id=>typeof id!=='string'))throw Error('Hidden recipes could not be read. Existing data is unchanged.');return value;};
async function refreshHidden(){
  try{hiddenRecipes=new Set(validateHidden(await RecipeData.read(hiddenKey,[])));if(!document.body.dataset.recipe)renderList();const button=document.querySelector('#change-recipe-visibility');if(button)button.textContent=hiddenRecipes.has(active.id)?'Restore recipe':'Hide recipe';}
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
  const collectionRecipes = recipesForCollection();
  updateTagFilters(collectionRecipes);
  const matches=tagTools.filterRecipes(collectionRecipes,{query:search.value,selectedTags:[...selectedTags],selectedMeal,hiddenIds:[...hiddenRecipes],showHidden});
  mealFilters.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.meal===selectedMeal)));
  document.querySelector('#count').textContent = matches.length;
  const hiddenCount = collectionRecipes.filter(recipe => hiddenRecipes.has(recipe.id)).length;
  document.querySelector('[data-filter="Hidden"]').textContent = hiddenCount ? `Hidden (${hiddenCount})` : 'Hidden';
  filters.querySelector('[data-filter="All"]').setAttribute('aria-pressed',String(!showHidden&&!selectedTags.size&&!selectedMeal&&!search.value));
  filters.querySelector('[data-filter="Hidden"]').setAttribute('aria-pressed',String(showHidden));
  filters.querySelectorAll('[data-tag]').forEach(button=>button.setAttribute('aria-pressed',String(selectedTags.has(button.dataset.tag))));
  filterHint.textContent=selectedTags.size?'Matching every selected tag: '+[...selectedTags].join(' + ')+'. Select All to reset.':'Choose one or more tags to narrow the collection.';
  list.innerHTML = matches.map(recipe => {
    const untried = isToTry(recipe);
    const tags = tagTools.tagsFor(recipe).map(tag => `<span class="recipe-tag">${escape(tag)}</span>`);
    const meals = (recipe.meals || []).map(meal => `<span class="recipe-tag recipe-meal">${escape(meal)}</span>`);
    return `<article class="recipe-card${untried ? ' recipe-card-to-try' : ''}">
      <a href="${recipeURL(recipe.id, collectionQuery)}">
        <div class="recipe-thumb-frame">
          <img class="recipe-thumb ${escape(recipe.photoClass || '')}" src="images/${recipe.image || recipe.id}.webp" alt="" width="600" height="400">
          ${untried ? '<span class="recipe-to-try-label">Recipe to try</span>' : ''}
        </div>
        <span>${escape(recipe.name)}
          <small class="recipe-source">${escape(recipe.displaySource || recipe.source)}</small>
          <small>${escape(recipe.time)}</small>
          <span class="recipe-tags">${[...tags, ...meals].join('')}</span>
        </span>
      </a>
      ${hiddenRecipes.has(recipe.id) ? `<button class="restore-recipe" type="button" data-restore="${recipe.id}" aria-label="Restore ${escape(recipe.name)}">Restore recipe</button>` : ''}
    </article>`;
  }).join('') || `<p class="empty">${showHidden ? 'No hidden recipes match.' : 'No recipes found. Try fewer tags or another ingredient.'}</p>`;
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
  document.querySelector('#recipe').innerHTML = `<header class="recipe-hero"><img class="recipe-photo ${escape(active.photoClass||'')}" src="images/${active.image || active.id}.webp" alt="${escape(active.name)}" width="1600" height="700" fetchpriority="high"><div class="hero-tools"><a class="back-link" href="./">← All recipes</a><button id="print" class="print-button">Print recipe</button></div><div class="hero-caption"><div class="caption-panel"><div class="eyebrow">${escape(tagTools.tagsFor(active).join(' · '))}</div><h1>${escape(active.name)}</h1>${active.subtitle ? `<p class="subtitle">${escape(active.subtitle)}</p>` : ''}<div class="meta"><span>${clock}${escape(active.time)}</span>${active.yield ? `<span>${bowl}${escape(active.yield)}</span>` : ''}</div></div></div></header><div class="recipe-body"><section aria-labelledby="ingredients-title"><div class="section-head"><h2 id="ingredients-title">Ingredients</h2><button id="reset">Reset checks</button></div><ul class="ingredients">${active.ingredients.map((item,i) => item.group ? `<li class="group">${escape(item.group)}</li>` : `<li><label><input type="checkbox" data-index="${i}" ${done.has(i)?'checked':''}><span>${item[0] ? `<span class="amount">${escape(item[0])}</span> ` : ''}${window.colorIngredients(item[1], active.id)}</span></label></li>`).join('')}</ul></section><section aria-labelledby="steps-title"><div class="section-head"><h2 id="steps-title">Steps</h2></div><ol class="steps">${active.steps.map((step,i) => `<li data-step="${step[2].id}"><button type="button" class="step-marker" aria-label="Mark ${escape(step[0])} as current step">${i+1}</button><div><h3>${window.colorIngredients(step[0], active.id)}</h3><p>${window.colorIngredients(step[1], active.id)}</p></div></li>`).join('')}</ol></section></div><footer class="recipe-footer">${active.sourceUrl?`<a href="${escape(active.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escape(active.source)}</a>`:escape(active.source)}${active.photoCredit ? ` · Photo: ${active.photoSource?`<a href="${escape(active.photoSource)}" target="_blank" rel="noopener noreferrer">${escape(active.photoCredit)}</a>`:escape(active.photoCredit)}` : ''}</footer>`;
  const backLink = document.querySelector('.back-link');
  backLink.href = './' + collectionQuery;
  backLink.textContent = '← ' + collectionNames[collection];
  refreshRecipeStatus();
  if (active.tips?.length) {
    const tips = document.createElement('section');
    tips.className = 'recipe-tips';
    tips.setAttribute('aria-labelledby', 'tips-title');
    const title = document.createElement('h2');
    title.id = 'tips-title';
    title.textContent = active.tipsTitle || 'Tips';
    const items = document.createElement('ul');
    for (const tip of active.tips) {
      const item = document.createElement('li');
      item.innerHTML = window.colorIngredients(tip, active.id);
      items.append(item);
    }
    tips.append(title, items);
    if (active.tipsSource) {
      const source = document.createElement('a');
      source.href = active.tipsSource;
      source.textContent = 'Read the original recipe notes';
      tips.append(source);
    }
    document.querySelector('.steps').after(tips);
  }
  sizeCaptionShade();
  document.querySelector('#print').addEventListener('click',()=>window.print());
  await window.mountRecipeJournal(active);
  await window.mountCookView(active);
  const preference=document.createElement('div');preference.className='recipe-preference';
  preference.innerHTML = `
    ${active.toTry === true ? '<button id="change-recipe-status" type="button" class="journal-secondary"></button>' : ''}
    <button id="change-recipe-visibility" type="button" class="journal-secondary"></button>
    <span role="status" aria-live="polite"></span>`;
  document.querySelector('.recipe-footer').after(preference);
  const status = preference.querySelector('[role="status"]');
  const promotionButton = preference.querySelector('#change-recipe-status');
  if (promotionButton) {
    refreshRecipeStatus();
    promotionButton.addEventListener('click', async () => {
      const promoted = isToTry(active);
      promotionButton.disabled = true;
      try {
        const {value} = await RecipeData.update(promotionKey, {}, current => {
          const records = RecipeSyncState.validatePromotions(current);
          const previousTime = Date.parse(records[active.id]?.updatedAt) || 0;
          const updatedAt = new Date(Math.max(Date.now(), previousTime + 1)).toISOString();
          return {value: {...records, [active.id]: {promoted, updatedAt}}};
        });
        promotions = value;
        refreshRecipeStatus();
        status.textContent = promoted ? 'Moved to Tried & good.' : 'Moved back to Recipes to Try.';
      } catch (error) {
        RecipeData.error(status, error);
      } finally {
        promotionButton.disabled = false;
      }
    });
  }
  const visibilityButton=preference.querySelector('#change-recipe-visibility');
  const refreshVisibility=()=>visibilityButton.textContent=hiddenRecipes.has(active.id)?'Restore recipe':'Hide recipe';
  refreshVisibility();
  visibilityButton.addEventListener('click',async()=>{
    const hide=!hiddenRecipes.has(active.id);
    if(await setRecipeHidden(active.id,hide,status)){refreshVisibility();status.textContent=hide?'Hidden from your collection. Notes and cooking history are kept.':'Restored to your collection.';}
  });
}
search.addEventListener('input',renderList);
filters.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.filter==='All'){selectedTags.clear();showHidden=false;selectedMeal='';search.value='';}
  else if(button.dataset.filter==='Hidden')showHidden=!showHidden;
  else if(button.dataset.tag){const tag=button.dataset.tag;selectedTags.has(tag)?selectedTags.delete(tag):selectedTags.add(tag);}
  renderList();
});

document.addEventListener('keydown',event=>{if(!document.body.dataset.recipe&&(event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();search.focus();}});
(async()=>{
  await refreshHidden();
  await refreshPromotions();
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

// Follow the rightmost painted text, without changing the title's wrapping box.
function sizeCaptionShade(){
  const panel=document.querySelector('.caption-panel');if(!panel)return;
  let frame;
  const measure=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
    const left=panel.getBoundingClientRect().left;let right=left;
    const walker=document.createTreeWalker(panel,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){
      if(!walker.currentNode.textContent.trim())continue;
      const range=document.createRange();range.selectNodeContents(walker.currentNode);
      for(const rect of range.getClientRects())if(rect.width&&rect.height)right=Math.max(right,rect.right);
    }
    const width=Math.ceil(right-left+8)+'px';if(panel.style.getPropertyValue('--caption-ink-width')!==width)panel.style.setProperty('--caption-ink-width',width);
  });};
  if(window.ResizeObserver)new ResizeObserver(measure).observe(panel);
  window.addEventListener('resize',measure);document.fonts?.ready.then(measure);measure();
}
