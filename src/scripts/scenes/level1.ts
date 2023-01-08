import BaseLevel from './baseLevel';
import { SceneKey } from '../types';

export default class Level1 extends BaseLevel {
	constructor() {
		super(SceneKey.Level1, SceneKey.StartScreen, 'level1');
	}

	create() {
		super.create();
	}

	update(time: number, delta: number) {
		super.update(time, delta);
	}
}