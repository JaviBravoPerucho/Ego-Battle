class HealthBar extends Phaser.GameObjects.Graphics {
    constructor(scene, x, y, value, right) {
        super(scene);
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 40;
        this.value = value;
        /*this.p = 76 / value;*/
        this.damageDone = 0;
        this.right = right;

        this.draw();

        scene.add.existing(this);
    }
    draw() {
        this.clear();

        //  BG
        this.fillStyle(0x000000);
        this.fillRect(this.x, this.y, this.width, this.height);//80 16 w h

        //  Health
        this.fillStyle(0xffffff);
        this.fillRect(this.x + 2, this.y + 2, this.width-8, this.height-8);//76 12 w h

        if (this.value < 30) {
            this.fillStyle(0xff0000);
        }
        else {
            this.fillStyle(0x00ff00);
        }

        /*var d = Math.floor(this.p * this.value);*/
        if (this.right == 1) this.fillRect(this.x + 2+this.damageDone, this.y + 2, this.value, this.height - 8);
        else this.fillRect(this.x + 2, this.y + 2, this.value, this.height-8);
    }
    decrease(amount) {
        this.value -= amount;
        this.damageDone += amount;
        if (this.value < 0) {
            this.value = 0;
        }

        this.draw();

        return (this.value === 0);
    }
}

class Marco extends Phaser.GameObjects.Image {
    constructor(scene, x, y, personaje) {
        super(scene, x, y, personaje);
        scene.add.existing(this).setScale(1, 1);
    }
}

export default class HUD extends Phaser.GameObjects.Container {
    constructor(scene, x, y, player1, player2, score1, score2) {
        super(scene, x, y);

        this.player1 = player1;
        this.player2 = player2;
        this.BarraDeVida1 = new HealthBar(scene, 10, 10, player1.vida, 0);
        this.BarraDeVida2 = new HealthBar(scene, 480, 10, player2.vida, 1);
        this.add(this.BarraDeVida1);
        this.add(this.BarraDeVida2);

        this.MarcoPlayer1 = new Marco(scene, 0, 0, player1.name);
        this.MarcoPlayer2 = new Marco(scene, scene.WIDTH - 20, 0, player2.name);
        this.add(this.MarcoPlayer1);
        this.add(this.MarcoPlayer2);
        this.MarcoPlayer1.x += this.MarcoPlayer1.width / 2;
        this.MarcoPlayer2.x -= this.MarcoPlayer2.width / 2;
        this.MarcoPlayer1.y += this.MarcoPlayer1.height;
        this.MarcoPlayer2.y += this.MarcoPlayer2.height;
        this.MarcoPlayer2.flipX = true;


        this.score = this.scene.add.text(this.scene.WIDTH / 2 - 20, 30, score1 + "-" + score2, { fontFamily: 'ka1', fontSize: 80 });
        this.score1 = score1;
        this.score2 = score2;

        this.add(this.score);
     
        this.scene.add.existing(this);
    }

    update() {
        this.score.setText(this.score1 + "-" + this.score2);
    }
}