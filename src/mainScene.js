//Entornos
import Volcan from './environments/Volcan.js';
import Espacio from './environments/Espacio.js'
import Muelle from './environments/Muelle.js'

//Objetos
import Sword from './objects/Sword.js';
import Coconut from './objects/Coconut.js';
import Fish from './objects/Fish.js';
import VolcanFireBall from './objects/VolcanFireBall.js';
import OVNI from './objects/OVNI.js';

//Personajes
import Trevor from './characters/Trevor.js';
import Arturo from './characters/Arturo.js';
import Azazel from './characters/Azazel.js';
import Shinji from './characters/Shinji.js';
import Arma from './characters/Arma.js';

//UI
import HUD from './ui/HUD.js';


const PLATFORMLAVA = 'platform'
const PLAYER = 'player'
var time = 3000;//Tiempo para caer primer objeto


export class MainScene extends Phaser.Scene {
    constructor() {//Le pasamos el mapa elegido ya sea int o string + jugador 1 + jugador 2
        super({ key: 'mainScene' })
        this.player1 = undefined;//Jugador 1
        this.player2 = undefined;//Jugador 2
        this.platforms = undefined;
        this.cursors = undefined;
        this.time = undefined;//Tiempo en el juego para poder pasarselo a otros objetos
        this.WIDTH = undefined; 
        this.HEIGHT = undefined; 
        this.HUD = undefined;
        this.score1 = undefined;
        this.score2 = undefined;
        this.posicionInicial1 = undefined; //Posiciones iniciales para llevarlos a esa posicion cuando mueren
        this.posicionInicial2 = undefined;
        this.alturaInicial = undefined;
        this.alturaVacio = 1000; // Altura en la que los personajes mueren por caerse al vacío
        this.tiempoObjeto = 10000 //Lapso de tiempo de aparicion de objetos
        this.Mapinfo = 0;
        this.p1info = 0;
        this.p2info = 3;
    }

    init(data) {
        this.Mapinfo = data.parametro0;
        this.p1info = data.parametro1;
        this.p2info = data.parametro2;
    }
    
    preload() {//Dependiendo de lo seleccionado cargamos una cosa u otra (mas adelante)

        //Personajes
        this.load.image('Arturo', './assets/img/arturoimages/arthur.png');
        this.load.image('Trevor', './assets/img/trevorimages/trevor.png');
        this.load.image('Azazel', './assets/img/azazelimages/azazzel.png');
        this.load.image('Shinji', './assets/img/shinjiimages/shinji.png');
        this.load.spritesheet('Trevornormalattack', './assets/img/trevorimages/ataqueLanza.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevorstrongattack', './assets/img/trevorimages/ataquePorra.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevoridle', './assets/img/trevorimages/Idle.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevorjump', './assets/img/trevorimages/Jump.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevorwalk', './assets/img/trevorimages/Run.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Arturonormalattack', './assets/img/arturoimages/ANA.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturostrongattack', './assets/img/arturoimages/ASA.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturoidle', './assets/img/arturoimages/Aidle.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturojump', './assets/img/arturoimages/Ajump.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturowalk', './assets/img/arturoimages/Arun.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Azazelnormalattack', './assets/img/azazelimages/Attack.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Azazelstrongattack', './assets/img/azazelimages/Attack.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Azazelidle', './assets/img/azazelimages/Idle.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Azazelwalk', './assets/img/azazelimages/Move.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('AzazelBall', './assets/img/azazelimages/AzazelBall.png', { frameWidth: 498, frameHeight: 498 });
        this.load.spritesheet('Shinjiidle', './assets/img/shinjiimages/Idle.png', { frameWidth: 59, frameHeight: 85 });
        this.load.spritesheet('Shinjiwalk', './assets/img/shinjiimages/rungood.png', { frameWidth: 44, frameHeight: 85 });
        this.load.spritesheet('Shinjijump', './assets/img/shinjiimages/Jump.png', { frameWidth: 61, frameHeight: 77 });
        this.load.spritesheet('Shinjistrongattack', './assets/img/shinjiimages/Strong.png', { frameWidth: 63, frameHeight: 87 });
        this.load.spritesheet('Shinjinormalattack', './assets/img/shinjiimages/Normal.png', { frameWidth: 62, frameHeight: 69 });
        switch (this.Mapinfo) {
            case 0:
                this.load.spritesheet('Volcan', './assets/img/fondosimages/Volcan.png', { frameWidth: 800, frameHeight: 336 });//Fondo volcan
                this.load.spritesheet('VFB', './assets/img/objimages/VFB.png', { frameWidth: 32, frameHeight: 67 });//Bola de fuego volcan
                this.load.spritesheet('Explosion', './assets/img/objimages/explosionFB.png', { frameWidth: 247, frameHeight: 240 });//explosion bola de fuego
                this.load.image(PLATFORMLAVA, './assets/img/fondosimages/lavaPlat.png');//Plataforma lava
                break
            case 1:
                this.load.image('OVNI', './assets/img/objimages/ovniimage.png');//Ovni volador
                this.load.spritesheet('Espacio', '../assets/img/fondosimages/espacio.png', { frameWidth: 768, frameHeight: 432 });//Fondo Espacio
                this.load.image('platformMetal', './assets/img/fondosimages/Plat2.png');
                this.load.image('laser', './assets/img/objimages/laser.png');//laser
                break
            case 2:
                this.load.spritesheet('Fish', './assets/img/objimages/pezimage.png', { frameWidth: 500, frameHeight: 659 });//Pez
                this.load.spritesheet('Muelle', '../assets/img/fondosimages/lago1.png', { frameWidth: 720, frameHeight: 405 });//Fondo Muelle
                this.load.image('wood', './assets/img/fondosimages/madera.jpg');
                break
            case 3:
                this.load.image('Sword', './assets/img/objimages/swordimage.png');//Espada
                this.load.spritesheet('Castillo', './assets/img/fondosimages/castillo.jpg', { frameWidth: 1071, frameHeight: 600 });//Fondo castillo
                this.load.image('background', './assets/img/fondosimages/castillo.jpg');//Fondo castillo
                break
            case 4:
                this.load.spritesheet('Jungla', './assets/img/fondosimages/jungla.png', { frameWidth: 800, frameHeight: 650 });//Fondo Jungla
                this.load.image('Coconut', './assets/img/objimages/cocoimage.png');//Coco
                break
            default:
                break;
        }
        this.load.atlas('flares', 'assets/img/flares.png', 'assets/img/flares.json');//particulas
        //UI
        this.load.image('Borde', './assets/img/uiimages/border.png');
        this.load.image('BordePoder', './assets/img/uiimages/barrapoder.png');

    }

    create() {//asignamos player1 y player 2
        this.HEIGHT = this.sys.game.canvas.height;
        this.WIDTH = this.sys.game.canvas.width;
        this.posicionInicial1 = this.WIDTH / 4;
        this.posicionInicial2 = this.WIDTH - this.WIDTH / 4;
        this.alturaInicial = this.HEIGHT / 2;
        this.alturaVacio = this.HEIGHT;
        //new Volcan(this, 600, 300).setScale(1.7, 1.8);
        //new Espacio(this, 600, 300).setScale(1.6, 1.4);
        //new Muelle(this, 600, 350).setScale(1.8, 1.7);
        //this.add.existing(new Phaser.GameObjects.Sprite(this, 600, 300, 'Castillo')).setScale(1.2, 1);
        //this.background = this.add.image(400, 300, 'background');
        this.platforms = this.createPlatforms();
        this.score1 = 2;
        this.score2 = 1;//Marcador de la partida
        console.log(this.Mapinfo,this.p1info,this.p2info)
        switch (this.Mapinfo) {
            case 0:
                new Volcan(this, 600, 300).setScale(1.7, 1.8);
                break
            case 1:
                new Espacio(this, 600, 300).setScale(1.6, 1.4);
                new OVNI(this, this.WIDTH / 3, this.HEIGHT / 10, this.player1, this.player2, 4000);
                new OVNI(this, this.WIDTH, this.HEIGHT / 10, this.player1, this.player2, 3500);
                break
            case 2:
                new Muelle(this, 600, 350).setScale(1.8, 1.7);
                break
            case 3:
                this.add.existing(new Phaser.GameObjects.Sprite(this, 600, 300, 'Castillo')).setScale(1.2, 1);
                break
            case 4:
                this.background = this.add.image(400, 300, 'background');
                break
            default:
                break;
        }
        switch (this.p1info) {
            case 0:
                this.player1 = new Arturo(this, this.posicionInicial1, this.alturaInicial, this.platforms, this.HUD, this.player2, 1);
                break
            case 1:
                this.player1 = new Azazel(this, this.posicionInicial1, this.alturaInicial, this.platforms, this.HUD, this.player2, 1);
                break
            case 2:
                this.player1 = new Trevor(this, this.posicionInicial1, this.alturaInicial, this.player2, this.platforms);  
                break
            case 3:
                this.player1 = new Shinji(this, this.posicionInicial1, this.alturaInicial, this.platforms, this.HUD, this.player2, 1);
                break
            default:
                break;
        }
        switch (this.p2info) {
            case 0:
                this.player2 = new Arturo(this, this.posicionInicial2, this.alturaInicial, this.platforms, this.HUD, this.player1, 2);
                break
            case 1:
                this.player2 = new Azazel(this, this.posicionInicial2, this.alturaInicial, this.platforms, this.HUD, this.player1, 2);
                break
            case 2:
                this.player2 = new Trevor(this, this.posicionInicial2, this.alturaInicial, this.player1, this.platforms);
                break
            case 3:
                this.player2 = new Shinji(this, this.posicionInicial2, this.alturaInicial, this.platforms, this.HUD, this.player1, 2);
                break
            default:
            break;
        }
        //this.player1 = new Trevor(this, 500, 300, this.player2, this.platforms);  
        //this.player2 = new Arturo(this, this.posicionInicial1, this.alturaInicial, this.platforms, this.HUD, this.player1, 2);
        //this.player1 = new Azazel(this, this.posicionInicial2, this.alturaInicial, this.platforms, this.player2, this.HUD, 1);
        /*this.player2 = new Shinji(this, this.WIDTH / 4, this.HEIGHT / 2, this.player1, this.platforms);*/
        this.HUD = new HUD(this, 0, 0, this.player1, this.player2, this.score1, this.score2);
        this.player1.HUD = this.HUD;
        this.player2.HUD = this.HUD;
        this.player1.player2 = this.player2;
        this.player1.playeropuesto = this.player2;
        //this.OVNI = new OVNI(this, this.WIDTH / 3, this.HEIGHT / 10, this.player1, this.player2, 4000);
        //new OVNI(this, this.WIDTH, this.HEIGHT / 10, this.player1, this.player2, 3500);
    }
    update(t) {
        this.time = t;

        if (t > time) {//Se genera el objeto 
            time += this.tiempoObjeto;
            this.creaObjeto();
        }
        
        this.HUD.update();

        if (this.score1 === 3 || this.score2 === 3) {
            this.termina();
        }
    }

    hitPlayer(player, damage) {
        if (player.name == this.HUD.player2.name) this.HUD.BarraDeVida2.decrease(damage);
        else if (player.name = this.HUD.player1.name) this.HUD.BarraDeVida1.decrease(damage);
        if (player.name === 'Arturo') player.boolPoder = 0;
        player.vida -= damage;
    }
    createPlatforms() {//Crea la plataforma
        let platforms = this.physics.add.staticGroup();
        switch (this.Mapinfo) {
            case 0:
                platforms.create(this.WIDTH / 2, this.HEIGHT - (this.HEIGHT / 10), PLATFORMLAVA).setScale(2, 2).refreshBody();
                platforms.create(this.WIDTH - this.WIDTH / 5, this.HEIGHT - (this.HEIGHT / 15), PLATFORMLAVA).setScale(2, 2).refreshBody();
                platforms.create(this.WIDTH / 5, this.HEIGHT - (this.HEIGHT / 15), PLATFORMLAVA).setScale(2, 2).refreshBody();
                break
            case 1:
                platforms.create(this.WIDTH / 2, this.HEIGHT / 0.95, 'platformMetal').setScale(1.5, 1.5).setFlip(true, true).refreshBody();
                platforms.create(this.WIDTH / 5, this.HEIGHT / 1.5, 'platformMetal').setScale(0.3, 0.3).refreshBody();
                platforms.create(this.WIDTH / 1.25, this.HEIGHT / 1.5, 'platformMetal').setScale(0.3, 0.3).refreshBody();
                platforms.create(this.WIDTH / 2, this.HEIGHT / 1.7, 'platformMetal').setScale(0.3, 0.3).refreshBody();
                break
            case 2:
                platforms.create(this.WIDTH / 6, this.HEIGHT / 1.4, 'wood').setScale(0.4, 0.5).refreshBody();
        platforms.create(this.WIDTH / 2.5, this.HEIGHT / 1.4, 'wood').setScale(0.4, 0.5).refreshBody();
        platforms.create(this.WIDTH / 1.7, this.HEIGHT / 1.4, 'wood').setScale(0.4, 0.5).refreshBody();
        platforms.create(this.WIDTH / 1.2, this.HEIGHT / 1.4, 'wood').setScale(0.4, 0.5).refreshBody();
        platforms.create(this.WIDTH / 1.25, this.HEIGHT / 4, 'wood').setScale(0.8, 0.5).refreshBody();
        platforms.create(this.WIDTH / 1.8, this.HEIGHT / 2.3, 'wood').setScale(0.2, 0.2).refreshBody();
        platforms.create(this.WIDTH / 2.5, this.HEIGHT / 2, 'wood').setScale(0.2, 0.2).refreshBody();
                break
            case 3:
                //this.add.existing(new Phaser.GameObjects.Sprite(this, 600, 300, 'Castillo')).setScale(1.2, 1);
                break
            case 4:
                //this.background = this.add.image(400, 300, 'background');
                break
        }
        return platforms;

    }
    creaObjeto() {//Funcion para crear los objetos que caen, se pondran ifs dentro para luego seleccionar el correspondiente de la escena
        var value = Phaser.Math.Between(2, 11) * 100;//posicion desde donde cae
        switch (this.Mapinfo) {
            case 0:
                new VolcanFireBall(this, value, -300, value, this.player);//Bolas de fuego
                break
            case 1:
                //this.OVNI = new OVNI(this, this.WIDTH / 3, this.HEIGHT / 10, this.player1, this.player2);
                break
            case 2:
                new Fish(this, value, 800, this.player1, this.player2, this.time);//Peces
                break
            case 3:
                new Sword(this, value, -300, this.player1, this.player2, this.platforms, this.time);//Espadas
                break
            case 4:
                new Coconut(this, value, -300, this.player1, this.player2, this.platforms, this.time);
                break
            default:
                break;
        }

    }
    
    terminaJuego() {

    }
   
   
}

