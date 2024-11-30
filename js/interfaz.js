document.addEventListener('DOMContentLoaded', mostrarTareas);

let botonAgregar = document.getElementById('agregarTareaNueva');
let botonTareaDiaria = document.getElementById('tareaDiaria');

botonAgregar.onclick = async () => {
    const { value: valoresFormulario } = await Swal.fire({
        title: "Agregar nueva tarea",
        html: `
            <input id="swal-input1" class="swal2-input" placeholder="Título de la tarea">
            <textarea id="swal-input2" class="swal2-input" placeholder="Descripción de la tarea"></textarea>
        `,
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
                document.getElementById("swal-input2").value
            ];
        }
    });
    
    if (valoresFormulario) {
        const [titulo, descripcion] = valoresFormulario;

        if (!titulo || !descripcion) {
            Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
            return;
        }

        const duplicado = tareas.some(tarea => tarea.titulo === titulo);

        if (!duplicado) {
            agregarTarea(titulo, descripcion);
            mostrarTareas();
            Swal.fire('Éxito', 'Tarea agregada con éxito', 'success');
        } else {
            Swal.fire('Error', 'Ya existe una tarea con ese título.', 'error');
        }
    }
};

botonTareaDiaria.onclick = () => {
    try {
        fetch("./db/data.json")
            .then(response => response.json())
            .then(data => {
                const tareaSeleccionada = data.find(t => t.id > ultimoIdTarea);

                if (tareaSeleccionada) {
                    const titulo = tareaSeleccionada.titulo;
                    const descripcion = tareaSeleccionada.descripcion;

                    agregarTarea(titulo, descripcion);
                    ultimoIdTarea = tareaSeleccionada.id;
                    mostrarTareas();

                    Swal.fire('Éxito', 'Tarea diaria agregada con éxito', 'success');
                } else {
                    Swal.fire('Error', 'Todas las tareas diarias ya fueron agregadas.', 'error');
                }
            })
            .catch(error => {
                Swal.fire('Error', 'No se pudo cargar la tarea diaria.', 'error');
            });
    } catch (error) {
        Swal.fire('Error', 'Ocurrió un problema al intentar agregar la tarea diaria.', 'error');
    }
};

function mostrarTareas() {
    const contenedorTareasPendientes = document.getElementById("cont-tareas");
    const contenedorTareasProceso = document.getElementById("cont-proceso");
    const contenedorTareasCompletadas = document.getElementById("cont-completadas");

    contenedorTareasPendientes.innerHTML = '';
    contenedorTareasProceso.innerHTML = '';
    contenedorTareasCompletadas.innerHTML = '';

    tareas.forEach(tarea => {
        let contenedor = document.createElement("div");
        contenedor.className = "card";
        contenedor.innerHTML = `
            <div class="tituloyContenido">
                <h3>${tarea.titulo}</h3>
                <p>${tarea.contenido}</p>
            </div>
            <div class="botones-card">
                <button class="btn-regresar">⬅️</button>
                <button class="btn-avanzar">➡️</button>
                <button class="btn-eliminar">🗑️</button>
            </div>
        `;

        contenedor.querySelector('.btn-regresar').onclick = () => {
            cambiarEstado(tarea.id, 'regresar');
            mostrarTareas();
        };
        contenedor.querySelector('.btn-avanzar').onclick = () => {
            cambiarEstado(tarea.id, 'avanzar');
            mostrarTareas();
        };
        contenedor.querySelector('.btn-eliminar').onclick = () => {
            Swal.fire({
                title: "¿Seguro que quiere eliminar esta tarea?",
                showCancelButton: true,
                confirmButtonText: "Eliminar",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    eliminarTarea(tarea.id);
                    mostrarTareas();
                }
            });
        };

        if (tarea.estado === 'pendiente') {
            contenedorTareasPendientes.appendChild(contenedor);
        } else if (tarea.estado === 'en proceso') {
            contenedorTareasProceso.appendChild(contenedor);
        } else if (tarea.estado === 'completado') {
            contenedorTareasCompletadas.appendChild(contenedor);
        }
    });
}

