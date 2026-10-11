"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/** Cierra la sesión de Supabase y vuelve a la página de inicio. */
export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      className="btn secondary"
      style={{ padding: "8px 14px", fontSize: 14 }}
      onClick={async () => {
        await createClient().auth.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      Salir
    </button>
  );
}
