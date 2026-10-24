
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    const usuario = window.IMPULSA_USUARIO;

    if (!usuario || !usuario.id) return;

    const clave = `impulsa-programas-${usuario.id}-v1`;

    const programas = [
        {
            id: 1,
            nombre: 'Plan de Negocios desde Cero',
            tematica: 'Administración',
            descripcion: 'Aprende a estructurar un plan de negocios para tu emprendimiento.',
            instructor: 'Carlos Rodríguez',
            duracion: '20 horas',
            cupos: 25,
            estado: 'activo'
        },
        {
            id: 2,
            nombre: 'Marketing Digital para Emprendedores',
            tematica: 'Marketing',
            descripcion: 'Conoce estrategias para promocionar tus productos en internet.',
            instructor: 'Ana Martínez',
            duracion: '16 horas',
            cupos: 30,
            estado: 'activo'
        },
        {
            id: 3,
            nombre: 'Finanzas para No Financieros',
            tematica: 'Finanzas',
            descripcion: 'Aprende a controlar los costos, ingresos y gastos de tu negocio.',
            instructor: 'Pedro Gómez',
            duracion: '24 horas',
            cupos: 20,
            estado: 'activo'
        },
        {
            id: 4,
            nombre: 'Liderazgo y Gestión de Equipos',
            tematica: 'Administración',
            descripcion: 'Fortalece tus habilidades de liderazgo y trabajo en equipo.',
            instructor: 'Laura Fernández',
            duracion: '12 horas',
            cupos: 18,
            estado: 'activo'
        },
        {
            id: 5,
            nombre: 'E-commerce: Vende en Línea',
            tematica: 'Marketing',
            descripcion: 'Aprende a utilizar canales digitales para vender tus productos.',
            instructor: 'Diego Ramírez',
            duracion: '18 horas',
            cupos: 22,
            estado: 'activo'
        },
        {
            id: 6,
            nombre: 'Atención al Cliente y Fidelización',
            tematica: 'Servicio al cliente',
            descripcion: 'Mejora la experiencia de tus clientes y fortalece su fidelidad.',
            instructor: 'María López',
            duracion: '10 horas',
            cupos: 0,
            estado: 'finalizado'
        }
    ];

    function cargarInscripciones() {
        try {
            const datos = JSON.parse(localStorage.getItem(clave));
            return Array.isArray(datos) ? datos : [];
        } catch {
            return [];
        }
    }

    let inscripciones = cargarInscripciones();

    function guardarInscripciones() {
        try {
            localStorage.setItem(clave, JSON.stringify(inscripciones));
            return true;
        } catch {
            alert('No fue posible guardar la inscripción en este navegador.');
            return false;
        }
    }

    function escapar(valor) {
        return String(valor ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    function fechaActual() {
        const fecha = new Date();
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        return `${año}-${mes}-${dia}`;
    }

    function obtenerPrograma(id) {
        return programas.find(p => p.id === Number(id));
    }

    function porcentaje(valor) {
        return Math.max(0, Math.min(100, Number(valor) || 0));
    }

    function crearTarjeta(programa) {
        const inscrito = inscripciones.some(i => i.programaId === programa.id);
        const disponible = programa.estado === 'activo' && programa.cupos > 0;

        const textoBoton = inscrito
            ? 'Ya estás inscrito/a'
            : disponible ? 'Inscribirme' : 'No disponible';

        return `
            <article class="programa tarjeta">
                <div class="cabecera-bloque">
                    <h3>${escapar(programa.nombre)}</h3>
                    <span class="estado ${disponible ? 'activo' : 'finalizado'}">
                        ${disponible ? 'Activo' : 'Finalizado'}
                    </span>
                </div>

                <span class="tematica">${escapar(programa.tematica)}</span>

                <p>${escapar(programa.descripcion)}</p>

                <div class="fila">
                    <span>Instructor</span>
                    <strong>${escapar(programa.instructor)}</strong>
                </div>

                <div class="fila">
                    <span>Duración</span>
                    <strong>${escapar(programa.duracion)}</strong>
                </div>

                <div class="fila">
                    <span>Cupos</span>
                    <strong>${programa.cupos}</strong>
                </div>

                <button
                    type="button"
                    class="btn primario btn-ancho"
                    data-inscribir="${programa.id}"
                    ${inscrito || !disponible ? 'disabled' : ''}
                >
                    ${textoBoton}
                </button>
            </article>
        `;
    }

    function renderizarCatalogo() {
        const contenedor = document.getElementById('catalogoProgramas');
        if (!contenedor) return;

        const tematica = document.getElementById('filtroTematica')?.value || '';
        const estado = document.getElementById('filtroEstado')?.value || '';

        const filtrados = programas.filter(programa => {
            const cumpleTematica = !tematica || programa.tematica === tematica;
            const cumpleEstado = !estado || programa.estado === estado;
            return cumpleTematica && cumpleEstado;
        });

        contenedor.innerHTML = filtrados.length
            ? filtrados.map(crearTarjeta).join('')
            : '<p class="il-vacio">No hay programas para estos filtros.</p>';
    }

    function renderizarInscripciones() {
        const contenedor = document.getElementById('inscripciones');
        if (!contenedor) return;

        if (!inscripciones.length) {
            contenedor.innerHTML = `
                <p class="il-vacio">
                    Todavía no tienes inscripciones de demostración.
                    Explora los programas disponibles para comenzar.
                </p>
            `;
            return;
        }

        contenedor.innerHTML = inscripciones.map(inscripcion => {
            const programa = obtenerPrograma(inscripcion.programaId);
            if (!programa) return '';

            const avance = porcentaje(inscripcion.progreso);
            const completado = avance === 100;

            return `
                <div class="inscripcion">
                    <div class="inscripcion-info">
                        <strong>${escapar(programa.nombre)}</strong>
                        <small>
                            ${escapar(programa.tematica)} ·
                            ${escapar(programa.duracion)}
                        </small>
                    </div>

                    <div class="progreso-inline">
                        <div class="barra">
                            <div class="relleno" style="width:${avance}%"></div>
                        </div>
                        <strong>${avance}%</strong>
                    </div>

                    <span class="estado ${completado ? 'completado' : 'curso'}">
                        ${completado ? 'Completado' : 'En curso'}
                    </span>
                </div>
            `;
        }).join('');
    }

    function renderizarProgreso() {
        const contenedor = document.getElementById('detalleProgreso');
        if (!contenedor) return;

        if (!inscripciones.length) {
            contenedor.innerHTML = `
                <p class="il-vacio">
                    Todavía no tienes programas inscritos en esta demostración.
                </p>
            `;
            return;
        }

        contenedor.innerHTML = inscripciones.map(inscripcion => {
            const programa = obtenerPrograma(inscripcion.programaId);
            if (!programa) return '';

            const avance = porcentaje(inscripcion.progreso);

            return `
                <div class="detalle">
                    <div class="cabecera-bloque">
                        <strong>${escapar(programa.nombre)}</strong>
                        <span class="estado ${avance === 100 ? 'completado' : 'curso'}">
                            ${avance === 100 ? 'Completado' : 'En curso'}
                        </span>
                    </div>

                    <div class="progreso-inline">
                        <div class="barra">
                            <div class="relleno" style="width:${avance}%"></div>
                        </div>
                        <strong>${avance}%</strong>
                    </div>

                    <small>
                        Inscripción: ${escapar(inscripcion.fecha)}
                    </small>

                    <div class="il-botones">
                        <button
                            type="button"
                            class="btn secundario"
                            data-avanzar="${programa.id}"
                            ${avance === 100 ? 'disabled' : ''}
                        >
                            ${avance === 100 ? 'Finalizado' : 'Simular avance +25%'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderizarTodo() {
        renderizarCatalogo();
        renderizarInscripciones();
        renderizarProgreso();

        const titulo = document.getElementById('tituloInscripciones');
        if (titulo) {
            titulo.textContent = `Mis inscripciones (${inscripciones.length})`;
        }
    }

    function prepararInterfaz() {
        const seccionProgramas = document.getElementById('vista-programas');
        const seccionProgreso = document.getElementById('vista-progreso');

        if (!seccionProgramas || !seccionProgreso) return;

        seccionProgramas.innerHTML = `
            <div class="il-tarjeta bloque">
                <h2 id="tituloInscripciones">Mis inscripciones (0)</h2>
                <p class="nota-demostracion">
                    Inscripciones de demostración guardadas en este navegador.
                </p>
                <div id="inscripciones"></div>
            </div>

            <div class="filtros">
                <h3>Programas disponibles</h3>

                <select id="filtroTematica" aria-label="Filtrar por temática">
                    <option value="">Todas las temáticas</option>
                    <option value="Administración">Administración</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finanzas">Finanzas</option>
                    <option value="Servicio al cliente">Servicio al cliente</option>
                </select>

                <select id="filtroEstado" aria-label="Filtrar por estado">
                    <option value="">Todos los estados</option>
                    <option value="activo">Activos</option>
                    <option value="finalizado">Finalizados</option>
                </select>
            </div>

            <div id="catalogoProgramas" class="cuadricula"></div>
        `;

        seccionProgreso.innerHTML = `
            <div class="columna-central">
                <div class="il-tarjeta bloque">
                    <h2>Mi progreso en programas</h2>
                    <p class="nota-demostracion">
                        El avance mostrado es una simulación, no una evaluación del instructor.
                    </p>
                    <div id="detalleProgreso"></div>
                </div>

                <div class="il-tarjeta bloque">
                    <h2>Mis seguimientos</h2>
                    <div id="seguimientos">
                        <p class="il-vacio">
                            No tienes seguimientos registrados.
                            Los seguimientos oficiales requieren conexión con la base de datos.
                        </p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('filtroTematica')
            ?.addEventListener('change', renderizarCatalogo);

        document.getElementById('filtroEstado')
            ?.addEventListener('change', renderizarCatalogo);
    }

    document.addEventListener('click', function (evento) {
        const botonInscribir = evento.target.closest('[data-inscribir]');

        if (botonInscribir) {
            const id = Number(botonInscribir.dataset.inscribir);
            const programa = obtenerPrograma(id);

            if (!programa ||
                programa.estado !== 'activo' ||
                programa.cupos <= 0 ||
                inscripciones.some(i => i.programaId === id)) {
                return;
            }

            const anterior = [...inscripciones];

            inscripciones.push({
                programaId: id,
                fecha: fechaActual(),
                progreso: 0
            });

            if (!guardarInscripciones()) {
                inscripciones = anterior;
                return;
            }

            renderizarTodo();
            return;
        }

        const botonAvanzar = evento.target.closest('[data-avanzar]');

        if (botonAvanzar) {
            const id = Number(botonAvanzar.dataset.avanzar);
            const inscripcion = inscripciones.find(i => i.programaId === id);

            if (!inscripcion) return;

            const anterior = inscripcion.progreso;
            inscripcion.progreso = Math.min(100, porcentaje(anterior) + 25);

            if (!guardarInscripciones()) {
                inscripcion.progreso = anterior;
                return;
            }

            renderizarTodo();
        }
    });

    prepararInterfaz();
    renderizarTodo();
});
