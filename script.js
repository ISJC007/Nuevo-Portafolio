const cuerpo = document.querySelector('body');
const boton = document.querySelector('#modo-oscuro-btn');

function alternarModoOscuro() {
    cuerpo.classList.toggle('dark-mode');

    if (cuerpo.classList.contains('dark-mode')) {
        boton.textContent = 'Desactivar Modo Oscuro';
    } else {
        boton.textContent = 'Activar Modo Oscuro';
    }
}

if (boton) {
    boton.addEventListener('click', alternarModoOscuro);
}


// ==========================================================
// 2. LÓGICA DEL AUDIO (Modo Clásico)
// ==========================================================
const audio = document.getElementById('background-audio');
const audioBtn = document.getElementById('audio-toggle-btn');
let isPlaying = false;

if (audio && audioBtn) { 
    // Texto Inicial: Modo Clásico (no lo cambies en el if/else)
    audioBtn.textContent = 'Modo Clásico (OFF)'; 
    
    audioBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            audioBtn.textContent = 'Modo Clásico (OFF)';
        } else {
            audio.play().catch(error => {
                console.error("No se pudo reproducir el audio automáticamente.", error);
            });
            audioBtn.textContent = 'Modo Clásico (ON)';
        }
        isPlaying = !isPlaying;
    });
}

function getGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const subject = "Jefe/Jefa";
    let timeOfDay = "";

    if (hour >= 5 && hour < 12) {
        timeOfDay = "días";
    } else if (hour >= 12 && hour < 19) {
        timeOfDay = "tardes";
    } else {
        timeOfDay = "noches";
    }

    return `Buenas ${timeOfDay}, ${subject}. ¡Bienvenido/a!`;
}

function handleLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const greetingMessage = document.getElementById('greeting-message');

    if (!loadingScreen || !greetingMessage) return; 

    greetingMessage.textContent = getGreeting();

    setTimeout(() => {
        loadingScreen.style.opacity = '0'; 
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 1000); 

    }, 2000); 
}

window.addEventListener('load', handleLoadingScreen);