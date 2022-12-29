import 'phaser';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import PreloadLevel1 from './scenes/preloadLevel1';
import Level1 from './scenes/level1';
import PreloadLevel2 from './scenes/preloadLevel2';
import Level2 from './scenes/level2';
import PreloadLevel3 from './scenes/preloadLevel3';
import Level3 from './scenes/level3';
import PreloadLevel4 from './scenes/preloadLevel4';
import Level4 from './scenes/level4';
import PreloadLevel5 from './scenes/preloadLevel5';
import Level5 from './scenes/level5';
import PreloadLevel6 from './scenes/preloadLevel6';
import Level6 from './scenes/level6';
import PreloadLevel7 from './scenes/preloadLevel7';
import Level7 from './scenes/level7';
import PreloadStartScreen from './scenes/preloadStartScreen';
import StartScreen from './scenes/startScreen';
import StorePlugin from './plugins/store';

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 480;

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	backgroundColor: '#ffffff',
	antialias: false,
	scale: {
		parent: 'phaser-game',
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: DEFAULT_WIDTH,
		height: DEFAULT_HEIGHT,
	},
	scene: [
		PreloadStartScreen, // start screen
		PreloadLevel1, // simple exit door
		PreloadLevel7, // mix all teleporters
		PreloadLevel6, // WIP: multi time teleporters
		PreloadLevel5, // mix simple / double teleporters
		PreloadLevel2, // spatial doors
		PreloadLevel4, // double time teleporters
		PreloadLevel3, // simple time teleporter
		StartScreen,
		Level1,
		Level2,
		Level3,
		Level4,
		Level5,
		Level6,
		Level7,
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
		}]
	},
};

window.addEventListener('load', () => {
	const game = new Phaser.Game(config);
});
