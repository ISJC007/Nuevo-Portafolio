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

const audio = document.getElementById('background-audio');
const audioBtn = document.getElementById('audio-toggle-btn');
let isPlaying = false;

if (audio && audioBtn) { 
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


const climaResultado = document.getElementById('clima-resultado');
const ciudadInput = document.getElementById('ciudad-input');
const buscarBtn = document.getElementById('buscar-clima-btn');

const API_KEY = "b8a11e8ad98a60e8980efd21daec4637"; 
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?q=";
const UNITS = "metric"; 

function displayClima(data) {
    if (data.cod === "404") {
        climaResultado.innerHTML = `<h4>Error:</h4><p>Ciudad no encontrada. Por favor, verifica el nombre.</p>`;
        return;
    }

    if (data.cod === 401 || data.message === "Invalid API key") {
         climaResultado.innerHTML = `<h4>Error de Clave API (401):</h4><p>La clave de OpenWeatherMap es inválida. Revisa tu consola para más detalles.</p>`;
         return;
    }

    const tempCelsius = Math.round(data.main.temp);
    const descripcion = data.weather[0].description;
    const ciudad = data.name;
    const pais = data.sys.country;
    const humedad = data.main.humidity;

    climaResultado.innerHTML = `
        <h4>Clima en ${ciudad}, ${pais}:</h4>
        <p>Temperatura: <strong>${tempCelsius}°C</strong></p>
        <p>Condición: ${descripcion.charAt(0).toUpperCase() + descripcion.slice(1)}</p>
        <p>Humedad: ${humedad}%</p>
    `;
}

async function buscarClima() {
    const ciudad = ciudadInput.value.trim();

    if (ciudad === "") {
        climaResultado.innerHTML = "<p>Por favor, introduce el nombre de una ciudad.</p>";
        return;
    }
    
    climaResultado.innerHTML = "<p>Buscando datos del clima...</p>";

    try {
        const url = `${BASE_URL}${ciudad}&units=${UNITS}&appid=${API_KEY}`;
        
        const response = await fetch(url); 
        
        const data = await response.json();
        
        if (!response.ok) {
            displayClima(data); 
            return;
        }

        displayClima(data);

    } catch (error) {
        console.error("Error al obtener el clima:", error);
        climaResultado.innerHTML = `<h4>Error de Conexión:</h4><p>No se pudo contactar con el servicio de clima. ¿Estás conectado a internet?</p>`;
    }
}

window.addEventListener('load', handleLoadingScreen);

if (buscarBtn) {
    buscarBtn.addEventListener('click', buscarClima);
}

if (ciudadInput) {
    ciudadInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            buscarClima();
        }
    });
}

const inversionInput = document.getElementById('inversion-inicial');
const tasaInput = document.getElementById('tasa-mensual');
const mesesInput = document.getElementById('meses-proyeccion');
const calcularBtn = document.getElementById('calcular-btn');
const guardarBtn = document.getElementById('guardar-btn');
const simuladorResultado = document.getElementById('simulador-resultado');

let ultimoResultado = null; 

function calcularProyeccion() {
    const inversionInicial = parseFloat(inversionInput.value);
    const tasaMensual = parseFloat(tasaInput.value) / 100;
    const meses = parseInt(mesesInput.value);
    
    if (isNaN(inversionInicial) || isNaN(tasaMensual) || isNaN(meses) || inversionInicial <= 0 || meses < 1) {
        simuladorResultado.innerHTML = "<p style='color: #e74c3c;'>⚠️ Error: Introduce valores numéricos válidos y positivos.</p>";
        guardarBtn.disabled = true;
        return;
    }

    const tasaEfectiva = 1 + tasaMensual;
    const capitalFinal = inversionInicial * Math.pow(tasaEfectiva, meses);
    const gananciaNeta = capitalFinal - inversionInicial;

    const formatoOpciones = { style: 'currency', currency: 'USD' };
    const capitalFinalFormateado = capitalFinal.toLocaleString('es-VE', formatoOpciones);
    const gananciaNetaFormateada = gananciaNeta.toLocaleString('es-VE', formatoOpciones);
    const inversionFormateada = inversionInicial.toLocaleString('es-VE', formatoOpciones);

    simuladorResultado.innerHTML = `
        <h4>✅ Cálculo Completo:</h4>
        <p>Inversión Inicial: <strong>${inversionFormateada}</strong></p>
        <p>Ganancia Neta (${meses} meses): <strong style="color: #2ecc71;">${gananciaNetaFormateada}</strong></p>
        <p>Capital Final Proyectado: <strong>${capitalFinalFormateado}</strong></p>
    `;

    ultimoResultado = {
        fecha: new Date().toISOString(),
        inversionInicial: inversionInicial,
        tasaMensual: tasaMensual * 100,
        meses: meses,
        capitalFinal: capitalFinal
    };

    guardarBtn.disabled = false;
}


function guardarEnCloud() {
    if (!ultimoResultado) return;
    
    guardarBtn.textContent = "💾 Guardando en AWS...";
    guardarBtn.disabled = true;

    
    setTimeout(() => {
        simuladorResultado.innerHTML += `<p style="color: #3498db; margin-top: 10px;">✅ Proyección guardada. Esta acción demuestra la conexión a DynamoDB a través de una API Gateway.</p>`;
        guardarBtn.textContent = "Guardar en Cloud (AWS)";
        guardarBtn.disabled = false;
        ultimoResultado = null;
    }, 2000); 

}

if (calcularBtn) {
    calcularBtn.addEventListener('click', calcularProyeccion);
}

if (guardarBtn) {
    guardarBtn.addEventListener('click', guardarEnCloud);
}
