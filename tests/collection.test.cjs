const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'recipes.js'),'utf8'),context);const recipes=context.window.recipes;
test('every published recipe has a page, local photo, source and valid meals',()=>{
 const ids=new Set(),meals=new Set(['Breakfast','Lunch','Dinner','Dessert','Snack']);
 for(const r of recipes){assert.ok(!ids.has(r.id));ids.add(r.id);assert.ok(r.displaySource);assert.ok(r.meals.length);assert.ok(r.meals.every(m=>meals.has(m)));assert.ok(fs.existsSync(path.join(root,'images',(r.image||r.id)+'.webp')));const html=fs.readFileSync(path.join(root,'recipes',r.id,'index.html'),'utf8');assert.ok(html.includes('data-recipe="'+r.id+'"'));assert.ok(html.includes('app.js?v=22'));}
 assert.equal(ids.has('onions'),false);
});
test('personal recipe quantities and baking details survive transcription',()=>{
 const chili=recipes.find(r=>r.id==='quick-chili');assert.equal(chili.yield,'Serves 8');assert.ok(chili.ingredients.some(([amount,item])=>amount==='¼ cup'&&item==='dehydrated onion flakes'));assert.ok(chili.ingredients.some(([amount,item])=>amount==='1 lb'&&item==='ground turkey or ground beef'));
 const mochi=recipes.find(r=>r.id==='chocolate-mochi');assert.equal(mochi.yield,'Makes 48 pieces');assert.ok(mochi.ingredients.some(([amount,item])=>amount==='1 tbsp'&&item==='baking soda'));assert.match(mochi.steps[0][1],/325°F for a Pyrex/);
 const cookies=recipes.find(r=>r.id==='cranberry-white-chocolate-cookies');assert.equal(cookies.displaySource,'Mabel');assert.match(cookies.steps.map(s=>s[1]).join(' '),/1½-inch ice cream scoop/);assert.match(cookies.steps.map(s=>s[1]).join(' '),/14–15 minutes/);
 const cake=recipes.find(r=>r.id==='chocolate-fruit-cake');assert.ok(cake.ingredients.some(([amount,item])=>amount==='2 tbsp'&&item==='cocoa powder'));
});
