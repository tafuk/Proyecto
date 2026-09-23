# Parqueadero Reyes Sánchez (RS Parking)

Sistema web de gestión de entrada/salida de vehículos para el parqueadero
Reyes Sánchez.

## Estructura del proyecto

```
parqueadero_RS/
├── index.html                    # Login
├── css/
│   ├── estilos.css               # Base visual: header, nav, footer, botones, tarjetas
│   ├── formularios.css           # Formularios y pantallas de acceso
│   └── tablas.css                # Listados de registros
├── js/
│   ├── db.js                     # Capa de datos en localStorage (mientras no hay backend)
│   └── script.js                 # Menú activo, cerrar sesión, banners de confirmación
├── img/
│   └── LOGO.jpeg
└── pages/
    ├── registro.html             # Crear cuenta
    ├── menu.html                 # Panel principal tras iniciar sesión
    ├── registro_usuario.html     # Formulario: registrar usuario del sistema
    ├── registro_cliente.html     # Formulario: registrar cliente
    ├── registro_vehiculo.html    # Formulario: registrar vehículo
    ├── registro_entrada.html     # Formulario: registrar entrada de vehículo
    ├── registro_salida.html      # Formulario: registrar salida y calcular pago
    ├── listado_usuarios.html     # Listado de usuarios registrados
    ├── listado_clientes.html     # Listado de clientes registrados
    ├── listado_vehiculos.html    # Listado de vehículos registrados
    ├── listado_entradas.html     # Vehículos en el parqueadero + historial de entradas
    └── listado_salidas.html      # Historial de salidas y pagos
```

## Navegación

- Las **tarjetas de la pantalla de inicio** (`menu.html`) llevan a los
  formularios para **crear** un nuevo registro (usuario, cliente, vehículo,
  entrada, salida).
- El **menú hamburguesa** (barra superior, visible en todas las páginas
  internas) lleva a los **listados** con los registros ya guardados
  (Usuarios, Clientes, Vehículos, Entradas, Salidas); ya no vuelve a abrir
  el formulario.
- Desde cada formulario hay un enlace directo a su listado correspondiente,
  y desde `listado_entradas.html` se puede pasar directo a registrar la
  salida de un vehículo activo (la placa queda precargada).

## Estado actual

- [x] Maquetación y estilo unificado de login, registro de cuenta, menú
      principal, formularios y listados (todo usa `css/estilos.css`,
      `css/formularios.css` y `css/tablas.css`; ya no depende de la
      plantilla bs-brain).
- [x] Footer con datos de contacto y accesos rápidos en todas las páginas
      internas; footer simple en las pantallas de acceso.
- [x] Persistencia local con `localStorage` (`js/db.js`): los 5 formularios
      guardan sus datos y los listados los muestran, permiten buscar y
      eliminar. Se generan datos de ejemplo la primera vez que se abre el
      sitio para que los listados no se vean vacíos.
- [x] El formulario de salida busca automáticamente la entrada activa de
      una placa y calcula tiempo y total a pagar según el tipo de vehículo.
- [ ] Backend / API real (por ahora todo vive en `localStorage` del
      navegador; los datos no se comparten entre dispositivos ni usuarios)
- [ ] Autenticación real (por ahora el login solo redirige, no valida
      usuario/contraseña contra una base de datos)
- [ ] Roles y permisos reales por tipo de usuario (admin/empleado)

## Notas de esta actualización

- Se agregó un footer consistente (`.site-footer`) a todas las páginas
  internas, con logo, accesos rápidos, datos de contacto y año dinámico;
  y una versión simple (`.site-footer-auth`) para login y registro de
  cuenta.
- El menú hamburguesa ahora apunta a páginas de **listado** en lugar de
  volver a abrir el formulario de creación, tal como se pidió.
- Se creó `js/db.js` como capa de datos temporal en `localStorage`
  (usuarios, clientes, vehículos, entradas, salidas) para que los listados
  tengan contenido real mientras no existe backend. Cuando se conecte una
  API, basta con reemplazar las funciones de `db.js` por llamadas `fetch`.
- Se rehicieron `css/estilos.css` y `css/formularios.css`, y se agregó
  `css/tablas.css`, unificando colores, botones, formularios y tablas
  (incluida una vista en tarjetas para las tablas en pantallas angostas).
- `registro_vehiculo.html` ya no depende de la plantilla bs-brain (se quitó
  el footer de relleno con enlaces falsos y el logo roto
  `./assets/img/bsb-logo-light.svg`); ahora usa el mismo layout y footer
  que el resto de formularios.

## Tarifas de ejemplo

Las tarifas por hora usadas para calcular el pago en `registro_salida.html`
están en `js/db.js` (objeto `TARIFAS`) y son solo valores de referencia:
ajústalas a los precios reales del parqueadero.
