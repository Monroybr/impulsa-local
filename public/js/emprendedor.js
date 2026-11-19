document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ========================================
    // CONFIGURACIÓN GENERAL
    // ========================================

    const usuario = window.IMPULSA_USUARIO;

    if (!usuario || !usuario.id) {
        console.error('No se encontró el usuario autenticado.');
        return;
    }

    const RUTA_PRODUCTOS = '/emprendedor/productos';
    const RUTA_VENTAS = '/emprendedor/ventas';

    const TOKEN_CSRF = document.querySelector(
        'meta[name="csrf-token"]'
    )?.content;

    const $ = selector => document.querySelector(selector);
    const $$ = selector => document.querySelectorAll(selector);

    const formatoDinero = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    });

    // Todos los productos y ventas se consultan
    // directamente desde SQLite.
    // No se eliminan datos antiguos de localStorage.

    const datos = {
        productos: [],
        ventas: []
    };

    let inventarioDisponible = false;

    // ========================================
    // FUNCIONES GENERALES
    // ========================================

    function textoSeguro(valor) {
        return String(valor ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    function mostrarMensaje(texto, error = false) {
        const elemento = $('#mensajeSistema');

        if (!elemento) {
            console.log(texto);
            return;
        }

        elemento.textContent = texto;
        elemento.hidden = false;
        elemento.className = error
            ? 'il-alerta il-error'
            : 'il-alerta';
    }

    // ========================================
    // COMUNICACIÓN CON LARAVEL
    // ========================================

    async function solicitarLaravel(url, opciones = {}) {
        const respuesta = await fetch(url, {
            credentials: 'same-origin',
            ...opciones,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': TOKEN_CSRF || '',
                ...(opciones.headers || {})
            }
        });

        const contenido = await respuesta.json()
            .catch(() => ({}));

        if (!respuesta.ok) {
            const validacion = contenido.errors
                ? Object.values(contenido.errors).flat()[0]
                : null;

            throw new Error(
                validacion ||
                contenido.message ||
                `Error del servidor (${respuesta.status})`
            );
        }

        return contenido;
    }

    // ========================================
    // NAVEGACIÓN PRINCIPAL
    // ========================================

    function mostrarVista(nombre) {
        $$('.vista').forEach(vista => {
            const activa = vista.id === `vista-${nombre}`;

            vista.hidden = !activa;
            vista.classList.toggle('activa', activa);
        });

        $$('.pestana[data-vista]').forEach(boton => {
            boton.classList.toggle(
                'activa',
                boton.dataset.vista === nombre
            );
        });

        if (nombre === 'negocio') {
            renderizarInventario();
            renderizarVentas();
        }
    }

    $$('.pestana[data-vista]').forEach(boton => {
        boton.addEventListener('click', () => {
            mostrarVista(boton.dataset.vista);
        });
    });

    // ========================================
    // PERFIL DEL EMPRENDEDOR
    // ========================================

    $('#editarPerfil')?.addEventListener('click', () => {
        if ($('#perfilLectura')) {
            $('#perfilLectura').hidden = true;
        }

        if ($('#perfilFormulario')) {
            $('#perfilFormulario').hidden = false;
        }
    });

    $('#cancelarPerfil')?.addEventListener('click', () => {
        if ($('#perfilFormulario')) {
            $('#perfilFormulario').hidden = true;
        }

        if ($('#perfilLectura')) {
            $('#perfilLectura').hidden = false;
        }
    });

    // ========================================
    // PESTAÑAS INVENTARIO Y VENTAS
    // ========================================

    function mostrarNegocio(nombre) {
        if ($('#negocio-inventario')) {
            $('#negocio-inventario').hidden =
                nombre !== 'inventario';
        }

        if ($('#negocio-ventas')) {
            $('#negocio-ventas').hidden =
                nombre !== 'ventas';
        }

        $$('[data-negocio]').forEach(boton => {
            const activo = boton.dataset.negocio === nombre;

            boton.classList.toggle('activo', activo);
            boton.classList.toggle('secundario', !activo);
        });
    }

    $$('[data-negocio]').forEach(boton => {
        boton.addEventListener('click', () => {
            mostrarNegocio(boton.dataset.negocio);
        });
    });

    // ========================================
    // PRODUCTOS: CONSULTAR SQLITE
    // ========================================

    async function cargarProductosSQLite() {
        try {
            const respuesta = await solicitarLaravel(
                RUTA_PRODUCTOS
            );

            if (!Array.isArray(respuesta)) {
                throw new Error(
                    'Respuesta de productos no válida.'
                );
            }

            datos.productos = respuesta.map(producto => ({
                ...producto,
                id: Number(producto.id),
                compra: Number(producto.compra),
                venta: Number(producto.venta),
                stock: Number(producto.stock)
            }));

            inventarioDisponible = true;
            renderizarInventario();

            return true;

        } catch (error) {
            inventarioDisponible = false;

            console.error(error);

            mostrarMensaje(
                'Error al cargar productos: ' + error.message,
                true
            );

            return false;
        }
    }

    // ========================================
    // PRODUCTOS: MOSTRAR INVENTARIO
    // ========================================

    function renderizarInventario() {
        const cuerpo = $('#filasInventario');

        if (!cuerpo) return;

        const busqueda = (
            $('#buscarProducto')?.value || ''
        ).toLowerCase().trim();

        const productos = datos.productos.filter(producto =>
            [
                producto.codigo,
                producto.nombre,
                producto.categoria
            ].join(' ').toLowerCase().includes(busqueda)
        );

        cuerpo.innerHTML = '';

        productos.forEach(producto => {
            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td>${textoSeguro(producto.codigo)}</td>
                <td>${textoSeguro(producto.nombre)}</td>
                <td>${textoSeguro(producto.categoria)}</td>
                <td>${formatoDinero.format(producto.compra)}</td>
                <td>${formatoDinero.format(producto.venta)}</td>
                <td>
                    ${producto.stock}
                    ${producto.stock <= 10
                        ? '<span class="il-peligro">Bajo</span>'
                        : ''}
                </td>
                <td>
                    <button type="button"
                        class="il-boton secundario"
                        data-editar="${producto.id}">
                        Editar
                    </button>
                    <button type="button"
                        class="il-boton secundario"
                        data-eliminar="${producto.id}">
                        Eliminar
                    </button>
                </td>
            `;

            cuerpo.appendChild(fila);
        });

        const total = datos.productos.length;

        const valorInventario = datos.productos.reduce(
            (suma, producto) =>
                suma + producto.compra * producto.stock,
            0
        );

        const valorPotencial = datos.productos.reduce(
            (suma, producto) =>
                suma + producto.venta * producto.stock,
            0
        );

        const stockBajo = datos.productos.filter(
            producto => producto.stock <= 10
        ).length;

        if ($('#totalProductos')) {
            $('#totalProductos').textContent = total;
        }

        if ($('#valorInventario')) {
            $('#valorInventario').textContent =
                formatoDinero.format(valorInventario);
        }

        if ($('#valorPotencial')) {
            $('#valorPotencial').textContent =
                formatoDinero.format(valorPotencial);
        }

        if ($('#cantidadBajo')) {
            $('#cantidadBajo').textContent = stockBajo;
        }

        if ($('#sinProductos')) {
            $('#sinProductos').hidden = productos.length > 0;
        }
    }

    $('#buscarProducto')?.addEventListener(
        'input',
        renderizarInventario
    );

    // ========================================
    // PRODUCTOS: CREAR Y EDITAR
    // ========================================

    const modalProducto = $('#modalProducto');
    const formProducto = $('#formProducto');

    $('#nuevoProducto')?.addEventListener('click', () => {
        if (!inventarioDisponible) {
            mostrarMensaje(
                'El inventario aún no está disponible.',
                true
            );
            return;
        }

        if (!modalProducto || !formProducto) {
            mostrarMensaje(
                'No se encontró el formulario de productos.',
                true
            );
            return;
        }

        formProducto.reset();
        formProducto.elements.producto_id.value = '';

        if ($('#tituloModalProducto')) {
            $('#tituloModalProducto').textContent =
                'Nuevo producto';
        }

        modalProducto.showModal();
    });

    formProducto?.addEventListener('submit', async evento => {
        evento.preventDefault();

        const formulario = new FormData(formProducto);

        const id = String(
            formulario.get('producto_id') || ''
        );

        const producto = {
            codigo: String(formulario.get('codigo') || '').trim(),
            nombre: String(formulario.get('nombre') || '').trim(),
            categoria: String(formulario.get('categoria') || '').trim(),
            compra: Number(formulario.get('compra')),
            venta: Number(formulario.get('venta')),
            stock: Number(formulario.get('stock'))
        };

        if (
            !producto.codigo ||
            !producto.nombre ||
            !producto.categoria ||
            !Number.isFinite(producto.compra) ||
            !Number.isFinite(producto.venta) ||
            !Number.isInteger(producto.stock) ||
            producto.compra < 0 ||
            producto.venta < 0 ||
            producto.stock < 0
        ) {
            mostrarMensaje(
                'Verifica los datos del producto.',
                true
            );
            return;
        }

        const boton = formProducto.querySelector(
            '[type="submit"]'
        );

        if (boton) boton.disabled = true;

        try {
            await solicitarLaravel(
                id ? `${RUTA_PRODUCTOS}/${id}` : RUTA_PRODUCTOS,
                {
                    method: id ? 'PUT' : 'POST',
                    body: JSON.stringify(producto)
                }
            );

            const actualizado = await cargarProductosSQLite();

            if (actualizado) {
                modalProducto.close();

                mostrarMensaje(
                    id
                        ? 'Producto actualizado en SQLite.'
                        : 'Producto registrado en SQLite.'
                );
            }

        } catch (error) {
            mostrarMensaje(error.message, true);

        } finally {
            if (boton) boton.disabled = false;
        }
    });

    // ========================================
    // PRODUCTOS: EDITAR Y ELIMINAR
    // ========================================

    $('#filasInventario')?.addEventListener(
        'click',
        async evento => {
            const editar = evento.target.closest('[data-editar]');
            const eliminar = evento.target.closest('[data-eliminar]');

            if (editar) {
                const producto = datos.productos.find(
                    item => item.id === Number(editar.dataset.editar)
                );

                if (!producto || !formProducto || !modalProducto) {
                    return;
                }

                [
                    'codigo',
                    'nombre',
                    'categoria',
                    'compra',
                    'venta',
                    'stock'
                ].forEach(campo => {
                    formProducto.elements[campo].value =
                        producto[campo];
                });

                formProducto.elements.producto_id.value =
                    producto.id;

                if ($('#tituloModalProducto')) {
                    $('#tituloModalProducto').textContent =
                        'Editar producto';
                }

                modalProducto.showModal();
            }

            if (eliminar) {
                const id = Number(eliminar.dataset.eliminar);

                if (!confirm(
                    '¿Deseas eliminar este producto?'
                )) {
                    return;
                }

                eliminar.disabled = true;

                try {
                    await solicitarLaravel(
                        `${RUTA_PRODUCTOS}/${id}`,
                        { method: 'DELETE' }
                    );

                    await cargarProductosSQLite();

                    mostrarMensaje(
                        'Producto eliminado correctamente.'
                    );

                } catch (error) {
                    mostrarMensaje(error.message, true);

                } finally {
                    eliminar.disabled = false;
                }
            }
        }
    );

    // ========================================
    // VENTAS: CONSULTAR SQLITE
    // ========================================

    async function cargarVentasSQLite() {
        try {
            const respuesta = await solicitarLaravel(
                RUTA_VENTAS
            );

            if (!Array.isArray(respuesta)) {
                throw new Error(
                    'Respuesta de ventas no válida.'
                );
            }

            datos.ventas = respuesta;

            renderizarVentas();

            return true;

        } catch (error) {
            console.error(error);

            mostrarMensaje(
                'Error al cargar ventas: ' + error.message,
                true
            );

            return false;
        }
    }

    // ========================================
    // VENTAS: FORMULARIO
    // ========================================

    const modalVenta = $('#modalVenta');
    const formVenta = $('#formVenta');

    function actualizarProductosVenta() {
        const selector = $('#productoVenta');

        if (!selector) return;

        selector.innerHTML =
            '<option value="">Selecciona un producto</option>';

        datos.productos
            .filter(producto => producto.stock > 0)
            .forEach(producto => {
                const opcion = document.createElement('option');

                opcion.value = producto.id;

                opcion.textContent =
                    `${producto.nombre} - Stock: ${producto.stock}`;

                selector.appendChild(opcion);
            });
    }

    $('#nuevaVenta')?.addEventListener('click', async () => {
        if (!modalVenta || !formVenta || !$('#productoVenta')) {
            mostrarMensaje(
                'No se encontró el formulario para registrar ventas.',
                true
            );
            return;
        }

        const actualizado = await cargarProductosSQLite();

        if (!actualizado) return;

        actualizarProductosVenta();

        if (!datos.productos.some(
            producto => producto.stock > 0
        )) {
            mostrarMensaje(
                'No hay productos con existencias disponibles.',
                true
            );
            return;
        }

        formVenta.reset();

        if ($('#fechaVenta')) {
            $('#fechaVenta').value = fechaLocal();
            $('#fechaVenta').disabled = true;
        }

        modalVenta.showModal();
    });

    // ========================================
    // VENTAS: REGISTRAR EN SQLITE
    // ========================================

    formVenta?.addEventListener('submit', async evento => {
        evento.preventDefault();

        const formulario = new FormData(formVenta);

        const productoId = Number(
            formulario.get('producto_id')
        );

        const cantidad = Number(
            formulario.get('cantidad')
        );

        if (
            !Number.isInteger(productoId) ||
            productoId < 1 ||
            !Number.isInteger(cantidad) ||
            cantidad < 1
        ) {
            mostrarMensaje(
                'Selecciona un producto y una cantidad válida.',
                true
            );
            return;
        }

        const boton = formVenta.querySelector(
            '[type="submit"]'
        );

        if (boton?.disabled) return;
        if (boton) boton.disabled = true;

        try {
            await solicitarLaravel(RUTA_VENTAS, {
                method: 'POST',
                body: JSON.stringify({
                    productos: [
                        {
                            producto_id: productoId,
                            cantidad: cantidad
                        }
                    ]
                })
            });

            modalVenta.close();

            const resultados = await Promise.all([
                cargarProductosSQLite(),
                cargarVentasSQLite()
            ]);

            if (resultados.every(Boolean)) {
                mostrarMensaje(
                    'Venta registrada correctamente en SQLite.'
                );
            } else {
                mostrarMensaje(
                    'Venta guardada, pero no se pudo actualizar toda la información. Recarga la página.',
                    true
                );
            }

        } catch (error) {
            mostrarMensaje(error.message, true);

        } finally {
            if (boton) boton.disabled = false;
        }
    });

    // ========================================
    // FUNCIONES DE FECHAS
    // ========================================

    function fechaLocal() {
        const fecha = new Date();

        return [
            fecha.getFullYear(),
            String(fecha.getMonth() + 1).padStart(2, '0'),
            String(fecha.getDate()).padStart(2, '0')
        ].join('-');
    }

    function inicioSemana() {
        const fecha = new Date();

        const dia = (fecha.getDay() + 6) % 7;

        fecha.setDate(fecha.getDate() - dia);

        return [
            fecha.getFullYear(),
            String(fecha.getMonth() + 1).padStart(2, '0'),
            String(fecha.getDate()).padStart(2, '0')
        ].join('-');
    }

    // ========================================
    // VENTAS: MOSTRAR DATOS REALES DE SQLITE
    // ========================================

    function renderizarVentas() {
        const cuerpo = $('#filasVentas');

        if (!cuerpo) return;

        cuerpo.innerHTML = '';

        // Cada registro proviene de la tabla ventas
        // y sus detalles de detalle_ventas.

        const ventasSQLite = datos.ventas.flatMap(venta =>
            (venta.detalles || []).map(detalle => ({
                fecha: String(
                    venta.fecha_venta || ''
                ).slice(0, 10),

                producto: detalle.nombre_producto,
                cantidad: Number(detalle.cantidad),
                precio_unitario: Number(detalle.precio_unitario),
                total: Number(detalle.subtotal)
            }))
        );

        ventasSQLite.sort(
            (a, b) =>
                String(b.fecha).localeCompare(String(a.fecha))
        );

        ventasSQLite.forEach(venta => {
            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td>${textoSeguro(venta.fecha)}</td>
                <td>${textoSeguro(venta.producto)}</td>
                <td>${textoSeguro(venta.cantidad)}</td>
                <td>${formatoDinero.format(
                    Number(venta.total) || 0
                )}</td>
            `;

            cuerpo.appendChild(fila);
        });

        // ====================================
        // ESTADÍSTICAS REALES
        // ====================================

        const hoy = fechaLocal();
        const semana = inicioSemana();
        const mes = hoy.slice(0, 7);

        const sumar = lista => lista.reduce(
            (total, venta) =>
                total + (Number(venta.total) || 0),
            0
        );

        if ($('#ventasHoy')) {
            $('#ventasHoy').textContent =
                formatoDinero.format(
                    sumar(
                        ventasSQLite.filter(
                            venta => venta.fecha === hoy
                        )
                    )
                );
        }

        if ($('#ventasSemana')) {
            $('#ventasSemana').textContent =
                formatoDinero.format(
                    sumar(
                        ventasSQLite.filter(
                            venta =>
                                venta.fecha >= semana &&
                                venta.fecha <= hoy
                        )
                    )
                );
        }

        if ($('#ventasMes')) {
            $('#ventasMes').textContent =
                formatoDinero.format(
                    sumar(
                        ventasSQLite.filter(
                            venta =>
                                venta.fecha.slice(0, 7) === mes
                        )
                    )
                );
        }

        if ($('#sinVentas')) {
            $('#sinVentas').hidden =
                ventasSQLite.length > 0;
        }
    }

    // ========================================
    // EXPORTACIÓN CSV
    // ========================================

    function exportarCSV(nombre, encabezados, filas) {
        function celda(valor) {
            let texto = String(valor ?? '');

            // Protección frente a fórmulas CSV
            if (/^\s*[=+\-@]/.test(texto)) {
                texto = "'" + texto;
            }

            return '"' +
                texto.replaceAll('"', '""') +
                '"';
        }

        const contenido = [
            encabezados,
            ...filas
        ].map(
            fila => fila.map(celda).join(';')
        ).join('\r\n');

        const archivo = new Blob(
            ['\uFEFF', contenido],
            {
                type: 'text/csv;charset=utf-8'
            }
        );

        const url = URL.createObjectURL(archivo);

        const enlace = document.createElement('a');

        enlace.href = url;
        enlace.download = nombre;

        document.body.appendChild(enlace);

        enlace.click();
        enlace.remove();

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    }

    // ========================================
    // EXPORTAR INVENTARIO SQLITE
    // ========================================

    $('#exportarInventario')?.addEventListener(
        'click',
        () => {
            if (!inventarioDisponible) {
                mostrarMensaje(
                    'El inventario todavía no está disponible.',
                    true
                );
                return;
            }

            exportarCSV(
                'inventario-impulsa-local.csv',
                [
                    'Código',
                    'Producto',
                    'Categoría',
                    'Compra',
                    'Venta',
                    'Stock'
                ],
                datos.productos.map(producto => [
                    producto.codigo,
                    producto.nombre,
                    producto.categoria,
                    producto.compra,
                    producto.venta,
                    producto.stock
                ])
            );
        }
    );

    // ========================================
    // EXPORTAR VENTAS SOLO DESDE SQLITE
    // ========================================

    $('#exportarVentas')?.addEventListener(
        'click',
        () => {
            const filas = datos.ventas.flatMap(venta =>
                (venta.detalles || []).map(detalle => [
                    String(
                        venta.fecha_venta || ''
                    ).slice(0, 10),

                    detalle.nombre_producto,
                    detalle.cantidad,
                    detalle.precio_unitario,
                    detalle.subtotal
                ])
            );

            exportarCSV(
                'ventas-impulsa-local.csv',
                [
                    'Fecha',
                    'Producto',
                    'Cantidad',
                    'Precio unitario',
                    'Total'
                ],
                filas
            );
        }
    );

    // ========================================
    // CERRAR VENTANAS MODALES
    // ========================================

    $$('[data-cerrar]').forEach(boton => {
        boton.addEventListener('click', () => {
            const id = boton.dataset.cerrar;

            if (id) {
                document.getElementById(id)?.close();
            } else {
                boton.closest('dialog')?.close();
            }
        });
    });

    // ========================================
    // INICIALIZACIÓN
    // ========================================

    mostrarVista('perfil');
    mostrarNegocio('inventario');

    renderizarInventario();
    renderizarVentas();

    cargarProductosSQLite();
    cargarVentasSQLite();

});
