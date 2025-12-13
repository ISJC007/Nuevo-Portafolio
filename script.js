document.addEventListener('DOMContentLoaded', function() {
    
    function openProject(event) {
        event.preventDefault(); 
        var targetId = event.currentTarget.getAttribute('href'); 
        var targetElement = document.querySelector(targetId);

        if (targetElement) {
            document.querySelectorAll('.app-section').forEach(function(app) {
                app.classList.remove('is-visible');
            });
            
            targetElement.classList.add('is-visible');
            
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    document.querySelectorAll('.proyectos-grid a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', openProject);
    });

    document.querySelectorAll('.close-app-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var targetId = btn.getAttribute('data-target'); 
            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.classList.remove('is-visible'); 
                
                document.querySelector('.projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    var toggleButton = document.getElementById('theme-toggle');
    var body = document.body;
    
    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-mode');
            toggleButton.querySelector('i').className = 'fas fa-moon'; 
        } else {
            body.classList.remove('light-mode');
            toggleButton.querySelector('i').className = 'fas fa-lightbulb'; 
        }
    }

    var savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    toggleButton.addEventListener('click', function() {
        if (body.classList.contains('light-mode')) {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            applyTheme('light');
            localStorage.setItem('theme', 'light');
        }
    });

    setupClimaApp();
    setupSimuladorApp();

}); 

function getGreeting() {
    var now = new Date();
    var hour = now.getHours();
    var subject = "Jefe"; 
    var timeOfDay = "";

    if (hour >= 5 && hour < 12) {
        timeOfDay = "días";
    } else if (hour >= 12 && hour < 19) {
        timeOfDay = "tardes";
    } else {
        timeOfDay = "noches";
    }
    return "Buenas " + timeOfDay + " " + subject + ". ¡Bienvenido/a!";
}

function handleLoadingScreen() {
    var loadingScreen = document.getElementById('loading-screen');
    var greetingMessage = document.getElementById('greeting-message');

    if (!loadingScreen || !greetingMessage) return; 

    setTimeout(function() {
        
        var saludo = getGreeting();
        
        var textoSaludoPersonalizado = saludo.replace(". ¡Bienvenido/a!", "") + ".";

        greetingMessage.textContent = textoSaludoPersonalizado; 

        setTimeout(function() {
            loadingScreen.style.opacity = '0'; 
            
            setTimeout(function() {
                loadingScreen.style.display = 'none'; 
            }, 500); 

        }, 1000); 

    }, 1000); 
}

window.addEventListener('load', handleLoadingScreen); 

function setupClimaApp() {
    var climaResultado = document.getElementById('clima-resultado');
    var ciudadInput = document.getElementById('ciudad-input');
    var buscarBtn = document.getElementById('buscar-clima-btn');

    function displayClima(data) {
        if (!climaResultado) return; 

        if (data.cod === "404") {
            climaResultado.innerHTML = "<h4>Error:</h4><p>Ciudad no encontrada. Por favor, verifica el nombre.</p>";
            return;
        }

        var tempCelsius = Math.round(data.main.temp);
        var descripcion = data.weather[0].description;
        var ciudad = data.name;
        var pais = data.sys.country;
        var humedad = data.main.humidity;

        climaResultado.innerHTML = 
            "<h4>Clima en " + ciudad + ", " + pais + ":</h4>" +
            "<p>Temperatura: <strong>" + tempCelsius + "°C</strong></p>" +
            "<p>Condición: " + (descripcion.charAt(0).toUpperCase() + descripcion.slice(1)) + "</p>" +
            "<p>Humedad: " + humedad + "%</p>";
    }

    function buscarClima() {
        var ciudad = ciudadInput.value.trim();

        if (ciudad === "") {
            climaResultado.innerHTML = "<p>Por favor, introduce el nombre de una ciudad.</p>";
            return;
        }
        
        climaResultado.innerHTML = "<p>Buscando datos del clima...</p>";

        var proxyUrl = `/.netlify/functions/get-weather?city=${ciudad}`;
        
        fetch(proxyUrl)
            .then(function(response) {
                return response.json().then(function(data) {
                    if (!response.ok) {
                        displayClima(data); 
                        return Promise.reject(new Error('Fallo en la función proxy'));
                    }
                    displayClima(data);
                });
            })
            .catch(function(error) {
                console.error("Error al obtener el clima:", error);
                climaResultado.innerHTML = "<h4>Error de Conexión:</h4><p>No se pudo contactar con el servidor. Verifica tu internet o la configuración de Netlify.</p>";
            });
    }

    if (buscarBtn) {
        buscarBtn.addEventListener('click', buscarClima);
    }

    if (ciudadInput) {
        ciudadInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                buscarClima();
            }
        });
    }
}
function setupSimuladorApp() {
    var inversionInput = document.getElementById('inversion-inicial');
    var tasaInput = document.getElementById('tasa-mensual');
    var mesesInput = document.getElementById('meses-proyeccion');
    var calcularBtn = document.getElementById('calcular-btn');
    var guardarBtn = document.getElementById('guardar-btn');
    var simuladorResultado = document.getElementById('simulador-resultado');

    var ultimoResultado = null; 

    function calcularProyeccion() {
        if (!inversionInput || !tasaInput || !mesesInput || !simuladorResultado) return;
        
        var inversionInicial = parseFloat(inversionInput.value);
        var tasaMensual = parseFloat(tasaInput.value) / 100;
        var meses = parseInt(mesesInput.value);
        
        if (isNaN(inversionInicial) || isNaN(tasaMensual) || isNaN(meses) || inversionInicial <= 0 || meses < 1) {
            simuladorResultado.innerHTML = "<p style='color: #e74c3c;'>⚠️ Error: Introduce valores numéricos válidos y positivos.</p>";
            if(guardarBtn) guardarBtn.disabled = true;
            return;
        }

        var tasaEfectiva = 1 + tasaMensual;
        var capitalFinal = inversionInicial * Math.pow(tasaEfectiva, meses);
        var gananciaNeta = capitalFinal - inversionInicial;

        var formatoOpciones = { style: 'currency', currency: 'USD' };
        var capitalFinalFormateado = capitalFinal.toLocaleString('es-VE', formatoOpciones);
        var gananciaNetaFormateada = gananciaNeta.toLocaleString('es-VE', formatoOpciones);
        var inversionFormateada = inversionInicial.toLocaleString('es-VE', formatoOpciones);

        simuladorResultado.innerHTML = 
            "<h4>✅ Cálculo Completo:</h4>" +
            "<p>Inversión Inicial: <strong>" + inversionFormateada + "</strong></p>" +
            "<p>Ganancia Neta (" + meses + " meses): <strong style='color: #2ecc71;'>" + gananciaNetaFormateada + "</strong></p>" +
            "<p>Capital Final Proyectado: <strong>" + capitalFinalFormateado + "</strong></p>";

        ultimoResultado = {
            fecha: new Date().toISOString(),
            inversionInicial: inversionInicial,
            tasaMensual: tasaMensual * 100,
            meses: meses,
            capitalFinal: capitalFinal
        };

        if(guardarBtn) guardarBtn.disabled = false;
    }


    function guardarEnCloud() {
        if (!ultimoResultado || !simuladorResultado || !guardarBtn) return;
        
        guardarBtn.textContent = "💾 Guardando en AWS...";
        guardarBtn.disabled = true;

        setTimeout(function() {
            simuladorResultado.innerHTML += "<p style='color: #3498db; margin-top: 10px;'>✅ Proyección guardada. Esta acción demuestra la conexión a DynamoDB a través de una API Gateway.</p>";
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
} 