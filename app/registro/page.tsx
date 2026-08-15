"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function RegistroPage() {

    const router = useRouter();
    const supabase = createClient();

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("comprador");

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleRegistro = async (
        e: FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setError("");
        setMensaje("");
        setCargando(true);

        if (password.length < 6) {

            setError(
                "La contraseña debe tener al menos 6 caracteres."
            );

            setCargando(false);
            return;
        }

        try {

            const { data, error } =
                await supabase.auth.signUp({
                    email: correo,
                    password: password,
                    options: {
                        data: {
                            nombre: nombre,
                            rol: rol,
                            telefono: telefono
                        }
                    }
                });

            if (error) {
                throw error;
            }

            /*
             * Si Supabase requiere confirmar el correo,
             * no tendremos una sesión inmediatamente.
             */
            if (!data.session) {

                setMensaje(
                    "Registro exitoso. Revisa tu correo para confirmar tu cuenta."
                );

                setNombre("");
                setCorreo("");
                setTelefono("");
                setPassword("");

                return;
            }

            setMensaje(
                "Cuenta creada correctamente. Redirigiendo..."
            );

            setTimeout(() => {
                router.push("/");
                router.refresh();
            }, 1000);

        } catch (error) {

            console.error(error);

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(
                    "No se pudo crear la cuenta."
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

                    <h1 className="text-3xl font-bold text-white text-center">
                        Crear cuenta
                    </h1>

                    <p className="text-slate-400 text-center mt-2">
                        Únete a nuestro Marketplace
                    </p>

                    {error && (

                        <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4">
                            {error}
                        </div>

                    )}

                    {mensaje && (

                        <div className="mt-6 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg p-4">
                            {mensaje}
                        </div>

                    )}

                    <form
                        onSubmit={handleRegistro}
                        className="mt-8 space-y-5"
                    >

                        <div>

                            <label className="block text-slate-300 mb-2">
                                Nombre completo
                            </label>

                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) =>
                                    setNombre(e.target.value)
                                }
                                required
                                placeholder="Juan Pérez"
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                            />

                        </div>

                        <div>

                            <label className="block text-slate-300 mb-2">
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

                        <div>

                            <label className="block text-slate-300 mb-2">
                                Teléfono
                            </label>

                            <input
                                type="tel"
                                value={telefono}
                                onChange={(e) =>
                                    setTelefono(e.target.value)
                                }
                                placeholder="0999999999"
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                            />

                        </div>

                        <div>

                            <label className="block text-slate-300 mb-2">
                                Tipo de usuario
                            </label>

                            <select
                                value={rol}
                                onChange={(e) =>
                                    setRol(e.target.value)
                                }
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                            >

                                <option value="comprador">
                                    Comprador
                                </option>

                                <option value="vendedor">
                                    Vendedor
                                </option>

                            </select>

                        </div>

                        <div>

                            <label className="block text-slate-300 mb-2">
                                Contraseña
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                                minLength={6}
                                placeholder="Mínimo 6 caracteres"
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                            />

                        </div>

                        <button
                            type="submit"
                            disabled={cargando}
                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 text-white font-bold py-3 rounded-lg transition-colors"
                        >

                            {cargando
                                ? "Creando cuenta..."
                                : "Crear cuenta"
                            }

                        </button>

                    </form>

                    <div className="text-center mt-6">

                        <p className="text-slate-400">

                            ¿Ya tienes una cuenta?

                            {" "}

                            <Link
                                href="/login"
                                className="text-blue-400 hover:text-blue-300"
                            >
                                Iniciar sesión
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </main>
    );
}