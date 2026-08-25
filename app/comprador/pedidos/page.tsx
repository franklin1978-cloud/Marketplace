"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

interface Pedido {
    id: string;
    total: number;
    estado: string;
    created_at: string;
}

interface DetallePedido {
    id: string;
    pedido_id: string;
    cantidad: number;
    precio: number;
    subtotal: number;
    producto: {
        nombre: string;
        foto: string | null;
        categoria: string;
    } | null;
}

export default function MisPedidosPage() {

    const supabase = createClient();

    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [detalles, setDetalles] = useState<DetallePedido[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const cargarPedidos = async () => {

        try {

            setError("");

            const {
                data: { user },
                error: errorUsuario
            } = await supabase.auth.getUser();

            if (errorUsuario) {
                throw errorUsuario;
            }

            if (!user) {

                setError(
                    "Debes iniciar sesión para ver tus pedidos."
                );

                return;
            }

            const {
                data: pedidosData,
                error: errorPedidos
            } = await supabase
                .from("pedidos")
                .select(`
                    id,
                    total,
                    estado,
                    created_at
                `)
                .eq("usuario_id", user.id)
                .order("created_at", {
                    ascending: false
                });

            if (errorPedidos) {
                throw errorPedidos;
            }

            const pedidosCargados = pedidosData || [];

            setPedidos(pedidosCargados);

            if (pedidosCargados.length === 0) {

                setDetalles([]);

                return;
            }

            const idsPedidos = pedidosCargados.map(
                (pedido) => pedido.id
            );

            const {
                data: detallesData,
                error: errorDetalles
            } = await supabase
                .from("detalle_pedidos")
                .select(`
                    id,
                    pedido_id,
                    cantidad,
                    precio,
                    subtotal,
                    productos (
                        nombre,
                        foto,
                        categoria
                    )
                `)
                .in("pedido_id", idsPedidos);

            if (errorDetalles) {
                throw errorDetalles;
            }

            const detallesFormateados =
                (detallesData || []).map((detalle: any) => ({

                    id: detalle.id,

                    pedido_id: detalle.pedido_id,

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
                "Error cargando pedidos:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "No se pudieron cargar tus pedidos."
            );

        } finally {

            setCargando(false);

        }
    };

    useEffect(() => {

        cargarPedidos();

    }, []);

    const obtenerDetallesPedido = (
        pedidoId: string
    ) => {

        return detalles.filter(
            (detalle) =>
                detalle.pedido_id === pedidoId
        );
    };

    const obtenerTextoEstado = (
        estado: string
    ) => {

        switch (estado) {

            case "pendiente":
                return "Pendiente";

            case "procesando":
                return "Procesando";

            case "enviado":
                return "Enviado";

            case "entregado":
                return "Entregado";

            case "cancelado":
                return "Cancelado";

            default:
                return estado;
        }
    };

    const obtenerColorEstado = (
        estado: string
    ) => {

        switch (estado) {

            case "pendiente":
                return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";

            case "procesando":
                return "bg-blue-500/10 text-blue-400 border-blue-500/30";

            case "enviado":
                return "bg-purple-500/10 text-purple-400 border-purple-500/30";

            case "entregado":
                return "bg-green-500/10 text-green-400 border-green-500/30";

            case "cancelado":
                return "bg-red-500/10 text-red-400 border-red-500/30";

            default:
                return "bg-slate-500/10 text-slate-400 border-slate-500/30";
        }
    };

    if (cargando) {

        return (

            <main className="max-w-6xl mx-auto px-6 py-10">

                <p className="text-slate-400">
                    Cargando pedidos...
                </p>

            </main>
        );
    }

    return (

        <main className="max-w-6xl mx-auto px-6 py-10">

            <Link
                href="/dashboard"
                className="text-blue-400 hover:text-blue-300"
            >
                ← Dashboard
            </Link>

            <div className="mt-6">

                <h1 className="text-4xl font-bold text-white">
                    📦 Mis pedidos
                </h1>

                <p className="text-slate-400 mt-2">
                    Consulta tus pedidos y revisa su estado actual.
                </p>

            </div>

            {error && (

                <div className="mt-8 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">
                    {error}
                </div>

            )}

            {!error && pedidos.length === 0 && (

                <div className="bg-slate-800 rounded-2xl p-10 mt-8 text-center">

                    <div className="text-5xl">
                        📦
                    </div>

                    <h2 className="text-2xl font-bold text-white mt-4">
                        Todavía no tienes pedidos
                    </h2>

                    <p className="text-slate-400 mt-2">
                        Cuando realices una compra, aparecerá aquí.
                    </p>

                    <Link
                        href="/productos"
                        className="inline-block mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl"
                    >
                        Ver productos
                    </Link>

                </div>

            )}

            <div className="space-y-6 mt-8">

                {pedidos.map((pedido) => {

                    const productosPedido =
                        obtenerDetallesPedido(pedido.id);

                    return (

                        <section
                            key={pedido.id}
                            className="bg-slate-800 rounded-2xl p-6"
                        >

                            {/* CABECERA DEL PEDIDO */}

                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

                                <div>

                                    <p className="text-slate-500 text-sm">
                                        Pedido
                                    </p>

                                    <p className="text-white font-mono text-sm mt-1 break-all">
                                        {pedido.id}
                                    </p>

                                    <p className="text-slate-500 text-sm mt-3">
                                        Fecha
                                    </p>

                                    <p className="text-slate-300 mt-1">
                                        {new Date(
                                            pedido.created_at
                                        ).toLocaleString("es-EC")}
                                    </p>

                                </div>

                                <div className="text-left md:text-right">

                                    <p className="text-slate-500 text-sm">
                                        Estado
                                    </p>

                                    <span
                                        className={`inline-block mt-2 px-4 py-2 rounded-lg border font-semibold ${obtenerColorEstado(
                                            pedido.estado
                                        )}`}
                                    >
                                        {obtenerTextoEstado(
                                            pedido.estado
                                        )}
                                    </span>

                                    {/* SEGUIMIENTO DEL PEDIDO */}

{pedido.estado !== "cancelado" && (

    <div className="mt-6">

        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">

            <span>Pendiente</span>
            <span>Procesando</span>
            <span>Enviado</span>
            <span>Entregado</span>

        </div>

        <div className="relative">

            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-700 -translate-y-1/2" />

            <div
                className={`relative z-10 grid grid-cols-4 ${
                    pedido.estado === "pendiente"
                        ? ""
                        : pedido.estado === "procesando"
                        ? ""
                        : pedido.estado === "enviado"
                        ? ""
                        : ""
                }`}
            >

                {[
                    "pendiente",
                    "procesando",
                    "enviado",
                    "entregado"
                ].map((estado, index) => {

                    const estados = [
                        "pendiente",
                        "procesando",
                        "enviado",
                        "entregado"
                    ];

                    const posicionActual =
                        estados.indexOf(
                            pedido.estado
                        );

                    const activo =
                        index <= posicionActual;

                    return (

                        <div
                            key={estado}
                            className="flex justify-center"
                        >

                            <div
                                className={`w-6 h-6 rounded-full border-4 border-slate-800 ${
                                    activo
                                        ? "bg-blue-500"
                                        : "bg-slate-700"
                                }`}
                            />

                        </div>

                    );

                })}

            </div>

        </div>

    </div>

)}

{pedido.estado === "cancelado" && (

    <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">

        <p className="text-red-400 font-semibold">
            ✕ Este pedido fue cancelado.
        </p>

    </div>

)}

                                    <p className="text-slate-500 text-sm mt-4">
                                        Total
                                    </p>

                                    <p className="text-3xl font-bold text-white mt-1">
                                        ${Number(
                                            pedido.total
                                        ).toFixed(2)}
                                    </p>

                                </div>

                            </div>

                            {/* PRODUCTOS */}

                            <div className="border-t border-slate-700 mt-6 pt-6">

                                <h3 className="text-lg font-bold text-white mb-4">
                                    Productos
                                </h3>

                                <div className="space-y-4">

                                    {productosPedido.map(
                                        (detalle) => (

                                            <div
                                                key={detalle.id}
                                                className="flex flex-col sm:flex-row gap-4 bg-slate-900 rounded-xl p-4"
                                            >

                                                {detalle.producto?.foto ? (

                                                    <img
                                                        src={
                                                            detalle.producto.foto
                                                        }
                                                        alt={
                                                            detalle.producto.nombre
                                                        }
                                                        className="w-24 h-24 object-cover rounded-lg"
                                                    />

                                                ) : (

                                                    <div className="w-24 h-24 bg-slate-700 rounded-lg flex items-center justify-center text-3xl">
                                                        📦
                                                    </div>

                                                )}

                                                <div className="flex-1">

                                                    <h4 className="text-white font-bold">
                                                        {
                                                            detalle.producto?.nombre ||
                                                            "Producto"
                                                        }
                                                    </h4>

                                                    <p className="text-slate-400 text-sm mt-1">
                                                        {
                                                            detalle.producto?.categoria ||
                                                            ""
                                                        }
                                                    </p>

                                                    <p className="text-slate-400 text-sm mt-2">
                                                        Cantidad:{" "}
                                                        {
                                                            detalle.cantidad
                                                        }
                                                    </p>

                                                </div>

                                                <div className="text-left sm:text-right">

                                                    <p className="text-slate-500 text-sm">
                                                        Precio unitario
                                                    </p>

                                                    <p className="text-slate-300 mt-1">
                                                        ${
                                                            detalle.precio.toFixed(
                                                                2
                                                            )
                                                        }
                                                    </p>

                                                    <p className="text-slate-500 text-sm mt-2">
                                                        Subtotal
                                                    </p>

                                                    <p className="text-white font-bold">
                                                        ${
                                                            detalle.subtotal.toFixed(
                                                                2
                                                            )
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        </section>

                    );
                })}

            </div>

        </main>
    );
}