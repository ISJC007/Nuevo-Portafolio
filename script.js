const cuerpo = document.querySelector('body');

const boton = document.querySelector('#modo-oscuro-btn');

boton.addEventListener('click', alternarModoOscuro);

function alternarModoOscuro() {
    cuerpo.classList.toggle('dark-mode');

    if (cuerpo.classList.contains('dark-mode')) {
        boton.textContent = 'Desactivar Modo Oscuro';
    } else {
        boton.textContent = 'Activar Modo Oscuro';
    }

}


