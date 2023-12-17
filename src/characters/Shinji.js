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

        super(scene, x, y, floor, HUD, playerOpuesto, 35, 65, 15, 20, 'Shinji', undefined, undefined, undefined, undefined, undefined, undefined, indexPlayer, mapAnimaciones, mapFrameRates, mapFrames, mapRepeats, 360);

        scene.add.existing(this).setScale(1.2, 1.2);
        this.right = true;
        this.ulti = 0;
        this.Useulti = false;
        this.distance = 350;
        this.maxulti = 2000;
        this.poderPorFrame = 0.1;
        this.mainScene = scene;
        this.ultidamage = 50;
        this.playerOpuesto = playerOpuesto;
        this.Shuriken = true;
        this.Bomb = true;
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
            if (this.anims.currentAnim.key === 'Shinjistrongattack') {
                this.Shuriken = true;
            }
            if (this.anims.currentAnim.key === 'Shinjinormalattack') {
                this.Bomb = true;
            }
        })
    }
    setOpositePlayer(player) {
        super.playerOpuesto = player;
    }
    ult() {
        if (this.HUD.player1 === this) {
            this.HUD.BarraDePoder1.value = 0;
            this.HUD.BarraDePoder1.draw();
        }
        else if (this.HUD.player2 === this) {
            this.HUD.BarraDePoder2.value = 0;
            this.HUD.BarraDePoder2.draw();
        }

        if (!this.playerOpuesto.left) {
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
    throwShuriken() {
        let dir, x, y;
        console.log(this.left)
        if (!this.left) { dir = 1; x = this.body.x + 80; y = this.body.y + 40; }
        else { dir = 0; x = this.body.x - 45; y = this.body.y + 40; }
        new ShinjiShuriken(this.scene, x, y, dir, this.playerOpuesto, this.floor, this.HUD);
    }
    throwBomb() {
        let dir, x, y;
        console.log(this.left)
        if (!this.left) { dir = 1; x = this.body.x + 80; y = this.body.y + 40; }
        else { dir = 0; x = this.body.x - 45; y = this.body.y + 40; }
        new ShinjiBomb(this.scene, x, y, dir, this.playerOpuesto, this.floor, this.HUD);
    }
    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        if (this.ulti <= this.maxulti) {
            if (this.x > this.playerOpuesto.x) {
                if ((this.x - this.playerOpuesto.x) >= this.distance) {
                    this.ulti += (this.x - this.playerOpuesto.x) * 0.005;
                    if (this.HUD.player1 === this) this.HUD.BarraDePoder1.increase((this.x - this.playerOpuesto.x) * 0.0001);
                    else if (this.HUD.player2 === this) this.HUD.BarraDePoder2.increase((this.x - this.playerOpuesto.x) * 0.0001);
                }
            }
            else {
                if ((this.playerOpuesto.x - this.x) >= this.distance) {
                    this.ulti += (this.playerOpuesto.x - this.x) * 0.001;
                    if (this.HUD.player1 === this) this.HUD.BarraDePoder1.increase((this.playerOpuesto.x - this.x) * 0.0001);
                    else if (this.HUD.player2 === this) this.HUD.BarraDePoder2.increase((this.playerOpuesto.x - this.x) * 0.0001);
                }
            }
        }
        else {
            this.ulti = 0;
            this.ult();
        }
        if (this.anims.currentAnim.key === 'Shinjistrongattack' && this.Shuriken) {
            this.throwShuriken();
            this.Shuriken = false;
        }
        if (this.anims.currentAnim.key === 'Shinjinormalattack' && this.Bomb) {
            this.throwShuriken();
            this.Bomb = false;
        }

    }
}
export class ShinjiShuriken extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, direction, playerOpuesto, floor, HUD) {
        super(scene, x, y);
        scene.add.existing(this).setScale(0.05, 0.05);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, floor);
        this.delete = false;
        this.elapsed = 0;
        this.damage = 20;
        this.HUD = HUD;
        this.body.setSize(130, 130);
        this.body.setOffset(240, 180);
        this.body.setAllowGravity(false);
        if (direction == 0) { this.body.setVelocityX(-350); this.setFlip(true, false) }
        else { this.body.setVelocityX(350); }

        scene.physics.add.collider(this, playerOpuesto, end => {
            scene.hitPlayer(playerOpuesto, this.damage, 0);
            this.delete = true;
        });

        scene.anims.create({//Anim idle
            key: 'Shuriken',
            frames: scene.anims.generateFrameNumbers('ShinjiShuriken', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });

        this.play('Shuriken');
    }


    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        this.elapsed += dt;
        if (this.elapsed > 5000) { this.delete = true; }
        if (this.delete) { this.destroy(); }
    }
}
export class ShinjiBomb extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, direction, playerOpuesto, floor, HUD) {
        super(scene, x, y);
        scene.add.existing(this).setScale(0.05, 0.05);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, floor);
        this.delete = false;
        this.elapsed = 0;
        this.damage = 20;
        this.HUD = HUD;
        this.body.setSize(130, 130);
        this.body.setOffset(240, 180);
        //this.body.setAllowGravity(false);
        if (direction == 0) { this.body.setVelocityX(-350); this.setFlip(true, false); this.body.setVelocityY(-150) }
        else { this.body.setVelocityX(350); this.body.setVelocityY(-150) }

        scene.physics.add.collider(this, playerOpuesto, end => {
            scene.hitPlayer(playerOpuesto, this.damage, 0);
            this.delete = true;
        });

        scene.anims.create({//Anim idle
            key: 'Bomb',
            frames: scene.anims.generateFrameNumbers('Shinjibomb', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });

        this.play('Bomb');
    }


    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        this.elapsed += dt;
        if (this.elapsed > 5000) { this.delete = true; }
        if (this.delete) { this.destroy(); }
    }
}