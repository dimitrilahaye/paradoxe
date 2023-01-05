import BaseLevel from './baseLevel';
import { SceneKey } from './index';

export default class Level6 extends BaseLevel {
	constructor() {
		super(SceneKey.Level6, SceneKey.PreloadLevel7, 'level6');
	}

	create() {
		super.create();
		
		// todo: create multi in one function
		// create multi time teleporters
		this.createMultiTimeTeleporterByNum(0);
		this.createMultiTimeTeleporterByNum(1);
		this.createMultiTimeTeleporterByNum(2);

		// init multi switchers
		this.createMultiSwitcherByNum(0);
		this.createMultiSwitcherByNum(1);
		this.createMultiSwitcherByNum(2);
		
		// todo: init spatial teleporters in one function
		// create spatial teleporters
		// this.createSpatialTeleportersByColorAndNum('green', 0);
		// this.createSpatialTeleportersByColorAndNum('green', 1);
		// this.createSpatialTeleportersByColorAndNum('red', 0);
		// this.createSpatialTeleportersByColorAndNum('red', 1);
		this.initPlayer();
		
		// todo: init multi colliders in one function
		// init multi time teleporters colliders
		this.initMultiTimeTeleportersObjectsCollidersByNum(0);
		this.initMultiTimeTeleportersObjectsCollidersByNum(1);
		this.initMultiTimeTeleportersObjectsCollidersByNum(2);
		
		this.initMultiTimeTeleportersWorldColliders();
		
		this.closeMultiTimeTeleporters();
		
		this.initMultiTimeTeleportersOpposites();

		// listen to events
		this.listenToMultiTimeTeleportersEvents();

		this.addDialog(0, this.translate.get(SceneKey.Level6, 0));

		this.addDialog(1, this.translate.get(SceneKey.Level6, 1));
		
	}
	
	update(time: number, delta: number) {
		super.update(time, delta);

		this.checkForSpatialTeleportersActivation();

		this.checkForMultiSwitchersActivation();
	}
}