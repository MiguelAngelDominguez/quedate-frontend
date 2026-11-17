# Quédate — Frontend Web

Frontend web de la plataforma **Quédate** (CS2031 DBP · UTEC · 2026-2), desarrollado con React 19, Vite y TypeScript.

---

## Descripción

Aplicación web que consume la API REST del backend de Quédate para permitir a estudiantes buscar habitaciones cerca de su universidad, gestionar solicitudes y visitas, y a arrendadores administrar sus publicaciones y verificaciones.

---

## Integrantes y participación

| Nombre | GitHub | Responsabilidad | Participación |
|---|---|---|---|
| Miguel Angel Dominguez Valentin | [@MiguelAngelDominguez](https://github.com/MiguelAngelDominguez) | Fundación, seguridad, autenticación, usuarios, configuración base, integración frontend-backend | 50% |
| André Brando Mejía Vega | [@andremejia-hub](https://github.com/andremejia-hub) | Catálogo, habitaciones, ubicaciones, búsqueda, desarrollo y diseño del frontend web | 50% |
| Iker Yazid García Tapia | [@iygt8-iterate](https://github.com/iygt8-iterate) | *Se retiró del curso* | 0% |

---

## Repositorios

| Componente | Repositorio |
|---|---|
| **Backend** (Spring Boot) | [MiguelAngelDominguez/quedate-backend](https://github.com/MiguelAngelDominguez/quedate-backend) |
| **Frontend Web** (React) | [MiguelAngelDominguez/quedate-frontend](https://github.com/MiguelAngelDominguez/quedate-frontend) |

---

## Stack tecnológico

- **React 19** + **Vite 8** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**
- **Motion** (Framer Motion) + **Aceternity UI**
- **React Router 7**
- **Zustand** (estado) · **TanStack React Query** (datos)
- **Axios** (HTTP) · **Zod** + **React Hook Form** (formularios/validación)
- **Leaflet** (mapas) · **Embla Carousel** (galería)
- **Vitest** + Testing Library (tests)

---

## Funcionalidades principales

- Autenticación: registro e inicio de sesión (estudiante/arrendador) con persistencia de sesión.
- Búsqueda de habitaciones: filtros, paginación y mapa.
- Detalle de habitación: galería, reseñas, solicitud de alquiler y reseña.
- Perfil de usuario: edición de datos y solicitud de verificación (arrendador).
- Panel arrendador: dashboard, mis habitaciones, solicitudes y visitas.
- Administración: revisión de verificaciones.
- UI/UX: responsive, dark mode, breadcrumbs, toasts, skeletons y estados vacíos.

---

## Ejecución

### Requisitos
- Node.js 20+
- npm
- Backend de Quédate en ejecución (por defecto `http://localhost:8080`)

### Instalación y desarrollo
```bash
npm install
cp .env.example .env
npm run dev
```

El servidor de desarrollo corre en `http://localhost:3000`.

### Build y tests
```bash
npm run build
npm run test
npm run lint
```

---

## Variables de entorno

Definidas en `.env` (ver `.env.example`):

- `VITE_API_BASE_URL`: URL base del backend (ej. `http://localhost:8080/api/v1`).
- `VITE_GOOGLE_MAPS_API_KEY`: API key de Google Maps (opcional, según integración).

---

## Estructura

```
src/
├── components/   # ui, layout, rooms, aceternity, common
├── pages/        # páginas de la aplicación
├── services/     # clientes y servicios API
├── hooks/        # hooks personalizados
├── stores/       # estado global (Zustand)
├── schemas/      # esquemas de validación (Zod)
├── types/        # definiciones TypeScript
├── lib/          # utilidades
├── assets/       # recursos estáticos
├── App.tsx
├── main.tsx
└── index.css
```

---

## Deployment

| Componente | URL | Estado |
|---|---|---|
| Frontend Web | Por definir (despliegue pendiente) | Pendiente |
| Backend (API) | Por definir (despliegue cloud pendiente) | Pendiente |

> Las URLs finales se actualizarán cuando el despliegue esté disponible.

---

## Licencia

Proyecto académico — UTEC CS2031 DBP 2026-2. Uso educativo.
