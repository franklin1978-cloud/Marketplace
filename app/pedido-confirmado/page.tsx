"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Confirmacion() {

    const searchParams = useSearchParams();

    const id = searchParams.get("id");

    return (

        <main className="max-w-3xl mx-auto px-6 py-16">

            <div className="bg-slate-800 rounded-2xl p-10 text-center">

                <div className="text-6xl">
                    ✅
                </div>

                <h1 className="text-4xl font-bold text-white mt-6">
                    ¡Pedido confirmado!
                </h1>

                <p className="text-slate-400 mt-4 text-lg">
                    Tu pedido fue registrado correctamente.
                </p>

                {id && (

                    <div className="bg-slate-900 rounded-xl p-4 mt-6">

                        <p className="text-slate-500 text-sm">
                            Número de pedido
                        </p>

                        <p className="text-white font-mono mt-1 break-all">
                            {id}
                        </p>

                    </div>

                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">

                    <Link
                        href="/productos"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl"
                    >
                        Seguir comprando
                    </Link>

                    <Link
                        href="/dashboard"
                        className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-3 rounded-xl"
                    >
                        Ir al Dashboard
                    </Link>

                </div>

            </div>

        </main>
    );
}

export default function PedidoConfirmadoPage() {

    return (

        <Suspense
            fallback={
                <main className="max-w-3xl mx-auto px-6 py-16">

                    <p className="text-slate-400">
                        Cargando...
                    </p>

                </main>
            }
        >
            <Confirmacion />
        </Suspense>
    );
}