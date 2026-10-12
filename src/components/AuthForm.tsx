"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInAnonymously();
    setLoading(false);
    if (error) return setError("No pudimos iniciar la demo: " + error.message);
    router.push("/analizar");
    router.refresh();
  }

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <Link href="/" className="auth-back">← Volver al inicio</Link>
        <Image src="/vesor-eye-logo.svg" alt="Vesor" width={260} height={188} className="auth-eye" priority />
        <Image src="/vesor-hero-mark.png" alt="Vesor Group" width={370} height={124} className="auth-wordmark" />
        <p>Contexto para decisiones con más perspectiva.</p>
      </section>
      <section className="auth-panel">
        <div className="auth-panel-inner">
          <p className="landing-kicker">Acceso demo</p>
          <h1>Iniciar sesión</h1>
          <p className="muted">Entra sin crear una cuenta ni usar correo.</p>
          <form onSubmit={onSubmit} noValidate>
            {error && <div className="error">{error}</div>}
            <button className="btn block auth-submit" disabled={loading}>
              {loading ? "Un momento…" : "Entrar a la demo"}
            </button>
          </form>
          <small className="auth-note">La sesión de prueba es anónima y puede reiniciarse entre dispositivos.</small>
        </div>
      </section>
    </div>
  );
}
