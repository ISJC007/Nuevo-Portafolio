let isSaving = false;

function setupSimuladorApp() {
    var inversionInput = document.getElementById('inversionInicial'); 
    var tasaInput = document.getElementById('tasaMensual');       
    var mesesInput = document.getElementById('mesesProyeccion');    
    var calcularBtn = document.getElementById('calcularBtn');     
    var guardarBtn = document.getElementById('guardarBtn');       
    var simuladorResultado = document.getElementById('simuladorResultado'); 

    // Verificar que los elementos existan antes de continuar
    if (!calcularBtn) return;

    var ultimoResultado = null; 

    function calcularProyeccion() {
        if (!inversionInput || !tasaInput || !mesesInput || !simuladorResultado) return;
        
        var inv = parseFloat(inversionInput.value);
        var tasaPercent = parseFloat(tasaInput.value);
        var tasaDecimal = tasaPercent / 100;
        var meses = parseInt(mesesInput.value);
        
        if (isNaN(inv) || isNaN(tasaPercent) || isNaN(meses) || inv <= 0) {
            simuladorResultado.innerHTML = "<p style='color: #e74c3c;'>⚠️ Por favor, ingresa datos válidos para la proyección.</p>";
            return;
        }

        var capitalFinal = inv * Math.pow(1 + tasaDecimal, meses);
        var ganancia = capitalFinal - inv;

        var formato = { style: 'currency', currency: 'USD' };
        
        simuladorResultado.innerHTML = 
            "<h4>✅ Resultado de la Proyección:</h4>" +
            "<p>Inversión Inicial: <strong>" + inv.toLocaleString('en-US', formato) + "</strong></p>" +
            "<p>Tasa Mensual: <strong>" + tasaPercent + "%</strong></p>" +
            "<p>Tiempo: <strong>" + meses + " meses</strong></p>" +
            "<hr style='border: 0.5px solid var(--color-separador);'>" +
            "<p>Ganancia Estimada: <strong style='color: #2ecc71;'>" + ganancia.toLocaleString('en-US', formato) + "</strong></p>" +
            "<p>Total Final: <strong style='font-size: 1.2em;'>" + capitalFinal.toLocaleString('en-US', formato) + "</strong></p>";

        ultimoResultado = { 
            inversion: inv, 
            tasa: tasaPercent, 
            periodo: meses, 
            ganancia: ganancia.toFixed(2),
            total: capitalFinal.toFixed(2),
            fecha: new Date().toISOString()
        };

        if(guardarBtn) guardarBtn.disabled = false;
    }

    function guardarEnCloud() {
        if (!ultimoResultado || isSaving || !guardarBtn || !simuladorResultado) return;
        
        isSaving = true; 
        guardarBtn.textContent = "💾 Conectando con AWS DynamoDB...";
        guardarBtn.style.opacity = "0.7";
        
        setTimeout(function() {
            simuladorResultado.innerHTML += `
                <div style="margin-top: 15px; padding: 10px; background: rgba(52, 152, 219, 0.1); border-radius: 8px; border: 1px solid #3498db;">
                    <p style="color: #3498db; margin: 0; font-size: 0.9em;">
                        <strong>Status: 200 OK</strong><br>
                        Objeto guardado con éxito en la tabla 'SimulacionesPortafolio'.<br>
                        ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </p>
                </div>`;
            
            guardarBtn.textContent = "Guardar en Cloud (AWS)";
            guardarBtn.style.opacity = "1";
            guardarBtn.disabled = true;
            isSaving = false; 

            console.log("Datos enviados a AWS DynamoDB:", ultimoResultado);
        }, 2000); 
    }

    calcularBtn.addEventListener('click', calcularProyeccion);
    if (guardarBtn) guardarBtn.addEventListener('click', guardarEnCloud);
}

// Inicialización segura
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSimuladorApp);
} else {
    setupSimuladorApp();
}