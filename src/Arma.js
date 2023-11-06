

export default class Arma extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, arma, direction, player, playerOpuesto, daño, HUD) {
        super(scene, x, y);
        scene.add.existing(this).setScale(0.2, 0.2);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, floor);
        this.HUD = HUD;
        this.daño = daño;

        this.collider = scene.physics.add.collider(this, playerOpuesto, end => {
            if (playerOpuesto.name == HUD.player2.name) HUD.BarraDeVida2.decrease(this.damage);
            else if (playerOpuesto.name = HUD.player1.name) HUD.BarraDeVida1.decrease(this.damage);
            playerOpuesto.vida -= this.damage;
        });       
    }
    init(t) {
       
    }

    preUpdate(t) {      
        
    }
}