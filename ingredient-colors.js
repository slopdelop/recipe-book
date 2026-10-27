// Dark colors echo the food while remaining readable on the cream background.
// Aliases are scoped to each recipe: "pepper" in muhammara is not black pepper.
window.ingredientPalettes = {
  'corn-chipotle-lime': [
    ['#70501d',['fresh corn','corn']],['#64551e',['unsalted butter','butter']],
    ['#345d3e',['finely chopped fresh cilantro leaves','cilantro']],['#535621',['finely grated lime zest','lime zest','lime wedges']],
    ['#624d2a',['honey']],['#803b2d',['minced canned chipotle chiles in adobo sauce','chipotle chiles','chipotle']],
    ['#555148',['kosher salt','salt']],['#38302c',['freshly ground black pepper','black pepper','pepper']]
  ],
  'corn-paprika-pimiento-chive': [
    ['#70501d',['fresh corn','corn']],['#64551e',['unsalted butter','butter']],['#345d3e',['chopped fresh chives','chives']],
    ['#803b2d',['smoked paprika','pimientos','jarred red bell pepper','pimiento']],['#5c5540',['garlic']],
    ['#555148',['kosher salt','salt']],['#38302c',['freshly ground black pepper','black pepper','pepper']]
  ],
  'corn-herb-parmesan-lemon': [
    ['#70501d',['fresh corn','corn']],['#64551e',['unsalted butter','butter','finely grated lemon zest','lemon zest']],
    ['#5c5540',['finely grated Parmigiano-Reggiano cheese','Parmesan']],
    ['#345d3e',['finely chopped fresh tarragon leaves','finely chopped fresh basil leaves','finely chopped fresh chives','tarragon','basil','chives','herb']],
    ['#555148',['kosher salt','salt']],['#38302c',['freshly ground black pepper','black pepper','pepper']]
  ],
  'roast-carrot-avocado-salad': [
    ['#81431f', ['medium mixed-color carrots','roasted carrots','carrots']],
    ['#555148', ['sea salt','salt']], ['#38302c', ['freshly ground black pepper','black pepper','pepper']],
    ['#6c4a2e', ['whole cumin seeds','cumin seeds']], ['#803b2d', ['small dried chiles','chiles']],
    ['#5c5540', ['garlic','sour cream']], ['#345d3e', ['fresh thyme','thyme','mixed winter salad leaves','salad leaves','watercress']],
    ['#535621', ['extra-virgin olive oil','olive oil']], ['#713343', ['red or white wine vinegar','red wine vinegar','wine vinegar']],
    ['#7a481d', ['roasted orange','orange']], ['#64551e', ['lemon juice','lemon']],
    ['#3c5c36', ['ripe avocados','avocados']], ['#624d2a', ['ciabatta','good bread']], ['#68472f', ['mixed seeds','toasted seeds']]
  ],
  'pork-chops-red-onion-confit': [
    ['#66425a', ['red onion confit','red onion','onion confit']],
    ['#64551e', ['extra butter','butter']], ['#555148', ['salt','sugar']],
    ['#38302c', ['pepper']], ['#56363e', ['balsamic or red wine vinegar','vinegar']],
    ['#684b3c', ['pork chops','chops']], ['#535621', ['oil']]
  ],
  'maple-roasted-squash': [
    ['#794321', ['butternut squash','squash cubes','squash']],
    ['#68472f', ['maple syrup','maple-butter glaze']],
    ['#64551e', ['unsalted butter','butter','lemon slices','lemon half','lemon']],
    ['#535621', ['olive oil']], ['#624d2a', ['ground cardamom','cardamom','coriander seeds','coriander']],
    ['#555148', ['fine sea salt','salt']], ['#803b2d', ['chile powder']], ['#345d3e', ['fresh herbs','herbs']]
  ],
  muhammara: [
    ['#803b2d', ['large fresh red bell pepper','chopped frozen red bell pepper','red bell pepper','fresh pepper','frozen pepper','pepper']],
    ['#345d3e', ['chopped scallions','scallions']],
    ['#64551e', ['freshly squeezed lemon juice','lemon juice']],
    ['#6c4a2e', ['ground cumin','cumin']], ['#555148', ['kosher salt','salt']],
    ['#713343', ['pomegranate molasses']], ['#803b2d', ['red pepper flakes']],
    ['#535621', ['olive oil']], ['#68472f', ['walnuts']], ['#624d2a', ['fresh bread crumbs','bread crumbs']]
  ],
  mushrooms: [
    ['#65503d', ['white or cremini mushrooms','mushrooms','mushroom']],
    ['#535621', ['extra-virgin olive oil','olive oil']],
    ['#555148', ['salt']], ['#38302c', ['freshly ground pepper','pepper']],
    ['#66425a', ['shallots']], ['#5c5540', ['garlic cloves','garlic']],
    ['#345d3e', ['chopped fresh thyme','thyme','rosemary','herbs']],
    ['#64551e', ['dry white wine','white wine','wine']]
  ],
  tabouli: [
    ['#624d2a', ['fine bulgur wheat','bulgur wheat','bulgur']],
    ['#803b2d', ['firm Roma tomatoes','tomatoes']],
    ['#345d3e', ['English cucumber','cucumber']], ['#345d3e', ['parsley','fresh mint leaves','mint','herbs']],
    ['#345d3e', ['green onions']], ['#555148', ['salt']],
    ['#535621', ['lime juice']], ['#64551e', ['lemon juice']], ['#535621', ['extra-virgin olive oil','olive oil']],
    ['#345d3e', ['romaine lettuce leaves','romaine leaves']]
  ],
  onions: [
    ['#6c4b2e', ['onions']], ['#64551e', ['unsalted butter','butter']],
    ['#56363e', ['balsamic vinegar']], ['#555148', ['salt']]
  ],
  'greek-salad': [
    ['#345d3e', ['hothouse cucumber','cucumber']], ['#803b2d', ['red bell pepper','peppers']],
    ['#624b18', ['yellow bell pepper']], ['#803b2d', ['cherry or grape tomatoes','tomatoes']],
    ['#66425a', ['red onion']], ['#5c5540', ['feta cheese','feta']],
    ['#4c3443', ['Kalamata olives','olives']], ['#5c5540', ['garlic']],
    ['#345d3e', ['dried oregano','oregano']], ['#624b18', ['Dijon mustard','mustard']],
    ['#713343', ['red wine vinegar','vinegar']], ['#555148', ['kosher salt','salt']],
    ['#38302c', ['freshly ground black pepper','black pepper','pepper']], ['#535621', ['olive oil']]
  ]
};

window.colorIngredients = function(text, recipeId) {
  const escapeHTML = value => value.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const entries = (window.ingredientPalettes[recipeId] || []).flatMap(([color, terms]) => terms.map(term => ({term,color})));
  if (!entries.length) return escapeHTML(text);
  entries.sort((a,b) => b.term.length-a.term.length);
  const colors = new Map(entries.map(entry=>[entry.term.toLowerCase(),entry.color]));
  const pattern = new RegExp('\\b(?:'+entries.map(({term})=>term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')+')\\b','gi');
  let cursor = 0;
  let html = '';
  for (const match of text.matchAll(pattern)) {
    html += escapeHTML(text.slice(cursor,match.index));
    html += `<span class="ingredient-name" style="--ingredient-color:${colors.get(match[0].toLowerCase())}">${escapeHTML(match[0])}</span>`;
    cursor = match.index+match[0].length;
  }
  return html+escapeHTML(text.slice(cursor));
};
