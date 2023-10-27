

export default class Sword extends Phaser.GameObjects.Image {
    constructor(scene, x, y, player, floor, time) {//Habra que pasarle player1 y player2 para que colisione con ellos 
        super(scene, x, y, 'Sword');
        scene.add.existing(this).setScale(0.05,0.05);
        scene.physics.add.existing(this);
        this.colliderSword = scene.physics.add.collider(this, player);
        scene.physics.add.collider(this, floor, collision =>
        { scene.physics.world.removeCollider(this.colliderSword) });//Al tocar el suelo ya no se choca con los jugadores, porque se clava
        this.eliminate = false;   
        this.init(time);
        this.flipY = true;
    }
    init(t) {
        console.log(this.timeToDestroy);//se destruye si nadie la pega
        this.timeToDestroy = t + 7000;
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