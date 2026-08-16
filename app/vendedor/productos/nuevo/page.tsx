"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../../lib/supabase/client";

export default function NuevoProductoPage() {

    const router = useRouter();
    const supabase = createClient();

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [foto, setFoto] = useState("");

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const crearProducto = async (
        e: FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setError("");
        setCargando(true);

        try {

            // Obtener usuario autenticado
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

            // Comprobar que sea vendedor
            const {
                data: perfil,
                error: errorPerfil
            } = await supabase
                .from("perfiles")
                .select("rol")
                .eq("id", user.id)
                .single();

            if (errorPerfil) {
                throw errorPerfil;
            }

            if (perfil?.rol !== "vendedor") {

                setError(
                    "Solamente los vendedores pueden publicar productos."
                );

                return;
            }

            // Insertar producto
            const {
                error: errorProducto
            } = await supabase
                .from("productos")
                .insert({
                    vendedor_id: user.id,
                    nombre: nombre,
                    descripcion: descripcion,
                    categoria: categoria,
                    precio: Number(precio),
                    stock: Number(stock),
                    foto: foto || null
                });

            if (errorProducto) {
                throw errorProducto;
            }

            // Regresar a mis productos
            router.push("/vendedor/productos");
            router.refresh();

        } catch (error) {

            console.error(error);

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(
                    "No se pudo crear el producto."
                );
            }

        } finally {

            setCargando(false);

        }
    };

    return (

        <main className="max-w-4xl mx-auto px-6 py-10">

            <Link
                href="/dashboard"
                className="text-blue-400 hover:text-blue-300"
            >
                ← Volver al dashboard
            </Link>

            <div className="mt-8">

                <h1 className="text-4xl font-bold text-white">
                    Publicar producto
                </h1>

                <p className="text-slate-400 mt-2">
                    Agrega un nuevo producto al Marketplace.
                </p>

            </div>

            {error && (

                <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">
                    {error}
                </div>

            )}

            <form
                onSubmit={crearProducto}
                className="bg-slate-800 rounded-2xl p-8 mt-8 space-y-6"
            >

                {/* NOMBRE */}

                <div>

                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Nombre del producto
                    </label>

                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) =>
                            setNombre(e.target.value)
                        }
                        required
                        placeholder="Ej: Laptop Lenovo ThinkPad"
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                    />

                </div>

                {/* DESCRIPCIÓN */}

                <div>

                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Descripción
                    </label>

                    <textarea
                        value={descripcion}
                        onChange={(e) =>
                            setDescripcion(e.target.value)
                        }
                        required
                        rows={5}
                        placeholder="Describe las características del producto..."
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                    />

                </div>

                {/* CATEGORÍA */}

                <div>

                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Categoría
                    </label>

                    <select
                        value={categoria}
                        onChange={(e) =>
                            setCategoria(e.target.value)
                        }
                        required
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                    >

                        <option value="">
                            Selecciona una categoría
                        </option>

                        <option value="Tecnología">
                            Tecnología
                        </option>

                        <option value="Computadoras">
                            Computadoras
                        </option>

                        <option value="Celulares">
                            Celulares
                        </option>

                        <option value="Accesorios">
                            Accesorios
                        </option>

                        <option value="Hogar">
                            Hogar
                        </option>

                        <option value="Ropa">
                            Ropa
                        </option>

                        <option value="Otros">
                            Otros
                        </option>

                    </select>

                </div>

                {/* PRECIO Y STOCK */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>

                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Precio
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={precio}
                            onChange={(e) =>
                                setPrecio(e.target.value)
                            }
                            required
                            placeholder="0.00"
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        />

                    </div>

                    <div>

                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Stock
                        </label>

                        <input
                            type="number"
                            min="0"
                            value={stock}
                            onChange={(e) =>
                                setStock(e.target.value)
                            }
                            required
                            placeholder="0"
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                        />

                    </div>

                </div>

                {/* FOTO */}

                <div>

                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                        URL de la imagen
                    </label>

                    <input
                        type="url"
                        value={foto}
                        onChange={(e) =>
                            setFoto(e.target.value)
                        }
                        placeholder="https://..."
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                    />

                    <p className="text-slate-500 text-sm mt-2">
                        Por ahora utilizaremos una URL. Más adelante implementaremos almacenamiento de imágenes con Supabase Storage.
                    </p>

                </div>

                {/* BOTONES */}

                <div className="flex gap-4 pt-4">

                    <Link
                        href="/dashboard"
                        className="flex-1 text-center bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl"
                    >
                        Cancelar
                    </Link>

                    <button
                        type="submit"
                        disabled={cargando}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 text-white font-bold py-3 rounded-xl"
                    >

                        {cargando
                            ? "Publicando..."
                            : "Publicar producto"
                        }

                    </button>

                </div>

            </form>

        </main>
    );
}