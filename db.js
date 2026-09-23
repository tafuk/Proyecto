// db.js - Capa de datos local (localStorage) del sistema Parqueadero Reyes Sánchez
// No hay backend todavía (ver README), así que mientras tanto los formularios
// guardan aquí y los listados leen de aquí. Cuando exista una API real, basta
// con reemplazar las funciones de este archivo por llamadas fetch().

const DB = (() => {
    const KEYS = {
        usuarios: "rs_usuarios",
        clientes: "rs_clientes",
        vehiculos: "rs_vehiculos",
        entradas: "rs_entradas",
        salidas: "rs_salidas",
        seed: "rs_seed_v1",
    };

    // Tarifa por hora según tipo de vehículo (COP). Ajustar a los precios reales.
    const TARIFAS = {
        moto: 1000,
        carro: 2000,
        turbop: 2500,
        turbog: 3500,
        camion: 4000,
        camioneta: 3000,
        buseta: 3500,
    };

    const ETIQUETAS_VEHICULO = {
        moto: "Moto",
        carro: "Carro",
        turbop: "Turbo pequeña",
        turbog: "Turbo grande",
        camion: "Camión",
        camioneta: "Camioneta",
        buseta: "Buseta",
    };

    function leer(key) {
        try {
            const datos = JSON.parse(localStorage.getItem(key));
            return Array.isArray(datos) ? datos : [];
        } catch (e) {
            return [];
        }
    }

    function guardar(key, arr) {
        localStorage.setItem(key, JSON.stringify(arr));
    }

    function generarId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    function agregar(key, objeto) {
        const arr = leer(key);
        const registro = { id: generarId(), fecha: new Date().toISOString(), ...objeto };
        arr.unshift(registro);
        guardar(key, arr);
        return registro;
    }

    function actualizar(key, id, cambios) {
        const arr = leer(key).map((item) => (item.id === id ? { ...item, ...cambios } : item));
        guardar(key, arr);
    }

    function eliminar(key, id) {
        guardar(key, leer(key).filter((item) => item.id !== id));
    }

    function obtenerPorId(key, id) {
        return leer(key).find((item) => item.id === id) || null;
    }

    // ---- Reglas específicas del negocio ----

    function entradaActivaPorPlaca(placa) {
        const p = (placa || "").trim().toUpperCase();
        return leer(KEYS.entradas).find((e) => e.placa === p && e.estado === "activo") || null;
    }

    function calcularCobro(tipoVehiculo, horaEntradaISO, horaSalidaISO) {
        const inicio = new Date(horaEntradaISO).getTime();
        const fin = new Date(horaSalidaISO).getTime();
        const minutos = Math.max(1, Math.round((fin - inicio) / 60000));
        const horasCobradas = Math.max(1, Math.ceil(minutos / 60));
        const tarifa = TARIFAS[tipoVehiculo] ?? 2000;
        const total = horasCobradas * tarifa;
        return { minutos, horasCobradas, total };
    }

    function formatearDuracion(minutos) {
        const h = Math.floor(minutos / 60);
        const m = minutos % 60;
        if (h <= 0) return `${m} min`;
        return `${h} h ${m} min`;
    }

    function formatearFecha(iso) {
        if (!iso) return "—";
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        return d.toLocaleString("es-CO", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function formatearMoneda(valor) {
        return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(valor || 0);
    }

    // ---- Datos de demostración ----
    // Solo se crean la primera vez que se abre el sitio en el navegador, para
    // que los listados del menú hamburguesa no se vean vacíos. El usuario
    // puede seguir registrando datos reales normalmente.
    function sembrarDatosDemo() {
        if (localStorage.getItem(KEYS.seed)) return;

        const ahora = Date.now();
        const haceMin = (min) => new Date(ahora - min * 60000).toISOString();

        guardar(KEYS.usuarios, [
            { id: generarId(), nombre: "Laura", apellido: "Gómez", iden: "1020304050", rol: "admin", fecha: haceMin(60 * 24 * 3) },
            { id: generarId(), nombre: "Carlos", apellido: "Reyes", iden: "1030405060", rol: "empleado", fecha: haceMin(60 * 24) },
        ]);

        guardar(KEYS.clientes, [
            { id: generarId(), Nomcli: "María Sánchez", telefono: "3001234567", fecha: haceMin(60 * 24 * 5) },
            { id: generarId(), Nomcli: "Andrés Torres", telefono: "3109876543", fecha: haceMin(60 * 24 * 2) },
        ]);

        guardar(KEYS.vehiculos, [
            { id: generarId(), placa: "ABC123", tipo: "carro", marca: "Chevrolet", color: "Blanco", fecha: haceMin(60 * 24 * 5) },
            { id: generarId(), placa: "XYZ987", tipo: "moto", marca: "Yamaha", color: "Negro", fecha: haceMin(60 * 24 * 2) },
            { id: generarId(), placa: "TUR456", tipo: "camioneta", marca: "Toyota", color: "Gris", fecha: haceMin(60 * 10) },
        ]);

        const entradaActiva1 = { id: generarId(), placa: "ABC123", tipo: "carro", horaEntrada: haceMin(95), estado: "activo" };
        const entradaActiva2 = { id: generarId(), placa: "TUR456", tipo: "camioneta", horaEntrada: haceMin(40), estado: "activo" };
        const entradaFinalizada = { id: generarId(), placa: "XYZ987", tipo: "moto", horaEntrada: haceMin(60 * 5), estado: "finalizado" };
        guardar(KEYS.entradas, [entradaActiva1, entradaActiva2, entradaFinalizada]);

        const salidaHora = haceMin(60 * 4);
        const cobro = calcularCobro("moto", entradaFinalizada.horaEntrada, salidaHora);
        guardar(KEYS.salidas, [
            {
                id: generarId(),
                entradaId: entradaFinalizada.id,
                placa: "XYZ987",
                tipo: "moto",
                horaEntrada: entradaFinalizada.horaEntrada,
                horaSalida: salidaHora,
                minutos: cobro.minutos,
                total: cobro.total,
                metodoPago: "efectivo",
                fecha: salidaHora,
            },
        ]);

        localStorage.setItem(KEYS.seed, "1");
    }

    return {
        KEYS,
        TARIFAS,
        ETIQUETAS_VEHICULO,
        leer,
        guardar,
        agregar,
        actualizar,
        eliminar,
        obtenerPorId,
        entradaActivaPorPlaca,
        calcularCobro,
        formatearDuracion,
        formatearFecha,
        formatearMoneda,
        sembrarDatosDemo,
    };
})();

document.addEventListener("DOMContentLoaded", () => DB.sembrarDatosDemo());
