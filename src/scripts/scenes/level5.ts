import BaseLevel from './baseLevel';
import { SceneKey } from './index';

export default class Level5 extends BaseLevel {
	constructor() {
		super(SceneKey.Level5, SceneKey.PreloadLevel6, 'level5');
	}

	create() {
		super.create();

		this.createDoubleTimeTeleporters();
		this.createDoubleSwitcher();

		this.createSimpleTimeTeleporter();
		this.createSimpleSwitcher();

		this.createSpatialTeleportersByColorAndNum('green', 0);
		this.createSpatialTeleportersByColorAndNum('green', 1);

		this.initPlayer();

		this.initSimpleTimeTeleporterWorldColliders();
		this.initSimpleTimeTeleporterObjectsColliders();

		this.initDoubleTimeTeleportersObjectsColliders();
		this.initDoubleTimeTeleportersWorldColliders();

	}

	update(time: number, delta: number) {
		super.update(time, delta);

		this.checkForSpatialTeleportersActivation();

		this.checkForSimpleSwitcherActivation();

		this.checkForDoubleSwitcherActivation();
	}
}