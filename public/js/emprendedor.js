
document.addEventListener('DOMContentLoaded', function () {

    'use strict';

    const usuario = window.IMPULSA_USUARIO;

    if (!usuario || !usuario.id) {
        console.error('No se encontró el usuario autenticado.');
        return;
    }

    // ========================================
    // CONFIGURACIÓN
    // ========================================

    const CLAVE_LOCAL =
        `impulsa-local-negocio-usuario-${usuario.id}-v1`;

    const formatoDinero = new Intl.NumberFormat(
        'es-CO',
        {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }
    );

    const $ = (selector) =>
        document.querySelector(selector);

    const $$ = (selector) =>
        document.querySelectorAll(selector);

    function fechaLocal() {
        const fecha = new Date();

        return [
            fecha.getFullYear(),
            String(fecha.getMonth() + 1).padStart(2, '0'),
            String(fecha.getDate()).padStart(2, '0')
        ].join('-');
    }

    function nuevoId() {
        return Date.now().toString(36) +
            Math.random().toString(36).slice(2, 9);
    }

    function textoSeguro(valor) {
        return String(valor ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    function mostrarMensaje(texto, error = false) {
        const contenedor = $('#mensajeSistema');

        if (!contenedor) return;

        contenedor.textContent = texto;
        contenedor.className = error
            ? 'il-alerta il-error'
            : 'il-alerta';
    }

    // ========================================
    // DATOS DEL NEGOCIO
    // ========================================

    function cargarDatos() {
        try {
            const guardado = JSON.parse(
                localStorage.getItem(CLAVE_LOCAL)
            );

            if (
                guardado &&
                Array.isArray(guardado.productos) &&
                Array.isArray(guardado.ventas)
            ) {
                return guardado;
            }
        } catch (error) {
            console.error(
                'No fue posible recuperar los datos:',
                error
            );
        }

        return {
            productos: [],
            ventas: []
        };
    }

    let datos = cargarDatos();

    function guardarDatos() {
        try {
            localStorage.setItem(
                CLAVE_LOCAL,
                JSON.stringify(datos)
            );
            return true;
        } catch (error) {
            console.error(error);

            mostrarMensaje(
                'No fue posible guardar los datos en este navegador.',
                true
            );

            return false;
        }
    }

    // ========================================
    // NAVEGACIÓN PRINCIPAL
    // ========================================

    function mostrarVista(nombre) {
        $$('.vista').forEach(function (vista) {
            const activa =
                vista.id === `vista-${nombre}`;

            vista.hidden = !activa;
            vista.classList.toggle('activa', activa);
        });

        $$('.pestana[data-vista]').forEach(function (boton) {
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

    $$('.pestana[data-vista]').forEach(function (boton) {
        boton.addEventListener('click', function () {
            mostrarVista(boton.dataset.vista);
        });
    });

    // ========================================
    // PERFIL REAL DESDE LARAVEL
    // ========================================

    const botonEditar = $('#editarPerfil');
    const botonCancelar = $('#cancelarPerfil');
    const perfilLectura = $('#perfilLectura');
    const perfilFormulario = $('#perfilFormulario');

    if (botonEditar && perfilFormulario) {
        botonEditar.addEventListener('click', function () {
            perfilLectura.hidden = true;
            perfilFormulario.hidden = false;
        });
    }

    if (botonCancelar && perfilFormulario) {
        botonCancelar.addEventListener('click', function () {
            perfilFormulario.hidden = true;
            perfilLectura.hidden = false;
        });
    }

    // El formulario del perfil se envía a Laravel
    // mediante PUT /emprendedor/perfil.
    // No se guarda el perfil personal en localStorage.

    // ========================================
    // NAVEGACIÓN INVENTARIO / VENTAS
    // ========================================

    function mostrarNegocio(nombre) {
        const inventario = $('#negocio-inventario');
        const ventas = $('#negocio-ventas');

        if (inventario) {
            inventario.hidden = nombre !== 'inventario';
        }

        if (ventas) {
            ventas.hidden = nombre !== 'ventas';
        }

        $$('[data-negocio]').forEach(function (boton) {
            const activo = boton.dataset.negocio === nombre;

            boton.classList.toggle('activo', activo);
            boton.classList.toggle('secundario', !activo);
        });
    }

    $$('[data-negocio]').forEach(function (boton) {
        boton.addEventListener('click', function () {
            mostrarNegocio(boton.dataset.negocio);
        });
    });

    // ========================================
    // INVENTARIO
    // ========================================

    function renderizarInventario() {
        const cuerpo = $('#filasInventario');

        if (!cuerpo) return;

        const busqueda = (
            $('#buscarProducto')?.value || ''
        ).toLowerCase().trim();

        const productos = datos.productos.filter(function (producto) {
            const contenido = [
                producto.nombre,
                producto.codigo,
                producto.categoria
            ].join(' ').toLowerCase();

            return contenido.includes(busqueda);
        });

        cuerpo.innerHTML = '';

        productos.forEach(function (producto) {
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
                        ? '<span class="il-peligro"> Bajo</span>'
                        : ''}
                </td>
                <td>
                    <button
                        type="button"
                        class="il-boton secundario"
                        data-editar="${textoSeguro(producto.id)}">
                        Editar
                    </button>

                    <button
                        type="button"
                        class="il-boton secundario"
                        data-eliminar="${textoSeguro(producto.id)}">
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

        const bajo = datos.productos.filter(
            producto => producto.stock <= 10
        ).length;

        $('#totalProductos').textContent = total;

        $('#valorInventario').textContent =
            formatoDinero.format(valorInventario);

        $('#valorPotencial').textContent =
            formatoDinero.format(valorPotencial);

        $('#cantidadBajo').textContent = bajo;

        $('#sinProductos').hidden = productos.length > 0;
    }

    $('#buscarProducto')?.addEventListener(
        'input',
        renderizarInventario
    );

    // ========================================
    // MODAL PRODUCTO
    // ========================================

    const modalProducto = $('#modalProducto');
    const formProducto = $('#formProducto');

    $('#nuevoProducto')?.addEventListener('click', function () {
        formProducto.reset();
        formProducto.elements.producto_id.value = '';

        $('#tituloModalProducto').textContent =
            'Nuevo producto';

        modalProducto.showModal();
    });

    formProducto?.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const formulario = new FormData(formProducto);

        const idActual = formulario.get('producto_id');

        const producto = {
            id: idActual || nuevoId(),
            nombre: String(formulario.get('nombre')).trim(),
            codigo: String(formulario.get('codigo')).trim(),
            categoria: String(formulario.get('categoria')).trim(),
            compra: Number(formulario.get('compra')),
            venta: Number(formulario.get('venta')),
            stock: Number(formulario.get('stock'))
        };

        if (
            !producto.nombre ||
            !producto.codigo ||
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

        const codigoDuplicado = datos.productos.some(
            existente =>
                existente.codigo.toLowerCase() ===
                    producto.codigo.toLowerCase() &&
                existente.id !== producto.id
        );

        if (codigoDuplicado) {
            mostrarMensaje(
                'Ya existe un producto con ese código.',
                true
            );
            return;
        }

        const posicion = datos.productos.findIndex(
            existente => existente.id === producto.id
        );

        if (posicion >= 0) {
            datos.productos[posicion] = producto;
        } else {
            datos.productos.push(producto);
        }

        guardarDatos();
        renderizarInventario();

        modalProducto.close();

        mostrarMensaje(
            'Producto guardado correctamente.'
        );
    });

    $('#filasInventario')?.addEventListener(
        'click',
        function (evento) {

            const editar = evento.target.closest('[data-editar]');
            const eliminar = evento.target.closest('[data-eliminar]');

            if (editar) {
                const producto = datos.productos.find(
                    item => item.id === editar.dataset.editar
                );

                if (!producto) return;

                formProducto.elements.producto_id.value =
                    producto.id;

                formProducto.elements.nombre.value =
                    producto.nombre;

                formProducto.elements.codigo.value =
                    producto.codigo;

                formProducto.elements.categoria.value =
                    producto.categoria;

                formProducto.elements.compra.value =
                    producto.compra;

                formProducto.elements.venta.value =
                    producto.venta;

                formProducto.elements.stock.value =
                    producto.stock;

                $('#tituloModalProducto').textContent =
                    'Editar producto';

                modalProducto.showModal();
            }

            if (eliminar) {
                const id = eliminar.dataset.eliminar;

                if (!confirm(
                    '¿Deseas eliminar este producto del inventario?'
                )) {
                    return;
                }

                datos.productos = datos.productos.filter(
                    producto => producto.id !== id
                );

                guardarDatos();
                renderizarInventario();

                mostrarMensaje(
                    'Producto eliminado del inventario.'
                );
            }
        }
    );

    // ========================================
    // VENTAS
    // ========================================

    const modalVenta = $('#modalVenta');
    const formVenta = $('#formVenta');

    $('#nuevaVenta')?.addEventListener('click', function () {
        const disponibles = datos.productos.filter(
            producto => producto.stock > 0
        );

        if (!disponibles.length) {
            mostrarMensaje(
                'Primero registra productos con stock disponible.',
                true
            );
            return;
        }

        const selector = $('#productoVenta');
        selector.innerHTML = '';

        disponibles.forEach(function (producto) {
            const opcion = document.createElement('option');

            opcion.value = producto.id;
            opcion.textContent =
                `${producto.nombre} - Stock: ${producto.stock}`;

            selector.appendChild(opcion);
        });

        formVenta.reset();
        formVenta.elements.fecha.value = fechaLocal();

        modalVenta.showModal();
    });

    formVenta?.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const formulario = new FormData(formVenta);

        const producto = datos.productos.find(
            item =>
                item.id === formulario.get('producto_id')
        );

        const cantidad = Number(
            formulario.get('cantidad')
        );

        const fecha = String(
            formulario.get('fecha') || ''
        );

        if (
            !producto ||
            !Number.isInteger(cantidad) ||
            cantidad <= 0 ||
            cantidad > producto.stock ||
            !/^\d{4}-\d{2}-\d{2}$/.test(fecha)
        ) {
            mostrarMensaje(
                'Verifica la cantidad, el producto y la fecha.',
                true
            );
            return;
        }

        const venta = {
            id: nuevoId(),
            fecha: fecha,
            producto_id: producto.id,
            producto: producto.nombre,
            cantidad: cantidad,
            precio_unitario: producto.venta,
            total: producto.venta * cantidad
        };

        producto.stock -= cantidad;

        datos.ventas.push(venta);

        guardarDatos();

        renderizarInventario();
        renderizarVentas();

        modalVenta.close();

        mostrarMensaje(
            'Venta registrada y stock actualizado correctamente.'
        );
    });

    function obtenerInicioSemana(fecha) {
        const resultado = new Date(
            fecha.getFullYear(),
            fecha.getMonth(),
            fecha.getDate()
        );

        const dia = (resultado.getDay() + 6) % 7;
        resultado.setDate(resultado.getDate() - dia);

        return resultado;
    }

    function renderizarVentas() {
        const cuerpo = $('#filasVentas');

        if (!cuerpo) return;

        cuerpo.innerHTML = '';

        const ventas = [...datos.ventas].sort(
            (a, b) => b.fecha.localeCompare(a.fecha)
        );

        ventas.forEach(function (venta) {
            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td>${textoSeguro(venta.fecha)}</td>
                <td>${textoSeguro(venta.producto)}</td>
                <td>${venta.cantidad}</td>
                <td>${formatoDinero.format(venta.total)}</td>
            `;

            cuerpo.appendChild(fila);
        });

        const hoy = fechaLocal();

        const fechaActual = new Date();
        const inicioSemana = obtenerInicioSemana(fechaActual);

        const semana = [
            inicioSemana.getFullYear(),
            String(inicioSemana.getMonth() + 1).padStart(2, '0'),
            String(inicioSemana.getDate()).padStart(2, '0')
        ].join('-');

        const mes = hoy.slice(0, 7);

        const totalHoy = ventas
            .filter(venta => venta.fecha === hoy)
            .reduce((suma, venta) => suma + venta.total, 0);

        const totalSemana = ventas
            .filter(
                venta =>
                    venta.fecha >= semana &&
                    venta.fecha <= hoy
            )
            .reduce((suma, venta) => suma + venta.total, 0);

        const totalMes = ventas
            .filter(
                venta => venta.fecha.slice(0, 7) === mes
            )
            .reduce((suma, venta) => suma + venta.total, 0);

        $('#ventasHoy').textContent =
            formatoDinero.format(totalHoy);

        $('#ventasSemana').textContent =
            formatoDinero.format(totalSemana);

        $('#ventasMes').textContent =
            formatoDinero.format(totalMes);

        $('#sinVentas').hidden = ventas.length > 0;
    }

    // ========================================
    // EXPORTACIÓN CSV
    // ========================================

    function exportarCSV(nombre, encabezados, filas) {
        function celda(valor) {
            let texto = String(valor ?? '');

            // Evitar interpretar contenido como fórmula
            // al abrir el archivo en una hoja de cálculo.
            if (/^[\s]*[=+\-@]/.test(texto)) {
                texto = "'" + texto;
            }

            return '"' + texto.replaceAll('"', '""') + '"';
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

        const enlace = document.createElement('a');
        const url = URL.createObjectURL(archivo);

        enlace.href = url;
        enlace.download = nombre;

        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();

        URL.revokeObjectURL(url);
    }

    $('#exportarInventario')?.addEventListener(
        'click',
        function () {
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

    $('#exportarVentas')?.addEventListener(
        'click',
        function () {
            exportarCSV(
                'ventas-impulsa-local.csv',
                [
                    'Fecha',
                    'Producto',
                    'Cantidad',
                    'Precio unitario',
                    'Total'
                ],
                datos.ventas.map(venta => [
                    venta.fecha,
                    venta.producto,
                    venta.cantidad,
                    venta.precio_unitario,
                    venta.total
                ])
            );
        }
    );

    // ========================================
    // CERRAR MODALES
    // ========================================

    $$('[data-cerrar]').forEach(function (boton) {
        boton.addEventListener('click', function () {
            const modal = document.getElementById(
                boton.dataset.cerrar
            );

            if (modal) {
                modal.close();
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

});
