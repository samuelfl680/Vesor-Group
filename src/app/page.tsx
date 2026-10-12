import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import ScrollReveal from "@/components/ScrollReveal";
import ProcessTrail from "@/components/ProcessTrail";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const destination = user ? "/analizar" : "/login";
  const destinationLabel = "Abrir simulador";

  return (
    <div className="landing-home">
      <div className="landing-sparkles" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      <div className="landing-topbar"><Link href={destination} className="btn landing-sim-button">{destinationLabel} <span aria-hidden="true">↗</span></Link></div>
      <section className="landing-hero">
        <div className="landing-copy">
          <Image src="/vesor-hero-mark.png" alt="Vesor Group" width={390} height={130} className="landing-hero-mark" priority />
          <h1>Entiende el riesgo antes de mover tu dinero.</h1>
          <p className="landing-description">
            Simula escenarios empresariales, conecta señales y convierte la incertidumbre en contexto accionable.
          </p>
          <div className="landing-actions">
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
            <Image src="/vesor-orbit-logo-final.png" alt="Vesor" width={154} height={86} className="orbit-brand-image" />
          </div>
        </div>
      </section>

      <ScrollReveal className="landing-process-wrap"><ProcessTrail /></ScrollReveal>

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
