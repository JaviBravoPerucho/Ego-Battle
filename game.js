

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    scene: [{ create: create, preload: preload }],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: false
        }
    }
}
const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'img/jungla.png');
}

function create() {
    this.background = this.add.image(400, 300, 'background');
    
}


