
class Info extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'text');
        scene.add.existing(this).setScale(0.5, 0.38);
    }
}
class InfoText extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'textomarco');
        scene.add.existing(this).setScale(0.55, 0.6);
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

        this.info = new Info(scene, x + -60, y +105)
        this.add(this.info);
        this.infotext = new InfoText(scene, x - 60, y + 305);
        this.add(this.infotext);
        this.border = new Look(scene, x - 60, y + 100, personaje);
        this.add(this.border);
        this.border1 = new Name(scene, x - 60, y -20);
        this.add(this.border1);
        let style = { fontFamily: 'Pixels', fill: "black", fontSize: 30 };
        
        
        
        if (personaje === 'Shinji') {
            style.fill = 'grey'
            this.name = this.scene.add.text(x - 100, y - 35, personaje, style);
            this.add(this.name); 
            style.fontSize = 15;
            this.add(this.scene.add.text(x - 165, y + 245, 'Combate a distancia con proyectiles:\nshurikens y bombas pegajosas. Su\n barra de poder se rellena mientras\nmas tiempo este lejos del oponente\nya que de esta forma gana confianza.\nSu habilidad consiste en aparecer\ndetras de su oponente y apunlarle.', style));
        }
        else if (personaje === 'Arturo') {
            style.fill = 'blue';
            this.name = this.scene.add.text(x - 100, y - 35, personaje, style);
            this.add(this.name);
            style.fontSize = 15;
            this.add(this.scene.add.text(x - 165, y + 245, 'Guiado por los sentimientos.\nMientras no recibe dano carga su\nbarra de poder, ya que mantiene la\nconfianza en si mismo Poder: Con\nsu voz de lider y manipulador\nconvence al oponente a rendirse\nante el y hacerse dano a si mismo.', style));
        }
        else if (personaje === 'Azazel') {
            style.fill = 'red';
            this.name = this.scene.add.text(x - 100, y - 35, personaje, style);
            this.add(this.name); 
            style.fontSize = 15;
            this.add(this.scene.add.text(x - 165, y + 245, 'Tiene un estilo de combate con\nel que gana a su oponente de forma\nestrategica. Ataque paralizador que\naturde al rival. El poder se llena\nestando quieto analizando el\nambiente, al llenarse ha averiguado\nlos puntos debiles y hace mas dano', style));
        }
        else if (personaje === 'Trevor') {
            style.fill = 'brown';
            this.name = this.scene.add.text(x - 100, y - 35, personaje, style);
            this.add(this.name); 
            style.fontSize = 15;
            this.add(this.scene.add.text(x - 165, y + 245, 'Se lanza a sus oponentes con furia\nguiandose por sus instintos. Solo\ncombate cuerpo a cuerpo. Su barra\nde poder se llena mientras recibe\ndano y al llenarla se vuelve como\nuna bestia y se abalanza sobre su\nenemigo con mas velocidad y dano', style));
        }
      
        this.scene.add.existing(this)
    }
}