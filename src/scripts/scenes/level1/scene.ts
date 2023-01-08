import BaseLevel from '../baseLevel';
import { SceneKey } from '../../types';

export default class Scene extends BaseLevel {
	constructor() {
		super(SceneKey.Level1, SceneKey.PreloadLevel2, 'level1');
	}

	create() {
		super.create();
	}

	update(time: number, delta: number) {
		super.update(time, delta);
	}
}