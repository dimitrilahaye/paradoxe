/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Coordinates } from '../types';

export default class Player extends Phaser.Physics.Arcade.Sprite {
	private bullets: Phaser.Physics.Arcade.Group;
	private left: Phaser.Input.Keyboard.Key;
	private right: Phaser.Input.Keyboard.Key;
	private enter: Phaser.Input.Keyboard.Key;
	private shot: Phaser.Input.Keyboard.Key;

	private isMovable = true;
	private goLeft: boolean;
	private goRight: boolean;
	private isShooting: boolean;
	
	private speedX = 180;
	private nextFire = 0;
	private fireRate = 500;
	private nextWalkSound = 0;
	private walkSoundRate = 500;
	private nextActivability = 0;
	private activabilityRate = 500;
	private hasFx = true;
	
	public enterActivate: boolean;
	public direction: 'left' | 'right';

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, 'player', 'idle-1');
		scene.add.existing(this);
		this.scene.physics.world.enable(this);
		this.setCollideWorldBounds(true);
		this.hasFx = this.scene.store.get('fx') ?? true;
	}

	create() {
		this.initCharacs();

		this.initKeyboardInputs();

		this.listenToSpatialTeleporterEvents();

		this.listenToDoubleTimeTeleporterEvents();

		this.listenToSimpleTimeTeleporterEvents();
		
		this.initAnimations();
		
		this.initBulletsGroups();

		this.listenToStoreEvents();
	}

	update() {
		this.movePlayer();
		this.checkActions();
	}

	pause() {
		this.isMovable = false;
	}

	resume() {
		this.isMovable = true;
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
			repeat: -1,
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
					this.anims.play('walk', true);
					if (this.scene.time.now > this.nextWalkSound) {
						this.nextWalkSound = this.scene.time.now + this.walkSoundRate;
						if (this.hasFx) {
							this.scene.sound.play('walk');
						}
					}
				} else {
					this.anims.stop();
					this.setTexture('player', 'idle-1');
				}
				if (this.goLeft) {
					this.flipX = true;
					this.setVelocityX(-this.speedX);
					this.direction = 'left';
				} else if (this.goRight) {
					this.flipX = false;
					this.setVelocityX(this.speedX);
					this.direction = 'right';
				} else {
					this.setVelocityX(0);
				}
			} else {
				this.setVelocityX(0);
			}
		} else {
			this.setVelocityX(0);
			this.anims.stop();
			this.setTexture('player', 'idle-1');
		}
	}
}
