# Lumera

Este proyecto está construido con React y Vite, y utiliza Firebase Firestore como base de datos.

## Arquitectura del Proyecto

La estructura del proyecto está organizada para separar las responsabilidades, mantener el código limpio y facilitar su escalabilidad:

- **`src/assets/`**: Contiene los recursos visuales y estáticos como imágenes o íconos.
- **`src/config/`**: Archivos de configuración general o integraciones externas del sistema. Destaca `firebase.ts` donde se inicializa la conexión con Firebase de forma centralizada.
- **`src/services/`**: Concentra la capa de acceso a datos y comunicación con Firebase. Por ejemplo, `db.ts` incluye las funciones para realizar las operaciones CRUD (crear, leer, actualizar, borrar) en Firestore.
- **Componentes React**: El punto de entrada se encuentra en `main.jsx` junto al componente raíz de la UI `App.jsx`.
- **Raíz del proyecto**: Destacan los archivos `.env` y `.env.example` para gestionar las variables de entorno sin exponer credenciales directamente en el código fuente.

## Paleta de Colores

El proyecto utiliza una paleta de colores unificada que refleja la identidad visual de LUMERA. Los colores principales y su uso son:

| Color | Código HEX | RGB | Uso |
|-------|------------|-----|-----|
| **Naranja principal (Brand)** | `#F28C33` | `rgb(242, 140, 51)` | Sidebars, gradientes, hover de botones |
| **Naranja acción (Buttons)** | `#FF8000` | `rgb(255, 128, 0)` | Botones principales (Login, Registro, Recuperación) |
| **Naranja suave (Card headers)** | `#F8B486` | `rgb(248, 180, 134)` | Títulos de tarjetas, cajón (crate) en páginas de autenticación |
| **Texto oscuro** | `#2D2D2D` | `rgb(45, 45, 45)` | Títulos, labels, texto principal |
| **Texto gris** | `#666666` | `rgb(102, 102, 102)` | Subtítulos, enlaces, placeholders |
| **Bordes/líneas** | `#D9D9D9` | `rgb(217, 217, 217)` | Inputs, selects, separadores |
| **Éxito (Success)** | `#4CAF50` | `rgb(76, 175, 80)` | Estados completados, etiquetas de verificación |
| **Error** | `#E53935` | `rgb(229, 57, 53)` | Mensajes de error, validaciones |
| **Fondo claro** | `#F9F9F9` | `rgb(249, 249, 249)` | Fondos de página, áreas secundarias |
| **Fondo blanco** | `#FFFFFF` | `rgb(255, 255, 255)` | Fondos de formularios, tarjetas |

### Variables CSS

La paleta está definida en las variables CSS globales (`src/index.css`) y en los módulos de cada componente. Los colores de acento, texto y bordes se han actualizado para mantener consistencia en modo claro y oscuro.

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
   La aplicación se podrá visualizar desde tu navegador abriendo [ñ](http://localhost:5173).

## Otros Comandos Útiles

- `npm run build`: Genera el código optimizado para producción dentro de la carpeta `dist`.
- `npm run preview`: Permite pre-visualizar el código de producción generado a nivel local.
- `npm run lint`: Ejecuta auditoría de código con las reglas definidas en ESLint.
