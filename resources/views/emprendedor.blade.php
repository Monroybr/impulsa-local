
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Emprendedor | Impulsa Local</title>
    <link rel="stylesheet" href="{{ asset('css/emprendedor.css') }}">
    
    <script src="{{ asset('js/impulsa-datos.js') }}" defer></script>
    <script src="{{ asset('js/emprendedor.js') }}" defer></script>
    
</head>
<body>
    <header class="cabecera">
        <div class="marca">
            <span class="logo">IL</span>
            <strong>Impulsa Local</strong>
        </div>
        <div class="usuario">
            <div>
                <strong id="usuarioNombre">María García</strong>
                <small>Emprendedor</small>
            </div>
            <span class="etiqueta turquesa">emprendedor</span>
            <span class="avatar">M</span>
            <a href="/" aria-label="Salir" title="Salir">⇥</a>
        </div>
    </header>

    <nav class="pestanas" aria-label="Menú emprendedor">
        <button class="pestana activa" data-vista="perfil">
            ♟ &nbsp; Mi perfil
        </button>
        <button class="pestana" data-vista="programas">
            📚 &nbsp; Programas
        </button>
        <button class="pestana" data-vista="progreso">
            📈 &nbsp; Mi progreso
        </button>
        <button class="pestana" data-vista="negocio">
            📦 &nbsp; Inventario y ventas
        </button>
    </nav>

    <main>
        <!-- MI PERFIL -->
        <section id="vista-perfil" class="vista activa">
            <div class="tarjeta perfil">
                <div id="perfilLectura"></div>

                <form id="perfilFormulario" hidden>
                    <h2>Información personal</h2>

                    <label>
                        Nombre del emprendimiento
                        <input name="emprendimiento" required maxlength="100">
                    </label>

                    <label>
                        Teléfono
                        <input name="telefono" required maxlength="20">
                    </label>

                    <label>
                        Dirección
                        <input name="direccion" required maxlength="150">
                    </label>

                    <label>
                        Actividad económica
                        <select name="actividad" id="actividadSelect"></select>
                    </label>

                    <div class="acciones">
                        <button type="button" class="btn texto"
                                id="cancelarPerfil">Cancelar</button>
                        <button class="btn primario" type="submit">
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        </section>

        <!-- PROGRAMAS -->
        <section id="vista-programas" class="vista">
            <div class="tarjeta bloque">
                <h3 id="tituloInscripciones">Mis inscripciones</h3>
                <div id="inscripciones"></div>
            </div>

            <div class="filtros">
                <h3>Programas disponibles</h3>

                <select id="filtroTematica"
                        aria-label="Filtrar por temática">
                    <option value="">Todas las temáticas</option>
                </select>

                <select id="filtroEstado"
                        aria-label="Filtrar por estado">
                    <option value="">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="finalizado">Finalizado</option>
                </select>
            </div>

            <div id="programasDisponibles" class="cuadricula"></div>
        </section>

        
        <!-- MI PROGRESO -->
        <section id="vista-progreso" class="vista">
            <div class="columna-central">

                <!-- PROGRESO EN PROGRAMAS -->
                <div class="tarjeta bloque">
                    <h3>Mi progreso en programas</h3>
                    <div id="detalleProgreso"></div>
                </div>

                <!-- REPORTAR AVANCES -->
                <div class="tarjeta bloque">
                    <div class="cabecera-bloque">
                        <div>
                            <h3>Mis reportes de avance</h3>
                            <p class="descripcion-avance">
                                Comparte tus logros, dificultades y
                                necesidades de apoyo con el programa
                                Impulsa Local.
                            </p>
                        </div>

                        <button
                            type="button"
                            id="abrirReporteAvance"
                            class="btn primario">
                            + Reportar avance
                        </button>
                    </div>

                    <div id="historialAvances"></div>
                </div>

                <!-- SEGUIMIENTOS -->
                <div class="tarjeta bloque">
                    <h3 id="tituloSeguimientos">Mis seguimientos (2)</h3>
                    <div id="seguimientos"></div>
                </div>

            </div>
        </section>


        <!-- INVENTARIO Y VENTAS -->
        <section id="vista-negocio" class="vista">
            <nav class="subpestanas">
                <button class="subpestana activa"
                        data-negocio="inventario">
                    📦 &nbsp; Inventario
                </button>
                <button class="subpestana" data-negocio="ventas">
                    💰 &nbsp; Ventas
                </button>
            </nav>

            <!-- INVENTARIO -->
            <div id="negocio-inventario">
                <div class="indicadores cuatro">
                    <div class="tarjeta indicador">
                        <small>PRODUCTOS REGISTRADOS</small>
                        <strong id="totalProductos">0</strong>
                    </div>

                    <div class="tarjeta indicador">
                        <small>VALOR DEL INVENTARIO</small>
                        <strong class="azul" id="valorInventario"></strong>
                        <small>a precio de compra</small>
                    </div>

                    <div class="tarjeta indicador">
                        <small>VALOR POTENCIAL</small>
                        <strong class="verde" id="valorPotencial"></strong>
                        <small>a precio de venta</small>
                    </div>

                    <div class="tarjeta indicador">
                        <small>STOCK BAJO (≤10 UND.)</small>
                        <strong class="rojo" id="cantidadBajo"></strong>
                        <small>Requiere atención</small>
                    </div>
                </div>

                <div id="alertasStock"></div>

                <div class="barra-acciones">
                    <input id="buscarProducto"
                           placeholder="Buscar por nombre, código o categoría..."
                           aria-label="Buscar producto">

                    <button id="exportarInventario" class="btn secundario">
                        Exportar CSV
                    </button>

                    <button id="nuevoProducto" class="btn primario">
                        + Nuevo producto
                    </button>
                </div>

                <div class="tarjeta tabla-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>CÓDIGO</th>
                                <th>NOMBRE</th>
                                <th>CATEGORÍA</th>
                                <th>P. COMPRA</th>
                                <th>P. VENTA</th>
                                <th>MARGEN</th>
                                <th>STOCK</th>
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody id="filasInventario"></tbody>
                    </table>
                </div>
            </div>

            <!-- VENTAS -->
            <div id="negocio-ventas" hidden>
                <div class="indicadores tres">
                    <div class="tarjeta indicador">
                        <small>VENTAS HOY</small>
                        <strong class="verde" id="ventasHoy"></strong>
                        <small id="registrosHoy"></small>
                    </div>

                    <div class="tarjeta indicador">
                        <small>VENTAS ESTA SEMANA</small>
                        <strong class="azul" id="ventasSemana"></strong>
                        <small id="registrosSemana"></small>
                    </div>

                    <div class="tarjeta indicador">
                        <small>VENTAS ESTE MES</small>
                        <strong id="ventasMes"></strong>
                        <small id="registrosMes"></small>
                    </div>
                </div>

                <div class="barra-acciones entre">
                    <div class="selector-periodo">
                        <button data-periodo="hoy" class="activo">Hoy</button>
                        <button data-periodo="semana">Esta semana</button>
                        <button data-periodo="mes">Este mes</button>
                    </div>

                    <div>
                        <button id="exportarVentas" class="btn secundario">
                            Exportar reporte
                        </button>
                        <button id="nuevaVenta" class="btn primario">
                            + Registrar venta
                        </button>
                    </div>
                </div>

                <div class="tarjeta bloque">
                    <div class="cabecera-bloque">
                        <h3 id="tituloVentas"></h3>
                        <div class="resumen-ventas">
                            <strong id="totalPeriodo"></strong>
                            <small id="cantidadPeriodo"></small>
                        </div>
                    </div>
                    <div id="graficoVentas"></div>
                </div>

                <div class="tarjeta bloque">
                    <h3>Productos más vendidos en el período</h3>
                    <div id="masVendidos"></div>
                </div>
            </div>
        </section>
    </main>

    <!-- MODAL REPORTAR AVANCE -->
    <dialog id="modalReporteAvance">
        <form id="formReporteAvance" class="form-modal">

            <h3>Reportar avance de mi emprendimiento</h3>

            <p class="descripcion-avance">
                Registra los avances que has tenido durante
                tu participación en los programas de formación.
            </p>

            <label>
                Programa de formación
                <select
                    id="programaReporte"
                    name="programa"
                    required>
                    <option value="">Selecciona un programa</option>
                </select>
            </label>

            <label>
                Fecha del reporte
                <input
                    type="date"
                    id="fechaReporte"
                    name="fecha"
                    required>
            </label>

            <label>
                Avances o logros obtenidos
                <textarea
                    id="logrosReporte"
                    name="logros"
                    rows="4"
                    maxlength="1000"
                    placeholder="Describe los avances que has conseguido..."
                    required></textarea>
            </label>

            <label>
                Dificultades presentadas
                <textarea
                    id="dificultadesReporte"
                    name="dificultades"
                    rows="3"
                    maxlength="1000"
                    placeholder="Describe las dificultades que has tenido..."
                    required></textarea>
            </label>

            <label>
                Apoyo que necesitas
                <textarea
                    id="apoyoReporte"
                    name="apoyo"
                    rows="3"
                    maxlength="1000"
                    placeholder="Indica qué apoyo necesitas para continuar..."
                    required></textarea>
            </label>

            <div class="acciones">
                <button
                    type="button"
                    id="cancelarReporteAvance"
                    class="btn texto">
                    Cancelar
                </button>

                <button
                    type="submit"
                    class="btn primario">
                    Guardar reporte
                </button>
            </div>

        </form>
    </dialog>

    <!-- MODAL NUEVO PRODUCTO -->
    <dialog id="modalProducto">
        <form id="formProducto" class="form-modal">
            <h3 id="tituloModalProducto">Nuevo producto</h3>

            <label>
                Nombre del producto
                <input name="nombre" required
                       placeholder="Ej: Pan de trigo" maxlength="100">
            </label>

            <div class="dos">
                <label>
                    Código
                    <input name="codigo" required
                           placeholder="Ej: PAN-001" maxlength="30">
                </label>

                <label>
                    Categoría
                    <select name="categoria" id="categoriaProducto"></select>
                </label>
            </div>

            <div class="dos">
                <label>
                    Precio de compra (COP)
                    <input type="number" name="compra"
                           min="0" step="1" required>
                </label>

                <label>
                    Precio de venta (COP)
                    <input type="number" name="venta"
                           min="0" step="1" required>
                </label>
            </div>

            <label>
                Unidades en stock
                <input type="number" name="stock"
                       min="0" step="1" required>
            </label>

            <div class="acciones">
                <button type="button" class="btn texto"
                        data-cerrar="modalProducto">Cancelar</button>
                <button class="btn primario" type="submit">
                    Guardar producto
                </button>
            </div>
        </form>
    </dialog>

    <!-- MODAL REGISTRAR VENTA -->
    <dialog id="modalVenta">
        <form id="formVenta" class="form-modal">
            <h3>Registrar venta</h3>

            <div class="dos">
                <label>
                    Fecha
                    <input type="date" name="fecha" required>
                </label>

                <label>
                    Nota (opcional)
                    <input name="nota" placeholder="Ej: Venta mañana"
                           maxlength="100">
                </label>
            </div>

            <div class="cabecera-bloque">
                <label>PRODUCTOS VENDIDOS</label>
                <button type="button" class="btn enlace"
                        id="agregarLinea">
                    + Agregar producto
                </button>
            </div>

            <div id="lineasVenta"></div>

            <div class="total-modal">
                <strong>Total de la venta</strong>
                <strong id="totalNuevaVenta">$ 0</strong>
            </div>

            <div class="acciones">
                <button type="button" class="btn texto"
                        data-cerrar="modalVenta">Cancelar</button>
                <button class="btn primario" type="submit">
                    Registrar venta
                </button>
            </div>
        </form>
    </dialog>

    <div id="mensaje" role="status" aria-live="polite"></div>
</body>
</html>
