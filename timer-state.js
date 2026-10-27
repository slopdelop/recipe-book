((root)=>{
  const terminal=new Set(['finished','cancelled','dismissed']);
  function normalize(raw,legacy={}){
    if(!Array.isArray(raw))throw Error('Saved timers could not be read. Existing data has not been changed.');
    return raw.map(t=>{
      if(!t||typeof t.id!=='string'||typeof t.label!=='string'||typeof t.recipe!=='string'||!['running','paused',...terminal].includes(t.phase)||!Number.isFinite(t.due)||!Number.isFinite(t.left)||!Number.isFinite(t.duration)||t.duration<=0)throw Error('A saved timer is invalid. Existing data has not been changed.');
      return {...t,baseDuration:Number.isFinite(t.baseDuration)&&t.baseDuration>0?t.baseDuration:t.duration,alertSequence:Number.isSafeInteger(t.alertSequence)?t.alertSequence:0,lastAlertAt:Number.isFinite(t.lastAlertAt)?t.lastAlertAt:null,runId:t.runId||`legacy-${t.id}-${Math.round(t.due)}`,definitionId:t.definitionId||legacy[t.id]||t.id,events:{halfway:!!t.halfwayAnnounced,complete:t.phase==='finished',...t.events}};
    });
  }
  const remaining=(timer,now)=>timer.phase==='running'?Math.max(0,timer.due-now):Math.max(0,timer.left);
  const repeatInterval=10000;
  function suggestedExtension(timer){
    const target=Math.min(1800000,Math.max(30000,(timer.baseDuration||timer.duration)*.2));
    return [30000,60000,120000,180000,300000,600000,900000,1800000].reduce((best,value)=>Math.abs(value-target)<Math.abs(best-target)?value:best);
  }
  function isSignalValid(timers,event){
    const run=timers.find(t=>t.runId===event.runId);if(!run)return false;
    if(event.type==='complete')return run.phase==='finished';
    if(event.type==='repeat')return run.phase==='finished'&&run.alertSequence===event.sequence;
    return run.phase==='running'&&!run.events.complete;
  }
  function transition(current,action,now,newId){
    const timers=structuredClone(current);let changed=false;const events=[];
    const timer=timers.find(t=>t.runId===action.runId);
    function start(spec){
      if(!Number.isFinite(spec.duration)||spec.duration<1000||spec.duration>7*86400000)throw Error('Choose a duration from 1 second to 7 days.');
      if(timers.some(t=>t.definitionId===spec.definitionId&&!terminal.has(t.phase)))throw Error('This timer is already running or paused.');
      timers.forEach(t=>{if(t.definitionId===spec.definitionId&&t.phase==='finished')t.phase='dismissed';});
      const runId=newId();
      const run={...spec,baseDuration:spec.baseDuration||spec.duration,id:spec.definitionId,runId,phase:'running',due:now+spec.duration,left:spec.duration,alertSequence:0,lastAlertAt:null,events:{halfway:false,complete:false}};
      timers.push(run);changed=true;
    }
    if(action.type==='start')start(action.spec);
    else if(action.type==='tick'){
      for(const run of timers){
        if(run.phase==='running'&&remaining(run,now)===0){
          run.phase='finished';run.left=0;changed=true;
        }
        if(run.phase==='finished'&&action.announce!==false&&(!run.events.complete||!Number.isFinite(run.lastAlertAt)||now-run.lastAlertAt>=repeatInterval)){
          const type=run.events.complete?'repeat':'complete';run.events.complete=true;
          run.alertSequence=(run.alertSequence||0)+1;run.lastAlertAt=now;changed=true;
          events.push({runId:run.runId,type,sequence:run.alertSequence,label:run.label,text:`${run.label} timer is finished.`});
        }else if(run.phase==='running'&&action.announce!==false&&run.halfway&&!run.events.halfway&&remaining(run,now)<=run.duration/2){
          run.events.halfway=true;changed=true;
          events.push({runId:run.runId,type:'halfway',label:run.label,text:`${run.label}. Time to turn the squash.`});
        }
      }
    }else if(timer){
      if(action.type==='pause'&&timer.phase==='running'){
        if(remaining(timer,now)===0)return transition(current,{type:'tick',announce:action.announce},now,newId);
        timer.left=remaining(timer,now);timer.phase='paused';changed=true;
      }else if(action.type==='resume'&&timer.phase==='paused'){timer.due=now+timer.left;timer.phase='running';changed=true;}
      else if(action.type==='cancel'&&!terminal.has(timer.phase)){timer.phase='cancelled';changed=true;}
      else if(action.type==='dismiss'&&timer.phase==='finished'){timer.phase='dismissed';changed=true;}
      else if(action.type==='extend'&&['running','paused','finished'].includes(timer.phase)){
        const extra=action.duration??suggestedExtension(timer);
        if(!Number.isFinite(extra)||extra<1000||extra>7*86400000)throw Error('Choose extra time from 1 second to 7 days.');
        if(timer.phase==='finished'||(timer.phase==='running'&&remaining(timer,now)===0)){
          timer.phase='dismissed';
          start({definitionId:timer.definitionId,label:timer.label,recipe:timer.recipe,duration:extra,baseDuration:timer.baseDuration||timer.duration,unit:extra<60000?'seconds':'minutes',halfway:false});
        }else{
          if(timer.duration+extra>7*86400000)throw Error('A timer can total at most 7 days.');
          timer.baseDuration ||= timer.duration;timer.left=remaining(timer,now)+extra;timer.duration+=extra;
          if(timer.phase==='running')timer.due+=extra;
          changed=true;
        }
      }
      else if(action.type==='restart'&&timer.phase==='finished'){
        start({definitionId:timer.definitionId,label:timer.label,recipe:timer.recipe,duration:timer.duration,unit:timer.unit,halfway:timer.halfway});
      }
    }
    return {value:timers,changed,result:{events,applied:changed}};
  }
  const api={normalize,remaining,transition,terminal,suggestedExtension,isSignalValid,repeatInterval};
  if(typeof module!=='undefined')module.exports=api;else root.RecipeTimerState=api;
})(typeof window!=='undefined'?window:globalThis);
