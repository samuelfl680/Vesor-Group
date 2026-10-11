import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import MarketBoard from "@/components/MarketBoard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const displayName = user && !user.is_anonymous
    ? user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "usuario"
    : "Anonymous";

  return (
    <>
      <section className="home-hero">
        <h1>Bienvenido, {displayName}</h1>
        <div className="actions">
          <Link href="/analizar" className="btn">
            Nuevo análisis
          </Link>
          {user ? (
            <Link href="/historial" className="btn secondary">
              Ver historial
            </Link>
          ) : (
            <Link href="/login" className="btn secondary">
              Entrar a la demo
            </Link>
          )}
        </div>
      </section>

      <MarketBoard />

      <div className="card home-guide">
        <h2>Decide con más contexto</h2>
        <ol>
          <li>Describe la oportunidad que estás considerando.</li>
          <li>Revisa las señales de riesgo que encuentra el análisis.</li>
          <li>Verifica la información con fuentes oficiales antes de invertir.</li>
        </ol>
        <p className="disclaimer">
          Las cotizaciones son informativas y pueden tener retraso. Vesor no constituye asesoría financiera.
        </p>
      </div>
    </>
  );
}
