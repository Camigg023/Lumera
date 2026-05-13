# 🎨 Sistema de Diseño — Lumera

```
Versión: 1.0.0
Estado: alpha
Plataforma: Trazabilidad de donación de alimentos
Stack: React 19 · TypeScript · Tailwind CSS 4 · Firebase
```

---

## Índice

1. [Filosofía de Diseño](#-filosofía-de-diseño)
2. [Colores](#-colores)
3. [Tipografía](#-tipografía)
4. [Layout y Espaciado](#-layout-y-espaciado)
5. [Elevación y Sombras](#-elevación-y-sombras)
6. [Formas y Bordes](#-formas-y-bordes)
7. [Componentes](#-componentes)
8. [Iconografía](#-iconografía)
9. [Animaciones](#-animaciones)
10. [Dark Mode](#-dark-mode)
11. [Responsive](#-responsive)
12. [Directrices de Marca](#-directrices-de-marca)
13. [Glosario de Clases Tailwind](#-glosario-de-clases-tailwind)
14. [Do's and Don'ts](#-dos-and-donts)

---

## 🌟 Filosofía de Diseño

Lumera es una plataforma de **trazabilidad de donación de alimentos** que conecta donadores, empresas y beneficiarios. Su diseño debe transmitir:

- **Confianza y transparencia**: Colores sólidos, tipografía clara, espacios generosos.
- **Calidez humana**: El naranja Lumera (`#F28C33`) es el ancla emocional — un tono cálido, terrestre, que evoca alimento, sol y comunidad.
- **Eficiencia operativa**: Componentes funcionales, mobile-first (uso en campo), navegación por roles.
- **Claridad visual**: La información crítica (estados de donación, códigos de verificación, trazabilidad) debe ser escaneable de un vistazo.

### Personalidad de Marca

| Atributo | Manifestación Visual |
|---|---|
| **Cálido** | Naranja Lumera como color primario de marca |
| **Confiable** | Azul primario Stitch (`#3525cd`) como color de acción principal |
| **Humano** | Tipografía sans-serif humanista (Inter), esquinas redondeadas suaves |
| **Claro** | Alto contraste, jerarquía tipográfica definida, espaciado generoso |
| **Ético** | Verde éxito (`#4CAF50`) para confirmaciones de trazabilidad y donaciones completadas |

### Paleta de Marca (Lumera)

| Color | Hex | Rol |
|---|---|---|
| 🟠 Naranja Lumera | `#F28C33` | Acento de marca, badges, highlights, botones secundarios |
| 🟠 Naranja Acción | `#FF8000` | Botones de acción principal (call-to-action) |
| ⚫ Texto Oscuro | `#2D2D2D` | Texto principal en modo claro |
| 🟢 Éxito | `#4CAF50` | Estados completados, donaciones exitosas, trazabilidad confirmada |
| 🔴 Error | `#E53935` | Errores, validaciones, estados críticos |

### Paleta Stitch Design (Base del Sistema)

Lumera utiliza **Stitch Design** como sistema de colores base (definido en `@theme` de Tailwind), que proporciona una paleta completa de primarios, secundarios, superficies, bordes y variantes optimizada para accesibilidad y modos claro/oscuro.

---

## 🎨 Colores

### Colores Primarios (Stitch)

| Token CSS | Hex | Uso |
|---|---|---|
| `--color-primary` | `#3525cd` | Botones principales, enlaces activos, acentos primarios |
| `--color-primary-container` | `#4f46e5` | Fondos de botones en hover, backgrounds secundarios |
| `--color-on-primary` | `#ffffff` | Texto sobre fondo primario |
| `--color-primary-fixed` | `#e2dfff` | Fondos de chips, badges informativos |
| `--color-primary-fixed-dim` | `#c3c0ff` | Bordes suaves de componentes primarios |
| `--color-on-primary-fixed` | `#0f0069` | Texto oscuro sobre fondos primarios claros |
| `--color-on-primary-fixed-variant` | `#3323cc` | Variante de texto sobre primario |

### Colores Secundarios (Stitch)

| Token CSS | Hex | Uso |
|---|---|---|
| `--color-secondary` | `#712ae2` | Acentos secundarios, iconos decorativos |
| `--color-secondary-container` | `#8a4cfc` | Fondos hover de elementos secundarios |
| `--color-on-secondary` | `#ffffff` | Texto sobre fondo secundario |
| `--color-secondary-fixed` | `#eaddff` | Fondos sutiles de secciones secundarias |
| `--color-secondary-fixed-dim` | `#d2bbff` | Bordes secundarios suaves |
| `--color-on-secondary-fixed` | `#25005a` | Texto sobre fondos secundarios claros |
| `--color-on-secondary-container` | `#fffbff` | Texto sobre contenedores secundarios |

### Colores Terciarios (Stitch)

| Token CSS | Hex | Uso |
|---|---|---|
| `--color-tertiary` | `#474751` | Acentos neutrales, texto decorativo |
| `--color-tertiary-container` | `#5f5f69` | Fondos hover terciarios |
| `--color-on-tertiary` | `#ffffff` | Texto sobre fondo terciario |
| `--color-tertiary-fixed` | `#e3e1ed` | Fondos de componentes terciarios |
| `--color-on-tertiary-fixed` | `#1a1b23` | Texto sobre fondos terciarios claros |

### Colores de Error

| Token CSS | Hex | Uso |
|---|---|---|
| `--color-error` | `#ba1a1a` | Texto de error, iconos de advertencia fuerte |
| `--color-error-container` | `#ffdad6` | Fondo de alertas de error |
| `--color-on-error` | `#ffffff` | Texto sobre fondo de error |
| `--color-on-error-container` | `#93000a` | Texto dentro de contenedor de error |

### Superficies (Modo Claro)

| Token CSS | Hex | Uso |
|---|---|---|
| `--color-background` | `#faf8ff` | Fondo general de páginas |
| `--color-on-background` | `#131b2e` | Texto sobre fondo general |
| `--color-surface` | `#faf8ff` | Fondo de tarjetas, paneles |
| `--color-surface-dim` | `#d2d9f4` | Superficies atenuadas |
| `--color-surface-bright` | `#faf8ff` | Superficies brillantes (modals activos) |
| `--color-surface-container-lowest` | `#ffffff` | Fondo más claro (cards elevadas) |
| `--color-surface-container-low` | `#f2f3ff` | Contenedores ligeros |
| `--color-surface-container` | `#eaedff` | Contenedores estándar |
| `--color-surface-container-high` | `#e2e7ff` | Contenedores destacados |
| `--color-surface-container-highest` | `#dae2fd` | Contenedores muy destacados |
| `--color-on-surface` | `#131b2e` | Texto principal sobre superficies |
| `--color-on-surface-variant` | `#464555` | Texto secundario sobre superficies |
| `--color-inverse-surface` | `#283044` | Superficie invertida (dark sobre light) |
| `--color-inverse-on-surface` | `#eef0ff` | Texto sobre superficie invertida |
| `--color-inverse-primary` | `#c3c0ff` | Primario invertido |
| `--color-surface-tint` | `#4d44e3` | Tono de superficie tintado |

### Bordes y Outlines

| Token CSS | Hex | Uso |
|---|---|---|
| `--color-outline` | `#777587` | Bordes de inputs, tarjetas, componentes |
| `--color-outline-variant` | `#c7c4d8` | Bordes suaves, separadores |
| `--color-surface-variant` | `#dae2fd` | Variante de fondo de superficie |

### Colores de Marca Lumera

| Token CSS | Hex | Uso |
|---|---|---|
| `--color-accent` | `#F28C33` | Color insignia Lumera — badges, highlights, acentos |
| `--color-accent-bg` | `rgba(242,140,51,0.1)` | Fondos translúcidos del acento |
| `--color-accent-border` | `rgba(242,140,51,0.5)` | Bordes del acento |
| `--color-success` | `#4CAF50` | Éxito, donaciones completadas, verde de trazabilidad |
| `--color-success-container` | `#d4edda` | Fondo de alertas de éxito |

### Variables shorthand disponibles en Tailwind

Gracias a la configuración `@theme`, puedes usar estas clases directamente:

| Clase Tailwind | Variable CSS |
|---|---|
| `bg-primary` | `--color-primary` |
| `bg-primary-container` | `--color-primary-container` |
| `text-on-primary` | `--color-on-primary` |
| `text-on-surface` | `--color-on-surface` |
| `text-on-surface-variant` | `--color-on-surface-variant` |
| `border-outline` | `--color-outline` |
| `border-outline-variant` | `--color-outline-variant` |
| `bg-surface` | `--color-surface` |
| `bg-surface-container` | `--color-surface-container` |
| `bg-accent` | `--color-accent` |
| `bg-accent-bg` | `--color-accent-bg` |
| `text-accent` | `--color-accent` |
| `bg-success` | `--color-success` |
| `bg-error` | `--color-error` |
| `text-error` | `--color-error` |

> **Nota**: Los colores Lumera (`--color-accent`, `--color-success`) son complementarios al sistema Stitch. El `--color-primary` del sistema Stitch (`#3525cd`) es el color de acción principal (botones, enlaces), mientras que `--color-accent` (`#F28C33`) es el color de **marca** que da identidad visual.

---

## 🔤 Tipografía

### Familia Tipográfica

El sistema utiliza **Inter** como fuente principal, cargada desde Google Fonts. Inter es una sans-serif humanista diseñada para pantallas, con excelente legibilidad en todos los tamaños.

| Token | Familia |
|---|---|
| `--font-sans` | `Inter`, `system-ui`, `Segoe UI`, `Roboto`, sans-serif |
| `--font-heading` | `Inter`, `system-ui`, `Segoe UI`, `Roboto`, sans-serif |
| `--font-mono` | `ui-monospace`, `Consolas`, monospace |

### Escalas Tipográficas

| Token CSS | Tamaño | Peso | Line-Height | Letter-Spacing | Uso |
|---|---|---|---|---|---|
| `text-h1` | 32px | 700 | 1.2 | -0.02em | Títulos de página, landing hero |
| `text-h2` | 24px | 600 | 1.3 | -0.01em | Subtítulos de sección |
| `text-h3` | 20px | 600 | 1.4 | -0.01em | Títulos de tarjetas y paneles |
| `text-body-lg` | 18px | 400 | 1.6 | — | Cuerpo grande, introducciones |
| `text-body-md` | 16px | 400 | 1.5 | — | Cuerpo normal, texto de párrafo |
| `text-label-sm` | 14px | 500 | 1.2 | 0.05em | Labels, badges, botones |

### Clases Tailwind disponibles

| Clase | Tamaño | Uso |
|---|---|---|
| `text-h1` | 32px / 700 | Títulos principales |
| `text-h2` | 24px / 600 | Subtítulos |
| `text-h3` | 20px / 600 | Títulos de sección |
| `text-body-lg` | 18px / 400 | Cuerpo grande |
| `text-body-md` | 16px / 400 | Cuerpo normal |
| `text-label-sm` | 14px / 500 | Labels y badges |

### Principios Tipográficos

- **Jerarquía clara**: h1 → h2 → h3 → body, sin saltos abruptos de tamaño.
- **Peso moderado**: 700 solo para h1; 600 para h2/h3; 400 para body.
- **Interletraje negativo**: h1 usa -0.02em, h2/h3 usan -0.01em.
- **Labels en uppercase**: `text-label-sm` con `uppercase tracking-wider` para badges y etiquetas de estado.
- **Código**: Usar `font-mono` para códigos de verificación, IDs de donación, datos técnicos.

---

## 📐 Layout y Espaciado

### Sistema de Espaciado

Basado en una unidad de 4px. Todos los tokens se usan con clases de Tailwind (`p-4` = 16px, `gap-6` = 24px, etc.).

| Token | px | Tailwind | Uso |
|---|---|---|---|
| `--spacing-0` | 0px | `p-0` | Sin espaciado |
| `--spacing-1` | 4px | `p-1` | Espaciado mínimo, iconos pequeños |
| `--spacing-2` | 8px | `p-2` | Padding interno de badges, chips |
| `--spacing-3` | 12px | `p-3` | Padding de inputs, botones pequeños |
| `--spacing-4` | 16px | `p-4` | Padding estándar de tarjetas, contenedores |
| `--spacing-5` | 20px | `p-5` | Padding de paneles, modales |
| `--spacing-6` | 24px | `p-6` | Padding generoso de tarjetas, secciones internas |
| `--spacing-8` | 32px | `p-8` | Padding de secciones, gap entre cards |
| `--spacing-10` | 40px | `p-10` | Padding de landing hero |
| `--spacing-12` | 48px | `p-12` | Secciones completas, espaciado entre bands |
| `--spacing-16` | 64px | `p-16` | Espaciado mayor entre bloques |
| `--spacing-24` | 96px | `p-24` | Separación entre secciones principales |

### Grid y Contenedores

- **Ancho máximo de contenido**: 1200px centrado (`max-w-6xl mx-auto`).
- **Layout de página**: 12 columnas implícitas con flexbox/grid de Tailwind.
- **Hero**: 6/6 split (título izquierda, ilustración derecha) o full-width centrado.
- **Tarjetas de features**: 3-up en desktop, 2-up en tablet, 1-up en mobile.
- **Dashboard**: Sidebar + contenido principal; sidebar 280px fijo.

### Filosofía de Whitespace

- **Respiración**: Cada sección se separa con `py-12` o `py-16`.
- **Padding de tarjetas**: `p-6` (24px) como estándar, `p-8` (32px) para cards destacadas.
- **Formularios**: `gap-6` entre campos, `p-8` en contenedores de formulario.

### Breakpoints del Sistema

| Nombre | Tailwind | Ancho |
|---|---|---|
| Mobile | `sm` | < 640px |
| Tablet | `md` | 640–768px |
| Tablet Landscape | `lg` | 768–1024px |
| Desktop | `xl` | 1024–1280px |
| Wide | `2xl` | > 1280px |

---

## 📦 Elevación y Sombras

| Nivel | Tratamiento | Uso |
|---|---|---|
| **Plano** | Sin sombra, sin borde | Fondos de página, bodies de sección |
| **Borde suave** | 1px `border-outline-variant` | Inputs, tarjetas de contenido estándar |
| **Borde estándar** | 1px `border-outline` | Tarjetas destacadas, paneles de dashboard |
| **Sombra suave** | `shadow-sm` | Tarjetas hover, dropdowns, tooltips |
| **Sombra media** | `shadow-md` | Modales, drawers, notificaciones toast |
| **Sombra fuerte** | `shadow-lg` | Modales grandes, diálogos de confirmación |

### Principios de Elevación

- El sistema usa **color-block primero, sombra después**. La mayoría del depth viene del contraste entre superficies (claro vs oscuro, `surface` vs `surface-container`).
- Los modales y toasts son los únicos componentes que usan sombras pronunciadas.
- En dark mode, las sombras se atenúan: el color de fondo ya provee suficiente jerarquía.

---

## 🔘 Formas y Bordes

### Escala de Border Radius

| Token | px | Tailwind | Uso |
|---|---|---|---|
| `--rounded-xs` | 2px | `rounded-xs` | Badges muy pequeños, indicadores de estado |
| `--rounded-sm` | 4px | `rounded-sm` | Inputs, chips pequeños |
| `--rounded-md` | 6px | `rounded-md` | Botones estándar, tarjetas pequeñas |
| `--rounded-lg` | 8px | `rounded-lg` | Tarjetas de contenido, paneles |
| `--rounded-xl` | 12px | `rounded-xl` | Modales, tarjetas destacadas, hero |
| `--rounded-2xl` | 16px | `rounded-2xl` | Contenedores hero grandes |
| `--rounded-3xl` | 24px | `rounded-3xl` | Elementos decorativos |
| `--rounded-full` | 9999px | `rounded-full` | Avatares, badges circulares, pills |

### Aplicaciones por Componente

| Componente | Border Radius | Justificación |
|---|---|---|
| Botón primario | `rounded-lg` (8px) | Botones accesibles, consistencia Material |
| Input de texto | `rounded-lg` (8px) | Coincide con botones |
| Tarjeta de contenido | `rounded-xl` (12px) | Distinción clara como contenedor |
| Modal | `rounded-2xl` (16px) | Jerarquía visual elevada |
| Badge | `rounded-full` | Forma de píldora estándar |
| Avatar | `rounded-full` | Círculo perfecto |

---

## 🧩 Componentes

### 1. Botones

#### Botón Primario Stitch (`bg-primary text-on-primary`)

Color base del sistema. Se usa para las acciones principales NO asociadas directamente a una donación.

```jsx
<button className="bg-primary text-on-primary rounded-lg px-5 py-3 font-medium hover:bg-primary-container transition-colors">
  Acción Principal
</button>
```

| Estado | Clase Tailwind | Descripción |
|---|---|---|
| Default | `bg-primary text-on-primary rounded-lg px-5 py-3` | Fondo azul violáceo, texto blanco |
| Hover | `hover:bg-primary-container` | Fondo más claro (hover) |
| Disabled | `opacity-50 cursor-not-allowed` | Opacidad reducida |
| Loading | `opacity-70 cursor-wait` | Opacidad + spinner |

#### Botón Lumera (`bg-[#FF8000] text-white`)

Botón de acción para flujos críticos de Lumera (crear donación, verificar código, confirmar entrega).

```jsx
<button className="bg-[#FF8000] text-white rounded-lg px-5 py-3 font-medium hover:bg-[#e67300] transition-colors">
  Donar Ahora
</button>
```

| Estado | Clase Tailwind | Descripción |
|---|---|---|
| Default | `bg-[#FF8000] text-white rounded-lg px-5 py-3` | Naranja brillante, texto blanco |
| Hover | `hover:bg-[#e67300]` | Naranja más oscuro |
| Disabled | `opacity-50 cursor-not-allowed` | Opacidad reducida |
| Loading | `opacity-70 cursor-wait` | Opacidad + spinner |

#### Botón Secundario (`bg-surface border-outline-variant`)

```jsx
<button className="bg-surface border border-outline-variant text-on-surface rounded-lg px-5 py-3 font-medium hover:bg-surface-container transition-colors">
  Cancelar
</button>
```

#### Botón Outline Accent (`border-accent text-accent`)

```jsx
<button className="border-2 border-accent text-accent bg-transparent rounded-lg px-5 py-3 font-medium hover:bg-accent-bg transition-colors">
  Ver Detalles
</button>
```

#### Botón Texto (`text-primary`)

```jsx
<button className="text-primary font-medium hover:underline">
  Link de Acción
</button>
```

### 2. Inputs de Texto

```jsx
<input
  type="text"
  className="w-full bg-surface border border-outline text-on-surface rounded-lg px-4 py-3 placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
  placeholder="Ingresa tu nombre"
/>
```

| Estado | Clase Tailwind | Descripción |
|---|---|---|
| Default | `border-outline` | Borde estándar |
| Focus | `focus:ring-2 focus:ring-primary focus:border-primary` | Anillo primario |
| Error | `border-error focus:ring-error` | Borde rojo |
| Disabled | `opacity-50 bg-surface-container-low cursor-not-allowed` | Opacidad reducida |
| Success | `border-success` | Borde verde (campo válido) |

#### Input con icono

```jsx
<div className="relative">
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
    <Search size={20} />
  </span>
  <input className="w-full bg-surface border border-outline text-on-surface rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary" />
</div>
```

### 3. Tarjetas

#### Tarjeta de Contenido Estándar (`bg-surface border-outline-variant`)

```jsx
<div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm">
  <h3 className="text-h3 mb-2">Título de la Tarjeta</h3>
  <p className="text-body-md text-on-surface-variant">Descripción del contenido.</p>
</div>
```

#### Tarjeta Destacada (`bg-surface-container border-outline`)

```jsx
<div className="bg-surface-container border border-outline rounded-xl p-8 shadow-md">
  <h3 className="text-h2 text-on-surface">Contenido Destacado</h3>
  <p className="text-body-lg text-on-surface-variant">Información importante.</p>
</div>
```

#### Tarjeta de Donación (con estado)

```jsx
<div className="bg-surface border border-outline-variant rounded-xl p-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-h3">Donación #1234</h3>
    <span className="bg-success-container text-success text-label-sm px-3 py-1 rounded-full font-medium">
      Completada
    </span>
  </div>
  <p className="text-body-md text-on-surface-variant">Destino: Comedor Esperanza</p>
  <p className="text-body-md text-on-surface-variant">Fecha: 15/05/2026</p>
</div>
```

### 4. Badges y Chips

#### Badge de Estado

```jsx
// Éxito
<span className="bg-success-container text-success text-label-sm px-3 py-1 rounded-full font-medium">
  Completada
</span>

// En Proceso
<span className="bg-accent-bg text-accent text-label-sm px-3 py-1 rounded-full font-medium">
  En Proceso
</span>

// Error
<span className="bg-error-container text-error text-label-sm px-3 py-1 rounded-full font-medium">
  Falló
</span>

// Pendiente
<span className="bg-surface-container text-on-surface-variant text-label-sm px-3 py-1 rounded-full font-medium">
  Pendiente
</span>
```

#### Badge Acento Lumera

```jsx
<span className="bg-accent text-white text-label-sm px-3 py-1 rounded-full font-medium uppercase tracking-wider">
  Nuevo
</span>
```

### 5. Navegación

#### Top Nav (Layout General)

```jsx
<nav className="bg-surface border-b border-outline-variant h-16 flex items-center px-6 sticky top-0 z-50">
  {/* Logo + marca */}
  <div className="flex items-center gap-3">
    <img src="/logo.svg" alt="Lumera" className="h-8" />
    <span className="text-h3 text-accent font-bold">Lumera</span>
  </div>

  {/* Menú de navegación */}
  <div className="hidden md:flex items-center gap-6 ml-8">
    <a className="text-on-surface-variant hover:text-on-surface font-medium" href="/">Inicio</a>
    <a className="text-on-surface-variant hover:text-on-surface font-medium" href="/donaciones">Donaciones</a>
    <a className="text-on-surface-variant hover:text-on-surface font-medium" href="/trazabilidad">Trazabilidad</a>
  </div>

  {/* Perfil / Acciones */}
  <div className="ml-auto flex items-center gap-4">
    <button className="text-on-surface-variant hover:text-on-surface">
      <Bell size={20} />
    </button>
    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-on-primary font-medium text-sm">
      JD
    </div>
  </div>
</nav>
```

#### Sidebar (Dashboard por Rol)

```jsx
<aside className="w-64 bg-surface border-r border-outline-variant h-screen sticky top-0 p-6">
  <nav className="flex flex-col gap-2">
    <a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-container text-on-primary-fixed font-medium">
      <LayoutDashboard size={20} />
      Dashboard
    </a>
    <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium transition-colors">
      <Package size={20} />
      Donaciones
    </a>
    <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium transition-colors">
      <Search size={20} />
      Trazabilidad
    </a>
  </nav>
</aside>
```

### 6. Tablas (Datos)

```jsx
<table className="w-full bg-surface border border-outline-variant rounded-xl overflow-hidden">
  <thead className="bg-surface-container">
    <tr>
      <th className="text-label-sm text-on-surface-variant uppercase tracking-wider px-6 py-4 text-left">ID</th>
      <th className="text-label-sm text-on-surface-variant uppercase tracking-wider px-6 py-4 text-left">Donante</th>
      <th className="text-label-sm text-on-surface-variant uppercase tracking-wider px-6 py-4 text-left">Estado</th>
      <th className="text-label-sm text-on-surface-variant uppercase tracking-wider px-6 py-4 text-left">Fecha</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-outline-variant">
    <tr className="hover:bg-surface-container-low transition-colors">
      <td className="px-6 py-4 font-mono text-sm">#DON-001</td>
      <td className="px-6 py-4">Juan Pérez</td>
      <td className="px-6 py-4">
        <span className="bg-success-container text-success text-label-sm px-2 py-0.5 rounded-full">Completada</span>
      </td>
      <td className="px-6 py-4 text-on-surface-variant">12/05/2026</td>
    </tr>
  </tbody>
</table>
```

### 7. Modales

```jsx
{/* Overlay */}
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  {/* Modal */}
  <div className="bg-surface rounded-2xl p-8 w-full max-w-lg shadow-lg animate-fade-in">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-h2">Confirmar Donación</h2>
      <button className="text-on-surface-variant hover:text-on-surface">
        <X size={20} />
      </button>
    </div>

    {/* Contenido */}
    <p className="text-body-md text-on-surface-variant mb-8">
      ¿Estás seguro de que deseas confirmar esta donación?
    </p>

    {/* Acciones */}
    <div className="flex justify-end gap-4">
      <button className="bg-surface border border-outline-variant text-on-surface rounded-lg px-6 py-3 font-medium hover:bg-surface-container transition-colors">
        Cancelar
      </button>
      <button className="bg-[#FF8000] text-white rounded-lg px-6 py-3 font-medium hover:bg-[#e67300] transition-colors">
        Confirmar
      </button>
    </div>
  </div>
</div>
```

### 8. Selectores y Dropdowns

```jsx
<select className="w-full bg-surface border border-outline text-on-surface rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none">
  <option value="">Selecciona un rol</option>
  <option value="donador">Donador</option>
  <option value="empresa">Empresa</option>
  <option value="beneficiario">Beneficiario</option>
</select>
```

### 9. Estado Vacío (Empty State)

```jsx
<div className="flex flex-col items-center justify-center py-16 px-4">
  <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
    <Package size={32} className="text-on-surface-variant" />
  </div>
  <h3 className="text-h3 text-on-surface mb-2">No hay donaciones aún</h3>
  <p className="text-body-md text-on-surface-variant text-center max-w-md mb-6">
    Las donaciones que realices aparecerán aquí. ¡Comienza a donar hoy!
  </p>
  <button className="bg-[#FF8000] text-white rounded-lg px-6 py-3 font-medium">
    Crear Primera Donación
  </button>
</div>
```

### 10. Barras de Progreso

```jsx
<div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
  <div
    className="bg-accent h-full rounded-full transition-all duration-500"
    style={{ width: `${progreso}%` }}
  />
</div>
```

### 11. Notificaciones Toast

Usando `react-hot-toast`:

```jsx
import toast from 'react-hot-toast';

// Éxito
toast.success('Donación creada exitosamente');

// Error
toast.error('Error al crear la donación');

// Promesa (para operaciones asíncronas)
toast.promise(
  crearDonacion(data),
  {
    loading: 'Creando donación...',
    success: 'Donación creada exitosamente',
    error: 'Error al crear la donación',
  }
);
```

---

## 🎯 Iconografía

Lumera usa **Lucide React** (`lucide-react`) como librería de iconos.

### Iconos Comunes por Contexto

| Contexto | Icono | Uso |
|---|---|---|
| Navegación | `LayoutDashboard`, `Home`, `Menu` | Sidebar, top nav |
| Donaciones | `Package`, `Gift`, `Heart` | Tarjetas de donación |
| Trazabilidad | `Search`, `MapPin`, `Route` | Búsqueda y seguimiento |
| Usuario | `User`, `Bell`, `Settings` | Perfil, notificaciones |
| Acciones | `Plus`, `X`, `Check`, `Trash2` | CRUD |
| Estados | `CheckCircle`, `AlertCircle`, `Clock`, `XCircle` | Badges de estado |
| Código QR | `QrCode`, `Scan` | Validación de donaciones |
| Recompensas | `Award`, `Star`, `Trophy` | Sistema de recompensas |

### Tamaños de Iconos

| Contexto | Tamaño (px) | Clase Tailwind |
|---|---|---|
| Iconos de navegación | 20px | `size-5` |
| Iconos en botones | 16-18px | `size-4` o `size-[18px]` |
| Iconos decorativos grandes | 32-48px | `size-8` o `size-12` |
| Iconos en inputs | 20px | `size-5` |
| Iconos de estado en badges | 14-16px | `size-3.5` o `size-4` |

### Buenas Prácticas con Iconos

- Los iconos **nunca** deben ser el único indicador de estado — siempre acompañar con texto.
- Color de iconos: heredar de `text-on-surface-variant` para neutralidad, o usar colores semánticos (`text-success`, `text-error`, `text-accent`).
- En botones: icono + texto con `gap-2` entre ellos.

---

## 🎬 Animaciones

### Animaciones del Sistema

Definidas en `src/index.css`:

| Animación | Duración | Efecto | Clase Tailwind |
|---|---|---|---|
| Fade In | 0.25s | Opacidad 0→1 + translateY(-8px) 0→1 | `animate-fade-in` |
| Slide Up | 0.3s | Opacidad 0→1 + translateY(16px) 0→1 | `animate-slide-up` |

### Cuándo Usar Cada Animación

| Componente | Animación | Justificación |
|---|---|---|
| Modales | `animate-fade-in` | Apertura suave y profesional |
| Tarjetas al listarse | `animate-slide-up` | Listados dinámicos (donaciones, trazabilidad) |
| Alertas / Toasts | Fade in rápido | Notificaciones urgentes pero no bruscas |
| Barras de progreso | `transition-all duration-500` | Actualización de porcentaje de donación |

### Principios de Animación

- **Rapidez**: 0.25–0.3s. Nada debe sentirse lento.
- **Sutileza**: Solo translate y opacidad. Sin escalados, rotaciones ni efectos llamativos.
- **Funcionalidad**: Las animaciones comunican cambio de estado, no son decorativas.
- **Accesibilidad**: Respetar `prefers-reduced-motion`.

---

## 🌙 Dark Mode

Lumera soporta **dark mode automático** vía `@media (prefers-color-scheme: dark)`.

### Cambios Visuales en Dark Mode

| Elemento | Modo Claro | Modo Oscuro |
|---|---|---|
| Fondo de página (`background`) | `#faf8ff` | `#0d1117` |
| Superficies (`surface`) | `#faf8ff` | `#161b22` |
| Texto principal (`on-surface`) | `#131b2e` | `#e6e6e6` |
| Bordes (`outline`) | `#777587` | `#8b949e` |
| Acento Lumera | `#F28C33` | `#FFB366` (más brillante) |
| Fondo acento | `rgba(242,140,51,0.1)` | `rgba(255,179,102,0.15)` |

### Buenas Prácticas en Dark Mode

- **No forzar dark mode**: Respetar la preferencia del sistema.
- **Contraste suficiente**: El texto claro (#e6e6e6) sobre fondo oscuro (#0d1117) cumple WCAG AA.
- **Acento más brillante**: `#FFB366` en dark mode para mantener legibilidad sobre fondos oscuros.
- **Bordes más sutiles**: `border-outline-variant` en dark mode se vuelve `#30363d`.
- **Sombras reducidas**: En dark mode las sombras se atenúan; el color del fondo ya provee suficiente profundidad.

---

## 📱 Responsive

### Estrategia Mobile-First

Lumera está diseñada **mobile-first** porque se espera uso en campo (recolecciones, entregas, verificación de códigos).

### Comportamiento por Breakpoint

| Componente | Mobile (< 640px) | Tablet (640–1024px) | Desktop (> 1024px) |
|---|---|---|---|
| Top Nav | Logo + hamburger menú | Logo + nav parcial | Logo + nav completo |
| Sidebar Dashboard | Oculta (drawer overlay) | Colapsada a iconos | Sidebar completa (280px) |
| Tarjetas de features | 1 columna | 2 columnas | 3 columnas |
| Formularios | Full-width | 2 columnas en grids largos | 2-3 columnas |
| Tablas | Scroll horizontal nativo | Scroll horizontal si es necesario | Full-width |
| Modales | Full-screen (padding 4) | Centrado (max-w-lg) | Centrado (max-w-xl) |
| Footer | 1 columna | 2 columnas | 4 columnas |

### Target de Toque

- Botones y elementos interactivos: mínimo **44×44px** (WCAG 2.5.5).
- Inputs: altura mínima 44px (en mobile).
- Tarjetas: área táctil completa, no solo el enlace.

### Patrones Responsive Clave

```jsx
// Grid de tarjetas responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Tarjetas */}
</div>

// Sidebar + contenido responsive
<div className="flex flex-col lg:flex-row gap-6">
  <aside className="w-full lg:w-64 shrink-0">
    {/* Sidebar */}
  </aside>
  <main className="flex-1 min-w-0">
    {/* Contenido principal */}
  </main>
</div>

// Formulario responsive
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <input className="..." placeholder="Campo 1" />
  <input className="..." placeholder="Campo 2" />
</div>
```

---

## ✅ Directrices de Marca

### Uso del Logo

- El logo de Lumera debe estar siempre visible en la top nav, lado izquierdo.
- En mobile, el logo debe mantener un tamaño mínimo de 32px de altura.
- No distorsionar, no cambiar colores, no aplicar efectos.

### Voz y Tono

| Contexto | Tono | Ejemplo |
|---|---|---|
| Landing / Home | Cálido, inspirador | "Trazabilidad que transforma vidas" |
| Dashboard | Funcional, claro | "Tus donaciones en un solo lugar" |
| Notificaciones | Directo, útil | "Donación #1234 ha sido completada" |
| Errores | Empático, resolutivo | "Algo salió mal. Intenta de nuevo." |

### Estados de Donación (Semántica de Colores)

| Estado | Color | Texto |
|---|---|---|
| Pendiente | `text-on-surface-variant`, `bg-surface-container` | Pendiente |
| En Proceso | `text-accent`, `bg-accent-bg` | En Proceso |
| En Camino | `text-primary`, `bg-primary-fixed` | En Camino |
| Completada | `text-success`, `bg-success-container` | Completada |
| Falló / Cancelada | `text-error`, `bg-error-container` | Falló |

---

## 📘 Glosario de Clases Tailwind

### Clases de Color Más Usadas

```jsx
// Fondos
bg-primary                    // #3525cd — Acción principal
bg-primary-container          // #4f46e5 — Hover de acción
bg-surface                    // #faf8ff — Fondo de tarjetas
bg-surface-container          // #eaedff — Fondo de contenedores
bg-accent                     // #F28C33 — Acento Lumera
bg-accent-bg                  // rgba(242,140,51,0.1) — Fondo translúcido acento
bg-success                    // #4CAF50 — Éxito
bg-error                      // #ba1a1a — Error
bg-surface-container-lowest   // #ffffff — Fondo más claro

// Textos
text-on-primary               // #ffffff — Texto sobre primario
text-on-surface               // #131b2e — Texto principal
text-on-surface-variant       // #464555 — Texto secundario
text-accent                   // #F28C33 — Texto acento Lumera
text-success                  // #4CAF50 — Texto éxito
text-error                    // #ba1a1a — Texto error
text-primary                  // #3525cd — Texto enlace

// Bordes
border-outline                // #777587 — Borde estándar
border-outline-variant        // #c7c4d8 — Borde suave
border-accent                 // rgba(242,140,51,0.5) — Borde acento
border-success                // #4CAF50 — Borde éxito
```

### Clases de Texto

```jsx
text-h1           // 32px, 700, -0.02em letter-spacing
text-h2           // 24px, 600, -0.01em letter-spacing
text-h3           // 20px, 600, -0.01em letter-spacing
text-body-lg      // 18px, 400
text-body-md      // 16px, 400
text-label-sm     // 14px, 500, 0.05em letter-spacing
```

---

## 🚫 Do's and Don'ts

### ✅ Do's

- **Usa `bg-primary` para acciones principales** como "Iniciar Sesión", "Registrarse", "Guardar".
- **Usa `bg-[#FF8000]` para acciones críticas de Lumera**: "Crear Donación", "Verificar Código", "Confirmar Entrega".
- **Usa `bg-accent` para badges, highlights y acentos visuales** que refuercen la identidad de marca.
- **Usa estados semánticos** (`bg-success-container`, `bg-error-container`) para donaciones y trazabilidad.
- **Mantén la jerarquía tipográfica**: h1 → h2 → h3 → body, sin saltos abruptos.
- **Respeta el espaciado**: `p-6` para tarjetas, `py-16` entre secciones, `gap-6` entre elementos de formulario.
- **Usa `animate-fade-in` para modales** y `animate-slide-up` para listas dinámicas.
- **Diseña mobile-first**: la app se usará en campo con dispositivos móviles.
- **Usa `font-mono` para códigos de verificación** e IDs de donación.
- **Acompaña iconos con texto** — los iconos nunca son el único indicador de estado.

### ❌ Don'ts

- **No uses colores fuera de la paleta Stitch + Lumera**. Sin verdes saturados (#00FF00), sin azules brillantes (#0088FF), sin morados distintos a Stitch.
- **No mezcles `bg-primary` con `bg-[#FF8000]` en la misma jerarquía de acción**. El naranja Lumera debe ser el color de acción para donación/trazabilidad; el primario Stitch para acciones generales de la app.
- **No hagas hover con opacidad simple** en botones — usa la variante de color correspondiente (`hover:bg-primary-container`).
- **No uses bordes `gray-*` genéricos de Tailwind** — usa `border-outline` o `border-outline-variant`.
- **No dupliques estilos en CSS modules** si ya existe una clase utilitaria de Tailwind que lo resuelve.
- **No uses sombras excesivas**. La mayoría de la jerarquía visual debe venir del contraste de superficies.
- **No fuerces dark mode** si el usuario tiene preferencia de modo claro. Respetar `prefers-color-scheme`.
- **No ignores la accesibilidad**: mínimo contraste AA, targets táctiles de 44×44px.
- **No uses tipografía de display (serif) para headlines** — Inter es la fuente única del sistema.
- **No pongas enlaces sin subrayado o color distintivo** en párrafos de texto.

---

## 🔄 Referencia Rápida para Desarrollo

### Estructura de una Feature Nueva

```jsx
// src/features/mi-feature/presentation/components/MiComponente.tsx
import React from 'react';
import { IconName } from 'lucide-react';

interface MiComponenteProps {
  titulo: string;
  estado: 'pendiente' | 'completado';
}

export const MiComponente: React.FC<MiComponenteProps> = ({ titulo, estado }) => {
  const estadoEstilos = {
    pendiente: 'bg-surface-container text-on-surface-variant',
    completado: 'bg-success-container text-success',
  };

  return (
    <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3">{titulo}</h3>
        <span className={`${estadoEstilos[estado]} text-label-sm px-3 py-1 rounded-full`}>
          {estado.charAt(0).toUpperCase() + estado.slice(1)}
        </span>
      </div>
    </div>
  );
};
```

### Checklist de Consistencia Visual

- [ ] ¿Usa colores de la paleta Stitch/Lumera? → `bg-primary`, `text-accent`, `border-outline`
- [ ] ¿Usa tipografía del sistema? → `text-h2`, `text-body-md`, `text-label-sm`
- [ ] ¿Respeta el espaciado del sistema? → `p-6`, `gap-4`, `py-16`
- [ ] ¿Es responsive? → Mobile-first, breakpoints `md:` y `lg:`
- [ ] ¿Maneja estados? → Default, hover, focus, disabled, error, loading
- [ ] ¿Es accesible? → Contraste, targets táctiles, `aria-*` labels
- [ ] ¿Soporta dark mode? → Usa variables CSS en lugar de colores fijos

---

*Lumera — Trazabilidad que transforma vidas* 💚

**Última actualización**: Mayo 2026
**Versión del sistema de diseño**: 1.0.0
