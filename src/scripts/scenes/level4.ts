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


		this.addDialog(0,
			`Eh bien détective, vous faites un fabuleux sujet d'expér... heu... je voulais dire un fabuleux représentant de la justice !
Le téléporteur rouge en face de vous va vous envoyer de l'autre côté du second téléporteur rouge.
...
...
Gare aux paradoxes !`
		);
		
	}

	update() {
		super.update();

		this.checkForSpatialTeleportersActivation();

		this.checkForDoubleSwitcherActivation();
	}
}