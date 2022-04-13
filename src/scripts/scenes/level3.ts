import BaseLevel from './baseLevel';
import { SceneKey } from './index';

export default class Level3 extends BaseLevel {
	private firstTpTaken = false;
	private firstShotGun = false;
	constructor() {
		super(SceneKey.Level3, SceneKey.PreloadLevel4, 'level3');
	}

	create() {
		super.create();
		this.events.on('BaseLevel::firstTp', () => {
			if (!this.firstTpTaken) {
				this.firstTpTaken = true;
				this.startDialog(`ALERT ! ALERTE ! PARADOXE TEMPORELLE DÉTECTÉE ! PROTOCOLE DE SÉCURITÉ ENCLANCHÉ !
Pardon détective, je m'emporte. Il semblerait qu'il y ait eu comme un léger... bug...
Ces nouveaux types de portails sont encore en cours d'expérimentation. Pour accroître l'efficacité de notre technologie révolutionnaire, nous expérimentons la téléportation spatiale ET temporelle.
Durant votre téléportation, vous auriez dû faire un saut de 2 secondes dans le futur. Mais il semblerait que vous ayez fait un saut de 2 secondes DANS LE PASSÉ !
Ne me regardez pas comme ça détective, nous sommes un laboratoire d'expérimentations après tout !
Ce saut dans le temps a créé une paradoxe temporelle : comme vous pouvez le voir, votre ... vous du passé se trouve encore de l'autre côté du premier portail rouge.
Woooooh il semble très en colère lui aussi.
Notre protocole de sécurité implique de verrouiller la porte de sortie de cette salle. Si vous empruntez malgré tout cette porte, elle vous téléportera à l'entrée de la salle.
Nous débloqueront donc la sortie lorsque vous vous serez débarassé de votre vous du passé.
Oui, c'est un peu... radical. Mais les paradoxes temporelles sont bien pires qu'un petit meurtre, vous en conviendrez.
Pour vous servir de votre arme, appuyez sur ESPACE. Mais je ne vous apprends rien, détective.
Je vous laisse donc essayer votre arme de service.`
				);
			}
		});
		this.events.on('BaseLevel::firstShotGun', () => {
			if (this.firstTpTaken && !this.firstShotGun) {
				this.time.delayedCall(1000, () => {

					this.firstShotGun = true;
					this.startDialog(`Joli tir détective, je suis impressionné !
...
Oh j'oubliais, le bouton rouge que vous voyez là permet de désactiver les portails rouges. Une fois positionné devant, appuyez sur ENTRÉE pour activer le bouton.
...
...
Oui maintenant que j'y pense, nous aurions peut-être dû mettre des boutons rouges un peu partout. Je vais noter ça dans notre todo list.`
					);
				});
			}
		});
		this.addDialog(0,
			`Vous êtes vraiment un détective très intelligent, détective.
Dans cette salle, nous expérimentons un nouveau type de portails. Plus rapides, plus performants, plus cool !
En traversant le portail rouge en face de vous, vous allez être téléporté de l'autre côté du second portail rouge.
...
...
Faites-nous confiance, nous sommes des ingénieurs.`
		);
	}

	update() {
		super.update();
	}
}