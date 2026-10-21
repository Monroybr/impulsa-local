
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Impulsa Local - Inicio</title>

    <link rel="stylesheet" href="{{ asset('css/inicio.css') }}">
</head>

<body>

    <!-- ENCABEZADO -->
    <header class="encabezado">
        <div class="contenedor navegacion">
            <a href="{{ route('inicio') }}" class="marca">
                <span class="marca-icono">IL</span>
                <span>Impulsa Local</span>
            </a>

            <button class="menu-toggle"
                    id="menuToggle"
                    aria-label="Abrir menú"
                    aria-expanded="false"
                    aria-controls="menuPrincipal">
                ☰
            </button>

            <nav class="menu" id="menuPrincipal">
                <a href="{{ route('inicio') }}" class="activo">Inicio</a>
                <a href="{{ route('cursos') }}">Cursos disponibles</a>
                <a href="{{ route('login') }}" class="boton-login">
                    Iniciar sesión
                </a>
            </nav>
        </div>
    </header>

    <main>

        <!-- BANNER DE IMÁGENES -->
        <section class="banner" aria-label="Presentación de Impulsa Local">

            <div class="diapositiva activa"
                 style="background-image: url('{{ asset('images/banners/banner1.jpg') }}');">
                <div class="contenedor banner-contenido">
                    <span class="etiqueta">IMPULSA LOCAL</span>
                    <h1>Impulsa tu negocio local</h1>
                    <p>
                        Nuestro objetivo es apoyar a pequeños emprendedores
                        de la ciudad: panaderos, artesanos, talleres y
                        tiendas de barrio.
                    </p>
                    <div class="acciones">
                        <a href="{{ route('cursos') }}" class="boton amarillo">
                            Ver programas
                        </a>
                        <a href="{{ route('registro') }}" class="boton transparente">
                            Registrarme
                        </a>
                    </div>
                </div>
            </div>

            <div class="diapositiva"
                 style="background-image: url('{{ asset('images/banners/banner2.jpg') }}');">
                <div class="contenedor banner-contenido">
                    <span class="etiqueta">IMPULSA LOCAL</span>
                    <h1>Aprende y haz crecer tu emprendimiento</h1>
                    <p>
                        Accede a programas de formación y herramientas
                        que te ayudarán a fortalecer tu negocio.
                    </p>
                    <div class="acciones">
                        <a href="{{ route('cursos') }}" class="boton amarillo">
                            Ver programas
                        </a>
                        <a href="{{ route('registro') }}" class="boton transparente">
                            Registrarme
                        </a>
                    </div>
                </div>
            </div>

            <div class="diapositiva"
                 style="background-image: url('{{ asset('images/banners/banner3.jpg') }}');">
                <div class="contenedor banner-contenido">
                    <span class="etiqueta">IMPULSA LOCAL</span>
                    <h1>Conecta con una comunidad real</h1>
                    <p>
                        Aprende junto a otros emprendedores y comparte
                        experiencias que hacen crecer tu negocio.
                    </p>
                    <div class="acciones">
                        <a href="{{ route('cursos') }}" class="boton amarillo">
                            Ver programas
                        </a>
                        <a href="{{ route('registro') }}" class="boton transparente">
                            Registrarme
                        </a>
                    </div>
                </div>
            </div>

            <div class="diapositiva"
                 style="background-image: url('{{ asset('images/banners/banner4.jpg') }}');">
                <div class="contenedor banner-contenido">
                    <span class="etiqueta">IMPULSA LOCAL</span>
                    <h1>Respaldado por la alcaldía</h1>
                    <p>
                        Un programa institucional para fortalecer
                        la economía local desde las bases.
                    </p>
                    <div class="acciones">
                        <a href="{{ route('cursos') }}" class="boton amarillo">
                            Ver programas
                        </a>
                        <a href="{{ route('registro') }}" class="boton transparente">
                            Registrarme
                        </a>
                    </div>
                </div>
            </div>

            <button class="flecha anterior" id="anterior"
                    aria-label="Imagen anterior">‹</button>
            <button class="flecha siguiente" id="siguiente"
                    aria-label="Imagen siguiente">›</button>

            <div class="indicadores" id="indicadores">
                <button class="punto activo" data-slide="0"
                        aria-label="Ver imagen 1"></button>
                <button class="punto" data-slide="1"
                        aria-label="Ver imagen 2"></button>
                <button class="punto" data-slide="2"
                        aria-label="Ver imagen 3"></button>
                <button class="punto" data-slide="3"
                        aria-label="Ver imagen 4"></button>
            </div>
        </section>

        <!-- ESTADÍSTICAS DE DEMOSTRACIÓN -->
        <section class="estadisticas">
            <div class="contenedor estadisticas-grid">
                <div>
                    <strong>200+</strong>
                    <span>Emprendedores registrados</span>
                </div>
                <div>
                    <strong>6</strong>
                    <span>Programas activos</span>
                </div>
                <div>
                    <strong>96%</strong>
                    <span>Satisfacción</span>
                </div>
                <div>
                    <strong>5</strong>
                    <span>Roles de gestión</span>
                </div>
            </div>
        </section>

        <!-- NUESTRA MISIÓN -->
        <section class="mision" id="programas">
            <div class="contenedor">
                <div class="titulo-seccion">
                    <span class="etiqueta">NUESTRA MISIÓN</span>
                    <h2>Diseñado para emprendedores reales</h2>
                    <p>
                        Nuestro objetivo es apoyar a pequeños emprendedores
                        de la ciudad —panaderos, artesanos, talleres,
                        tiendas de barrio, etc.— con herramientas prácticas
                        y programas de formación accesibles para que sus
                        negocios crezcan y prosperen.
                    </p>
                </div>

                <div class="tarjetas">
                    <article class="tarjeta">
                        <span class="tarjeta-icono">🏪</span>
                        <h3>Tiendas de barrio</h3>
                        <p>
                            Fortalece tu negocio local con estrategias
                            de ventas y atención al cliente.
                        </p>
                    </article>

                    <article class="tarjeta">
                        <span class="tarjeta-icono">🥖</span>
                        <h3>Panaderos y reposteros</h3>
                        <p>
                            Aprende finanzas, costos y marketing
                            para hacer crecer tu panadería.
                        </p>
                    </article>

                    <article class="tarjeta">
                        <span class="tarjeta-icono">🧵</span>
                        <h3>Artesanos y costureros</h3>
                        <p>
                            Digitaliza tu negocio y llega a más
                            clientes con herramientas en línea.
                        </p>
                    </article>

                    <article class="tarjeta">
                        <span class="tarjeta-icono">🔧</span>
                        <h3>Talleres y servicios</h3>
                        <p>
                            Organiza tu taller, gestiona clientes
                            y mejora tu rentabilidad.
                        </p>
                    </article>
                </div>
            </div>
        </section>

        <!-- TESTIMONIOS DE DEMOSTRACIÓN -->
        <section class="testimonios">
            <div class="contenedor">
                <div class="titulo-seccion">
                    <span class="etiqueta">LO QUE DICEN</span>
                    <h2>Historias de nuestra ciudad</h2>
                </div>

                <div class="testimonios-grid">
                    <article class="testimonio">
                        <p>
                            "Gracias a Impulsa Local aprendí a llevar
                            mis cuentas y ahora sé cuánto gano
                            realmente cada mes."
                        </p>
                        <div class="persona">
                            <span class="avatar">M</span>
                            <div>
                                <strong>María García</strong>
                                <small>Panadería El Trigal</small>
                            </div>
                        </div>
                    </article>

                    <article class="testimonio">
                        <p>
                            "El curso de marketing me ayudó a vender
                            mis artesanías en línea. Tripliqué
                            mis ventas en dos meses."
                        </p>
                        <div class="persona">
                            <span class="avatar">J</span>
                            <div>
                                <strong>Jorge Pérez</strong>
                                <small>Artesanías Pérez</small>
                            </div>
                        </div>
                    </article>

                    <article class="testimonio">
                        <p>
                            "Nunca pensé que un programa así existiría
                            para personas como yo. Mi tienda mejoró
                            muchísimo."
                        </p>
                        <div class="persona">
                            <span class="avatar">C</span>
                            <div>
                                <strong>Camila Torres</strong>
                                <small>Tienda La Esquina</small>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <!-- INVITACIÓN AL REGISTRO -->
        <section class="registro-cta" id="acceso">
            <div class="contenedor">
                <h2>¿Listo para impulsar tu negocio?</h2>
                <p>
                    Regístrate gratis y accede a todos los
                    programas de formación.
                </p>
                <a href="{{ route('registro') }}" class="boton amarillo">
                    Comenzar ahora
                </a>
            </div>
        </section>

    </main>

    <!-- PIE DE PÁGINA -->
    <footer class="pie">
        <div class="contenedor pie-contenido">
            <a href="{{ route('inicio') }}" class="marca">
                <span class="marca-icono">IL</span>
                <span>Impulsa Local</span>
            </a>

            <p>© 2026 Impulsa Local — Liseth Dayana Monroy Briñez</p>

            <div class="pie-enlaces">
                <a href="#terminos">Términos</a>
                <a href="#privacidad">Privacidad</a>
                <a href="#contacto">Contacto</a>
            </div>
        </div>
    </footer>

    <script src="{{ asset('js/inicio.js') }}"></script>
</body>
</html>
