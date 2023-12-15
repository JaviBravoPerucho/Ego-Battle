import Arma from './Arma.js';

export default class Personaje extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, floor, HUD, playerOpuesto, width, height, bodyOffsetX, bodyOffsetY, name, arma1, arma1Width, arma1Height, arma2, arma2Width, arma2Height, indexPlayer, mapAnimaciones, mapFrameRates, mapFrames, mapRepeats, movingSpeed) {
        super(scene, x, y);

        scene.add.existing(this).setScale(2, 2);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, floor);
        this.body.setSize(width, height);
        this.body.setOffset(bodyOffsetX, bodyOffsetY);
        this.x = x;
        this.y = y;
        this.jumps = 0;
        this.vida = 300;
        this.HUD = HUD;
        this.playerOpuesto = playerOpuesto;
        this.name = name;
        this.direction = 0;//0 izquierda 1 derecha
        this.indexPlayer = indexPlayer;
        this.scene = scene;
        this.playerSpeed = movingSpeed;

        this.arma = undefined;
        this.rect = undefined;//Rectangulo para crear la colision del arma con el player opuesto
        this.arma1 = arma1;
        this.arma2 = arma2;
        this.armaName = undefined;
        this.armaWidth = undefined;
        this.armaHeight = undefined;
        this.arma1Width = arma1Width;
        this.arma1Height = arma1Height;
        this.arma2Width = arma2Width;
        this.arma2Height = arma2Height;

        this.mapAnimaciones = mapAnimaciones;//Mapas con las caracteristicas de las animaciones del personaje
        this.mapFrameRates = mapFrameRates;
        this.mapFrames = mapFrames;
        this.mapRepeats = mapRepeats;
        this.idle = this.mapAnimaciones["idle"];
        this.walk = this.mapAnimaciones["walk"];
        this.jump = this.mapAnimaciones["jump"];
        this.strongAttack = this.mapAnimaciones["strong"];
        this.normalAttack = this.mapAnimaciones["normal"];

        this.stop = false;
        this.hit = false;
        this.onAir = false;
        this.eliminate = false;
        this.attacking = false;
        this.boolPoder = true;
        this.isTrevor = (this.idle === 'Trevoridle');
        this.trevorAttack = false;
        this.knock = false;
        this.elapsedKnock = 0;
        this.timeToMove = 750;
        this.left = false;

        //Funcion para crear animaciones a partir de los arrays pasados por cada personaje
        function createAnim(keyString, frameRate, frames, repeat) {
            scene.anims.create({
                key:  keyString,
                frames: scene.anims.generateFrameNumbers(keyString, { start: 0, end: frames }),
                frameRate: frameRate,
                repeat: repeat
            });
        }
        this.on('animationcomplete', end => {//Detecta que ha dejado de pegar
            if (this.anims.currentAnim.key === this.strongAttack || this.anims.currentAnim.key === this.normalAttack) {
                this.attacking = false;
                if (this.isTrevor) { this.trevorAttack = false; }
            }
        })

        //Creación de las animaciones
        createAnim(this.idle, mapFrameRates["idle"], mapFrames["idle"], mapRepeats["idle"]);
        createAnim(this.walk, mapFrameRates["walk"], mapFrames["walk"], mapRepeats["walk"]);
        if (this.jump !== undefined) createAnim(this.jump, mapFrameRates["jump"], mapFrames["jump"], mapRepeats["jump"]);
        createAnim(this.strongAttack, mapFrameRates["strong"], mapFrames["strong"], mapRepeats["strong"]);
        createAnim(this.normalAttack, mapFrameRates["normal"], mapFrames["normal"], mapRepeats["normal"]);

        this.play(this.idle);

        if (this.indexPlayer === 1) {
            this.wKey = this.scene.input.keyboard.addKey('w');
            this.aKey = this.scene.input.keyboard.addKey('a');
            this.dKey = this.scene.input.keyboard.addKey('d');
            this.gKey = this.scene.input.keyboard.addKey('g');
            this.hKey = this.scene.input.keyboard.addKey('h');

        } else if (this.indexPlayer === 2) {
            this.wKey = this.scene.input.keyboard.addKey('up');
            this.aKey = this.scene.input.keyboard.addKey('left');
            this.dKey = this.scene.input.keyboard.addKey('right');
            this.gKey = this.scene.input.keyboard.addKey('O');
            this.hKey = this.scene.input.keyboard.addKey('P');
        }
    }
    createWeapon(type) {
        this.arma = new Arma(this.scene, this.x, this.y + 60, this.armaName, this.direction, this, this.playerOpuesto, 20, this.HUD, this.armaWidth, this.armaHeight, type);
      
    }

    applyKnockback(direction, power) {
        this.knock = true;
        this.body.setVelocityX(direction * power * 15);
        this.body.setVelocityY(-power * 35);
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        console.log(this.HUD.waitTime());
        if (this.HUD.waitTime()) {
            if (this.knock) {
                this.elapsedKnock += dt;
                if (this.elapsedKnock > this.timeToMove) {
                    this.elapsedKnock = 0;
                    this.knock = false;
                }
            }
            if (this.body.onFloor()) {
                this.jumps = 0;
                this.onAir = false;
            }
            else { this.onAir = true; }
            if (!this.stop && !this.trevorAttack) {
                if (this.aKey.isDown && this.dKey.isDown && !this.knock) {
                    this.body.setVelocityX(0);
                    if (!this.onAir && !this.attacking && this.anims.currentAnim.key !== this.idle) { this.play(this.idle); }
                    else if (!this.attacking && this.onAir && this.jump !== undefined && this.anims.currentAnim.key !== this.jump) { this.play(this.jump); }
                }
                else if (this.aKey.isDown) {
                    this.left = true;
                    this.direction = 0;
                    if (this.onAir || (!this.attacking && !this.onAir)) { this.body.setVelocityX(-this.playerSpeed); }
                    else if (!this.knock) { this.body.setVelocityX(0); }

                    if (this.anims.currentAnim.key !== this.walk) {
                        this.setFlip(true, false)
                        if (!this.attacking && !this.onAir) { this.play(this.walk); }
                        else if (!this.attacking && this.jump !== undefined) { this.play(this.jump); }
                    }
                }
                else if (this.dKey.isDown && !this.knock) {
                    this.left = false;
                    this.direction = 1;
                    if (this.onAir || (!this.attacking && !this.onAir)) { this.body.setVelocityX(this.playerSpeed); }
                    else if (!this.knock) { this.body.setVelocityX(0); }

                    if (this.anims.currentAnim.key !== this.walk) {
                        this.setFlip(false, false);
                        if (!this.attacking && !this.onAir) { this.play(this.walk); }
                        else if (!this.attacking && this.jump !== undefined) { this.play(this.jump); }
                    }
                }
                else {
                    if (!this.knock) this.body.setVelocityX(0);
                    if (!this.onAir && !this.attacking && this.anims.currentAnim.key !== this.idle) { this.play(this.idle); }
                    else if (!this.attacking && this.onAir && this.jump !== undefined && this.anims.currentAnim.key !== this.jump) { this.play(this.jump); }
                }

                if (Phaser.Input.Keyboard.JustDown(this.wKey) && this.jumps < 2 && !this.knock) {
                    this.jumps++;
                    this.body.setVelocityY(-400);
                    this.onAir = true;
                    if (this.jump !== undefined && this.anims.currentAnim.key !== this.jump && !this.attacking) {
                        this.play(this.jump);
                    }
                }
                if (Phaser.Input.Keyboard.JustDown(this.gKey) && !this.attacking) {
                    if (this.arma1 !== undefined) {
                        this.armaName = this.arma1;
                        this.armaWidth = this.arma1Width;
                        this.armaHeight = this.arma1Height;
                        this.createWeapon(0);
                        if (this.isTrevor) {
                            this.trevorAttack = true;
                            if (this.left) { this.body.setVelocityX(-400); }//ataque trevor hacia delante
                            else { this.body.setVelocityX(400); }
                        }
                    }
                    if (this.anims.currentAnim.key !== this.normalAttack) {
                        this.play(this.normalAttack);

                    }
                    this.attacking = true;

                }
                if (Phaser.Input.Keyboard.JustDown(this.hKey) && !this.attacking) {
                    if (this.arma2 !== undefined) {
                        this.armaWidth = this.arma2Width;
                        this.armaHeight = this.arma2Height;
                        this.armaName = this.arma2;
                        this.createWeapon(1);
                    }
                    if (this.anims.currentAnim.key !== this.strongAttack) {
                        this.play(this.strongAttack);

                    }
                    this.attacking = true;
                }

                if (this.vida <= 0) {
                    this.scene.playerDied(this);
                }

                if (this.y >= this.scene.alturaVacio) {
                    this.vida = 0;
                    this.y = this.scene.alturaInicial;
                    this.x = this.scene.posicionInicial;
                }
            }
        }
        else {
            //this.body.setVelocityX(0);
            //if (this.anims.currentAnim.key !== this.idle) { this.play(this.idle); }
        }

    }
    
}