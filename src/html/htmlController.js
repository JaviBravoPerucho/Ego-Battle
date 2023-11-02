'use strict'

const li = document.querySelectorAll('.li')
const bloque = document.querySelectorAll('.bloque')

li.forEach((everyli, i) => {
    li[i].addEventListener('click', () => {

        li.forEach((everyli, i) => {
            li[i].classList.remove('activo');
            bloque[i].classList.remove('activo');
        })

        li[i].classList.add('activo');
        bloque[i].classList.add('activo');
    })
})