import 'phaser';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import PreloadStartScreen from './scenes/preloadStartScreen';
import StartScreen from './scenes/startScreen';
import UtilsPlugin from './plugins/utilsPlugin';
import StorePlugin from './plugins/storePlugin';
import TranslatePlugin from './plugins/translatePlugin';
import PreloadTutorials from './scenes/preloadTutorials';
import Tutorials from './scenes/tutorials';
import Level1 from './scenes/level1';
import PreloadLevel1 from './scenes/preloadLevel1';

const DEFAULT_WIDTH = 608;
const DEFAULT_HEIGHT = 352;

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
		PreloadStartScreen,
		PreloadTutorials,
		PreloadLevel1,
		Level1,
		StartScreen,
		Tutorials,
	],
	physics: {
		default: 'arcade',
		arcade: {
			debug: false,
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
