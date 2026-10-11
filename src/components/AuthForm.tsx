"use client";

import { useState } from "react";
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
    <div className="card" style={{ maxWidth: 440, margin: "24px auto" }}>
      <h1>Entrar a la demo</h1>
      <p className="muted">Prueba Vesor sin crear una cuenta ni usar correo.</p>
      <form onSubmit={onSubmit} noValidate>
        {error && <div className="error">{error}</div>}
        <button className="btn block" disabled={loading}>
          {loading ? "Un momento…" : "Entrar a la demo"}
        </button>
      </form>
    </div>
  );
}
