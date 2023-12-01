import Personaje from './Personaje.js'
import Arma from './Arma.js'

export default class Shinji extends Personaje {
    constructor(scene, x, y, floor, HUD, playerOpuesto, indexPlayer) {//Habra que pasarle player1 y player2 para que colisione con ellos
        //Mapas que describen las animaciones
        const mapAnimaciones = {
            "idle": 'Shinjiidle',
            "walk": 'Shinjiwalk',
            "jump": 'Shinjijump',
            "strong": 'Shinjistrongattack',
            "normal": 'Shinjinormalattack'
        }
        const mapFrameRates = {   
            "idle": 2,
            "walk": 40,
            "jump": 15,
            "strong": 8,
            "normal": 8
        }
        const mapFrames = {
            "idle": 1,
            "walk": 4,
            "jump": 0,
            "strong": 2,
            "normal": 2
        }
        const mapRepeats = {
            "idle": -1,
            "walk": -1,
            "jump": 0,
            "strong": 0,
            "normal": 0
        }

        super(scene, x, y, floor, HUD, playerOpuesto, 35, 65, 15, 20, 'Shinji', undefined, undefined, undefined, undefined, undefined, undefined, indexPlayer, mapAnimaciones, mapFrameRates, mapFrames, mapRepeats);

        scene.add.existing(this).setScale(1.2, 1.2);
        this.ulti = 0;
        this.Useulti = false;
        this.distance = 350;
        this.maxulti = 2000;
        this.x = x;
        this.y = y;

        scene.anims.create({
            key: 'ShinjiUlti',
            frames: scene.anims.generateFrameNumbers('ShinjiUlti', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });
        this.on('animationcomplete', end => {//Detecta que ha dejado de pegar
            if (this.anims.currentAnim.key === 'ShinjiUlti') {
                super.attacking = false;
            }
        })
    }
    ult() {
        if (this.x > this.playerOpuesto.x) {
            this.setPosition(this.playerOpuesto.x - 50, this.playerOpuesto.y - 30);
            this.mainScene.hitPlayer(this.playerOpuesto, this.ultidamage)
            super.attacking = true;
            this.play('ShinjiUlti');

        }
        else {
            this.setPosition(this.playerOpuesto.x + 50, this.playerOpuesto.y - 30);
            this.mainScene.hitPlayer(this.playerOpuesto, this.ultidamage)
            super.attacking = true;
            this.play('ShinjiUlti');
        }

    }
    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        if (this.ulti <= this.maxulti) {
            if (this.x > this.playerOpuesto.x) {
                if ((this.x - this.playerOpuesto.x) >= this.distance) this.ulti += (this.x - this.playerOpuesto.x) * 0.01;
            }
            else {
                if ((this.playerOpuesto.x - this.x) >= this.distance) this.ulti += (this.playerOpuesto.x - this.x) * 0.01;
            }
        }
        else {
            this.ulti = 0;
            this.ult();
        }

    //    console.log(this.ulti);

    //    if (this.dKey.isDown && this.aKey.isDown) {
    //        this.body.setVelocityX(0);
    //        if (!this.onAir && !this.attacking && this.anims.currentAnim.key !== 'Shinjiidle') { this.play('Shinjiidle'); this.body.setOffset(15, 20); this.setPosition(this.x, this.y - 15); }
    //        else if (!this.attacking && this.onAir && this.anims.currentAnim.key !== 'Shinjijump') { this.play('Shinjijump'); this.body.setOffset(10, 5); }
    //    }
    //    else if (this.aKey.isDown) {
    //        this.direction = 0;
    //        if (this.onAir || (!this.attacking && !this.onAir)) { this.body.setVelocityX(-350); }
    //        else { this.body.setVelocityX(0); }
    //        if (this.anims.currentAnim.key !== 'Shinjiwalk') {
    //            this.setFlip(true, false)
    //            if (!this.attacking && !this.onAir) { this.play('Shinjiwalk'); this.body.setOffset(0, 15); if (this.anims.currentAnim.key !== 'Shinjiidle') this.setPosition(this.x, this.y - 15); }
    //            else if (!this.attacking) { this.play('Shinjijump'); this.body.setOffset(10, 5); }
    //        }
    //    }
    //    else if (this.dKey.isDown) {
    //        this.direction = 1;
    //        if (this.onAir || (!this.attacking && !this.onAir)) { this.body.setVelocityX(350); }
    //        else { this.body.setVelocityX(0); }

    //        if (this.anims.currentAnim.key !== 'Shinjiwalk') {
    //            this.setFlip(false, false);
    //            if (!this.attacking && !this.onAir) { this.play('Shinjiwalk'); this.body.setOffset(0, 15); if (this.anims.currentAnim.key !== 'Shinjiidle') this.setPosition(this.x, this.y - 15); }
    //            else if (!this.attacking) { this.play('Shinjijump'); this.body.setOffset(10, 5); }
    //        }
    //    }
    //    else {
    //        this.body.setVelocityX(0);
    //        if (!this.onAir && !this.attacking && this.anims.currentAnim.key !== 'Shinjiidle') { this.play('Shinjiidle'); this.body.setOffset(15, 20); this.setPosition(this.x, this.y - 15); }
    //        else if (!this.attacking && this.onAir && this.anims.currentAnim.key !== 'Shinjijump') { this.play('Shinjijump'); this.body.setOffset(10, 5); }
    //    }

    //    if (Phaser.Input.Keyboard.JustDown(this.wKey) && this.jumps < 2) {
    //        this.jumps++;
    //        this.setPosition(this.x, this.y - 20);
    //        this.body.setVelocityY(-350);
    //        this.onAir = true;
    //        if (this.anims.currentAnim.key !== 'Shinjijump' && !this.attacking) {
    //            this.play('Shinjijump');
    //            this.body.setOffset(10, 5);
    //        }
    //    }
       
    //    if (Phaser.Input.Keyboard.JustDown(this.hKey) && !this.attacking) {
    //        /* new Arma(this.x, this.y, this.arma2, this.direction, this, this.playerOpuesto, 10, this.HUD, 100, 100);*/
    //        if (this.anims.currentAnim.key !== 'Shinjinormalattack') {
    //            this.body.setOffset(15, 0);
    //            this.play('Shinjinormalattack');
    //            this.attacking = true;
    //        }
    //    }
    }
}