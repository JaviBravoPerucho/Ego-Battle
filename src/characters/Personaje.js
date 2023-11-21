import Arma from './Arma.js';

export default class Personaje extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, floor, HUD, playerOpuesto, width, height, bodyOffsetX, bodyOffsetY, name, arma1, arma2, arrayAnimaciones, arrayFrameRates, arrayFrames, arrayRepeats) {
        super(scene, x, y);

        scene.add.existing(this).setScale(2, 2);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, floor);
        this.body.setSize(width, height);
        this.body.setOffset(bodyOffsetX, bodyOffsetY);
        this.jumps = 0;
        this.vida = 300;
        this.arma = undefined;
        this.direction = 0;//0 izquierda 1 derecha
        this.rect = undefined;//Rectangulo para crear la colision del arma con el player opuesto
        this.HUD = HUD;
        this.playerOpuesto = playerOpuesto;
        this.name = name;
        this.arma1 = arma1;
        this.arma2 = arma2;
        this.arrayAnimaciones = arrayAnimaciones;//Arrays con las caracteristicas de las animaciones del personaje
        this.arrayFrameRates = arrayFrameRates;
        this.arrayFrames = arrayFrames;
        this.arrayRepeats = arrayRepeats;
        this.idle = this.arrayAnimaciones[0];
        this.walk = this.arrayAnimaciones[1];
        this.jump = undefined;
        this.strongAttack = undefined;
        this.normalAttack = undefined;
        if (this.arrayAnimaciones.length === 5) {
            this.jump = this.arrayAnimaciones[2];
            this.strongAttack = this.arrayAnimaciones[3];
            this.normalAttack = this.arrayAnimaciones[4];
        } else {
            this.strongAttack = this.arrayAnimaciones[2];
            this.normalAttack = this.arrayAnimaciones[3];//Algunos personajes tienen animacion de salto y otros no
        }

        this.stop = false;
        this.hit = false;
        this.onAir = false;
        this.eliminate = false;
        this.attacking = false;
        this.boolPoder = true;

        //Funcion para crear animaciones a partir de los arrays pasados por cada personaje
        function createAnim(keyString, frameRate, frames, repeat) {
            scene.anims.create({
                key:  keyString,
                frames: scene.anims.generateFrameNumbers(keyString, { start: 0, end: frames }),
                frameRate: frameRate,
                repeat: repeat
            });
        }
        this.on('animationcomplete', end => {//Detecta que ha dejado de pegar
            if (this.anims.currentAnim.key === arrayAnimaciones[arrayAnimaciones.length - 1] || this.anims.currentAnim.key === arrayAnimaciones[arrayAnimaciones.length - 1]) {
                this.attacking = false;
            }
        })

        //Creación de las animaciones
        for (let i = 0; i < arrayAnimaciones.length; i++) {
            createAnim(arrayAnimaciones[i], arrayFrameRates[i], arrayFrames[i], arrayRepeats[i]);
        }

        this.play(arrayAnimaciones[0]);

        //if (this.HUD.player1.name === this.name) {
        //    this.wKey = this.scene.input.keyboard.addKey('W');
        //    this.aKey = this.scene.input.keyboard.addKey('A');
        //    this.dKey = this.scene.input.keyboard.addKey('D');
        //    this.gKey = this.scene.input.keyboard.addKey('G');
        //    this.hKey = this.scene.input.keyboard.addKey('H');

        //} else {
            this.wKey = this.scene.input.keyboard.addKey('up');
            this.aKey = this.scene.input.keyboard.addKey('left');
            this.dKey = this.scene.input.keyboard.addKey('right');
            this.gKey = this.scene.input.keyboard.addKey('P');
            this.hKey = this.scene.input.keyboard.addKey('O');

        /*}*/
    }
    createWeapon(width, height, arma) {
        this.arma = new Arma(this.scene, this.x, this.y + 60, arma, this.direction, this, this.playerOpuesto, 20, this.HUD, width, height);
        this.arma.parent = this;
        this.scene.physics.add.overlap(this.arma, this.playerOpuesto, end => {
            if (this.playerOpuesto.name == this.HUD.player2.name) this.HUD.BarraDeVida2.decrease(this.arma.damage);
            else if (this.playerOpuesto.name = this.HUD.player1.name) this.HUD.BarraDeVida1.decrease(this.arma.damage);
            this.playerOpuesto.vida -= this.arma.damage;
            this.arma.destroy();
        });

    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        if (this.body.onFloor()) {
            this.jumps = 0;
            this.onAir = false;
        }
        else { this.onAir = true; }

        if (!this.stop) {
            if (this.aKey.isDown && this.dKey.isDown) {
                this.body.setVelocityX(0);
                if (!this.onAir && !this.attacking && this.anims.currentAnim.key !== this.idle) { this.play(this.idle); }
                else if (!this.attacking && this.onAir && this.jump !== undefined && this.anims.currentAnim.key !== this.jump) { this.play(this.jump); }
            }
            else if (this.aKey.isDown) {
                this.direction = 0;
                if (this.onAir || (!this.attacking && !this.onAir)) { this.body.setVelocityX(-160); }
                else { this.body.setVelocityX(0); }
                if (this.anims.currentAnim.key !== this.walk) {
                    this.setFlip(true, false)
                    if (!this.attacking && !this.onAir) { this.play(this.walk); }
                    else if (!this.attacking && this.jump !== undefined) { this.play(this.jump); }
                }
            }
            else if (this.dKey.isDown) {
                this.direction = 1;
                if (this.onAir || (!this.attacking && !this.onAir)) { this.body.setVelocityX(160); }
                else { this.body.setVelocityX(0); }

                if (this.anims.currentAnim.key !== this.walk) {
                    this.setFlip(false, false);
                    if (!this.attacking && !this.onAir) { this.play(this.walk); }
                    else if (!this.attacking && this.jump !== undefined) { this.play(this.jump); }
                }
            }
            else {
                this.body.setVelocityX(0);
                if (!this.onAir && !this.attacking && this.anims.currentAnim.key !== this.idle) { this.play(this.idle); }
                else if (!this.attacking && this.onAir && this.jump !== undefined && this.anims.currentAnim.key !== this.jump) { this.play(this.jump); }
            }

            if (Phaser.Input.Keyboard.JustDown(this.wKey) && this.jumps < 2) {
                this.jumps++;
                this.body.setVelocityY(-400);
                this.onAir = true;
                if (this.jump !== undefined && this.anims.currentAnim.key !== this.jump && !this.attacking) {
                    this.play(this.jump);
                }
            }
            if (Phaser.Input.Keyboard.JustDown(this.gKey) && !this.attacking) {
                if(this.arma1 !== undefined)this.createWeapon(this.arma1.width, this.arma1.height, this.arma1);
                if (this.anims.currentAnim.key !== this.strongAttack) {
                    this.play(this.strongAttack);
                    this.attacking = true;
                }

            }
            if (Phaser.Input.Keyboard.JustDown(this.hKey) && !this.attacking) {
                if(this.arma2 !== undefined)this.createWeapon(this.arma2.width, this.arma2.height, this.arma2);
                if (this.anims.currentAnim.key !== this.normalAttack) {
                    this.play(this.normalAttack);
                    this.attacking = true;
                }
            }

            if (this.vida <= 0) {
                this.HUD.countScore(this);
                this.destroy();
            }

            if (this.y >= this.scene.alturaVacio) {
                this.vida = 0;
                this.y = this.scene.alturaInicial;
                this.x = this.scene.posicionInicial;
            }
        }

    }
}