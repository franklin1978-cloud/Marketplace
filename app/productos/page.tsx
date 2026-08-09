"use client";

import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

interface Producto {
    id: string;
    nombre: string;
    descripcion: string;
    categoria: string;
    precio: number;
    stock: number;
    calificacion: number;
    foto: string;
}

export default function ProductosPage() {

    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const [busqueda, setBusqueda] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");

    useEffect(() => {

        const obtenerProductos = async () => {

            try {

                const respuesta = await fetch("/api/productos");

                if (!respuesta.ok) {
                    throw new Error("No se pudieron obtener los productos");
                }

                const datos = await respuesta.json();

                setProductos(datos);

            } catch (error) {

                console.error(error);
                setError("No se pudieron cargar los productos");

            } finally {

                setCargando(false);

            }

        };

        obtenerProductos();

    }, []);

    const categorias = [
        "Todos",
        ...Array.from(
            new Set(productos.map((producto) => producto.categoria))
        )
    ];

    const productosFiltrados = productos.filter((producto) => {

        const coincideBusqueda =
            producto.nombre
                .toLowerCase()
                .includes(busqueda.toLowerCase()) ||
            producto.descripcion
                .toLowerCase()
                .includes(busqueda.toLowerCase());

        const coincideCategoria =
            categoriaSeleccionada === "Todos" ||
            producto.categoria === categoriaSeleccionada;

        return coincideBusqueda && coincideCategoria;
    });

    if (cargando) {

        return (
            <main className="max-w-6xl mx-auto px-6 py-10">

                <h1 className="text-3xl font-bold text-white mb-8">
                    Productos
                </h1>

                <p className="text-slate-400">
                    Cargando productos...
                </p>

            </main>
        );
    }

    if (error) {

        return (
            <main className="max-w-6xl mx-auto px-6 py-10">

                <h1 className="text-3xl font-bold text-white mb-8">
                    Productos
                </h1>

                <p className="text-red-400">
                    {error}
                </p>

            </main>
        );
    }

    return (

        <main className="max-w-6xl mx-auto px-6 py-10">

            {/* Encabezado */}

            <div className="mb-8">

                <h1 className="text-4xl font-bold text-white">
                    Marketplace
                </h1>

                <p className="text-slate-400 mt-2">
                    Encuentra productos y descubre las opiniones de otros compradores.
                </p>

            </div>

            {/* Buscador */}

            <div className="mb-6">

                <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por nombre o descripción..."
                    className="w-full bg-slate-800 text-white rounded-xl px-5 py-3 border border-slate-700 focus:outline-none focus:border-blue-500"
                />

            </div>

            {/* Categorías */}

            <div className="flex flex-wrap gap-3 mb-8">

                {categorias.map((categoria) => (

                    <button
                        key={categoria}
                        onClick={() => setCategoriaSeleccionada(categoria)}
                        className={
                            categoriaSeleccionada === categoria
                                ? "bg-blue-500 text-white px-4 py-2 rounded-lg"
                                : "bg-slate-800 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-700"
                        }
                    >
                        {categoria}
                    </button>

                ))}

            </div>

            {/* Resultado */}

            <p className="text-sm text-slate-400 mb-6">

                {productosFiltrados.length} productos encontrados

            </p>

            {/* Productos */}

            {productosFiltrados.length > 0 ? (

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {productosFiltrados.map((producto) => (

                        <ProductCard
                            key={producto.id}
                            {...producto}
                        />

                    ))}

                </div>

            ) : (

                <div className="text-center py-16">

                    <p className="text-slate-400 text-lg">
                        No se encontraron productos.
                    </p>

                    <button
                        onClick={() => {
                            setBusqueda("");
                            setCategoriaSeleccionada("Todos");
                        }}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
                    >
                        Limpiar filtros
                    </button>

                </div>

            )}

        </main>
    );
}