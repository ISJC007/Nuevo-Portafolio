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
}); 

function getGreeting() {
    var now = new Date();
    var hour = now.getHours();
    var subject = "Jefe"; 
    var timeOfDay = (hour >= 5 && hour < 12) ? "días" : (hour >= 12 && hour < 19) ? "tardes" : "noches";
    return "Buenas " + timeOfDay + " " + subject + ". ¡Bienvenido/a!";
}

function handleLoadingScreen() {
    var loadingScreen = document.getElementById('loading-screen');
    var greetingMessage = document.getElementById('greeting-message');

    if (!loadingScreen || !greetingMessage) return; 

    setTimeout(function() {
        greetingMessage.textContent = getGreeting().replace(". ¡Bienvenido/a!", "."); 
        setTimeout(function() {
            loadingScreen.style.opacity = '0'; 
            setTimeout(function() { loadingScreen.style.display = 'none'; }, 500); 
        }, 1500); 
    }, 1000); 
}
window.addEventListener('load', handleLoadingScreen); 

function setupClimaApp() {
     var climaResultado = document.getElementById('climaResultado'); 
     var ciudadInput = document.getElementById('ciudadInput');       
     var buscarBtn = document.getElementById('buscarClimaBtn');

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
        var proxyUrl = `/.netlify/functions/get-weather?city=${ciudad}`;
        
        try {
            const response = await fetch(proxyUrl);
            const data = await response.json();
            displayClima(data);
        } catch (error) {
            climaResultado.innerHTML = "<h4>Error:</h4><p>Verifica tu conexión o Netlify.</p>";
        }
    }

    if (buscarBtn) buscarBtn.addEventListener('click', buscarClima);
}

const contactForm = document.querySelector('form[name="contacto-portafolio"]');
const statusMsg = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener("submit", function(e) {
    e.preventDefault(); 
    
    statusMsg.textContent = "Enviando mensaje...";
    statusMsg.style.color = "var(--color-acento)";

    const formData = new FormData(contactForm);
    
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
    .then(response => {
      if (response.ok) {
        statusMsg.textContent = "✅ ¡Mensaje enviado con éxito, Jefe!";
        statusMsg.style.color = "#2ecc71";
        contactForm.reset();
        setTimeout(() => { statusMsg.textContent = ""; }, 5000);
      } else {
        throw new Error();
      }
    })
    .catch(() => {
      statusMsg.textContent = "❌ Error al enviar. Intenta de nuevo.";
      statusMsg.style.color = "#e74c3c";
    });
  });
}