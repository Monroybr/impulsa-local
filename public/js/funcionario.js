document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // CONFIGURACIÓN GENERAL
    // ==========================================

    const $ = id => document.getElementById(id);

    const RUTA_EMPRENDEDORES = "/funcionario/emprendedores";

    const csrfToken = document.querySelector(
        'meta[name="csrf-token"]'
    )?.content || "";

    const tabla = $("tablaEmprendedores");
    const modalDetalle = $("modalDetalle");
    const modalSeguimiento = $("modalSeguimiento");

    let emprendedores = [];
    let emprendedorDetalle = null;
    let temporizadorMensaje = null;
    let guardando = false;
    let cargando = false;
    let datosCargados = false;
    let solicitudDetalle = 0;

    // ==========================================
    // ELIMINAR ALMACENAMIENTO LOCAL ANTIGUO
    // ==========================================

    // Se elimina únicamente la clave histórica
    // del módulo Funcionario.
    // Los registros nuevos se guardarán en SQLite.

    try {
        localStorage.removeItem(
            "impulsa-funcionario-seguimientos-v2"
        );
    } catch (error) {
        console.warn(
            "No fue posible limpiar el almacenamiento antiguo:",
            error
        );
    }

    // ==========================================
    // FUNCIONES AUXILIARES
    // ==========================================

    function escapar(valor) {
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
        const fecha = new Date();

        const anio = fecha.getFullYear();

        const mes = String(
            fecha.getMonth() + 1
        ).padStart(2, "0");

        const dia = String(
            fecha.getDate()
        ).padStart(2, "0");

        return `${anio}-${mes}-${dia}`;
    }

    function formatearFecha(valor) {
        if (!valor) {
            return "No registrada";
        }

        return String(valor).slice(0, 10);
    }

    function mostrarMensaje(texto) {
        const elemento = $("mensajeSistema");

        if (!elemento) return;

        elemento.textContent = texto;
        elemento.hidden = false;

        clearTimeout(temporizadorMensaje);

        temporizadorMensaje = setTimeout(() => {
            elemento.hidden = true;
        }, 4500);
    }

    // ==========================================
    // PETICIONES A LARAVEL
    // ==========================================

    async function solicitarLaravel(url, opciones = {}) {

        const respuesta = await fetch(url, {
            ...opciones,

            credentials: "same-origin",

            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
                ...(opciones.headers || {})
            }
        });

        const tipoContenido = respuesta.headers.get(
            "content-type"
        ) || "";

        const datos = tipoContenido.includes("application/json")
            ? await respuesta.json()
            : null;

        if (!respuesta.ok) {

            if (
                respuesta.status === 401 ||
                respuesta.status === 419
            ) {
                throw new Error(
                    "La sesión ha expirado. Inicia sesión nuevamente."
                );
            }

            if (respuesta.status === 403) {
                throw new Error(
                    "No tienes permiso para realizar esta operación."
                );
            }

            if (datos?.errors) {
                const primerError = Object.values(
                    datos.errors
                )[0];

                throw new Error(
                    Array.isArray(primerError)
                        ? primerError[0]
                        : String(primerError)
                );
            }

            throw new Error(
                datos?.message ||
                `Error del servidor (${respuesta.status}).`
            );
        }

        return datos;
    }

    // ==========================================
    // INDICADORES DESDE SQLITE
    // ==========================================

    function actualizarIndicadores(datos = {}) {

        $("totalEmprendedores").textContent =
            Number(datos.total_emprendedores ?? 0);

        $("totalActivos").textContent =
            Number(datos.total_activos ?? 0);

        $("totalSeguimientos").textContent =
            Number(datos.total_seguimientos ?? 0);

        $("totalApoyo").textContent =
            Number(datos.total_apoyo ?? 0);
    }

    // ==========================================
    // CARGAR EMPRENDEDORES DESDE SQLITE
    // ==========================================

    async function cargarEmprendedores() {

        if (cargando) return;

        cargando = true;

        try {

            const respuesta = await solicitarLaravel(
                RUTA_EMPRENDEDORES
            );

            if (!Array.isArray(respuesta?.emprendedores)) {
                throw new Error(
                    "El servidor no devolvió un listado válido."
                );
            }

            emprendedores = respuesta.emprendedores.map(
                emprendedor => ({
                    id: Number(emprendedor.id),

                    nombre: emprendedor.nombre || "",

                    correo: emprendedor.correo || "",

                    emprendimiento:
                        emprendedor.emprendimiento || "",

                    actividad:
                        emprendedor.actividad || "",

                    telefono:
                        emprendedor.telefono || "",

                    direccion:
                        emprendedor.direccion || "",

                    estado:
                        emprendedor.estado || "inactivo",

                    atencion:
                        emprendedor.atencion || "Sin registro"
                })
            );

            datosCargados = true;

            actualizarIndicadores(
                respuesta.indicadores || {}
            );

            actualizarFiltroActividades();

            mostrarTabla();

            return true;

        } catch (error) {

            console.error(
                "Error al consultar SQLite:",
                error
            );

            mostrarMensaje(error.message);

            if (!datosCargados) {
                tabla.innerHTML = `
                    <tr>
                        <td colspan="6">
                            No fue posible consultar los
                            emprendedores en SQLite.
                        </td>
                    </tr>
                `;
            }

            return false;

        } finally {
            cargando = false;
        }
    }

    // ==========================================
    // ESTADO DE ATENCIÓN
    // ==========================================

    function estadoAtencion(emprendedor) {
        return emprendedor?.atencion || "Sin registro";
    }

    function claseAtencion(estado) {

        if (estado === "Requiere apoyo") {
            return "apoyo";
        }

        if (estado === "Atendido") {
            return "atendido";
        }

        if (estado === "Pendiente") {
            return "pendiente";
        }

        return "sin-registro";
    }

    // ==========================================
    // FILTRO DINÁMICO DE ACTIVIDADES
    // ==========================================

    function actualizarFiltroActividades() {

        const selector = $("filtroActividad");

        const valorActual = selector.value;

        const actividades = [
            ...new Set(
                emprendedores
                    .map(e => e.actividad)
                    .filter(Boolean)
            )
        ].sort((a, b) =>
            a.localeCompare(b, "es")
        );

        selector.innerHTML = `
            <option value="">
                Todas las actividades
            </option>
        `;

        actividades.forEach(actividad => {

            const opcion = document.createElement("option");

            opcion.value = actividad;
            opcion.textContent = actividad;

            selector.appendChild(opcion);
        });

        if (actividades.includes(valorActual)) {
            selector.value = valorActual;
        }
    }

    // ==========================================
    // FILTRAR EMPRENDEDORES
    // ==========================================

    function filtrar() {

        const texto = $("buscarEmprendedor")
            .value.trim().toLowerCase();

        const actividad = $("filtroActividad").value;

        const estado = $("filtroEstado").value;

        const apoyo = $("filtroApoyo").value;

        return emprendedores.filter(e => {

            const coincide = [
                e.nombre,
                e.correo,
                e.emprendimiento,
                e.actividad
            ].some(valor =>
                String(valor)
                    .toLowerCase()
                    .includes(texto)
            );

            const requiere =
                estadoAtencion(e) === "Requiere apoyo";

            return (
                coincide &&

                (
                    !actividad ||
                    e.actividad === actividad
                ) &&

                (
                    !estado ||
                    e.estado === estado
                ) &&

                (
                    !apoyo ||
                    (
                        apoyo === "si"
                            ? requiere
                            : !requiere
                    )
                )
            );
        });
    }

    // ==========================================
    // MOSTRAR TABLA
    // ==========================================

    function mostrarTabla() {

        const resultados = filtrar();

        tabla.innerHTML = resultados.map(e => {

            const atencion = estadoAtencion(e);

            return `
                <tr>

                    <td>
                        <span class="nombre">
                            ${escapar(e.nombre)}
                        </span>

                        <span class="correo">
                            ${escapar(e.correo)}
                        </span>
                    </td>

                    <td>
                        ${escapar(
                            e.emprendimiento ||
                            "No registrado"
                        )}
                    </td>

                    <td>
                        ${escapar(
                            e.actividad ||
                            "No registrada"
                        )}
                    </td>

                    <td>
                        <span class="estado ${e.estado}">
                            ${escapar(e.estado)}
                        </span>
                    </td>

                    <td>
                        <span class="etiqueta-atencion ${claseAtencion(atencion)}">
                            ${escapar(atencion)}
                        </span>
                    </td>

                    <td>

                        <button
                            type="button"
                            class="accion ver-detalle"
                            data-accion="detalle"
                            data-id="${e.id}">
                            Ver detalle
                        </button>

                        <button
                            type="button"
                            class="accion seguimiento"
                            data-accion="seguimiento"
                            data-id="${e.id}">
                            + Seguimiento
                        </button>

                    </td>

                </tr>
            `;

        }).join("");

        $("sinResultados").hidden =
            resultados.length > 0;
    }

    // ==========================================
    // REPORTES DE AVANCE DESDE SQLITE
    // ==========================================

    function bloqueReportes(reportes) {

        if (
            !Array.isArray(reportes) ||
            reportes.length === 0
        ) {
            return `
                <p class="vacio">
                    No existen reportes de avance
                    registrados en SQLite.
                </p>
            `;
        }

        return reportes.map(reporte => `

            <article class="registro">

                <div class="registro-cabecera">

                    <div>

                        <strong>
                            ${escapar(reporte.programa)}
                        </strong>

                        <small>
                            Fecha:
                            ${escapar(
                                formatearFecha(reporte.fecha)
                            )}
                        </small>

                    </div>

                    <span class="etiqueta-atencion pendiente">
                        Reportado
                    </span>

                </div>

                <p>
                    <strong>Logros:</strong>
                    ${escapar(
                        reporte.logros ||
                        "No registrados"
                    )}
                </p>

                <p>
                    <strong>Dificultades:</strong>
                    ${escapar(
                        reporte.dificultades ||
                        "No registradas"
                    )}
                </p>

                <p>
                    <strong>Apoyo solicitado:</strong>
                    ${escapar(
                        reporte.apoyo ||
                        "No solicitado"
                    )}
                </p>

            </article>

        `).join("");
    }

    // ==========================================
    // SEGUIMIENTOS DESDE SQLITE
    // ==========================================

    function bloqueSeguimientos(seguimientos) {

        if (
            !Array.isArray(seguimientos) ||
            seguimientos.length === 0
        ) {
            return `
                <p class="vacio">
                    Aún no existen seguimientos
                    institucionales registrados.
                </p>
            `;
        }

        return seguimientos.map(s => `

            <article class="registro">

                <div class="registro-cabecera">

                    <div>

                        <strong>
                            ${escapar(s.tipo)}
                        </strong>

                        <small>
                            ${escapar(
                                formatearFecha(s.fecha)
                            )}

                            —

                            ${escapar(
                                s.funcionario?.name ||
                                "Funcionario"
                            )}
                        </small>

                    </div>

                    <span class="etiqueta-atencion ${claseAtencion(s.estado)}">
                        ${escapar(s.estado)}
                    </span>

                </div>

                <p>
                    ${escapar(s.observaciones)}
                </p>

            </article>

        `).join("");
    }

    // ==========================================
    // DETALLE DEL EMPRENDEDOR
    // ==========================================

    async function abrirDetalle(id) {

        const e = emprendedores.find(
            item => item.id === id
        );

        if (!e) return;

        emprendedorDetalle = id;

        const solicitudActual = ++solicitudDetalle;

        $("tituloDetalle").textContent =
            `Detalle — ${e.nombre}`;

        $("contenidoDetalle").innerHTML = `
            <p class="vacio">
                Consultando información en SQLite...
            </p>
        `;

        if (!modalDetalle.open) {
            modalDetalle.showModal();
        }

        try {

            const datos = await solicitarLaravel(
                `${RUTA_EMPRENDEDORES}/${id}`
            );

            if (
                solicitudActual !== solicitudDetalle ||
                emprendedorDetalle !== id ||
                !modalDetalle.open
            ) {
                return;
            }

            const usuario = datos.emprendedor;

            const reportes = datos.reportes || [];

            const seguimientos =
                datos.seguimientos || [];

            $("contenidoDetalle").innerHTML = `

                <div class="detalle-grid">

                    <div class="detalle-fila">
                        <strong>Nombre</strong>
                        ${escapar(usuario.nombre)}
                    </div>

                    <div class="detalle-fila">
                        <strong>Correo electrónico</strong>
                        ${escapar(usuario.correo)}
                    </div>

                    <div class="detalle-fila">
                        <strong>Emprendimiento</strong>
                        ${escapar(
                            usuario.emprendimiento ||
                            "No registrado"
                        )}
                    </div>

                    <div class="detalle-fila">
                        <strong>Actividad económica</strong>
                        ${escapar(
                            usuario.actividad ||
                            "No registrada"
                        )}
                    </div>

                    <div class="detalle-fila">
                        <strong>Teléfono</strong>
                        ${escapar(
                            usuario.telefono ||
                            "No registrado"
                        )}
                    </div>

                    <div class="detalle-fila">
                        <strong>Dirección</strong>
                        ${escapar(
                            usuario.direccion ||
                            "No registrada"
                        )}
                    </div>

                    <div class="detalle-fila">
                        <strong>Estado</strong>
                        ${escapar(usuario.estado)}
                    </div>

                    <div class="detalle-fila">
                        <strong>Estado de atención</strong>
                        ${escapar(
                            seguimientos.length
                                ? seguimientos[0].estado
                                : "Sin registro"
                        )}
                    </div>

                </div>

                <section class="detalle-seccion">

                    <h3>
                        Reportes de avance del emprendedor
                    </h3>

                    ${bloqueReportes(reportes)}

                </section>

                <section class="detalle-seccion">

                    <h3>
                        Historial de seguimiento institucional
                    </h3>

                    ${bloqueSeguimientos(seguimientos)}

                </section>
            `;

        } catch (error) {

            console.error(error);

            if (
                solicitudActual !== solicitudDetalle ||
                !modalDetalle.open
            ) {
                return;
            }

            $("contenidoDetalle").textContent =
                "No fue posible cargar el detalle: " +
                error.message;

            mostrarMensaje(error.message);
        }
    }

    // ==========================================
    // ABRIR REGISTRO DE SEGUIMIENTO
    // ==========================================

    function abrirSeguimiento(id) {

        const e = emprendedores.find(
            item => item.id === id
        );

        if (!e) return;

        $("formSeguimiento").reset();

        $("seguimientoId").value = String(id);

        $("nombreSeguimiento").textContent =
            `${e.nombre} — ${e.emprendimiento}`;

        $("fechaSeguimiento").value =
            fechaLocal();

        $("fechaSeguimiento").max =
            fechaLocal();

        if (modalDetalle.open) {
            modalDetalle.close();
        }

        modalSeguimiento.showModal();
    }

    // ==========================================
    // ACCIONES DE LA TABLA
    // ==========================================

    tabla.addEventListener("click", evento => {

        const boton = evento.target.closest(
            "[data-accion]"
        );

        if (!boton) return;

        const id = Number(boton.dataset.id);

        if (boton.dataset.accion === "detalle") {
            abrirDetalle(id);
        }

        if (boton.dataset.accion === "seguimiento") {
            abrirSeguimiento(id);
        }
    });

    $("btnSeguimientoDesdeDetalle").addEventListener(
        "click",
        () => {

            if (emprendedorDetalle !== null) {
                abrirSeguimiento(emprendedorDetalle);
            }
        }
    );

    // ==========================================
    // GUARDAR SEGUIMIENTO EN SQLITE
    // ==========================================

    $("formSeguimiento").addEventListener(
        "submit",
        async evento => {

            evento.preventDefault();

            if (guardando) return;

            const id = Number(
                $("seguimientoId").value
            );

            const fecha =
                $("fechaSeguimiento").value;

            const tipo =
                $("tipoSeguimiento").value;

            const estado =
                $("estadoSeguimiento").value;

            const observaciones =
                $("observaciones").value.trim();

            const tiposValidos = [
                "Llamada",
                "Visita",
                "Asesoría",
                "Reunión",
                "Otro"
            ];

            const estadosValidos = [
                "Pendiente",
                "Requiere apoyo",
                "Atendido"
            ];

            if (
                !emprendedores.some(e => e.id === id) ||
                !fecha ||
                fecha > fechaLocal() ||
                !tiposValidos.includes(tipo) ||
                !estadosValidos.includes(estado) ||
                !observaciones ||
                observaciones.length > 1500
            ) {

                mostrarMensaje(
                    "Revisa los datos del seguimiento."
                );

                return;
            }

            guardando = true;

            const botonGuardar = $("formSeguimiento")
                .querySelector('[type="submit"]');

            botonGuardar.disabled = true;

            try {

                const respuesta = await solicitarLaravel(
                    `${RUTA_EMPRENDEDORES}/${id}/seguimientos`,
                    {
                        method: "POST",

                        body: JSON.stringify({
                            fecha,
                            tipo,
                            estado,
                            observaciones
                        })
                    }
                );

                modalSeguimiento.close();

                const actualizado =
                    await cargarEmprendedores();

                mostrarMensaje(
                    respuesta.message ||
                    "Seguimiento registrado correctamente."
                );

                if (actualizado) {
                    await abrirDetalle(id);
                }

            } catch (error) {

                console.error(error);

                mostrarMensaje(error.message);

            } finally {

                guardando = false;

                botonGuardar.disabled = false;
            }
        }
    );

    // ==========================================
    // CERRAR VENTANAS
    // ==========================================

    document.querySelectorAll("[data-cerrar]")
        .forEach(boton => {

            boton.addEventListener("click", () => {

                const dialogo = boton.closest("dialog");

                if (dialogo?.open) {
                    dialogo.close();
                }
            });
        });

    // ==========================================
    // FILTROS
    // ==========================================

    [
        "buscarEmprendedor",
        "filtroActividad",
        "filtroEstado",
        "filtroApoyo"
    ].forEach(id => {

        $(id).addEventListener(
            id === "buscarEmprendedor"
                ? "input"
                : "change",
            mostrarTabla
        );
    });

    // ==========================================
    // EXPORTAR CSV DESDE DATOS SQLITE
    // ==========================================

    function exportarCSV() {

        if (!datosCargados) {
            mostrarMensaje(
                "Primero debes cargar los datos desde SQLite."
            );
            return;
        }

        const resultados = filtrar();

        const filas = [
            [
                "Nombre",
                "Correo",
                "Emprendimiento",
                "Actividad",
                "Teléfono",
                "Estado",
                "Atención"
            ],

            ...resultados.map(e => [
                e.nombre,
                e.correo,
                e.emprendimiento,
                e.actividad,
                e.telefono,
                e.estado,
                estadoAtencion(e)
            ])
        ];

        function proteger(valor) {

            let texto = String(valor ?? "");

            // Protección contra fórmulas CSV.
            if (/^\s*[=+\-@]/.test(texto)) {
                texto = "'" + texto;
            }

            return `"${texto.replace(/"/g, '""')}"`;
        }

        const csv = filas
            .map(fila =>
                fila.map(proteger).join(";")
            )
            .join("\r\n");

        const archivo = new Blob(
            ["\uFEFF" + csv],
            {
                type: "text/csv;charset=utf-8"
            }
        );

        const url = URL.createObjectURL(archivo);

        const enlace = document.createElement("a");

        enlace.href = url;

        enlace.download =
            "emprendedores_impulsa_local.csv";

        document.body.appendChild(enlace);

        enlace.click();

        enlace.remove();

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    }

    $("btnExportar").addEventListener(
        "click",
        exportarCSV
    );

    // ==========================================
    // ENLACES INFORMATIVOS
    // ==========================================

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
    // INICIALIZACIÓN
    // ==========================================

    tabla.innerHTML = `
        <tr>
            <td colspan="6">
                Cargando emprendedores desde SQLite...
            </td>
        </tr>
    `;

    cargarEmprendedores();

});
