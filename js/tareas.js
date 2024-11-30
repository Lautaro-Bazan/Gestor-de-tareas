const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
let ultimoIdTarea = JSON.parse(localStorage.getItem('ultimoIdTarea')) || 0;

class Tarea {
    constructor(titulo, contenido, estado, id) {
        this.titulo = titulo;
        this.contenido = contenido;
        this.estado = estado;
        this.id = id;
    }
}

function agregarTarea(titulo, descripcion) {
    const nuevaTarea = new Tarea(titulo, descripcion, "pendiente", tareas.length + 1);
    tareas.push(nuevaTarea);
    guardarTareasEnLocalStorage();
}

function cambiarEstado(id, accion) {
    const tarea = tareas.find(tarea => tarea.id === id);
    if (tarea) {
        if (accion === 'regresar') {
            if (tarea.estado === 'completado') {
                tarea.estado = 'en proceso';
            } else if (tarea.estado === 'en proceso') {
                tarea.estado = 'pendiente';
            }
        } else if (accion === 'avanzar') {
            if (tarea.estado === 'pendiente') {
                tarea.estado = 'en proceso';
            } else if (tarea.estado === 'en proceso') {
                tarea.estado = 'completado';
            }
        }
        guardarTareasEnLocalStorage();
    }
}

function eliminarTarea(id) {
    const index = tareas.findIndex(tarea => tarea.id === id);
    if (index !== -1) {
        tareas.splice(index, 1);
        guardarTareasEnLocalStorage();
    }
}

function guardarTareasEnLocalStorage() {
    localStorage.setItem('tareas', JSON.stringify(tareas));
    localStorage.setItem('ultimoIdTarea', JSON.stringify(ultimoIdTarea));
}
