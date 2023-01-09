import BasePreloadLevel from '../basePreloadLevel';
import { SceneKey } from '../../types';

export default class Preload extends BasePreloadLevel {
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
