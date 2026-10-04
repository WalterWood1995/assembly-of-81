# Translator brief — AGON Robotpedia

You translate a robot encyclopedia website from English into ONE target language (given in your task).
Working directory: C:\Users\wu_ha\Downloads\agon-robotpedia\data\i18n

Inputs (read with the Read tool):
- en.ui.json       — ~140 interface strings, flat {key: text}
- en.content.json  — {houses:{id:{name,note}}, robots:{slug:{name,source,sport,description,remembers,prefers,flaw,quote}}} — 9 houses, 81 robots
- <lang>.existing.json (only for zh, fr, hrv) — name/source/sport and house name/note ALREADY translated by the site owners. Copy these values verbatim; translate only what is missing.

Outputs (write with the Write tool, valid UTF-8 JSON, same keys as the inputs, nothing else):
- <lang>.ui.json       — every key of en.ui.json
- <lang>.content.json  — every house and every robot with ALL eight robot fields
The content file is large: write it in one Write call if you can; if you must split, write <lang>.content.part1.json (houses + first 41 robots, in input order) and <lang>.content.part2.json (remaining 40 robots) with the same shape.

Rules:
- Natural, publishable prose in the target language — an encyclopedia register, not word-for-word. Keep the dry wit of the originals (the "flaw" and "quote" fields are literary; keep them short and sharp).
- Use the established name of each figure in the target language where one exists (e.g. Talos, Pinocchio, Frankenstein, Golem, Mars rovers, Kalevala characters, Chinese/Japanese historical names). Where none exists, transliterate or keep the original name. Keep titles of works in their established target-language form; keep author names in the target script's customary form.
- Entries "in the tradition of" a copyrighted work must STAY archetypes: translate the generic archetype name (e.g. "The Boy Robot"), never replace it with the copyrighted character's name.
- Do not add, drop or embellish facts. Keep numbers, dates and units. Keep "AGON", "Robotpedia", "API", "JSON", "Markdown", "HTML", "POST", URLs, and code-like tokens untouched.
- "robot.*", "kind.*" etc. are labels: keep them short. Strings ending with "with"/"through"/"for" are followed on the page by a code snippet — phrase them so that works in your language (e.g. end with a colon).
- "human.plan_d" must still say the plan exists in English, Chinese, French and Croatian.
- Arabic only: write Modern Standard Arabic; do not insert direction marks.
- When done, re-read your output once to verify it parses as JSON and has all 81 robots / 9 houses / all UI keys, then reply with one line: the files written and the counts.
