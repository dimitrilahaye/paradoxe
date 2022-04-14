import { ObjectName } from '../objects';
import DoorEntrance from '../objects/doorEntrance';
import DoorExit from '../objects/doorExit';
import DoubleSwitcher from '../objects/doubleSwitcher';
import DoubleTimeTeleporter from '../objects/doubleTimeTeleporter';
import GreenSpatialTeleporter from '../objects/greenSpatialTeleporter';
import MultiSwitcher from '../objects/multiSwitcher';
import MultiTimeTeleporter from '../objects/multiTimeTeleporter';
import PastPlayer from '../objects/pastPlayer';
import Player from '../objects/player';
import RedSpatialTeleporter from '../objects/redSpatialTeleporter';
import SimpleSwitcher from '../objects/simpleSwitcher';
import SimpleTimeTeleporter from '../objects/simpleTimeTeleporter';
import MyTextBox from '../ui/myTextBox';
import { SceneKey } from './index';

export default abstract class BaseLevel extends Phaser.Scene {
	protected tilemap: Phaser.Tilemaps.Tilemap;
	protected tileset: Phaser.Tilemaps.Tileset;
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
	protected music: Phaser.Sound.BaseSound;
	
	protected player: Player;
	protected doorEntrance: DoorEntrance;
	protected doorExit: DoorExit;
	protected greenSpatialTeleporter1: GreenSpatialTeleporter;
	protected greenSpatialTeleporter2: GreenSpatialTeleporter;
	protected redSpatialTeleporter1: RedSpatialTeleporter;
	protected redSpatialTeleporter2: RedSpatialTeleporter;
	protected simpleTimeTeleporter: SimpleTimeTeleporter;
	protected doubleTimeTeleporter1: DoubleTimeTeleporter;
	protected doubleTimeTeleporter2: DoubleTimeTeleporter;
	protected multiTimeTeleporter1: MultiTimeTeleporter;
	protected multiTimeTeleporter2: MultiTimeTeleporter;
	protected multiTimeTeleporter3: MultiTimeTeleporter;
	protected simpleSwitcher: SimpleSwitcher;
	protected doubleSwitcher: DoubleSwitcher;
	protected multiSwitcher1: MultiSwitcher;
	protected multiSwitcher2: MultiSwitcher;
	protected multiSwitcher3: MultiSwitcher;
	protected textBox: MyTextBox;
	protected dialogs = new Map<string, string>();
	protected isDialogLaunched = false;

	constructor(key: SceneKey, protected nextScene: SceneKey, protected tilesetKey: string) {
		super({ key });
	}

	create() {
		this.ballGroup = this.add.group();
		this.initMap();
		
		// TODO: refacto deeply DoubleTimeTeleporter
		this.initDoubleTimeTeleporters();
		// TODO: refacto deeply SimpleTimeTeleporter
		this.initSimpleTimeTeleporter();
		// TODO: refacto deeply MultiTimeTeleporter
		this.initMultiTimeTeleporters();
		this.initSimpleSwitcher();
		this.initDoubleSwitcher();
		this.initMultiSwitchers();

		this.initDoors();

		this.initSpatialTeleporters();

		this.initPlayer();
		
		this.initSimpleTimeTeleportersColliders();
		this.initDoubleTimeTeleportersColliders();
		this.initMultiTimeTeleportersColliders();
		
		// TODO: refactor this part, condition is hard coded
		this.initPastPlayers();
		
		this.listenToPlayerEvents();
		this.listenToPastPlayersEvents();
		this.listenToMyTextBoxEvents();
		this.listenToMultiTimeTeleportersEvents();
		
		this.launchMusic();
	}

	update() {
		this.player.update();
		this.iterateOnPastPlayers((pastPlayer: Phaser.GameObjects.GameObject) => pastPlayer.update());
		
		this.checkForSpatialTeleportersActivation();
		this.checkForSimpleSwitcherActivation();
		this.checkForDoubleSwitcherActivation();
		this.checkForMultiSwitchersActivation();
		
		this.checkForTutorials();
		this.checkForLevelEnd();
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

	private checkForSimpleSwitcherActivation() {
		if (this.simpleSwitcher) {
			if (this.intersect(this.player, this.simpleSwitcher)) {
				if (this.player.enterActivate) {
					this.simpleSwitcher.activate();
				}
			}
		}
	}

	private checkForDoubleSwitcherActivation() {
		if (this.doubleSwitcher) {
			if (this.intersect(this.player, this.doubleSwitcher)) {
				if (this.player.enterActivate) {
					this.doubleSwitcher.activate();
				}
			}
		}
	}

	private checkForMultiSwitchersActivation() {
		if (this.multiSwitcher1) {
			if (this.intersect(this.player, this.multiSwitcher1)) {
				if (this.player.enterActivate) {
					this.multiSwitcher1.activate();
				}
			}
		}
		if (this.multiSwitcher2) {
			if (this.intersect(this.player, this.multiSwitcher2)) {
				if (this.player.enterActivate) {
					this.multiSwitcher2.activate();
				}
			}
		}
		if (this.multiSwitcher3) {
			if (this.intersect(this.player, this.multiSwitcher3)) {
				if (this.player.enterActivate) {
					this.multiSwitcher3.activate();
				}
			}
		}
	}

	private checkForLevelEnd() {
		if (this.player.x > (this.end?.x || 0) - 10 && this.player.x < (this.end?.x || 0) + 10 &&
			this.player.y > (this.end?.y || 0) - 10 && this.player.y < (this.end?.y || 0) + 10) {
			if (this.player.enterActivate) {
				const leftAlivePastPlayers = this.findPastPlayers((pastPlayer) => !(pastPlayer as PastPlayer).isDead);
				if (this.pastPlayersGroup?.getLength() > 0 && leftAlivePastPlayers) {
					this.sound.play('door_tp');
					this.player.setPosition(this.start.x, this.start.y);
				} else {
					this.sound.play('end_level');
					this.music.stop();
					this.scene.start(this.nextScene);
				}
			}
		}
	}

	private checkForSpatialTeleportersActivation() {
		// green ones
		if (this.greenSpatialTeleporter1) {
			if (this.intersect(this.player, this.greenSpatialTeleporter1)) {
				if (this.player.enterActivate) {
					this.greenSpatialTeleporter1.activate();
				}
			}
		}

		if (this.greenSpatialTeleporter2) {
			if (this.intersect(this.player, this.greenSpatialTeleporter2)) {
				if (this.player.enterActivate) {
					this.greenSpatialTeleporter2.activate();
				}
			}
		}

		// red ones
		if (this.redSpatialTeleporter1) {
			if (this.intersect(this.player, this.redSpatialTeleporter1)) {
				if (this.player.enterActivate) {
					this.redSpatialTeleporter1.activate();
				}
			}
		}

		if (this.redSpatialTeleporter2) {
			if (this.intersect(this.player, this.redSpatialTeleporter2)) {
				if (this.player.enterActivate) {
					this.redSpatialTeleporter2.activate();
				}
			}
		}
	}

	private checkForTutorials() {
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

	private listenToPastPlayersEvents() {
		this.events.on('PastPlayer::init', () => {
			this.time.delayedCall(200, () => {
				this.doorExit.close();
			});
		}, this);
		this.events.on('PastPlayer::isDead', () => {
			const leftAlivePastPlayers = this.findPastPlayers((pastPlayer) => !(pastPlayer as PastPlayer).isDead);
			if (!leftAlivePastPlayers) {
				this.time.delayedCall(200, () => {
					this.doorExit.open();
				});
			}
		}, this);
	}

	private listenToPlayerEvents() {
		this.events.on('Player::shotBullet', (ball: Phaser.Physics.Arcade.Sprite) => {
			this.events.emit('BaseLevel::firstShotGun');
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

	private listenToMultiTimeTeleportersEvents() {
		this.events.on('MultiTimeTeleporter::setToOpen', (num: number) => {
			switch (num) {
			case 1:
				this.initMultiTimeTeleporter1Colliders();
				break;
			case 2:
				this.initMultiTimeTeleporter2Colliders();
				break;
			case 3:
				this.initMultiTimeTeleporter3Colliders();
				break;
			default:
				// nothing
			}
		});
	}

	private iterateOnPastPlayers(callback: (pastPlayer: Phaser.GameObjects.GameObject) => void) {
		if (this.pastPlayersGroup?.getLength() > 0) {
			this.pastPlayersGroup.children.iterate(callback);
		}
	}

	private findPastPlayers(callback: (pastPlayer: Phaser.GameObjects.GameObject) => void) {
		if (this.pastPlayersGroup?.getLength() > 0) {
			return this.pastPlayersGroup.children.getArray().find(callback);
		}
		return false;
	}

	private intersect(obj1: Phaser.GameObjects.Sprite, obj2: Phaser.GameObjects.Sprite): boolean {
		const RectangleToRectangle = Phaser.Geom.Intersects.RectangleToRectangle;

		return RectangleToRectangle(obj1.getBounds(), obj2.getBounds());
	}

	private initPlayer() {
		this.start = this.tilemap.findObject('doors', obj => obj.name === ObjectName.START);
		this.end = this.tilemap.findObject('doors', obj => obj.name === ObjectName.END);
		this.player = new Player(this, this.start?.x || 0, this.start?.y || 0);
		this.player.create();
		
		this.cameras.main.startFollow(this.player);

		this.physics.add.collider(this.player, [this.groundLayer, this.platformsLayer]);
	}

	private initSimpleTimeTeleportersColliders() {
		if (this.simpleTimeTeleporter) {
			const playerCollider = this.physics.add.collider(this.player, this.simpleTimeTeleporter, () => {
				this.shakeOnTpCollision();
				this.simpleTimeTeleporter.activate();
				this.events.emit('BaseLevel::firstTp');

				const dirX = this.player.direction === 'left' ? -20 : +20;
				const pastPlayer = new PastPlayer(this, this.simpleTimeTeleporter.x - dirX, this.simpleTimeTeleporter.y);
				pastPlayer.create();
				this.pastPlayersGroup.add(pastPlayer);
			});

			const ballsCollider = this.physics.add.collider([this.simpleTimeTeleporter], this.ballGroup, (_, ball) => {
				ball.destroy();
			});
			
			this.simpleTimeTeleporter.addCollider(ballsCollider, playerCollider);
		}
	}

	private initDoubleTimeTeleportersColliders() {
		if (this.doubleTimeTeleporter1 && this.doubleTimeTeleporter2) {
			const playerCollider1 = this.physics.add.collider(this.player, this.doubleTimeTeleporter1, () => {
				this.shakeOnTpCollision();

				this.doubleTimeTeleporter1.activate();

				const dirX = this.player.direction === 'left' ? -20 : +20;
				const pastPlayer = new PastPlayer(this, this.doubleTimeTeleporter1.x - dirX, this.doubleTimeTeleporter1.y);
				pastPlayer.create();
				this.pastPlayersGroup.add(pastPlayer);
			});
			const playerCollider2 = this.physics.add.collider(this.player, this.doubleTimeTeleporter2, () => {
				this.shakeOnTpCollision();

				this.doubleTimeTeleporter2.activate();

				const dirX = this.player.direction === 'left' ? -20 : +20;
				const pastPlayer = new PastPlayer(this, this.doubleTimeTeleporter2.x + dirX, this.doubleTimeTeleporter2.y);
				pastPlayer.create();
				this.pastPlayersGroup.add(pastPlayer);
			});

			const ballsCollider = this.physics.add.collider([this.doubleTimeTeleporter1, this.doubleTimeTeleporter2], this.ballGroup, (_, ball) => {
				ball.destroy();
			});
			
			this.doubleTimeTeleporter1.addCollider(ballsCollider, playerCollider1);
			this.doubleTimeTeleporter2.addCollider(ballsCollider, playerCollider2);
		}
	}

	private initMultiTimeTeleportersColliders() {
		this.initMultiTimeTeleporter1Colliders();
		this.initMultiTimeTeleporter2Colliders();
		this.initMultiTimeTeleporter3Colliders();
		
		if (this.multiTimeTeleporter3) {
			this.multiTimeTeleporter3.setToClose();
		}
	}

	private initMultiTimeTeleporter1Colliders() {
		if (this.multiTimeTeleporter1) {
			const playerCollider = this.physics.add.collider(this.player, this.multiTimeTeleporter1, () => {
				this.shakeOnTpCollision();

				this.multiTimeTeleporter1.activate();

				const dirX = this.player.direction === 'left' ? -20 : +20;
				const pastPlayer = new PastPlayer(this, this.multiTimeTeleporter1.x - dirX, this.multiTimeTeleporter1.y);
				pastPlayer.create();
				this.pastPlayersGroup.add(pastPlayer);
			});

			const ballsCollider = this.physics.add.collider([this.multiTimeTeleporter1], this.ballGroup, (_, ball) => {
				ball.destroy();
			});
			
			this.multiTimeTeleporter1.addColliders(ballsCollider, playerCollider);
		}
	}

	private initMultiTimeTeleporter2Colliders() {
		if (this.multiTimeTeleporter2) {
			const playerCollider = this.physics.add.collider(this.player, this.multiTimeTeleporter2, () => {
				this.shakeOnTpCollision();

				this.multiTimeTeleporter2.activate();

				const dirX = this.player.direction === 'left' ? -20 : +20;
				const pastPlayer = new PastPlayer(this, this.multiTimeTeleporter2.x - dirX, this.multiTimeTeleporter2.y);
				pastPlayer.create();
				this.pastPlayersGroup.add(pastPlayer);
			});

			const ballsCollider = this.physics.add.collider([this.multiTimeTeleporter2], this.ballGroup, (_, ball) => {
				ball.destroy();
			});
			
			this.multiTimeTeleporter2.addColliders(ballsCollider, playerCollider);
		}
	}

	private initMultiTimeTeleporter3Colliders() {
		if (this.multiTimeTeleporter3) {
			const playerCollider = this.physics.add.collider(this.player, this.multiTimeTeleporter3, () => {
				this.shakeOnTpCollision();

				this.multiTimeTeleporter3.activate();

				const dirX = this.player.direction === 'left' ? -20 : +20;
				const pastPlayer = new PastPlayer(this, this.multiTimeTeleporter3.x - dirX, this.multiTimeTeleporter3.y);
				pastPlayer.create();
				this.pastPlayersGroup.add(pastPlayer);
			});

			const ballsCollider = this.physics.add.collider([this.multiTimeTeleporter3], this.ballGroup, (_, ball) => {
				ball.destroy();
			});
			
			this.multiTimeTeleporter3.addColliders(ballsCollider, playerCollider);
		}
	}

	private shakeOnTpCollision() {
		this.cameras.main.shake(50, 0.01);
	}

	private initDoors() {
		const { x: doorStartX, y: doorStartY } = this.tilemap.findObject('doors', obj => obj.name === ObjectName.DOOR_START);
		const { x: doorEndX, y: doorEndY } = this.tilemap.findObject('doors', obj => obj.name === ObjectName.DOOR_END);
		this.doorEntrance = new DoorEntrance(this, doorStartX || 0, doorStartY || 0);
		this.doorExit = new DoorExit(this, doorEndX || 0, doorEndY || 0);
		
		this.physics.add.collider([this.doorEntrance, this.doorExit], [this.groundLayer, this.platformsLayer]);
	}

	private initSpatialTeleporters() {
		const greenDoorTp1Position = this.tilemap.findObject('doors', obj => obj.name === ObjectName.DOOR_TP_GREEN_1);
		const greenDoorTp2Position = this.tilemap.findObject('doors', obj => obj.name === ObjectName.DOOR_TP_GREEN_2);
		if (greenDoorTp1Position && greenDoorTp2Position) {
			this.greenSpatialTeleporter1 = new GreenSpatialTeleporter(this, greenDoorTp1Position?.x || 0, greenDoorTp1Position?.y || 0);
			this.greenSpatialTeleporter2 = new GreenSpatialTeleporter(this, greenDoorTp2Position?.x || 0, greenDoorTp2Position?.y || 0);
			this.greenSpatialTeleporter1.setOpposite(this.greenSpatialTeleporter2);
			this.greenSpatialTeleporter2.setOpposite(this.greenSpatialTeleporter1);

			this.physics.add.collider([this.greenSpatialTeleporter1, this.greenSpatialTeleporter2], [this.platformsLayer, this.groundLayer]);
		}
		const redDoorTp1Position = this.tilemap.findObject('doors', obj => obj.name === ObjectName.DOOR_TP_RED_1);
		const redDoorTp2Position = this.tilemap.findObject('doors', obj => obj.name === ObjectName.DOOR_TP_RED_2);
		if (redDoorTp1Position && redDoorTp2Position) {
			this.redSpatialTeleporter1 = new RedSpatialTeleporter(this, redDoorTp1Position?.x || 0, redDoorTp1Position?.y || 0);
			this.redSpatialTeleporter2 = new RedSpatialTeleporter(this, redDoorTp2Position?.x || 0, redDoorTp2Position?.y || 0);
			this.redSpatialTeleporter1.setOpposite(this.redSpatialTeleporter2);
			this.redSpatialTeleporter2.setOpposite(this.redSpatialTeleporter1);

			this.physics.add.collider([this.redSpatialTeleporter1, this.redSpatialTeleporter2], [this.platformsLayer, this.groundLayer]);
		}
	}

	private initSimpleSwitcher() {
		const simpleSwitcherPosition = this.tilemap.findObject('tp_switchers', obj => obj.name === ObjectName.SWITCHER_SIMPLE);
		if (simpleSwitcherPosition) {
			this.simpleSwitcher = new SimpleSwitcher(this, simpleSwitcherPosition?.x || 0, simpleSwitcherPosition?.y || 0);
		}
	}

	private initDoubleSwitcher() {
		const doubleSwitcherPosition = this.tilemap.findObject('tp_switchers', obj => obj.name === ObjectName.SWITCHER_DOUBLE);
		if (doubleSwitcherPosition) {
			this.doubleSwitcher = new DoubleSwitcher(this, doubleSwitcherPosition?.x || 0, doubleSwitcherPosition?.y || 0);
		}
	}

	private initMultiSwitchers() {
		const multiSwitcherPosition1 = this.tilemap.findObject('tp_switchers', obj => obj.name === ObjectName.SWITCHER_MULTI_1);
		const multiSwitcherPosition2 = this.tilemap.findObject('tp_switchers', obj => obj.name === ObjectName.SWITCHER_MULTI_2);
		const multiSwitcherPosition3 = this.tilemap.findObject('tp_switchers', obj => obj.name === ObjectName.SWITCHER_MULTI_3);
		if (multiSwitcherPosition1 && multiSwitcherPosition2 && multiSwitcherPosition3) {
			this.multiSwitcher1 = new MultiSwitcher(this, multiSwitcherPosition1?.x || 0, multiSwitcherPosition1?.y || 0, 1);
			this.multiSwitcher2 = new MultiSwitcher(this, multiSwitcherPosition2?.x || 0, multiSwitcherPosition2?.y || 0, 2);
			this.multiSwitcher3 = new MultiSwitcher(this, multiSwitcherPosition3?.x || 0, multiSwitcherPosition3?.y || 0, 3);
		}
	}

	private initSimpleTimeTeleporter() {
		const simpleTimeTeleporterPosition = this.tilemap.findObject('tps', obj => obj.name === ObjectName.TP_SIMPLE);
		if (simpleTimeTeleporterPosition) {
			this.simpleTimeTeleporter = new SimpleTimeTeleporter(this, simpleTimeTeleporterPosition?.x || 0, simpleTimeTeleporterPosition?.y || 0);

			this.physics.add.collider(this.simpleTimeTeleporter, [this.groundLayer, this.platformsLayer]);
		}
	}

	private initDoubleTimeTeleporters() {
		const doubleTimeTeleporter1Position = this.tilemap.findObject('tps', obj => obj.name === ObjectName.TP_DOUBLE_1);
		const doubleTimeTeleporter2Position = this.tilemap.findObject('tps', obj => obj.name === ObjectName.TP_DOUBLE_2);
		if (doubleTimeTeleporter1Position && doubleTimeTeleporter2Position) {
			this.doubleTimeTeleporter1 = new DoubleTimeTeleporter(this, doubleTimeTeleporter1Position?.x || 0, doubleTimeTeleporter1Position?.y || 0);
			this.doubleTimeTeleporter2 = new DoubleTimeTeleporter(this, doubleTimeTeleporter2Position?.x || 0, doubleTimeTeleporter2Position?.y || 0);
			
			this.doubleTimeTeleporter1.setOpposite(this.doubleTimeTeleporter2);
			this.doubleTimeTeleporter2.setOpposite(this.doubleTimeTeleporter1);

			this.physics.add.collider([this.doubleTimeTeleporter1, this.doubleTimeTeleporter2], [this.groundLayer, this.platformsLayer]);
		}
	}

	private initMultiTimeTeleporters() {
		const multiTimeTeleporter1Position = this.tilemap.findObject('tps', obj => obj.name === ObjectName.TP_MULTI_1);
		const multiTimeTeleporter2Position = this.tilemap.findObject('tps', obj => obj.name === ObjectName.TP_MULTI_2);
		const multiTimeTeleporter3Position = this.tilemap.findObject('tps', obj => obj.name === ObjectName.TP_MULTI_3);
		if (multiTimeTeleporter1Position && multiTimeTeleporter2Position && multiTimeTeleporter3Position) {
			this.multiTimeTeleporter1 = new MultiTimeTeleporter(this, multiTimeTeleporter1Position?.x || 0, multiTimeTeleporter1Position?.y || 0, 1);
			this.multiTimeTeleporter2 = new MultiTimeTeleporter(this, multiTimeTeleporter2Position?.x || 0, multiTimeTeleporter2Position?.y || 0, 2);
			this.multiTimeTeleporter3 = new MultiTimeTeleporter(this, multiTimeTeleporter3Position?.x || 0, multiTimeTeleporter3Position?.y || 0, 3);
			
			this.multiTimeTeleporter1.setOpposites(this.multiTimeTeleporter2, this.multiTimeTeleporter3);
			this.multiTimeTeleporter2.setOpposites(this.multiTimeTeleporter1, this.multiTimeTeleporter3);
			this.multiTimeTeleporter3.setOpposites(this.multiTimeTeleporter1, this.multiTimeTeleporter2);

			this.physics.add.collider([this.multiTimeTeleporter1, this.multiTimeTeleporter2, this.multiTimeTeleporter3], [this.groundLayer, this.platformsLayer]);
		}
	}

	private initPastPlayers() {
		if (this.doubleTimeTeleporter1 || this.simpleTimeTeleporter || this.multiTimeTeleporter1) {
			this.pastPlayersGroup = this.add.group();
			this.physics.add.collider(this.pastPlayersGroup, [this.groundLayer, this.platformsLayer]);
		}
	}

	private initMap() {
		this.tilemap = this.add.tilemap(this.tilesetKey);
		this.tileset = this.tilemap.addTilesetImage('tileset', 'tileset');

		this.bckgLayer = this.tilemap.createLayer('background', this.tileset, 0, 0);
		this.groundLayer = this.tilemap.createLayer('ground', this.tileset, 0, 0);
		this.wallLayer = this.tilemap.createLayer('wall', this.tileset, 0, 0);
		this.wall2Layer = this.tilemap.createLayer('wall2', this.tileset, 0, 0);
		this.desksLayer = this.tilemap.createLayer('desks', this.tileset, 0, 0);
		this.platformsLayer = this.tilemap.createLayer('platforms', this.tileset, 0, 0);
		this.ceilingLayer = this.tilemap.createLayer('ceiling', this.tileset, 0, 0);
		this.lightsLayer = this.tilemap.createLayer('lights', this.tileset, 0, 0);

		this.groundLayer.setCollisionByProperty({ collides: true });
		this.platformsLayer.setCollisionByProperty({ collides: true });

		this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
	}

	private getMiddleSceneCoordinates(): { x: number, y: number } {
		const x = this.cameras.main.worldView.x + this.cameras.main.width / 2;
		const y = this.cameras.main.worldView.y + this.cameras.main.height / 2;

		return { x, y };
	}

	private launchMusic() {
		this.music = this.sound.add('levels');
		if (!this.music.isPlaying) {
			this.music.play({
				loop: true,
				volume: 0.1,
			});
		}
	}
}
