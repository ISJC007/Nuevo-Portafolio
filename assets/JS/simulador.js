let isSaving = false;

function setupSimuladorApp() {
    var inversionInput = document.getElementById('inversionInicial'); 
    var tasaInput = document.getElementById('tasaMensual');       
    var mesesInput = document.getElementById('mesesProyeccion');    
    var calcularBtn = document.getElementById('calcularBtn');     
    var guardarBtn = document.getElementById('guardarBtn');       
    var simuladorResultado = document.getElementById('simuladorResultado'); 

    var ultimoResultado = null; 

    function calcularProyeccion() {
        if (!inversionInput || !tasaInput || !mesesInput) return;
        var inv = parseFloat(inversionInput.value);
        var tasa = parseFloat(tasaInput.value) / 100;
        var meses = parseInt(mesesInput.value);
        
        if (isNaN(inv) || isNaN(tasa) || isNaN(meses) || inv <= 0) {
            simuladorResultado.innerHTML = "<p style='color: #e74c3c;'>⚠️ Datos inválidos.</p>";
            return;
        }

        var capitalFinal = inv * Math.pow(1 + tasa, meses);
        var ganancia = capitalFinal - inv;
        var formato = { style: 'currency', currency: 'USD' };
        
        simuladorResultado.innerHTML = 
            "<h4>✅ Cálculo:</h4>" +
            "<p>Total: <strong>" + capitalFinal.toLocaleString('en-US', formato) + "</strong></p>";

        ultimoResultado = { inv, tasa, meses, capitalFinal };
        if(guardarBtn) guardarBtn.disabled = false;
    }

    function guardarEnCloud() {
        if (!ultimoResultado || isSaving) return;
        isSaving = true; 
        guardarBtn.textContent = "💾 Guardando...";
        setTimeout(function() {
            simuladorResultado.innerHTML += "<p style='color: #3498db;'>✅ Guardado en AWS (Simulado).</p>";
            guardarBtn.textContent = "Guardar en Cloud (AWS)";
            guardarBtn.disabled = true;
            isSaving = false; 
        }, 1500); 
    }

    if (calcularBtn) calcularBtn.addEventListener('click', calcularProyeccion);
    if (guardarBtn) guardarBtn.addEventListener('click', guardarEnCloud);
}
document.addEventListener('DOMContentLoaded', setupSimuladorApp);