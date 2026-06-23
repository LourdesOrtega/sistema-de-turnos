const API_URL = "http://localhost:3000";

const formPaciente = document.getElementById("formPaciente");
const contenedorPacientes = document.getElementById("contenedorPacientes");

async function obtenerPacientes() {
    const response = await axios.get(`${API_URL}/pacientes`);
    const pacientes = response.data;
    renderizarPacientes(pacientes);
}

function renderizarPacientes(pacientes) {
    contenedorPacientes.innerHTML = "";

    pacientes.forEach(function (paciente) {
        contenedorPacientes.innerHTML += `
            <div class="col-md-4">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5>${paciente.nombre}</h5>
                        <p><strong>DNI:</strong> ${paciente.dni}</p>
                        <p><strong>Fecha nacimiento:</strong> ${paciente.fechaNacimiento}</p>
                        <p><strong>Teléfono:</strong> ${paciente.telefono}</p>
                        <p><strong>Obra social:</strong> ${paciente.obraSocial}</p>

                        <button class="btn btn-sm btn-outline-primary" onclick="editarPaciente('${paciente.id}')">
                            Editar
                        </button>

                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarPaciente('${paciente.id}')">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

formPaciente.addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = document.getElementById("pacienteId").value;

    const paciente = {
        nombre: document.getElementById("nombrePaciente").value,
        dni: document.getElementById("dniPaciente").value,
        fechaNacimiento: document.getElementById("fechaNacimientoPaciente").value,
        telefono: document.getElementById("telefonoPaciente").value,
        obraSocial: document.getElementById("obraSocialPaciente").value
    };

    if (id === "") {
        await axios.post(`${API_URL}/pacientes`, paciente);
    } else {
        await axios.patch(`${API_URL}/pacientes/${id}`, paciente);
    }

    formPaciente.reset();
    document.getElementById("pacienteId").value = "";
    obtenerPacientes();
});

async function editarPaciente(id) {
    const response = await axios.get(`${API_URL}/pacientes/${id}`);
    const paciente = response.data;

    document.getElementById("pacienteId").value = paciente.id;
    document.getElementById("nombrePaciente").value = paciente.nombre;
    document.getElementById("dniPaciente").value = paciente.dni;
    document.getElementById("fechaNacimientoPaciente").value = paciente.fechaNacimiento;
    document.getElementById("telefonoPaciente").value = paciente.telefono;
    document.getElementById("obraSocialPaciente").value = paciente.obraSocial;
}

async function eliminarPaciente(id) {
    const confirmar = confirm("¿Seguro que querés eliminar este paciente?");

    if (confirmar) {
        const responseTurnos = await axios.get(`${API_URL}/turnos?pacienteId=${id}`);
        const turnos = responseTurnos.data;

        for (const turno of turnos) {
            await axios.delete(`${API_URL}/turnos/${turno.id}`);
        }

        await axios.delete(`${API_URL}/pacientes/${id}`);
        obtenerPacientes();
    }
}

obtenerPacientes();