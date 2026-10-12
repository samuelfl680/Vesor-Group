import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import ScrollReveal from "@/components/ScrollReveal";

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
      <div className="landing-sparkles" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      <section className="landing-hero">
        <div className="landing-copy">
          <h1>Decide con contexto.</h1>
          <div className="landing-actions">
            <Link href={destination} className="btn landing-primary">{destinationLabel}</Link>
            <Link href="/analizar" className="landing-text-link">Explorar el simulador <span aria-hidden="true">↗</span></Link>
          </div>
        </div>

        <div className="scenario-orbit" aria-label="Visualización de escenarios de riesgo" role="img">
          <div className="orbit-ring orbit-ring-large"><span /></div>
          <div className="orbit-ring orbit-ring-small"><span /></div>
          <div className="orbit-company orbit-company-one"><div className="orbit-node"><Image src="/company-logos/tsmc.svg" alt="TSMC" width={72} height={30} /></div></div>
          <div className="orbit-company orbit-company-two"><div className="orbit-node"><Image src="/company-logos/microsoft.svg" alt="Microsoft" width={82} height={32} /></div></div>
          <div className="orbit-company orbit-company-three"><div className="orbit-node"><Image src="/company-logos/amd.svg" alt="AMD" width={60} height={30} /></div></div>
          <div className="orbit-company orbit-company-four"><div className="orbit-node"><Image src="/company-logos/nvidia.svg" alt="NVIDIA" width={70} height={30} /></div></div>
          <div className="orbit-core">
            <Image src="/vesor-invest-advisory.svg" alt="Vesor Invest and Advisory" width={138} height={138} className="orbit-brand-image" />
          </div>
        </div>
      </section>

      <ScrollReveal className="landing-process-wrap"><section className="landing-process" aria-label="Cómo funciona el simulador">
        <div className="process-heading"><p className="landing-kicker">Cómo funciona</p><h2>Del contexto a la simulación.</h2><p>Un recorrido breve: cada paso convierte una señal en una lectura más clara.</p></div>
        <div className="process-track">
          <div className="process-progress" />
          {[
            ["context", "Contexto", "Describe lo que sabes."],
            ["evidence", "Evidencia", "Filtra señales relevantes."],
            ["probability", "Probabilidad", "Estima riesgo e incertidumbre."],
            ["relations", "Relaciones", "Conecta empresas y escenarios."],
          ].map(([kind, title, text], index) => <article className="process-step" key={kind} style={{ "--step-delay": `${index * 1.4}s` } as React.CSSProperties}><span className={`process-icon process-icon-${kind}`}>{TrailIcon(kind)}</span><strong>{title}</strong><p>{text}</p></article>)}
        </div>
      </section></ScrollReveal>

      <ScrollReveal className="landing-principles-wrap"><section className="landing-principles" aria-label="Principios de Vesor">
        <article><span>01</span><h2>Evidencia</h2><p>Noticias y contexto filtrados antes de construir una lectura.</p></article>
        <article><span>02</span><h2>Probabilidad</h2><p>Una estimación con incertidumbre visible, no una promesa.</p></article>
        <article><span>03</span><h2>Perspectiva</h2><p>Relaciones empresariales para entender el efecto de cada señal.</p></article>
      </section></ScrollReveal>

      <ScrollReveal className="landing-final-cta-wrap"><section className="landing-final-cta">
        <div><p className="landing-kicker">Tu siguiente decisión merece contexto</p><h2>Empieza con una pregunta. Explora los escenarios.</h2></div>
        <Link href={destination} className="btn landing-primary">{destinationLabel}</Link>
      </section></ScrollReveal>
      <p className="landing-disclaimer">Vesor es una herramienta informativa. Sus estimaciones no constituyen asesoría financiera.</p>
    </div>
  );
}

function TrailIcon(kind: string) {
  if (kind === "evidence") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6" /><path d="m15 15 5 5" /></svg>;
  if (kind === "probability") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18c3-10 6-10 8-3s5 7 8-9" /><path d="M4 20h16" /></svg>;
  if (kind === "relations") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2.5" /><circle cx="18" cy="5" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m7 11 8-5M7 13l8 5" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M4 8h16M6 8l-4 7h8zM18 8l-3 6h6z" /></svg>;
}
