import frameRate from '../../decorators/frameRate';
import { SceneKey } from '../../types';

enum MainMenu {
	TUTORIALS, NEWGAME, CONTINUE, OPTIONS,
}
enum OptionsMenu {
	MUSIC, FX, FULLSCREEN, BACK,
}

export default abstract class Scene extends Phaser.Scene {
	tutorialsButton: Phaser.GameObjects.Text;
	newGameButton: Phaser.GameObjects.Text;
	continueButton: Phaser.GameObjects.Text;
	optionsButton: Phaser.GameObjects.Text;
	container: Phaser.GameObjects.Container;
	currentButtonIndex: number;
	currentSelectedButton: Phaser.GameObjects.GameObject;
	cursor: Phaser.GameObjects.Image;
	up: Phaser.Input.Keyboard.Key;
	down: Phaser.Input.Keyboard.Key;
	left: Phaser.Input.Keyboard.Key;
	right: Phaser.Input.Keyboard.Key;
	enter: Phaser.Input.Keyboard.Key;
	hasFx: boolean;
	hasMusic: boolean;
	music: Phaser.Sound.BaseSound;
	menu: 'main_menu' | 'options_menu';
	musicButton: Phaser.GameObjects.Text;
	fxButton: Phaser.GameObjects.Text;
	backButton: Phaser.GameObjects.Text;
	musicHasBeenPlayed: boolean;
	fullScreenButton: Phaser.GameObjects.Text;

	constructor() {
		super({ key: SceneKey.StartScreen });
	}

	preload() {
		this.load.json('translations', 'assets/json/options/translations.json');
		this.load.image('logo', 'assets/img/logo.png');
		this.load.image('right', 'assets/img/ui/right.png');
		this.load.audio('switcher', 'assets/sounds/switcher.wav');
		this.load.audio('levels', 'assets/sounds/levels.wav');
		this.load.audio('door_open', 'assets/sounds/door_open.wav');
	}
	
	create() {
		const { x, y } = this.utils.getMiddleSceneCoordinates();
		this.add.image(x, y - 70, 'logo').setScale(0.2);
		
		this.hasFx = this.store.get<boolean>('fx') ?? true;
		this.hasMusic = this.store.get<boolean>('music') ?? true;
		// todo idem for dialogs

		this.music = this.sound.add('levels');
		this.launchMusic();

		this.events.on('Store::fx', (isOn) => {
			this.hasFx = isOn;
		});
		this.events.on('Store::music', (isOn) => {
			this.hasMusic = isOn;
			if (!this.hasMusic) {
				this.music.pause();

				return;
			}
			this.launchMusic();
		});
		// todo idem for dialogs
		
		this.showMainMenu();

		this.up = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.UP
		);
		this.down = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.DOWN
		);
		this.left = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.LEFT
		);
		this.right = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.RIGHT
		);
		this.enter = this.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.ENTER
		);
	}

	update() {
		this.moveCursor();
		if (this.menu === 'main_menu') {
			this.selectInMainMenu();
		}
		if (this.menu === 'options_menu') {
			this.selectInOptionsMenu();
		}
	}

	private launchMusic(): void {
		if (this.hasMusic && !this.music.isPlaying) {
			if (!this.musicHasBeenPlayed) {
				this.musicHasBeenPlayed = true;
				this.music.play({
					loop: true,
					volume: 0.1,
				});
			} else {
				this.music.resume();
			}
		}
	}
	
	@frameRate(130)
	private selectInMainMenu() {
		if (this.enter.isDown) {
			if (this.hasFx) {
				this.sound.play('door_open');
			}
			switch (this.currentButtonIndex) {
			case MainMenu.TUTORIALS:
				this.music.stop();
				this.scene.start(SceneKey.PreloadTutorials);
				break;
			case MainMenu.NEWGAME:
				this.music.stop();
				this.store.set('score', 0);
				this.scene.start(SceneKey.PreloadLevel1);
				break;
			case MainMenu.CONTINUE: {
				if (!this.continueButton) {
					this.time.delayedCall(500, () => {
						this.showOptionsMenu();
					});

					break;
				}
				const level = this.store.get<SceneKey>('level');
				if (level) {
					this.music.stop();
					this.scene.start(level);
				}
				break;
			}
			case MainMenu.OPTIONS:
				this.time.delayedCall(500, () => {
					this.showOptionsMenu();
				});
				break;
			}
		}
	}
	
	// todo add lang and dialogs
	@frameRate(130)
	private selectInOptionsMenu() {
		if (this.enter.isDown) {
			if (this.hasFx) {
				this.sound.play('door_open');
			}
			switch (this.currentButtonIndex) {
			case OptionsMenu.MUSIC:{
				this.store.set('music', !this.hasMusic);
				this.musicButton.setAlpha(this.hasMusic ? 1 : 0.5);
				break;
			}
			case OptionsMenu.FX:
				this.store.set('fx', !this.hasFx);
				this.fxButton.setAlpha(this.hasFx ? 1 : 0.5);
				break;
			case OptionsMenu.FULLSCREEN:
				if (this.scale.isFullscreen) {
					this.scale.stopFullscreen();
					this.fullScreenButton.setAlpha(0.5);
				} else {
					this.scale.startFullscreen();
					this.fullScreenButton.setAlpha(1);
				}
				break;
			case OptionsMenu.BACK: 
				this.time.delayedCall(500, () => {
					this.showMainMenu();
				});
				break;
			}
		}
	}
	
	private showMainMenu() {
		this.destroyOptionsMenu();
		this.cursor?.destroy();
		this.container?.destroy();
		this.menu = 'main_menu';
		this.currentButtonIndex = 0;
		const { x, y } = this.utils.getMiddleSceneCoordinates();
		this.tutorialsButton = this.addText(x, y - 30, 'TUTORIALS');
		this.newGameButton = this.addText(x, y, 'NEW GAME');
		const content: Phaser.GameObjects.GameObject[] = [];
		content.push(this.tutorialsButton, this.newGameButton);
		const level = this.store.get<SceneKey>('level');
		if (level) {
			this.continueButton = this.addText(x, y + 30, 'CONTINUE');
			content.push(this.continueButton);
		}
		this.optionsButton = this.addText(x, y + (!this.continueButton ? 30 : 60), 'OPTIONS');
		content.push(this.optionsButton);
		this.container = this.add.container(0, 0, content);
		this.createCursor();
	}

	private showOptionsMenu(): void {
		this.destroyMainMenu();
		this.cursor?.destroy();
		this.container?.destroy();
		this.menu = 'options_menu';
		this.currentButtonIndex = 0;
		const { x, y } = this.utils.getMiddleSceneCoordinates();
		this.musicButton = this.addText(x, y - 30, 'MUSIC').setAlpha(this.hasMusic ? 1 : 0.5);
		this.fxButton = this.addText(x, y, 'FX').setAlpha(this.hasFx ? 1 : 0.5);
		this.fullScreenButton = this.addText(x, y + 30, 'FULL SCREEN').setAlpha(this.scale.isFullscreen ? 1 : 0.5);
		this.backButton = this.addText(x, y + 60, 'BACK');
		const content: Phaser.GameObjects.GameObject[] = [];
		content.push(this.musicButton, this.fxButton, this.fullScreenButton, this.backButton);
		this.container = this.add.container(0, 0, content);
		this.createCursor();
	}

	private destroyMainMenu(): void {
		this.tutorialsButton?.destroy();
		this.newGameButton?.destroy();
		this.continueButton?.destroy();
		this.optionsButton?.destroy();
	}

	private destroyOptionsMenu(): void {
		this.musicButton?.destroy();
		this.fxButton?.destroy();
		this.backButton?.destroy();
	}

	private createCursor(): void {
		this.currentSelectedButton = this.container.getAt(this.currentButtonIndex);
		const { x: bx, y: by, width } = this.currentSelectedButton as Phaser.GameObjects.Text;
		this.cursor = this.add.image(bx - width, by, 'right').setScale(0.3);
	}

	@frameRate(130)
	private moveCursor(): void {
		if (this.up.isDown || this.down.isDown) {
			if (this.hasFx) {
				this.sound.play('switcher');
			}
		}
		
		if (this.up.isDown) {
			if (this.currentButtonIndex >= 1) {
				this.currentButtonIndex--;
			} else {
				this.currentButtonIndex = this.container.length - 1;
			}
		} else if (this.down.isDown) {
			if (this.currentButtonIndex < this.container.length - 1) {
				this.currentButtonIndex++;
			} else {
				this.currentButtonIndex = 0;
			}
		}

		this.currentSelectedButton = this.container.getAt(this.currentButtonIndex);
		const { x: bx, y: by, width } = this.currentSelectedButton as Phaser.GameObjects.Text;
		this.cursor.setPosition(bx - width, by);
	}

	private addText(x: number, y: number, text: string): Phaser.GameObjects.Text {
		return this.add.text(
			Math.round(x),
			Math.round(y),
			text,
			{
				fontFamily: 'Pixels',
				align: 'center',
			}).setScale(1).setFontSize(15).setResolution(10).setOrigin(0.5, 0.5).setColor('white');
	}
}
