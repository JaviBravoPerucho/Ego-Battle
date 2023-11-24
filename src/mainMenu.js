import MenuBackground from './ui/FondoMenu.js'
import CharacterSelector from './ui/CharacterSelector.js'
//import MainScene from './mainScene.js'
class Selector1 extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {//Habra que pasarle player1 y player2 para que colisione con ellos 
        super(scene, x, y, 'Selector1');
        scene.add.existing(this).setScale(1.2, 1.2);
        this.eliminate = false;
    }
    Visible(bool) {
        this.setVisble(bool);
    }
    move(right) {
        console.log('si');
        if (right) {
            this.setPosition(this.x + 302, this.y)
        }
        else {
            this.setPosition(this.x - 302, this.y)
        }
    }
    preUpdate() { }
}
class Selector2 extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {//Habra que pasarle player1 y player2 para que colisione con ellos 
        super(scene, x, y, 'Selector2');
        scene.add.existing(this).setScale(1.2, 1.2);
        this.eliminate = false;
    }
    Visible(bool) {
        this.setVisble(bool);
    }
    move(right) {
        console.log('si');
        if (right) {
            this.setPosition(this.x + 302, this.y)
        }
        else {
            this.setPosition(this.x - 302, this.y)
        }
    }
    preUpdate() { }
}
class Selector3 extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {//Habra que pasarle player1 y player2 para que colisione con ellos 
        super(scene, x, y, 'Selector3');
        scene.add.existing(this).setScale(1.2, 1.2);
        this.eliminate = false;
        //this.setVisble(false);
    }
    Visible(bool) {
        this.setVisble(bool);
    }
    preUpdate() { }
}
export  class Menu extends Phaser.Scene {
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
        this.maxp = 3;
    }

    preload() {
        this.load.image('Arturo', '../assets/img/arturoimages/arturo.png');
        this.load.image('Trevor', '../assets/img/trevorimages/trevor.png');
        this.load.image('Azazel', '../assets/img/azazelimages/azazelportrait.png');
        this.load.image('Shinji', '../assets/img/shinjiimages/shinjiportrait.png');
        this.load.image('start', '../assets/img/uiimages/Startbutton.png');
        this.load.spritesheet('MenuFondo', '../assets/img/fondosimages/MenuFondo.png', { frameWidth: 960, frameHeight: 540 });
        this.load.image('nameImage', '../assets/img/uiimages//marcoNombre.png');
        this.load.image('text', '/assets/img/uiimages//textoMarco.png');
        this.load.image('textomarco', '../assets/img/uiimages/MarcosTexto.png');
        this.load.image('Selector1', '../assets/img/uiimages/Selector1.png');
        this.load.image('Selector2', '../assets/img/uiimages/Selector2.png');
        this.load.image('Selector3', '../assets/img/uiimages/Selector3.png');
    }


    create() {
        this.positionp1 = 0;
        this.positionp2 = 3;
        this.HEIGHT = this.sys.game.canvas.height;
        this.WIDTH = this.sys.game.canvas.width;
        this.textY = -100;
        let style = { fontFamily: 'Pixels', fill: "orange", fontSize: 100};
        new MenuBackground(this, this.WIDTH / 2, this.HEIGHT /2).setScale(1.35, 1.2);
        this.text = this.add.text(25, this.textY, 'EGOBATTLE', style)
        this.startButton = this.add.image(this.WIDTH / 10, this.HEIGHT / 10, 'start').setScale(0.2, 0.2).setInteractive();
        this.Selector1 = new Selector1(this, (this.WIDTH / 12) + 40, (this.HEIGHT / 7) + 65);
        this.Selector2 = new Selector2(this, (this.WIDTH / 2.17) + 492, (this.HEIGHT / 7) + 65);
        this.Selector3 = new Selector3(this,4000, (this.HEIGHT / 7) + 65);

        this.startButton.on('pointerdown', () => {
            if (this.p1selected && this.p2selected) {
                this.scene.start('mainScene', 0, this.positionp1, this.positionp2);
                console.log("sigo vivo")
                //this.scene.start('mainScene');
            }


        });
        this.player1 = new CharacterSelector(this, this.WIDTH / 12, this.HEIGHT / 7, 'Arturo');
        this.player2 = new CharacterSelector(this, this.WIDTH / 2.17, this.HEIGHT / 7, 'Shinji');
        this.player3 = new CharacterSelector(this, this.WIDTH / 2.98, this.HEIGHT / 7, 'Trevor');
        this.player4 = new CharacterSelector(this, this.WIDTH / 4.78, this.HEIGHT / 7, 'Azazel');
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
            this.p1selected = true;
        }
        if (Phaser.Input.Keyboard.JustDown(this.enterkey)) {
            console.log("enter")
            this.p2selected = true;
        }
        if (!this.p1selected) {
            if (Phaser.Input.Keyboard.JustDown(this.akey)) {
                if (this.positionp1 > 0) {
                    this.positionp1--;
                    this.Selector1.move(false);

                }
            }
            if (Phaser.Input.Keyboard.JustDown(this.dkey)) {
                if (this.positionp1 < this.maxp) {                   
                    this.positionp1++;
                    this.Selector1.move(true);
                }
            }
        }
        if (!this.p2selected) {
            if (Phaser.Input.Keyboard.JustDown(this.leftkey)) {
                if (this.positionp2 > 0) {
                    
                    this.positionp2--;
                    this.Selector2.move(false);

                }
            }
            if (Phaser.Input.Keyboard.JustDown(this.rightkey)) {
                if (this.positionp2 < 3) {
                    this.positionp2++;
                    this.Selector2.move(true);
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
        //if (this.p1selected && this.p2selected) {
        //    MainScene(map,this.positionP1,this.positionP2)
        //}
        
    }

}


