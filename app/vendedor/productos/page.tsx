"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

interface Producto {
    id: string;
    nombre: string;
    descripcion: string;
    categoria: string;
    precio: number;
    stock: number;
    calificacion: number;
    foto: string | null;
    created_at: string;
}

export default function MisProductosPage() {

    const supabase = createClient();

    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const cargarProductos = async () => {

        try {

            const {
                data: { user }
            } = await supabase.auth.getUser();

            if (!user) {
                return;
            }

            const {
                data,
                error
            } = await supabase
                .from("productos")
                .select("*")
                .eq("vendedor_id", user.id)
                .order("created_at", {
                    ascending: false
                });

            if (error) {
                throw error;
            }

            setProductos(data || []);

        } catch (error) {

            console.error(error);

            setError(
                "No se pudieron cargar tus productos."
            );

        } finally {

            setCargando(false);

        }
    };

    useEffect(() => {

        cargarProductos();

    }, []);

    const eliminarProducto = async (id: string) => {

        const confirmar = window.confirm(
            "¿Seguro que deseas eliminar este producto?"
        );

        if (!confirmar) {
            return;
        }

        const {
            error
        } = await supabase
            .from("productos")
            .delete()
            .eq("id", id);

        if (error) {

            console.error(error);

            alert(
                "No se pudo eliminar el producto."
            );

            return;
        }

        setProductos((productosActuales) =>
            productosActuales.filter(
                (producto) => producto.id !== id
            )
        );
    };

    if (cargando) {

        return (

            <main className="max-w-6xl mx-auto px-6 py-10">

                <p className="text-slate-400">
                    Cargando productos...
                </p>

            </main>
        );
    }

    return (

        <main className="max-w-6xl mx-auto px-6 py-10">

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                <div>

                    <Link
                        href="/dashboard"
                        className="text-blue-400 hover:text-blue-300"
                    >
                        ← Dashboard
                    </Link>

                    <h1 className="text-4xl font-bold text-white mt-4">
                        Mis productos
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Administra los productos que has publicado.
                    </p>

                </div>

                <Link
                    href="/vendedor/productos/nuevo"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl"
                >
                    ➕ Nuevo producto
                </Link>

            </div>

            {error && (

                <div className="mt-8 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">
                    {error}
                </div>

            )}

            {productos.length === 0 ? (

                <div className="bg-slate-800 rounded-2xl p-10 mt-8 text-center">

                    <div className="text-5xl">
                        📦
                    </div>

                    <h2 className="text-2xl font-bold text-white mt-4">
                        Todavía no tienes productos
                    </h2>

                    <p className="text-slate-400 mt-2">
                        Publica tu primer producto para comenzar a vender.
                    </p>

                    <Link
                        href="/vendedor/productos/nuevo"
                        className="inline-block mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl"
                    >
                        Publicar producto
                    </Link>

                </div>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

                    {productos.map((producto) => (

                        <div
                            key={producto.id}
                            className="bg-slate-800 rounded-2xl overflow-hidden"
                        >

                            {producto.foto ? (

                                <img
                                    src={producto.foto}
                                    alt={producto.nombre}
                                    className="w-full h-56 object-cover"
                                />

                            ) : (

                                <div className="w-full h-56 bg-slate-700 flex items-center justify-center">

                                    <span className="text-5xl">
                                        📦
                                    </span>

                                </div>

                            )}

                            <div className="p-5">

                                <span className="text-blue-400 text-sm font-semibold">
                                    {producto.categoria}
                                </span>

                                <h2 className="text-xl font-bold text-white mt-2">
                                    {producto.nombre}
                                </h2>

                                <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                                    {producto.descripcion}
                                </p>

                                <div className="flex justify-between items-center mt-5">

                                    <span className="text-2xl font-bold text-white">
                                        ${Number(producto.precio).toFixed(2)}
                                    </span>

                                    <span className="text-slate-400 text-sm">
                                        Stock: {producto.stock}
                                    </span>

                                </div>

                                <div className="flex gap-3 mt-5">

                                    <button
                                        onClick={() =>
                                            eliminarProducto(producto.id)
                                        }
                                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold py-2 rounded-lg"
                                    >
                                        Eliminar
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </main>
    );
}