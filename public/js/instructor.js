
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // DATOS DE DEMOSTRACIÓN
    // ==========================================

    const programas = [
        {
            id: 1,
            nombre: "Plan de Negocios desde Cero",
            tematica: "Estrategia",
            estado: "activo",
            duracion: "8 semanas",
            cupos: 30,
            inicio: "2024-07-01",
            participantes: [
                {
                    nombre: "María García",
                    emprendimiento: "Panadería El Trigal",
                    inscripcion: "2024-07-02",
                    progreso: 75
                },
                {
                    nombre: "Jorge Pérez",
                    emprendimiento: "Artesanías Pérez",
                    inscripcion: "2024-07-03",
                    progreso: 60
                }
            ]
        },
        {
            id: 2,
            nombre: "Marketing Digital para Emprendedores",
            tematica: "Marketing",
            estado: "activo",
            duracion: "6 semanas",
            cupos: 25,
            inicio: "2024-07-15",
            participantes: [
                {
                    nombre: "María García",
                    emprendimiento: "Panadería El Trigal",
                    inscripcion: "2024-07-16",
                    progreso: 50
                },
                {
                    nombre: "Lucía Ramírez",
                    emprendimiento: "Modas Lucía",
                    inscripcion: "2024-07-17",
                    progreso: 80
                }
            ]
        },
        {
            id: 3,
            nombre: "Finanzas para No Financieros",
            tematica: "Finanzas",
            estado: "activo",
            duracion: "5 semanas",
            cupos: 20,
            inicio: "2024-08-01",
            participantes: [
                {
                    nombre: "Jorge Pérez",
                    emprendimiento: "Artesanías Pérez",
                    inscripcion: "2024-08-02",
                    progreso: 30
                },
                {
                    nombre: "Tomás Herrera",
                    emprendimiento: "Taller Herrera",
                    inscripcion: "2024-08-03",
                    progreso: 20
                }
            ]
        },
        {
            id: 4,
            nombre: "Liderazgo y Gestión de Equipos",
            tematica: "Liderazgo",
            estado: "inactivo",
            duracion: "7 semanas",
            cupos: 20,
            inicio: "2024-09-01",
            participantes: []
        },
        {
            id: 5,
            nombre: "E-commerce: Vende en Línea",
            tematica: "Ventas",
            estado: "activo",
            duracion: "6 semanas",
            cupos: 30,
            inicio: "2024-08-15",
            participantes: [
                {
                    nombre: "Lucía Ramírez",
                    emprendimiento: "Modas Lucía",
                    inscripcion: "2024-08-16",
                    progreso: 40
                },
                {
                    nombre: "Camila Torres",
                    emprendimiento: "Tienda La Esquina",
                    inscripcion: "2024-08-17",
                    progreso: 55
                }
            ]
        },
        {
            id: 6,
            nombre: "Atención al Cliente y Fidelización",
            tematica: "Ventas",
            estado: "finalizado",
            duracion: "4 semanas",
            cupos: 25,
            inicio: "2024-05-01",
            participantes: [
                {
                    nombre: "María García",
                    emprendimiento: "Panadería El Trigal",
                    inscripcion: "2024-05-02",
                    progreso: 100
                },
                {
                    nombre: "Andrés Molina",
                    emprendimiento: "Sabores Molina",
                    inscripcion: "2024-05-03",
                    progreso: 100
                }
            ]
        }
    ];

    // Reportes de ejemplo.
    // No están sincronizados con el emprendedor.

    const reportesEjemplo = [
        {
            programaId: 1,
            emprendedor: "María García",
            fecha: "2024-07-10",
            logros: "He organizado mejor los gastos de mi panadería.",
            dificultades: "Tengo dudas sobre el presupuesto inicial.",
            apoyo: "Necesito orientación para calcular costos."
        },
        {
            programaId: 2,
            emprendedor: "María García",
            fecha: "2024-08-05",
            logros: "He creado una página para promocionar mis productos.",
            dificultades: "No conozco bien las herramientas de publicidad.",
            apoyo: "Necesito asesoría sobre marketing digital."
        }
    ];

    // ==========================================
    // ELEMENTOS HTML
    // ==========================================

    const $ = id => document.getElementById(id);

    const contenedorProgramas = $("contenedorProgramas");
    const panelParticipantes = $("panelParticipantes");
    const tituloParticipantes = $("tituloParticipantes");
    const contenidoParticipantes = $("contenidoParticipantes");

    const panelSeguimiento = $("panelSeguimiento");
    const modalObservacion = $("modalObservacion");
    const formObservacion = $("formObservacion");

    let programaSeleccionado = null;
    let participanteSeleccionado = null;

    // ==========================================
    // ALMACENAMIENTO LOCAL
    // ==========================================

    const CLAVE = "impulsa-instructor-observaciones-v1";

    function cargarObservaciones() {
        try {
            const guardado = JSON.parse(
                localStorage.getItem(CLAVE) || "[]"
            );

            return Array.isArray(guardado) ? guardado : [];
        } catch (error) {
            console.warn("No se pudieron cargar observaciones.", error);
            return [];
        }
    }

    let observaciones = cargarObservaciones();

    function guardarObservaciones() {
        try {
            localStorage.setItem(
                CLAVE,
                JSON.stringify(observaciones)
            );

            return true;
        } catch (error) {
            console.error("Error al guardar observaciones:", error);
            mostrarMensaje("No se pudo guardar la observación.");
            return false;
        }
    }

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
            }[caracter])
        );
    }

    function fechaLocal() {
        const hoy = new Date();

        const anio = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, "0");
        const dia = String(hoy.getDate()).padStart(2, "0");

        return `${anio}-${mes}-${dia}`;
    }

    function mostrarMensaje(texto) {
        const elemento = $("mensajeInstructor");

        elemento.textContent = texto;
        elemento.hidden = false;

        clearTimeout(mostrarMensaje.temporizador);

        mostrarMensaje.temporizador = setTimeout(() => {
            elemento.hidden = true;
        }, 3500);
    }

    function obtenerPrograma(id) {
        return programas.find(
            programa => programa.id === Number(id)
        );
    }

    function obtenerParticipante(programa, indice) {
        if (!programa) return null;

        return programa.participantes[Number(indice)] || null;
    }

    // ==========================================
    // MOSTRAR PROGRAMAS
    // ==========================================

    function mostrarProgramas() {

        $("cantidadProgramas").textContent = programas.length;

        contenedorProgramas.innerHTML = programas.map(programa => {

            const seleccionado =
                programaSeleccionado === programa.id;

            const cantidad = programa.participantes.length;

            const textoBoton = seleccionado
                ? "▲ Ocultar participantes"
                : "▼ Ver participantes";

            return `
                <article class="tarjeta-programa
                    ${seleccionado ? "seleccionada" : ""}">

                    <div class="programa-cabecera">
                        <h3>${escaparHTML(programa.nombre)}</h3>

                        <span class="estado-programa
                            ${programa.estado}">
                            ${escaparHTML(programa.estado)}
                        </span>
                    </div>

                    <span class="tematica">
                        ${escaparHTML(programa.tematica)}
                    </span>

                    <div class="dato-programa">
                        <span>Duración:</span>
                        <span>${escaparHTML(programa.duracion)}</span>
                    </div>

                    <div class="dato-programa">
                        <span>Inscritos:</span>
                        <strong>${cantidad}/${programa.cupos}</strong>
                    </div>

                    <div class="dato-programa">
                        <span>Inicio:</span>
                        <span>${escaparHTML(programa.inicio)}</span>
                    </div>

                    <button
                        type="button"
                        class="boton-participantes"
                        data-programa="${programa.id}"
                        aria-expanded="${seleccionado}"
                        aria-controls="panelParticipantes">
                        ${textoBoton}
                    </button>

                </article>
            `;
        }).join("");
    }

    // ==========================================
    // MOSTRAR PARTICIPANTES
    // ==========================================

    function mostrarParticipantes(programa) {

        tituloParticipantes.textContent =
            "Participantes — " + programa.nombre;

        if (programa.participantes.length === 0) {
            contenidoParticipantes.innerHTML = `
                <p class="sin-participantes">
                    Sin participantes inscritos.
                </p>
            `;

            panelParticipantes.hidden = false;
            return;
        }

        const filas = programa.participantes.map(
            (persona, indice) => {

                const completado = persona.progreso === 100;

                const estado = completado
                    ? "completado"
                    : "en curso";

                const claseEstado = completado
                    ? "completado"
                    : "en-curso";

                return `
                    <tr>
                        <td>
                            ${escaparHTML(persona.nombre)}
                        </td>

                        <td class="emprendimiento-tabla">
                            ${escaparHTML(persona.emprendimiento)}
                        </td>

                        <td class="fecha-inscripcion">
                            ${escaparHTML(persona.inscripcion)}
                        </td>

                        <td>
                            <div class="progreso-contenedor">
                                <div class="progreso-fondo">
                                    <div
                                        class="progreso-relleno"
                                        style="width:${persona.progreso}%">
                                    </div>
                                </div>

                                <span class="progreso-texto">
                                    ${persona.progreso}%
                                </span>
                            </div>
                        </td>

                        <td>
                            <span class="estado-participante
                                ${claseEstado}">
                                ${estado}
                            </span>
                        </td>

                        <td>
                            <button
                                type="button"
                                class="boton-seguimiento"
                                data-seguimiento="${indice}">
                                Ver seguimiento
                            </button>
                        </td>
                    </tr>
                `;
            }
        ).join("");

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

        panelParticipantes.hidden = false;
    }

    // ==========================================
    // ABRIR Y CERRAR PROGRAMAS
    // ==========================================

    contenedorProgramas.addEventListener("click", evento => {

        const boton = evento.target.closest("[data-programa]");

        if (!boton) return;

        const idPrograma = Number(boton.dataset.programa);

        if (programaSeleccionado === idPrograma) {
            programaSeleccionado = null;
            participanteSeleccionado = null;

            panelParticipantes.hidden = true;
            panelSeguimiento.hidden = true;

            mostrarProgramas();
            return;
        }

        const programa = obtenerPrograma(idPrograma);

        if (!programa) return;

        programaSeleccionado = idPrograma;
        participanteSeleccionado = null;

        panelSeguimiento.hidden = true;

        mostrarProgramas();
        mostrarParticipantes(programa);
    });

    $("cerrarParticipantes").addEventListener("click", () => {
        programaSeleccionado = null;
        participanteSeleccionado = null;

        panelParticipantes.hidden = true;
        panelSeguimiento.hidden = true;

        mostrarProgramas();
    });

    // ==========================================
    // SELECCIONAR PARTICIPANTE
    // ==========================================

    contenidoParticipantes.addEventListener("click", evento => {

        const boton = evento.target.closest("[data-seguimiento]");

        if (!boton) return;

        const programa = obtenerPrograma(programaSeleccionado);

        const indice = Number(boton.dataset.seguimiento);

        const participante = obtenerParticipante(
            programa,
            indice
        );

        if (!participante) return;

        participanteSeleccionado = indice;

        mostrarSeguimiento();

        panelSeguimiento.hidden = false;

        panelSeguimiento.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    $("cerrarSeguimiento").addEventListener("click", () => {
        participanteSeleccionado = null;
        panelSeguimiento.hidden = true;
    });

    // ==========================================
    // MOSTRAR SEGUIMIENTO
    // ==========================================

    function mostrarSeguimiento() {

        const programa = obtenerPrograma(programaSeleccionado);

        const participante = obtenerParticipante(
            programa,
            participanteSeleccionado
        );

        if (!programa || !participante) return;

        $("subtituloSeguimiento").textContent = programa.nombre;

        $("nombreSeguimiento").textContent =
            participante.nombre;

        $("negocioSeguimiento").textContent =
            participante.emprendimiento;

        $("progresoSeguimiento").textContent =
            participante.progreso + "%";

        mostrarReportes(programa, participante);
        mostrarObservaciones(programa, participante);
    }

    // ==========================================
    // REPORTES DE AVANCE DE EJEMPLO
    // ==========================================

    function mostrarReportes(programa, participante) {

        const reportes = reportesEjemplo.filter(reporte =>
            reporte.programaId === programa.id &&
            reporte.emprendedor === participante.nombre
        );

        if (reportes.length === 0) {
            $("listaReportes").innerHTML = `
                <p class="estado-vacio">
                    Este participante todavía no tiene
                    reportes de avance disponibles en la demostración.
                </p>
            `;

            return;
        }

        $("listaReportes").innerHTML = reportes.map(reporte => `
            <article class="registro-seguimiento">

                <div class="registro-cabecera">
                    <div>
                        <strong>
                            ${escaparHTML(programa.nombre)}
                        </strong>

                        <small>
                            ${escaparHTML(reporte.fecha)}
                        </small>
                    </div>

                    <span class="estado-seguimiento pendiente">
                        Reportado
                    </span>
                </div>

                <div class="registro-campo">
                    <strong>Avances o logros</strong>
                    <p>${escaparHTML(reporte.logros)}</p>
                </div>

                <div class="registro-campo">
                    <strong>Dificultades</strong>
                    <p>${escaparHTML(reporte.dificultades)}</p>
                </div>

                <div class="registro-campo">
                    <strong>Apoyo solicitado</strong>
                    <p>${escaparHTML(reporte.apoyo)}</p>
                </div>

            </article>
        `).join("");
    }

    // ==========================================
    // HISTORIAL DE OBSERVACIONES
    // ==========================================

    function mostrarObservaciones(programa, participante) {

        const lista = observaciones.filter(observacion =>
            observacion.programaId === programa.id &&
            observacion.emprendedor === participante.nombre
        ).sort((a, b) =>
            b.fecha.localeCompare(a.fecha)
        );

        if (lista.length === 0) {
            $("listaObservaciones").innerHTML = `
                <p class="estado-vacio">
                    Todavía no se han registrado observaciones
                    para este participante en este programa.
                </p>
            `;

            return;
        }

        $("listaObservaciones").innerHTML = lista.map(
            observacion => {

                const claseEstado =
                    observacion.estado === "revisado"
                        ? "revisado"
                        : observacion.estado === "requiere apoyo"
                            ? "apoyo"
                            : "pendiente";

                return `
                    <article class="registro-seguimiento">

                        <div class="registro-cabecera">
                            <div>
                                <strong>
                                    ${escaparHTML(observacion.tipo)}
                                </strong>

                                <small>
                                    ${escaparHTML(observacion.fecha)}
                                    — Ana Instructora
                                </small>
                            </div>

                            <span class="estado-seguimiento
                                ${claseEstado}">
                                ${escaparHTML(observacion.estado)}
                            </span>
                        </div>

                        <div class="registro-campo">
                            <strong>Observaciones y recomendaciones</strong>
                            <p>${escaparHTML(observacion.comentario)}</p>
                        </div>

                    </article>
                `;
            }
        ).join("");
    }

    // ==========================================
    // ABRIR MODAL DE OBSERVACIÓN
    // ==========================================

    $("abrirObservacion").addEventListener("click", () => {

        const programa = obtenerPrograma(programaSeleccionado);

        const participante = obtenerParticipante(
            programa,
            participanteSeleccionado
        );

        if (!programa || !participante) {
            mostrarMensaje("Selecciona un participante.");
            return;
        }

        formObservacion.reset();

        $("fechaObservacion").value = fechaLocal();
        $("fechaObservacion").max = fechaLocal();

        modalObservacion.showModal();
    });

    $("cancelarObservacion").addEventListener("click", () => {
        modalObservacion.close();
    });

    // ==========================================
    // GUARDAR OBSERVACIÓN
    // ==========================================

    formObservacion.addEventListener("submit", evento => {

        evento.preventDefault();

        const programa = obtenerPrograma(programaSeleccionado);

        const participante = obtenerParticipante(
            programa,
            participanteSeleccionado
        );

        if (!programa || !participante) {
            mostrarMensaje("No se encontró el participante.");
            return;
        }

        const fecha = $("fechaObservacion").value;
        const tipo = $("tipoObservacion").value;
        const comentario =
            $("comentarioObservacion").value.trim();

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
            mostrarMensaje("Completa todos los campos.");
            return;
        }

        if (fecha > fechaLocal()) {
            mostrarMensaje("La fecha no puede ser futura.");
            return;
        }

        const nombresTipo = {
            revision: "Revisión de avance",
            asesoria: "Asesoría",
            llamada: "Llamada",
            visita: "Visita"
        };

        const nuevaObservacion = {
            id: String(Date.now()) + "-" +
                Math.random().toString(36).slice(2),

            programaId: programa.id,
            emprendedor: participante.nombre,
            fecha: fecha,
            tipo: nombresTipo[tipo],
            comentario: comentario,
            estado: estado
        };

        observaciones.push(nuevaObservacion);

        if (!guardarObservaciones()) {
            observaciones.pop();
            return;
        }

        mostrarObservaciones(programa, participante);

        modalObservacion.close();
        formObservacion.reset();

        mostrarMensaje(
            "Observación guardada correctamente."
        );
    });

    // ==========================================
    // FOOTER
    // ==========================================

    document.querySelectorAll("[data-informativo]")
        .forEach(enlace => {

            enlace.addEventListener("click", evento => {
                evento.preventDefault();

                alert(
                    `La sección ${enlace.dataset.informativo} ` +
                    "está pendiente de implementar."
                );
            });
        });

    // ==========================================
    // CARGA INICIAL
    // ==========================================

    mostrarProgramas();

});
