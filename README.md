# Quédate — Frontend Web

> "Quédate cerca de tu universidad"

Frontend web de la plataforma **Quédate** (CS2031 — Desarrollo Basado en Plataformas, DBP · UTEC · Ciclo 2026-2). Aplicación React 19 + Vite + TypeScript que consume la API REST del backend para conectar estudiantes universitarios con arrendadores verificados cerca de su campus.

---

## Tabla de contenidos

1. [Descripción del proyecto](#1-descripción-del-proyecto)
2. [Integrantes y participación](#2-integrantes-y-participación)
3. [Problema y solución](#3-problema-y-solución)
4. [Objetivos y alcance](#4-objetivos-y-alcance)
5. [Arquitectura del frontend](#5-arquitectura-del-frontend)
6. [Stack tecnológico](#6-stack-tecnológico)
7. [Diseño y sistema visual](#7-diseño-y-sistema-visual)
8. [Módulos y páginas](#8-módulos-y-páginas)
9. [Componentes reutilizables](#9-componentes-reutilizables)
10. [Servicios y comunicación con la API](#10-servicios-y-comunicación-con-la-api)
11. [Estado y gestión de datos](#11-estado-y-gestión-de-datos)
12. [Autenticación y seguridad](#12-autenticación-y-seguridad)
13. [Mapas e integración externa](#13-mapas-e-integración-externa)
14. [Testing](#14-testing)
15. [Estructura de carpetas](#15-estructura-de-carpetas)
16. [Ejecución y desarrollo local](#16-ejecución-y-desarrollo-local)
17. [Build y deployment](#17-build-y-deployment)
18. [Verificación y calidad](#18-verificación-y-calidad)
19. [Repositorios](#19-repositorios)
20. [Licencia](#20-licencia)

---

## 1. Descripción del proyecto

**Quédate** es una plataforma web que permite a estudiantes universitarios (enfoque inicial en UTEC y alrededores de Lima) buscar habitaciones cercanas a su universidad, solicitar alquiler, agendar visitas, dejar reseñas verificables y gestionar la verificación de identidad de arrendadores.

El frontend es la capa de presentación del sistema: una Single Page Application (SPA) construida con React 19 que consume la API REST del backend (Spring Boot, `/api/v1`) y ofrece una experiencia de usuario completa para tres roles:

- **Estudiante (USER):** busca habitaciones, envía solicitudes de alquiler, agenda visitas, deja reseñas.
- **Arrendador (LANDLORD):** gestiona sus habitaciones (CRUD), publica/archiva, revisa solicitudes y visitas, solicita verificación de identidad.
- **Administrador (ADMIN):** revisa y aprueba/rechaza verificaciones de arrendadores.

---

## 2. Integrantes y participación

| Nombre | GitHub | Responsabilidad | Participación |
|---|---|---|---|
| Miguel Angel Dominguez Valentin | [@MiguelAngelDominguez](https://github.com/MiguelAngelDominguez) | Fundación, seguridad, autenticación, usuarios, configuración base, integración frontend-backend | 50% |
| André Brando Mejía Vega | [@andremejia-hub](https://github.com/andremejia-hub) | Catálogo, habitaciones, ubicaciones, búsqueda, desarrollo y diseño del frontend web | 50% |
| Iker Yazid García Tapia | [@iygt8-iterate](https://github.com/iygt8-iterate) | *Se retiró del curso* | 0% |

> La suma de participaciones es 100%.

---

## 3. Problema y solución

### Problema
Buscar alojamiento cerca de una universidad resulta complicado para un estudiante que no conoce la zona. Las ofertas suelen publicarse en medios generales o informales (redes sociales, grupos de WhatsApp), lo que genera:

- Información fragmentada entre plataformas.
- Dificultad para comparar precios, ubicaciones y características.
- Falta de validación de arrendadores.
- Ausencia de un flujo estructurado para solicitar una habitación.
- Coordinación manual de visitas.
- Reseñas sin comprobar una experiencia real.
- Poca información sobre la cercanía a la universidad.

### Solución
Quédate centraliza la búsqueda y la interacción con el arrendador en una única plataforma con:

- Catálogo de habitaciones con filtros por distrito, precio, universidad y tipo.
- Mapa interactivo con ubicación de habitaciones y universidades.
- Flujo completo de solicitud de alquiler con estados (pendiente → confirmada/rechazada/cancelada).
- Agendamiento y gestión de visitas con estados (programada → confirmada → completada/no-show).
- Reseñas vinculadas a experiencias verificables (solicitud confirmada o visita completada).
- Verificación manual de identidad de arrendadores por un administrador.
- Panel de arrendador para CRUD de habitaciones, publicación/archivado y gestión de solicitudes.
- Panel de administración para revisión de verificaciones.

---

## 4. Objetivos y alcance

### Objetivos
- Ofrecer una experiencia de usuario fluida, responsive y accesible para buscar y gestionar alojamiento.
- Integrar completamente con el backend mediante API REST versionada (`/api/v1`).
- Garantizar autenticación persistente con JWT y refresh automático.
- Proveer feedback visual inmediato (toasts, skeletons, estados vacíos, loading states).
- Soportar dark mode y animaciones profesionales.

### Alcance (páginas implementadas)
14 páginas que cubren el flujo completo: landing, búsqueda, detalle de habitación, autenticación, perfil, dashboard arrendador, gestión de habitaciones, formularios, solicitudes (estudiante y arrendador), visitas, verificaciones (admin) y 404.

---

## 5. Arquitectura del frontend

### 4.1 Patrón general

```
┌─────────────────────────────────────────────────────┐
│                    App.tsx                          │
│  (Router + Providers + Hydrate + ErrorBoundary)     │
└──────────────────────┬──────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    ┌────┴────┐  ┌─────┴─────┐  ┌───┴────┐
    │  Pages  │  │ Components│  │ Layout │
    └────┬────┘  └─────┬─────┘  └───┬────┘
         │             │            │
    ┌────┴────┐  ┌─────┴─────┐      │
    │  Hooks  │  │   Stores  │      │
    └────┬────┘  └─────┬─────┘      │
         │             │            │
    ┌────┴─────────────┴────────────┴────┐
    │            Services                │
    │  (auth, catalog, room, trust,      │
    │   user, verification)              │
    └────────────────┬───────────────────┘
                     │
              ┌──────┴──────┐
              │   api.ts    │
              │ (Axios +    │
              │  interceptors)│
              └──────┬──────┘
                     │
              ┌──────┴──────┐
              │  Backend    │
              │  /api/v1    │
              └─────────────┘
```

### 4.2 Capas y responsabilidades

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| **Páginas** | `src/pages/` | Vistas de ruta; orquestan componentes, hooks y servicios. |
| **Componentes** | `src/components/` | UI reutilizable: shadcn/ui, layout, rooms, aceternity, common. |
| **Hooks** | `src/hooks/` | Lógica reutilizable: `useAuth`, `useDebounce`, `useFetch`. |
| **Stores** | `src/stores/` | Estado global con Zustand: `authStore` (sesión, tokens). |
| **Servicios** | `src/services/` | Clientes API: llaman a `api.ts` y transforman respuestas. |
| **Schemas** | `src/schemas/` | Validación con Zod: `auth.ts`, `room.ts`. |
| **Tipos** | `src/types/` | Definiciones TypeScript: `api.ts` (DTOs del backend). |
| **Lib** | `src/lib/` | Utilidades: `cn()` (clsx + tailwind-merge). |

### 4.3 Principios aplicados

- **Separación de responsabilidades:** componentes presentacionales vs. contenedores (páginas).
- **Lazy loading:** todas las páginas se cargan con `React.lazy` + `Suspense` para reducir el bundle inicial.
- **Rutas protegidas:** `ProtectedRoute` verifica autenticación y roles antes de renderizar.
- **AbortController:** los fetches se cancelan al desmontar el componente para evitar memory leaks.
- **Prevención de doble-submit:** botones deshabilitados durante operaciones pendientes.
- **Feedback unificado:** toasts (Sonner) para errores globales, estados locales para éxito/error.

---

## 6. Stack tecnológico

### Core

| Tecnología | Versión | Propósito |
|---|---|---|
| React | 19.3.1 | Librería de UI (componentes, hooks, Suspense, lazy). |
| Vite | 8.3.6 | Bundler y dev server (HMR, optimización de assets). |
| TypeScript | ~7.0.2 | Tipado estático en todo el código. |
| React Router | 7.18.5 | Enrutamiento SPA con rutas protegidas y parámetros. |

### Estilos y UI

| Tecnología | Versión | Propósito |
|---|---|---|
| Tailwind CSS | 4.3.5 | Framework CSS utility-first con `@theme inline` y `@custom-variant`. |
| shadcn/ui | (componentes) | Componentes accesibles basados en Radix UI (Button, Card, Dialog, Sheet, etc.). |
| Radix UI | 1.8.1 | Primitivas de UI accesibles (dialogs, dropdowns, tabs, etc.). |
| tw-animate-css | 1.4.0 | Animaciones CSS para transiciones. |
| Motion (Framer Motion) | 14.14.0 | Animaciones de página, hover effects, micro-interacciones. |
| Aceternity UI | (custom) | Componentes visuales avanzados: Spotlight, BentoGrid, BackgroundBeams, etc. |
| Lucide React | 1.72.0 | Iconos SVG. |
| next-themes | 0.4.6 | Persistencia de dark/light mode. |
| Embla Carousel | 8.6.0 | Carrusel de imágenes en galería de habitación. |
| Leaflet | 1.9.4 | Mapas interactivos con marcadores y popups. |
| react-leaflet | 5.0.0 | Wrapper React para Leaflet. |

### Estado y datos

| Tecnología | Versión | Propósito |
|---|---|---|
| Zustand | 5.1.0 | Estado global ligero (auth store). |
| TanStack React Query | 5.107.1 | Caché de datos del servidor, refetch, invalidación. |
| Axios | 1.21.1 | Cliente HTTP con interceptores (token, refresh, errores). |
| React Hook Form | 7.92.0 | Gestión de formularios con validación. |
| Zod | 4.6.7 | Schemas de validación (integrado con React Hook Form via resolvers). |
| @hookform/resolvers | 7.0.6 | Conector entre React Hook Form y Zod. |

### Tipografía

| Fuente | Propósito |
|---|---|
| Plus Jakarta Sans | Fuente principal del cuerpo (body, headings). |
| Space Grotesk | Fuente del logo y wordmark (display). |
| Geist (variable) | Fuente monoespaciada para código/datos. |

### Testing y calidad

| Tecnología | Versión | Propósito |
|---|---|---|
| Vitest | 5.1.0 | Framework de testing (unitario/componente). |
| Testing Library | 16.3.3 | Testing de componentes React. |
| jsdom | 31.0.1 | Entorno DOM para tests. |
| oxlint | 1.90.0 | Linter rápido (Rust-based). |
| @testing-library/jest-dom | 7.0.1 | Matchers adicionales para DOM. |

---

## 7. Diseño y sistema visual

### 6.1 Paleta de colores

| Token | Light | Dark | Uso |
|---|---|---|---|
| `--primary` (teal) | `173 80% 36%` (#0f766e) | `173 80% 45%` | Color principal: botones, enlaces, acentos. |
| `--accent` (esmeralda) | `160 84% 39%` (#10b981) | `160 84% 45%` | Acentos secundarios, badges, highlights. |
| `--cta` (coral) | `24 95% 53%` (#ea580c) | `24 95% 53%` | Call-to-action: botones principales de acción. |
| `--destructive` (rojo) | `0 84% 60%` | `0 63% 31%` | Errores, eliminación, cancelación. |
| `--background` | `0 0% 100%` | `222 47% 11%` | Fondo de página. |
| `--foreground` | `222 47% 11%` | `210 40% 98%` | Texto principal. |
| `--muted` | `210 40% 96%` | `222 47% 18%` | Fondos secundarios, placeholders. |
| `--border` | `214 32% 91%` | `222 47% 20%` | Bordes de cards, inputs, separadores. |

### 6.2 Tipografía

- **Body/Heading:** Plus Jakarta Sans (400–800).
- **Display/Logo:** Space Grotesk (500–700).
- **Monospace:** Geist (variable).
- Configuradas via `@fontsource` y `@fontsource-variable` (self-hosted, sin CDN).

### 6.3 Dark mode

- Implementado con `next-themes` y variante CSS `@custom-variant dark (&:is(.dark *))`.
- Toggle en el Navbar (botón sol/luna).
- Persistencia en `localStorage` (automático por next-themes).
- Todas las variables CSS se redefinen en el bloque `.dark` del `:root`.

### 6.4 Tokens y utilidades CSS (`index.css`)

- **Variables HSL** para todos los colores (light + dark).
- **Utilidades personalizadas:**
  - `.glass` — efecto glassmorphism (backdrop-blur + transparencia).
  - `.text-gradient` — texto con gradiente primary→accent.
  - `.shimmer` — efecto shimmer para skeletons.
  - `.card-hover` — hover con elevación y borde primario.
  - `.btn-glow` — glow shadow para botones CTA.
  - `.elevation-1/2/3` — sombras escalonadas.
  - `.bg-cta-gradient` — gradiente coral para CTAs.
  - `.animate-fade-in`, `.animate-slide-up`, `.animate-scale-in` — animaciones de entrada.
  - `.shadow-soft`, `.shadow-glow` — sombras suaves y glow.

### 6.5 Animaciones

- **Motion (Framer Motion):** transiciones de página (fade + slide), animaciones de entrada en componentes, hover effects.
- **CSS keyframes:** shimmer, spotlight, fade-in, slide-up, scale-in.
- **`prefers-reduced-motion`:** todas las animaciones se desactivan si el usuario lo prefiere (accesibilidad).

### 6.6 Aceternity UI (componentes visuales avanzados)

| Componente | Uso en la app |
|---|---|
| `Spotlight` | Efecto de luz en hero de HomePage. |
| `TextGenerateEffect` | Texto animado en landing. |
| `BentoGrid` | Grid de features en HomePage. |
| `BackgroundBeams` | Fondo animado en páginas de auth. |
| `MovingBorder` | Borde animado en cards destacadas. |
| `AnimatedModal` | Modales de confirmación con animación. |
| `HoverBorderGradient` | Envuelve RoomCard con borde gradiente animado en hover. |

### 6.7 Accesibilidad

- `aria-labels` en botones de icono, inputs y controles interactivos.
- Breadcrumbs en 11 de 14 páginas para navegación contextual.
- Focus visible con ring de color primario.
- Roles semánticos (`nav`, `main`, `footer`, `article`, `section`).
- Estados de carga con skeletons y `aria-busy`.
- Estados vacíos con mensajes descriptivos y acciones sugeridas.
- `prefers-reduced-motion` respetado.

---

## 8. Módulos y páginas

### 7.1 Tabla de páginas

| Página | Ruta | Rol | Propósito | Servicios consumidos |
|---|---|---|---|---|
| `HomePage` | `/` | Público | Landing: hero, features, universidades, stats. | `catalog` (universities, rooms count) |
| `SearchPage` | `/rooms` | Público | Búsqueda con filtros, mapa Leaflet, paginación. | `room` (search), `catalog` (universities) |
| `RoomDetailPage` | `/rooms/:id` | Público | Galería, info completa, reseñas, solicitud/reseña. | `room` (detail, reviews), `trust` (rental request) |
| `LoginPage` | `/login` | Público | Autenticación. | `auth` (login) |
| `RegisterPage` | `/register` | Público | Registro con selección de rol (estudiante/arrendador). | `auth` (register) |
| `ProfilePage` | `/profile` | Auth | Edición de perfil, verificación (landlord). | `user`, `verification` |
| `LandlordDashboardPage` | `/landlord/dashboard` | LANDLORD | Stats y navegación arrendador. | `room` (my-rooms), `trust` (requests) |
| `LandlordRoomsPage` | `/landlord/rooms` | LANDLORD | CRUD de habitaciones, publicar/archivar. | `room` (my-rooms, delete, publish, archive) |
| `RoomFormPage` | `/landlord/rooms/new`, `/landlord/rooms/:id/edit` | LANDLORD | Crear/editar habitación con selects. | `room` (create/update), `catalog` (universities, locations) |
| `MyRequestsPage` | `/my-requests` | Auth | Solicitudes del estudiante. | `trust` (my-rental-requests) |
| `LandlordRequestsPage` | `/landlord/requests` | LANDLORD | Solicitudes del arrendador, cambiar estado. | `trust` (landlord-requests, update status) |
| `VisitsPage` | `/visits/:requestId` | Auth | Agendar y gestionar visitas. | `trust` (visits, update status) |
| `AdminVerificationsPage` | `/admin/verifications` | ADMIN | Revisar y aprobar/rechazar verificaciones. | `verification` (pending, approve, reject) |
| `NotFoundPage` | `*` | Público | Página 404. | — |

### 7.2 Detalle por página

#### HomePage
- Hero con `Spotlight` y `TextGenerateEffect` animados.
- Sección de features con `BentoGrid`.
- Grid de universidades con datos reales del backend.
- Stats (cantidad de habitaciones, universidades).
- CTA hacia búsqueda.

#### SearchPage
- Filtros: distrito, rango de precio (min/max), universidad, tipo de habitación, ordenamiento.
- Lista de habitaciones con `RoomCard` (envuelto en `HoverBorderGradient`).
- Paginación (10/20/50 por página).
- Mapa Leaflet con marcadores de habitaciones y universidades.
- Debounce en búsqueda (500ms).
- Filtros en Sheet (mobile) / sidebar (desktop).
- URL sync: filtros y página en query params.

#### RoomDetailPage
- Galería con Embla Carousel.
- `RoomInfoCard`: precio, capacidad, tamaño, ubicación, universidad, distancia, amenidades.
- `RoomReviews`: lista de reseñas con calificación promedio.
- `RoomRequestForm`: formulario de solicitud de alquiler (estudiante autenticado).
- `RoomReviewForm`: formulario de reseña (requiere experiencia verificable).
- Mapa mini con ubicación de la habitación.

#### LoginPage / RegisterPage
- Formularios con React Hook Form + Zod.
- Validación en tiempo real (onBlur).
- `BackgroundBeams` como fondo animado.
- Register: selector de rol (estudiante/arrendador) con campos condicionales.
- Manejo de errores del backend (toast + mensaje inline).

#### ProfilePage
- Tabs: datos personales, verificación (landlord).
- Edición inline de perfil (nombre, apellido, teléfono).
- Solicitud de verificación: tipo (DNI/Carnet), URL de documento.
- Cambio de contraseña.

#### LandlordDashboardPage
- Stats: total habitaciones, publicadas, solicitudes pendientes, visitas programadas.
- Accesos rápidos a gestión de habitaciones y solicitudes.

#### LandlordRoomsPage
- Tabla/lista de habitaciones del arrendador.
- Acciones: editar, publicar, archivar, eliminar.
- Paginación.
- Imágenes thumbnail.

#### RoomFormPage
- Formulario de creación/edición con validación Zod.
- Selects de ubicación y universidad (cargados del backend).
- Campos: título, descripción, precio, capacidad, tamaño, tipo, imágenes (URLs), ubicación, universidad.
- Preview de imágenes.

#### MyRequestsPage / LandlordRequestsPage
- Lista de solicitudes con filtro por estado.
- Modal de cancelación (estudiante) / confirmación/rechazo (arrendador).
- Detalle de solicitud: habitación, fechas, estado.

#### VisitsPage
- Timeline de visitas por solicitud.
- Formulario de agendamiento (fecha, hora).
- Acciones: confirmar (landlord), completar/no-show (estudiante).
- Modal de acción con confirmación.

#### AdminVerificationsPage
- Lista de verificaciones pendientes.
- Modal de aprobación/rechazo con motivo.
- Filtro por estado (pendiente/aprobada/rechazada).

---

## 9. Componentes reutilizables

### 8.1 UI (shadcn/ui — basados en Radix)

| Componente | Archivo | Uso principal |
|---|---|---|
| Button | `ui/button.tsx` | Botones con variantes (default, outline, ghost, destructive). |
| Card | `ui/card.tsx` | Contenedor de contenido con header/content/footer. |
| Input | `ui/input.tsx` | Campo de texto. |
| Select | `ui/select.tsx` | Dropdown de selección. |
| Dialog | `ui/dialog.tsx` | Modal genérico. |
| Sheet | `ui/sheet.tsx` | Panel lateral (filtros mobile, menú). |
| Tabs | `ui/tabs.tsx` | Pestañas (perfil, dashboard). |
| Table | `ui/table.tsx` | Tablas de datos (landlord rooms, admin). |
| Badge | `ui/badge.tsx` | Etiquetas de estado (confirmada, pendiente, etc.). |
| Skeleton | `ui/skeleton.tsx` | Placeholders de carga. |
| Avatar | `ui/avatar.tsx` | Avatar de usuario. |
| Breadcrumb | `ui/breadcrumb.tsx` | Navegación contextual. |
| Pagination | `ui/pagination.tsx` | Paginación de listas. |
| Alert | `ui/alert.tsx` | Mensajes de alerta. |
| Label | `ui/label.tsx` | Etiqueta de formulario. |
| Textarea | `ui/textarea.tsx` | Área de texto (descripciones, reseñas). |
| Checkbox | `ui/checkbox.tsx` | Casillas de verificación. |
| Separator | `ui/separator.tsx` | Separador visual. |
| DropdownMenu | `ui/dropdown-menu.tsx` | Menú contextual. |
| Sonner | `ui/sonner.tsx` | Toaster (notificaciones). |

### 8.2 Layout

| Componente | Archivo | Propósito |
|---|---|---|
| Navbar | `layout/Navbar.tsx` | Barra de navegación con logo, links, toggle dark mode, menú usuario. |
| Footer | `layout/Footer.tsx` | Pie de página con links y copyright. |
| ProtectedRoute | `layout/ProtectedRoute.tsx` | Guard de ruta por autenticación y rol. |
| ErrorBoundary | `layout/ErrorBoundary.tsx` | Captura errores de renderizado y muestra fallback. |
| BackersMarquee | `layout/BackersMarquee.tsx` | Marquesina de logos (pronabec, utec). |

### 8.3 Rooms

| Componente | Archivo | Propósito |
|---|---|---|
| RoomCard | `rooms/RoomCard.tsx` | Tarjeta de habitación (imagen, precio, ubicación, universidad). Envuelta en `HoverBorderGradient`. |
| RoomGallery | `rooms/RoomGallery.tsx` | Galería de imágenes con Embla Carousel. |
| RoomInfoCard | `rooms/RoomInfoCard.tsx` | Card con detalles de la habitación. |
| RoomMap | `rooms/RoomMap.tsx` | Mapa Leaflet con marcadores de habitaciones y universidades. |
| RoomRequestForm | `rooms/RoomRequestForm.tsx` | Formulario de solicitud de alquiler. |
| RoomReviewForm | `rooms/RoomReviewForm.tsx` | Formulario de reseña. |
| RoomReviews | `rooms/RoomReviews.tsx` | Lista de reseñas con calificación promedio. |

### 8.4 Common

| Componente | Archivo | Propósito |
|---|---|---|
| EmptyState | `common/EmptyState.tsx` | Estado vacío con icono, mensaje y acción. |
| Logo | `common/Logo.tsx` | Logo de Quédate. |

### 8.5 Aceternity

| Componente | Archivo | Propósito |
|---|---|---|
| Spotlight | `aceternity/Spotlight.tsx` | Efecto de luz animado. |
| TextGenerateEffect | `aceternity/TextGenerateEffect.tsx` | Texto con efecto de escritura. |
| BentoGrid | `aceternity/BentoGrid.tsx` | Grid estilo bento. |
| BackgroundBeams | `aceternity/BackgroundBeams.tsx` | Rayos de fondo animados. |
| MovingBorder | `aceternity/MovingBorder.tsx` | Borde animado. |
| AnimatedModal | `aceternity/AnimatedModal.tsx` | Modal con animación de entrada/salida. |
| HoverBorderGradient | `aceternity/HoverBorderGradient.tsx` | Borde gradiente animado en hover. |

---

## 10. Servicios y comunicación con la API

### 9.1 Cliente HTTP (`api.ts`)

- **Base URL:** `import.meta.env.VITE_API_BASE_URL` (default: `http://localhost:8080/api/v1`).
- **Timeout:** 15 segundos.
- **Headers:** `Content-Type: application/json`.
- **Request interceptor:** adjunta `Authorization: Bearer <accessToken>` si existe.
- **Response interceptor:**
  - En `401`: intenta refresh token. Si falla, logout.
  - Cola de requests pendientes durante refresh (evita múltiples refresh simultáneos).
  - En otros errores: muestra toast con mensaje del backend o mensaje genérico.
  - `getErrorMessage()`: extrae mensaje del error HTTP o retorna mensaje genérico por status code.

### 9.2 Servicios

| Servicio | Archivo | Endpoints consumidos |
|---|---|---|
| `authService` | `services/auth.service.ts` | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh` |
| `catalogService` | `services/catalog.service.ts` | `GET /universities`, `GET /locations`, `GET /rooms` (búsqueda) |
| `roomService` | `services/room.service.ts` | `GET/POST/PUT/DELETE /rooms`, `GET /rooms/:id`, `GET /rooms/my-rooms`, `POST /rooms/:id/publish`, `POST /rooms/:id/archive` |
| `trustService` | `services/trust.service.ts` | `POST /rooms/:id/rental-requests`, `GET /my-rental-requests`, `GET /my-requests-landlord`, `PATCH /rental-requests/:id/status`, `POST /rental-requests/:id/visits`, `GET /rental-requests/:id/visits`, `PATCH /visits/:id/status` |
| `userService` | `services/user.service.ts` | `GET /users/me`, `PUT /users/me`, `PUT /landlords/me/profile` |
| `verificationService` | `services/verification.service.ts` | `POST /me/verification`, `GET /verifications/pending`, `PATCH /verifications/:id` |

### 9.3 Manejo de errores

- **Global:** interceptor de Axios muestra toast (Sonner) con mensaje del backend o genérico.
- **Local:** componentes capturan errores y muestran mensajes inline.
- **Helper:** `getErrorMessage(error)` extrae mensaje de `AxiosError` o retorna string genérico.
- **AbortController:** fetches se cancelan al desmontar componente.

---

## 11. Estado y gestión de datos

### 10.1 Zustand (client state)

**`authStore`** (`src/stores/authStore.ts`):
- Estado: `user`, `accessToken`, `refreshToken`, `isAuthenticated`.
- Acciones: `setAuth`, `setTokens`, `setUser`, `logout`, `hydrate`.
- Persistencia: `refreshToken` en `sessionStorage` (sobrevive refresh de página, no tabs nuevas).
- Hidratación: al montar `App.tsx`, lee `refreshToken` de `sessionStorage` y llama a `/auth/refresh`.

### 10.2 React Query (server state)

- Caché de datos del servidor (habitaciones, universidades, solicitudes).
- Refetch automático al enfocar ventana.
- Invalidación manual tras mutaciones (crear/editar/eliminar habitación).
- Loading y error states integrados.

### 10.3 React Hook Form + Zod (formularios)

- Schemas de validación en `src/schemas/auth.ts` y `src/schemas/room.ts`.
- Validación en tiempo real (`mode: 'onBlur'`).
- Integración via `@hookform/resolvers/zod`.
- Campos con mensajes de error inline.
- Prevención de doble-submit (botón disabled durante `isSubmitting`).

### 10.4 Custom hooks

| Hook | Archivo | Propósito |
|---|---|---|
| `useAuth` | `hooks/useAuth.ts` | Acceso a auth store + helpers (login, logout, register). |
| `useDebounce` | `hooks/useDebounce.ts` | Debounce de valores (búsqueda, filtros). |
| `useFetch` | `hooks/useFetch.ts` | Fetch genérico con loading/error/data y AbortController. |

---

## 12. Autenticación y seguridad

### 11.1 Flujo de autenticación

```
1. Usuario ingresa credenciales → POST /auth/login
2. Backend retorna { userInfo, accessToken, refreshToken }
3. Frontend guarda en authStore + sessionStorage (refreshToken)
4. Request interceptor adjunta accessToken a cada request
5. Al expirar accessToken (401): interceptor llama POST /auth/refresh
6. Backend retorna nuevos tokens → se actualizan en store
7. Si refresh falla: logout → redirect a /login
8. Al recargar página: hydrate() lee refreshToken → refresh → nueva sesión
```

### 11.2 Rutas protegidas

- `ProtectedRoute` (sin roles): requiere autenticación (cualquier rol).
- `ProtectedRoute roles={['LANDLORD']}`: requiere rol LANDLORD.
- `ProtectedRoute roles={['ADMIN']}`: requiere rol ADMIN.
- Si no autenticado: redirect a `/login`.
- Si rol insuficiente: redirect a `/`.

### 11.3 Seguridad

- Tokens JWT en memoria (access) + sessionStorage (refresh).
- No se almacenan contraseñas.
- CORS configurado en backend para `http://localhost:3000`.
- Validación de inputs con Zod en frontend + Jakarta Validation en backend.

---

## 13. Mapas e integración externa

### 12.1 Leaflet (`RoomMap.tsx`)

- Mapa interactivo con tiles de OpenStreetMap.
- **Marcadores de habitaciones:** popup con título, precio, enlace a detalle.
- **Marcadores de universidades:** popup con nombre y ubicación.
- Centro del mapa: Lima (default) o ubicación del usuario (si GPS disponible).
- Fallback: si no hay GPS, usa coordenadas de Lima (-12.0464, -77.0428).

### 12.2 APIs externas

- **OpenStreetMap (Nominatim):** geocodificación de direcciones (opcional).
- **Google Maps:** API key configurable via `VITE_GOOGLE_MAPS_API_KEY` (opcional, para integración futura).

---

## 14. Testing

### 13.1 Configuración

- **Framework:** Vitest 5.1.0 con entorno jsdom.
- **Config:** `vitest.config.ts` (setup en `src/test/setup.ts`).
- **Librerías:** `@testing-library/react`, `@testing-library/jest-dom`.

### 13.2 Tests existentes

| Archivo | Tests | Descripción |
|---|---|---|
| `src/components/common/EmptyState.test.tsx` | 3 | Renderizado con mensaje, icono y acción. |

### 13.3 Comandos

```bash
npm run test          # Ejecutar todos los tests (vitest run)
npm run test:ui       # UI interactiva de Vitest (si configurado)
```

### 13.4 Cobertura (futura)

- Tests de `getErrorMessage`, `authStore`, `RoomCard`, `useDebounce` planificados como bonus.
- Tests de integración con MSW (Mock Service Worker) para servicios.

---

## 15. Estructura de carpetas

```
quedate-frontend/
├── public/                          # Assets estáticos
│   ├── favicon.svg
│   ├── icons.svg
│   └── logos/
│       ├── pronabec.png
│       └── utec.png
├── src/
│   ├── assets/                      # Imágenes y SVGs importados
│   │   ├── hero.png
│   │   ├── logo.svg
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── aceternity/              # Componentes Aceternity UI (7)
│   │   ├── common/                  # EmptyState, Logo + tests
│   │   ├── layout/                  # Navbar, Footer, ProtectedRoute, ErrorBoundary, BackersMarquee
│   │   ├── rooms/                   # RoomCard, RoomGallery, RoomInfoCard, RoomMap, RoomRequestForm, RoomReviewForm, RoomReviews
│   │   └── ui/                      # shadcn/ui (20 componentes)
│   ├── hooks/                       # useAuth, useDebounce, useFetch
│   ├── lib/                         # utils (cn)
│   ├── pages/                       # 14 páginas
│   ├── schemas/                     # auth.ts, room.ts (Zod)
│   ├── services/                    # api.ts + 6 servicios
│   ├── stores/                      # authStore (Zustand)
│   ├── test/                        # setup.ts
│   ├── types/                       # api.ts (DTOs)
│   ├── App.tsx                      # Router + providers
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Tailwind + tokens + animaciones
├── .env.example                     # Plantilla de variables
├── .gitignore
├── components.json                  # shadcn config
├── index.html                       # HTML entry
├── package.json
├── tsconfig.json                    # TypeScript config (app + node)
├── vite.config.ts                   # Vite config
├── vitest.config.ts                 # Vitest config
└── README.md                        # Este archivo
```

---

## 16. Ejecución y desarrollo local

### 15.1 Requisitos

- Node.js 20+
- npm 10+
- Backend de Quédate en ejecución (por defecto `http://localhost:8080`)

### 15.2 Instalación

```bash
cd quedate-frontend
npm install
cp .env.example .env
```

### 15.3 Variables de entorno (`.env`)

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_GOOGLE_MAPS_API_KEY=   # opcional
```

### 15.4 Desarrollo

```bash
npm run dev
```

El servidor de desarrollo corre en `http://localhost:3000` con HMR (Hot Module Replacement).

### 15.5 Scripts disponibles

| Script | Comando | Descripción |
|---|---|---|
| `dev` | `vite` | Servidor de desarrollo con HMR. |
| `build` | `tsc -b && vite build` | Type-check + build de producción. |
| `lint` | `oxlint` | Linting con oxlint. |
| `test` | `vitest run` | Ejecutar tests unitarios. |
| `preview` | `vite preview` | Preview del build de producción. |

### 15.6 Troubleshooting

| Problema | Solución |
|---|---|
| CORS error | Verificar que el backend permite `http://localhost:3000` en `CORS_ALLOWED_ORIGINS`. |
| Backend no disponible | Verificar que el backend corre en `:8080` (`mvn spring-boot:run`). |
| Tokens expirados | Limpiar `sessionStorage` y volver a iniciar sesión. |
| Build falla por tipos | Ejecutar `npx tsc --noEmit` para ver errores de tipo. |
| Tests fallan por DOM | Verificar que `vitest.config.ts` usa entorno `jsdom`. |

---

## 17. Build y deployment

### 16.1 Build de producción

```bash
npm run build
```

Genera la carpeta `dist/` con assets optimizados (code splitting, tree shaking, minificación).

### 16.2 Preview local

```bash
npm run preview
```

Sirve el build de producción en `http://localhost:4173`.

### 16.3 Deployment (pendiente)

| Plataforma | Estado | Notas |
|---|---|---|
| Vercel | Pendiente | Conectar repo GitHub, configurar `VITE_API_BASE_URL`. |
| Netlify | Alternativa | Build command: `npm run build`, publish dir: `dist`. |

**Variables de entorno en producción:**
- `VITE_API_BASE_URL`: URL del backend desplegado (ej. `https://api.quedate.com/api/v1`).
- `VITE_GOOGLE_MAPS_API_KEY`: API key de Google Maps (opcional).

**Nota sobre Vercel:** cada `git push` a la rama conectada genera un nuevo deploy automáticamente. El link se mantiene igual.

---

## 18. Verificación y calidad

### 17.1 Checks realizados

| Check | Comando | Resultado |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | ✅ 0 errores |
| Build | `npm run build` | ✅ 5.04s, 2948 módulos |
| Tests | `npm run test` | ✅ 1 suite, 3 tests passed |
| Lint | `npm run lint` | ✅ oxlint |

### 17.2 Integración con backend

- Registro como estudiante y arrendador: ✅
- Login con persistencia de sesión: ✅
- Búsqueda de habitaciones (70 resultados, paginación, filtros): ✅
- Detalle de habitación (galería, info, reseñas): ✅
- Perfil (edición, verificación): ✅
- Dashboard arrendador (stats, gestión): ✅
- Solicitudes y visitas: ✅
- Verificaciones (admin): ✅

---

## 19. Repositorios

| Componente | Repositorio |
|---|---|
| **Backend** (Spring Boot) | [MiguelAngelDominguez/quedate-backend](https://github.com/MiguelAngelDominguez/quedate-backend) |
| **Frontend Web** (React) | [MiguelAngelDominguez/quedate-frontend](https://github.com/MiguelAngelDominguez/quedate-frontend) |

---

## 20. Licencia

Proyecto académico — UTEC CS2031 DBP 2026-2. Uso educativo. Prohibida su distribución o uso comercial sin autorización.
