"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/** Formulario de correo y contraseña que sirve tanto para ingresar (`login`) como para crear cuenta (`registro`). */
export default function AuthForm({ mode }: { mode: "login" | "registro" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Escribe un correo válido, por ejemplo nombre@correo.com.");
    if (password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");

    setLoading(true);
    const supabase = createClient();

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setError("Correo o contraseña incorrectos. Revisa los datos o crea una cuenta.");
      router.push("/analizar");
      router.refresh();
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        if (/already|registered/i.test(error.message))
          return setError("Ese correo ya tiene cuenta. Ingresa desde la pantalla de login.");
        return setError("No pudimos crear la cuenta: " + error.message);
      }
      if (data.session) {
        router.push("/analizar");
        router.refresh();
      } else {
        setInfo("Cuenta creada. Revisa tu correo para confirmarla y luego ingresa.");
      }
    }
  }

  return (
    <div className="card" style={{ maxWidth: 440, margin: "24px auto" }}>
      <h1>{isLogin ? "Ingresar" : "Crear cuenta"}</h1>
      <p className="muted">
        {isLogin ? "Accede a tu historial de análisis." : "Guarda tus análisis de forma privada."}
      </p>
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="email">Correo</label>
        <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
        />
        {error && <div className="error">{error}</div>}
        {info && <div className="info">{info}</div>}
        <button className="btn block" disabled={loading}>
          {loading ? "Un momento…" : isLogin ? "Ingresar" : "Crear cuenta"}
        </button>
      </form>
      <p className="muted" style={{ marginTop: 16, textAlign: "center" }}>
        {isLogin ? (
          <>
            ¿No tienes cuenta? <Link href="/registro">Regístrate</Link>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta? <Link href="/login">Ingresa</Link>
          </>
        )}
      </p>
    </div>
  );
}
