"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FUENTES, REGULADA, TIPOS, validarInput } from "@/lib/types";

export default function AnalizarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      nombre: fd.get("nombre"),
      tipo: fd.get("tipo"),
      fuente: fd.get("fuente"),
      rentabilidad_pct: fd.get("rentabilidad_pct"),
      periodo: fd.get("periodo"),
      monto: fd.get("monto"),
      regulada: fd.get("regulada"),
      garantizada: fd.get("garantizada") === "on",
      presion: fd.get("presion") === "on",
      evidencia: fd.get("evidencia"),
    };

    const v = validarInput(payload);
    if (!v.ok) {
      setFields(v.errors);
      setError("Revisa los campos marcados en rojo.");
      return;
    }
    setFields({});
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v.data),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.fields) setFields(json.fields);
        throw new Error(json.error || "No se pudo analizar.");
      }
      router.push(`/resultado/${json.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado. Intenta de nuevo.");
      setLoading(false);
    }
  }

  const Err = ({ k }: { k: string }) => (fields[k] ? <div className="field-error">{fields[k]}</div> : null);

  return (
    <div className="card">
      <h1>Nuevo análisis</h1>
      <p className="muted">Cuéntanos de la oportunidad. Entre más detalle des, mejor será la evaluación.</p>
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="nombre">Nombre de la empresa, proyecto o persona</label>
        <input id="nombre" name="nombre" maxLength={120} placeholder="Ej: CryptoGanancias Pro" />
        <Err k="nombre" />

        <div className="row">
          <div>
            <label htmlFor="tipo">Tipo de inversión</label>
            <select id="tipo" name="tipo" defaultValue="">
              <option value="" disabled>Selecciona…</option>
              {TIPOS.map((t) => <option key={t}>{t}</option>)}
            </select>
            <Err k="tipo" />
          </div>
          <div>
            <label htmlFor="fuente">¿Dónde la conociste?</label>
            <select id="fuente" name="fuente" defaultValue="">
              <option value="" disabled>Selecciona…</option>
              {FUENTES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <Err k="fuente" />
          </div>
        </div>

        <div className="row">
          <div>
            <label htmlFor="rentabilidad_pct">Rentabilidad prometida (%)</label>
            <input id="rentabilidad_pct" name="rentabilidad_pct" type="number" inputMode="decimal" step="any" placeholder="Ej: 15" />
            <Err k="rentabilidad_pct" />
          </div>
          <div>
            <label htmlFor="periodo">Periodo</label>
            <select id="periodo" name="periodo" defaultValue="mensual">
              <option value="mensual">Por mes</option>
              <option value="anual">Por año</option>
              <option value="total">Total (una sola vez)</option>
            </select>
            <Err k="periodo" />
          </div>
        </div>

        <div className="row">
          <div>
            <label htmlFor="monto">Monto que piensas invertir (COP)</label>
            <input id="monto" name="monto" type="number" inputMode="numeric" placeholder="Ej: 500000" />
            <Err k="monto" />
          </div>
          <div>
            <label htmlFor="regulada">¿Está regulada / supervisada?</label>
            <select id="regulada" name="regulada" defaultValue="">
              <option value="" disabled>Selecciona…</option>
              {REGULADA.map((t) => <option key={t}>{t}</option>)}
            </select>
            <Err k="regulada" />
          </div>
        </div>

        <label className="check">
          <input type="checkbox" name="garantizada" /> Prometen ganancias garantizadas o "sin riesgo"
        </label>
        <label className="check">
          <input type="checkbox" name="presion" /> Me presionan a decidir rápido (cupos limitados, solo hoy)
        </label>

        <label htmlFor="evidencia">Describe qué te prometen y cómo funciona</label>
        <textarea
          id="evidencia"
          name="evidencia"
          maxLength={3000}
          placeholder="Ej: Un influencer dice que depositando en su plataforma duplico mi dinero en 30 días. Me piden pagar a una billetera cripto…"
        />
        <Err k="evidencia" />

        {error && <div className="error">{error}</div>}
        {loading && <div className="info">Analizando la oportunidad… puede tardar unos segundos.</div>}

        <button className="btn block" disabled={loading}>
          {loading ? "Analizando…" : "Analizar riesgo"}
        </button>
      </form>
    </div>
  );
}
