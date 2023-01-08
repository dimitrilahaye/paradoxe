import BasePreloadLevel from '../basePreloadLevel';
import { SceneKey } from '../../types';

export default class Preload extends BasePreloadLevel {
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
