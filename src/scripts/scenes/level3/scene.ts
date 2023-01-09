import BaseLevel from '../baseLevel';
import { SceneKey } from '../../types';

export default class Scene extends BaseLevel {
	constructor() {
		super(SceneKey.Level3, SceneKey.StartScreen, 'level3');
	}

	create() {
		super.create();
	}

	update(time: number, delta: number) {
		super.update(time, delta);
	}
}