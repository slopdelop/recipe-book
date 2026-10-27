(() => {
  const timings = {
    mushrooms: {1: [{label:'Mushroom aromatics',value:1,unit:'minutes',range:'1–2 minutes'}]},
    tabouli: {0:[{label:'Soak bulgur',value:5,unit:'minutes',range:'5–7 minutes'}],4:[{label:'Chill tabouli',value:30,unit:'minutes'}]},
    onions: {1:[{label:'Slow-cooker onions',value:12,unit:'hours'}]},
    'greek-salad': {2:[{label:'Rest Greek salad',value:30,unit:'minutes'}]},
    'maple-roasted-squash': {
      1:[{label:'Simmer lemon',value:2,unit:'minutes'}],
      2:[{label:'Simmer maple glaze',value:2,unit:'minutes'}],
      4:[{label:'Roast squash',value:25,unit:'minutes',range:'25–35 minutes',halfway:true}]
    }
  };
  const key='recipe-book:timers:v1';
  const units={seconds:1,minutes:60,hours:3600};
  const safe=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read=()=>{
    try {const data=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(data)?data.filter(t=>typeof t.id==='string'&&/^[a-z0-9-]+$/.test(t.id)&&typeof t.label==='string'&&typeof t.recipe==='string'&&['running','paused','finished'].includes(t.phase)&&Number.isFinite(t.due)&&Number.isFinite(t.left)&&t.left>=0&&Number.isFinite(t.duration)&&t.duration>0):[];}
    catch{return [];}
  };
  let timers=read();
  let audio;
  const expiring=new Set();
  const tray=document.createElement('aside');tray.className='timer-tray';tray.setAttribute('aria-label','Kitchen timers');tray.hidden=true;
  tray.innerHTML='<details open><summary>Kitchen timers <span class="timer-count"></span></summary><div class="timer-items"></div></details><button class="timer-enable-audio" type="button">Enable sound & voice</button><p class="timer-storage-message" role="status"></p>';
  document.body.append(tray);
  const alert=document.createElement('div');alert.className='timer-announcement';alert.setAttribute('role','status');alert.setAttribute('aria-live','polite');document.body.append(alert);
  async function unlockAudio(){
    try {const Audio=window.AudioContext||window.webkitAudioContext;if(Audio){audio ||= new Audio();if(audio.state!=='running')await audio.resume();}}
    catch {alert.textContent='Audio is unavailable. Finished timers will still appear on screen.';}
    tray.querySelector('.timer-enable-audio').hidden=audio?.state==='running';
  }
  tray.querySelector('.timer-enable-audio').addEventListener('click',async()=>{await unlockAudio();announce('Kitchen timer sound is ready.');});
  function announce(label){
    let delay=0;
    if(audio?.state==='running') {
      const start=audio.currentTime;
      [523.25,659.25,783.99,1046.5].forEach((frequency,i)=>{
        const oscillator=audio.createOscillator(),gain=audio.createGain();
        oscillator.type='sine';oscillator.frequency.value=frequency;
        const at=start+i*.19;
        gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.16,at+.015);gain.gain.exponentialRampToValueAtTime(.001,at+.32);
        oscillator.connect(gain);gain.connect(audio.destination);oscillator.start(at);oscillator.stop(at+.34);
        oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
      });
      delay=1100;
    }
    setTimeout(()=>{
      if('speechSynthesis' in window){
        const speech=new SpeechSynthesisUtterance(label);speech.rate=.95;
        const voice=speechSynthesis.getVoices().find(v=>/^en\b/i.test(v.lang)&&/Samantha|natural/i.test(v.name))||speechSynthesis.getVoices().find(v=>/^en\b/i.test(v.lang));
        if(voice){speech.voice=voice;speech.lang=voice.lang;}
        speech.onerror=()=>{tray.querySelector('.timer-storage-message').textContent='Voice could not play. Check sound settings; timer completion is shown above.';};
        speechSynthesis.speak(speech);
      }
    },delay);
  }
  function persist(){
    try{localStorage.setItem(key,JSON.stringify(timers));tray.querySelector('.timer-storage-message').textContent='';}
    catch{tray.querySelector('.timer-storage-message').textContent='Timer running, but this browser could not save it for reloads.';}
  }
  const remaining=t=>t.phase==='running'?Math.max(0,t.due-Date.now()):t.left;
  function format(ms){const total=Math.ceil(ms/1000),h=Math.floor(total/3600),m=Math.floor(total%3600/60),s=total%60;return h?`${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`:`${m}:${String(s).padStart(2,'0')}`;}
  function syncButtons(){
    document.querySelectorAll('[data-timer-form]').forEach(form=>{
      const timer=timers.find(t=>t.id===form.dataset.timerForm);const busy=timer&&timer.phase!=='finished';
      if(busy&&units[timer.unit]){form.querySelector('select').value=timer.unit;form.querySelector('input[type=number]').value=timer.duration/1000/units[timer.unit];}
      form.querySelectorAll('input,select').forEach(input=>input.disabled=!!busy);
      const button=form.querySelector('button[type=submit]');button.disabled=!!busy;button.textContent=busy?(timer.phase==='paused'?'Paused':'Running'):'Start timer';
    });
  }
  function render(){
    tray.hidden=!timers.length;tray.querySelector('.timer-count').textContent=timers.length;
    tray.querySelector('.timer-enable-audio').hidden=audio?.state==='running';
    tray.querySelector('.timer-items').innerHTML=timers.map(t=>`<div class="timer-card ${t.phase==='finished'?'timer-finished':''}"><div class="timer-card-heading"><strong>${safe(t.label)}</strong><output class="timer-countdown" data-countdown="${safe(t.id)}" aria-live="off">${t.phase==='finished'?'Done':format(remaining(t))}</output></div><small>${safe(t.recipe)}${t.phase==='paused'?' · Paused':''}</small><div class="timer-actions">${t.phase==='finished'?`<button type="button" data-action="restart" data-id="${safe(t.id)}">Restart</button><button type="button" data-action="dismiss" data-id="${safe(t.id)}">Dismiss</button>`:`<button type="button" data-action="${t.phase==='running'?'pause':'resume'}" data-id="${safe(t.id)}">${t.phase==='running'?'Pause':'Resume'}</button><button type="button" data-action="cancel" data-id="${safe(t.id)}">Cancel</button>`}</div></div>`).join('');
    tray.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',async()=>{
      await unlockAudio();const timer=timers.find(t=>t.id===button.dataset.id);if(!timer)return;
      const action=button.dataset.action;
      if(action==='pause'){if(remaining(timer)===0){finish(timer.id);return;}timer.left=remaining(timer);timer.phase='paused';}
      if(action==='resume'){timer.due=Date.now()+timer.left;timer.phase='running';}
      if(action==='restart'){timer.left=timer.duration;timer.due=Date.now()+timer.duration;timer.phase='running';timer.halfwayAnnounced=false;}
      if(action==='cancel'||action==='dismiss')timers=timers.filter(t=>t.id!==timer.id);
      persist();render();
    }));
    syncButtons();
  }
  async function finish(id){
    if(expiring.has(id))return;expiring.add(id);
    const finishOnce=()=>{
      // Read before announcing so other open tabs see the same completed timer.
      const saved=read();if(saved.some(t=>t.id===id&&t.phase!=='running')){timers=saved;render();return;}
      const timer=timers.find(t=>t.id===id);if(!timer||timer.phase!=='running'||remaining(timer)>0)return;
      timer.phase='finished';timer.left=0;persist();render();
      alert.textContent=`${timer.label} timer finished.`;announce(`${timer.label} timer is finished.`);
    };
    try{if(navigator.locks)await navigator.locks.request(`recipe-book-timer-${id}`,finishOnce);else finishOnce();}
    finally{expiring.delete(id);}
  }
  function tick(){
    for(const timer of timers){
      if(timer.phase!=='running')continue;
      const left=remaining(timer);
      if(!left){finish(timer.id);continue;}
      if(timer.halfway&&!timer.halfwayAnnounced&&left<=timer.duration/2){timer.halfwayAnnounced=true;persist();alert.textContent='Roast squash: time to turn the squash.';announce('Roast squash. Time to turn the squash.');}
      const output=tray.querySelector(`[data-countdown="${timer.id}"]`);if(output&&output.textContent!==format(left))output.textContent=format(left);
    }
  }
  window.mountRecipeTimers=recipe=>{
    const definitions=timings[recipe?.id]||{};
    if(Object.keys(definitions).length){
      const help=document.createElement('div');help.className='timer-help';help.innerHTML='<span>Keep this page open and your Mac awake for sound.</span><button type="button">Test sound & voice</button>';
      document.querySelector('.steps').before(help);
      help.querySelector('button').addEventListener('click',async()=>{await unlockAudio();announce('Kitchen timer sound is ready.');alert.textContent='Playing the timer tune and voice test.';});
    }
    for(const [index,configs] of Object.entries(definitions)){
      const step=document.querySelectorAll('.steps li')[Number(index)]?.lastElementChild;if(!step)continue;
      configs.forEach((config,i)=>{
        const id=`${recipe.id}-${index}-${i}`;
        const form=document.createElement('form');form.className='step-timer';form.dataset.timerForm=id;
        form.innerHTML=`<div class="timer-duration"><label><span class="sr-only">Timer duration for ${safe(config.label)}</span><input type="number" value="${config.value}" min="0.01" max="10080" step="any" required></label><label><span class="sr-only">Timer unit for ${safe(config.label)}</span><select>${Object.keys(units).map(unit=>`<option ${unit===config.unit?'selected':''}>${unit}</option>`).join('')}</select></label><button type="submit" aria-label="Start ${safe(config.label)} timer">Start timer</button></div>${config.range?`<small>Recipe: ${config.range}. Adjust before starting.</small>`:''}${config.halfway?'<label class="halfway-option"><input type="checkbox" checked> Remind me to turn halfway</label>':''}`;
        step.append(form);
        form.querySelector('input[type=number]').addEventListener('input',event=>event.target.setCustomValidity(''));
        form.querySelector('select').addEventListener('change',()=>form.querySelector('input[type=number]').setCustomValidity(''));
        form.addEventListener('submit',async event=>{
          event.preventDefault();if(!form.reportValidity())return;
          const duration=Math.round(Number(form.querySelector('input[type=number]').value)*units[form.querySelector('select').value]*1000);
          if(!Number.isFinite(duration)||duration<1000||duration>7*86400000){const input=form.querySelector('input[type=number]');input.setCustomValidity('Choose a duration between 1 second and 7 days.');input.reportValidity();return;}
          // Save immediately, before waiting for audio activation.
          if(timers.some(t=>t.id===id&&t.phase!=='finished'))return;
          const timer={id,label:config.label,recipe:recipe.name,phase:'running',duration,unit:form.querySelector('select').value,left:duration,due:Date.now()+duration,halfway:!!form.querySelector('input[type=checkbox]')?.checked,halfwayAnnounced:false};
          timers=timers.filter(t=>t.id!==id);timers.push(timer);persist();render();alert.textContent=`${config.label} timer started.`;
          await unlockAudio();tick();
        });
      });
    }
    render();tick();
  };
  window.addEventListener('storage',event=>{if(event.key===key){timers=read();render();}});
  document.addEventListener('visibilitychange',tick);
  window.addEventListener('pageshow',()=>{timers=read();render();tick();});
  setInterval(tick,250);
})();
