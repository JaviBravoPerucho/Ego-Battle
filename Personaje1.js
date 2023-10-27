

export default class Trevor extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, player,floor) {//Habra que pasarle player1 y player2 para que colisione con ellos 
        super(scene, x, y, 'Tnormalattack','Tstrongattack', 'Trevoridle', 'Trevorjump', 'Trevorwalk');
        scene.add.existing(this).setScale(1.5, 1.5);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, floor);
        this.hit = false;
        this.eliminate = false;
        this.jumps=0

        scene.anims.create({//Anim basica
            key: 'Tidle',
            frames: scene.anims.generateFrameNumbers('Trevoridle', { start: 0, end: 7 }),
            frameRate: 15,
            repeat: -1
        });
        scene.anims.create({//Anim explosion
            key: 'Twalk',
            frames: scene.anims.generateFrameNumbers('Trevorwalk', { start: 0, end: 7 }),
            frameRate: 15,
            repeat: -1
        });
        scene.anims.create({//Anim explosion
            key: 'Tjump',
            frames: scene.anims.generateFrameNumbers('Trevorjump', { start: 0, end: 1 }),
            frameRate: 15,
            repeat: -1
        });
        scene.anims.create({//Anim explosion
            key: 'Tstrongattack',
            frames: scene.anims.generateFrameNumbers('Trevorstrongattack', { start: 0, end: 3 }),
            frameRate: 15,
            repeat: -1
        });
        scene.anims.create({//Anim explosion
            key: 'Tnormalattack',
            frames: scene.anims.generateFrameNumbers('Trevornormalattack', { start: 0, end: 3 }),
            frameRate: 15,
            repeat: -1
        });
        this.on('animationcomplete', end => {//Detecta que ha finalizado la explosion
            if (this.anims.currentAnim.key === 'Tnormalattack') {
                this.body.setVelocityX(0);;
            }
        })


        this.play('Tidle');
        this.wKey = this.scene.input.keyboard.addKey('W'); 
        this.aKey = this.scene.input.keyboard.addKey('A'); 
        this.dKey = this.scene.input.keyboard.addKey('D'); 
        this.gKey = this.scene.input.keyboard.addKey('G');
        this.hKey = this.scene.input.keyboard.addKey('H'); 
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        if (this.body.onFloor()) {
            this.jumps = 0;
        }
        if (this.aKey.isDown) {
            if (this.anims.currentAnim.key !== 'Twalk') {
                this.setFlip(true, false)
                this.play('Twalk');
            }
        }
        if (this.dKey.isDown) {
            if (this.anims.currentAnim.key !== 'Twalk') {
                this.setFlip(false, false)
                this.play('Twalk');
            }
        }
        if (this.wKey.isDown&&this.jumps<2) {
            this.jumps++;
            this.body.setVelocityY(-500);
            if (this.anims.currentAnim.key !== 'Tjump') {
                this.play('Twalk');
            }
        }
        if (this.gKey.isDown) {
            if (this.anims.currentAnim.key !== 'Tstrongattack') {
                this.play('Tstrongattack');
            }
        }
        if (this.hKey.isDown) {
            if (this.anims.currentAnim.key !== 'Tnormalattack') {
                this.play('Tnormalattack');
                if (this.scale.x > 0) this.body.setVelocityX(500);
                else this.body.setVelocityX(-500);
                
            }
        }
    }
}