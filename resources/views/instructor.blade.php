<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Instructor | Impulsa Local</title>

    <link rel="stylesheet" href="{{ asset('css/instructor.css') }}">

    <script src="{{ asset('js/impulsa-datos.js') }}" defer></script>
    <script src="{{ asset('js/instructor.js') }}" defer></script>
</head>

<body>

    <!-- ===================================== -->
    <!-- ENCABEZADO -->
    <!-- ===================================== -->

    <header class="encabezado">

        <a href="{{ route('inicio') }}" class="marca">
            <span class="logo">IL</span>
            <strong>Impulsa Local</strong>
        </a>

        <div class="usuario">

            <div class="usuario-info">
                <strong>{{ $usuarioActual->name }}</strong>
                <small>Instructor / Capacitador</small>
            </div>

            <span class="etiqueta-rol">
                {{ $usuarioActual->rol }}
            </span>

            <span class="avatar">
                {{ mb_strtoupper(mb_substr($usuarioActual->name, 0, 1)) }}
            </span>

            <form action="{{ route('logout') }}" method="POST">
                @csrf

                <button
                    type="submit"
                    class="salir"
                    title="Cerrar sesión"
                    aria-label="Cerrar sesión">
                    ⇥
                </button>
            </form>

        </div>

    </header>


    <!-- ===================================== -->
    <!-- TÍTULO -->
    <!-- ===================================== -->

    <section class="barra-titulo">
        <h1>Panel — Instructor / Capacitador</h1>
    </section>


    <!-- ===================================== -->
    <!-- CONTENIDO PRINCIPAL -->
    <!-- ===================================== -->

    <main class="contenido">

        <h2 class="titulo-seccion">
            Mis programas asignados
            (<span id="cantidadProgramas">0</span>)
        </h2>


        <!-- ================================= -->
        <!-- PROGRAMAS ASIGNADOS -->
        <!-- ================================= -->

        <section
            id="contenedorProgramas"
            class="cuadricula-programas"
            aria-label="Programas asignados"
            aria-live="polite">
        </section>


        <!-- ================================= -->
        <!-- PARTICIPANTES DEL PROGRAMA -->
        <!-- ================================= -->

        <section
            id="panelParticipantes"
            class="panel-participantes"
            aria-live="polite"
            hidden>

            <div class="panel-cabecera">

                <div>
                    <h2 id="tituloParticipantes"></h2>

                    <p class="texto-ayuda">
                        Consulta el progreso y los seguimientos
                        de los emprendedores inscritos en
                        este programa de formación.
                    </p>
                </div>

                <button
                    type="button"
                    id="cerrarParticipantes"
                    class="boton-secundario">
                    Cerrar
                </button>

            </div>

            <div id="contenidoParticipantes"></div>

        </section>


        <!-- ================================= -->
        <!-- SEGUIMIENTO DEL EMPRENDEDOR -->
        <!-- ================================= -->

        <section
            id="panelSeguimiento"
            class="panel-seguimiento"
            aria-live="polite"
            hidden>

            <div class="panel-cabecera">

                <div>

                    <h2>Seguimiento del emprendedor</h2>

                    <p
                        id="subtituloSeguimiento"
                        class="texto-ayuda">
                    </p>

                </div>

                <button
                    type="button"
                    id="cerrarSeguimiento"
                    class="boton-secundario">
                    Cerrar seguimiento
                </button>

            </div>


            <!-- RESUMEN DEL EMPRENDEDOR -->

            <div class="resumen-seguimiento">

                <div>
                    <small>EMPRENDEDOR</small>

                    <strong id="nombreSeguimiento"></strong>
                </div>

                <div>
                    <small>EMPRENDIMIENTO</small>

                    <strong id="negocioSeguimiento"></strong>
                </div>

                <div>
                    <small>PROGRESO DEL PROGRAMA</small>

                    <strong id="progresoSeguimiento"></strong>
                </div>

            </div>


            <!-- REPORTES Y OBSERVACIONES -->

            <div class="cuadricula-seguimiento">


                <!-- REPORTES DE AVANCE -->

                <article class="tarjeta-seguimiento">

                    <h3>
                        Reportes de avance del emprendedor
                    </h3>

                    <p class="texto-ayuda">
                        Consulta los logros alcanzados,
                        las dificultades presentadas
                        y las solicitudes de apoyo
                        registradas por el emprendedor.
                    </p>

                    <div id="listaReportes"></div>

                </article>


                <!-- OBSERVACIONES DEL INSTRUCTOR -->

                <article class="tarjeta-seguimiento">

                    <div class="panel-cabecera">

                        <h3>
                            Observaciones del instructor
                        </h3>

                        <button
                            type="button"
                            id="abrirObservacion"
                            class="boton-primario">
                            + Registrar observación
                        </button>

                    </div>

                    <div id="listaObservaciones"></div>

                </article>

            </div>

        </section>

    </main>


    <!-- ===================================== -->
    <!-- MODAL PARA REGISTRAR OBSERVACIONES -->
    <!-- ===================================== -->

    <dialog id="modalObservacion">

        <form
            id="formObservacion"
            class="form-modal">

            <h2>Registrar observación</h2>

            <p class="texto-ayuda">
                Registra una recomendación o seguimiento
                sobre el avance del emprendedor.
            </p>


            <!-- FECHA -->

            <div class="campo">

                <label for="fechaObservacion">
                    Fecha del seguimiento
                </label>

                <input
                    type="date"
                    id="fechaObservacion"
                    name="fecha"
                    required>

            </div>


            <!-- TIPO DE SEGUIMIENTO -->

            <div class="campo">

                <label for="tipoObservacion">
                    Tipo de seguimiento
                </label>

                <select
                    id="tipoObservacion"
                    name="tipo"
                    required>

                    <option value="">
                        Selecciona una opción
                    </option>

                    <option value="revision">
                        Revisión de avance
                    </option>

                    <option value="asesoria">
                        Asesoría
                    </option>

                    <option value="llamada">
                        Llamada
                    </option>

                    <option value="visita">
                        Visita
                    </option>

                </select>

            </div>


            <!-- OBSERVACIONES -->

            <div class="campo">

                <label for="comentarioObservacion">
                    Observaciones y recomendaciones
                </label>

                <textarea
                    id="comentarioObservacion"
                    name="comentario"
                    rows="5"
                    maxlength="1500"
                    placeholder="Describe las observaciones y recomendaciones..."
                    required></textarea>

            </div>


            <!-- ESTADO -->

            <div class="campo">

                <label for="estadoObservacion">
                    Estado del seguimiento
                </label>

                <select
                    id="estadoObservacion"
                    name="estado"
                    required>

                    <option value="revisado">
                        Revisado
                    </option>

                    <option value="requiere apoyo">
                        Requiere apoyo
                    </option>

                    <option value="pendiente">
                        Pendiente
                    </option>

                </select>

            </div>


            <!-- BOTONES -->

            <div class="acciones-modal">

                <button
                    type="button"
                    id="cancelarObservacion"
                    class="boton-secundario">
                    Cancelar
                </button>

                <button
                    type="submit"
                    class="boton-primario">
                    Guardar observación
                </button>

            </div>

        </form>

    </dialog>


    <!-- ===================================== -->
    <!-- MENSAJES DEL SISTEMA -->
    <!-- ===================================== -->

    <div
        id="mensajeInstructor"
        class="mensaje-instructor"
        role="status"
        aria-live="polite"
        hidden>
    </div>


    <!-- ===================================== -->
    <!-- FOOTER INSTITUCIONAL -->
    <!-- ===================================== -->

    <footer class="footer">

        <div class="footer-marca">

            <span class="logo logo-amarillo">IL</span>

            <strong>Impulsa Local</strong>

        </div>

        <p>
            © 2026 Impulsa Local — Liseth Dayana Monroy Briñez
        </p>

        <div class="footer-enlaces">

            <a href="#" data-informativo="Términos">
                Términos
            </a>

            <a href="#" data-informativo="Privacidad">
                Privacidad
            </a>

            <a href="#" data-informativo="Contacto">
                Contacto
            </a>

        </div>

    </footer>

</body>
</html>
