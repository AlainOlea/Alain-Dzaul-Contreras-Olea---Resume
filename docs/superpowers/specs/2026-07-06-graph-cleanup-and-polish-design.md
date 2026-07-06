# Ajustes post-rechazo del rediseño "terminal evolucionado" — Diseño

**Fecha:** 2026-07-06
**Estado:** Aprobado, pendiente de plan de implementación
**Rama base:** `refactor` (contiene el WIP `a4fa8b1` del rediseño anterior, rechazado en vivo)

## Contexto

El intento de rediseño "terminal evolucionado + grafo 3D" (`docs/superpowers/specs/2026-07-02-terminal-evolved-redesign-design.md`) fue aprobado en brainstorming pero **rechazado por el usuario al verlo corriendo**: se sintió disjunto, el scroll-snap se sentía brusco, y el efecto de "escribir en terminal" en cada `h2` de sección se veía mal/gimmicky. Ver memoria `feedback_terminal_redesign_rejected`.

De esa implementación, el usuario **sí valida y quiere conservar**: el grafo de nodos de fondo y su efecto de iluminar conexiones según la sección visible durante el scroll. Este spec cubre los ajustes puntuales para rescatar esa pieza y corregir el resto, sin repetir los errores señalados (no volver a envolver todo en un solo big-bang sin checkpoints visuales).

## Objetivo

1. Que el efecto de grafo de nodos que se ilumina por sección sea mucho más grande/visible (pantalla completa), reforzando la sensación de "avance" al scrollear.
2. Eliminar el mini-grafo del nav lateral (no funcionó en mobile, y su rol de "grafo que se ilumina" se absorbe en el punto 1).
3. Quitar el efecto de escritura tipo terminal (`h2-typing`) de los títulos de sección — se queda solo en el hero (nombre/título), que no fue parte de la queja.
4. Animación de entrada más notoria para las cards (achievements, education, skills, certifications, languages) al hacer scroll: fade + slide-up escalonado.
5. Actualizar el período de la experiencia en Rubidex: ya no es el rol actual, terminó en mayo de 2026.

## Secciones del diseño

### 1. Grafo de fondo — protagonista y con highlight por sección

- Se elimina `#sidebar-graph` y toda su lógica (`sidebarGraph`, su `renderGraph()` en el nav, y el CSS asociado `#sidebar-nav #sidebar-graph`, `.graph-node.lit`/`.graph-line.lit` limitado al sidebar).
- `updateGraphHighlight(sectionId)` pasa a operar sobre `backgroundGraph` (el `#node-graph` de fondo) en vez de `sidebarGraph`. Sigue disparándose desde el mismo scrollspy/`IntersectionObserver` que ya marca la sección activa en el nav.
- Se sube la opacidad de `#node-graph` de 0.2 (desktop) / 0.12 (mobile) a ~0.35 (desktop) / ~0.2 (mobile), y el conteo de nodos activos-iluminados se mantiene con un contraste marcado (`--graph-node-color-active`) frente al resto para que el "encendido" por sección sea evidente sin saturar el contenido.
- Nodos/líneas `.lit` usan `--accent-green` (ya definido) con un glow sutil (`box-shadow`/`filter: drop-shadow`) para que resalten más que un simple cambio de color plano.
- Mobile y `prefers-reduced-motion` mantienen la versión simplificada (sin rotación 3D, solo fade) ya prevista en el diseño anterior — no se toca esa lógica de degradación.

### 2. Nav lateral: responsive en mobile vía Swiper

- Desktop: se mantiene el nav lateral fijo con labels (`whoami`, `summary`, `achievements`, etc.) tal cual, sin el mini-grafo (que se retira).
- Mobile: en vez del "indicador mínimo de puntos" (rechazado), el `<ul>` de `#sidebar-nav` se reposiciona a una barra horizontal fija (`bottom` o `top`, a decidir en implementación con lo que se vea mejor) e inicializa una instancia de **Swiper** (ya cargado vía CDN para el carrusel de experiencia — no se añade ninguna dependencia nueva) en modo `slidesPerView: 'auto'` + `freeMode: { enabled: true, momentum: true }`, dando drag táctil con inercia en vez de scroll nativo simple.
- El link activo (`.active`) sigue sincronizado con el scrollspy existente; al activarse, además hace `slideTo`/`slideToLoop` centrando ese pill en la vista (Swiper expone `slideTo` en base al índice del slide activo).
- Cambio de layout controlado por media query (`max-width: 768px`), consistente con el resto del proyecto.

### 3. Remover typing effect de `h2`

- Se elimina la clase `h2-typing` de todos los `<h2>` de sección en `index.html`, junto con las reglas `h2.h2-typing`, `@keyframes h2-typing-anim`, `h2-caret-blink` en `styles.css` que ya no se usan.
- El typing del hero (nombre/título) permanece intacto — no fue parte de la queja del usuario y es un uso puntual (una sola vez, no repetido en cada sección).
- El efecto de scanline al cambiar de sección (`#scanline-overlay`, `triggerScanline()`) se mantiene — no fue señalado como problema; solo el typing en `h2` lo fue.

### 4. Animación de cards: fade + slide-up escalonado

- Se reutiliza el `revealObserver` existente (agrega `.revealed` a los elementos observados) — no se crea un observer nuevo.
- Se añade a los contenedores de cards (`.achievements-grid > *`, `.education-list > *`, `.skills-list > *`, `.certifications-list > *`, `.languages-list > *`) una regla base `opacity: 0; transform: translateY(16px); transition: opacity .5s ease, transform .5s ease;` con `transition-delay` escalonado usando `nth-child` (p. ej. `:nth-child(1) { transition-delay: 0s }`, `:nth-child(2) { transition-delay: .08s }`, hasta un tope razonable ~8 items, luego se resetea a 0 para no acumular delays enormes en listas largas).
- Al añadir `.revealed` (ya lo hace el observer existente), `opacity: 1; transform: translateY(0)`.
- Respeta `prefers-reduced-motion: reduce` (sin transform, solo opacity, o directamente sin animación).

### 5. Estatus de Rubidex

- `index.html`: los dos bloques noscript/SEO con `<p style="color:#b8b8b8;...">Mexico City · February 2025 – Present</p>` cambian a `February 2025 – May 2026`.
- `script.js`: `experienceItems` EN — `period: 'February 2025 - Present'` → `'February 2025 - May 2026'`. ES — `period: 'Febrero 2025 - Presente'` → `'Febrero 2025 - Mayo 2026'`.
- No se toca el JSON-LD (`worksFor`) salvo que ya tenga fechas explícitas — se revisa en implementación si hay algún otro campo de fecha asociado a Rubidex.

### 6. Scroll-snap: quitar la vibración al asentar cada sección

- Síntoma: al llegar a una sección, el snap no se asienta limpio — se percibe una vibración/tembleque incómodo en la animación de asentamiento, no solo un frenón duro.
- Causa identificada: `scroll-snap-stop: always` en `.profile-section` y las demás secciones (styles.css, 3 reglas) combinado con `scroll-snap-type: y proximity` puede hacer que el navegador oscile entre puntos de snap candidatos al forzar la detención inmediata en medio de la inercia, en vez de dejar que el scroll decelere y se asiente en un solo movimiento — esa oscilación es la vibración reportada.
- Fix: cambiar `scroll-snap-stop: always` → `scroll-snap-stop: normal` en las 3 reglas afectadas, para que el navegador deje decelerar el scroll con su curva natural y se asiente en un solo movimiento en vez de forzar micro-correcciones.
- Validación: revisar en vivo (no solo con los checks de Playwright de doble-salto/overflow ya existentes) que el asentamiento se sienta como un solo movimiento suave, en desktop y mobile — la memoria `feedback_terminal_redesign_rejected` ya señaló que los checks automatizados no capturan la sensación de "jumpy"/vibración.
- Si `scroll-snap-stop: normal` no elimina la vibración por sí solo, siguiente paso de respaldo (a explorar en implementación, no de entrada): revisar si el propio JS de scrollspy/graph-rotation (`requestAnimationFrame`) está compitiendo con el scroll nativo y forzando repintados durante el asentamiento.

## Fuera de alcance

- No se rehace el scroll-snap ni el scrollspy — el spec anterior ya los dejó funcionales (fix `76746b3` + `IntersectionObserver` existente); solo se ajusta a qué grafo apunta el highlight.
- No se agregan animaciones nuevas de "flip" o cambio de carta en 3D — se descartó a favor de fade+slide-up por ser más sobrio y menos gimmicky (lección directa del rechazo anterior).
- No se agrega ninguna librería nueva de drag/carousel — se reutiliza Swiper, ya presente en el proyecto.

## Checkpoints de validación (lección del rechazo anterior)

Dado que el rediseño anterior fue aprobado en abstracto pero rechazado al verlo, este trabajo se valida en 2 checkpoints en vivo antes de darlo por terminado:

1. Tras remover el sidebar-graph y ampliar/mover el highlight al grafo de fondo + quitar el typing de `h2` — captura o revisión en navegador antes de seguir.
2. Tras la animación de cards y el nav responsive en mobile — revisión en vivo (incluye mobile emulado) antes de cerrar la rama.

## Accesibilidad y performance

- Todas las animaciones (grafo, cards) respetan `prefers-reduced-motion: reduce`.
- El nav mobile con Swiper no debe bloquear el foco/tab-order existente; los links siguen siendo `<a href="#seccion">` navegables por teclado.
- Sin build step nuevo — vanilla JS/CSS + Swiper ya cargado por CDN, consistente con la arquitectura del proyecto.
