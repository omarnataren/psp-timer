# PSP Tracker

Aplicación web para registrar y gestionar datos del **Personal Software Process (PSP)**: tiempo por fase, defectos y resumen del plan de proyecto. Usa React + Vite en el frontend y Supabase como backend.

## Requisitos

- [Node.js](https://nodejs.org) v18+
- [pnpm](https://pnpm.io) (`npm install -g pnpm`)
- Una cuenta en [Supabase](https://supabase.com) con el proyecto y tablas creadas

## Configuración

1. Clona el repositorio e instala las dependencias:

```bash
git clone <url-del-repo>
cd psp-timer
pnpm install
```

2. Crea el archivo de variables de entorno en la raíz del proyecto:

```bash
# .env.local
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<tu-anon-key>
```

Puedes obtener estos valores en el dashboard de Supabase → **Project Settings → API**.

## Ejecutar en desarrollo

```bash
pnpm dev
```

La app estará disponible en [http://localhost:5173](http://localhost:5173).

## Compilar para producción

```bash
pnpm build
```

Los archivos compilados quedarán en la carpeta `dist/`.

## Estructura del proyecto

```
src/
├── api/          # Llamadas a la API REST de Supabase (axios)
├── components/   # Componentes de React (UI)
│   └── auth/     # Páginas de login y registro
├── hooks/        # Custom hooks (estado y lógica)
├── lib/          # Configuración de axios y cliente Supabase
└── constants.js  # Constantes y helpers compartidos
```
