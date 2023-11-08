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
        super(scene, x, y, 'OVNI');
        scene.add.existing(this).setScale(0.3,0.3);
        scene.physics.add.existing(this);
        this.body.setBounce(1, 0);
        this.eliminate = false; 
        this.init();
        this.flipY = true;
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.player = player;
        this.player2 = player2;
    }
   


    init() {
        this.body.setVelocityX(100);
    }
    shoot() {
        new Laser(this.scene, this.x, this.y, this.player, this.player2);
    }

    preUpdate(t) {      
        this.body.setVelocityY(-10);
        if (this.delete) {//Elimina
            this.destroy();
        }  
    }
}