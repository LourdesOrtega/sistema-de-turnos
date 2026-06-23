const API_URL = "http://localhost:3000";

const selectPaciente = document.getElementById("paciente");
const selectProfesional = document.getElementById("profesional");
const btnGuardarTurno = document.getElementById("btnGuardarTurno");
const formTurnos = document.getElementById("formTurno");
const selectObraSocial = document.getElementById("obrasSociales");
const inputFecha = document.getElementById("fecha");
const inputHora = document.getElementById("hora");
const inputObservacion = document.getElementById("observacion");


const cargarPacientes = async  () => {

    try {

        const response = await axios.get(`${API_URL}/pacientes`);
        const pacientes = response.data;

        selectPaciente.innerHTML = `
        <option value ""  selected disabled hidden> Seleccioná un paciente </option>
        `;

        pacientes.forEach(paciente => {
            selectPaciente.innerHTML += `
            <option value = "${paciente.id}">
            ${paciente.nombre}
            </option>
            `;
        });

    } catch (error) {

        console.log.error("Error al cargar paciente: ", error)

    }

};


const cargarProfesionales = async () => {
    try {
        const response = await axios.get(`${API_URL}/profesionales`);
        const profesionales = response.data;

        selectProfesional.innerHTML = `
        <option value ""  selected disabled hidden> Seleccioná un profesional </option>
        `;

        profesionales.forEach(profesional => {
            selectProfesional.innerHTML += `
          <option value = "${profesional.id}">
            ${profesional.nombre}
            </option>
            `;
        });

        } catch (error) {
            console.error("Error al cargar profesionales", error);
        }
    };

btnGuardarTurno.addEventListener("click", async () => {

    if (selectPaciente.value === "" || selectProfesional.value === "" || inputFecha.value === "" || inputHora.value === "") {
        alert("Completá paciente, profesional, fecha y hora.");
        return;
    }

    const turno = {
     
        pacienteId: selectPaciente.value,
        profesionalId: selectProfesional.value,
        obraSocial: selectObraSocial.value,
        fecha: inputFecha.value,
        hora: inputHora.value,
        estado: "Pendiente",
        observacion: inputObservacion.value
    };

    try {

        await axios.post(`${API_URL}/turnos`, turno);

        alert("Turno realizado con éxito");

        formTurnos.reset();

    } catch (error) {

        console.error("Error al guardar turno:", error);

    }

});

cargarPacientes();
cargarProfesionales();