import Personaje from './Personaje.js'
import Arma from './Arma.js'

export default class Arturo extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, floor, HUD, playerOpuesto) {
        super(scene, x, y);

        scene.add.existing(this).setScale(2, 2);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, floor);
        this.body.setSize(22, 45);
        this.body.setOffset(68, 60);
        this.jumps = 0;
        this.vida = 300;
        this.name = 'Arturo';
        this.arma = undefined;
        this.arma1 = 'Espada1';
        this.arma2 = 'Espada2';
        this.direction = 0;//0 izquierda 1 derecha
        this.rect = undefined;

        this.poder = 0;
        this.contPoder = 0;
        this.tiempoPoder = 5000;
        this.poderPorFrame = 0.5;
        this.danoUlti = 50;
        this.contUlti = 0;
        this.tiempoUlti = 3000;

        this.stop = false;     
        this.hit = false;
        this.onAir = false;
        this.eliminate = false;
        this.attacking = false;
        this.boolPoder = true;

        scene.anims.create({//Anim idle
            key: 'Aidle',
            frames: scene.anims.generateFrameNumbers('Arturoidle', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({//Anim andar
            key: 'Awalk',
            frames: scene.anims.generateFrameNumbers('Arturowalk', { start: 0, end: 7 }),
            frameRate: 15,
            repeat: -1
        });
        scene.anims.create({//Anim saltar
            key: 'Ajump',
            frames: scene.anims.generateFrameNumbers('Arturojump', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: 0
        });
        scene.anims.create({//Anim ataque fuerte
            key: 'ASA',
            frames: scene.anims.generateFrameNumbers('Arturostrongattack', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: 0
        });
        scene.anims.create({//Anim ataque normal
            key: 'ANA',
            frames: scene.anims.generateFrameNumbers('Arturonormalattack', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: 0
        });
        this.on('animationcomplete', end => {//Detecta que ha dejado de pegar
            if (this.anims.currentAnim.key === 'ASA' || this.anims.currentAnim.key === 'ANA') {
                this.attacking = false;
            }
        })


        this.play('Aidle');
        this.wKey = this.scene.input.keyboard.addKey('up');
        this.aKey = this.scene.input.keyboard.addKey('left');
        this.dKey = this.scene.input.keyboard.addKey('right');
        this.gKey = this.scene.input.keyboard.addKey('P');
        this.hKey = this.scene.input.keyboard.addKey('O');
    }

    createWeapon(width, height, arma) {
        this.arma = new Arma(this.scene, this.x , this.y + 60,arma, this.direction, this, this.playerOpuesto, 20, this.HUD, width, height);
        this.arma.parent = this;
        this.scene.physics.add.overlap(this.arma, this.playerOpuesto, end => {
            if (this.playerOpuesto.name == this.HUD.player2.name) this.HUD.BarraDeVida2.decrease(this.arma.damage);
            else if (this.playerOpuesto.name = this.HUD.player1.name) this.HUD.BarraDeVida1.decrease(this.arma.damage);
            this.playerOpuesto.vida -= this.arma.damage;
            this.arma.destroy();
        });
       
    }

    ulti() {
        this.stop = true;
        this.playerOpuesto.stop = true;
        this.body.setVelocityX(0);
        this.playerOpuesto.body.setVelocityX(0);
        this.play('Aidle');
        this.playerOpuesto.play(this.playerOpuesto.idleKey);
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
                if (!this.onAir && !this.attacking && this.anims.currentAnim.key !== 'Aidle') { this.play('Aidle'); }
                else if (!this.attacking && this.onAir && this.anims.currentAnim.key !== 'Ajump') { this.play('Ajump'); }
            }
            else if (this.aKey.isDown) {
                this.direction = 0;
                if (this.onAir || (!this.attacking && !this.onAir)) { this.body.setVelocityX(-160); }
                else { this.body.setVelocityX(0); }
                if (this.anims.currentAnim.key !== 'Awalk') {
                    this.setFlip(true, false)
                    if (!this.attacking && !this.onAir) { this.play('Awalk'); }
                    else if (!this.attacking) { this.play('Ajump'); }
                }
            }
            else if (this.dKey.isDown) {
                this.direction = 1;
                if (this.onAir || (!this.attacking && !this.onAir)) { this.body.setVelocityX(160); }
                else { this.body.setVelocityX(0); }

                if (this.anims.currentAnim.key !== 'Awalk') {
                    this.setFlip(false, false);
                    if (!this.attacking && !this.onAir) { this.play('Awalk'); }
                    else if (!this.attacking) { this.play('Ajump'); }
                }
            }
            else {
                this.body.setVelocityX(0);
                if (!this.onAir && !this.attacking && this.anims.currentAnim.key !== 'Aidle') { this.play('Aidle'); }
                else if (!this.attacking && this.onAir && this.anims.currentAnim.key !== 'Ajump') { this.play('Ajump'); }
            }

            if (Phaser.Input.Keyboard.JustDown(this.wKey) && this.jumps < 2) {
                this.jumps++;
                this.body.setVelocityY(-400);
                this.onAir = true;
                if (this.anims.currentAnim.key !== 'Ajump' && !this.attacking) {
                    this.play('Ajump');
                }
            }
            if (Phaser.Input.Keyboard.JustDown(this.gKey) && !this.attacking) {
                this.createWeapon(500, 100, 'Espada1');
                if (this.anims.currentAnim.key !== 'ASA') {
                    this.play('ASA');
                    this.attacking = true;
                }

            }
            if (Phaser.Input.Keyboard.JustDown(this.hKey) && !this.attacking) {
                this.createWeapon(650, 400, 'Espada2');
                if (this.anims.currentAnim.key !== 'ANA') {
                    this.play('ANA');
                    this.attacking = true;
                }
            }

            if (this.poder < this.HUD.maxPoder && this.boolPoder) {
                this.poder += this.poderPorFrame;
                if (this.HUD.player1 === this) this.HUD.BarraDePoder1.increase(this.poderPorFrame);
                else if (this.HUD.player2 === this) this.HUD.BarraDePoder2.increase(this.poderPorFrame);
            }

            if (this.poder == this.HUD.maxPoder) {
                this.ulti();
                this.poder = 0;
                if (this.HUD.player1 === this) {
                    this.HUD.BarraDePoder1.color = 0xff0000;
                    this.HUD.BarraDePoder1.increase(this.poderPorFrame);
                }
                else if (this.HUD.player2 === this) {
                    this.HUD.BarraDePoder2.color = 0xff0000;
                    this.HUD.BarraDePoder2.increase(this.poderPorFrame);
                }
            }

            if (!this.boolPoder) {              
                this.contPoder += dt;
                if (this.contPoder > this.tiempoPoder) {
                    this.boolPoder = true;
                    this.contPoder = 0;
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
        } else {
            this.contUlti += dt;
            this.body.setVelocityX(0);
            if (this.contUlti >= this.tiempoUlti) {
                this.scene.hitPlayer(this.playerOpuesto, this.danoUlti);
                this.stop = false;
                this.playerOpuesto.stop = false;
                this.contUlti = 0;
                if (this.HUD.player1 === this) {
                    this.HUD.BarraDePoder1.value = 0;
                    this.HUD.BarraDePoder1.color = 0x800080;
                }
                else if (this.HUD.player2 === this) {
                    this.HUD.BarraDePoder2.value = 0;
                    this.HUD.BarraDePoder2.color = 0x800080;
                }
                console.log("ULTI");
            }
        }
        
    }
}