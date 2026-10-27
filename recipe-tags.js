((root)=>{
  const legacy={Salads:'Salad',Sides:'Side dish',Mains:'Main dish',Dips:'Dip'};
  function tagsFor(recipe){return [...new Set(recipe.tags||[legacy[recipe.category]||recipe.category].filter(Boolean))];}
  function availableTags(recipes){
    const found=new Set(recipes.flatMap(tagsFor)),order=['Salad','Side dish','Main dish','Dip','BBQ'];
    return [...order.filter(tag=>found.has(tag)),...[...found].filter(tag=>!order.includes(tag)).sort()];
  }
  function filterRecipes(recipes,{query='',selectedTags=[],selectedMeal='',hiddenIds=[],showHidden=false}={}){
    const hidden=new Set(hiddenIds),search=query.trim().toLocaleLowerCase();
    return recipes.filter(recipe=>{
      if(showHidden?!hidden.has(recipe.id):hidden.has(recipe.id))return false;
      const tags=tagsFor(recipe);if(!selectedTags.every(tag=>tags.includes(tag)))return false;
      if(selectedMeal&&!(recipe.meals||[]).includes(selectedMeal))return false;
      return [recipe.name,recipe.subtitle||'',recipe.displaySource||'',recipe.source||'',...(recipe.meals||[]),...tags,...recipe.ingredients.filter(Array.isArray).map(row=>row.join(' '))].join(' ').toLocaleLowerCase().includes(search);
    });
  }
  const api={tagsFor,availableTags,filterRecipes};root.RecipeTags=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
