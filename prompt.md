Build a mobile-first web app called "Shinjitsu Menu" (or similar) — a religion/allergy-aware menu safety scanner for tourists in Japan.

CORE FLOW:
1. On load, user selects a dietary profile from toggles (multi-select allowed):
   [Halal] [Kosher] [Hindu - Vegetarian] [Hindu - Non-Veg (no beef)] [Jain] [Vegan] [Common Allergens: egg/dairy/shellfish/peanut/gluten]
2. User photographs a restaurant menu (Japanese text, may have no ingredient list — just dish names)
3. Backend sends image to a vision-capable LLM (Qwen Cloud or GMI Cloud multimodal API) with a structured prompt that:
   - OCRs all dish names/descriptions
   - For EACH dish, infers likely ingredients based on the dish name (e.g. 肉じゃが → beef/pork, potato, dashi, mirin, soy sauce) using general knowledge of Japanese cuisine
   - Cross-checks inferred ingredients against the selected profile(s)
   - Returns a verdict per dish: SAFE / LIKELY UNSAFE / UNCERTAIN — never fake-confident when ingredients aren't explicit on a menu
   - For UNCERTAIN, generate one short suggested question in Japanese the user can show staff (e.g. "このスープは豚肉を使っていますか？") so worst case they still have a fallback
4. Results render as an annotated list under each dish name: verdict badge + one-line reasoning (e.g. "Contains mirin (alcohol) — not halal" / "Likely made with dashi (bonito) — not vegetarian")

KEY DIFFERENTIATOR — BUILD THIS CAREFULLY:
Do not just keyword-match. The prompt to the LLM must explicitly reason per-profile, because rules differ:
- Halal: flag pork, alcohol/mirin/sake, gelatin, and mark meat-sourcing as UNCERTAIN unless menu states halal-certified
- Kosher: flag pork, shellfish, and meat+dairy combinations; most Japanese soy sauce/mirin should be flagged UNCERTAIN due to brewing agents
- Hindu Non-Veg: flag beef only; Hindu Vegetarian: flag all meat/fish/dashi
- Jain: flag all meat/fish/dashi AND root vegetables (onion, garlic, potato, ginger)
- Build the system prompt so it returns structured JSON per dish: { dish, verdict, reason, confidence }

DEMO-CRITICAL FEATURE: let the user toggle between two profiles (e.g. Halal vs Jain) on the SAME scanned menu and instantly see different verdicts with different reasoning for the same dishes — this is the single most important interaction to nail, it's the proof the app is reasoning, not just keyword-flagging.

TECH REQUIREMENTS:
- Frontend: single mobile page — profile toggle bar at top (sticky), camera/upload button, results list below. Warm, simple, legible at a glance (someone is standing at a restaurant table using this)
- Backend: one endpoint /scan-menu, takes image + array of selected profiles, returns structured JSON per dish
- Vision/reasoning model: Qwen Cloud or GMI Cloud multimodal API
- Run the parsing/reasoning step inside a Daytona sandbox for isolation
- Deploy to a public URL (Vercel/Railway) by end of day, no login/auth

SCOPE FOR ONE DAY, SOLO BUILDER:
- Don't build a full ingredient database — rely on the LLM's food knowledge plus a short system-prompt cheat sheet of common Japanese dishes and their typical hidden ingredients (dashi, mirin, gelatin) to reduce hallucination
- Support one photo per scan, no multi-page menus
- Pre-test with 5-8 real Japanese menu photos (mix of izakaya, ramen shop, teishoku) before demo, especially dishes with non-obvious hidden ingredients (mirin, dashi, gelatin) since those are your