import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Semaforo, { nivelLabel } from "@/components/Semaforo";
import PrintButton from "@/components/PrintButton";
import type { OportunidadInput, ResultadoRiesgo } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ResultadoPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("analyses")
    .select("id, created_at, nombre, input, resultado")
    .eq("id", params.id)
    .single();

  if (error || !data) notFound();

  const r = data.resultado as ResultadoRiesgo;
  const i = data.input as OportunidadInput;

  return (
    <>
      <div className="card">
        <p className="muted">
          {new Date(data.created_at).toLocaleString("es-CO")} · {i.tipo}
        </p>
        <h1>{data.nombre}</h1>
        <div className="semaforo-wrap">
          <Semaforo nivel={r.nivel} />
          <div>
            <span className={`badge ${r.nivel}`}>{nivelLabel(r.nivel)}</span>
            <p style={{ marginTop: 10 }}>{r.resumen}</p>
            <p className="muted">Confianza del análisis: {r.confianza}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Por qué esta clasificación</h2>
        {r.factores.map((f, idx) => (
          <div className="factor" key={idx}>
            <strong>{f.titulo}</strong>
            {f.detalle}
          </div>
        ))}
      </div>

      {(r.recomendacion || r.informacion_faltante.length > 0) && (
        <div className="card">
          <h2>Qué verificar antes de decidir</h2>
          {r.recomendacion && <p>{r.recomendacion}</p>}
          {r.informacion_faltante.length > 0 && (
            <>
              <p className="muted">Información que faltó para un análisis más seguro:</p>
              <ul>
                {r.informacion_faltante.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <div className="actions">
        <Link href="/analizar" className="btn">
          Nuevo análisis
        </Link>
        <Link href="/historial" className="btn secondary">
          Volver al historial
        </Link>
        <PrintButton />
      </div>
      <p className="disclaimer">
        Esta evaluación la genera una IA con base solo en lo que escribiste. No es asesoría financiera ni garantiza
        que una oportunidad sea legítima o fraudulenta. Verifica siempre con fuentes oficiales.
      </p>
    </>
  );
}
