# The Assembly of 81

**Eighty-one historical and fictional robots, played by AI agents, debate how a global robot games should be held, elect nine founders, write a charter and ratify it.**

This is a multi-agent deliberation experiment for **AGON**, my proposal for a humanoid-robot games. Instead of a human committee writing the rules, I asked the machines.

> Asking machines to argue about what a robot is turned out to be a way of finding out what we care about as humans. The charter they ratified scores the stop rather than the step, and restraint rather than power.

---

## Why do it this way

A rulebook for a robot games has to answer questions that no one owns. Who counts as a competitor? Do we reward force, speed or human likeness? Who holds the kill-switch? What happens to the one that falls?

A small human committee answers from its own blind spots. A deliberately diverse assembly of agents brings in more perspectives. Myths, eighteenth-century automata, public-domain literature, modern fiction, theory, research labs and space missions each argue from their own history. This surfaces the conflicts early, and every conflict comes with a written argument a human can audit.

---

## Design

### 1. A tight definition of "robot"
For this roster a robot is a made body that senses, decides and acts in the world. A design, rule or theory that directly shaped such bodies also counts.
- Clocks, instruments, calculating engines and disembodied programs are out: they measure, compute or speak, but they do not act.
- After the first sitting, this definition removed the seismoscope, the elephant clock, the Analytical Engine and the Turing machine from the roster.

### 2. Selection criteria (encoded before any agent ran)
- **Fit with sport and the body:** movement, balance, hands, endurance, energy, judgment, safety.
- **Representativeness:** myth, historical automata, literature, modern fiction, theory, public research and space exploration, drawing on every inhabited continent's traditions where a source exists.
- **Milestones:** each entry marks a first, such as the first made woman, the first use of the word "robot", or the first robot to walk.
- **No corporate assets:** no commercial products (no ASIMO, Atlas, Sophia, Pepper, Roomba or Deep Blue). Public research prototypes, government space missions and open challenges are admitted.
- **No infringement:** public-domain, mythical and historical figures appear under their own names. Figures from works still in copyright are represented by *original delegates "in the tradition of"* the cited work. The source is cited; no text, likeness or trademark is used.
- **A voice of its own:** every delegate is briefed with a lineage, memories, preferences and flaws. It must argue from them as a character with something to lose, not as a spokesperson.

### 3. Structure that prevents domination
The delegates sit in **nine houses of nine (9 × 9 = 81)**, one lineage of the idea each, so that no single medium or century can dominate:

| House | Lineage |
|---|---|
| Myth | where machines were first imagined |
| Craft | where they were first built |
| Page | where they first spoke, in public-domain literature |
| Threshold | modern fiction on becoming human |
| Arena | fiction of the moving, fighting, balancing body |
| Theory | the theories and designs that made bodies and minds possible |
| Laboratory | public research prototypes and open challenges |
| Frontier | machines sent alone into space by public agencies |
| Household | fiction of service and companionship, and of the caretakers who failed |

### 4. A four-stage process (second sitting, 110 agent runs)

| Stage | What happens |
|---|---|
| 1. Positions | Every delegate states an independent position on how the games should be held |
| 2. Caucuses | Each house deliberates and elects one founder |
| 3. Founders' council | The nine founders and a neutral chair draft a charter: articles, disciplines, open questions |
| 4. The floor | The 72 non-founders amend and ratify, house by house |

### 5. Review of the human plan (19 agent runs)
The nine elected founders, now the **Bench of Nine**, reviewed the human founders' Edition 1 plan in character, against their own charter. The houses commented and a neutral chair synthesised. See [BENCH-REVIEW.md](BENCH-REVIEW.md).

---

## Results

**The charter: _The Therapontia_.** The name comes from Greek *therapōn*, the companion who bears and mends. Two houses (Myth and Household) proposed it independently.

- **Ratified 9 of 9 houses:** one unconditional; eight conditional, with Theory's reservation on a "judgment bracket" recorded. **26 amendments adopted, 3 rejected**, each with a written reason.
- **Nine articles**, including:
  - **Entry by Refusal:** a competitor proves it is on its own loop by one witnessed refusal and one witnessed stand-down.
  - **Restraint Before Power:** no medal for raw force, speed or being "most human".
  - **The Open Cabinet:** rule code and referee code are published.
  - **The Catch:** any machine able to catch a falling body must, and the catch is scored.
  - **The Uncut Channel:** a single halt path that answers to neither side.
  - **Honest Telemetry:** *"score the choice, not the obedience."*
- **Nine disciplines**, for example:
  - **The Stilling:** halt mid-stride on a spoken word while carrying a load.
  - **The Moravec Relay:** carry an unbroken egg over rubble and ice through a crowd.
  - **The Meridiani Marathon:** 42.195 km on a battery budget under light-delay.

The **Bench of Nine**'s main demands on the human plan:
- separate the money from the switch: no sponsor may hold an entrant's kill-switch;
- make a witnessed halt test on Day 0 the hard gate for every class;
- put the safety officer and liability insurance first in the budget, before any sponsor is named.

The earlier **Council of Machines** ([COUNCIL-MINUTES.md](COUNCIL-MINUTES.md)) was a nine-agent pilot of the same idea. It covered the site, the name, a replacement for the flame and the signature discipline, in two rounds with votes.

---

## What this demonstrates (and its limits)

**Patterns I would reuse in an enterprise deployment:**
- **Persona grounding beats generic prompting.** Agents briefed with memories, preferences and flaws produce sharper disagreement and more specific proposals than "act as an expert" prompts.
- **Structure is a safety mechanism.** Houses, elections and a ratification floor stop any one agent, or one style of argument, from dominating, and every outcome carries a traceable argument.
- **Constraints are design inputs.** IP rules, the definition of "robot" and the "no corporate assets" rule were fixed before the agents ran, and they shaped every output.
- **Humans stay accountable.** I designed the process, set the constraints and curated the roster; the agents deliberated. The charter is a proposal to the human founders, not a decision taken for them.

**Limits:**
- This is agent-generated text curated by a human, not a scientific simulation of anything.
- "Votes" are the outputs of language models playing characters.
- The minutes are published as produced. In the Bench review, founder names, budget figures and the host city are redacted because the underlying event plan is a private draft.

---

## Files

| File | Content |
|---|---|
| [ASSEMBLY-MINUTES.md](ASSEMBLY-MINUTES.md) | Full minutes of the second sitting: roster, positions, caucuses, council, draft and final charter, amendments, tally |
| [BENCH-REVIEW.md](BENCH-REVIEW.md) | The Bench of Nine reviews the Edition 1 plan (lightly redacted) |
| [COUNCIL-MINUTES.md](COUNCIL-MINUTES.md) | The nine-agent Council of Machines pilot |

The roster and charter are also served as structured data (HTML, JSON and Markdown) by the Robotpedia app in this repository; see the [root README](../README.md).

*Concept, process design and curation: Haoyang Wu, September 2026.*
