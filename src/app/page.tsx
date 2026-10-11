import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="card" style={{ marginTop: 24 }}>
        <h1>¿Vale la pena esa inversión o es un riesgo?</h1>
        <p>
          Vesor evalúa en segundos el riesgo de una oportunidad de inversión que viste en redes o te recomendaron,
          antes de que pongas tu dinero. Recibes un semáforo (bajo, medio o alto) y los factores que lo sustentan.
        </p>
        <div className="actions">
          <Link href="/registro" className="btn">
            Empezar gratis
          </Link>
          <Link href="/login" className="btn secondary">
            Ya tengo cuenta
          </Link>
        </div>
      </div>
      <div className="card">
        <h2>Cómo funciona</h2>
        <ol>
          <li>Crea tu cuenta con correo y contraseña.</li>
          <li>Cuéntanos de la oportunidad: qué es, cuánto prometen y de dónde la conociste.</li>
          <li>Recibe la clasificación con al menos dos razones concretas.</li>
          <li>Consulta tus análisis anteriores cuando quieras.</li>
        </ol>
        <p className="disclaimer">
          Vesor es una herramienta informativa y no constituye asesoría financiera. Siempre verifica con fuentes
          oficiales antes de invertir.
        </p>
      </div>
    </>
  );
}
