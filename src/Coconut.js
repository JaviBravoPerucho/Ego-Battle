

export default class Coconut extends Phaser.GameObjects.Image {
    constructor(scene, x, y, player1, player2, floor, time) {//Habra que pasarle player1 y player2 para que colisione con ellos 
        super(scene, x, y, 'Coconut');
        scene.add.existing(this).setScale(0.05,0.05);
        scene.physics.add.existing(this);
        this.damage = 15;
        this.eliminate = false;   
        scene.physics.add.collider(this, player1, collision => {
            scene.hitPlayer(player1, this.damage);
            this.eliminate = true;
        });
        scene.physics.add.collider(this, player2, collision => {
            scene.hitPlayer(player2, this.damage);
            this.eliminate = true;
        });
        scene.physics.add.collider(this, floor) 
        this.body.collideWorldBounds = true;
        this.body.bounce.set(1);
        this.init(time);
        this.flipY = true;
    }
    init(t) {//se destruye si nadie le pega o lo golpea
        let value = Phaser.Math.Between(-5, 5) * 50;
        this.body.setVelocityX(value);
        this.timeToDestroy = t + 15000;
    }

    preUpdate(t) {      
        if (this.body.velocity.x > 0) { this.rotation += 0.01; }
        else { this.rotation -= 0.01; }
        
        if (this.body.position.y > 600) { this.eliminate = true; }       
        if (t > this.timeToDestroy) this.eliminate = true;
        if (this.eliminate) {//Elimina
            this.destroy();
        }  
    }
}