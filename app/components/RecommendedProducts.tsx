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

interface RecommendedProductsProps {
    productoId: string;
}

export default function RecommendedProducts({
    productoId,
}: RecommendedProductsProps) {

    const [productos, setProductos] =
        useState<Producto[]>([]);

    const [cargando, setCargando] =
        useState(true);

    useEffect(() => {

        const cargarRecomendaciones =
            async () => {

                try {

                    setCargando(true);

                    const respuesta =
                        await fetch(
                            `/api/recomendaciones?productoId=${encodeURIComponent(productoId)}`,
                            {
                                cache: "no-store",
                            }
                        );

                    if (!respuesta.ok) {
                        throw new Error(
                            "No se pudieron obtener las recomendaciones."
                        );
                    }

                    const data =
                        await respuesta.json();

                    if (Array.isArray(data)) {
                        setProductos(data);
                    } else {
                        setProductos([]);
                    }

                } catch (error) {

                    console.error(
                        "Error cargando recomendaciones:",
                        error
                    );

                    setProductos([]);

                } finally {

                    setCargando(false);

                }

            };

        if (productoId) {
            cargarRecomendaciones();
        }

    }, [productoId]);

    if (cargando) {
        return (
            <section className="mt-12">
                <h2 className="text-2xl font-bold text-white">
                    También te puede interesar
                </h2>

                <p className="text-slate-400 mt-4">
                    Cargando recomendaciones...
                </p>
            </section>
        );
    }

    if (productos.length === 0) {
        return null;
    }

    return (
        <section className="mt-12">

            <h2 className="text-2xl font-bold text-white">
                También te puede interesar
            </h2>

            <p className="text-slate-400 mt-2">
                Productos relacionados con lo que estás viendo.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-6">

                {productos.map((producto) => (

                    <Link
                        key={producto.id}
                        href={`/productos/${producto.id}`}
                        className="bg-slate-800 rounded-2xl overflow-hidden hover:bg-slate-700 transition shadow-lg"
                    >

                        {producto.foto ? (

                            <img
                                src={producto.foto}
                                alt={producto.nombre}
                                className="w-full h-44 object-cover"
                            />

                        ) : (

                            <div className="w-full h-44 bg-slate-700 flex items-center justify-center">
                                <span className="text-5xl">
                                    📦
                                </span>
                            </div>

                        )}

                        <div className="p-4">

                            <span className="text-xs text-blue-400">
                                {producto.categoria}
                            </span>

                            <h3 className="text-white font-semibold mt-1 line-clamp-2">
                                {producto.nombre}
                            </h3>

                            <div className="flex items-center mt-2">

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

                                <span className="text-slate-500 text-xs ml-2">
                                    {Number(
                                        producto.calificacion || 0
                                    ).toFixed(1)}
                                </span>

                            </div>

                            <p className="text-white font-bold text-xl mt-3">
                                $
                                {Number(
                                    producto.precio
                                ).toFixed(2)}
                            </p>

                            {producto.stock > 0 ? (

                                <p className="text-green-400 text-xs mt-2">
                                    Disponible
                                </p>

                            ) : (

                                <p className="text-red-400 text-xs mt-2">
                                    Agotado
                                </p>

                            )}

                        </div>

                    </Link>

                ))}

            </div>

        </section>
    );
}