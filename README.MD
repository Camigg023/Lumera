# Lumera

## Introducción

En el mundo, aproximadamente 45 millones de niños sufren de desnutrición aguda grave, y según la ONU, cada día mueren alrededor de 13.800 niños menores de 5 años debido a la falta de una alimentación adecuada. Esta alarmante realidad refleja una de las mayores crisis humanitarias que enfrenta la sociedad global.

Ante esta problemática, surge **Lumera**, una innovadora aplicación móvil que conecta a personas dispuestas a donar alimentos con aquellos que más los necesitan, contribuyendo a reducir tanto el desperdicio de comida como el hambre que afecta a millones.

## Objetivo

Crear un puente de solidaridad que permita transformar excedentes de alimentos en oportunidades de nutrición para las comunidades más vulnerables, generando un impacto social positivo mientras se promueve la sostenibilidad ambiental.

## Características Principales

- 🍽️ **Conexión de Donantes y Receptores**: Plataforma intuitiva para conectar donantes de alimentos con personas necesitadas
- 📍 **Localización en Tiempo Real**: Sistema de geolocalización para facilitar entregas eficientes
- 🤝 **Comunidad Solidaria**: Red de usuarios comprometidos con la lucha contra el hambre
- ♻️ **Reducción de Desperdicio**: Contribuye a minimizar el desperdicio de alimentos a nivel local

## Stack Tecnológico

Lumera está construida con las tecnologías más modernas y robustas del desarrollo web:

### Frontend
- **React**: Librería de JavaScript para construir interfaces de usuario interactivas y dinámicas
- **TypeScript**: Superset de JavaScript que añade tipado estático, mejorando la calidad del código y reduciendo errores en tiempo de desarrollo
- **JavaScript**: Lenguaje de programación base para la lógica interactiva de la aplicación
- **HTML**: Markup para estructurar los componentes y vistas de la aplicación

### Ventajas del Stack Seleccionado

- **React**: Proporciona componentes reutilizables, virtual DOM para mejor rendimiento, y una comunidad activa con abundante documentación
- **TypeScript**: Detecta errores antes de que se ejecute el código, facilita el mantenimiento y mejora la experiencia del desarrollador con autocompletado
- **JavaScript/HTML**: Base sólida y estándar de la web moderna, garantizando compatibilidad y accesibilidad

## Arquitectura y Estructura del Proyecto

El proyecto sigue una estructura organizada que facilita el mantenimiento y escalabilidad:

```
src/
├── components/       # Componentes React reutilizables
├── pages/           # Páginas principales de la aplicación
├── services/        # Servicios para llamadas API y lógica de negocio
├── hooks/           # Custom hooks de React
├── utils/           # Funciones utilitarias
├── types/           # Definiciones de tipos TypeScript
└── assets/          # Recursos estáticos (imágenes, íconos, etc.)
```

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalados:
- **Node.js** (versión 14 o superior)
- **npm** o **yarn** como gestor de paquetes

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/Camigg023/Lumera.git
cd Lumera
```0

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
# o
yarn start
```

La aplicación se abrirá en `http://localhost:3000`

## Desarrollo

### Comandos Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm test`: Ejecuta las pruebas unitarias
- `npm run lint`: Valida el código según los estándares definidos

### Compilación de TypeScript

El código TypeScript se compila automáticamente a JavaScript durante el desarrollo. Asegúrate de seguir las convenciones de tipado para mantener la calidad del código.

## Contribuir

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Por favor, asegúrate de que tu código cumple con los estándares de TypeScript y que todas las pruebas pasen antes de enviar un PR.

## Licencia

Este proyecto está bajo la licencia especificada en el archivo LICENSE.