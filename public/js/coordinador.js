document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // ==========================================
    // CONFIGURACIÓN
    // ==========================================

    const RUTA_RESUMEN = "/coordinador/resumen";
    const RUTA_PROGRAMAS = "/programas";
    const RUTA_INSTRUCTORES = "/programas/instructores";

    const $ = (id) => document.getElementById(id);

    const csrf = document.querySelector(
        'meta[name="csrf-token"]'
    )?.content || "";

    let emprendedores = [];
    let programas = [];
    let avances = [];
    let apoyos = [];
    let instructores = [];

    let resumenDisponible = false;
    let programasDisponibles = false;
    let programaEnEdicion = null;

    // ==========================================
    // FUNCIONES GENERALES
    // ==========================================

    function escapar(valor) {
        return String(valor ?? "").replace(
            /[&<>"']/g,
            (caracter) => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[caracter])
        );
    }

    function numero(valor) {
        const resultado = Number(valor);
        return Number.isFinite(resultado) ? resultado : 0;
    }

    function porcentaje(valor) {
        return Math.max(0, Math.min(100, numero(valor)));
    }

    function texto(valor, alternativa = "No registrado") {
        const resultado = String(valor ?? "").trim();
        return resultado || alternativa;
    }

    function fecha(valor) {
        if (!valor) return "";
        return String(valor).substring(0, 10);
    }

    function escribir(id, valor) {
        if ($(id)) $(id).textContent = valor;
    }

    function mostrarMensaje(mensaje, error = false) {
        const elemento = $("mensajeSistema");

        if (!elemento) {
            if (error) console.error(mensaje);
            return;
        }

        elemento.textContent = mensaje;
        elemento.hidden = false;
        elemento.style.background = error
            ? "#fee2e2"
            : "#dcfce7";
        elemento.style.color = error
            ? "#991b1b"
            : "#166534";

        clearTimeout(mostrarMensaje.temporizador);

        mostrarMensaje.temporizador = setTimeout(() => {
            elemento.hidden = true;
        }, 4500);
    }

    async function solicitar(url, opciones = {}) {
        const respuesta = await fetch(url, {
            credentials: "same-origin",
            ...opciones,
            headers: {
                Accept: "application/json",
                "X-CSRF-TOKEN": csrf,
                ...(opciones.body
                    ? { "Content-Type": "application/json" }
                    : {}),
                ...(opciones.headers || {})
            }
        });

        const tipo = respuesta.headers.get("content-type") || "";

        const resultado = tipo.includes("application/json")
            ? await respuesta.json()
            : null;

        if (!respuesta.ok) {
            const errores = resultado?.errors
                ? Object.values(resultado.errors).flat().join(" ")
                : "";

            throw new Error(
                errores ||
                resultado?.message ||
                `Error HTTP ${respuesta.status}`
            );
        }

        return resultado;
    }

    function buscarEmprendedor(id) {
        return emprendedores.find(
            (e) => numero(e.id) === numero(id)
        );
    }

    function buscarPrograma(id) {
        return programas.find(
            (p) => numero(p.id) === numero(id)
        );
    }

    function estadoProgreso(valor) {
        const avance = porcentaje(valor);

        if (avance === 0) return "Sin iniciar";
        if (avance >= 100) return "Completado";
        return "En curso";
    }

    // ==========================================
    // CONSULTAS SQLITE
    // ==========================================

    async function cargarResumen() {
        try {
            const datos = await solicitar(RUTA_RESUMEN);

            if (
                !Array.isArray(datos?.emprendedores) ||
                !Array.isArray(datos?.avances) ||
                !Array.isArray(datos?.apoyos)
            ) {
                throw new Error(
                    "El resumen no tiene el formato esperado."
                );
            }

            emprendedores = datos.emprendedores;
            avances = datos.avances;
            apoyos = datos.apoyos;

            resumenDisponible = true;

            actualizarInterfaz();
        } catch (error) {
            resumenDisponible = false;
            console.error(error);
            mostrarMensaje(
                "No se pudo consultar el resumen en SQLite: " +
                error.message,
                true
            );
        }
    }

    async function cargarProgramas() {
        try {
            const datos = await solicitar(RUTA_PROGRAMAS);

            programas = Array.isArray(datos)
                ? datos
                : Array.isArray(datos?.programas)
                    ? datos.programas
                    : [];

            programasDisponibles = true;
            actualizarInterfaz();
        } catch (error) {
            programasDisponibles = false;
            console.error(error);
            mostrarMensaje(
                "No se pudieron consultar los programas: " +
                error.message,
                true
            );
        }
    }

    async function cargarInstructores() {
        try {
            const datos = await solicitar(RUTA_INSTRUCTORES);

            instructores = Array.isArray(datos)
                ? datos
                : Array.isArray(datos?.instructores)
                    ? datos.instructores
                    : [];
        } catch (error) {
            console.error(error);
            mostrarMensaje(
                "No se pudieron consultar los instructores.",
                true
            );
        }
    }

    // ==========================================
    // NAVEGACIÓN ENTRE PESTAÑAS
    // ==========================================

    document.querySelectorAll("[data-pestana]").forEach(
        (boton) => {
            boton.addEventListener("click", () => {
                const destino = boton.dataset.pestana;

                document.querySelectorAll(".pestana").forEach(
                    (elemento) => {
                        const activo = elemento === boton;
                        elemento.classList.toggle("activa", activo);
                        elemento.setAttribute(
                            "aria-selected",
                            String(activo)
                        );
                    }
                );

                document.querySelectorAll(".seccion").forEach(
                    (seccion) => {
                        const activa = seccion.id === destino;
                        seccion.hidden = !activa;
                        seccion.classList.toggle("activa", activa);
                    }
                );
            });
        }
    );

    // ==========================================
    // INDICADORES
    // ==========================================

    function mostrarIndicadores() {
        if (!resumenDisponible) return;

        const activos = emprendedores.filter(
            (e) => e.estado === "activo"
        ).length;

        const inactivos = emprendedores.filter(
            (e) => e.estado === "inactivo"
        ).length;

        const promedio = avances.length
            ? avances.reduce(
                (suma, a) => suma + porcentaje(a.progreso),
                0
            ) / avances.length
            : 0;

        escribir("totalRegistrados", emprendedores.length);
        escribir("totalActivos", activos);
        escribir("totalInactivos", inactivos);
        escribir("totalApoyos", apoyos.length);
        escribir("totalInscripciones", avances.length);
        escribir("promedioProgreso", `${Math.round(promedio)}%`);

        if (programasDisponibles) {
            escribir("totalProgramas", programas.length);

            escribir(
                "programasActivos",
                programas.filter(
                    (p) => p.estado === "activo"
                ).length
            );
        }

        escribir(
            "descripcionEmprendedores",
            `${activos} de ${emprendedores.length} emprendedores se encuentran activos.`
        );
    }

    // ==========================================
    // ESTADÍSTICAS
    // ==========================================

    function dibujarBarras(id, elementos) {
        const contenedor = $(id);
        if (!contenedor) return;

        if (!elementos.length) {
            contenedor.innerHTML =
                '<p class="mensaje-vacio">No hay datos disponibles.</p>';
            return;
        }

        const maximo = Math.max(
            1,
            ...elementos.map((e) => e.cantidad)
        );

        contenedor.innerHTML = elementos.map((elemento) => {
            const ancho = Math.round(
                elemento.cantidad / maximo * 100
            );

            return `
                <div style="margin:16px 0">
                    <div style="display:flex;justify-content:space-between;gap:12px">
                        <span>${escapar(elemento.nombre)}</span>
                        <strong>${elemento.cantidad}</strong>
                    </div>
                    <div style="height:9px;background:#e5e7eb;border-radius:8px;margin-top:7px;overflow:hidden">
                        <div style="width:${ancho}%;height:100%;background:#1d3b5c;border-radius:8px"></div>
                    </div>
                </div>
            `;
        }).join("");
    }

    function mostrarEstadisticas() {
        if (resumenDisponible) {
            const sectores = new Map();

            emprendedores.forEach((e) => {
                const nombre = texto(
                    e.sector || e.actividad,
                    "Sin especificar"
                );

                sectores.set(
                    nombre,
                    (sectores.get(nombre) || 0) + 1
                );
            });

            dibujarBarras(
                "listaSectores",
                [...sectores].map(([nombre, cantidad]) => ({
                    nombre,
                    cantidad
                })).sort((a, b) => b.cantidad - a.cantidad)
            );
        }

        if (programasDisponibles) {
            dibujarBarras(
                "listaProgramas",
                programas.map((p) => ({
                    nombre: p.nombre,
                    cantidad: numero(p.inscripciones_count)
                })).sort((a, b) => b.cantidad - a.cantidad)
            );
        }
    }

    // ==========================================
    // AVANCE DE EMPRENDEDORES
    // ==========================================

    function actualizarFiltroProgramas() {
        const filtro = $("filtroPrograma");
        if (!filtro) return;

        const seleccionado = filtro.value;

        filtro.innerHTML =
            '<option value="">Todos los programas</option>' +
            programas.map((p) => `
                <option value="${numero(p.id)}">
                    ${escapar(p.nombre)}
                </option>
            `).join("");

        filtro.value = seleccionado;
    }

    function obtenerAvancesFiltrados() {
        const busqueda = (
            $("buscarAvance")?.value || ""
        ).toLowerCase().trim();

        const programa = $("filtroPrograma")?.value || "";
        const progreso = $("filtroProgreso")?.value || "";

        return avances.filter((avance) => {
            const emprendedor = buscarEmprendedor(
                avance.emprendedorId ?? avance.emprendedor_id
            );

            const nombre = (
                (emprendedor?.nombre || "") + " " +
                (emprendedor?.emprendimiento || "")
            ).toLowerCase();

            const coincideNombre = nombre.includes(busqueda);

            const coincidePrograma = !programa ||
                numero(avance.programaId ?? avance.programa_id) ===
                numero(programa);

            const valor = porcentaje(avance.progreso);

            const coincideProgreso =
                !progreso ||
                (progreso === "sin-iniciar" && valor === 0) ||
                (progreso === "en-curso" && valor > 0 && valor < 100) ||
                (progreso === "completado" && valor >= 100);

            return coincideNombre &&
                coincidePrograma &&
                coincideProgreso;
        });
    }

    function mostrarAvances() {
        const tabla = $("tablaAvances");
        if (!tabla || !resumenDisponible) return;

        const datos = obtenerAvancesFiltrados();

        escribir(
            "cantidadAvances",
            `${datos.length} registros`
        );

        if ($("sinAvances")) {
            $("sinAvances").hidden = datos.length > 0;
        }

        tabla.innerHTML = datos.map((a) => {
            const emprendedor = buscarEmprendedor(
                a.emprendedorId ?? a.emprendedor_id
            );

            const programa = buscarPrograma(
                a.programaId ?? a.programa_id
            );

            const progreso = porcentaje(a.progreso);

            return `
                <tr>
                    <td>
                        <strong>${escapar(emprendedor?.nombre || "No disponible")}</strong>
                        <div>${escapar(emprendedor?.correo || "")}</div>
                    </td>
                    <td>${escapar(emprendedor?.emprendimiento || "Sin registrar")}</td>
                    <td>${escapar(programa?.nombre || "Programa no disponible")}</td>
                    <td>
                        <strong>${progreso}%</strong>
                        <div style="height:8px;background:#e5e7eb;border-radius:8px;margin-top:8px">
                            <div style="width:${progreso}%;height:100%;background:#1d3b5c;border-radius:8px"></div>
                        </div>
                    </td>
                    <td>${escapar(estadoProgreso(progreso))}</td>
                </tr>
            `;
        }).join("");
    }

    // ==========================================
    // PROGRAMAS DE FORMACIÓN
    // ==========================================

    function programasFiltrados() {
        const busqueda = (
            $("buscarPrograma")?.value || ""
        ).toLowerCase().trim();

        const estado = $("filtroEstadoPrograma")?.value || "";

        return programas.filter((p) => {
            const contenido = (
                p.nombre + " " +
                (p.tematica || "") + " " +
                (p.descripcion || "")
            ).toLowerCase();

            return contenido.includes(busqueda) &&
                (!estado || p.estado === estado);
        });
    }

    function mostrarProgramas() {
        const contenedor = $("cuadriculaProgramas");

        if (!contenedor || !programasDisponibles) return;

        const datos = programasFiltrados();

        if ($("sinProgramas")) {
            $("sinProgramas").hidden = datos.length > 0;
        }

        contenedor.innerHTML = datos.map((p) => {
            const inscritos = numero(p.inscripciones_count);
            const cupos = numero(p.cupos);
            const ocupacion = cupos > 0
                ? Math.min(100, Math.round(inscritos / cupos * 100))
                : 0;

            return `
                <article class="tarjeta-programa" style="background:#fff;border:1px solid #dce4ed;border-radius:16px;padding:20px">
                    <div style="display:flex;justify-content:space-between;gap:12px">
                        <h3>${escapar(p.nombre)}</h3>
                        <span>${escapar(p.estado)}</span>
                    </div>

                    <p>${escapar(p.tematica)}</p>
                    <p>${escapar(p.descripcion || "")}</p>

                    <p>Instructor: <strong>${escapar(p.instructor?.name || "Sin asignar")}</strong></p>
                    <p>Duración: <strong>${numero(p.duracion_semanas)} semanas</strong></p>
                    <p>Inicio: <strong>${escapar(fecha(p.fecha_inicio) || "Por definir")}</strong></p>
                    <p>Inscritos: <strong>${inscritos}/${cupos}</strong></p>

                    <div style="display:flex;justify-content:space-between">
                        <span>Ocupación de cupos</span>
                        <strong>${ocupacion}%</strong>
                    </div>

                    <div style="height:9px;background:#e5e7eb;border-radius:8px;margin:10px 0 18px">
                        <div style="height:100%;width:${ocupacion}%;background:#1d3b5c;border-radius:8px"></div>
                    </div>

                    <button type="button"
                        class="boton-principal"
                        data-editar-programa="${numero(p.id)}">
                        Editar programa
                    </button>
                </article>
            `;
        }).join("");
    }

    // ==========================================
    // FORMULARIO DE PROGRAMAS
    // ==========================================

    function crearFormularioProgramas() {
        if ($("modalGestionPrograma")) return;

        const modal = document.createElement("dialog");
        modal.id = "modalGestionPrograma";
        modal.className = "modal-dialog";

        modal.style.cssText =
            "width:min(620px,94vw);max-height:90vh;" +
            "overflow:auto;border:0;border-radius:16px;" +
            "padding:25px;box-shadow:0 15px 50px #0003";

        modal.innerHTML = `
            <h2 id="tituloGestionPrograma">Nuevo programa</h2>

            <form id="formGestionPrograma">
                <div class="campos-programa">

                    <label for="nombrePrograma">Nombre del programa</label>
                    <input id="nombrePrograma" required maxlength="255">

                    <label for="tematicaPrograma">Temática</label>
                    <input id="tematicaPrograma" required maxlength="100">

                    <label for="descripcionPrograma">Descripción</label>
                    <textarea id="descripcionPrograma" rows="3"></textarea>

                    <label for="instructorPrograma">Instructor</label>
                    <select id="instructorPrograma">
                        <option value="">Sin asignar</option>
                    </select>

                    <label for="duracionPrograma">Duración en semanas</label>
                    <input id="duracionPrograma" type="number" min="1" required>

                    <label for="cuposPrograma">Cupos disponibles</label>
                    <input id="cuposPrograma" type="number" min="1" required>

                    <label for="fechaInicioPrograma">Fecha de inicio</label>
                    <input id="fechaInicioPrograma" type="date">

                    <label for="estadoPrograma">Estado</label>
                    <select id="estadoPrograma" required>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="finalizado">Finalizado</option>
                    </select>
                </div>

                <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:22px">
                    <button type="button"
                        id="cancelarGestionPrograma"
                        class="boton-secundario">
                        Cancelar
                    </button>

                    <button type="submit"
                        id="guardarGestionPrograma"
                        class="boton-principal">
                        Guardar programa
                    </button>
                </div>
            </form>
        `;

        document.body.appendChild(modal);

        const estilos = document.createElement("style");
        estilos.textContent = `
            #modalGestionPrograma::backdrop {
                background: rgba(0,0,0,.5);
            }
            #modalGestionPrograma .campos-programa {
                display: grid;
                gap: 9px;
            }
            #modalGestionPrograma .campos-programa input,
            #modalGestionPrograma .campos-programa select,
            #modalGestionPrograma .campos-programa textarea {
                width: 100%;
                box-sizing: border-box;
                padding: 11px;
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                font: inherit;
            }
            #modalGestionPrograma label {
                font-weight: 600;
                margin-top: 6px;
            }
        `;

        document.head.appendChild(estilos);

        $("cancelarGestionPrograma").addEventListener(
            "click",
            () => modal.close()
        );

        $("formGestionPrograma").addEventListener(
            "submit",
            guardarPrograma
        );
    }

    function actualizarInstructores() {
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

    async function abrirFormulario(id = null) {
        crearFormularioProgramas();

        await cargarInstructores();

        programaEnEdicion = id === null
            ? null
            : buscarPrograma(id);

        $("formGestionPrograma").reset();
        actualizarInstructores();

        if (programaEnEdicion) {
            const p = programaEnEdicion;

            escribir("tituloGestionPrograma", "Editar programa");

            $("nombrePrograma").value = p.nombre || "";
            $("tematicaPrograma").value = p.tematica || "";
            $("descripcionPrograma").value = p.descripcion || "";
            $("instructorPrograma").value = p.instructor_id || "";
            $("duracionPrograma").value = p.duracion_semanas || 1;
            $("cuposPrograma").value = p.cupos || 1;
            $("fechaInicioPrograma").value = fecha(p.fecha_inicio);
            $("estadoPrograma").value = p.estado || "activo";
        } else {
            escribir("tituloGestionPrograma", "Nuevo programa");
            $("estadoPrograma").value = "activo";
        }

        $("modalGestionPrograma").showModal();
    }

    async function guardarPrograma(evento) {
        evento.preventDefault();

        const boton = $("guardarGestionPrograma");
        boton.disabled = true;

        const datos = {
            nombre: $("nombrePrograma").value.trim(),
            tematica: $("tematicaPrograma").value.trim(),
            descripcion: $("descripcionPrograma").value.trim() || null,
            instructor_id: $("instructorPrograma").value
                ? numero($("instructorPrograma").value)
                : null,
            duracion_semanas: numero($("duracionPrograma").value),
            cupos: numero($("cuposPrograma").value),
            fecha_inicio: $("fechaInicioPrograma").value || null,
            estado: $("estadoPrograma").value
        };

        try {
            const editar = programaEnEdicion !== null;

            const url = editar
                ? `${RUTA_PROGRAMAS}/${programaEnEdicion.id}`
                : RUTA_PROGRAMAS;

            const resultado = await solicitar(url, {
                method: editar ? "PUT" : "POST",
                body: JSON.stringify(datos)
            });

            $("modalGestionPrograma").close();

            mostrarMensaje(
                resultado?.message ||
                "Programa guardado correctamente en SQLite."
            );

            await Promise.all([
                cargarProgramas(),
                cargarResumen()
            ]);
        } catch (error) {
            mostrarMensaje(error.message, true);
        } finally {
            boton.disabled = false;
        }
    }

    function agregarBotonNuevo() {
        if ($("btnNuevoPrograma")) return;

        const contenedor = $("cuadriculaProgramas");
        if (!contenedor) return;

        const boton = document.createElement("button");
        boton.id = "btnNuevoPrograma";
        boton.type = "button";
        boton.className = "boton-principal";
        boton.textContent = "+ Nuevo programa";

        boton.style.marginBottom = "16px";

        contenedor.before(boton);

        boton.addEventListener("click", () => {
            abrirFormulario();
        });
    }

    document.addEventListener("click", (evento) => {
        const boton = evento.target.closest(
            "[data-editar-programa]"
        );

        if (boton) {
            abrirFormulario(
                numero(boton.dataset.editarPrograma)
            );
        }
    });

    // ==========================================
    // NECESIDADES DE APOYO
    // ==========================================

    function mostrarApoyos() {
        const contenedor = $("listaApoyos");
        if (!contenedor || !resumenDisponible) return;

        const busqueda = (
            $("buscarApoyo")?.value || ""
        ).toLowerCase().trim();

        const filtrados = apoyos.filter((apoyo) => {
            const emprendedor = buscarEmprendedor(
                apoyo.emprendedorId ?? apoyo.emprendedor_id
            );

            return (
                (emprendedor?.nombre || "") + " " +
                (emprendedor?.emprendimiento || "")
            ).toLowerCase().includes(busqueda);
        });

        escribir("cantidadApoyos", `${filtrados.length} casos`);

        if ($("sinApoyos")) {
            $("sinApoyos").hidden = filtrados.length > 0;
        }

        contenedor.innerHTML = filtrados.map((apoyo) => {
            const emprendedor = buscarEmprendedor(
                apoyo.emprendedorId ?? apoyo.emprendedor_id
            );

            return `
                <article style="border:1px solid #dce4ed;border-radius:12px;padding:18px;margin:12px 0">
                    <h3>${escapar(emprendedor?.nombre || "Emprendedor no disponible")}</h3>
                    <p><strong>Negocio:</strong> ${escapar(emprendedor?.emprendimiento || "Sin registrar")}</p>
                    <p><strong>Fecha:</strong> ${escapar(apoyo.fecha)}</p>
                    <p><strong>Tipo:</strong> ${escapar(apoyo.tipo)}</p>
                    <p><strong>Estado:</strong> ${escapar(apoyo.estado)}</p>
                    <p><strong>Responsable:</strong> ${escapar(apoyo.responsable)}</p>
                    <p><strong>Observaciones:</strong> ${escapar(apoyo.observacion)}</p>
                </article>
            `;
        }).join("");
    }

    // ==========================================
    // EXPORTACIÓN CSV
    // ==========================================

    function valorCSV(valor) {
        let contenido = String(valor ?? "");

        // Evitar que Excel interprete datos como fórmulas.
        if (/^[\s]*[=+\-@\t\r]/.test(contenido)) {
            contenido = "'" + contenido;
        }

        return '"' + contenido.replace(/"/g, '""') + '"';
    }

    function descargarCSV(nombre, encabezados, filas) {
        const contenido = [
            encabezados,
            ...filas
        ].map(
            (fila) => fila.map(valorCSV).join(";")
        ).join("\r\n");

        const archivo = new Blob(
            ["\uFEFF" + contenido],
            { type: "text/csv;charset=utf-8;" }
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

    function exportarReporte(tipo) {
        if (!resumenDisponible || !programasDisponibles) {
            mostrarMensaje(
                "Espera a que se carguen los registros de SQLite.",
                true
            );
            return;
        }

        if (tipo === "emprendedores") {
            descargarCSV(
                "emprendedores.csv",
                ["ID", "Nombre", "Correo", "Negocio", "Actividad", "Estado"],
                emprendedores.map((e) => [
                    e.id,
                    e.nombre,
                    e.correo,
                    e.emprendimiento,
                    e.actividad,
                    e.estado
                ])
            );
        }

        if (tipo === "sectores") {
            const sectores = new Map();

            emprendedores.forEach((e) => {
                const sector = texto(
                    e.sector || e.actividad,
                    "Sin especificar"
                );

                sectores.set(
                    sector,
                    (sectores.get(sector) || 0) + 1
                );
            });

            descargarCSV(
                "sectores.csv",
                ["Sector económico", "Emprendedores"],
                [...sectores]
            );
        }

        if (tipo === "programas") {
            descargarCSV(
                "programas.csv",
                [
                    "ID", "Programa", "Temática", "Instructor",
                    "Duración (semanas)", "Cupos",
                    "Inscritos", "Fecha de inicio", "Estado"
                ],
                programas.map((p) => [
                    p.id,
                    p.nombre,
                    p.tematica,
                    p.instructor?.name || "",
                    p.duracion_semanas,
                    p.cupos,
                    p.inscripciones_count,
                    fecha(p.fecha_inicio),
                    p.estado
                ])
            );
        }

        if (tipo === "avances") {
            descargarCSV(
                "avances.csv",
                [
                    "Emprendedor", "Negocio", "Programa",
                    "Progreso (%)", "Estado inscripción"
                ],
                avances.map((a) => {
                    const e = buscarEmprendedor(
                        a.emprendedorId ?? a.emprendedor_id
                    );

                    const p = buscarPrograma(
                        a.programaId ?? a.programa_id
                    );

                    return [
                        e?.nombre || "",
                        e?.emprendimiento || "",
                        p?.nombre || "",
                        porcentaje(a.progreso),
                        a.estado
                    ];
                })
            );
        }

        if (tipo === "apoyos") {
            descargarCSV(
                "necesidades_apoyo.csv",
                [
                    "Emprendedor", "Negocio", "Fecha",
                    "Tipo", "Estado", "Responsable", "Observaciones"
                ],
                apoyos.map((a) => {
                    const e = buscarEmprendedor(
                        a.emprendedorId ?? a.emprendedor_id
                    );

                    return [
                        e?.nombre || "",
                        e?.emprendimiento || "",
                        a.fecha,
                        a.tipo,
                        a.estado,
                        a.responsable,
                        a.observacion
                    ];
                })
            );
        }

        mostrarMensaje("Reporte CSV generado con datos de SQLite.");
    }

    // ==========================================
    // EVENTOS DE FILTROS Y REPORTES
    // ==========================================

    const eventos = [
        ["buscarAvance", "input", mostrarAvances],
        ["filtroPrograma", "change", mostrarAvances],
        ["filtroProgreso", "change", mostrarAvances],
        ["buscarPrograma", "input", mostrarProgramas],
        ["filtroEstadoPrograma", "change", mostrarProgramas],
        ["buscarApoyo", "input", mostrarApoyos]
    ];

    eventos.forEach(([id, evento, funcion]) => {
        $(id)?.addEventListener(evento, funcion);
    });

    document.querySelectorAll("[data-reporte]").forEach(
        (boton) => {
            boton.addEventListener("click", () => {
                exportarReporte(boton.dataset.reporte);
            });
        }
    );

    // ==========================================
    // ACTUALIZAR INTERFAZ
    // ==========================================

    function actualizarInterfaz() {
        actualizarFiltroProgramas();
        mostrarIndicadores();
        mostrarEstadisticas();
        mostrarAvances();
        mostrarProgramas();
        mostrarApoyos();
    }

    // ==========================================
    // INICIALIZACIÓN
    // ==========================================

    agregarBotonNuevo();

    Promise.all([
        cargarResumen(),
        cargarProgramas(),
        cargarInstructores()
    ]).catch((error) => {
        console.error(
            "Error al inicializar Coordinador:",
            error
        );
    });
});
