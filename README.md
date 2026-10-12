# Vesor — Investment & Advisory (MVP v0.1)
<img width="416" height="134" alt="image" src="https://github.com/user-attachments/assets/e75516cb-5b91-4e97-972b-77ae0a1e75a4" />
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/e9d1d445-e721-4af7-9d84-5d93a9f75b56" />

Plataforma web que ayuda a un inversionista principiante a evaluar el riesgo de una oportunidad de inversión antes de poner su dinero. La persona entra a la demo sin crear cuenta, describe la oportunidad que le ofrecieron y ejecuta una simulación. Recibe un riesgo estimado, las señales de riesgo encontradas en su descripción y una recomendación de qué verificar.

**URL pública:** https://vesor-group.vercel.app/

**Stack:** Next.js 14 (App Router, TypeScript) · Supabase (Auth) · Vercel.

> **Estado del Release 1 (prototipo):** el riesgo se calcula en el navegador con reglas locales (palabras clave en el texto + riesgo base por empresa). Las noticias, las relaciones entre empresas y las cotizaciones son **datos de demostración**. La conexión con la API de Claude (`/api/analyze`) ya está en el código, pero la versión actual del simulador no la usa; se conectará en el Release 2.

## Funcionalidades (Release 1)

1. **Entrada a la demo con un clic**, sin correo ni contraseña (sesión anónima de Supabase).
2. **Página de inicio** con tablero de cotizaciones de NVIDIA, Tesla y Microsoft.
3. **Simulador configurable**: empresa, nivel de complejidad (1 a 6), rango de fechas y modo automático o personalizado.
4. **Análisis del contexto**: detecta señales como rentabilidad extraordinaria, promesa de garantía, presión de tiempo, pago en cripto o promoción informal, y da una recomendación.
5. **Resultado de la simulación**: riesgo estimado en %, desviación, confianza, tendencia, curva de distribución y pestañas de Evidencia, Relaciones y Escenarios.

## Correr en local (< 15 min)

Requisitos: Node.js 18.17+ y una cuenta gratuita en [Supabase](https://supabase.com).

1. **Instalar dependencias**
   ```bash
   npm install
   ```
2. **Configurar Supabase**: crear un proyecto e ir a *Authentication → Providers* para activar **Anonymous Sign-Ins**. En desarrollo local, dejar desactivada la protección CAPTCHA.
3. **Variables de entorno**: copiar `.env.example` a `.env.local` y completar:
   - `NEXT_PUBLIC_SUPABASE_URL` → Supabase *Project Settings → API*.
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` → Supabase *Project Settings → API*. También se acepta `NEXT_PUBLIC_SUPABASE_ANON_KEY` por compatibilidad.
   - `MARKET_DATA_PROVIDER` (opcional): por defecto `demo`. Usar `alpha-vantage` junto con `ALPHA_VANTAGE_API_KEY` para tener cotizaciones reales.
   - `ANTHROPIC_API_KEY` y `ANTHROPIC_MODEL` (opcionales en este release): solo los usa `/api/analyze`. **Nunca** subir claves al repositorio.
4. **Iniciar**
   ```bash
   npm run dev
   ```
   Abrir http://localhost:3000, pulsar **Entrar a la demo** y luego **Ejecutar simulación**.

5. *(Opcional, para el historial del Release 2)*: en Supabase abrir *SQL Editor → New query*, pegar el contenido de `supabase/schema.sql` y ejecutar. Crea la tabla `analyses` con seguridad por usuario.

## Cotizaciones de mercado

La página principal muestra una watchlist de NVIDIA (`NVDA`), Tesla (`TSLA`) y Microsoft (`MSFT`). Los datos pasan por `src/lib/market-data.ts` y `/api/market`, así que el proveedor se puede cambiar sin rehacer la página.

Sin clave configurada se muestran datos de demostración, marcados como tales en pantalla. El proveedor soportado es Alpha Vantage (`GLOBAL_QUOTE`); su plan gratuito tiene límites de uso y las cotizaciones pueden tener retraso, por lo que no deben presentarse como tiempo real.

## Estructura

```
src/app/                  Páginas (inicio, login, analizar, historial, resultado/[id])
src/app/api/market/       Endpoint de cotizaciones (proveedor demo o Alpha Vantage)
src/app/api/analyze/      Endpoint con IA: valida, llama a Claude y guarda en Supabase (para Release 2)
src/components/Simulator.tsx   Simulador: configuración, resultado y pestañas
src/components/MarketBoard.tsx Tablero de cotizaciones de la página de inicio
src/lib/simulation.ts     Lógica del simulador y detección de señales en el contexto
src/lib/market-data.ts    Proveedores de cotizaciones
src/lib/risk.ts           Prompt y motor de riesgo con Claude
src/lib/supabase/         Clientes de Supabase (navegador y servidor)
src/middleware.ts         Protege rutas privadas y refresca la sesión
supabase/schema.sql       Esquema SQL + políticas RLS
```

## Despliegue (Vercel)

1. Importar el repositorio en Vercel.
2. Definir las variables de entorno del paso 3 (mínimo `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
3. Desplegar. Vercel sirve la aplicación solo por HTTPS.

## Limitaciones conocidas

- El riesgo se calcula con reglas por palabras clave, no con IA.
- Solo se pueden simular tres empresas (NVIDIA, Tesla y Microsoft).
- Los resultados todavía no se guardan: el historial y la descarga en PDF pasan al Release 2.

## Aviso

Vesor es informativo y no constituye asesoría financiera.
