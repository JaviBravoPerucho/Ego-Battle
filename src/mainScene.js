import VolcanFireBall from '../src/VolcanFireball.js';
import Volcan from '../src/Volcan.js';
import Sword from '../src/Sword.js';
import Coconut from '../src/Coconut.js';
import Fish from '../src/Fish.js';
import Trevor from '../src/Personaje1.js';
import Arturo from '../src/Arturo.js';
import Azazel from '../src/Azazel.js';
import HUD from '../src/HUD.js';

const PLATFORM = 'platform'
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
        
    }
    
    preload() {//Dependiendo de lo seleccionado cargamos una cosa u otra (mas adelante) 
        this.load.image('background', '/assets/img/castillo.jpg');//Fondo castillo
        this.load.image(PLATFORM, '/assets/img/puente1.png');//Plataforma fea
        this.load.image('Sword', '/assets/img/Sword.png');//Espada
        this.load.image('Coconut', '/assets/img/coco.png');//Coco
        this.load.spritesheet(PLAYER, '/assets/img/dude.png', { frameWidth: 32, frameHeight: 48 });//Player prueba
        this.load.spritesheet('VFB', '/assets/img/VFB.png', { frameWidth: 32, frameHeight: 67 });//Bola de fuego volcan
        this.load.spritesheet('Fish', '/assets/img/Pez.png', { frameWidth: 500, frameHeight: 659 });//Bola de fuego volcan
        this.load.spritesheet('Volcan', '/assets/img/Volcan.png', { frameWidth: 800, frameHeight: 336 });//Fondo volcan
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
        //this.loadFont('font', 'fonts/ka1.ttf');//Font del marcador  
    }

    create() {//asignamos player1 y player 2
        this.HEIGHT = this.sys.game.canvas.height;
        this.WIDTH = this.sys.game.canvas.width;
        new Volcan(this, 600, 300).setScale(1.7, 1.8);
        //this.background = this.add.image(400, 300, 'background');
        this.platforms = this.createPlatforms();
        this.cursors = this.input.keyboard.createCursorKeys();//Teclas
        this.score1 = 0;
        this.score2 = 0;//Marcador de la partida
        //this.player1 = new Trevor(this, 500, 300, this.player, this.platforms);
        this.player1 = new Azazel(this, this.WIDTH / 4, this.HEIGHT / 2, this.platforms);
        this.player2 = new Arturo(this, this.WIDTH - this.WIDTH / 4, this.HEIGHT / 2, this.platforms);
        
        new HUD(this, 0, 0, this.player1, this.player2);
    }
    update(t) {
        this.time = t;

        if (t > time) {//Se genera el objeto 
            time += 3000;
            this.creaObjeto();
        }
        

       // this.add.text(50, 0, score1 + "-" + score2, { fontFamily: 'ka1', fontSize: 50 });
    }
    createPlatforms() {//Crea la plataforma
        let platforms = this.physics.add.staticGroup();
        platforms.create(this.WIDTH / 2, this.HEIGHT - (this.HEIGHT / 10), PLATFORM).setScale(2,2).refreshBody();
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

