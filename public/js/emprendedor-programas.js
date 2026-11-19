document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    const usuario = window.IMPULSA_USUARIO;
    if (!usuario || !usuario.id) return;

    const csrf = document.querySelector(
        'meta[name="csrf-token"]'
    )?.content || '';

    const RUTAS = {
        programas: '/emprendedor/programas-disponibles',
        inscripciones: '/emprendedor/inscripciones',
        reportes: '/emprendedor/reportes-avance'
    };

    let programas = [];
    let inscripciones = [];
    let reportes = [];
    let cargando = false;
    let enviando = false;
    let enviandoReporte = false;

    function $(id) {
        return document.getElementById(id);
    }

    function escapar(valor) {
        return String(valor ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    function porcentaje(valor) {
        return Math.max(
            0,
            Math.min(100, Number(valor) || 0)
        );
    }

    function fechaCorta(valor) {
        return valor
            ? escapar(String(valor).slice(0, 10))
            : 'No registrada';
    }

    function fechaLocal() {
        const ahora = new Date();
        const local = new Date(
            ahora.getTime() -
            ahora.getTimezoneOffset() * 60000
        );
        return local.toISOString().slice(0, 10);
    }

    function duracion(programa) {
        return `${Number(programa?.duracion_semanas) || 0} semanas`;
    }

    function instructor(programa) {
        return programa?.instructor?.name || 'Por asignar';
    }

    function inscritos(programa) {
        return Number(programa?.inscripciones_count) || 0;
    }

    function cuposLibres(programa) {
        return Math.max(
            0,
            (Number(programa?.cupos) || 0) - inscritos(programa)
        );
    }

    function mostrarMensaje(id, texto, error = false) {
        const elemento = $(id);
        if (!elemento) return;

        elemento.textContent = texto;
        elemento.className = error
            ? 'il-alerta il-error'
            : 'il-alerta';
        elemento.hidden = !texto;
    }

    function mensaje(texto, error = false) {
        mostrarMensaje('mensajeProgramas', texto, error);
    }

    function mensajeReporte(texto, error = false) {
        mostrarMensaje('mensajeReportes', texto, error);
    }

    async function solicitar(url, opciones = {}) {
        const respuesta = await fetch(url, {
            credentials: 'same-origin',
            ...opciones,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
                ...(opciones.headers || {})
            }
        });

        const tipo = respuesta.headers.get('content-type') || '';

        const datos = tipo.includes('application/json')
            ? await respuesta.json()
            : null;

        if (!respuesta.ok) {
            const primerError = datos?.errors
                ? Object.values(datos.errors).flat()[0]
                : null;

            throw new Error(
                primerError ||
                datos?.message ||
                `Error HTTP ${respuesta.status}`
            );
        }

        return datos;
    }

    // =====================================
    // CATÁLOGO DE PROGRAMAS
    // =====================================

    function crearTarjeta(programa) {
        const id = Number(programa.id);

        const yaInscrito = inscripciones.some(
            i => Number(i.programa_id) === id
        );

        const disponible =
            programa.estado === 'activo' &&
            cuposLibres(programa) > 0;

        const estado = String(
            programa.estado || 'inactivo'
        );

        const textoBoton = yaInscrito
            ? 'Ya estás inscrito/a'
            : disponible
                ? 'Inscribirme'
                : 'No disponible';

        return `
            <article class="programa tarjeta">
                <div class="cabecera-bloque">
                    <h3>${escapar(programa.nombre)}</h3>
                    <span class="estado ${
                        estado === 'activo'
                            ? 'activo'
                            : 'finalizado'
                    }">
                        ${escapar(estado)}
                    </span>
                </div>

                <span class="tematica">
                    ${escapar(programa.tematica)}
                </span>

                <p>
                    ${escapar(
                        programa.descripcion || 'Sin descripción.'
                    )}
                </p>

                <div class="fila">
                    <span>Instructor</span>
                    <strong>
                        ${escapar(instructor(programa))}
                    </strong>
                </div>

                <div class="fila">
                    <span>Duración</span>
                    <strong>
                        ${escapar(duracion(programa))}
                    </strong>
                </div>

                <div class="fila">
                    <span>Inicio</span>
                    <strong>
                        ${fechaCorta(programa.fecha_inicio)}
                    </strong>
                </div>

                <div class="fila">
                    <span>Cupos disponibles</span>
                    <strong>
                        ${cuposLibres(programa)}
                        de ${Number(programa.cupos) || 0}
                    </strong>
                </div>

                <button
                    type="button"
                    class="btn primario btn-ancho"
                    data-inscribir="${id}"
                    ${
                        yaInscrito || !disponible || enviando
                            ? 'disabled'
                            : ''
                    }
                >
                    ${textoBoton}
                </button>
            </article>
        `;
    }

    function renderizarCatalogo() {
        const contenedor = $('catalogoProgramas');
        if (!contenedor) return;

        const tematica = $('filtroTematica')?.value || '';
        const estado = $('filtroEstado')?.value || '';

        const filtrados = programas.filter(p =>
            (!tematica || p.tematica === tematica) &&
            (!estado || p.estado === estado)
        );

        contenedor.innerHTML = filtrados.length
            ? filtrados.map(crearTarjeta).join('')
            : `<p class="il-vacio">
                No hay programas para estos filtros.
               </p>`;
    }

    function actualizarTematicas() {
        const selector = $('filtroTematica');
        if (!selector) return;

        const seleccion = selector.value;

        const tematicas = [
            ...new Set(
                programas
                    .map(p => p.tematica)
                    .filter(Boolean)
            )
        ].sort();

        selector.innerHTML =
            '<option value="">Todas las temáticas</option>' +
            tematicas.map(t => `
                <option value="${escapar(t)}">
                    ${escapar(t)}
                </option>
            `).join('');

        if (tematicas.includes(seleccion)) {
            selector.value = seleccion;
        }
    }

    // =====================================
    // MIS INSCRIPCIONES
    // =====================================

    function renderizarInscripciones() {
        const contenedor = $('inscripciones');
        if (!contenedor) return;

        const titulo = $('tituloInscripciones');

        if (titulo) {
            titulo.textContent =
                `Mis inscripciones (${inscripciones.length})`;
        }

        if (!inscripciones.length) {
            contenedor.innerHTML = `
                <p class="il-vacio">
                    Todavía no tienes inscripciones
                    registradas en SQLite.
                </p>
            `;
            return;
        }

        contenedor.innerHTML = inscripciones.map(i => {
            const p = i.programa;
            if (!p) return '';

            const avance = porcentaje(i.progreso);

            return `
                <div class="inscripcion">
                    <div class="inscripcion-info">
                        <strong>
                            ${escapar(p.nombre)}
                        </strong>

                        <small>
                            ${escapar(p.tematica)}
                            · ${escapar(duracion(p))}
                        </small>
                    </div>

                    <div class="progreso-inline">
                        <div class="barra">
                            <div
                                class="relleno"
                                style="width:${avance}%"
                            ></div>
                        </div>

                        <strong>${avance}%</strong>
                    </div>

                    <span class="estado ${
                        avance === 100
                            ? 'completado'
                            : 'curso'
                    }">
                        ${escapar(i.estado || 'inscrito')}
                    </span>
                </div>
            `;
        }).join('');
    }

    // =====================================
    // MI PROGRESO
    // =====================================

    function renderizarProgreso() {
        const contenedor = $('detalleProgreso');
        if (!contenedor) return;

        if (!inscripciones.length) {
            contenedor.innerHTML = `
                <p class="il-vacio">
                    Todavía no tienes programas
                    inscritos en SQLite.
                </p>
            `;
            return;
        }

        contenedor.innerHTML = inscripciones.map(i => {
            const p = i.programa;
            if (!p) return '';

            const avance = porcentaje(i.progreso);

            return `
                <div class="detalle">
                    <div class="cabecera-bloque">
                        <strong>
                            ${escapar(p.nombre)}
                        </strong>

                        <span class="estado ${
                            avance === 100
                                ? 'completado'
                                : 'curso'
                        }">
                            ${escapar(i.estado || 'inscrito')}
                        </span>
                    </div>

                    <div class="progreso-inline">
                        <div class="barra">
                            <div
                                class="relleno"
                                style="width:${avance}%"
                            ></div>
                        </div>

                        <strong>${avance}%</strong>
                    </div>

                    <small>
                        Inscripción:
                        ${fechaCorta(i.fecha_inscripcion)}
                    </small>
                </div>
            `;
        }).join('');
    }

    // =====================================
    // REPORTES DE AVANCE
    // =====================================

    function prepararSelectorReportes() {
        const selector = $('reporteInscripcion');
        const boton = $('guardarReporte');

        if (!selector) return;

        const previo = selector.value;

        const validas = inscripciones.filter(
            i => i.programa && i.id
        );

        selector.innerHTML = `
            <option value="">
                Selecciona un programa
            </option>
        ` + validas.map(i => `
            <option value="${Number(i.id)}">
                ${escapar(i.programa.nombre)}
            </option>
        `).join('');

        if (
            validas.some(
                i => String(i.id) === previo
            )
        ) {
            selector.value = previo;
        }

        if (boton) {
            boton.disabled =
                validas.length === 0 || enviandoReporte;
        }

        const fecha = $('reporteFecha');

        if (fecha) {
            fecha.max = fechaLocal();

            if (!fecha.value) {
                fecha.value = fechaLocal();
            }
        }
    }

    function renderizarReportes() {
        const contenedor = $('seguimientos');
        if (!contenedor) return;

        if (!reportes.length) {
            contenedor.innerHTML = `
                <p class="il-vacio">
                    Todavía no has registrado
                    reportes de avance.
                </p>
            `;
            return;
        }

        contenedor.innerHTML = reportes.map(r => {
            const nombre =
                r.inscripcion?.programa?.nombre ||
                'Programa inscrito';

            return `
                <article
                    class="il-tarjeta"
                    style="margin-top:12px"
                >
                    <div class="cabecera-bloque">
                        <strong>
                            ${escapar(nombre)}
                        </strong>

                        <small>
                            ${fechaCorta(r.fecha)}
                        </small>
                    </div>

                    <p>
                        <strong>Logros:</strong>
                        ${escapar(r.logros)}
                    </p>

                    <p>
                        <strong>Dificultades:</strong>
                        ${escapar(
                            r.dificultades ||
                            'No registradas'
                        )}
                    </p>

                    <p>
                        <strong>Apoyo solicitado:</strong>
                        ${escapar(
                            r.apoyo_solicitado ||
                            'No solicitado'
                        )}
                    </p>
                </article>
            `;
        }).join('');
    }

    async function cargarReportes() {
        try {
            const lista = await solicitar(
                RUTAS.reportes
            );

            if (!Array.isArray(lista)) {
                throw new Error(
                    'Respuesta inesperada del servidor.'
                );
            }

            reportes = lista;
            renderizarReportes();

        } catch (error) {
            mensajeReporte(
                'No se pudieron consultar los reportes: ' +
                error.message,
                true
            );
        }
    }

    // =====================================
    // PREPARACIÓN DE LA INTERFAZ
    // =====================================

    function prepararInterfaz() {
        const seccionProgramas = $('vista-programas');
        const seccionProgreso = $('vista-progreso');

        if (!seccionProgramas || !seccionProgreso) {
            return false;
        }

        seccionProgramas.innerHTML = `
            <div
                id="mensajeProgramas"
                class="il-alerta"
                role="status"
                hidden
            ></div>

            <div class="il-tarjeta bloque">
                <h2 id="tituloInscripciones">
                    Mis inscripciones (0)
                </h2>

                <p>
                    Inscripciones oficiales
                    registradas en SQLite.
                </p>

                <div id="inscripciones"></div>
            </div>

            <div class="filtros">
                <h3>Programas disponibles</h3>

                <select
                    id="filtroTematica"
                    aria-label="Filtrar por temática"
                >
                    <option value="">
                        Todas las temáticas
                    </option>
                </select>

                <select
                    id="filtroEstado"
                    aria-label="Filtrar por estado"
                >
                    <option value="">
                        Todos los estados
                    </option>
                    <option value="activo">
                        Activos
                    </option>
                    <option value="inactivo">
                        Inactivos
                    </option>
                    <option value="finalizado">
                        Finalizados
                    </option>
                </select>
            </div>

            <div
                id="catalogoProgramas"
                class="cuadricula"
            ></div>
        `;

        seccionProgreso.innerHTML = `
            <div class="columna-central">

                <div class="il-tarjeta bloque">
                    <h2>Mi progreso en programas</h2>

                    <p>
                        El progreso corresponde a
                        los registros oficiales de SQLite.
                    </p>

                    <div id="detalleProgreso"></div>

                    <h3>Registrar reporte de avance</h3>

                    <p>
                        Describe los logros, dificultades
                        y el apoyo que necesitas en un
                        programa inscrito.
                    </p>

                    <div
                        id="mensajeReportes"
                        class="il-alerta"
                        role="status"
                        hidden
                    ></div>

                    <form id="formReporteAvance">

                        <div class="il-campo">
                            <label for="reporteInscripcion">
                                Programa inscrito
                            </label>

                            <select
                                id="reporteInscripcion"
                                name="inscripcion_id"
                                required
                            ></select>
                        </div>

                        <div class="il-campo">
                            <label for="reporteFecha">
                                Fecha del reporte
                            </label>

                            <input
                                id="reporteFecha"
                                type="date"
                                name="fecha"
                                required
                            >
                        </div>

                        <div class="il-campo">
                            <label for="reporteLogros">
                                Logros alcanzados
                            </label>

                            <textarea
                                id="reporteLogros"
                                name="logros"
                                rows="4"
                                maxlength="5000"
                                required
                                style="width:100%;box-sizing:border-box;padding:11px;border:1px solid #cbd5e1;border-radius:8px"
                            ></textarea>
                        </div>

                        <div class="il-campo">
                            <label for="reporteDificultades">
                                Dificultades (opcional)
                            </label>

                            <textarea
                                id="reporteDificultades"
                                name="dificultades"
                                rows="3"
                                maxlength="5000"
                                style="width:100%;box-sizing:border-box;padding:11px;border:1px solid #cbd5e1;border-radius:8px"
                            ></textarea>
                        </div>

                        <div class="il-campo">
                            <label for="reporteApoyo">
                                Apoyo solicitado (opcional)
                            </label>

                            <textarea
                                id="reporteApoyo"
                                name="apoyo_solicitado"
                                rows="3"
                                maxlength="5000"
                                style="width:100%;box-sizing:border-box;padding:11px;border:1px solid #cbd5e1;border-radius:8px"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            class="il-boton"
                            id="guardarReporte"
                        >
                            Guardar reporte en SQLite
                        </button>

                    </form>
                </div>

                <div class="il-tarjeta bloque">
                    <h2>Mis seguimientos</h2>

                    <div id="seguimientos">
                        <p class="il-vacio">
                            Cargando reportes...
                        </p>
                    </div>
                </div>

            </div>
        `;

        $('filtroTematica')?.addEventListener(
            'change',
            renderizarCatalogo
        );

        $('filtroEstado')?.addEventListener(
            'change',
            renderizarCatalogo
        );

        return true;
    }

    // =====================================
    // CARGAR DATOS DESDE SQLITE
    // =====================================

    function renderizarTodo() {
        renderizarCatalogo();
        renderizarInscripciones();
        renderizarProgreso();
        prepararSelectorReportes();
    }

    async function cargarDatos() {
        if (cargando) return;

        cargando = true;

        try {
            const [
                listaProgramas,
                listaInscripciones
            ] = await Promise.all([
                solicitar(RUTAS.programas),
                solicitar(RUTAS.inscripciones)
            ]);

            if (
                !Array.isArray(listaProgramas) ||
                !Array.isArray(listaInscripciones)
            ) {
                throw new Error(
                    'El servidor devolvió datos inesperados.'
                );
            }

            programas = listaProgramas;
            inscripciones = listaInscripciones;

            actualizarTematicas();
            renderizarTodo();
            mensaje('');

            await cargarReportes();

        } catch (error) {
            mensaje(
                'No se pudieron cargar los programas: ' +
                error.message,
                true
            );
        } finally {
            cargando = false;
        }
    }

    // =====================================
    // REGISTRAR INSCRIPCIÓN
    // =====================================

    document.addEventListener(
        'click',
        async function (evento) {
            const boton = evento.target.closest(
                '[data-inscribir]'
            );

            if (!boton || enviando) return;

            const id = Number(
                boton.dataset.inscribir
            );

            const programa = programas.find(
                p => Number(p.id) === id
            );

            if (
                !programa ||
                programa.estado !== 'activo' ||
                cuposLibres(programa) < 1 ||
                inscripciones.some(
                    i => Number(i.programa_id) === id
                )
            ) {
                return;
            }

            enviando = true;
            boton.disabled = true;

            try {
                const respuesta = await solicitar(
                    RUTAS.inscripciones,
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            programa_id: id
                        })
                    }
                );

                await cargarDatos();

                mensaje(
                    respuesta?.message ||
                    'Inscripción registrada correctamente.'
                );

            } catch (error) {
                await cargarDatos();
                mensaje(error.message, true);

            } finally {
                enviando = false;
                renderizarCatalogo();
            }
        }
    );

    // =====================================
    // GUARDAR REPORTE DE AVANCE
    // =====================================

    document.addEventListener(
        'submit',
        async function (evento) {
            if (
                evento.target?.id !==
                'formReporteAvance'
            ) {
                return;
            }

            evento.preventDefault();

            if (enviandoReporte) return;

            const formulario = evento.target;

            if (!formulario.reportValidity()) {
                return;
            }

            const datos = Object.fromEntries(
                new FormData(formulario).entries()
            );

            const inscripcionId = Number(
                datos.inscripcion_id
            );

            const inscripcionValida = inscripciones.some(
                i => Number(i.id) === inscripcionId
            );

            if (!inscripcionValida) {
                mensajeReporte(
                    'Selecciona una inscripción válida.',
                    true
                );
                return;
            }

            enviandoReporte = true;
            prepararSelectorReportes();

            try {
                const respuesta = await solicitar(
                    RUTAS.reportes,
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            inscripcion_id: inscripcionId,
                            fecha: datos.fecha,
                            logros: datos.logros.trim(),
                            dificultades:
                                datos.dificultades.trim() || null,
                            apoyo_solicitado:
                                datos.apoyo_solicitado.trim() || null
                        })
                    }
                );

                formulario.reset();

                await cargarReportes();

                mensajeReporte(
                    respuesta?.message ||
                    'Reporte registrado correctamente.'
                );

            } catch (error) {
                mensajeReporte(
                    error.message,
                    true
                );

            } finally {
                enviandoReporte = false;
                prepararSelectorReportes();
            }
        }
    );

    // =====================================
    // INICIALIZACIÓN
    // =====================================

    if (prepararInterfaz()) {
        $('catalogoProgramas').innerHTML = `
            <p class="il-vacio">
                Cargando programas desde SQLite...
            </p>
        `;

        cargarDatos();
    }
});
