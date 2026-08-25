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
    const [error, setError] = useState("");

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

                if (!user) {

                    router.push("/login");

                    return;
                }

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

    // --------------------------------
    // CARGANDO
    // --------------------------------

    if (cargando) {

        return (

            <main className="max-w-6xl mx-auto px-6 py-10">

                <p className="text-slate-400">
                    Cargando dashboard...
                </p>

            </main>

        );
    }

    // --------------------------------
    // ERROR
    // --------------------------------

    if (error) {

        return (

            <main className="max-w-6xl mx-auto px-6 py-10">

                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">

                    <h1 className="text-xl font-bold text-red-400">
                        Error
                    </h1>

                    <p className="text-slate-400 mt-2">
                        {error}
                    </p>

                </div>

            </main>

        );
    }

    // --------------------------------
    // SIN PERFIL
    // --------------------------------

    if (!perfil) {

        return (

            <main className="max-w-6xl mx-auto px-6 py-10">

                <h1 className="text-3xl font-bold text-white">
                    Perfil no encontrado
                </h1>

                <p className="text-slate-400 mt-3">
                    No encontramos información de tu perfil.
                </p>

            </main>

        );
    }

    // --------------------------------
    // DASHBOARD
    // --------------------------------

    return (

        <main className="max-w-6xl mx-auto px-6 py-10">

            {/* ENCABEZADO */}

            <div className="mb-10">

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

            {/* INFORMACIÓN DEL PERFIL */}

            <section className="bg-slate-800 rounded-2xl p-6 mb-8">

                <h2 className="text-2xl font-bold text-white">
                    Mi perfil
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

                    <div>

                        <p className="text-slate-500 text-sm">
                            Nombre
                        </p>

                        <p className="text-white font-semibold mt-1">
                            {perfil.nombre}
                        </p>

                    </div>

                    <div>

                        <p className="text-slate-500 text-sm">
                            Correo
                        </p>

                        <p className="text-white font-semibold mt-1">
                            {perfil.correo}
                        </p>

                    </div>

                    <div>

                        <p className="text-slate-500 text-sm">
                            Tipo de cuenta
                        </p>

                        <p className="text-blue-400 font-semibold mt-1 capitalize">
                            {perfil.rol}
                        </p>

                    </div>

                </div>

            </section>

            {/* ============================= */}
            {/* PANEL COMPRADOR */}
            {/* ============================= */}

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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

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

                        {/* PEDIDOS */}

                        <Link
                            href="/pedidos"
                            className="bg-slate-800 hover:bg-slate-700 rounded-2xl p-6 transition-colors"
                        >

                            <div className="text-4xl">
                                📦
                            </div>

                            <h3 className="text-xl font-bold text-white mt-4">
                                Mis pedidos
                            </h3>

                            <p className="text-slate-400 mt-2">
                                Consulta el historial de tus compras.
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
                                Administra las opiniones que has publicado.
                            </p>

                        </div>

                    </div>

                </section>

            )}

            {/* ============================= */}
            {/* PANEL VENDEDOR */}
            {/* ============================= */}

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

                        <Link
                            href="/vendedor/ventas"
                            className="bg-slate-800 hover:bg-slate-700 rounded-2xl p-6 transition-colors"
                        >

                            <div className="text-4xl">
                                💰
                            </div>

                            <h3 className="text-xl font-bold text-white mt-4">
                                Mis ventas
                            </h3>

                            <p className="text-slate-400 mt-2">
                                Consulta los productos vendidos y los pedidos recibidos.
                            </p>

                        </Link>

                        {/* INVENTARIO */}

                        <Link
                            href="/vendedor/inventario"
                            className="bg-slate-800 hover:bg-slate-700 rounded-2xl p-6 transition-colors"
                        >

                            <div className="text-4xl">
                                📊
                            </div>

                            <h3 className="text-xl font-bold text-white mt-4">
                                Inventario
                            </h3>

                            <p className="text-slate-400 mt-2">
                                Administra el stock y controla la disponibilidad de tus productos.
                            </p>

                        </Link>

                    </div>

                </section>

            )}

        </main>
    );
}