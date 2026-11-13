const listaactividades = document.getElementById("listaactividades");
let esAdministrador = false;
actividades = [];

async function solicitarApi(metodo, datos) {
    const opciones = {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    }

    if (datos){
        opciones.body = JSON.stringify(datos);
    }
    const respuesta = await fetch("../Modelos/gestionarActividades.php", opciones);
    const resultado = await respuesta.json();
    if (respuesta.status === 4001) {
        window.location.href = "../Vista/login.html";
    }
    if (!respuesta.ok) {
        throw new Error(resultado.error || "Error en la solicitud");
    }
    return resultado;
}

async function cargarActividades() {
    try{
        const resultado = await solicitarApi("GET");
        esAdministrador = resultado.rol === "Admin";
        // configurarAcciones();
        actividades = resultado.actividades;
        mostrarActividades();

    } catch (error){
        alert ("Error al cargar las actividades: " + error.message);
    }

    function mostrarActividades() {
        listaactividades.replaceChildren();
        if (actividades.length === 0) {
            const fila= document.createElement("tr");
            const celda = document.createElement("td");
            celda.colSpan = esAdministrador ? 5 : 4;
            celda.className="text-center py-4 text-muted";
            celda.textContent = "No hay actividades disponibles.";
            fila.append(celda);
            listaactividades.append(fila);
            return;
        }
        actividades.forEach((actividad)=>{
            const fila= document.createElement("tr");
            fila.append(
            crearCelda (actividad.nombreActividad),
            crearCelda (actividad.fechaEvento),
            crearCelda (actividad.municipio),
            crearCelda(actividad.totalRecaudado===null?"Pendiente": Number(actividad.totalRecaudado).toLocaleString("es-CO",{style: "currency", currency:"COP"})),
        );
        if(esAdministrador){
            const acciones = document.createElement("td");
            acciones.className="text-nowrap";
            const botonEditar = document.createElement("button");
            botonEditar.type="button";
            botonEditar.className = "btn btn-sm btn-outline-primary me-2";
            botonEditar.innerHTML='<i class="bi bi-pencil-square"></i>';
            botonEditar.addEventListener("click",()=>abrirEdicion(actividad));

            const botonEliminar = document.createElement("button");
            botonEliminar.type="button";
            botonEliminar.className = "btn btn-sm btn-outline-danger";
            botonEliminar.innerHTML='<i class="bi bi-trash"></i>';
            botonEliminar.addEventListener("click",()=>eliminarActividad(actividad));

            acciones.append(botonEditar,botonEliminar);
            fila.append(acciones);
        }
        listaactividades.append(fila);
        });
    } 
    function crearCelda(texto){
        const celda = document.createElement("td");
        celda.textContent=texto;
        return celda;
    }  
}
cargarActividades();