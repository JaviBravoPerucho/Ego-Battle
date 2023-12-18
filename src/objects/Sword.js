

export default class Sword extends Phaser.GameObjects.Image {
    constructor(scene, x, y, player1, player2, floor, time) {//Habra que pasarle player1 y player2 para que colisione con ellos 
        super(scene, x, y, 'Sword');
        scene.add.existing(this).setScale(0.05,0.05);
        scene.physics.add.existing(this);
        this.eliminate = false; 
        this.damage = 5;
        this.colliderSword = scene.physics.add.collider(this, player1, collision => {//colision con player
            scene.hitPlayer(player1, this.damage, 0)
            this.eliminate = true;
        });
        this.colliderSword1 = scene.physics.add.collider(this, player2, collision => {//colision con player
            scene.hitPlayer(player2, this.damage, 0)
            this.eliminate = true;
        });
        scene.physics.add.collider(this, floor, collision =>
        {
            this.scene.sound.play('sword', { volume: 0.1 });
            scene.physics.world.removeCollider(this.colliderSword);
            scene.physics.world.removeCollider(this.colliderSword1);
        });//Al tocar el suelo ya no se choca con los jugadores, porque se clava
         
        this.init(time);
        this.flipY = true;
    }
    init(t) {//se destruye si nadie la pega
        this.timeToDestroy = t + 15000;
    }

    preUpdate(t) {      
        
        this.body.velocity.y = 300;//Cae
        if (this.body.position.y > 600) { this.eliminate = true; }       
        if (t > this.timeToDestroy) this.eliminate = true;
        if (this.eliminate) {//Elimina
            this.destroy();
        }  
    }
}