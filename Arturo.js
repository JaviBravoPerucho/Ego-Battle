export default class Arturo extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, floor) {//Habra que pasarle player2 para que colisione con ellos 
        super(scene, x, y);
        scene.add.existing(this).setScale(2, 2);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, floor);
        this.body.setSize(22, 45);
        this.body.setOffset(68, 60);
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
            frameRate: 8,
            repeat: 0
        });
        scene.anims.create({//Anim ataque normal
            key: 'ANA',
            frames: scene.anims.generateFrameNumbers('Arturonormalattack', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: 0
        });
        this.on('animationcomplete', end => {//Detecta que ha dejado de pegar
            if (this.anims.currentAnim.key === 'ASA' || this.anims.currentAnim.key === 'ANA') {
                this.attacking = false;
            }
        })


        this.play('Aidle');
        this.wKey = this.scene.input.keyboard.addKey('up');
        this.aKey = this.scene.input.keyboard.addKey('left');
        this.dKey = this.scene.input.keyboard.addKey('right');
        this.gKey = this.scene.input.keyboard.addKey('P');
        this.hKey = this.scene.input.keyboard.addKey('O');
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        if (this.body.onFloor()) {
            this.jumps = 0;
            this.onAir = false;
        }
        else { this.onAir = true; }

        if (this.aKey.isDown && this.dKey.isDown) {
            this.body.setVelocityX(0);
            if (!this.onAir && !this.attacking && this.anims.currentAnim.key !== 'Aidle') { this.play('Aidle'); }
            else if (!this.attacking && this.onAir && this.anims.currentAnim.key !== 'Ajump') { this.play('Ajump'); }
        }
        else if (this.aKey.isDown) {
            if (this.onAir || (!this.attacking && !this.onAir)) { this.body.setVelocityX(-160); }
            else { this.body.setVelocityX(0); }
            if (this.anims.currentAnim.key !== 'Awalk') {
                this.setFlip(true, false)
                if (!this.attacking && !this.onAir) { this.play('Awalk'); }
                else if (!this.attacking) { this.play('Ajump'); }
            }
        }
        else if (this.dKey.isDown) {
            if (this.onAir || (!this.attacking && !this.onAir)) { this.body.setVelocityX(160); }
            else { this.body.setVelocityX(0); }
            if (this.anims.currentAnim.key !== 'Awalk') {
                this.setFlip(false, false)
                if (!this.attacking && !this.onAir) { this.play('Awalk'); }
                else if (!this.attacking) { this.play('Ajump'); }
            }
        }
        else {
            this.body.setVelocityX(0);
            if (!this.onAir && !this.attacking && this.anims.currentAnim.key !== 'Aidle') { this.play('Aidle'); }
            else if (!this.attacking && this.onAir && this.anims.currentAnim.key !== 'Ajump') { this.play('Ajump'); }
        }

        if (Phaser.Input.Keyboard.JustDown(this.wKey) && this.jumps < 2) {
            this.jumps++;
            this.body.setVelocityY(-400);
            this.onAir = true;
            if (this.anims.currentAnim.key !== 'Ajump' && !this.attacking) {
                this.play('Ajump');
            }           
        }
        if (Phaser.Input.Keyboard.JustDown(this.gKey) && !this.attacking) {
            if (this.anims.currentAnim.key !== 'ASA') {
                this.play('ASA');
                this.attacking = true;
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.hKey) && !this.attacking) {
            if (this.anims.currentAnim.key !== 'ANA') {
                this.play('ANA');
                this.attacking = true;
            }
        }
    }
}