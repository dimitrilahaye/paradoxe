import BaseLevel from './baseLevel';
import { SceneKey } from './index';

export default class Level1 extends BaseLevel {
	constructor() {
		super(SceneKey.Level1, SceneKey.PreloadLevel2, 'level1');
	}

	create() {
		super.create();
		
		this.addDialog(0,
			`Bonjour détective, merci d'être intervenu aussi rapidement. Le meurtre du professeur Colder est vraiment dramatique.
Pardon, je ne me suis pas présenté : Je suis Bob, l'IA de ce laboratoire. Je vais vous guider jusqu'au lieu du crime, dans la salle 823.
Pour passer d'une salle à l'autre, veuillez vous diriger vers la porte de sortie. C'est aussi simple que ça.`
		);
		this.addDialog(1,
			'Une fois positionné, appuyez sur ENTRÉE pour passer à la salle suivante.'
		);

		this.initPlayer();
	}

	update() {
		super.update();
	}
}