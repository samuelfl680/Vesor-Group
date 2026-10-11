import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Vesor — Evalúa el riesgo antes de invertir",
  description: "Clasificación de riesgo con IA para inversionistas principiantes.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <NavBar />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
