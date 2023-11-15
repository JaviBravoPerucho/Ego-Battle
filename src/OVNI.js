class Laser extends Phaser.GameObjects.Image {
    constructor(scene, x, y, player, player2) {
        super(scene, x, y, 'laser');      
        scene.add.existing(this).setScale(0.02, 0.02);      
        scene.physics.add.existing(this)
        this.body.setSize(5, 10);
        this.damage = 30;
        this.timeToDestroy = 1500;
        this.elapsed = 0;
        this.delete = false;
        scene.physics.add.collider(this, player, collision => {
            scene.hitPlayer(player, this.damage);
            this.delete = true;
        });
        scene.physics.add.collider(this, player2, collision => {
            scene.hitPlayer(player2, this.damage);
            this.delete = true;
        });
    }

    preUpdate(t, dt) {
        this.elapsed += dt;
        this.body.setVelocityY(300);
        if (this.elapsed > this.timeToDestroy) { this.delete = true; }
        if (this.delete) { this.destroy(); }
    }
}

export default class OVNI extends Phaser.GameObjects.Image {
    constructor(scene, x, y, player, player2, timeToShoot) {
        super(scene, x, y, 'OVNI');
        scene.add.existing(this).setScale(0.2,0.2);
        scene.physics.add.existing(this);
        this.body.setBounce(1, 0);
        this.eliminate = false; 
        this.init();
        this.flipY = true;
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.timeToShoot = timeToShoot;
        this.elapsed = 0;
        this.player = player;
        this.player2 = player2;
        this.body.setCollideWorldBounds(true);
        this.setFlip(true, false);
    }
   


    init() {
        this.body.setVelocityX(100);
    }
    shoot() {
        new Laser(this.scene, this.x, this.y + 40, this.player, this.player2);
    }

    preUpdate(t, dt) {      
        this.body.setVelocityY(-10);
        this.elapsed += dt;
        if (this.elapsed > this.timeToShoot) {
            this.shoot();
            this.elapsed = 0;
        }
        if (this.delete) {//Elimina
            this.destroy();
        }  
    }
}