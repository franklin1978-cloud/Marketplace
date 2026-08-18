"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../lib/supabase/client";
import VendedorGuard from "../../components/VendedorGuard";

export default function NuevoProductoPage() {
    const router = useRouter();
    const supabase = createClient();

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categoria, setCategoria] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [imagen, setImagen] = useState<File | null>(null);

    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const seleccionarImagen = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const archivo = event.target.files?.[0];

        if (!archivo) {
            return;
        }

        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!tiposPermitidos.includes(archivo.type)) {
            setError(
                "Solo se permiten imágenes JPG, PNG o WEBP."
            );
            setImagen(null);
            return;
        }

        if (archivo.size > 5 * 1024 * 1024) {
            setError(
                "La imagen no puede superar los 5 MB."
            );
            setImagen(null);
            return;
        }

        setError("");
        setImagen(archivo);
    };

    const publicarProducto = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setError("");
        setMensaje("");

        if (
            !nombre ||
            !descripcion ||
            !categoria ||
            !precio ||
            !stock
        ) {
            setError(
                "Completa todos los campos obligatorios."
            );
            return;
        }

        if (!imagen) {
            setError(
                "Selecciona una imagen para el producto."
            );
            return;
        }

        try {
            setCargando(true);

            const {
                data: {
                    user
                },
                error: usuarioError
            } = await supabase.auth.getUser();

            if (usuarioError || !user) {
                setError(
                    "Debes iniciar sesión para publicar productos."
                );
                return;
            }

            const extension =
                imagen.name
                    .split(".")
                    .pop()
                    ?.toLowerCase() || "jpg";

            const nombreArchivo =
                `${crypto.randomUUID()}.${extension}`;

            const rutaImagen =
                `${user.id}/${nombreArchivo}`;

            const {
                error: uploadError
            } = await supabase.storage
                .from("productos")
                .upload(
                    rutaImagen,
                    imagen,
                    {
                        cacheControl: "3600",
                        upsert: false
                    }
                );

            if (uploadError) {
                console.error(
                    "Error subiendo imagen:",
                    uploadError
                );

                setError(
                    "No se pudo subir la imagen."
                );

                return;
            }

            const {
                data: imagenPublica
            } = supabase.storage
                .from("productos")
                .getPublicUrl(rutaImagen);

            const {
                error: productoError
            } = await supabase
                .from("productos")
                .insert({
                    vendedor_id: user.id,
                    nombre,
                    descripcion,
                    categoria,
                    precio: Number(precio),
                    stock: Number(stock),
                    calificacion: 0,
                    foto: imagenPublica.publicUrl
                });

            if (productoError) {
                console.error(
                    "Error creando producto:",
                    productoError
                );

                await supabase.storage
                    .from("productos")
                    .remove([rutaImagen]);

                setError(
                    "No se pudo crear el producto."
                );

                return;
            }

            setMensaje(
                "Producto publicado correctamente."
            );

            setNombre("");
            setDescripcion("");
            setCategoria("");
            setPrecio("");
            setStock("");
            setImagen(null);

            setTimeout(() => {
                router.push("/vendedor/productos");
                router.refresh();
            }, 1000);

        } catch (error) {

            console.error(error);

            setError(
                "Ocurrió un error inesperado."
            );

        } finally {

            setCargando(false);

        }
    };

    return (
        </VendedorGuard>
        <main className="max-w-4xl mx-auto px-6 py-10">

            <h1 className="text-4xl font-bold text-white">
                Publicar producto
            </h1>

            <p className="text-slate-400 mt-2">
                Agrega un nuevo producto a tu tienda.
            </p>

            <form
                onSubmit={publicarProducto}
                className="bg-slate-800 rounded-2xl p-6 mt-8 space-y-6"
            >

                <div>
                    <label className="block text-white font-semibold mb-2">
                        Nombre del producto
                    </label>

                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) =>
                            setNombre(e.target.value)
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                        placeholder="Ej: Laptop Lenovo"
                    />
                </div>

                <div>
                    <label className="block text-white font-semibold mb-2">
                        Descripción
                    </label>

                    <textarea
                        value={descripcion}
                        onChange={(e) =>
                            setDescripcion(e.target.value)
                        }
                        rows={5}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                        placeholder="Describe el producto..."
                    />
                </div>

                <div>
                    <label className="block text-white font-semibold mb-2">
                        Categoría
                    </label>

                    <input
                        type="text"
                        value={categoria}
                        onChange={(e) =>
                            setCategoria(e.target.value)
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                        placeholder="Ej: Computadoras"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block text-white font-semibold mb-2">
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
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-white font-semibold mb-2">
                            Stock
                        </label>

                        <input
                            type="number"
                            min="0"
                            value={stock}
                            onChange={(e) =>
                                setStock(e.target.value)
                            }
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                            placeholder="0"
                        />
                    </div>

                </div>

                <div>
                    <label className="block text-white font-semibold mb-2">
                        Imagen del producto
                    </label>

                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={seleccionarImagen}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white file:mr-4 file:bg-blue-500 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg"
                    />

                    <p className="text-slate-500 text-sm mt-2">
                        JPG, PNG o WEBP. Máximo 5 MB.
                    </p>

                    {imagen && (
                        <p className="text-green-400 text-sm mt-2">
                            ✓ {imagen.name}
                        </p>
                    )}
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4">
                        {error}
                    </div>
                )}

                {mensaje && (
                    <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg p-4">
                        {mensaje}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={cargando}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors"
                >
                    {cargando
                        ? "Publicando..."
                        : "Publicar producto"}
                </button>

            </form>

        </main>
        </VendedorGuard>
    );
}