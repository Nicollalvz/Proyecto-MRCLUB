const listaactividades = document.getElementById("listaactividades");
async function solicitarApi(metodo, datos) {
    const opciones = {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    }

    if (datos){
        opciones.body = JSON.stringify(datos);
    }
    const respuesta = await fetch("../Modelos/actividades.php", opciones);
    const resultado = await respuesta.json();
    if (respuesta.status === 4001) {
        window.location.href = "../Vista/login.html";
    }
    if (!respuesta.ok) {
        throw new Error(resultado.error || "Error en la solicitud");
    }
    return resultado;
}