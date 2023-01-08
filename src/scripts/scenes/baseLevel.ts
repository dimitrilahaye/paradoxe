import { Depth } from './../types';
/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LayerName, ObjectName, SceneKey } from '../types';
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

export default abstract class BaseLevel extends Phaser.Scene {
	protected music: Phaser.Sound.BaseSound;
	protected tilemap: Phaser.Tilemaps.Tilemap;
	protected tileset: Phaser.Tilemaps.Tileset;
	protected stairsLayer: Phaser.Tilemaps.TilemapLayer;
	protected bckgLayer: Phaser.Tilemaps.TilemapLayer;
	private bridgesLayer: Phaser.Tilemaps.TilemapLayer;
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
		
		this.launchMusic();

		this.initAllowsTutorialsOption();
		this.listenToTutorialsSwitcherEvents();
		this.listenToResetButtonEvents();
		this.listenToExitButtonEvents();
		this.listenToFxButtonEvents();
		this.listenToMusicButtonEvents();
				
		this.initPlayer();
		this.createSpatialTeleporters();
		this.createTimeTeleporters();
		this.createTimeSwitchers();
	}

	update(time: number, delta: number) {
		this.player.update();
		this.pastPlayersGroup.preUpdate(time, delta);

		this.checkForTutorials();
		this.checkForLevelEnd();

		this.checkForTeleportersActivation();
	}

	// generic
	protected addDialog(dialogNumber: number, content): void {
		const { x, y } = this.tilemap.findObject(LayerName.DIALOGS, obj => obj['properties'][0].value === dialogNumber);
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
		this.events.off('SimpleTimeTeleporter::isAlive');
		this.events.off('DoubleTimeTeleporter::isAlive');
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
	private initPlayer() {
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

	// new build for all time teleporters
	private createTimeTeleporters() {
		const timeTeleportersLayer = this.tilemap.getObjectLayer(LayerName.TIME_TELEPORTERS);
		if (!timeTeleportersLayer) {
			return;
		}
		const timeTeleportersObjects = timeTeleportersLayer.objects;
		if (timeTeleportersObjects.length === 0) {
			return;
		}

		// build teleporters
		for (const object of timeTeleportersObjects) {
			const properties = this.utils.getPropertiesAsObject(object);
			const { group, num } = properties;
			switch(properties.type) {
			case 'simple': {
				const simpleTimeTeleporter = new SimpleTimeTeleporter(this, object?.x || 0, object?.y || 0, group);
				this.simpleTimeTeleporterGroup.add(simpleTimeTeleporter);
				break;
			}
			case 'double': {
				// create portal
				const doubleTimeTeleporter = new DoubleTimeTeleporter(this, object?.x || 0, object?.y || 0, group, num);
				this.doubleTimeTeleportersGroup.add(doubleTimeTeleporter);
				
				// search for opposite
				const opposite = this.utils.findObjectOnGroup(this.doubleTimeTeleportersGroup, (tp) => {
					return (tp as DoubleTimeTeleporter).group === doubleTimeTeleporter.group
					&& (tp as DoubleTimeTeleporter).num !== doubleTimeTeleporter.num;
				});
				if (opposite) {
					doubleTimeTeleporter.addOpposite(opposite);
					opposite.addOpposite(doubleTimeTeleporter);
				}
				break;
			}
			case 'multi': {
				// create portal
				const { close } = properties;
				const multiTimeTeleporter = new MultiTimeTeleporter(this, object?.x || 0, object?.y || 0, group, num, close);
				this.multiTimeTeleportersGroup.add(multiTimeTeleporter);
				break;
			}
			}
		}

		this.physics.add.collider([
			this.simpleTimeTeleporterGroup,
			this.doubleTimeTeleportersGroup,
			this.multiTimeTeleportersGroup
		], [this.groundLayer, this.platformsLayer]);

		this.utils.iterateOnGroup(this.simpleTimeTeleporterGroup, (simpleTimeTeleporter: SimpleTimeTeleporter) => {
			this.initCollidersForSimpleTimeTeleporter(simpleTimeTeleporter);
		});

		this.utils.iterateOnGroup(this.doubleTimeTeleportersGroup, (teleporter: DoubleTimeTeleporter) => {
			this.initCollidersForDoubleTimeTeleporter(teleporter);
		});

		this.utils.iterateOnGroup(this.multiTimeTeleportersGroup, (tp: MultiTimeTeleporter) => {
			this.initCollidersForMultiTimeTeleporter(tp.group, tp.num);
		});

		this.initMultiTimeTeleportersOpposites();
		this.closeMultiTimeTeleporters();
		this.listenToMultiTimeTeleportersEvents();

		this.events.on('SimpleTimeTeleporter::isAlive', (teleporter: SimpleTimeTeleporter) => {
			this.initCollidersForSimpleTimeTeleporter(teleporter);
		});
		this.events.on('DoubleTimeTeleporter::isAlive', (teleporter: DoubleTimeTeleporter) => {
			this.initCollidersForDoubleTimeTeleporter(teleporter);
		});
	}
	
	private initMultiTimeTeleportersOpposites() {
		this.utils.iterateOnGroup(this.multiTimeTeleportersGroup, (givenTp) => {
			this.utils.iterateOnGroup(this.multiTimeTeleportersGroup, (opposite) => {
				if ((opposite as MultiTimeTeleporter).group === givenTp.group
					&& (opposite as MultiTimeTeleporter).num !== givenTp.num) {
					givenTp.addOpposites(opposite);
				}
			});
		});
	}

	private initCollidersForDoubleTimeTeleporter(teleporter: DoubleTimeTeleporter) {
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
	}

	private initCollidersForSimpleTimeTeleporter(simpleTimeTeleporter: SimpleTimeTeleporter) {
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

	// new build for all time switchers
	private createTimeSwitchers() {
		const timeSwitchersLayer = this.tilemap.getObjectLayer(LayerName.TIME_SWITCHERS);
		if (!timeSwitchersLayer) {
			return;
		}
		const timeSwitcherObjects = timeSwitchersLayer.objects;
		if (timeSwitcherObjects.length === 0) {
			return;
		}

		// build switchers
		for (const object of timeSwitcherObjects) {
			const properties = this.utils.getPropertiesAsObject(object);
			const { group, num } = properties;
			switch(properties.type) {
			case 'simple': {
				const simpleTimeSwitcher = new SimpleSwitcher(this, object?.x || 0, object?.y || 0, group, num);
				this.simpleSwitcherGroup.add(simpleTimeSwitcher);
				break;
			}
			case 'double': {
				const doubleSwitcher = new DoubleSwitcher(this, object?.x || 0, object?.y || 0, group, num);
				this.doubleSwitchersGroup.add(doubleSwitcher);
				break;
			}
			case 'multi': {
				const multiSwitcher = new MultiSwitcher(this, object?.x || 0, object?.y || 0, group, num);
				this.multiSwitchersGroup.add(multiSwitcher);
				break;
			}
			}
		}
	}

	private createSpatialTeleporters() {
		const tpDoors = this.utils.filterObjectsByLayerAndName(LayerName.SPATIAL_TELEPORTERS, ObjectName.SPATIAL_DOOR);
		for (const tpDoor of tpDoors) {
			const { num, group, sprite } = this.utils.getPropertiesAsObject(tpDoor);
			const spatialTeleporter = new SpatialTeleporter(this, tpDoor?.x || 0, tpDoor?.y || 0, sprite, group, num);
			this.spatialTeleportersGroup.add(spatialTeleporter);
		}
	}

	// generic levels factories
	private closeMultiTimeTeleporters() {
		this.utils.iterateOnGroup(this.multiTimeTeleportersGroup, (teleporter: MultiTimeTeleporter) => {
			if (teleporter.close) {
				teleporter.setToClose();
			}
		});
	}

	// generic levels factories
	private initCollidersForMultiTimeTeleporter(group: number, num: number) {
		const multiTimeTeleporter = this.utils.findObjectOnGroup(this.multiTimeTeleportersGroup, (tp) => {
			return (tp as MultiTimeTeleporter).group === group
			&& (tp as MultiTimeTeleporter).num === num;
		});
		if (!multiTimeTeleporter) {
			return;
		}

		const playerCollider = this.physics.add.collider(this.player, multiTimeTeleporter, (p, tp) => {
			if ((tp as MultiTimeTeleporter).alive) {
				this.utils.shakeOnTpCollision();

				(tp as MultiTimeTeleporter).activate();

				const dirX = (p as Player).direction === 'left' ? -20 : +20;
				const pastPlayer = new PastPlayer(this, (tp as MultiTimeTeleporter).x - dirX, (tp as MultiTimeTeleporter).y, this.player);
				this.pastPlayersGroup.add(pastPlayer);
			}
		});

		const ballsCollider = this.physics.add.collider(multiTimeTeleporter, this.ballGroup, (_, ball) => {
			if (multiTimeTeleporter.alive) {
				ball.destroy();
			}
		});

		this.physics.add.collider(multiTimeTeleporter, this.pastPlayersGroup, (_, pp) => {
			const currentX = (pp.body.gameObject as PastPlayer).x;
			const dirX = this.player.direction === 'left' ? -20 : +20;
			(pp.body.gameObject as PastPlayer).setX(currentX - dirX);
		});

		multiTimeTeleporter.addColliders(ballsCollider, playerCollider);
	}

	private checkForTeleportersActivation() {
		// spatial teleporters activation
		this.utils.iterateOnGroup(this.spatialTeleportersGroup, (teleporter: SpatialTeleporter) => {
			if (this.utils.intersectObjects(this.player, teleporter)) {
				if (this.player.enterActivate) {
					teleporter.activate();
				}
			}
		});
		// simple switcher activation
		this.utils.iterateOnGroup(this.simpleSwitcherGroup, (switcher: SimpleSwitcher) => {
			if (this.utils.intersectObjects(this.player, switcher)) {
				if (this.player.enterActivate) {
					switcher.activate();
				}
			}
		});
		// double switcher activation
		this.utils.iterateOnGroup(this.doubleSwitchersGroup, (switcher: DoubleSwitcher) => {
			if (this.utils.intersectObjects(this.player, switcher)) {
				if (this.player.enterActivate) {
					switcher.activate();
				}
			}
		});
		// multi switcher activation
		this.utils.iterateOnGroup(this.multiSwitchersGroup, (switcher: MultiSwitcher) => {
			if (this.utils.intersectObjects(this.player, switcher)) {
				if (this.player.enterActivate) {
					switcher.activate();
				}
			}
		});
	}

	// generic levels factories
	private listenToMultiTimeTeleportersEvents() {
		this.events.on('MultiTimeTeleporter::setToOpen', (group: number, num: number) => {
			this.initCollidersForMultiTimeTeleporter(group, num);
		});
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
			const { x: doorStartX, y: doorStartY } = doorStart;
			this.doorEntrance = new DoorEntrance(this, doorStartX || 0, doorStartY || 0);
		}
		const doorEnd = this.tilemap.findObject(LayerName.DOORS, obj => obj.name === ObjectName.DOOR_END);
		if (doorEnd) {
			const { x: doorEndX, y: doorEndY } = doorEnd;
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
		this.bridgesLayer = this.tilemap.createLayer(LayerName.BRIDGES, this.tileset, 0, 0);
		this.bridgesLayer?.setDepth(Depth.BRIDGES);
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
