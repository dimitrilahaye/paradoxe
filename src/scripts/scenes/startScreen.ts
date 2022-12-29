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

export default abstract class StartScreen extends Phaser.Scene {
	protected music: Phaser.Sound.BaseSound;
	protected tilemap: Phaser.Tilemaps.Tilemap;
	protected tileset: Phaser.Tilemaps.Tileset;
	protected tpLayer: Phaser.Tilemaps.TilemapLayer;
	protected bckgLayer: Phaser.Tilemaps.TilemapLayer;
	protected groundLayer: Phaser.Tilemaps.TilemapLayer;
	protected optionsLayer: Phaser.Tilemaps.TilemapLayer;
	protected wallLayer: Phaser.Tilemaps.TilemapLayer;
	protected wall2Layer: Phaser.Tilemaps.TilemapLayer;
	protected desksLayer: Phaser.Tilemaps.TilemapLayer;
	protected platformsLayer: Phaser.Tilemaps.TilemapLayer;
	protected ceilingLayer: Phaser.Tilemaps.TilemapLayer;
	protected lightsLayer: Phaser.Tilemaps.TilemapLayer;
	protected titleLayer: Phaser.Tilemaps.TilemapLayer;
	protected start: Phaser.Types.Tilemaps.TiledObject;
	protected end: Phaser.Types.Tilemaps.TiledObject;

	protected ballGroup: Phaser.GameObjects.Group;
	
	protected player: Player;
	protected doorEntrance: DoorEntrance;
	protected doorExit: DoorExit;
	protected textBox: MyTextBox;
	protected dialogs = new Map<string, string>();
	protected isDialogLaunched = false;

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

	constructor() {
		super({ key: SceneKey.StartScreen });
	}
	
	create() {
		this.ballGroup = this.add.group();
		
		this.initMap();

		this.buildWhiteSwitchers();

		this.initStartNewGame();
		this.initContinueGame();
		
		this.listenToPlayerEvents();
		this.listenToMyTextBoxEvents();

		this.initPlayer();
		
		this.launchMusic();

		this.addDialog(0,
			'Bienvenue dans mon super jeu :) Pour activer ou désactiver une option, positionnez-vous devant l\'interrupteur et appuyez sur ENTRÉE.'
		);

		this.initAllowsTutorialsOption();
		this.listenToMusicSwitcherEvents();
		this.listenToTutorialsSwitcherEvents();
	}

	update() {
		this.player.update();
		this.checkForTutorials();
		this.checkForLevelEnd();
		this.checkForOptions();

		this.checkStartNewGame();
		this.checkContinueGame();
	}

	private initContinueGame() {
		const continueGame = this.getObjectByLayerAndName(LayerName.OPTIONS, 'continue');
		if (continueGame) {
			this.continueGameCoordinates = {
				x: continueGame.x!,
				y: continueGame.y!,
			};
			this.add.text(
				Math.round(this.continueGameCoordinates.x),
				Math.round(this.continueGameCoordinates.y - 40),
				'CONTINUE',
				{
					fontFamily: 'Pixels',
					align: 'left',
				}).setScale(1).setFontSize(15).setResolution(10).setOrigin(0.5, 0.5).setColor('blue');
		}
	}

	private initStartNewGame() {
		const startNewGame = this.getObjectByLayerAndName(LayerName.OPTIONS, 'start');
		if (startNewGame) {
			this.startNewGameCoordinates = {
				x: startNewGame.x!,
				y: startNewGame.y!,
			};
			this.add.text(
				Math.round(this.startNewGameCoordinates.x),
				Math.round(this.startNewGameCoordinates.y - 40),
				'NEW GAME',
				{
					fontFamily: 'Pixels',
					align: 'left',
				}).setScale(1).setFontSize(15).setResolution(10).setOrigin(0.5, 0.5).setColor('blue');
		}
	}

	private buildWhiteSwitchers() {
		const objects = this.getObjectsByLayerAndName(LayerName.OPTIONS, 'bool-white');
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
				this.music.stop();
				this.scene.start(SceneKey.PreloadLevel1);
			}
		}
	}

	private checkContinueGame() {
		const level = this.store.get<SceneKey>('level');
		if (level && this.playerIsNearCoordinates(this.continueGameCoordinates)) {
			if (this.player.enterActivate) {
				this.music.stop();
				this.scene.start(level);
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
		this.end = this.tilemap.findObject(LayerName.DOORS, obj => obj.name === ObjectName.END);
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

	private checkForLevelEnd() {
		if (this.player.x > (this.end?.x || 0) - 10 && this.player.x < (this.end?.x || 0) + 10 &&
			this.player.y > (this.end?.y || 0) - 10 && this.player.y < (this.end?.y || 0) + 10) {
			if (this.player.enterActivate) {
				this.sound.play('end_level');
				this.music.stop();
				this.scene.start(this.nextScene);
			}
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
		this.optionsLayer = this.tilemap.createLayer(LayerName.OPTIONS, this.tileset, 0, 0);
		this.tpLayer = this.tilemap.createLayer(LayerName.TP, this.tileset, 0, 0);
		this.titleLayer = this.tilemap.createLayer(LayerName.TITLE, [this.tileset, titleTileset], 0, 0);
		
		this.groundLayer.setCollisionByProperty({ collides: true });
		this.platformsLayer.setCollisionByProperty({ collides: true });

		this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
	}

	private playerIsNearCoordinates(coordinates: Coordinates, offset = 10) {
		return this.player.x > (coordinates.x || 0) - offset && this.player.x < (coordinates.x || 0) + offset &&
			this.player.y > (coordinates.y || 0) - offset && this.player.y < (coordinates.y || 0) + offset;
	}

	private findObjectOnGroupByData<T>(group: Phaser.GameObjects.Group, data: { [key: string]: any }): T | undefined {
		if (group?.getLength() > 0) {
			return group.children.getArray().find((child) => {
				return Object.keys(data).every((d) => child.getData(d) === data[d]);
			}) as unknown as T;
		}
		throw new Error(`Object not found with data ${JSON.stringify(data)}`);
	}

	private iterateOnGroup(group: Phaser.GameObjects.Group, callback: (object, index?: number) => void) {
		if (group?.getLength() > 0) {
			group.children.iterate(callback);
		}
	}

	private intersect(obj1: Phaser.GameObjects.Sprite, obj2: Phaser.GameObjects.Sprite): boolean {
		const RectangleToRectangle = Phaser.Geom.Intersects.RectangleToRectangle;

		return RectangleToRectangle(obj1.getBounds(), obj2.getBounds());
	}

	private getObjectByLayerAndProperties(layer: LayerName, properties: { [key: string]: any }): Phaser.Types.Tilemaps.TiledObject {
		const object = this.tilemap.findObject(layer, (obj) => {
			const objectProperties = this.getPropertiesAsObject(obj as unknown as Phaser.Types.Tilemaps.TiledObject);
			return Object.keys(properties).every((k) => objectProperties[k] === properties[k]);
		});
		if (!object) {
			throw new Error(`Object with properties ${JSON.stringify(properties)} not found in layer ${layer}`);
		}
		return object;
	}

	// todo fix
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
		const musicIsOn = this.store.get('music') ?? true;
		this.music = this.sound.add('levels');
		if (musicIsOn && !this.music.isPlaying) {
			this.music.play({
				loop: true,
				volume: 0.1,
			});
		}
	}

	private getObjectsByLayerAndProperties(layer: LayerName, properties: { [key: string]: any }): Phaser.Types.Tilemaps.TiledObject[] {
		const objects = this.tilemap.filterObjects(layer, (obj) => {
			const objectProperties = this.getPropertiesAsObject(obj as unknown as Phaser.Types.Tilemaps.TiledObject);
			if (!objectProperties) {
				return false;
			}
			return Object.keys(properties).every((k) => objectProperties[k] === properties[k]);
		});
		if (!objects) {
			throw new Error(`Objects with properties ${JSON.stringify(properties)} not found in layer ${layer}`);
		}
		return objects;
	}

	private getObjectByLayerAndName(layer: LayerName, name: string): Phaser.Types.Tilemaps.TiledObject {
		const object = this.tilemap.findObject(layer, (obj) => {
			return obj.name === name;
		});
		if (!object) {
			throw new Error(`Object with name ${name} not found in layer ${layer}`);
		}
		return object;
	}

	private getObjectsByLayerAndName(layer: LayerName, name: string): Phaser.Types.Tilemaps.TiledObject[] {
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
		this.events.on('MusicSwitcher::music', (isOn) => {
			if (!isOn) {
				this.music.stop();
			}
			if (isOn) {
				this.launchMusic();
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
