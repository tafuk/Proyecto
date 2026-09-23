// script.js - lógica general del sistema Parqueadero Reyes Sánchez

document.addEventListener("DOMContentLoaded", () => {
    marcarEnlaceActivo();
    cerrarMenuAlNavegar();
    configurarCierreSesion();
    escribirAnioFooter();
    mostrarBannerPorParametro();
});

// Resalta en la barra de navegación la página en la que estamos.
function marcarEnlaceActivo() {
    const pagina = window.location.pathname.split("/").pop() || "menu.html";
    document.querySelectorAll(".navbar-parqueadero .nav-link").forEach((enlace) => {
        const destino = enlace.getAttribute("href");
        if (destino === pagina) {
            enlace.classList.add("active");
            enlace.setAttribute("aria-current", "page");
        }
    });
}

// En móvil, al tocar una opción del menú hamburguesa, este debe cerrarse.
function cerrarMenuAlNavegar() {
    const menu = document.getElementById("menuNav");
    if (!menu || typeof bootstrap === "undefined") return;

    menu.querySelectorAll(".nav-link").forEach((enlace) => {
        enlace.addEventListener("click", () => {
            const instancia = bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false });
            instancia.hide();
        });
    });
}

function configurarCierreSesion() {
    const cerrarSesion = document.getElementById("cerrarSesion");
    if (!cerrarSesion) return;

    cerrarSesion.addEventListener("click", (evento) => {
        evento.preventDefault();
        const confirmado = window.confirm("¿Seguro que deseas cerrar la sesión?");
        if (confirmado) {
            window.location.href = cerrarSesion.getAttribute("href") || "../index.html";
        }
    });
}

function escribirAnioFooter() {
    const span = document.getElementById("footerYear");
    if (span) span.textContent = new Date().getFullYear();
}

// Los formularios redirigen a su listado con ?ok=mensaje tras guardar;
// aquí se muestra ese mensaje como un banner y se limpia la URL.
function mostrarBannerPorParametro() {
    const params = new URLSearchParams(window.location.search);
    const mensaje = params.get("ok");
    if (!mensaje) return;

    const contenedor = document.querySelector(".contenido-pagina") || document.querySelector("main") || document.body;
    const banner = document.createElement("div");
    banner.className = "banner-exito";
    banner.setAttribute("role", "status");
    banner.innerHTML = `<span>✔</span> ${mensaje}`;
    contenedor.prepend(banner);

    setTimeout(() => banner.remove(), 4000);

    params.delete("ok");
    const nuevaUrl = window.location.pathname + (params.toString() ? `?${params}` : "");
    window.history.replaceState({}, "", nuevaUrl);
}

// Utilidad reutilizada por los formularios para ir al listado con mensaje.
function irAListado(pagina, mensaje) {
    window.location.href = `${pagina}?ok=${encodeURIComponent(mensaje)}`;
}
