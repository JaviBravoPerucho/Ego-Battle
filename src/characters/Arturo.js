import Personaje from './Personaje.js'
import Arma from './Arma.js'

export default class Arturo extends Personaje {
    constructor(scene, x, y, floor, HUD, playerOpuesto, indexPlayer) {
        let arrayAnimaciones = ['Arturoidle', 'Arturowalk', 'Arturojump', 'Arturostrongattack', 'Arturonormalattack'];
        let arrayFrameRates = [10, 15, 1, 8, 8];
        let arrayFrames = [7, 7, 1, 3, 3];
        let arrayRepeats = [-1, -1, 0, 0, 0];

        super(scene, x, y, floor, HUD, playerOpuesto, 22, 45, 68, 60, 'Arturo', 'Espada1', 500, 100, 'Espada2', 650, 400, indexPlayer, arrayAnimaciones, arrayFrameRates, arrayFrames, arrayRepeats);

        this.poder = 0;
        this.contPoder = 0;
        this.tiempoPoder = 5000;
        this.poderPorFrame = 0;
        this.danoUlti = 50;
        this.contUlti = 0;
        this.tiempoUlti = 3000;
       
        this.boolPoder = true;
    }

    ulti() {
        this.stop = true;
        this.playerOpuesto.stop = true;
        this.body.setVelocityX(0);
        this.playerOpuesto.body.setVelocityX(0);
        this.play(this.idle);
        /*this.playerOpuesto.play(this.playerOpuesto.idle);*/
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        if (this.body.onFloor()) {
            this.jumps = 0;
            this.onAir = false;
        }
        else { this.onAir = true; }

        if (!this.stop) {
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