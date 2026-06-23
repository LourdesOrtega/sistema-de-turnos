const API_URL = "http://localhost:3000";
const contenedorTurnos = document.getElementById("contenedorTurnos");
const formEditarTurno = document.getElementById("formEditarTurno");
const turnoIdEditar = document.getElementById("turnoIdEditar");
const profesionalEditar = document.getElementById("profesionalEditar");
const estadoEditar = document.getElementById("estadoEditar");
const fechaEditar = document.getElementById("fechaEditar");
const horaEditar = document.getElementById("horaEditar");
const btnGuardarEdicion = document.getElementById("btnGuardarEdicion");
const seccionEditarTurno = document.getElementById("seccionEditarTurno");
const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");


btnCancelarEdicion.addEventListener("click", () => {

    formEditarTurno.reset();
    turnoIdEditar.value = "";
    seccionEditarTurno.classList.add("d-none");

});

const cargarProfesionales = async () => {

    try {
        const response = await axios.get(`${API_URL}/profesionales`);
        const profesionales = response.data;

        profesionalEditar.innerHTML = `
            <option value="" selected disabled hidden>
                Seleccioná un profesional
            </option>
        `;

        profesionales.forEach(profesional => {
            profesionalEditar.innerHTML += `
                <option value="${profesional.id}">
                    ${profesional.nombre}
                </option>
            `;
        });

    } catch (error) {
        console.error("Error al cargar profesionales:", error);
    }

};


const obtenerTurnos = async () => {

    try {
        const responseTurnos = await axios.get(`${API_URL}/turnos`);
        const turnos = responseTurnos.data;
        const responsePacientes = await axios.get(`${API_URL}/pacientes`);
        const pacientes = responsePacientes.data;
        const responseProfesionales = await axios.get(`${API_URL}/profesionales`);
        const profesionales = responseProfesionales.data;

        contenedorTurnos.innerHTML = "";

        turnos.forEach(turno => {

            const paciente = pacientes.find(paciente => paciente.id === turno.pacienteId);
            const profesional = profesionales.find(profesional => profesional.id === turno.profesionalId);

            let claseEstado = "";

            if (turno.estado === "Pendiente") {
                claseEstado = "text-bg-warning";
            }

            if (turno.estado === "Confirmado") {
                claseEstado = "text-bg-success";
            }

            if (turno.estado === "Cancelado") {
                claseEstado = "text-bg-danger";
            }

            contenedorTurnos.innerHTML += `
                <tr>
                    <td>#${turno.id}</td>

                    <td>
                        ${paciente ? paciente.nombre : "Paciente eliminado"}
                    </td>

                    <td>
                        ${profesional ? profesional.nombre : "Profesional eliminado"}
                    </td>

                    <td>${turno.fecha}</td>

                    <td>${turno.hora}</td>

                    <td>
                        <span class="badge ${claseEstado}">
                            ${turno.estado}
                        </span>
                    </td>

                    <td class="text-center">

                        <button
                            type="button"
                            class="btn btn-sm btn-outline-primary"
                            onclick="editarTurno('${turno.id}')"
                        >
                            <i class="bi bi-pencil"></i>
                        </button>

                        <button
                            type="button"
                            class="btn btn-sm btn-outline-danger"
                            onclick="eliminarTurno('${turno.id}')"
                        >
                            <i class="bi bi-x-circle"></i>
                        </button>

                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error al obtener turnos:", error);
    }

};

const eliminarTurno = async (id) => {

    const confirmar = confirm("¿Seguro que querés eliminar este turno?");

    if (confirmar) {

        try {
            await axios.delete(`${API_URL}/turnos/${id}`);

            obtenerTurnos();

        } catch (error) {
            console.error("Error al eliminar turno:", error);
        }

    }

};


const editarTurno = async (id) => {

    try {
        const response = await axios.get(`${API_URL}/turnos/${id}`);
        const turno = response.data;

        turnoIdEditar.value = turno.id;
        profesionalEditar.value = turno.profesionalId;
        estadoEditar.value = turno.estado;
        fechaEditar.value = turno.fecha;
        horaEditar.value = turno.hora;
        seccionEditarTurno.classList.remove("d-none");

    } catch (error) {
        console.error("Error al cargar turno:", error);
    }

};


btnGuardarEdicion.addEventListener("click", async () => {

    const turno = {
        profesionalId: profesionalEditar.value,
        fecha: fechaEditar.value,
        hora: horaEditar.value,
        estado: estadoEditar.value
    };

    try {
        await axios.patch(`${API_URL}/turnos/${turnoIdEditar.value}`, turno);

        alert("Turno editado con éxito");
        formEditarTurno.reset();
        turnoIdEditar.value = "";
        seccionEditarTurno.classList.add("d-none");

        obtenerTurnos();

    } catch (error) {
        console.error("Error al editar turno:", error);
    }

});

window.editarTurno = editarTurno;
window.eliminarTurno = eliminarTurno;

cargarProfesionales();
obtenerTurnos();