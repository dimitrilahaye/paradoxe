import { Depth } from './../types';
export default class Score {
	private text: Phaser.GameObjects.Text;
	private score: number;

	constructor(
		private readonly scene: Phaser.Scene,
		private readonly x: number,
		private readonly y: number,
	) {
		const currentScore = scene.store.get<number>('score');
		this.score = currentScore ?? 0;
		this.create();
	}
    
	create() {
		this.updatetext();
		this.scene.events.on('Player::tps', () => {
			this.score++;
			this.scene.store.set('score', this.score);
			this.updatetext();
		});
	}

	private updatetext() {
		if (this.text) {
			this.text.destroy();
		}

		this.text = this.scene.add.text(
			Math.round(this.x),
			Math.round(this.y - 30),
			'SCORE:' + this.score,
			{
				fontFamily: 'Pixels',
				align: 'left',
			})
			.setScale(1)
			.setFontSize(30)
			.setResolution(10)
			.setOrigin(0.5, 0.5)
			.setColor('white')
			.setScrollFactor(0)
			.setDepth(Depth.UI);
	}
}
