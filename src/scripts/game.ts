import 'phaser';

import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import UtilsPlugin from './plugins/utilsPlugin';
import StorePlugin from './plugins/storePlugin';
import TranslatePlugin from './plugins/translatePlugin';

// import PreloadStartScreen from './scenes/startScreen/preload';
import StartScreen from './scenes/startScreen/scene';
import PreloadTutorials from './scenes/tutorials/preload';
import Tutorials from './scenes/tutorials/scene';
import PreloadLevel1 from './scenes/level1/preload';
import Level1 from './scenes/level1/scene';
import PreloadLevel2 from './scenes/level2/preload';
import Level2 from './scenes/level2/scene';
import PreloadLevel3 from './scenes/level3/preload';
import Level3 from './scenes/level3/scene';
import PreloadLevel4 from './scenes/level4/preload';
import Level4 from './scenes/level4/scene';

const DEFAULT_WIDTH = 608;
const DEFAULT_HEIGHT = 352;

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	backgroundColor: '#000',
	antialias: false,
	scale: {
		parent: 'phaser-game',
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.Center.CENTER_VERTICALLY,
		width: DEFAULT_WIDTH,
		height: DEFAULT_HEIGHT,
	},
	scene: [
		// PreloadStartScreen,
		StartScreen,
		PreloadTutorials,
		Tutorials,
		PreloadLevel1,
		Level1,
		PreloadLevel2,
		Level2,
		PreloadLevel3,
		Level3,
		PreloadLevel4,
		Level4,
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
