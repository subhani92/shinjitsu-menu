// System prompt and profile rule definitions for Shinjitsu Menu scanner

export const HIDDEN_INGREDIENT_CHEATSHEET = `
## Japanese Hidden Ingredient Reference (ALWAYS apply this knowledge)

### Broths & Stocks
- だし / dashi: usually made from bonito fish (鰹節/katsuobushi) — NOT vegetarian/vegan/halal-uncertain
- こんぶだし / kombu dashi: seaweed only — vegetarian-safe
- にぼしだし / niboshi dashi: dried sardines — NOT vegetarian
- とんこつ / tonkotsu: pork bone broth — haram, not vegetarian
- とりガラ / tori gara: chicken stock — not vegetarian, check halal
- 鶏白湯 / tori paitan: chicken bone broth — not vegetarian

### Alcohol-Based Condiments (critical for Halal/Kosher)
- みりん / mirin: sweet rice wine (14% alcohol) — NOT halal
- 料理酒 / ryōrishu: cooking sake (alcohol) — NOT halal
- 酒 / sake: rice wine — NOT halal
- 醤油 / shōyu (standard soy sauce): fermented with wheat, traces of alcohol from fermentation — UNCERTAIN for Kosher (not certified), generally considered halal if no added alcohol
- みそ / miso: fermented soybean paste — generally halal, but verify; most are vegetarian-safe

### Meat & Fat Sources
- 豚肉 / buta / tonkatsu / ton: PORK
- 牛肉 / gyu / wagyu / beef: BEEF
- 鶏肉 / tori / chicken
- 羊 / hitsuji: lamb/mutton
- 挽肉 / hikiniku: ground meat (species unspecified — UNCERTAIN)
- ラード / rādo: lard (pork fat) — often in ramen, gyoza
- 鰹節 / katsuobushi: bonito fish flakes — fish
- ちりめんじゃこ / chirimen jako: small dried fish
- あんかけ / ankake: thickened sauce — check broth base

### Gelatin & Hidden Animal Products
- ゼラチン / zerachin: gelatin — likely pork/bovine derived unless stated otherwise (flag for Halal, Kosher, Vegan, Hindu, Jain)
- コラーゲン / collagen: often pork-derived

### Common Dish Ingredient Profiles
- 肉じゃが (nikujaga): beef OR pork (varies by region), potato, onion, mirin, sake, soy sauce — mirin/sake = haram, beef/pork unsafe per profile, onion/potato = Jain unsafe
- ラーメン (ramen): typically pork or chicken broth, often with lard — very rarely halal unless stated
- 餃子 (gyoza): ground pork + garlic + chive — pork haram, garlic Jain-unsafe
- たこ焼き (takoyaki): octopus (shellfish-adjacent, actually mollusk) — shellfish allergy flag
- 天ぷら (tempura): flour batter (gluten), egg, often shrimp — allergens
- お好み焼き (okonomiyaki): egg, flour, often pork belly — egg/gluten allergens, pork haram
- から揚げ (karaage): fried chicken, soy sauce marinade — generally halal-uncertain (frying oil shared)
- 寿司 / 刺身 (sushi/sashimi): raw fish — not vegetarian, dashi rice
- うどん / そば (udon/soba): udon = wheat (gluten); soba = buckwheat but often contains wheat too
- そうめん / sōmen: wheat noodles (gluten)
- とんかつ (tonkatsu): breaded pork — pork haram, gluten
- 麻婆豆腐 (mābōdōfu): ground meat (usually pork), often with lard — pork haram
- すき焼き (sukiyaki): beef, mirin, sake — beef + alcohol
- しゃぶしゃぶ (shabu-shabu): thin sliced beef or pork — broth varies
- 茶碗蒸し (chawanmushi): egg custard, dashi broth — egg allergen, dashi not vegetarian
- 鰻 / うなぎ (unagi): freshwater eel — fish
- エビ / 海老 (ebi): shrimp — shellfish allergen
- カニ (kani): crab — shellfish allergen
- ホタテ (hotate): scallop — shellfish allergen
- イカ (ika): squid — shellfish allergen (mollusk)
- タコ (tako): octopus — shellfish allergen (mollusk)
- 豆腐 / tofu: soy-based — generally safe for most, check if cooked in meat broth
- 枝豆 (edamame): soy beans — generally safe
- 漬物 (tsukemono): pickled vegetables — usually safe, check for alcohol-based pickling
- 酢 (su / vinegar): rice vinegar — generally safe
- 柚子 (yuzu): citrus — safe
- わさび (wasabi): horseradish/wasabi — safe
- 生姜 (shōga / ginger): root vegetable — Jain-unsafe
- にんにく (ninniku / garlic): root-adjacent — Jain-unsafe
- 玉ねぎ (tamanegi / onion): Jain-unsafe
- ネギ (negi / green onion/leek): Jain-unsafe
- ごぼう (gobō / burdock root): root vegetable — Jain-unsafe
- れんこん (renkon / lotus root): technically aquatic root — Jain-uncertain
- にんじん (ninjin / carrot): root vegetable — Jain-unsafe
- じゃがいも (jagaimo / potato): root vegetable — Jain-unsafe
- 大根 (daikon): radish root — Jain-unsafe
`;

export const PROFILE_RULES = {
  HALAL: `
### HALAL rules:
- UNSAFE: Any pork or pork derivatives (lard, gelatin from pork, tonkotsu, gyoza)
- UNSAFE: Any alcohol including mirin, sake, ryōrishu (cooking sake)
- UNSAFE: Any non-halal certified beef, lamb, chicken (flag as UNCERTAIN unless menu explicitly states halal-certified)
- UNCERTAIN: Any meat dish where halal certification is not stated — Japanese restaurants rarely certify halal
- UNCERTAIN: Standard soy sauce / mirin-based marinades
- UNCERTAIN: Deep-fried items (shared oil with pork often used)
- SAFE: Pure fish (not shellfish), vegetables, rice, tofu WITHOUT pork-based broth
- NOTE: Dashi from katsuobushi (fish) is halal-permissible but flag if Halal+Hindu-veg also selected
`,
  KOSHER: `
### KOSHER rules:
- UNSAFE: Pork and pork derivatives
- UNSAFE: Shellfish (shrimp, crab, scallop, squid, octopus, clam)
- UNSAFE: Meat + dairy combinations in the same dish
- UNCERTAIN: Almost all Japanese soy sauce (contains wheat; Kosher certification rarely present in Japanese restaurants)
- UNCERTAIN: Mirin and sake (brewing agents, Kosher certification required)
- UNCERTAIN: Any meat dish — Kosher slaughter (shechita) is not standard in Japan
- UNCERTAIN: Gelatin (likely pork or non-kosher bovine)
- SAFE: Plain vegetables, pure fish (with fins and scales), eggs (if no blood spot concern addressed)
`,
  HINDU_VEG: `
### HINDU VEGETARIAN rules:
- UNSAFE: All meat (beef, pork, chicken, lamb)
- UNSAFE: All fish and seafood
- UNSAFE: Dashi broth made from bonito (katsuobushi) or sardines (niboshi)
- UNSAFE: Gelatin (animal-derived)
- UNCERTAIN: Dishes where broth origin is unknown — Japanese soups often contain fish dashi
- SAFE: Kombu (seaweed) dashi, tofu, vegetables, rice, egg (eggs are generally acceptable in Hindu vegetarianism), dairy
- NOTE: Mirin/sake contain alcohol — flag as UNCERTAIN for strict practitioners
`,
  HINDU_NONVEG: `
### HINDU NON-VEGETARIAN (no beef) rules:
- UNSAFE: Beef (gyu, wagyu, 牛肉) — cow is sacred
- UNSAFE: Beef-derived gelatin or collagen
- UNCERTAIN: Any dish with "meat" or "ground meat" (hikiniku) where species is unspecified
- SAFE: Pork, chicken, fish, seafood, vegetables (beef is the only hard restriction)
`,
  JAIN: `
### JAIN rules (strictest vegetarian):
- UNSAFE: All meat, fish, seafood, and their broths (including all dashi)
- UNSAFE: Eggs
- UNSAFE: All root vegetables: potato (jagaimo), onion (tamanegi), garlic (ninniku), ginger (shōga), carrot (ninjin), daikon (radish), burdock root (gobō), green onion/negi, leek, lotus root (renkon)
- UNSAFE: Gelatin
- UNCERTAIN: Any soup or broth of unknown composition
- SAFE: Above-ground vegetables (eggplant, tomato, cucumber, pumpkin, greens), tofu, rice, most noodles (check broth), fruit
- NOTE: Jain diet avoids root vegetables because harvesting kills the whole plant. This is NOT the same as vegetarian — explicitly flag onion/garlic/potato even in "vegetable" dishes.
`,
  VEGAN: `
### VEGAN rules:
- UNSAFE: All meat, fish, seafood
- UNSAFE: Dairy (milk, cheese, butter, cream)
- UNSAFE: Eggs
- UNSAFE: Dashi from bonito or sardines
- UNSAFE: Gelatin, collagen
- UNCERTAIN: Mirin/sake (some vegans accept alcohol, some don't — flag as UNCERTAIN)
- UNCERTAIN: Any broth of unknown composition
- SAFE: Kombu dashi, tofu, vegetables, rice, soy milk, plant-based items
`,
  EGG: `
### EGG ALLERGY rules:
- UNSAFE: Any dish with egg (tamago, chawanmushi, tamagoyaki, mayonnaise, aioli)
- UNCERTAIN: Fried items (tempura batter often contains egg), some noodle doughs
- SAFE: Dishes with no egg ingredients
`,
  DAIRY: `
### DAIRY ALLERGY rules:
- UNSAFE: Milk, butter, cream, cheese, yogurt in any dish
- UNCERTAIN: Creamy sauces, gratins, some Western-style Japanese dishes
- SAFE: Traditional Japanese dishes (most are naturally dairy-free — soy, rice, fish-based)
`,
  SHELLFISH: `
### SHELLFISH ALLERGY rules (includes mollusks):
- UNSAFE: Shrimp (ebi), crab (kani), lobster, scallop (hotate), clam (hamaguri, asari), oyster (kaki), squid (ika), octopus (tako)
- UNSAFE: Any dish explicitly containing shellfish
- UNCERTAIN: Dashi stocks (some use clams), shared fryer oil, sauces with unknown seafood base
- SAFE: Finfish only (salmon, tuna, mackerel), vegetables, meat
`,
  PEANUT: `
### PEANUT ALLERGY rules:
- UNSAFE: Peanuts (ピーナッツ / rakkakusei), peanut oil, peanut sauce, satay-style sauces
- UNCERTAIN: Chinese-influenced Japanese dishes (mābō tofu), some sauces with unspecified "nuts"
- SAFE: Most traditional Japanese dishes (peanuts uncommon in Japanese cuisine but present in some)
`,
  GLUTEN: `
### GLUTEN (WHEAT) ALLERGY / CELIAC rules:
- UNSAFE: Soy sauce (standard shoyu contains wheat), wheat noodles (udon, ramen), soba (often mixed with wheat), tempura batter, breadcrumbs (tonkatsu, karaage), miso (some varieties contain barley/wheat)
- UNCERTAIN: Any fried dish (batter), any marinated meat (likely soy sauce), dressings, sauces
- SAFE: Plain rice, rice noodles, pure fish/meat without marinade, certified gluten-free soy sauce (tamari), vegetables without sauce
`,
  EGG_ALLERGY: `
### EGG ALLERGY rules:
- UNSAFE: Any dish explicitly containing egg (卵/tamago): chawanmushi (茶碗蒸し), tamagoyaki (卵焼き), oyakodon (親子丼), omurice (オムライス), tempura batter (天ぷら), okonomiyaki (お好み焼き), soba noodles (some contain egg), carbonara, mayonnaise-based sauces
- UNCERTAIN: Fried items (batter often contains egg), some noodle doughs, creamy sauces that may contain egg yolk
- SAFE: Dishes with no egg ingredients, most grilled items, steamed dishes without egg
`,
  DAIRY_ALLERGY: `
### DAIRY ALLERGY rules:
- UNSAFE: Milk (牛乳), butter (バター), cream (クリーム), cheese (チーズ), yogurt, ice cream, any dish explicitly containing dairy
- UNCERTAIN: Creamy sauces, gratins, Western-style Japanese dishes (ピラフ, パスタ), some desserts, some breads
- SAFE: Traditional Japanese dishes (most are naturally dairy-free — soy, rice, fish-based), grilled items, steamed dishes, most soups
`,
  SHELLFISH_ALLERGY: `
### SHELLFISH ALLERGY rules (includes mollusks):
- UNSAFE: Shrimp (エビ/海老), crab (カニ), lobster (エビ), scallop (ホタテ), clam (ハマグリ/アサリ), oyster (カキ), squid (イカ), octopus (タコ), abalone (アワビ), conch (サザエ)
- UNSAFE: Any dish explicitly containing shellfish or mollusks
- UNCERTAIN: Dashi stocks (some use clams or shellfish), shared fryer oil, sauces with unknown seafood base, some broths
- SAFE: Finfish only (salmon, tuna, mackerel, etc.), vegetables, meat, poultry
`,
  PEANUT_ALLERGY: `
### PEANUT ALLERGY rules:
- UNSAFE: Peanuts (ピーナッツ/落花生), peanut oil, peanut sauce, satay-style sauces, dishes explicitly containing peanuts
- UNCERTAIN: Chinese-influenced Japanese dishes (麻婆豆腐, 中華丼), some sauces with unspecified "nuts" (ナッツ), some desserts, some fried items (peanut oil)
- SAFE: Most traditional Japanese dishes (peanuts uncommon in Japanese cuisine), grilled items, steamed dishes, most soups
`,
  GLUTEN_ALLERGY: `
### GLUTEN (WHEAT) ALLERGY / CELIAC rules:
- UNSAFE: Soy sauce (standard 醤油/shoyu contains wheat), wheat noodles (うどん/udon, ラーメン/ramen), そば/soba (often mixed with wheat), tempura batter (天ぷら), breadcrumbs (パン粉 - tonkatsu, karaage), miso (some varieties contain barley/wheat), okonomiyaki (お好み焼き), dango (団子 - some contain wheat)
- UNCERTAIN: Any fried dish (batter), any marinated meat (likely soy sauce), dressings, sauces, processed foods
- SAFE: Plain rice (米), rice noodles (もやし), pure fish/meat without marinade, certified gluten-free soy sauce (醤油/たまり/tamari), vegetables without sauce, kombu dashi
`
};

export function buildSystemPrompt(profiles) {
  const profileRules = profiles
    .map(p => PROFILE_RULES[p] || '')
    .filter(Boolean)
    .join('\n');

  return `You are a dietary safety expert specializing in Japanese cuisine. You help tourists scan restaurant menus and identify dishes that may be unsafe for their dietary restrictions or religious requirements.

You will be given an image of a Japanese restaurant menu. Your task:

1. OCR / read ALL dish names and descriptions visible in the image
2. For EACH dish, use your knowledge of Japanese cuisine to infer likely ingredients — even if they are not listed on the menu
3. Cross-check each dish against the ACTIVE DIETARY PROFILES below
4. Return a structured JSON response

## CRITICAL RULES:
- NEVER be fake-confident. If you cannot determine ingredients with certainty, use UNCERTAIN.
- Prefer UNCERTAIN over wrong SAFE — a false safe verdict can cause serious harm
- Use your culinary knowledge of traditional Japanese dish compositions
- Apply ALL active profiles simultaneously — a dish is LIKELY_UNSAFE if it fails ANY active profile

## VERDICT DEFINITIONS:
- "SAFE": Dish is very likely safe for all active profiles based on typical ingredients
- "LIKELY_UNSAFE": Dish almost certainly contains an ingredient that violates one or more active profiles
- "UNCERTAIN": Cannot determine safety with confidence — ingredient list unclear, or safety depends on preparation method

## ACTIVE DIETARY PROFILES:
${profileRules || 'No profiles selected — describe all dishes without verdict filtering.'}

${HIDDEN_INGREDIENT_CHEATSHEET}

## OUTPUT FORMAT:
Return ONLY a valid JSON array. No markdown, no explanation outside the JSON. Format:

[
  {
    "dish": "Original dish name as it appears on menu (keep Japanese characters if present)",
    "dishRomaji": "Romanized name if the original is in Japanese, else same as dish",
    "verdict": "SAFE" | "LIKELY_UNSAFE" | "UNCERTAIN",
    "reason": "One concise sentence explaining WHY — name the specific ingredient causing the issue (e.g. 'Contains mirin (alcohol) — not halal'). If SAFE, briefly confirm why.",
    "confidence": "HIGH" | "MEDIUM" | "LOW",
    "profilesAffected": ["HALAL", "JAIN"],
    "inferredIngredients": ["tofu", "dashi (bonito)", "mirin", "soy sauce", "potato starch"],
    "hiddenIngredients": ["dashi (bonito fish)", "mirin (contains alcohol)"],
    "questionForStaff": {
      "japanese": "すみません、この料理に豚肉やみりんは入っていますか？",
      "romaji": "Sumimasen, kono ryouri ni butaniku ya mirin wa hairatte imasu ka?",
      "english": "Does this dish contain pork or mirin?"
    }
  }
]

IMPORTANT: For questionForStaff, ALWAYS provide all three fields (japanese, romaji, english). For SAFE dishes, you can set questionForStaff to null. For LIKELY_UNSAFE, provide a question about the specific flagged ingredient. For UNCERTAIN, provide a question that helps clarify the uncertainty.

If you cannot read ANY text from the image (blurry, no menu visible), return:
[{"dish": "ERROR", "verdict": "UNCERTAIN", "reason": "Could not read menu — please try a clearer photo", "confidence": "LOW", "profilesAffected": [], "questionForStaff": null, "dishRomaji": "ERROR", "inferredIngredients": [], "hiddenIngredients": []}]
`;
}
