<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Administrador | Impulsa Local</title>

    <link rel="stylesheet"
          href="{{ asset('css/administrador.css') }}">

    <script>
        window.IMPULSA_ADMIN = {
            usuarios: {{ Illuminate\Support\Js::from(
                $usuariosReales->map(function ($usuario) {
                    return [
                        'id' => $usuario->id,
                        'nombre' => $usuario->name,
                        'correo' => $usuario->email,
                        'rol' => $usuario->rol,
                        'estado' => $usuario->activo
                            ? 'activo'
                            : 'inactivo',
                        'emprendimiento' => $usuario->nombre_negocio,
                        'actividad' => $usuario->tipo_emprendimiento,
                        'telefono' => $usuario->telefono,
                        'ubicacion' => $usuario->direccion,
                    ];
                })->values()
            ) }}
        };
    </script>

    <script src="{{ asset('js/administrador.js') }}" defer></script>

    <style>
        [hidden] {
            display: none !important;
        }

        .encabezado-usuarios {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            margin-bottom: 20px;
        }

        #nuevoUsuario {
            width: auto !important;
            min-height: 38px;
            padding: 10px 16px !important;
            font-size: 12px;
            border-radius: 9px;
        }

        .controles-estado {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }

        .controles-estado form {
            margin: 0;
        }

        .boton-estado {
            border: none;
            border-radius: 8px;
            padding: 8px 12px;
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

        .perfil form {
            margin: 0;
        }

        .perfil .salir {
            border: none;
            background: transparent;
            cursor: pointer;
            font: inherit;
        }

        .modal-contenido label {
            display: block;
            margin: 12px 0 6px;
            font-weight: bold;
            font-size: 12px;
        }

        .modal-contenido input,
        .modal-contenido select,
        .modal-contenido textarea {
            width: 100%;
            padding: 11px;
            border: 1px solid #dce1e8;
            border-radius: 9px;
            box-sizing: border-box;
        }

        .modal-contenido {
            max-height: 90vh;
            overflow-y: auto;
        }

        .acciones-modal {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 20px;
        }

        .acciones-modal button {
            width: auto;
        }

        .tarjeta-programa {
            min-width: 0;
        }

        .barra-progreso {
            height: 9px;
            background: #edf0f3;
            border-radius: 10px;
            overflow: hidden;
        }

        .barra-progreso > div {
            height: 100%;
            background: #1b3a5b;
        }

        @media (max-width: 650px) {
            .encabezado-usuarios {
                flex-direction: column;
                align-items: flex-start;
            }
        }
    </style>
</head>

<body>

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

        <span class="etiqueta rol">administrador</span>

        <span class="avatar">
            {{ mb_strtoupper(mb_substr(auth()->user()->name, 0, 1)) }}
        </span>

        <form action="{{ route('logout') }}" method="POST">
            @csrf
            <button type="submit"
                    class="salir"
                    title="Cerrar sesión"
                    aria-label="Cerrar sesión">
                ⇥
            </button>
        </form>
    </div>
</header>

<nav class="navegacion">
    <button type="button" class="pestana activa"
            data-tab="emprendedores">
        👥 Emprendedores
    </button>

    <button type="button" class="pestana"
            data-tab="programas">
        📚 Programas
    </button>

    <button type="button" class="pestana"
            data-tab="reportes">
        📊 Reportes
    </button>

    <button type="button" class="pestana"
            data-tab="usuarios">
        🔐 Usuarios
    </button>
</nav>

<main class="contenido">

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

    <!-- EMPRENDEDORES -->

    <section id="emprendedores" class="panel activo">
        <div class="filtros">
            <input id="buscarEmprendedor"
                   type="search"
                   placeholder="Buscar por nombre, negocio, actividad o ubicación...">

            <select id="filtroActividad">
                <option value="">Todas las actividades</option>
            </select>

            <select id="filtroEstadoEmprendedor">
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
            </select>
        </div>

        <p id="conteoEmprendedores" class="texto-secundario">
            Cargando emprendedores...
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
                <strong id="totalActivos"
                        class="numero verde">0</strong>
                <span>Emprendedores activos</span>
            </article>

            <article class="tarjeta-estadistica">
                <strong id="totalRegistrados"
                        class="numero">0</strong>
                <span>Total registrados</span>
            </article>

            <article class="tarjeta-estadistica">
                <strong id="totalProgramasActivos"
                        class="numero azul">0</strong>
                <span>Programas activos</span>
            </article>

            <article class="tarjeta-estadistica">
                <strong id="totalInscripciones"
                        class="numero naranja">0</strong>
                <span>Total inscripciones</span>
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
                <h3>Reporte: Emprendedores registrados</h3>

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

    <!-- USUARIOS -->

    <section id="usuarios" class="panel">
        <div class="encabezado-usuarios">
            <div>
                <h2>Gestión de usuarios</h2>
                <p class="texto-secundario">
                    Administra las cuentas y los roles de acceso.
                </p>
            </div>

            <button type="button"
                    id="nuevoUsuario"
                    class="boton-primario">
                + Agregar usuario
            </button>
        </div>

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
                <tbody id="tablaUsuarios">
                    @forelse ($usuariosReales as $usuario)
                        <tr>
                            <td>{{ $usuario->name }}</td>
                            <td>{{ $usuario->email }}</td>
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
                                              action="{{ route('administrador.usuarios.estado', $usuario) }}">
                                            @csrf
                                            @method('PATCH')

                                            <button type="submit"
                                                    class="boton-estado {{ $usuario->activo ? 'desactivar' : 'activar' }}"
                                                    onclick="return confirm('¿Confirmas el cambio de estado de esta cuenta?')">
                                                {{ $usuario->activo ? 'Desactivar' : 'Activar' }}
                                            </button>
                                        </form>
                                    @endif
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4">
                                No hay usuarios registrados.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </section>

</main>

<!-- MODAL: DETALLE EMPRENDEDOR -->

<div id="modalEmprendedor" class="modal" hidden>
    <div class="modal-contenido">
        <h2>Detalle del emprendedor</h2>

        <div id="detalleEmprendedor"></div>

        <div class="acciones-modal">
            <button type="button"
                    id="cerrarEmprendedor"
                    class="boton-cancelar">
                Cerrar
            </button>
        </div>
    </div>
</div>

<!-- MODAL: PROGRAMA -->

<div id="modalPrograma" class="modal" hidden>
    <div class="modal-contenido">
        <h2 id="tituloModal">Nuevo programa</h2>

        <form id="formularioPrograma">
            <input type="hidden" id="programaId">

            <label for="nombrePrograma">NOMBRE</label>
            <input id="nombrePrograma" required maxlength="255">

            <label for="tematicaPrograma">TEMÁTICA</label>
            <input id="tematicaPrograma" required maxlength="100">

            <label for="descripcionPrograma">DESCRIPCIÓN</label>
            <textarea id="descripcionPrograma" rows="3"></textarea>

            <label for="instructorPrograma">INSTRUCTOR</label>
            <select id="instructorPrograma">
                <option value="">Sin asignar</option>
            </select>

            <label for="duracionPrograma">DURACIÓN EN SEMANAS</label>
            <input id="duracionPrograma"
                   type="number" min="1" required>

            <label for="cuposPrograma">CUPOS</label>
            <input id="cuposPrograma"
                   type="number" min="1" required>

            <label for="fechaPrograma">FECHA DE INICIO</label>
            <input id="fechaPrograma" type="date">

            <label for="estadoPrograma">ESTADO</label>
            <select id="estadoPrograma" required>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="finalizado">Finalizado</option>
            </select>

            <div class="acciones-modal">
                <button type="button"
                        id="cancelarPrograma"
                        class="boton-cancelar">
                    Cancelar
                </button>

                <button type="submit"
                        id="guardarPrograma"
                        class="boton-primario">
                    Guardar programa
                </button>
            </div>
        </form>
    </div>
</div>

<!-- MODAL: USUARIO -->

<div id="modalUsuario" class="modal" hidden>
    <div class="modal-contenido">
        <h2>Agregar usuario</h2>

        <form id="formularioUsuario"
              method="POST"
              action="{{ route('administrador.usuarios.guardar') }}">
            @csrf

            <label for="nombreUsuario">NOMBRE COMPLETO</label>
            <input id="nombreUsuario"
                   name="name"
                   value="{{ old('name') }}"
                   required maxlength="255">

            <label for="correoUsuario">CORREO ELECTRÓNICO</label>
            <input id="correoUsuario"
                   name="email"
                   type="email"
                   value="{{ old('email') }}"
                   required>

            <label for="claveUsuario">CONTRASEÑA</label>
            <input id="claveUsuario"
                   name="password"
                   type="password"
                   minlength="8" required>

            <label for="confirmarClaveUsuario">
                CONFIRMAR CONTRASEÑA
            </label>
            <input id="confirmarClaveUsuario"
                   name="password_confirmation"
                   type="password"
                   minlength="8" required>

            <label for="rolUsuario">ASIGNAR ROL</label>
            <select id="rolUsuario" name="rol" required>
                <option value="">Seleccionar rol</option>
                <option value="administrador">Administrador</option>
                <option value="funcionario">Funcionario</option>
                <option value="coordinador">Coordinador</option>
                <option value="instructor">Instructor</option>
            </select>

            <div class="acciones-modal">
                <button type="button"
                        id="cancelarUsuario"
                        class="boton-cancelar">
                    Cancelar
                </button>

                <button type="submit" class="boton-primario">
                    Guardar usuario
                </button>
            </div>
        </form>
    </div>
</div>

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
