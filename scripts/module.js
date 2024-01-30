export let CoriolisActionHandler = null
export let CoriolisRollHandler = null
export let CoriolisSystemManager = null

import { coriolisRoll, coriolisModifierDialog } from "/systems/yzecoriolis/module/coriolis-roll.js";
import { getCrewForShip} from "/systems/yzecoriolis/module/actor/crew.js";

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
	    //console.log(token);
            const actor = this.actor;
            if (!actor) return;
            if (actor.type === 'ship') 
            {
		this._getShipCrew(tokenId );
		this._getShipDetails();
		this._getShipStats();

            }
	    //console.log(actor);
            if (actor.type === 'character' ||  actor.type === 'npc' ) 
            {
                this._getAttributes({ id: ATTRIBUTES_ID, type: 'system' });
                this._getGeneral   ({ id: GENERAL_ID,    type: 'system' });
                this._getAdvanced  ({ id: ADVANCED_ID,   type: 'system' });
                this._getWeapon    ({ id: WEAPON_ID,     type: 'system' });
                this._getGear    ({ id: GEAR_ID,     type: 'system' });
                this._getTalent    ({ id: TALENT_ID,     type: 'system' });
                this._getInjury    ({ id: INJURY_ID,     type: 'system' });
                this._getArmor    ({ id: ARMOR_ID,     type: 'system' });
            }
        
            //if (settings.get("showHudTitle")) result.hudTitle = token.name;

        }

        _getShipCrew(tokenId ) {
	let  crewdata = getCrewForShip(this.actor.id).map( key => {
                return { 
			id: key.id,
			name: key.name,
			img:key.img,
			crewPosition: key.system.bio.crewPosition.position,
			crewName: key.name,
			encodedValue: [key.system.bio.crewPosition.position, key.id].join(this.delimiter)

			}});
        //console.log(crewdata.filter(crew => crew.crewPosition==='capitan'));
        //console.log(crewdata);
        let capitans = crewdata.filter(crew => crew.crewPosition==='captain').map(i => {
            return{
                actor_id: i.id, 
                actor_name: i.name, 
                img: i.img
        }});
        let capitansArray=[];
        for(var each = 0 ; each < capitans.length; each++)
            {   
                let localcapitan = {
                id: capitans[each].actor_id,
                actor_id: capitans[each].actor_id, 
		token_id: tokenId ,
                type: 'captain',
                actor_name: capitans[each].actor_name, 
                img: capitans[each].img}
                capitansArray.push(localcapitan) ;

                let localcapitanInitiative = {
                    id: capitans[each].actor_id+'Initiative' ,
                    actor_id: capitans[each].actor_id, 
		    token_id: tokenId ,
                    type:'shipinitiative',
                    actor_name: capitans[each].actor_name+ ' - Initiative', 
                    img: capitans[each].img}
                    capitansArray.push(localcapitanInitiative) ;

            }
        let capitansObject = capitansArray.map(i => {return{
            id: i.id,
			name: i.actor_name,
			img: i.img,
            encodedValue: [i.type,i.actor_id, i.token_id ].join(this.delimiter)    }})
        this.addActions(capitansObject , {id:'captain', type: 'system'});

        let pilots = crewdata.filter(crew => crew.crewPosition==='pilot').map(i => {
            return{
                actor_id: i.id, 
                actor_name: i.name, 
                img: i.img
        }});
        let pilotsArray=[];
	let shipManeuver = this.actor.system.manueverability.value;
	//console.log(shipManeuver);
        for(var each = 0 ; each < pilots.length; each++)
            {   
                let localpilot = {
                id: pilots[each].actor_id,
                actor_id: pilots[each].actor_id, 
		token_id: tokenId ,
                type: 'pilot',
                actor_name: pilots[each].actor_name, 
                img: pilots[each].img}
                pilotsArray.push(localpilot) ;
		
                let pilotManeuver = {
                    id: pilots[each].actor_id+'Maneuver' ,
                    actor_id: pilots[each].actor_id, 
		    token_id: tokenId ,
                    type:'pilotsManeuver',
                    actor_name: pilots[each].actor_name+ ' - Maneuver', 
                    img: pilots[each].img,
		    bonus: shipManeuver }
                    pilotsArray.push(pilotManeuver ) ;

            }
        let pilotsObject = pilotsArray.map(i => {return{
            id: i.id,
			name: i.actor_name,
			img: i.img,
        encodedValue: [i.type,i.actor_id, i.token_id, i.bonus ].join(this.delimiter)    }})
        this.addActions(pilotsObject , {id:'pilot', type: 'system'});


	//this.addActions(crewdata.filter(crew => crew.crewPosition==='captain') , {id:'captain', type: 'system'});
	this.addActions(crewdata.filter(crew => crew.crewPosition==='engineer') , {id:'engineer', type: 'system'});
	//this.addActions(crewdata.filter(crew => crew.crewPosition==='pilot') , {id:'pilot', type: 'system'});
	//this.addActions(crewdata.filter(crew => crew.crewPosition==='sensorOperator') , {id:'sensorOperator', type: 'system'});
	//this.addActions(crewdata.filter(crew => crew.crewPosition==='gunner') , {id:'gunner', type: 'system'});
	// adding data memes and weapons
	let shipModules= this.actor.items.filter(map => map.type ==='shipModule');
	let shipModulesData= shipModules.filter(map => map.name === 'Data Meme');
	let shipModulesWeapons = shipModules.filter(map => map.system.category === 'weapon').filter(map => map.name !== 'Data Meme');

	let sensorOperators = crewdata.filter(crew => crew.crewPosition==='sensorOperator').map(i => {
                return{
                    actor_id: i.id, 
                    actor_name: i.name, 
                    img: i.img
			}});

	let sensorsActionsArray = [];
	for (var sensorKey = 0; sensorKey < sensorOperators.length; sensorKey++ )
		{ 
		let sensorAction = {id: sensorOperators[sensorKey].actor_id, actorId: sensorOperators[sensorKey].actor_id, img:sensorOperators[sensorKey ].img, name: sensorOperators[sensorKey ].actor_name, type:'sensorOperator'};
		sensorsActionsArray.push(sensorAction);

			for (var wepkey = 0 ; wepkey  <shipModulesData.length; wepkey++)
				{ 
					let sensorActionsLocal ={
					actorId: sensorOperators[sensorKey ].actor_id, 
					weaponId: shipModulesData[wepkey]._id, 
					img: sensorOperators[sensorKey ].img, 
					name: sensorOperators[sensorKey ].actor_name+ ' - ' + shipModulesData[wepkey].name ,
                    type: 'meme',
                    damage: shipModulesData[wepkey].system.damage,
                    damageText: shipModulesData[wepkey].system.damageText,
                    bonus: shipModulesData[wepkey].system.bonus,
                    range: shipModulesData[wepkey].system.range,
                    crit: shipModulesData[wepkey].system.crit.numericValue,
                    features:  shipModulesData[wepkey].system.special,
                    critText:shipModulesData[wepkey].system.crit.customValue
                };
					sensorsActionsArray.push(sensorActionsLocal);
                    //console.log(shipModulesData[wepkey]);
				}; 


		};

	var sensorsActionsObject = sensorsActionsArray.map(i=>{return{
			id: i.actorId + i.weaponId,
			name: i.name,
			img: i.img,
            encodedValue: [i.type,i.actorId,i.bonus, i.weaponName, i.damage, i.crit, i.range].join(this.delimiter) 
			}
			}
			);


	this.addActions(sensorsActionsObject , {id:'sensorOperator', type: 'system'});


	let gunners = crewdata.filter(crew => crew.crewPosition==='gunner').map(i => {
                return{
                    actor_id: i.id, 
                    actor_name: i.name, 
                    img: i.img
			}});
	let gunnersActions = [];

	for (var gunkey = 0; gunkey < gunners.length; gunkey ++)
		{ 
		let gunnerAction = {id: gunners[gunkey].actor_id, actorId: gunners[gunkey].actor_id, img:gunners[gunkey].img, name: gunners[gunkey].actor_name, type:'gunner'};
		gunnersActions.push(gunnerAction);

			for (var wepkey =0 ;wepkey < shipModulesWeapons.length; wepkey++)
				{		
					let featurelist = Object.values(shipModulesWeapons[wepkey].system.special);
					let gunnersActionsLocal ={
					actorId: gunners[gunkey].actor_id,
					weaponId: shipModulesWeapons[wepkey]._id, 
					img: gunners[gunkey].img, 
					name: gunners[gunkey].actor_name+ ' - ' + shipModulesWeapons[wepkey].name ,
                   				type:'shipweaponroll',
                   				damage: shipModulesWeapons[wepkey].system.damage,
                    				damageText: shipModulesWeapons[wepkey].system.damageText,
                    				bonus: shipModulesWeapons[wepkey].system.bonus,
                    				range: shipModulesWeapons[wepkey].system.range,
                    				crit: shipModulesWeapons[wepkey].system.crit.numericValue,
                    				features:  featurelist,
                    				critText:shipModulesWeapons[wepkey].system.crit.customValue ,
					weaponName: shipModulesWeapons[wepkey].name              
                };
					gunnersActions.push(gunnersActionsLocal);
                    //console.log(shipModulesWeapons[wepkey]);
                   //console.log(gunnersActionsLocal.features);
				}; 

		};

	var gunnerActionsObject = gunnersActions.map(i=>{return{
			id: i.actorId + i.weaponId,
			name: i.name,
			img: i.img,
            encodedValue: [i.type,i.actorId,i.bonus, i.weaponName, i.damage, i.crit, i.range, i.features,i.damageText,i.critText].join(this.delimiter) 
        	}            
			}
			);

	
	this.addActions(gunnerActionsObject , {id:'gunner', type: 'system'});
        }


	
	_getShipStats(){
	    let shipArmor = this.actor.system.armor.value;
	    let shipHull = this.actor.system.hullPoints.value;
	    let shipEnergy = this.actor.system.maxEnergyPoints;
	    //adding ship stats
		let actions = [
		{
		    id: 'shipsstatsa',
                    name: shipArmor.toString(), 
		    description: 'Ship Armor' ,
		    encodedValue: ['shipsstatsa', this.actor._id, shipArmor.toString()].join(this.delimiter)
 
                }];
	    this.addActions(actions, {id:'shipsstatsa', type: 'system'});
		actions = [
		{
		    id: 'shipsstatsh',
                    description: 'Ship Hull Points',
		    name: shipHull.toString() ,
		    encodedValue: ['shipsstatsh', shipHull.toString()].join(this.delimiter)

                }]
	    this.addActions(actions, {id:'shipsstatsh', type: 'system'});
		actions = [
		{
		    id: 'shipsstatse',
                    description: 'Ship Energy Points',
		    name: shipEnergy.toString() ,
		    encodedValue: ['shipsstatse', shipEnergy.toString()].join(this.delimiter)

                }

		];
	    this.addActions(actions, {id:'shipsstatse', type: 'system'});
	actions = [
		{
		    id: 'shipsstatscritical',
                    description: 'Ship Critical Damage Roll',
		    name: 'Roll Critical Damage' ,
		    encodedValue: ['shipsstatscritical', 'Ship Critical Damage'].join(this.delimiter)


        }];
	    this.addActions(actions, {id:'shipsstatscritical', type: 'system'});





        }


     _getShipDetails() {
	 // Loading  ship modules into the list.
            let shipModules= this.actor.items.filter(map => map.type ==='shipModule');
	    let shipModulesNoWeapons = shipModules.filter(map => map.system.category !== 'weapon');
            let actions = shipModulesNoWeapons.map(i => {
                return{
                    id: i._id, 
                    name: i.name, 
		    description: i.system.description,
                    encodedValue: ['shipModule', i.name, i.system.description].join(this.delimiter),
                    img: i.img
                    }
                    }
                    );
        
            //console.log('Modules, actions');
	    //console.log(actions);
            this.addActions(actions, {id:'shipModule', type: 'system'});

	 // Loading  ship modules into the list.
            let shipWeapons= shipModules.filter(map => map.system.category === 'weapon');
            actions = shipWeapons.map(i => {
                return{
                    id: i._id, 
                    name: i.name, 
		            description: i.system.description,
                    encodedValue: ['shipWeapon', i.name, i.system.description, i.system.damage,i.system.damageText, i.system.bonus, i.system.range].join(this.delimiter),
                    img: i.img,
                    damage: i.system.damage,
                    damateText: i.system.damageText,
                    bonus: i.system.bonus,
                    range: i.system.range
                    }
                    }
                    );
	
            //console.log('Weapons, actions');
	    //console.log(actions);
            this.addActions(actions, {id:'shipWeapon', type: 'system'});

	    let shipProblems = this.actor._source.items.filter(map => map.type ==='shipProblem');
		actions = shipProblems.map(i => {
                return{
                    id: i._id, 
                    name: i.name, 
		    description: i.system.description,
                    encodedValue: ['shipProblem', i.name, i.system.description].join(this.delimiter),
                    img: i.img                    }
                    }
                    );
	    //console.log(actions);

	    this.addActions(actions, {id:'shipProblem', type: 'system'});


	    let shipFeatures = this.actor._source.items.filter(map => map.type ==='shipFeature');
		actions = shipFeatures.map(i => {
                return{
                    id: i._id, 
                    name: i.name, 
		    description: i.system.description,
                    encodedValue: ['shipFeature', i.name, i.system.description].join(this.delimiter),
                    img: i.img                    }
                    }
                    );
	    //console.log(actions);

	    this.addActions(actions, {id:'shipFeature', type: 'system'});

	    let shipDamage = this.actor._source.items.filter(map => map.type ==='shipCriticalDamage');
		actions = shipDamage.map(i => {
                return{
                    id: i._id, 
                    name: i.name, 
		    description: i.system.description,
                    encodedValue: ['shipDamage', i.name, i.system.description].join(this.delimiter),
                    img: i.img                    }
                    }
                    );
	    //console.log(actions);

	    this.addActions(actions, {id:'shipsstatscritical', type: 'system'});



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
                    encodedValue: [ACTION_ADVANCED, key, ''].join(this.delimiter)
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
	            actorId: this.actor.id,
                    name: i.name, 
			description: i.system.description,
                    encodedValue: [ACTION_WEAPON, this.actor.id, i._id,i.name ,i.system.damage,i.system.damageText, i.system.bonus, i.system.range].join(this.delimiter),
                    img: i.img
                    }
                    }
                    );
            //console.log('weapon action');
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
		actions = [
		{
		    id: 'criticalinjuryroll',
                    description: 'Critical Injury Roll',
		    name: 'Roll Critical Injury' ,
		    encodedValue: ['criticalinjuryroll', 'Ship Critical Injury'].join(this.delimiter)


        }];
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
        handleActionClick(event, encodedValue) {
            let payload = encodedValue.split("|");
            console.log(payload);
            if (payload.length < 2) {
            super.throwInvalidValueErr();
            }
        
            const macroType = payload[0];
            const actionId = payload[1];
            const description = payload[2];
			console.log(payload);
			
            if (this.isRenderItem()) {
                this.doRenderItem(this.actor, actionId);
                return;
            }
            let rData = [];    
            switch (macroType) {
		case ACTION_WEAPON:
                // item-roll
                //console.log('action weapon actor');
		//console.log(payload[1]);

                //game.yzecoriolis.rollItemMacro(actionId);
		rollActorMacro('rangedCombat','actorWeapon', payload[1], payload[2], payload[3], payload[4], payload[5], payload[6],  payload[7], payload[8], payload[9]  );
		break;
	    case 'captain':
           rollActorMacro('command','advanced', actionId );
           break;

	    case 'pilotsManeuver':
	        rollActorMacro('pilot','pilotsManeuver', payload[1], payload[2], payload[3], payload[4], payload[5], payload[6],  payload[7], payload[8], payload[9]  );

	    break;

        case 'shipinitiative':
            shipInitiative( actionId, payload[2] );
            // SERVICE!
            break;

        case 'shipweaponroll':
		console.log(payload);

            rollActorMacro('rangedCombat','shipWeapon', payload[1], payload[2], payload[3], payload[4], payload[5], payload[6],  payload[7], payload[8], payload[9]  );
            break;
        case 'meme':
            rollActorMacro('DataDjinn','meme', actionId, payload[2] );
            break;
    
     	case 'engineer':
		    rollActorMacro('technology', 'advanced',actionId  );
		    //console.log('engisss');
		    break;
	    case 'sensorOperator':
		    rollActorMacro('dataDjinn','advanced', actionId );
		    //console.log('sensoropssss');
		    break;
	    case 'pilot':
		    rollActorMacro( 'pilot', 'advanced', actionId );
		    //console.log('pilotsss');
		    break;
	    case 'gunner':
		    rollActorMacro(  'rangedCombat', 'general', actionId );
		//    console.log('phewphew');
		    break;

            case ACTION_ARMOR:
                // item-roll
                game.yzecoriolis.rollItemMacro(actionId);
                break;  	
	    case ACTION_GEAR:
			// item-display 
			this._chatItem('<h2>Gear: '+actionId+'</h2>'+'<b>Equiped:</b> '+payload[3]+', <b>Quantity: </b>'+payload[4]+'<br>'+description);
                break;  	
	    case ACTION_TALENT:
			// item-display 
			this._chatItem('<h2>Talent: '+actionId+'</h2>'+'<b>'+payload[3]+'</b><br>'+description);
                break;  					
	    case ACTION_INJURY:
			// item-display 
			this._chatItem('<h2>Injury: '+actionId+'</h2>'+'<b>Fatal:</b> '+payload[3]+', <b>Healing time:</b>'+payload[4]+'<br>' +description);
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

	    case 'shipFeature':
			// item-display 
			this._chatItem('<h2>Feature: '+actionId+'</h2>'+description);
			break;
	    case 'shipDamage':
			// item-display 
			this._chatItem('<h2>Damage: '+actionId+'</h2>'+description);
			break;


	    case 'shipProblem':
			// item-display 
			this._chatItem('<h2>Problem: '+actionId+'</h2>'+description);
		break;
	    case 'shipsstatsa':
			//this._chatItem('<h2>Ship Armor: '+payload[2]+'</h2>');
            rollActorMacro(actionId, 'armor',payload[1],payload[2]);
			//SERVICE HUDroll(actionId,'armorRoll');

		break;
	    case 'shipsstatse':
			// item-display 
			this._chatItem('<h2>Energy Points total: '+actionId+'</h2>');
		break;
	    case 'shipsstatsh':
			this._chatItem('<h2>Hull Points left: '+actionId+'</h2>');
		break;
	    case 'shipsstatscritical':
			//this._chatItem('<h2>Hull Points left: '+actionId+'</h2>');
			var table = game.tables.find(t => t.name === "Table 7.16 Critical Ship Damage");
			table.draw({roll: true, displayChat: true});
		break;
	    case 'criticalinjuryroll':
			var table = game.tables.find(t => t.name === "Table 5.6 Critical Injuries");
			table.draw({roll: true, displayChat: true});
		break;


	    case 'shipModule':
			// item-display 
			this._chatItem('<h2>Module: '+actionId+'</h2><b>'+description);

		break;
	    case 'shipWeapon':
			this._chatItem('<h2>Weapon: '+payload[1]+'</h2><b> Skill Bonus: '+payload[5]+'</b><b> Damage: '+payload[3] + ' ' + payload[4]+'</b><b> Range: '+payload[6]+'</b>'+payload[2]);

		break;

            }
		//console.log(payload);
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
        

    
      
       //token_action_hud addition
 	function shipInitiative(actorIdcrew, shipTokenId)
	{
		var actorData =game.actors.filter(a=>  a.id == actorIdcrew)[0];

		var dicePool = actorData.system.attributes['empathy'].value + actorData.system.skills['command'].value;
		var arrayResult=[];
		for(let  i =0 ;i< dicePool;i++)
			{	
				var dice = Math.floor( Math.random() * 6 );
				arrayResult.push(dice);
			};
		//console.log(arrayResult);
		var maxResult = Math.max.apply(null,arrayResult);
		//console.log(maxResult);
		var countMaxResult = 0;

          	for(let  i =0 ;i< dicePool;i++)
          	{
			if (arrayResult[i]===maxResult)countMaxResult++;
            
          	};
		var inititativeScore = maxResult+'.'+countMaxResult;
		
		if( game.combat == null || game.combat.combatants._source.length== 0)
			{
				ui.notifications.info("Add token to combat first");
			}
			else
			{
				var combatantId = game.combat.combatants.find (i=>i._source.tokenId === shipTokenId)._id;
	
				if (combatantId == null)
					{cosole.log("combatant null");}
				else
					{
						let initiative = [{
            					_id: combatantId ,
            					initiative: inititativeScore 
        					}];
    		
    						game.combat.updateEmbeddedDocuments("Combatant", initiative);	
					}
		}
	}


 function HUDroll(skillName,inputRollType, actorData, itemData, title, damage, crit, range, features, damageText, critText) {
    //const item = this.actor.system.attributes.wits: null;
	console.log('HUDroll details');
	console.log(skillName);
	console.log(inputRollType);
	console.log(actorData);
	console.log(itemData);
	console.log(title);
	var bonusRoll = itemData;
    	if(inputRollType==='shipsstatsa')
    	inputRollType='armor';
	const actor = actorData;
	let attributeForSkill= 'wits';
	//console.log(skillName);
	//console.log(inputRollType);
	switch (skillName){
					  case 'technology' :
					  case 'dataDjinn' :
					  case 'science' :
					  case 'medicurgy' :
					  case 'observation' :
					  case 'survival' :
					  attributeForSkill= 'wits';
					  break;
					  case 'manipulation' :
					  case 'command' : 
					  case 'mysticPowers' :
					  case 'culture' :
					  attributeForSkill= 'empathy';
					  break;
					  case 'dexterity' :
					  case 'infiltration' :
					  case 'rangedCombat' :
					  case 'pilot' :
					  attributeForSkill= 'agility';
					  break;
					  case 'meleeCombat' :
					  case 'force' :
					  attributeForSkill= 'strength';
					  break;
					}
	let rollData;
	
	switch (inputRollType) {
			case 'attribute':
                rollData = {
				  actorType: actorData.type,
				  rollType: inputRollType,
				  attributeKey: skillName,
				  attribute: actorData.system.attributes[skillName].value, 
				  modifier: 0,
				  bonus: bonusRoll,
				  rollTitle: game.i18n.localize(`YZECORIOLIS.Attr${skillName.capitalize()}`)+' Roll', 
				  pushed: false
				};
				break;
			
			case 'general' :
			case 'advanced' :
                rollData = {

				  actorType: actorData.type,
				  rollType: inputRollType,
				  attributeKey: attributeForSkill,
				  attribute: actorData.system.attributes[attributeForSkill].value, 
			      skillKey: skillName.toLowerCase(),
			      skill: actorData.system.skills[skillName.toLowerCase()].value,//dataset.skillkey ? actorData.skills[dataset.skillkey].value : 0,
				  modifier: 0,
				  bonus: bonusRoll,
				  rollTitle: game.i18n.localize(`YZECORIOLIS.Skill${skillName.capitalize()}`)+' Roll', //import nice name
				  pushed: false
				  //features: item?.special ? Object.values(item.special).join(", ") : "",
				};
			break;
			case 'armorRoll':
            	case 'armor':
		console.log("armor roll "+ bonusRoll);
			//actorData=this.actor;
			rollData = {
				actorType: 'npc',
				rollType: 'armor',
				bonus: Number(bonusRoll),
                               features: 'Core Rules',
                rollTitle: 'Armor Roll'
				};
			console.log(rollData );
			break;
            case 'meme':
                rollData = {
                    actorType: 'npc',
                    rollType: 'weapon',
                    bonus: bonusRoll,
                    modifier: 0,
                    attributeKey: 'wits',
                    attribute: actorData.system.attributes['wits'].value, 
                    skillKey: 'dataDjinn',
                    skill: actorData.system.skills['datadjinn'].value,
                    features: 'Core Rules',
                    rollTitle: 'Data Meme',
                    damage: 0,
                    damageText: 'Ship module',
                    crit: 0,
                    critText: '',
                    range: 'long'
                    };
                break;
	    case 'pilotsManeuver':
		var bonusRoll = Number(title);
		rollData = {
                    actorType: 'npc',
                    rollType: 'weapon',
                    bonus: bonusRoll ,
                    modifier: 0,
                    attributeKey: 'agility',
                    attribute: actorData.system.attributes['agility'].value, 
                    skillKey: 'pilot',
                    skill: actorData.system.skills['pilot'].value,
                    rollTitle: 'Ship pilots roll'
                    };

		break;
            case 'shipWeapon':
		 var bonusRoll = Number(itemData);
			//actorData=this.actor;
                rollData = {
                    actorType: 'npc',
                    rollType: 'weapon',
                    bonus: bonusRoll,
                    modifier: 0,
                    attributeKey: 'agility',
                    attribute: actorData.system.attributes['agility'].value, 
                    skillKey: 'rangedCombat',
                    skill: actorData.system.skills['rangedcombat'].value,
                    features: features,
                    rollTitle: title,
                    damage: damage,
                    damageText: damageText,
                    crit: Number(crit),
                    critText: critText,
                    range: range
                    };
                break;
	    case 'actorWeapon':
		 var bonusRoll = Number(itemData);
	         //actorData=this.actor;
		
		console.log('actor weapon roll data');
		var actorWeapons = actorData.items.filter(i => i.id === itemData);
		var actorWeapon= actorWeapons[0];
		var rollAttribute = 'strength';
		var rollAttributeValue = actorData.system.attributes['strength'].value;
		var rollSkill = 'meleecombat';
		var rollSkillValue = actorData.system.skills['meleecombat'].value;
		//ranged weapons
		if ( actorWeapon.system.melee === false)
			{
				rollAttribute = 'agility';
				rollAttributeValue = actorData.system.attributes['agility'].value;
				rollSkill = 'rangedcombat';
				rollSkillValue = actorData.system.skills['rangedcombat'].value;
			}
		//Veterans of third horizon
		//has Black Lotus Dance talent
		var actorHasBlackLotusDanceTalent = actorData.items.filter(i => i.name === 'Black Lotus Dancer');
				if ( (actorWeapon.name === 'Hand fan (Ahlam)' || actorWeapon.name === 'Unarmed')&&actorHasBlackLotusDanceTalent.length >=1)
			{
				rollAttribute = 'agility';
				rollAttributeValue = actorData.system.attributes['agility'].value;
			}
                rollData = {
                    actorType: 'npc',
                    rollType: 'weapon',
                    bonus: actorWeapon.system.bonus,
                    modifier: 0,
		    attributeKey: rollAttribute ,
                    attribute: rollAttributeValue , 
		    skillKey: rollSkill,
                    skill: rollSkillValue,
                    features: Object.values(actorWeapon.system.special),
                    rollTitle: actorWeapon.name,
                    damage: actorWeapon.system.damage,
                    damageText: actorWeapon.system.damageText,
                    crit: actorWeapon.system.crit.numericValue,
                    critText: actorWeapon.system.crit.customValue,
                    range: actorWeapon.system.range
                    };
		console.log(rollData);
                break;

			//title, damage, crit, range
	}
	
    const chatOptions = actor._prepareChatRollOptions(
      "systems/yzecoriolis/templates/sidebar/roll.html",
     inputRollType
    );
   // console.log(rollData);
    coriolisModifierDialog((modifier, additionalData) => {
      rollData.modifier = modifier;
      rollData.additionalData = additionalData;
      coriolisRoll(chatOptions, rollData);
    }, false);
    
  }

      function rollActorMacro(rollName, rollType, actorIdcrew, itemId, title, damage, crit, range, features, damageText, critText) {
  		const speaker = ChatMessage.getSpeaker();
  		let actor;
  		if (speaker.token) actor = game.actors.tokens[speaker.token];
  		if (!actor) actor = game.actors.get(speaker.actor);
  		if (!actor) {
    			return ui.notifications.warn(game.i18n.localize("YZECORIOLIS.ErrorsNoActorSelectedForMacro"));
  			}
		if (typeof actorIdcrew !== "undefined") {
			actor=game.actors.filter(a=>  a.id == actorIdcrew)[0];
		}
//	console.log('actor id');
//	console.log(actor);
//	console.log(actorIdcrew);
        if(itemId)
        {
            return HUDroll(rollName, rollType, actor,itemId, title, damage, crit, range, features, damageText, critText);
        }
        else
        {return HUDroll(rollName, rollType, actor);};

        
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
                        nestId: 'crew',
                        id:     'crew',
                        name:   'Crew',
                        type:   'system',
                        groups: [
                            {
                                nestId: 'crew_crew',
                                id:     'crew',
                                name:   'Crew' ,
                                type:   'system'
                            },
 			    {
                                nestId: 'crew_captain',
                                id:     'captain',
                                name:   'Captain' ,
                                type:   'system'
                            },
 			    {
                                nestId: 'crew_engieneer',
                                id:     'engineer',
                                name:   'Engineer' ,
                                type:   'system'
                            },
 			    {
                                nestId: 'crew_pilot',
                                id:     'pilot',
                                name:   'Pilot' ,
                                type:   'system'
                            },
 			    {
                                nestId: 'crew_sensorOperator',
                                id:     'sensorOperator',
                                name:   'Sensor Operator' ,
                                type:   'system'
                            },
 			    {
                                nestId: 'crew_gunner',
                                id:     'gunner',
                                name:   'Gunner' ,
                                type:   'system'
                            }



                        ]
                    },                      
			{ 
                        nestId: 'shipsstats',
                        id:     'shipsstats',
                        name:   'Ship',
                        type:   'system',
                        groups: [
                            {
                                nestId: 'shipsstats_critical',
                                id:     'shipsstatscritical',
                                name:   'Ship Critical Damage' ,
                                type:   'system'
                            },
                            {
                                nestId: 'shipsstats_hull',
                                id:     'shipsstatsh',
                                name:   'Ship Hull' ,
                                type:   'system'
                            },
                            {
                                nestId: 'shipsstats_armor',
                                id:     'shipsstatsa',
                                name:   'Ship Armor' ,
                                type:   'system'
                            },
                            {
                                nestId: 'shipsstats_energy',
                                id:     'shipsstatse',
                                name:   'Ship Energy' ,
                                type:   'system'
                            }


                        ]
                    }, 
		    { 
                        nestId: 'shipModules',
                        id:     'shipModules',
                        name:   'Ship Modules',
                        type:   'system',
                        groups: [
                            {
                                nestId: 'shipModules_weapon',
                                id:     'shipWeapon',
                                name:   'Ship Weapons' ,
                                type:   'system',
                            },
                            {
                                nestId: 'shipModules_modules',
                                id:     'shipModule',
                                name:   'Ship Modules' ,
                                type:   'system'
                            }

			]
		},
		{	
			nestId: 'shipFeatures',
                        id:     'shipFeatures',
                        name:   'Ship Features',
                        type:   'system',
                        groups: [
                            {
                                nestId: 'shipFeatures_Feature',
                                id:     'shipFeature',
                                name:   'Ship Features' ,
                                type:   'system'
                            },
                            {
                                nestId: 'shipFeatures_Problem',
                                id:     'shipProblem',
                                name:   'Ship Problem' ,
                                type:   'system'
                            }/*,

                            {
                                nestId: 'shipFeatures_Damage',
                                id:     'shipDamage',
                                name:   'Ship Damage' ,
                                type:   'system'
                            }*/

			]
		},


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
		    { id: 'crew', name: 'Crew', type: 'system', hasDerivedSubcategories: true },
		    { id: 'shipModules', name: 'Ship Modules', type: 'system', hasDerivedSubcategories: true },
		    { id: 'shipFeatures', name: 'Ship Features', type: 'system', hasDerivedSubcategories: true },
		    { id: 'shipstats', name: 'Ship Stats', type: 'system', hasDerivedSubcategories: true },
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
        requiredCoreModuleVersion: '1.5',
        SystemManager: CoriolisSystemManager
    }    
     Hooks.call('tokenActionHudSystemReady', module)
});


