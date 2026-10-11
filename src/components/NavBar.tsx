import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

export default async function NavBar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="nav">
      <Link href="/" className="brand">
        Vesor
      </Link>
      <div className="links">
        {user ? (
          <>
            <Link href="/analizar">Nuevo análisis</Link>
            <Link href="/historial">Historial</Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login">Ingresar</Link>
            <Link href="/registro" className="btn" style={{ padding: "8px 14px", fontSize: 14 }}>
              Crear cuenta
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
