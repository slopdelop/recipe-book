((root)=>{
  const terminal=new Set(['finished','cancelled','dismissed']);
  function normalize(raw,legacy={}){
    if(!Array.isArray(raw))throw Error('Saved timers could not be read. Existing data has not been changed.');
    return raw.map(t=>{
      if(!t||typeof t.id!=='string'||typeof t.label!=='string'||typeof t.recipe!=='string'||!['running','paused',...terminal].includes(t.phase)||!Number.isFinite(t.due)||!Number.isFinite(t.left)||!Number.isFinite(t.duration)||t.duration<=0)throw Error('A saved timer is invalid. Existing data has not been changed.');
      return {...t,runId:t.runId||`legacy-${t.id}-${Math.round(t.due)}`,definitionId:t.definitionId||legacy[t.id]||t.id,events:{halfway:!!t.halfwayAnnounced,complete:t.phase==='finished',...t.events}};
    });
  }
  const remaining=(timer,now)=>timer.phase==='running'?Math.max(0,timer.due-now):Math.max(0,timer.left);
  function transition(current,action,now,newId){
    const timers=structuredClone(current);let changed=false;const events=[];
    const timer=timers.find(t=>t.runId===action.runId);
    function start(spec){
      if(!Number.isFinite(spec.duration)||spec.duration<1000||spec.duration>7*86400000)throw Error('Choose a duration from 1 second to 7 days.');
      if(timers.some(t=>t.definitionId===spec.definitionId&&!terminal.has(t.phase)))throw Error('This timer is already running or paused.');
      timers.forEach(t=>{if(t.definitionId===spec.definitionId&&t.phase==='finished')t.phase='dismissed';});
      const runId=newId();
      const run={...spec,id:spec.definitionId,runId,phase:'running',due:now+spec.duration,left:spec.duration,events:{halfway:false,complete:false}};
      timers.push(run);changed=true;
    }
    if(action.type==='start')start(action.spec);
    else if(action.type==='tick'){
      for(const run of timers){
        if(run.phase==='finished'&&!run.events.complete&&action.announce!==false){run.events.complete=true;changed=true;events.push({runId:run.runId,type:'complete',label:run.label,text:`${run.label} timer is finished.`});}
        if(run.phase!=='running')continue;
        const left=remaining(run,now);
        if(left===0){
          run.phase='finished';run.left=0;changed=true;
          if(!run.events.complete&&action.announce!==false){run.events.complete=true;events.push({runId:run.runId,type:'complete',label:run.label,text:`${run.label} timer is finished.`});}
        }else if(action.announce!==false&&run.halfway&&!run.events.halfway&&left<=run.duration/2){
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
      else if(action.type==='restart'&&timer.phase==='finished'){
        start({definitionId:timer.definitionId,label:timer.label,recipe:timer.recipe,duration:timer.duration,unit:timer.unit,halfway:timer.halfway});
      }
    }
    return {value:timers,changed,result:{events}};
  }
  const api={normalize,remaining,transition,terminal};
  if(typeof module!=='undefined')module.exports=api;else root.RecipeTimerState=api;
})(typeof window!=='undefined'?window:globalThis);
