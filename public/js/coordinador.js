
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // DATOS DE DEMOSTRACIÓN
    // ==========================================

    const emprendedores = [
        {
            id: 1,
            nombre: "María García",
            correo: "maria@panaderia.com",
            emprendimiento: "Panadería El Trigal",
            actividad: "Panadería / Repostería",
            sector: "Alimentación",
            estado: "activo"
        },
        {
            id: 2,
            nombre: "Jorge Pérez",
            correo: "jorge@artesanias.com",
            emprendimiento: "Artesanías Pérez",
            actividad: "Artesanías",
            sector: "Cultura y Arte",
            estado: "activo"
        },
        {
            id: 3,
            nombre: "Lucía Ramírez",
            correo: "lucia@costura.com",
            emprendimiento: "Modas Lucía",
            actividad: "Costura / Confección",
            sector: "Textil",
            estado: "activo"
        },
        {
            id: 4,
            nombre: "Tomás Herrera",
            correo: "tomas@taller.com",
            emprendimiento: "Taller Herrera",
            actividad: "Taller de reparaciones",
            sector: "Servicios",
            estado: "activo"
        },
        {
            id: 5,
            nombre: "Camila Torres",
            correo: "camila@tienda.com",
            emprendimiento: "Tienda La Esquina",
            actividad: "Tienda de barrio",
            sector: "Comercio",
            estado: "activo"
        },
        {
            id: 6,
            nombre: "Andrés Molina",
            correo: "andres@comidas.com",
            emprendimiento: "Sabores Molina",
            actividad: "Restaurante / Comida",
            sector: "Alimentación",
            estado: "inactivo"
        }
    ];

    const programas = [
        {
            id: 1,
            nombre: "Plan de Negocios desde Cero",
            tematica: "Estrategia",
            estado: "activo",
            duracion: 8,
            cupos: 30,
            inicio: "2024-07-01",
            instructor: "Ana Instructora"
        },
        {
            id: 2,
            nombre: "Marketing Digital para Emprendedores",
            tematica: "Marketing",
            estado: "activo",
            duracion: 6,
            cupos: 25,
            inicio: "2024-07-15",
            instructor: "Ana Instructora"
        },
        {
            id: 3,
            nombre: "Finanzas para No Financieros",
            tematica: "Finanzas",
            estado: "activo",
            duracion: 5,
            cupos: 20,
            inicio: "2024-08-01",
            instructor: "Ana Instructora"
        },
        {
            id: 4,
            nombre: "Liderazgo y Gestión de Equipos",
            tematica: "Liderazgo",
            estado: "inactivo",
            duracion: 7,
            cupos: 20,
            inicio: "2024-09-01",
            instructor: "Ana Instructora"
        },
        {
            id: 5,
            nombre: "E-commerce: Vende en Línea",
            tematica: "Ventas",
            estado: "activo",
            duracion: 6,
            cupos: 30,
            inicio: "2024-08-15",
            instructor: "Ana Instructora"
        },
        {
            id: 6,
            nombre: "Atención al Cliente y Fidelización",
            tematica: "Ventas",
            estado: "finalizado",
            duracion: 4,
            cupos: 25,
            inicio: "2024-05-01",
            instructor: "Ana Instructora"
        }
    ];

    // Cada registro representa una inscripción.
    const avances = [
        {
            emprendedorId: 1,
            programaId: 1,
            progreso: 75
        },
        {
            emprendedorId: 1,
            programaId: 2,
            progreso: 50
        },
        {
            emprendedorId: 1,
            programaId: 6,
            progreso: 100
        },
        {
            emprendedorId: 2,
            programaId: 1,
            progreso: 60
        },
        {
            emprendedorId: 2,
            programaId: 3,
            progreso: 30
        },
        {
            emprendedorId: 3,
            programaId: 2,
            progreso: 80
        },
        {
            emprendedorId: 3,
            programaId: 5,
            progreso: 40
        },
        {
            emprendedorId: 4,
            programaId: 3,
            progreso: 20
        },
        {
            emprendedorId: 5,
            programaId: 5,
            progreso: 55
        },
        {
            emprendedorId: 6,
            programaId: 6,
            progreso: 100
        }
    ];

    // Casos de ejemplo para visualizar el módulo.
    // Todavía no están conectados con el funcionario
    // ni con el instructor.

    const apoyos = [
        {
            emprendedorId: 1,
            fecha: "2026-10-22",
            tipo: "Visita",
            estado: "Requiere apoyo",
            responsable: "Laura Funcionaria",
            observacion:
                "La emprendedora necesita orientación " +
                "para organizar el presupuesto inicial " +
                "de su panadería."
        },
        {
            emprendedorId: 3,
            fecha: "2026-10-18",
            tipo: "Asesoría",
            estado: "Pendiente",
            responsable: "Ana Instructora",
            observacion:
                "Se recomienda fortalecer sus conocimientos " +
                "en comercio electrónico."
        }
    ];

    // ==========================================
    // FUNCIONES GENERALES
    // ==========================================

    const $ = id => document.getElementById(id);

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

    function obtenerEmprendedor(id) {
        return emprendedores.find(e => e.id === id);
    }

    function obtenerPrograma(id) {
        return programas.find(p => p.id === id);
    }

    function nombreEmprendedor(id) {
        return obtenerEmprendedor(id)?.nombre || "No disponible";
    }

    function nombrePrograma(id) {
        return obtenerPrograma(id)?.nombre || "No disponible";
    }

    function claseEstado(estado) {
        const clases = {
            "activo": "activo",
            "inactivo": "inactivo",
            "finalizado": "finalizado",
            "completado": "completado",
            "en curso": "en-curso",
            "sin iniciar": "sin-iniciar",
            "Requiere apoyo": "requiere-apoyo",
            "Pendiente": "sin-iniciar",
            "Atendido": "completado"
        };

        return clases[estado] || "sin-iniciar";
    }

    function etiquetaEstado(estado) {
        return `
            <span class="estado ${claseEstado(estado)}">
                ${escaparHTML(estado)}
            </span>
        `;
    }

    function estadoProgreso(progreso) {
        if (progreso === 100) {
            return "completado";
        }

        if (progreso === 0) {
            return "sin iniciar";
        }

        return "en curso";
    }

    function porcentajeSeguro(valor) {
        const numero = Number(valor) || 0;
        return Math.max(0, Math.min(100, numero));
    }

    // ==========================================
    // NAVEGACIÓN
    // ==========================================

    const pestanas = document.querySelectorAll(".pestana");
    const secciones = document.querySelectorAll(".seccion");

    pestanas.forEach(boton => {
        boton.addEventListener("click", () => {
            const destino = boton.dataset.pestana;

            pestanas.forEach(p => {
                const activa = p === boton;

                p.classList.toggle("activa", activa);

                p.setAttribute(
                    "aria-selected",
                    String(activa)
                );
            });

            secciones.forEach(seccion => {
                const visible = seccion.id === destino;

                seccion.hidden = !visible;
                seccion.classList.toggle("activa", visible);
            });
        });
    });

    // ==========================================
    // CONTEOS
    // ==========================================

    function contarSectores() {
        const conteo = {};

        emprendedores.forEach(e => {
            conteo[e.sector] = (conteo[e.sector] || 0) + 1;
        });

        return Object.entries(conteo)
            .map(([nombre, cantidad]) => ({
                nombre,
                cantidad
            }))
            .sort((a, b) =>
                b.cantidad - a.cantidad ||
                a.nombre.localeCompare(b.nombre)
            );
    }

    function inscritosPrograma(programaId) {
        return avances.filter(
            a => a.programaId === programaId
        ).length;
    }

    function contarProgramas() {
        return programas.map(programa => ({
            id: programa.id,
            nombre: programa.nombre,
            cantidad: inscritosPrograma(programa.id)
        })).sort((a, b) =>
            b.cantidad - a.cantidad ||
            a.nombre.localeCompare(b.nombre)
        );
    }

    function casosQueRequierenApoyo() {
        return apoyos.filter(
            caso => caso.estado === "Requiere apoyo"
        );
    }

    // ==========================================
    // INDICADORES
    // ==========================================

    function mostrarIndicadores() {
        const activos = emprendedores.filter(
            e => e.estado === "activo"
        ).length;

        const inactivos = emprendedores.filter(
            e => e.estado === "inactivo"
        ).length;

        const promedio = avances.length
            ? Math.round(
                avances.reduce(
                    (suma, a) => suma + a.progreso,
                    0
                ) / avances.length
            )
            : 0;

        $("totalRegistrados").textContent =
            emprendedores.length;

        $("totalActivos").textContent = activos;

        $("totalInactivos").textContent = inactivos;

        $("totalProgramas").textContent =
            programas.length;

        $("programasActivos").textContent =
            programas.filter(
                p => p.estado === "activo"
            ).length;

        $("totalInscripciones").textContent =
            avances.length;

        $("totalApoyos").textContent =
            casosQueRequierenApoyo().length;

        $("promedioProgreso").textContent =
            `${promedio}%`;

        $("descripcionEmprendedores").textContent =
            `${activos} de ${emprendedores.length} ` +
            "emprendedores se encuentran activos en el programa.";
    }

    // ==========================================
    // BARRAS ESTADÍSTICAS
    // ==========================================

    function mostrarEstadisticas(contenedorId, datos) {
        const contenedor = $(contenedorId);

        if (!datos.length) {
            contenedor.innerHTML = `
                <p class="mensaje-vacio">
                    No hay datos disponibles.
                </p>
            `;
            return;
        }

        const maximo = Math.max(
            1,
            ...datos.map(d => d.cantidad)
        );

        contenedor.innerHTML = datos.map(d => {
            const porcentaje =
                porcentajeSeguro(d.cantidad / maximo * 100);

            return `
                <div class="estadistica">

                    <div class="estadistica-cabecera">
                        <span>${escaparHTML(d.nombre)}</span>
                        <strong>${d.cantidad}</strong>
                    </div>

                    <div class="barra-fondo">
                        <div class="barra-relleno"
                             style="width: ${porcentaje}%">
                        </div>
                    </div>

                </div>
            `;
        }).join("");
    }

    // ==========================================
    // FILTROS DE AVANCE
    // ==========================================

    function cargarFiltroProgramas() {
        $("filtroPrograma").innerHTML = `
            <option value="">Todos los programas</option>
            ${programas.map(p => `
                <option value="${p.id}">
                    ${escaparHTML(p.nombre)}
                </option>
            `).join("")}
        `;
    }

    function avancesFiltrados() {
        const busqueda = $("buscarAvance")
            .value.trim().toLowerCase();

        const programaId = $("filtroPrograma").value;
        const progreso = $("filtroProgreso").value;

        return avances.filter(a => {
            const emprendedor =
                obtenerEmprendedor(a.emprendedorId);

            const texto = [
                emprendedor?.nombre || "",
                emprendedor?.emprendimiento || ""
            ].join(" ").toLowerCase();

            const coincideTexto =
                texto.includes(busqueda);

            const coincidePrograma =
                !programaId ||
                a.programaId === Number(programaId);

            const estado = estadoProgreso(a.progreso);

            const coincideProgreso =
                !progreso ||
                (
                    progreso === "sin-iniciar" &&
                    estado === "sin iniciar"
                ) ||
                (
                    progreso === "en-curso" &&
                    estado === "en curso"
                ) ||
                (
                    progreso === "completado" &&
                    estado === "completado"
                );

            return (
                coincideTexto &&
                coincidePrograma &&
                coincideProgreso
            );
        });
    }

    // ==========================================
    // TABLA DE AVANCE
    // ==========================================

    function mostrarAvances() {
        const datos = avancesFiltrados();

        $("cantidadAvances").textContent =
            `${datos.length} registros`;

        $("sinAvances").hidden = datos.length > 0;

        $("tablaAvances").innerHTML = datos.map(a => {
            const emprendedor =
                obtenerEmprendedor(a.emprendedorId);

            const estado = estadoProgreso(a.progreso);

            return `
                <tr>
                    <td>
                        ${escaparHTML(
                            emprendedor?.nombre || ""
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            emprendedor?.emprendimiento || ""
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            nombrePrograma(a.programaId)
                        )}
                    </td>

                    <td>
                        <div class="progreso-contenedor">

                            <div class="progreso-fondo">
                                <div class="progreso-relleno"
                                     style="width:
                                     ${porcentajeSeguro(a.progreso)}%">
                                </div>
                            </div>

                            <span class="progreso-texto">
                                ${a.progreso}%
                            </span>

                        </div>
                    </td>

                    <td>
                        ${etiquetaEstado(estado)}
                    </td>
                </tr>
            `;
        }).join("");
    }

    // ==========================================
    // PROGRAMAS DE FORMACIÓN
    // ==========================================

    function programasFiltrados() {
        const busqueda = $("buscarPrograma")
            .value.trim().toLowerCase();

        const estado = $("filtroEstadoPrograma").value;

        return programas.filter(p =>
            p.nombre.toLowerCase().includes(busqueda) &&
            (!estado || p.estado === estado)
        );
    }

    function mostrarProgramas() {
        const datos = programasFiltrados();

        $("sinProgramas").hidden = datos.length > 0;

        $("cuadriculaProgramas").innerHTML =
            datos.map(p => {

                const inscritos = inscritosPrograma(p.id);

                const ocupacion = p.cupos
                    ? Math.round(inscritos / p.cupos * 100)
                    : 0;

                return `
                    <article class="tarjeta-programa">

                        <div class="programa-cabecera">
                            <h3>${escaparHTML(p.nombre)}</h3>
                            ${etiquetaEstado(p.estado)}
                        </div>

                        <span class="tematica">
                            ${escaparHTML(p.tematica)}
                        </span>

                        <div class="dato-programa">
                            <span>Instructor:</span>
                            <strong>
                                ${escaparHTML(p.instructor)}
                            </strong>
                        </div>

                        <div class="dato-programa">
                            <span>Duración:</span>
                            <strong>${p.duracion} semanas</strong>
                        </div>

                        <div class="dato-programa">
                            <span>Inicio:</span>
                            <strong>${escaparHTML(p.inicio)}</strong>
                        </div>

                        <div class="dato-programa">
                            <span>Inscritos:</span>
                            <strong>
                                ${inscritos}/${p.cupos}
                            </strong>
                        </div>

                        <div class="ocupacion-titulo">
                            <span>Ocupación de cupos</span>
                            <strong>${ocupacion}%</strong>
                        </div>

                        <div class="barra-fondo">
                            <div class="barra-relleno"
                                 style="width:
                                 ${porcentajeSeguro(ocupacion)}%">
                            </div>
                        </div>

                    </article>
                `;
            }).join("");
    }

    // ==========================================
    // NECESIDADES DE APOYO
    // ==========================================

    function apoyosFiltrados() {
        const busqueda = $("buscarApoyo")
            .value.trim().toLowerCase();

        return apoyos.filter(caso => {
            const emprendedor =
                obtenerEmprendedor(caso.emprendedorId);

            return [
                emprendedor?.nombre || "",
                emprendedor?.emprendimiento || "",
                caso.observacion
            ].join(" ").toLowerCase().includes(busqueda);
        });
    }

    function mostrarApoyos() {
        const datos = apoyosFiltrados();

        $("cantidadApoyos").textContent =
            `${datos.length} casos`;

        $("sinApoyos").hidden = datos.length > 0;

        $("listaApoyos").innerHTML = datos.map(caso => {
            const emprendedor =
                obtenerEmprendedor(caso.emprendedorId);

            return `
                <article class="caso-apoyo">

                    <div class="caso-cabecera">
                        <div>
                            <h3>
                                ${escaparHTML(
                                    emprendedor?.nombre || ""
                                )}
                            </h3>

                            <small>
                                ${escaparHTML(
                                    emprendedor?.emprendimiento || ""
                                )}
                            </small>
                        </div>

                        ${etiquetaEstado(caso.estado)}
                    </div>

                    <p>
                        <strong>Fecha:</strong>
                        ${escaparHTML(caso.fecha)}
                    </p>

                    <p>
                        <strong>Tipo de seguimiento:</strong>
                        ${escaparHTML(caso.tipo)}
                    </p>

                    <p>
                        <strong>Responsable:</strong>
                        ${escaparHTML(caso.responsable)}
                    </p>

                    <p>
                        <strong>Observaciones:</strong>
                        ${escaparHTML(caso.observacion)}
                    </p>

                </article>
            `;
        }).join("");
    }

    // ==========================================
    // EXPORTACIÓN CSV
    // ==========================================

    function protegerCSV(valor) {
        let texto = String(valor ?? "");

        // Evita que Excel interprete datos
        // proporcionados por usuarios como fórmulas.
        if (/^\s*[=+\-@\t\r]/.test(texto)) {
            texto = "'" + texto;
        }

        return `"${texto.replace(/"/g, '""')}"`;
    }

    function descargarCSV(nombreArchivo, encabezados, registros) {
        const filas = [encabezados, ...registros];

        const contenido = filas.map(fila =>
            fila.map(protegerCSV).join(";")
        ).join("\r\n");

        const blob = new Blob(
            ["\uFEFF" + contenido],
            { type: "text/csv;charset=utf-8" }
        );

        const url = URL.createObjectURL(blob);

        const enlace = document.createElement("a");

        enlace.href = url;
        enlace.download = nombreArchivo;

        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    }

    function exportarReporte(tipo) {

        if (tipo === "emprendedores") {
            descargarCSV(
                "reporte_emprendedores.csv",
                [
                    "Nombre",
                    "Correo",
                    "Emprendimiento",
                    "Actividad económica",
                    "Sector",
                    "Estado"
                ],
                emprendedores.map(e => [
                    e.nombre,
                    e.correo,
                    e.emprendimiento,
                    e.actividad,
                    e.sector,
                    e.estado
                ])
            );
        }

        if (tipo === "sectores") {
            descargarCSV(
                "reporte_sectores.csv",
                [
                    "Sector económico",
                    "Cantidad de emprendedores"
                ],
                contarSectores().map(s => [
                    s.nombre,
                    s.cantidad
                ])
            );
        }

        if (tipo === "programas") {
            descargarCSV(
                "reporte_programas.csv",
                [
                    "Programa",
                    "Temática",
                    "Estado",
                    "Instructor",
                    "Duración en semanas",
                    "Fecha de inicio",
                    "Cupos",
                    "Inscripciones"
                ],
                programas.map(p => [
                    p.nombre,
                    p.tematica,
                    p.estado,
                    p.instructor,
                    p.duracion,
                    p.inicio,
                    p.cupos,
                    inscritosPrograma(p.id)
                ])
            );
        }

        if (tipo === "avances") {
            descargarCSV(
                "reporte_avances.csv",
                [
                    "Emprendedor",
                    "Emprendimiento",
                    "Programa",
                    "Progreso",
                    "Estado"
                ],
                avances.map(a => {
                    const e =
                        obtenerEmprendedor(a.emprendedorId);

                    return [
                        e?.nombre || "",
                        e?.emprendimiento || "",
                        nombrePrograma(a.programaId),
                        `${a.progreso}%`,
                        estadoProgreso(a.progreso)
                    ];
                })
            );
        }

        if (tipo === "apoyos") {
            descargarCSV(
                "reporte_necesidades_apoyo.csv",
                [
                    "Emprendedor",
                    "Emprendimiento",
                    "Fecha",
                    "Tipo",
                    "Responsable",
                    "Estado",
                    "Observaciones"
                ],
                apoyos.map(caso => {
                    const e =
                        obtenerEmprendedor(caso.emprendedorId);

                    return [
                        e?.nombre || "",
                        e?.emprendimiento || "",
                        caso.fecha,
                        caso.tipo,
                        caso.responsable,
                        caso.estado,
                        caso.observacion
                    ];
                })
            );
        }
    }

    // ==========================================
    // MENSAJES
    // ==========================================

    let temporizadorMensaje;

    function mostrarMensaje(texto) {
        const elemento = $("mensajeSistema");

        elemento.textContent = texto;
        elemento.hidden = false;

        clearTimeout(temporizadorMensaje);

        temporizadorMensaje = setTimeout(() => {
            elemento.hidden = true;
        }, 3500);
    }

    // ==========================================
    // EVENTOS
    // ==========================================

    $("buscarAvance").addEventListener(
        "input",
        mostrarAvances
    );

    $("filtroPrograma").addEventListener(
        "change",
        mostrarAvances
    );

    $("filtroProgreso").addEventListener(
        "change",
        mostrarAvances
    );

    $("buscarPrograma").addEventListener(
        "input",
        mostrarProgramas
    );

    $("filtroEstadoPrograma").addEventListener(
        "change",
        mostrarProgramas
    );

    $("buscarApoyo").addEventListener(
        "input",
        mostrarApoyos
    );

    document.querySelectorAll("[data-reporte]")
        .forEach(boton => {

            boton.addEventListener("click", () => {
                exportarReporte(boton.dataset.reporte);
            });
        });

    document.querySelectorAll("[data-informativo]")
        .forEach(enlace => {

            enlace.addEventListener("click", evento => {
                evento.preventDefault();

                mostrarMensaje(
                    `La sección ${enlace.dataset.informativo} ` +
                    "está pendiente de implementar."
                );
            });
        });

    // ==========================================
    // CARGA INICIAL
    // ==========================================

    cargarFiltroProgramas();

    mostrarIndicadores();

    mostrarEstadisticas(
        "listaSectores",
        contarSectores()
    );

    mostrarEstadisticas(
        "listaProgramas",
        contarProgramas()
    );

    mostrarAvances();
    mostrarProgramas();
    mostrarApoyos();

});
