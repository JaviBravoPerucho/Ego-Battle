import Personaje from './Personaje.js'
import Arma from './Arma.js'

export default class Arturo extends Personaje {
    constructor(scene, x, y, floor, HUD, playerOpuesto, indexPlayer) {
        //Mapas que describen las animaciones
        const mapAnimaciones = {
            "idle": 'Arturoidle',
            "walk": 'Arturowalk',
            "jump": 'Arturojump',
            "strong": 'Arturostrongattack',
            "normal": 'Arturonormalattack'
        }
        const mapFrameRates = {
            "idle": 10,
            "walk": 15,
            "jump": 1,
            "strong": 8,
            "normal": 8
        }
        const mapFrames = {
            "idle": 7,
            "walk": 7,
            "jump": 1,
            "strong": 3,
            "normal": 3
        }
        const mapRepeats = {
            "idle": -1,
            "walk": -1,
            "jump": 0,
            "strong": 0,
            "normal": 0
        }

        super(scene, x, y, floor, HUD, playerOpuesto, 22, 45, 68, 60, 'Arturo', 'Espada1', 650, 400, 'Espada2', 500, 200, indexPlayer, mapAnimaciones, mapFrameRates, mapFrames, mapRepeats);

        this.poder = 0;
        this.contPoder = 0;
        this.tiempoPoder = 5000;
        this.poderPorFrame = 0;
        this.danoUlti = 50;
        this.contUlti = 0;
        this.tiempoUlti = 3000;
        this.x = x;
       
        this.boolPoder = true;
        this.playerOpuesto = playerOpuesto;
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