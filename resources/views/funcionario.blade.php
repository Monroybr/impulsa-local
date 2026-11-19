<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <meta name="csrf-token"
          content="{{ csrf_token() }}">

    <title>Funcionario | Impulsa Local</title>

    <link rel="stylesheet"
          href="{{ asset('css/funcionario.css') }}">


    <script>
        window.IMPULSA_USUARIO = {
            id: {{ (int) $usuarioActual->id }},
            nombre: @json($usuarioActual->name),
            correo: @json($usuarioActual->email),
            rol: @json($usuarioActual->rol),
            activo: {{ $usuarioActual->activo ? 'true' : 'false' }}
        };
    </script>



    <script src="{{ asset('js/funcionario.js') }}"
            defer></script>
</head>

<body>

    <!-- ===================================== -->
    <!-- ENCABEZADO -->
    <!-- ===================================== -->

    <header class="encabezado">

        <a href="{{ route('inicio') }}"
           class="marca">

            <span class="logo">IL</span>
            <strong>Impulsa Local</strong>

        </a>

        <div class="usuario">

            <div class="usuario-info">

                <strong>
                    {{ $usuarioActual->name }}
                </strong>

                <small>
                    Funcionario de la Alcaldía
                </small>

            </div>

            <span class="etiqueta-rol">
                {{ $usuarioActual->rol }}
            </span>

            <span class="avatar">
                {{ mb_strtoupper(
                    mb_substr($usuarioActual->name, 0, 1)
                ) }}
            </span>

            <form action="{{ route('logout') }}"
                  method="POST">

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
    <!-- TÍTULO DEL PANEL -->
    <!-- ===================================== -->

    <section class="barra-titulo">

        <div>

            <h1>
                Panel — Funcionario de Alcaldía
            </h1>

            <p>
                Gestión y seguimiento de
                emprendimientos registrados
            </p>

        </div>

        <button
            type="button"
            id="btnExportar"
            class="boton-principal">
            Exportar CSV
        </button>

    </section>

    <!-- ===================================== -->
    <!-- CONTENIDO PRINCIPAL -->
    <!-- ===================================== -->

    <main class="contenido">

        <!-- INDICADORES GENERALES -->

        <section
            class="indicadores"
            aria-label="Indicadores generales">

            <article class="indicador">

                <span>
                    Emprendedores registrados
                </span>

                <strong id="totalEmprendedores">
                    0
                </strong>

            </article>

            <article class="indicador">

                <span>
                    Emprendedores activos
                </span>

                <strong id="totalActivos">
                    0
                </strong>

            </article>

            <article class="indicador">

                <span>
                    Seguimientos registrados
                </span>

                <strong id="totalSeguimientos">
                    0
                </strong>

            </article>

            <article class="indicador">

                <span>
                    Casos que requieren apoyo
                </span>

                <strong id="totalApoyo">
                    0
                </strong>

            </article>

        </section>

        <!-- ================================= -->
        <!-- LISTADO DE EMPRENDEDORES -->
        <!-- ================================= -->

        <section class="seccion-listado">

            <div class="cabecera-seccion">

                <div>

                    <h2>
                        Emprendedores inscritos
                    </h2>

                    <p>
                        Consulta información y registra
                        el acompañamiento de cada negocio.
                    </p>

                </div>

            </div>

            <!-- FILTROS -->

            <div class="filtros">

                <input
                    type="search"
                    id="buscarEmprendedor"
                    placeholder="Buscar emprendedor o negocio..."
                    aria-label="Buscar emprendedor">

                <select
                    id="filtroActividad"
                    aria-label="Filtrar por actividad">

                    <option value="">
                        Todas las actividades
                    </option>

                    <option value="Panadería / Repostería">
                        Panadería / Repostería
                    </option>

                    <option value="Artesanías">
                        Artesanías
                    </option>

                    <option value="Costura / Confección">
                        Costura / Confección
                    </option>

                    <option value="Taller de reparaciones">
                        Taller de reparaciones
                    </option>

                    <option value="Tienda de barrio">
                        Tienda de barrio
                    </option>

                    <option value="Restaurante / Comida">
                        Restaurante / Comida
                    </option>

                </select>

                <select
                    id="filtroEstado"
                    aria-label="Filtrar por estado">

                    <option value="">
                        Todos los estados
                    </option>

                    <option value="activo">
                        Activos
                    </option>

                    <option value="inactivo">
                        Inactivos
                    </option>

                </select>

                <select
                    id="filtroApoyo"
                    aria-label="Filtrar por necesidad de apoyo">

                    <option value="">
                        Todas las necesidades
                    </option>

                    <option value="si">
                        Requiere apoyo
                    </option>

                    <option value="no">
                        Sin apoyo pendiente
                    </option>

                </select>

            </div>

            <!-- TABLA DE EMPRENDEDORES -->

            <div class="tabla-contenedor">

                <table>

                    <thead>

                        <tr>
                            <th>EMPRENDEDOR</th>
                            <th>EMPRENDIMIENTO</th>
                            <th>ACTIVIDAD</th>
                            <th>ESTADO</th>
                            <th>ATENCIÓN</th>
                            <th>ACCIONES</th>
                        </tr>

                    </thead>

                    <tbody id="tablaEmprendedores">
                    </tbody>

                </table>

            </div>

            <p
                id="sinResultados"
                class="sin-resultados"
                hidden>

                No se encontraron emprendedores
                con esos criterios.

            </p>

        </section>

    </main>

    <!-- ===================================== -->
    <!-- MODAL: DETALLE DEL EMPRENDEDOR -->
    <!-- ===================================== -->

    <dialog
        id="modalDetalle"
        class="modal-dialog modal-amplio"
        aria-labelledby="tituloDetalle">

        <div class="modal-cabecera">

            <div>

                <h2 id="tituloDetalle">
                    Detalle del emprendedor
                </h2>

                <p>
                    Información, reportes y
                    seguimiento institucional
                </p>

            </div>

            <button
                type="button"
                class="cerrar-modal"
                data-cerrar
                aria-label="Cerrar">
                ×
            </button>

        </div>

        <div id="contenidoDetalle">
        </div>

        <div class="acciones-modal">

            <button
                type="button"
                class="boton-secundario"
                data-cerrar>
                Cerrar
            </button>

            <button
                type="button"
                class="boton-principal"
                id="btnSeguimientoDesdeDetalle">

                + Registrar seguimiento

            </button>

        </div>

    </dialog>

    <!-- ===================================== -->
    <!-- MODAL: REGISTRAR SEGUIMIENTO -->
    <!-- ===================================== -->

    <dialog
        id="modalSeguimiento"
        class="modal-dialog"
        aria-labelledby="tituloSeguimiento">

        <div class="modal-cabecera">

            <div>

                <h2 id="tituloSeguimiento">
                    Registrar seguimiento
                </h2>

                <p id="nombreSeguimiento">
                </p>

            </div>

            <button
                type="button"
                class="cerrar-modal"
                data-cerrar
                aria-label="Cerrar">
                ×
            </button>

        </div>

        <form id="formSeguimiento">

            <input
                type="hidden"
                id="seguimientoId"
                name="emprendedor_id">

            <!-- FECHA -->

            <label for="fechaSeguimiento">
                Fecha del seguimiento
            </label>

            <input
                type="date"
                id="fechaSeguimiento"
                name="fecha"
                required>

            <!-- TIPO DE SEGUIMIENTO -->

            <label for="tipoSeguimiento">
                Tipo de seguimiento
            </label>

            <select
                id="tipoSeguimiento"
                name="tipo"
                required>

                <option value="">
                    Selecciona una opción
                </option>

                <option value="Llamada">
                    Llamada
                </option>

                <option value="Visita">
                    Visita
                </option>

                <option value="Asesoría">
                    Asesoría
                </option>

                <option value="Reunión">
                    Reunión
                </option>

                <option value="Otro">
                    Otro
                </option>

            </select>

            <!-- ESTADO DE ATENCIÓN -->

            <label for="estadoSeguimiento">
                Estado de atención
            </label>

            <select
                id="estadoSeguimiento"
                name="estado"
                required>

                <option value="">
                    Selecciona una opción
                </option>

                <option value="Pendiente">
                    Pendiente
                </option>

                <option value="Requiere apoyo">
                    Requiere apoyo
                </option>

                <option value="Atendido">
                    Atendido
                </option>

            </select>

            <!-- OBSERVACIONES -->

            <label for="observaciones">
                Observaciones y acciones realizadas
            </label>

            <textarea
                id="observaciones"
                name="observaciones"
                rows="4"
                maxlength="1500"
                placeholder="Describe el contacto, las dificultades y los compromisos..."
                required></textarea>

            <!-- BOTONES -->

            <div class="acciones-modal">

                <button
                    type="button"
                    class="boton-secundario"
                    data-cerrar>
                    Cancelar
                </button>

                <button
                    type="submit"
                    class="boton-principal">
                    Guardar seguimiento
                </button>

            </div>

        </form>

    </dialog>

    <!-- ===================================== -->
    <!-- MENSAJES DEL SISTEMA -->
    <!-- ===================================== -->

    <div
        id="mensajeSistema"
        class="mensaje-sistema"
        role="status"
        aria-live="polite"
        hidden>
    </div>

    <!-- ===================================== -->
    <!-- PIE DE PÁGINA -->
    <!-- ===================================== -->

    <footer class="footer">

        <div class="footer-marca">

            <span class="logo logo-amarillo">
                IL
            </span>

            <strong>
                Impulsa Local
            </strong>

        </div>

        <p>
            © 2026 Impulsa Local —
            Liseth Dayana Monroy Briñez
        </p>

        <div class="footer-enlaces">

            <a href="#"
               data-informativo="Términos">
                Términos
            </a>

            <a href="#"
               data-informativo="Privacidad">
                Privacidad
            </a>

            <a href="#"
               data-informativo="Contacto">
                Contacto
            </a>

        </div>

    </footer>

</body>
</html>
