
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Coordinador | Impulsa Local</title>

    <link rel="stylesheet" href="{{ asset('css/coordinador.css') }}">
    <script src="{{ asset('js/impulsa-datos.js') }}" defer></script>
    <script src="{{ asset('js/coordinador.js') }}" defer></script>
    
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
                <strong>Pedro Coordinador</strong>
                <small>Coordinador del programa</small>
            </div>

            <span class="etiqueta-rol">coordinador</span>
            <span class="avatar">P</span>

            <a href="{{ route('inicio') }}"
               class="salir"
               title="Salir"
               aria-label="Salir">⇥</a>
        </div>
    </header>

    <!-- TÍTULO -->
    <section class="barra-titulo">
        <div>
            <h1>Panel — Coordinador del programa</h1>
            <p>Supervisión general del programa Impulsa Local</p>
        </div>

        <span class="etiqueta-demo">Datos de demostración</span>
    </section>

    <!-- NAVEGACIÓN -->
    <nav class="navegacion" aria-label="Secciones del coordinador">

        <button type="button"
                class="pestana activa"
                data-pestana="indicadores"
                aria-selected="true">
            📊 Indicadores
        </button>

        <button type="button"
                class="pestana"
                data-pestana="avance"
                aria-selected="false">
            📈 Avance emprendedores
        </button>

        <button type="button"
                class="pestana"
                data-pestana="programas"
                aria-selected="false">
            📚 Programas
        </button>

        <button type="button"
                class="pestana"
                data-pestana="apoyos"
                aria-selected="false">
            🤝 Necesidades de apoyo
        </button>

        <button type="button"
                class="pestana"
                data-pestana="reportes"
                aria-selected="false">
            📋 Reportes
        </button>
    </nav>

    <main class="contenido">

        <!-- INDICADORES -->
        <section id="indicadores" class="seccion activa">

            <div class="cabecera-seccion">
                <div>
                    <h2>Indicadores generales</h2>
                    <p>Resumen del estado actual del programa.</p>
                </div>
            </div>

            <div class="tarjetas-indicadores">

                <article class="tarjeta">
                    <strong class="numero azul" id="totalRegistrados">0</strong>
                    <span>Emprendedores registrados</span>
                </article>

                <article class="tarjeta">
                    <strong class="numero verde" id="totalActivos">0</strong>
                    <span>Emprendedores activos</span>
                </article>

                <article class="tarjeta">
                    <strong class="numero gris" id="totalInactivos">0</strong>
                    <span>Emprendedores inactivos</span>
                </article>

                <article class="tarjeta">
                    <strong class="numero azul-claro" id="totalProgramas">0</strong>
                    <span>Total programas</span>
                </article>

                <article class="tarjeta">
                    <strong class="numero verde" id="programasActivos">0</strong>
                    <span>Programas activos</span>
                </article>

                <article class="tarjeta">
                    <strong class="numero naranja" id="totalInscripciones">0</strong>
                    <span>Total inscripciones</span>
                </article>

                <article class="tarjeta">
                    <strong class="numero naranja" id="totalApoyos">0</strong>
                    <span>Casos que requieren apoyo</span>
                </article>

                <article class="tarjeta">
                    <strong class="numero azul" id="promedioProgreso">0%</strong>
                    <span>Progreso promedio de formación</span>
                </article>

            </div>

            <div class="paneles-estadisticas">

                <article class="panel">
                    <h3>Sectores más frecuentes</h3>
                    <p class="descripcion-panel">
                        Distribución de emprendedores por sector económico.
                    </p>
                    <div id="listaSectores"></div>
                </article>

                <article class="panel">
                    <h3>Programas más solicitados</h3>
                    <p class="descripcion-panel">
                        Cantidad de inscripciones por programa.
                    </p>
                    <div id="listaProgramas"></div>
                </article>

            </div>
        </section>

        <!-- AVANCE DE EMPRENDEDORES -->
        <section id="avance" class="seccion" hidden>

            <div class="cabecera-seccion">
                <div>
                    <h2>Avance de emprendedores</h2>
                    <p>
                        Consulta el progreso de los participantes
                        en los programas de formación.
                    </p>
                </div>

                <span class="contador" id="cantidadAvances">0 registros</span>
            </div>

            <div class="panel panel-tabla">

                <div class="filtros">

                    <input type="search"
                           id="buscarAvance"
                           placeholder="Buscar emprendedor o negocio..."
                           aria-label="Buscar emprendedor">

                    <select id="filtroPrograma"
                            aria-label="Filtrar por programa">
                        <option value="">Todos los programas</option>
                    </select>

                    <select id="filtroProgreso"
                            aria-label="Filtrar por progreso">
                        <option value="">Todos los progresos</option>
                        <option value="sin-iniciar">Sin iniciar</option>
                        <option value="en-curso">En curso</option>
                        <option value="completado">Completado</option>
                    </select>

                </div>

                <div class="tabla-contenedor">
                    <table>
                        <thead>
                            <tr>
                                <th>EMPRENDEDOR</th>
                                <th>EMPRENDIMIENTO</th>
                                <th>PROGRAMA</th>
                                <th>PROGRESO</th>
                                <th>ESTADO</th>
                            </tr>
                        </thead>
                        <tbody id="tablaAvances"></tbody>
                    </table>
                </div>

                <p id="sinAvances" class="mensaje-vacio" hidden>
                    No se encontraron registros con esos filtros.
                </p>

            </div>
        </section>

        <!-- PROGRAMAS -->
        <section id="programas" class="seccion" hidden>

            <div class="cabecera-seccion">
                <div>
                    <h2>Programas de formación</h2>
                    <p>
                        Supervisa los programas, su estado
                        y la ocupación de sus cupos.
                    </p>
                </div>
            </div>

            <div class="filtros">

                <input type="search"
                       id="buscarPrograma"
                       placeholder="Buscar programa..."
                       aria-label="Buscar programa">

                <select id="filtroEstadoPrograma"
                        aria-label="Filtrar estado del programa">
                    <option value="">Todos los estados</option>
                    <option value="activo">Activos</option>
                    <option value="inactivo">Inactivos</option>
                    <option value="finalizado">Finalizados</option>
                </select>

            </div>

            <div id="cuadriculaProgramas" class="cuadricula-programas"></div>

            <p id="sinProgramas" class="mensaje-vacio" hidden>
                No se encontraron programas.
            </p>

        </section>

        <!-- NECESIDADES DE APOYO -->
        <section id="apoyos" class="seccion" hidden>

            <div class="cabecera-seccion">
                <div>
                    <h2>Necesidades de apoyo</h2>
                    <p>
                        Identifica los casos que necesitan
                        acompañamiento institucional.
                    </p>
                </div>

                <span class="contador" id="cantidadApoyos">0 casos</span>
            </div>

            <div class="panel">

                <div class="filtros">
                    <input type="search"
                           id="buscarApoyo"
                           placeholder="Buscar emprendedor..."
                           aria-label="Buscar casos de apoyo">
                </div>

                <div id="listaApoyos"></div>

                <p id="sinApoyos" class="mensaje-vacio" hidden>
                    No se encontraron necesidades de apoyo.
                </p>

            </div>
        </section>

        <!-- REPORTES -->
        <section id="reportes" class="seccion" hidden>

            <div class="cabecera-seccion">
                <div>
                    <h2>Reportes institucionales</h2>
                    <p>
                        Exporta información para apoyar
                        la toma de decisiones.
                    </p>
                </div>
            </div>

            <article class="tarjeta-reporte">
                <div>
                    <h3>Reporte: Emprendedores registrados</h3>
                    <p id="descripcionEmprendedores">
                        Información general de los emprendedores.
                    </p>
                </div>

                <button type="button"
                        class="boton-exportar"
                        data-reporte="emprendedores">
                    Exportar CSV
                </button>
            </article>

            <article class="tarjeta-reporte">
                <div>
                    <h3>Reporte: Sectores económicos</h3>
                    <p>
                        Distribución de emprendedores
                        por sector económico.
                    </p>
                </div>

                <button type="button"
                        class="boton-exportar"
                        data-reporte="sectores">
                    Exportar CSV
                </button>
            </article>

            <article class="tarjeta-reporte">
                <div>
                    <h3>Reporte: Programas de formación</h3>
                    <p>
                        Estado, duración, cupos e inscripciones
                        de cada programa.
                    </p>
                </div>

                <button type="button"
                        class="boton-exportar"
                        data-reporte="programas">
                    Exportar CSV
                </button>
            </article>

            <article class="tarjeta-reporte">
                <div>
                    <h3>Reporte: Avance de emprendedores</h3>
                    <p>
                        Porcentaje de progreso de los participantes.
                    </p>
                </div>

                <button type="button"
                        class="boton-exportar"
                        data-reporte="avances">
                    Exportar CSV
                </button>
            </article>

            <article class="tarjeta-reporte">
                <div>
                    <h3>Reporte: Necesidades de apoyo</h3>
                    <p>
                        Casos de acompañamiento y seguimiento institucional.
                    </p>
                </div>

                <button type="button"
                        class="boton-exportar"
                        data-reporte="apoyos">
                    Exportar CSV
                </button>
            </article>

            <p class="nota-demo">
                Los reportes se generan con datos de demostración.
                En la versión final se obtendrán desde la base de datos.
            </p>

        </section>

    </main>

    <!-- MENSAJES -->
    <div id="mensajeSistema"
         class="mensaje-sistema"
         role="status"
         hidden></div>

    <!-- FOOTER -->
    <footer class="footer">
        <div class="footer-marca">
            <span class="logo logo-amarillo">IL</span>
            <strong>Impulsa Local</strong>
        </div>

        <p>© 2026 Impulsa Local — Liseth Dayana Monroy Briñez</p>

        <div class="footer-enlaces">
            <a href="#" data-informativo="Términos">Términos</a>
            <a href="#" data-informativo="Privacidad">Privacidad</a>
            <a href="#" data-informativo="Contacto">Contacto</a>
        </div>
    </footer>

</body>
</html>
