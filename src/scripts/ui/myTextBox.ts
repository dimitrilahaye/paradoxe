import TextBox from 'phaser3-rex-plugins/templates/ui/textbox/TextBox';

export default class MyTextBox {
	private textBox: TextBox;
	get box(): TextBox {
		return this.textBox;
	}
	constructor(private scene: Phaser.Scene, private x: number, private y: number) {}

	public start (content) {
		const COLOR_PRIMARY = 0xffffff;
		const COLOR_LIGHT = 0x124E89;
		const wrapWidth = 425;
		const wrapHeight = 600;
		const fixedWidth = 425;
		const fixedHeight = 100;
		this.textBox = this.scene['rexUI'].add.textBox({
			x : this.x - 18,
			y: this.y - 60,
	
			background: this.createSpeechBubbleShape(this.scene, COLOR_PRIMARY, COLOR_LIGHT),
	
			icon: this.scene['rexUI'].add.roundRectangle(0, 0, 2, 2, 20, COLOR_LIGHT),
	
			text: this.getBBcodeText(this.scene, wrapWidth, wrapHeight, fixedWidth, fixedHeight),
	
			action: this.scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),
	
			space: {
				left: 20,
				right: 20,
				top: 20,
				bottom: 20,
				icon: 10,
				text: 10,
			}
		})
			.setOrigin(0)
			.layout();

		const ctx = this.textBox;

		this.scene.input.keyboard.on('keydown-ENTER', () => {
			if (this.textBox.isTyping) {
				this.textBox.stop(true);
			} else if (this.textBox.isLastPage) {
				this.destroy();
			} else {
				this.textBox.typeNextPage();
			}
		});

		this.scene.input.keyboard.on('keydown-ESC', () => {
			this.destroy();
		});
	
		this.textBox
			.setDepth(2)
			.setInteractive()
			.on('pageend', () => {
				const icon = (ctx.getElement('action') as Phaser.GameObjects.Sprite);
				if (ctx.isLastPage) {
					icon.setTexture('dialogEnd').setTint(COLOR_LIGHT);
				}
				icon.setVisible(true);
				ctx.resetChildVisibleState(icon);
				icon.y -= 30;
				this.scene.tweens.add({
					targets: icon,
					y: '+=30',
					ease: 'Bounce',
					duration: 500,
					repeat: 0,
					yoyo: false
				});
			});
	
		this.textBox.start(content, 50);
	}

	private destroy() {
		this.scene.input.keyboard.off('keydown-ENTER');
		this.scene.input.keyboard.off('keydown-ESC');
		this.textBox.destroy();
		this.scene.events.emit('MyTextBox::complete');
	}
	
	private getBBcodeText (scene, wrapWidth, wrapHeight, fixedWidth, fixedHeight) {
		return scene.rexUI.add.BBCodeText(0, 0, '', {
			fixedWidth: fixedWidth,
			fixedHeight: fixedHeight,

			color: 0x000000,
	
			fontSize: '20px',
			wrap: {
				mode: 'word',
				width: wrapWidth,
				height: wrapHeight,
			},
			maxLines: 4
		});
	}

	private createSpeechBubbleShape(scene, fillColor, strokeColor) {
		return scene.rexUI.add.customShapes({
			create: { lines: 1 },
			update: function () {
				const radius = 20;
				const indent = 15;
	
				const left = 0, right = this.width,
					top = 0, bottom = this.height, boxBottom = bottom - indent;
				this.getShapes()[0]
					.lineStyle(2, strokeColor, 1)
					.fillStyle(fillColor, 1)
					.startAt(left + radius, top).lineTo(right - radius, top).arc(right - radius, top + radius, radius, 270, 360)
					.lineTo(right, boxBottom - radius).arc(right - radius, boxBottom - radius, radius, 0, 90)
					.lineTo(left + 60, boxBottom).lineTo(left + 50, bottom).lineTo(left + 40, boxBottom)
					.lineTo(left + radius, boxBottom).arc(left + radius, boxBottom - radius, radius, 90, 180)
					.lineTo(left, top + radius).arc(left + radius, top + radius, radius, 180, 270)
					.close();
	
			}
		});
	}
}