"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    const manejarLogin = (e: React.FormEvent) => {

        e.preventDefault();

        console.log({
            correo,
            password
        });

        alert("Inicio de sesión realizado correctamente");
    };

    return (

        <main className="min-h-screen flex items-center justify-center px-6 py-10">

            <div className="w-full max-w-md">

                <div className="bg-slate-800 rounded-2xl shadow-xl p-8">

                    {/* TITULO */}

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

                    {/* FORMULARIO */}

                    <form
                        onSubmit={manejarLogin}
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
                                placeholder="correo@ejemplo.com"
                                required
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                            />

                        </div>

                        {/* CONTRASEÑA */}

                        <div>

                            <div className="flex justify-between mb-2">

                                <label className="text-sm font-semibold text-slate-300">
                                    Contraseña
                                </label>

                                <button
                                    type="button"
                                    className="text-xs text-blue-400 hover:text-blue-300"
                                    onClick={() =>
                                        alert(
                                            "La recuperación de contraseña estará disponible próximamente."
                                        )
                                    }
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>

                            </div>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="********"
                                required
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                            />

                        </div>

                        {/* RECORDAR */}

                        <div className="flex items-center gap-2">

                            <input
                                type="checkbox"
                                id="recordar"
                                className="w-4 h-4"
                            />

                            <label
                                htmlFor="recordar"
                                className="text-sm text-slate-400"
                            >
                                Recordar sesión
                            </label>

                        </div>

                        {/* BOTON */}

                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors"
                        >
                            Iniciar sesión
                        </button>

                    </form>

                    {/* REGISTRO */}

                    <div className="text-center mt-6">

                        <p className="text-slate-400 text-sm">

                            ¿No tienes una cuenta?{" "}

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