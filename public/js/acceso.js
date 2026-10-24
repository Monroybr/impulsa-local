
document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // ELEMENTOS DE LOS FORMULARIOS
    // ==========================================

    const login = document.getElementById('formLogin');
    const registro = document.getElementById('formRegistro');

    const tabLogin = document.getElementById('tabLogin');
    const tabRegistro = document.getElementById('tabRegistro');

    const mensaje = document.getElementById('mensaje');

    const botonesRol = document.querySelectorAll('.rol');
    const descripcionRol = document.getElementById('descripcionRol');

    const olvidoClave = document.getElementById('olvidoClave');

    // ==========================================
    // DESCRIPCIONES DE LOS ROLES
    // ==========================================

    const descripciones = {
        administrador:
            'Administra los usuarios y la configuración general de la plataforma.',

        funcionario:
            'Participa en la gestión y seguimiento de los emprendedores.',

        coordinador:
            'Coordina los programas de formación y las actividades.',

        instructor:
            'Gestiona la formación y el acompañamiento a los emprendedores.',

        emprendedor:
            'Accede a los cursos y herramientas para fortalecer tu negocio.'
    };

    // ==========================================
    // CAMBIAR ENTRE FORMULARIOS
    // ==========================================

    function mostrarFormulario(tipo) {

        const esLogin = tipo === 'login';

        login.hidden = !esLogin;
        registro.hidden = esLogin;

        tabLogin.classList.toggle('activa', esLogin);
        tabRegistro.classList.toggle('activa', !esLogin);

        tabLogin.setAttribute('aria-selected', String(esLogin));
        tabRegistro.setAttribute('aria-selected', String(!esLogin));

        if (mensaje) {
            mensaje.textContent = '';
        }
    }

    // ==========================================
    // PESTAÑAS SUPERIORES
    // ==========================================

    tabLogin.addEventListener('click', function () {
        mostrarFormulario('login');
    });

    tabRegistro.addEventListener('click', function () {
        mostrarFormulario('registro');
    });

    // ==========================================
    // ENLACES ENTRE FORMULARIOS
    // ==========================================

    document.getElementById('irRegistro')
        .addEventListener('click', function () {
            mostrarFormulario('registro');
        });

    document.getElementById('irLogin')
        .addEventListener('click', function () {
            mostrarFormulario('login');
        });

    // ==========================================
    // SELECCIÓN VISUAL DE ROLES
    // ==========================================

    botonesRol.forEach(function (boton) {

        boton.addEventListener('click', function () {

            botonesRol.forEach(function (rol) {
                rol.classList.remove('seleccionado');
                rol.setAttribute('aria-pressed', 'false');
            });

            boton.classList.add('seleccionado');
            boton.setAttribute('aria-pressed', 'true');

            const rolSeleccionado = boton.dataset.rol;

            if (descripcionRol) {
                descripcionRol.textContent =
                    descripciones[rolSeleccionado] || '';
            }
        });

    });

    // ==========================================
    // ABRIR PESTAÑA SEGÚN LA URL
    // ==========================================

    const rutaActual = window.location.pathname.replace(/\/+$/, '');

    if (rutaActual === '/registro') {
        mostrarFormulario('registro');
    } else {
        mostrarFormulario('login');
    }

    // ==========================================
    // VALIDACIÓN DE INICIO DE SESIÓN
    // ==========================================

    login.addEventListener('submit', function (event) {

        const correo = document.getElementById('correoLogin').value.trim();
        const clave = document.getElementById('claveLogin').value;

        if (!correo || !clave) {

            event.preventDefault();

            if (mensaje) {
                mensaje.textContent =
                    'Por favor, completa tu correo y contraseña.';
            }

            return;
        }

        // No bloqueamos el formulario.
        // Laravel comprobará el correo, la contraseña
        // y el rol guardado en SQLite.
    });

    // ==========================================
    // VALIDACIÓN DEL REGISTRO
    // ==========================================

    registro.addEventListener('submit', function (event) {

        const nombre = document.getElementById('nombre').value.trim();

        const correo =
            document.getElementById('correoRegistro').value.trim();

        const clave =
            document.getElementById('claveRegistro').value;

        const confirmar =
            document.getElementById('confirmarClave').value;

        const tipoEmprendimiento =
            document.getElementById('tipoEmprendimiento').value;

        const nombreNegocio =
            document.getElementById('nombreNegocio').value.trim();

        const telefono =
            document.getElementById('telefono').value.trim();

        const direccion =
            document.getElementById('direccion').value.trim();

        // COMPROBAR CAMPOS OBLIGATORIOS

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

            event.preventDefault();

            if (mensaje) {
                mensaje.textContent =
                    'Por favor, completa todos los campos del registro.';
            }

            return;
        }

        // COMPROBAR LONGITUD DE CONTRASEÑA

        if (clave.length < 8) {

            event.preventDefault();

            if (mensaje) {
                mensaje.textContent =
                    'La contraseña debe tener mínimo 8 caracteres.';
            }

            return;
        }

        // COMPROBAR CONFIRMACIÓN DE CONTRASEÑA

        if (clave !== confirmar) {

            event.preventDefault();

            if (mensaje) {
                mensaje.textContent =
                    'Las contraseñas no coinciden.';
            }

            return;
        }

        // Si todo está correcto, el formulario se
        // envía normalmente a Laravel mediante POST.
        // AuthController guardará la cuenta en SQLite.
    });

    // ==========================================
    // RECUPERACIÓN DE CONTRASEÑA
    // ==========================================

    if (olvidoClave) {

        olvidoClave.addEventListener('click', function (event) {

            event.preventDefault();

            if (mensaje) {
                mensaje.textContent =
                    'La recuperación de contraseña estará disponible próximamente.';
            }
        });

    }

});
