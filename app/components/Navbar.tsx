"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

interface Usuario {
    nombre: string;
    rol: "comprador" | "vendedor";
}

export default function Navbar() {

    const router = useRouter();
    const supabase = createClient();

    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {

        const cargarUsuario = async () => {

            try {

                const {
                    data: { user }
                } = await supabase.auth.getUser();

                if (!user) {
                    setUsuario(null);
                    return;
                }

                const {
                    data: perfil,
                    error
                } = await supabase
                    .from("perfiles")
                    .select("nombre, rol")
                    .eq("id", user.id)
                    .single();

                if (error) {
                    console.error(
                        "Error cargando perfil:",
                        error
                    );

                    setUsuario(null);
                    return;
                }

                setUsuario(perfil);

            } catch (error) {

                console.error(
                    "Error obteniendo usuario:",
                    error
                );

                setUsuario(null);

            } finally {

                setCargando(false);

            }
        };

        cargarUsuario();

        const {
            data: listener
        } = supabase.auth.onAuthStateChange(
            async (event, session) => {

                if (!session?.user) {

                    setUsuario(null);
                    return;

                }

                const {
                    data: perfil
                } = await supabase
                    .from("perfiles")
                    .select("nombre, rol")
                    .eq("id", session.user.id)
                    .single();

                if (perfil) {
                    setUsuario(perfil);
                }
            }
        );

        return () => {

            listener.subscription.unsubscribe();

        };

    }, [supabase]);

    const cerrarSesion = async () => {

        await supabase.auth.signOut();

        setUsuario(null);

        router.push("/login");
        router.refresh();
    };

    return (

        <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4">

            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* LOGO */}

                <Link
                    href="/"
                    className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
                >
                    DevPort
                </Link>

                {/* NAVEGACIÓN */}

                <div className="flex items-center gap-6">

                    <Link
                        href="/"
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        Inicio
                    </Link>

                    <Link
                        href="/productos"
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        Productos
                    </Link>

                    {!cargando && !usuario && (

                        <>
                            <Link
                                href="/login"
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                Login
                            </Link>

                            <Link
                                href="/registro"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                Crear cuenta
                            </Link>
                        </>

                    )}

                    {!cargando && usuario && (

                        <>

                            <Link
                                href="/dashboard"
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                Dashboard
                            </Link>

                            <Link
                                href="/carrito"
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                🛒 Carrito
                            </Link>

                            <div className="flex items-center gap-3">

                                <div className="text-right">

                                    <p className="text-white font-semibold text-sm">
                                        {usuario.nombre}
                                    </p>

                                    <p className="text-blue-400 text-xs capitalize">
                                        {usuario.rol}
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={cerrarSesion}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold px-4 py-2 rounded-lg transition-colors"
                                >
                                    Cerrar sesión
                                </button>

                            </div>

                        </>

                    )}

                </div>

            </div>

        </nav>
    );
}