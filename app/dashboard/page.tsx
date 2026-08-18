"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

interface Perfil {
    id: string;
    nombre: string;
    correo: string;
    rol: "comprador" | "vendedor";
    telefono: string | null;
}

export default function DashboardPage() {

    const router = useRouter();
    const supabase = createClient();

    const [perfil, setPerfil] = useState<Perfil | null>(null);
    const [cargando, setCargando] = useState(true);
    const [cerrandoSesion, setCerrandoSesion] = useState(false);
    const [error, setError] = useState("");

    // ==========================================
    // CARGAR PERFIL DEL USUARIO
    // ==========================================

    useEffect(() => {

        const cargarPerfil = async () => {

            try {

                const {
                    data: { user },
                    error: errorUsuario
                } = await supabase.auth.getUser();

                if (errorUsuario) {
                    throw errorUsuario;
                }

                // Si no existe sesión, volver al login
                if (!user) {

                    router.push("/login");

                    return;
                }

                // Buscar perfil del usuario
                const {
                    data,
                    error: errorPerfil
                } = await supabase
                    .from("perfiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (errorPerfil) {
                    throw errorPerfil;
                }

                setPerfil(data);

            } catch (error) {

                console.error(
                    "Error cargando perfil:",
                    error
                );

                setError(
                    "No se pudo cargar la información del usuario."
                );

            } finally {

                setCargando(false);

            }
        };

        cargarPerfil();

    }, [router, supabase]);

    // ==========================================
    // CERRAR SESIÓN
    // ==========================================

    const cerrarSesion = async () => {

        setCerrandoSesion(true);
        setError("");

        try {

            const { error } =
                await supabase.auth.signOut();

            if (error) {
                throw error;
            }

            router.push("/login");
            router.refresh();

        } catch (error) {

            console.error(
                "Error cerrando sesión:",
                error
            );

            setError(
                "No se pudo cerrar la sesión."
            );

            setCerrandoSesion(false);
        }
    };

    // ==========================================
    // CARGANDO
    // ==========================================

    if (cargando) {

        return (

            <main className="max-w-6xl mx-auto px-6 py-10">

                <p className="text-slate-400">
                    Cargando dashboard...
                </p>

            </main>

        );
    }

    // ==========================================
    // ERROR
    // ==========================================

    if (error && !perfil) {

        return (

            <main className="max-w-6xl mx-auto px-6 py-10">

                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">

                    <h1 className="text-xl font-bold text-red-400">
                        Error
                    </h1>

                    <p className="text-slate-400 mt-2">
                        {error}
                    </p>

                    <Link
                        href="/login"
                        className="inline-block mt-5 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-3 rounded-lg"
                    >
                        Ir al login
                    </Link>

                </div>

            </main>

        );
    }

    // ==========================================
    // SIN PERFIL
    // ==========================================

    if (!perfil) {

        return (

            <main className="max-w-6xl mx-auto px-6 py-10">

                <h1 className="text-3xl font-bold text-white">
                    Perfil no encontrado
                </h1>

                <p className="text-slate-400 mt-3">
                    No encontramos información de tu perfil.
                </p>

                <button
                    type="button"
                    onClick={cerrarSesion}
                    className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-3 rounded-lg"
                >
                    Cerrar sesión
                </button>

            </main>

        );
    }

    // ==========================================
    // DASHBOARD
    // ==========================================

    return (

        <main className="max-w-6xl mx-auto px-6 py-10">

            {/* ================================== */}
            {/* ENCABEZADO */}
            {/* ================================== */}

            <div className="mb-10">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    <div>

                        <p className="text-blue-400 font-semibold">
                            Dashboard
                        </p>

                        <h1 className="text-4xl font-bold text-white mt-2">
                            Hola, {perfil.nombre} 👋
                        </h1>

                        <p className="text-slate-400 mt-2">
                            Bienvenido a tu panel de usuario.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={cerrarSesion}
                        disabled={cerrandoSesion}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold px-5 py-3 rounded-lg transition-colors"
                    >

                        {cerrandoSesion
                            ? "Cerrando sesión..."
                            : "Cerrar sesión"
                        }

                    </button>

                </div>

            </div>

            {/* ================================== */}
            {/* MENSAJE DE ERROR */}
            {/* ================================== */}

            {error && (

                <div className="mb-8 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">
                    {error}
                </div>

            )}

            {/* ================================== */}
            {/* INFORMACIÓN DEL PERFIL */}
            {/* ================================== */}

            <section className="bg-slate-800 rounded-2xl p-6 mb-8">

                <h2 className="text-2xl font-bold text-white">
                    Mi perfil
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

                    {/* NOMBRE */}

                    <div>

                        <p className="text-slate-500 text-sm">
                            Nombre
                        </p>

                        <p className="text-white font-semibold mt-1">
                            {perfil.nombre}
                        </p>

                    </div>

                    {/* CORREO */}

                    <div>

                        <p className="text-slate-500 text-sm">
                            Correo
                        </p>

                        <p className="text-white font-semibold mt-1 break-all">
                            {perfil.correo}
                        </p>

                    </div>

                    {/* ROL */}

                    <div>

                        <p className="text-slate-500 text-sm">
                            Tipo de cuenta
                        </p>

                        <p className="text-blue-400 font-semibold mt-1 capitalize">
                            {perfil.rol}
                        </p>

                    </div>

                </div>

                {/* TELÉFONO */}

                {perfil.telefono && (

                    <div className="mt-5">

                        <p className="text-slate-500 text-sm">
                            Teléfono
                        </p>

                        <p className="text-white font-semibold mt-1">
                            {perfil.telefono}
                        </p>

                    </div>

                )}

            </section>

            {/* ================================== */}
            {/* PANEL COMPRADOR */}
            {/* ================================== */}

            {perfil.rol === "comprador" && (

                <section>

                    <div className="flex items-center gap-3 mb-6">

                        <span className="text-3xl">
                            🛒
                        </span>

                        <div>

                            <h2 className="text-2xl font-bold text-white">
                                Panel de comprador
                            </h2>

                            <p className="text-slate-400">
                                Administra tus compras y actividad.
                            </p>

                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* PRODUCTOS */}

                        <Link
                            href="/productos"
                            className="bg-slate-800 hover:bg-slate-700 rounded-2xl p-6 transition-colors"
                        >

                            <div className="text-4xl">
                                🛍️
                            </div>

                            <h3 className="text-xl font-bold text-white mt-4">
                                Ver productos
                            </h3>

                            <p className="text-slate-400 mt-2">
                                Explora todos los productos disponibles.
                            </p>

                        </Link>

                        {/* CARRITO */}

                        <Link
                            href="/carrito"
                            className="bg-slate-800 hover:bg-slate-700 rounded-2xl p-6 transition-colors"
                        >

                            <div className="text-4xl">
                                🛒
                            </div>

                            <h3 className="text-xl font-bold text-white mt-4">
                                Mi carrito
                            </h3>

                            <p className="text-slate-400 mt-2">
                                Revisa los productos que deseas comprar.
                            </p>

                        </Link>

                        {/* OPINIONES */}

                        <div className="bg-slate-800 rounded-2xl p-6">

                            <div className="text-4xl">
                                ⭐
                            </div>

                            <h3 className="text-xl font-bold text-white mt-4">
                                Mis opiniones
                            </h3>

                            <p className="text-slate-400 mt-2">
                                Próximamente podrás administrar tus opiniones.
                            </p>

                        </div>

                    </div>

                </section>

            )}

            {/* ================================== */}
            {/* PANEL VENDEDOR */}
            {/* ================================== */}

            {perfil.rol === "vendedor" && (

                <section>

                    <div className="flex items-center gap-3 mb-6">

                        <span className="text-3xl">
                            🏪
                        </span>

                        <div>

                            <h2 className="text-2xl font-bold text-white">
                                Panel de vendedor
                            </h2>

                            <p className="text-slate-400">
                                Administra tus productos y ventas.
                            </p>

                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* PUBLICAR PRODUCTO */}

                        <Link
                            href="/vendedor/productos/nuevo"
                            className="bg-slate-800 hover:bg-slate-700 rounded-2xl p-6 transition-colors"
                        >

                            <div className="text-4xl">
                                ➕
                            </div>

                            <h3 className="text-xl font-bold text-white mt-4">
                                Publicar producto
                            </h3>

                            <p className="text-slate-400 mt-2">
                                Agrega un nuevo producto al Marketplace.
                            </p>

                        </Link>

                        {/* MIS PRODUCTOS */}

                        <Link
                            href="/vendedor/productos"
                            className="bg-slate-800 hover:bg-slate-700 rounded-2xl p-6 transition-colors"
                        >

                            <div className="text-4xl">
                                📦
                            </div>

                            <h3 className="text-xl font-bold text-white mt-4">
                                Mis productos
                            </h3>

                            <p className="text-slate-400 mt-2">
                                Administra los productos que has publicado.
                            </p>

                        </Link>

                        {/* VENTAS */}

                        <div className="bg-slate-800 rounded-2xl p-6">

                            <div className="text-4xl">
                                💰
                            </div>

                            <h3 className="text-xl font-bold text-white mt-4">
                                Mis ventas
                            </h3>

                            <p className="text-slate-400 mt-2">
                                Próximamente podrás consultar tus ventas.
                            </p>

                        </div>

                        {/* INVENTARIO */}

                        <div className="bg-slate-800 rounded-2xl p-6">

                            <div className="text-4xl">
                                📊
                            </div>

                            <h3 className="text-xl font-bold text-white mt-4">
                                Inventario
                            </h3>

                            <p className="text-slate-400 mt-2">
                                Próximamente podrás administrar tu inventario.
                            </p>

                        </div>

                    </div>

                </section>

            )}

        </main>
    );
}