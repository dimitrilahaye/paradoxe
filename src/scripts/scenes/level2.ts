import BaseLevel from './baseLevel';
import { SceneKey } from './index';

export default class Level2 extends BaseLevel {
	constructor() {
		super(SceneKey.Level2, SceneKey.PreloadLevel3, 'level2');
	}

	create() {
		super.create();

		this.createSpatialTeleportersByColorAndNum('green', 0);
		this.createSpatialTeleportersByColorAndNum('green', 1);

		this.addDialog(0, this.translate.get(SceneKey.Level2, 0));
		this.addDialog(1, this.translate.get(SceneKey.Level2, 1));

		this.initPlayer();
	}

	update() {
		super.update();

		this.checkForSpatialTeleportersActivation();
	}
}