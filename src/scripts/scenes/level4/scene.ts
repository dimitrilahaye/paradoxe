/* eslint-disable @typescript-eslint/no-non-null-assertion */
import BaseLevel from '../baseLevel';
import { LayerName, ObjectName, SceneKey } from '../../types';

export default class Scene extends BaseLevel {
	constructor() {
		super(SceneKey.Level4, SceneKey.StartScreen, 'level4');
	}

	create() {
		super.create();

		this.addDialog(0, this.translate.get(SceneKey.Level4, 0));

		const corpse = this.tilemap.findObject(LayerName.PLAYER, obj => obj.name === ObjectName.CORPSE);
		if (corpse) {
			this.add.sprite(corpse.x!, corpse.y!, 'player', 'death-5');
		}

		this.events.on('MyTextBox::complete', () => {
			alert(this.translate.get(SceneKey.Level4, 1));
		});
	}

	update(time: number, delta: number) {
		super.update(time, delta);
	}
}