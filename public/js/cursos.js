
document.addEventListener('DOMContentLoaded', function () {

    // =====================================
    // FILTROS DE CURSOS
    // =====================================

    const filtros = document.querySelectorAll('.filtro');
    const cursos = document.querySelectorAll('.tarjeta-curso');
    const sinResultados = document.getElementById('sinResultados');

    filtros.forEach(function (filtro) {

        filtro.addEventListener('click', function () {

            const categoriaSeleccionada = filtro.dataset.categoria;
            let cantidadVisibles = 0;

            // Actualizar el botón seleccionado
            filtros.forEach(function (boton) {
                boton.classList.remove('activo');
                boton.setAttribute('aria-pressed', 'false');
            });

            filtro.classList.add('activo');
            filtro.setAttribute('aria-pressed', 'true');

            // Mostrar únicamente los cursos de la categoría
            cursos.forEach(function (curso) {

                const categoriaCurso = curso.dataset.categoria;

                const mostrar =
                    categoriaSeleccionada === 'todos' ||
                    categoriaCurso === categoriaSeleccionada;

                curso.hidden = !mostrar;

                if (mostrar) {
                    cantidadVisibles++;
                }

            });

            // Mensaje cuando no existen cursos
            if (sinResultados) {
                sinResultados.hidden = cantidadVisibles > 0;
            }

        });

    });

    // Marcar el filtro inicial
    filtros.forEach(function (filtro) {
        filtro.setAttribute(
            'aria-pressed',
            String(filtro.classList.contains('activo'))
        );
    });


    // =====================================
    // MENÚ RESPONSIVE
    // =====================================

    const menuToggle = document.getElementById('menuToggle');
    const menuPrincipal = document.getElementById('menuPrincipal');

    if (menuToggle && menuPrincipal) {

        menuToggle.addEventListener('click', function () {

            const abierto = menuPrincipal.classList.toggle('abierto');

            menuToggle.setAttribute(
                'aria-expanded',
                String(abierto)
            );

            menuToggle.setAttribute(
                'aria-label',
                abierto ? 'Cerrar menú' : 'Abrir menú'
            );

        });

        // Cerrar menú al seleccionar una opción
        menuPrincipal.querySelectorAll('a').forEach(function (enlace) {

            enlace.addEventListener('click', function () {

                menuPrincipal.classList.remove('abierto');

                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Abrir menú');

            });

        });

        // Cerrar menú al presionar Escape
        document.addEventListener('keydown', function (evento) {

            if (evento.key === 'Escape') {

                menuPrincipal.classList.remove('abierto');

                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Abrir menú');

            }

        });

    }

});
