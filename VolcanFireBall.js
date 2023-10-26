

export default class VolcanFireBall extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, player) {//Habra que pasarle player1 y player2 para que colisione con ellos 
        super(scene, x, y, 'VFB');
        scene.add.existing(this).setScale(1.5,1.5);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, player);
        this.eliminate = false;

        this.scene.anims.create({//Anim basica
            key: 'fallFB',
            frames: scene.anims.generateFrameNumbers('VFB', { start: 0, end: 49 }),
            frameRate: 15,
            repeat: -1
        });
        this.scene.anims.create({//Anim explosion
            key: 'hitExplosion',
            frames: scene.anims.generateFrameNumbers('Explosion', { start: 0, end: 4 }),
            frameRate: 15,
            repeat: 0
        });
        this.on('animationcomplete', end => {//Detecta que ha finalizado la explosion
            if (this.anims.currentAnim.key === 'hitExplosion') {
                console.log('Elimina');
                this.eliminate = true;
            }
        })
       

        this.play('fallFB');
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
       
        if (this.body.position.y > 380) {//Llega al suelo
            this.play('hitExplosion')
            this.body.velocity.y = 0;          
        }
        else this.body.velocity.y = 200;//Cae

       
      

        if (this.eliminate) {//Elimina
            this.destroy();
        }  
    }
}