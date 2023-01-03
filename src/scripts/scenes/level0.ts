/* eslint-disable @typescript-eslint/no-non-null-assertion */
import BaseLevel from './baseLevel';
import { SceneKey } from './index';

// todo: add dialogs
export default class Level0 extends BaseLevel {
	private corpse: Phaser.GameObjects.Sprite;
	private endPlayed = false;

	constructor() {
		super(SceneKey.Level0, SceneKey.PreloadLevel1, 'level0');
	}

	create() {
		super.create();
		this.initPlayer();
	}
	
	update(time: number, delta: number) {
		super.update(time, delta);
	}
}