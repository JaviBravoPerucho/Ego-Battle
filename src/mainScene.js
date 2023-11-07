import VolcanFireBall from '../src/VolcanFireball.js';
import Volcan from '../src/Volcan.js';
import Sword from '../src/Sword.js';
import Coconut from '../src/Coconut.js';
import Fish from '../src/Fish.js';
import Trevor from '../src/Trevor.js';
import Arturo from '../src/Arturo.js';
import Azazel from '../src/Azazel.js';
import HUD from '../src/HUD.js';

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
        this.load.image('Borde', '../assets/img/border.png');
        this.load.image('BordePoder', '../assets/img/barrapoder.png');
        this.load.image('Arturo', '../assets/img/Arturo/arthur.png');
        this.load.image('Trevor', '../assets/img/Trevor/trevor.png');
        this.load.image('Azazel', '../assets/img/Azazel/azazzel.png');
        this.load.image('Shinji', '../assets/img/Shinji/shinji.png');
        this.load.image('background', '../assets/img/fondos/castillo.jpg');//Fondo castillo
        this.load.image(PLATFORMLAVA, '../assets/img/lavaPlat.png');//Plataforma lava
        this.load.image('Sword', '../assets/img/Sword.png');//Espada
        this.load.image('Coconut', '../assets/img/coco.png');//Coco
        this.load.spritesheet(PLAYER, '../assets/img/dude.png', { frameWidth: 32, frameHeight: 48 });//Player prueba
        this.load.spritesheet('VFB', '../assets/img/VFB.png', { frameWidth: 32, frameHeight: 67 });//Bola de fuego volcan
        this.load.spritesheet('Fish', '/assets/img/Pez.png', { frameWidth: 500, frameHeight: 659 });//Pez
        this.load.spritesheet('Volcan', '/assets/img/fondos/Volcan.png', { frameWidth: 800, frameHeight: 336 });//Fondo volcan
        this.load.spritesheet('Castillo', '/assets/img/fondos/castillo.jpg', { frameWidth: 1071, frameHeight: 600 });//Fondo castillo
       /* this.load.spritesheet('Espacio', '/assets/img/fondos/Espacio.png', { frameWidth: 768, frameHeight: 432 });//Fondo Espacio*/
        /*this.load.spritesheet('Muelle', '/assets/img/fondos/fondo.png', { frameWidth: 720, frameHeight: 405 });//Fondo Muelle*/
        this.load.spritesheet('Jungla', '/assets/img/fondos/jungla.png', { frameWidth: 800, frameHeight: 650 });//Fondo Jungla
        this.load.spritesheet('Explosion', '/assets/img/explosionFB.png', { frameWidth: 247, frameHeight: 240 });//explosion bola de fuego
        this.load.spritesheet('Trevornormalattack', '/assets/img/Trevor/ataqueLanza.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevorstrongattack', '/assets/img/Trevor/ataquePorra.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevoridle', '/assets/img/Trevor/Idle.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevorjump', '/assets/img/Trevor/Jump.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevorwalk', '/assets/img/Trevor/Run.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Arturonormalattack', '/assets/img/Arturo/ANA.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturostrongattack', '/assets/img/Arturo/ASA.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturoidle', '/assets/img/Arturo/Aidle.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturojump', '/assets/img/Arturo/Ajump.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturowalk', '/assets/img/Arturo/Arun.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Azazelnormalattack', '/assets/img/Azazel/Attack.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Azazelstrongattack', '/assets/img/Azazel/Attack.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Azazelidle', '/assets/img/Azazel/Idle.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Azazelwalk', '/assets/img/Azazel/Move.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('AzazelBall', '/assets/img/AzazelBall.png', { frameWidth: 498, frameHeight: 498 });
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
        this.player2 = new Arturo(this, this.WIDTH - this.WIDTH / 4, this.HEIGHT / 2, this.platforms);
        this.player1 = new Azazel(this, this.WIDTH / 4, this.HEIGHT / 2, this.platforms, this.player2, this.HUD);
        
        this.HUD = new HUD(this, 0, 0, this.player1, this.player2, this.score1, this.score2);

        this.player1.HUD = this.HUD;
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

