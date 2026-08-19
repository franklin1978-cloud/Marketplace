"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";

interface Pedido {
    id: string;
    total: number;
    estado: string;
    created_at: string;
}

export default function PedidosPage() {

    const supabase = createClient();

    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const cargarPedidos = async () => {

            try {

                const {
                    data: { user }
                } = await supabase.auth.getUser();

                if (!user) {
                    setError(
                        "Debes iniciar sesión para ver tus pedidos."
                    );
                    return;
                }

                const {
                    data,
                    error
                } = await supabase
                    .from("pedidos")
                    .select("*")
                    .eq("usuario_id", user.id)
                    .order("created_at", {
                        ascending: false
                    });

                if (error) {
                    throw error;
                }

                setPedidos(data || []);

            } catch (error) {

                console.error(
                    "Error cargando pedidos:",
                    error
                );

                setError(
                    "No se pudieron cargar tus pedidos."
                );

            } finally {

                setCargando(false);

            }
        };

        cargarPedidos();

    }, []);

    if (cargando) {

        return (
            <main className="max-w-5xl mx-auto px-6 py-10">

                <p className="text-slate-400">
                    Cargando pedidos...
                </p>

            </main>
        );
    }

    return (

        <main className="max-w-5xl mx-auto px-6 py-10">

            <Link
                href="/dashboard"
                className="text-blue-400 hover:text-blue-300"
            >
                ← Dashboard
            </Link>

            <h1 className="text-4xl font-bold text-white mt-6">
                📦 Mis pedidos
            </h1>

            <p className="text-slate-400 mt-2">
                Consulta el historial de tus compras.
            </p>

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
                        Cuando realices una compra aparecerá aquí.
                    </p>

                    <Link
                        href="/productos"
                        className="inline-block mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl"
                    >
                        Explorar productos
                    </Link>

                </div>

            )}

            <div className="space-y-4 mt-8">

                {pedidos.map((pedido) => (

                    <div
                        key={pedido.id}
                        className="bg-slate-800 rounded-2xl p-6"
                    >

                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                            <div>

                                <p className="text-slate-500 text-sm">
                                    Pedido
                                </p>

                                <p className="text-white font-mono text-sm mt-1 break-all">
                                    {pedido.id}
                                </p>

                            </div>

                            <span className="inline-block bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                                {pedido.estado}
                            </span>

                        </div>

                        <div className="border-t border-slate-700 mt-5 pt-5 flex flex-col sm:flex-row justify-between gap-4">

                            <div>

                                <p className="text-slate-500 text-sm">
                                    Fecha
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

                            <div>

                                <p className="text-slate-500 text-sm">
                                    Total
                                </p>

                                <p className="text-2xl font-bold text-white mt-1">
                                    ${Number(pedido.total).toFixed(2)}
                                </p>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </main>
    );
}