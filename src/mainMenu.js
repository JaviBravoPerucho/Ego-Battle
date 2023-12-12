import MenuBackground from './ui/FondoMenu.js'
import CharacterSelector from './ui/CharacterSelector.js'
//import MainScene from './mainScene.js'

const alturaMapa = 300, difMapa = 230, posInicialMapa = 120, proporcionMapa = 0.3, offsetParpadeoMapa = 0.02;
const elapsedTimeMarcos = 300, elapsedTimeStartButton = 500, elapsedTimeMapas = 200
const proporcionSelector = 1.2, offsetSelector = 302, offsetParpadeoSelector = 0.05;
const proporcionStartButton = 0.15, offsetParpadeoStartButton = 0.01;
const ArWidthProportion = 12, AzWidthProportion = 2.17, TWidthProportion = 2.98, SWidthProportion = 4.78, CSHeightProportion = 7;
const tutorialText1X = 25, tutorialText2X = 900, tutorialTextY = 170;

class Selector extends Phaser.GameObjects.Image {
    constructor(scene, x, y, imageKey) {//Habra que pasarle player1 y player2 para que colisione con ellos 
        super(scene, x, y, imageKey);
        scene.add.existing(this).setScale(proporcionSelector, proporcionSelector);
        this.eliminate = false;
    }

    //Cambia la posicion del marco de seleccion una distancia fija en funcion de la direccion
    move(right) {
        if (right) {
            this.setPosition(this.x + offsetSelector, this.y)
        }
        else {
            this.setPosition(this.x - offsetSelector, this.y)
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
            if (this.elapsedTime > elapsedTimeMapas) {
                this.elapsedTime = 0;
                this.changeSize = !this.changeSize;
                if (this.changeSize) this.setScale(proporcionMapa + offsetParpadeoMapa, proporcionMapa + offsetParpadeoMapa)
                else this.setScale(proporcionMapa, proporcionMapa);
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
    }

    preload() {
        this.load.image('Arturo', './assets/img/arturoimages/arturo.png');
        this.load.image('Trevor', './assets/img/trevorimages/trevor.png');
        this.load.image('Azazel', './assets/img/azazelimages/azazelportrait.png');
        this.load.image('Shinji', './assets/img/shinjiimages/shinjiportrait.png');
        this.load.image('start', './assets/img/uiimages/Startbutton.png');
        this.load.spritesheet('MenuFondo', './assets/img/fondosimages/MenuFondo.png', { frameWidth: 960, frameHeight: 540 });
        this.load.image('nameImage', './assets/img/uiimages//marcoNombre.png');
        this.load.image('text', './assets/img/uiimages//textoMarco.png');
        this.load.image('textomarco', './assets/img/uiimages/Marcostexto.png');
        this.load.image('Selector1', './assets/img/uiimages/Selector1.png');
        this.load.image('Selector2', './assets/img/uiimages/Selector2.png');
        this.load.image('Selector3', './assets/img/uiimages/Selector3.png');
        this.load.image('castilloIcon', './assets/img/fondosimages/castilloIcon.png');
        this.load.image('muelleIcon', './assets/img/fondosimages/muelleIcon.png');
        this.load.image('junglaIcon', './assets/img/fondosimages/junglaIcon.png');
        this.load.image('volcanIcon', './assets/img/fondosimages/volcanIcon.png');
        this.load.image('espacioIcon', './assets/img/fondosimages/espacioIcon.png');
    }

    shutdown() {
        this.positionp1 = 0;
        this.positionp2 = 0;
        this.p1selected = false;
        this.p2selected = false;
    }


    create() {
        this.positionp1 = 0;
        this.positionp2 = 3;
        this.HEIGHT = this.sys.game.canvas.height;
        this.WIDTH = this.sys.game.canvas.width;
        this.textY = -100;
        let style = { fontFamily: 'Pixels', fill: "orange", fontSize: 100 };
        let styleblue = { fontFamily: 'Pixels', fill: "blue", fontSize: 30 };
        let stylered = { fontFamily: 'Pixels', fill: "red", fontSize: 30 };

        new MenuBackground(this, this.WIDTH / 2, this.HEIGHT / 2).setScale(1.35, 1.2);
        this.text = this.add.text(25, this.textY, 'EGOBATTLE', style)
        this.tutorialText1 = this.add.text(tutorialText1X, this.textY + tutorialTextY, 'Player1: A-D + Space', stylered)
        this.tutorialText2 = this.add.text(tutorialText2X, this.textY + tutorialTextY, 'Player2: <- -> + Enter', styleblue)
        this.tutorialTexts = [this.tutorialText1, this.tutorialText2];
        this.startButton = this.add.image(this.WIDTH / 2.03, this.HEIGHT / 4, 'start').setScale(proporcionStartButton, proporcionStartButton).setInteractive();

        this.Selector1 = new Selector(this, (this.WIDTH / ArWidthProportion) + 40, (this.HEIGHT / CSHeightProportion) + 65, 'Selector1');
        this.Selector2 = new Selector(this, (this.WIDTH / AzWidthProportion) + 492, (this.HEIGHT / CSHeightProportion) + 65, 'Selector2');
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
                this.scene.start('mainScene', { parametro0: this.map, parametro1: this.positionp1, parametro2: this.positionp2 });
                console.log("sigo vivo")
                //this.scene.start('mainScene');          
            }
        });

        this.player1 = new CharacterSelector(this, this.WIDTH / ArWidthProportion, this.HEIGHT / CSHeightProportion, 'Arturo');
        this.player2 = new CharacterSelector(this, this.WIDTH / AzWidthProportion, this.HEIGHT / CSHeightProportion, 'Shinji');
        this.player3 = new CharacterSelector(this, this.WIDTH / TWidthProportion, this.HEIGHT / CSHeightProportion, 'Trevor');
        this.player4 = new CharacterSelector(this, this.WIDTH / SWidthProportion, this.HEIGHT / CSHeightProportion, 'Azazel');
        this.arrayPlayers = [this.player1, this.player2, this.player3, this.player4];

        this.mapCastillo = new Mapa(this, posInicialMapa, alturaMapa, 'castilloIcon');
        this.mapMuelle = new Mapa(this, posInicialMapa+difMapa, alturaMapa, 'muelleIcon');
        this.mapJungla = new Mapa(this, posInicialMapa+difMapa*2, alturaMapa, 'junglaIcon');
        this.mapEspacio = new Mapa(this, posInicialMapa+difMapa*3, alturaMapa, 'espacioIcon');
        this.mapVolcan = new Mapa(this, posInicialMapa + difMapa * 4, alturaMapa, 'volcanIcon');
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
            if (this.elapsedTime > elapsedTimeMarcos) {
                this.elapsedTime = 0; 
                this.changeSize = !this.changeSize;
                if (this.changeSize) { this.Selector1.setScale(proporcionSelector, proporcionSelector); }
                else this.Selector1.setScale(proporcionSelector-offsetParpadeoSelector, proporcionSelector-offsetParpadeoSelector);
               
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
            this.Selector1.setScale(proporcionSelector, proporcionSelector);
        }
        if (!this.p2selected) {
            if (this.elapsedTime2 > elapsedTimeMarcos) {
                this.elapsedTime2 = 0;
                this.changeSize2 = !this.changeSize2;
                if (this.changeSize2) { this.Selector2.setScale(proporcionSelector, proporcionSelector); }
                else this.Selector2.setScale(proporcionSelector-offsetParpadeoSelector, proporcionSelector-offsetParpadeoSelector);

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
            this.Selector2.setScale(proporcionSelector, proporcionSelector);
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
                this.arrayMapas.forEach((mapa) => {
                    if (!mapa.selected) mapa.stopIntermitent = true;
                });
                if (this.elapsedTime > elapsedTimeStartButton) {
                    this.elapsedTime = 0;
                    this.changeSize = !this.changeSize;
                    if (this.changeSize) { this.startButton.setScale(proporcionStartButton + offsetParpadeoStartButton, proporcionStartButton + offsetParpadeoStartButton); }
                    else this.startButton.setScale(proporcionStartButton, proporcionStartButton);
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
        
    }

}


