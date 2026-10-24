
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
            telefono: "3101234567",
            direccion: "Calle 12 #34-56, Barrio Centro",
            estado: "activo"
        },
        {
            id: 2,
            nombre: "Jorge Pérez",
            correo: "jorge@artesanias.com",
            emprendimiento: "Artesanías Pérez",
            actividad: "Artesanías",
            telefono: "3209876543",
            direccion: "No registrada",
            estado: "activo"
        },
        {
            id: 3,
            nombre: "Lucía Ramírez",
            correo: "lucia@costura.com",
            emprendimiento: "Modas Lucía",
            actividad: "Costura / Confección",
            telefono: "3154567890",
            direccion: "No registrada",
            estado: "activo"
        },
        {
            id: 4,
            nombre: "Tomás Herrera",
            correo: "tomas@taller.com",
            emprendimiento: "Taller Herrera",
            actividad: "Taller de reparaciones",
            telefono: "3001122334",
            direccion: "No registrada",
            estado: "activo"
        },
        {
            id: 5,
            nombre: "Camila Torres",
            correo: "camila@tienda.com",
            emprendimiento: "Tienda La Esquina",
            actividad: "Tienda de barrio",
            telefono: "3187654321",
            direccion: "No registrada",
            estado: "activo"
        },
        {
            id: 6,
            nombre: "Andrés Molina",
            correo: "andres@comidas.com",
            emprendimiento: "Sabores Molina",
            actividad: "Restaurante / Comida",
            telefono: "3119988776",
            direccion: "No registrada",
            estado: "inactivo"
        }
    ];

    // Reportes ficticios para probar la interfaz.
    // No se sincronizan automáticamente con emprendedor.js.

    const reportesDemo = [
        {
            emprendedorId: 1,
            programa: "Plan de Negocios desde Cero",
            fecha: "2024-07-10",
            logros: "He organizado mejor los gastos de mi panadería.",
            dificultades: "Tengo dudas sobre el presupuesto inicial.",
            apoyo: "Necesito orientación para calcular costos."
        },
        {
            emprendedorId: 1,
            programa: "Marketing Digital para Emprendedores",
            fecha: "2024-08-05",
            logros: "He creado una página para promocionar mis productos.",
            dificultades: "No conozco bien las herramientas de publicidad.",
            apoyo: "Necesito asesoría sobre marketing digital."
        }
    ];

    // ==========================================
    // ELEMENTOS Y ALMACENAMIENTO
    // ==========================================

    const CLAVE = "impulsa-funcionario-seguimientos-v2";

    const $ = id => document.getElementById(id);

    const tabla = $("tablaEmprendedores");
    const modalDetalle = $("modalDetalle");
    const modalSeguimiento = $("modalSeguimiento");

    let emprendedorDetalle = null;
    let temporizadorMensaje;

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
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const dia = String(fecha.getDate()).padStart(2, "0");

        return `${anio}-${mes}-${dia}`;
    }

    function mensaje(texto) {
        $("mensajeSistema").textContent = texto;
        $("mensajeSistema").hidden = false;

        clearTimeout(temporizadorMensaje);

        temporizadorMensaje = setTimeout(() => {
            $("mensajeSistema").hidden = true;
        }, 3500);
    }

    function cargar() {
        try {
            const datos = JSON.parse(
                localStorage.getItem(CLAVE) || "[]"
            );

            return Array.isArray(datos) ? datos : [];
        } catch (error) {
            console.warn("No se pudo leer el historial:", error);
            return [];
        }
    }

    let seguimientos = cargar();

    function guardar() {
        try {
            localStorage.setItem(
                CLAVE,
                JSON.stringify(seguimientos)
            );

            return true;
        } catch (error) {
            console.error(error);

            mensaje(
                "No fue posible guardar el seguimiento en este navegador."
            );

            return false;
        }
    }

    // ==========================================
    // ESTADO DE ATENCIÓN
    // ==========================================

    function ultimoSeguimiento(id) {
        return seguimientos
            .filter(s => s.emprendedorId === id)
            .sort((a, b) =>
                b.fecha.localeCompare(a.fecha) ||
                b.creado.localeCompare(a.creado)
            )[0] || null;
    }

    function estadoAtencion(id) {
        const ultimo = ultimoSeguimiento(id);

        return ultimo ? ultimo.estado : "Sin registro";
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
    // FILTROS
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
                valor.toLowerCase().includes(texto)
            );

            const requiere =
                estadoAtencion(e.id) === "Requiere apoyo";

            return (
                coincide &&
                (!actividad || e.actividad === actividad) &&
                (!estado || e.estado === estado) &&
                (
                    !apoyo ||
                    (apoyo === "si" ? requiere : !requiere)
                )
            );
        });
    }

    // ==========================================
    // INDICADORES
    // ==========================================

    function indicadores() {
        $("totalEmprendedores").textContent =
            emprendedores.length;

        $("totalActivos").textContent =
            emprendedores.filter(
                e => e.estado === "activo"
            ).length;

        $("totalSeguimientos").textContent =
            seguimientos.length;

        $("totalApoyo").textContent =
            emprendedores.filter(
                e => estadoAtencion(e.id) === "Requiere apoyo"
            ).length;
    }

    // ==========================================
    // TABLA DE EMPRENDEDORES
    // ==========================================

    function mostrarTabla() {
        const resultados = filtrar();

        tabla.innerHTML = resultados.map(e => {

            const atencion = estadoAtencion(e.id);

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

                    <td>${escapar(e.emprendimiento)}</td>
                    <td>${escapar(e.actividad)}</td>

                    <td>
                        <span class="estado ${e.estado}">
                            ${escapar(e.estado)}
                        </span>
                    </td>

                    <td>
                        <span class="etiqueta-atencion
                            ${claseAtencion(atencion)}">
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

        $("sinResultados").hidden = resultados.length > 0;

        indicadores();
    }

    // ==========================================
    // REPORTES DE AVANCE
    // ==========================================

    function bloqueReportes(id) {
        const lista = reportesDemo.filter(
            reporte => reporte.emprendedorId === id
        );

        if (!lista.length) {
            return `
                <p class="vacio">
                    No hay reportes de avance disponibles
                    en los datos de demostración.
                </p>
            `;
        }

        return lista.map(reporte => `
            <article class="registro">

                <div class="registro-cabecera">
                    <div>
                        <strong>
                            ${escapar(reporte.programa)}
                        </strong>

                        <small>
                            Fecha: ${escapar(reporte.fecha)}
                        </small>
                    </div>

                    <span class="etiqueta-atencion pendiente">
                        Reportado
                    </span>
                </div>

                <p>
                    <strong>Logros:</strong>
                    ${escapar(reporte.logros)}
                </p>

                <p>
                    <strong>Dificultades:</strong>
                    ${escapar(reporte.dificultades)}
                </p>

                <p>
                    <strong>Apoyo solicitado:</strong>
                    ${escapar(reporte.apoyo)}
                </p>

            </article>
        `).join("");
    }

    // ==========================================
    // HISTORIAL DE SEGUIMIENTOS
    // ==========================================

    function bloqueSeguimientos(id) {
        const lista = seguimientos
            .filter(s => s.emprendedorId === id)
            .sort((a, b) =>
                b.fecha.localeCompare(a.fecha) ||
                b.creado.localeCompare(a.creado)
            );

        if (!lista.length) {
            return `
                <p class="vacio">
                    Aún no hay seguimientos institucionales registrados.
                </p>
            `;
        }

        return lista.map(s => `
            <article class="registro">

                <div class="registro-cabecera">
                    <div>
                        <strong>${escapar(s.tipo)}</strong>

                        <small>
                            ${escapar(s.fecha)} — Laura Funcionaria
                        </small>
                    </div>

                    <span class="etiqueta-atencion
                        ${claseAtencion(s.estado)}">
                        ${escapar(s.estado)}
                    </span>
                </div>

                <p>${escapar(s.observaciones)}</p>

            </article>
        `).join("");
    }

    // ==========================================
    // DETALLE DEL EMPRENDEDOR
    // ==========================================

    function abrirDetalle(id) {
        const e = emprendedores.find(
            item => item.id === id
        );

        if (!e) return;

        emprendedorDetalle = id;

        $("tituloDetalle").textContent =
            `Detalle — ${e.nombre}`;

        $("contenidoDetalle").innerHTML = `
            <div class="detalle-grid">

                <div class="detalle-fila">
                    <strong>Nombre</strong>
                    ${escapar(e.nombre)}
                </div>

                <div class="detalle-fila">
                    <strong>Correo electrónico</strong>
                    ${escapar(e.correo)}
                </div>

                <div class="detalle-fila">
                    <strong>Emprendimiento</strong>
                    ${escapar(e.emprendimiento)}
                </div>

                <div class="detalle-fila">
                    <strong>Actividad económica</strong>
                    ${escapar(e.actividad)}
                </div>

                <div class="detalle-fila">
                    <strong>Teléfono</strong>
                    ${escapar(e.telefono)}
                </div>

                <div class="detalle-fila">
                    <strong>Dirección</strong>
                    ${escapar(e.direccion)}
                </div>

                <div class="detalle-fila">
                    <strong>Estado</strong>
                    ${escapar(e.estado)}
                </div>

                <div class="detalle-fila">
                    <strong>Estado de atención</strong>
                    ${escapar(estadoAtencion(id))}
                </div>

            </div>

            <section class="detalle-seccion">
                <h3>Reportes de avance del emprendedor</h3>

                ${bloqueReportes(id)}

                <p class="nota-demo">
                    Reportes de ejemplo. La sincronización
                    con el portal del emprendedor se realizará
                    al conectar la base de datos.
                </p>
            </section>

            <section class="detalle-seccion">
                <h3>Historial de seguimiento institucional</h3>

                ${bloqueSeguimientos(id)}
            </section>
        `;

        modalDetalle.showModal();
    }

    // ==========================================
    // FORMULARIO DE SEGUIMIENTO
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

        $("fechaSeguimiento").value = fechaLocal();
        $("fechaSeguimiento").max = fechaLocal();

        if (modalDetalle.open) {
            modalDetalle.close();
        }

        modalSeguimiento.showModal();
    }

    // ==========================================
    // ACCIONES DE LA TABLA
    // ==========================================

    tabla.addEventListener("click", evento => {
        const boton = evento.target.closest("[data-accion]");

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
    // GUARDAR SEGUIMIENTO
    // ==========================================

    $("formSeguimiento").addEventListener("submit", evento => {
        evento.preventDefault();

        const id = Number($("seguimientoId").value);
        const fecha = $("fechaSeguimiento").value;
        const tipo = $("tipoSeguimiento").value;
        const estado = $("estadoSeguimiento").value;

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
            !observaciones
        ) {
            mensaje("Revisa los datos del seguimiento.");
            return;
        }

        const registro = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            emprendedorId: id,
            fecha: fecha,
            tipo: tipo,
            estado: estado,
            observaciones: observaciones,
            creado: new Date().toISOString()
        };

        seguimientos.push(registro);

        if (!guardar()) {
            seguimientos.pop();
            return;
        }

        modalSeguimiento.close();

        mostrarTabla();

        mensaje("Seguimiento registrado correctamente.");

        abrirDetalle(id);
    });

    // ==========================================
    // CERRAR VENTANAS
    // ==========================================

    document.querySelectorAll("[data-cerrar]").forEach(boton => {
        boton.addEventListener("click", () => {
            const dialogo = boton.closest("dialog");

            if (dialogo && dialogo.open) {
                dialogo.close();
            }
        });
    });

    // ==========================================
    // EVENTOS DE LOS FILTROS
    // ==========================================

    [
        "buscarEmprendedor",
        "filtroActividad",
        "filtroEstado",
        "filtroApoyo"
    ].forEach(id => {

        $(id).addEventListener(
            id === "buscarEmprendedor" ? "input" : "change",
            mostrarTabla
        );
    });

    // ==========================================
    // EXPORTACIÓN CSV
    // ==========================================

    function exportarCSV() {
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
            ...filtrar().map(e => [
                e.nombre,
                e.correo,
                e.emprendimiento,
                e.actividad,
                e.telefono,
                e.estado,
                estadoAtencion(e.id)
            ])
        ];

        function proteger(valor) {
            let texto = String(valor ?? "");

            // Evita interpretar datos como fórmulas de Excel.
            if (/^[\s]*[=+\-@]/.test(texto)) {
                texto = "'" + texto;
            }

            return `"${texto.replace(/"/g, '""')}"`;
        }

        const csv = filas.map(fila =>
            fila.map(proteger).join(";")
        ).join("\r\n");

        const archivo = new Blob(
            ["\uFEFF" + csv],
            { type: "text/csv;charset=utf-8" }
        );

        const url = URL.createObjectURL(archivo);

        const enlace = document.createElement("a");

        enlace.href = url;
        enlace.download = "emprendedores_impulsa_local.csv";

        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    }

    $("btnExportar").addEventListener("click", exportarCSV);

    // ==========================================
    // ENLACES INFORMATIVOS
    // ==========================================

    document.querySelectorAll("[data-informativo]")
        .forEach(enlace => {

            enlace.addEventListener("click", evento => {
                evento.preventDefault();

                mensaje(
                    `La sección ${enlace.dataset.informativo} ` +
                    "está pendiente de implementar."
                );
            });
        });

    // ==========================================
    // CARGA INICIAL
    // ==========================================

    mostrarTabla();

});
