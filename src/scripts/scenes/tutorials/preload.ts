import BasePreloadLevel from '../basePreloadLevel';
import { SceneKey } from '../../types';

export default class Preload extends BasePreloadLevel {
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
