
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cursos disponibles - Impulsa Local</title>

    <link rel="stylesheet" href="{{ asset('css/cursos.css') }}">
    <script src="{{ asset('js/cursos.js') }}" defer></script>
</head>
<body>

    <!-- ENCABEZADO -->
    <header class="encabezado">
        <div class="contenedor encabezado-contenido">

            <a href="{{ url('/') }}" class="logo">
                <span class="logo-icono">IL</span>
                <span>Impulsa Local</span>
            </a>

            <button class="menu-toggle"
                    id="menuToggle"
                    type="button"
                    aria-label="Abrir menú"
                    aria-expanded="false"
                    aria-controls="menuPrincipal">
                ☰
            </button>

            <nav class="menu-principal" id="menuPrincipal">
                <a href="{{ url('/') }}">Inicio</a>
                <a href="{{ url('/cursos') }}" class="activo">
                    Cursos disponibles
                </a>
                <a href="{{ url('/login') }}" class="boton-acceso">
                    Iniciar sesión
                </a>
            </nav>

        </div>
    </header>

    <main>

        <!-- BANNER -->
        <section class="banner-cursos">
            <div class="contenedor">
                <span class="etiqueta-banner">
                    FORMACIÓN PARA EMPRENDEDORES
                </span>

                <h1>Cursos disponibles</h1>

                <p>
                    Programas diseñados específicamente para
                    emprendedores locales, desde la idea
                    hasta el crecimiento.
                </p>
            </div>
        </section>

        <!-- CATÁLOGO -->
        <section class="seccion-cursos">
            <div class="contenedor-cursos">

                <!-- FILTROS -->
                <div class="filtros" aria-label="Filtrar cursos">
                    <button class="filtro activo"
                            data-categoria="todos"
                            type="button">Todos</button>

                    <button class="filtro"
                            data-categoria="estrategia"
                            type="button">Estrategia</button>

                    <button class="filtro"
                            data-categoria="marketing"
                            type="button">Marketing</button>

                    <button class="filtro"
                            data-categoria="finanzas"
                            type="button">Finanzas</button>

                    <button class="filtro"
                            data-categoria="liderazgo"
                            type="button">Liderazgo</button>

                    <button class="filtro"
                            data-categoria="ventas"
                            type="button">Ventas</button>
                </div>

                <!-- TARJETAS -->
                <div class="cuadricula-cursos" id="listaCursos">

                    <!-- CURSO 1 -->
                    <article class="tarjeta-curso"
                             data-categoria="estrategia">

                        <div class="tarjeta-encabezado">
                            <h2>Plan de Negocios desde Cero</h2>
                            <span class="estado activo">
                                activo
                            </span>
                        </div>

                        <span class="categoria-curso">
                            Estrategia
                        </span>

                        <p class="descripcion">
                            Aprende a estructurar tu idea de
                            negocio con metodologías probadas.
                        </p>

                        <div class="detalles-curso">
                            <div>
                                <span>Instructor:</span>
                                <span>Ana Instructora</span>
                            </div>
                            <div>
                                <span>Duración:</span>
                                <span>8 semanas</span>
                            </div>
                            <div>
                                <span>Cupos disponibles:</span>
                                <span>12/30</span>
                            </div>
                        </div>
                    </article>

                    <!-- CURSO 2 -->
                    <article class="tarjeta-curso"
                             data-categoria="marketing">

                        <div class="tarjeta-encabezado">
                            <h2>Marketing Digital para Emprendedores</h2>
                            <span class="estado activo">
                                activo
                            </span>
                        </div>

                        <span class="categoria-curso">
                            Marketing
                        </span>

                        <p class="descripcion">
                            Domina redes sociales, SEO y
                            publicidad pagada.
                        </p>

                        <div class="detalles-curso">
                            <div>
                                <span>Instructor:</span>
                                <span>Ana Instructora</span>
                            </div>
                            <div>
                                <span>Duración:</span>
                                <span>6 semanas</span>
                            </div>
                            <div>
                                <span>Cupos disponibles:</span>
                                <span>3/25</span>
                            </div>
                        </div>
                    </article>

                    <!-- CURSO 3 -->
                    <article class="tarjeta-curso"
                             data-categoria="finanzas">

                        <div class="tarjeta-encabezado">
                            <h2>Finanzas para No Financieros</h2>
                            <span class="estado activo">
                                activo
                            </span>
                        </div>

                        <span class="categoria-curso">
                            Finanzas
                        </span>

                        <p class="descripcion">
                            Entiende flujos de caja, punto
                            de equilibrio e inversión.
                        </p>

                        <div class="detalles-curso">
                            <div>
                                <span>Instructor:</span>
                                <span>Ana Instructora</span>
                            </div>
                            <div>
                                <span>Duración:</span>
                                <span>5 semanas</span>
                            </div>
                            <div>
                                <span>Cupos disponibles:</span>
                                <span>6/20</span>
                            </div>
                        </div>
                    </article>

                    <!-- CURSO 4 -->
                    <article class="tarjeta-curso"
                             data-categoria="liderazgo">

                        <div class="tarjeta-encabezado">
                            <h2>Liderazgo y Gestión de Equipos</h2>
                            <span class="estado inactivo">
                                inactivo
                            </span>
                        </div>

                        <span class="categoria-curso">
                            Liderazgo
                        </span>

                        <p class="descripcion">
                            Habilidades de liderazgo para
                            construir equipos de alto rendimiento.
                        </p>

                        <div class="detalles-curso">
                            <div>
                                <span>Instructor:</span>
                                <span>Ana Instructora</span>
                            </div>
                            <div>
                                <span>Duración:</span>
                                <span>7 semanas</span>
                            </div>
                            <div>
                                <span>Cupos disponibles:</span>
                                <span>11/20</span>
                            </div>
                        </div>
                    </article>

                    <!-- CURSO 5 -->
                    <article class="tarjeta-curso"
                             data-categoria="ventas">

                        <div class="tarjeta-encabezado">
                            <h2>E-commerce: Vende en Línea</h2>
                            <span class="estado activo">
                                activo
                            </span>
                        </div>

                        <span class="categoria-curso">
                            Ventas
                        </span>

                        <p class="descripcion">
                            Crea tu tienda en línea y escala
                            tus ventas digitales.
                        </p>

                        <div class="detalles-curso">
                            <div>
                                <span>Instructor:</span>
                                <span>Ana Instructora</span>
                            </div>
                            <div>
                                <span>Duración:</span>
                                <span>6 semanas</span>
                            </div>
                            <div>
                                <span>Cupos disponibles:</span>
                                <span>3/30</span>
                            </div>
                        </div>
                    </article>

                    <!-- CURSO 6 -->
                    <article class="tarjeta-curso"
                             data-categoria="ventas">

                        <div class="tarjeta-encabezado">
                            <h2>Atención al Cliente y Fidelización</h2>
                            <span class="estado finalizado">
                                finalizado
                            </span>
                        </div>

                        <span class="categoria-curso">
                            Ventas
                        </span>

                        <p class="descripcion">
                            Estrategias para retener clientes
                            y hacer crecer tu negocio.
                        </p>

                        <div class="detalles-curso">
                            <div>
                                <span>Instructor:</span>
                                <span>Ana Instructora</span>
                            </div>
                            <div>
                                <span>Duración:</span>
                                <span>4 semanas</span>
                            </div>
                            <div>
                                <span>Cupos disponibles:</span>
                                <span>14/25</span>
                            </div>
                        </div>
                    </article>

                </div>

                <p id="sinResultados" class="sin-resultados" hidden>
                    No se encontraron cursos en esta categoría.
                </p>

            </div>
        </section>

    </main>

    <!-- PIE DE PÁGINA -->
    <footer class="pie-pagina">
        <div class="contenedor pie-contenido">

            <a href="{{ url('/') }}" class="logo logo-footer">
                <span class="logo-icono">IL</span>
                <span>Impulsa Local</span>
            </a>

            <p>
                © 2026 Impulsa Local — Liseth Dayana Monroy Briñez
            </p>

            <div class="enlaces-footer">
                <a href="{{ url('/terminos') }}">Términos</a>
                <a href="{{ url('/privacidad') }}">Privacidad</a>
                <a href="{{ url('/contacto') }}">Contacto</a>
            </div>

        </div>
    </footer>

</body>
</html>
