"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Producto {
    id: string;
    nombre: string;
    descripcion: string;
    categoria: string;
    precio: number;
    stock: number;
    calificacion: number;
    foto: string | null;
}

interface Favorito {
    id: string;
    usuario_id: string;
    producto_id: string;
    created_at: string;
    productos: Producto | null;
}

export default function FavoritosPage() {

    const [favoritos, setFavoritos] = useState<Favorito[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [eliminando, setEliminando] = useState<string | null>(null);

    const cargarFavoritos = async () => {

        try {

            setCargando(true);
            setError("");

            const respuesta = await fetch(
                "/api/favoritos",
                {
                    method: "GET",
                    cache: "no-store"
                }
            );

            const data = await respuesta.json();

            if (!respuesta.ok) {

                throw new Error(
                    data.error ||
                    "No se pudieron cargar los favoritos."
                );
            }

            setFavoritos(data || []);

        } catch (error) {

            console.error(
                "Error cargando favoritos:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "No se pudieron cargar los favoritos."
            );

        } finally {

            setCargando(false);

        }
    };

    useEffect(() => {

        cargarFavoritos();

    }, []);

    const eliminarFavorito = async (
        productoId: string
    ) => {

        try {

            setEliminando(productoId);

            const respuesta = await fetch(
                "/api/favoritos",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        producto_id: productoId
                    })
                }
            );

            const data = await respuesta.json();

            if (!respuesta.ok) {

                throw new Error(
                    data.error ||
                    "No se pudo eliminar el favorito."
                );
            }

            setFavoritos(
                favoritosActuales =>
                    favoritosActuales.filter(
                        favorito =>
                            favorito.producto_id !== productoId
                    )
            );

        } catch (error) {

            console.error(
                "Error eliminando favorito:",
                error
            );

            alert(
                error instanceof Error
                    ? error.message
                    : "No se pudo eliminar el favorito."
            );

        } finally {

            setEliminando(null);

        }
    };

    if (cargando) {

        return (
            <main className="max-w-6xl mx-auto px-6 py-10">

                <h1 className="text-4xl font-bold text-white">
                    ❤️ Mis favoritos
                </h1>

                <p className="text-slate-400 mt-4">
                    Cargando favoritos...
                </p>

            </main>
        );
    }

    if (error) {

        return (
            <main className="max-w-6xl mx-auto px-6 py-10">

                <Link
                    href="/productos"
                    className="text-blue-400 hover:text-blue-300"
                >
                    ← Volver a productos
                </Link>

                <h1 className="text-4xl font-bold text-white mt-6">
                    ❤️ Mis favoritos
                </h1>

                <div className="mt-8 bg-red-500/10 border border-red-500/30 rounded-xl p-5">

                    <p className="text-red-400">
                        {error}
                    </p>

                </div>

            </main>
        );
    }

    if (favoritos.length === 0) {

        return (
            <main className="max-w-6xl mx-auto px-6 py-10">

                <div className="flex items-center justify-between">

                    <div>

                        <Link
                            href="/productos"
                            className="text-blue-400 hover:text-blue-300"
                        >
                            ← Productos
                        </Link>

                        <h1 className="text-4xl font-bold text-white mt-4">
                            ❤️ Mis favoritos
                        </h1>

                    </div>

                </div>

                <div className="bg-slate-800 rounded-2xl p-10 mt-8 text-center">

                    <div className="text-6xl">
                        ❤️
                    </div>

                    <h2 className="text-2xl font-bold text-white mt-4">
                        Todavía no tienes favoritos
                    </h2>

                    <p className="text-slate-400 mt-2">
                        Guarda productos que te interesen para encontrarlos rápidamente.
                    </p>

                    <Link
                        href="/productos"
                        className="inline-block mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl"
                    >
                        Explorar productos
                    </Link>

                </div>

            </main>
        );
    }

    return (

        <main className="max-w-6xl mx-auto px-6 py-10">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                    <Link
                        href="/productos"
                        className="text-blue-400 hover:text-blue-300"
                    >
                        ← Productos
                    </Link>

                    <h1 className="text-4xl font-bold text-white mt-4">
                        ❤️ Mis favoritos
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Productos que has guardado para consultar después.
                    </p>

                </div>

                <span className="text-slate-400">
                    {favoritos.length}{" "}
                    {favoritos.length === 1
                        ? "producto"
                        : "productos"}
                </span>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

                {favoritos.map((favorito) => {

                    const producto = favorito.productos;

                    if (!producto) {
                        return null;
                    }

                    return (

                        <div
                            key={favorito.id}
                            className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg"
                        >

                            {producto.foto ? (

                                <img
                                    src={producto.foto}
                                    alt={producto.nombre}
                                    className="w-full h-56 object-cover"
                                />

                            ) : (

                                <div className="w-full h-56 bg-slate-700 flex items-center justify-center">

                                    <span className="text-6xl">
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

                                <div className="flex items-center gap-2 mt-4">

                                    <span className="text-yellow-400">
                                        {"★".repeat(
                                            Math.round(
                                                Number(
                                                    producto.calificacion
                                                )
                                            )
                                        )}
                                    </span>

                                    <span className="text-slate-400 text-sm">
                                        {producto.calificacion}/5
                                    </span>

                                </div>

                                <div className="flex items-center justify-between mt-5">

                                    <span className="text-2xl font-bold text-white">
                                        $
                                        {Number(
                                            producto.precio
                                        ).toFixed(2)}
                                    </span>

                                    {producto.stock > 0 ? (

                                        <span className="text-green-400 text-sm">
                                            Disponible
                                        </span>

                                    ) : (

                                        <span className="text-red-400 text-sm">
                                            Agotado
                                        </span>

                                    )}

                                </div>

                                <div className="flex gap-3 mt-5">

                                    <Link
                                        href={`/productos/${producto.id}`}
                                        className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl"
                                    >
                                        Ver producto
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            eliminarFavorito(
                                                producto.id
                                            )
                                        }
                                        disabled={
                                            eliminando ===
                                            producto.id
                                        }
                                        className="px-4 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50 text-red-400 font-semibold rounded-xl"
                                    >
                                        {eliminando ===
                                        producto.id
                                            ? "..."
                                            : "♥"}
                                    </button>

                                </div>

                            </div>

                        </div>

                    );
                })}

            </div>

        </main>
    );
}