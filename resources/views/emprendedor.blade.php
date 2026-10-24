
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Panel del emprendedor | Impulsa Local</title>

    <link rel="stylesheet" href="{{ asset('css/emprendedor.css') }}">
    <link rel="stylesheet" href="{{ asset('css/emprendedor-programas.css') }}">

    <style>
        [hidden] {
            display: none !important;
        }

        .il-panel {
            max-width: 1200px;
            margin: 24px auto;
            padding: 0 18px;
        }

        .il-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
        }

        .il-tarjeta {
            background: #fff;
            border: 1px solid #e3e8ef;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 18px;
        }

        .il-campo {
            margin-bottom: 14px;
        }

        .il-campo label {
            display: block;
            font-weight: 600;
            margin-bottom: 6px;
        }

        .il-campo input,
        .il-campo select {
            display: block;
            width: 100%;
            padding: 11px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            box-sizing: border-box;
        }

        .il-dato {
            color: #475569;
            overflow-wrap: anywhere;
        }

        .il-botones {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 16px;
        }

        .il-boton {
            padding: 11px 17px;
            border: 0;
            border-radius: 8px;
            background: #1c3b5c;
            color: #fff;
            cursor: pointer;
            font-weight: 600;
        }

        .il-boton.secundario {
            background: #e2e8f0;
            color: #172b4d;
        }

        .il-tabla {
            width: 100%;
            border-collapse: collapse;
        }

        .il-tabla th,
        .il-tabla td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
            text-align: left;
        }

        .il-scroll {
            overflow-x: auto;
        }

        .il-alerta {
            padding: 13px;
            border-radius: 8px;
            margin-bottom: 16px;
            background: #e8f7ed;
            color: #176534;
        }

        .il-error {
            background: #fff0f0;
            color: #9b1c1c;
        }

        .il-vacio {
            padding: 20px;
            color: #64748b;
            text-align: center;
        }

        .il-resumen {
            font-size: 25px;
            font-weight: 700;
            margin-top: 10px;
        }

        .il-modal {
            border: 0;
            border-radius: 12px;
            padding: 24px;
            width: min(520px, 90vw);
            max-height: 85vh;
            overflow-y: auto;
        }

        .il-modal::backdrop {
            background: rgba(0, 0, 0, .5);
        }

        .il-peligro {
            color: #b91c1c;
            font-weight: 600;
        }

        .btn-cerrar-sesion {
            background: transparent;
            border: 0;
            color: #64748b;
            cursor: pointer;
            font-size: 21px;
            padding: 6px;
        }

        .btn-cerrar-sesion:hover {
            color: #b91c1c;
        }

        #vista-perfil {
            max-width: 660px;
            margin: 0 auto;
        }

        #perfilLectura .il-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        #vista-progreso {
            max-width: 680px;
            margin: 0 auto;
        }

        @media (max-width: 600px) {
            #perfilLectura .il-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>

    <script>
        window.IMPULSA_USUARIO = {{ Illuminate\Support\Js::from([
            'id' => $usuarioActual->id,
            'nombre' => $usuarioActual->name,
            'correo' => $usuarioActual->email,
            'telefono' => $usuarioActual->telefono,
            'direccion' => $usuarioActual->direccion,
            'emprendimiento' => $usuarioActual->nombre_negocio,
            'actividad' => $usuarioActual->tipo_emprendimiento,
            'registro' => optional($usuarioActual->created_at)->format('Y-m-d'),
            'estado' => $usuarioActual->activo ? 'activo' : 'inactivo',
        ]) }};
    </script>

    <!-- Funcionalidades existentes -->
    <script src="{{ asset('js/emprendedor.js') }}" defer></script>

    <!-- Programas, inscripciones y progreso -->
    <script src="{{ asset('js/emprendedor-programas.js') }}" defer></script>
</head>

<body>

<header class="cabecera">
    <a href="{{ route('inicio') }}" class="marca">
        <span class="logo">IL</span>
        <strong>Impulsa Local</strong>
    </a>

    <div class="usuario">
        <div>
            <strong id="usuarioNombre">{{ $usuarioActual->name }}</strong>
            <small>Emprendedor</small>
        </div>

        <span class="etiqueta turquesa">emprendedor</span>

        <span class="avatar">
            {{ mb_strtoupper(mb_substr($usuarioActual->name, 0, 1)) }}
        </span>

        <form action="{{ route('logout') }}" method="POST">
            @csrf
            <button
                type="submit"
                class="btn-cerrar-sesion"
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
            >⎋</button>
        </form>
    </div>
</header>

<nav class="pestanas" aria-label="Menú del emprendedor">
    <button
        type="button"
        class="pestana activa"
        data-vista="perfil"
    >Mi perfil</button>

    <button
        type="button"
        class="pestana"
        data-vista="programas"
    >Programas</button>

    <button
        type="button"
        class="pestana"
        data-vista="progreso"
    >Mi progreso</button>

    <button
        type="button"
        class="pestana"
        data-vista="negocio"
    >Inventario y ventas</button>
</nav>

<main class="il-panel">

    @if(session('success'))
        <div class="il-alerta" role="status">
            {{ session('success') }}
        </div>
    @endif

    @if($errors->any())
        <div class="il-alerta il-error" role="alert">
            <strong>Revisa los siguientes datos:</strong>
            <ul>
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <!-- =====================================
         MI PERFIL
    ====================================== -->

    <section id="vista-perfil" class="vista activa">
        <div class="il-tarjeta">

            <div id="perfilLectura">
                <div class="cabecera-bloque">
                    <h2>Información personal</h2>

                    <button
                        type="button"
                        id="editarPerfil"
                        class="btn enlace"
                    >✎ Editar</button>
                </div>

                <div class="il-grid">

                    <div>
                        <strong>Nombre completo</strong>
                        <p class="il-dato">{{ $usuarioActual->name }}</p>
                    </div>

                    <div>
                        <strong>Correo electrónico</strong>
                        <p class="il-dato">{{ $usuarioActual->email }}</p>
                    </div>

                    <div>
                        <strong>Teléfono</strong>
                        <p class="il-dato">
                            {{ $usuarioActual->telefono ?: 'No registrado' }}
                        </p>
                    </div>

                    <div>
                        <strong>Dirección</strong>
                        <p class="il-dato">
                            {{ $usuarioActual->direccion ?: 'No registrada' }}
                        </p>
                    </div>

                    <div>
                        <strong>Emprendimiento</strong>
                        <p class="il-dato">
                            {{ $usuarioActual->nombre_negocio ?: 'No registrado' }}
                        </p>
                    </div>

                    <div>
                        <strong>Actividad económica</strong>
                        <p class="il-dato">
                            {{ $usuarioActual->tipo_emprendimiento ?: 'No registrada' }}
                        </p>
                    </div>

                    <div>
                        <strong>Fecha de registro</strong>
                        <p class="il-dato">
                            {{ $usuarioActual->created_at?->format('d/m/Y') ?: 'No disponible' }}
                        </p>
                    </div>

                    <div>
                        <strong>Estado</strong>
                        <p>
                            <span class="estado {{ $usuarioActual->activo ? 'activo' : 'inactivo' }}">
                                {{ $usuarioActual->activo ? 'Activo' : 'Inactivo' }}
                            </span>
                        </p>
                    </div>

                </div>
            </div>

            <!-- Formulario conectado a Laravel y SQLite -->

            <form
                id="perfilFormulario"
                method="POST"
                action="{{ route('emprendedor.perfil.actualizar') }}"
                hidden
            >
                @csrf
                @method('PUT')

                <h2>Editar mi información</h2>

                <div class="il-campo">
                    <label for="perfilNombre">Nombre completo</label>
                    <input
                        id="perfilNombre"
                        name="name"
                        value="{{ old('name', $usuarioActual->name) }}"
                        required
                        maxlength="255"
                    >
                </div>

                <div class="il-campo">
                    <label for="perfilCorreo">Correo electrónico</label>
                    <input
                        id="perfilCorreo"
                        type="email"
                        name="email"
                        value="{{ old('email', $usuarioActual->email) }}"
                        required
                        maxlength="255"
                    >
                </div>

                <div class="il-campo">
                    <label for="perfilTelefono">Teléfono</label>
                    <input
                        id="perfilTelefono"
                        name="telefono"
                        value="{{ old('telefono', $usuarioActual->telefono) }}"
                        required
                        maxlength="30"
                    >
                </div>

                <div class="il-campo">
                    <label for="perfilDireccion">Dirección</label>
                    <input
                        id="perfilDireccion"
                        name="direccion"
                        value="{{ old('direccion', $usuarioActual->direccion) }}"
                        required
                        maxlength="255"
                    >
                </div>

                <div class="il-campo">
                    <label for="perfilNegocio">Nombre del emprendimiento</label>
                    <input
                        id="perfilNegocio"
                        name="nombre_negocio"
                        value="{{ old('nombre_negocio', $usuarioActual->nombre_negocio) }}"
                        required
                        maxlength="255"
                    >
                </div>

                <div class="il-campo">
                    <label for="perfilActividad">Actividad económica</label>

                    <select
                        id="perfilActividad"
                        name="tipo_emprendimiento"
                        required
                    >
                        @foreach([
                            'Panadería / Repostería',
                            'Artesanías',
                            'Costura / Confección',
                            'Taller de reparaciones',
                            'Tienda de barrio',
                            'Restaurante / Comida',
                            'Servicios de belleza',
                            'Agricultura / Huerta',
                            'Servicios tecnológicos',
                            'Otro'
                        ] as $actividad)
                            <option
                                value="{{ $actividad }}"
                                @selected(
                                    old(
                                        'tipo_emprendimiento',
                                        $usuarioActual->tipo_emprendimiento
                                    ) === $actividad
                                )
                            >
                                {{ $actividad }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="il-botones">
                    <button type="submit" class="il-boton">
                        Guardar cambios
                    </button>

                    <button
                        type="button"
                        id="cancelarPerfil"
                        class="il-boton secundario"
                    >
                        Cancelar
                    </button>
                </div>
            </form>

        </div>
    </section>

    <!-- =====================================
         PROGRAMAS
         El JS complementario genera las
         tarjetas, filtros e inscripciones.
    ====================================== -->

    <section id="vista-programas" class="vista" hidden>

        <div class="il-tarjeta bloque">
            <h2 id="tituloInscripciones">Mis inscripciones (0)</h2>

            <p class="nota-demostracion">
                Inscripciones de demostración guardadas en este navegador.
            </p>

            <div id="inscripciones">
                <p class="il-vacio">
                    Todavía no tienes inscripciones.
                </p>
            </div>
        </div>

        <div class="filtros">
            <h3>Programas disponibles</h3>

            <select id="filtroTematica">
                <option value="">Todas las temáticas</option>
                <option value="Administración">Administración</option>
                <option value="Marketing">Marketing</option>
                <option value="Finanzas">Finanzas</option>
                <option value="Servicio al cliente">Servicio al cliente</option>
            </select>

            <select id="filtroEstado">
                <option value="">Todos los estados</option>
                <option value="activo">Activos</option>
                <option value="finalizado">Finalizados</option>
            </select>
        </div>

        <div id="catalogoProgramas" class="cuadricula"></div>
    </section>

    <!-- =====================================
         MI PROGRESO
    ====================================== -->

    <section id="vista-progreso" class="vista" hidden>
        <div class="columna-central">

            <div class="il-tarjeta bloque">
                <h2>Mi progreso en programas</h2>

                <p class="nota-demostracion">
                    Avances simulados para demostrar el funcionamiento.
                </p>

                <div id="detalleProgreso">
                    <p class="il-vacio">
                        Inscríbete en un programa para comenzar.
                    </p>
                </div>
            </div>

            <div class="il-tarjeta bloque">
                <h2>Mis seguimientos</h2>

                <div id="seguimientos">
                    <p class="il-vacio">
                        No tienes seguimientos registrados.
                        Los seguimientos oficiales requieren conexión
                        con la base de datos.
                    </p>
                </div>
            </div>

        </div>
    </section>

    <!-- =====================================
         INVENTARIO Y VENTAS
    ====================================== -->

    <section id="vista-negocio" class="vista" hidden>

        <div class="il-tarjeta">
            <h2>Inventario y ventas</h2>

            <p>
                Gestiona los productos y las ventas de tu emprendimiento.
            </p>

            <p class="il-dato">
                Los datos de este módulo se guardan localmente
                en este navegador, separados por cuenta.
            </p>

            <div class="il-botones">
                <button
                    type="button"
                    class="il-boton"
                    data-negocio="inventario"
                >
                    📦 Inventario
                </button>

                <button
                    type="button"
                    class="il-boton secundario"
                    data-negocio="ventas"
                >
                    💰 Ventas
                </button>
            </div>
        </div>

        <!-- INVENTARIO -->

        <div id="negocio-inventario">

            <div class="il-grid">

                <div class="il-tarjeta">
                    <small>PRODUCTOS REGISTRADOS</small>
                    <div class="il-resumen" id="totalProductos">0</div>
                </div>

                <div class="il-tarjeta">
                    <small>VALOR DEL INVENTARIO</small>
                    <div class="il-resumen" id="valorInventario">$ 0</div>
                </div>

                <div class="il-tarjeta">
                    <small>VALOR POTENCIAL DE VENTA</small>
                    <div class="il-resumen" id="valorPotencial">$ 0</div>
                </div>

                <div class="il-tarjeta">
                    <small>PRODUCTOS CON STOCK BAJO</small>
                    <div class="il-resumen" id="cantidadBajo">0</div>
                </div>

            </div>

            <div class="il-tarjeta">

                <h3>Mis productos</h3>

                <div class="il-botones">

                    <input
                        id="buscarProducto"
                        type="search"
                        placeholder="Buscar producto..."
                        style="padding:10px;flex:1"
                    >

                    <button
                        type="button"
                        id="exportarInventario"
                        class="il-boton secundario"
                    >
                        Exportar CSV
                    </button>

                    <button
                        type="button"
                        id="nuevoProducto"
                        class="il-boton"
                    >
                        + Nuevo producto
                    </button>

                </div>

                <div class="il-scroll">
                    <table class="il-tabla">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>P. compra</th>
                                <th>P. venta</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>

                        <tbody id="filasInventario"></tbody>
                    </table>
                </div>

                <p id="sinProductos" class="il-vacio">
                    Todavía no has registrado productos.
                </p>

            </div>
        </div>

        <!-- VENTAS -->

        <div id="negocio-ventas" hidden>

            <div class="il-grid">

                <div class="il-tarjeta">
                    <small>VENTAS HOY</small>
                    <div class="il-resumen" id="ventasHoy">$ 0</div>
                </div>

                <div class="il-tarjeta">
                    <small>VENTAS ESTA SEMANA</small>
                    <div class="il-resumen" id="ventasSemana">$ 0</div>
                </div>

                <div class="il-tarjeta">
                    <small>VENTAS ESTE MES</small>
                    <div class="il-resumen" id="ventasMes">$ 0</div>
                </div>

            </div>

            <div class="il-tarjeta">

                <h3>Historial de ventas</h3>

                <div class="il-botones">

                    <button
                        type="button"
                        id="exportarVentas"
                        class="il-boton secundario"
                    >
                        Exportar ventas
                    </button>

                    <button
                        type="button"
                        id="nuevaVenta"
                        class="il-boton"
                    >
                        + Registrar venta
                    </button>

                </div>

                <div class="il-scroll">
                    <table class="il-tabla">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody id="filasVentas"></tbody>
                    </table>
                </div>

                <p id="sinVentas" class="il-vacio">
                    Todavía no has registrado ventas.
                </p>

            </div>
        </div>

    </section>

</main>

<!-- =====================================
     MODAL PRODUCTO
====================================== -->

<dialog id="modalProducto" class="il-modal">
    <form id="formProducto">

        <h2 id="tituloModalProducto">Nuevo producto</h2>

        <input type="hidden" name="producto_id">

        <div class="il-campo">
            <label for="productoNombre">Nombre del producto</label>
            <input
                id="productoNombre"
                name="nombre"
                required
                maxlength="100"
            >
        </div>

        <div class="il-campo">
            <label for="productoCodigo">Código</label>
            <input
                id="productoCodigo"
                name="codigo"
                required
                maxlength="30"
            >
        </div>

        <div class="il-campo">
            <label for="productoCategoria">Categoría</label>
            <input
                id="productoCategoria"
                name="categoria"
                required
                maxlength="100"
            >
        </div>

        <div class="il-campo">
            <label for="productoCompra">Precio de compra</label>
            <input
                id="productoCompra"
                name="compra"
                type="number"
                min="0"
                step="1"
                required
            >
        </div>

        <div class="il-campo">
            <label for="productoVentaPrecio">Precio de venta</label>
            <input
                id="productoVentaPrecio"
                name="venta"
                type="number"
                min="0"
                step="1"
                required
            >
        </div>

        <div class="il-campo">
            <label for="productoStock">Unidades en stock</label>
            <input
                id="productoStock"
                name="stock"
                type="number"
                min="0"
                step="1"
                required
            >
        </div>

        <div class="il-botones">
            <button type="submit" class="il-boton">
                Guardar producto
            </button>

            <button
                type="button"
                class="il-boton secundario"
                data-cerrar="modalProducto"
            >
                Cancelar
            </button>
        </div>

    </form>
</dialog>

<!-- =====================================
     MODAL VENTA
====================================== -->

<dialog id="modalVenta" class="il-modal">
    <form id="formVenta">

        <h2>Registrar venta</h2>

        <div class="il-campo">
            <label for="fechaVenta">Fecha</label>
            <input
                id="fechaVenta"
                type="date"
                name="fecha"
                required
            >
        </div>

        <div class="il-campo">
            <label for="productoVenta">Producto</label>
            <select
                id="productoVenta"
                name="producto_id"
                required
            ></select>
        </div>

        <div class="il-campo">
            <label for="cantidadVenta">Cantidad</label>
            <input
                id="cantidadVenta"
                type="number"
                name="cantidad"
                min="1"
                step="1"
                required
            >
        </div>

        <div class="il-botones">
            <button type="submit" class="il-boton">
                Registrar venta
            </button>

            <button
                type="button"
                class="il-boton secundario"
                data-cerrar="modalVenta"
            >
                Cancelar
            </button>
        </div>

    </form>
</dialog>

<!-- Mensajes del sistema -->

<div
    id="mensajeSistema"
    role="status"
    aria-live="polite"
    style="max-width:1200px;margin:12px auto"
></div>

<footer style="text-align:center;padding:25px">
    © 2026 Impulsa Local
</footer>

</body>
</html>
