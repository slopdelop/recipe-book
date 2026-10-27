// Stable step IDs keep progress and timers attached when steps are reordered.
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
    ]
  },
  {
    "id": "mushrooms",
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
    ]
  },
  {
    "id": "onions",
    "image": "onions-photo",
    "photoCredit": "National Onion Association",
    "photoSource": "https://www.onions-usa.org/recipes/22-caramelized_onions/",
    "name": "Caramelized Onions",
    "category": "Sides",
    "time": "12 hr",
    "yield": "Makes 4 cups",
    "source": "Jonathan Reynolds · The New York Times",
    "ingredients": [
      [
        "3 lb",
        "onions, thinly sliced"
      ],
      [
        "4 tbsp",
        "unsalted butter"
      ],
      [
        "¼ cup",
        "balsamic vinegar"
      ],
      [
        "¼ tsp",
        "salt"
      ]
    ],
    "steps": [
      [
        "Fill the slow cooker",
        "Combine the onions, butter, balsamic vinegar, and salt in a crockpot or other slow cooker.",
        {
          "id": "fill-cooker"
        }
      ],
      [
        "Cook low & slow",
        "Cover and cook on low heat for 12 hours. Serve.",
        {
          "id": "slow-cook",
          "timers": [
            {
              "id": "slow-cook",
              "label": "Slow-cooker onions",
              "value": 12,
              "unit": "hours",
              "phrase": "12 hours",
              "legacyId": "onions-1-0"
            }
          ]
        }
      ]
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
    ]
  }
];
