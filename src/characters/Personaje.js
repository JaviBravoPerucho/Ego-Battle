import Arma from './Arma.js';

export default class Personaje extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, floor, HUD, playerOpuesto, width, height, bodyOffsetX, bodyOffsetY, name, arma1, arma2, idleKey, walkKey, jumpKey, strongKey, normalKey) {
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
        this.rect = undefined;

        this.stop = false;
        this.hit = false;
        this.onAir = false;
        this.eliminate = false;
        this.attacking = false;
        this.boolPoder = true;
    }
}