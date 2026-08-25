"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

interface Venta {
    id: string;
    pedido_id: string;
    producto_id: string;
    cantidad: number;
    precio: number;
    subtotal: number;
    pedido: {
        id: string;
        total: number;
        estado: string;
        created_at: string;
        usuario_id: string;
    };
    producto: {
        nombre: string;
        foto: string | null;
        categoria: string;
    };
}

const estados = [
    "pendiente",
    "procesando",
    "enviado",
    "entregado",
    "cancelado"
];

export default function VentasPage() {

    const supabase = createClient();

    const [ventas, setVentas] = useState<Venta[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [actualizando, setActualizando] = useState<string | null>(null);

    const cargarVentas = async () => {

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
                    "Debes iniciar sesión para ver tus ventas."
                );

                return;
            }

            const {
                data: productos,
                error: errorProductos
            } = await supabase
                .from("productos")
                .select("id")
                .eq("vendedor_id", user.id);

            if (errorProductos) {
                throw errorProductos;
            }

            if (!productos || productos.length === 0) {

                setVentas([]);

                return;
            }

            const idsProductos = productos.map(
                (producto) => producto.id
            );

            const {
                data,
                error: errorDetalles
            } = await supabase
                .from("detalle_pedidos")
                .select(`
                    id,
                    pedido_id,
                    producto_id,
                    cantidad,
                    precio,
                    subtotal,
                    pedidos (
                        id,
                        total,
                        estado,
                        created_at,
                        usuario_id
                    ),
                    productos (
                        nombre,
                        foto,
                        categoria
                    )
                `)
                .in("producto_id", idsProductos);

            if (errorDetalles) {

                console.error(
                    "ERROR DETALLES VENTAS:",
                    errorDetalles
                );

                throw errorDetalles;
            }

            const ventasFormateadas =
                (data || []).map((venta: any) => ({

                    id: venta.id,

                    pedido_id: venta.pedido_id,

                    producto_id: venta.producto_id,

                    cantidad: venta.cantidad,

                    precio: Number(venta.precio),

                    subtotal: Number(venta.subtotal),

                    pedido: Array.isArray(venta.pedidos)
                        ? venta.pedidos[0]
                        : venta.pedidos,

                    producto: Array.isArray(venta.productos)
                        ? venta.productos[0]
                        : venta.productos

                }));

            setVentas(ventasFormateadas);

        } catch (error) {

            console.error(
                "Error cargando ventas:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "No se pudieron cargar tus ventas."
            );

        } finally {

            setCargando(false);

        }
    };

    useEffect(() => {

        cargarVentas();

    }, []);

    const cambiarEstado = async (
        pedidoId: string,
        nuevoEstado: string
    ) => {

        try {

            setActualizando(pedidoId);
            setError("");

            const {
    data,
    error
} = await supabase
    .from("pedidos")
    .update({
        estado: nuevoEstado
    })
    .eq("id", pedidoId)
    .select();

console.log("RESULTADO ACTUALIZACIÓN:", data);
console.log("ERROR ACTUALIZACIÓN:", error);

if (error) {
    throw error;
}

if (!data || data.length === 0) {
    throw new Error(
        "No se actualizó ningún pedido. La política RLS puede estar bloqueando la operación."
    );
}

            setVentas((ventasActuales) =>
                ventasActuales.map((venta) => {

                    if (venta.pedido_id !== pedidoId) {
                        return venta;
                    }

                    return {
                        ...venta,
                        pedido: {
                            ...venta.pedido,
                            estado: nuevoEstado
                        }
                    };

                })
            );

        } catch (error) {

            console.error(
                "Error actualizando estado:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "No se pudo actualizar el estado."
            );

        } finally {

            setActualizando(null);

        }
    };

    if (cargando) {

        return (

            <main className="max-w-6xl mx-auto px-6 py-10">

                <p className="text-slate-400">
                    Cargando ventas...
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
                    💰 Mis ventas
                </h1>

                <p className="text-slate-400 mt-2">
                    Consulta y administra los pedidos de tus productos.
                </p>

            </div>

            {error && (

                <div className="mt-8 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">
                    {error}
                </div>

            )}

            {!error && ventas.length === 0 && (

                <div className="bg-slate-800 rounded-2xl p-10 mt-8 text-center">

                    <div className="text-5xl">
                        💰
                    </div>

                    <h2 className="text-2xl font-bold text-white mt-4">
                        Todavía no tienes ventas
                    </h2>

                    <p className="text-slate-400 mt-2">
                        Las ventas de tus productos aparecerán aquí.
                    </p>

                </div>

            )}

            <div className="space-y-5 mt-8">

                {ventas.map((venta) => (

                    <div
                        key={venta.id}
                        className="bg-slate-800 rounded-2xl p-6"
                    >

                        <div className="flex flex-col lg:flex-row gap-6">

                            {/* PRODUCTO */}

                            <div className="flex gap-4 flex-1">

                                {venta.producto?.foto ? (

                                    <img
                                        src={venta.producto.foto}
                                        alt={venta.producto.nombre}
                                        className="w-24 h-24 object-cover rounded-xl"
                                    />

                                ) : (

                                    <div className="w-24 h-24 bg-slate-700 rounded-xl flex items-center justify-center text-3xl">
                                        📦
                                    </div>

                                )}

                                <div>

                                    <p className="text-slate-500 text-sm">
                                        Producto vendido
                                    </p>

                                    <h2 className="text-xl font-bold text-white mt-1">
                                        {venta.producto?.nombre || "Producto"}
                                    </h2>

                                    <p className="text-slate-400 text-sm mt-1">
                                        {venta.producto?.categoria || ""}
                                    </p>

                                    <p className="text-slate-400 mt-3">
                                        Cantidad: {venta.cantidad}
                                    </p>

                                </div>

                            </div>

                            {/* PEDIDO */}

                            <div className="lg:w-64">

                                <p className="text-slate-500 text-sm">
                                    Pedido
                                </p>

                                <p className="text-white font-mono text-xs mt-1 break-all">
                                    {venta.pedido_id}
                                </p>

                                <p className="text-slate-500 text-sm mt-4">
                                    Fecha
                                </p>

                                <p className="text-slate-300 mt-1">
                                    {venta.pedido?.created_at
                                        ? new Date(
                                            venta.pedido.created_at
                                        ).toLocaleDateString("es-EC")
                                        : "-"
                                    }
                                </p>

                            </div>

                            {/* ESTADO */}

                            <div className="lg:w-56">

                                <p className="text-slate-500 text-sm mb-2">
                                    Estado del pedido
                                </p>

                                <select
                                    value={
                                        venta.pedido?.estado ||
                                        "pendiente"
                                    }
                                    disabled={
                                        actualizando === venta.pedido_id
                                    }
                                    onChange={(e) =>
                                        cambiarEstado(
                                            venta.pedido_id,
                                            e.target.value
                                        )
                                    }
                                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                >

                                    {estados.map((estado) => (

                                        <option
                                            key={estado}
                                            value={estado}
                                        >
                                            {estado.charAt(0).toUpperCase() +
                                                estado.slice(1)}
                                        </option>

                                    ))}

                                </select>

                                {actualizando === venta.pedido_id && (

                                    <p className="text-blue-400 text-sm mt-2">
                                        Actualizando...
                                    </p>

                                )}

                            </div>

                            {/* TOTAL */}

                            <div className="lg:w-40 flex flex-col justify-between">

                                <div>

                                    <p className="text-slate-500 text-sm">
                                        Total vendido
                                    </p>

                                    <p className="text-2xl font-bold text-white mt-1">
                                        ${venta.subtotal.toFixed(2)}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </main>
    );
}