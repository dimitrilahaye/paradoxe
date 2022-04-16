import BaseLevel from './baseLevel';
import { SceneKey } from './index';

// TODO: add dialogs
export default class Level6 extends BaseLevel {
	constructor() {
		super(SceneKey.Level6, SceneKey.PreloadLevel1, 'level6');
	}

	create() {
		super.create();
		
		// TODO: create multi in one function
		// create multi time teleporters
		this.createMultiTimeTeleporterByNum(0);
		this.createMultiTimeTeleporterByNum(1);
		this.createMultiTimeTeleporterByNum(2);

		// init multi switchers
		this.createMultiSwitcherByNum(0);
		this.createMultiSwitcherByNum(1);
		this.createMultiSwitcherByNum(2);
		
		// TODO: init spatial teleporters in one function
		// create spatial teleporters
		this.createSpatialTeleportersByColorAndNum('green', 0);
		this.createSpatialTeleportersByColorAndNum('green', 1);
		this.createSpatialTeleportersByColorAndNum('red', 0);
		this.createSpatialTeleportersByColorAndNum('red', 1);
		this.initPlayer();
		
		// TODO: init multi colliders in one function
		// init multi time teleporters colliders
		this.initMultiTimeTeleportersObjectsCollidersByNum(0);
		this.initMultiTimeTeleportersObjectsCollidersByNum(1);
		this.initMultiTimeTeleportersObjectsCollidersByNum(2);
		
		this.initMultiTimeTeleportersWorldColliders();
		
		this.closeMultiTimeTeleporters();
		
		this.initMultiTimeTeleportersOpposites();

		// listen to events
		this.listenToMultiTimeTeleportersEvents();

		this.addDialog(0,
			`Je suis très fier de vous détective ! Vous vous en sortez très bien !
...
...
Mais... je sens que vous êtes un peu en colère. Vous devriez respirer profondément, un cerveau aussi brillant que le vôtre mérite d'être suffisament oxygéné.`
		);

		this.addDialog(1,
			`Vous voyez ces portails orange ?
...
...
Parfait, vous avez une excellente vue.
Si vous activez un des boutons orange, vous désactiverez les autres portails en alternance.
...
...
Bien, vous savez ce qu'ils vous restent à faire pour quitter cette salle.`
		);
		
	}
	
	update() {
		super.update();

		this.checkForSpatialTeleportersActivation();

		this.checkForMultiSwitchersActivation();
	}
}