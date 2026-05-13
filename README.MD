# 🌟 Lumera

**Plataforma de trazabilidad de donación de alimentos** — Conecta donadores, empresas y beneficiarios para gestionar y rastrear donaciones de alimentos de forma transparente y eficiente.

---

## 📋 Tabla de Contenidos

- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Roles del Sistema](#-roles-del-sistema)
- [Features](#-features)
- [Sistema de Diseño](#-sistema-de-diseño)
- [Requisitos Previos](#-requisitos-previos)
- [Cómo Correr el Proyecto](#-cómo-correr-el-proyecto)
- [Comandos Útiles](#-comandos-útiles)
- [Flujo de Trabajo Git](#-flujo-de-trabajo-git)
- [Variables de Entorno](#-variables-de-entorno)

---

## 🛠 Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| **React** | ^19.2.4 | Librería UI — componentes funcionales con hooks |
| **Vite** | ^8.0.0 | Bundler ultrarrápido con HMR |
| **TypeScript** | ~5.7.3 | Tipado estático en toda la app |
| **Tailwind CSS** | ^4.2.4 | Estilos utilitarios + @theme personalizado |
| **Firebase** | ^12.11.0 | Autenticación, Firestore (base de datos), Storage |
| **Lucide React** | ^1.14.0 | Iconos SVG modernos |
| **React Hot Toast** | ^2.5.2 | Notificaciones toast |

---

## 🏗 Arquitectura

El proyecto sigue una **arquitectura basada en features** con **clean architecture** en los módulos principales:

```
src/
├── config/            ← Configuración centralizada (Firebase, rutas)
├── features/          ← Módulos funcionales (cada feature es autocontenida)
│   ├── login/         ─── domain/ (entidades, repositorios, casos de uso)
│   │                  ─── data/   (datasources, implementaciones)
│   │                  ─── presentation/ (componentes, hooks, páginas)
│   ├── register/
│   ├── beneficiary/
│   ├── company-profile/
│   ├── traceability/
│   └── ...
├── services/          ← Servicios compartidos (Firebase, OpenFoodFacts)
└── App.jsx            ← Punto de entrada con navegación por estado
```

### Clean Architecture (por feature)

```
┌─────────────────────────────────────────┐
│  DOMAIN (capa más interna)              │
│  ├── entities/        ← Modelos de datos │
│  ├── repositories/    ← Contratos/abstracciones
│  └── usecases/        ← Lógica de negocio
├─────────────────────────────────────────┤
│  DATA (capa de implementación)          │
│  ├── datasources/     ← Comunicación con Firebase
│  └── repositories/    ← Implementación de contratos
├─────────────────────────────────────────┤
│  PRESENTATION (capa de UI)              │
│  ├── components/      ← Componentes React
│  ├── hooks/           ← Custom hooks
│  └── pages/           ← Páginas completas
└─────────────────────────────────────────┘
```

### Navegación

La navegación se maneja por **estado** en `App.jsx` (no usa React Router):

```jsx
const [appState, setAppState] = useState('loading');
// Estados: 'loading' | 'home' | 'login' | 'register' | 'password-recovery' | 'dashboard'
```

---

## 📁 Estructura del Proyecto

```
Lumera/
├── src/
│   ├── config/
│   │   ├── firebase.ts        ← Inicialización centralizada de Firebase
│   │   └── routes.ts          ← Configuración de roles y pantallas
│   │
│   ├── features/
│   │   ├── accounts/          ← Dashboards por rol
│   │   │   ├── dashboard/     ←   DonadorDashboard, EmpresaDashboard, BeneficiarioDashboard
│   │   │   ├── empresa/       ←   Módulo completo de empresa
│   │   │   └── pages/         ←   Perfiles, programar donación, trazabilidad
│   │   ├── addProducts/       ← Panel de agregar productos con código de barras
│   │   ├── beneficiary/       ← Feature completo: registro, solicitudes, tracking
│   │   ├── codeValidation/    ← Validación de donaciones por código único
│   │   ├── collectionPoints/  ← Puntos de acopio con mapa y filtros
│   │   ├── company-profile/   ← Perfil de empresa (verificación)
│   │   ├── dashboard/         ← Dashboard genérico
│   │   ├── home/              ← Landing page
│   │   ├── login/             ← Autenticación
│   │   ├── password-recovery/ ← Recuperación de contraseña
│   │   ├── profile/           ← Perfil de usuario
│   │   ├── register/          ← Registro de usuario
│   │   ├── rewards/           ← Sistema de recompensas
│   │   ├── traceability/      ← Trazabilidad de donaciones
│   │   └── user-activity/     ← Historial de actividad
│   │
│   ├── services/
│   │   ├── donationService.ts         ← CRUD de donaciones
│   │   ├── firebaseConnectionService.ts ← Validación de conexión Firebase
│   │   └── openFoodFactsService.js    ← Búsqueda de productos por código de barras
│   │
│   ├── App.jsx              ← Componente raíz con navegación por estado
│   ├── index.css            ← Tailwind @theme + estilos globales
│   └── features.ts          ← Barrel exports de todas las features
│
├── .env.example             ← Variables de entorno de ejemplo
├── index.html               ← HTML de entrada
├── vite.config.js           ← Configuración de Vite
├── tailwind.config.js       ← Configuración de Tailwind
├── tsconfig.json            ← Configuración de TypeScript
└── package.json             ← Dependencias y scripts
```

---

## 👥 Roles del Sistema

| Rol | Descripción | Dashboard |
|---|---|---|
| **Donador** 🫶 | Persona que realiza donaciones de alimentos | Vista con stats, crear donación, histórico |
| **Empresa** 🏢 | Empresa que participa en la red de donación | Módulo completo con sidebar, reportes, inventario |
| **Beneficiario** 🤝 | Organización/persona que recibe donaciones | Perfil, solicitudes, tracking en tiempo real |

Cada rol tiene su propio dashboard con navegación y funcionalidades específicas.

---

## ✨ Features

### ✅ Features con Clean Architecture

| Feature | Estado | Descripción |
|---|---|---|
| **Login** | ✅ Completo | Autenticación con email/password, hooks, formularios |
| **Register** | ✅ Completo | Registro con email/password |
| **Profile** | ✅ Completo | Perfil de usuario con CRUD |
| **Password Recovery** | ✅ Completo | Recuperación de contraseña |
| **Company Profile** | ✅ Completo | Perfil de empresa con verificación |
| **Traceability** | ✅ Completo | Trazabilidad con detalle de donaciones |
| **Dashboard** | ✅ Completo | Dashboard genérico |
| **User Activity** | ✅ Completo | Historial de actividad del usuario |
| **Collection Points** | ✅ En desarrollo | Puntos de acopio con mapa, búsqueda, filtros |
| **Beneficiary** | ✅ Nuevo | Feature completo: registro, verificación, solicitudes, tracking, historial |

### 🟡 Features Legacy

| Feature | Descripción |
|---|---|
| **Add Products** | Panel de agregar productos con búsqueda por código de barras |
| **Code Validation** | Validación de donaciones por código único |
| **Rewards** | Sistema de recompensas |
| **Delivery Time** | Tiempo de entrega con barra de progreso |
| **Legal Terms** | Términos legales para empresa y beneficiario |
| **Mini Market** | Mini tienda |
| **Delivery Points** | Puntos de entrega |
| **Donor Info** | Información del donador |

---

## 🎨 Sistema de Diseño

### Paleta Stitch Design (Tailwind CSS 4 `@theme`)

| Categoría | Variable | Hex | Uso |
|---|---|---|---|
| **Primario** | `--color-primary` | `#3525cd` | Botones principales, enlaces, acentos |
| **Primario contenedor** | `--color-primary-container` | `#4f46e5` | Hover, backgrounds secundarios |
| **Secundario** | `--color-secondary` | `#712ae2` | Acentos secundarios |
| **Error** | `--color-error` | `#ba1a1a` | Errores, validaciones |
| **Superficie** | `--color-surface` | `#faf8ff` | Fondos de tarjetas |
| **Texto** | `--color-on-surface` | `#131b2e` | Texto principal |
| **Texto variante** | `--color-on-surface-variant` | `#464555` | Texto secundario |
| **Borde** | `--color-outline` | `#777587` | Bordes |
| **Borde variante** | `--color-outline-variant` | `#c7c4d8` | Bordes suaves |
| **Acento Lumera** | `--color-accent` | `#F28C33` | Color naranja de marca |
| **Éxito** | `--color-success` | `#4CAF50` | Estados completados |

### Tipografía

| Escala | Tamaño | Peso | Uso |
|---|---|---|---|
| `text-h1` | 32px | 700 | Títulos principales |
| `text-h2` | 24px | 600 | Subtítulos |
| `text-h3` | 20px | 600 | Títulos de sección |
| `text-body-lg` | 18px | 400 | Cuerpo grande |
| `text-body-md` | 16px | 400 | Cuerpo normal |
| `text-label-sm` | 14px | 500 | Labels, badges |

**Fuente**: `Inter` (cargada desde Google Fonts)

### Animaciones

| Animación | Duración | Efecto |
|---|---|---|
| `animate-fade-in` | 0.25s | Opacidad + translateY(-8px) |
| `animate-slide-up` | 0.3s | Opacidad + translateY(16px) |

### Dark Mode

Soporte automático vía `@media (prefers-color-scheme: dark)`. En modo oscuro:
- Fondos cambian a tonos oscuros (`#0d1117` a `#30363d`)
- Texto cambia a claro (`#e6e6e6`)
- Bordes se atenúan (`#30363d`)

---

## 📋 Requisitos Previos

- **Node.js** >= 18
- **pnpm** (gestor de paquetes)

```bash
# Instalar pnpm globalmente si no lo tienes
npm install -g pnpm
```

---

## 🚀 Cómo Correr el Proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/Camigg023/Lumera.git
cd Lumera
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con las credenciales de tu proyecto Firebase:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 4. Iniciar servidor de desarrollo

```bash
pnpm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 📦 Comandos Útiles

| Comando | Descripción |
|---|---|
| `pnpm run dev` | Inicia servidor de desarrollo con HMR |
| `pnpm run build` | Genera build de producción en `dist/` |
| `pnpm run preview` | Previsualiza el build de producción |
| `pnpm run lint` | Ejecuta ESLint en todo el proyecto |
| `pnpm run typecheck` | Verifica tipos de TypeScript |
| `pnpm run format` | Formatea código con Prettier (si está configurado) |

---

## 🌿 Flujo de Trabajo Git

### Ramas

| Rama | Propósito |
|---|---|
| `main` | Producción |
| `develop` | Integración de features |
| `feat/*` | Nuevas funcionalidades |
| `fix/*` | Correcciones |
| `bugfix/*` | Bugs |

### Convención de commits

```
feat:     Nueva funcionalidad
fix:      Corrección de bug
refactor: Cambio de código que no agrega funcionalidad
style:    Cambios de estilo (CSS, formato)
docs:     Documentación
chore:    Tareas de mantenimiento (deps, config)
```

### Pull Requests

1. Crea una rama desde `develop`: `feat/mi-feature`
2. Desarrolla y commitea con mensajes descriptivos
3. Mantén tu rama actualizada con `develop`
4. Crea un PR hacia `develop` con descripción clara
5. El PR se mergea después de revisión y build exitoso

---

## 🔐 Variables de Entorno

| Variable | Descripción | Requerida |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | API Key de Firebase | ✅ |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth Domain | ✅ |
| `VITE_FIREBASE_PROJECT_ID` | ID del proyecto Firebase | ✅ |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage Bucket | ✅ |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID de mensajería | ✅ |
| `VITE_FIREBASE_APP_ID` | App ID de Firebase | ✅ |

---

## 🛠 Scripts Disponibles

```json
{
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "preview": "vite preview"
}
```

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Contribuidores

- [Camigg023](https://github.com/Camigg023) — Desarrollador principal
- [aleja9992](https://github.com/aleja9992) — Desarrollador

---

*Lumera — Trazabilidad que transforma vidas* 💚
