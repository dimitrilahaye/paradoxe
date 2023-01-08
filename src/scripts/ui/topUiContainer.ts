import ExitButton from './exitButton';
import FxButton from './fxButton';
import MusicButton from './musicButton';
import ResetButton from './resetButton';
import Score from './score';

export default class TopUiContainer {
	constructor(scene: Phaser.Scene) {
		new ExitButton(scene, 30, 30);
		new ResetButton(scene, 80, 30);
		new MusicButton(scene, 130, 30);
		new FxButton(scene, 180, 30);
		new Score(scene, 280, 64);
	}
}