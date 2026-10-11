import type { Nivel } from "@/lib/types";

const ETIQUETA: Record<Nivel, string> = { bajo: "Riesgo bajo", medio: "Riesgo medio", alto: "Riesgo alto" };

/** Texto legible para un nivel de riesgo, p. ej. "Riesgo alto". */
export function nivelLabel(n: Nivel) {
  return ETIQUETA[n];
}

/** Semáforo visual que enciende la luz correspondiente al nivel de riesgo. */
export default function Semaforo({ nivel }: { nivel: Nivel }) {
  return (
    <div className="semaforo" role="img" aria-label={ETIQUETA[nivel]}>
      <div className={`luz rojo ${nivel === "alto" ? "on" : ""}`} />
      <div className={`luz amarillo ${nivel === "medio" ? "on" : ""}`} />
      <div className={`luz verde ${nivel === "bajo" ? "on" : ""}`} />
    </div>
  );
}
