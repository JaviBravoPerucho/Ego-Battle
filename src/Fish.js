

export default class Fish extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, player, player2, time) {//Habra que pasarle player1 y player2 para que colisione con ellos 
        super(scene, x, y, 'Fish');
        scene.add.existing(this).setScale(0.1,0.1);
        scene.physics.add.existing(this);
        this.hit = false;     
        this.eliminate = false;
        this.goUp = true;
        this.scene = scene;
        this.player = player;
        this.player2 = player2;
        this.damage = 25;
        
        this.scene.anims.create({//Anim basica
            key: 'flyFish',
            frames: scene.anims.generateFrameNumbers('Fish', { start: 0, end: 7 }),
            frameRate: 15,
            repeat: -1
        });      
        this.play('flyFish');
        this.init(time);
    }
    init(t) {
        this.timeToDestroy = t + 10000;
        let value;
        if (this.body.position.x > 600) { value = Phaser.Math.Between(-5, 0) * 30; }
        else { value = Phaser.Math.Between(0, 5) * 30; }
        this.body.setVelocityX(value);
    }

    preUpdate(t, dt) {
        this.rotation -= 0.02;
        super.preUpdate(t, dt);
        if (t > this.timeToDestroy) {
            this.eliminate = true;
        }
       
        if (this.body.position.y > 200 && this.goUp) {
            this.body.setVelocityY(-500)
        }
        else if(this.goUp) {
            this.collision = this.scene.physics.add.collider(this, this.player, collider => {
                this.scene.hitPlayer(this.player, 25);
                this.scene.physics.world.removeCollider(this.collision)
                this.hit = true;
            });
            this.collision1 = this.scene.physics.add.collider(this, this.player2, collider => {
                this.scene.hitPlayer(this.player2, 25);
                this.scene.physics.world.removeCollider(this.collision1)
                this.hit = true;
            });
            this.goUp = false;
        }
          
        if (this.eliminate) {//Elimina
            this.destroy();
        }  
    }
}