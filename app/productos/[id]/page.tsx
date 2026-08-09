"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Producto {
    id: string;
    nombre: string;
    descripcion: string;
    categoria: string;
    precio: number;
    stock: number;
    calificacion: number;
    foto: string;
}

export default function ProductoDetalle() {

    const params = useParams();

    const id = params.id as string;

    const [producto, setProducto] = useState<Producto | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const obtenerProducto = async () => {

            try {

                const respuesta = await fetch("/api/productos");

                if (!respuesta.ok) {
                    throw new Error("Error al obtener productos");
                }

                const productos: Producto[] = await respuesta.json();

                const encontrado = productos.find(
                    (producto) => String(producto.id) === String(id)
                );

                if (!encontrado) {
                    setError("Producto no encontrado");
                    return;
                }

                setProducto(encontrado);

            } catch (error) {

                console.error(error);
                setError("No se pudo cargar el producto");

            } finally {

                setCargando(false);

            }
        };

        if (id) {
            obtenerProducto();
        }

    }, [id]);

    if (cargando) {

        return (
            <main className="max-w-6xl mx-auto px-6 py-10">

                <p className="text-slate-400">
                    Cargando producto...
                </p>

            </main>
        );
    }

    if (error || !producto) {

        return (
            <main className="max-w-6xl mx-auto px-6 py-10">

                <h1 className="text-3xl font-bold text-white">
                    Producto no encontrado
                </h1>

                <p className="text-slate-400 mt-3">
                    {error}
                </p>

                <Link
                    href="/productos"
                    className="inline-block mt-6 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                    ← Volver a productos
                </Link>

            </main>
        );
    }

    return (

        <main className="max-w-6xl mx-auto px-6 py-10">

            <Link
                href="/productos"
                className="text-blue-400 hover:text-blue-300"
            >
                ← Volver a productos
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">

                <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg">

                    <img
                        src={producto.foto}
                        alt={producto.nombre}
                        className="w-full h-[450px] object-cover"
                    />

                </div>

                <div>

                    <span className="inline-block bg-blue-500/20 text-blue-400 text-sm font-semibold px-3 py-1 rounded-full">
                        {producto.categoria}
                    </span>

                    <h1 className="text-4xl font-bold text-white mt-4">
                        {producto.nombre}
                    </h1>

                    <div className="flex items-center mt-4">

                        <span className="text-yellow-400 text-xl">
                            {"★".repeat(Math.round(producto.calificacion))}
                        </span>

                        <span className="text-slate-400 ml-3">
                            {producto.calificacion} / 5
                        </span>

                    </div>

                    <p className="text-slate-300 text-lg mt-6 leading-relaxed">
                        {producto.descripcion}
                    </p>

                    <div className="mt-8">

                        <span className="text-4xl font-bold text-white">
                            ${producto.precio.toFixed(2)}
                        </span>

                    </div>

                    <div className="mt-4">

                        {producto.stock > 0 ? (

                            <span className="text-green-400">
                                ✓ Disponible — {producto.stock} unidades
                            </span>

                        ) : (

                            <span className="text-red-400">
                                ✕ Producto agotado
                            </span>

                        )}

                    </div>

                    <button
                        disabled={producto.stock === 0}
                        className="w-full mt-8 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-4 rounded-xl"
                    >
                        🛒 Agregar al carrito
                    </button>

                </div>

            </div>

            <section className="mt-12 bg-slate-800 rounded-2xl p-6">

                <h2 className="text-2xl font-bold text-white">
                    ⭐ Opiniones de compradores
                </h2>

                <p className="text-slate-400 mt-3">
                    Próximamente podrás consultar y publicar opiniones
                    sobre este producto.
                </p>

            </section>

        </main>
    );
}