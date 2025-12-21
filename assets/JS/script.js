document.addEventListener('DOMContentLoaded', function() {
    // Manejo de apertura de proyectos
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

    // Manejo de cierre de proyectos
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

    // Sistema de Temas (Light/Dark)
    var toggleButton = document.getElementById('theme-toggle');
    var body = document.body;
    
    function applyTheme(theme) {
        if (!toggleButton) return;
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

    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            if (body.classList.contains('light-mode')) {
                applyTheme('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                applyTheme('light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Inicializar sub-aplicaciones
    setupClimaApp();
    setupContacto();
}); 

// Lógica de Saludo y Pantalla de Carga
function getGreeting() {
    var now = new Date();
    var hour = now.getHours();
    var subject = "Jefe"; 
    var timeOfDay = (hour >= 5 && hour < 12) ? "días" : (hour >= 12 && hour < 19) ? "tardes" : "noches";
    
    return "Buenas " + timeOfDay + " " + subject + "<br>¡Bienvenido/a!";
}

function handleLoadingScreen() {
    var loadingScreen = document.getElementById('loading-screen');
    var greetingMessage = document.getElementById('greeting-message');
    if (!loadingScreen || !greetingMessage) return; 

    setTimeout(function() {
        greetingMessage.innerHTML = getGreeting(); 
        
        setTimeout(function() {
            loadingScreen.style.opacity = '0'; 
            setTimeout(function() { loadingScreen.style.display = 'none'; }, 500); 
        }, 1500); 
    }, 1000); 
}
window.addEventListener('load', handleLoadingScreen); 

// App de Clima
function setupClimaApp() {
    var climaResultado = document.getElementById('climaResultado'); 
    var ciudadInput = document.getElementById('ciudadInput');       
    var buscarBtn = document.getElementById('buscarClimaBtn');

    if (!buscarBtn || !ciudadInput) return;

    function displayClima(data) {
        if (!climaResultado) return; 
        if (data.cod === "404") {
            climaResultado.innerHTML = "<h4>Error:</h4><p>Ciudad no encontrada.</p>";
            return;
        }
        var tempCelsius = Math.round(data.main.temp);
        var descripcion = data.weather[0].description;
        climaResultado.innerHTML = 
            "<h4>Clima en " + data.name + ":</h4>" +
            "<p>Temperatura: <strong>" + tempCelsius + "°C</strong></p>" +
            "<p>Condición: " + (descripcion.charAt(0).toUpperCase() + descripcion.slice(1)) + "</p>";
    }

    async function buscarClima() {
        var ciudad = ciudadInput.value.trim();
        if (ciudad === "") return;
        climaResultado.innerHTML = "<p>Buscando...</p>";
        
        var proxyUrl = `/api/get-weather?city=${ciudad}`;
        
        try {
            const response = await fetch(proxyUrl);
            const data = await response.json();
            displayClima(data);
        } catch (error) {
            climaResultado.innerHTML = "<h4>Error:</h4><p>Fallo en la API del Clima.</p>";
        }
    }
    buscarBtn.addEventListener('click', buscarClima);
}

// Formulario de Contacto
function setupContacto() {
    const contactForm = document.getElementById('contact-form-vercel');
    const statusMsg = document.getElementById('form-status');

    if (contactForm && statusMsg) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const formData = new FormData(contactForm);
            statusMsg.innerHTML = "⏳ Enviando mensaje...";
            statusMsg.style.color = "var(--color-acento)";

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    statusMsg.innerHTML = "✅ ¡Mensaje enviado con éxito, Jefe!";
                    statusMsg.style.color = "#2ecc71";
                    contactForm.reset();
                    setTimeout(() => { statusMsg.textContent = ""; }, 5000);
                } else {
                    statusMsg.innerHTML = "❌ Hubo un error en el servidor.";
                    statusMsg.style.color = "#e74c3c";
                }
            } catch (error) {
                statusMsg.innerHTML = "❌ Error de conexión.";
                statusMsg.style.color = "#e74c3c";
            }
        });
    }
}