import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import MarketBoard from "@/components/MarketBoard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const destination = user ? "/analizar" : "/login";
  const destinationLabel = user ? "Abrir simulador" : "Iniciar sesión";

  return (
    <div className="landing-home">
      <div className="landing-glow landing-glow-cyan" />
      <div className="landing-glow landing-glow-gold" />
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="landing-kicker">Vesor Group · Inteligencia para decidir</p>
          <h1>Entiende el riesgo antes de mover tu dinero.</h1>
          <p className="landing-description">
            Simula escenarios empresariales, conecta señales y convierte la incertidumbre en contexto accionable.
          </p>
          <div className="landing-actions">
            <Link href={destination} className="btn landing-primary">{destinationLabel}</Link>
            <Link href="/analizar" className="landing-text-link">Explorar el simulador <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="landing-trust">
            <span className="trust-dot" /> Datos, relaciones y escenarios en una sola lectura
          </div>
        </div>

        <div className="scenario-orbit" aria-label="Visualización de escenarios de riesgo" role="img">
          <div className="orbit-ring orbit-ring-large"><span /></div>
          <div className="orbit-ring orbit-ring-small"><span /></div>
          <div className="orbit-node node-one">R</div>
          <div className="orbit-node node-two">N</div>
          <div className="orbit-node node-three">C</div>
          <div className="orbit-core">
            <ImageMark />
            <span>Riesgo</span>
            <strong>64%</strong>
          </div>
          <div className="orbit-label label-top">Escenarios</div>
          <div className="orbit-label label-bottom">Relaciones</div>
        </div>
      </section>

      <section className="landing-principles" aria-label="Principios de Vesor">
        <article><span>01</span><h2>Evidencia</h2><p>Noticias y contexto filtrados antes de construir una lectura.</p></article>
        <article><span>02</span><h2>Probabilidad</h2><p>Una estimación con incertidumbre visible, no una promesa.</p></article>
        <article><span>03</span><h2>Perspectiva</h2><p>Relaciones empresariales para entender el efecto de cada señal.</p></article>
      </section>

      <section className="landing-market-preview">
        <div className="landing-section-heading"><p className="landing-kicker">Una mirada al mercado</p><h2>Empresas que puedes seguir</h2><Link href="/analizar" className="landing-text-link">Ver simulador <span aria-hidden="true">↗</span></Link></div>
        <MarketBoard />
      </section>

      <section className="landing-final-cta">
        <div><p className="landing-kicker">Tu siguiente decisión merece contexto</p><h2>Empieza con una pregunta. Explora los escenarios.</h2></div>
        <Link href={destination} className="btn landing-primary">{destinationLabel}</Link>
      </section>
      <p className="landing-disclaimer">Vesor es una herramienta informativa. Sus estimaciones no constituyen asesoría financiera.</p>
    </div>
  );
}

function ImageMark() {
  return <div className="orbit-mark" aria-hidden="true"><span>V</span></div>;
}
