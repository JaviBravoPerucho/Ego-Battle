export default class Azazel extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, floor, player2, HUD) {//Habra que pasarle player2 para que colisione con ellos 
        super(scene, x, y);
        scene.add.existing(this).setScale(2, 2);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, floor);
        this.body.setSize(20, 45);
        this.body.setOffset(65, 55);
        this.scene = scene;
        this.player2 = player2;
        this.floor = floor;
        this.hit = false;
        this.onAir = false;
        this.eliminate = false;
        this.attacking = false;
        this.right = true;
        this.fireDuration = 3;
        this.fire = 0;
        this.jumps = 0
        this.vida = 300;
        this.HUD = HUD;
        this.name = 'Azazel';
        this.boolPoder = false;
        this.poder = 0; 
        this.poderPorFrame = 0.1;
        this.stop = false;
        this.idleKey = 'Azidle';

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
            frameRate: 15,
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

        if (!this.stop) {
            if (this.aKey.isDown && this.dKey.isDown) {
                this.body.setVelocityX(0);
                if (!this.onAir && !this.attacking && this.anims.currentAnim.key !== 'Azidle') { this.play('Azidle'); }
                // else if (!this.attacking && this.onAir && this.anims.currentAnim.key !== 'Ajump') { this.play('Ajump'); }
            }
            else if (this.aKey.isDown) {
                if (this.right) { this.setFlip(true, false); this.right = false; }
                if (this.attacking) { this.body.setVelocityX(-60); }
                else { this.body.setVelocityX(-150); }
                if (this.anims.currentAnim.key !== 'Azwalk') {
                    if (!this.attacking) { this.play('Azwalk'); }
                    // else if (!this.attacking) { this.play('Ajump');}
                }
            }
            else if (this.dKey.isDown) {
                if (!this.right) { this.setFlip(false, false); this.right = true; }
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

            if (Phaser.Input.Keyboard.JustDown(this.wKey) && this.jumps < 2) {
                this.jumps++;
                this.body.setVelocityY(-350);
                if (this.anims.currentAnim.key !== 'Azwalk' && !this.attacking) {
                    this.play('Azwalk');
                }
            }
            if (Phaser.Input.Keyboard.JustDown(this.gKey) && !this.attacking) {
                if (this.anims.currentAnim.key !== 'AzSA') {
                    this.play('AzSA');
                    this.throwFireBall();
                    this.attacking = true;
                }
            }
            if (Phaser.Input.Keyboard.JustDown(this.hKey) && !this.attacking) {
                if (this.anims.currentAnim.key !== 'AzNA') {
                    this.play('AzNA');
                    this.attacking = true;
                }
            }

            if (this.poder < this.HUD.maxPoder && this.boolPoder) {
                this.poder += this.poderPorFrame;
                if (this.HUD.player1 === this) this.HUD.BarraDePoder1.increase(this.poderPorFrame);
                else if (this.HUD.player2 === this) this.HUD.BarraDePoder2.increase(this.poderPorFrame);
            }

            if (this.body.velocity.x === 0 && !this.onAir) this.boolPoder = true;
            else this.boolPoder = false;
        } else this.body.setVelocityX(0);
        
    }

    throwFireBall() {

        let dir, x, y;
        if (this.right) { dir = 1; x = this.body.x + 80; y = this.body.y + 40;}
        else { dir = 0; x = this.body.x - 45; y = this.body.y + 40;}
        new AzazelBall(this.scene, x, y, dir, this.player2, this.floor, this.HUD);
    }

}
export class AzazelBall extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, direction, player2, floor, HUD) {
        super(scene, x, y);
        scene.add.existing(this).setScale(0.2, 0.2);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, floor);
        this.delete = false;
        this.elapsed = 0;
        this.damage = 10;
        this.HUD = HUD;
        scene.physics.add.collider(this, player2, end => {
            scene.hitPlayer(player2, this.damage);
            this.delete = true;
        });
        this.body.setSize(130, 130);
        this.body.setOffset(240, 180);
        if (direction == 0) { this.body.setVelocityX(-200); this.setFlip(true, false)}
        else { this.body.setVelocityX(200);}      

        scene.anims.create({//Anim idle
            key: 'AFB',
            frames: scene.anims.generateFrameNumbers('AzazelBall', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        this.play('AFB');
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        this.body.setVelocityY(0);
        this.elapsed += dt;
        if (this.elapsed > 5000) { this.delete = true;}
        if (this.delete) { this.destroy();}
    }
}