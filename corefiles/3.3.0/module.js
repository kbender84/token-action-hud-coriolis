export let CoriolisActionHandler = null
export let CoriolisRollHandler = null
export let CoriolisSystemManager = null

Hooks.on('tokenActionHudCoreApiReady', async (coreModule) => {

    const ATTRIBUTES_ID = 'attributes';
    const GENERAL_ID    = 'generals';
    const ADVANCED_ID   = 'advanceds';
    const WEAPON_ID     = 'weapons';
    const GEAR_ID     = 'gears';
    const TALENT_ID     = 'talents';
    const INJURY_ID     = 'injuries';
    const ARMOR_ID     = 'armors';
	const COMBAT_ID    = 'combats';
	
    const ACTION_ATTRIBUTES = 'attribute';
    const ACTION_GENERAL    = 'general';
    const ACTION_ADVANCED   = 'advanced';
    const ACTION_WEAPON     = 'weapon';
    const ACTION_GEAR     = 'gear';
    const ACTION_TALENT     = 'talent';
    const ACTION_INJURY     = 'injury';
    const ACTION_ARMOR     = 'armor';
    const ACTION_COMBAT     = 'combat';
    /* ACTIONS */



    CoriolisActionHandler = class CoriolisActionHandler extends coreModule.api.ActionHandler {
 //       constructor() {
 //       }

        /** @override */
        async buildSystemActions(groupIds) {
            // We don't support MULTIPLE tokens being selected at the same time.
            //this.actors = (!this.actor) ? this._getActors() : [this.actor]
            //this.tokens = (!this.token) ? this._getTokens() : [this.token]
            //this.actorType = this.actor?.type

            const token = this.token;
            if (!token) return;
            const tokenId = token.id;
            const actor = this.actor;
            if (!actor) return;

            this._getAttributes({ id: ATTRIBUTES_ID, type: 'system' });
            this._getGeneral   ({ id: GENERAL_ID,    type: 'system' });
            this._getAdvanced  ({ id: ADVANCED_ID,   type: 'system' });
            this._getWeapon    ({ id: WEAPON_ID,     type: 'system' });
            this._getGear    ({ id: GEAR_ID,     type: 'system' });
            this._getTalent    ({ id: TALENT_ID,     type: 'system' });
            this._getInjury    ({ id: INJURY_ID,     type: 'system' });
            this._getArmor    ({ id: ARMOR_ID,     type: 'system' });

        
            //if (settings.get("showHudTitle")) result.hudTitle = token.name;

        }


        
        _getAttributes(parent) {
            // Loading attributes into the list.
            let actions = [ "strength", "agility", "wits", "empathy" ].map( key => {
                return {
                    id: key,
                    name: game.i18n.localize(`YZECORIOLIS.Attr${key.capitalize()}`),
					description: game.i18n.localize(`YZECORIOLIS.Attr${key.capitalize()}`),
                    encodedValue: [ACTION_ATTRIBUTES, key].join(this.delimiter)
                }
            });
            //console.log(actions);
            this.addActions(actions, parent);

        }
        
        _getGeneral(parent) {
            // Loading skills into the list.

            let actions = [ "dexterity", "force", "infiltration", "manipulation", "meleeCombat", "observation", "rangedCombat", "survival" ].map( key => {
                return {
                    id: key,
                    name: game.i18n.localize(`YZECORIOLIS.Skill${key.capitalize()}`),
					description: game.i18n.localize(`YZECORIOLIS.Skill${key.capitalize()}`),
                    encodedValue: [ACTION_GENERAL, key, ''].join(this.delimiter)
                }
            });
            //console.log(actions);
            this.addActions(actions, parent);

        }
        _getAdvanced(parent) {
            // Loading advanced skills into the list.
            let actions = [ "command", "culture", "dataDjinn", "medicurgy", "pilot", "science", "technology", "mysticPowers" ].map( key => {
                return {
                    id: key,
                    name: game.i18n.localize(`YZECORIOLIS.Skill${key.capitalize()}`),
					description: game.i18n.localize(`YZECORIOLIS.Skill${key.capitalize()}`),
                    encodedValue: [ACTION_ADVANCED, key.capitalize(), ''].join(this.delimiter)
                }
            });
            //console.log(actions);
            this.addActions(actions, parent);

        }
		
        _getWeapon(parent) {
            // Loading weapons and explosives into the list.
            let weaponList = this.actor.items.filter(i => i.type === "weapon");
            let actions = weaponList.map(i => {
                return{
                    id: i._id, 
                    name: i.name, 
					description: i.system.description,
                    encodedValue: [ACTION_WEAPON, i.name, i.system.description].join(this.delimiter),
                    img: i.img
                    }
                    }
                    );
        
            //console.log(actions);
            this.addActions(actions, parent);

        }
		
        _getGear(parent) {
            // Loading items into the list.
            let weaponList = this.actor.items.filter(i => i.type === "gear");
            let actions = weaponList.map(i => {
                return{
                    id: i._id, 
                    name: i.name, 
					description: i.system.description,
					weight: i.system.weight,
					techTier: i.system.techTier,
					equipped: i.system.equipped,
					quantity: i.system.quantity,
                    encodedValue: [ACTION_GEAR, i.name, i.system.description, i.system.equipped, i.system.quantity].join(this.delimiter),
                    img: i.img
                    }
                    }
                    );
        
            //console.log(actions);
            this.addActions(actions, parent);

        }
		
        _getTalent(parent) {
            // Loading talents into the list.
            let weaponList = this.actor.items.filter(i => i.type === "talent");
            let actions = weaponList.map(i => {
                return{
                    id: i._id, 
                    name: i.name, 
					description: i.system.description,
					category: game.i18n.localize(`YZECORIOLIS.TalentCat${i.system.category.capitalize()}`),
                    encodedValue: [ACTION_TALENT, i.name, i.system.description, game.i18n.localize(`YZECORIOLIS.TalentCat${i.system.category.capitalize()}`)].join(this.delimiter),
                    img: i.img
                    }
                    }
                    );
        
            //console.log(weaponList);
			//console.log(actions);
            this.addActions(actions, parent);

        }
        _getInjury(parent) {
            // Loading critical injuries into the list.
            let weaponList = this.actor.items.filter(i => i.type === "injury");
            let actions = weaponList.map(i => {
                return{
                    id: i._id, 
                    name: i.name, 
					description: i.system.description,
					fatal: i.system.fatal,
					healTime: i.system.healTime,
					timeLimit: i.system.timeLimit,
                    encodedValue: [ACTION_INJURY, i.name, i.system.description, i.system.fatal,i.system.healTime].join(this.delimiter),
                    img: i.img
                    }
                    }
                    );
        
            //console.log(actions);
            this.addActions(actions, parent);

        }
        _getArmor(parent) {
            // Loading armomr into the list.
            let weaponList = this.actor.items.filter(i => i.type === "armor");
            let actions = weaponList.map(i => {
                return{
                    id: i._id, 
                    name: i.name, 
					description: i.system.description,
                    encodedValue: [ACTION_ARMOR, i.name, i.system.description].join(this.delimiter),
                    img: i.img
                    }
                    }
                    );
        
            //console.log(actions);
            this.addActions(actions, parent);

        }
		

    }


    /* ROLL HANDLER */

    CoriolisRollHandler = class CoriolisRollHandler extends coreModule.api.RollHandler {
        doHandleActionEvent(event, encodedValue) {
            let payload = encodedValue.split("|");
        
            if (payload.length < 2) {
            super.throwInvalidValueErr();
            }
        
            const macroType = payload[0];
            const actionId = payload[1];
            const description = payload[2];
			//console.log(actionId);

			//console.log(description);

			
			
            if (this.isRenderItem()) {
                this.doRenderItem(this.actor, actionId);
                return;
            }
            let rData = [];    
            switch (macroType) {
			case ACTION_WEAPON:
                // item-roll
                game.yzecoriolis.rollItemMacro(actionId);
                break;
            case ACTION_ARMOR:
                // item-roll
                game.yzecoriolis.rollItemMacro(actionId);
                break;  	
			case ACTION_GEAR:
			// item-display 
				this._chatItem('<h2>Gear - '+actionId+'</h2>'+'<b>Equiped:</b> '+payload[3]+', <b>Quantity: </b>'+payload[4]+'<br>'+description);
                break;  	
			case ACTION_TALENT:
			// item-display 
				this._chatItem('<h2>Talent - '+actionId+'</h2>'+'<b>'+payload[3]+'</b><br>'+description);
                break;  					
			case ACTION_INJURY:
			// item-display 
				this._chatItem('<h2>Injury - '+actionId+'</h2>'+'<b>Fatal:</b> '+payload[3]+', <b>Healing time:</b>'+payload[4]+'<br>' +description);
                break;  					
				
            case ACTION_ATTRIBUTES:
                  rollActorMacro(actionId, 'attribute');

				  break;
            case ACTION_GENERAL:
			    rollActorMacro(actionId, 'general');
				break;
            case ACTION_ADVANCED:
			    rollActorMacro(actionId, 'advanced');
				break;

            }

            // Ensure the HUD reflects the new conditions
            Hooks.callAll('forceUpdateTokenActionHud');
        }
		
	
		_chatItem(message) {
			//crates chatmessage
			ChatMessage.create({
				user: game.user._id,
				speaker: ChatMessage.getSpeaker({token: this.actor}),
				content: message
				});
		  }
    }
        

      function rollActorMacro(rollName, rollType) {
  		const speaker = ChatMessage.getSpeaker();
  		let actor;
  		if (speaker.token) actor = game.actors.tokens[speaker.token];
  		if (!actor) actor = game.actors.get(speaker.actor);
  		if (!actor) {
    			return ui.notifications.warn(game.i18n.localize("YZECORIOLIS.ErrorsNoActorSelectedForMacro"));
  			}
  		return actor.roll(rollName, rollType, actor);
	}
    

    // Core Module Imports

    CoriolisSystemManager = class CoriolisSystemManager extends coreModule.api.SystemManager {
        /** @override */
        doGetActionHandler () {
            return new CoriolisActionHandler()
        }

        /** @override */
        getAvailableRollHandlers () {
            const choices = { core: "Coriolis RPG" };
            return choices
        }

        /** @override */
        doGetRollHandler (handlerId) {
            return new CoriolisRollHandler()
        }

        /** @override */
        /*doRegisterSettings (updateFunc) {
            systemSettings.register(updateFunc)
        }*/

        async doRegisterDefaultFlags () {
            const ATTRIBUTES_NAME    = game.i18n.localize('YZECORIOLIS.Attributes');
            const GENERAL_NAME		 = game.i18n.localize('YZECORIOLIS.SkillCatGeneral');
            const ADVANCED_NAME		 = game.i18n.localize('YZECORIOLIS.SkillCatAdvanced');
            const WEAPON_NAME		 = game.i18n.localize('YZECORIOLIS.Weapons');
            const TALENT_NAME		 = game.i18n.localize('YZECORIOLIS.Talent');
            const GEAR_NAME		 = game.i18n.localize('YZECORIOLIS.Gear');
            const INJURY_NAME		 = game.i18n.localize('YZECORIOLIS.CriticalInjuries');
            const ARMOR_NAME		 = game.i18n.localize('YZECORIOLIS.Armor');
			
            const DEFAULTS = {
                layout: [
                    { 
                        nestId: ATTRIBUTES_ID,
                        id:     ATTRIBUTES_ID,
                        name:   ATTRIBUTES_NAME,
                        type:   'system',
                        groups: [
                            {
                                nestId: 'attributes_attributes',
                                id:     ATTRIBUTES_ID,
                                name:   ATTRIBUTES_NAME,
                                type:   'system'
                            }
                        ]
                    },
                    { 
                        nestId: GENERAL_ID,
                        id:     GENERAL_ID,
                        name:   GENERAL_NAME,
                        type:   'system',
                        groups: [
                            {
                                nestId: 'generals_generals',
                                id:     GENERAL_ID,
                                name:   GENERAL_NAME,
                                type:   'system'
                            }
                        ]
                    },
                    { 
                        nestId: ADVANCED_ID,
                        id:     ADVANCED_ID,
                        name:   ADVANCED_NAME,
                        type:   'system',
                        groups: [
                            {
                                nestId: 'advanceds_advanceds',
                                id:     ADVANCED_ID,
                                name:   ADVANCED_NAME,
                                type:   'system'
                            }
                        ]
                    },
                    { 
                        nestId: WEAPON_ID,
                        id:     WEAPON_ID,
                        name:   WEAPON_NAME,
                        type:   'system',
                        groups: [
                            {
                                nestId: 'weapons_weapons',
                                id:     WEAPON_ID,
                                name:   WEAPON_NAME,
                                type:   'system'
                            }
                        ]
                    },
                    { 
                        nestId: ARMOR_ID,
                        id:     ARMOR_ID,
                        name:   ARMOR_NAME,
                        type:   'system',
                        groups: [
                            {
                                nestId: 'armors_armors',
                                id:     ARMOR_ID,
                                name:   ARMOR_NAME,
                                type:   'system'
                            }
                        ]
                    },
                    { 
                        nestId: GEAR_ID,
                        id:     GEAR_ID,
                        name:   GEAR_NAME,
                        type:   'system',
                        groups: [
                            {
                                nestId: 'gears_gears',
                                id:     GEAR_ID,
                                name:   GEAR_NAME,
                                type:   'system'
                            }
                        ]
                    },
                    { 
                        nestId: TALENT_ID,
                        id:     TALENT_ID,
                        name:   TALENT_ID,
                        type:   'system',
                        groups: [
                          
							{
                                nestId: 'talents_talents',
                                id:     TALENT_ID,
                                name:   TALENT_NAME,
                                type:   'system'
                            }
                        ]
                    },
                    { 
                        nestId: INJURY_ID,
                        id:     INJURY_ID,
                        name:   INJURY_NAME,
                        type:   'system',
                        groups: [
                            {
                                nestId: 'injuries_injuries',
                                id:     INJURY_ID,
                                name:   INJURY_NAME,
                                type:   'system'
                            }
                        ]
                    }
                ],
                groups: [
                    { id: ATTRIBUTES_ID, name: ATTRIBUTES_NAME, type: 'system', hasDerivedSubcategories: false },
                    { id: GENERAL_ID, name: GENERAL_NAME, type: 'system', hasDerivedSubcategories: false },
                    { id: ADVANCED_ID, name: ADVANCED_NAME, type: 'system', hasDerivedSubcategories: false },
                    { id: WEAPON_ID, name: WEAPON_NAME, type: 'system', hasDerivedSubcategories: false },
                    { id: ARMOR_ID, name: ARMOR_NAME, type: 'system', hasDerivedSubcategories: false },
                    { id: GEAR_ID, name: GEAR_NAME, type: 'system', hasDerivedSubcategories: false },
                    { id: TALENT_ID, name: TALENT_NAME, type: 'system', hasDerivedSubcategories: true },
                    { id: INJURY_ID, name: INJURY_NAME, type: 'system', hasDerivedSubcategories: true }
                ]
            }

            // HUD CORE v1.2 wants us to return the DEFAULTS
            return DEFAULTS;
        }
    }

    /* STARTING POINT */

    const module = game.modules.get('token-action-hud-coriolis');
    module.api = {
        requiredCoreModuleVersion: '1.4',
        SystemManager: CoriolisSystemManager
    }    
     Hooks.call('tokenActionHudSystemReady', module)
});


