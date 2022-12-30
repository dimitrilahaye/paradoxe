import BaseLevel from './baseLevel';
import { SceneKey } from './index';

export default class Level3 extends BaseLevel {
	private firstTpTaken = false;
	private firstShotGun = false;
	constructor() {
		super(SceneKey.Level3, SceneKey.PreloadLevel4, 'level3');
	}

	create() {
		super.create();

		this.createSimpleTimeTeleporter();
		this.createSimpleSwitcher();

		this.createSpatialTeleportersByColorAndNum('green', 0);
		this.createSpatialTeleportersByColorAndNum('green', 1);
		
		this.initPlayer();
		
		this.initSimpleTimeTeleporterObjectsColliders();

		this.initSimpleTimeTeleporterWorldColliders();


		this.events.on('BaseLevel::firstTp', () => {
			if (!this.firstTpTaken) {
				this.firstTpTaken = true;
				this.startDialog(this.translate.get(SceneKey.Level3, 0));
			}
		});
		this.events.on('BaseLevel::firstShotGun', () => {
			if (this.firstTpTaken && !this.firstShotGun) {
				this.time.delayedCall(1000, () => {

					this.firstShotGun = true;
					this.startDialog(this.translate.get(SceneKey.Level3, 1));
				});
			}
		});
		this.addDialog(0,this.translate.get(SceneKey.Level3, 2));
	}

	update() {
		super.update();

		this.checkForSpatialTeleportersActivation();

		this.checkForSimpleSwitcherActivation();
	}
}