
/* ==========================================
   IMPULSA LOCAL - PANEL ADMINISTRADOR
   JavaScript de demostración
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ======================================
    // DATOS DE DEMOSTRACIÓN
    // ======================================

    const emprendedores = [
        {
            id: 1,
            nombre: "María García",
            correo: "maria@panaderia.com",
            emprendimiento: "Panadería El Trigal",
            actividad: "Panadería / Repostería",
            sector: "Alimentación",
            telefono: "3101234567",
            ubicacion: "Centro",
            estado: "activo"
        },
        {
            id: 2,
            nombre: "Jorge Pérez",
            correo: "jorge@artesanias.com",
            emprendimiento: "Artesanías Pérez",
            actividad: "Artesanías",
            sector: "Cultura y Arte",
            telefono: "3209876543",
            ubicacion: "Norte",
            estado: "activo"
        },
        {
            id: 3,
            nombre: "Lucía Ramírez",
            correo: "lucia@costura.com",
            emprendimiento: "Modas Lucía",
            actividad: "Costura / Confección",
            sector: "Textil",
            telefono: "3154567890",
            ubicacion: "Sur",
            estado: "activo"
        },
        {
            id: 4,
            nombre: "Tomás Herrera",
            correo: "tomas@taller.com",
            emprendimiento: "Taller Herrera",
            actividad: "Taller de reparaciones",
            sector: "Servicios",
            telefono: "3001122334",
            ubicacion: "Centro",
            estado: "activo"
        },
        {
            id: 5,
            nombre: "Camila Torres",
            correo: "camila@tienda.com",
            emprendimiento: "Tienda La Esquina",
            actividad: "Tienda de barrio",
            sector: "Comercio",
            telefono: "3187654321",
            ubicacion: "Occidente",
            estado: "activo"
        },
        {
            id: 6,
            nombre: "Andrés Molina",
            correo: "andres@comidas.com",
            emprendimiento: "Sabores Molina",
            actividad: "Restaurante / Comida",
            sector: "Alimentación",
            telefono: "3119988776",
            ubicacion: "Oriente",
            estado: "inactivo"
        }
    ];

    let programas = [
        {
            id: 1,
            nombre: "Plan de Negocios desde Cero",
            instructor: "Ana Instructora",
            duracion: "8 semanas",
            fecha: "2024-07-01",
            tematica: "Estrategia",
            cupos: 30,
            inscritos: 18,
            estado: "activo",
            descripcion: "Aprende a estructurar tu idea de negocio con metodologías probadas."
        },
        {
            id: 2,
            nombre: "Marketing Digital para Emprendedores",
            instructor: "Ana Instructora",
            duracion: "6 semanas",
            fecha: "2024-07-15",
            tematica: "Marketing",
            cupos: 25,
            inscritos: 22,
            estado: "activo",
            descripcion: "Domina redes sociales, SEO y publicidad pagada."
        },
        {
            id: 3,
            nombre: "Finanzas para No Financieros",
            instructor: "Ana Instructora",
            duracion: "5 semanas",
            fecha: "2024-08-01",
            tematica: "Finanzas",
            cupos: 20,
            inscritos: 14,
            estado: "activo",
            descripcion: "Entiende flujos de caja, punto de equilibrio e inversión."
        },
        {
            id: 4,
            nombre: "Liderazgo y Gestión de Equipos",
            instructor: "Ana Instructora",
            duracion: "7 semanas",
            fecha: "2024-09-01",
            tematica: "Liderazgo",
            cupos: 20,
            inscritos: 9,
            estado: "inactivo",
            descripcion: "Habilidades de liderazgo para construir equipos de alto rendimiento."
        },
        {
            id: 5,
            nombre: "E-commerce: Vende en Línea",
            instructor: "Ana Instructora",
            duracion: "6 semanas",
            fecha: "2024-08-15",
            tematica: "Ventas",
            cupos: 30,
            inscritos: 27,
            estado: "activo",
            descripcion: "Crea tu tienda en línea y escala tus ventas digitales."
        },
        {
            id: 6,
            nombre: "Atención al Cliente y Fidelización",
            instructor: "Ana Instructora",
            duracion: "4 semanas",
            fecha: "2024-05-01",
            tematica: "Ventas",
            cupos: 25,
            inscritos: 11,
            estado: "finalizado",
            descripcion: "Estrategias para retener clientes y hacer crecer tu negocio."
        }
    ];

    const usuarios = [
        {
            nombre: "Carlos Administrador",
            correo: "admin@impulsalocal.co",
            rol: "administrador",
            estado: "activo"
        },
        {
            nombre: "Laura Funcionaria",
            correo: "laura@alcaldia.gov.co",
            rol: "funcionario",
            estado: "activo"
        },
        {
            nombre: "Pedro Coordinador",
            correo: "pedro@impulsalocal.co",
            rol: "coordinador",
            estado: "activo"
        },
        {
            nombre: "Ana Instructora",
            correo: "ana@impulsalocal.co",
            rol: "instructor",
            estado: "activo"
        },
        ...emprendedores.map(e => ({
            nombre: e.nombre,
            correo: e.correo,
            rol: "emprendedor",
            estado: e.estado
        }))
    ];

    // ======================================
    // FUNCIONES AUXILIARES
    // ======================================

    const obtener = id => document.getElementById(id);

    function escaparHTML(valor) {
        return String(valor ?? "").replace(/[&<>"']/g, caracter => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[caracter]);
    }

    function etiquetaEstado(estado) {
        return `<span class="estado ${escaparHTML(estado)}">
            ${escaparHTML(estado)}
        </span>`;
    }

    // ======================================
    // NAVEGACIÓN POR PESTAÑAS
    // ======================================

    document.querySelectorAll(".pestana").forEach(boton => {
        boton.addEventListener("click", () => {
            document.querySelectorAll(".pestana").forEach(item => {
                item.classList.remove("activa");
            });

            document.querySelectorAll(".panel").forEach(panel => {
                panel.classList.remove("activo");
            });

            boton.classList.add("activa");

            const panel = obtener(boton.dataset.tab);

            if (panel) {
                panel.classList.add("activo");
            }

            if (boton.dataset.tab === "reportes") {
                mostrarReportes();
            }
        });
    });

    // ======================================
    // EMPRENDEDORES
    // ======================================

    function mostrarEmprendedores() {
        const busqueda = obtener("buscarEmprendedor").value.toLowerCase();
        const actividad = obtener("filtroActividad").value;
        const estado = obtener("filtroEstadoEmprendedor").value;

        const filtrados = emprendedores.filter(e => {
            const texto = [
                e.nombre,
                e.correo,
                e.emprendimiento,
                e.actividad,
                e.ubicacion
            ].join(" ").toLowerCase();

            return texto.includes(busqueda)
                && (!actividad || e.actividad === actividad)
                && (!estado || e.estado === estado);
        });

        obtener("conteoEmprendedores").textContent =
            `${filtrados.length} emprendedor(es) encontrado(s)`;

        obtener("tablaEmprendedores").innerHTML = filtrados.map(e => `
            <tr>
                <td>
                    ${escaparHTML(e.nombre)}
                    <small>${escaparHTML(e.correo)}</small>
                </td>
                <td>${escaparHTML(e.emprendimiento)}</td>
                <td>${escaparHTML(e.actividad)}</td>
                <td>${escaparHTML(e.telefono)}</td>
                <td>${etiquetaEstado(e.estado)}</td>
                <td>
                    <button class="accion" data-accion="ver" data-id="${e.id}">
                        Ver
                    </button>
                    <button
                        class="accion ${e.estado === "activo" ? "peligro" : "exito"}"
                        data-accion="estado"
                        data-id="${e.id}">
                        ${e.estado === "activo" ? "Desactivar" : "Activar"}
                    </button>
                    <button class="accion seguimiento"
                        data-accion="seguimiento" data-id="${e.id}">
                        +Seguimiento
                    </button>
                </td>
            </tr>
        `).join("");
    }

    obtener("buscarEmprendedor").addEventListener("input", mostrarEmprendedores);
    obtener("filtroActividad").addEventListener("change", mostrarEmprendedores);
    obtener("filtroEstadoEmprendedor").addEventListener("change", mostrarEmprendedores);

    obtener("tablaEmprendedores").addEventListener("click", evento => {
        const boton = evento.target.closest("button[data-accion]");
        if (!boton) return;

        const emprendedor = emprendedores.find(e => e.id === Number(boton.dataset.id));
        if (!emprendedor) return;

        if (boton.dataset.accion === "ver") {
            obtener("detalleEmprendedor").innerHTML = `
                <p><strong>Nombre:</strong> ${escaparHTML(emprendedor.nombre)}</p>
                <p><strong>Correo:</strong> ${escaparHTML(emprendedor.correo)}</p>
                <p><strong>Emprendimiento:</strong> ${escaparHTML(emprendedor.emprendimiento)}</p>
                <p><strong>Actividad:</strong> ${escaparHTML(emprendedor.actividad)}</p>
                <p><strong>Teléfono:</strong> ${escaparHTML(emprendedor.telefono)}</p>
                <p><strong>Ubicación:</strong> ${escaparHTML(emprendedor.ubicacion)}</p>
                <p><strong>Estado:</strong> ${escaparHTML(emprendedor.estado)}</p>
            `;

            obtener("modalEmprendedor").hidden = false;
        }

        if (boton.dataset.accion === "estado") {
            const accion = emprendedor.estado === "activo" ? "desactivar" : "activar";

            if (confirm(`¿Deseas ${accion} a ${emprendedor.nombre}?`)) {
                emprendedor.estado =
                    emprendedor.estado === "activo" ? "inactivo" : "activo";

                const usuario = usuarios.find(u => u.correo === emprendedor.correo);
                if (usuario) usuario.estado = emprendedor.estado;

                mostrarEmprendedores();
                mostrarUsuarios();
                mostrarReportes();
            }
        }

        if (boton.dataset.accion === "seguimiento") {
            const observacion = prompt(
                `Escribe una observación de seguimiento para ${emprendedor.nombre}:`
            );

            if (observacion && observacion.trim()) {
                alert("Seguimiento registrado en esta demostración.");
            }
        }
    });

    obtener("cerrarEmprendedor").addEventListener("click", () => {
        obtener("modalEmprendedor").hidden = true;
    });

    // ======================================
    // PROGRAMAS
    // ======================================

    function mostrarProgramas() {
        const tematica = obtener("filtroTematica").value;
        const estado = obtener("filtroEstadoPrograma").value;

        const filtrados = programas.filter(p =>
            (!tematica || p.tematica === tematica) &&
            (!estado || p.estado === estado)
        );

        obtener("listaProgramas").innerHTML = filtrados.map(p => {
            const porcentaje = p.cupos > 0
                ? Math.min(100, Math.round(p.inscritos / p.cupos * 100))
                : 0;

            return `
                <article class="tarjeta-programa">
                    <div class="programa-encabezado">
                        <h3>${escaparHTML(p.nombre)}</h3>
                        ${etiquetaEstado(p.estado)}
                    </div>

                    <span class="tematica">${escaparHTML(p.tematica)}</span>

                    <p class="descripcion">${escaparHTML(p.descripcion)}</p>

                    <div class="datos-programa">
                        <span>Instructor:</span>
                        <span>${escaparHTML(p.instructor)}</span>

                        <span>Duración:</span>
                        <span>${escaparHTML(p.duracion)}</span>

                        <span>Inicio:</span>
                        <span>${escaparHTML(p.fecha)}</span>

                        <span>Cupos:</span>
                        <span>${p.inscritos}/${p.cupos}</span>
                    </div>

                    <div class="barra-progreso">
                        <div class="progreso" style="width: ${porcentaje}%"></div>
                    </div>

                    <div class="programa-pie">
                        <button class="accion" data-editar="${p.id}">
                            Editar
                        </button>
                        <small>${p.inscritos} inscritos</small>
                    </div>
                </article>
            `;
        }).join("");
    }

    obtener("filtroTematica").addEventListener("change", mostrarProgramas);
    obtener("filtroEstadoPrograma").addEventListener("change", mostrarProgramas);

    function abrirFormulario(programa = null) {
        obtener("formularioPrograma").reset();

        obtener("programaId").value = programa ? programa.id : "";
        obtener("tituloModal").textContent =
            programa ? "Editar programa" : "Nuevo programa";

        if (programa) {
            obtener("nombrePrograma").value = programa.nombre;
            obtener("instructorPrograma").value = programa.instructor;
            obtener("duracionPrograma").value = programa.duracion;
            obtener("fechaPrograma").value = programa.fecha;
            obtener("tematicaPrograma").value = programa.tematica;
            obtener("cuposPrograma").value = programa.cupos;
            obtener("estadoPrograma").value = programa.estado;
            obtener("descripcionPrograma").value = programa.descripcion;
        }

        obtener("modalPrograma").hidden = false;
    }

    obtener("nuevoPrograma").addEventListener("click", () => {
        abrirFormulario();
    });

    obtener("listaProgramas").addEventListener("click", evento => {
        const boton = evento.target.closest("[data-editar]");
        if (!boton) return;

        const programa = programas.find(p => p.id === Number(boton.dataset.editar));

        if (programa) abrirFormulario(programa);
    });

    obtener("cancelarPrograma").addEventListener("click", () => {
        obtener("modalPrograma").hidden = true;
    });

    obtener("formularioPrograma").addEventListener("submit", evento => {
        evento.preventDefault();

        const id = Number(obtener("programaId").value);
        const existente = programas.find(p => p.id === id);

        const datos = {
            nombre: obtener("nombrePrograma").value.trim(),
            instructor: obtener("instructorPrograma").value.trim(),
            duracion: obtener("duracionPrograma").value.trim(),
            fecha: obtener("fechaPrograma").value,
            tematica: obtener("tematicaPrograma").value,
            cupos: Number(obtener("cuposPrograma").value),
            estado: obtener("estadoPrograma").value,
            descripcion: obtener("descripcionPrograma").value.trim()
        };

        if (!datos.nombre || !datos.instructor || !datos.duracion ||
            !datos.fecha || !datos.descripcion || datos.cupos < 1) {
            alert("Completa correctamente todos los campos.");
            return;
        }

        if (existente) {
            if (datos.cupos < existente.inscritos) {
                alert("Los cupos no pueden ser menores a los inscritos actuales.");
                return;
            }

            Object.assign(existente, datos);
        } else {
            programas.push({
                id: Math.max(0, ...programas.map(p => p.id)) + 1,
                ...datos,
                inscritos: 0
            });
        }

        obtener("modalPrograma").hidden = true;
        mostrarProgramas();
        mostrarReportes();

        alert("Programa guardado en esta demostración.");
    });

    // ======================================
    // USUARIOS
    // ======================================

    function mostrarUsuarios() {
        obtener("tablaUsuarios").innerHTML = usuarios.map(u => `
            <tr>
                <td>${escaparHTML(u.nombre)}</td>
                <td>${escaparHTML(u.correo)}</td>
                <td><span class="etiqueta rol">${escaparHTML(u.rol)}</span></td>
                <td>${etiquetaEstado(u.estado)}</td>
            </tr>
        `).join("");
    }

    // ======================================
    // REPORTES
    // ======================================

    function mostrarBarras(contenedor, datos) {
        const maximo = Math.max(1, ...datos.map(d => d.valor));

        obtener(contenedor).innerHTML = datos.map(d => `
            <div class="reporte-fila">
                <div class="reporte-fila-encabezado">
                    <span>${escaparHTML(d.nombre)}</span>
                    <strong>${d.valor}</strong>
                </div>
                <div class="barra-progreso">
                    <div class="progreso"
                         style="width: ${d.valor / maximo * 100}%"></div>
                </div>
            </div>
        `).join("");
    }

    function obtenerSectores() {
        const conteo = {};

        emprendedores.forEach(e => {
            conteo[e.sector] = (conteo[e.sector] || 0) + 1;
        });

        return Object.entries(conteo).map(([nombre, valor]) => ({
            nombre,
            valor
        }));
    }

    function obtenerProgramasSolicitados() {
        return [...programas]
            .sort((a, b) => b.inscritos - a.inscritos)
            .slice(0, 5)
            .map(p => ({
                nombre: p.nombre,
                valor: p.inscritos
            }));
    }

    function mostrarReportes() {
        const activos = emprendedores.filter(e => e.estado === "activo").length;
        const inactivos = emprendedores.length - activos;
        const programasActivos = programas.filter(p => p.estado === "activo").length;
        const inscripciones = programas.reduce((total, p) => total + p.inscritos, 0);

        obtener("totalActivos").textContent = activos;
        obtener("totalRegistrados").textContent = emprendedores.length;
        obtener("totalProgramasActivos").textContent = programasActivos;
        obtener("totalInscripciones").textContent = inscripciones;

        mostrarBarras("reporteSectores", obtenerSectores());
        mostrarBarras("reporteProgramas", obtenerProgramasSolicitados());

        obtener("resumenEmprendedores").innerHTML = `
            <div class="resumen-item">
                <strong style="color:#00a74f">${activos}</strong>
                <span>Activos</span>
            </div>
            <div class="resumen-item">
                <strong style="color:#e23a48">${inactivos}</strong>
                <span>Inactivos</span>
            </div>
            <div class="resumen-item">
                <strong>${emprendedores.length}</strong>
                <span>Total</span>
            </div>
        `;
    }

    // ======================================
    // EXPORTACIÓN CSV
    // ======================================

    function exportarCSV(nombreArchivo, encabezados, filas) {
        const escaparCSV = valor =>
            `"${String(valor ?? "").replace(/"/g, '""')}"`;

        const contenido = [
            encabezados.map(escaparCSV).join(","),
            ...filas.map(fila => fila.map(escaparCSV).join(","))
        ].join("\r\n");

        const archivo = new Blob(
            ["\uFEFF", contenido],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(archivo);
        const enlace = document.createElement("a");

        enlace.href = url;
        enlace.download = nombreArchivo;
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();

        URL.revokeObjectURL(url);
    }

    obtener("exportarSectores").addEventListener("click", () => {
        exportarCSV(
            "sectores_impulsa_local.csv",
            ["Sector", "Cantidad"],
            obtenerSectores().map(s => [s.nombre, s.valor])
        );
    });

    obtener("exportarProgramas").addEventListener("click", () => {
        exportarCSV(
            "programas_impulsa_local.csv",
            ["Programa", "Inscritos"],
            obtenerProgramasSolicitados().map(p => [p.nombre, p.valor])
        );
    });

    obtener("exportarTodo").addEventListener("click", () => {
        exportarCSV(
            "emprendedores_impulsa_local.csv",
            ["Nombre", "Correo", "Emprendimiento", "Actividad", "Teléfono", "Estado"],
            emprendedores.map(e => [
                e.nombre,
                e.correo,
                e.emprendimiento,
                e.actividad,
                e.telefono,
                e.estado
            ])
        );
    });

    // ======================================
    // CERRAR MODALES
    // ======================================

    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", evento => {
            if (evento.target === modal) {
                modal.hidden = true;
            }
        });
    });

    document.addEventListener("keydown", evento => {
        if (evento.key === "Escape") {
            document.querySelectorAll(".modal").forEach(modal => {
                modal.hidden = true;
            });
        }
    });

    // ======================================
    // CARGA INICIAL
    // ======================================

    mostrarEmprendedores();
    mostrarProgramas();
    mostrarUsuarios();
    mostrarReportes();

});
