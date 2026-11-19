document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const $ = (id) => document.getElementById(id);

    const csrf = document.querySelector(
        'meta[name="csrf-token"]'
    )?.content || "";

    const usuarios = Array.isArray(window.IMPULSA_ADMIN?.usuarios)
        ? window.IMPULSA_ADMIN.usuarios
        : [];

    const emprendedores = usuarios.filter(
        (usuario) => usuario.rol === "emprendedor"
    );

    let programas = [];
    let instructores = [];
    let programasCargados = false;
    let guardandoPrograma = false;

    function escapar(valor) {
        return String(valor ?? "").replace(
            /[&<>"']/g,
            (c) => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[c])
        );
    }

    function numero(valor) {
        const n = Number(valor);
        return Number.isFinite(n) ? n : 0;
    }

    function fecha(valor) {
        return valor ? String(valor).substring(0, 10) : "";
    }

    function escribir(id, valor) {
        if ($(id)) $(id).textContent = valor;
    }

    function errorSistema(error) {
        console.error(error);
        alert(error.message || "Ocurrió un error.");
    }

    async function solicitarLaravel(url, opciones = {}) {
        const respuesta = await fetch(url, {
            method: opciones.method || "GET",
            credentials: "same-origin",
            headers: {
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": csrf,
                ...(opciones.body !== undefined
                    ? { "Content-Type": "application/json" }
                    : {})
            },
            ...(opciones.body !== undefined
                ? { body: JSON.stringify(opciones.body) }
                : {})
        });

        const tipo = respuesta.headers.get("content-type") || "";

        const datos = tipo.includes("application/json")
            ? await respuesta.json()
            : null;

        if (!respuesta.ok) {
            const validaciones = datos?.errors
                ? Object.values(datos.errors).flat()
                : [];

            throw new Error(
                validaciones[0] ||
                datos?.message ||
                `Error HTTP ${respuesta.status}`
            );
        }

        if (!tipo.includes("application/json")) {
            throw new Error(
                "Laravel no devolvió una respuesta JSON."
            );
        }

        return datos;
    }

    function etiquetaEstado(estado) {
        const clase = ["activo", "inactivo", "finalizado"]
            .includes(estado)
            ? estado
            : "inactivo";

        return `<span class="estado ${clase}">${escapar(estado)}</span>`;
    }

    // =====================================
    // NAVEGACIÓN
    // =====================================

    document.querySelectorAll(".pestana").forEach((boton) => {
        boton.addEventListener("click", () => {
            document.querySelectorAll(".pestana").forEach(
                (b) => b.classList.remove("activa")
            );

            document.querySelectorAll("main .panel").forEach(
                (p) => p.classList.remove("activo")
            );

            boton.classList.add("activa");
            $(boton.dataset.tab)?.classList.add("activo");

            if (boton.dataset.tab === "reportes") {
                mostrarReportes();
            }
        });
    });

    // =====================================
    // EMPRENDEDORES SQLITE
    // =====================================

    function actualizarFiltroActividades() {
        const select = $("filtroActividad");
        if (!select) return;

        const seleccionado = select.value;

        const actividades = [...new Set(
            emprendedores.map((e) => e.actividad)
                .filter(Boolean)
        )].sort();

        select.innerHTML =
            '<option value="">Todas las actividades</option>' +
            actividades.map((a) =>
                `<option value="${escapar(a)}">${escapar(a)}</option>`
            ).join("");

        select.value = seleccionado;
    }

    function mostrarEmprendedores() {
        const busqueda = ($("buscarEmprendedor")?.value || "")
            .toLowerCase().trim();

        const actividad = $("filtroActividad")?.value || "";
        const estado = $("filtroEstadoEmprendedor")?.value || "";

        const filtrados = emprendedores.filter((e) => {
            const contenido = [
                e.nombre,
                e.correo,
                e.emprendimiento,
                e.actividad,
                e.ubicacion
            ].join(" ").toLowerCase();

            return contenido.includes(busqueda)
                && (!actividad || e.actividad === actividad)
                && (!estado || e.estado === estado);
        });

        escribir(
            "conteoEmprendedores",
            `${filtrados.length} emprendedor(es) encontrado(s)`
        );

        const tabla = $("tablaEmprendedores");
        if (!tabla) return;

        if (!filtrados.length) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="6">
                        No se encontraron emprendedores.
                    </td>
                </tr>
            `;
            return;
        }

        tabla.innerHTML = filtrados.map((e) => `
            <tr>
                <td>
                    <strong>${escapar(e.nombre)}</strong>
                    <small style="display:block">
                        ${escapar(e.correo)}
                    </small>
                </td>
                <td>${escapar(e.emprendimiento || "Sin registrar")}</td>
                <td>${escapar(e.actividad || "Sin registrar")}</td>
                <td>${escapar(e.telefono || "Sin registrar")}</td>
                <td>${etiquetaEstado(e.estado)}</td>
                <td>
                    <button type="button"
                            class="accion"
                            data-accion="ver"
                            data-id="${numero(e.id)}">
                        Ver
                    </button>

                    <button type="button"
                            class="accion ${e.estado === "activo" ? "peligro" : "exito"}"
                            data-accion="estado"
                            data-id="${numero(e.id)}">
                        ${e.estado === "activo" ? "Desactivar" : "Activar"}
                    </button>
                </td>
            </tr>
        `).join("");
    }

    ["buscarEmprendedor", "filtroActividad",
        "filtroEstadoEmprendedor"].forEach((id) => {
        $(id)?.addEventListener(
            id === "buscarEmprendedor" ? "input" : "change",
            mostrarEmprendedores
        );
    });

    $("tablaEmprendedores")?.addEventListener(
        "click",
        async (evento) => {
            const boton = evento.target.closest(
                "button[data-accion]"
            );

            if (!boton) return;

            const e = emprendedores.find(
                (item) => numero(item.id) ===
                    numero(boton.dataset.id)
            );

            if (!e) return;

            if (boton.dataset.accion === "ver") {
                $("detalleEmprendedor").innerHTML = `
                    <p><strong>Nombre:</strong> ${escapar(e.nombre)}</p>
                    <p><strong>Correo:</strong> ${escapar(e.correo)}</p>
                    <p><strong>Negocio:</strong> ${escapar(e.emprendimiento || "Sin registrar")}</p>
                    <p><strong>Actividad:</strong> ${escapar(e.actividad || "Sin registrar")}</p>
                    <p><strong>Teléfono:</strong> ${escapar(e.telefono || "Sin registrar")}</p>
                    <p><strong>Dirección:</strong> ${escapar(e.ubicacion || "Sin registrar")}</p>
                    <p><strong>Estado:</strong> ${escapar(e.estado)}</p>
                `;

                $("modalEmprendedor").hidden = false;
            }

            if (boton.dataset.accion === "estado") {
                const accion = e.estado === "activo"
                    ? "desactivar"
                    : "activar";

                if (!confirm(
                    `¿Deseas ${accion} la cuenta de ${e.nombre}?`
                )) return;

                boton.disabled = true;

                try {
                    await solicitarLaravel(
                        `/administrador/usuarios/${e.id}/estado`,
                        {
                            method: "PATCH",
                            body: {}
                        }
                    );

                    window.location.reload();
                } catch (error) {
                    errorSistema(error);
                    boton.disabled = false;
                }
            }
        }
    );

    $("cerrarEmprendedor")?.addEventListener("click", () => {
        $("modalEmprendedor").hidden = true;
    });

    // =====================================
    // PROGRAMAS SQLITE
    // =====================================

    async function cargarProgramas() {
        programasCargados = false;

        if ($("listaProgramas")) {
            $("listaProgramas").innerHTML =
                "<p>Cargando programas desde SQLite...</p>";
        }

        try {
            const respuesta = await solicitarLaravel("/programas");

            if (!Array.isArray(respuesta)) {
                throw new Error("Formato de programas incorrecto.");
            }

            programas = respuesta;
            programasCargados = true;

            actualizarFiltroTematicas();
            mostrarProgramas();
            mostrarReportes();
        } catch (error) {
            if ($("listaProgramas")) {
                $("listaProgramas").textContent =
                    "No fue posible cargar los programas.";
            }

            errorSistema(error);
        }
    }

    async function cargarInstructores() {
        const respuesta = await solicitarLaravel(
            "/programas/instructores"
        );

        instructores = Array.isArray(respuesta)
            ? respuesta
            : [];

        const select = $("instructorPrograma");
        if (!select) return;

        select.innerHTML =
            '<option value="">Sin asignar</option>' +
            instructores.map((i) => `
                <option value="${numero(i.id)}">
                    ${escapar(i.name)}
                </option>
            `).join("");
    }

    function actualizarFiltroTematicas() {
        const select = $("filtroTematica");
        if (!select) return;

        const actual = select.value;

        const tematicas = [...new Set(
            programas.map((p) => p.tematica)
                .filter(Boolean)
        )].sort();

        select.innerHTML =
            '<option value="">Todas las temáticas</option>' +
            tematicas.map((t) => `
                <option value="${escapar(t)}">${escapar(t)}</option>
            `).join("");

        select.value = actual;
    }

    function mostrarProgramas() {
        const contenedor = $("listaProgramas");
        if (!contenedor || !programasCargados) return;

        const tematica = $("filtroTematica")?.value || "";
        const estado = $("filtroEstadoPrograma")?.value || "";

        const filtrados = programas.filter((p) =>
            (!tematica || p.tematica === tematica) &&
            (!estado || p.estado === estado)
        );

        if (!filtrados.length) {
            contenedor.innerHTML =
                "<p>No se encontraron programas.</p>";
            return;
        }

        contenedor.innerHTML = filtrados.map((p) => {
            const inscritos = numero(p.inscripciones_count);
            const cupos = numero(p.cupos);
            const ocupacion = cupos
                ? Math.min(100, Math.round(inscritos / cupos * 100))
                : 0;

            return `
                <article class="tarjeta-programa">
                    <div class="programa-cabecera">
                        <h3>${escapar(p.nombre)}</h3>
                        ${etiquetaEstado(p.estado)}
                    </div>

                    <span class="tematica">
                        ${escapar(p.tematica)}
                    </span>

                    <p>${escapar(p.descripcion || "")}</p>

                    <div class="dato-programa">
                        <span>Instructor</span>
                        <strong>${escapar(p.instructor?.name || "Sin asignar")}</strong>
                    </div>

                    <div class="dato-programa">
                        <span>Duración</span>
                        <strong>${numero(p.duracion_semanas)} semanas</strong>
                    </div>

                    <div class="dato-programa">
                        <span>Fecha de inicio</span>
                        <strong>${escapar(fecha(p.fecha_inicio) || "Por definir")}</strong>
                    </div>

                    <div class="dato-programa">
                        <span>Inscritos</span>
                        <strong>${inscritos}/${cupos}</strong>
                    </div>

                    <div class="barra-progreso">
                        <div style="width:${ocupacion}%"></div>
                    </div>

                    <p>Ocupación: ${ocupacion}%</p>

                    <button type="button"
                            class="boton-primario"
                            data-editar-programa="${numero(p.id)}">
                        Editar programa
                    </button>
                </article>
            `;
        }).join("");
    }

    $("filtroTematica")?.addEventListener(
        "change",
        mostrarProgramas
    );

    $("filtroEstadoPrograma")?.addEventListener(
        "change",
        mostrarProgramas
    );

    async function abrirPrograma(id = null) {
        try {
            await cargarInstructores();

            $("formularioPrograma").reset();
            $("programaId").value = "";

            const programa = id === null
                ? null
                : programas.find(
                    (p) => numero(p.id) === numero(id)
                );

            if (programa) {
                escribir("tituloModal", "Editar programa");

                $("programaId").value = programa.id;
                $("nombrePrograma").value = programa.nombre || "";
                $("tematicaPrograma").value = programa.tematica || "";
                $("descripcionPrograma").value = programa.descripcion || "";
                $("instructorPrograma").value =
                    programa.instructor_id || "";
                $("duracionPrograma").value =
                    programa.duracion_semanas || 1;
                $("cuposPrograma").value = programa.cupos || 1;
                $("fechaPrograma").value =
                    fecha(programa.fecha_inicio);
                $("estadoPrograma").value =
                    programa.estado || "activo";
            } else {
                escribir("tituloModal", "Nuevo programa");
                $("estadoPrograma").value = "activo";
            }

            $("modalPrograma").hidden = false;
        } catch (error) {
            errorSistema(error);
        }
    }

    $("nuevoPrograma")?.addEventListener("click", () => {
        abrirPrograma();
    });

    $("listaProgramas")?.addEventListener("click", (evento) => {
        const boton = evento.target.closest(
            "[data-editar-programa]"
        );

        if (boton) {
            abrirPrograma(boton.dataset.editarPrograma);
        }
    });

    $("cancelarPrograma")?.addEventListener("click", () => {
        $("modalPrograma").hidden = true;
    });

    $("formularioPrograma")?.addEventListener(
        "submit",
        async (evento) => {
            evento.preventDefault();

            if (guardandoPrograma) return;
            guardandoPrograma = true;

            const boton = $("guardarPrograma");
            boton.disabled = true;

            const id = $("programaId").value;

            const datos = {
                nombre: $("nombrePrograma").value.trim(),
                tematica: $("tematicaPrograma").value.trim(),
                descripcion:
                    $("descripcionPrograma").value.trim() || null,
                instructor_id: $("instructorPrograma").value
                    ? numero($("instructorPrograma").value)
                    : null,
                duracion_semanas:
                    numero($("duracionPrograma").value),
                cupos: numero($("cuposPrograma").value),
                fecha_inicio: $("fechaPrograma").value || null,
                estado: $("estadoPrograma").value
            };

            try {
                const respuesta = await solicitarLaravel(
                    id ? `/programas/${id}` : "/programas",
                    {
                        method: id ? "PUT" : "POST",
                        body: datos
                    }
                );

                $("modalPrograma").hidden = true;

                alert(
                    respuesta.message ||
                    "Programa guardado correctamente."
                );

                await cargarProgramas();
            } catch (error) {
                errorSistema(error);
            } finally {
                guardandoPrograma = false;
                boton.disabled = false;
            }
        }
    );

    // =====================================
    // REPORTES CON DATOS REALES
    // =====================================

    function agruparPorActividad() {
        const conteos = new Map();

        emprendedores.forEach((e) => {
            const actividad = e.actividad || "Sin especificar";

            conteos.set(
                actividad,
                (conteos.get(actividad) || 0) + 1
            );
        });

        return [...conteos.entries()]
            .map(([nombre, cantidad]) => ({
                nombre,
                cantidad
            }))
            .sort((a, b) => b.cantidad - a.cantidad);
    }

    function mostrarBarras(id, elementos) {
        const contenedor = $(id);
        if (!contenedor) return;

        if (!elementos.length) {
            contenedor.innerHTML =
                "<p>No hay datos disponibles.</p>";
            return;
        }

        const maximo = Math.max(
            1,
            ...elementos.map((e) => e.cantidad)
        );

        contenedor.innerHTML = elementos.map((e) => {
            const ancho = Math.round(
                e.cantidad / maximo * 100
            );

            return `
                <div style="margin:14px 0">
                    <div style="display:flex;justify-content:space-between;gap:12px">
                        <span>${escapar(e.nombre)}</span>
                        <strong>${e.cantidad}</strong>
                    </div>
                    <div class="barra-progreso" style="margin-top:8px">
                        <div style="width:${ancho}%"></div>
                    </div>
                </div>
            `;
        }).join("");
    }

    function mostrarReportes() {
        const activos = emprendedores.filter(
            (e) => e.estado === "activo"
        ).length;

        escribir("totalActivos", activos);
        escribir("totalRegistrados", emprendedores.length);

        if (programasCargados) {
            escribir(
                "totalProgramasActivos",
                programas.filter(
                    (p) => p.estado === "activo"
                ).length
            );

            escribir(
                "totalInscripciones",
                programas.reduce(
                    (total, p) =>
                        total + numero(p.inscripciones_count),
                    0
                )
            );
        }

        mostrarBarras(
            "reporteSectores",
            agruparPorActividad()
        );

        if (programasCargados) {
            mostrarBarras(
                "reporteProgramas",
                programas.map((p) => ({
                    nombre: p.nombre,
                    cantidad: numero(p.inscripciones_count)
                })).sort((a, b) => b.cantidad - a.cantidad)
            );
        }

        escribir(
            "resumenEmprendedores",
            `${activos} activos de ${emprendedores.length} registrados`
        );
    }

    // =====================================
    // EXPORTACIONES CSV
    // =====================================

    function valorCSV(valor) {
        let contenido = String(valor ?? "");

        if (/^\s*[=+\-@\t\r]/.test(contenido)) {
            contenido = "'" + contenido;
        }

        return `"${contenido.replace(/"/g, '""')}"`;
    }

    function exportarCSV(nombre, encabezados, filas) {
        const contenido = [
            encabezados,
            ...filas
        ].map(
            (fila) => fila.map(valorCSV).join(";")
        ).join("\r\n");

        const archivo = new Blob(
            ["\uFEFF" + contenido],
            { type: "text/csv;charset=utf-8" }
        );

        const url = URL.createObjectURL(archivo);
        const enlace = document.createElement("a");

        enlace.href = url;
        enlace.download = nombre;
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    $("exportarSectores")?.addEventListener("click", () => {
        exportarCSV(
            "sectores_emprendedores.csv",
            ["Actividad", "Cantidad"],
            agruparPorActividad().map(
                (e) => [e.nombre, e.cantidad]
            )
        );
    });

    $("exportarProgramas")?.addEventListener("click", () => {
        if (!programasCargados) {
            alert("Espera a que carguen los programas.");
            return;
        }

        exportarCSV(
            "programas_formacion.csv",
            [
                "Programa",
                "Temática",
                "Instructor",
                "Cupos",
                "Inscritos",
                "Estado"
            ],
            programas.map((p) => [
                p.nombre,
                p.tematica,
                p.instructor?.name || "",
                p.cupos,
                p.inscripciones_count,
                p.estado
            ])
        );
    });

    $("exportarTodo")?.addEventListener("click", () => {
        exportarCSV(
            "emprendedores_registrados.csv",
            [
                "ID",
                "Nombre",
                "Correo",
                "Emprendimiento",
                "Actividad",
                "Teléfono",
                "Dirección",
                "Estado"
            ],
            emprendedores.map((e) => [
                e.id,
                e.nombre,
                e.correo,
                e.emprendimiento,
                e.actividad,
                e.telefono,
                e.ubicacion,
                e.estado
            ])
        );
    });

    // =====================================
    // MODAL DE USUARIOS
    // =====================================

    $("nuevoUsuario")?.addEventListener("click", () => {
        $("modalUsuario").hidden = false;
    });

    $("cancelarUsuario")?.addEventListener("click", () => {
        $("modalUsuario").hidden = true;
    });

    $("formularioUsuario")?.addEventListener(
        "submit",
        (evento) => {
            if (
                $("claveUsuario").value !==
                $("confirmarClaveUsuario").value
            ) {
                evento.preventDefault();
                alert("Las contraseñas no coinciden.");
            }
        }
    );

    // =====================================
    // INICIALIZACIÓN
    // =====================================

    actualizarFiltroActividades();
    mostrarEmprendedores();
    mostrarReportes();
    cargarProgramas();
});
