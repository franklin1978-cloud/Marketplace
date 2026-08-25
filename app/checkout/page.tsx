"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { createClient } from "../../lib/supabase/client";

export default function CheckoutPage() {

    const router = useRouter();
    const supabase = createClient();

    const {
        carrito,
        total,
        vaciarCarrito
    } = useCart();

    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        if (carrito.length === 0) {
            router.replace("/carrito");
        }

    }, [carrito.length, router]);

    const confirmarPedido = async () => {

        if (carrito.length === 0) {
            return;
        }

        setError("");
        setProcesando(true);

        try {

            // --------------------------------
            // OBTENER USUARIO
            // --------------------------------

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

            // --------------------------------
            // CREAR PEDIDO
            // --------------------------------

            const {
                data: pedido,
                error: errorPedido
            } = await supabase
                .from("pedidos")
                .insert({
                    usuario_id: user.id,
                    total: Number(total.toFixed(2)),
                    estado: "pendiente"
                })
                .select()
                .single();

            if (errorPedido) {
                throw errorPedido;
            }

            if (!pedido) {
                throw new Error(
                    "No se pudo crear el pedido."
                );
            }

            // --------------------------------
            // CREAR DETALLES
            // --------------------------------

            const detalles = carrito.map((producto) => ({

                pedido_id: pedido.id,

                producto_id: producto.id,

                cantidad: producto.cantidad,

                precio: Number(
                    producto.precio.toFixed(2)
                ),

                subtotal: Number(
                    (
                        producto.precio *
                        producto.cantidad
                    ).toFixed(2)
                )

            }));

            const {
                error: errorDetalles
            } = await supabase
                .from("detalle_pedidos")
                .insert(detalles);

            if (errorDetalles) {

                // Si fallan los detalles,
                // eliminamos el pedido creado.
                await supabase
                    .from("pedidos")
                    .delete()
                    .eq("id", pedido.id);

                throw errorDetalles;
            }

            // --------------------------------
            // PEDIDO CORRECTO
            // --------------------------------

            vaciarCarrito();

            router.push(
                `/pedido-confirmado?id=${pedido.id}`
            );

        } catch (error) {

            console.error(
                "Error creando pedido:",
                error
            );

            setError(
                "No se pudo procesar el pedido. Intenta nuevamente."
            );

        } finally {

            setProcesando(false);

        }
    };

    if (carrito.length === 0) {

        return (

            <main className="max-w-5xl mx-auto px-6 py-10">

                <h1 className="text-4xl font-bold text-white">
                    Checkout
                </h1>

                <div className="bg-slate-800 rounded-2xl p-8 mt-8 text-center">

                    <p className="text-slate-400">
                        Tu carrito está vacío.
                    </p>

                    <Link
                        href="/productos"
                        className="inline-block mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl"
                    >
                        Ver productos
                    </Link>

                </div>

            </main>
        );
    }

    return (

        <main className="max-w-5xl mx-auto px-6 py-10">

            <Link
                href="/carrito"
                className="text-blue-400 hover:text-blue-300"
            >
                ← Volver al carrito
            </Link>

            <h1 className="text-4xl font-bold text-white mt-6">
                Confirmar pedido
            </h1>

            <p className="text-slate-400 mt-2">
                Revisa tu pedido antes de confirmarlo.
            </p>

            {/* PRODUCTOS */}

            <div className="bg-slate-800 rounded-2xl p-6 mt-8">

                <h2 className="text-2xl font-bold text-white">
                    Productos
                </h2>

                <div className="space-y-5 mt-6">

                    {carrito.map((producto) => (

                        <div
                            key={producto.id}
                            className="flex items-center gap-4 border-b border-slate-700 pb-5"
                        >

                            {producto.foto ? (
    <img
        src={producto.foto}
        alt={producto.nombre}
        className="w-20 h-20 object-cover rounded-xl"
    />
) : (
    <div className="w-20 h-20 bg-slate-700 flex items-center justify-center rounded-xl">
        <span className="text-2xl">📦</span>
    </div>
)}
                            <div className="flex-1">

                                <h3 className="text-white font-semibold">
                                    {producto.nombre}
                                </h3>

                                <p className="text-slate-400 text-sm mt-1">
                                    Cantidad: {producto.cantidad}
                                </p>

                                <p className="text-slate-400 text-sm">
                                    ${Number(producto.precio).toFixed(2)} c/u
                                </p>

                            </div>

                            <span className="text-white font-bold">
                                $
                                {(
                                    producto.precio *
                                    producto.cantidad
                                ).toFixed(2)}
                            </span>

                        </div>

                    ))}

                </div>

            </div>

            {/* RESUMEN */}

            <div className="bg-slate-800 rounded-2xl p-6 mt-6">

                <h2 className="text-2xl font-bold text-white">
                    Resumen
                </h2>

                <div className="flex justify-between items-center mt-6">

                    <span className="text-slate-400">
                        Total
                    </span>

                    <span className="text-3xl font-bold text-white">
                        ${total.toFixed(2)}
                    </span>

                </div>

                {error && (

                    <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">
                        {error}
                    </div>

                )}

                <button
                    type="button"
                    onClick={confirmarPedido}
                    disabled={procesando}
                    className="w-full mt-6 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 text-white font-bold py-4 rounded-xl"
                >
                    {procesando
                        ? "Procesando pedido..."
                        : "✓ Confirmar pedido"
                    }
                </button>

            </div>

        </main>
    );
}