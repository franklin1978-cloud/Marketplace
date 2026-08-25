"use client";

import Link from "next/link";
import ProductCard from "./components/ProductCard";

export default function HomePage() {
    return (
        <main className="max-w-7xl mx-auto px-6 py-10">

            {/* HERO */}

            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12">

                <div className="max-w-3xl">

                    <span className="inline-block bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold">
                        Marketplace
                    </span>

                    <h1 className="text-4xl md:text-6xl font-bold text-white mt-5 leading-tight">
                        Encuentra los productos que necesitas
                    </h1>

                    <p className="text-slate-400 text-lg mt-5 leading-relaxed">
                        Explora nuestro catálogo, descubre productos,
                        guarda tus favoritos y recibe recomendaciones
                        personalizadas.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-8">

                        <Link
                            href="/productos"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition"
                        >
                            🛍️ Ver productos
                        </Link>

                        <Link
                            href="/favoritos"
                            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl transition"
                        >
                            ❤️ Mis favoritos
                        </Link>

                    </div>

                </div>

            </section>

            {/* ACCESOS */}

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

                <Link
                    href="/productos"
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition"
                >

                    <div className="text-4xl">
                        🛍️
                    </div>

                    <h2 className="text-xl font-bold text-white mt-4">
                        Catálogo
                    </h2>

                    <p className="text-slate-400 mt-2">
                        Explora todos los productos disponibles.
                    </p>

                </Link>

                <Link
                    href="/favoritos"
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-red-500 transition"
                >

                    <div className="text-4xl">
                        ❤️
                    </div>

                    <h2 className="text-xl font-bold text-white mt-4">
                        Favoritos
                    </h2>

                    <p className="text-slate-400 mt-2">
                        Guarda los productos que más te interesan.
                    </p>

                </Link>

                <Link
                    href="/carrito"
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-green-500 transition"
                >

                    <div className="text-4xl">
                        🛒
                    </div>

                    <h2 className="text-xl font-bold text-white mt-4">
                        Carrito
                    </h2>

                    <p className="text-slate-400 mt-2">
                        Revisa tus productos antes de comprar.
                    </p>

                </Link>

            </section>

            {/* VENDEDORES */}

            <section className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-8">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                    <div>

                        <h2 className="text-2xl font-bold text-white">
                            ¿Quieres vender productos?
                        </h2>

                        <p className="text-slate-400 mt-2">
                            Administra tu catálogo e inventario desde
                            el panel de vendedor.
                        </p>

                    </div>

                    <Link
                        href="/vendedor/productos"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl text-center"
                    >
                        Panel de vendedor
                    </Link>

                </div>

            </section>

        </main>
    );
}