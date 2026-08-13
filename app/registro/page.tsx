"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegistroPage() {

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("comprador");

    const manejarRegistro = (e: React.FormEvent) => {

        e.preventDefault();

        console.log({
            nombre,
            correo,
            password,
            rol
        });

        alert(
            `Registro realizado como ${rol === "comprador" ? "Comprador" : "Vendedor"}`
        );
    };

    return (

        <main className="min-h-screen flex items-center justify-center px-6 py-10">

            <div className="w-full max-w-md">

                <div className="bg-slate-800 rounded-2xl shadow-xl p-8">

                    <h1 className="text-3xl font-bold text-white text-center">
                        Crear cuenta
                    </h1>

                    <p className="text-slate-400 text-center mt-2">
                        Únete a nuestro Marketplace
                    </p>

                    <form
                        onSubmit={manejarRegistro}
                        className="mt-8 space-y-5"
                    >

                        {/* NOMBRE */}

                        <div>

                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                Nombre completo
                            </label>

                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ingresa tu nombre"
                                required
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                            />

                        </div>

                        {/* CORREO */}

                        <div>

                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                Correo electrónico
                            </label>

                            <input
                                type="email"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                placeholder="correo@ejemplo.com"
                                required
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                            />

                        </div>

                        {/* PASSWORD */}

                        <div>

                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                Contraseña
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                required
                                minLength={6}
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                            />

                        </div>

                        {/* ROL */}

                        <div>

                            <label className="block text-sm font-semibold text-slate-300 mb-3">
                                Tipo de cuenta
                            </label>

                            <div className="grid grid-cols-2 gap-4">

                                <button
                                    type="button"
                                    onClick={() => setRol("comprador")}
                                    className={`p-4 rounded-xl border transition-colors ${
                                        rol === "comprador"
                                            ? "border-blue-500 bg-blue-500/20"
                                            : "border-slate-700 bg-slate-900"
                                    }`}
                                >

                                    <div className="text-3xl">
                                        👤
                                    </div>

                                    <div className="text-white font-semibold mt-2">
                                        Comprador
                                    </div>

                                    <div className="text-slate-400 text-xs mt-1">
                                        Comprar productos
                                    </div>

                                </button>

                                <button
                                    type="button"
                                    onClick={() => setRol("vendedor")}
                                    className={`p-4 rounded-xl border transition-colors ${
                                        rol === "vendedor"
                                            ? "border-blue-500 bg-blue-500/20"
                                            : "border-slate-700 bg-slate-900"
                                    }`}
                                >

                                    <div className="text-3xl">
                                        🏪
                                    </div>

                                    <div className="text-white font-semibold mt-2">
                                        Vendedor
                                    </div>

                                    <div className="text-slate-400 text-xs mt-1">
                                        Publicar productos
                                    </div>

                                </button>

                            </div>

                        </div>

                        {/* BOTÓN */}

                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors"
                        >
                            Crear cuenta
                        </button>

                    </form>

                    {/* LOGIN */}

                    <p className="text-center text-slate-400 text-sm mt-6">

                        ¿Ya tienes una cuenta?{" "}

                        <Link
                            href="/login"
                            className="text-blue-400 hover:text-blue-300"
                        >
                            Iniciar sesión
                        </Link>

                    </p>

                </div>

            </div>

        </main>
    );
}