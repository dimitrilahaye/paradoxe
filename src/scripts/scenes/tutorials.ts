import { LayerName, SceneKey } from '../types';
import BaseLevel from './baseLevel';

export default class Tutorials extends BaseLevel {
	private endTutorialsMessagePlayed = false;
	constructor() {
		super(SceneKey.Tutorials, SceneKey.StartScreen, 'tutorials');
	}

	create() {
		super.create();

		this.addDialog(0, this.translate.get(SceneKey.Tutorials, 0));
		this.addDialog(1, this.translate.get(SceneKey.Tutorials, 1));
		this.addDialog(2, this.translate.get(SceneKey.Tutorials, 2));
		this.addDialog(3, this.translate.get(SceneKey.Tutorials, 3));
		this.addDialog(4, this.translate.get(SceneKey.Tutorials, 4));
		this.addDialog(5, this.translate.get(SceneKey.Tutorials, 5));
		this.addDialog(6, this.translate.get(SceneKey.Tutorials, 6));
		this.addDialog(7, this.translate.get(SceneKey.Tutorials, 7));
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