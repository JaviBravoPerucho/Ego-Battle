
class Info extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'text');
        scene.add.existing(this).setScale(0.5, 0.5);
    }
}
class Name extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'nameImage');
        scene.add.existing(this).setScale(0.2, 0.2);
    }
}
class Look extends Phaser.GameObjects.Image {
    constructor(scene, x, y, personaje) {
        super(scene, x, y, personaje);
        scene.add.existing(this)
        if (personaje === 'Arturo') { this.setScale(1.7, 1.7); }
        else if (personaje === 'Shinji') { this.setScale(1.3, 1.3); }
        else if (personaje === 'Trevor') { this.setScale(1.4, 1.4); }
        else if (personaje === 'Azazel') { this.setScale(1.7, 1.7); }
    }
}
export default class CharacterSelector extends Phaser.GameObjects.Container {
    constructor(scene, x, y, personaje) {
        super(scene, x, y);

        this.info = new Info(scene, x + -60, y +150)
        this.add(this.info);
        this.border = new Look(scene, x - 60, y + 150, personaje);
        this.add(this.border);
        this.border1 = new Name(scene, x - 60, y);
        this.add(this.border1);
        let style = { fontFamily: 'Pixels', fill: "black", fontSize: 30 };
        this.name = this.scene.add.text(x - 100, y - 15, personaje, style);
        this.add(this.name);
      
        this.scene.add.existing(this)
    }
}