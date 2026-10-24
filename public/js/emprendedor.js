
document.addEventListener('DOMContentLoaded', () => {

    // CONFIGURACIÓN Y DATOS INICIALES
    const $ = id => document.getElementById(id);

    const dinero = n => '$ ' + Math.round(n).toLocaleString('es-CO');

    // Fecha de referencia de las capturas
    const hoy = '2026-10-22';

    const actividades = [
        'Panadería / Repostería',
        'Artesanías',
        'Taller de reparaciones',
        'Tienda de barrio',
        'Restaurante / Comida',
        'Costura / Confección',
        'Servicios de belleza',
        'Agricultura / Huerta',
        'Servicios tecnológicos',
        'Otro'
    ];

    const categorias = [
        'Panadería',
        'Repostería',
        'Artesanías',
        'Ropa y textil',
        'Alimentos',
        'Bebidas',
        'Servicios',
        'Tecnología',
        'Otro'
    ];

    const programas = [
        {
            id: 1,
            nombre: 'Plan de Negocios desde Cero',
            tema: 'Estrategia',
            estado: 'activo',
            semanas: 8,
            cupos: 30,
            ocupados: 18,
            descripcion: 'Aprende a estructurar tu idea de negocio con metodologías probadas.'
        },
        {
            id: 2,
            nombre: 'Marketing Digital para Emprendedores',
            tema: 'Marketing',
            estado: 'activo',
            semanas: 6,
            cupos: 25,
            ocupados: 22,
            descripcion: 'Domina redes sociales, SEO y publicidad pagada.'
        },
        {
            id: 3,
            nombre: 'Finanzas para No Financieros',
            tema: 'Finanzas',
            estado: 'activo',
            semanas: 5,
            cupos: 20,
            ocupados: 14,
            descripcion: 'Entiende flujos de caja, punto de equilibrio e inversión.'
        },
        {
            id: 4,
            nombre: 'Liderazgo y Gestión de Equipos',
            tema: 'Liderazgo',
            estado: 'inactivo',
            semanas: 7,
            cupos: 20,
            ocupados: 9,
            descripcion: 'Habilidades de liderazgo para construir equipos de alto rendimiento.'
        },
        {
            id: 5,
            nombre: 'E-commerce: Vende en Línea',
            tema: 'Ventas',
            estado: 'activo',
            semanas: 6,
            cupos: 30,
            ocupados: 27,
            descripcion: 'Crea tu tienda en línea y escala tus ventas digitales.'
        },
        {
            id: 6,
            nombre: 'Atención al Cliente y Fidelización',
            tema: 'Ventas',
            estado: 'finalizado',
            semanas: 4,
            cupos: 25,
            ocupados: 11,
            descripcion: 'Estrategias para retener clientes y hacer crecer tu negocio.'
        }
    ];

    const inicial = {
        perfil: {
            nombre: 'María García',
            correo: 'maria@panaderia.com',
            telefono: '3101234567',
            direccion: 'Calle 12 #34-56, Barrio Centro',
            emprendimiento: 'Panadería El Trigal',
            actividad: 'Panadería / Repostería',
            sector: 'Alimentación',
            registro: '2024-03-10',
            estado: 'activo'
        },

        inscripciones: [
            { id: 1, progreso: 75, fecha: '2024-07-02' },
            { id: 2, progreso: 50, fecha: '2024-07-16' },
            { id: 6, progreso: 100, fecha: '2024-05-02' }
        ],

        productos: [
            {
                codigo: 'PAN-001',
                nombre: 'Pan de trigo (unidad)',
                categoria: 'Panadería',
                compra: 500,
                venta: 800,
                stock: 120
            },
            {
                codigo: 'PAN-002',
                nombre: 'Croissant',
                categoria: 'Repostería',
                compra: 1200,
                venta: 2000,
                stock: 45
            },
            {
                codigo: 'PAN-003',
                nombre: 'Torta de cumpleaños (libra)',
                categoria: 'Repostería',
                compra: 8000,
                venta: 15000,
                stock: 8
            },
            {
                codigo: 'PAN-004',
                nombre: 'Almojábana (unidad)',
                categoria: 'Panadería',
                compra: 600,
                venta: 1000,
                stock: 80
            }
        ],

        ventas: [
            {
                fecha: '2026-10-22',
                nota: 'Venta mañana',
                items: [
                    {
                        codigo: 'PAN-001',
                        nombre: 'Pan de trigo (unidad)',
                        cantidad: 20,
                        precio: 800
                    },
                    {
                        codigo: 'PAN-002',
                        nombre: 'Croissant',
                        cantidad: 8,
                        precio: 2000
                    }
                ],
                total: 32000
            },
            {
                fecha: '2026-10-22',
                nota: 'Venta tarde',
                items: [
                    {
                        codigo: 'PAN-004',
                        nombre: 'Almojábana (unidad)',
                        cantidad: 15,
                        precio: 1000
                    }
                ],
                total: 15000
            },
            {
                fecha: '2026-10-21',
                items: [
                    {
                        codigo: 'PAN-001',
                        nombre: 'Pan de trigo (unidad)',
                        cantidad: 30,
                        precio: 800
                    },
                    {
                        codigo: 'PAN-003',
                        nombre: 'Torta de cumpleaños (libra)',
                        cantidad: 1,
                        precio: 15000
                    }
                ],
                total: 39000
            },
            {
                fecha: '2026-10-20',
                items: [
                    {
                        codigo: 'PAN-002',
                        nombre: 'Croissant',
                        cantidad: 12,
                        precio: 2000
                    },
                    {
                        codigo: 'PAN-004',
                        nombre: 'Almojábana (unidad)',
                        cantidad: 20,
                        precio: 1000
                    }
                ],
                total: 44000
            },
            {
                fecha: '2026-10-19',
                items: [
                    {
                        codigo: 'PAN-001',
                        nombre: 'Pan de trigo (unidad)',
                        cantidad: 25,
                        precio: 800
                    }
                ],
                total: 20000
            },
            {
                fecha: '2026-10-18',
                items: [
                    {
                        codigo: 'PAN-001',
                        nombre: 'Pan de trigo (unidad)',
                        cantidad: 18,
                        precio: 800
                    },
                    {
                        codigo: 'PAN-002',
                        nombre: 'Croissant',
                        cantidad: 5,
                        precio: 2000
                    }
                ],
                total: 24400
            },
            {
                fecha: '2026-10-17',
                items: [
                    {
                        codigo: 'PAN-003',
                        nombre: 'Torta de cumpleaños (libra)',
                        cantidad: 2,
                        precio: 15000
                    },
                    {
                        codigo: 'PAN-004',
                        nombre: 'Almojábana (unidad)',
                        cantidad: 10,
                        precio: 1000
                    }
                ],
                total: 40000
            },
            {
                fecha: '2026-10-14',
                items: [
                    {
                        codigo: 'PAN-001',
                        nombre: 'Pan de trigo (unidad)',
                        cantidad: 35,
                        precio: 800
                    }
                ],
                total: 28000
            },
            {
                fecha: '2026-10-10',
                items: [
                    {
                        codigo: 'PAN-002',
                        nombre: 'Croissant',
                        cantidad: 10,
                        precio: 2000
                    },
                    {
                        codigo: 'PAN-003',
                        nombre: 'Torta de cumpleaños (libra)',
                        cantidad: 1,
                        precio: 15000
                    }
                ],
                total: 35000
            },
            {
                fecha: '2026-10-02',
                items: [
                    {
                        codigo: 'PAN-001',
                        nombre: 'Pan de trigo (unidad)',
                        cantidad: 40,
                        precio: 800
                    },
                    {
                        codigo: 'PAN-004',
                        nombre: 'Almojábana (unidad)',
                        cantidad: 30,
                        precio: 1000
                    }
                ],
                total: 62000
            }
        ]
    };

    
    // ALMACENAMIENTO LOCAL + SINCRONIZACIÓN ENTRE ROLES

    const CLAVE_LOCAL = 'impulsa-emprendedor-demo-v1';
    const ID_EMPRENDEDOR = 'emp-maria-garcia';

    let datos;

    try {
        const guardado = JSON.parse(
            localStorage.getItem(CLAVE_LOCAL)
        );

        datos = guardado &&
            guardado.perfil &&
            Array.isArray(guardado.productos) &&
            Array.isArray(guardado.ventas) &&
            Array.isArray(guardado.inscripciones)
                ? guardado
                : structuredClone(inicial);

    } catch {
        datos = structuredClone(inicial);
    }

    // Publicar información para los demás roles.

    function sincronizarCompartidos() {
        if (!window.ImpulsaDatos) return;

        const compartidos = ImpulsaDatos.obtenerDatos();

        const emprendedor = {
            id: ID_EMPRENDEDOR,
            ...datos.perfil
        };

        const indice = compartidos.emprendedores.findIndex(
            e => e.id === ID_EMPRENDEDOR
        );

        if (indice === -1) {
            compartidos.emprendedores.push(emprendedor);
        } else {
            compartidos.emprendedores[indice] = {
                ...compartidos.emprendedores[indice],
                ...emprendedor
            };
        }

        // Sincronizar inscripciones de este emprendedor.

        compartidos.inscripciones =
            compartidos.inscripciones.filter(
                i => i.emprendedorId !== ID_EMPRENDEDOR
            );

        compartidos.inscripciones.push(
            ...datos.inscripciones.map(i => ({
                id: `${ID_EMPRENDEDOR}-programa-${i.id}`,
                emprendedorId: ID_EMPRENDEDOR,
                emprendedor: datos.perfil.nombre,
                emprendimiento: datos.perfil.emprendimiento,
                programaId: i.id,
                programa: programas.find(
                    p => p.id === i.id
                )?.nombre || '',
                progreso: i.progreso,
                fecha: i.fecha,
                estado: i.progreso >= 100
                    ? 'completado'
                    : 'en curso'
            }))
        );

        // Sincronizar reportes de avance.

        compartidos.reportesAvance =
            compartidos.reportesAvance.filter(
                r => r.emprendedorId !== ID_EMPRENDEDOR
            );

        compartidos.reportesAvance.push(
            ...(datos.reportesAvance || []).map(r => ({
                ...r,
                emprendedorId: ID_EMPRENDEDOR,
                emprendedor: datos.perfil.nombre,
                emprendimiento: datos.perfil.emprendimiento,
                programa: programas.find(
                    p => p.id === r.programaId
                )?.nombre || ''
            }))
        );

        ImpulsaDatos.guardarDatos(compartidos);
    }

    // Guardar sin perder inventario ni ventas.

    const guardar = () => {
        localStorage.setItem(
            CLAVE_LOCAL,
            JSON.stringify(datos)
        );

        sincronizarCompartidos();
    };

    // Leer cambios de progreso registrados por otros roles.

    function importarProgresos() {
        if (!window.ImpulsaDatos) return false;

        const inscripciones =
            ImpulsaDatos.obtenerColeccion('inscripciones')
                .filter(
                    i => i.emprendedorId === ID_EMPRENDEDOR
                );

        let cambios = false;

        for (const remota of inscripciones) {
            const local = datos.inscripciones.find(
                i => i.id === Number(remota.programaId)
            );

            if (
                local &&
                Number.isFinite(Number(remota.progreso)) &&
                local.progreso !== Number(remota.progreso)
            ) {
                local.progreso = Math.min(
                    100,
                    Math.max(0, Number(remota.progreso))
                );

                cambios = true;
            }
        }

        if (cambios) {
            localStorage.setItem(
                CLAVE_LOCAL,
                JSON.stringify(datos)
            );
        }

        return cambios;
    }


    // FUNCIONES GENERALES
    const escape = s => String(s ?? '').replace(
        /[&<>"']/g,
        c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[c])
    );

    const estadoIns = i =>
        i.progreso === 100 ? 'completado' : 'en curso';

    const barra = p => `
        <div class="barra">
            <div class="relleno"
                 style="width:${Math.min(100, Math.max(0, p))}%">
            </div>
        </div>
    `;

    const badge = s => `
        <span class="estado ${s === 'en curso' ? 'curso' : escape(s)}">
            ${escape(s)}
        </span>
    `;

    const mensaje = s => {
        const m = $('mensaje');
        m.textContent = s;
        m.style.display = 'block';

        clearTimeout(m._timer);

        m._timer = setTimeout(() => {
            m.style.display = 'none';
        }, 3500);
    };

    // MI PERFIL
    function renderPerfil() {
        const p = datos.perfil;

        $('usuarioNombre').textContent = p.nombre;

        const campos = [
            ['Nombre completo', p.nombre],
            ['Correo electrónico', p.correo],
            ['Teléfono', p.telefono],
            ['Dirección', p.direccion],
            ['Emprendimiento', p.emprendimiento],
            ['Actividad económica', p.actividad],
            ['Sector', p.sector],
            ['Fecha de registro', p.registro]
        ];

        $('perfilLectura').innerHTML = `
            <div class="cabecera-bloque">
                <h2>Información personal</h2>
                <button id="editarPerfil" class="btn enlace">
                    Editar
                </button>
            </div>

            <div class="datos-perfil">
                ${campos.map(([nombre, valor]) => `
                    <div class="dato-perfil">
                        <small>${escape(nombre.toUpperCase())}</small>
                        <div>${escape(valor)}</div>
                    </div>
                `).join('')}

                <div class="dato-perfil">
                    <small>ESTADO</small>
                    <div>${badge(p.estado)}</div>
                </div>
            </div>
        `;

        $('editarPerfil').onclick = () => {
            const formulario = $('perfilFormulario');

            for (const nombre of [
                'emprendimiento',
                'telefono',
                'direccion',
                'actividad'
            ]) {
                formulario.elements[nombre].value = p[nombre];
            }

            $('perfilLectura').hidden = true;
            formulario.hidden = false;
        };
    }

    $('actividadSelect').innerHTML = actividades.map(a =>
        `<option>${escape(a)}</option>`
    ).join('');

    $('categoriaProducto').innerHTML = categorias.map(a =>
        `<option>${escape(a)}</option>`
    ).join('');

    $('cancelarPerfil').onclick = () => {
        $('perfilFormulario').hidden = true;
        $('perfilLectura').hidden = false;
    };

    $('perfilFormulario').onsubmit = e => {
        e.preventDefault();

        const formulario = e.currentTarget;

        for (const nombre of [
            'emprendimiento',
            'telefono',
            'direccion',
            'actividad'
        ]) {
            datos.perfil[nombre] =
                formulario.elements[nombre].value.trim();
        }

        guardar();
        renderPerfil();

        formulario.hidden = true;
        $('perfilLectura').hidden = false;

        mensaje('Información actualizada');
    };

    // PROGRAMAS E INSCRIPCIONES
    function renderProgramas() {
        const inscripciones = datos.inscripciones;

        $('tituloInscripciones').textContent =
            `Mis inscripciones (${inscripciones.length})`;

        $('inscripciones').innerHTML = inscripciones.map(i => {
            const p = programas.find(x => x.id === i.id);

            return `
                <div class="inscripcion">
                    <div>
                        <strong>${escape(p.nombre)}</strong>
                        <small>
                            ${escape(p.tema)} · ${p.semanas} semanas
                        </small>
                    </div>

                    <div class="progreso-inline">
                        ${barra(i.progreso)}
                        <strong>${i.progreso}%</strong>
                        ${badge(estadoIns(i))}
                    </div>
                </div>
            `;
        }).join('');

        const tema = $('filtroTematica').value;
        const estado = $('filtroEstado').value;

        const filtrados = programas.filter(p =>
            (!tema || p.tema === tema) &&
            (!estado || p.estado === estado)
        );

        $('programasDisponibles').innerHTML = filtrados.map(p => {
            const inscrito = inscripciones.some(i => i.id === p.id);

            const habilitado =
                p.estado === 'activo' &&
                p.ocupados < p.cupos;

            let textoBoton = 'No disponible';
            let claseBoton = 'btn-no';

            if (inscrito) {
                textoBoton = 'Ya estás inscrito/a ✓';
                claseBoton = 'btn-inscrito';
            } else if (habilitado) {
                textoBoton = 'Inscribirme';
                claseBoton = 'primario';
            }

            return `
                <article class="tarjeta programa">
                    <div class="cabecera-bloque">
                        <h3>${escape(p.nombre)}</h3>
                        ${badge(p.estado)}
                    </div>

                    <span class="tematica">${escape(p.tema)}</span>

                    <p>${escape(p.descripcion)}</p>

                    <div class="fila">
                        <span>Instructor:</span>
                        <span>Ana Instructora</span>
                    </div>

                    <div class="fila">
                        <span>Duración:</span>
                        <span>${p.semanas} semanas</span>
                    </div>

                    <div class="fila">
                        <span>Cupos disponibles:</span>
                        <span>${p.cupos - p.ocupados}/${p.cupos}</span>
                    </div>

                    <button
                        class="btn btn-ancho ${claseBoton}"
                        data-inscribir="${p.id}"
                        ${inscrito || !habilitado ? 'disabled' : ''}>
                        ${textoBoton}
                    </button>
                </article>
            `;
        }).join('');
    }

    const tematicas = [...new Set(programas.map(p => p.tema))];

    $('filtroTematica').innerHTML =
        '<option value="">Todas las temáticas</option>' +
        tematicas.map(t => `<option>${escape(t)}</option>`).join('');

    $('filtroTematica').onchange = renderProgramas;
    $('filtroEstado').onchange = renderProgramas;

    $('programasDisponibles').onclick = e => {
        const boton = e.target.closest('[data-inscribir]');

        if (!boton) return;

        const id = Number(boton.dataset.inscribir);
        const programa = programas.find(p => p.id === id);

        if (
            !programa ||
            programa.estado !== 'activo' ||
            programa.ocupados >= programa.cupos ||
            datos.inscripciones.some(i => i.id === id)
        ) {
            return;
        }

        datos.inscripciones.push({
            id,
            progreso: 0,
            fecha: hoy
        });

        programa.ocupados++;

        guardar();
        renderProgramas();
        renderProgreso();

        mensaje('Inscripción realizada correctamente');
    };

    // MI PROGRESO
    function renderProgreso() {
        $('detalleProgreso').innerHTML =
            datos.inscripciones.map(i => {
                const p = programas.find(p => p.id === i.id);

                return `
                    <div class="detalle">
                        <div class="cabecera-bloque">
                            <strong>${escape(p.nombre)}</strong>
                            <span>
                                ${badge(estadoIns(i))}
                                &nbsp;
                                <strong>${i.progreso}%</strong>
                            </span>
                        </div>

                        ${barra(i.progreso)}

                        <small>Inscrito el ${escape(i.fecha)}</small>
                    </div>
                `;
            }).join('');

        const seguimientos = [
            {
                fecha: '2024-07-10',
                tipo: 'visita',
                nota: 'Emprendedora con gran avance en el módulo de plan de negocios. Cumple con todas las tareas.'
            },
            {
                fecha: '2024-08-05',
                tipo: 'llamada',
                nota: 'Se realizó llamada de seguimiento. Reporta dificultades con el presupuesto inicial.'
            }
        ];

        $('seguimientos').innerHTML = seguimientos.map(s => `
            <div class="seguimiento">
                <div class="cabecera-bloque">
                    <small>
                        ${escape(s.fecha)}
                        &nbsp;
                        <span class="estado curso">${escape(s.tipo)}</span>
                    </small>
                    <small>Por: Laura Funcionaria</small>
                </div>
                <p>${escape(s.nota)}</p>
            </div>
        `).join('');
    }

    // INVENTARIO
    let editando = null;

    function renderInventario() {
        const productos = datos.productos;

        const total = productos.reduce(
            (acumulado, p) => acumulado + p.compra * p.stock,
            0
        );

        const potencial = productos.reduce(
            (acumulado, p) => acumulado + p.venta * p.stock,
            0
        );

        const bajos = productos.filter(p => p.stock <= 10);

        $('totalProductos').textContent = productos.length;
        $('valorInventario').textContent = dinero(total);
        $('valorPotencial').textContent = dinero(potencial);
        $('cantidadBajo').textContent = bajos.length;

        $('alertasStock').innerHTML = bajos.map(p => `
            <div class="alerta">
                ⚠️ &nbsp;
                <strong>Stock bajo en: ${escape(p.nombre)}</strong>
                <div>
                    Considera reabastecer pronto para no quedarte sin producto.
                </div>
            </div>
        `).join('');

        const busqueda = $('buscarProducto').value.toLowerCase().trim();

        const filtrados = productos.filter(p =>
            [p.codigo, p.nombre, p.categoria].some(valor =>
                valor.toLowerCase().includes(busqueda)
            )
        );

        $('filasInventario').innerHTML = filtrados.map(p => {
            const margen = p.venta
                ? Math.round((p.venta - p.compra) / p.venta * 100)
                : 0;

            return `
                <tr>
                    <td>${escape(p.codigo)}</td>
                    <td>${escape(p.nombre)}</td>

                    <td>
                        <span class="estado curso">
                            ${escape(p.categoria)}
                        </span>
                    </td>

                    <td>${dinero(p.compra)}</td>
                    <td><strong>${dinero(p.venta)}</strong></td>

                    <td class="verde">
                        <strong>${margen}%</strong>
                    </td>

                    <td>
                        <span class="stock ${p.stock <= 10 ? 'bajo' : ''}">
                            ${p.stock} und.
                        </span>
                    </td>

                    <td>
                        <button class="accion-link"
                                data-editar="${escape(p.codigo)}">
                            Editar
                        </button>

                        <button class="accion-link peligro"
                                data-eliminar="${escape(p.codigo)}">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        }).join('') || `
            <tr>
                <td colspan="8">No hay productos que coincidan.</td>
            </tr>
        `;
    }

    $('buscarProducto').oninput = renderInventario;

    function abrirProducto(codigo = null) {
        editando = codigo;

        const producto = datos.productos.find(
            p => p.codigo === codigo
        );

        const formulario = $('formProducto');
        formulario.reset();

        $('tituloModalProducto').textContent = producto
            ? 'Editar producto'
            : 'Nuevo producto';

        if (producto) {
            for (const nombre of [
                'nombre', 'codigo', 'categoria',
                'compra', 'venta', 'stock'
            ]) {
                formulario.elements[nombre].value = producto[nombre];
            }
        }

        formulario.elements.codigo.readOnly = !!producto;

        $('modalProducto').showModal();
    }

    $('nuevoProducto').onclick = () => abrirProducto();

    $('filasInventario').onclick = e => {
        const boton = e.target.closest('button');

        if (!boton) return;

        if (boton.dataset.editar) {
            abrirProducto(boton.dataset.editar);
        }

        if (boton.dataset.eliminar) {
            const producto = datos.productos.find(
                p => p.codigo === boton.dataset.eliminar
            );

            if (producto && confirm(`¿Eliminar ${producto.nombre}?`)) {
                datos.productos = datos.productos.filter(
                    p => p.codigo !== producto.codigo
                );

                guardar();
                renderInventario();
                mensaje('Producto eliminado');
            }
        }
    };

    $('formProducto').onsubmit = e => {
        e.preventDefault();

        const formulario = e.currentTarget;

        const producto = {
            nombre: formulario.elements.nombre.value.trim(),
            codigo: formulario.elements.codigo.value.trim(),
            categoria: formulario.elements.categoria.value,
            compra: Number(formulario.elements.compra.value),
            venta: Number(formulario.elements.venta.value),
            stock: Number(formulario.elements.stock.value)
        };

        const valores = [
            producto.compra,
            producto.venta,
            producto.stock
        ];

        if (
            !producto.nombre ||
            !producto.codigo ||
            valores.some(n => !Number.isFinite(n) || n < 0) ||
            !Number.isInteger(producto.stock)
        ) {
            mensaje('Revisa los datos del producto');
            return;
        }

        const codigoExiste = datos.productos.some(
            p => p.codigo.toLowerCase() === producto.codigo.toLowerCase()
        );

        if (!editando && codigoExiste) {
            mensaje('El código ya existe');
            return;
        }

        if (editando) {
            const indice = datos.productos.findIndex(
                p => p.codigo === editando
            );

            if (indice >= 0) {
                datos.productos[indice] = producto;
            }
        } else {
            datos.productos.push(producto);
        }

        guardar();
        $('modalProducto').close();
        renderInventario();

        mensaje('Producto guardado');
    };

    // VENTAS
    let periodo = 'hoy';

    function filtrarVentas(periodoSeleccionado) {
        return datos.ventas.filter(v => {
            if (periodoSeleccionado === 'hoy') {
                return v.fecha === hoy;
            }

            if (periodoSeleccionado === 'semana') {
                return v.fecha >= '2026-10-16' && v.fecha <= hoy;
            }

            return v.fecha.startsWith('2026-10');
        });
    }

    function renderVentas() {
        const periodos = [
            ['hoy', 'Hoy'],
            ['semana', 'Semana'],
            ['mes', 'Mes']
        ];

        for (const [periodoActual, sufijo] of periodos) {
            const ventas = filtrarVentas(periodoActual);

            const total = ventas.reduce(
                (acumulado, v) => acumulado + v.total,
                0
            );

            $('ventas' + sufijo).textContent = dinero(total);
            $('registros' + sufijo).textContent =
                `${ventas.length} registro(s)`;
        }

        const ventas = filtrarVentas(periodo);

        const titulos = {
            hoy: 'Ventas de hoy',
            semana: 'Ventas de la semana',
            mes: 'Ventas del mes'
        };

        $('tituloVentas').textContent = titulos[periodo];

        const total = ventas.reduce(
            (acumulado, v) => acumulado + v.total,
            0
        );

        $('totalPeriodo').textContent = dinero(total);
        $('cantidadPeriodo').textContent =
            `${ventas.length} registro(s)`;

        // AGRUPAR VENTAS POR FECHA
        const grupos = {};

        for (const venta of ventas) {
            if (!grupos[venta.fecha]) {
                grupos[venta.fecha] = [];
            }

            grupos[venta.fecha].push(venta);
        }

        const maximo = Math.max(
            1,
            ...Object.values(grupos).map(grupo =>
                grupo.reduce((suma, v) => suma + v.total, 0)
            )
        );

        $('graficoVentas').innerHTML =
            Object.entries(grupos)
                .sort((a, b) => b[0].localeCompare(a[0]))
                .map(([fecha, grupo]) => {
                    const totalDia = grupo.reduce(
                        (suma, v) => suma + v.total,
                        0
                    );

                    const porcentaje = Math.round(
                        totalDia / maximo * 100
                    );

                    return `
                        <div class="dia-venta">
                            <span>${fecha === hoy ? 'Hoy' : fecha}</span>

                            <div>
                                ${barra(porcentaje)}

                                ${grupo.map(v => `
                                    <div class="detalle-venta">
                                        <span class="punto">●</span>

                                        ${v.items.map(i =>
                                            `${escape(i.nombre)} ×${i.cantidad}`
                                        ).join(' · ')}

                                        ${v.nota ? '— ' + escape(v.nota) : ''}
                                    </div>
                                `).join('')}
                            </div>

                            <div class="monto">${dinero(totalDia)}</div>
                        </div>
                    `;
                }).join('') ||
            '<p>Sin ventas registradas en este período.</p>';

        // PRODUCTOS MÁS VENDIDOS
        const conteo = {};

        for (const venta of ventas) {
            for (const item of venta.items) {
                const codigo = item.codigo;

                if (!conteo[codigo]) {
                    conteo[codigo] = {
                        nombre: item.nombre,
                        cantidad: 0,
                        total: 0
                    };
                }

                conteo[codigo].cantidad += item.cantidad;
                conteo[codigo].total += item.cantidad * item.precio;
            }
        }

        const ordenados = Object.values(conteo)
            .sort((a, b) => b.total - a.total);

        const mayor = Math.max(
            1,
            ...ordenados.map(p => p.total)
        );

        $('masVendidos').innerHTML = ordenados.map(p => `
            <div class="ranking">
                <div class="cabecera-bloque">
                    <span>${escape(p.nombre)}</span>

                    <span>
                        ${p.cantidad} und. &nbsp;
                        <strong>${dinero(p.total)}</strong>
                    </span>
                </div>

                <div class="barra">
                    <div class="relleno"
                         style="width:${p.total / mayor * 100}%">
                    </div>
                </div>
            </div>
        `).join('') || '<p>Sin productos vendidos.</p>';
    }

    // CAMBIAR PERÍODO DE VENTAS
    document.querySelectorAll('[data-periodo]').forEach(boton => {
        boton.onclick = () => {
            periodo = boton.dataset.periodo;

            document.querySelectorAll('[data-periodo]').forEach(b => {
                b.classList.toggle('activo', b === boton);
            });

            renderVentas();
        };
    });

    // AGREGAR PRODUCTOS A UNA VENTA
    function agregarLinea() {
        const div = document.createElement('div');
        div.className = 'linea-venta';

        div.innerHTML = `
            <select class="producto-linea" aria-label="Producto">
                <option value="">Seleccionar...</option>

                ${datos.productos
                    .filter(p => p.stock > 0)
                    .map(p => `
                        <option value="${escape(p.codigo)}">
                            ${escape(p.nombre)}
                        </option>
                    `).join('')}
            </select>

            <input class="cantidad-linea"
                   type="number" min="1" step="1"
                   value="1" aria-label="Cantidad">

            <input class="subtotal-linea"
                   value="0" readonly aria-label="Subtotal">

            <button type="button" class="quitar"
                    aria-label="Quitar producto">
                ✕
            </button>

            <small class="disponible">
                Stock disponible: — · Subtotal: $ 0
            </small>
        `;

        $('lineasVenta').appendChild(div);

        div.querySelector('.quitar').onclick = () => {
            div.remove();
            calcularVenta();
        };

        div.querySelectorAll('select, input').forEach(campo => {
            campo.addEventListener('input', calcularVenta);
        });

        calcularVenta();
    }

    // CALCULAR TOTAL DE LA VENTA
    function calcularVenta() {
        let total = 0;

        for (const linea of document.querySelectorAll('.linea-venta')) {
            const codigo = linea.querySelector('select').value;

            const producto = datos.productos.find(
                p => p.codigo === codigo
            );

            const cantidad = Number(
                linea.querySelector('.cantidad-linea').value
            );

            const subtotal =
                producto &&
                Number.isInteger(cantidad) &&
                cantidad > 0
                    ? producto.venta * cantidad
                    : 0;

            total += subtotal;

            linea.querySelector('.subtotal-linea').value =
                dinero(subtotal);

            const disponible = linea.querySelector('.disponible');

            disponible.textContent =
                `Stock disponible: ${producto ? producto.stock : '—'}` +
                ` · Subtotal: ${dinero(subtotal)}`;

            disponible.style.color =
                producto && cantidad > producto.stock
                    ? 'red'
                    : '';
        }

        $('totalNuevaVenta').textContent = dinero(total);
    }

    $('agregarLinea').onclick = agregarLinea;

    $('nuevaVenta').onclick = () => {
        $('formVenta').reset();
        $('formVenta').elements.fecha.value = hoy;

        $('lineasVenta').innerHTML = '';

        agregarLinea();
        $('modalVenta').showModal();
    };

    // GUARDAR VENTA Y DESCONTAR INVENTARIO
    $('formVenta').onsubmit = e => {
        e.preventDefault();

        const formulario = e.currentTarget;
        const fecha = formulario.elements.fecha.value;

        const items = [];
        const acumulado = {};

        for (const linea of document.querySelectorAll('.linea-venta')) {
            const codigo = linea.querySelector('select').value;

            const producto = datos.productos.find(
                p => p.codigo === codigo
            );

            const cantidad = Number(
                linea.querySelector('.cantidad-linea').value
            );

            if (
                !producto ||
                !Number.isInteger(cantidad) ||
                cantidad <= 0
            ) {
                mensaje('Selecciona un producto y una cantidad válida');
                return;
            }

            acumulado[codigo] =
                (acumulado[codigo] || 0) + cantidad;

            items.push({
                codigo,
                nombre: producto.nombre,
                cantidad,
                precio: producto.venta
            });
        }

        if (!items.length) {
            mensaje('Agrega un producto');
            return;
        }

        // VALIDAR EXISTENCIAS
        for (const [codigo, cantidad] of Object.entries(acumulado)) {
            const producto = datos.productos.find(
                p => p.codigo === codigo
            );

            if (cantidad > producto.stock) {
                mensaje(`Stock insuficiente de ${producto.nombre}`);
                return;
            }
        }

        // DESCONTAR PRODUCTOS VENDIDOS
        for (const [codigo, cantidad] of Object.entries(acumulado)) {
            const producto = datos.productos.find(
                p => p.codigo === codigo
            );

            producto.stock -= cantidad;
        }

        const total = items.reduce(
            (suma, item) => suma + item.cantidad * item.precio,
            0
        );

        datos.ventas.push({
            fecha,
            nota: formulario.elements.nota.value.trim(),
            items,
            total
        });

        guardar();

        $('modalVenta').close();

        renderInventario();
        renderVentas();

        mensaje('Venta registrada y stock actualizado');
    };

    // CERRAR VENTANAS
    document.querySelectorAll('[data-cerrar]').forEach(boton => {
        boton.onclick = () => {
            $(boton.dataset.cerrar).close();
        };
    });

    // EXPORTAR ARCHIVOS CSV
    function exportarCSV(nombre, filas) {
        const csv = '\ufeff' + filas.map(fila =>
            fila.map(valor =>
                '"' + String(valor ?? '').replace(/"/g, '""') + '"'
            ).join(';')
        ).join('\r\n');

        const archivo = new Blob(
            [csv],
            { type: 'text/csv;charset=utf-8' }
        );

        const url = URL.createObjectURL(archivo);

        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = nombre;

        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    $('exportarInventario').onclick = () => {
        const encabezados = [
            'Código',
            'Nombre',
            'Categoría',
            'Precio compra',
            'Precio venta',
            'Stock'
        ];

        const filas = datos.productos.map(p => [
            p.codigo,
            p.nombre,
            p.categoria,
            p.compra,
            p.venta,
            p.stock
        ]);

        exportarCSV('inventario.csv', [encabezados, ...filas]);
    };

    $('exportarVentas').onclick = () => {
        const encabezados = [
            'Fecha',
            'Nota',
            'Producto',
            'Cantidad',
            'Precio unitario',
            'Subtotal'
        ];

        const filas = filtrarVentas(periodo).flatMap(venta =>
            venta.items.map(item => [
                venta.fecha,
                venta.nota || '',
                item.nombre,
                item.cantidad,
                item.precio,
                item.cantidad * item.precio
            ])
        );

        exportarCSV(
            'ventas-' + periodo + '.csv',
            [encabezados, ...filas]
        );
    };

    // NAVEGACIÓN PRINCIPAL
    document.querySelectorAll('[data-vista]').forEach(boton => {
        boton.onclick = () => {
            document.querySelectorAll('[data-vista]').forEach(b => {
                b.classList.toggle('activa', b === boton);
            });

            document.querySelectorAll('.vista').forEach(vista => {
                vista.classList.toggle(
                    'activa',
                    vista.id === 'vista-' + boton.dataset.vista
                );
            });
        };
    });

    // NAVEGACIÓN INVENTARIO Y VENTAS
    document.querySelectorAll('[data-negocio]').forEach(boton => {
        boton.onclick = () => {
            document.querySelectorAll('[data-negocio]').forEach(b => {
                b.classList.toggle('activa', b === boton);
            });

            $('negocio-inventario').hidden =
                boton.dataset.negocio !== 'inventario';

            $('negocio-ventas').hidden =
                boton.dataset.negocio !== 'ventas';
        };
    });

    
// ==========================================
// MÓDULO: REPORTES DE AVANCE DEL EMPRENDEDOR
// ==========================================

// Recuperar los reportes guardados.
// Se usa una propiedad nueva para conservar
// el inventario, las ventas y el perfil existentes.

if (!Array.isArray(datos.reportesAvance)) {
    datos.reportesAvance = [];
}

// Fecha actual en formato YYYY-MM-DD.
function fechaLocalReporte() {
    const fecha = new Date();

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
}

// Mostrar los reportes registrados.
function renderReportesAvance() {
    const contenedor = $('historialAvances');

    if (datos.reportesAvance.length === 0) {
        contenedor.innerHTML = `
            <div class="reporte-vacio">
                <strong>Aún no tienes reportes de avance.</strong>
                <p>
                    Registra tus logros y dificultades
                    para llevar un seguimiento de tu emprendimiento.
                </p>
            </div>
        `;

        return;
    }

    const reportes = [...datos.reportesAvance].sort(
        (a, b) => b.fecha.localeCompare(a.fecha)
    );

    contenedor.innerHTML = reportes.map(reporte => {
        const programa = programas.find(
            p => p.id === reporte.programaId
        );

        const nombrePrograma = programa
            ? programa.nombre
            : 'Programa no disponible';

        return `
            <article class="reporte-avance">

                <div class="cabecera-bloque">
                    <div>
                        <h4>${escape(nombrePrograma)}</h4>

                        <span class="reporte-fecha">
                            Fecha: ${escape(reporte.fecha)}
                        </span>
                    </div>

                    <span class="estado-reporte">
                        Registrado
                    </span>
                </div>

                <div class="reporte-contenido">
                    <strong>Avances o logros obtenidos</strong>
                    <p>${escape(reporte.logros)}</p>
                </div>

                <div class="reporte-contenido">
                    <strong>Dificultades presentadas</strong>
                    <p>${escape(reporte.dificultades)}</p>
                </div>

                <div class="reporte-contenido">
                    <strong>Apoyo solicitado</strong>
                    <p>${escape(reporte.apoyo)}</p>
                </div>

            </article>
        `;
    }).join('');
}

// Abrir formulario de reporte.
$('abrirReporteAvance').addEventListener('click', () => {
    const formulario = $('formReporteAvance');

    formulario.reset();

    const selector = $('programaReporte');

    selector.innerHTML = `
        <option value="">Selecciona un programa</option>
    `;

    // Solo mostrar programas en los que
    // el emprendedor se encuentra inscrito.
    datos.inscripciones.forEach(inscripcion => {
        const programa = programas.find(
            p => p.id === inscripcion.id
        );

        if (!programa) return;

        const opcion = document.createElement('option');

        opcion.value = programa.id;
        opcion.textContent = programa.nombre;

        selector.appendChild(opcion);
    });

    if (datos.inscripciones.length === 0) {
        mensaje('Primero debes inscribirte en un programa');
        return;
    }

    $('fechaReporte').value = fechaLocalReporte();
    $('fechaReporte').max = fechaLocalReporte();

    $('modalReporteAvance').showModal();
});

// Cancelar registro.
$('cancelarReporteAvance').addEventListener('click', () => {
    $('modalReporteAvance').close();
});

// Guardar reporte.
$('formReporteAvance').addEventListener('submit', e => {
    e.preventDefault();

    const formulario = e.currentTarget;

    const programaId = Number(
        formulario.elements.programa.value
    );

    const fecha = formulario.elements.fecha.value;

    const logros = formulario.elements.logros.value.trim();

    const dificultades =
        formulario.elements.dificultades.value.trim();

    const apoyo = formulario.elements.apoyo.value.trim();

    // Verificar que el programa esté inscrito.
    const inscrito = datos.inscripciones.some(
        i => i.id === programaId
    );

    if (!inscrito) {
        mensaje('Selecciona un programa en el que estés inscrito');
        return;
    }

    // Validar los campos obligatorios.
    if (!fecha || !logros || !dificultades || !apoyo) {
        mensaje('Completa todos los campos del reporte');
        return;
    }

    // No permitir fechas futuras.
    if (fecha > fechaLocalReporte()) {
        mensaje('La fecha no puede ser futura');
        return;
    }

    // Crear el reporte.
    const nuevoReporte = {
        id: crypto.randomUUID(),
        programaId: programaId,
        fecha: fecha,
        logros: logros,
        dificultades: dificultades,
        apoyo: apoyo,
        estado: 'registrado'
    };

    // Agregar el reporte al historial.
    datos.reportesAvance.push(nuevoReporte);

    // Guardar en localStorage mediante la
    // función guardar() que ya tiene el proyecto.
    guardar();

    // Actualizar la información visible.
    renderReportesAvance();

    // Cerrar formulario.
    $('modalReporteAvance').close();

    // Limpiar campos.
    formulario.reset();

    // Mostrar confirmación.
    mensaje('Reporte de avance guardado correctamente');
});

// Mostrar reportes al cargar la página.
renderReportesAvance();

    
    // SINCRONIZACIÓN INICIAL ENTRE ROLES

    importarProgresos();

    sincronizarCompartidos();

    // Escuchar cambios realizados desde otras pestañas.

    window.addEventListener('storage', event => {

        if (event.key !== 'impulsa-local-datos-v1') {
            return;
        }

        if (importarProgresos()) {
            renderProgramas();
            renderProgreso();
        }

    });


    // CARGAR TODAS LAS SECCIONES
    renderPerfil();
    renderProgramas();
    renderProgreso();
    renderInventario();
    renderVentas();

});
