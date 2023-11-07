import { MainScene } from "./mainScene.js";
import { Menu } from "./mainMenu.js";


var config = {
    type: Phaser.AUTO,
    parent: 'juego',
    width: 1200,
    height: 600,
    pixelArt: true,
    scale: {
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        mode: Phaser.Scale.FIT,
        min: {
            width: 328,
            height: 188
        },
        max: {
            width: 1312,
            height: 752
        },
        zoom: 2
    },
    scene: [ Menu, MainScene],
    physics: {
        default: 'arcade',
        checkCollision: {
            up: true,
            down: true,
            left: true,
            right: true
        },
        arcade: {
            gravity: { y: 700 },
            debug: false
        }
    }
}
var game = new Phaser.Game(config);




