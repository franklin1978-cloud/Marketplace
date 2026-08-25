"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

interface DetallePedido {
    id: string;
    producto_id: string;
    cantidad: number;
    precio: number;
    subtotal: number;
    producto?: {
        nombre: string;
        foto: string | null;
        categoria: string;
    };
}

interface Pedido {
    id: string;
    total: number;
    estado: string;
    created_at: string;
}

export default function PedidoDetallePage() {

    const params = useParams();

    const id = params.id as string;

    const supabase = createClient();

    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [detalles, setDetalles] = useState<DetallePedido[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const cargarPedido = async () => {

            try {

                const {
                    data: { user },
                    error: errorUsuario
                } = await supabase.auth.getUser();

                if (errorUsuario) {
                    throw errorUsuario;
                }

                if (!user) {

                    setError(
                        "Debes iniciar sesión para ver este pedido."
                    );

                    return;
                }

                const {
                    data: pedidoData,
                    error: errorPedido
                } = await supabase
                    .from("pedidos")
                    .select("*")
                    .eq("id", id)
                    .eq("usuario_id", user.id)
                    .single();

                if (errorPedido) {
                    throw errorPedido;
                }

                setPedido(pedidoData);

                const {
                    data: detallesData,
                    error: errorDetalles
                } = await supabase
                    .from("detalle_pedidos")
                    .select(`
                        id,
                        producto_id,
                        cantidad,
                        precio,
                        subtotal,
                        productos (
                            nombre,
                            foto,
                            categoria
                        )
                    `)
                    .eq("pedido_id", id);

                if (errorDetalles) {
                    throw errorDetalles;
                }

                const detallesFormateados =
                    (detallesData || []).map((detalle: any) => ({
                        id: detalle.id,
                        producto_id: detalle.producto_id,
                        cantidad: detalle.cantidad,
                        precio: Number(detalle.precio),
                        subtotal: Number(detalle.subtotal),
                        producto: Array.isArray(detalle.productos)
                            ? detalle.productos[0]
                            : detalle.productos
                    }));

                setDetalles(detallesFormateados);

            } catch (error) {

                console.error(
                    "Error cargando pedido:",
                    error
                );

                setError(
                    "No se pudo cargar el pedido."
                );

            } finally {

                setCargando(false);

            }
        };

        if (id) {
            cargarPedido();
        }

    }, [id, supabase]);

    if (cargando) {

        return (
            <main className="max-w-5xl mx-auto px-6 py-10">

                <p className="text-slate-400">
                    Cargando pedido...
                </p>

            </main>
        );
    }

    if (error || !pedido) {

        return (
            <main className="max-w-5xl mx-auto px-6 py-10">

                <h1 className="text-3xl font-bold text-white">
                    Pedido no encontrado
                </h1>

                <p className="text-slate-400 mt-3">
                    {error}
                </p>

                <Link
                    href="/pedidos"
                    className="inline-block mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl"
                >
                    ← Volver a mis pedidos
                </Link>

            </main>
        );
    }

    return (

        <main className="max-w-5xl mx-auto px-6 py-10">

            <Link
                href="/pedidos"
                className="text-blue-400 hover:text-blue-300"
            >
                ← Mis pedidos
            </Link>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-6">

                <div>

                    <p className="text-slate-500 text-sm">
                        Número de pedido
                    </p>

                    <h1 className="text-2xl font-bold text-white font-mono break-all">
                        {pedido.id}
                    </h1>

                </div>

                <span className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-full font-semibold capitalize">
                    {pedido.estado}
                </span>

            </div>

            <div className="bg-slate-800 rounded-2xl p-6 mt-8">

                <div className="flex justify-between">

                    <div>

                        <p className="text-slate-500 text-sm">
                            Fecha del pedido
                        </p>

                        <p className="text-slate-300 mt-1">
                            {new Date(
                                pedido.created_at
                            ).toLocaleDateString("es-EC", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                        </p>

                    </div>

                    <div className="text-right">

                        <p className="text-slate-500 text-sm">
                            Total
                        </p>

                        <p className="text-3xl font-bold text-white">
                            ${Number(pedido.total).toFixed(2)}
                        </p>

                    </div>

                </div>

            </div>

            <section className="bg-slate-800 rounded-2xl p-6 mt-6">

                <h2 className="text-2xl font-bold text-white">
                    Productos del pedido
                </h2>

                <div className="space-y-5 mt-6">

                    {detalles.map((detalle) => (

                        <div
                            key={detalle.id}
                            className="flex flex-col sm:flex-row gap-5 border-b border-slate-700 pb-5 last:border-b-0"
                        >

                            {detalle.producto?.foto ? (

                                <img
                                    src={detalle.producto.foto}
                                    alt={detalle.producto.nombre}
                                    className="w-24 h-24 object-cover rounded-xl"
                                />

                            ) : (

                                <div className="w-24 h-24 bg-slate-700 rounded-xl flex items-center justify-center text-3xl">
                                    📦
                                </div>

                            )}

                            <div className="flex-1">

                                <h3 className="text-xl font-bold text-white">
                                    {detalle.producto?.nombre || "Producto"}
                                </h3>

                                <p className="text-slate-400 mt-1">
                                    {detalle.producto?.categoria || ""}
                                </p>

                                <p className="text-slate-400 mt-2">
                                    Cantidad: {detalle.cantidad}
                                </p>

                                <p className="text-slate-400">
                                    Precio unitario: $
                                    {Number(detalle.precio).toFixed(2)}
                                </p>

                            </div>

                            <div className="flex items-center">

                                <p className="text-xl font-bold text-white">
                                    ${Number(detalle.subtotal).toFixed(2)}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </section>

        </main>
    );
}