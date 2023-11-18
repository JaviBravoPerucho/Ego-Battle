
export default class Shinji extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, player,floor) {//Habra que pasarle player1 y player2 para que colisione con ellos 
        super(scene, x, y, 'Shinjinormalattack','Shinjistrongattack', 'Shinjiidle', 'Shinjijump', 'Shinjiwalk');
        scene.add.existing(this).setScale(1.2, 1.2);

        scene.physics.add.existing(this);
        scene.physics.add.collider(this, floor);
        this.body.setSize(35, 65);
        this.body.setOffset(15, 20);
        this.hit = false;
        this.eliminate = false;
        this.jumps = 0
        this.attacking = false;
        this.onAir = false;
        this.vida = 300;
        this.name = 'Shinji';

        scene.anims.create({//Anim basica
            key: 'Sidle',
            frames: scene.anims.generateFrameNumbers('Shinjiidle', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        scene.anims.create({//Anim explosion
            key: 'Swalk',
            frames: scene.anims.generateFrameNumbers('Shinjiwalk', { start: 0, end: 4 }),
            frameRate: 40,
            repeat: -1
        });
        scene.anims.create({//Anim explosion
            key: 'Sjump',
            frames: scene.anims.generateFrameNumbers('Shinjijump', { start: 0, end: 0 }),
            frameRate: 15,
            repeat: 0
        });
        scene.anims.create({//Anim explosion
            key: 'Sstrongattack',
            frames: scene.anims.generateFrameNumbers('Shinjistrongattack', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: 0
        });
        scene.anims.create({//Anim explosion
            key: 'Snormalattack',
            frames: scene.anims.generateFrameNumbers('Shinjinormalattack', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: 0
        });
        this.on('animationcomplete', end => {//Detecta que ha finalizado la explosion
            if (this.anims.currentAnim.key === 'Snormalattack' || this.anims.currentAnim.key === 'Sstrongattack') {
                this.attacking = false;
            }
        })
        this.wKey = this.scene.input.keyboard.addKey('up');
        this.aKey = this.scene.input.keyboard.addKey('left');
        this.dKey = this.scene.input.keyboard.addKey('right');
        this.gKey = this.scene.input.keyboard.addKey('P');
        this.hKey = this.scene.input.keyboard.addKey('O'); 



        this.play('Sidle');
    
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        if (this.body.onFloor()) {
            this.jumps = 0;
            this.onAir = false;
        }

        if (this.dKey.isDown && this.aKey.isDown) {
            this.body.setVelocityX(0);
            if (!this.onAir && !this.attacking && this.anims.currentAnim.key !== 'Sidle') { this.play('Sidle'); this.body.setOffset(15, 20); this.setPosition(this.x, this.y - 15); }
            else if (!this.attacking && this.onAir && this.anims.currentAnim.key !== 'Sjump') { this.play('Sjump'); this.body.setOffset(10, 5); }
        }
        else if (this.aKey.isDown) {
            this.direction = 0;
            if (this.onAir || (!this.attacking && !this.onAir)) { this.body.setVelocityX(-350); }
            else { this.body.setVelocityX(0); }
            if (this.anims.currentAnim.key !== 'Swalk') {
                this.setFlip(true, false)
                if (!this.attacking && !this.onAir) { this.play('Swalk'); this.body.setOffset(0, 15); if (this.anims.currentAnim.key !== 'Sidle') this.setPosition(this.x, this.y - 15); }
                else if (!this.attacking) { this.play('Sjump'); this.body.setOffset(10, 5); }
            }
        }
        else if (this.dKey.isDown) {
            this.direction = 1;
            if (this.onAir || (!this.attacking && !this.onAir)) { this.body.setVelocityX(350); }
            else { this.body.setVelocityX(0); }

            if (this.anims.currentAnim.key !== 'Swalk') {
                this.setFlip(false, false);
                if (!this.attacking && !this.onAir) { this.play('Swalk'); this.body.setOffset(0, 15); if (this.anims.currentAnim.key !== 'Sidle') this.setPosition(this.x, this.y - 15); }
                else if (!this.attacking) { this.play('Sjump'); this.body.setOffset(10, 5); }
            }
        }
        else {
            this.body.setVelocityX(0);
            if (!this.onAir && !this.attacking && this.anims.currentAnim.key !== 'Sidle') { this.play('Sidle'); this.body.setOffset(15, 20); this.setPosition(this.x, this.y - 15); }
            else if (!this.attacking && this.onAir && this.anims.currentAnim.key !== 'Sjump') { this.play('Sjump'); this.body.setOffset(10, 5); }
        }

        if (Phaser.Input.Keyboard.JustDown(this.wKey) && this.jumps < 2) {
            this.jumps++;
            this.setPosition(this.x, this.y - 20);
            this.body.setVelocityY(-350);
            this.onAir = true;
            if (this.anims.currentAnim.key !== 'Sjump' && !this.attacking) {
                this.play('Sjump');
                this.body.setOffset(10, 5);
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.gKey) && !this.attacking) {
            /*new Arma(this.x, this.y, this.arma1, this.direction, this, this.playerOpuesto, 10, this.HUD, 100, 100); */
            if (this.anims.currentAnim.key !== 'Sstrongattack') {
                this.play('Sstrongattack');
                this.attacking = true;
            }

        }
        if (Phaser.Input.Keyboard.JustDown(this.hKey) && !this.attacking) {
            /* new Arma(this.x, this.y, this.arma2, this.direction, this, this.playerOpuesto, 10, this.HUD, 100, 100);*/
            if (this.anims.currentAnim.key !== 'Snormalattack') {
                this.body.setOffset(15, 0);
                this.play('Snormalattack');
                this.attacking = true;
            }
        }
      
        if (this.vida <= 0) {
            this.HUD.countScore(this);
            this.destroy();
        }
    }
}