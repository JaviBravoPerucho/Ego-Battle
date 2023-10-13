var party = [
    { name: 'Bat', id: 'bat1' , hp : 10, maxHp: 20, lastHp: 10.0},
    { name: 'Slime', id: 'slime', hp: 50, maxHp: 50, lastHp: 50.0 },
    { name: 'Bat', id: 'bat2', hp: 5, maxHp: 20, lastHp: 5.0 }
];



window.onload = function () {
    var list = document.getElementById('party-monsters');
    var select = document.querySelector('select[name = chara]')
    var musica = document.getElementById('music');
    var exp = document.getElementById('explosion');
    
    party.forEach(function (character)
    {
        var li = document.createElement('li');
        li.innerHTML = character.name + '(<code>)' + character.id + '</code>';
        li.dataset.charaid = character.id;
        list.append(li);
        var option = document.createElement('option');
        option.innerHTML = character.name;
        option.value = character.id;
        select.appendChild(option);
    })
    var form = document.querySelector('form[name=killing-machine]');
    var btn = document.querySelector('button');
    var charaID = form.querySelector('[name=chara]').value;
    var li = list.querySelector('[data-charaid= ' + charaID + ']');
    var audioHit = document.getElementById('hit');    

    form.addEventListener('submit', function (event) {  
        musica.play();
        event.preventDefault();     
        var character = findCharById(charaID);
        character.hp -= 5;
        audioHit.play();
        if (character.hp <= 0) {
            exp.play();
            character.hp = 0;
            li.classList.add('dead');
            console.log('Killed character:', charaID);
            btn.disabled = true;
        }
       
    });
    form.addEventListener('change', function (event)//Al cambiar la seleccion miramos los nuevos parametros para ver si hay que desactivar el boton
    {
        event.preventDefault();
        charaID = form.querySelector('[name=chara]').value;
        li = list.querySelector('[data-charaid= ' + charaID + ']');
        if (li.classList != 'dead') { btn.disabled = false }
        else { btn.disabled = true; }

    })
    var lastRender = 0;
    var canvas = document.querySelector('canvas');
    var context = canvas.getContext('2d');

    function render() {
        requestAnimationFrame(function (t) {
            // Borra todo...
            context.clearRect(0, 0, 800, 600);
            // ...y repinta.
            renderParty(t);
            //console.log('Delta time:', t - lastRender);
            lastRender = t;
            render();
        });
    }

    function renderParty(t) {
        renderBackground();
        renderCharacters(t); // pásale t a la función que pinta los enemigos.
        renderUI();
    }
    var bgImage = document.getElementById('background');
    var slimeImage = document.getElementById('slime');
    var batImage = document.getElementById('bat');
   
    function renderBackground() {
        context.drawImage(bgImage, 0, 0);
    }

    function renderCharacters(t) {
        var charaSpace = 800 / party.length;
        var centerOffset = charaSpace / 2;
        party.forEach(function (char, index) {
            var x = index * charaSpace + centerOffset;
            var y;
            if (char.hp === 0) {
                context.fillStyle = 'grey';
                y = 500; // en el suelo porque está muerto.
                context.beginPath();
                context.arc(x, y, 50, 0, 2 * Math.PI);
                context.fill();
            } else if (char.name === 'Bat') {
                x -= 250;
                y = 50 * Math.sin(t / 100) + 50; // flotando en el aire.
                context.drawImage(batImage, x, y);
            } else if (char.name === 'Slime') {                
                x = 100;
                y = 100; // en el suelo pero no en la tumba. 
                context.drawImage(slimeImage, x, y);                          
            }
            
            
           
        });
    }

    function renderUI() {
        var width = 100;
        var semiWidth = width / 2;
        var height = 20;
        var semiHeight = height / 2;
        var charaSpace = 800 / party.length;
        var centerOffset = charaSpace / 2;
        party.forEach(function (char, index) {
            var x = index * charaSpace + centerOffset;
            var y = 500;
            if (char.hp > 0) {
                if (char.hp < char.lastHp) { char.lastHp -= 0.2; }
                var lifeArea = Math.floor(char.lastHp / char.maxHp * width);
                context.fillStyle = 'red';
                context.fillRect(x - semiWidth, y - semiHeight, lifeArea, height);
                context.lineWidth = 3;
                context.strokeStyle = 'black';
                context.strokeRect(x - semiWidth, y - semiHeight, width, height);
            }
        });
    }


    render();
}
function findCharById(charaID) {
    return party.filter(function (char) { return char.id === charaID; })[0];
}
