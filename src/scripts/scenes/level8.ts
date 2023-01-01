/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LayerName, ObjectName } from '../objects';
import BaseLevel from './baseLevel';
import { SceneKey } from './index';

// todo: add dialogs
export default class Level8 extends BaseLevel {
	private corpse: Phaser.GameObjects.Sprite;
	private endPlayed = false;

	constructor() {
		super(SceneKey.Level8, SceneKey.PreloadLevel1, 'level8');
	}

	create() {
		super.create();
		this.initPlayer();
		this.addDialog(0, this.translate.get(SceneKey.Level8, 0));

		const corpse = this.tilemap.findObject(LayerName.PLAYER, obj => obj.name === ObjectName.CORPSE);
		if (corpse) {
			this.corpse = this.add.sprite(corpse.x!, corpse.y!, 'player', 'death-5');
		}

		this.events.on('MyTextBox::complete', () => {
			alert(this.translate.get(SceneKey.Level8, 1));
		}, this);
	}
	
	update() {
		super.update();
		if (this.intersect(this.corpse, this.player) && !this.allowsTutorials && !this.endPlayed) {
			this.endPlayed = true;
			alert(this.translate.get(SceneKey.Level8, 1));
		}
	}
}