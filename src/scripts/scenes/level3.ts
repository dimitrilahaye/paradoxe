import BaseLevel from './baseLevel';
import { SceneKey } from './index';

export default class Level3 extends BaseLevel {
	constructor() {
		super(SceneKey.Level3, SceneKey.PreloadLevel4, 'level3');
	}

	create() {
		super.create();
	}

	update() {
		super.update();
	}
}