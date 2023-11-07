import MenuBackground from '../src/FondoMenu.js'
import CharacterSelector from '../src/CharacterSelector.js'

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
    }

    preload() {
        this.load.image('Arturo', '../assets/img/Arturo/arthur.png');
        this.load.image('Trevor', '../assets/img/Trevor/trevor.png');
        this.load.image('Azazel', '../assets/img/Azazel/azazzel.png');
        this.load.image('Shinji', '../assets/img/Shinji/shinji.png');
        this.load.image('start', '../assets/img/Startbutton.png');
        this.load.spritesheet('MenuFondo', '../assets/img/fondos/MenuFondo.png', { frameWidth: 960, frameHeight: 540 });
        this.load.image('nameImage', '../assets/img/Menu/marcoNombre.png');
        this.load.image('text', '/assets/img/Menu/textoMarco.png');
        this.load.image('textomarco', '../assets/img/Menu/MarcosTexto.png');
    }

    create() {
        this.HEIGHT = this.sys.game.canvas.height;
        this.WIDTH = this.sys.game.canvas.width;
        this.textY = -100;
        let style = { fontFamily: 'Pixels', fill: "orange", fontSize: 100};
        new MenuBackground(this, this.WIDTH / 2, this.HEIGHT /2).setScale(1.35, 1.2);
        this.text = this.add.text(25, this.textY, 'EGOBATTLE', style)
        this.add.image(this.WIDTH / 2, this.HEIGHT/2.2, 'start').setScale(0.2, 0.2);
        this.player1 = new CharacterSelector(this, this.WIDTH / 12, this.HEIGHT / 7, 'Arturo');
        this.player2 = new CharacterSelector(this, this.WIDTH / 2.17, this.HEIGHT / 7, 'Shinji');
        this.player1 = new CharacterSelector(this, this.WIDTH / 2.85, this.HEIGHT / 7, 'Trevor');
        this.player2 = new CharacterSelector(this, this.WIDTH / 5.1, this.HEIGHT / 7, 'Azazel');

    }

    update() {
        if (this.textY < 5) {
            this.textY += 1;
            this.text.setPosition(this.WIDTH/4, this.textY);
        }      
    }
}

