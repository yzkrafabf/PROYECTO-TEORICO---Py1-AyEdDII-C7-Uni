// Variables
const form = document.getElementById('appointmentForm');
const availableTimesContainer = document.getElementById('availableTimesContainer');
const appointmentReason = document.getElementById('appointmentReason');
const otherReason = document.getElementById('otherReason');
const otherReasonLabel = document.getElementById('otherReasonLabel');

// Horarios disponibles (de 9 AM a 5 PM, cada cita dura 1 hora)
const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00'
];

// Inicializa la lista de horarios disponibles por fecha
function initializeAvailableTimes(date) {
    const dateContainer = document.createElement('div');
    dateContainer.classList.add('date-container');
    
    const dateHeader = document.createElement('h3');
    dateHeader.textContent = date;
    dateContainer.appendChild(dateHeader);

    const availableTimesList = document.createElement('ul');

    timeSlots.forEach(slot => {
        const listItem = document.createElement('li');
        listItem.textContent = slot; // Muestra el horario
        listItem.dataset.time = slot; // Almacena el horario en un atributo
        listItem.classList.add('available'); // Clase para estilos
        availableTimesList.appendChild(listItem);
    });

    dateContainer.appendChild(availableTimesList);
    availableTimesContainer.appendChild(dateContainer);
}

// Evento para mostrar/ocultar el campo de especificación
appointmentReason.addEventListener('change', function() {
    if (appointmentReason.value === 'Otro') {
        otherReason.style.display = 'block';
        otherReasonLabel.style.display = 'block';
    } else {
        otherReason.style.display = 'none';
        otherReasonLabel.style.display = 'none';
        otherReason.value = ''; // Limpiar el campo si no es "Otro"
    }
});

// Función para agregar citas
form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const patientName = document.getElementById('patientName').value;
    const patientPhone = document.getElementById('patientPhone').value;
    const appointmentTime = document.getElementById('appointmentTime').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
    let appointmentReasonValue = appointmentReason.value;

    // Captura el motivo adicional si se seleccionó "Otro"
    if (appointmentReasonValue === 'Otro') {
        appointmentReasonValue = otherReason.value || 'No especificado'; // Usa "No especificado" si está vacío
    }

    if (patientName && patientPhone && appointmentTime && appointmentDate && appointmentReasonValue) {
        if (!isTimeOccupied(appointmentDate, appointmentTime)) {
            markTimeAsOccupied(appointmentDate, appointmentTime, patientName, patientPhone, appointmentReasonValue); // Marcar el horario como ocupado
            form.reset(); // Reiniciar el formulario
        } else {
            alert('Este horario ya está ocupado. Por favor, elige otro.');
        }
    } else {
        alert('Por favor, complete todos los campos.');
    }
});

// Verifica si el horario está ocupado
function isTimeOccupied(date, time) {
    const dateContainers = availableTimesContainer.getElementsByClassName('date-container');

    for (let i = 0; i < dateContainers.length; i++) {
        const dateHeader = dateContainers[i].querySelector('h3');

        if (dateHeader.textContent === date) {
            const listItems = dateContainers[i].getElementsByTagName('li');

            for (let j = 0; j < listItems.length; j++) {
                if (listItems[j].dataset.time === time && listItems[j].classList.contains('occupied')) {
                    return true; // El horario está ocupado
                }
            }
        }
    }
    return false; // El horario está libre
}

// Función para marcar el horario como ocupado
function markTimeAsOccupied(date, time, patientName, patientPhone, reason) {
    const dateContainers = availableTimesContainer.getElementsByClassName('date-container');
    
    for (let i = 0; i < dateContainers.length; i++) {
        const dateHeader = dateContainers[i].querySelector('h3');

        if (dateHeader.textContent === date) {
            const listItems = dateContainers[i].getElementsByTagName('li');

            for (let j = 0; j < listItems.length; j++) {
                if (listItems[j].dataset.time === time) {
                    listItems[j].textContent += ` - Ocupado (Paciente: ${patientName}, Tel: ${patientPhone}, Motivo: ${reason})`; // Marcar como ocupado
                    listItems[j].classList.remove('available'); // Quitar la clase de disponible
                    listItems[j].classList.add('occupied'); // Agregar clase de ocupado
                    listItems[j].appendChild(createCancelButton(date, time, patientName, patientPhone, reason)); // Agregar botón de cancelar
                    break;
                }
            }
            break;
        }
    }
}

// Función para crear el botón de cancelar
function createCancelButton(date, time, patientName, patientPhone, reason) {
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancelar';
    cancelButton.classList.add('cancel');
    cancelButton.addEventListener('click', () => cancelAppointment(date, time, patientName, patientPhone, reason));
    return cancelButton;
}

// Función para cancelar la cita
function cancelAppointment(date, time, patientName, patientPhone, reason) {
    const code = prompt('Ingrese el código para cancelar la cita (****):');
    if (code === '1234') {
        const dateContainers = availableTimesContainer.getElementsByClassName('date-container');

        for (let i = 0; i < dateContainers.length; i++) {
            const dateHeader = dateContainers[i].querySelector('h3');

            if (dateHeader.textContent === date) {
                const listItems = dateContainers[i].getElementsByTagName('li');

                for (let j = 0; j < listItems.length; j++) {
                    if (listItems[j].dataset.time === time && listItems[j].textContent.includes(patientName)) {
                        listItems[j].textContent = listItems[j].dataset.time; // Restablecer el texto
                        listItems[j].classList.remove('occupied'); // Quitar clase de ocupado
                        listItems[j].classList.add('available'); // Agregar clase de disponible
                        listItems[j].appendChild(createAvailableText()); // Agregar texto de disponibilidad
                        break;
                    }
                }
                break;
            }
        }
    } else {
        alert('Código incorrecto. No se pudo cancelar la cita.');
    }
}

// Crear texto de disponibilidad
function createAvailableText() {
    const availableText = document.createElement('span');
    availableText.textContent = ' - Disponible';
    return availableText;
}

// Inicializar la lista de horarios disponibles al cargar
document.getElementById('appointmentDate').addEventListener('change', function() {
    const selectedDate = this.value;
    initializeAvailableTimes(selectedDate);
});
