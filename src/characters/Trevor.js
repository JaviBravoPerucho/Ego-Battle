import Personaje from './Personaje.js'
import Arma from './Arma.js'

export default class Trevor extends Personaje {
    constructor(scene, x, y, floor, HUD, playerOpuesto, indexPlayer) {//Habra que pasarle player1 y player2 para que colisione con ellos 
        const mapAnimaciones = {
            "idle": 'Trevoridle',
            "walk": 'Trevorwalk',
            "jump": 'Trevorjump',
            "strong": 'Trevorstrongattack',
            "normal": 'Trevornormalattack'
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
        const mapSonidos = {
            "normalSound": 'lanzaTrevor',
            "strongSound": 'mazaTrevor'
        }

        super(scene, x, y, floor, HUD, playerOpuesto, 22, 38, 65, 60, 'Trevor', 'Lanza',1300, 100, 'Maza', 450, 200, indexPlayer, mapAnimaciones, mapFrameRates, mapFrames, mapRepeats, 180, mapSonidos);

        this.poder = 0;
        this.contPoder = 0;
        this.tiempoPoder = 5000;
        this.poderPorGolpe = 20;
        this.danoUlti = 50;
        this.contUlti = 0;
        this.tiempoUlti = 10000;
        this.x = x;

        this.ultiActivated = false;
        this.playerOpuesto = playerOpuesto;
        this.stop = false;
    }

    ulti() {
        this.ultiActivated = true;
        this.playerSpeed *= 2;
        this.scene.sound.play('trevorPoder', {volume:4})
    }

    setOpositePlayer(player) {
        super.playerOpuesto = player;
    }

    gainPower() {

    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        if (this.body.onFloor()) {
            this.jumps = 0;
            this.onAir = false;
        }
        else { this.onAir = true; }

        if (!this.ultiActivated) {
            if (this.HUD.player1 === this) {
                this.HUD.BarraDePoder1.value = this.poder;
                this.HUD.BarraDePoder1.draw();
            }
            else if (this.HUD.player2 === this) {
                this.HUD.BarraDePoder2.value = this.poder;
                this.HUD.BarraDePoder2.draw();
            }
            if (this.poder >= this.HUD.maxPoder) {
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
                this.playerSpeed /= 2;
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

    }
}