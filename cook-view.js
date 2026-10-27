window.mountCookView=async function(recipe){
  const D=RecipeData,key=`recipe-book:progress:v1:${recipe.id}`;
  const initial={checks:{},stepId:null,cookView:false,textSize:20};
  let progress=initial,wake,wakePending=false,keepAwake=true;
  const toolbar=document.createElement('div');toolbar.className='cook-toolbar';
  toolbar.innerHTML='<button type="button" class="journal-secondary cook-toggle" aria-pressed="false">Cook view</button><div class="cook-options" hidden><button type="button" class="journal-secondary" data-size="-1" aria-label="Smaller cooking text">A−</button><button type="button" class="journal-secondary" data-size="1" aria-label="Larger cooking text">A+</button><button type="button" class="journal-secondary" data-start-over>Start over</button><label><input type="checkbox" checked> Keep screen awake</label><span class="wake-status" role="status"></span></div><p class="progress-status" role="status"></p>';
  document.querySelector('.recipe-body').before(toolbar);
  const status=toolbar.querySelector('.progress-status'),wakeStatus=toolbar.querySelector('.wake-status');
  if(typeof ResizeObserver==='function')new ResizeObserver(()=>document.documentElement.style.setProperty('--cook-toolbar-height',`${toolbar.getBoundingClientRect().height}px`)).observe(toolbar);
  const ingredients=[...document.querySelectorAll('.ingredients input')];
  const rows=recipe.ingredients.filter(Array.isArray);
  const hash=text=>{let h=2166136261;for(const c of text){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0).toString(36);};
  const ids=rows.map(row=>'ingredient-'+hash(row.join('|')));
  const steps=[...document.querySelectorAll('.steps li')];
  function validate(value){
    if(!value||typeof value.checks!=='object'||Array.isArray(value.checks)||!Number.isInteger(value.textSize)||value.textSize<18||value.textSize>26)throw Error('Saved cooking progress could not be read.');
    return value;
  }
  function paint(){
    document.body.classList.toggle('is-cooking',!!progress.cookView);
    document.documentElement.style.setProperty('--cooking-text-size',`${progress.textSize}px`);
    toolbar.querySelector('.cook-toggle').setAttribute('aria-pressed',String(!!progress.cookView));
    toolbar.querySelector('.cook-toggle').textContent=progress.cookView?'Exit Cook view':'Cook view';
    toolbar.querySelector('.cook-options').hidden=!progress.cookView;
    ingredients.forEach((input,i)=>input.checked=!!progress.checks[ids[i]]);
    steps.forEach(step=>{const selected=step.dataset.step===progress.stepId;step.classList.toggle('current-step',selected);step.querySelector('.step-marker').setAttribute('aria-pressed',String(selected));});
    const cue=document.querySelector('.completion-cue');if(cue)cue.hidden=!ingredients.every(input=>input.checked);
  }
  async function change(mutator){
    try{const out=await D.update(key,initial,current=>({value:mutator(validate(current))}));progress=out.value;paint();}
    catch(error){D.error(status,error);}
  }
  async function wakeScreen(){
    if(!progress.cookView||!keepAwake||document.hidden){if(wake){await wake.release().catch(()=>{});wake=null;}wakeStatus.textContent=progress.cookView?'Keep-awake is off.':'';return;}
    if(!navigator.wakeLock){wakeStatus.textContent='Keep-awake is unavailable. Adjust your Mac’s display settings if needed.';return;}
    if(wakePending)return;
    try{if(wake&&!wake.released)return;wakePending=true;wake=await navigator.wakeLock.request('screen');if(!progress.cookView||!keepAwake||document.hidden){await wake.release();wake=null;return;}wakeStatus.textContent='Screen stays awake while this page is visible.';wake.addEventListener('release',()=>wakeStatus.textContent='Keep-awake released. The Mac may sleep.');}
    catch{wakeStatus.textContent='Keep-awake was not granted. The Mac may sleep.';}
    finally{wakePending=false;}
  }
  toolbar.querySelector('.cook-toggle').addEventListener('click',async()=>{await change(current=>({...current,cookView:!current.cookView}));await wakeScreen();if(progress.cookView)toolbar.scrollIntoView({block:'start',behavior:'smooth'});});
  toolbar.querySelectorAll('[data-size]').forEach(button=>button.addEventListener('click',()=>change(current=>({...current,textSize:Math.min(26,Math.max(18,current.textSize+Number(button.dataset.size)))}))));
  toolbar.querySelector('[data-start-over]').addEventListener('click',async()=>{await change(current=>({...current,checks:{},stepId:null}));status.textContent='Cooking progress reset. Notes, history and timers were kept.';});
  toolbar.querySelector('input').addEventListener('change',async event=>{keepAwake=event.target.checked;await wakeScreen();});
  document.addEventListener('visibilitychange',wakeScreen);
  ingredients.forEach((input,i)=>input.addEventListener('change',()=>{const checked=input.checked;change(current=>({...current,checks:{...current.checks,[ids[i]]:checked}}));}));
  document.querySelector('#reset').addEventListener('click',()=>change(current=>({...current,checks:{}})));
  steps.forEach(step=>{
    const select=()=>change(current=>({...current,stepId:step.dataset.step}));
    step.querySelector('.step-marker').addEventListener('click',select);
    step.addEventListener('click',event=>{if(event.target.closest('button,input,select,textarea,a,label,details'))return;select();});
  });
  window.addEventListener('recipe-timer-start',event=>{if(event.detail.recipeId===recipe.id)change(current=>({...current,stepId:event.detail.stepId}));});
  D.subscribe(key,async()=>{try{progress=validate(await D.read(key,initial));paint();await wakeScreen();}catch(error){D.error(status,error);}});
  try{progress=validate(await D.read(key,initial));paint();if(progress.cookView)await wakeScreen();}catch(error){D.error(status,error);}
};
