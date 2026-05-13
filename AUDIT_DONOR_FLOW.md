# ✅ Auditoría de Diseño: Flujo del Donador

> **Propósito**: Validar que los componentes del flujo de donador cumplen con el `DESIGN.md`
> **Fecha**: Mayo 2026
> **Versión DESIGN.md**: 1.0.0

---

## 📁 Archivos Auditados

| Archivo | Rol en el flujo |
|---|---|
| `src/features/accounts/dashboard/DonadorDashboard.tsx` | Dashboard principal del donador |
| `src/features/accounts/dashboard/DonadorDashboard.module.css` | Estilos del dashboard |
| `src/features/accounts/pages/DonadorDashboard.css` | ⚠️ CSS legacy (en desuso, otro color scheme) |
| `src/features/accounts/pages/DonadorProfile.tsx` | Edición de perfil |
| `src/features/accounts/pages/DonadorProfile.module.css` | Estilos del perfil |
| `src/features/addProducts/AddProductsPanel.jsx` | Panel de nueva donación |
| `src/features/addProducts/components/ProductForm.jsx` | Formulario de producto |
| `src/features/addProducts/components/BarcodeSearch.jsx` | Búsqueda por código de barras |
| `src/features/addProducts/components/ProductListItem.jsx` | Item de producto en lista |
| `src/features/codeValidation/DonationHistory.jsx` | Historial de donaciones |
| `src/features/donorInfo/*` | ⚠️ Archivos vacíos (legacy, 0 bytes) |

---

## 🔴 Hallazgos Críticos (deben corregirse)

### 1. ❌ Uso de `bg-white` y `rounded-3xl` — Violación directa de DESIGN.md

**Archivos**: `DonationHistory.jsx`, `AddProductsPanel.jsx`, `ProductForm.jsx`

**Qué dice DESIGN.md**:
> *"No uses cool grays o pure white para canvas. Cream es el brand."*
> *"--color-surface: #faf8ff"* — el color de superficie **nunca** es blanco puro.

```diff
- bg-white rounded-3xl
+ bg-surface rounded-2xl
```

**Además**: `rounded-3xl` (24px en Tailwind 4) **no existe** en la escala del DESIGN.md. La escala máxima documentada es `rounded-2xl` (16px).

| Archivo | Líneas afectadas |
|---|---|
| `DonationHistory.jsx` | `bg-white rounded-2xl` (3 ocurrencias) |
| `AddProductsPanel.jsx` | `rounded-3xl` (3 ocurrencias), `bg-green-50 rounded-3xl` |
| `ProductForm.jsx` | `rounded-3xl p-8` (1 ocurrencia) |

---

### 2. ❌ Iconos «material-symbols-outlined» en lugar de `lucide-react`

**Archivos**: `AddProductsPanel.jsx`, `ProductForm.jsx`, `DonationHistory.jsx`

**Qué dice DESIGN.md**:
> El proyecto **solo** usa `lucide-react` como librería de iconos. Material Symbols **no** está en el stack.

```diff
- <span className="material-symbols-outlined">add_circle</span>
+ <PlusCircle size={20} />
```

**Archivos y líneas**:
- `AddProductsPanel.jsx`: ~15 ocurrencias (`check_circle`, `share`, `how_to_reg`, `list_alt`, `inventory`, `delete_sweep`, etc.)
- `ProductForm.jsx`: ~6 ocurrencias (`inventory`, `scale`, `package`, `add_circle`, `search`, `error`)
- `DonationHistory.jsx`: ~5 ocurrencias (`error`, `inventory_2`, `weight`)

> 💡 **Nota**: Material Symbols requiere cargar font adicional de Google. Agrega ~100KB a la carga inicial. `lucide-react` son imports tree-shakeables.

---

### 3. ❌ Colores hardcodeados fuera de la paleta Stitch + Lumera

**Archivo**: `AddProductsPanel.jsx`

```jsx
// ❌ Hardcoded green — debería usar tokens semánticos
bg-green-50 border-green-200 text-green-800
bg-green-100 text-green-600

// ❌ Gradient con color no-Stitch
from-primary to-indigo-600   // indigo-600 NO existe en Stitch
```

**Qué debe usar** según DESIGN.md:
```diff
- bg-green-50 border-green-200 text-green-800
+ bg-success-container border-success text-success

- from-primary to-indigo-600
+ from-primary to-primary-container
```

**Archivo**: `DonationHistory.jsx`

```jsx
// ❌ Hardcoded status colors
bg-green-100 text-green-800    // Debería ser bg-success-container text-success
bg-amber-100 text-amber-800    // Debería ser bg-accent-bg text-accent
```

---

### 4. ❌ Estados inline en lugar de clases semánticas de estado

**Archivo**: `DonadorDashboard.tsx`

```jsx
// ❌ Hex inline
<span style={{backgroundColor: '#ecfdf5', color: '#059669'}}>✅ Activo</span>
```

**Qué debe usar** según DESIGN.md (sección Estados de Donación):
```diff
- backgroundColor: '#ecfdf5', color: '#059669'
+ className="bg-success-container text-success text-label-sm px-3 py-1 rounded-full"
```

---

### 5. ❌ Botones con gradientes — no especificados en DESIGN.md

**Archivos**: `AddProductsPanel.jsx`, `ProductForm.jsx`

```jsx
// ❌ Gradiente no documentado
className="bg-gradient-to-r from-primary to-primary-container"
```

**Qué dice DESIGN.md**: Los botones se definen como:
- Botón Primario Stitch: `bg-primary text-on-primary` (fondo sólido, no gradiente)
- Botón Lumera: `bg-[#FF8000] text-white` (fondo sólido, no gradiente)

El gradiente no existe en el sistema de diseño. Si se desea mantener, debe documentarse en DESIGN.md como variante.

---

## 🟡 Hallazgos Medios (deben planificarse)

### 6. ⚠️ Caja de búsqueda no documentada en DESIGN.md

**Archivo**: `DonadorDashboard.module.css` (`.searchBox`)

El componente `searchBox` tiene un estilo completo (icono, input, focus-within) que no está documentado en la sección **Componentes → Inputs** del DESIGN.md.

**Acción**: Agregar `search-box` como variante de input en DESIGN.md, o migrar a usar las clases de input estándar.

---

### 7. ⚠️ Fallback hex incorrecto en DonadorProfile.module.css

```css
color: var(--color-primary, #0066cc);   /* ❌ #0066cc no es el primary Stitch */
```

**Qué dice DESIGN.md**: `--color-primary: #3525cd`
**Acción**: Cambiar fallbacks a los valores correctos, o mejor aún, eliminar fallbacks ya que `@theme` siempre está disponible.

---

### 8. ⚠️ Sombra custom no documentada en DonadorProfile.module.css

```css
box-shadow: 0 15px 50px rgba(0,0,0,0.08);   /* ❌ No está en la escala de elevación */
```

**Qué dice DESIGN.md**: La elevación máxima es `shadow-lg` (nivel 4). Sombra de 50px de blur es excesiva.

**Acción**: Cambiar a `shadow-md` o `shadow-lg`.

---

### 9. ⚠️ Animación skeleton manual en CSS en vez de Tailwind

**Archivo**: `DonadorProfile.module.css`
```css
/* ❌ Animación manual */
@keyframes loading { ... }
.skeleton { background: linear-gradient(90deg, ...); animation: loading 1.5s infinite; }
```

**Qué dice DESIGN.md**: Usar clases utilitarias de Tailwind. Tailwind ya tiene `animate-pulse` que hace exactamente esto.

**Acción**: Reemplazar por `className="animate-pulse bg-surface-container-high rounded-xl"`.

---

## 🟢 Hallazgos Buenos (cumplen DESIGN.md)

### 10. ✅ Uso correcto de variables CSS de Stitch en DonadorDashboard

El componente `DonadorDashboard.tsx` usa correctamente `var(--color-*)` en casi todos los lugares:
```jsx
style={{ backgroundColor: 'var(--color-surface-container-lowest)' }}
style={{ borderColor: 'var(--color-outline-variant)' }}
style={{ color: 'var(--color-on-surface-variant)' }}
```

Esto asegura compatibilidad automática con dark mode. ✅

---

### 11. ✅ Uso de `animate-fade-in` y `animate-slide-up`

Los componentes usan las animaciones del sistema:
```jsx
<div className="animate-fade-in">    // ✅ Modal/profile views
<div className="animate-slide-up">   // ✅ Lista de productos
```

---

### 12. ✅ Grid responsive correcto

```jsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
```

Sigue la estrategia mobile-first del DESIGN.md. ✅

---

### 13. ✅ Empty states implementados

`DonationHistory.jsx` y `AddProductsPanel.jsx` tienen estados vacíos con icono + texto.

---

### 14. ✅ Loading states con skeletons

`DonationHistory.jsx` usa `animate-pulse` (correcto).
`DonadorDashboard.tsx` tiene estado de carga con spinner.

---

### 15. ✅ Badges de estado con colores semánticos (parcial)

`DonadorDashboard.tsx` usa `bg-primary-fixed` para el badge de bienvenida. ✅

---

## 📊 Resumen de Cumplimiento

| Categoría | Estado | % Cumplimiento |
|---|---|---|
| **Colores** (uso de tokens Stitch) | 🟡 Parcial — 6 hardcodeos críticos | 65% |
| **Tipografía** (text-h1, text-body-md, etc.) | 🟡 Parcial — mezcla con CSS modules | 70% |
| **Iconografía** (lucide-react) | 🔴 Crítico — 25+ ocurrencias de Material Symbols | 20% |
| **Border Radius** (escala correcta) | 🟡 Parcial — rounded-3xl no documentado | 60% |
| **Elevación** (shadow-sm/md/lg) | 🟡 Parcial — 1 sombra custom excesiva | 75% |
| **Botones** (bg-primary o bg-[#FF8000]) | 🟡 Parcial — gradientes no documentados | 55% |
| **Dark Mode** (var(--color-*) en todas partes) | 🟢 Bueno — casi siempre usa CSS vars | 90% |
| **Responsive** (mobile-first) | 🟢 Bueno — grids y breakpoints correctos | 90% |
| **Estados Semánticos** (success/error containers) | 🔴 Crítico — colores hardcodeados | 30% |
| **CSS Modules vs Tailwind** | 🟡 Parcial — mezcla de enfoques | 50% |

**Puntaje General**: 60.5% — Necesita correcciones para alinearse al DESIGN.md

---

## 🎯 Plan de Corrección Priorizado

### Inmediato (Alta prioridad, bloqueante)
1. **Reemplazar `material-symbols-outlined` por `lucide-react`** en AddProductsPanel, ProductForm, DonationHistory (~25 iconos)
2. **Reemplazar `bg-white` por `bg-surface`** en DonationHistory y AddProductsPanel
3. **Reemplazar colores hardcodeados de estados** (`bg-green-100 text-green-800` → `bg-success-container text-success`, `bg-amber-100 text-amber-800` → `bg-accent-bg text-accent`)
4. **Reemplazar `rounded-3xl` por `rounded-2xl`** en todas las ocurrencias
5. **Reemplazar badge inline `#ecfdf5`/`#059669`** por tokens Stitch en DonadorDashboard

### Corto plazo (1-2 sprints)
6. **Reemplazar gradientes de botones** por fondos sólidos (`bg-primary` o `bg-[#FF8000]`)
7. **Corregir fallbacks hex** en DonadorProfile.module.css (`#0066cc` → `#3525cd`)
8. **Reemplazar sombra custom** en DonadorProfile.module.css por `shadow-md`

### Medio plazo (backlog técnico)
9. **Migrar DonadorDashboard.module.css** a clases Tailwind puras donde sea posible
10. **Migrar DonadorProfile.module.css** a clases Tailwind donde sea posible
11. **Agregar `search-box` como variante de input** documentada en DESIGN.md
12. **Agregar variante de botón con gradiente** al DESIGN.md si se decide mantenerla
13. **Eliminar archivo legacy** `DonadorDashboard.css` (tiene color scheme azul oscuro que no corresponde)
14. **Eliminar carpeta `donorInfo/`** (archivos vacíos de 0 bytes)

---

## 📝 Notas Adicionales

### Sobre el archivo `DonadorDashboard.css` (legacy)

Este archivo contiene **otro diseño completamente diferente** con:
- Fondo oscuro `#0b1326`
- Acento celeste `#2fd9f4`
- Acento púrpura `#5b5fff`
- Botones pill (`border-radius: 999px`)

No coincide en absoluto con la paleta Stitch + Lumera actual. **Debe eliminarse** si no está siendo utilizado, o migrarse si aún se referencia.

### Sobre `donorInfo/` (legacy vacío)

Los 4 archivos en `src/features/donorInfo/` tienen **0 bytes**. Si no hay plan de implementarlos, deben eliminarse para evitar confusiones.

---

*Auditoría generada contra DESIGN.md v1.0.0 — Lumera Design System*
