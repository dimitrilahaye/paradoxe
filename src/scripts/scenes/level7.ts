import BaseLevel from './baseLevel';
import { SceneKey } from './index';

// todo: add dialogs
export default class Level7 extends BaseLevel {
	constructor() {
		super(SceneKey.Level7, SceneKey.PreloadLevel8, 'level7');
	}

	create() {
		super.create();

		this.createDoubleTimeTeleporters();
		this.createDoubleSwitcher();
		this.createMultiTimeTeleporterByNum(0);
		this.createMultiTimeTeleporterByNum(1);
		this.createMultiTimeTeleporterByNum(2);
		
		this.createSimpleTimeTeleporter();
		this.createSimpleSwitcher();
		this.createMultiSwitcherByNum(0);
		this.createMultiSwitcherByNum(1);
		this.createMultiSwitcherByNum(2);
		
		this.createSpatialTeleportersByColorAndNum('green', 0);
		this.createSpatialTeleportersByColorAndNum('green', 1);
		this.createSpatialTeleportersByColorAndNum('red', 0);
		this.createSpatialTeleportersByColorAndNum('red', 1);
		this.initPlayer();
		
		this.initMultiTimeTeleportersObjectsCollidersByNum(0);
		this.initMultiTimeTeleportersObjectsCollidersByNum(1);
		this.initMultiTimeTeleportersObjectsCollidersByNum(2);
		this.initMultiTimeTeleportersWorldColliders();

		this.initSimpleTimeTeleporterWorldColliders();
		this.initSimpleTimeTeleporterObjectsColliders();

		this.initDoubleTimeTeleportersObjectsColliders();
		this.initDoubleTimeTeleportersWorldColliders();
		
		this.closeMultiTimeTeleporters();
		
		this.initMultiTimeTeleportersOpposites();

		this.listenToMultiTimeTeleportersEvents();
		
	}
	
	update(time: number, delta: number) {
		super.update(time, delta);

		this.checkForSpatialTeleportersActivation();

		this.checkForSimpleSwitcherActivation();

		this.checkForDoubleSwitcherActivation();

		this.checkForMultiSwitchersActivation();
	}
}