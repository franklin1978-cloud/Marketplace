"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function CheckoutPage() {

    const {
        carrito,
        total,
        vaciarCarrito
    } = useCart();

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [direccion, setDireccion] = useState("");
    const [procesando, setProcesando] = useState(false);
    const [pedidoRealizado, setPedidoRealizado] = useState(false);

    const confirmarPedido = (e: React.FormEvent) => {

        e.preventDefault();

        if (
            !nombre ||
            !correo ||
            !telefono ||
            !direccion
        ) {
            alert("Por favor completa todos los datos.");
            return;
        }

        setProcesando(true);

        /*
         * Simulamos el procesamiento del pedido.
         * Posteriormente aquí conectaremos:
         * - API REST
         * - Base de datos
         * - Pasarela de pago
         * - Notificaciones
         */

        setTimeout(() => {

            setProcesando(false);
            setPedidoRealizado(true);

            vaciarCarrito();

        }, 1500);
    };

    if (pedidoRealizado) {

        return (

            <main className="max-w-4xl mx-auto px-6 py-12">

                <div className="bg-slate-800 rounded-2xl p-10 text-center shadow-xl">

                    <div className="text-6xl mb-6">
                        ✅
                    </div>

                    <h1 className="text-4xl font-bold text-white">
                        ¡Pedido realizado!
                    </h1>

                    <p className="text-slate-400 mt-4 text-lg">
                        Tu pedido fue registrado correctamente.
                    </p>

                    <p className="text-slate-500 mt-2">
                        Hemos registrado tus datos y prepararemos
                        el pedido para su procesamiento.
                    </p>

                    <Link
                        href="/productos"
                        className="inline-block mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-xl"
                    >
                        Seguir comprando
                    </Link>

                </div>

            </main>

        );
    }

    if (carrito.length === 0) {

        return (

            <main className="max-w-4xl mx-auto px-6 py-12">

                <div className="bg-slate-800 rounded-2xl p-10 text-center">

                    <h1 className="text-3xl font-bold text-white">
                        Tu carrito está vacío
                    </h1>

                    <p className="text-slate-400 mt-4">
                        Agrega productos antes de continuar con la compra.
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

        <main className="max-w-6xl mx-auto px-6 py-10">

            <Link
                href="/carrito"
                className="text-blue-400 hover:text-blue-300"
            >
                ← Volver al carrito
            </Link>

            <h1 className="text-4xl font-bold text-white mt-6">
                Finalizar compra
            </h1>

            <p className="text-slate-400 mt-2">
                Completa tus datos para realizar el pedido.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

                {/* DATOS DEL COMPRADOR */}

                <form
                    onSubmit={confirmarPedido}
                    className="bg-slate-800 rounded-2xl p-6 shadow-lg"
                >

                    <h2 className="text-2xl font-bold text-white">
                        Datos del comprador
                    </h2>

                    <div className="mt-6">

                        <label className="block text-slate-300 mb-2">
                            Nombre completo
                        </label>

                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) =>
                                setNombre(e.target.value)
                            }
                            placeholder="Ej. Juan Pérez"
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        />

                    </div>

                    <div className="mt-5">

                        <label className="block text-slate-300 mb-2">
                            Correo electrónico
                        </label>

                        <input
                            type="email"
                            value={correo}
                            onChange={(e) =>
                                setCorreo(e.target.value)
                            }
                            placeholder="correo@ejemplo.com"
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        />

                    </div>

                    <div className="mt-5">

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

                    <div className="mt-5">

                        <label className="block text-slate-300 mb-2">
                            Dirección de entrega
                        </label>

                        <textarea
                            value={direccion}
                            onChange={(e) =>
                                setDireccion(e.target.value)
                            }
                            placeholder="Ingresa la dirección donde recibirás el pedido"
                            rows={4}
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={procesando}
                        className="w-full mt-8 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 text-white font-bold py-4 rounded-xl"
                    >

                        {procesando
                            ? "Procesando pedido..."
                            : "Confirmar pedido"
                        }

                    </button>

                </form>

                {/* RESUMEN DEL PEDIDO */}

                <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">

                    <h2 className="text-2xl font-bold text-white">
                        Resumen del pedido
                    </h2>

                    <div className="mt-6 space-y-4">

                        {carrito.map((producto) => (

                            <div
                                key={producto.id}
                                className="flex gap-4 border-b border-slate-700 pb-4"
                            >

                                <img
                                    src={producto.foto}
                                    alt={producto.nombre}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />

                                <div className="flex-1">

                                    <h3 className="text-white font-semibold">
                                        {producto.nombre}
                                    </h3>

                                    <p className="text-slate-400 text-sm mt-1">
                                        Cantidad: {producto.cantidad}
                                    </p>

                                    <p className="text-slate-300 mt-2">
                                        $
                                        {(
                                            producto.precio *
                                            producto.cantidad
                                        ).toFixed(2)}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                    <div className="border-t border-slate-700 mt-6 pt-6">

                        <div className="flex justify-between">

                            <span className="text-slate-400">
                                Productos
                            </span>

                            <span className="text-white">
                                {carrito.reduce(
                                    (total, producto) =>
                                        total + producto.cantidad,
                                    0
                                )}
                            </span>

                        </div>

                        <div className="flex justify-between mt-4">

                            <span className="text-slate-400">
                                Envío
                            </span>

                            <span className="text-green-400">
                                Gratis
                            </span>

                        </div>

                        <div className="flex justify-between mt-6">

                            <span className="text-xl text-slate-300">
                                Total
                            </span>

                            <span className="text-3xl font-bold text-white">
                                ${total.toFixed(2)}
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </main>

    );
}