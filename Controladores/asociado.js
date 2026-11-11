const formregistro = document.getElementById('formregistro');

formregistro.addEventListener('submit', async function (e) {
    e.preventDefault();
    const botonGuardar = formregistro.querySelector('button[type="submit"]');
    const asociado = Object.fromEntries(new FormData(formregistro).entries());
    
    if(asociado.contraseña !== asociado.confirmarContraseña) {
        document.getElementById("mensajeRegistro").textContent =
        "Las contraseñas no coinciden.";
        return;
    }

    delete asociado.confirmarContraseña; // Eliminar el campo de confirmación de contraseña antes de enviar los datos

    botonGuardar.disabled = true; // Deshabilitar el botón de envío
    document.getElementById('mensajeRegistro').textContent = 'Guardando...';
    document.getElementById('mensajeRegistro').dataset.tipo = '';

    alert ("Datos a enviar: " + JSON.stringify(asociado)); // Mostrar los datos en un alert
    try {

        const respuesta = await fetch(formregistro.action,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(asociado)});
        
        const resultado = await respuesta.json();
        
        document.getElementById('mensajeRegistro').textContent = resultado.mensaje;

        if (respuesta.ok && resultado.success) {
            formregistro.reset(); // Limpiar el formulario si la respuesta es exitosa
        }

    }catch (error) {
        console.error('Error:', error);
        document.getElementById('mensajeRegistro').textContent = 'Error al guardar los datos.';
    } finally {
        botonGuardar.disabled = false; // Habilitar el botón de envío nuevamente
    }

});