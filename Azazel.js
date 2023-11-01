export default class Azazel extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, player, floor) {//Habra que pasarle player2 para que colisione con ellos 
        super(scene, x, y);
        scene.add.existing(this).setScale(1.5, 1.5);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, floor);
        this.body.setSize(25, 45);
        this.body.setOffset(70, 60);
        this.hit = false;
        this.onAir = false;
        this.eliminate = false;
        this.attacking = false;
        this.jumps = 0

        scene.anims.create({//Anim idle
            key: 'Azidle',
            frames: scene.anims.generateFrameNumbers('Azazelidle', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({//Anim andar
            key: 'Azwalk',
            frames: scene.anims.generateFrameNumbers('Azazelwalk', { start: 0, end: 7 }),
            frameRate: 15,
            repeat: -1
        });
       /* scene.anims.create({//Anim saltar
            key: 'Ajump',
            frames: scene.anims.generateFrameNumbers('Arturojump', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: 0
        });*/
        scene.anims.create({//Anim ataque fuerte
            key: 'AzSA',
            frames: scene.anims.generateFrameNumbers('Azazelstrongattack', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });
        scene.anims.create({//Anim ataque normal
            key: 'AzNA',
            frames: scene.anims.generateFrameNumbers('Azazelnormalattack', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });
        this.on('animationcomplete', end => {//Detecta que ha dejado de pegar
            if (this.anims.currentAnim.key === 'AzSA' || this.anims.currentAnim.key === 'AzNA') {
                this.attacking = false;
            }
        })


        this.play('Azidle');
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
            this.onAir = false;
        }
        else { this.onAir = true;}

        if (this.aKey.isDown && this.dKey.isDown) {
            this.body.setVelocityX(0);
            if (!this.onAir && !this.attacking && this.anims.currentAnim.key !== 'Azidle') { this.play('Azidle'); }
           // else if (!this.attacking && this.onAir && this.anims.currentAnim.key !== 'Ajump') { this.play('Ajump'); }
        }
        else if (this.aKey.isDown) {
            if (this.onAir || (!this.attacking && !this.onAir)) { this.body.setVelocityX(-125); }
            else { this.body.setVelocityX(0); }
            if (this.anims.currentAnim.key !== 'Azwalk') {
                this.setFlip(true, false)
                if (!this.attacking && !this.onAir) { this.play('Azwalk'); }
               // else if (!this.attacking) { this.play('Ajump');}
            }
        }
        else if (this.dKey.isDown) {
            if (this.onAir || (!this.attacking && !this.onAir)) { this.body.setVelocityX(125); }
            else { this.body.setVelocityX(0); }
            if (this.anims.currentAnim.key !== 'Azwalk') {          
                this.setFlip(false, false)
                if (!this.attacking && !this.onAir) { this.play('Azwalk'); }
               // else if (!this.attacking) { this.play('Ajump'); }
            }
        }
        else {         
            this.body.setVelocityX(0);
            if (!this.onAir && !this.attacking && this.anims.currentAnim.key !== 'Azidle') { this.play('Azidle'); }
            //else if (!this.attacking && this.onAir && this.anims.currentAnim.key !== 'Ajump') { this.play('Ajump');}
        }

        if (Phaser.Input.Keyboard.JustDown(this.wKey) && this.jumps < 2) {
            this.jumps++;
            this.body.setVelocityY(-400);
            if (this.anims.currentAnim.key !== 'Azwalk' && !this.attacking) {
                this.play('Azwalk');
            }
        }
        if (this.gKey.isDown && !this.attacking) {
            if (this.anims.currentAnim.key !== 'AzSA') {
                this.play('AzSA');
                this.attacking = true;
            }
        }
        if (this.hKey.isDown && !this.attacking) {
            if (this.anims.currentAnim.key !== 'AzNA') {
                this.play('AzNA');
                this.attacking = true;
            }
        }
    }
}