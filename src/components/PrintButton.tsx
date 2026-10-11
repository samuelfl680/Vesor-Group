"use client";

/** Abre el diálogo de impresión del navegador para guardar el resultado como PDF. */
export default function PrintButton() {
  return (
    <button className="btn secondary" onClick={() => window.print()}>
      Descargar PDF
    </button>
  );
}
