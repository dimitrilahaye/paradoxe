import BasePreloadLevel from './basePreloadLevel';
import { SceneKey } from '../types';

export default class PreloadLevel1 extends BasePreloadLevel {
	constructor() {
		super(SceneKey.PreloadLevel1, SceneKey.Level1, 'level1');
	}

	preload() {
		super.preload();
	}

	create() {
		super.create();
	}
}
