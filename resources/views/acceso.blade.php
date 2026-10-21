
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Acceso | Impulsa Local</title>

    <link rel="stylesheet" href="{{ asset('css/acceso.css') }}">
</head>

<body>

    <!-- ENCABEZADO -->
    <header class="encabezado">
        <a href="{{ route('inicio') }}" class="logo">
            <span>IL</span> Impulsa Local
        </a>

        <nav>
            <a href="{{ route('inicio') }}">Inicio</a>
            <a href="{{ route('cursos') }}">Cursos disponibles</a>
            <a href="{{ url('/acceso') }}" class="nav-acceso">
                Iniciar sesión
            </a>
        </nav>
    </header>

    <!-- CONTENIDO PRINCIPAL -->
    <main class="zona-acceso">
        <div class="contenedor-acceso">

            <!-- SELECCIÓN DE ROL -->
            <section class="roles-demo">
                <h3>ESCOGE TU ROL</h3>

                <div class="roles">
                    <button type="button" class="rol" data-rol="administrador">
                        Administrador
                    </button>

                    <button type="button" class="rol" data-rol="funcionario">
                        Funcionario
                    </button>

                    <button type="button" class="rol" data-rol="coordinador">
                        Coordinador
                    </button>

                    <button type="button" class="rol" data-rol="instructor">
                        Instructor
                    </button>

                    <button type="button" class="rol" data-rol="emprendedor">
                        Emprendedor
                    </button>
                </div>

                <p class="descripcion-rol" id="descripcionRol">
                    Selecciona el rol con el que deseas ingresar.
                </p>
            </section>

            <!-- TARJETA DE ACCESO -->
            <div class="tarjeta-acceso">

                <!-- PESTAÑAS -->
                <div class="pestanas">
                    <button type="button"
                            class="pestana activa"
                            id="tabLogin">
                        Iniciar sesión
                    </button>

                    <button type="button"
                            class="pestana"
                            id="tabRegistro">
                        Crear cuenta
                    </button>
                </div>

                <!-- FORMULARIO DE INICIO DE SESIÓN -->
                <form class="formulario" id="formLogin">

                    <h1>Bienvenido de vuelta</h1>

                    <p class="subtitulo">
                        Ingresa tus datos para continuar
                    </p>

                    <label for="correoLogin">
                        CORREO ELECTRÓNICO
                    </label>

                    <input type="email"
                           id="correoLogin"
                           name="email"
                           placeholder="correo@ejemplo.com"
                           autocomplete="email"
                           required>

                    <label for="claveLogin">
                        CONTRASEÑA
                    </label>

                    <input type="password"
                           id="claveLogin"
                           name="password"
                           placeholder="Tu contraseña"
                           autocomplete="current-password"
                           required>

                    <a href="#" class="olvido" id="olvidoClave">
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

                <!-- FORMULARIO DE REGISTRO -->
                <form class="formulario" id="formRegistro" hidden>

                    <h1>Crea tu cuenta</h1>

                    <p class="subtitulo">
                        Únete a la comunidad de emprendedores locales
                    </p>

                    <label for="nombre">
                        NOMBRE COMPLETO
                    </label>

                    <input type="text"
                           id="nombre"
                           name="nombre"
                           placeholder="María García"
                           autocomplete="name"
                           required>

                    <label for="correoRegistro">
                        CORREO ELECTRÓNICO
                    </label>

                    <input type="email"
                           id="correoRegistro"
                           name="email"
                           placeholder="maria@ejemplo.com"
                           autocomplete="email"
                           required>

                    <label for="claveRegistro">
                        CONTRASEÑA
                    </label>

                    <input type="password"
                           id="claveRegistro"
                           name="password"
                           placeholder="Mínimo 8 caracteres"
                           autocomplete="new-password"
                           minlength="8"
                           required>

                    <label for="confirmarClave">
                        CONFIRMAR CONTRASEÑA
                    </label>

                    <input type="password"
                           id="confirmarClave"
                           name="password_confirmation"
                           placeholder="Repite tu contraseña"
                           autocomplete="new-password"
                           minlength="8"
                           required>

                    <label for="tipoEmprendimiento">
                        TIPO DE EMPRENDIMIENTO
                    </label>

                    <select id="tipoEmprendimiento"
                            name="tipo_emprendimiento"
                            required>

                        <option value="">
                            Selecciona una opción...
                        </option>

                        <option>Panadería / Repostería</option>
                        <option>Artesanías</option>
                        <option>Taller de reparaciones</option>
                        <option>Tienda de barrio</option>
                        <option>Restaurante / Comida</option>
                        <option>Costura / Confección</option>
                        <option>Servicios de belleza</option>
                        <option>Agricultura / Huerta</option>
                        <option>Servicios tecnológicos</option>
                        <option>Otro</option>
                    </select>

                    <label for="nombreNegocio">
                        NOMBRE DEL EMPRENDIMIENTO
                    </label>

                    <input type="text"
                           id="nombreNegocio"
                           name="nombre_negocio"
                           placeholder="Ej: Panadería El Trigal"
                           required>

                    <label for="telefono">
                        TELÉFONO
                    </label>

                    <input type="tel"
                           id="telefono"
                           name="telefono"
                           placeholder="Ej: 3101234567"
                           autocomplete="tel"
                           required>

                    <label for="direccion">
                        DIRECCIÓN
                    </label>

                    <input type="text"
                           id="direccion"
                           name="direccion"
                           placeholder="Dirección del emprendimiento"
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

            <!-- MENSAJES -->
            <p class="mensaje" id="mensaje" role="status" aria-live="polite"></p>

        </div>
    </main>

    <!-- PIE DE PÁGINA -->
    <footer>
        © 2026 Impulsa Local — Liseth Dayana Monroy Briñez
    </footer>

    <script src="{{ asset('js/acceso.js') }}" defer></script>

</body>
</html>
