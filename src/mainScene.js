import VolcanFireBall from './VolcanFireBall.js';
import Volcan from './Volcan.js';
import Sword from './Sword.js';
import Coconut from './Coconut.js';
import Fish from './Fish.js';
import Trevor from './Trevor.js';
import Arturo from './Arturo.js';
import Azazel from './Azazel.js';
import HUD from './HUD.js';

const PLATFORMLAVA = 'platform'
const PLAYER = 'player'
var time = 3000;//Tiempo para caer primer objeto


export class MainScene extends Phaser.Scene {
    constructor(map, player1GO, player2GO) {//Le pasamos el mapa elegido ya sea int o string + jugador 1 + jugador 2
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
        
    }
    
    preload() {//Dependiendo de lo seleccionado cargamos una cosa u otra (mas adelante) 
        this.load.image('Borde', './Ego-Battle/assets/img/border.png');
        this.load.image('BordePoder', './Ego-Battle/assets/img/barrapoder.png');
        this.load.image('Arturo', './Ego-Battle/assets/img/Arturo/arthur.png');
        this.load.image('Trevor', './Ego-Battle/assets/img/Trevor/trevor.png');
        this.load.image('Azazel', './Ego-Battle/assets/img/Azazel/azazzel.png');
        this.load.image('Shinji', './Ego-Battle/assets/img/Shinji/shinji.png');
        this.load.image('background', './Ego-Battle/assets/img/fondos/castillo.jpg');//Fondo castillo
        this.load.image(PLATFORMLAVA, './Ego-Battle/assets/img/lavaPlat.png');//Plataforma lava
        this.load.image('Sword', './Ego-Battle/assets/img/Sword.png');//Espada
        this.load.image('Coconut', './Ego-Battle/assets/img/coco.png');//Coco
        this.load.spritesheet('VFB', './Ego-Battle/assets/img/VFB.png', { frameWidth: 32, frameHeight: 67 });//Bola de fuego volcan
        this.load.spritesheet('Fish', './Ego-Battle/assets/img/Pez.png', { frameWidth: 500, frameHeight: 659 });//Pez
        this.load.spritesheet('Volcan', './Ego-Battle/assets/img/fondos/Volcan.png', { frameWidth: 800, frameHeight: 336 });//Fondo volcan
        this.load.spritesheet('Castillo', './Ego-Battle/assets/img/fondos/castillo.jpg', { frameWidth: 1071, frameHeight: 600 });//Fondo castillo
       /* this.load.spritesheet('Espacio', '../assets/img/fondos/Espacio.png', { frameWidth: 768, frameHeight: 432 });//Fondo Espacio*/
        /*this.load.spritesheet('Muelle', '../assets/img/fondos/fondo.png', { frameWidth: 720, frameHeight: 405 });//Fondo Muelle*/
        this.load.spritesheet('Jungla', './Ego-Battle/assets/img/fondos/jungla.png', { frameWidth: 800, frameHeight: 650 });//Fondo Jungla
        this.load.spritesheet('Explosion', './Ego-Battle/assets/img/explosionFB.png', { frameWidth: 247, frameHeight: 240 });//explosion bola de fuego
        this.load.spritesheet('Trevornormalattack', './Ego-Battle/assets/img/Trevor/ataqueLanza.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevorstrongattack', './Ego-Battle/assets/img/Trevor/ataquePorra.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevoridle', './Ego-Battle/assets/img/Trevor/Idle.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevorjump', './Ego-Battle/assets/img/Trevor/Jump.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevorwalk', './Ego-Battle/assets/img/Trevor/Run.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Arturonormalattack', './Ego-Battle/assets/img/Arturo/ANA.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturostrongattack', './Ego-Battle/assets/img/Arturo/ASA.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturoidle', './Ego-Battle/assets/img/Arturo/Aidle.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturojump', './Ego-Battle/assets/img/Arturo/Ajump.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturowalk', './Ego-Battle/assets/img/Arturo/Arun.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Azazelnormalattack', './Ego-Battle/assets/img/Azazel/Attack.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Azazelstrongattack', './Ego-Battle/assets/img/Azazel/Attack.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Azazelidle', './Ego-Battle/assets/img/Azazel/Idle.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Azazelwalk', './Ego-Battle/assets/img/Azazel/Move.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('AzazelBall', './Ego-Battle/assets/img/AzazelBall.png', { frameWidth: 498, frameHeight: 498 });
        //this.loadFont('font', 'fonts/ka1.ttf');//Font del marcador
    }

    create() {//asignamos player1 y player 2
        this.HEIGHT = this.sys.game.canvas.height;
        this.WIDTH = this.sys.game.canvas.width;
        /*new Volcan(this, 600, 300).setScale(1.7, 1.8);*/       
        this.add.existing(new Phaser.GameObjects.Sprite(this, 600, 300, 'Castillo')).setScale(1.2, 1);
        //this.background = this.add.image(400, 300, 'background');
        this.platforms = this.createPlatforms();
        this.cursors = this.input.keyboard.createCursorKeys();//Teclas
        this.score1 = 2;
        this.score2 = 1;//Marcador de la partida
        //this.player1 = new Trevor(this, 500, 300, this.player, this.platforms);  
        this.player2 = new Arturo(this, this.WIDTH - this.WIDTH / 4, this.HEIGHT / 2, this.platforms, this.HUD, this.player1);
        this.player1 = new Azazel(this, this.WIDTH / 4, this.HEIGHT / 2, this.platforms, this.player2, this.HUD);
        
        this.HUD = new HUD(this, 0, 0, this.player1, this.player2, this.score1, this.score2);

        this.player1.HUD = this.HUD;
        this.player2.HUD = this.HUD;
        this.player2.playerOpuesto = this.player1;
    }
    update(t) {
        this.time = t;

        if (t > time) {//Se genera el objeto 
            time += 3000;
            this.creaObjeto();
        }
        
        this.HUD.update();
       
    }
    createPlatforms() {//Crea la plataforma
        let platforms = this.physics.add.staticGroup();
        platforms.create(this.WIDTH / 2, this.HEIGHT - (this.HEIGHT / 10), PLATFORMLAVA).setScale(2, 2).refreshBody();
        platforms.create(this.WIDTH - this.WIDTH / 5, this.HEIGHT - (this.HEIGHT / 15), PLATFORMLAVA).setScale(2, 2).refreshBody();
        platforms.create(this.WIDTH / 5, this.HEIGHT - (this.HEIGHT / 15), PLATFORMLAVA).setScale(2, 2).refreshBody();
        return platforms;

    }
    creaObjeto() {//Funcion para crear los objetos que caen, se pondran ifs dentro para luego seleccionar el correspondiente de la escena
        var value = Phaser.Math.Between(2, 12) * 100;//posicion desde donde cae
        new VolcanFireBall(this, value, -300, value, this.player);//Bolas de fuego
       // value = Phaser.Math.Between(2, 7) * 100;//posicion desde donde cae
       // new Sword(this, value, -100, this.player, this.platforms, this.time);//Espadas
       // value = Phaser.Math.Between(2, 7) * 100;//posicion desde donde cae
       // new Coconut(this, value, -100, this.player, this.platforms, this.time);//Espadas
       // value = Phaser.Math.Between(2, 7) * 100;//posicion desde donde cae
       // new Fish(this, value, 800, this.player, this.time);//Peces

    }
    

   
   
}

