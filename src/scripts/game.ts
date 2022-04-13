import 'phaser';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import PreloadLevel1 from './scenes/preloadLevel1';
import Level1 from './scenes/level1';
import PreloadLevel2 from './scenes/preloadLevel2';
import Level2 from './scenes/level2';
import Level3 from './scenes/level3';
import PreloadLevel3 from './scenes/preloadLevel3';
import Level4 from './scenes/level4';
import PreloadLevel4 from './scenes/preloadLevel4';

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 480;

const config = {
	type: Phaser.AUTO,
	backgroundColor: '#ffffff',
	scale: {
		parent: 'phaser-game',
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: DEFAULT_WIDTH,
		height: DEFAULT_HEIGHT,
	},
	scene: [
		PreloadLevel3,
		Level3,
		PreloadLevel1,
		Level1,
		PreloadLevel2,
		Level2,
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
			mapping: 'rexUI'
		},]
	},
};

window.addEventListener('load', () => {
	const game = new Phaser.Game(config);
});
