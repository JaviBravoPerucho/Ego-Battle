import Personaje from './Personaje.js'
import Arma from './Arma.js'
export default class Azazel extends Personaje {
    constructor(scene, x, y, floor, HUD, player2, indexPlayer) {//Habra que pasarle player2 para que colisione con ellos
        //Mapas que describen las animaciones
        const mapAnimaciones = {
            "idle": 'Azazelidle',
            "walk": 'Azazelwalk',
            "strong": 'Azazelstrongattack',
            "normal": 'Azazelnormalattack'
        }
        const mapFrameRates = {
            "idle": 10,
            "walk": 12,
            "strong": 6,
            "normal": 7
        }
        const mapFrames = {
            "idle": 7,
            "walk": 7,
            "strong": 3,
            "normal": 3
        }
        const mapRepeats = {
            "idle": -1,
            "walk": -1,
            "strong": 0,
            "normal": 0
        }

        super(scene, x, y, floor, HUD, player2, 20, 45, 65, 55, 'Azazel', undefined, undefined, undefined,'Fuego', 450, 200, indexPlayer, mapAnimaciones, mapFrameRates, mapFrames, mapRepeats);

        this.right = true;
        this.fireDuration = 3;
        this.fire = 0;
        this.boolPoder = false;
        this.poder = 0; 
        this.poderPorFrame = 0;
        this.throwFire = false;
        this.player;

        this.on('animationcomplete', end => {//Detecta que ha dejado de pegar
            this.throwFire = true;
            if (this.anims.currentAnim.key === mapAnimaciones["idle"]) {
                if (this.fire < this.fireDuration) {
                    this.fire++;
                    this.play(mapAnimaciones["idle"]);
                }
                else {
                    this.fire = 0;
                    this.attacking = false;
                }
            }
        })

    }

   
    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        if (!this.stop) {
            if (this.aKey.isDown) {
                if (this.right) { this.setFlip(true, false); this.right = false; }
                if (this.attacking) { this.body.setVelocityX(-60); }
                else { this.body.setVelocityX(-150); }
            }
            else if (this.dKey.isDown) {
                if (!this.right) { this.setFlip(false, false); this.right = true; }
                if (this.attacking) { this.body.setVelocityX(60); }
                else { this.body.setVelocityX(150); }
            }
            else {
                this.body.setVelocityX(0);
            }

            if (this.anims.currentAnim.key === 'Azazelnormalattack' && this.throwFire) {
                this.throwFireBall();
                this.throwFire = false;
            }

            if (this.poder < this.HUD.maxPoder && this.boolPoder) {
                this.poder += this.poderPorFrame;
                if (this.HUD.player1 === this) this.HUD.BarraDePoder1.increase(this.poderPorFrame);
                else if (this.HUD.player2 === this) this.HUD.BarraDePoder2.increase(this.poderPorFrame);
            }

            if (this.body.velocity.x === 0 && !this.onAir) this.boolPoder = true;
            else this.boolPoder = false;
        } else this.body.setVelocityX(0);

    }

    throwFireBall() {

        let dir, x, y;
        if (this.right) { dir = 1; x = this.body.x + 80; y = this.body.y + 40;}
        else { dir = 0; x = this.body.x - 45; y = this.body.y + 40;}
        new AzazelBall(this.scene, x, y, dir, this.player2, this.floor, this.HUD);
    }

}
export class AzazelBall extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, direction, player2, floor, HUD) {
        super(scene, x, y);
        scene.add.existing(this).setScale(0.2, 0.2);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, floor);
        this.delete = false;
        this.elapsed = 0;
        this.damage = 10;
        this.HUD = HUD;
        scene.physics.add.collider(this, player2, end => {
            scene.hitPlayer(player2, this.damage);
            this.delete = true;
        });
        this.body.setSize(130, 130);
        this.body.setOffset(240, 180);
        this.body.setAllowGravity(false);
        if (direction == 0) { this.body.setVelocityX(-200); this.setFlip(true, false)}
        else { this.body.setVelocityX(200);}      

        scene.anims.create({//Anim idle
            key: 'AFB',
            frames: scene.anims.generateFrameNumbers('AzazelBall', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        this.play('AFB');
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        this.elapsed += dt;
        if (this.elapsed > 5000) { this.delete = true;}
        if (this.delete) { this.destroy();}
    }
}