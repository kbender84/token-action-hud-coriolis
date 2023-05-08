# Introduction

A plug-in module for the module [Token Action HUD Core](https://foundryvtt.com/packages/token-action-hud-core) which adds support for the [Coriolis System](https://foundryvtt.com/packages/yzecoriolis).

## Behaviour reminders from HUD Core

## Installation

At this moment the package requires manual updates to the Coriolis Core system. Be warned you may damage your instalation.

1) Add the module using 

[https://github.com/kbender84/token-action-hud-coriolis/releases/latest/download/module.json](https://github.com/kbender84/token-action-hud-coriolis/releases/download/0.1/module.json)

2) After the module  is downloaded BACKUP two files from your installation:
/Data/systems/yzecoriolis/module/yzecoriolis.js
/Data/systems/yzecoriolis/module/actor/actor.js

3) replace the files:
/Data/systems/yzecoriolis/module/yzecoriolis.js with /Data/modules/token-action-hud-coriolis/corefiles/yzecoriolis.js
/Data/systems/yzecoriolis/module/actor/actor.js with /Data/modules/token-action-hud-coriolis/corefiles/actor.js
4) Reload Foundry and enjoy!


## License

This software is released under the MIT license.
