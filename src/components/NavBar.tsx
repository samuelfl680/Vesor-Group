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
          src="/vesor-group-logo.svg"
          alt="Vesor Group"
          width={76}
          height={76}
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
          <Link href="/login">Iniciar sesión</Link>
        )}
      </div>
    </nav>
  );
}
