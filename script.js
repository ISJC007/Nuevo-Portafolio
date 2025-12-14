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
