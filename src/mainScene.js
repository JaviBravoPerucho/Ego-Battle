//Entornos
import Volcan from './environments/Volcan.js';
import Espacio from './environments/Espacio.js'
import Muelle from './environments/Muelle.js'

//Objetos
import Sword from './objects/Sword.js';
import Coconut from './objects/Coconut.js';
import Fish from './objects/Fish.js';
import VolcanFireBall from './objects/VolcanFireBall.js';
import OVNI from './objects/OVNI.js';

//Personajes
import Trevor from './characters/Trevor.js';
import Arturo from './characters/Arturo.js';
import Azazel from './characters/Azazel.js';
import Shinji from './characters/Shinji.js';
import Arma from './characters/Arma.js';

//UI
import HUD from './ui/HUD.js';


const PLATFORMLAVA = 'platform'
const PLAYER = 'player'
var time = 3000;//Tiempo para caer primer objeto
const TIME_INICIO = 2000, VOL_MUSICA = 0.1;

export class MainScene extends Phaser.Scene {
    constructor() {//Le pasamos el mapa elegido ya sea int o string + jugador 1 + jugador 2
        super({ key: 'mainScene' })
        this.player1 = undefined;//Jugador 1
        this.player2 = undefined;//Jugador 2
        this.platforms = undefined;
        this.cursors = undefined;
        this.time = undefined;//Tiempo en el juego para poder pasarselo a otros objetos
        this.WIDTH = undefined; 
        this.HEIGHT = undefined; 
        this.HUD = undefined;
        this.score1 = undefined;
        this.score2 = undefined;
        this.posicionInicial1 = undefined; //Posiciones iniciales para llevarlos a esa posicion cuando mueren
        this.posicionInicial2 = undefined;
        this.alturaInicial = undefined;
        this.alturaVacio = 1000; // Altura en la que los personajes mueren por caerse al vacío
        this.tiempoObjeto = 10000 //Lapso de tiempo de aparicion de objetos
        this.Mapinfo = 0;
        this.p1info = 0;
        this.p2info = 3;
        this.fightAudio = undefined;
        this.elapsedInicio = 0;
        this.timeInicio = TIME_INICIO;
        this.playInicio = true;
    }

    init(data) {
        this.Mapinfo = data.parametro0;
        this.p1info = data.parametro1;
        this.p2info = data.parametro2;
       
    }

    playerDied(player) {
        this.HUD.countScore(player);
        this.player1.setPosition(this.posicionInicial1, this.alturaInicial);
        this.player2.setPosition(this.posicionInicial2, this.alturaInicial);
        this.player1.vida = 300;
        this.player2.vida = 300;
        if (player === this.player1) { this.score2++; }
        else { this.score1++; }
        this.HUD.restartRound();
        this.player1.move();
        this.player2.move();
    }
    
    preload() {//Dependiendo de lo seleccionado cargamos una cosa u otra (mas adelante)

        //Personajes
        this.load.image('Arturo', './assets/img/arturoimages/arthur.png');
        this.load.image('Trevor', './assets/img/trevorimages/trevor.png');
        this.load.image('Azazel', './assets/img/azazelimages/azazzel.png');
        this.load.image('Shinji', './assets/img/shinjiimages/shinji.png');
        this.load.spritesheet('Trevornormalattack', './assets/img/trevorimages/ataqueLanza.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevorstrongattack', './assets/img/trevorimages/ataquePorra.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevoridle', './assets/img/trevorimages/Idle.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevorjump', './assets/img/trevorimages/Jump.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Trevorwalk', './assets/img/trevorimages/Run.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Arturonormalattack', './assets/img/arturoimages/ANA.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturostrongattack', './assets/img/arturoimages/ASA.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturoidle', './assets/img/arturoimages/Aidle.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturojump', './assets/img/arturoimages/Ajump.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Arturowalk', './assets/img/arturoimages/Arun.png', { frameWidth: 160, frameHeight: 111 });
        this.load.spritesheet('Azazelnormalattack', './assets/img/azazelimages/Attack.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Azazelstrongattack', './assets/img/azazelimages/Attack.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Azazelidle', './assets/img/azazelimages/Idle.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('Azazelwalk', './assets/img/azazelimages/Move.png', { frameWidth: 150, frameHeight: 150 });
        this.load.spritesheet('AzazelBall', './assets/img/azazelimages/AzazelBall.png', { frameWidth: 498, frameHeight: 498 });
        this.load.spritesheet('Shinjiidle', './assets/img/shinjiimages/Idle.png', { frameWidth: 59, frameHeight: 85 });
        this.load.spritesheet('Shinjiwalk', './assets/img/shinjiimages/rungood.png', { frameWidth: 44, frameHeight: 85 });
        this.load.spritesheet('Shinjijump', './assets/img/shinjiimages/Jump.png', { frameWidth: 61, frameHeight: 85 });
        this.load.spritesheet('Shinjistrongattack', './assets/img/shinjiimages/Strong.png', { frameWidth: 63, frameHeight: 85 });
        this.load.spritesheet('Shinjinormalattack', './assets/img/shinjiimages/Normal.png', { frameWidth: 77, frameHeight: 85 });
        this.load.spritesheet('ShinjiShuriken', './assets/img/shinjiimages/Shuriken2.png', { frameWidth: 704, frameHeight: 720 });
        this.load.spritesheet('ShinjiBomb', './assets/img/shinjiimages/Bomba.png', { frameWidth: 626, frameHeight: 626 });
        this.load.spritesheet('ShinjiUlti', './assets/img/shinjiimages/ulti.png', { frameWidth: 69, frameHeight: 70 });
        this.load.spritesheet('Explosion', './assets/img/objimages/explosionFB.png', { frameWidth: 247, frameHeight: 240 });
        switch (this.Mapinfo) {
            case 0:
                this.load.spritesheet('Volcan', './assets/img/fondosimages/Volcan.png', { frameWidth: 800, frameHeight: 336 });//Fondo volcan
                this.load.spritesheet('VFB', './assets/img/objimages/VFB.png', { frameWidth: 32, frameHeight: 67 });//Bola de fuego volcan
                //this.load.spritesheet('Explosion', './assets/img/objimages/explosionFB.png', { frameWidth: 247, frameHeight: 240 });//explosion bola de fuego
                this.load.image(PLATFORMLAVA, './assets/img/fondosimages/lavaPlat.png');//Plataforma lava
                this.load.audio('musicaVolcan', './assets/Audio/musicaMapas/musicaVolcan.mp3')
                this.load.audio('explosion', './assets/Audio/explosion.mp3')
                break
            case 1:
                this.load.image('OVNI', './assets/img/objimages/ovniimage.png');//Ovni volador
                this.load.spritesheet('Espacio', './assets/img/fondosimages/espacio.png', { frameWidth: 768, frameHeight: 432 });//Fondo Espacio
                this.load.image('platformMetal', './assets/img/fondosimages/Plat2.png');
                this.load.image('laser', './assets/img/objimages/laser.png');//laser
                this.load.audio('musicaNave', './assets/Audio/musicaMapas/musicaNave.mp3')
                this.load.audio('laser', './assets/Audio/laserSonido.mp3')
                break
            case 2:
                this.load.spritesheet('Fish', './assets/img/objimages/pezimage.png', { frameWidth: 500, frameHeight: 659 });//Pez
                this.load.spritesheet('Muelle', './assets/img/fondosimages/lago1.png', { frameWidth: 720, frameHeight: 405 });//Fondo Muelle
                this.load.image('wood', './assets/img/fondosimages/madera.jpg');
                this.load.audio('musicaMuelle', './assets/Audio/musicaMapas/musicaMuelle.mp3')
                this.load.audio('fishJump', './assets/Audio/pez.mp3')
                break
            case 3:
                this.load.image('Sword', './assets/img/objimages/swordimage.png');//Espada
                this.load.spritesheet('Castillo', './assets/img/fondosimages/castillo.jpg', { frameWidth: 1071, frameHeight: 600 });//Fondo castillo
                this.load.image('background', './assets/img/fondosimages/castillo.jpg');//Fondo castillo
                this.load.audio('musicaCastillo', './assets/Audio/musicaMapas/musicaCastillo.mp3')
                this.load.audio('sword', './assets/Audio/espadaObjeto.mp3')
                this.load.image('bridge', './assets/img/fondosimages/puente.png');
                break
            case 4:
                this.load.spritesheet('Jungla', './assets/img/fondosimages/jungla.png', { frameWidth: 800, frameHeight: 650 });//Fondo Jungla
                this.load.image('Coconut', './assets/img/objimages/cocoimage.png');//Coco
                this.load.image('palmTree', './assets/img/palmera.png');
                this.load.audio('musicaJungla', './assets/Audio/musicaMapas/musicaJungla.mp3')
                break
            default:
                break;
        }
        //this.load.atlas('flares', './assets/img/flares.png', './assets/img/flares.json');//particulas
        //UI
        this.load.image('Borde', './assets/img/uiimages/border.png');
        this.load.image('BordePoder', './assets/img/uiimages/barrapoder.png');
        //Audio
        this.load.audio('fight', './assets/Audio/hud/fight.mp3')
        this.load.audio('arturoFunny', './assets/Audio/personajes/arturoAudio/arturoFunny.mp3')
        this.load.audio('arturoInicio', './assets/Audio/personajes/arturoAudio/arturoInicio.mp3')
        this.load.audio('arturoPoder', './assets/Audio/personajes/arturoAudio/arturoPoder.mp3')
        this.load.audio('arturoRandom1', './assets/Audio/personajes/arturoAudio/arturoRandom1.mp3')
        this.load.audio('arturoRandom2', './assets/Audio/personajes/arturoAudio/arturoRandom2.mp3')    
        this.load.audio('arturoVictory', './assets/Audio/personajes/arturoAudio/arturoVictory.mp3')
        this.load.audio('espadaGrandeArturo', './assets/Audio/personajes/arturoAudio/espadaGrandeArturo.mp3')
        this.load.audio('espadaPequenaArturo', './assets/Audio/personajes/arturoAudio/espadaPequenaArturo.mp3')
        this.load.audio('azazelFunny', './assets/Audio/personajes/azazelAudio/azazelFunny.mp3')
        this.load.audio('azazelInicio', './assets/Audio/personajes/azazelAudio/azazelInicio.mp3')
        this.load.audio('azazelPoder', './assets/Audio/personajes/azazelAudio/azazelPoder.mp3')
        this.load.audio('azazelRandom1', './assets/Audio/personajes/azazelAudio/azazelRandom1.mp3')
        this.load.audio('azazelVictory', './assets/Audio/personajes/azazelAudio/azazelVictory.mp3')
        this.load.audio('bolafuegoAzazel', './assets/Audio/personajes/azazelAudio/bolafuegoAzazel.mp3')
        this.load.audio('fuegoAzazel', './assets/Audio/personajes/azazelAudio/fuegoAzazel.mp3')
        this.load.audio('shinjiInicio', './assets/Audio/personajes/shinjiAudio/shinjiInicio.mp3')
        this.load.audio('shinjiPoder', './assets/Audio/personajes/shinjiAudio/shinjiPoder.mp3')
        this.load.audio('shinjiVictory', './assets/Audio/personajes/shinjiAudio/shinjiVictory.mp3')
        this.load.audio('shinjiRandom1', './assets/Audio/personajes/shinjiAudio/shinjiRandom1.mp3')
        this.load.audio('shuriken', './assets/Audio/personajes/shinjiAudio/shuriken.mp3')
        this.load.audio('bombshinji', './assets/Audio/personajes/shinjiAudio/bombshinji.mp3')
        this.load.audio('trevorAullido', './assets/Audio/personajes/trevorAudio/trevorAullido.mp3')
        this.load.audio('trevorInicio', './assets/Audio/personajes/trevorAudio/trevorInicio.mp3')
        this.load.audio('trevorPoder', './assets/Audio/personajes/trevorAudio/trevorPoder.mp3')
        this.load.audio('trevorRandom1', './assets/Audio/personajes/trevorAudio/trevorRandom1.mp3')
        this.load.audio('trevorVictory', './assets/Audio/personajes/trevorAudio/trevorVictory.mp3')     
        this.load.audio('lanzaTrevor', './assets/Audio/personajes/trevorAudio/lanzaTrevor.mp3')
        this.load.audio('mazaTrevor', './assets/Audio/personajes/trevorAudio/mazaTrevor.mp3') 
    }

    create() {//asignamos player1 y player 2
        this.HEIGHT = this.sys.game.canvas.height;
        this.WIDTH = this.sys.game.canvas.width;
        this.posicionInicial1 = this.WIDTH / 4;
        this.posicionInicial2 = this.WIDTH - this.WIDTH / 4;
        this.alturaInicial = this.HEIGHT / 2.2;
        this.alturaVacio = this.HEIGHT;
        this.score1 = 0;
        this.score2 = 0;//Marcador de la partida

        console.log(this.Mapinfo,this.p1info,this.p2info)
        switch (this.Mapinfo) {
            case 0:
                new Volcan(this, 600, 300).setScale(1.7, 1.8);
                this.sound.play('musicaVolcan', { volume: VOL_MUSICA });
                break
            case 1:
                new Espacio(this, 600, 300).setScale(1.6, 1.4);
                this.sound.play('musicaNave', { volume: VOL_MUSICA });
                break
            case 2:
                new Muelle(this, 600, 350).setScale(1.8, 1.7);
                this.sound.play('musicaMuelle', { volume: VOL_MUSICA });
                break
            case 3:
                this.add.existing(new Phaser.GameObjects.Sprite(this, 600, 300, 'Castillo')).setScale(1.2, 1);
                this.sound.play('musicaCastillo', { volume: VOL_MUSICA + 0.5});
                break
            case 4:
                this.background = this.add.image(600, 300, 'Jungla').setScale(1.5, 1.5);
                this.sound.play('musicaJungla', { volume: VOL_MUSICA });
                break
            default:
                break;
        }
        this.platforms = this.createPlatforms();
        switch (this.p1info) {
            case 0:
                this.player1 = new Arturo(this, this.posicionInicial1, this.alturaInicial, this.platforms, this.HUD, this.player2, 1);
                this.sound.play('arturoInicio', { volume: 4 });
                break
            case 1:
                this.player1 = new Azazel(this, this.posicionInicial1, this.alturaInicial, this.platforms, this.HUD, this.player2, 1);
                this.sound.play('azazelInicio');
                break
            case 2:
                this.player1 = new Trevor(this, this.posicionInicial1, this.alturaInicial, this.platforms, this.HUD, this.player2, 1); 
                this.sound.play('trevorInicio', { volume: 4 });
                break
            case 3:
                this.player1 = new Shinji(this, this.posicionInicial1, this.alturaInicial, this.platforms, this.HUD, this.player2, 1);
                this.sound.play('shinjiInicio');
                break
            default:
                break;
        }
        switch (this.p2info) {
            case 0:
                this.player2 = new Arturo(this, this.posicionInicial2, this.alturaInicial, this.platforms, this.HUD, this.player1, 2);
                break
            case 1:
                this.player2 = new Azazel(this, this.posicionInicial2, this.alturaInicial, this.platforms, this.HUD, this.player1, 2);
                break
            case 2:
                this.player2 = new Trevor(this, this.posicionInicial2, this.alturaInicial, this.platforms, this.HUD, this.player1, 2);
                break
            case 3:
                this.player2 = new Shinji(this, this.posicionInicial2, this.alturaInicial, this.platforms, this.HUD, this.player1, 2);
                break
            default:
            break;
        }
        this.HUD = new HUD(this, 0, 0, this.player1, this.player2, this.score1, this.score2);
        this.player1.HUD = this.HUD;
        this.player2.HUD = this.HUD;
        this.player1.setOpositePlayer(this.player2);
        this.player2.setOpositePlayer(this.player1);
        
        if (this.Mapinfo == 1) {
            new OVNI(this, this.WIDTH / 3, this.HEIGHT / 10, this.player1, this.player2, 4000);
            new OVNI(this, this.WIDTH, this.HEIGHT / 10, this.player1, this.player2, 3500);
        }
    }
    update(t, dt) {
        this.time = t;

        if (t > time) {//Se genera el objeto 
            time += this.tiempoObjeto;
            this.creaObjeto();
        }
        
        this.HUD.update(t, dt);

        this.terminaJuego();

        this.elapsedInicio += dt;
        if (this.elapsedInicio > this.timeInicio && this.playInicio) {
            switch (this.p2info) {
                case 0:
                    this.sound.play('arturoInicio', {volume:4});
                    break
                case 1:
                    this.sound.play('azazelInicio');
                    break
                case 2:
                    this.sound.play('trevorInicio', { volume: 4 });
                    break
                case 3:
                    this.sound.play('shinjiInicio');
                    break
                default:
                    break;
            }
            this.playInicio = false;
        }
    }

    hitPlayer(player, damage, type) {
        var dir = -1;
        var strength = 0;
        if (player.name == this.HUD.player2.name) {
            this.HUD.BarraDeVida2.decrease(damage);
            if (this.player1.x < this.player2.x) { dir = 1; }
        }
        else if (player.name = this.HUD.player1.name) {
            this.HUD.BarraDeVida1.decrease(damage);
            if (this.player1.x > this.player2.x) { dir = 1; }
        }
        if (player.name === 'Arturo') player.boolPoder = 0;
        else if (player.name === 'Trevor') player.poder += player.poderPorGolpe;
        player.vida -= damage;
        if (type === 0) { strength = 300 / player.playerOpuesto.vida }
        else { strength = (300 / player.playerOpuesto.vida) * 1.5 }
        player.applyKnockback(dir, strength);
        console.log(dir + ":" + strength);
    }
    createPlatforms() {//Crea la plataforma
        let platforms = this.physics.add.staticGroup();
        switch (this.Mapinfo) {
            case 0:
                platforms.create(this.WIDTH / 2, this.HEIGHT - (this.HEIGHT / 10), PLATFORMLAVA).setScale(2, 2).refreshBody();
                platforms.create(this.WIDTH - this.WIDTH / 5, this.HEIGHT - (this.HEIGHT / 15), PLATFORMLAVA).setScale(2, 2).refreshBody();
                platforms.create(this.WIDTH / 5, this.HEIGHT - (this.HEIGHT / 15), PLATFORMLAVA).setScale(2, 2).refreshBody();
                break
            case 1:
                platforms.create(this.WIDTH / 2, this.HEIGHT / 0.95, 'platformMetal').setScale(1.5, 1.5).setFlip(true, true).refreshBody();
                platforms.create(this.WIDTH / 5, this.HEIGHT / 1.5, 'platformMetal').setScale(0.3, 0.3).refreshBody();
                platforms.create(this.WIDTH / 1.25, this.HEIGHT / 1.5, 'platformMetal').setScale(0.3, 0.3).refreshBody();
                platforms.create(this.WIDTH / 2, this.HEIGHT / 1.7, 'platformMetal').setScale(0.3, 0.3).refreshBody();
                break
            case 2:
                platforms.create(this.WIDTH / 6, this.HEIGHT / 1.4, 'wood').setScale(0.4, 0.5).refreshBody();
        platforms.create(this.WIDTH / 2.5, this.HEIGHT / 1.4, 'wood').setScale(0.4, 0.5).refreshBody();
        platforms.create(this.WIDTH / 1.7, this.HEIGHT / 1.4, 'wood').setScale(0.4, 0.5).refreshBody();
        platforms.create(this.WIDTH / 1.2, this.HEIGHT / 1.4, 'wood').setScale(0.4, 0.5).refreshBody();
        platforms.create(this.WIDTH / 1.25, this.HEIGHT / 4, 'wood').setScale(0.8, 0.5).refreshBody();
        platforms.create(this.WIDTH / 1.8, this.HEIGHT / 2.3, 'wood').setScale(0.2, 0.2).refreshBody();
        platforms.create(this.WIDTH / 2.5, this.HEIGHT / 2, 'wood').setScale(0.2, 0.2).refreshBody();
                break
            case 3:
                platforms.create(600, this.HEIGHT + 150, 'bridge').setScale(0.7, 0.7).refreshBody();
                //this.add.existing(new Phaser.GameObjects.Sprite(this, 600, 300, 'Castillo')).setScale(1.2, 1);
                break
            case 4:
                platforms.create(this.WIDTH / 8, this.HEIGHT / 1.2, 'palmTree').setScale(0.7, 0.7).refreshBody().setFlip(true, false);
                platforms.create(this.WIDTH / 1.1, this.HEIGHT / 1.2, 'palmTree').setScale(0.7, 0.7).refreshBody();
                platforms.create(this.WIDTH / 4.5, this.HEIGHT / 1.2, 'palmTree').setScale(0.5, 0.5).refreshBody().setFlip(true, false);
                platforms.create(this.WIDTH / 1.25, this.HEIGHT / 1.2, 'palmTree').setScale(0.5, 0.5).refreshBody();
                platforms.create(this.WIDTH / 1.8, this.HEIGHT / 1.4, 'palmTree').setScale(1.2, 1.2).refreshBody().body.setSize(300, 5).setOffset(5, 60);
                platforms.create(this.WIDTH / 2.05, this.HEIGHT, 'palmTree').setScale(0.8, 0.8).refreshBody().setFlip(true, false);
                break
        }
        return platforms;

    }
    creaObjeto() {//Funcion para crear los objetos que caen, se pondran ifs dentro para luego seleccionar el correspondiente de la escena
        var value = Phaser.Math.Between(2, 11) * 100;//posicion desde donde cae
        switch (this.Mapinfo) {
            case 0:
                new VolcanFireBall(this, value, -300, value, this.player1, this.player2);//Bolas de fuego
                break
            case 1:
                //this.OVNI = new OVNI(this, this.WIDTH / 3, this.HEIGHT / 10, this.player1, this.player2);
                break
            case 2:
                new Fish(this, value, 800, this.player1, this.player2, this.time);//Peces
                break
            case 3:
                new Sword(this, value, -300, this.player1, this.player2, this.platforms, this.time);//Espadas
                break
            case 4:
                new Coconut(this, value, -300, this.player1, this.player2, this.platforms, this.time);
                break
            default:
                break;
        }

    }
    
    terminaJuego() {
        if (this.score1 > 2) {
            switch (this.player1.name) {
                case 'Arturo': this.sound.play('arturoVictory', { volume: 4 })
                    break;
                case 'Azazel': this.sound.play('azazelVictory')
                    break;
                case 'Trevor': this.sound.play('trevorVictory', { volume: 4 })
                    break;
                case 'Shinji': this.sound.play('shinjiVictory')
                    break;
            }
        }
        else if (this.score2 > 2) {
            switch (this.player2.name) {
                case 'Arturo': this.sound.play('arturoVictory', { volume: 4 })
                    break;
                case 'Azazel': this.sound.play('azazelVictory')
                    break;
                case 'Trevor': this.sound.play('trevorVictory', { volume: 4 })
                    break;
                case 'Shinji': this.sound.play('shinjiVictory')
                    break;
            }
        }
        if (this.score1 > 2 || this.score2 > 2) {
            var menuScene = this.scene.get('menu');
            menuScene.scene.restart();
            this.scene.start(menuScene);
        }
    }
   
   
}

