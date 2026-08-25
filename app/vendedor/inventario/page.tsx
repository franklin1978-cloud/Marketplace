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

    created_at: string;
}

export default function InventarioPage() {

    const [productos, setProductos] =
        useState<Producto[]>([]);

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState("");

    const [actualizando, setActualizando] =
        useState<string | null>(null);


    /*
     * ==========================================
     * CARGAR INVENTARIO
     * ==========================================
     */

    const cargarInventario = async () => {

        try {

            setCargando(true);

            setError("");

            const respuesta =
                await fetch(
                    "/api/vendedor/inventario",
                    {
                        method: "GET",
                        cache: "no-store"
                    }
                );

            const data =
                await respuesta.json();

            if (!respuesta.ok) {

                throw new Error(
                    data.error ||
                    "No se pudo cargar el inventario."
                );
            }

            if (!Array.isArray(data)) {

                throw new Error(
                    "La respuesta del servidor no es válida."
                );
            }

            setProductos(data);

        } catch (error) {

            console.error(
                "Error cargando inventario:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "No se pudo cargar el inventario."
            );

        } finally {

            setCargando(false);
        }
    };


    /*
     * ==========================================
     * CARGA INICIAL
     * ==========================================
     */

    useEffect(() => {

        cargarInventario();

    }, []);


    /*
     * ==========================================
     * ACTUALIZAR STOCK
     * ==========================================
     */

    const actualizarStock = async (
        productoId: string,
        nuevoStock: number
    ) => {

        if (nuevoStock < 0) {

            return;
        }

        try {

            setActualizando(
                productoId
            );

            const respuesta =
                await fetch(
                    "/api/vendedor/inventario",
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            producto_id:
                                productoId,

                            stock:
                                nuevoStock
                        })
                    }
                );

            const data =
                await respuesta.json();

            if (!respuesta.ok) {

                throw new Error(
                    data.error ||
                    "No se pudo actualizar el stock."
                );
            }

            setProductos(
                productosActuales =>
                    productosActuales.map(
                        producto =>
                            producto.id ===
                            productoId
                                ? {
                                    ...producto,
                                    stock:
                                        data.stock
                                }
                                : producto
                    )
            );

        } catch (error) {

            console.error(
                "Error actualizando stock:",
                error
            );

            alert(
                error instanceof Error
                    ? error.message
                    : "No se pudo actualizar el stock."
            );

        } finally {

            setActualizando(null);
        }
    };


    /*
     * ==========================================
     * DISMINUIR STOCK
     * ==========================================
     */

    const disminuirStock = (
        producto: Producto
    ) => {

        if (producto.stock <= 0) {

            return;
        }

        actualizarStock(
            producto.id,
            producto.stock - 1
        );
    };


    /*
     * ==========================================
     * AUMENTAR STOCK
     * ==========================================
     */

    const aumentarStock = (
        producto: Producto
    ) => {

        actualizarStock(
            producto.id,
            producto.stock + 1
        );
    };


    /*
     * ==========================================
     * ESTADO DEL INVENTARIO
     * ==========================================
     */

    const obtenerEstadoStock = (
        stock: number
    ) => {

        if (stock <= 0) {

            return {
                texto: "Agotado",
                clase:
                    "bg-red-500/10 text-red-400 border-red-500/30"
            };
        }

        if (stock <= 5) {

            return {
                texto: "Stock bajo",
                clase:
                    "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
            };
        }

        return {
            texto: "Disponible",
            clase:
                "bg-green-500/10 text-green-400 border-green-500/30"
        };
    };


    /*
     * ==========================================
     * CARGANDO
     * ==========================================
     */

    if (cargando) {

        return (

            <main className="max-w-6xl mx-auto px-6 py-10">

                <Link
                    href="/dashboard"
                    className="text-blue-400 hover:text-blue-300"
                >
                    ← Dashboard
                </Link>

                <h1 className="text-4xl font-bold text-white mt-6">
                    Inventario
                </h1>

                <p className="text-slate-400 mt-4">
                    Cargando inventario...
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

                <Link
                    href="/dashboard"
                    className="text-blue-400 hover:text-blue-300"
                >
                    ← Dashboard
                </Link>

                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mt-6">

                    <h1 className="text-2xl font-bold text-red-400">
                        Error
                    </h1>

                    <p className="text-slate-400 mt-2">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={
                            cargarInventario
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
     * INVENTARIO VACÍO
     * ==========================================
     */

    if (productos.length === 0) {

        return (

            <main className="max-w-6xl mx-auto px-6 py-10">

                <Link
                    href="/dashboard"
                    className="text-blue-400 hover:text-blue-300"
                >
                    ← Dashboard
                </Link>

                <h1 className="text-4xl font-bold text-white mt-6">
                    Inventario
                </h1>

                <div className="bg-slate-800 rounded-2xl p-10 text-center mt-8">

                    <div className="text-6xl">
                        📦
                    </div>

                    <h2 className="text-2xl font-bold text-white mt-4">
                        No tienes productos
                    </h2>

                    <p className="text-slate-400 mt-2">
                        Actualmente no tienes productos registrados en tu inventario.
                    </p>

                </div>

            </main>
        );
    }


    /*
     * ==========================================
     * PÁGINA PRINCIPAL
     * ==========================================
     */

    return (

        <main className="max-w-6xl mx-auto px-6 py-10">

            {/* ENCABEZADO */}

            <div className="mb-8">

                <Link
                    href="/dashboard"
                    className="text-blue-400 hover:text-blue-300"
                >
                    ← Dashboard
                </Link>

                <h1 className="text-4xl font-bold text-white mt-4">
                    Inventario
                </h1>

                <p className="text-slate-400 mt-2">
                    Administra el stock de tus productos.
                </p>

            </div>


            {/* RESUMEN */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                <div className="bg-slate-800 rounded-2xl p-5">

                    <p className="text-slate-400">
                        Productos
                    </p>

                    <p className="text-3xl font-bold text-white mt-2">
                        {productos.length}
                    </p>

                </div>


                <div className="bg-slate-800 rounded-2xl p-5">

                    <p className="text-slate-400">
                        Unidades disponibles
                    </p>

                    <p className="text-3xl font-bold text-white mt-2">

                        {productos.reduce(
                            (
                                total,
                                producto
                            ) =>
                                total +
                                producto.stock,
                            0
                        )}

                    </p>

                </div>


                <div className="bg-slate-800 rounded-2xl p-5">

                    <p className="text-slate-400">
                        Productos con stock bajo
                    </p>

                    <p className="text-3xl font-bold text-yellow-400 mt-2">

                        {productos.filter(
                            producto =>
                                producto.stock >
                                    0 &&
                                producto.stock <=
                                    5
                        ).length}

                    </p>

                </div>

            </div>


            {/* TABLA */}

            <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="border-b border-slate-700">

                                <th className="text-left px-6 py-4 text-slate-400 font-semibold">
                                    Producto
                                </th>

                                <th className="text-left px-6 py-4 text-slate-400 font-semibold">
                                    Categoría
                                </th>

                                <th className="text-left px-6 py-4 text-slate-400 font-semibold">
                                    Precio
                                </th>

                                <th className="text-center px-6 py-4 text-slate-400 font-semibold">
                                    Stock
                                </th>

                                <th className="text-center px-6 py-4 text-slate-400 font-semibold">
                                    Estado
                                </th>

                                <th className="text-center px-6 py-4 text-slate-400 font-semibold">
                                    Acciones
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {productos.map(
                                producto => {

                                    const estado =
                                        obtenerEstadoStock(
                                            producto.stock
                                        );

                                    const estaActualizando =
                                        actualizando ===
                                        producto.id;

                                    return (

                                        <tr
                                            key={
                                                producto.id
                                            }
                                            className="border-b border-slate-700 last:border-b-0"
                                        >

                                            {/* PRODUCTO */}

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-4">

                                                    {producto.foto ? (

                                                        <img
                                                            src={
                                                                producto.foto
                                                            }
                                                            alt={
                                                                producto.nombre
                                                            }
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />

                                                    ) : (

                                                        <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">

                                                            <span className="text-2xl">
                                                                📦
                                                            </span>

                                                        </div>

                                                    )}

                                                    <div>

                                                        <p className="text-white font-semibold">
                                                            {
                                                                producto.nombre
                                                            }
                                                        </p>

                                                        <Link
                                                            href={`/productos/${producto.id}`}
                                                            className="text-blue-400 hover:text-blue-300 text-sm"
                                                        >
                                                            Ver producto
                                                        </Link>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* CATEGORÍA */}

                                            <td className="px-6 py-5 text-slate-300">

                                                {
                                                    producto.categoria
                                                }

                                            </td>


                                            {/* PRECIO */}

                                            <td className="px-6 py-5 text-white font-semibold">

                                                $
                                                {Number(
                                                    producto.precio
                                                ).toFixed(
                                                    2
                                                )}

                                            </td>


                                            {/* STOCK */}

                                            <td className="px-6 py-5">

                                                <div className="flex items-center justify-center gap-3">

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            producto.stock <=
                                                                0 ||
                                                            estaActualizando
                                                        }
                                                        onClick={() =>
                                                            disminuirStock(
                                                                producto
                                                            )
                                                        }
                                                        className="w-9 h-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 disabled:opacity-30 text-red-400 font-bold text-xl"
                                                    >
                                                        −
                                                    </button>

                                                    <span className="text-white font-bold text-lg min-w-[40px] text-center">

                                                        {
                                                            estaActualizando
                                                                ? "..."
                                                                : producto.stock
                                                        }

                                                    </span>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            estaActualizando
                                                        }
                                                        onClick={() =>
                                                            aumentarStock(
                                                                producto
                                                            )
                                                        }
                                                        className="w-9 h-9 rounded-lg bg-green-500/10 hover:bg-green-500/20 disabled:opacity-30 text-green-400 font-bold text-xl"
                                                    >
                                                        +
                                                    </button>

                                                </div>

                                            </td>


                                            {/* ESTADO */}

                                            <td className="px-6 py-5 text-center">

                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full border text-sm font-semibold ${estado.clase}`}
                                                >
                                                    {estado.texto}
                                                </span>

                                            </td>


                                            {/* ACCIONES */}

                                            <td className="px-6 py-5 text-center">

                                                <div className="flex justify-center gap-2">

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            producto.stock <=
                                                                0 ||
                                                            estaActualizando
                                                        }
                                                        onClick={() =>
                                                            disminuirStock(
                                                                producto
                                                            )
                                                        }
                                                        className="bg-red-500 hover:bg-red-600 disabled:bg-slate-700 disabled:text-slate-500 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                                                    >
                                                        −1
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            estaActualizando
                                                        }
                                                        onClick={() =>
                                                            aumentarStock(
                                                                producto
                                                            )
                                                        }
                                                        className="bg-green-500 hover:bg-green-600 disabled:bg-slate-700 disabled:text-slate-500 text-white px-3 py-2 rounded-lg text-sm font-semibold"
                                                    >
                                                        +1
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    );
                                }
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </main>
    );
}