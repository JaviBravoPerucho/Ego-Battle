class Arma extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, arma, direction, player, playerOpuesto, damage, HUD, width, height) {
        super(scene, x, y, width, height, 0xf0000);
        scene.add.existing(this).setScale(0.2, 0.2);
        scene.physics.add.existing(this);
        this.delete = false;
        this.tiempo = undefined;
        this.tiempoRetardo = undefined;
        this.contRetardo = 0;
        this.contAtaque = 0;
        this.HUD = HUD;
        this.damage = damage;
        this.arma = arma;
        this.direction = direction;
        this.player = player;


        this.collider = scene.physics.add.collider(this, playerOpuesto, end => {
            if (playerOpuesto.name == HUD.player2.name) HUD.BarraDeVida2.decrease(this.damage);
            else if (playerOpuesto.name = HUD.player1.name) HUD.BarraDeVida1.decrease(this.damage);
            playerOpuesto.vida -= this.damage;
        });
    }
    init(t) {
        this.body.setSize(width, height);
        this.collider.active = false;
        if (this.arma === 'Espada1') {
            this.tiempo = 0.5;
            this.tiempoRetardo = 0.2;

        } else if (this.arma === 'Espada2') {
            this.tiempo = 0.3;
            this.tiempoRetardo = 0;
        } else if (this.arma === 'Lanza') {

        } else if (this.arma === 'Maza') {

        }

        if (direction === 0) {
            this.body.x -= 20;
        } else this.body.x += 20;
    }

    preUpdate(t) {
        this.contRetardo++;
        if (this.contRetardo > this.tiempoRetardo) {
            this.collider.active = true;
            this.contAtaque++;
            if (this.contAtaque > this.tiempo) {
                this.destroy();
            }
        }
    }
}

export default class Arturo extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, floor, HUD, playerOpuesto) {//Habra que pasarle player2 para que colisione con ellos 
        super(scene, x, y);
        this.x = x;
        this.y = y;
        scene.add.existing(this).setScale(2, 2);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, floor);
        this.body.setSize(22, 45);
        this.body.setOffset(68, 60);
        this.hit = false;
        this.onAir = false;
        this.eliminate = false;
        this.attacking = false;
        this.jumps = 0;
        this.vida = 300;
        this.name = 'Arturo';
        this.arma1 = 'Espada1';
        this.arma2 = 'Espada2';
        this.direction = 0;
        this.HUD = HUD;
        this.playerOpuesto = playerOpuesto;
        this.rect = undefined;

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
            this.direction = 0;
            if (this.onAir || (!this.attacking && !this.onAir)) { this.body.setVelocityX(-160); }
            else { this.body.setVelocityX(0); }
            if (this.anims.currentAnim.key !== 'Awalk') {
                this.setFlip(true, false)
                if (!this.attacking && !this.onAir) { this.play('Awalk'); }
                else if (!this.attacking) { this.play('Ajump'); }
            }
        }
        else if (this.dKey.isDown) {
            this.direction = 1;
            if (this.onAir || (!this.attacking && !this.onAir)) { this.body.setVelocityX(160); }
            else { this.body.setVelocityX(0); }

            if (this.anims.currentAnim.key !== 'Awalk') {
                this.setFlip(false, false);
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
            /*new Arma(this.x, this.y, this.arma1, this.direction, this, this.playerOpuesto, 10, this.HUD, 100, 100); */
            this.rect = this.scene.add.rectangle(this.x, this.y, 100, 100, 0xff0000);
            this.rect.collider = this.scene.physics.add.collider(this.rect, this.playerOpuesto, end => {
                if (this.playerOpuesto.name == this.HUD.player2.name) this.HUD.BarraDeVida2.decrease(10);
                else if (this.playerOpuesto.name = this.HUD.player1.name) this.HUD.BarraDeVida1.decrease(10);
                this.playerOpuesto.vida -= 10;
            });


            if (this.anims.currentAnim.key !== 'ASA') {
                this.play('ASA');
                this.attacking = true;
            }
          
        }
        if (Phaser.Input.Keyboard.JustDown(this.hKey) && !this.attacking) {
            /*new Arma(this.x, this.y, this.arma2, this.direction, this, this.playerOpuesto, 10, this.HUD, 100, 100);*/
            if (this.anims.currentAnim.key !== 'ANA') {
                this.play('ANA');
                this.attacking = true;
            }    
        }
    }
}