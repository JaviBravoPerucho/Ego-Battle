import VolcanFireBall from '../VolcanFireball.js';
import Volcan from '../Volcan.js';

const PLATFORM = 'platform'
const PLAYER = 'player'
var time = 3000;

export class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'mainScene' })
        this.player = undefined;
        this.cursors = undefined;
        this.fireBall;
    }
    
    preload() {
        this.load.image('background', 'img/castillo.jpg');
        this.load.image(PLATFORM, 'img/puente1.png');
        this.load.spritesheet(PLAYER, 'img/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('VFB', 'img/VFB.png', { frameWidth: 100, frameHeight: 150 });
        this.load.spritesheet('Volcan', 'img/Volcan.png', { frameWidth: 800, frameHeight: 336 });
    }

    create() {
        new Volcan(this, 600, 300).setScale(1.7, 1.8);
        //this.background = this.add.image(400, 300, 'background');
        const platforms = this.createPlatforms();
        this.fireBall = this.creaObjeto();
        this.player = this.createPlayer();
        this.physics.add.collider(this.player, platforms);
        this.cursors = this.input.keyboard.createCursorKeys();//Teclas
        
    }
    update(t) {
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
        }

        if (t > time) {
            time += 6000;
            this.creaObjeto();
        }
    }
    createPlatforms() {//Crea la plataforma
        const platforms = this.physics.add.staticGroup();
        platforms.create(400, 540, PLATFORM).setScale(1.2).refreshBody();
        return platforms;

    }
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
    creaObjeto() {
        var value = Phaser.Math.Between(2, 7) * 100;
        var fireBall = new VolcanFireBall(this, value, -100, this.player);
        return fireBall;
    }
   
}

