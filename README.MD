# Lumera

Este proyecto está construido con React y Vite, y utiliza Firebase Firestore como base de datos.

## Arquitectura del Proyecto

La estructura del proyecto está organizada para separar las responsabilidades, mantener el código limpio y facilitar su escalabilidad:

- **`src/assets/`**: Contiene los recursos visuales y estáticos como imágenes o íconos.
- **`src/config/`**: Archivos de configuración general o integraciones externas del sistema. Destaca `firebase.ts` donde se inicializa la conexión con Firebase de forma centralizada.
- **`src/services/`**: Concentra la capa de acceso a datos y comunicación con Firebase. Por ejemplo, `db.ts` incluye las funciones para realizar las operaciones CRUD (crear, leer, actualizar, borrar) en Firestore.
- **Componentes React**: El punto de entrada se encuentra en `main.jsx` junto al componente raíz de la UI `App.jsx`.
- **Raíz del proyecto**: Destacan los archivos `.env` y `.env.example` para gestionar las variables de entorno sin exponer credenciales directamente en el código fuente.

## Requisitos Previos

- Tener instalado [Node.js](https://nodejs.org/).

## Cómo Correr el Proyecto (Modo Desarrollo)

Sigue estos pasos para levantar el servidor de desarrollo en tu máquina local:

1. **Instalar las dependencias**
   Dentro de la carpeta raíz del proyecto (`Lumera`), ejecuta:

   ```bash
   npm install
   ```

2. **Configurar las variables de entorno**
   Haz una copia del archivo `.env.example` y renómbrala a `.env`:

   ```bash
   cp .env.example .env
   ```

   Luego, rellena los valores faltantes en el archivo `.env` con las credenciales correctas de tu entorno en Firebase (API Key, Auth Domain, etc.).

3. **Ejecutar el servidor local**
   Inicia la aplicación en modo desarrollo (HMR habilitado):
   ```bash
   npm run dev
   ```
   La aplicación se podrá visualizar desde tu navegador abriendo [http://localhost:5173](http://localhost:5173).

## Otros Comandos Útiles

- `npm run build`: Genera el código optimizado para producción dentro de la carpeta `dist`.
- `npm run preview`: Permite pre-visualizar el código de producción generado a nivel local.
- `npm run lint`: Ejecuta auditoría de código con las reglas definidas en ESLint.
