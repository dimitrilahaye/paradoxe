import { Depth } from './../types';
import frameRate from '../decorators/frameRate';
import { PlayerDirection } from '../types';
import Player from './player';

export default class PastPlayer extends Phaser.Physics.Arcade.Sprite {
	isDead = false;
	private bullets: Phaser.Physics.Arcade.Group;
	private isDeadEventEmitted = false;
	private hasFx = true;
	private direction: PlayerDirection;
	private turnRight = true;
	private turnLeft = false;
	private canDetectPlayer = false;
	private hasDetected = false;

	constructor(scene: Phaser.Scene, x, y, private readonly player: Player) {
		super(scene, x, y, 'past_player', 'idle-1');
		scene.add.existing(this);
		this.scene.physics.world.enable(this);
		this.setCollideWorldBounds(true);
		this.hasFx = this.scene.store.get('fx') ?? true;
		this.direction = 'left';
		this.setDepth(Depth.PLAYER);
		this.create();
	}
	
	create() {
		this.init();
		this.scene.events.emit('PastPlayer::init');
		
		this.initBulletsGroups();

		this.anims.create({
			key: 'walk',
			frames: this.scene.anims.generateFrameNames('past_player', { prefix: 'walk-', start: 1, end: 6 }),
			frameRate: 5,
			repeat: -1,
		});
		this.anims.create({
			key: 'death',
			frames: this.scene.anims.generateFrameNames('past_player', { prefix: 'death-', start: 1, end: 5 }),
			frameRate: 5,
			repeat: 0,
		});
		this.anims.create({
			key: 'shot',
			frames: this.scene.anims.generateFrameNames('past_player', { prefix: 'shot-', start: 1, end: 3 }),
			frameRate: 5,
			repeat: 0,
		});

		this.anims.create({
			key: 'simple_gun_shot',
			frames: this.scene.anims.generateFrameNames('simple_gun_shot', { prefix: 'hits-1-', start: 2, end: 5 }),
			frameRate: 5,
			repeat: 0,
		});
		this.anims.create({
			key: 'simple_bullet',
			frames: this.scene.anims.generateFrameNames('simple_bullet', { prefix: 'simple-bullet-', start: 1, end: 4 }),
			frameRate: 5,
			repeat: -1,
		});

		this.scene.events.on('Player::shotBullet', (ball: Phaser.Physics.Arcade.Sprite, direction: 'left' | 'right') => {
			this.scene.physics.add.collider(this, ball, () => {
				ball.destroy();
				if (!this.isDead) {
					this.flipX = direction !== 'left';
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

		this.scene.events.on('Player::canDetect', () => {
			this.hasDetected = false;
		});

		this.scene.events.on('Store::fx', (isOn) => {
			this.hasFx = isOn;
		});
	}
	
	update() {
		this.on('animationcomplete', () => {
			if (this.isDead && !this.isDeadEventEmitted) {
				this.anims.stop();
				this.scene.events.emit('PastPlayer::isDead');
				this.isDeadEventEmitted = true;
			}
		});

		if (!this.isDead) {
			const distance = this.calculateDistanceWithPlayer();
			this.canDetectPlayer = distance < 150 && this.player.y === this.y;
			if (!this.canDetectPlayer) {
				this.hasDetected = false;
			}
			
			if (!this.hasDetected && this.canDetectPlayer) {
				this.detectPlayer();
			}
		}
	}

	private calculateDistanceWithPlayer() {
		const dx = this.x - this.player.x;
		const dy = this.y - this.player.y;

		const distance = Math.sqrt(dx * dx + dy * dy);
		return Math.abs(distance);
	}

	private detectPlayer() {
		if (!this.hasDetected && this.player.x < this.x) {
			this.turnLeft = true;
			this.turnRight = false;
			this.hasDetected = true;
			this.scene.time.delayedCall(2000, () => {
				if (!this.isDead && this.canDetectPlayer) {
					this.flipX = true;
					this.direction = 'right';
					this.hasDetected = false;
					this.shoot();
				}
			});
		}
		if (!this.hasDetected && this.player.x > this.x) {
			this.turnRight = true;
			this.turnLeft = false;
			this.hasDetected = true;
			this.scene.time.delayedCall(2000, () => {
				if (!this.isDead && this.canDetectPlayer) {
					this.flipX = false;
					this.direction = 'left';
					this.shoot();
					this.hasDetected = false;
				}
			});
		}
	}

	private shoot(): void {
		if (!this.isDead) {
			this.anims.play('shot');
			this.shotBullnetWithFrameRate();
		}
	}

	@frameRate(500)
	private shotBullnetWithFrameRate() {
		if (this.direction === 'right') {
			this.shotBullet(-500);
		}
		if (this.direction === 'left') {
			this.shotBullet(500);
		}
	}

	private initBulletsGroups() {
		this.bullets = this.scene.physics.add.group({
			defaultKey: 'simple_bullet',
			allowGravity: false,
			immovable: true,
			frameQuantity: 5,
		});
	}

	private shotBullet(velocity: number) {
		if (this.hasFx) {
			this.scene.sound.play('simple_gun_shot', { volume: 1 });
		}
		
		const shotX = this.direction === 'right' ? this.x - 12 : this.x + 12;
		const shotGun = this.scene.add.sprite(shotX, this.y, 'simple_gun_shot');
		
		shotGun.anims.play('simple_gun_shot');
		
		this.scene.time.delayedCall(50, () => {
			this.anims.stop();
			shotGun.destroy();
		});

		const ball = this.bullets.get(this.x, this.y);
		
		ball.anims.play('simple_bullet');
		
		ball.body.velocity.x = velocity;
		ball.checkWorldBounds = true;
		ball.outOfBoundsKill = true;
		this.scene.events.emit('PastPlayer::shotBullet', ball, this.direction);

		this.scene.time.delayedCall(500, () => {
			if (!this.isDead) {
				this.anims.stop();
				this.setTexture('past_player', 'idle-1');
			}
		});
	}

	private init() {
		this.body.setSize(2);
	}
}
