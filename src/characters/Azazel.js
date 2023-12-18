import Personaje from './Personaje.js'
import Arma from './Arma.js'
export default class Azazel extends Personaje {
    constructor(scene, x, y, floor, HUD, playerOpuesto, indexPlayer) {//Habra que pasarle player2 para que colisione con ellos
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

        const mapSonidos = {
            "normalSound": 'bolafuegoAzazel',
            "strongSound":'fuegoAzazel'
        }

        super(scene, x, y, floor, HUD, playerOpuesto, 20, 45, 65, 55, 'Azazel', undefined, undefined, undefined,'Fuego', 450, 200, indexPlayer, mapAnimaciones, mapFrameRates, mapFrames, mapRepeats, 150, mapSonidos);

        this.right = true;
        this.fireDuration = 3;
        this.fire = 0;
        this.boolPoder = false;
        this.poder = 0; 
        this.poderPorFrame = 0.5;
        this.throwFire = true;
        this.elapsedStopAttack = 0;
        this.playerOpuesto = playerOpuesto;
        this.utliActivated = false;
        this.contUlti = 0;
        this.tiempoUlti = 10000;


        this.on('animationcomplete', end => {//Detecta que ha dejado de pegar      
            if (this.anims.currentAnim.key === mapAnimaciones["normal"]) {
                this.throwFire = true;
                this.attacking = false;
                this.elapsedStopAttack = 0;
            }
            else if (this.anims.currentAnim.key === mapAnimaciones["strong"]) {
                this.throwFire = true;
                this.attacking = false;
                this.elapsedStopAttack = 0;
            }
        })

    }
    setOpositePlayer(player) {
        super.playerOpuesto = player;
    }
    ulti() {
        this.armaMasDano = true;
        this.ultiActivated = true;
        this.scene.sound.play('azazelPoder')
    }
   
    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        if (!this.stop && !this.dontMove) {
            if (this.attacking) {
                this.elapsedStopAttack += dt;
                if (this.elapsedStopAttack > 450) {
                    this.attacking = false;
                    this.throwFire = true;
                    this.elapsedStopAttack = 0;
                }
            }

            if (this.anims.currentAnim.key === 'Azazelnormalattack' && this.throwFire) {
                this.throwFireBall();
                this.throwFire = false;
            }

            if (!this.ultiActivated) {
                if (this.poder < this.HUD.maxPoder && this.boolPoder) {
                    this.poder += this.poderPorFrame;
                    if (this.HUD.player1 === this) {
                        this.HUD.BarraDePoder1.value = this.poder;
                        this.HUD.BarraDePoder1.draw();
                    }
                    else if (this.HUD.player2 === this) {
                        this.HUD.BarraDePoder2.value = this.poder;
                        this.HUD.BarraDePoder2.draw();
                    }
                }
                if (this.poder == this.HUD.maxPoder) {
                    this.ulti();
                    this.poder = 0;
                    if (this.HUD.player1 === this) {
                        this.HUD.BarraDePoder1.color = 0xff0000;
                        this.HUD.BarraDePoder1.draw();
                    }
                    else if (this.HUD.player2 === this) {
                        this.HUD.BarraDePoder2.color = 0xff0000;
                        this.HUD.BarraDePoder2.draw();
                    }
                }
            } else {
                this.contUlti += dt;
                if (this.contUlti >= this.tiempoUlti) {
                    this.ultiActivated = false;
                    this.armaMasDano = false;
                    this.contUlti = 0;
                    if (this.HUD.player1 === this) {
                        this.HUD.BarraDePoder1.value = 0;
                        this.HUD.BarraDePoder1.color = 0x800080;
                        this.HUD.BarraDePoder1.draw();
                    }
                    else if (this.HUD.player2 === this) {
                        this.HUD.BarraDePoder2.value = 0;
                        this.HUD.BarraDePoder2.color = 0x800080;
                        this.HUD.BarraDePoder2.draw();
                    }
                }
            }
            

            if (this.body.velocity.x === 0 && !this.onAir) this.boolPoder = true;
            else this.boolPoder = false;
        } else this.body.setVelocityX(0);

    }

    throwFireBall() {
        let dir, x, y;
        if (!this.left) { dir = 1; x = this.body.x + 80; y = this.body.y + 40;}
        else { dir = 0; x = this.body.x - 45; y = this.body.y + 40;}
        new AzazelBall(this.scene, x, y, dir, this.playerOpuesto, this.floor, this.HUD, this.armaMasDano);
    }

}
export class AzazelBall extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, direction, playerOpuesto, floor, HUD, masDano) {
        super(scene, x, y);
        scene.add.existing(this).setScale(0.2, 0.2);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, floor);
        this.delete = false;
        this.elapsed = 0;
        if (masDano) this.damage = 20;
        else this.damage = 10;
        this.HUD = HUD;
        this.body.setSize(130, 130);
        this.body.setOffset(240, 180);
        this.body.setAllowGravity(false);
        if (direction == 0) { this.body.setVelocityX(-200); this.setFlip(true, false)}
        else { this.body.setVelocityX(200); }

        scene.physics.add.collider(this, playerOpuesto, end => {
            scene.hitPlayer(playerOpuesto, this.damage, 0);
            this.delete = true;
        });

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