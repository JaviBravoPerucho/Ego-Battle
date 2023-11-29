    class HealthBarInside extends Phaser.GameObjects.Graphics {
    constructor(scene, x, y, value, right) {
        super(scene);
        this.x = x;
        this.y = y;
        this.width = value;
        this.height = 30;
        this.value = value;
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
        if (this.right == 1) this.fillRect(this.x + 2 + this.damageDone, this.y + 2, this.value, this.height - 8);
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

class PowerBar extends Phaser.GameObjects.Graphics {
    constructor(scene, x, y, value, right, personaje) {
        super(scene);
        this.x = x;
        this.y = y;
        this.width = value;
        this.height = 20;
        this.value = value;
        this.right = right;
        this.color = 0x800080;
        this.draw();

        scene.add.existing(this);
    }
    draw() {
        this.clear();

        //  BG
        this.fillStyle(0x000000);
        this.fillRect(this.x, this.y, this.width, this.height);//80 16 w h

        //  Power
        this.fillStyle(this.color);
        this.fillRect(this.x + 2, this.y + 2, this.width - 8, this.height - 8);//76 12 w h


        /*var d = Math.floor(this.p * this.value);*/
        if (this.right == 1) this.fillRect(this.x + 2, this.y + 2, this.value, this.height - 8);
        else this.fillRect(this.x + 2, this.y + 2, this.value, this.height - 8);
    }
    increase(amount) {
        this.value += amount;

        this.draw();

        return (this.value === 0);
    }
}

class HealthBarBorder extends Phaser.GameObjects.Image {
    constructor(scene, x, y, borde) {
        super(scene, x, y, borde);
        this.x = x;
        this.y = y;
        scene.add.existing(this).setScale(0.45, 0.35);
    }
}

class HealthBar extends Phaser.GameObjects.Container {
    constructor(scene, x, y, value, right) {
        super(scene, x, y);

        this.borde = new HealthBarBorder(this.scene, this.x, this.y, 'Borde');
        this.add(this.borde);
        this.inside = new HealthBarInside(this.scene, this.x, this.y, this.value, this.right);
        this.add(this.inside);
        
    }
}

class Marco extends Phaser.GameObjects.Image {
    constructor(scene, x, y, personaje) {
        super(scene, x, y, personaje);
        scene.add.existing(this).setScale(0.11, 0.11);
    }
}

export default class HUD extends Phaser.GameObjects.Container {
    constructor(scene, x, y, player1, player2, score1, score2) {
        super(scene, x, y);

        this.player1 = player1;
        this.player2 = player2;
        this.BarraDeVida1 = new HealthBarInside(scene, 10, 10, player1.vida, 0);
        this.BarraDeVida2 = new HealthBarInside(scene, 440, 10, player2.vida, 1);
        this.BordeBarraDeVida1 = new HealthBarBorder(scene, 173, 33, 'Borde');
        this.BordeBarraDeVida2 = new HealthBarBorder(scene, 1030, 33, 'Borde');
        this.BarraDePoder1 = new PowerBar(scene, 60, 25, 0, 0, player1.name);
        this.BarraDePoder2 = new PowerBar(scene, 440, 25, 0, 1, player2.name);
        this.add(this.BarraDeVida1);
        this.add(this.BarraDeVida2);
        this.add(this.BordeBarraDeVida1);
        this.add(this.BordeBarraDeVida2);
        this.add(this.BarraDePoder1);
        this.add(this.BarraDePoder2);

        this.MarcoPlayer1 = new Marco(scene, -440, -910, player1.name);
        this.MarcoPlayer2 = new Marco(scene, -440, -910, player2.name);
        this.add(this.MarcoPlayer1);
        this.add(this.MarcoPlayer2);
        this.MarcoPlayer1.x += this.MarcoPlayer1.width / 2;
        this.MarcoPlayer2.x -= this.MarcoPlayer2.width / 2;
        this.MarcoPlayer1.y += this.MarcoPlayer1.height;
        this.MarcoPlayer2.y += this.MarcoPlayer2.height;
        this.MarcoPlayer2.flipX = true;


        this.score = this.scene.add.text(this.scene.WIDTH / 2 - 50, 0, score1 + "-" + score2, { fontFamily: 'ka1', fontSize: 80 });
        this.score1 = score1;
        this.score2 = score2;

        this.maxPoder = 200;

        this.add(this.score);
     
        this.scene.add.existing(this);
    }

    countScore(player) {
        if (player === this.player1) this.score2++;
        else this.score1++;
    }

    update() {
        this.score.setText(this.score1 + "-" + this.score2);
    }
}