document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // ==========================================
    // CONFIGURACIÓN
    // ==========================================

    const $ = id => document.getElementById(id);

    const RUTAS = {
        programas: "/instructor/programas",

        participantes: id =>
            `/instructor/programas/${id}/participantes`,

        reportes: id =>
            `/instructor/inscripciones/${id}/reportes`,

        observaciones: id =>
            `/instructor/inscripciones/${id}/observaciones`,

        progreso: id =>
            `/instructor/inscripciones/${id}/progreso`
    };

    const csrf = document.querySelector(
        'meta[name="csrf-token"]'
    )?.content;

    const contenedorProgramas = $("contenedorProgramas");
    const panelParticipantes = $("panelParticipantes");
    const tituloParticipantes = $("tituloParticipantes");
    const contenidoParticipantes = $("contenidoParticipantes");
    const panelSeguimiento = $("panelSeguimiento");
    const modalObservacion = $("modalObservacion");
    const formObservacion = $("formObservacion");

    let programas = [];
    let participantes = [];
    let programaSeleccionado = null;
    let participanteSeleccionado = null;
    let guardando = false;
    let guardandoProgreso = false;
    let solicitudParticipantes = 0;
    let solicitudSeguimiento = 0;

    // ==========================================
    // FUNCIONES GENERALES
    // ==========================================

    function escaparHTML(valor) {
        return String(valor ?? "").replace(
            /[&<>"']/g,
            caracter => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[caracter]
        );
    }

    function fechaLocal() {
        const hoy = new Date();

        const anio = hoy.getFullYear();
        const mes = String(
            hoy.getMonth() + 1
        ).padStart(2, "0");

        const dia = String(
            hoy.getDate()
        ).padStart(2, "0");

        return `${anio}-${mes}-${dia}`;
    }

    function fechaCorta(valor) {
        if (!valor) return "Sin fecha";

        return String(valor).slice(0, 10);
    }

    function porcentaje(valor) {
        const numero = Number(valor);

        if (!Number.isFinite(numero)) return 0;

        return Math.max(0, Math.min(100, numero));
    }

    function mostrarMensaje(texto) {
        const elemento = $("mensajeInstructor");

        if (!elemento) return;

        elemento.textContent = texto;
        elemento.hidden = false;

        clearTimeout(mostrarMensaje.temporizador);

        mostrarMensaje.temporizador = setTimeout(() => {
            elemento.hidden = true;
        }, 4500);
    }

    function mostrarError(error) {
        console.error(error);

        mostrarMensaje(
            error.message || "Ocurrió un error inesperado."
        );
    }

    async function solicitarLaravel(url, opciones = {}) {
        const respuesta = await fetch(url, {
            ...opciones,
            credentials: "same-origin",
            headers: {
                Accept: "application/json",

                ...(opciones.body
                    ? { "Content-Type": "application/json" }
                    : {}),

                ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),

                ...(opciones.headers || {})
            }
        });

        const tipo = respuesta.headers.get(
            "content-type"
        ) || "";

        const datos = tipo.includes("application/json")
            ? await respuesta.json()
            : null;

        if (!respuesta.ok) {
            const errores = datos?.errors;

            const primerError = errores
                ? Object.values(errores).flat()[0]
                : null;

            throw new Error(
                primerError ||
                datos?.message ||
                `Error del servidor (${respuesta.status}).`
            );
        }

        if (datos === null) {
            throw new Error(
                "Laravel no devolvió una respuesta JSON válida."
            );
        }

        return datos;
    }

    function obtenerPrograma(id) {
        return programas.find(
            programa => Number(programa.id) === Number(id)
        );
    }

    function obtenerParticipante(id) {
        return participantes.find(
            participante =>
                Number(participante.id) === Number(id)
        );
    }

    function nombreEmprendedor(inscripcion) {
        return inscripcion.emprendedor?.name ||
            "Emprendedor sin nombre";
    }

    function negocioEmprendedor(inscripcion) {
        return inscripcion.emprendedor?.nombre_negocio ||
            "Sin emprendimiento registrado";
    }

    // ==========================================
    // PROGRAMAS ASIGNADOS DESDE SQLITE
    // ==========================================

    async function cargarProgramas() {
        contenedorProgramas.innerHTML =
            "<p>Cargando programas asignados...</p>";

        try {
            const respuesta = await solicitarLaravel(
                RUTAS.programas
            );

            if (!Array.isArray(respuesta)) {
                throw new Error(
                    "El servidor no devolvió una lista de programas."
                );
            }

            programas = respuesta;

            mostrarProgramas();

        } catch (error) {
            contenedorProgramas.innerHTML =
                '<p class="estado-vacio">' +
                'No se pudieron cargar los programas.' +
                '</p>';

            mostrarError(error);
        }
    }

    function mostrarProgramas() {
        $("cantidadProgramas").textContent =
            programas.length;

        if (programas.length === 0) {
            contenedorProgramas.innerHTML = `
                <p class="estado-vacio">
                    Todavía no tienes programas asignados.
                </p>
            `;

            return;
        }

        contenedorProgramas.innerHTML = programas.map(
            programa => {
                const seleccionado =
                    Number(programaSeleccionado) ===
                    Number(programa.id);

                const inscritos = Number(
                    programa.inscripciones_count || 0
                );

                const cupos = Number(programa.cupos || 0);

                const duracion =
                    programa.duracion_semanas
                        ? `${programa.duracion_semanas} semanas`
                        : "No definida";

                const estado = String(
                    programa.estado || "sin estado"
                );

                const claseEstado = [
                    "activo",
                    "inactivo",
                    "finalizado"
                ].includes(estado)
                    ? estado
                    : "inactivo";

                return `
                    <article class="tarjeta-programa
                        ${seleccionado ? "seleccionada" : ""}">

                        <div class="programa-cabecera">
                            <h3>
                                ${escaparHTML(programa.nombre)}
                            </h3>

                            <span class="estado-programa
                                ${claseEstado}">
                                ${escaparHTML(estado)}
                            </span>
                        </div>

                        <span class="tematica">
                            ${escaparHTML(programa.tematica)}
                        </span>

                        <div class="dato-programa">
                            <span>Duración:</span>
                            <span>${escaparHTML(duracion)}</span>
                        </div>

                        <div class="dato-programa">
                            <span>Inscritos:</span>
                            <strong>${inscritos}/${cupos}</strong>
                        </div>

                        <div class="dato-programa">
                            <span>Inicio:</span>
                            <span>
                                ${escaparHTML(
                                    fechaCorta(programa.fecha_inicio)
                                )}
                            </span>
                        </div>

                        <button
                            type="button"
                            class="boton-participantes"
                            data-programa="${programa.id}"
                            aria-expanded="${seleccionado}"
                            aria-controls="panelParticipantes">

                            ${seleccionado
                                ? "▲ Ocultar participantes"
                                : "▼ Ver participantes"}
                        </button>
                    </article>
                `;
            }
        ).join("");
    }

    // ==========================================
    // PARTICIPANTES DESDE SQLITE
    // ==========================================

    async function cargarParticipantes(programa) {
        const solicitud = ++solicitudParticipantes;

        tituloParticipantes.textContent =
            "Participantes — " + programa.nombre;

        contenidoParticipantes.innerHTML =
            "<p>Cargando participantes...</p>";

        panelParticipantes.hidden = false;

        try {
            const respuesta = await solicitarLaravel(
                RUTAS.participantes(programa.id)
            );

            if (
                solicitud !== solicitudParticipantes ||
                Number(programaSeleccionado) !==
                    Number(programa.id)
            ) {
                return;
            }

            if (!Array.isArray(respuesta.participantes)) {
                throw new Error(
                    "No se recibió la lista de participantes."
                );
            }

            participantes = respuesta.participantes;

            mostrarParticipantes();

        } catch (error) {
            if (solicitud !== solicitudParticipantes) return;

            contenidoParticipantes.innerHTML =
                '<p class="estado-vacio">' +
                'No se pudieron cargar los participantes.' +
                '</p>';

            mostrarError(error);
        }
    }

    function mostrarParticipantes() {
        if (participantes.length === 0) {
            contenidoParticipantes.innerHTML = `
                <p class="sin-participantes">
                    Sin participantes inscritos.
                </p>
            `;

            return;
        }

        const filas = participantes.map(inscripcion => {
            const progreso = porcentaje(
                inscripcion.progreso
            );

            const completado = progreso === 100;

            const estado = completado
                ? "completado"
                : inscripcion.estado || "en curso";

            const claseEstado = completado
                ? "completado"
                : "en-curso";

            return `
                <tr>
                    <td>
                        ${escaparHTML(
                            nombreEmprendedor(inscripcion)
                        )}
                    </td>

                    <td class="emprendimiento-tabla">
                        ${escaparHTML(
                            negocioEmprendedor(inscripcion)
                        )}
                    </td>

                    <td class="fecha-inscripcion">
                        ${escaparHTML(
                            fechaCorta(
                                inscripcion.fecha_inscripcion
                            )
                        )}
                    </td>

                    <td>
                        <div class="progreso-contenedor">
                            <div class="progreso-fondo">
                                <div
                                    class="progreso-relleno"
                                    style="width:${progreso}%">
                                </div>
                            </div>

                            <span class="progreso-texto">
                                ${progreso}%
                            </span>
                        </div>
                    </td>

                    <td>
                        <span class="estado-participante
                            ${claseEstado}">
                            ${escaparHTML(estado)}
                        </span>
                    </td>

                    <td>
                        <button
                            type="button"
                            class="boton-seguimiento"
                            data-seguimiento="${inscripcion.id}">
                            Ver seguimiento
                        </button>
                    </td>
                </tr>
            `;
        }).join("");

        contenidoParticipantes.innerHTML = `
            <div class="tabla-contenedor">
                <table>
                    <thead>
                        <tr>
                            <th>EMPRENDEDOR</th>
                            <th>EMPRENDIMIENTO</th>
                            <th>INSCRIPCIÓN</th>
                            <th>PROGRESO</th>
                            <th>ESTADO</th>
                            <th>SEGUIMIENTO</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${filas}
                    </tbody>
                </table>
            </div>
        `;
    }

    // ==========================================
    // ABRIR Y CERRAR PROGRAMAS
    // ==========================================

    contenedorProgramas.addEventListener(
        "click",
        async evento => {
            const boton = evento.target.closest(
                "[data-programa]"
            );

            if (!boton) return;

            const id = Number(boton.dataset.programa);

            if (Number(programaSeleccionado) === id) {
                programaSeleccionado = null;
                participanteSeleccionado = null;
                participantes = [];

                solicitudParticipantes++;
                solicitudSeguimiento++;

                panelParticipantes.hidden = true;
                panelSeguimiento.hidden = true;

                mostrarProgramas();
                return;
            }

            const programa = obtenerPrograma(id);

            if (!programa) return;

            programaSeleccionado = id;
            participanteSeleccionado = null;
            participantes = [];

            solicitudSeguimiento++;

            panelSeguimiento.hidden = true;

            mostrarProgramas();

            await cargarParticipantes(programa);
        }
    );

    $("cerrarParticipantes").addEventListener(
        "click",
        () => {
            programaSeleccionado = null;
            participanteSeleccionado = null;
            participantes = [];

            solicitudParticipantes++;
            solicitudSeguimiento++;

            panelParticipantes.hidden = true;
            panelSeguimiento.hidden = true;

            mostrarProgramas();
        }
    );

    // ==========================================
    // SELECCIONAR PARTICIPANTE
    // ==========================================

    contenidoParticipantes.addEventListener(
        "click",
        async evento => {
            const boton = evento.target.closest(
                "[data-seguimiento]"
            );

            if (!boton) return;

            const inscripcion = obtenerParticipante(
                boton.dataset.seguimiento
            );

            if (!inscripcion) return;

            participanteSeleccionado = inscripcion.id;

            panelSeguimiento.hidden = false;

            await mostrarSeguimiento();

            panelSeguimiento.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    );

    $("cerrarSeguimiento").addEventListener(
        "click",
        () => {
            participanteSeleccionado = null;
            solicitudSeguimiento++;
            panelSeguimiento.hidden = true;
        }
    );

    // ==========================================
    // SEGUIMIENTO DESDE SQLITE
    // ==========================================

    async function mostrarSeguimiento() {
        const programa = obtenerPrograma(
            programaSeleccionado
        );

        const inscripcion = obtenerParticipante(
            participanteSeleccionado
        );

        if (!programa || !inscripcion) return;

        const solicitud = ++solicitudSeguimiento;

        $("subtituloSeguimiento").textContent =
            programa.nombre;

        $("nombreSeguimiento").textContent =
            nombreEmprendedor(inscripcion);

        $("negocioSeguimiento").textContent =
            negocioEmprendedor(inscripcion);

        $("progresoSeguimiento").textContent =
            porcentaje(inscripcion.progreso) + "%";

        // Campo para actualizar el progreso.
        prepararControlProgreso(inscripcion);

        $("listaReportes").innerHTML =
            "<p>Cargando reportes...</p>";

        $("listaObservaciones").innerHTML =
            "<p>Cargando observaciones...</p>";

        const resultados = await Promise.allSettled([
            solicitarLaravel(
                RUTAS.reportes(inscripcion.id)
            ),

            solicitarLaravel(
                RUTAS.observaciones(inscripcion.id)
            )
        ]);

        if (
            solicitud !== solicitudSeguimiento ||
            Number(participanteSeleccionado) !==
                Number(inscripcion.id)
        ) {
            return;
        }

        const [resultadoReportes, resultadoObservaciones] =
            resultados;

        if (resultadoReportes.status === "fulfilled") {
            mostrarReportes(
                resultadoReportes.value.reportes || []
            );

        } else {
            $("listaReportes").innerHTML =
                "<p>No se pudieron cargar los reportes.</p>";

            mostrarError(resultadoReportes.reason);
        }

        if (
            resultadoObservaciones.status === "fulfilled"
        ) {
            mostrarObservaciones(
                resultadoObservaciones.value.observaciones || []
            );

        } else {
            $("listaObservaciones").innerHTML =
                "<p>No se pudieron cargar las observaciones.</p>";

            mostrarError(resultadoObservaciones.reason);
        }
    }

    // ==========================================
    // ACTUALIZAR PROGRESO DEL EMPRENDEDOR
    // ==========================================

    function prepararControlProgreso(inscripcion) {
        const elemento = $("progresoSeguimiento");

        if (!elemento) return;

        // Crear el control una sola vez.
        let contenedor = $("controlActualizarProgreso");

        if (!contenedor) {
            contenedor = document.createElement("div");

            contenedor.id = "controlActualizarProgreso";

            contenedor.style.marginTop = "12px";

            contenedor.innerHTML = `
                <label
                    for="nuevoProgreso"
                    style="display:block; margin-bottom:8px;">
                    Actualizar progreso (%)
                </label>

                <div style="
                    display:flex;
                    align-items:center;
                    gap:10px;
                    flex-wrap:wrap;">

                    <input
                        type="number"
                        id="nuevoProgreso"
                        min="0"
                        max="100"
                        step="1"
                        style="
                            width:90px;
                            padding:9px;
                            border:1px solid #cbd5e1;
                            border-radius:7px;">

                    <button
                        type="button"
                        id="guardarProgreso"
                        class="boton-primario">
                        Guardar progreso
                    </button>
                </div>
            `;

            elemento.parentElement.appendChild(
                contenedor
            );

            $("guardarProgreso").addEventListener(
                "click",
                guardarProgreso
            );
        }

        $("nuevoProgreso").value =
            porcentaje(inscripcion.progreso);
    }

    async function guardarProgreso() {
        if (guardandoProgreso) return;

        const inscripcion = obtenerParticipante(
            participanteSeleccionado
        );

        if (!inscripcion) {
            mostrarMensaje(
                "Selecciona un emprendedor."
            );
            return;
        }

        const campo = $("nuevoProgreso");

        if (!campo || campo.value.trim() === "") {
            mostrarMensaje(
                "Ingresa el porcentaje de progreso."
            );
            return;
        }

        const nuevoProgreso = Number(campo.value);

        if (
            !Number.isInteger(nuevoProgreso) ||
            nuevoProgreso < 0 ||
            nuevoProgreso > 100
        ) {
            mostrarMensaje(
                "El progreso debe ser un número entero entre 0 y 100."
            );
            return;
        }

        if (!csrf) {
            mostrarMensaje(
                "Falta el token de seguridad CSRF."
            );
            return;
        }

        const boton = $("guardarProgreso");

        guardandoProgreso = true;
        boton.disabled = true;
        boton.textContent = "Guardando...";

        try {
            const respuesta = await solicitarLaravel(
                RUTAS.progreso(inscripcion.id),
                {
                    method: "PATCH",

                    body: JSON.stringify({
                        progreso: nuevoProgreso
                    })
                }
            );

            // Refrescar los datos oficiales desde SQLite.
            const programa = obtenerPrograma(
                programaSeleccionado
            );

            if (programa) {
                await cargarParticipantes(programa);
            }

            const actualizada = obtenerParticipante(
                inscripcion.id
            );

            if (actualizada) {
                $("progresoSeguimiento").textContent =
                    porcentaje(actualizada.progreso) + "%";

                $("nuevoProgreso").value =
                    porcentaje(actualizada.progreso);
            }

            mostrarMensaje(
                respuesta.message ||
                "Progreso actualizado correctamente en SQLite."
            );

        } catch (error) {
            mostrarError(error);

        } finally {
            guardandoProgreso = false;
            boton.disabled = false;
            boton.textContent = "Guardar progreso";
        }
    }

    // ==========================================
    // REPORTES DE AVANCE REALES
    // ==========================================

    function mostrarReportes(reportes) {
        if (!reportes.length) {
            $("listaReportes").innerHTML = `
                <p class="estado-vacio">
                    Este participante todavía no tiene
                    reportes de avance registrados.
                </p>
            `;

            return;
        }

        $("listaReportes").innerHTML = reportes.map(
            reporte => `
                <article class="registro-seguimiento">

                    <div class="registro-cabecera">
                        <div>
                            <strong>Reporte de avance</strong>

                            <small>
                                ${escaparHTML(
                                    fechaCorta(reporte.fecha)
                                )}
                            </small>
                        </div>

                        <span class="estado-seguimiento pendiente">
                            Reportado
                        </span>
                    </div>

                    <div class="registro-campo">
                        <strong>Avances o logros</strong>

                        <p>
                            ${escaparHTML(reporte.logros)}
                        </p>
                    </div>

                    <div class="registro-campo">
                        <strong>Dificultades</strong>

                        <p>
                            ${escaparHTML(
                                reporte.dificultades ||
                                "No registradas"
                            )}
                        </p>
                    </div>

                    <div class="registro-campo">
                        <strong>Apoyo solicitado</strong>

                        <p>
                            ${escaparHTML(
                                reporte.apoyo_solicitado ||
                                "No registrado"
                            )}
                        </p>
                    </div>

                </article>
            `
        ).join("");
    }

    // ==========================================
    // OBSERVACIONES REALES DESDE SQLITE
    // ==========================================

    function mostrarObservaciones(observaciones) {
        if (!observaciones.length) {
            $("listaObservaciones").innerHTML = `
                <p class="estado-vacio">
                    Todavía no se han registrado
                    observaciones para este participante.
                </p>
            `;

            return;
        }

        const nombresTipo = {
            revision: "Revisión de avance",
            asesoria: "Asesoría",
            llamada: "Llamada",
            visita: "Visita"
        };

        $("listaObservaciones").innerHTML =
            observaciones.map(observacion => {
                const claseEstado =
                    observacion.estado === "revisado"
                        ? "revisado"
                        : observacion.estado === "requiere apoyo"
                            ? "apoyo"
                            : "pendiente";

                const tipo =
                    nombresTipo[observacion.tipo] ||
                    observacion.tipo;

                return `
                    <article class="registro-seguimiento">

                        <div class="registro-cabecera">
                            <div>
                                <strong>
                                    ${escaparHTML(tipo)}
                                </strong>

                                <small>
                                    ${escaparHTML(
                                        fechaCorta(
                                            observacion.fecha
                                        )
                                    )}
                                </small>
                            </div>

                            <span class="estado-seguimiento
                                ${claseEstado}">
                                ${escaparHTML(
                                    observacion.estado
                                )}
                            </span>
                        </div>

                        <div class="registro-campo">
                            <strong>
                                Observaciones y recomendaciones
                            </strong>

                            <p>
                                ${escaparHTML(
                                    observacion.comentario
                                )}
                            </p>
                        </div>

                    </article>
                `;
            }).join("");
    }

    // ==========================================
    // ABRIR MODAL DE OBSERVACIONES
    // ==========================================

    $("abrirObservacion").addEventListener(
        "click",
        () => {
            const inscripcion = obtenerParticipante(
                participanteSeleccionado
            );

            if (!inscripcion) {
                mostrarMensaje(
                    "Selecciona un participante."
                );
                return;
            }

            formObservacion.reset();

            $("fechaObservacion").value = fechaLocal();
            $("fechaObservacion").max = fechaLocal();

            modalObservacion.showModal();
        }
    );

    $("cancelarObservacion").addEventListener(
        "click",
        () => {
            if (!guardando) {
                modalObservacion.close();
            }
        }
    );

    // ==========================================
    // GUARDAR OBSERVACIÓN EN SQLITE
    // ==========================================

    formObservacion.addEventListener(
        "submit",
        async evento => {
            evento.preventDefault();

            if (guardando) return;

            const inscripcion = obtenerParticipante(
                participanteSeleccionado
            );

            if (!inscripcion) {
                mostrarMensaje(
                    "No se encontró la inscripción."
                );
                return;
            }

            const fecha = $("fechaObservacion").value;
            const tipo = $("tipoObservacion").value;

            const comentario = $(
                "comentarioObservacion"
            ).value.trim();

            const estado = $("estadoObservacion").value;

            const tiposValidos = [
                "revision",
                "asesoria",
                "llamada",
                "visita"
            ];

            const estadosValidos = [
                "revisado",
                "requiere apoyo",
                "pendiente"
            ];

            if (
                !fecha ||
                !tiposValidos.includes(tipo) ||
                !comentario ||
                !estadosValidos.includes(estado)
            ) {
                mostrarMensaje(
                    "Completa correctamente los campos."
                );
                return;
            }

            if (fecha > fechaLocal()) {
                mostrarMensaje(
                    "La fecha no puede ser futura."
                );
                return;
            }

            if (comentario.length > 1500) {
                mostrarMensaje(
                    "El comentario supera los 1500 caracteres."
                );
                return;
            }

            if (!csrf) {
                mostrarMensaje(
                    "Falta el token de seguridad CSRF."
                );
                return;
            }

            const botonGuardar =
                formObservacion.querySelector(
                    'button[type="submit"]'
                );

            guardando = true;
            botonGuardar.disabled = true;

            try {
                const respuesta = await solicitarLaravel(
                    RUTAS.observaciones(inscripcion.id),
                    {
                        method: "POST",

                        body: JSON.stringify({
                            fecha,
                            tipo,
                            comentario,
                            estado
                        })
                    }
                );

                modalObservacion.close();
                formObservacion.reset();

                mostrarMensaje(
                    respuesta.message ||
                    "Observación registrada correctamente en SQLite."
                );

                await mostrarSeguimiento();

            } catch (error) {
                mostrarError(error);

            } finally {
                guardando = false;
                botonGuardar.disabled = false;
            }
        }
    );

    // ==========================================
    // FOOTER INFORMATIVO
    // ==========================================

    document.querySelectorAll(
        "[data-informativo]"
    ).forEach(enlace => {
        enlace.addEventListener(
            "click",
            evento => {
                evento.preventDefault();

                alert(
                    `La sección ${enlace.dataset.informativo} ` +
                    "está pendiente de implementar."
                );
            }
        );
    });

    // ==========================================
    // CARGA INICIAL
    // ==========================================

    cargarProgramas();
});
