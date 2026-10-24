
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instructor | Impulsa Local</title>

    <link rel="stylesheet" href="{{ asset('css/instructor.css') }}">
    <script src="{{ asset('js/impulsa-datos.js') }}" defer></script>
    <script src="{{ asset('js/instructor.js') }}" defer></script>
    
</head>
<body>

    <!-- ENCABEZADO -->
    <header class="encabezado">
        <a href="{{ route('inicio') }}" class="marca">
            <span class="logo">IL</span>
            <strong>Impulsa Local</strong>
        </a>

        <div class="usuario">
            <div class="usuario-info">
                <strong>Ana Instructora</strong>
                <small>Instructor / Capacitador</small>
            </div>

            <span class="etiqueta-rol">instructor</span>
            <span class="avatar">A</span>

            <a href="{{ route('inicio') }}"
               class="salir"
               title="Salir"
               aria-label="Salir">⇥</a>
        </div>
    </header>

    <!-- TÍTULO -->
    <section class="barra-titulo">
        <h1>Panel — Instructor / Capacitador</h1>
    </section>

    <!-- CONTENIDO PRINCIPAL -->
    <main class="contenido">

        <h2 class="titulo-seccion">
            Mis programas asignados
            (<span id="cantidadProgramas">6</span>)
        </h2>

        <!-- TARJETAS DE PROGRAMAS -->
        <section
            id="contenedorProgramas"
            class="cuadricula-programas"
            aria-label="Programas asignados">
        </section>

        <!-- PARTICIPANTES -->
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
                        de los emprendedores inscritos.
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

        <!-- SEGUIMIENTO DEL PARTICIPANTE -->
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

            <div class="cuadricula-seguimiento">

                <!-- REPORTES DEL EMPRENDEDOR -->
                <article class="tarjeta-seguimiento">
                    <h3>Reportes de avance del emprendedor</h3>

                    <p class="texto-ayuda">
                        Consulta los logros, dificultades
                        y solicitudes de apoyo.
                    </p>

                    <div id="listaReportes"></div>
                </article>

                <!-- OBSERVACIONES DEL INSTRUCTOR -->
                <article class="tarjeta-seguimiento">
                    <div class="panel-cabecera">
                        <h3>Observaciones del instructor</h3>

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

    <!-- MODAL DE OBSERVACIONES -->
    <dialog id="modalObservacion">
        <form id="formObservacion" class="form-modal">

            <h2>Registrar observación</h2>

            <p class="texto-ayuda">
                Registra una recomendación o seguimiento
                sobre el avance del emprendedor.
            </p>

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

            <div class="campo">
                <label for="tipoObservacion">
                    Tipo de seguimiento
                </label>

                <select
                    id="tipoObservacion"
                    name="tipo"
                    required>
                    <option value="">Selecciona una opción</option>
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

            <div class="campo">
                <label for="estadoObservacion">
                    Estado del seguimiento
                </label>

                <select
                    id="estadoObservacion"
                    name="estado"
                    required>
                    <option value="revisado">Revisado</option>
                    <option value="requiere apoyo">
                        Requiere apoyo
                    </option>
                    <option value="pendiente">
                        Pendiente
                    </option>
                </select>
            </div>

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

    <!-- MENSAJE DE CONFIRMACIÓN -->
    <div
        id="mensajeInstructor"
        class="mensaje-instructor"
        role="status"
        aria-live="polite"
        hidden>
    </div>

    <!-- FOOTER INSTITUCIONAL -->
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
