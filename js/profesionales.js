const API_URL = "http://localhost:3000/profesionales";

const formProfesional = document.getElementById("formProfesional");
const contenedorProfesionales = document.getElementById("contenedorProfesionales");

const profesionalId = document.getElementById("profesionalId");
const nombreProfesional = document.getElementById("nombreProfesional");
const dniProfesional = document.getElementById("dniProfesional");
const especialidadProfesional = document.getElementById("especialidadProfesional");
const matriculaProfesional = document.getElementById("matriculaProfesional");
const telefonoProfesional = document.getElementById("telefonoProfesional");
const emailProfesional = document.getElementById("emailProfesional");
const diasAtencionProfesional = document.getElementById("diasAtencionProfesional");



document.addEventListener("DOMContentLoaded", () => {
    obtenerProfesionales();
});

async function obtenerProfesionales() {
    try {
        const response = await axios.get(API_URL);
        renderizarProfesionales(response.data);
    } catch (error) {
        console.error("Error al obtener profesionales:", error);
    }
}


function renderizarProfesionales(profesionales) {

    contenedorProfesionales.innerHTML = "";

    profesionales.forEach((profesional) => {

        contenedorProfesionales.innerHTML += `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm">

                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">${profesional.nombre}</h5>
                    </div>

                    <div class="card-body">

                        <p><strong>DNI:</strong> ${profesional.dni}</p>
                        <p><strong>Especialidad:</strong> ${profesional.especialidad}</p>
                        <p><strong>Matrícula:</strong> ${profesional.matricula}</p>
                        <p><strong>Teléfono:</strong> ${profesional.telefono}</p>

                        <p>
                            <strong>Email:</strong>
                            <a href="mailto:${profesional.email}" target="_blank">
                                ${profesional.email}
                            </a>
                        </p>

                        <p><strong>Días de atención:</strong> ${profesional.diasAtencion}</p>

                    </div>

                    <div class="card-footer d-flex justify-content-between">

                        <button
                            class="btn btn-warning btn-sm"
                            onclick="cargarProfesional('${profesional.id}')"
                        >
                            Editar
                        </button>

                        <button
                            class="btn btn-danger btn-sm"
                            onclick="eliminarProfesional('${profesional.id}')"
                        >
                            Eliminar
                        </button>

                    </div>

                </div>
            </div>
        `;
    });
}


formProfesional.addEventListener("submit", async (e) => {
    e.preventDefault();

    const profesional = {
        nombre: nombreProfesional.value.trim(),
        dni: dniProfesional.value.trim(),
        especialidad: especialidadProfesional.value.trim(),
        matricula: matriculaProfesional.value.trim(),
        telefono: telefonoProfesional.value.trim(),
        email: emailProfesional.value.trim(),
        diasAtencion: diasAtencionProfesional.value.trim()
    };

    try {
        if (profesionalId.value) {

            await axios.put(`${API_URL}/${profesionalId.value}`, profesional);

        } else {

   
            await axios.post(API_URL, profesional);
        }

        limpiarFormulario();
        obtenerProfesionales();

    } catch (error) {
        console.error("Error al guardar profesional:", error);
    }
});




async function cargarProfesional(id) {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        const profesional = response.data;

        profesionalId.value = profesional.id;
        nombreProfesional.value = profesional.nombre;
        dniProfesional.value = profesional.dni;
        especialidadProfesional.value = profesional.especialidad;
        matriculaProfesional.value = profesional.matricula;
        telefonoProfesional.value = profesional.telefono;
        emailProfesional.value = profesional.email;
        diasAtencionProfesional.value = profesional.diasAtencion;

        window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {
        console.error("Error al cargar profesional:", error);
    }
}



async function eliminarProfesional(id) {

    const confirmar = confirm("¿Seguro que deseas eliminar este profesional?");

    if (!confirmar) return;

    try {
        await axios.delete(`${API_URL}/${id}`);
        obtenerProfesionales();

    } catch (error) {
        console.error("Error al eliminar profesional:", error);
    }
}


function limpiarFormulario() {
    formProfesional.reset();
    profesionalId.value = "";
}