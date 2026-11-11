document.addEventListener('DOMContentLoaded', () => {

    alert("Bienvenido al panel de control. Por favor, asegúrate de cerrar sesión al finalizar tu trabajo para proteger tu cuenta.");
    // document.getElementById('btnCerrarSesion').addEventListener('click', cerrarSesion);

    const logueado = localStorage.getItem('logeado');

    if (logueado !== 'true') {
        window.location.href = '../Vista/login.html';
        return;
    }

    const nombre = localStorage.getItem('nombre');
    const rol = localStorage.getItem('rol');

    document.getElementById('nombreUsuario').textContent = nombre;

    if (rol === 'admin') {
        document.getElementById('tarjetasAdministrador').classList.remove('d-none');
        document.getElementById('tarjetasAsociado').classList.add('d-none');
    } else {
        document.getElementById('tarjetasAdministrador').classList.add('d-none');
        document.getElementById('tarjetasAsociado').classList.remove('d-none');
    }
});

async function cerrarSesion() {
    try{
    const respuesta =await fetch("../Modelos/cerrarSesion.php", {method: "POST"});
    if (!respuesta.ok) {
        throw new Error("Error al cerrar sesión");
    }
        localStorage.clear();
        window.location.href = "../Vista/login.html";

    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
}