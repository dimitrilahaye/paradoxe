import BaseLevel from './baseLevel';
import { SceneKey } from './index';

export default class Level1 extends BaseLevel {
	constructor() {
		super(SceneKey.Level1, SceneKey.PreloadLevel2, 'level1');
	}

	create() {
		super.create();
		
		this.addDialog(0, this.translate.get(SceneKey.Level1, 0));
		this.addDialog(1, this.translate.get(SceneKey.Level1, 1));

		this.initPlayer();
	}

	update(time: number, delta: number) {
		super.update(time, delta);
	}
}