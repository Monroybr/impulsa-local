
(function () {
    'use strict';

    // ==========================================
    // CONFIGURACIÓN GENERAL
    // ==========================================

    const CLAVE = 'impulsa-local-datos-v1';

    const ESTRUCTURA_INICIAL = {
        emprendedores: [],
        programas: [],
        inscripciones: [],
        reportesAvance: [],
        observacionesInstructor: [],
        seguimientosFuncionario: []
    };

    const COLECCIONES = Object.keys(ESTRUCTURA_INICIAL);

    // ==========================================
    // FUNCIONES AUXILIARES
    // ==========================================

    function copiar(valor) {
        return JSON.parse(JSON.stringify(valor));
    }

    function generarId() {
        if (
            typeof crypto !== 'undefined' &&
            typeof crypto.randomUUID === 'function'
        ) {
            return crypto.randomUUID();
        }

        return (
            Date.now().toString(36) +
            '-' +
            Math.random().toString(36).slice(2)
        );
    }

    function validarColeccion(nombre) {
        if (!COLECCIONES.includes(nombre)) {
            throw new Error(
                'Colección no válida: ' + nombre
            );
        }
    }

    // ==========================================
    // OBTENER TODOS LOS DATOS
    // ==========================================

    function obtenerDatos() {
        try {
            const texto = localStorage.getItem(CLAVE);

            if (!texto) {
                return copiar(ESTRUCTURA_INICIAL);
            }

            const almacenado = JSON.parse(texto);

            if (
                !almacenado ||
                typeof almacenado !== 'object' ||
                Array.isArray(almacenado)
            ) {
                return copiar(ESTRUCTURA_INICIAL);
            }

            const datos = copiar(ESTRUCTURA_INICIAL);

            for (const nombre of COLECCIONES) {
                if (Array.isArray(almacenado[nombre])) {
                    datos[nombre] = copiar(almacenado[nombre]);
                }
            }

            return datos;

        } catch (error) {
            console.error(
                'Error al leer los datos compartidos:',
                error
            );

            return copiar(ESTRUCTURA_INICIAL);
        }
    }

    // ==========================================
    // GUARDAR TODOS LOS DATOS
    // ==========================================

    function guardarDatos(nuevosDatos) {
        if (
            !nuevosDatos ||
            typeof nuevosDatos !== 'object' ||
            Array.isArray(nuevosDatos)
        ) {
            throw new Error(
                'Los datos deben ser un objeto válido.'
            );
        }

        const datos = copiar(ESTRUCTURA_INICIAL);

        for (const nombre of COLECCIONES) {
            datos[nombre] = Array.isArray(nuevosDatos[nombre])
                ? copiar(nuevosDatos[nombre])
                : [];
        }

        localStorage.setItem(
            CLAVE,
            JSON.stringify(datos)
        );

        // Notificar a componentes de la misma página.
        window.dispatchEvent(
            new CustomEvent('impulsa:actualizado', {
                detail: copiar(datos)
            })
        );

        return copiar(datos);
    }

    // ==========================================
    // OBTENER UNA COLECCIÓN
    // ==========================================

    function obtenerColeccion(nombre) {
        validarColeccion(nombre);

        const datos = obtenerDatos();

        return copiar(datos[nombre]);
    }

    // ==========================================
    // AGREGAR UN REGISTRO
    // ==========================================

    function agregarRegistro(nombre, registro) {
        validarColeccion(nombre);

        if (
            !registro ||
            typeof registro !== 'object' ||
            Array.isArray(registro)
        ) {
            throw new Error(
                'El registro debe ser un objeto válido.'
            );
        }

        const datos = obtenerDatos();

        const nuevoRegistro = {
            ...copiar(registro),
            id: registro.id || generarId()
        };

        const existe = datos[nombre].some(
            item =>
                String(item.id) ===
                String(nuevoRegistro.id)
        );

        if (existe) {
            throw new Error(
                'Ya existe un registro con ese ID.'
            );
        }

        datos[nombre].push(nuevoRegistro);

        guardarDatos(datos);

        return copiar(nuevoRegistro);
    }

    // ==========================================
    // ACTUALIZAR UN REGISTRO
    // ==========================================

    function actualizarRegistro(nombre, id, cambios) {
        validarColeccion(nombre);

        if (
            !cambios ||
            typeof cambios !== 'object' ||
            Array.isArray(cambios)
        ) {
            throw new Error(
                'Los cambios deben ser un objeto válido.'
            );
        }

        const datos = obtenerDatos();

        const indice = datos[nombre].findIndex(
            registro =>
                String(registro.id) === String(id)
        );

        if (indice === -1) {
            return false;
        }

        datos[nombre][indice] = {
            ...datos[nombre][indice],
            ...copiar(cambios),
            id: datos[nombre][indice].id
        };

        guardarDatos(datos);

        return true;
    }

    // ==========================================
    // ELIMINAR UN REGISTRO
    // ==========================================

    function eliminarRegistro(nombre, id) {
        validarColeccion(nombre);

        const datos = obtenerDatos();

        const cantidadAnterior = datos[nombre].length;

        datos[nombre] = datos[nombre].filter(
            registro =>
                String(registro.id) !== String(id)
        );

        if (datos[nombre].length === cantidadAnterior) {
            return false;
        }

        guardarDatos(datos);

        return true;
    }

    // ==========================================
    // CREAR O ACTUALIZAR UN REGISTRO
    // ==========================================

    function guardarRegistro(nombre, registro) {
        validarColeccion(nombre);

        if (
            !registro ||
            typeof registro !== 'object' ||
            Array.isArray(registro)
        ) {
            throw new Error(
                'El registro debe ser un objeto válido.'
            );
        }

        if (!registro.id) {
            return agregarRegistro(nombre, registro);
        }

        const datos = obtenerDatos();

        const indice = datos[nombre].findIndex(
            item =>
                String(item.id) === String(registro.id)
        );

        if (indice === -1) {
            return agregarRegistro(nombre, registro);
        }

        datos[nombre][indice] = {
            ...datos[nombre][indice],
            ...copiar(registro)
        };

        guardarDatos(datos);

        return copiar(datos[nombre][indice]);
    }

    // ==========================================
    // ESCUCHAR CAMBIOS ENTRE ROLES
    // ==========================================

    function escucharCambios(callback) {
        if (typeof callback !== 'function') {
            throw new Error(
                'Debes proporcionar una función.'
            );
        }

        // Cambios realizados en la misma pestaña.
        const cambioInterno = () => {
            callback(obtenerDatos());
        };

        // Cambios realizados desde otra pestaña
        // del mismo navegador y origen.
        const cambioExterno = evento => {
            if (evento.key === CLAVE) {
                callback(obtenerDatos());
            }
        };

        window.addEventListener(
            'impulsa:actualizado',
            cambioInterno
        );

        window.addEventListener(
            'storage',
            cambioExterno
        );

        // Permite dejar de escuchar si se necesita.
        return function dejarDeEscuchar() {
            window.removeEventListener(
                'impulsa:actualizado',
                cambioInterno
            );

            window.removeEventListener(
                'storage',
                cambioExterno
            );
        };
    }

    // ==========================================
    // CONSULTAS ÚTILES ENTRE ROLES
    // ==========================================

    function obtenerInscripcionesEmprendedor(
        emprendedorId
    ) {
        return obtenerColeccion('inscripciones')
            .filter(
                inscripcion =>
                    String(inscripcion.emprendedorId) ===
                    String(emprendedorId)
            );
    }

    function obtenerInscripcionesPrograma(programaId) {
        return obtenerColeccion('inscripciones')
            .filter(
                inscripcion =>
                    String(inscripcion.programaId) ===
                    String(programaId)
            );
    }

    function obtenerReportesEmprendedor(
        emprendedorId
    ) {
        return obtenerColeccion('reportesAvance')
            .filter(
                reporte =>
                    String(reporte.emprendedorId) ===
                    String(emprendedorId)
            );
    }

    function obtenerSeguimientosEmprendedor(
        emprendedorId
    ) {
        return obtenerColeccion(
            'seguimientosFuncionario'
        ).filter(
            seguimiento =>
                String(seguimiento.emprendedorId) ===
                String(emprendedorId)
        );
    }

    function obtenerObservacionesEmprendedor(
        emprendedorId
    ) {
        return obtenerColeccion(
            'observacionesInstructor'
        ).filter(
            observacion =>
                String(observacion.emprendedorId) ===
                String(emprendedorId)
        );
    }

    // ==========================================
    // DISPONIBILIDAD GLOBAL
    // ==========================================

    window.ImpulsaDatos = {
        obtenerDatos,
        guardarDatos,
        obtenerColeccion,
        agregarRegistro,
        actualizarRegistro,
        eliminarRegistro,
        guardarRegistro,
        escucharCambios,
        obtenerInscripcionesEmprendedor,
        obtenerInscripcionesPrograma,
        obtenerReportesEmprendedor,
        obtenerSeguimientosEmprendedor,
        obtenerObservacionesEmprendedor
    };

    console.log(
        'Impulsa Local: módulo de datos compartidos cargado.'
    );

})();
