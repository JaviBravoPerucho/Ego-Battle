export default class Azazel extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, floor) {//Habra que pasarle player2 para que colisione con ellos 
        super(scene, x, y);
        scene.add.existing(this).setScale(2, 2);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, floor);
        this.body.setSize(20, 45);
        this.body.setOffset(65, 55);
        this.hit = false;
        this.onAir = false;
        this.eliminate = false;
        this.attacking = false;
        this.right = true;
        this.fireDuration = 3;
        this.fire = 0;
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
            frameRate: 12,
            repeat: -1
        });
        scene.anims.create({//Anim ataque fuerte
            key: 'AzSA',
            frames: scene.anims.generateFrameNumbers('Azazelstrongattack', { start: 0, end: 3 }),
            frameRate: 22,
            repeat: 0
        });
        scene.anims.create({//Anim ataque normal
            key: 'AzNA',
            frames: scene.anims.generateFrameNumbers('Azazelnormalattack', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: 0
        });
        this.on('animationcomplete', end => {//Detecta que ha dejado de pegar
            if (this.anims.currentAnim.key === 'AzSA') {
                this.attacking = false;
            }
            else if (this.anims.currentAnim.key === 'AzNA') {
                if (this.fire < this.fireDuration) {
                    this.fire++;
                    this.play('AzNA');
                }
                else {
                    this.fire = 0;
                    this.attacking = false;
                }
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
            if (this.right) { this.setFlip(true, false); this.right = false; }
            if (this.attacking) { this.body.setVelocityX(-60); }
            else { this.body.setVelocityX(-150);}         
            if (this.anims.currentAnim.key !== 'Azwalk') {
                if (!this.attacking) { this.play('Azwalk'); }
               // else if (!this.attacking) { this.play('Ajump');}
            }
        }
        else if (this.dKey.isDown) {
            if (!this.right) { this.setFlip(false, false); this.right = true;}           
            if (this.attacking) { this.body.setVelocityX(60); }
            else { this.body.setVelocityX(150); }
            if (this.anims.currentAnim.key !== 'Azwalk') {                         
                if (!this.attacking) { this.play('Azwalk'); }
               // else if (!this.attacking) { this.play('Ajump'); }
            }
        }
        else {         
            this.body.setVelocityX(0);
            if (!this.onAir && !this.attacking && this.anims.currentAnim.key !== 'Azidle') { this.play('Azidle'); }
            //else if (!this.attacking && this.onAir && this.anims.currentAnim.key !== 'Ajump') { this.play('Ajump');}
        }

        if (Phaser.Input.Keyboard.JustDown(this.wKey) && this.jumps < 1) {
            this.jumps++;
            this.body.setVelocityY(-320);
            if (this.anims.currentAnim.key !== 'Azwalk' && !this.attacking) {
                this.play('Azwalk');
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.gKey) && !this.attacking) {
            if (this.anims.currentAnim.key !== 'AzSA') {
                this.play('AzSA');
                this.attacking = true;
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.hKey) && !this.attacking) {
            if (this.anims.currentAnim.key !== 'AzNA') {
                this.play('AzNA');
                this.attacking = true;
            }
        }
    }
}