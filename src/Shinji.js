

export default class Shinji extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, player,floor) {//Habra que pasarle player1 y player2 para que colisione con ellos 
        super(scene, x, y, 'Snormalattack','Sstrongattack', 'Shinjiidle', 'Shinjijump', 'Shinjiwalk');
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
        this.left = false
        this.name = 'Shinji';

        scene.anims.create({//Anim basica
            key: 'Sidle',
            frames: scene.anims.generateFrameNumbers('Shinjiidle', { start: 0, end: 7 }),
            frameRate: 9,
            repeat: -1
        });
        scene.anims.create({//Anim explosion
            key: 'Swalk',
            frames: scene.anims.generateFrameNumbers('Shinjiwalk', { start: 0, end: 7 }),
            frameRate: 15,
            repeat: -1
        });
        scene.anims.create({//Anim explosion
            key: 'Sjump',
            frames: scene.anims.generateFrameNumbers('Shinjijump', { start: 0, end: 1 }),
            frameRate: 15,
            repeat: 0
        });
        scene.anims.create({//Anim explosion
            key: 'Sstrongattack',
            frames: scene.anims.generateFrameNumbers('Shinjistrongattack', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });
        scene.anims.create({//Anim explosion
            key: 'Snormalattack',
            frames: scene.anims.generateFrameNumbers('Shinjinormalattack', { start: 0, end: 3 }),
            frameRate: 15,
            repeat: 0
        });
        this.on('animationcomplete', end => {//Detecta que ha finalizado la explosion
            if (this.anims.currentAnim.key === 'Snormalattack') {
               // this.body.setVelocityX(0);
                this.attacking = false;
                this.nattacking = false;
            }
        })
        this.on('animationcomplete', end => {//Detecta que ha finalizado la explosion
            if (this.anims.currentAnim.key === 'Sstrongattack') {
               // this.body.setVelocityX(0);
                this.attacking = false;
            }
        })
        this.on('animationcomplete', end => {//Detecta que ha finalizado la explosion
            if (this.anims.currentAnim.key === 'Sjump') {
               // this.body.setVelocityX(0);

            }
        })



        this.play('Sidle');
        this.wKey = this.scene.input.keyboard.addKey('W'); 
        this.aKey = this.scene.input.keyboard.addKey('A'); 
        this.dKey = this.scene.input.keyboard.addKey('D'); 
        this.gKey = this.scene.input.keyboard.addKey('ctrl');
        this.hKey = this.scene.input.keyboard.addKey('shift'); 
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        if (this.body.onFloor()) {
            this.jumps = 0;
            this.jumping = false;
        }
        if (this.aKey.isDown && this.dKey.isDown) {
            this.body.setVelocityX(0);
            if (!this.attacking && !this.jumping) {
                if (this.anims.currentAnim.key !== 'Sidle') {
                    this.play('Sidle');
                }
            }
        }
        else if (this.aKey.isDown) {
            if (this.anims.currentAnim.key !== 'Swalk') {
                this.setFlip(true, false)
                if (!this.jumping && !this.attacking) {
                    this.play('Swalk');
                }
                if (!this.nattacking&&!this.attacking) {
                    this.body.setVelocityX(-125);
                }               
                this.moving = true;
                this.left = true;
            }
        }
        else if (this.dKey.isDown) {
            if (this.anims.currentAnim.key !== 'Swalk') {
                this.setFlip(false, false)
                if (!this.jumping && !this.attacking) {
                    this.play('Swalk');
                }
                if (!this.nattacking && !this.attacking) {
                    this.body.setVelocityX(125);
                }    
                this.moving = true;
                this.left = false;
            }
        }
        else {
            if (!this.attacking && !this.jumping) {
                if (this.anims.currentAnim.key !== 'Sidle') {
                    this.play('Sidle');
                }
            }
          
        }
        if (Phaser.Input.Keyboard.JustDown(this.wKey) &&this.jumps<2) {
            this.jumps++;
            this.body.setVelocityY(-375);
            if (this.anims.currentAnim.key !== 'Sjump') {
                this.play('Sjump');
                this.jumping = true;
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.gKey)) {
            if (this.anims.currentAnim.key !== 'Sstrongattack') {
                this.play('Sstrongattack');
                this.attacking = true;
                if (!this.jumping) this.body.setVelocityX(0);
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.hKey)) {
            if (this.anims.currentAnim.key !== 'Snormalattack') {
                this.play('Snormalattack');
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