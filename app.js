const list = document.querySelector('#recipe-list');
const search = document.querySelector('#search');
const clock = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>';
const bowl = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10h18c0 6-4 9-9 9s-9-3-9-9zm5 11h8M8 3v4m4-4v4m4-4v4"/></svg>';
let filter = 'All';
let active;
const checked = new Map();
const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function renderList() {
  const query = search.value.trim().toLocaleLowerCase();
  const matches = window.recipes.filter(r => (filter === 'All' || r.category === filter) && [r.name,r.subtitle || '',...r.ingredients.filter(Array.isArray).map(i=>i.join(' '))].join(' ').toLocaleLowerCase().includes(query));
  document.querySelector('#count').textContent = matches.length;
  list.innerHTML = matches.map(r => `<a href="#${r.id}" ${r.id === active?.id ? 'aria-current="page"' : ''}><img class="recipe-thumb" src="images/${r.image || r.id}.webp" alt="" width="46" height="46"><span>${escape(r.name)}<small>${escape(r.category)} · ${escape(r.time)}</small></span></a>`).join('') || '<p class="empty">No recipes found. Try another ingredient or category.</p>';
}
function selectRecipe() {
  active = window.recipes.find(r => r.id === location.hash.slice(1)) || window.recipes[0];
  const done = checked.get(active.id) || new Set();
  document.title = `${active.name} · Recipe Book`;
  document.querySelector('#breadcrumb').textContent = active.category;
  document.querySelector('#recipe').innerHTML = `<header class="recipe-header"><div class="recipe-heading"><div class="eyebrow">${escape(active.category)}</div><h1>${escape(active.name)}</h1>${active.subtitle ? `<p class="subtitle">${escape(active.subtitle)}</p>` : ''}<div class="meta"><span>${clock}${escape(active.time)}</span><span>${bowl}${escape(active.yield)}</span></div></div><img class="recipe-photo" src="images/${active.image || active.id}.webp" alt="${escape(active.name)}" width="480" height="320" fetchpriority="high"></header><div class="recipe-body"><section aria-labelledby="ingredients-title"><div class="section-head"><h2 id="ingredients-title">Ingredients</h2><button id="reset">Reset checks</button></div><ul class="ingredients">${active.ingredients.map((item,i) => item.group ? `<li class="group">${escape(item.group)}</li>` : `<li><label><input type="checkbox" data-index="${i}" ${done.has(i)?'checked':''}><span>${item[0] ? `<span class="amount">${escape(item[0])}</span> ` : ''}${window.colorIngredients(item[1], active.id)}</span></label></li>`).join('')}</ul></section><section aria-labelledby="steps-title"><div class="section-head"><h2 id="steps-title">Steps</h2></div><ol class="steps">${active.steps.map((step,i) => `<li><span class="step-marker" aria-hidden="true">${i+1}</span><div><h3>${window.colorIngredients(step[0], active.id)}</h3><p>${window.colorIngredients(step[1], active.id)}</p></div></li>`).join('')}</ol></section></div><footer class="recipe-footer">${escape(active.source)}${active.photoCredit ? ` · Photo: <a href="${escape(active.photoSource)}" target="_blank" rel="noopener noreferrer">${escape(active.photoCredit)}</a>` : ''}</footer>`;
  document.querySelector('#reset').addEventListener('click', () => {checked.delete(active.id);document.querySelectorAll('.ingredients input').forEach(input=>input.checked=false);});
  document.querySelectorAll('.ingredients input').forEach(input=>input.addEventListener('change',()=>{const state=checked.get(active.id)||new Set();const i=Number(input.dataset.index);input.checked?state.add(i):state.delete(i);checked.set(active.id,state);}));
  renderList();
  window.scrollTo(0,0);
}
search.addEventListener('input',renderList);
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderList();}));
document.querySelector('#print').addEventListener('click',()=>window.print());
window.addEventListener('hashchange',selectRecipe);
document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();search.focus();}});
selectRecipe();
