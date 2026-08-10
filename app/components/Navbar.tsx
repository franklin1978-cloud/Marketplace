"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Navbar() {

    const { cantidadTotal } = useCart();

    return (
        <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex justify-between items-center">

            {/* Logo */}
            <Link
                href="/"
                className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
            >
                DevPort
            </Link>

            {/* Menú */}
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

                {/* Carrito */}
                <Link
                    href="/carrito"
                    className="relative text-slate-400 hover:text-white transition-colors"
                >
                    🛒 Carrito

                    {cantidadTotal > 0 && (
                        <span className="absolute -top-3 -right-4 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center">
                            {cantidadTotal}
                        </span>
                    )}
                </Link>

                {/* Login */}
                <Link
                    href="/login"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                    Login
                </Link>

            </div>

        </nav>
    );
}