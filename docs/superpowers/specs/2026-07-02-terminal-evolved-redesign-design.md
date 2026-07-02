# Terminal Evolucionado + Grafo 3D Scroll-Driven — Diseño

**Fecha:** 2026-07-02
**Estado:** Aprobado, pendiente de plan de implementación

## Contexto

El sitio (`index.html` / `styles.css` / `script.js`, vanilla JS, sin build) tiene una estética "terminal oscura" (fondo `#080808`, Fira Code, acentos azul `#3b82f6`, glassmorphism, scroll-snap por sección) que ya encaja con el rol del usuario (SDET/QA Engineer, 4+ años). El feedback fue que el sitio "se ve genérico" y necesita sentirse más dinámico, fácil de navegar, y más "diseñado" — vendiendo al usuario como producto.

Commits recientes ya resolvieron saltos dobles de scroll-snap y overflow horizontal (`76746b3`). El fondo actual usa un canvas de grid de puntos que se deforma con el cursor (`898ac12`).

## Objetivo

Evolucionar (no reemplazar) la identidad visual actual, con:
1. Navegación persistente que facilite moverse por las secciones.
2. Un motivo geométrico 3D (grafo de nodos, CSS puro) que reacciona al scroll, reemplazando el grid de puntos actual.
3. Animaciones con personalidad (tema terminal/comando) más notorias que el estado actual.
4. CTAs de descarga/contacto reforzados en hero y cierre.

## Secciones del diseño

### 1. Navegación
- Barra de progreso de scroll fina y fija en el borde superior (`position: fixed`, ancho = % de scroll total).
- Nav lateral fijo en desktop con labels tipo comando (`whoami`, `achievements`, `experience`, `education`, `skills`, `certifications`, `languages`), cada uno clicable (scroll-to-section). En mobile colapsa a un indicador mínimo (puntos, sin labels) para no robar espacio horizontal.
- El nodo activo del grafo 3D (ver sección 3) se ilumina en sincronía con la sección visible, reforzando la nav lateral como "mapa" del sitio.
- Implementación: `IntersectionObserver` ya existente en `script.js` (patrón usado en `summaryObserver`, `experienceObserver`, `revealObserver`) se extiende para also marcar la sección activa en la nav y actualizar el grafo.

### 2. Grafo 3D de nodos (fondo, reemplaza el grid de puntos)
- Construcción 100% CSS: contenedor con `perspective`, nodos (`div` circulares) y conexiones (`div` finos rotados o `conic-gradient`) dentro de un `transform-style: preserve-3d`.
- Vive de fondo en cada sección con opacidad baja (15-25%) para no competir con el contenido, y como pieza destacada en la nav lateral.
- El grafo muta por sección: más nodos/conexiones iluminados en "Experience" (más "pruebas pasadas"), agrupación en clusters por categoría en "Skills", etc. — controlado por CSS custom properties (`--graph-rotation`, `--graph-highlight`) actualizadas desde JS vía `IntersectionObserver` + `requestAnimationFrame` (sin `scroll-timeline`, por soporte de navegador).
- En mobile: versión simplificada, menos nodos, sin rotación 3D (solo fade), para performance.
- El canvas de grid de puntos actual (`898ac12`) se retira; el grafo asume su rol de textura de fondo.

### 3. Animaciones y micro-interacciones
- Contadores animados en las métricas clave (33%, 800+, 100%) al entrar en viewport.
- Encabezados de sección (`h2`) con efecto de "comando escribiéndose" (`> whoami`, `> cat experience.log`) reutilizando/expandiendo el keyframe `typing` ya presente en `styles.css` pero subutilizado.
- Cursor de terminal parpadeante junto a textos clave (nombre, título).
- Transición breve tipo *scanline/glitch* (~150ms) al hacer snap entre secciones — sutil, no debe marear ni afectar accesibilidad (respetar `prefers-reduced-motion`).
- Hover de cards con glow de acento con propósito: verde = logros/métricas, azul = stack técnico.

### 4. CTA
- Hero: botón primario "Download Resume" (abre modal existente) + botón secundario de contacto (mailto/LinkedIn).
- Cierre de página: mismo par de CTAs repetido como resumen ejecutivo.
- Sin CTA flotante persistente durante el scroll (decisión explícita del usuario).

### 5. Deuda técnica
- Auditar en navegador el comportamiento actual de scroll-snap (`scroll-snap-type: y proximity` en `body`, `scroll-snap-align: start` + `scroll-snap-stop: always` en cada `section`) para confirmar que el fix de `76746b3` es sólido antes de integrar el scroll-tracking del grafo, evitando que ambos sistemas de scroll colisionen.

## Fuera de alcance
- No se cambia el tema oscuro por uno claro/editorial (opciones descartadas en brainstorming).
- No se genera una secuencia de frames vectoriales (SVGs pre-renderizados) — el grafo es CSS 3D puro, sin assets de imagen adicionales.
- No se agrega navegación tipo header tradicional (se prefirió nav lateral + barra de progreso).

## Accesibilidad y performance
- Todas las animaciones nuevas deben respetar `prefers-reduced-motion: reduce` (desactivar rotación 3D, glitch, typing effect; dejar solo fades simples).
- El grafo 3D debe degradarse a una versión ligera en mobile/pantallas pequeñas.
- Mantener sin build step (vanilla JS/CSS), consistente con la arquitectura actual del proyecto.
