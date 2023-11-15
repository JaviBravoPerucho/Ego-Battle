export default class Muelle extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'Muelle');

        scene.add.existing(this);

        this.scene.anims.create({
            key: 'muelle',
            frames: scene.anims.generateFrameNumbers('Muelle', { start: 0, end: 232 }),
            frameRate: 20,
            repeat: -1
        });

        this.play('espacio');
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
   
    }
}