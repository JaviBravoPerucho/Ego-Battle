import VolcanFireBall from '../VolcanFireball.js';
import Volcan from '../Volcan.js';

const PLATFORM = 'platform'
const PLAYER = 'player'
var time = 3000;//Tiempo para caer primer objeto

export class MainScene extends Phaser.Scene {
    constructor(map, player1GO, player2GO) {//Le pasamos el mapa elegido ya sea int o string + jugador 1 + jugador 2
        super({ key: 'mainScene' })
        this.player = undefined;
        this.player1 = undefined;//Jugador 1
        this.player2 = undefined;//Jugador 2
        this.cursors = undefined;
    }
    
    preload() {//Dependiendo de lo seleccionado cargamos una cosa u otra  
        this.load.image('background', 'img/castillo.jpg');//Fondo castillo
        this.load.image(PLATFORM, 'img/puente1.png');//Plataforma fea
        this.load.spritesheet(PLAYER, 'img/dude.png', { frameWidth: 32, frameHeight: 48 });//Player prueba
        this.load.spritesheet('VFB', 'img/VFB.png', { frameWidth: 32, frameHeight: 67 });//Bola de fuego volcan
        this.load.spritesheet('Volcan', 'img/Volcan.png', { frameWidth: 800, frameHeight: 336 });//Fondo volcan
        this.load.spritesheet('Explosion', 'img/explosionFB.png', { frameWidth: 247, frameHeight: 240 });//explosion bola de fuego
    }

    create() {//asignamos player1 y player 2
        new Volcan(this, 600, 300).setScale(1.7, 1.8);
        //this.background = this.add.image(400, 300, 'background');
        const platforms = this.createPlatforms();
        this.player = this.createPlayer();
        this.physics.add.collider(this.player, platforms);
        this.cursors = this.input.keyboard.createCursorKeys();//Teclas
        
    }
    update(t) {
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
    }
    createPlatforms() {//Crea la plataforma
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 540, PLATFORM).setScale(1.2).refreshBody();
        return platforms;

    }
    creaObjeto() {//Funcion para crear los objetos que caen, se pondran ifs dentro para luego seleccionar el correspondiente de la escena
        var value = Phaser.Math.Between(2, 7) * 100;
        new VolcanFireBall(this, value, -100, this.player);
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

