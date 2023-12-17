
const OFFSETX_DESC = 165, OFFSETY_DESC = 265;

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
        if (personaje === 'Arturo') { this.setScale(0.11, 0.11); }
        else if (personaje === 'Shinji') { this.setScale(0.11, 0.11); }
        else if (personaje === 'Trevor') { this.setScale(0.11, 0.11); }
        else if (personaje === 'Azazel') { this.setScale(0.11, 0.11); }
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
        let styleName = { fontFamily: 'Pixels', fontSize: 30, fill: "black", align: 'center' };
        let styleDescription = { fontFamily: 'Pixels', fontSize: 20, fill: "black", align: 'center' };
        
        
        if (personaje === 'Shinji') {
            styleName.fill = 'grey'
            styleDescription.fill = 'grey'
            this.name = this.scene.add.text(x - 100, y - 35, personaje, styleName);
            this.add(this.name);            
            this.add(this.scene.add.text(x - OFFSETX_DESC+20, y + OFFSETY_DESC, 'Combate a distancia\nIntrovertido\nPoder:Mantente lejos', styleDescription));
            /*this.add(this.scene.add.text(x - 165, y + 245, 'Combate a distancia con proyectiles:\nshurikens y bombas pegajosas. Su\n barra de poder se rellena mientras\nmas tiempo este lejos del oponente\nya que de esta forma gana confianza.\nSu habilidad consiste en aparecer\ndetras de su oponente y apunlarle.', style));*/
        }
        else if (personaje === 'Arturo') {
            styleName.fill = 'blue'
            styleDescription.fill = 'blue'
            this.name = this.scene.add.text(x - 100, y - 35, personaje, styleName);
            this.add(this.name);
            this.add(this.scene.add.text(x - OFFSETX_DESC, y + OFFSETY_DESC, 'Espada\nCarismatico\nPoder:Mantente intacto', styleDescription));
        //    this.add(this.scene.add.text(x - 165, y + 245, 'Guiado por los sentimientos.\nMientras no recibe dano carga su\nbarra de poder, ya que mantiene la\nconfianza en si mismo Poder: Con\nsu voz de lider y manipulador\nconvence al oponente a rendirse\nante el y hacerse dano a si mismo.', style));
        }
        else if (personaje === 'Azazel') {
            styleName.fill = 'red'
            styleDescription.fill = 'red'
            this.name = this.scene.add.text(x - 100, y - 35, personaje, styleName);
            this.add(this.name); 
            this.add(this.scene.add.text(x - OFFSETX_DESC, y + OFFSETY_DESC, 'Fuego\nEstratega\nPoder:Mantente quieto', styleDescription));
        //    this.add(this.scene.add.text(x - 165, y + 245, 'Tiene un estilo de combate con\nel que gana a su oponente de forma\nestrategica. Ataque paralizador que\naturde al rival. El poder se llena\nestando quieto analizando el\nambiente, al llenarse ha averiguado\nlos puntos debiles y hace mas dano', style));
        }
        else if (personaje === 'Trevor') {
            styleName.fill = 'brown'
            styleDescription.fill = 'brown'
            this.name = this.scene.add.text(x - 100, y - 35, personaje, styleName);
            this.add(this.name); 
            this.add(this.scene.add.text(x - OFFSETX_DESC, y + OFFSETY_DESC, 'Lanza\nBestia\nPoder:Mantente en combate', styleDescription));
        //    this.add(this.scene.add.text(x - 165, y + 245, 'Se lanza a sus oponentes con furia\nguiandose por sus instintos. Solo\ncombate cuerpo a cuerpo. Su barra\nde poder se llena mientras recibe\ndano y al llenarla se vuelve como\nuna bestia y se abalanza sobre su\nenemigo con mas velocidad y dano', style));
        }
      
        this.scene.add.existing(this)
    }
}