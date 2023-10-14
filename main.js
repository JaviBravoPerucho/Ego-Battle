function DevuelveAlerta() { return " La gama alta de NVIDIA es muy cara" }

var x = 0;
function CambiaColor(nombre) {
    var p = document.getElementById(nombre);
    var i;
    while (i == x) {
        i = Math.floor(Math.random() * 3);//Color random
    }
    x = i;
    if (i == 0) { p.style.color = 'red'; }
    else if (i == 1) p.style.color = 'blue';
    else if (i == 2) p.style.color = 'green';
    else p.style.color = 'purple';
}
