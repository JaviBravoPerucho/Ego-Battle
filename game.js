import { MainScene } from "./mainScene.js";
import {Menu } from "./mainMenu.js"


var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    scene: [ MainScene, Menu],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 700 },
            debug: false
        }
    }
}
var game = new Phaser.Game(config);




