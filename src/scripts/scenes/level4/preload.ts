import BasePreloadLevel from '../basePreloadLevel';
import { SceneKey } from '../../types';

export default class Preload extends BasePreloadLevel {
	constructor() {
		super(SceneKey.PreloadLevel4, SceneKey.Level4, 'level4');
	}

	preload() {
		super.preload();
	}

	create() {
		super.create();
	}
}
