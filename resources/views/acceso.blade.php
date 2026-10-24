
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceso | Impulsa Local</title>
    <link rel="stylesheet" href="{{ asset('css/acceso.css') }}">
</head>

<body>

    <header class="encabezado">
        <a href="{{ route('inicio') }}" class="logo">
            <span>IL</span> Impulsa Local
        </a>

        <nav>
            <a href="{{ route('inicio') }}">Inicio</a>
            <a href="{{ route('cursos') }}">Cursos disponibles</a>
            <a href="{{ route('login') }}" class="nav-acceso">
                Iniciar sesión
            </a>
        </nav>
    </header>

    <main class="zona-acceso">
        <div class="contenedor-acceso">

            <div class="tarjeta-acceso">

                <div class="pestanas">
                    <button
                        type="button"
                        class="pestana activa"
                        id="tabLogin">
                        Iniciar sesión
                    </button>

                    <button
                        type="button"
                        class="pestana"
                        id="tabRegistro">
                        Crear cuenta
                    </button>
                </div>

                <form
                    class="formulario"
                    id="formLogin"
                    method="POST"
                    action="{{ route('login.procesar') }}">

                    @csrf

                    <h1>Bienvenido de vuelta</h1>

                    <p class="subtitulo">
                        Ingresa tus datos para continuar
                    </p>

                    @if (session('status'))
                        <div
                            role="status"
                            style="padding:12px; margin-bottom:16px;
                                   border-radius:8px;
                                   background:#e8f7ec;
                                   color:#176534;">
                            {{ session('status') }}
                        </div>
                    @endif

                    <label for="correoLogin">
                        CORREO ELECTRÓNICO
                    </label>

                    <input
                        type="email"
                        id="correoLogin"
                        name="email"
                        placeholder="correo@ejemplo.com"
                        autocomplete="email"
                        value="{{ old('email') }}"
                        required>

                    <label for="claveLogin">
                        CONTRASEÑA
                    </label>

                    <input
                        type="password"
                        id="claveLogin"
                        name="password"
                        placeholder="Tu contraseña"
                        autocomplete="current-password"
                        required>

                    <a
                        href="#"
                        class="olvido"
                        id="olvidoClave">
                        ¿Olvidaste tu contraseña?
                    </a>

                    <button type="submit" class="boton-principal">
                        Iniciar sesión
                    </button>

                    <p class="pie-formulario">
                        ¿No tienes una cuenta?
                        <button type="button" id="irRegistro">
                            Regístrate aquí
                        </button>
                    </p>
                </form>

                <form
                    class="formulario"
                    id="formRegistro"
                    method="POST"
                    action="{{ route('registro.procesar') }}"
                    hidden>

                    @csrf

                    <h1>Crea tu cuenta</h1>

                    <p class="subtitulo">
                        Únete a la comunidad de emprendedores locales
                    </p>

                    <label for="nombre">
                        NOMBRE COMPLETO
                    </label>

                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        placeholder="Nombre y apellido"
                        autocomplete="name"
                        value="{{ old('nombre') }}"
                        maxlength="255"
                        required>

                    <label for="correoRegistro">
                        CORREO ELECTRÓNICO
                    </label>

                    <input
                        type="email"
                        id="correoRegistro"
                        name="email"
                        placeholder="correo@ejemplo.com"
                        autocomplete="email"
                        value="{{ old('email') }}"
                        required>

                    <label for="claveRegistro">
                        CONTRASEÑA
                    </label>

                    <input
                        type="password"
                        id="claveRegistro"
                        name="password"
                        placeholder="Mínimo 8 caracteres"
                        autocomplete="new-password"
                        minlength="8"
                        required>

                    <label for="confirmarClave">
                        CONFIRMAR CONTRASEÑA
                    </label>

                    <input
                        type="password"
                        id="confirmarClave"
                        name="password_confirmation"
                        placeholder="Repite tu contraseña"
                        autocomplete="new-password"
                        minlength="8"
                        required>

                    <label for="tipoEmprendimiento">
                        TIPO DE EMPRENDIMIENTO
                    </label>

                    <select
                        id="tipoEmprendimiento"
                        name="tipo_emprendimiento"
                        required>

                        <option value="">
                            Selecciona una opción...
                        </option>

                        @foreach ([
                            'Panadería / Repostería',
                            'Artesanías',
                            'Taller de reparaciones',
                            'Tienda de barrio',
                            'Restaurante / Comida',
                            'Costura / Confección',
                            'Servicios de belleza',
                            'Agricultura / Huerta',
                            'Servicios tecnológicos',
                            'Otro'
                        ] as $tipo)

                            <option
                                value="{{ $tipo }}"
                                @selected(
                                    old('tipo_emprendimiento') === $tipo
                                )>
                                {{ $tipo }}
                            </option>
                        @endforeach
                    </select>

                    <label for="nombreNegocio">
                        NOMBRE DEL EMPRENDIMIENTO
                    </label>

                    <input
                        type="text"
                        id="nombreNegocio"
                        name="nombre_negocio"
                        placeholder="Ej: Panadería El Trigal"
                        value="{{ old('nombre_negocio') }}"
                        maxlength="255"
                        required>

                    <label for="telefono">
                        TELÉFONO
                    </label>

                    <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        placeholder="Ej: 3101234567"
                        autocomplete="tel"
                        value="{{ old('telefono') }}"
                        maxlength="30"
                        required>

                    <label for="direccion">
                        DIRECCIÓN
                    </label>

                    <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        placeholder="Dirección del emprendimiento"
                        value="{{ old('direccion') }}"
                        maxlength="255"
                        required>

                    <button type="submit" class="boton-principal">
                        Crear mi cuenta
                    </button>

                    <p class="pie-formulario">
                        ¿Ya tienes cuenta?
                        <button type="button" id="irLogin">
                            Inicia sesión
                        </button>
                    </p>
                </form>

            </div>

            @if ($errors->any())
                <div class="errores-acceso" role="alert">
                    <strong>
                        No fue posible completar la solicitud:
                    </strong>

                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <p
                class="mensaje"
                id="mensaje"
                role="status"
                aria-live="polite"></p>

        </div>
    </main>

    <footer>
        © 2026 Impulsa Local — Liseth Dayana Monroy Briñez
    </footer>

    <script>
        window.IMPULSA_ACCESO = {
            pestañaInicial: @json(
                old('nombre') !== null ||
                old('nombre_negocio') !== null ||
                old('tipo_emprendimiento') !== null ||
                request()->is('registro')
                    ? 'registro'
                    : 'login'
            )
        };
    </script>

    <script src="{{ asset('js/acceso.js') }}" defer></script>

</body>
</html>
