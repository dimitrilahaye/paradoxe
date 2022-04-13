import DoubleTimeTeleporter from '../objects/doubleTimeTeleporter';
import PastPlayer from '../objects/pastPlayer';
import Player from '../objects/player';
import SimpleTimeTeleporter from '../objects/simpleTimeTeleporter';
import SpatialTeleporter from '../objects/spatialTeleporter';
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
	protected doorStart: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	protected doorEnd: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	protected switcher1: Phaser.GameObjects.Sprite;
	protected switcher2: Phaser.GameObjects.Sprite;
	protected pastPlayersGroup: Phaser.GameObjects.Group;
	protected music: Phaser.Sound.BaseSound;
	
	protected textBox?: MyTextBox;
	protected player: Player;
	protected spatialTeleporter1a: SpatialTeleporter;
	protected spatialTeleporter1b: SpatialTeleporter;
	protected doubleTimeTeleporter1a: DoubleTimeTeleporter;
	protected doubleTimeTeleporter1b: DoubleTimeTeleporter;
	protected simpleTimeTeleporter2a: SimpleTimeTeleporter;
	protected tp1aHasBeenDestroyed = false;
	protected tp1bHasBeenDestroyed = false;
	protected tp2aHasBeenDestroyed = false;
	protected nextTp = 0;
	protected tpRate = 500;
	protected dialogs = new Map<string, string>();
	protected isDialogLaunched = false;

	constructor(key: SceneKey, protected nextScene: SceneKey, protected tilesetKey: string) {
		super({ key });
	}

	create() {
		this.initMap();
		
		this.addTps();
		this.addDoors();

		this.addPlayer();
		
		this.initDoubleTimeTeleportersColliders();
		this.initSimpleTimeTeleportersColliders();
		
		this.initPastPlayers();
		
		this.listenToPlayerEvents();
		this.listenToPastPlayersEvents();
		this.listenToMyTextBoxEvents();
		
		this.launchMusic();
	}

	update() {
		this.iterateOnPastPlayers((pastPlayer: Phaser.GameObjects.GameObject) => pastPlayer.update());

		this.player.update();

		this.checkForTutorials();
		
		this.checkForSpatialTeleportersActivation();

		this.checkForLevelEnd();

		this.checkForDoubleSwitcherActivation();

		this.checkForSimpleSwitcherActivation();
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
		if (this.switcher2) {
			if (!this.tp2aHasBeenDestroyed && this.intersect(this.player, this.switcher2)) {
				if (this.player.enterActivate) {
					this.sound.play('switcher');
					this.simpleTimeTeleporter2a.destroy();
					this.tp2aHasBeenDestroyed = true;
				}
			}
		}
	}

	private checkForDoubleSwitcherActivation() {
		if (this.switcher1) {
			if (!this.tp1aHasBeenDestroyed && !this.tp1bHasBeenDestroyed && this.intersect(this.player, this.switcher1)) {
				if (this.player.enterActivate) {
					this.sound.play('switcher');
					this.doubleTimeTeleporter1a.destroy();
					this.tp1aHasBeenDestroyed = true;
					this.doubleTimeTeleporter1b.destroy();
					this.tp1bHasBeenDestroyed = true;
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
		if (this.spatialTeleporter1a) {
			if (this.intersect(this.player, this.spatialTeleporter1a)) {
				if (this.player.enterActivate) {
					this.spatialTeleporter1a.activate();
				}
			}
		}

		if (this.spatialTeleporter1b) {
			if (this.intersect(this.player, this.spatialTeleporter1b)) {
				if (this.player.enterActivate) {
					this.spatialTeleporter1b.activate();
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
				this.doorEnd.setTexture('door_end_close');
				this.sound.play('door_close');
			});
		}, this);
		this.events.on('PastPlayer::isDead', () => {
			const leftAlivePastPlayers = this.findPastPlayers((pastPlayer) => !(pastPlayer as PastPlayer).isDead);
			if (!leftAlivePastPlayers) {
				this.time.delayedCall(200, () => {
					this.doorEnd.setTexture('door_end_open');
					this.sound.play('door_open', {
						volume: 0.1,
					});
				});
			}
		}, this);
	}

	private listenToPlayerEvents() {
		this.events.on('Player::shotBullet', (ball: Phaser.Physics.Arcade.Sprite) => {
			this.events.emit('BaseLevel::firstShotGun');
			this.physics.add.collider([this.groundLayer, this.doubleTimeTeleporter1a, this.doubleTimeTeleporter1b, this.simpleTimeTeleporter2a], ball, () => {
				ball.destroy();
			}, undefined, this);
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

	private addPlayer() {
		this.start = this.tilemap.findObject('doors', obj => obj.name === 'start');
		this.end = this.tilemap.findObject('doors', obj => obj.name === 'end');
		this.player = new Player(this, this.start?.x || 0, this.start?.y || 0);
		this.cameras.main.startFollow(this.player);
		this.cameras.main.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels);
		this.player.create();
		this.physics.add.collider(this.player, this.groundLayer);
		this.physics.add.collider(this.player, this.platformsLayer);
	}

	private initSimpleTimeTeleportersColliders() {
		if (this.simpleTimeTeleporter2a) {
			this.physics.add.collider(this.player, this.simpleTimeTeleporter2a, () => {
				this.shakeOnTpCollision();
				this.simpleTimeTeleporter2a.activate();

				const dirX = this.player.direction === 'left' ? -20 : +20;
				const pastPlayer = new PastPlayer(this, this.simpleTimeTeleporter2a.x - dirX, this.simpleTimeTeleporter2a.y);
				pastPlayer.create();
				this.pastPlayersGroup.add(pastPlayer);
			}, undefined, this);
		}
	}

	private initDoubleTimeTeleportersColliders() {
		if (this.doubleTimeTeleporter1a && this.doubleTimeTeleporter1b) {
			this.physics.add.collider(this.player, this.doubleTimeTeleporter1a, () => {
				this.shakeOnTpCollision();

				this.doubleTimeTeleporter1a.activate();

				const pastPlayer = new PastPlayer(this, this.doubleTimeTeleporter1a.x - 20, this.doubleTimeTeleporter1a.y);
				pastPlayer.create();
				this.pastPlayersGroup.add(pastPlayer);
				this.events.emit('BaseLevel::firstTp');
			}, undefined, this);
			this.physics.add.collider(this.player, this.doubleTimeTeleporter1b, () => {
				this.shakeOnTpCollision();

				this.doubleTimeTeleporter1b.activate();

				const pastPlayer = new PastPlayer(this, this.doubleTimeTeleporter1b.x + 20, this.doubleTimeTeleporter1b.y);
				pastPlayer.create();
				this.pastPlayersGroup.add(pastPlayer);
			}, undefined, this);
		}
	}

	private shakeOnTpCollision() {
		this.cameras.main.shake(50, 0.01);
	}

	private addDoors() {
		const { x: doorStartX, y: doorStartY } = this.tilemap.findObject('doors', obj => obj.name === 'door_start');
		const { x: doorEndX, y: doorEndY } = this.tilemap.findObject('doors', obj => obj.name === 'door_end');
		this.doorStart = this.physics.add.sprite(doorStartX || 0, doorStartY || 0, 'door_start');
		this.doorEnd = this.physics.add.sprite(doorEndX || 0, doorEndY || 0, 'door_end_open');
		this.physics.add.collider(this.doorStart, this.groundLayer);
		this.physics.add.collider(this.doorEnd, this.groundLayer);
		this.physics.add.collider(this.doorStart, this.platformsLayer);
		this.physics.add.collider(this.doorEnd, this.platformsLayer);

		const doorTp1aPosition = this.tilemap.findObject('doors', obj => obj.name === 'door_tp1a');
		const doorTp1bPosition = this.tilemap.findObject('doors', obj => obj.name === 'door_tp1b');
		if (doorTp1aPosition && doorTp1bPosition) {
			this.spatialTeleporter1a = new SpatialTeleporter(this, doorTp1aPosition?.x || 0, doorTp1aPosition?.y || 0);
			this.spatialTeleporter1b = new SpatialTeleporter(this, doorTp1bPosition?.x || 0, doorTp1bPosition?.y || 0);
			this.spatialTeleporter1a.setOpposite(this.spatialTeleporter1b);
			this.spatialTeleporter1b.setOpposite(this.spatialTeleporter1a);

			this.physics.add.collider(this.spatialTeleporter1a, this.groundLayer);
			this.physics.add.collider(this.spatialTeleporter1b, this.groundLayer);
			this.physics.add.collider(this.spatialTeleporter1a, this.platformsLayer);
			this.physics.add.collider(this.spatialTeleporter1b, this.platformsLayer);
		}
	}

	private addTps() {
		// TODO: refacto deeply DoubleTimeTeleporter
		const tp1aPosition = this.tilemap.findObject('tps', obj => obj.name === 'tp1a');
		const tp1bPosition = this.tilemap.findObject('tps', obj => obj.name === 'tp1b');
		if (tp1aPosition && tp1bPosition) {
			this.doubleTimeTeleporter1a = new DoubleTimeTeleporter(this, tp1aPosition?.x || 0, tp1aPosition?.y || 0);
			this.doubleTimeTeleporter1b = new DoubleTimeTeleporter(this, tp1bPosition?.x || 0, tp1bPosition?.y || 0);
			this.doubleTimeTeleporter1a.setOpposite(this.doubleTimeTeleporter1b);
			this.doubleTimeTeleporter1b.setOpposite(this.doubleTimeTeleporter1a);

			this.physics.add.collider(this.doubleTimeTeleporter1a, this.groundLayer);
			this.physics.add.collider(this.doubleTimeTeleporter1b, this.groundLayer);
			this.physics.add.collider(this.doubleTimeTeleporter1a, this.platformsLayer);
			this.physics.add.collider(this.doubleTimeTeleporter1b, this.platformsLayer);
		}
		// TODO: refacto deeply SimpleTimeTeleporter
		const tp2aPosition = this.tilemap.findObject('tps', obj => obj.name === 'tp2a');
		if (tp2aPosition) {
			this.simpleTimeTeleporter2a = new SimpleTimeTeleporter(this, tp2aPosition?.x || 0, tp2aPosition?.y || 0);
			
			this.physics.add.collider(this.simpleTimeTeleporter2a, this.groundLayer);
			this.physics.add.collider(this.simpleTimeTeleporter2a, this.platformsLayer);
		}

		const switcher1Position = this.tilemap.findObject('tp_switchers', obj => obj.name === 'switcher_1');
		if (switcher1Position) {
			this.switcher1 = this.add.sprite(switcher1Position?.x || 0, switcher1Position?.y || 0, 'switcher_red');
		}
		const switcher2Position = this.tilemap.findObject('tp_switchers', obj => obj.name === 'switcher_2');
		if (switcher2Position) {
			this.switcher2 = this.add.sprite(switcher2Position?.x || 0, switcher2Position?.y || 0, 'switcher_green');
		}
	}

	private initPastPlayers() {
		// at least on time teleporter is enough to generate a past player group
		if (this.doubleTimeTeleporter1a || this.simpleTimeTeleporter2a) {
			// TODO: refactor this part, condition is hard coded
			this.pastPlayersGroup = this.add.group();
			this.physics.add.collider(this.pastPlayersGroup, this.groundLayer);
			this.physics.add.collider(this.pastPlayersGroup, this.platformsLayer);
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
