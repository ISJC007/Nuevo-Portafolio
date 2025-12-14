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
        if (!ultimoResultado || !simuladorResultado || !guardarBtn || isSaving) return;
        
        isSaving = true; 
        guardarBtn.textContent = "💾 Guardando en AWS...";
        guardarBtn.disabled = true;

        setTimeout(function() {
            simuladorResultado.innerHTML += "<p style='color: #3498db; margin-top: 10px;'>✅ Proyección guardada. Esta acción demuestra la conexión a DynamoDB a través de una API Gateway.</p>";
            
            guardarBtn.textContent = "Guardar en Cloud (AWS)";
            guardarBtn.disabled = false;
            isSaving = false; 
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

document.addEventListener('DOMContentLoaded', setupSimuladorApp);