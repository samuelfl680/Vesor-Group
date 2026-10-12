import Link from "next/link";
import Image from "next/image";
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
        <Image
          src="/vesor-group-logo.png"
          alt="Vesor Group"
          width={156}
          height={50}
          priority
          className="brand-logo"
        />
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
