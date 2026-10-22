
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administrador | Impulsa Local</title>

    <link rel="stylesheet" href="{{ asset('css/administrador.css') }}">
    <script src="{{ asset('js/administrador.js') }}" defer></script>
</head>
<body>

    <!-- ENCABEZADO -->
    <header class="encabezado">
        <a href="{{ route('inicio') }}" class="marca">
            <span class="marca-icono">IL</span>
            <strong>Impulsa Local</strong>
        </a>

        <div class="perfil">
            <div class="perfil-datos">
                <strong>Carlos Administrador</strong>
                <small>Administrador del sistema</small>
            </div>
            <span class="etiqueta rol">administrador</span>
            <span class="avatar">C</span>
            <a href="{{ route('inicio') }}" class="salir" title="Volver al inicio">⇥</a>
        </div>
    </header>

    <!-- NAVEGACIÓN -->
    <nav class="navegacion">
        <button class="pestana activa" data-tab="emprendedores">👥 Emprendedores</button>
        <button class="pestana" data-tab="programas">📚 Programas</button>
        <button class="pestana" data-tab="reportes">📊 Reportes</button>
        <button class="pestana" data-tab="usuarios">🔐 Usuarios</button>
    </nav>

    <main class="contenido">

        <!-- EMPRENDEDORES -->
        <section id="emprendedores" class="panel activo">
            <div class="filtros">
                <input id="buscarEmprendedor" type="search"
                    placeholder="Buscar por nombre, emprendimiento, actividad o ubicación...">

                <select id="filtroActividad">
                    <option value="">Todas las actividades</option>
                    <option>Panadería / Repostería</option>
                    <option>Artesanías</option>
                    <option>Costura / Confección</option>
                    <option>Taller de reparaciones</option>
                    <option>Tienda de barrio</option>
                    <option>Restaurante / Comida</option>
                </select>

                <select id="filtroEstadoEmprendedor">
                    <option value="">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                </select>
            </div>

            <p id="conteoEmprendedores" class="texto-secundario">
                6 emprendedor(es) encontrado(s)
            </p>

            <div class="tabla-contenedor">
                <table>
                    <thead>
                        <tr>
                            <th>EMPRENDEDOR</th>
                            <th>EMPRENDIMIENTO</th>
                            <th>ACTIVIDAD</th>
                            <th>TELÉFONO</th>
                            <th>ESTADO</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody id="tablaEmprendedores"></tbody>
                </table>
            </div>
        </section>

        <!-- PROGRAMAS -->
        <section id="programas" class="panel">
            <div class="barra-programas">
                <div class="filtros">
                    <select id="filtroTematica">
                        <option value="">Todas las temáticas</option>
                        <option>Estrategia</option>
                        <option>Marketing</option>
                        <option>Finanzas</option>
                        <option>Liderazgo</option>
                        <option>Ventas</option>
                    </select>

                    <select id="filtroEstadoPrograma">
                        <option value="">Todos los estados</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="finalizado">Finalizado</option>
                    </select>
                </div>

                <button id="nuevoPrograma" class="boton-primario">
                    + Nuevo programa
                </button>
            </div>

            <div id="listaProgramas" class="cuadricula-programas"></div>
        </section>

        <!-- REPORTES -->
        <section id="reportes" class="panel">
            <div class="tarjetas-estadisticas">
                <article class="tarjeta-estadistica">
                    <strong id="totalActivos" class="numero verde">0</strong>
                    <span>✅ Emprendedores activos</span>
                </article>

                <article class="tarjeta-estadistica">
                    <strong id="totalRegistrados" class="numero">0</strong>
                    <span>👥 Total registrados</span>
                </article>

                <article class="tarjeta-estadistica">
                    <strong id="totalProgramasActivos" class="numero azul">0</strong>
                    <span>📚 Programas activos</span>
                </article>

                <article class="tarjeta-estadistica">
                    <strong id="totalInscripciones" class="numero naranja">0</strong>
                    <span>📝 Total inscripciones</span>
                </article>
            </div>

            <div class="cuadricula-reportes">
                <article class="tarjeta">
                    <div class="tarjeta-titulo">
                        <h3>Sectores más frecuentes</h3>
                        <button id="exportarSectores" class="enlace-accion">Exportar CSV</button>
                    </div>
                    <div id="reporteSectores"></div>
                </article>

                <article class="tarjeta">
                    <div class="tarjeta-titulo">
                        <h3>Programas más solicitados</h3>
                        <button id="exportarProgramas" class="enlace-accion">Exportar CSV</button>
                    </div>
                    <div id="reporteProgramas"></div>
                </article>
            </div>

            <article class="tarjeta reporte-final">
                <div class="tarjeta-titulo">
                    <h3>Reporte: Emprendedores activos</h3>
                    <button id="exportarTodo" class="boton-primario">
                        Exportar todo (CSV)
                    </button>
                </div>
                <div id="resumenEmprendedores" class="resumen-numeros"></div>
            </article>
        </section>

        <!-- USUARIOS -->
        <section id="usuarios" class="panel">
            <div class="tabla-contenedor">
                <table>
                    <thead>
                        <tr>
                            <th>NOMBRE</th>
                            <th>CORREO</th>
                            <th>ROL</th>
                            <th>ESTADO</th>
                        </tr>
                    </thead>
                    <tbody id="tablaUsuarios"></tbody>
                </table>
            </div>
        </section>

    </main>

    <!-- MODAL PARA CREAR Y EDITAR PROGRAMAS -->
    <div id="modalPrograma" class="modal" hidden>
        <div class="modal-contenido">
            <h2 id="tituloModal">Nuevo programa</h2>

            <form id="formularioPrograma">
                <input type="hidden" id="programaId">

                <label for="nombrePrograma">NOMBRE</label>
                <input id="nombrePrograma" type="text"
                    placeholder="Nombre del programa" required>

                <label for="instructorPrograma">INSTRUCTOR</label>
                <input id="instructorPrograma" type="text"
                    placeholder="Nombre del instructor" required>

                <label for="duracionPrograma">DURACIÓN</label>
                <input id="duracionPrograma" type="text"
                    placeholder="Ej: 6 semanas" required>

                <label for="fechaPrograma">FECHA DE INICIO</label>
                <input id="fechaPrograma" type="date" required>

                <label for="tematicaPrograma">TEMÁTICA</label>
                <select id="tematicaPrograma" required>
                    <option>Estrategia</option>
                    <option>Marketing</option>
                    <option>Finanzas</option>
                    <option>Liderazgo</option>
                    <option>Ventas</option>
                </select>

                <label for="cuposPrograma">CUPOS</label>
                <input id="cuposPrograma" type="number"
                    min="1" value="20" required>

                <label for="estadoPrograma">ESTADO</label>
                <select id="estadoPrograma">
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="finalizado">Finalizado</option>
                </select>

                <label for="descripcionPrograma">DESCRIPCIÓN</label>
                <textarea id="descripcionPrograma" rows="3" required></textarea>

                <div class="acciones-modal">
                    <button type="button" id="cancelarPrograma" class="boton-cancelar">
                        Cancelar
                    </button>
                    <button type="submit" class="boton-primario">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- MODAL DE DETALLE DEL EMPRENDEDOR -->
    <div id="modalEmprendedor" class="modal" hidden>
        <div class="modal-contenido">
            <h2>Información del emprendedor</h2>
            <div id="detalleEmprendedor"></div>
            <div class="acciones-modal">
                <button id="cerrarEmprendedor" class="boton-primario">
                    Cerrar
                </button>
            </div>
        </div>
    </div>

    <!-- FOOTER INSTITUCIONAL -->
    <footer class="pie-pagina">
        <div class="pie-contenido">
            <div class="marca">
                <span class="marca-icono">IL</span>
                <strong>Impulsa Local</strong>
            </div>

            <p>© 2026 Impulsa Local — Liseth Dayana Monroy Briñez</p>

            <div class="enlaces-pie">
                <a href="#">Términos</a>
                <a href="#">Privacidad</a>
                <a href="#">Contacto</a>
            </div>
        </div>
    </footer>

</body>
</html>
