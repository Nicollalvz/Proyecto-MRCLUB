const formLogin = document.getElementById('formLogin') 
formLogin.addEventListener('submit', async function (e) {
    e.preventDefault();

    const boton = formLogin.querySelector('button[type="submit"]');
    const mensaje = document.getElementById('mensajeLogin');
    
    boton.disabled = true;
    
    try {
        const respuesta = await fetch(formLogin.action, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.fromEntries(new FormData(formLogin).entries()),
        ),
        });
        
        const resultado = await respuesta.json();

        if(!resultado.success) {
            mensaje.textContent = "No fue posible iniciar sesión. Verifica tus credenciales.";
            boton.disabled = false;
            return;
        }
        localStorage.clear();

        localStorage.setItem('logeado', true);
        localStorage.setItem('rol', resultado.rol);
        localStorage.setItem('nombre', resultado.nombre);

        window.location.href = '../Vista/dashboard.html';

        }catch(error){
            console.error('Error al iniciar sesión:', error);
            mensaje.textContent = 
            "Ocurrió un error al iniciar sesión. Intenta nuevamente.";
        } finally {
            boton.disabled = false;
        }
});