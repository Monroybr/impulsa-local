
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Administrador | Impulsa Local</title>

    <link rel="stylesheet" href="{{ asset('css/administrador.css') }}">

    <script src="{{ asset('js/administrador.js') }}" defer></script>
    <script src="{{ asset('js/impulsa-datos.js') }}" defer></script>

    <style>
        /* ENCABEZADO DE USUARIOS */
        .encabezado-usuarios {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            margin-bottom: 20px;
        }

        .encabezado-usuarios h2 {
            margin: 0;
            font-size: 20px;
        }

        /* BOTÓN AGREGAR USUARIO */
        #nuevoUsuario {
            width: auto !important;
            height: auto !important;
            min-height: 38px;
            padding: 10px 16px !important;
            font-size: 12px;
            border-radius: 9px;
            flex: 0 0 auto;
            align-self: center;
        }

        /* CONTROLES DE ESTADO */
        .controles-estado {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
        }

        .controles-estado form {
            margin: 0;
        }

        .boton-estado {
            border: none;
            border-radius: 7px;
            padding: 7px 12px;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
        }

        .boton-estado.desactivar {
            background: #ffe3e6;
            color: #b91c32;
        }

        .boton-estado.activar {
            background: #d9fae6;
            color: #008d42;
        }

        .boton-estado:hover {
            filter: brightness(0.95);
        }

        .sin-usuarios {
            text-align: center;
            padding: 25px;
            color: #8994a8;
        }

        /* MENSAJES */
        .alerta-exito {
            padding: 14px;
            margin: 15px 0;
            background: #e7f6ec;
            border: 1px solid #a5d6b4;
            border-radius: 9px;
            color: #21643b;
        }

        .alerta-error {
            padding: 14px;
            margin: 15px 0;
            background: #fff1f0;
            border: 1px solid #f2b8b5;
            border-radius: 9px;
            color: #a12622;
        }

        /* FORMULARIO DE USUARIOS */
        #modalUsuario .modal-contenido {
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
        }

        #modalUsuario label {
            display: block;
            margin-top: 15px;
            margin-bottom: 7px;
            font-size: 12px;
            font-weight: bold;
            color: #1b3959;
        }

        #modalUsuario input,
        #modalUsuario select {
            width: 100%;
            padding: 12px;
            border: 1px solid #dce1e8;
            border-radius: 9px;
            font-size: 14px;
            box-sizing: border-box;
        }

        #modalUsuario input:focus,
        #modalUsuario select:focus {
            outline: 2px solid #28609c;
        }

        #modalUsuario .acciones-modal button {
            width: auto;
        }

        /* BOTÓN CERRAR SESIÓN */
        .perfil form {
            margin: 0;
        }

        .perfil .salir {
            cursor: pointer;
            font: inherit;
            border: none;
            background: transparent;
        }

        @media (max-width: 600px) {
            .encabezado-usuarios {
                flex-direction: column;
                align-items: flex-start;
            }

            #nuevoUsuario {
                align-self: flex-start;
            }
        }
    </style>
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
                <strong>{{ auth()->user()->name }}</strong>
                <small>Administrador del sistema</small>
            </div>

            <span class="etiqueta rol">
                administrador
            </span>

            <span class="avatar">
                {{ strtoupper(substr(auth()->user()->name, 0, 1)) }}
            </span>

            <form action="{{ route('logout') }}" method="POST">
                @csrf

                <button type="submit"
                        class="salir"
                        title="Cerrar sesión">
                    ⇥
                </button>
            </form>

        </div>
    </header>

    <!-- NAVEGACIÓN -->
    <nav class="navegacion">

        <button type="button"
                class="pestana activa"
                data-tab="emprendedores">
            👥 Emprendedores
        </button>

        <button type="button"
                class="pestana"
                data-tab="programas">
            📚 Programas
        </button>

        <button type="button"
                class="pestana"
                data-tab="reportes">
            📊 Reportes
        </button>

        <button type="button"
                class="pestana"
                data-tab="usuarios">
            🔐 Usuarios
        </button>

    </nav>

    <main class="contenido">

        <!-- EMPRENDEDORES -->
        <section id="emprendedores" class="panel activo">

            <div class="filtros">

                <input id="buscarEmprendedor"
                       type="search"
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
                0 emprendedor(es) encontrado(s)
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

                <button type="button"
                        id="nuevoPrograma"
                        class="boton-primario">
                    + Nuevo programa
                </button>

            </div>

            <div id="listaProgramas"
                 class="cuadricula-programas"></div>

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

                        <button type="button"
                                id="exportarSectores"
                                class="enlace-accion">
                            Exportar CSV
                        </button>
                    </div>

                    <div id="reporteSectores"></div>

                </article>

                <article class="tarjeta">

                    <div class="tarjeta-titulo">
                        <h3>Programas más solicitados</h3>

                        <button type="button"
                                id="exportarProgramas"
                                class="enlace-accion">
                            Exportar CSV
                        </button>
                    </div>

                    <div id="reporteProgramas"></div>

                </article>

            </div>

            <article class="tarjeta reporte-final">

                <div class="tarjeta-titulo">
                    <h3>Reporte: Emprendedores activos</h3>

                    <button type="button"
                            id="exportarTodo"
                            class="boton-primario">
                        Exportar todo (CSV)
                    </button>
                </div>

                <div id="resumenEmprendedores"
                     class="resumen-numeros"></div>

            </article>

        </section>

        <!-- GESTIÓN DE USUARIOS -->
        <section id="usuarios" class="panel">

            <div class="encabezado-usuarios">

                <div>
                    <h2>Gestión de usuarios</h2>

                    <p class="texto-secundario">
                        Administra las cuentas y asigna los roles
                        de acceso a la plataforma.
                    </p>
                </div>

                <button type="button"
                        id="nuevoUsuario"
                        class="boton-primario">
                    + Agregar usuario
                </button>

            </div>

            @if (session('success'))
                <div class="alerta-exito">
                    {{ session('success') }}
                </div>
            @endif

            @if (session('error'))
                <div class="alerta-error">
                    {{ session('error') }}
                </div>
            @endif

            @if ($errors->any())
                <div class="alerta-error">
                    <strong>No se pudo completar la solicitud:</strong>

                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

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

                    <!--
                        La tabla se llena con los usuarios
                        reales guardados en SQLite.
                    -->
                    <tbody id="tablaUsuarios"></tbody>

                </table>

            </div>

        </section>

    </main>

    <!-- DATOS REALES DE SQLITE -->
    <template id="usuariosDesdeServidor">

        @forelse ($usuariosReales as $usuario)

            <tr>

                <td>
                    {{ $usuario->name }}
                </td>

                <td>
                    {{ $usuario->email }}
                </td>

                <td>
                    <span class="etiqueta rol">
                        {{ $usuario->rol }}
                    </span>
                </td>

                <td>

                    <div class="controles-estado">

                        <span class="estado {{ $usuario->activo ? 'activo' : 'inactivo' }}">
                            {{ $usuario->activo ? 'Activo' : 'Inactivo' }}
                        </span>

                        @if ($usuario->id !== auth()->id())

                            <form method="POST"
                                  action="{{ route('administrador.usuarios.estado', $usuario->id) }}"
                                  onsubmit="return confirm('¿Deseas cambiar el estado de este usuario?');">

                                @csrf
                                @method('PATCH')

                                <button type="submit"
                                        class="boton-estado {{ $usuario->activo ? 'desactivar' : 'activar' }}">

                                    {{ $usuario->activo ? 'Desactivar' : 'Activar' }}

                                </button>

                            </form>

                        @else

                            <small>Tu cuenta</small>

                        @endif

                    </div>

                </td>

            </tr>

        @empty

            <tr>
                <td colspan="4" class="sin-usuarios">
                    No hay usuarios registrados.
                </td>
            </tr>

        @endforelse

    </template>

    <!-- MODAL PARA PROGRAMAS -->
    <div id="modalPrograma" class="modal" hidden>

        <div class="modal-contenido">

            <h2 id="tituloModal">Nuevo programa</h2>

            <form id="formularioPrograma">

                <input type="hidden" id="programaId">

                <label for="nombrePrograma">NOMBRE</label>
                <input id="nombrePrograma"
                       type="text"
                       placeholder="Nombre del programa"
                       required>

                <label for="instructorPrograma">INSTRUCTOR</label>
                <input id="instructorPrograma"
                       type="text"
                       placeholder="Nombre del instructor"
                       required>

                <label for="duracionPrograma">DURACIÓN</label>
                <input id="duracionPrograma"
                       type="text"
                       placeholder="Ej: 6 semanas"
                       required>

                <label for="fechaPrograma">FECHA DE INICIO</label>
                <input id="fechaPrograma"
                       type="date"
                       required>

                <label for="tematicaPrograma">TEMÁTICA</label>
                <select id="tematicaPrograma" required>
                    <option>Estrategia</option>
                    <option>Marketing</option>
                    <option>Finanzas</option>
                    <option>Liderazgo</option>
                    <option>Ventas</option>
                </select>

                <label for="cuposPrograma">CUPOS</label>
                <input id="cuposPrograma"
                       type="number"
                       min="1"
                       value="20"
                       required>

                <label for="estadoPrograma">ESTADO</label>
                <select id="estadoPrograma">
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="finalizado">Finalizado</option>
                </select>

                <label for="descripcionPrograma">DESCRIPCIÓN</label>
                <textarea id="descripcionPrograma"
                          rows="3"
                          required></textarea>

                <div class="acciones-modal">

                    <button type="button"
                            id="cancelarPrograma"
                            class="boton-cancelar">
                        Cancelar
                    </button>

                    <button type="submit"
                            class="boton-primario">
                        Guardar
                    </button>

                </div>

            </form>

        </div>

    </div>

    <!-- MODAL DETALLE EMPRENDEDOR -->
    <div id="modalEmprendedor" class="modal" hidden>

        <div class="modal-contenido">

            <h2>Información del emprendedor</h2>

            <div id="detalleEmprendedor"></div>

            <div class="acciones-modal">

                <button type="button"
                        id="cerrarEmprendedor"
                        class="boton-primario">
                    Cerrar
                </button>

            </div>

        </div>

    </div>

    <!-- MODAL AGREGAR USUARIO -->
    <div id="modalUsuario" class="modal" hidden>

        <div class="modal-contenido">

            <h2>Agregar usuario</h2>

            <p class="texto-secundario">
                Completa los datos para crear una cuenta
                y asignarle un rol.
            </p>

            <form id="formularioUsuario"
                  method="POST"
                  action="{{ route('administrador.usuarios.guardar') }}">

                @csrf

                <label for="nombreUsuario">
                    NOMBRE COMPLETO
                </label>

                <input type="text"
                       id="nombreUsuario"
                       name="name"
                       value="{{ old('name') }}"
                       maxlength="255"
                       placeholder="Nombre y apellidos"
                       autocomplete="name"
                       required>

                <label for="correoUsuario">
                    CORREO ELECTRÓNICO
                </label>

                <input type="email"
                       id="correoUsuario"
                       name="email"
                       value="{{ old('email') }}"
                       maxlength="255"
                       placeholder="correo@ejemplo.com"
                       autocomplete="email"
                       required>

                <label for="claveUsuario">
                    CONTRASEÑA
                </label>

                <input type="password"
                       id="claveUsuario"
                       name="password"
                       minlength="8"
                       placeholder="Mínimo 8 caracteres"
                       autocomplete="new-password"
                       required>

                <label for="confirmarClaveUsuario">
                    CONFIRMAR CONTRASEÑA
                </label>

                <input type="password"
                       id="confirmarClaveUsuario"
                       name="password_confirmation"
                       minlength="8"
                       placeholder="Repite la contraseña"
                       autocomplete="new-password"
                       required>

                <label for="rolUsuario">
                    ASIGNAR ROL
                </label>

                <select id="rolUsuario"
                        name="rol"
                        required>

                    <option value="">
                        Seleccionar rol
                    </option>

                    <option value="administrador"
                        @selected(old('rol') === 'administrador')>
                        Administrador
                    </option>

                    <option value="funcionario"
                        @selected(old('rol') === 'funcionario')>
                        Funcionario
                    </option>

                    <option value="coordinador"
                        @selected(old('rol') === 'coordinador')>
                        Coordinador
                    </option>

                    <option value="instructor"
                        @selected(old('rol') === 'instructor')>
                        Instructor
                    </option>

                </select>

                <div class="acciones-modal">

                    <button type="button"
                            id="cancelarUsuario"
                            class="boton-cancelar">
                        Cancelar
                    </button>

                    <button type="submit"
                            class="boton-primario">
                        Guardar usuario
                    </button>

                </div>

            </form>

        </div>

    </div>

    <!-- FUNCIONALIDAD DE USUARIOS -->
    <script>
        document.addEventListener('DOMContentLoaded', function () {

            const modalUsuario =
                document.getElementById('modalUsuario');

            const botonNuevo =
                document.getElementById('nuevoUsuario');

            const botonCancelar =
                document.getElementById('cancelarUsuario');

            const formulario =
                document.getElementById('formularioUsuario');

            const clave =
                document.getElementById('claveUsuario');

            const confirmar =
                document.getElementById('confirmarClaveUsuario');

            const tabla =
                document.getElementById('tablaUsuarios');

            const plantilla =
                document.getElementById('usuariosDesdeServidor');

            /*
             * Mostrar los usuarios reales de SQLite.
             * Evitar que los datos de demostración
             * de administrador.js sustituyan la tabla.
             */
            const contenidoReal = plantilla.innerHTML;

            function mostrarUsuariosReales() {
                if (tabla.innerHTML !== contenidoReal) {
                    tabla.innerHTML = contenidoReal;
                }
            }

            mostrarUsuariosReales();

            const observador = new MutationObserver(function () {
                mostrarUsuariosReales();
            });

            observador.observe(tabla, {
                childList: true
            });

            // Abrir formulario
            botonNuevo.addEventListener('click', function () {
                modalUsuario.hidden = false;
            });

            // Cerrar formulario
            botonCancelar.addEventListener('click', function () {
                modalUsuario.hidden = true;
            });

            // Validar contraseñas
            formulario.addEventListener('submit', function (event) {

                if (clave.value !== confirmar.value) {
                    event.preventDefault();

                    alert('Las contraseñas no coinciden.');

                    confirmar.focus();
                }

            });

            // Volver a la pestaña Usuarios
            // después de crear o cambiar un estado
            const mostrarPestanaUsuarios =
                @json(session('success') || session('error') || $errors->any());

            if (mostrarPestanaUsuarios) {

                const pestanaUsuarios =
                    document.querySelector('[data-tab="usuarios"]');

                if (pestanaUsuarios) {
                    pestanaUsuarios.click();
                }

            }

            // Reabrir formulario si hubo errores
            const hayErrores = @json($errors->any());

            if (hayErrores) {
                modalUsuario.hidden = false;
            }

        });
    </script>

    <!-- FOOTER -->
    <footer class="pie-pagina">

        <div class="pie-contenido">

            <div class="marca">
                <span class="marca-icono">IL</span>
                <strong>Impulsa Local</strong>
            </div>

            <p>
                © 2026 Impulsa Local — Liseth Dayana Monroy Briñez
            </p>

            <div class="enlaces-pie">
                <a href="#">Términos</a>
                <a href="#">Privacidad</a>
                <a href="#">Contacto</a>
            </div>

        </div>

    </footer>

</body>
</html>
