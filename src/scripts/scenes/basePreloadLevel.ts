import { SceneKey } from './index';
export default abstract class BasePreloadLevel extends Phaser.Scene {
	private key: SceneKey;

	constructor(key: SceneKey, protected nextScene: SceneKey, protected tilesetKey: string) {
		super({ key });
		this.key = key;
	}

	preload() {
		// generic
		const x = 140;
		const y = 240;
		const progressBar = this.add.graphics();
		const progressBox = this.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(x, y, 320, 50);
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;
		const loadingText = this.make.text({
			x: width / 2,
			y: height / 2 - 50,
			text: 'Loading...',
			style: {
				font: '20px Pixels',
				color: '#ffffff'
			}
		});
		loadingText.setOrigin(0.5, 0.5);
		const percentText = this.make.text({
			x: width / 2,
			y: height / 2 - 30,
			text: '0%',
			style: {
				font: '18px Pixels',
				color: '#ffffff'
			}
		});
		percentText.setOrigin(0.5, 0.5);
		const assetText = this.make.text({
			x: width / 2,
			y: height / 2 + 70,
			text: '',
			style: {
				font: '18px Pixels',
				color: '#ffffff'
			}
		});
		assetText.setOrigin(0.5, 0.5);

		this.load.on('progress', (value) => {
			progressBar.clear();
			progressBar.fillStyle(0xffffff, 1);
			progressBar.fillRect(x, y, 300 * value, 30);
			percentText.setText(parseInt(((value as number) * 100).toString()) + '%');
		});
					
		this.load.on('fileprogress', (file: Phaser.Loader.File) => {
			const arr = file.src.split('/');
			const filename = arr[arr.length - 1];
			assetText.setText('Loading asset: ' + filename);
		});
		this.load.on('complete', () => {
			assetText.destroy();
			percentText.destroy();
			loadingText.destroy();
			progressBar.destroy();
			progressBox.destroy();
			this.load.off('progress');
			this.load.off('fileprogress');
			this.load.off('complete');
		});

		this.load.json('translations', 'assets/json/options/translations.json');
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
		this.load.image('door_tp_red', 'assets/img/objects/door_tp_red.png');
		this.load.image('door_tp_green', 'assets/img/objects/door_tp_green.png');
		this.load.image('tp_red', 'assets/img/objects/tp_red.png');
		this.load.image('tp_red_close', 'assets/img/objects/tp_red_close.png');
		this.load.image('tp_orange', 'assets/img/objects/tp_orange.png');
		this.load.image('tp_orange_close', 'assets/img/objects/tp_orange_close.png');
		this.load.image('tp_green', 'assets/img/objects/tp_green.png');
		this.load.image('tp_green_close', 'assets/img/objects/tp_green_close.png');
		this.load.image('switcher_red', 'assets/img/objects/switcher_red.png');
		this.load.image('switcher_green', 'assets/img/objects/switcher_green.png');
		this.load.image('switcher_orange', 'assets/img/objects/switcher_orange.png');
		// levels ui
		this.load.image('reset', 'assets/img/ui/return.png');
		this.load.image('exit', 'assets/img/ui/exit.png');
		this.load.image('audio_on', 'assets/img/ui/audioOn.png');
		this.load.image('audio_off', 'assets/img/ui/audioOff.png');
		this.load.image('music_on', 'assets/img/ui/musicOn.png');
		this.load.image('music_off', 'assets/img/ui/musicOff.png');
		
		this.load.tilemapTiledJSON(this.tilesetKey, `assets/json/levels/${this.tilesetKey}.json`);
		
		this.load.atlas(
			'player',
			'assets/img/chars/player_atlas.png',
			'assets/json/chars/player_atlas.json',
		);
		this.load.atlas(
			'past_player',
			'assets/img/chars/past_player_atlas.png',
			'assets/json/chars/past_player_atlas.json',
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
		this.store.set('level', this.key);
		this.scene.start(this.nextScene);
	}
}
