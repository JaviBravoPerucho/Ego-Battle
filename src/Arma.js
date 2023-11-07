

export default class Arma extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, arma, direction, player, playerOpuesto, da�o, HUD) {
        super(scene, x, y);
        scene.add.existing(this).setScale(0.2, 0.2);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, floor);
        this.delete = false;
        this.tiempo = undefined;
        this.tiempoRetardo = undefined;
        this.HUD = HUD;
        this.da�o = da�o;

        this.collider = scene.physics.add.collider(this, playerOpuesto, end => {
            if (playerOpuesto.name == HUD.player2.name) HUD.BarraDeVida2.decrease(this.damage);
            else if (playerOpuesto.name = HUD.player1.name) HUD.BarraDeVida1.decrease(this.damage);
            playerOpuesto.vida -= this.damage;
        });       
    }
    init(t) {
        if (this.arma === 'Espada1') {
            this.tiempo = 0.5;
            this.tiempoRetardo = 0.2;

        } else if (this.arma === 'Espada2') {

        } else if (this.arma === 'Lanza') {

        } else if (this.arma === 'Maza') {

        }
    }

    preUpdate(t) {      
        
    }
}