export default class MenuBackground extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'MenuFondo');
        scene.add.existing(this).setScale(1.5, 1.5).setOrigin(0.5);

        this.scene.anims.create({//Anim basica
            key: 'FM',
            frames: scene.anims.generateFrameNumbers('MenuFondo', { start: 0, end: 5 }),
            frameRate: 15,
            repeat: -1
        });

        this.play('FM');
        this.maxScale = 1.8;
        this.minScale = 1.35;
        this.currentScale = this.minScale;
        this.growing = true;
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        if (this.currentScale > this.maxScale || this.currentScale < this.minScale) { this.growing = !this.growing }
        if ( this.growing) { this.currentScale += 0.0005; }
        else { this.currentScale -= 0.0005; }
        this.setScale(this.currentScale, this.currentScale);
    }
}