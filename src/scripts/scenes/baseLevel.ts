/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LayerName, ObjectName } from '../objects';
import DoorEntrance from '../objects/doorEntrance';
import DoorExit from '../objects/doorExit';
import DoubleSwitcher from '../objects/doubleSwitcher';
import DoubleTimeTeleporter from '../objects/doubleTimeTeleporter';
import MultiSwitcher from '../objects/multiSwitcher';
import MultiTimeTeleporter from '../objects/multiTimeTeleporter';
import SpatialTeleporter from '../objects/spatialTeleporter';
import PastPlayer from '../objects/pastPlayer';
import Player from '../objects/player';
import SimpleSwitcher from '../objects/simpleSwitcher';
import SimpleTimeTeleporter from '../objects/simpleTimeTeleporter';
import MyTextBox from '../ui/myTextBox';
import TopUiContainer from '../ui/topUiContainer';
import { SceneKey } from './index';

export default abstract class BaseLevel extends Phaser.Scene {
	protected music: Phaser.Sound.BaseSound;
	protected tilemap: Phaser.Tilemaps.Tilemap;
	protected tileset: Phaser.Tilemaps.Tileset;
	protected stairsLayer: Phaser.Tilemaps.TilemapLayer;
	protected bckgLayer: Phaser.Tilemaps.TilemapLayer;
	protected groundLayer: Phaser.Tilemaps.TilemapLayer;
	protected wallLayer: Phaser.Tilemaps.TilemapLayer;
	protected wall2Layer: Phaser.Tilemaps.TilemapLayer;
	protected desksLayer: Phaser.Tilemaps.TilemapLayer;
	protected platformsLayer: Phaser.Tilemaps.TilemapLayer;
	protected ceilingLayer: Phaser.Tilemaps.TilemapLayer;
	protected lightsLayer: Phaser.Tilemaps.TilemapLayer;
	protected start: Phaser.Types.Tilemaps.TiledObject;
	protected end: Phaser.Types.Tilemaps.TiledObject;

	protected pastPlayersGroup: Phaser.GameObjects.Group;
	protected ballGroup: Phaser.GameObjects.Group;
	protected spatialTeleportersGroup: Phaser.GameObjects.Group;
	protected simpleTimeTeleporterGroup: Phaser.GameObjects.Group;
	protected simpleSwitcherGroup: Phaser.GameObjects.Group;
	protected doubleTimeTeleportersGroup: Phaser.GameObjects.Group;
	protected doubleSwitchersGroup: Phaser.GameObjects.Group;
	protected multiTimeTeleportersGroup: Phaser.GameObjects.Group;
	protected multiSwitchersGroup: Phaser.GameObjects.Group;
	
	protected player: Player;
	protected doorEntrance: DoorEntrance;
	protected doorExit: DoorExit;
	protected textBox: MyTextBox;
	protected dialogs = new Map<string, string>();
	protected isDialogLaunched = false;
	protected allowsTutorials: boolean;
	private hasFx: boolean;
	private hasMusic: boolean;
	private key: SceneKey;
	private musicHasBeenPlayed: boolean;
	private nextActivability = 0;
	private activabilityRate = 500;
	private currentScore: number;

	constructor(key: SceneKey, protected nextScene: SceneKey, protected tilesetKey: string) {
		super({ key });
		this.key = key;
	}
	
	create() {
		this.removeEvents();

		this.hasFx = this.store.get<boolean>('fx') ?? true;
		this.hasMusic = this.store.get<boolean>('music') ?? true;
		this.currentScore = this.store.get<number>('score') ?? 0;
		this.musicHasBeenPlayed = false;
		this.ballGroup = this.add.group();
		this.spatialTeleportersGroup = this.add.group();
		this.simpleTimeTeleporterGroup = this.add.group();
		this.simpleSwitcherGroup = this.add.group();
		this.doubleTimeTeleportersGroup = this.add.group();
		this.doubleSwitchersGroup = this.add.group();
		this.multiTimeTeleportersGroup = this.add.group();
		this.multiSwitchersGroup = this.add.group();
		
		this.initMap();
		this.initDoors();
		this.initPastPlayers();

		this.initTopBarUI();
		
		this.listenToPlayerEvents();
		this.listenToPastPlayersEvents();
		this.listenToMyTextBoxEvents();
		this.listenToMultiTimeTeleportersEvents();
		
		this.launchMusic();

		this.initAllowsTutorialsOption();
		this.listenToTutorialsSwitcherEvents();
		this.listenToResetButtonEvents();
		this.listenToExitButtonEvents();
		this.listenToFxButtonEvents();
		this.listenToMusicButtonEvents();
	}

	update(time: number, delta: number) {
		this.player.update();
		this.pastPlayersGroup.preUpdate(time, delta);

		this.checkForTutorials();
		this.checkForLevelEnd();
	}

	// generic levels
	private initTopBarUI() {
		new TopUiContainer(this);
	}

	// generic
	private removeEvents() {
		this.events.off('DoubleSwitcher::activate');
		this.events.off('DoubleTimeTeleporter::activate');
		this.events.off('StartScreen::switchFr');
		this.events.off('StartScreen::switchEn');
		this.events.off('SpatialTeleporter::teleport');
		this.events.off('SpatialTeleporter::activate');
		this.events.off('MultiSwitcher::activate');
		this.events.off('MultiTimeTeleporter::setToOpen');
		this.events.off('TutorialsGame::go');
		this.events.off('StartNewGame::go');
		this.events.off('ContinueGame::go');
		this.events.off('PastPlayer::init');
		this.events.off('PastPlayer::isDead');
		this.events.off('Player::isDead');
		this.events.off('Player::canDetect');
		this.events.off('Player::shotBullet');
		this.events.off('PastPlayer::shotBullet');
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

	// generic
	private listenToMusicButtonEvents() {
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

	// generic
	private listenToFxButtonEvents() {
		this.events.on('Store::fx', (isOn) => {
			this.hasFx = isOn;
		});
	}

	// generic levels
	private listenToResetButtonEvents() {
		this.events.on('ResetButton::reset', () => {
			this.store.set('score', this.currentScore);
			this.music.stop();
			this.scene.start(this.key);
		});
	}

	// generic levels
	private listenToExitButtonEvents() {
		this.events.on('ExitButton::exit', () => {
			this.music.stop();
			this.scene.start(SceneKey.StartScreen);
		});
	}

	// generic
	protected initPlayer() {
		const stairs = this.tilemap.filterObjects(LayerName.STAIRS_DETECTION, obj => obj.name === ObjectName.STAIRS_LINE);
		this.start = this.tilemap.findObject(LayerName.PLAYER, obj => obj.name === ObjectName.START);
		this.end = this.tilemap.findObject(LayerName.PLAYER, obj => obj.name === ObjectName.END);
		this.player = new Player(this, this.start?.x || 0, this.start?.y || 0, stairs);
		this.player.create();
		
		this.cameras.main.startFollow(this.player);
		this.cameras.main.setLerp(0.1, 0.1);

		this.physics.add.collider(this.player, [this.groundLayer, this.platformsLayer]);
		if (this.stairsLayer) {
			this.physics.add.collider(this.player, this.stairsLayer);
		}
	}
	
	// generic levels factories
	protected createSimpleTimeTeleporter() {
		const object = this.utils.findObjectByLayerAndProperties(LayerName.TELEPORTERS_SIMPLE, { num: 0 });
		if (object) {
			const simpleTimeTeleporter = new SimpleTimeTeleporter(this, object?.x || 0, object?.y || 0);
			simpleTimeTeleporter.setData('num', 0);
			this.simpleTimeTeleporterGroup.add(simpleTimeTeleporter);
		}
	}
	
	// generic levels factories
	protected createSimpleSwitcher() {
		const object = this.utils.findObjectByLayerAndProperties(LayerName.SWITCHERS_SIMPLE, { num: 0 });
		if (object) {
			const simpleSwitcher = new SimpleSwitcher(this, object?.x || 0, object?.y || 0);
			simpleSwitcher.setData('num', 0);
			this.simpleSwitcherGroup.add(simpleSwitcher);
		}
	}

	// generic levels factories
	protected createDoubleTimeTeleporters() {
		const doubleTimeTeleporter1Position = this.utils.findObjectByLayerAndProperties(LayerName.TELEPORTERS_DOUBLE, { num: 0 });
		const doubleTimeTeleporter2Position = this.utils.findObjectByLayerAndProperties(LayerName.TELEPORTERS_DOUBLE, { num: 1 });
		if (doubleTimeTeleporter1Position && doubleTimeTeleporter2Position) {
			const doubleTimeTeleporter1 = new DoubleTimeTeleporter(this, doubleTimeTeleporter1Position?.x || 0, doubleTimeTeleporter1Position?.y || 0);
			const doubleTimeTeleporter2 = new DoubleTimeTeleporter(this, doubleTimeTeleporter2Position?.x || 0, doubleTimeTeleporter2Position?.y || 0);
			
			doubleTimeTeleporter1.addOpposite(doubleTimeTeleporter2);
			doubleTimeTeleporter2.addOpposite(doubleTimeTeleporter1);

			this.doubleTimeTeleportersGroup.add(doubleTimeTeleporter1);
			this.doubleTimeTeleportersGroup.add(doubleTimeTeleporter2);
		}
	}

	// generic levels factories
	protected createDoubleSwitcher() {
		const object = this.utils.findObjectByLayerAndProperties(LayerName.SWITCHERS_DOUBLE, { num: 0 });
		if (object) {
			const doubleSwitcher = new DoubleSwitcher(this, object?.x || 0, object?.y || 0);
			this.doubleSwitchersGroup.add(doubleSwitcher);
		}
	}

	// generic levels factories
	protected createMultiTimeTeleporterByNum(num: number): void {
		const object = this.utils.findObjectByLayerAndProperties(LayerName.TELEPORTERS_MULTI, { num });
		if (object) {
			const objectProperties = this.utils.getPropertiesAsObject(object);
			const multiTimeTeleporter = new MultiTimeTeleporter(this, object?.x || 0, object?.y || 0, num);
			multiTimeTeleporter.setData('num', num);
			multiTimeTeleporter.setData('close', objectProperties.close);
			this.multiTimeTeleportersGroup.add(multiTimeTeleporter);
		}
	}

	// generic levels factories
	protected createMultiSwitcherByNum(num: number) {
		const object = this.utils.findObjectByLayerAndProperties(LayerName.SWITCHERS_MULTI, { num });
		if (object) {
			const multiSwitcher = new MultiSwitcher(this, object?.x || 0, object?.y || 0, num);
			this.multiSwitchersGroup.add(multiSwitcher);
		}
	}
	
	protected createSpatialTeleporters() {
		const tpDoors = this.utils.filterObjectsByLayerAndName(LayerName.TELEPORTERS_SPATIAL, 'spatial_door');
		for (const tpDoor of tpDoors) {
			const { num, group, sprite } = this.utils.getPropertiesAsObject(tpDoor);
			const spatialTeleporter = new SpatialTeleporter(this, tpDoor?.x || 0, tpDoor?.y || 0, sprite, group, num);
			this.spatialTeleportersGroup.add(spatialTeleporter);
		}
	}

	// generic levels factories
	protected initSimpleTimeTeleporterWorldColliders(): void {
		this.physics.add.collider(this.simpleTimeTeleporterGroup, [this.groundLayer, this.platformsLayer]);
	}

	// generic levels factories
	protected initDoubleTimeTeleportersWorldColliders(): void {
		this.physics.add.collider(this.doubleTimeTeleportersGroup, [this.groundLayer, this.platformsLayer]);
	}

	// generic levels factories
	protected initMultiTimeTeleportersWorldColliders(): void {
		this.physics.add.collider(this.multiTimeTeleportersGroup, [this.groundLayer, this.platformsLayer]);
	}

	// generic levels factories
	protected closeMultiTimeTeleporters() {
		this.utils.iterateOnGroup(this.multiTimeTeleportersGroup, (teleporter: MultiTimeTeleporter) => {
			if (teleporter.getData('close')) {
				teleporter.setToClose();
			}
		});
	}

	// generic levels factories
	protected initSimpleTimeTeleporterObjectsColliders() {
		const simpleTimeTeleporter = this.utils.findObjectOnGroupByData<SimpleTimeTeleporter>(this.simpleTimeTeleporterGroup, { num: 0 });
		if (simpleTimeTeleporter) {
			const playerCollider = this.physics.add.collider(this.player, this.simpleTimeTeleporterGroup, (_, teleporter) => {
				this.utils.shakeOnTpCollision();
				const t = teleporter as SimpleTimeTeleporter;
				t.activate();
				this.events.emit('BaseLevel::firstTp');

				const dirX = this.player.direction === 'left' ? -20 : +20;
				const pastPlayer = new PastPlayer(this, t.x - dirX, t.y, this.player);
				this.pastPlayersGroup.add(pastPlayer);
			});

			const ballsCollider = this.physics.add.collider(this.simpleTimeTeleporterGroup, this.ballGroup, (_, ball) => {
				ball.destroy();
			});

			this.physics.add.collider(this.simpleTimeTeleporterGroup, this.pastPlayersGroup, (tp, pp) => {
				const currentPastPlayerX = (pp.body.gameObject as PastPlayer).x;
				const currentTpX = (tp.body.gameObject as SimpleTimeTeleporter).x;
				if (currentTpX > currentPastPlayerX) {
					(pp.body.gameObject as PastPlayer).setX(currentPastPlayerX - 20);
				}
				if (currentTpX < currentPastPlayerX) {
					(pp.body.gameObject as PastPlayer).setX(currentPastPlayerX + 20);
				}
			});

			simpleTimeTeleporter.addColliders(playerCollider, ballsCollider);
		}
	}

	// generic levels factories
	protected initMultiTimeTeleportersObjectsCollidersByNum(num: number) {
		const multiTimeTeleporter = this.utils.findObjectOnGroupByData<MultiTimeTeleporter>(this.multiTimeTeleportersGroup, { num });
		if (multiTimeTeleporter) {
			const playerCollider = this.physics.add.collider(this.player, multiTimeTeleporter, (p, tp) => {
				this.utils.shakeOnTpCollision();

				(tp as MultiTimeTeleporter).activate();

				const dirX = (p as Player).direction === 'left' ? -20 : +20;
				const pastPlayer = new PastPlayer(this, (tp as MultiTimeTeleporter).x - dirX, (tp as MultiTimeTeleporter).y, this.player);
				this.pastPlayersGroup.add(pastPlayer);
				
			});

			const ballsCollider = this.physics.add.collider(multiTimeTeleporter, this.ballGroup, (_, ball) => {
				ball.destroy();
			});

			this.physics.add.collider(multiTimeTeleporter, this.pastPlayersGroup, (_, pp) => {
				const currentX = (pp.body.gameObject as PastPlayer).x;
				const dirX = this.player.direction === 'left' ? -20 : +20;
				(pp.body.gameObject as PastPlayer).setX(currentX - dirX);
			});

			multiTimeTeleporter.addColliders(ballsCollider, playerCollider);
		}
	}

	// generic levels factories
	protected initMultiTimeTeleportersOpposites(): void {
		const length = this.multiTimeTeleportersGroup.getLength();
		const indexes = Array.from(Array(length).keys());
		this.utils.iterateOnGroup(this.multiTimeTeleportersGroup, (teleporter: MultiTimeTeleporter) => {
			indexes.forEach((num) => {
				if (num !== teleporter.num) {
					const opposite = this.utils.findObjectOnGroupByData<MultiTimeTeleporter>(this.multiTimeTeleportersGroup, { num });
					if (opposite) {
						teleporter.addOpposites(opposite);
					} else {
						throw new Error(`Unfound MultiTimeTeleporterwith num: ${num}`);
					}
				}
			});
		});
	}

	// generic levels factories
	protected initDoubleTimeTeleportersObjectsColliders() {
		this.utils.iterateOnGroup(this.doubleTimeTeleportersGroup, (teleporter: DoubleTimeTeleporter) => {
			const playerCollider = this.physics.add.collider(this.player, teleporter, () => {
				this.utils.shakeOnTpCollision();

				teleporter.activate();

				const dirX = this.player.direction === 'left' ? -20 : +20;
				const pastPlayer = new PastPlayer(this, teleporter.x - dirX, teleporter.y, this.player);
				this.pastPlayersGroup.add(pastPlayer);
			});

			const ballsCollider = this.physics.add.collider(teleporter, this.ballGroup, (_, ball) => {
				ball.destroy();
			});

			this.physics.add.collider(teleporter, this.pastPlayersGroup, (_, pp) => {
				const currentX = (pp.body.gameObject as PastPlayer).x;
				const dirX = this.player.direction === 'left' ? -20 : +20;
				(pp.body.gameObject as PastPlayer).setX(currentX - dirX);
			});
			
			teleporter.addColliders(ballsCollider, playerCollider);
		});
	}

	// generic levels factories
	protected checkForSpatialTeleportersActivation() {
		this.utils.iterateOnGroup(this.spatialTeleportersGroup, (teleporter: SpatialTeleporter) => {
			if (this.utils.intersectObjects(this.player, teleporter)) {
				if (this.player.enterActivate) {
					teleporter.activate();
				}
			}
		});
	}

	// generic levels factories
	protected checkForSimpleSwitcherActivation() {
		this.utils.iterateOnGroup(this.simpleSwitcherGroup, (switcher: SimpleSwitcher) => {
			if (this.utils.intersectObjects(this.player, switcher)) {
				if (this.player.enterActivate) {
					switcher.activate();
				}
			}
		});
	}

	// generic levels factories
	protected checkForDoubleSwitcherActivation() {
		this.utils.iterateOnGroup(this.doubleSwitchersGroup, (switcher: SimpleSwitcher) => {
			if (this.utils.intersectObjects(this.player, switcher)) {
				if (this.player.enterActivate) {
					switcher.activate();
				}
			}
		});
	}

	// generic levels factories
	protected checkForMultiSwitchersActivation() {
		this.utils.iterateOnGroup(this.multiSwitchersGroup, (switcher: MultiSwitcher) => {
			if (this.utils.intersectObjects(this.player, switcher)) {
				if (this.player.enterActivate) {
					switcher.activate();
				}
			}
		});
	}

	// generic levels factories
	protected listenToMultiTimeTeleportersEvents() {
		this.events.on('MultiTimeTeleporter::setToOpen', (num: number) => {
			this.initMultiTimeTeleportersObjectsCollidersByNum(num);
		});
	}

	// generic
	protected addDialog(dialogNumber: number, content): void {
		const { x, y } = this.tilemap.findObject('dialogs', obj => obj['properties'][0].value === dialogNumber);
		this.dialogs.set(JSON.stringify({ x, y }), content);
	}

	// generic
	protected startDialog(content: string) {
		if (!this.isDialogLaunched && this.allowsTutorials) {
			const x = this.cameras.main.worldView.x + 25;
			const y = this.cameras.main.worldView.y + this.cameras.main.height / 2;
			this.textBox = new MyTextBox(this, x, y);
			this.textBox.start(content);
			this.player.pause();
			this.isDialogLaunched = true;
		}
	}

	// generic levels
	private checkForLevelEnd() {
		if (this.player.x > (this.end?.x || 0) - 10 && this.player.x < (this.end?.x || 0) + 10 &&
			this.player.y > (this.end?.y || 0) - 10 && this.player.y < (this.end?.y || 0) + 10) {
			if (this.player.enterActivate) {
				const leftAlivePastPlayers = this.utils.findObjectOnGroup(this.pastPlayersGroup, (pastPlayer) => !(pastPlayer as PastPlayer).isDead);
				if (this.pastPlayersGroup?.getLength() > 0 && leftAlivePastPlayers) {
					if (this.time.now > this.nextActivability) {
						this.nextActivability = this.time.now + this.activabilityRate;
						if (this.hasFx) {
							this.sound.play('door_close');
						}
					}
				} else {
					if (this.hasFx) {
						this.sound.play('end_level');
					}
					this.music.stop();
					this.scene.start(this.nextScene);
				}
			}
		}
	}

	// generic levels
	private listenToPastPlayersEvents() {
		this.events.on('PastPlayer::init', () => {
			this.time.delayedCall(200, () => {
				this.doorExit.close();
			});
		}, this);
		this.events.on('PastPlayer::shotBullet', (ball: Phaser.Physics.Arcade.Sprite) => {
			this.ballGroup.add(ball);
			
			this.physics.add.collider([this.groundLayer], ball, () => {
				ball.destroy();
			});
		}, this);
		this.events.on('PastPlayer::isDead', () => {
			const leftAlivePastPlayers = this.utils.findObjectOnGroup(this.pastPlayersGroup, (pastPlayer) => !(pastPlayer as PastPlayer).isDead);
			if (!leftAlivePastPlayers) {
				this.time.delayedCall(200, () => {
					this.doorExit.open();
				});
			}
		}, this);
	}

	// generic
	private listenToPlayerEvents() {
		this.events.on('Player::shotBullet', (ball: Phaser.Physics.Arcade.Sprite) => {
			this.events.emit('BaseLevel::firstShotGun');
			this.ballGroup.add(ball);
			
			this.physics.add.collider([this.groundLayer], ball, () => {
				ball.destroy();
			});
		}, this);

		this.events.on('Player::isDead', () => {
			this.store.set('score', 0);
			alert(this.translate.get(SceneKey.BaseLevel, 0));
			location.reload();
		});
	}

	// generic
	private listenToMyTextBoxEvents() {
		this.events.on('MyTextBox::complete', () => {
			this.isDialogLaunched = false;
			this.time.delayedCall(500, () => {
				this.player.resume();
			});
		}, this);
	}

	// generic
	private initDoors() {
		const doorStart = this.tilemap.findObject(LayerName.DOORS, obj => obj.name === ObjectName.DOOR_START);
		if (doorStart) {
			const { x: doorStartX, y: doorStartY } = this.tilemap.findObject(LayerName.DOORS, obj => obj.name === ObjectName.DOOR_START);
			this.doorEntrance = new DoorEntrance(this, doorStartX || 0, doorStartY || 0);
		}
		const doorEnd = this.tilemap.findObject(LayerName.DOORS, obj => obj.name === ObjectName.DOOR_END);
		if (doorEnd) {
			const { x: doorEndX, y: doorEndY } = this.tilemap.findObject(LayerName.DOORS, obj => obj.name === ObjectName.DOOR_END);
			this.doorExit = new DoorExit(this, doorEndX || 0, doorEndY || 0);
		}

		if (this.doorEntrance && this.doorExit) {
			this.physics.add.collider([this.doorEntrance, this.doorExit], [this.groundLayer, this.platformsLayer]);
		}
	}

	// generic levels
	private initPastPlayers() {
		this.pastPlayersGroup = this.add.group();
		this.pastPlayersGroup.runChildUpdate = true;
		this.physics.add.collider(this.pastPlayersGroup, [this.groundLayer, this.platformsLayer]);
	}

	private initMap() {
		this.tilemap = this.add.tilemap(this.tilesetKey);
		this.tileset = this.tilemap.addTilesetImage('tileset', 'tileset');

		this.bckgLayer = this.tilemap.createLayer(LayerName.BACKGROUND, this.tileset, 0, 0);
		this.groundLayer = this.tilemap.createLayer(LayerName.GROUND, this.tileset, 0, 0);
		this.wallLayer = this.tilemap.createLayer(LayerName.WALL, this.tileset, 0, 0);
		this.wall2Layer = this.tilemap.createLayer(LayerName.WALL2, this.tileset, 0, 0);
		this.desksLayer = this.tilemap.createLayer(LayerName.DESKS, this.tileset, 0, 0);
		this.platformsLayer = this.tilemap.createLayer(LayerName.PLATFORMS, this.tileset, 0, 0);
		this.ceilingLayer = this.tilemap.createLayer(LayerName.CEILING, this.tileset, 0, 0);
		this.lightsLayer = this.tilemap.createLayer(LayerName.LIGHTS, this.tileset, 0, 0);
		this.stairsLayer = this.tilemap.createLayer(LayerName.STAIRS, this.tileset, 0, 0);

		if (this.stairsLayer) {
			this.stairsLayer.setCollisionByProperty({ collides: true });
		}
		this.groundLayer.setCollisionByProperty({ collides: true });
		this.platformsLayer.setCollisionByProperty({ collides: true });

		this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
		this.physics.world.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);

		this.utils.init(this.tilemap);
	}

	// generic
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
	
	// generic
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

	// generic
	private initAllowsTutorialsOption() {
		const allowsTutorials = this.store.get<boolean>('tutorials');
		if (allowsTutorials !== null) {
			this.allowsTutorials = allowsTutorials;
		}
		if (allowsTutorials === null) {
			this.allowsTutorials = true;
		}
	}

	// specific start screen
	private listenToTutorialsSwitcherEvents() {
		this.events.on('TutorialsSwitcher::tutorials', (isOn) => {
			this.allowsTutorials = isOn;
		});
	}
}
