export class MainScene extends Phaser.Scene {
    constructor() {
        super({key: 'mainScene'})
    }

    preload() {
        this.load.image('background', 'img/jungla.png');
    }

    create() {
        this.background = this.add.image(400, 300, 'background');
    }
}

