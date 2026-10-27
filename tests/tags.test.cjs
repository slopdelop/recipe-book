const test=require('node:test'),assert=require('node:assert/strict'),T=require('../recipe-tags.js');
const recipes=[{id:'corn',name:'Chipotle corn',tags:['Side dish','BBQ'],ingredients:[['1 tsp','chipotle']]},{id:'salad',name:'Greek salad',tags:['Salad','Side dish'],ingredients:[]},{id:'chops',name:'Pork chops',tags:['Main dish'],ingredients:[]}];
test('multiple tags use intersection rather than union',()=>{assert.deepEqual(T.filterRecipes(recipes,{selectedTags:['Side dish','BBQ']}).map(r=>r.id),['corn']);assert.deepEqual(T.filterRecipes(recipes,{selectedTags:['Main dish','BBQ']}),[]);});
test('one tag includes recipes with any other tags too',()=>{assert.deepEqual(T.filterRecipes(recipes,{selectedTags:['Side dish']}).map(r=>r.id),['corn','salad']);});
test('tag search and ingredient search combine with selected tags',()=>{assert.equal(T.filterRecipes(recipes,{query:'bbq'}).length,1);assert.equal(T.filterRecipes(recipes,{query:'chipotle',selectedTags:['Side dish']}).length,1);assert.equal(T.filterRecipes(recipes,{query:'chipotle',selectedTags:['Main dish']}).length,0);});
test('hidden recipes remain excluded and the Hidden view supports tags',()=>{assert.equal(T.filterRecipes(recipes,{hiddenIds:['corn'],selectedTags:['BBQ']}).length,0);assert.equal(T.filterRecipes(recipes,{hiddenIds:['corn'],showHidden:true,selectedTags:['BBQ']}).length,1);});
test('legacy categories have readable fallback tags and tag lists are unique',()=>{assert.deepEqual(T.tagsFor({category:'Sides'}),['Side dish']);assert.deepEqual(T.tagsFor({tags:['BBQ','BBQ','Side dish']}),['BBQ','Side dish']);assert.deepEqual(T.availableTags(recipes),['Salad','Side dish','Main dish','BBQ']);});
test('meal selection combines with tags, search and hidden status',()=>{
 const items=[{...recipes[0],meals:['Lunch','Dinner'],displaySource:'Weber'},{...recipes[1],meals:['Lunch'],displaySource:'Ina Garten'}];
 assert.deepEqual(T.filterRecipes(items,{selectedMeal:'Dinner',selectedTags:['BBQ'],query:'Weber'}).map(r=>r.id),['corn']);
 assert.equal(T.filterRecipes(items,{selectedMeal:'Breakfast'}).length,0);
 assert.equal(T.filterRecipes(items,{selectedMeal:'Dinner',hiddenIds:['corn']}).length,0);
 assert.equal(T.filterRecipes(items,{query:'lunch'}).length,2);
 assert.equal(T.filterRecipes(items,{query:'ina garten'}).length,1);
});
