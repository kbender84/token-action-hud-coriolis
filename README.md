# Introduction

A plug-in module for the module [Token Action HUD Core](https://foundryvtt.com/packages/token-action-hud-core) which adds support for the [Coriolis System](https://foundryvtt.com/packages/yzecoriolis).

## Behaviour reminders from HUD Core

## Installation

At this moment the package requires manual updates to the Coriolis Core system. Be warned you may damage your instalation.

1) Add the module using foundry module manger and custom url:

https://github.com/kbender84/token-action-hud-coriolis/releases/download/0.1/module.json

It should download token-action-hud-core, but in case it won't make sure you also have it installed
https://foundryvtt.com/packages/token-action-hud-core

2) After the module is downloaded BACKUP two files from your installation:
/Data/systems/yzecoriolis/module/yzecoriolis.js
/Data/systems/yzecoriolis/module/actor/actor.js

3) replace the files:
/Data/systems/yzecoriolis/module/yzecoriolis.js with /Data/modules/token-action-hud-coriolis/corefiles/yzecoriolis.js
/Data/systems/yzecoriolis/module/actor/actor.js with /Data/modules/token-action-hud-coriolis/corefiles/actor.js
4) Reload Foundry and enjoy!
5) If the GUI goes nuts, there may be problem with cache. In the Token-Action-Hud-Core configuration in Foundry you can check the box to delete the cached data - use it. If that does not help, make sure that GM is present when the users use the HUD for the first time. Last trick - if the above do not help, check your Foundry installation folder. In /Data/ there should be subfolder token-action-hud-core. Remove it's contents and login to Foundry as GM. It will recreate all necessary files.

PS. If you like my work, and would like to support me, you can became my patron on https://www.patreon.com/benderworks 
## License

This software is released under the MIT license.
