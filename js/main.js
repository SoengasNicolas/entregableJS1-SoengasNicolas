// Estructura de datos para almacenar gastos e ingresos con detalles
let transacciones = [];

// Función para agregar gasto o ingreso con detalle
function agregarTransaccion(tipo) {
  const monto = parseFloat(prompt(`Ingrese el monto del ${tipo}:`));
  if (isNaN(monto)) {
    alert('Por favor, ingrese un monto válido.');
    return;
  }

  const detalle = prompt(`Ingrese el detalle del ${tipo}:`);
  
  // Almacenar la transacción en el array
  transacciones.push({ tipo, monto, detalle });

  alert(`${tipo} de ${monto} registrado con detalle: ${detalle}`);
}

// Función para mostrar el estado financiero
function mostrarEstadoFinanciero() {
  let gastos = 0;
  let ingresos = 0;

  // Calcular gastos e ingresos totales
  transacciones.forEach(transaccion => {
    if (transaccion.tipo === 'gasto') {
      gastos += transaccion.monto;
    } else if (transaccion.tipo === 'ingreso') {
      ingresos += transaccion.monto;
    }
  });

  const diferencia = ingresos - gastos;

  // Mostrar estado financiero
  alert(`Gastos totales: ${gastos}\nIngresos totales: ${ingresos}\nDiferencia: ${diferencia}`);
}

// Interfaz básica
while (true) {
  const opcion = prompt('Seleccione una opcion:\n1. Agregar gasto\n2. Agregar ingreso\n3. Ver estado financiero\n4. Salir');
  
  switch (opcion) {
    case '1':
      agregarTransaccion('gasto');
      break;
    case '2':
      agregarTransaccion('ingreso');
      break;
    case '3':
      mostrarEstadoFinanciero();
      break;
    case '4':
      alert('Gracias por usar el simulador.');
      // A futuro agregar las funciones aca para guardar los datos
      break;
    default:
      alert('Opcion no valida. Por favor, seleccione una opcion valida en base al numero de opcion.');
      break;
  }

  if (opcion === '4') {
    break;
  }
}