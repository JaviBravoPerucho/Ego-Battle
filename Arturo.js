export default class Arturo extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, player, floor) {//Habra que pasarle player2 para que colisione con ellos 
        super(scene, x, y);
        scene.add.existing(this).setScale(1.5, 1.5);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, floor);
        this.hit = false;
        this.onAir = false;
        this.eliminate = false;
        this.attacking = false;
        this.jumps = 0

        scene.anims.create({//Anim idle
            key: 'Aidle',
            frames: scene.anims.generateFrameNumbers('Arturoidle', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({//Anim andar
            key: 'Awalk',
            frames: scene.anims.generateFrameNumbers('Arturowalk', { start: 0, end: 7 }),
            frameRate: 15,
            repeat: -1
        });
        scene.anims.create({//Anim saltar
            key: 'Ajump',
            frames: scene.anims.generateFrameNumbers('Arturojump', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: 0
        });
        scene.anims.create({//Anim ataque fuerte
            key: 'ASA',
            frames: scene.anims.generateFrameNumbers('Arturostrongattack', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });
        scene.anims.create({//Anim ataque normal
            key: 'ANA',
            frames: scene.anims.generateFrameNumbers('Arturonormalattack', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
        });
        this.on('animationcomplete', end => {//Detecta que ha dejado de pegar
            if (this.anims.currentAnim.key === 'ASA' || this.anims.currentAnim.key === 'ANA') {
                this.attacking = false;
            }
        })


        this.play('Aidle');
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
        else { this.onAir = true; }

        if (this.aKey.isDown && !this.attacking) {
            if (this.onAir || (!this.attacking && !this.onAir)) { this.body.setVelocityX(-100); }
            if (this.anims.currentAnim.key !== 'Awalk') {
                this.setFlip(true, false)
                if (!this.attacking && !this.onAir) { this.play('Awalk');}           
            }
        }
        else if (this.dKey.isDown) {
            if (this.onAir || (!this.attacking && !this.onAir)) { this.body.setVelocityX(100); }
            if (this.anims.currentAnim.key !== 'Awalk') {          
                this.setFlip(false, false)
                if (!this.attacking && !this.onAir) { this.play('Awalk');}              
            }
        }
        else {         
            this.body.setVelocityX(0);
            if (!this.onAir && !this.attacking && this.anims.currentAnim.key !== 'Aidle') { this.play('Aidle'); }
            else if (!this.attacking && this.onAir) { this.play('Ajump');}
        }

        if (this.wKey.isDown && this.jumps < 2) {
            this.jumps++;
            this.body.setVelocityY(-500);
            if (this.anims.currentAnim.key !== 'Ajump' && !this.attacking) {
                this.play('Ajump');
            }
        }
        if (this.gKey.isDown && !this.attacking) {
            if (this.anims.currentAnim.key !== 'ASA') {
                this.play('ASA');
                this.attacking = true;
            }
        }
        if (this.hKey.isDown && !this.attacking) {
            if (this.anims.currentAnim.key !== 'ANA') {
                this.play('ANA');
                this.attacking = true;
            }
        }
    }
}