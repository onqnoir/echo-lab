# WuWa Echo Lab

**WuWa Echo Lab** is a fan-made, fully static Echo comparison tool for **Wuthering Waves**. Its main purpose is simple: take the Echo you are currently using, enter a candidate drop, and estimate whether replacing **Echo A** with **Echo B** improves that Resonator's personal reference rotation.

The project runs entirely in the browser. There is no backend, account system, database, runtime API, or required external asset host.

## How to use it

1. Pick a Resonator.
2. Choose the Sonata preset that matches the build you want to evaluate.
3. Enter the total build stats shown in the character's out-of-combat Details screen.
4. Select an Echo slot from the saved loadout.
5. Keep your current Echo as **Echo A** and enter the candidate as **Echo B**.
6. Read the percentage result and the live ATK / HP / DEF, CRIT Rate, CRIT DMG and Energy Regen changes.
7. Save Echo A to the slot or equip Echo B when you want the saved loadout to follow the comparison.

Each Resonator stores its own data, and each Sonata preset stores its own build values, set layout and Echo loadout separately.

## Save Build targets

The four **Save Build** fields are quality checks for the selected Resonator and preset:

- **green** — the practical lower-end target has been reached;
- **orange** — the value is still below that target.

The primary field automatically follows the character's relevant scaler: **ATK**, **HP** or **DEF**. CRIT Rate, CRIT DMG and Energy Regen use build-specific targets. These values are intended as practical minimum good-build checkpoints, not theoretical perfect-build requirements.

A preset with no saved values starts directly at its green target. Once saved, that preset remembers its own values independently from the other Sonata presets for the same Resonator.

## What the comparison percentage means

The percentage is a **relative personal-damage estimate**. Echo A is treated as the current Echo already represented by the entered total build stats. Echo B replaces it while the rest of the reference build stays unchanged.

For the relevant primary scaler, the replacement delta is calculated from the character's base stat and the difference between Echo A and Echo B:

```text
ATK delta = (character base ATK + weapon base ATK) × ΔATK% + Δflat ATK
HP delta  = character base HP × ΔHP% + Δflat HP
DEF delta = character base DEF × ΔDEF% + Δflat DEF
```

CRIT uses average expected damage rather than assuming every hit crits:

```text
Expected CRIT factor = (1 - CR) + CR × CD
```

where CRIT Rate is capped at 100% and the in-game CRIT DMG value is used as the full critical-hit multiplier.

For every damage category used by the Resonator's reference rotation, the tool compares the relevant multiplicative buckets:

```text
primary stat × expected CRIT × DMG Bonus × DMG Amplify × special multiplier
```

The final result is the weighted average of those per-category ratios using that preset's reference rotation shares. This lets a Heavy-Attack-focused Resonator value Heavy Attack DMG differently from a Skill-focused or Liberation-focused Resonator instead of treating every offensive substat as equal.

Enemy DEF, level scaling and resistance are not separately applied because the tool compares two Echoes against the same reference target and those unchanged multipliers cancel out of the A/B ratio. Effects that would change those enemy-side multipliers would need explicit modeling before they could be valued.

## Sonata handling

The calculator supports regular 5-piece sets as well as supported 3+2 and 1+2+2 layouts. Sonata activation is checked using **unique Echo identities**, so duplicate copies of the same Echo do not incorrectly activate a set threshold.

Static and conditional Sonata effects that matter to the personal comparison are modeled in the local data. Presets can also carry their own ER requirement, damage distribution and special handling where a character's damage does not follow the standard direct-damage path.

Changing a split-set layout keeps compatible saved Echoes. If a change would make saved slots belong to the wrong Sonata, the app asks before clearing those incompatible slots.

## What the tool intentionally does not simulate

WuWa Echo Lab is an Echo comparator, not a full combat simulator. The result intentionally does not attempt to value:

- total team DPS;
- healing or shielding value;
- Main Echo skill damage itself;
- enemy-specific encounter timelines;
- rotation changes caused by player execution;
- buffs or mechanics that are not represented in the selected preset data.

This scope is deliberate: the tool is designed to answer **"is this Echo better for this build?"** quickly without requiring a full optimizer or team simulator.

## Saved data and import/export

Builds are stored locally in the browser with `localStorage`. Saved data includes the active preset, build values, split-set configuration and Echoes assigned to each slot.

**Export Profile** creates a JSON backup for the selected Resonator. **Import Profile** restores compatible data for that Resonator and validates imported Echo stats against the local catalog and legal roll values.

To reset WuWa Echo Lab data without clearing unrelated site storage, run this in the browser console and reload the page:

```js
Object.keys(localStorage)
  .filter(key => key.startsWith("wuwaEchoLab."))
  .forEach(key => localStorage.removeItem(key));
```

## Project structure

```text
index.html                         page markup
css/style.css                      complete UI styling
js/app.js                          UI, state, comparison workflow and import/export
js/data.js                         Resonators, presets, stat targets and Sonata effects
js/echo_catalog.js                 local Echo catalog
js/equipment.js                    weapon and Main Echo recommendations
js/math.js                         comparison mathematics
assets/avatars/                    Resonator portraits
assets/attributes/                 attribute icons
assets/weapons/                    weapon-type icons
assets/roles/                      role icons
assets/sets/                       Sonata icons
assets/recommended-weapons/        weapon artwork
assets/echoes/                     Echo artwork
assets/ui/                         favicon and background assets
```

Raster assets are stored locally as **WebP**. The favicon also includes an `.ico` version and the background contour asset is SVG.

## Maintaining the data

Wuthering Waves changes over time, so character recommendations, Sonata effects, Echo assignments, weapons and reference rotations may need updates after future patches. Gameplay data is separated from the UI so those changes can be made in the local JavaScript data files without redesigning the application.

## Credits

Made by **onqnoir** as a fan project for **Wuthering Waves**.

This project is not affiliated with Kuro Games. Wuthering Waves, its characters, artwork, names and trademarks belong to their respective rights holders.
