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
        this.yPos = y;
        this.init();

    }

    init() {
     
        if (this.arma === 'Espada1') {
            this.tiempo = 500;
            this.tiempoRetardo = 200;

        } else if (this.arma === 'Espada2') {
            this.tiempo = 300;
            this.tiempoRetardo = 0;
        } else if (this.arma === 'Lanza') {

        } else if (this.arma === 'Maza') {

        }

        if (this.direction === 0) {
            this.setPosition(this.x - 60, this.y);
        }
        else {
            this.setPosition(this.x + 60, this.y);
        }
    }

    followPlayer(speed, y) {
        this.body.setVelocityX(this.player.body.velocityX);
        this.y = this.player.y - 60;
    }


    preUpdate(t, dt) {
        this.followPlayer();
        this.body.setVelocityY(-11);
        this.contRetardo += dt;
        this.contAtaque += dt;
        if (this.contRetardo > 100) {
            this.contRetardo = 0;
        }
        if (this.contAtaque > 500) {
            this.destroy();
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
        this.arma = undefined;
        this.arma1 = 'Espada1';
        this.arma2 = 'Espada2';
        this.direction = 0;
        this.HUD = HUD;
        this.playerOpuesto = playerOpuesto;
        this.rect = undefined;
        this.scene = scene;

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

    createWeapon() {
        this.arma = new Arma(this.scene, this.x , this.y + 60,'Espada1', this.direction, this, this.playerOpuesto, 20, this.HUD, 500, 100);
        this.arma.parent = this;
        this.scene.physics.add.overlap(this.arma, this.playerOpuesto, end => {
            if (this.playerOpuesto.name == this.HUD.player2.name) this.HUD.BarraDeVida2.decrease(this.arma.damage);
            else if (this.playerOpuesto.name = this.HUD.player1.name) this.HUD.BarraDeVida1.decrease(this.arma.damage);
            this.playerOpuesto.vida -= this.arma.damage;
            this.arma.destroy();
        });
       
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
            this.createWeapon();
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