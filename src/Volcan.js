export default class Volcan extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'Volcan');

        scene.add.existing(this);

        this.scene.anims.create({
            key: 'volcanBG',
            frames: scene.anims.generateFrameNumbers('Volcan', { start: 0, end: 7 }),
            frameRate: 5,
            repeat: -1
        });

        this.play('volcanBG');
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
   
    }
}