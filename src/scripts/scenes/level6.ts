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
		this.createMultiTimeTeleporterByNum(3);
		
		// TODO: init multi colliders in one function
		// init multi time teleporters colliders
		this.initMultiTimeTeleportersObjectsCollidersByNum(0);
		this.initMultiTimeTeleportersObjectsCollidersByNum(1);
		this.initMultiTimeTeleportersObjectsCollidersByNum(2);
		this.initMultiTimeTeleportersObjectsCollidersByNum(3);
		
		this.initMultiTimeTeleportersWorldColliders();
		
		this.closeMultiTimeTeleporters();
		
		this.initMultiTimeTeleportersOpposites();

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

		// listen to events
		this.listenToMultiTimeTeleportersEvents();
	}
	
	update() {
		super.update();

		this.checkForSpatialTeleportersActivation();

		this.checkForMultiSwitchersActivation();
	}
}