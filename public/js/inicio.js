
document.addEventListener('DOMContentLoaded', function () {

    const diapositivas = document.querySelectorAll('.diapositiva');
    const puntos = document.querySelectorAll('.punto');
    const anterior = document.getElementById('anterior');
    const siguiente = document.getElementById('siguiente');

    const banner = document.querySelector('.banner');

    let indiceActual = 0;
    let intervalo = null;

    const movimientoReducido = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    );

    function mostrarDiapositiva(indice) {
        indiceActual = (
            indice + diapositivas.length
        ) % diapositivas.length;

        diapositivas.forEach((diapositiva, posicion) => {
            const activa = posicion === indiceActual;

            diapositiva.classList.toggle('activa', activa);
            diapositiva.setAttribute('aria-hidden', String(!activa));

            diapositiva.querySelectorAll('a').forEach(enlace => {
                if (activa) {
                    enlace.removeAttribute('tabindex');
                } else {
                    enlace.setAttribute('tabindex', '-1');
                }
            });
        });

        puntos.forEach((punto, posicion) => {
            const activo = posicion === indiceActual;

            punto.classList.toggle('activo', activo);
            punto.setAttribute('aria-current', String(activo));
        });
    }

    function detenerAutomatico() {
        if (intervalo !== null) {
            clearInterval(intervalo);
            intervalo = null;
        }
    }

    function iniciarAutomatico() {
        detenerAutomatico();

        if (movimientoReducido.matches || document.hidden) {
            return;
        }

        intervalo = setInterval(() => {
            mostrarDiapositiva(indiceActual + 1);
        }, 5000);
    }

    if (diapositivas.length > 0) {
        mostrarDiapositiva(0);
        iniciarAutomatico();

        anterior.addEventListener('click', () => {
            mostrarDiapositiva(indiceActual - 1);
            iniciarAutomatico();
        });

        siguiente.addEventListener('click', () => {
            mostrarDiapositiva(indiceActual + 1);
            iniciarAutomatico();
        });

        puntos.forEach((punto, indice) => {
            punto.addEventListener('click', () => {
                mostrarDiapositiva(indice);
                iniciarAutomatico();
            });
        });

        banner.addEventListener('mouseenter', detenerAutomatico);
        banner.addEventListener('mouseleave', iniciarAutomatico);

        banner.addEventListener('focusin', detenerAutomatico);
        banner.addEventListener('focusout', event => {
            if (!banner.contains(event.relatedTarget)) {
                iniciarAutomatico();
            }
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                detenerAutomatico();
            } else {
                iniciarAutomatico();
            }
        });

        movimientoReducido.addEventListener('change', iniciarAutomatico);
    }

    // MENÚ RESPONSIVE
    const menuToggle = document.getElementById('menuToggle');
    const menuPrincipal = document.getElementById('menuPrincipal');

    menuToggle.addEventListener('click', () => {
        const abierto = menuPrincipal.classList.toggle('abierto');

        menuToggle.setAttribute('aria-expanded', String(abierto));
        menuToggle.setAttribute(
            'aria-label',
            abierto ? 'Cerrar menú' : 'Abrir menú'
        );
    });

    menuPrincipal.querySelectorAll('a').forEach(enlace => {
        enlace.addEventListener('click', () => {
            menuPrincipal.classList.remove('abierto');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
});

// Animación de las tarjetas al desplazarse
document.addEventListener('DOMContentLoaded', function () {
    const tarjetas = document.querySelectorAll('.tarjeta');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    if (!('IntersectionObserver' in window)) {
        return;
    }

    tarjetas.forEach((tarjeta) => {
        tarjeta.classList.add('animar-entrada');
    });

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
                observador.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.15
    });

    tarjetas.forEach((tarjeta) => {
        observador.observe(tarjeta);
    });
});
