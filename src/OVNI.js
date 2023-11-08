class Laser extends Phaser.GameObjects.Image {
    constructor(scene, x, y, player, player2) {
        super(scene, x, y, 'laser');      
        scene.add.existing(this).setScale(1, 1);
        this.physics.add.existing(this)
        this.damage = 30;
        this.delete = false;
        scene.physics.add.collider(this, player, collision => {
            if (player.name == HUD.player2.name) HUD.BarraDeVida2.decrease(this.damage);
            else if (player.name = HUD.player1.name) HUD.BarraDeVida1.decrease(this.damage);
            player.vida -= this.damage;
            this.delete = true;
        });
    }
}

export default class OVNI extends Phaser.GameObjects.Image {
    constructor(scene, x, y, player, player2) {
        super(scene, x, y, 'Sword');
        scene.add.existing(this).setScale(0.05,0.05);
        scene.physics.add.existing(this);
        this.eliminate = false; 
        this.init();
        this.flipY = true;
    }

    init() {
        this.body.setVelocityX(100);
    }
    shoot() {

    }

    preUpdate(t) {      
        
        this.body.velocity.y = 300;//Cae   
        if (this.eliminate) {//Elimina
            this.destroy();
        }  
    }
}