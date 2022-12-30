export default class PastPlayer extends Phaser.Physics.Arcade.Sprite {
	isDead = false;
	private isDeadEventEmitted = false;
	private speedX: number;
	private speedY: number;
	private hasFx = true;


	constructor(scene: Phaser.Scene, x, y) {
		super(scene, x, y, 'player', 'idle-1');
		scene.add.existing(this);
		this.scene.physics.world.enable(this);
		this.setCollideWorldBounds(true);
		this.hasFx = this.scene.store.get('fx') ?? true;
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
					if (this.hasFx) {
						this.scene.sound.play('death');
					}
					this.anims.play('death', true);
					this.setVelocity(0);
				}
			}, undefined, this);
		}, this);

		this.scene.events.on('Store::fx', (isOn) => {
			this.hasFx = isOn;
		});
	}
	
	update() {
		// this.movePlayer();
		this.on('animationcomplete', () => {
			if (this.isDead && !this.isDeadEventEmitted) {
				this.anims.stop();
				this.scene.events.emit('PastPlayer::isDead');
				this.isDeadEventEmitted = true;
			}
		});
	}

	private init() {
		this.speedX = 180;
		this.speedY = 180;
		this.body.setSize(2);
	}
}
