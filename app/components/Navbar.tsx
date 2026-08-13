"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Navbar() {

    const { cantidadTotal } = useCart();

    return (
        <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4">

            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* LOGO */}
                <Link
                    href="/"
                    className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
                >
                    DevPort
                </Link>

                {/* MENU */}
                <div className="flex items-center gap-6">

                    <Link
                        href="/"
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        Inicio
                    </Link>

                    <Link
                        href="/productos"
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        Productos
                    </Link>

                    <Link
                        href="/dashboard"
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        Dashboard
                    </Link>

                    {/* CARRITO */}
                    <Link
                        href="/carrito"
                        className="relative flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                    >

                        <span className="text-2xl">
                            🛒
                        </span>

                        <span>
                            Carrito
                        </span>

                        {cantidadTotal > 0 && (
                            <span
                                className="absolute -top-3 -right-4 bg-red-500 text-white text-xs font-bold min-w-[22px] h-[22px] flex items-center justify-center rounded-full px-1"
                            >
                                {cantidadTotal}
                            </span>
                        )}

                    </Link>

                    {/* LOGIN */}
                    <Link
                        href="/login"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                        Login
                    </Link>

                </div>

            </div>

        </nav>
    );
}