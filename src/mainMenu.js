import MenuBackground from './ui/FondoMenu.js'
import CharacterSelector from './ui/CharacterSelector.js'
//import MainScene from './mainScene.js'

const ALTURA_MAPA = 300, DIF_MAPA = 230, POS_INICIAL_MAPA = 120, PROPORCION_MAPA = 0.3, OFFSET_PARPADEO_MAPA = 0.02;
const ELAPSED_MARCOS = 300, ELAPSED_START_BUTTON = 500, ELAPSED_MAPAS = 300
const PROPORCION_SELECTOR = 1.2, OFFSET_SELECTOR = 302, OFFSET_PARPADEO_SELECTOR = 0.05;
const PROP_START = 0.15, OFFSET_PARPADEO_START = 0.01;
const AR_W_PROP = 12, AZ_W_PROP = 2.17, T_W_PROP = 2.98, S_W_PROP = 4.78, CS_H_PROP = 7;
const TUT_TEXT1_X = 25, TUT_TEXT2_X = 900, TUT_TEXT_Y = 170;

class Selector extends Phaser.GameObjects.Image {
    constructor(scene, x, y, imageKey) {//Habra que pasarle player1 y player2 para que colisione con ellos 
        super(scene, x, y, imageKey);
        scene.add.existing(this).setScale(PROPORCION_SELECTOR, PROPORCION_SELECTOR);
        this.eliminate = false;
    }

    //Cambia la posicion del marco de seleccion una distancia fija en funcion de la direccion
    move(right) {
        if (right) {
            this.setPosition(this.x + OFFSET_SELECTOR, this.y)
        }
        else {
            this.setPosition(this.x - OFFSET_SELECTOR, this.y)
        }
    }
    preUpdate() { }
}

class Mapa extends Phaser.GameObjects.Image {
    constructor(scene, x, y, imageKey) {
        super(scene, x, y, imageKey);
        scene.add.existing(this).setScale(0.3, 0.3);
        this.setVisible(false);
        this.imageKey = imageKey;
        this.selected = false;
        this.elapsedTime = 0;
        this.changeSize = false;//Para cambiar el tamaño de la imagen e inducir el parpadeo
        this.intermitent = false;//Define si el mapa debe parpadear o no
        this.stopIntermitent = false;//Este booleano sirve para que cuando se haya seleccionado un mapa el resto deje de parapadear y no se puedan seleccionar
 
        this.on('pointerdown', () => { if (!this.stopIntermitent)this.selected = true });    
        this.on('pointerover', () => { if(!this.selected && !this.stopIntermitent)this.intermitent = true });
        this.on('pointerout', () => { if (!this.selected)this.intermitent = false })
    }

    preUpdate(t, dt) {
        if (this.intermitent) {
            this.elapsedTime += dt;
            if (this.elapsedTime > ELAPSED_MAPAS) {
                this.elapsedTime = 0;
                this.changeSize = !this.changeSize;
                if (this.changeSize) this.setScale(PROPORCION_MAPA + OFFSET_PARPADEO_MAPA, PROPORCION_MAPA + OFFSET_PARPADEO_MAPA)
                else this.setScale(PROPORCION_MAPA, PROPORCION_MAPA);
            }
        }    
    }
}


export class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'menu' })
        this.WIDTH = undefined;
        this.HEIGHT = undefined; 
        this.text = undefined;
        this.textY = undefined;
        this.player1 = undefined;
        this.player2 = undefined;
        this.player3 = undefined;
        this.player4 = undefined;
        this.startButton = undefined;
        this.akey = undefined;
        this.dkey = undefined;
        this.positionp1 = undefined;
        this.positionp2 = undefined;
        this.elapsed = 0;
        this.p1selected = false;
        this.p2selected = false;
        this.Selector1 = undefined;
        this.Selector2 = undefined;
        this.Selector3 = undefined;
        this.maxPosition = 3;
        this.changeSize = true;
        this.changeSize2 = true;
        this.changeSize3 = true;
        this.elapsedTime = 0;
        this.elapsedTime2 = 0;
        this.elapsedTime3 = 0;
        this.mapMuelle = undefined;
        this.mapEspacio = undefined;
        this.mapCastillo = undefined;
        this.mapJungla = undefined;
        this.mapVolcan = undefined;
        this.mapSelected = false;
        this.mapKey = undefined;
        this.arrayMapas = undefined;
        this.map = undefined;
        this.arrayPlayers = undefined;
        this.tutorialText1 = undefined;
        this.tutorialText2 = undefined;
        this.tutorialTexts = undefined;
        this.selectors = undefined;
        this.seleccionSonido1 = false;
        this.seleccionSonido2 = false;
    }

    preload() {
        //UI
        this.load.image('Arturo', './assets/img/arturoimages/arturo.png');
        this.load.image('Trevor', './assets/img/trevorimages/trevor.png');
        this.load.image('Azazel', './assets/img/azazelimages/azazelportrait.png');
        this.load.image('Shinji', './assets/img/shinjiimages/shinjiportrait.png');
        this.load.image('start', './assets/img/uiimages/Startbutton.png');
        this.load.spritesheet('MenuFondo', './assets/img/fondosimages/MenuFondo.png', { frameWidth: 960, frameHeight: 540 });
        this.load.image('nameImage', './assets/img/uiimages/marcoNombre.png');
        this.load.image('text', './assets/img/uiimages/textoMarco.png');
        this.load.image('textomarco', './assets/img/uiimages/Marcostexto.png');
        this.load.image('Selector1', './assets/img/uiimages/Selector1.png');
        this.load.image('Selector2', './assets/img/uiimages/Selector2.png');
        this.load.image('Selector3', './assets/img/uiimages/Selector3.png');
        this.load.image('castilloIcon', './assets/img/fondosimages/castilloIcon.png');
        this.load.image('muelleIcon', './assets/img/fondosimages/muelleIcon.png');
        this.load.image('junglaIcon', './assets/img/fondosimages/junglaIcon.png');
        this.load.image('volcanIcon', './assets/img/fondosimages/volcanIcon.png');
        this.load.image('espacioIcon', './assets/img/fondosimages/espacioIcon.png');

        //Audio
        this.load.audio('arturoSeleccion', './assets/Audio/personajes/arturoAudio/arturoSeleccion.mp3')
        this.load.audio('azazelSeleccion', './assets/Audio/personajes/azazelAudio/azazelSeleccion.mp3')
        this.load.audio('shinjiSeleccion', './assets/Audio/personajes/shinjiAudio/shinjiSeleccion.mp3')
        this.load.audio('trevorSeleccion', './assets/Audio/personajes/trevorAudio/trevorSeleccion.mp3')
        this.load.audio('botonStart', './assets/Audio/hud/botonStart.mp3')

    }

    shutdown() {
        this.p1selected = false;
        this.p2selected = false;
    }


    create() {
        this.positionp1 = 0;
        this.positionp2 = 3;
        this.HEIGHT = this.sys.game.canvas.height;
        this.WIDTH = this.sys.game.canvas.width;
        this.textY = -100;
        let style = { fontFamily: 'Pixels', fontSize: 100, fill: 'orange' };
        let styleblue = { fontFamily: 'Pixels', fontSize: 30, fill: '#87CEFA' };
        let stylered = { fontFamily: 'Pixels', fontSize: 30, fill: 'red' };

        new MenuBackground(this, this.WIDTH / 2, this.HEIGHT / 2).setScale(1.35, 1.2);
        this.text = this.add.text(25, this.textY, 'EGOBATTLE', style)
        this.tutorialText1 = this.add.text(TUT_TEXT1_X, this.textY + TUT_TEXT_Y, 'Player1: A-D + Space', stylered)
        this.tutorialText2 = this.add.text(TUT_TEXT2_X, this.textY + TUT_TEXT_Y, 'Player2: <- -> + Enter', styleblue)
        this.tutorialTexts = [this.tutorialText1, this.tutorialText2];
        this.startButton = this.add.image(this.WIDTH / 2.03, this.HEIGHT / 4, 'start').setScale(PROP_START, PROP_START).setInteractive().setVisible(false);

        this.Selector1 = new Selector(this, (this.WIDTH / AR_W_PROP) + 40, (this.HEIGHT / CS_H_PROP) + 65, 'Selector1');
        this.Selector2 = new Selector(this, (this.WIDTH / AZ_W_PROP) + 492, (this.HEIGHT / CS_H_PROP) + 65, 'Selector2');
        this.Selector3 = new Selector(this, 4000, (this.HEIGHT / 7) + 65, 'Selector3');
        this.selectors = [this.Selector1, this.Selector2, this.Selector3];

        this.startButton.on('pointerdown', () => {
            if (this.p1selected && this.p2selected && this.mapSelected) {             
                this.scene.stop(this);
                switch (this.mapKey) {
                    case 'volcanIcon':
                        this.map = 0;
                        break
                    case 'espacioIcon':
                        this.map = 1;
                        break
                    case 'muelleIcon':
                        this.map = 2;
                        break
                    case 'castilloIcon':
                        this.map = 3;
                        break
                    case 'junglaIcon':
                        this.map = 4;
                        break
                    default:
                        this.map = 3;
                            break
                }
                this.shutdown();
                this.scene.start('mainScene', { parametro0: this.map, parametro1: this.positionp1, parametro2: this.positionp2 });
                console.log("sigo vivo")
                //this.scene.start('mainScene');          
            }
        });

        this.player1 = new CharacterSelector(this, this.WIDTH / AR_W_PROP, this.HEIGHT / CS_H_PROP, 'Arturo');
        this.player2 = new CharacterSelector(this, this.WIDTH / AZ_W_PROP, this.HEIGHT / CS_H_PROP, 'Shinji');
        this.player3 = new CharacterSelector(this, this.WIDTH / T_W_PROP, this.HEIGHT / CS_H_PROP, 'Trevor');
        this.player4 = new CharacterSelector(this, this.WIDTH / S_W_PROP, this.HEIGHT / CS_H_PROP, 'Azazel');
        this.arrayPlayers = [this.player1, this.player2, this.player3, this.player4];

        this.mapCastillo = new Mapa(this, POS_INICIAL_MAPA, ALTURA_MAPA, 'castilloIcon');
        this.mapMuelle = new Mapa(this, POS_INICIAL_MAPA+DIF_MAPA, ALTURA_MAPA, 'muelleIcon');
        this.mapJungla = new Mapa(this, POS_INICIAL_MAPA+DIF_MAPA*2, ALTURA_MAPA, 'junglaIcon');
        this.mapEspacio = new Mapa(this, POS_INICIAL_MAPA+DIF_MAPA*3, ALTURA_MAPA, 'espacioIcon');
        this.mapVolcan = new Mapa(this, POS_INICIAL_MAPA + DIF_MAPA * 4, ALTURA_MAPA, 'volcanIcon');
        this.arrayMapas = [this.mapMuelle, this.mapEspacio, this.mapCastillo, this.mapJungla, this.mapVolcan];

        this.cursors = this.input.keyboard.createCursorKeys();
        this.akey = this.input.keyboard.addKey('A');
        this.dkey = this.input.keyboard.addKey('d');
        this.leftkey = this.input.keyboard.addKey('left');
        this.rightkey = this.input.keyboard.addKey('right');
        this.spacekey = this.input.keyboard.addKey('space');
        this.enterkey = this.input.keyboard.addKey('enter');
        console.log(this.Selector1);
    }
            

    update(t,dt) {
        if (this.textY < 5) {
            this.textY += 1;
            this.text.setPosition(this.WIDTH/4, this.textY);
        } 
        if (Phaser.Input.Keyboard.JustDown(this.spacekey)) {
            console.log("space")
            if (!this.p2selected || this.positionp1 !== this.positionp2) {
                this.p1selected = true;
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.enterkey)) {
            if (!this.p1selected || this.positionp1 !== this.positionp2) {
                this.p2selected = true;
            }
            console.log("enter")
           
        }
        this.elapsedTime += dt;
        this.elapsedTime2 += dt;

        if (!this.p1selected) {
            if (this.elapsedTime > ELAPSED_MARCOS) {
                this.elapsedTime = 0; 
                this.changeSize = !this.changeSize;
                if (this.changeSize) { this.Selector1.setScale(PROPORCION_SELECTOR, PROPORCION_SELECTOR); }
                else this.Selector1.setScale(PROPORCION_SELECTOR-OFFSET_PARPADEO_SELECTOR, PROPORCION_SELECTOR-OFFSET_PARPADEO_SELECTOR);
               
            }
            if (Phaser.Input.Keyboard.JustDown(this.akey)) {
                if (this.positionp1 > 0) {
                    this.positionp1--;
                    this.Selector1.move(false);

                }
            }
            if (Phaser.Input.Keyboard.JustDown(this.dkey)) {
                if (this.positionp1 < this.maxPosition) {
                    this.positionp1++;
                    this.Selector1.move(true);
                }
            }
        }
        else {
            this.Selector1.setScale(PROPORCION_SELECTOR, PROPORCION_SELECTOR);
        }
        if (!this.p2selected) {
            if (this.elapsedTime2 > ELAPSED_MARCOS) {
                this.elapsedTime2 = 0;
                this.changeSize2 = !this.changeSize2;
                if (this.changeSize2) { this.Selector2.setScale(PROPORCION_SELECTOR, PROPORCION_SELECTOR); }
                else this.Selector2.setScale(PROPORCION_SELECTOR-OFFSET_PARPADEO_SELECTOR, PROPORCION_SELECTOR-OFFSET_PARPADEO_SELECTOR);

            }
            if (Phaser.Input.Keyboard.JustDown(this.leftkey)) {
                if (this.positionp2 > 0) {

                    this.positionp2--;
                    this.Selector2.move(false);
                }
            }
            if (Phaser.Input.Keyboard.JustDown(this.rightkey)) {
                if (this.positionp2 < this.maxPosition) {
                    this.positionp2++;
                    this.Selector2.move(true);
                }
            }
        }
        else {
            this.Selector2.setScale(PROPORCION_SELECTOR, PROPORCION_SELECTOR);
        }

        if (this.p1selected && this.p2selected) {
            this.arrayPlayers.forEach((player) => {
                player.destroy();
            });
            this.tutorialTexts.forEach((text) => {
                text.destroy();
            });
            this.selectors.forEach((selector) => {
                selector.destroy();
            });

            this.arrayMapas.forEach((mapa) => {
                mapa.setInteractive();
                mapa.setVisible(true);
                if (mapa.selected) {
                    this.mapSelected = true;
                    this.mapKey = mapa.imageKey;
                    mapa.intermitent = true;
                }
            });
           
            if (this.mapSelected) {
                this.startButton.setVisible(true);
                this.arrayMapas.forEach((mapa) => {
                    if (!mapa.selected) mapa.stopIntermitent = true;
                });
                if (this.elapsedTime > ELAPSED_START_BUTTON) {
                    this.elapsedTime = 0;
                    this.changeSize = !this.changeSize;
                    if (this.changeSize) { this.startButton.setScale(PROP_START + OFFSET_PARPADEO_START, PROP_START + OFFSET_PARPADEO_START); }
                    else this.startButton.setScale(PROP_START, PROP_START);
                }
            }
        }

        if (this.positionp1 === this.positionp2) {
            this.Selector3.setPosition(this.Selector1.x, this.Selector3.y)
            this.Selector1.setPosition(this.Selector1.x, 4000)
            this.Selector2.setPosition(this.Selector2.x, 4000)
            
        }
        else {
            this.Selector1.setPosition(this.Selector1.x, this.Selector3.y)
            this.Selector2.setPosition(this.Selector2.x, this.Selector3.y)
            this.Selector3.setPosition(4000, this.Selector3.y)
        }

        if (this.p1selected && !this.seleccionSonido1) {
            this.sonidoSeleccion(this.positionp1)
            this.seleccionSonido1 = true;
        }
        if (this.p2selected && !this.seleccionSonido2) {
            this.sonidoSeleccion(this.positionp2)
            this.seleccionSonido2 = true;
        }
    }

    sonidoSeleccion(key) {
        if (key === 0) this.sound.play('arturoSeleccion', { volume: 4 });
        else if (key == 1) this.sound.play('azazelSeleccion');
        else if (key == 2) this.sound.play('trevorSeleccion', { volume: 4 });
        else if (key == 3) this.sound.play('shinjiSeleccion');
    }

}


