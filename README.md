# Portfolio web — J.D. Parra

Sitio web multi-página de presentación profesional como desarrollador full-stack y consultor Microsoft.

**URL en vivo:** https://jd117parra.github.io/Portfolio/

---

## Estructura del proyecto

| Archivo | Propósito |
|---|---|
| `profile.html` | Página de inicio: presentación personal, carrusel de empresas, proyectos dev, contacto |
| `index.html` | Servicios de desarrollo web: servicios ofrecidos, proceso de trabajo, stack técnico, FAQ |
| `microsoft.html` | Consultoría Microsoft: Azure, M365, Power Platform, certificaciones, proceso de consultoría |
| `casos.html` | Casos técnicos: filtros por área, casos reales y en curso, layout editorial |
| `recursos-tecnicos.html` | Herramientas interactivas: comparador de licencias M365, tabla comparativa de planes |
| `styles.css` | Estilos globales (~3,400 líneas), organizados por regiones con `/* #region */` |
| `script.js` | Lógica de navegación, animaciones, filtros de casos y motor del comparador M365 |
| `Images/` | Recursos gráficos (foto de perfil, imágenes de hero, logos) |

---

## Arquitectura técnica

- **HTML5 / CSS3 / JavaScript vanilla** — sin frameworks, sin bundlers, sin dependencias npm
- **Font Awesome** — iconografía
- **Google Fonts** — tipografía (Inter)
- **Swiper.js** — carrusel de logos en `profile.html`

No hay backend ni proceso de build. El sitio se sirve directamente desde GitHub Pages como archivos estáticos.

---

## Decisiones de diseño relevantes

### `profile.html` como página de inicio

`index.html` contiene los servicios de desarrollo web, no la presentación personal. El logo del navbar enlaza a `profile.html` desde todas las páginas, lo que la convierte en el punto de entrada del sitio. No hay redirect ni canonical tag explícito; la convención está implementada solo a nivel de navegación.

### Organización del CSS por regiones

`styles.css` usa 22 bloques `/* #region nombre */` para separar responsabilidades. Esto permite navegar el archivo por secciones sin fragmentarlo en múltiples archivos. Las regiones principales son: Reset, Navegación, Hero, Cards, Secciones base, Animaciones, Responsive Design, Casos Técnicos (layout editorial) y Recursos Técnicos (dashboard app).

### Sistema de filtros en `casos.html`

Cada tarjeta `.caso` tiene un atributo `data-area` con uno de estos valores: `azure`, `m365`, `powerplatform`, `arquitectura`. Los botones del filter hub llaman a un handler en `script.js` que itera sobre todas las tarjetas y alterna `display: none` según el filtro activo. No hay estado persistente ni URL params.

### Paleta de color

El sitio usa un único modo visual: dark. Las variables CSS principales son `--bg-deep` (navy profundo) y `--accent: #00d4ff` (cian). No existe modo claro ni toggle de tema.

### Comparador de licencias M365

`recursos-tecnicos.html` incluye un wizard de 6 preguntas implementado en JS vanilla. El motor de recomendación evalúa las respuestas (tamaño de organización, necesidad de escritorio, MDM, cumplimiento normativo, trabajadores de primera línea) y devuelve un plan recomendado entre F1, F3, Business Basic, Business Standard, Business Premium, E3 y E5, con justificación y add-ons sugeridos. La tabla comparativa es una vista independiente del wizard con búsqueda, toggle de columnas y categorías plegables.

---

## Estado actual

### Páginas completas

| Página | Estado |
|---|---|
| `profile.html` | Funcional, sin placeholders |
| `index.html` | Funcional, sin placeholders |
| `microsoft.html` | Funcional, sin placeholders |
| `recursos-tecnicos.html` | Comparador M365 y tabla comparativa funcionales |

### Secciones con placeholders o contenido pendiente

**`casos.html`:**
- Azure: "Azure Monitor & optimización de costos" — marcado como próximamente
- M365: "Microsoft Purview & protección DLP" — marcado como próximamente
- Power Platform: "Dashboard ejecutivo Power BI" — marcado como próximamente
- Arquitectura: un caso adicional — marcado como próximamente
- Varios casos existentes tienen estado "propuesta en curso" o "en preparación"

**`recursos-tecnicos.html`:**
- Sidebar lista dos herramientas adicionales marcadas como próximamente: Azure Hybrid Benefit Calculator y Security Selector
