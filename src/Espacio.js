export default class Espacio extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'Espacio');

        scene.add.existing(this);

        this.scene.anims.create({
            key: 'espacio',
            frames: scene.anims.generateFrameNumbers('Espacio', { start: 0, end: 59 }),
            frameRate: 12,
            repeat: -1
        });

        this.play('espacio');
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
   
    }
}