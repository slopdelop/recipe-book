(() => {
  const D=RecipeData,T=RecipeTimerState,key='recipe-book:timers:v1',units={seconds:1,minutes:60,hours:3600},safe=D.escape;
  const legacy={};for(const recipe of window.recipes)for(const step of recipe.steps)for(const timer of step[2]?.timers||[])legacy[timer.legacyId]=`${recipe.id}:${step[2].id}:${timer.id}`;
  let timers=[],audio,audioEnabled=false,tickPending=false,queue=Promise.resolve();
  const tray=document.createElement('aside');tray.className='timer-tray';tray.setAttribute('aria-label','Kitchen timers');tray.hidden=true;
  tray.innerHTML='<details open><summary>Kitchen timers <span class="timer-count"></span></summary><div class="timer-items"></div></details><button class="timer-enable-audio" type="button">Enable sound & voice</button><p class="timer-storage-message" role="status"></p>';
  document.body.append(tray);
  const message=tray.querySelector('.timer-storage-message');
  const alert=document.createElement('div');alert.className='timer-announcement';alert.setAttribute('role','status');alert.setAttribute('aria-live','polite');document.body.append(alert);
  const visible=()=>timers.filter(t=>!['cancelled','dismissed'].includes(t.phase));
  const read=async()=>T.normalize(await D.read(key,[]),legacy);
  const format=ms=>{const n=Math.ceil(ms/1000),h=Math.floor(n/3600),m=Math.floor(n%3600/60),s=n%60;return h?`${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`:`${m}:${String(s).padStart(2,'0')}`;};
  async function unlockAudio(){
    try{const Audio=window.AudioContext||window.webkitAudioContext;if(Audio){audio ||= new Audio();if(audio.state!=='running')await audio.resume();}audioEnabled=audio?.state==='running'||(!Audio&&'speechSynthesis' in window);}
    catch{audioEnabled=false;message.textContent='Sound could not be enabled. Finished timers will still appear here.';}
    tray.querySelector('.timer-enable-audio').hidden=audioEnabled;
  }
  const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  function tune(){
    if(audio?.state!=='running')return 0;
    const start=audio.currentTime;
    [523.25,659.25,783.99,1046.5].forEach((frequency,i)=>{
      const oscillator=audio.createOscillator(),gain=audio.createGain(),at=start+i*.19;
      oscillator.type='sine';oscillator.frequency.value=frequency;gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.16,at+.015);gain.gain.exponentialRampToValueAtTime(.001,at+.32);oscillator.connect(gain);gain.connect(audio.destination);oscillator.start(at);oscillator.stop(at+.34);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
    });return 1100;
  }
  const validSignal=async event=>{if(!event)return true;const latest=(await read()).find(t=>t.runId===event.runId);return latest&&(event.type==='complete'?latest.phase==='finished':latest.phase==='running'&&!latest.events.complete);};
  function say(text,event){
    queue=queue.catch(()=>{}).then(async()=>{
      if(!audioEnabled||!await validSignal(event))return;
      await delay(tune());if(!await validSignal(event))return;
      if(!('speechSynthesis' in window)){message.textContent='Voice is unavailable in this browser. The tune and on-screen timer still work.';return;}
      await new Promise(resolve=>{
        const speech=new SpeechSynthesisUtterance(text);speech.rate=.95;
        const voices=speechSynthesis.getVoices(),voice=voices.find(v=>/^en\b/i.test(v.lang)&&/Samantha|natural/i.test(v.name))||voices.find(v=>/^en\b/i.test(v.lang));
        if(voice){speech.voice=voice;speech.lang=voice.lang;}
        const timeout=setTimeout(resolve,30000);speech.onend=()=>{clearTimeout(timeout);resolve();};speech.onerror=()=>{clearTimeout(timeout);message.textContent='Voice could not play. Check your sound settings; completion is shown above.';resolve();};speechSynthesis.speak(speech);
      });
    });
  }
  tray.querySelector('.timer-enable-audio').addEventListener('click',async()=>{await unlockAudio();say('Kitchen timer sound is ready.');});
  async function change(action){
    const out=await D.update(key,[],raw=>T.transition(T.normalize(raw,legacy),{...action,announce:audioEnabled},Date.now(),()=>crypto.randomUUID()));
    timers=out.value;render();
    for(const event of out.result?.events||[]){alert.textContent=event.text;say(event.text,event);}
    return out;
  }
  function sync(){
    document.querySelectorAll('[data-timer-definition]').forEach(group=>{
      const timer=timers.find(t=>t.definitionId===group.dataset.timerDefinition&&['running','paused'].includes(t.phase)),busy=!!timer;
      const chip=group.closest('li').querySelector(`[data-duration-chip="${group.dataset.timerDefinition}"]`);
      if(chip){chip.disabled=busy;chip.setAttribute('aria-describedby',group.querySelector('.timer-inline-status').id);}
      group.querySelector('.timer-inline-status').textContent=busy?(timer.phase==='paused'?'Paused':'Running in Kitchen timers'):'';
      group.querySelectorAll('input,select,button[type=submit]').forEach(input=>input.disabled=busy);
      if(busy&&units[timer.unit]){group.querySelector('select').value=timer.unit;group.querySelector('input[type=number]').value=timer.duration/1000/units[timer.unit];}
    });
  }
  function render(){
    const list=visible();tray.hidden=!list.length;tray.querySelector('.timer-count').textContent=list.length;tray.querySelector('.timer-enable-audio').hidden=audioEnabled;
    const oldOpen=tray.querySelector('details').open;
    tray.querySelector('.timer-items').innerHTML=list.map(t=>`<div class="timer-card ${t.phase==='finished'?'timer-finished':''}"><div class="timer-card-heading"><strong>${safe(t.label)}</strong><output class="timer-countdown" data-run="${safe(t.runId)}" aria-live="off">${t.phase==='finished'?'Done':format(T.remaining(t,Date.now()))}</output></div><small>${safe(t.recipe)}${t.phase==='paused'?' · Paused':''}</small><div class="timer-actions">${t.phase==='finished'?`<button type="button" data-action="restart" data-run="${safe(t.runId)}">Restart</button><button type="button" data-action="dismiss" data-run="${safe(t.runId)}">Dismiss</button>`:`<button type="button" data-action="${t.phase==='running'?'pause':'resume'}" data-run="${safe(t.runId)}">${t.phase==='running'?'Pause':'Resume'}</button><button type="button" data-action="cancel" data-run="${safe(t.runId)}">Cancel</button>`}</div></div>`).join('');
    tray.querySelector('details').open=oldOpen;
    tray.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',async()=>{
      const ready=unlockAudio();try{await change({type:button.dataset.action,runId:button.dataset.run});await ready;}catch(error){D.error(message,error);}
    }));sync();
  }
  async function tick(){
    const now=Date.now();let needsChange=false;
    for(const timer of timers){
      if(audioEnabled&&timer.phase==='finished'&&!timer.events.complete)needsChange=true;
      if(timer.phase!=='running')continue;const left=T.remaining(timer,now);
      if(!left||(audioEnabled&&timer.halfway&&!timer.events.halfway&&left<=timer.duration/2))needsChange=true;
      const output=[...tray.querySelectorAll('[data-run].timer-countdown')].find(e=>e.dataset.run===timer.runId);if(output&&output.textContent!==format(left))output.textContent=format(left);
    }
    if(!needsChange||tickPending)return;tickPending=true;
    try{await change({type:'tick'});}catch(error){D.error(message,error);}finally{tickPending=false;}
  }
  function insertChip(paragraph,phrase,chip){
    const walker=document.createTreeWalker(paragraph,NodeFilter.SHOW_TEXT);let node;
    while(node=walker.nextNode()){
      const index=node.textContent.indexOf(phrase);if(index<0)continue;
        const tail=node.splitText(index),rest=tail.splitText(phrase.length),wrap=document.createElement('span');
        wrap.className='timer-phrase';wrap.append(chip);
        const punctuation=rest.textContent.match(/^[,.]/);if(punctuation){wrap.append(punctuation[0]);rest.deleteData(0,1);}
        tail.replaceWith(wrap);return true;
    }return false;
  }
  window.mountRecipeTimers=async recipe=>{
    if(recipe){
      let hasTimers=false;
      for(const step of recipe.steps)for(const config of step[2].timers||[]){
        hasTimers=true;const definitionId=`${recipe.id}:${step[2].id}:${config.id}`,stepElement=[...document.querySelectorAll('.steps li')].find(e=>e.dataset.step===step[2].id),content=stepElement.lastElementChild;
        const group=document.createElement('div');group.className='step-timer';group.dataset.timerDefinition=definitionId;
        const statusId=`timer-status-${recipe.id}-${step[2].id}-${config.id}`;
        group.innerHTML=`<div class="timer-compact-controls"><details class="timer-adjust"><summary>Adjust timer</summary><form><div class="timer-duration"><label><span class="sr-only">Timer duration for ${safe(config.label)}</span><input type="number" value="${config.value}" min="0.01" max="10080" step="any" required></label><label><span class="sr-only">Timer unit for ${safe(config.label)}</span><select>${Object.keys(units).map(unit=>`<option ${unit===config.unit?'selected':''}>${unit}</option>`).join('')}</select></label><button type="submit">Start adjusted timer</button></div></form></details><span class="timer-inline-status" id="${statusId}" role="status"></span></div>${config.range?`<small>Click the time to start ${config.value} ${config.unit}; adjust if needed.</small>`:''}${config.halfway?'<label class="halfway-option"><input type="checkbox" checked> Remind me to turn halfway</label>':''}`;
        content.append(group);
        async function start(value,unit){
          const ready=unlockAudio();try{
            await change({type:'start',spec:{definitionId,label:config.label,recipe:recipe.name,duration:Math.round(value*units[unit]*1000),unit,halfway:!!group.querySelector('input[type=checkbox]')?.checked}});
            await ready;group.querySelector('details').open=false;alert.textContent=`${config.label} timer started.`;
            window.dispatchEvent(new CustomEvent('recipe-timer-start',{detail:{recipeId:recipe.id,stepId:step[2].id}}));
          }catch(error){group.querySelector('.timer-inline-status').textContent=error.message;}
        }
        const chip=document.createElement('button');chip.type='button';chip.className='duration-chip';chip.dataset.durationChip=definitionId;chip.textContent=config.phrase;chip.setAttribute('aria-label',`Start ${config.label} timer for ${config.value} ${config.unit}`);chip.title=`Start ${config.value} ${config.unit} timer`;
        chip.addEventListener('click',()=>start(config.value,config.unit));
        if(!insertChip(content.querySelector('p'),config.phrase,chip))group.prepend(chip);
        group.querySelector('form').addEventListener('submit',event=>{event.preventDefault();if(event.target.reportValidity())start(Number(group.querySelector('input[type=number]').value),group.querySelector('select').value);});
      }
      if(hasTimers){
        const help=document.createElement('div');help.className='timer-help';help.innerHTML='<span>Click a highlighted time to start. Keep the page open and Mac awake for sound.</span><button type="button">Test sound & voice</button>';
        document.querySelector('.steps').before(help);help.querySelector('button').addEventListener('click',async()=>{await unlockAudio();say('Kitchen timer sound is ready.');});
      }
    }
    try{timers=await read();render();await tick();}catch(error){D.error(message,error);tray.hidden=false;}
  };
  D.subscribe(key,async()=>{try{timers=await read();render();}catch(error){D.error(message,error);}});
  window.addEventListener('pageshow',async()=>{try{timers=await read();render();await tick();}catch(error){D.error(message,error);}});
  document.addEventListener('visibilitychange',tick);setInterval(tick,250);
})();
