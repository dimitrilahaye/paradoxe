import BaseLevel from '../baseLevel';
import { SceneKey } from '../../types';

export default class Scene extends BaseLevel {
	constructor() {
		super(SceneKey.Level2, SceneKey.StartScreen, 'level2');
	}

	create() {
		super.create();
	}

	update(time: number, delta: number) {
		super.update(time, delta);
	}
}