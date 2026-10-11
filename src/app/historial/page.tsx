import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Nivel } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HistorialPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("analyses")
    .select("id, created_at, nombre, nivel")
    .order("created_at", { ascending: false });

  return (
    <>
      <h1>Mis análisis</h1>
      {error && <div className="error">No pudimos cargar tu historial. Recarga la página.</div>}
      {!error && (!data || data.length === 0) && (
        <div className="card">
          <p>Aún no tienes análisis.</p>
          <Link href="/analizar" className="btn">
            Hacer mi primer análisis
          </Link>
        </div>
      )}
      {data?.map((a) => (
        <Link key={a.id} href={`/resultado/${a.id}`} className="list-item">
          <div>
            <strong>{a.nombre}</strong>
            <div className="muted">{new Date(a.created_at).toLocaleString("es-CO")}</div>
          </div>
          <span className={`badge ${a.nivel as Nivel}`}>{a.nivel}</span>
        </Link>
      ))}
    </>
  );
}
