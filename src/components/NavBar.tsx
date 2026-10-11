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
            <Link href="/">Inicio</Link>
            <Link href="/analizar">Simulador</Link>
            <Link href="/historial">Historial</Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/analizar">Simulador</Link>
            <Link href="/login">Entrar a la demo</Link>
          </>
        )}
      </div>
    </nav>
  );
}
