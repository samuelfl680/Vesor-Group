import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Rutas que requieren sesión iniciada. */
const PROTEGIDAS = ["/analizar", "/historial", "/resultado"];

/**
 * Refresca la sesión de Supabase en cada petición y controla el acceso:
 * sin sesión redirige las rutas protegidas a /login, y con sesión saca al usuario de /login y /registro.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  if (!user && PROTEGIDAS.some((p) => path.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  if (user && (path === "/login" || path === "/registro")) {
    const url = request.nextUrl.clone();
    url.pathname = "/analizar";
    return NextResponse.redirect(url);
  }
  return response;
}

/** Excluye archivos estáticos, imágenes y rutas /api (que validan la sesión por su cuenta). */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
