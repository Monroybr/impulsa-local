
document.addEventListener('DOMContentLoaded', function () {

    const login = document.getElementById('formLogin');
    const registro = document.getElementById('formRegistro');

    const tabLogin = document.getElementById('tabLogin');
    const tabRegistro = document.getElementById('tabRegistro');

    const mensaje = document.getElementById('mensaje');

    const botonesRol = document.querySelectorAll('.rol');
    const descripcionRol = document.getElementById('descripcionRol');

    const olvidoClave = document.getElementById('olvidoClave');

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

    function mostrarFormulario(tipo) {
        const esLogin = tipo === 'login';

        if (login) {
            login.hidden = !esLogin;
        }

        if (registro) {
            registro.hidden = esLogin;
        }

        if (tabLogin) {
            tabLogin.classList.toggle('activa', esLogin);
            tabLogin.setAttribute(
                'aria-selected',
                String(esLogin)
            );
        }

        if (tabRegistro) {
            tabRegistro.classList.toggle('activa', !esLogin);
            tabRegistro.setAttribute(
                'aria-selected',
                String(!esLogin)
            );
        }

        if (mensaje) {
            mensaje.textContent = '';
        }
    }

    if (tabLogin) {
        tabLogin.addEventListener('click', function () {
            mostrarFormulario('login');
        });
    }

    if (tabRegistro) {
        tabRegistro.addEventListener('click', function () {
            mostrarFormulario('registro');
        });
    }

    const irRegistro = document.getElementById('irRegistro');

    if (irRegistro) {
        irRegistro.addEventListener('click', function () {
            mostrarFormulario('registro');
        });
    }

    const irLogin = document.getElementById('irLogin');

    if (irLogin) {
        irLogin.addEventListener('click', function () {
            mostrarFormulario('login');
        });
    }

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

    const rutaActual =
        window.location.pathname.replace(/\/+$/, '');

    const pestañaInicial =
        window.IMPULSA_ACCESO?.pestañaInicial ||
        (rutaActual === '/registro' ? 'registro' : 'login');

    mostrarFormulario(pestañaInicial);

    if (login) {
        login.addEventListener('submit', function (event) {

            const correo = document
                .getElementById('correoLogin')
                .value.trim();

            const clave = document
                .getElementById('claveLogin')
                .value;

            if (!correo || !clave) {
                event.preventDefault();

                if (mensaje) {
                    mensaje.textContent =
                        'Por favor, completa tu correo y contraseña.';
                }

                return;
            }

            // Laravel valida las credenciales reales.
        });
    }

    if (registro) {
        registro.addEventListener('submit', function (event) {

            const nombre = document
                .getElementById('nombre')
                .value.trim();

            const correo = document
                .getElementById('correoRegistro')
                .value.trim();

            const clave = document
                .getElementById('claveRegistro')
                .value;

            const confirmar = document
                .getElementById('confirmarClave')
                .value;

            const tipoEmprendimiento = document
                .getElementById('tipoEmprendimiento')
                .value;

            const nombreNegocio = document
                .getElementById('nombreNegocio')
                .value.trim();

            const telefono = document
                .getElementById('telefono')
                .value.trim();

            const direccion = document
                .getElementById('direccion')
                .value.trim();

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

            if (clave.length < 8) {
                event.preventDefault();

                if (mensaje) {
                    mensaje.textContent =
                        'La contraseña debe tener mínimo 8 caracteres.';
                }

                return;
            }

            if (clave !== confirmar) {
                event.preventDefault();

                if (mensaje) {
                    mensaje.textContent =
                        'Las contraseñas no coinciden.';
                }

                return;
            }

            // El formulario se envía a Laravel.
            // AuthController guarda la cuenta en SQLite.
        });
    }

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
