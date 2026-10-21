
document.addEventListener('DOMContentLoaded', function () {

    // ELEMENTOS DEL FORMULARIO
    const login = document.getElementById('formLogin');
    const registro = document.getElementById('formRegistro');

    const tabLogin = document.getElementById('tabLogin');
    const tabRegistro = document.getElementById('tabRegistro');

    const mensaje = document.getElementById('mensaje');

    const botonesRol = document.querySelectorAll('.rol');
    const descripcionRol = document.getElementById('descripcionRol');

    // DESCRIPCIONES DE LOS ROLES
    const descripciones = {
        administrador: 'Administra los usuarios y la configuración general de la plataforma.',
        funcionario: 'Participa en la gestión y seguimiento de los emprendedores.',
        coordinador: 'Coordina los programas de formación y las actividades.',
        instructor: 'Gestiona la formación y el acompañamiento a los emprendedores.',
        emprendedor: 'Accede a los cursos y herramientas para fortalecer tu negocio.'
    };

    let rolSeleccionado = null;

    // CAMBIAR ENTRE FORMULARIOS
    function mostrarFormulario(tipo) {

        const esLogin = tipo === 'login';

        login.hidden = !esLogin;
        registro.hidden = esLogin;

        tabLogin.classList.toggle('activa', esLogin);
        tabRegistro.classList.toggle('activa', !esLogin);

        mensaje.textContent = '';
    }

    // PESTAÑAS SUPERIORES
    tabLogin.addEventListener('click', function () {
        mostrarFormulario('login');
    });

    tabRegistro.addEventListener('click', function () {
        mostrarFormulario('registro');
    });

    // ENLACES ENTRE FORMULARIOS
    document.getElementById('irRegistro')
        .addEventListener('click', function () {
            mostrarFormulario('registro');
        });

    document.getElementById('irLogin')
        .addEventListener('click', function () {
            mostrarFormulario('login');
        });

    // SELECCIÓN VISUAL DE ROLES
    botonesRol.forEach(function (boton) {

        boton.addEventListener('click', function () {

            botonesRol.forEach(function (rol) {
                rol.classList.remove('seleccionado');
                rol.setAttribute('aria-pressed', 'false');
            });

            boton.classList.add('seleccionado');
            boton.setAttribute('aria-pressed', 'true');

            rolSeleccionado = boton.dataset.rol;

            descripcionRol.textContent =
                descripciones[rolSeleccionado];
        });

    });

    // ABRIR LA PESTAÑA SEGÚN LA URL
    const rutaActual = window.location.pathname;

    if (rutaActual === '/registro') {
        mostrarFormulario('registro');
    } else {
        mostrarFormulario('login');
    }

    // INICIO DE SESIÓN
    login.addEventListener('submit', function (event) {

        event.preventDefault();

        const correo = document.getElementById('correoLogin').value.trim();
        const clave = document.getElementById('claveLogin').value;

        if (!correo || !clave) {
            mensaje.textContent = 'Completa todos los campos.';
            return;
        }

        if (!rolSeleccionado) {
            mensaje.textContent = 'Selecciona tu rol para continuar.';
            return;
        }

        mensaje.textContent =
            'Formulario validado. Próximamente habilitaremos el inicio de sesión.';
    });

    // REGISTRO DE USUARIO
    registro.addEventListener('submit', function (event) {

        event.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correoRegistro').value.trim();

        const clave = document.getElementById('claveRegistro').value;
        const confirmar = document.getElementById('confirmarClave').value;

        const tipoEmprendimiento =
            document.getElementById('tipoEmprendimiento').value;

        const nombreNegocio =
            document.getElementById('nombreNegocio').value.trim();

        const telefono =
            document.getElementById('telefono').value.trim();

        const direccion =
            document.getElementById('direccion').value.trim();

        // VALIDAR CAMPOS
        if (
            !nombre ||
            !correo ||
            !clave ||
            !confirmar ||
            !tipoEmprendimiento ||
            !nombreNegocio ||
            !telefono ||
            !direccion
        ) {
            mensaje.textContent = 'Completa todos los campos.';
            return;
        }

        // VALIDAR CONTRASEÑA
        if (clave.length < 8) {
            mensaje.textContent =
                'La contraseña debe tener mínimo 8 caracteres.';
            return;
        }

        // CONFIRMAR CONTRASEÑA
        if (clave !== confirmar) {
            mensaje.textContent =
                'Las contraseñas no coinciden.';
            return;
        }

        mensaje.textContent =
            'Formulario validado. Próximamente guardaremos tu registro.';
    });

    // RECUPERAR CONTRASEÑA
    const olvidoClave = document.getElementById('olvidoClave');

    olvidoClave.addEventListener('click', function (event) {

        event.preventDefault();

        mensaje.textContent =
            'La recuperación de contraseña estará disponible próximamente.';
    });

});
