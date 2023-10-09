# Introduction

A plug-in module for the module [Token Action HUD Core](https://foundryvtt.com/packages/token-action-hud-core) which adds support for the [Coriolis System](https://foundryvtt.com/packages/yzecoriolis).

## Behaviour reminders from HUD Core
A plug-in module for the module Token Action HUD Core


![coriolis_hud](https://github.com/kbender84/token-action-hud-coriolis/assets/66570321/63ef03ca-824d-4161-ae8d-4034ea7991d9)

Adds actor actions in form of HUD overlay over the game scene. Now majority of your character and ship actions can be performed without opening the actor sheet!

Version 1.0 supports Player character and NPC actions including rolls for crittical injuries:

https://github.com/kbender84/token-action-hud-coriolis/assets/66570321/e03df26c-8032-46bb-9cae-f8871c7918ee

It also adds Ship character sheet to the HUD:


https://github.com/kbender84/token-action-hud-coriolis/assets/66570321/7fc59ee8-5bbb-4751-95ce-600e8e5d7643

Adds the Armor roll and Crittical damage rolls:

https://github.com/kbender84/token-action-hud-coriolis/assets/66570321/d2deddd7-4acf-4612-8a66-746c707a73e6

I have implemented initiative that is closer to the Coriolis rules for starship than the default one. (Default one just rolls d6.d6, new one rolls (Empathy + Command) d6, picks the highest dice, puts it as front digit, and checks number of it's occurences, and sets it as second digit.
I.e, if your Capitan has 4 Empathy and 3 Command, it will roll 7d6. If the result is [ 6, 6, 5, 4, 3, 2, 1], then initiative score is: 6 (highest roll), .2 (two 6 rolled) = 6.2. It gives higher results than the default d6.d6 formula, and promotes experienced Capitans.

https://github.com/kbender84/token-action-hud-coriolis/assets/66570321/4000c87f-3754-4a3b-9396-d9832e1aa68c

And last, but not least, the weapon rolls. Using HUD you don't have to remember all the attributes and bonuses of weapon rolled. The HUD will take gunners Agility + Ranged Combat + Ship Weapon Bonus and combine that all in one roll.

https://github.com/kbender84/token-action-hud-coriolis/assets/66570321/330a206b-298b-4c97-9905-f778ce47ee14

Enjoy! 

If you like my work, and would like to support me, you can became my patron on https://www.patreon.com/benderworks


This software is released under the MIT license.
