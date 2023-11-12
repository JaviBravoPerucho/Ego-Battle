
export default class Arma extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, arma, direction, player, playerOpuesto, damage, HUD, width, height) {
        super(scene, x, y, width, height);
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


        this.collider = scene.physics.add.collider(this, playerOpuesto, end => {
            if (playerOpuesto.name == HUD.player2.name) HUD.BarraDeVida2.decrease(this.damage);
            else if (playerOpuesto.name = HUD.player1.name) HUD.BarraDeVida1.decrease(this.damage);
            playerOpuesto.vida -= this.damage;
        });       
    }
    init(t) {
        this.body.setSize(width, height);
        this.collider.active = false;
        if (this.arma === 'Espada1') {
            this.tiempo = 0.5;
            this.tiempoRetardo = 0.2;

        } else if (this.arma === 'Espada2') {
            this.tiempo = 0.3;
            this.tiempoRetardo = 0;
        } else if (this.arma === 'Lanza') {

        } else if (this.arma === 'Maza') {

        }

        if (direction === 0) {
            this.body.x -= 20;
        } else this.body.x += 20;
    }

    preUpdate(t) {      
        this.contRetardo++;
        if (this.contRetardo > this.tiempoRetardo) {
            this.collider.active = true;
            this.contAtaque++;
            if (this.contAtaque > this.tiempo) {
                this.destroy();
            }
        }
    }
}