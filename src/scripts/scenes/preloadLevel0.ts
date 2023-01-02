import BasePreloadLevel from './basePreloadLevel';
import { SceneKey } from './index';
export default class PreloadLevel0 extends BasePreloadLevel {
	constructor() {
		super(SceneKey.PreloadLevel0, SceneKey.Level0, 'level0');
	}

	preload() {
		super.preload();
	}

	create() {
		super.create();
	}
}
