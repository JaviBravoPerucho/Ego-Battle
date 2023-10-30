

export default class Trevor extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, player,floor) {//Habra que pasarle player1 y player2 para que colisione con ellos 
        super(scene, x, y, 'Tnormalattack','Tstrongattack', 'Trevoridle', 'Trevorjump', 'Trevorwalk');
        scene.add.existing(this).setScale(1.5, 1.5);

        scene.physics.add.existing(this);
        scene.physics.add.collider(this, floor);
        this.body.setSize(25, 35);
        this.body.setOffset(65, 60);
        this.hit = false;
        this.eliminate = false;
        this.jumps = 0
        this.attacking = false;
        this.nattacking = false;
        this.moving = false;
        this.jumping = false;
        this.left=false
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
            repeat: 0
        });
        scene.anims.create({//Anim explosion
            key: 'Tstrongattack',
            frames: scene.anims.generateFrameNumbers('Trevorstrongattack', { start: 0, end: 3 }),
            frameRate: 15,
            repeat: 0
        });
        scene.anims.create({//Anim explosion
            key: 'Tnormalattack',
            frames: scene.anims.generateFrameNumbers('Trevornormalattack', { start: 0, end: 3 }),
            frameRate: 15,
            repeat: 0
        });
        this.on('animationcomplete', end => {//Detecta que ha finalizado la explosion
            if (this.anims.currentAnim.key === 'Tnormalattack') {
                this.body.setVelocityX(0);
                this.attacking = false;
                this.nattacking = false;
            }
        })
        this.on('animationcomplete', end => {//Detecta que ha finalizado la explosion
            if (this.anims.currentAnim.key === 'Tstrongattack') {
                this.body.setVelocityX(0);
                this.attacking = false;
            }
        })
        //this.on('animationcomplete', end => {//detecta que ha finalizado la explosion
        //    if (this.anims.currentanim.key === 'twalk') {
        //        this.body.setvelocityx(0);

        //    }
        //})
        this.on('animationcomplete', end => {//Detecta que ha finalizado la explosion
            if (this.anims.currentAnim.key === 'Tjump') {
                this.body.setVelocityX(0);

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
            this.jumping = false;
        }
        if (this.aKey.isDown) {
            if (this.anims.currentAnim.key !== 'Twalk') {
                this.setFlip(true, false)
                if (!this.jumping && !this.attacking) {
                    this.play('Twalk');
                }
                if (!this.nattacking) {
                    this.body.setVelocityX(-125);
                }               
                this.moving = true;
                this.left = true;
            }
        }
        else if (this.dKey.isDown) {
            if (this.anims.currentAnim.key !== 'Twalk') {
                this.setFlip(false, false)
                if (!this.jumping && !this.attacking) {
                    this.play('Twalk');
                }
                if (!this.nattacking) {
                    this.body.setVelocityX(125);
                }    
                this.moving = true;
                this.left = false;
            }
        }
        else {
            if (!this.attacking && !this.jumping) {
                if (this.anims.currentAnim.key !== 'Tidle') {
                    this.play('Tidle');
                }
            }
          
        }
        if (this.wKey.isDown&&this.jumps<2) {
            this.jumps++;
            this.body.setVelocityY(-500);
            if (this.anims.currentAnim.key !== 'Tjump') {
                this.play('Tjump');
                this.jumping = true;
            }
        }
        if (this.gKey.isDown) {
            if (this.anims.currentAnim.key !== 'Tstrongattack') {
                this.play('Tstrongattack');
                this.attacking = true;
            }
        }
        if (this.hKey.isDown) {
            if (this.anims.currentAnim.key !== 'Tnormalattack') {
                this.play('Tnormalattack');
                if (!this.left) this.body.setVelocityX(500);
                else this.body.setVelocityX(-500);
                this.attacking = true;
                this.nattacking = true;
                
            }
        }
        
        if (!this.aKey.isDown && !this.dKey.isDown&&!this.attacking) {
            this.body.setVelocityX(0);

        }

    }
}