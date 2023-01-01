import ExitButton from './exitButton';
import FxButton from './fxButton';
import MusicButton from './musicButton';
import ResetButton from './resetButton';
import Score from './score';

export default class TopUiContainer {
	constructor(scene: Phaser.Scene) {
		new ExitButton(scene, 30, 60);
		new ResetButton(scene, 80, 60);
		new MusicButton(scene, 130, 60);
		new FxButton(scene, 180, 60);
		new Score(scene, 280, 94);
	}
}