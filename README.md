# Vesor — Investment & Advisory (MVP v0.1)

Plataforma web donde un inversionista principiante se registra, ingresa los datos de una oportunidad de inversión y recibe una clasificación de riesgo (bajo / medio / alto) generada con IA (API de Claude), mostrada como semáforo con los factores que la sustentan. Incluye historial privado de análisis.

**Stack:** Next.js 14 (App Router, TypeScript) · Supabase (Auth + Postgres con RLS) · API de Claude (Anthropic) · Vercel.

## Correr en local (< 15 min)

Requisitos: Node.js 18.17+ y una cuenta gratuita en [Supabase](https://supabase.com) y una API key de [Anthropic](https://console.anthropic.com).

1. **Instalar dependencias**
   ```bash
   npm install
   ```
2. **Configurar Supabase**: confirmar que el proyecto del equipo es el configurado en `.env.local`. Abrir *SQL Editor → New query*, pegar el contenido de `supabase/schema.sql` y ejecutar (crea la tabla `analyses` con seguridad por usuario).
3. **Acceso de demo**: en Supabase → *Authentication → Providers*, activar **Anonymous Sign-Ins**. Para desarrollo local, mantener desactivada la protección CAPTCHA. La aplicación usa una sesión anónima y no crea cuentas por correo.
4. **Variables de entorno**: copiar `.env.example` a `.env.local` y completar:
   - `NEXT_PUBLIC_SUPABASE_URL` → Supabase *Project Settings → API*.
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` → Supabase *Project Settings → API*. También se acepta `NEXT_PUBLIC_SUPABASE_ANON_KEY` por compatibilidad.
   - `ANTHROPIC_API_KEY` → console.anthropic.com. **Nunca** subirla al repositorio.
   - `ANTHROPIC_MODEL` (opcional, por defecto `claude-sonnet-5-5`).
5. **Iniciar**
   ```bash
   npm run dev
   ```
   Abrir http://localhost:3000.

## Estructura

```
src/app/                 Páginas (landing, login, registro, analizar, resultado/[id], historial)
src/app/api/analyze/     Endpoint: valida, llama a Claude, guarda en Supabase
src/lib/risk.ts          Prompt + motor de riesgo (validación de JSON y reintentos)
src/lib/types.ts         Tipos y validación de entrada
src/lib/supabase/        Clientes de Supabase (navegador y servidor)
src/middleware.ts        Protege rutas privadas y refresca la sesión
supabase/schema.sql      Esquema SQL + políticas RLS
```

## Notas de diseño

- La respuesta cruda del modelo se guarda (`raw_response`) para revisar errores repetidos y mejorar el prompt.
- El prompt trata el texto del usuario como datos (no instrucciones) y pide bajar la confianza cuando falta información.
- Requisitos no funcionales: HTTPS exclusivo (Vercel), contraseñas gestionadas por Supabase Auth, diseño responsivo para Chrome/Safari móvil.

## Despliegue

Ver sección de despliegue en Vercel: importar el repositorio, definir las 4 variables de entorno y desplegar.

## Aviso

Vesor es informativo y no constituye asesoría financiera.
