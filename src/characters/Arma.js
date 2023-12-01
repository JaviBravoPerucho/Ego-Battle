export default class Arma extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, arma, direction, player, playerOpuesto, damage, HUD, width, height) {
        super(scene, x, y, width, height, 0xf0000);
        scene.add.existing(this).setScale(0.2, 0.2);
        scene.physics.add.existing(this);
        this.delete = false;
        this.tiempo = undefined;
        this.tiempoRetardo = undefined;
        this.contRetardo = 0;
        this.contAtaque = 0;
        this.HUD = HUD;
        this.damage = damage;
        this.arma = arma;
        this.direction = direction;
        this.player = player;
        this.playerOpuesto = playerOpuesto;
        this.scene = scene;
        this.yPos = y;
        this.init();
        this.setVisible(false);
        this.body.setAllowGravity(false);
    }

    init() {

        if (this.arma === 'Espada1') {
            this.damage = 25;
            this.tiempo = 500;
            this.tiempoRetardo = 200;

        } else if (this.arma === 'Espada2') {
            this.damage = 10;
            this.tiempo = 300;
            this.tiempoRetardo = 0;
        } else if (this.arma === 'Lanza') {
            this.y = this.y - 60;
            this.damage = 15;
            this.tiempo = 300;
            this.tiempoRetardo = 0;

        } else if (this.arma === 'Maza') {
            this.y = this.y - 60;
            this.damage = 10;
            this.tiempo = 300;
            this.tiempoRetardo = 0;
        }
        else if (this.arma === 'Fuego') {
            this.y = this.y - 60;
            this.damage = 40;
            this.tiempo = 3000;
            this.tiempoRetardo = 0;
        }

        if (this.direction === 0) {
            this.setPosition(this.x - 60, this.y);
        }
        else {
            this.setPosition(this.x + 60, this.y);
        }
    }

    followPlayer(speed, y) {
        this.body.setVelocityX(this.player.body.velocityX);
        this.y = this.player.y - 60;
    }


    preUpdate(t, dt) {
        this.followPlayer();
        this.contRetardo += dt;
        this.contAtaque += dt;
        this.scene.physics.add.overlap(this, this.playerOpuesto, end => {
            this.scene.hitPlayer(this.playerOpuesto, this.damage);
            this.destroy();
        });
        if (this.contRetardo > this.tiempoRetardo) {
            this.contRetardo = 0;
        }
        //console.log(this.contAtaque);
        if (this.contAtaque > this.tiempo) {
           this.destroy();
        }
    }
}