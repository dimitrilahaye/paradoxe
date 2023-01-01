/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Coordinates } from './../types';
import { LayerName, ObjectName } from '../objects';
import DoorEntrance from '../objects/doorEntrance';
import DoorExit from '../objects/doorExit';
import EnSwitcher from '../objects/enSwitcher';
import FrSwitcher from '../objects/frSwitcher';
import MusicSwitcher from '../objects/musicSwitcher';
import Player from '../objects/player';
import SoundSwitcher from '../objects/soundSwitcher';
import TutorialsSwitcher from '../objects/tutorialsSwitcher';
import MyTextBox from '../ui/myTextBox';
import { SceneKey } from './index';
import StartNewGame from '../objects/startNewGame';
import ContinueGame from '../objects/continueGame';

export default abstract class StartScreen extends Phaser.Scene {
	protected music: Phaser.Sound.BaseSound;
	protected tilemap: Phaser.Tilemaps.Tilemap;
	protected tileset: Phaser.Tilemaps.Tileset;
	protected tpLayer: Phaser.Tilemaps.TilemapLayer;
	protected bckgLayer: Phaser.Tilemaps.TilemapLayer;
	protected groundLayer: Phaser.Tilemaps.TilemapLayer;
	protected wallLayer: Phaser.Tilemaps.TilemapLayer;
	protected wall2Layer: Phaser.Tilemaps.TilemapLayer;
	protected desksLayer: Phaser.Tilemaps.TilemapLayer;
	protected platformsLayer: Phaser.Tilemaps.TilemapLayer;
	protected ceilingLayer: Phaser.Tilemaps.TilemapLayer;
	protected lightsLayer: Phaser.Tilemaps.TilemapLayer;
	protected titleLayer: Phaser.Tilemaps.TilemapLayer;
	protected start: Phaser.Types.Tilemaps.TiledObject;

	protected ballGroup: Phaser.GameObjects.Group;
	
	protected player: Player;
	protected doorEntrance: DoorEntrance;
	protected doorExit: DoorExit;
	protected textBox: MyTextBox;
	protected dialogs = new Map<string, string>();
	protected isDialogLaunched = false;
	private nextActivability = 0;
	private activabilityRate = 500;

	protected nextScene: SceneKey = SceneKey.PreloadLevel1;
	protected tilesetKey = 'tileset';
	private musicSwitcherCoordinates: Coordinates;
	private soundSwitcherCoordinates: Coordinates;
	private frSwitcherCoordinates: Coordinates;
	private enSwitcherCoordinates: Coordinates;
	private tutorialsSwitcherCoordinates: Coordinates;
	private startNewGameCoordinates: Coordinates;
	private continueGameCoordinates: Coordinates;
	private allowsTutorials: boolean;
	private musicHasBeenPlayed: boolean;
	private hasMusic: boolean;
	private continueGameDoor: ContinueGame;
	private hasFx: boolean;

	constructor() {
		super({ key: SceneKey.StartScreen });
	}
	
	create() {
		this.removeEvents();

		this.hasFx = this.store.get<boolean>('fx') ?? true;
		this.hasMusic = this.store.get<boolean>('music') ?? true;
		this.musicHasBeenPlayed = false;
		this.ballGroup = this.add.group();
		
		this.initMap();

		this.buildWhiteSwitchers();

		this.initStartNewGame();
		this.initContinueGame();
		
		this.listenToPlayerEvents();
		this.listenToMyTextBoxEvents();

		this.initPlayer();
		
		this.launchMusic();

		this.addDialog(0, this.translate.get(SceneKey.StartScreen, 0));

		this.listenToStartNewGameEvents();
		this.listenToContinueGameEvents();
		this.initAllowsTutorialsOption();
		this.listenToMusicSwitcherEvents();
		this.listenToTutorialsSwitcherEvents();
		this.listenToFxButtonEvents();
	}

	update() {
		this.player.update();
		this.checkForTutorials();
		this.checkForOptions();

		this.checkStartNewGame();
		this.checkContinueGame();
	}

	private listenToFxButtonEvents() {
		this.events.on('Store::fx', (isOn) => {
			this.hasFx = isOn;
		});
	}

	private listenToStartNewGameEvents() {
		this.events.on('StartNewGame::go', () => {
			if (this.hasFx) {
				this.sound.play('door_tp');
			}
			this.music.stop();
			this.store.set('score', 0);
			this.scene.start(SceneKey.PreloadLevel1);
		});
	}

	private listenToContinueGameEvents() {
		this.events.on('ContinueGame::go', () => {
			const level = this.store.get<SceneKey>('level');
			if (level) {
				if (this.hasFx) {
					this.sound.play('door_tp');
				}
				this.music.stop();
				this.scene.start(level);
			}
		});
	}

	private removeEvents() {
		this.events.off('DoubleSwitcher::activate');
		this.events.off('DoubleTimeTeleporter::activate');
		this.events.off('StartScreen::switchFr');
		this.events.off('StartScreen::switchEn');
		this.events.off('SpatialTeleporter::teleport');
		this.events.off('GreenSpatialTeleporter::activate');
		this.events.off('MultiSwitcher::activate');
		this.events.off('MultiTimeTeleporter::setToOpen');
		this.events.off('PastPlayer::init');
		this.events.off('PastPlayer::isDead');
		this.events.off('Player::isDead');
		this.events.off('Player::shotBullet');
		this.events.off('PastPlayer::shotBullet');
		this.events.off('Player::canDetect');
		this.events.off('RedSpatialTeleporter::activate');
		this.events.off('SimpleSwitcher::activate');
		this.events.off('SimpleTimeTeleporter::activate');
		this.events.off('SoundSwitcher::fx');
		this.events.off('TutorialsSwitcher::tutorials');
		this.events.off('Store::lang');
		this.events.off('Store::music');
		this.events.off('Store::tutorials');
		this.events.off('Store::fx');
		this.events.off('ExitButton::exit');
		this.events.off('MyTextBox::complete');
		this.events.off('ResetButton::reset');
		this.events.off('DoubleSwitcher::activate');
		this.events.off('StartScreen::switchMusic');
		this.events.off('StartScreen::switchFx');
		this.events.off('StartScreen::switchTutorials');
	}

	private initContinueGame() {
		const continueGame = this.findObjectByLayerAndName(LayerName.OPTIONS, 'continue');
		if (continueGame) {
			this.continueGameCoordinates = {
				x: continueGame.x!,
				y: continueGame.y!,
			};
			this.continueGameDoor = new ContinueGame(this, this.continueGameCoordinates.x, this.continueGameCoordinates.y);
		}
	}

	private initStartNewGame() {
		const startNewGame = this.findObjectByLayerAndName(LayerName.OPTIONS, 'start');
		if (startNewGame) {
			this.startNewGameCoordinates = {
				x: startNewGame.x!,
				y: startNewGame.y!,
			};
			new StartNewGame(this, this.startNewGameCoordinates.x, this.startNewGameCoordinates.y);
		}
	}

	private buildWhiteSwitchers() {
		const objects = this.filterObjectsByLayerAndName(LayerName.OPTIONS, 'bool-white');
		if (objects.length > 0) {
			for (const object of objects) {
				const properties = this.getPropertiesAsObject(object);
				switch (properties.name) {
				case 'music':
					this.musicSwitcherCoordinates = {
						x: object.x!,
						y: object.y!,
					};
					new MusicSwitcher(this, object?.x || 0, object?.y || 0);
					break;
				case 'sound':
					this.soundSwitcherCoordinates = {
						x: object.x!,
						y: object.y!,
					};
					new SoundSwitcher(this, object?.x || 0, object?.y || 0);
					break;
				case 'fr':
					this.frSwitcherCoordinates = {
						x: object.x!,
						y: object.y!,
					};
					new FrSwitcher(this, object?.x || 0, object?.y || 0);
					break;
				case 'en':
					this.enSwitcherCoordinates = {
						x: object.x!,
						y: object.y!,
					};
					new EnSwitcher(this, object?.x || 0, object?.y || 0);
					break;
				case 'tutorials':
					this.tutorialsSwitcherCoordinates = {
						x: object.x ?? 0,
						y: object.y ?? 0,
					};
					new TutorialsSwitcher(this, object?.x || 0, object?.y || 0);
					break;
				}
			}
		}
	}

	private checkStartNewGame() {
		if (this.playerIsNearCoordinates(this.startNewGameCoordinates)) {
			if (this.player.enterActivate) {
				if (this.hasFx) {
					this.sound.play('door_tp');
				}
				this.music.stop();
				this.store.set('score', 0);
				this.scene.start(SceneKey.PreloadLevel1);
			}
		}
	}

	private checkContinueGame() {
		const level = this.store.get<SceneKey>('level');
		if (this.playerIsNearCoordinates(this.continueGameCoordinates)) {
			if (this.player.enterActivate) {
				if (this.time.now > this.nextActivability) {
					this.nextActivability = this.time.now + this.activabilityRate;
					if (!this.continueGameDoor.isOpen) {
						if (this.hasFx) {
							this.sound.play('door_close');
						}
					}
					if (level) {
						if (this.hasFx) {
							this.sound.play('door_tp');
						}
						this.music.stop();
						this.scene.start(level);
					}
				}
			}
		}
	}

	private checkForOptions() {
		if (this.playerIsNearCoordinates(this.musicSwitcherCoordinates)) {
			if (this.player.enterActivate) {
				this.events.emit('StartScreen::switchMusic');
			}
		}
		if (this.playerIsNearCoordinates(this.soundSwitcherCoordinates)) {
			if (this.player.enterActivate) {
				this.events.emit('StartScreen::switchFx');
			}
		}
		if (this.playerIsNearCoordinates(this.frSwitcherCoordinates)) {
			if (this.player.enterActivate) {
				this.events.emit('StartScreen::switchFr');
			}
		}
		if (this.playerIsNearCoordinates(this.enSwitcherCoordinates)) {
			if (this.player.enterActivate) {
				this.events.emit('StartScreen::switchEn');
			}
		}
		if (this.playerIsNearCoordinates(this.tutorialsSwitcherCoordinates)) {
			if (this.player.enterActivate) {
				this.events.emit('StartScreen::switchTutorials');
			}
		}
	}

	protected initPlayer() {
		this.start = this.tilemap.findObject(LayerName.PLAYER, obj => obj.name === ObjectName.START);
		this.player = new Player(this, this.start?.x || 0, this.start?.y || 0);
		this.player.create();
		
		this.cameras.main.startFollow(this.player);

		this.physics.add.collider(this.player, [this.groundLayer, this.platformsLayer]);
	}

	protected addDialog(dialogNumber: number, content): void {
		const { x, y } = this.tilemap.findObject('dialogs', obj => obj['properties'][0].value === dialogNumber);
		this.dialogs.set(JSON.stringify({ x, y }), content);
	}

	protected startDialog(content: string) {
		if (!this.isDialogLaunched) {
			const { x, y } = this.getMiddleSceneCoordinates();
			this.textBox = new MyTextBox(this, x, y);
			this.textBox.start(content);
			this.player.pause();
			this.isDialogLaunched = true;
		}
	}

	private listenToPlayerEvents() {
		this.events.on('Player::shotBullet', (ball: Phaser.Physics.Arcade.Sprite) => {
			this.events.emit('StartScreen::firstShotGun');
			this.ballGroup.add(ball);
			
			this.physics.add.collider([this.groundLayer], ball, () => {
				ball.destroy();
			});
		}, this);
	}

	private listenToMyTextBoxEvents() {
		this.events.on('MyTextBox::complete', () => {
			this.isDialogLaunched = false;
			this.time.delayedCall(500, () => {
				this.player.resume();
			});
		}, this);
	}

	private initMap() {
		this.tilemap = this.add.tilemap(this.tilesetKey);
		this.tileset = this.tilemap.addTilesetImage('tileset', 'tileset');
		const titleTileset = this.tilemap.addTilesetImage('title', 'title');

		this.bckgLayer = this.tilemap.createLayer(LayerName.BACKGROUND, this.tileset, 0, 0);
		this.groundLayer = this.tilemap.createLayer(LayerName.GROUND, this.tileset, 0, 0);
		this.wallLayer = this.tilemap.createLayer(LayerName.WALL, this.tileset, 0, 0);
		this.wall2Layer = this.tilemap.createLayer(LayerName.WALL2, this.tileset, 0, 0);
		this.desksLayer = this.tilemap.createLayer(LayerName.DESKS, this.tileset, 0, 0);
		this.platformsLayer = this.tilemap.createLayer(LayerName.PLATFORMS, this.tileset, 0, 0);
		this.ceilingLayer = this.tilemap.createLayer(LayerName.CEILING, this.tileset, 0, 0);
		this.lightsLayer = this.tilemap.createLayer(LayerName.LIGHTS, this.tileset, 0, 0);
		this.tpLayer = this.tilemap.createLayer(LayerName.TP, this.tileset, 0, 0);
		this.titleLayer = this.tilemap.createLayer(LayerName.TITLE, titleTileset, 0, 0);
		
		this.groundLayer.setCollisionByProperty({ collides: true });
		this.platformsLayer.setCollisionByProperty({ collides: true });

		this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
	}

	private playerIsNearCoordinates(coordinates: Coordinates, offset = 10) {
		const dx = coordinates.x - this.player.x;
		const dy = coordinates.y - this.player.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		return Math.abs(distance) < offset;
	}

	private checkForTutorials() {
		if (this.allowsTutorials) {
			this.dialogs.forEach((content, key) => {
				const { x, y } = JSON.parse(key);
				if (!this.isDialogLaunched) {
					if (this.player.x > (x || 0) - 10 && this.player.x < (x || 0) + 10 &&
					this.player.y > (y || 0) - 10 && this.player.y < (y || 0) + 10) {
						this.startDialog(content);
						this.dialogs.delete(key);
					}
				}
			});
		}
	}
	
	private launchMusic() {
		this.music = this.sound.add('levels');
		if (this.hasMusic && !this.music.isPlaying) {
			this.musicHasBeenPlayed = true;
			this.music.play({
				loop: true,
				volume: 0.1,
			});
		}
	}

	private findObjectByLayerAndName(layer: LayerName, name: string): Phaser.Types.Tilemaps.TiledObject {
		const object = this.tilemap.findObject(layer, (obj) => {
			return obj.name === name;
		});
		if (!object) {
			throw new Error(`Object with name ${name} not found in layer ${layer}`);
		}
		return object;
	}

	private filterObjectsByLayerAndName(layer: LayerName, name: string): Phaser.Types.Tilemaps.TiledObject[] {
		const objects = this.tilemap.filterObjects(layer, (obj) => {
			return obj.name === name;
		});
		if (!objects) {
			throw new Error(`Objects with name ${name} not found in layer ${layer}`);
		}
		return objects;
	}

	private getPropertiesAsObject(obj: Phaser.Types.Tilemaps.TiledObject) {
		if (!obj.properties) {
			return null;
		}
		return obj.properties.reduce((o, prop) => {
			return {
				...o,
				[prop.name]: prop.value,
			};
		}, {});
	}

	private listenToMusicSwitcherEvents() {
		this.events.on('Store::music', (isOn) => {
			this.hasMusic = isOn;
			if (!isOn) {
				this.music.pause();
			}
			if (isOn) {
				if (this.musicHasBeenPlayed) {
					this.music.resume();
				}
				if (!this.musicHasBeenPlayed) {
					this.launchMusic();
				}
			}
		});
	}

	private initAllowsTutorialsOption() {
		const allowsTutorials = this.store.get<boolean>('tutorials');
		if (allowsTutorials !== null) {
			this.allowsTutorials = allowsTutorials;
		}
		if (allowsTutorials === null) {
			this.allowsTutorials = true;
		}
	}

	private listenToTutorialsSwitcherEvents() {
		this.events.on('TutorialsSwitcher::tutorials', (isOn) => {
			this.allowsTutorials = isOn;
		});
	}

	private getMiddleSceneCoordinates(): { x: number, y: number } {
		const x = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const y = this.cameras.main.worldView.y + this.cameras.main.height / 2;

		return { x, y };
	}
}
