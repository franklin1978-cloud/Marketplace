"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

interface VendedorGuardProps {
    children: ReactNode;
}

export default function VendedorGuard({
    children
}: VendedorGuardProps) {

    const router = useRouter();
    const supabase = createClient();

    const [verificando, setVerificando] = useState(true);
    const [autorizado, setAutorizado] = useState(false);

    useEffect(() => {

        const verificarVendedor = async () => {

            try {

                // Verificar sesión
                const {
                    data: { user },
                    error: errorUsuario
                } = await supabase.auth.getUser();

                if (errorUsuario || !user) {
                    router.replace("/login");
                    return;
                }

                // Obtener perfil
                const {
                    data: perfil,
                    error: errorPerfil
                } = await supabase
                    .from("perfiles")
                    .select("rol")
                    .eq("id", user.id)
                    .single();

                if (errorPerfil || !perfil) {
                    router.replace("/dashboard");
                    return;
                }

                // Verificar rol
                if (perfil.rol !== "vendedor") {
                    router.replace("/dashboard");
                    return;
                }

                // Usuario autorizado
                setAutorizado(true);

            } catch (error) {

                console.error(
                    "Error verificando vendedor:",
                    error
                );

                router.replace("/dashboard");

            } finally {

                setVerificando(false);

            }
        };

        verificarVendedor();

    }, [router, supabase]);

    // Mientras verifica
    if (verificando) {

        return (
            <main className="max-w-6xl mx-auto px-6 py-10">

                <p className="text-slate-400">
                    Verificando permisos...
                </p>

            </main>
        );
    }

    // Si no está autorizado
    if (!autorizado) {
        return null;
    }

    // Si es vendedor
    return <>{children}</>;
}