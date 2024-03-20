
// Variable para almacenar las conversiones
var conversionRates;

// Función para cargar el archivo JSON
function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'conversion_rates.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == 200) {
            callback(JSON.parse(xobj.responseText));
            // Llama a la función init() después de cargar el JSON
            init();
        }
    };
    xobj.send(null);
}

// Función para inicializar el balance y los elementos desde el localStorage
function init() {
    var balance = localStorage.getItem('balance');
    var transactionList = localStorage.getItem('transactionList');

    if (balance) {
        document.getElementById('balance').textContent = balance;
        actualizarBalanceEquivalente(balance);
        document.getElementById('balance').className = parseFloat(balance) >= 0 ? 'positive' : 'negative';
    }

    if (transactionList) {
        document.getElementById('transactionList').innerHTML = transactionList;
    }
}

// Lógica para calcular las conversiones y agregar elementos al DOM
function agregarElemento() {
    var detail = document.getElementById('detail').value.trim();
    var amount = parseFloat(document.getElementById('amount').value);

    // Verifica si el detalle y el monto están completos
    if (!detail || isNaN(amount)) {
        showPopup('Por favor completa el detalle y el monto correctamente.', 'error');
        return; // No agrega el elemento si no están completos
    }

    var type = document.getElementById('type').value;

    // Calcula las conversiones
    var amountUSD = amount / conversionRates.dolar;
    var amountEUR = amount / conversionRates.euro;

    // Crea el elemento HTML para agregar
    var nuevoElemento = document.createElement('div');
    nuevoElemento.classList.add('transaction');
    nuevoElemento.classList.add(type === 'ingreso' ? 'ingreso' : 'gasto');
    nuevoElemento.innerHTML = '<div>' + type + '</div>' +
        '<div>' + detail + '</div>' +
        '<div>' + amount.toFixed(2) + '</div>' +
        '<div>' + amountUSD.toFixed(2) + '</div>' +
        '<div>' + amountEUR.toFixed(2) + '</div>' +
        '<button class="delete-btn"><i class="fas fa-trash"></i></button>';

    // Agrega el elemento al contenedor
    var contenedor = document.getElementById('transactionList');
    contenedor.appendChild(nuevoElemento);

    // Actualiza el balance
    actualizarBalance(type, amount);

    // Muestra un mensaje emergente
    showPopup('Se incorporó un ' + (type === 'ingreso' ? 'ingreso' : 'gasto') + ': ' + detail, type);

    // Guarda el estado en localStorage
    guardarEstado();
    
    // Limpia los campos del formulario
    document.getElementById('detail').value = '';
    document.getElementById('amount').value = '';
}

// Función para actualizar el balance
function actualizarBalance(type, amount) {
    var balanceElement = document.getElementById('balance');
    var balance = parseFloat(balanceElement.textContent || 0);

    if (type === 'ingreso') {
        balance += amount;
    } else {
        balance -= amount;
    }

    balanceElement.textContent = balance.toFixed(2);
    actualizarBalanceEquivalente(balance.toFixed(2));
    balanceElement.className = balance >= 0 ? 'positive' : 'negative';

    // Guarda el balance en localStorage
    localStorage.setItem('balance', balance.toFixed(2));
}

// Función para mostrar la equivalencia del balance en dólares y euros
function actualizarBalanceEquivalente(balanceARS) {
    var balanceUSD = balanceARS / conversionRates.dolar;
    var balanceEUR = balanceARS / conversionRates.euro;
    document.getElementById('balance-USD').textContent = balanceUSD.toFixed(2);
    document.getElementById('balance-EUR').textContent = balanceEUR.toFixed(2);
}

// Función para guardar el estado en localStorage
function guardarEstado() {
    localStorage.setItem('transactionList', document.getElementById('transactionList').innerHTML);
}

// Evento click del botón Agregar
document.getElementById('addTransactionBtn').addEventListener('click', agregarElemento);

// Evento click para eliminar transacción
document.getElementById('transactionList').addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-btn') || event.target.parentElement.classList.contains('delete-btn')) {
        var transactionElement = event.target.closest('.transaction');
        var amount = parseFloat(transactionElement.children[2].textContent);
        var type = transactionElement.classList.contains('ingreso') ? 'ingreso' : 'gasto';
        
        // Mostrar alerta SweetAlert2 para confirmar la eliminación
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Si se confirma la eliminación
                transactionElement.remove();
                actualizarBalance(type === 'ingreso' ? 'gasto' : 'ingreso', amount);
                guardarEstado();
                showPopup('Se eliminó un ' + (type === 'ingreso' ? 'ingreso' : 'gasto'), 'remove');
            }
        });
    }
});

// Función para mostrar el mensaje emergente
function showPopup(message, type) {
    var alerts = document.getElementById('alerts');
    alerts.textContent = message;
    alerts.className = 'alert-' + type;
    alerts.style.display = 'block';

    // Ocultar el mensaje después de 2 segundos
    setTimeout(function () {
        alerts.style.display = 'none';
    }, 2000);
}

// Llamada a la función para cargar el JSON al cargar la página
window.onload = function () {
    loadJSON(function (data) {
        conversionRates = data;
    });
};