import BasePreloadLevel from './basePreloadLevel';
import { SceneKey } from './index';

export default class PreloadTutorials extends BasePreloadLevel {
	constructor() {
		super(SceneKey.PreloadTutorials, SceneKey.Tutorials, 'tutorials');
	}

	preload() {
		super.preload();
	}

	create() {
		super.create();
	}
}
