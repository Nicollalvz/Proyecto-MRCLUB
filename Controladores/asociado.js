const formulario = document.querySelector('#formRegistroAsociado');

formulario.addEventListener('submit', async function (e) {
    e.preventDefault();

    const botonGuardar = document.querySelector('button[type="submit"]');
    const asociado = Object.fromEntries(new FormData(formulario).entries);


    if(asociado.contrasena !== asociado.confirmarContrasena) {
        document.getElementById('mensajeRegistro').textContent = "Las contraseñas no coinciden.";
    }
    delete asociado.confirmarContrasena; // Eliminar la propiedad confirmarContrasena antes de enviar los datos 

    botonGuardar.disabled = true;

    try {
        document.getElementById('mensajeRegistro').textContent = "Guardando...";
        document.getElementById('mensajeRegistro').dataset.tipo = '';

        const respuesta = await fetch(formulario.action, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(asociado) });
        const resultado = await respuesta.json();
        
        document.getElementById('mensajeRegistro').textContent = resultado.mensaje;
        if (resultado.ok && resultado.success) {
            formulario.reset();
        }
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        document.getElementById('mensajeRegistro').textContent = "Ocurrió un error al enviar el formulario. Por favor, inténtelo de nuevo.";
    } finally {
        botonGuardar.disabled = false;
    }
});
