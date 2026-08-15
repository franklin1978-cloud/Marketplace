"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {

    const supabase = createClient();

    const [usuario, setUsuario] = useState<User | null>(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {

        const obtenerUsuario = async () => {

            const {
                data: { user }
            } = await supabase.auth.getUser();

            setUsuario(user);
            setCargando(false);
        };

        obtenerUsuario();

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange(
            (_event, session) => {

                setUsuario(
                    session?.user ?? null
                );

            }
        );

        return () => {
            subscription.unsubscribe();
        };

    }, [supabase]);

    const cerrarSesion = async () => {

        await supabase.auth.signOut();

        setUsuario(null);

        window.location.href = "/";
    };

    return (

        <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4">

            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* LOGO */}

                <Link
                    href="/"
                    className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
                >
                    Marketplace
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

                    <Link
                        href="/carrito"
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        🛒 Carrito
                    </Link>

                    {!cargando && usuario ? (

                        <>

                            <Link
                                href="/dashboard"
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                Dashboard
                            </Link>

                            <span className="text-slate-300 text-sm">
                                👤{" "}
                                {usuario.user_metadata?.nombre ||
                                    usuario.email}
                            </span>

                            <button
                                onClick={cerrarSesion}
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                Salir
                            </button>

                        </>

                    ) : (

                        !cargando && (

                            <Link
                                href="/login"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                Login
                            </Link>

                        )

                    )}

                </div>

            </div>

        </nav>
    );
}