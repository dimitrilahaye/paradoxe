/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Coordinates, PlayerDirection } from '../types';

export default class Player extends Phaser.Physics.Arcade.Sprite {
	public enterActivate: boolean;
	public direction: PlayerDirection;

	private bullets: Phaser.Physics.Arcade.Group;
	private left: Phaser.Input.Keyboard.Key;
	private right: Phaser.Input.Keyboard.Key;
	private enter: Phaser.Input.Keyboard.Key;
	private shot: Phaser.Input.Keyboard.Key;
	private isMovable = true;
	private goLeft: boolean;
	private goRight: boolean;
	private isShooting: boolean;
	public speedX = 180;
	private nextFire = 0;
	private fireRate = 500;
	private nextWalkSound = 0;
	private walkSoundRate = 500;
	private nextActivability = 0;
	private activabilityRate = 500;
	private hasFx = true;
	private isDeadEventEmitted = false;
	private isDead = false;
	private isClimbing = false;
	private currentStairsClimbing: Phaser.Math.Vector2[];
	private currentstairsClimbingIndex = 0;
	private stairs: Phaser.Types.Tilemaps.TiledObject[];
	private stairsGroup: Phaser.Physics.Arcade.StaticGroup;

	constructor(scene: Phaser.Scene, x: number, y: number, stairs?: Phaser.Types.Tilemaps.TiledObject[]) {
		super(scene, x, y, 'player', 'idle-1');
		this.stairsGroup = this.scene.physics.add.staticGroup();
		this.stairs = stairs ?? [];
		this.hasFx = this.scene.store.get('fx') ?? true;
		scene.add.existing(this);
		this.scene.physics.world.enable(this);
		this.setCollideWorldBounds(true);
	}

	create() {
		this.initCharacs();
		this.initKeyboardInputs();
		this.initAnimations();
		this.initBulletsGroups();
		this.initStairs();

		this.listenToSpatialTeleporterEvents();
		this.listenToDoubleTimeTeleporterEvents();
		this.listenToSimpleTimeTeleporterEvents();
		this.listenToPastPlayerEvents();
		this.listenToStoreEvents();
	}

	update() {
		this.checkForStairsOverlapOut();
		this.on('animationcomplete', () => {
			if (this.isDead && !this.isDeadEventEmitted) {
				this.anims.stop();
				this.scene.events.emit('Player::isDead');
				this.isDeadEventEmitted = true;
			}
		});
		
		this.movePlayer();
		this.checkActions();
	}

	pause() {
		this.isMovable = false;
	}

	resume() {
		this.isMovable = true;
	}

	private listenToPastPlayerEvents() {
		this.scene.events.on('PastPlayer::shotBullet', (ball: Phaser.Physics.Arcade.Sprite, direction: PlayerDirection) => {
			this.scene.physics.add.collider(this, ball, () => {
				ball.destroy();
				if (!this.isDead) {
					this.isMovable = false;
					this.flipX = direction !== 'right';
					this.isDead = true;
					this.body.enable = false;
					if (this.hasFx) {
						this.scene.sound.play('death');
					}
					this.anims.play('death', true);
					this.setVelocity(0);
				}
			}, undefined, this);
		}, this);
	}

	private checkForStairsOverlapOut() {
		this.stairsGroup.children.entries.forEach(() => {
			if (this.isClimbing) {
				if (this.body.touching.none) {
					this.isClimbing = false;
					this.currentStairsClimbing = [];
					this.currentstairsClimbingIndex = 0;
				}
			}
		});
	}

	private initStairs() {
		this.scene.physics.add.overlap(this, this.stairsGroup, this.overlapStairs, undefined, this);

		if (this.stairs!.length > 0) {
			for (const stair of this.stairs!) {
				const start = { x: stair!.x, y: stair!.y };
				const poly = stair!.polyline![1];
				const end = { x: stair!.x! + poly.x!, y: stair!.y! + poly.y! };
				const curve = new Phaser.Curves.Line(
					new Phaser.Math.Vector2(start.x, start.y),
					new Phaser.Math.Vector2(end.x, end.y)
				);

				// utils
				// if (this.scene.game.config.physics.arcade?.debug) {
				// 	const graphics = this.scene.add.graphics();
				// 	graphics.lineStyle(1, 0xffffff, 1);
				// 	curve.draw(graphics);
				// }

				const oneStair = this.stairsGroup.create(curve.getBounds().x, curve.getBounds().y, undefined, undefined, false);
				oneStair.setScale(curve.getBounds().width / 32, curve.getBounds().height / 32);
				oneStair.setOrigin(0);
				oneStair.setDataEnabled();
				oneStair.setData('curve', curve);
				oneStair.body.width = curve.getBounds().width;
				oneStair.body.height = curve.getBounds().height;
				this.stairsGroup.refresh();
			}
		}
	}

	private overlapStairs(_, stair): void {
		if (!this.isClimbing) {
			const curve = stair.getData('curve');
			this.currentStairsClimbing = curve.getSpacedPoints(curve.getLength() / 7);
			this.isClimbing = true;
		}
	}

	private listenToStoreEvents() {
		this.scene.events.on('Store::fx', (isOn) => {
			this.hasFx = isOn;
		});
	}

	private initBulletsGroups() {
		this.bullets = this.scene.physics.add.group({
			defaultKey: 'simple_bullet',
			allowGravity: false,
			immovable: true,
			frameQuantity: 5,
		});
	}

	private initAnimations() {
		this.anims.create({
			key: 'walk',
			frames: this.scene.anims.generateFrameNames('player', { prefix: 'walk-', start: 1, end: 6 }),
			frameRate: 5,
			repeat: -1,
		});
		this.anims.create({
			key: 'death',
			frames: this.scene.anims.generateFrameNames('player', { prefix: 'death-', start: 1, end: 5 }),
			frameRate: 5,
			repeat: 0,
		});
		this.anims.create({
			key: 'shot',
			frames: this.scene.anims.generateFrameNames('player', { prefix: 'shot-', start: 1, end: 3 }),
			frameRate: 5,
			repeat: -1,
		});

		this.anims.create({
			key: 'simple_gun_shot',
			frames: this.scene.anims.generateFrameNames('simple_gun_shot', { prefix: 'hits-1-', start: 2, end: 5 }),
			frameRate: 5,
			repeat: 0,
		});
		this.scene.anims.create({
			key: 'simple_bullet',
			frames: this.scene.anims.generateFrameNames('simple_bullet', { prefix: 'simple-bullet-', start: 1, end: 4 }),
			frameRate: 5,
			repeat: -1,
		});
	}

	private listenToSimpleTimeTeleporterEvents() {
		this.scene.events.on('SimpleTimeTeleporter::activate', ({ x, y }: Coordinates) => {
			this.scene.events.emit('Player::tps');
			this.teleportOnCoordinates({ x, y });
		});
	}

	private listenToDoubleTimeTeleporterEvents() {
		this.scene.events.on('DoubleTimeTeleporter::activate', (_, { x, y }: Coordinates) => {
			this.scene.events.emit('Player::tps');
			this.teleportOnCoordinates({ x, y });
		});
	}

	private listenToSpatialTeleporterEvents() {
		this.scene.events.on('SpatialTeleporter::teleport', ({ x, y }: Coordinates) => {
			this.teleportOnCoordinates({ x, y });
		});
	}

	private teleportOnCoordinates({ x, y }: Coordinates) {
		const xDirection = this.direction === 'left' ? x - 10 : x + 10;
		this.setPosition(xDirection, y);
		this.scene.events.emit('Player::canDetect');
	}

	private checkActions() {
		if (this.isMovable) {
			if (this.enter.isDown) {
				if (this.scene.time.now > this.nextActivability) {
					this.nextActivability = this.scene.time.now + this.activabilityRate;
					this.enterActivate = true;
				}
			} else {
				this.enterActivate = false;
			}
			if (this.shot.isDown) {
				this.isShooting = true;
			} else {
				this.isShooting = false;
			}
			if (this.isShooting) {
				this.anims.play('shot');
				if (this.scene.time.now > this.nextFire) {
					this.nextFire = this.scene.time.now + this.fireRate;
					if (this.direction === 'left') {
						this.shotBullet(-500);
					}
					if (this.direction === 'right') {
						this.shotBullet(500);
					}
				}
			}
		} else {
			this.enterActivate = false;
			this.isShooting = false;
		}
	}

	private shotBullet(velocity: number) {
		if (this.hasFx) {
			this.scene.sound.play('simple_gun_shot', { volume: 1 });
		}
		
		const shotX = this.direction === 'left' ? this.x - 12 : this.x + 12;
		const shotGun = this.scene.add.sprite(shotX, this.y, 'simple_gun_shot');
		
		this.anims.play('simple_gun_shot');
		
		this.scene.time.delayedCall(50, () => {
			this.anims.stop();
			shotGun.destroy();
		});

		const ball = this.bullets.get(this.x, this.y);
		
		ball.anims.play('simple_bullet');
		
		ball.body.velocity.x = velocity;
		ball.checkWorldBounds = true;
		ball.outOfBoundsKill = true;
		this.scene.events.emit('Player::shotBullet', ball, this.direction);
	}

	private initCharacs() {
		this.body.setSize(2);
		this.direction = 'right';
	}

	private initKeyboardInputs() {
		this.left = this.scene.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.LEFT
		);
		this.right = this.scene.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.RIGHT
		);
		this.enter = this.scene.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.ENTER
		);
		this.shot = this.scene.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.SPACE
		);
	}

	protected intersectObjects(obj1: Phaser.GameObjects.Sprite, obj2: Phaser.Geom.Line): boolean {
		const LineToRectangle = Phaser.Geom.Intersects.LineToRectangle;

		return LineToRectangle(obj2, obj1.getBounds());
	}

	private movePlayer() {
		if (this.isMovable) {
			if (this.left.isDown) {
				this.goLeft = true;
			} else {
				this.goLeft = false;
			}
			if (this.right.isDown) {
				this.goRight = true;
			} else {
				this.goRight = false;
			}
		
			if (!this.isShooting) {
				if (this.goLeft || this.goRight) {
					this.playWalk();
				} else {
					if (!this.isDead) {
						this.playIdle();
					}
				}
				if (this.goLeft) {
					this.flipLeft();
					if (this.isClimbing) {
						this.climbOnLeftDirection();
					} else {
						this.setVelocityX(-this.speedX);
					}

				} else if (this.goRight) {
					this.flipRight();
					if (this.isClimbing) {
						this.climbOnRightDirection();
					} else {
						this.setVelocityX(this.speedX);
					}
				} else {
					this.setVelocityX(0);
				}
			} else {
				this.setVelocityX(0);
			}
		} else {
			if (!this.isDead) {
				this.playIdle();
			}
		}
	}

	private climbOnRightDirection() {
		this.setVelocityX(this.speedX / 2);
		if (this.currentstairsClimbingIndex + 1 <= this.currentStairsClimbing?.length) {
			const currentPosition = this.currentStairsClimbing[this.currentstairsClimbingIndex];
			this.currentstairsClimbingIndex++;
			this.setPosition(currentPosition.x, currentPosition.y);
		}
	}

	private climbOnLeftDirection() {
		this.setVelocityX(-this.speedX / 2);
		if (this.currentstairsClimbingIndex + 1 <= this.currentStairsClimbing?.length) {
			const currentPosition = this.currentStairsClimbing[this.currentStairsClimbing.length - 1 - this.currentstairsClimbingIndex];
			this.currentstairsClimbingIndex++;
			this.setPosition(currentPosition.x, currentPosition.y);
		}
	}

	private flipRight() {
		this.flipX = false;
		this.direction = 'right';
	}

	private flipLeft() {
		this.flipX = true;
		this.direction = 'left';
	}

	private playIdle() {
		this.setVelocityX(0);
		this.anims.stop();
		this.setTexture('player', 'idle-1');
	}

	private playWalk() {
		this.anims.play('walk', true);
		if (this.scene.time.now > this.nextWalkSound) {
			this.nextWalkSound = this.scene.time.now + this.walkSoundRate;
			if (this.hasFx) {
				this.scene.sound.play('walk');
			}
		}
	}
}
