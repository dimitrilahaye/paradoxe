import 'phaser';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import PreloadStartScreen from './scenes/preloadStartScreen';
import StartScreen from './scenes/startScreen';
import UtilsPlugin from './plugins/utilsPlugin';
import StorePlugin from './plugins/storePlugin';
import TranslatePlugin from './plugins/translatePlugin';
import PreloadTutorials from './scenes/preloadTutorials';
import Tutorials from './scenes/tutorials';

const DEFAULT_WIDTH = 700;
const DEFAULT_HEIGHT = 480;

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	backgroundColor: '#000',
	antialias: false,
	scale: {
		parent: 'phaser-game',
		mode: Phaser.Scale.NONE,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: DEFAULT_WIDTH,
		height: DEFAULT_HEIGHT,
	},
	scene: [
		PreloadStartScreen, // start screen
		PreloadTutorials, // tutorials
		StartScreen,
		Tutorials,
	],
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			gravity: { y: 500 },
		},
	},
	plugins: {
		scene: [{
			key: 'rexUI',
			plugin: UIPlugin,
			mapping: 'rexUI',
		}, {
			key: 'store',
			plugin: StorePlugin,
			mapping: 'store',
		}, {
			key: 'translate',
			plugin: TranslatePlugin,
			mapping: 'translate',
		},{
			key: 'utils',
			plugin: UtilsPlugin,
			mapping: 'utils',
		}]
	},
};

window.addEventListener('load', () => {
	const game = new Phaser.Game(config);
});
