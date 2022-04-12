import BasePreloadLevel from './basePreloadLevel';
import { SceneKey } from './index';
export default class PreloadLevel2 extends BasePreloadLevel {
	constructor() {
		super(SceneKey.PreloadLevel2, SceneKey.Level2, 'level2');
	}

	preload() {
		super.preload();
	}

	create() {
		super.create();
	}
}
