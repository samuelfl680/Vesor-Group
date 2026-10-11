import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validarInput } from "@/lib/types";
import { evaluarRiesgo } from "@/lib/risk";

/** Tiempo máximo (segundos) para la función, ya que la llamada a Claude puede tardar. */
export const maxDuration = 60;

/**
 * POST /api/analyze: valida los datos de la oportunidad, la evalúa con Claude y guarda el análisis.
 * Respuestas: 200 `{ id }`, 401 sin sesión, 400 JSON inválido, 422 `{ error, fields }` con errores por campo,
 * 500 si falla el análisis o el guardado.
 */
export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Debes iniciar sesión para analizar." }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const v = validarInput(body);
  if (!v.ok) return NextResponse.json({ error: "Revisa los campos marcados.", fields: v.errors }, { status: 422 });

  try {
    const { resultado, raw } = await evaluarRiesgo(v.data);
    const { data, error } = await supabase
      .from("analyses")
      .insert({
        user_id: user.id,
        nombre: v.data.nombre,
        input: v.data,
        nivel: resultado.nivel,
        resultado,
        raw_response: raw,
      })
      .select("id")
      .single();
    if (error) throw new Error("No se pudo guardar el análisis: " + error.message);
    return NextResponse.json({ id: data.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error inesperado.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
