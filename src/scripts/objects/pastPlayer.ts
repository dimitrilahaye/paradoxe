export default class PastPlayer extends Phaser.Physics.Arcade.Sprite {
	left: Phaser.Input.Keyboard.Key;
	right: Phaser.Input.Keyboard.Key;
	up: Phaser.Input.Keyboard.Key;
	down: Phaser.Input.Keyboard.Key;
	goLeft: boolean;
	goRight: boolean;
	goUp: boolean;
	goDown: boolean;
	speedX: number;
	speedY: number;
	noiseDone: boolean;
	noiseCircle: Phaser.GameObjects.Arc;
	enter: Phaser.Input.Keyboard.Key;
	enterActivate: boolean;
	isDead = false;


	constructor(scene: Phaser.Scene, x, y) {
		super(scene, x, y, 'player', 'idle-1');
		scene.add.existing(this);
		this.scene.physics.world.enable(this);
		this.setCollideWorldBounds(true);
	}
	
	create() {
		this.init();
		this.scene.events.emit('PastPlayer::init');

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

		this.scene.events.on('Player::shotBullet', (ball: Phaser.Physics.Arcade.Sprite, direction: 'left' | 'right') => {
			this.scene.physics.add.collider(this, ball, () => {
				ball.destroy();
				if (!this.isDead) {
					this.flipX = direction !== 'left';
					this.isDead = true;
					this.body.enable = false;
					this.scene.sound.play('death');
					this.anims.play('death', true);
					this.setVelocity(0);
				}
			}, undefined, this);
		}, this);
	}
	
	update() {
		// this.movePlayer();
		this.on('animationcomplete', () => {
			if (this.isDead) {
				this.anims.stop();
				this.scene.events.emit('PastPlayer::isDead');
			}
		});
	}

	private init() {
		this.speedX = 180;
		this.speedY = 180;
		this.body.setSize(2);
	}

	private movePlayer() {
		if (this.goLeft || this.goRight) {
			this.anims.play('walk', true);
		} else {
			this.anims.stop();
			this.setTexture('player', 'idle-1');
		}

		if (this.goLeft) {
			this.flipX = true;
			this.setVelocityX(-this.speedX);
		} else if (this.goRight) {
			this.flipX = false;
			this.setVelocityX(this.speedX);
		} else {
			this.setVelocityX(0);
		}
	}
}
