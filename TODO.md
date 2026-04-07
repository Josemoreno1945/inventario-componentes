# TODO.md - Pasos para Desplegar Proyecto en Netlify (Frontend) y Render (Backend)

## Estado: [En Progreso]

### 1. [✅ COMPLETADO] Crear archivos de configuración

- `frontend/src/config.js`
- `frontend/netlify.toml`
- `render.yaml` (raíz)
- `.env.example`

### 2. [✅ COMPLETADO] Editar Backend

- `backend/index.js` (puerto dinámico)
- `backend/package.json` (script start)

### 3. [✅ COMPLETADO] Editar Frontend Config

- `frontend/vite.config.js` (base)

### 4. [✅ COMPLETADO] Actualizar URLs API en Frontend Pages

- `frontend/src/pages/Ubicaciones.jsx` ✅
- `frontend/src/pages/TiposComponentes.jsx` ✅
- `frontend/src/pages/Buscador.jsx` ✅
- `frontend/src/pages/Componentes.jsx` ✅
- `frontend/src/pages/Dashboard.jsx` ✅

### 5. [🔧 FIXED] better-sqlite3 aplicado. Push GitHub y re-deploy Render.

### 6. [PENDIENTE] Build frontend

### 7. [PENDIENTE] Deploy Frontend Netlify

### 8. [PENDIENTE] Deploy Backend Render

### 9. [COMPLETADO] Test end-to-end

_SQLite ok para Render (persistente vía volumes). Repo GitHub recomendado para auto-deploy._
