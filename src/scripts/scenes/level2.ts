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

		this.addDialog(0,
			`Félicitations détective. Vous faites honneur à votre profession.
Dans cette salle, pour accèder à la sortie veuillez empruntez le portail qui se trouve à l'autre bout de la salle.`
		);
		this.addDialog(1,
			`Une fois positionné, appuyez sur ENTRÉE pour être téléporté sur la plateforme supérieure.
Oui oui, vous avez bien entendu : vous allez être téléporté. Notre laboratoire expérimente les voyages spatiaux, ceux-ci incluant les portails de téléportation.
...
...
N'ayez pas peur, nous savons ce que nous faisons.`
		);

		this.initPlayer();
	}

	update() {
		super.update();

		this.checkForSpatialTeleportersActivation();
	}
}