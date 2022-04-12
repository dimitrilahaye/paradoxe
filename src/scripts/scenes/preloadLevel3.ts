import BasePreloadLevel from './basePreloadLevel';
import { SceneKey } from './index';
export default class PreloadLevel3 extends BasePreloadLevel {
	constructor() {
		super(SceneKey.PreloadLevel3, SceneKey.Level3, 'level3');
	}

	preload() {
		super.preload();
	}

	create() {
		super.create();
	}
}
