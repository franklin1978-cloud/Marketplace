"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CarritoPage() {

    const {
        carrito,
        eliminarDelCarrito,
        aumentarCantidad,
        disminuirCantidad,
        vaciarCarrito,
        total
    } = useCart();

    if (carrito.length === 0) {

        return (
            <main className="max-w-5xl mx-auto px-6 py-10">

                <h1 className="text-4xl font-bold text-white">
                    🛒 Mi carrito
                </h1>

                <div className="bg-slate-800 rounded-2xl p-10 mt-8 text-center">

                    <p className="text-slate-400 text-lg">
                        Tu carrito está vacío.
                    </p>

                    <Link
                        href="/productos"
                        className="inline-block mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg"
                    >
                        Ver productos
                    </Link>

                </div>

            </main>
        );
    }

    return (

        <main className="max-w-5xl mx-auto px-6 py-10">

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-4xl font-bold text-white">
                    🛒 Mi carrito
                </h1>

                <button
                    onClick={vaciarCarrito}
                    className="text-red-400 hover:text-red-300"
                >
                    Vaciar carrito
                </button>

            </div>

            <div className="space-y-4">

                {carrito.map((producto) => (

                    <div
                        key={producto.id}
                        className="bg-slate-800 rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-center"
                    >

                        <img
                            src={producto.foto}
                            alt={producto.nombre}
                            className="w-32 h-32 object-cover rounded-xl"
                        />

                        <div className="flex-1">

                            <h2 className="text-xl font-bold text-white">
                                {producto.nombre}
                            </h2>

                            <p className="text-slate-400 text-sm mt-1">
                                {producto.categoria}
                            </p>

                            <p className="text-white font-semibold mt-3">
                                ${producto.precio.toFixed(2)}
                            </p>

                        </div>

                        <div className="flex items-center gap-3">

                            <button
                                onClick={() =>
                                    disminuirCantidad(producto.id)
                                }
                                className="bg-slate-700 hover:bg-slate-600 text-white w-9 h-9 rounded-lg"
                            >
                                -
                            </button>

                            <span className="text-white font-semibold">
                                {producto.cantidad}
                            </span>

                            <button
                                onClick={() =>
                                    aumentarCantidad(producto.id)
                                }
                                className="bg-slate-700 hover:bg-slate-600 text-white w-9 h-9 rounded-lg"
                            >
                                +
                            </button>

                        </div>

                        <div className="text-right">

                            <p className="text-xl font-bold text-white">
                                ${(producto.precio * producto.cantidad).toFixed(2)}
                            </p>

                            <button
                                onClick={() =>
                                    eliminarDelCarrito(producto.id)
                                }
                                className="text-red-400 hover:text-red-300 text-sm mt-2"
                            >
                                Eliminar
                            </button>

                        </div>

                    </div>

                ))}

            </div>

            <div className="bg-slate-800 rounded-2xl p-6 mt-8">

                <div className="flex justify-between items-center">

                    <span className="text-slate-400 text-lg">
                        Total
                    </span>

                    <span className="text-3xl font-bold text-white">
                        ${total.toFixed(2)}
                    </span>

                </div>

                <button
                    className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl"
                >
                    Proceder al pago
                </button>

            </div>

        </main>
    );
}