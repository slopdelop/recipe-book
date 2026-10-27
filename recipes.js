// Stable step IDs keep progress and timers attached when steps are reordered.
window.retiredRecipeIds = ["onions"];
window.recipes = [
  {
    "id": "muhammara",
    "name": "Muhammara",
    "category": "Dips",
    "subtitle": "Red pepper & walnut spread",
    "time": "5 min + pepper prep",
    "yield": "About 1½ cups",
    "source": "Ana Sortun · Adapted by The New York Times",
    "ingredients": [
      [
        "1",
        "large fresh red bell pepper, roasted; or 1 chopped frozen red bell pepper, thawed"
      ],
      [
        "½ cup",
        "chopped scallions (3–4 scallions)"
      ],
      [
        "1 tsp",
        "freshly squeezed lemon juice"
      ],
      [
        "1 tsp",
        "ground cumin"
      ],
      [
        "1 tsp",
        "kosher salt, plus more to taste"
      ],
      [
        "3 tsp",
        "pomegranate molasses"
      ],
      [
        "1 tsp",
        "red pepper flakes (preferably Marash or Aleppo), plus more to taste"
      ],
      [
        "5 tbsp",
        "olive oil"
      ],
      [
        "¾ cup",
        "walnuts, lightly toasted"
      ],
      [
        "4–6 tbsp",
        "fresh bread crumbs"
      ]
    ],
    "steps": [
      [
        "Prepare the pepper",
        "If using a fresh pepper, char it on all sides over a gas burner or roast at 400°F until blistered all over. Transfer to a bowl and let cool enough to handle. Peel off the skin, remove the seeds and stem, and roughly chop. If using frozen pepper, thaw before continuing.",
        {
          "id": "prepare-pepper"
        }
      ],
      [
        "Blend",
        "Reserve 2 walnuts. In a food processor, combine the pepper, scallions, lemon juice, cumin, salt, 2 teaspoons pomegranate molasses, ½ teaspoon red pepper flakes, 4 tablespoons olive oil, and the remaining walnuts. Purée until mostly smooth.",
        {
          "id": "blend"
        }
      ],
      [
        "Thicken & season",
        "Add 4 tablespoons bread crumbs and pulse to combine. If the mixture is too loose to hold its shape, add the remaining bread crumbs and pulse again. Adjust the salt and red pepper flakes to taste.",
        {
          "id": "thicken-season"
        }
      ],
      [
        "Finish",
        "Scrape into a bowl and use the back of a spoon to make a well in the center. Drizzle the remaining 1 tablespoon olive oil, 1 teaspoon pomegranate molasses, and ½ teaspoon red pepper flakes into the well. Crush the reserved walnuts and sprinkle over the top.",
        {
          "id": "finish"
        }
      ]
    ],
    "tags": [
      "Dip"
    ]
  },
  {
    "id": "mushrooms",
    "image": "mushrooms-upscaled",
    "name": "Quick Pan-cooked Mushrooms",
    "category": "Sides",
    "time": "About 15 min",
    "yield": "Serves 4",
    "source": "Martha Rose Shulman · The New York Times",
    "ingredients": [
      [
        "1 lb",
        "white or cremini mushrooms, briefly rinsed and wiped dry"
      ],
      [
        "2 tbsp",
        "extra-virgin olive oil"
      ],
      [
        "",
        "Salt and freshly ground pepper"
      ],
      [
        "2",
        "shallots, minced"
      ],
      [
        "2–4",
        "garlic cloves, minced, to taste"
      ],
      [
        "2 tsp",
        "chopped fresh thyme or rosemary, or a combination; or ½–1 teaspoon dried"
      ],
      [
        "¼ cup",
        "dry white wine, such as Sauvignon blanc"
      ]
    ],
    "steps": [
      [
        "Slice & sauté",
        "Trim the mushroom ends and cut the mushrooms into thick slices. Heat a large, heavy frying pan over medium-high heat. Add 1 tablespoon olive oil. When hot, add the mushrooms and cook, stirring or tossing, for a few minutes until they start to soften and release moisture.",
        {
          "id": "slice-saute"
        }
      ],
      [
        "Add the aromatics",
        "Add the remaining tablespoon olive oil and reduce the heat to medium. Add the shallots, garlic, and herbs. Stir in ½ teaspoon salt and pepper to taste. Cook, stirring often, for 1–2 minutes until the shallots and garlic soften and become fragrant.",
        {
          "id": "aromatics",
          "timers": [
            {
              "id": "aromatics",
              "label": "Mushroom aromatics",
              "value": 1,
              "unit": "minutes",
              "phrase": "1–2 minutes",
              "range": "1–2 minutes",
              "legacyId": "mushrooms-1-0"
            }
          ]
        }
      ],
      [
        "Reduce the wine",
        "Add the wine. Cook, stirring often and scraping the bottom of the pan, until the wine evaporates. Taste and adjust the seasoning. Remove from the heat and serve.",
        {
          "id": "reduce-wine"
        }
      ]
    ],
    "tags": [
      "Side dish"
    ]
  },
  {
    "id": "tabouli",
    "name": "Tabouli",
    "category": "Salads",
    "time": "20 min + 30 min chilling",
    "yield": "Serves 6–8",
    "source": "Suzy Karadsheh · The Mediterranean Dish",
    "ingredients": [
      [
        "½ cup",
        "fine bulgur wheat"
      ],
      [
        "4",
        "firm Roma tomatoes, very finely chopped"
      ],
      [
        "1",
        "English cucumber, very finely chopped"
      ],
      [
        "2 bunches",
        "parsley, part of the stems removed, washed, well dried, and very finely chopped"
      ],
      [
        "12–15",
        "fresh mint leaves, stems removed, washed, well dried, and very finely chopped"
      ],
      [
        "4",
        "green onions, white and green parts, very finely chopped"
      ],
      [
        "",
        "Salt"
      ],
      [
        "3–4 tbsp",
        "lime juice (or lemon juice)"
      ],
      [
        "3–4 tbsp",
        "extra-virgin olive oil"
      ],
      [
        "",
        "Romaine lettuce leaves, to serve (optional)"
      ]
    ],
    "steps": [
      [
        "Soak the bulgur",
        "Wash the bulgur and soak in water for 5–7 minutes. Drain very well, squeezing it by hand to remove excess water. Set aside.",
        {
          "id": "soak-bulgur",
          "timers": [
            {
              "id": "soak",
              "label": "Soak bulgur",
              "value": 5,
              "unit": "minutes",
              "phrase": "5–7 minutes",
              "range": "5–7 minutes",
              "legacyId": "tabouli-0-0"
            }
          ]
        }
      ],
      [
        "Chop & drain",
        "Very finely chop the vegetables, herbs, and green onions as listed. Place the tomatoes in a colander to drain excess juice.",
        {
          "id": "chop-drain"
        }
      ],
      [
        "Combine",
        "Place the chopped vegetables, herbs, and green onions in a mixing bowl. Add the bulgur, season with salt, and mix gently.",
        {
          "id": "combine"
        }
      ],
      [
        "Dress",
        "Add the lime juice and olive oil, then mix again.",
        {
          "id": "dress"
        }
      ],
      [
        "Chill & serve",
        "For best results, cover and refrigerate for 30 minutes. Transfer to a serving platter. Serve with romaine leaves as wraps or scoops, if desired.",
        {
          "id": "chill-serve",
          "timers": [
            {
              "id": "chill",
              "label": "Chill tabouli",
              "value": 30,
              "unit": "minutes",
              "phrase": "30 minutes",
              "legacyId": "tabouli-4-0"
            }
          ]
        }
      ]
    ],
    "tags": [
      "Salad",
      "Side dish"
    ]
  },
  {
    "id": "greek-salad",
    "name": "Greek Salad",
    "category": "Salads",
    "time": "50 min",
    "yield": "Serves 6",
    "source": "Ina Garten · Food Network",
    "ingredients": [
      [
        "1",
        "hothouse cucumber, unpeeled, seeded, and sliced ¼ inch thick"
      ],
      [
        "1",
        "red bell pepper, large-diced"
      ],
      [
        "1",
        "yellow bell pepper, large-diced"
      ],
      [
        "1 pint",
        "cherry or grape tomatoes, halved"
      ],
      [
        "½",
        "red onion, sliced in half-rounds"
      ],
      [
        "½ lb",
        "feta cheese, cut into ½-inch dice (not crumbled)"
      ],
      [
        "½ cup",
        "Kalamata olives, pitted"
      ],
      {
        "group": "Vinaigrette"
      },
      [
        "2 cloves",
        "garlic, minced"
      ],
      [
        "1 tsp",
        "dried oregano"
      ],
      [
        "½ tsp",
        "Dijon mustard"
      ],
      [
        "¼ cup",
        "red wine vinegar"
      ],
      [
        "1 tsp",
        "kosher salt"
      ],
      [
        "½ tsp",
        "freshly ground black pepper"
      ],
      [
        "½ cup",
        "olive oil"
      ]
    ],
    "steps": [
      [
        "Combine the vegetables",
        "Place the cucumber, peppers, tomatoes, and red onion in a large bowl.",
        {
          "id": "combine-vegetables"
        }
      ],
      [
        "Make the vinaigrette",
        "In a small bowl, whisk together the garlic, oregano, mustard, vinegar, salt, and pepper. While whisking, slowly add the olive oil to form an emulsion.",
        {
          "id": "vinaigrette"
        }
      ],
      [
        "Dress & rest",
        "Pour the vinaigrette over the vegetables. Add the feta and olives and toss lightly. Set aside for 30 minutes to let the flavors blend. Serve at room temperature.",
        {
          "id": "dress-rest",
          "timers": [
            {
              "id": "rest",
              "label": "Rest Greek salad",
              "value": 30,
              "unit": "minutes",
              "phrase": "30 minutes",
              "legacyId": "greek-salad-2-0"
            }
          ]
        }
      ]
    ],
    "tags": [
      "Salad",
      "Side dish"
    ]
  },
  {
    "id": "maple-roasted-squash",
    "name": "Maple-Roasted Squash With Charred Lemon",
    "category": "Sides",
    "subtitle": "Costco pre-cut squash · 2 lb batch",
    "time": "25–35 min roasting",
    "yield": "Serves 4",
    "source": "Adapted from Melissa Clark · NYT Cooking",
    "photoCredit": "Linda Xiao / The New York Times · Food stylist: Monica Pierini",
    "photoSource": "https://www.myersgroupwellness.com/blog/maple-roasted-squash-with-charred-lemon",
    "ingredients": [
      [
        "2 lb",
        "butternut squash, pre-cut cubes"
      ],
      [
        "3 tbsp",
        "maple syrup (use 2 tbsp if serving with sweet miso-glazed cod)"
      ],
      [
        "2 tbsp",
        "unsalted butter"
      ],
      [
        "1",
        "lemon (½ for roasting, ½ for juice)"
      ],
      [
        "2 tsp",
        "olive oil"
      ],
      [
        "½ tsp",
        "ground cardamom"
      ],
      [
        "½ tsp",
        "coriander seeds, lightly crushed"
      ],
      [
        "¼ tsp",
        "fine sea salt, plus more to taste"
      ],
      [
        "Pinch",
        "chile powder"
      ],
      [
        "",
        "Fresh herbs, optional"
      ]
    ],
    "steps": [
      [
        "Preheat",
        "Preheat oven to 425°F. Line a large baking sheet with parchment paper.",
        {
          "id": "preheat"
        }
      ],
      [
        "Prepare the lemon",
        "Thinly slice half the lemon. Simmer slices in salted water for 2 minutes, then drain.",
        {
          "id": "prepare-lemon",
          "timers": [
            {
              "id": "simmer",
              "label": "Simmer lemon",
              "value": 2,
              "unit": "minutes",
              "phrase": "2 minutes",
              "legacyId": "maple-roasted-squash-1-0"
            }
          ]
        }
      ],
      [
        "Make the glaze",
        "In a small saucepan, melt butter with maple syrup and chile powder. Simmer for 2 minutes.",
        {
          "id": "make-glaze",
          "timers": [
            {
              "id": "simmer",
              "label": "Simmer maple glaze",
              "value": 2,
              "unit": "minutes",
              "phrase": "2 minutes",
              "legacyId": "maple-roasted-squash-2-0"
            }
          ]
        }
      ],
      [
        "Season the squash",
        "Toss squash cubes with olive oil, cardamom, coriander and salt. Add the maple-butter glaze and lemon slices, tossing to coat.",
        {
          "id": "season-squash"
        }
      ],
      [
        "Roast",
        "Spread in a single layer on the baking sheet. Roast for 25–35 minutes, turning halfway, until golden and tender.",
        {
          "id": "roast",
          "timers": [
            {
              "id": "roast",
              "label": "Roast squash",
              "value": 25,
              "unit": "minutes",
              "phrase": "25–35 minutes",
              "range": "25–35 minutes",
              "halfway": true,
              "legacyId": "maple-roasted-squash-4-0"
            }
          ]
        }
      ],
      [
        "Finish",
        "Squeeze the remaining lemon half over the squash. Garnish with fresh herbs if desired.",
        {
          "id": "finish"
        }
      ]
    ],
    "tags": [
      "Side dish"
    ]
  },
  {
    "id": "pork-chops-red-onion-confit",
    "name": "Pork Chops with Red Onion Confit",
    "category": "Mains",
    "time": "30 min",
    "yield": "Serves 2",
    "source": "Laura Calder · Food Network",
    "sourceUrl": "https://www.foodnetwork.com/recipes/pork-chops-with-red-onion-confit-2119511",
    "photoCredit": "AI-generated illustrative image",
    "ingredients": [
      [
        "1",
        "red onion, thinly sliced"
      ],
      [
        "1–2 tbsp",
        "butter"
      ],
      [
        "To taste",
        "salt and pepper"
      ],
      [
        "A splash",
        "balsamic or red wine vinegar"
      ],
      [
        "2",
        "pork chops, with a good layer of fat"
      ],
      [
        "A pinch",
        "sugar"
      ],
      [
        "As needed",
        "oil or extra butter, if the chops are lean"
      ]
    ],
    "steps": [
      [
        "Soften the onion",
        "Gently cook the red onion in melted butter, seasoning with salt and pepper. Stir now and then for about 15 minutes, until tender.",
        {
          "id": "soften-onion",
          "timers": [
            {
              "id": "soften-onion",
              "label": "Soften red onion",
              "value": 15,
              "unit": "minutes",
              "phrase": "15 minutes",
              "legacyId": "pork-chops-red-onion-confit-soften-onion"
            }
          ]
        }
      ],
      [
        "Reduce the vinegar",
        "Pour in the vinegar. Cook for about 1 minute to evaporate the liquid, then take the onion confit off the heat.",
        {
          "id": "reduce-vinegar",
          "timers": [
            {
              "id": "reduce-vinegar",
              "label": "Reduce confit vinegar",
              "value": 1,
              "unit": "minutes",
              "phrase": "1 minute",
              "legacyId": "pork-chops-red-onion-confit-reduce-vinegar"
            }
          ]
        }
      ],
      [
        "Season the chops",
        "Season both sides of the pork chops with salt, pepper and sugar. If there is little fat on the chops, add a little oil or butter to the frying pan.",
        {
          "id": "season-chops"
        }
      ],
      [
        "Fry the first side",
        "Pan-fry the pork chops for about 5 minutes on the first side, until golden.",
        {
          "id": "fry-first-side",
          "timers": [
            {
              "id": "first-side",
              "label": "Pork chops: first side",
              "value": 5,
              "unit": "minutes",
              "phrase": "5 minutes",
              "legacyId": "pork-chops-red-onion-confit-first-side"
            }
          ]
        }
      ],
      [
        "Turn & finish",
        "Turn the pork chops and fry for about 5 minutes on the second side, until browned and cooked through. Adjust the cooking time for their thickness.",
        {
          "id": "fry-second-side",
          "timers": [
            {
              "id": "second-side",
              "label": "Pork chops: second side",
              "value": 5,
              "unit": "minutes",
              "phrase": "5 minutes",
              "legacyId": "pork-chops-red-onion-confit-second-side"
            }
          ]
        }
      ],
      [
        "Serve",
        "Spoon the red onion confit over the pork chops and serve.",
        {
          "id": "serve"
        }
      ]
    ],
    "tags": [
      "Main dish"
    ]
  },
  {
    "id": "roast-carrot-avocado-salad",
    "name": "Roast Carrot and Avocado Salad",
    "subtitle": "Orange & lemon dressing",
    "category": "Salads",
    "time": "50 min",
    "yield": "Serves 4",
    "source": "Jamie Oliver · Jamie at Home · Food Network",
    "sourceUrl": "https://www.foodnetwork.com/recipes/jamie-oliver/roast-carrot-and-avocado-salad-with-orange-and-lemon-dressing-recipe-1938626",
    "photoCredit": "Food Network / Jamie at Home · AI-upscaled",
    "photoSource": "https://www.foodnetwork.com/recipes/jamie-oliver/roast-carrot-and-avocado-salad-with-orange-and-lemon-dressing-recipe-1938626",
    "ingredients": [
      [
        "1 lb",
        "medium mixed-color carrots, with leafy tops"
      ],
      [
        "To taste",
        "sea salt"
      ],
      [
        "2 level tsp",
        "whole cumin seeds"
      ],
      [
        "1–2",
        "small dried chiles, crumbled"
      ],
      [
        "To taste",
        "freshly ground black pepper"
      ],
      [
        "2 cloves",
        "garlic, peeled"
      ],
      [
        "4 sprigs",
        "fresh thyme, leaves picked"
      ],
      [
        "As needed",
        "extra-virgin olive oil, for the spice paste, dressing and finishing"
      ],
      [
        "As needed",
        "red or white wine vinegar (use red wine vinegar in the dressing)"
      ],
      [
        "1",
        "orange, halved"
      ],
      [
        "1",
        "lemon, halved"
      ],
      [
        "3",
        "ripe avocados"
      ],
      [
        "4 slices, ½ inch thick",
        "ciabatta or other good bread"
      ],
      [
        "2 handfuls",
        "mixed winter salad leaves, washed and dried (such as arugula, radicchio, Treviso or cavolo nero tops)"
      ],
      [
        "2 bunches",
        "watercress"
      ],
      [
        "⅔ cup",
        "sour cream"
      ],
      [
        "4 tbsp",
        "mixed seeds, toasted"
      ]
    ],
    "steps": [
      [
        "Preheat",
        "Heat the oven to 350°F.",
        {
          "id": "preheat"
        }
      ],
      [
        "Parboil the carrots",
        "Boil the carrots in salted water for 10 minutes, until almost cooked. Drain into a roasting pan.",
        {
          "id": "parboil-carrots",
          "timers": [
            {
              "id": "parboil",
              "label": "Parboil carrots",
              "value": 10,
              "unit": "minutes",
              "phrase": "10 minutes",
              "legacyId": "roast-carrot-avocado-salad-parboil"
            }
          ]
        }
      ],
      [
        "Make the spice paste",
        "While the carrots boil, crush the cumin seeds, chiles, salt and pepper in a mortar. Pound in the garlic and thyme. Stir in enough olive oil to cover the paste and a generous splash of wine vinegar.",
        {
          "id": "spice-paste"
        }
      ],
      [
        "Season & roast",
        "Coat the hot carrots with the spice paste. Add the orange and lemon halves, cut sides down. Roast for 25–30 minutes, until golden.",
        {
          "id": "roast-carrots",
          "timers": [
            {
              "id": "roast",
              "label": "Roast carrots and citrus",
              "value": 25,
              "unit": "minutes",
              "phrase": "25–30 minutes",
              "range": true,
              "legacyId": "roast-carrot-avocado-salad-roast"
            }
          ]
        }
      ],
      [
        "Prepare the avocados",
        "During roasting, peel and pit the avocados. Cut into lengthwise wedges and place in a large bowl. Add the roasted carrots.",
        {
          "id": "prepare-avocados"
        }
      ],
      [
        "Mix the citrus dressing",
        "Using tongs, squeeze the roasted orange and lemon juice into a bowl. Add an equal volume of olive oil, a splash of red wine vinegar, salt and pepper. Toss with the carrots and avocados; adjust seasoning.",
        {
          "id": "citrus-dressing"
        }
      ],
      [
        "Toast & assemble",
        "Toast or broil the ciabatta, tear into pieces and fold into the salad. Toss in the salad leaves and watercress. Serve topped with sour cream, toasted seeds and a drizzle of olive oil.",
        {
          "id": "assemble"
        }
      ]
    ],
    "tags": [
      "Salad",
      "Side dish"
    ]
  },
  {
    "id": "corn-chipotle-lime",
    "name": "Corn with Chipotle–Lime Butter",
    "category": "Sides",
    "tags": [
      "Side dish",
      "BBQ"
    ],
    "subtitle": "Grilled corn on the cob",
    "time": "10 min prep · 12–15 min grilling",
    "yield": "Serves 4",
    "source": "Jamie Purviance · Weber",
    "sourceUrl": "https://www.weber.com/IN/en/recipes/veggies/corn-on-the-cob-three-different-ways/weber-8091.html",
    "image": "corn-three-ways",
    "photoCredit": "Weber",
    "photoSource": "https://www.weber.com/IN/en/recipes/veggies/corn-on-the-cob-three-different-ways/weber-8091.html",
    "photoClass": "photo-corn-chipotle",
    "ingredients": [
      [
        "85 g / 6 tbsp",
        "unsalted butter, softened"
      ],
      [
        "3 tbsp",
        "finely chopped fresh cilantro leaves"
      ],
      [
        "2 tsp",
        "finely grated lime zest"
      ],
      [
        "2 tsp",
        "honey"
      ],
      [
        "1 tsp",
        "minced canned chipotle chiles in adobo sauce"
      ],
      [
        "½ tsp",
        "kosher salt"
      ],
      [
        "⅛ tsp",
        "freshly ground black pepper"
      ],
      [
        "4 ears",
        "fresh corn, husked"
      ],
      [
        "4",
        "lime wedges"
      ]
    ],
    "steps": [
      [
        "Heat the grill",
        "Prepare the grill for direct cooking over medium heat, 180–230°C (350–450°F). Clean the cooking grates.",
        {
          "id": "heat-grill"
        }
      ],
      [
        "Mix the butter",
        "Mash the butter with cilantro, lime zest, honey, chipotle chiles, salt and pepper until evenly mixed. For more heat, add extra chipotle in ¼ tsp increments. The butter can be made 1 day ahead; refrigerate, then let it soften before use.",
        {
          "id": "mix-butter"
        }
      ],
      [
        "Butter the corn",
        "Lightly spread each ear of corn with 1–2 tsp of the butter mixture. Reserve the rest for serving.",
        {
          "id": "butter-corn"
        }
      ],
      [
        "Grill",
        "Grill the corn over direct medium heat for 12–15 minutes, turning occasionally. Keep the lid closed between turns. The kernels should be tender and browned in places.",
        {
          "id": "grill-corn",
          "timers": [
            {
              "id": "grill",
              "label": "Corn with Chipotle–Lime Butter",
              "value": 12,
              "unit": "minutes",
              "phrase": "12–15 minutes",
              "range": true,
              "legacyId": "corn-chipotle-lime-grill"
            }
          ]
        }
      ],
      [
        "Serve",
        "Serve the corn warm with the remaining chipotle–lime butter and lime wedges.",
        {
          "id": "serve"
        }
      ]
    ]
  },
  {
    "id": "corn-paprika-pimiento-chive",
    "name": "Corn with Smoked Paprika, Pimiento and Chive Butter",
    "category": "Sides",
    "tags": [
      "Side dish",
      "BBQ"
    ],
    "subtitle": "Grilled corn on the cob",
    "time": "10 min prep · 12–15 min grilling",
    "yield": "Serves 4",
    "source": "Jamie Purviance · Weber",
    "sourceUrl": "https://www.weber.com/IN/en/recipes/veggies/corn-on-the-cob-three-different-ways/weber-8091.html",
    "image": "corn-three-ways",
    "photoCredit": "Weber",
    "photoSource": "https://www.weber.com/IN/en/recipes/veggies/corn-on-the-cob-three-different-ways/weber-8091.html",
    "photoClass": "photo-corn-paprika",
    "ingredients": [
      [
        "85 g / 6 tbsp",
        "unsalted butter, softened"
      ],
      [
        "2 tbsp",
        "chopped fresh chives"
      ],
      [
        "2 tbsp",
        "well-drained minced pimientos or jarred red bell pepper"
      ],
      [
        "2 tsp",
        "smoked paprika, preferably mild"
      ],
      [
        "½ clove",
        "garlic, minced or pressed"
      ],
      [
        "½ tsp",
        "kosher salt"
      ],
      [
        "⅛ tsp",
        "freshly ground black pepper"
      ],
      [
        "4 ears",
        "fresh corn, husked"
      ]
    ],
    "steps": [
      [
        "Heat the grill",
        "Prepare the grill for direct cooking over medium heat, 180–230°C (350–450°F). Clean the cooking grates.",
        {
          "id": "heat-grill"
        }
      ],
      [
        "Mix the butter",
        "Mash the butter with chives, pimientos, smoked paprika, garlic, salt and pepper until evenly mixed. The butter can be made 1 day ahead; refrigerate, then let it soften before use.",
        {
          "id": "mix-butter"
        }
      ],
      [
        "Butter the corn",
        "Lightly spread each ear of corn with 1–2 tsp of the butter mixture. Reserve the rest for serving.",
        {
          "id": "butter-corn"
        }
      ],
      [
        "Grill",
        "Grill the corn over direct medium heat for 12–15 minutes, turning occasionally. Keep the lid closed between turns. The kernels should be tender and browned in places.",
        {
          "id": "grill-corn",
          "timers": [
            {
              "id": "grill",
              "label": "Corn with Smoked Paprika, Pimiento and Chive Butter",
              "value": 12,
              "unit": "minutes",
              "phrase": "12–15 minutes",
              "range": true,
              "legacyId": "corn-paprika-pimiento-chive-grill"
            }
          ]
        }
      ],
      [
        "Serve",
        "Serve the corn warm, spreading the remaining smoked paprika, pimiento and chive butter over it.",
        {
          "id": "serve"
        }
      ]
    ]
  },
  {
    "id": "corn-herb-parmesan-lemon",
    "name": "Corn with Herb, Parmesan and Lemon Butter",
    "category": "Sides",
    "tags": [
      "Side dish",
      "BBQ"
    ],
    "subtitle": "Grilled corn on the cob",
    "time": "10 min prep · 12–15 min grilling",
    "yield": "Serves 4",
    "source": "Jamie Purviance · Weber",
    "sourceUrl": "https://www.weber.com/IN/en/recipes/veggies/corn-on-the-cob-three-different-ways/weber-8091.html",
    "image": "corn-three-ways",
    "photoCredit": "Weber",
    "photoSource": "https://www.weber.com/IN/en/recipes/veggies/corn-on-the-cob-three-different-ways/weber-8091.html",
    "photoClass": "photo-corn-herb",
    "ingredients": [
      [
        "85 g / 6 tbsp",
        "unsalted butter, softened"
      ],
      [
        "3 tbsp",
        "finely grated Parmigiano-Reggiano cheese"
      ],
      [
        "1 tbsp",
        "finely chopped fresh tarragon leaves"
      ],
      [
        "1 tbsp",
        "finely chopped fresh basil leaves"
      ],
      [
        "1 tbsp",
        "finely chopped fresh chives"
      ],
      [
        "1 tsp",
        "finely grated lemon zest"
      ],
      [
        "½ tsp",
        "kosher salt"
      ],
      [
        "⅛ tsp",
        "freshly ground black pepper"
      ],
      [
        "4 ears",
        "fresh corn, husked"
      ]
    ],
    "steps": [
      [
        "Heat the grill",
        "Prepare the grill for direct cooking over medium heat, 180–230°C (350–450°F). Clean the cooking grates.",
        {
          "id": "heat-grill"
        }
      ],
      [
        "Mix the butter",
        "Mash the butter with Parmesan, tarragon, basil, chives, lemon zest, salt and pepper until evenly mixed. The butter can be made 1 day ahead; refrigerate, then let it soften before use.",
        {
          "id": "mix-butter"
        }
      ],
      [
        "Butter the corn",
        "Lightly spread each ear of corn with 1–2 tsp of the butter mixture. Reserve the rest for serving.",
        {
          "id": "butter-corn"
        }
      ],
      [
        "Grill",
        "Grill the corn over direct medium heat for 12–15 minutes, turning occasionally. Keep the lid closed between turns. The kernels should be tender and browned in places.",
        {
          "id": "grill-corn",
          "timers": [
            {
              "id": "grill",
              "label": "Corn with Herb, Parmesan and Lemon Butter",
              "value": 12,
              "unit": "minutes",
              "phrase": "12–15 minutes",
              "range": true,
              "legacyId": "corn-herb-parmesan-lemon-grill"
            }
          ]
        }
      ],
      [
        "Serve",
        "Serve the corn warm, spreading the remaining herb, Parmesan and lemon butter over it.",
        {
          "id": "serve"
        }
      ]
    ]
  }
];
