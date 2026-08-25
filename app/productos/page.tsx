"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";

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
}

export default function ProductosPage() {

    const { agregarAlCarrito } = useCart();

    const [productos, setProductos] = useState<Producto[]>([]);
    const [favoritos, setFavoritos] = useState<string[]>([]);

    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const [procesandoFavorito, setProcesandoFavorito] =
        useState<string | null>(null);

    /*
     * ==========================================
     * CARGAR PRODUCTOS
     * ==========================================
     */

    useEffect(() => {

        const cargarProductos = async () => {

            try {

                setCargando(true);
                setError("");

                const respuesta = await fetch(
                    "/api/productos",
                    {
                        cache: "no-store"
                    }
                );

                if (!respuesta.ok) {

                    throw new Error(
                        "No se pudieron obtener los productos."
                    );
                }

                const data = await respuesta.json();

                if (!Array.isArray(data)) {

                    throw new Error(
                        "La respuesta del servidor no es válida."
                    );
                }

                setProductos(data);

            } catch (error) {

                console.error(
                    "Error cargando productos:",
                    error
                );

                setError(
                    "No se pudieron cargar los productos."
                );

            } finally {

                setCargando(false);

            }
        };

        cargarProductos();

    }, []);

    /*
     * ==========================================
     * CARGAR FAVORITOS
     * ==========================================
     */

    useEffect(() => {

        const cargarFavoritos = async () => {

            try {

                const respuesta = await fetch(
                    "/api/favoritos",
                    {
                        method: "GET",
                        cache: "no-store"
                    }
                );

                if (!respuesta.ok) {

                    console.error(
                        "No se pudieron cargar los favoritos."
                    );

                    return;
                }

                const data = await respuesta.json();

                if (!Array.isArray(data)) {

                    console.error(
                        "La respuesta de favoritos no es válida."
                    );

                    return;
                }

                const idsFavoritos = data
                    .map(
                        (favorito: Favorito) =>
                            favorito.producto_id
                    )
                    .filter(Boolean);

                setFavoritos(idsFavoritos);

            } catch (error) {

                console.error(
                    "Error cargando favoritos:",
                    error
                );

            }
        };

        cargarFavoritos();

    }, []);

    /*
     * ==========================================
     * AGREGAR / QUITAR FAVORITO
     * ==========================================
     */

    const toggleFavorito = async (
        productoId: string
    ) => {

        try {

            setProcesandoFavorito(productoId);

            const esFavorito =
                favoritos.includes(productoId);

            const respuesta = await fetch(
                "/api/favoritos",
                {
                    method: esFavorito
                        ? "DELETE"
                        : "POST",

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
                    "No se pudo actualizar el favorito."
                );
            }

            if (esFavorito) {

                setFavoritos(
                    favoritosActuales =>
                        favoritosActuales.filter(
                            id =>
                                id !== productoId
                        )
                );

            } else {

                setFavoritos(
                    favoritosActuales => [
                        ...favoritosActuales,
                        productoId
                    ]
                );

            }

        } catch (error) {

            console.error(
                "Error actualizando favorito:",
                error
            );

            alert(
                error instanceof Error
                    ? error.message
                    : "No se pudo actualizar el favorito."
            );

        } finally {

            setProcesandoFavorito(null);

        }
    };

    /*
     * ==========================================
     * CARGANDO
     * ==========================================
     */

    if (cargando) {

        return (

            <main className="max-w-6xl mx-auto px-6 py-10">

                <h1 className="text-4xl font-bold text-white">
                    Productos
                </h1>

                <p className="text-slate-400 mt-4">
                    Cargando productos...
                </p>

            </main>
        );
    }

    /*
     * ==========================================
     * ERROR
     * ==========================================
     */

    if (error) {

        return (

            <main className="max-w-6xl mx-auto px-6 py-10">

                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">

                    <h1 className="text-2xl font-bold text-red-400">
                        Error
                    </h1>

                    <p className="text-slate-400 mt-2">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            window.location.reload()
                        }
                        className="mt-5 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-3 rounded-lg"
                    >
                        Intentar nuevamente
                    </button>

                </div>

            </main>
        );
    }

    /*
     * ==========================================
     * PÁGINA DE PRODUCTOS
     * ==========================================
     */

    return (

        <main className="max-w-6xl mx-auto px-6 py-10">

            {/* ENCABEZADO */}

            <div className="mb-10">

                <Link
                    href="/dashboard"
                    className="text-blue-400 hover:text-blue-300"
                >
                    ← Dashboard
                </Link>

                <h1 className="text-4xl font-bold text-white mt-4">
                    Productos
                </h1>

                <p className="text-slate-400 mt-2">
                    Explora todos los productos disponibles en Marketplace.
                </p>

                <Link
                    href="/favoritos"
                    className="inline-block mt-4 text-red-400 hover:text-red-300 font-semibold"
                >
                    ❤️ Mis favoritos
                </Link>

            </div>

            {/* SIN PRODUCTOS */}

            {productos.length === 0 ? (

                <div className="bg-slate-800 rounded-2xl p-10 text-center">

                    <div className="text-5xl">
                        📦
                    </div>

                    <h2 className="text-2xl font-bold text-white mt-4">
                        No hay productos disponibles
                    </h2>

                    <p className="text-slate-400 mt-2">
                        Actualmente no existen productos publicados.
                    </p>

                </div>

            ) : (

                /* LISTA DE PRODUCTOS */

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {productos.map((producto) => {

                        const esFavorito =
                            favoritos.includes(
                                producto.id
                            );

                        const procesando =
                            procesandoFavorito ===
                            producto.id;

                        return (

                            <div
                                key={producto.id}
                                className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                            >

                                {/* IMAGEN */}

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

                                {/* INFORMACIÓN */}

                                <div className="p-5">

                                    <span className="inline-block text-blue-400 text-sm font-semibold">
                                        {producto.categoria}
                                    </span>

                                    {/* NOMBRE + FAVORITO */}

                                    <div className="flex items-start justify-between gap-3 mt-2">

                                        <h2 className="text-xl font-bold text-white">
                                            {producto.nombre}
                                        </h2>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleFavorito(
                                                    producto.id
                                                )
                                            }
                                            disabled={
                                                procesando
                                            }
                                            aria-label={
                                                esFavorito
                                                    ? "Quitar de favoritos"
                                                    : "Agregar a favoritos"
                                            }
                                            title={
                                                esFavorito
                                                    ? "Quitar de favoritos"
                                                    : "Agregar a favoritos"
                                            }
                                            className={`shrink-0 text-3xl leading-none transition-transform hover:scale-110 disabled:opacity-50 ${
                                                esFavorito
                                                    ? "text-red-500"
                                                    : "text-slate-400 hover:text-red-400"
                                            }`}
                                        >
                                            {procesando
                                                ? "..."
                                                : esFavorito
                                                    ? "♥"
                                                    : "♡"}
                                        </button>

                                    </div>

                                    {/* DESCRIPCIÓN */}

                                    <p className="text-slate-400 text-sm mt-2 line-clamp-3">
                                        {producto.descripcion}
                                    </p>

                                    {/* CALIFICACIÓN */}

                                    <div className="flex items-center gap-2 mt-4">

                                        <span className="text-yellow-400">

                                            {"★".repeat(
                                                Math.max(
                                                    0,
                                                    Math.min(
                                                        5,
                                                        Math.round(
                                                            Number(
                                                                producto.calificacion
                                                            ) || 0
                                                        )
                                                    )
                                                )
                                            )}

                                        </span>

                                        <span className="text-slate-500 text-sm">
                                            {Number(
                                                producto.calificacion || 0
                                            ).toFixed(1)}
                                            /5
                                        </span>

                                    </div>

                                    {/* PRECIO Y STOCK */}

                                    <div className="flex justify-between items-center mt-5">

                                        <span className="text-2xl font-bold text-white">
                                            $
                                            {Number(
                                                producto.precio
                                            ).toFixed(2)}
                                        </span>

                                        {producto.stock > 0 ? (

                                            <span className="text-green-400 text-sm">
                                                Stock: {producto.stock}
                                            </span>

                                        ) : (

                                            <span className="text-red-400 text-sm">
                                                Agotado
                                            </span>

                                        )}

                                    </div>

                                    {/* BOTONES */}

                                    <div className="flex flex-col gap-3 mt-5">

                                        <Link
                                            href={`/productos/${producto.id}`}
                                            className="w-full text-center bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
                                        >
                                            Ver detalles
                                        </Link>

                                        <button
                                            type="button"
                                            disabled={
                                                producto.stock <= 0
                                            }
                                            onClick={() => {

                                                agregarAlCarrito(
                                                    producto
                                                );

                                                alert(
                                                    "Producto agregado al carrito."
                                                );

                                            }}
                                            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 rounded-lg transition-colors"
                                        >
                                            🛒 Agregar al carrito
                                        </button>

                                    </div>

                                </div>

                            </div>

                        );
                    })}

                </div>

            )}

        </main>
    );
}