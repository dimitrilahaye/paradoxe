import { SceneKey } from './index';
export default abstract class BasePreloadLevel extends Phaser.Scene {
	constructor(key: SceneKey, protected nextScene: SceneKey, protected tilesetKey: string) {
		super({ key });
	}

	preload() {
		this.load.scenePlugin({
			key: 'rexUI',
			sceneKey: 'rexUI'
		});
		this.load.image('nextPage', 'assets/img/ui/arrow-down-left.png');
		this.load.image('dialogEnd', 'assets/img/ui/cancel.png');
 
		this.load.audio('death', 'assets/sounds/death.wav');
		this.load.audio('door_tp', 'assets/sounds/door_tp.wav');
		this.load.audio('simple_gun_shot', 'assets/sounds/simple_gun_shot.wav');
		this.load.audio('levels', 'assets/sounds/levels.wav');
		this.load.audio('tp', 'assets/sounds/tp.wav');
		this.load.audio('walk', 'assets/sounds/walk.wav');
		this.load.audio('switcher', 'assets/sounds/switcher.wav');
		this.load.audio('door_open', 'assets/sounds/door_open.wav');
		this.load.audio('door_close', 'assets/sounds/door_close.wav');
		this.load.audio('end_level', 'assets/sounds/end_level.wav');

		this.load.image('tileset', 'assets/img/tileset.png');
		this.load.image('door_start', 'assets/img/objects/door_start.png');
		this.load.image('door_end_open', 'assets/img/objects/door_end_open.png');
		this.load.image('door_end_close', 'assets/img/objects/door_end_close.png');
		this.load.image('door_tp', 'assets/img/objects/door_tp.png');
		this.load.image('bullet', 'assets/img/objects/bullet.png');
		this.load.image('tp_red', 'assets/img/objects/tp_red.png');
		this.load.image('switcher_red', 'assets/img/objects/switcher_red.png');
		this.load.image('tp_green', 'assets/img/objects/tp_green.png');
		this.load.image('switcher_green', 'assets/img/objects/switcher_green.png');
		
		this.load.tilemapTiledJSON(this.tilesetKey, `assets/json/levels/${this.tilesetKey}.json`);
		
		this.load.atlas(
			'player',
			'assets/img/chars/player_atlas.png',
			'assets/json/chars/player_atlas.json',
		);
		this.load.atlas(
			'simple_bullet',
			'assets/img/objects/simple_bullet_atlas.png',
			'assets/json/objects/simple_bullet_atlas.json',
		);
		this.load.atlas(
			'simple_gun_shot',
			'assets/img/particles/simple_gun_shot.png',
			'assets/json/particles/simple_gun_shot.json',
		);
	}

	create() {
		this.scene.start(this.nextScene);
	}
}
