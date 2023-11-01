import VolcanFireBall from '../VolcanFireball.js';
import Volcan from '../Volcan.js';
import Sword from '../Sword.js';
import Coconut from './Coconut.js';
import Fish from './Fish.js';
import Trevor from './Personaje1.js';
import Arturo from './Arturo.js';
import Azazel from './Azazel.js';

const PLATFORM = 'platform'
const PLAYER = 'player'
var time = 3000;//Tiempo para caer primer objeto

export class MainScene extends Phaser.Scene {
    constructor(map, player1GO, player2GO) {//Le pasamos el mapa elegido ya sea int o string + jugador 1 + jugador 2
        super({ key: 'mainScene' })
        this.player = undefined;
        this.player1 = undefined;//Jugador 1
        this.player2 = undefined;//Jugador 2
        this.platforms = undefined;
        this.cursors = undefined;
        this.time = undefined;//Tiempo en el juego para poder pasarselo a otros objetos
    }
    
    preload() {//Dependiendo de lo seleccionado cargamos una cosa u otra (mas adelante) 
        this.load.image('background', 'img/castillo.jpg');//Fondo castillo
        this.load.image(PLATFORM, 'img/puente1.png');//Plataforma fea
        this.load.image('Sword', 'img/Sword.png');//Espada
        this.load.image('Coconut', 'img/coco.png');//Coco
        this.load.spritesheet(PLAYER, 'img/dude.png', { frameWidth: 32, frameHeight: 48 });//Player prueba
        this.load.spritesheet('VFB', 'img/VFB.png', { frameWidth: 32, frameHeight: 67 });//Bola de fuego volcan
        this.load.spritesheet('Fish', 'img/Pez.png', { frameWidth: 500, frameHeight: 659 });//Bola de fuego volcan
        this.load.spritesheet('Volcan', 'img/Volcan.png', { frameWidth: 800, frameHeight: 336 });//Fondo volcan
        this.load.spritesheet('Explosion', 'img/explosionFB.png', { frameWidth: 247, frameHeight: 240 });//explosion bola de fuego
        this.load.spritesheet('Trevornormalattack', 'img/Trevor/ataqueLanza.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevorstrongattack', 'img/Trevor/ataquePorra.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevoridle', 'img/Trevor/Idle.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevorjump', 'img/Trevor/Jump.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevorwalk', 'img/Trevor/Run.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Arturonormalattack', 'img/Arturo/ANA.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturostrongattack', 'img/Arturo/ASA.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturoidle', 'img/Arturo/Aidle.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturojump', 'img/Arturo/Ajump.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturowalk', 'img/Arturo/Arun.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Azazelnormalattack', 'img/Azazel/Attack.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Azazelstrongattack', 'img/Azazel/Attack.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Azazelidle', 'img/Azazel/Idle.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Azazelwalk', 'img/Azazel/Move.png', { frameWidth: 150, frameHeight: 150 });
        //this.loadFont('font', 'fonts/ka1.ttf');//Font del marcador  
    }

    create() {//asignamos player1 y player 2
        new Volcan(this, 600, 300).setScale(1.7, 1.8);
        //this.background = this.add.image(400, 300, 'background');
        this.platforms = this.createPlatforms();
        this.player = this.createPlayer();
        this.physics.add.collider(this.player, this.platforms);
        this.cursors = this.input.keyboard.createCursorKeys();//Teclas
        this.score1 = 0;
        this.score2 = 0;//Marcador de la partida
        //this.player1 = new Trevor(this, 500, 300, this.player, this.platforms);
        this.player1 = new Azazel(this, 500, 300, this.player, this.platforms);
        this.player2 = new Arturo(this, 300, 300, this.player1, this.platforms);
       
        
    }
    update(t) {
        this.time = t;
        //ESTO SE QUITARA
        if (this.cursors.left.isDown) {//Se mueve hacia la izquierda
            this.player.setVelocityX(-150);
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {//Se mueve hacia la derecha
            this.player.setVelocityX(150);
            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);//idle
            this.player.anims.play('idle');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {//Salto
            this.player.setVelocityY(-330);
        }//HASTA AQUI

        if (t > time) {//Se genera el objeto 
            time += 6000;
            this.creaObjeto();
        }

       // this.add.text(50, 0, score1 + "-" + score2, { fontFamily: 'ka1', fontSize: 50 });
    }
    createPlatforms() {//Crea la plataforma
        let platforms = this.physics.add.staticGroup();
        platforms.create(400, 540, PLATFORM).setScale(1.2).refreshBody();
        return platforms;

    }
    creaObjeto() {//Funcion para crear los objetos que caen, se pondran ifs dentro para luego seleccionar el correspondiente de la escena
        var value = Phaser.Math.Between(2, 7) * 100;//posicion desde donde cae
        new VolcanFireBall(this, value, -300, value, this.player);//Bolas de fuego
        value = Phaser.Math.Between(2, 7) * 100;//posicion desde donde cae
        new Sword(this, value, -100, this.player, this.platforms, this.time);//Espadas
        value = Phaser.Math.Between(2, 7) * 100;//posicion desde donde cae
        new Coconut(this, value, -100, this.player, this.platforms, this.time);//Espadas
        value = Phaser.Math.Between(2, 7) * 100;//posicion desde donde cae
        new Fish(this, value, 800, this.player, this.time);//Peces

    }
    //ESTO SE QUITARA
    createPlayer() {//Crea personaje
        const player = this.physics.add.sprite(200, 300, PLAYER);
        //player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({//anim <-
            key: 'left',
            frames: this.anims.generateFrameNumbers(PLAYER, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({//anim idle
            key: 'idle',
            frames: [{ key: PLAYER, frame: 4 }],
            frameRate: 20
        })
        this.anims.create({//anim ->
            key: 'right',
            frames: this.anims.generateFrameNumbers(PLAYER, { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        })
        return player;
    }
   
   
}

