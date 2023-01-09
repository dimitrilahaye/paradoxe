import { LayerName, SceneKey } from '../../types';
import BaseLevel from '../baseLevel';

export default class Scene extends BaseLevel {
	private endTutorialsMessagePlayed = false;
	private currentScoreFromLevels = 0;
	constructor() {
		super(SceneKey.Tutorials, SceneKey.StartScreen, 'tutorials');
	}
	
	create() {
		this.currentScoreFromLevels = this.store.get<number>('score') ?? 0;
		this.store.set('score', 0);
		super.create();

		this.addDialog(0, this.translate.get(SceneKey.Tutorials, 0));
		this.addDialog(1, this.translate.get(SceneKey.Tutorials, 1));
		this.addDialog(2, this.translate.get(SceneKey.Tutorials, 2));
		this.addDialog(3, this.translate.get(SceneKey.Tutorials, 3));
		this.addDialog(4, this.translate.get(SceneKey.Tutorials, 4));
		this.addDialog(5, this.translate.get(SceneKey.Tutorials, 5));
		this.addDialog(6, this.translate.get(SceneKey.Tutorials, 6));
		this.addDialog(7, this.translate.get(SceneKey.Tutorials, 7));

		this.events.on('ExitButton::exit', () => {
			this.restoreCurrentScoreFromLevels();
		});
		this.events.on('BaseLevel::End', () => {
			this.restoreCurrentScoreFromLevels();
		});
	}

	private restoreCurrentScoreFromLevels() {
		this.store.set('score', this.currentScoreFromLevels);
	}

	update(time: number, delta: number) {
		super.update(time, delta);

		const endTutorials = this.tilemap.findObject(LayerName.EVENTS, (obj) => obj.name === 'end_tutorials');
		if (!this.endTutorialsMessagePlayed && endTutorials && this.utils.coordinatesAreNear(endTutorials, this.player)) {
			this.endTutorialsMessagePlayed = true;
			this.player.pause();
			alert(this.translate.get(SceneKey.Tutorials, 8));
			this.time.delayedCall(500, () => {
				this.player.resume();
			});
		}
	}
}