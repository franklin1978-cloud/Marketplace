"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {

    const router = useRouter();
    const supabase = createClient();

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (
        e: FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setError("");
        setCargando(true);

        try {

            const { error } =
                await supabase.auth.signInWithPassword({
                    email: correo,
                    password: password
                });

            if (error) {
                throw error;
            }

            // Actualizamos la información de la sesión
            // y enviamos al usuario al inicio.
            router.push("/");
            router.refresh();

        } catch (error) {

            console.error(error);

            if (error instanceof Error) {
                setError(
                    "Correo o contraseña incorrectos."
                );
            } else {
                setError(
                    "No se pudo iniciar sesión."
                );
            }

        } finally {

            setCargando(false);

        }
    };

    return (

        <main className="min-h-screen flex items-center justify-center px-6 py-10">

            <div className="w-full max-w-md">

                <div className="bg-slate-800 rounded-2xl shadow-xl p-8">

                    {/* ENCABEZADO */}

                    <div className="text-center">

                        <div className="text-5xl mb-4">
                            🛒
                        </div>

                        <h1 className="text-3xl font-bold text-white">
                            Bienvenido
                        </h1>

                        <p className="text-slate-400 mt-2">
                            Inicia sesión en Marketplace
                        </p>

                    </div>

                    {/* ERROR */}

                    {error && (

                        <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4">
                            {error}
                        </div>

                    )}

                    {/* FORMULARIO */}

                    <form
                        onSubmit={handleLogin}
                        className="mt-8 space-y-5"
                    >

                        {/* CORREO */}

                        <div>

                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                Correo electrónico
                            </label>

                            <input
                                type="email"
                                value={correo}
                                onChange={(e) =>
                                    setCorreo(e.target.value)
                                }
                                required
                                placeholder="correo@ejemplo.com"
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                            />

                        </div>

                        {/* CONTRASEÑA */}

                        <div>

                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                Contraseña
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                                placeholder="********"
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                            />

                        </div>

                        {/* BOTÓN */}

                        <button
                            type="submit"
                            disabled={cargando}
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors"
                        >

                            {cargando
                                ? "Iniciando sesión..."
                                : "Iniciar sesión"
                            }

                        </button>

                    </form>

                    {/* REGISTRO */}

                    <div className="text-center mt-6">

                        <p className="text-slate-400 text-sm">

                            ¿No tienes una cuenta?

                            {" "}

                            <Link
                                href="/registro"
                                className="text-blue-400 hover:text-blue-300 font-semibold"
                            >
                                Crear cuenta
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </main>
    );
}