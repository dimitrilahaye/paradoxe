import BaseLevel from './baseLevel';
import { SceneKey } from './index';

export default class Level4 extends BaseLevel {
	constructor() {
		super(SceneKey.Level4, SceneKey.PreloadLevel5, 'level4');
	}

	create() {
		super.create();

		this.createDoubleTimeTeleporters();

		this.createDoubleSwitcher();

		// create spatial teleporters
		this.createSpatialTeleportersByColorAndNum('green', 0);
		this.createSpatialTeleportersByColorAndNum('green', 1);
		
		this.initPlayer();
		
		this.initDoubleTimeTeleportersObjectsColliders();

		this.initDoubleTimeTeleportersWorldColliders();


		this.addDialog(0, this.translate.get(SceneKey.Level4, 0));
		
	}

	update(time: number, delta: number) {
		super.update(time, delta);

		this.checkForSpatialTeleportersActivation();

		this.checkForDoubleSwitcherActivation();
	}
}