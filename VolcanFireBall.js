export default class VolcanFireBall extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, player) {
        super(scene, x, y, 'VFB');

        scene.add.existing(this).setScale(1.5,1.5);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, player);

        this.scene.anims.create({
            key: 'fallFB',
            frames: scene.anims.generateFrameNumbers('VFB', { start: 0, end: 49 }),
            frameRate: 15,
            repeat: -1
        });

        this.play('fallFB');
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        this.body.velocity.y = 200;
        if (this.body.position.y > 380) {
            this.destroy();
        }
    }
}