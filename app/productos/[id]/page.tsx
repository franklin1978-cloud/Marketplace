"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { createClient } from "../../../lib/supabase/client";

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

interface Opinion {
    id: string;
    usuario_id: string;
    calificacion: number;
    comentario: string;
    created_at: string;
}

export default function ProductoDetalle() {

    const params = useParams();

    const id = params.id as string;

    const { agregarAlCarrito } = useCart();

    const supabase = createClient();

    const [producto, setProducto] = useState<Producto | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const [opiniones, setOpiniones] = useState<Opinion[]>([]);
    const [calificacion, setCalificacion] = useState(5);
    const [comentario, setComentario] = useState("");
    const [enviandoOpinion, setEnviandoOpinion] = useState(false);
    const [mensajeOpinion, setMensajeOpinion] = useState("");

    // =====================================================
    // OBTENER PRODUCTO
    // =====================================================

    useEffect(() => {

        const obtenerProducto = async () => {

            try {

                const respuesta = await fetch("/api/productos");

                if (!respuesta.ok) {
                    throw new Error("Error al obtener productos");
                }

                const productos: Producto[] =
                    await respuesta.json();

                const encontrado = productos.find(
                    (producto) =>
                        String(producto.id) === String(id)
                );

                if (!encontrado) {

                    setError("Producto no encontrado");

                    return;
                }

                setProducto(encontrado);

            } catch (error) {

                console.error(error);

                setError(
                    "No se pudo cargar el producto"
                );

            } finally {

                setCargando(false);

            }
        };

        if (id) {
            obtenerProducto();
        }

    }, [id]);

    // =====================================================
    // OBTENER OPINIONES
    // =====================================================

    useEffect(() => {

        const obtenerOpiniones = async () => {

            if (!id) {
                return;
            }

            const {
                data,
                error
            } = await supabase
                .from("opiniones")
                .select(`
                    id,
                    usuario_id,
                    calificacion,
                    comentario,
                    created_at
                `)
                .eq("producto_id", id)
                .order("created_at", {
                    ascending: false
                });

            if (error) {

                console.error(
                    "Error obteniendo opiniones:",
                    error
                );

                return;
            }

            setOpiniones(data || []);
        };

        obtenerOpiniones();

    }, [id, supabase]);

    // =====================================================
    // PUBLICAR OPINIÓN
    // =====================================================

    const publicarOpinion = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        setMensajeOpinion("");

        if (!comentario.trim()) {

            setMensajeOpinion(
                "Escribe un comentario."
            );

            return;
        }

        try {

            setEnviandoOpinion(true);

            const {
                data: {
                    user
                }
            } = await supabase.auth.getUser();

            if (!user) {

                setMensajeOpinion(
                    "Debes iniciar sesión para publicar una opinión."
                );

                return;
            }

            const {
                error
            } = await supabase
                .from("opiniones")
                .insert({
                    producto_id: id,
                    usuario_id: user.id,
                    calificacion,
                    comentario: comentario.trim()
                });

            if (error) {

                console.error(
                    "Error publicando opinión:",
                    error
                );

                setMensajeOpinion(
                    "No se pudo publicar la opinión."
                );

                return;
            }

            setComentario("");
            setCalificacion(5);

            setMensajeOpinion(
                "Opinión publicada correctamente."
            );

            // Recargar opiniones

            const {
                data
            } = await supabase
                .from("opiniones")
                .select(`
                    id,
                    usuario_id,
                    calificacion,
                    comentario,
                    created_at
                `)
                .eq("producto_id", id)
                .order("created_at", {
                    ascending: false
                });

            setOpiniones(data || []);

        } catch (error) {

            console.error(error);

            setMensajeOpinion(
                "Ocurrió un error inesperado."
            );

        } finally {

            setEnviandoOpinion(false);

        }
    };

    // =====================================================
    // CARGANDO
    // =====================================================

    if (cargando) {

        return (
            <main className="max-w-6xl mx-auto px-6 py-10">

                <p className="text-slate-400">
                    Cargando producto...
                </p>

            </main>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error || !producto) {

        return (
            <main className="max-w-6xl mx-auto px-6 py-10">

                <h1 className="text-3xl font-bold text-white">
                    Producto no encontrado
                </h1>

                <p className="text-slate-400 mt-3">
                    {error}
                </p>

                <Link
                    href="/productos"
                    className="inline-block mt-6 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                    ← Volver a productos
                </Link>

            </main>
        );
    }

    // =====================================================
    // PÁGINA
    // =====================================================

    return (

        <main className="max-w-6xl mx-auto px-6 py-10">

            <Link
                href="/productos"
                className="text-blue-400 hover:text-blue-300"
            >
                ← Volver a productos
            </Link>

            {/* PRODUCTO */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">

                {/* IMAGEN */}

                <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg">

                    <img
                        src={producto.foto}
                        alt={producto.nombre}
                        className="w-full h-[450px] object-cover"
                    />

                </div>

                {/* INFORMACIÓN */}

                <div>

                    <span className="inline-block bg-blue-500/20 text-blue-400 text-sm font-semibold px-3 py-1 rounded-full">
                        {producto.categoria}
                    </span>

                    <h1 className="text-4xl font-bold text-white mt-4">
                        {producto.nombre}
                    </h1>

                    {/* CALIFICACIÓN */}

                    <div className="flex items-center mt-4">

                        <span className="text-yellow-400 text-xl">
                            {"★".repeat(
                                Math.round(
                                    producto.calificacion
                                )
                            )}
                        </span>

                        <span className="text-slate-400 ml-3">
                            {producto.calificacion} / 5
                        </span>

                    </div>

                    {/* DESCRIPCIÓN */}

                    <p className="text-slate-300 text-lg mt-6 leading-relaxed">
                        {producto.descripcion}
                    </p>

                    {/* PRECIO */}

                    <div className="mt-8">

                        <span className="text-4xl font-bold text-white">
                            ${producto.precio.toFixed(2)}
                        </span>

                    </div>

                    {/* STOCK */}

                    <div className="mt-4">

                        {producto.stock > 0 ? (

                            <span className="text-green-400">
                                ✓ Disponible — {producto.stock} unidades
                            </span>

                        ) : (

                            <span className="text-red-400">
                                ✕ Producto agotado
                            </span>

                        )}

                    </div>

                    {/* CARRITO */}

                    <button
                        type="button"
                        disabled={producto.stock === 0}
                        onClick={() => {

                            console.log(
                                "PRODUCTO AGREGADO:",
                                producto
                            );

                            agregarAlCarrito(producto);

                            alert(
                                "Producto enviado al carrito"
                            );

                        }}
                        className="w-full mt-8 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-4 rounded-xl"
                    >
                        🛒 Agregar al carrito
                    </button>

                </div>

            </div>

            {/* OPINIONES */}

            <section className="mt-12 bg-slate-800 rounded-2xl p-6">

                <h2 className="text-2xl font-bold text-white">
                    ⭐ Opiniones de compradores
                </h2>

                {/* FORMULARIO */}

                <div className="mt-6">

                    <h3 className="text-lg font-semibold text-white">
                        Publicar una opinión
                    </h3>

                    <form
                        onSubmit={publicarOpinion}
                        className="mt-4 space-y-4"
                    >

                        {/* CALIFICACIÓN */}

                        <div>

                            <label className="block text-slate-300 mb-2">
                                Calificación
                            </label>

                            <select
                                value={calificacion}
                                onChange={(e) =>
                                    setCalificacion(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                                className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3"
                            >

                                <option value={5}>
                                    ⭐⭐⭐⭐⭐
                                </option>

                                <option value={4}>
                                    ⭐⭐⭐⭐
                                </option>

                                <option value={3}>
                                    ⭐⭐⭐
                                </option>

                                <option value={2}>
                                    ⭐⭐
                                </option>

                                <option value={1}>
                                    ⭐
                                </option>

                            </select>

                        </div>

                        {/* COMENTARIO */}

                        <div>

                            <label className="block text-slate-300 mb-2">
                                Comentario
                            </label>

                            <textarea
                                value={comentario}
                                onChange={(e) =>
                                    setComentario(
                                        e.target.value
                                    )
                                }
                                rows={4}
                                placeholder="¿Qué opinas de este producto?"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                            />

                        </div>

                        {/* MENSAJE */}

                        {mensajeOpinion && (

                            <p className="text-blue-400">
                                {mensajeOpinion}
                            </p>

                        )}

                        {/* BOTÓN */}

                        <button
                            type="submit"
                            disabled={enviandoOpinion}
                            className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 text-white font-semibold px-6 py-3 rounded-lg"
                        >

                            {enviandoOpinion
                                ? "Publicando..."
                                : "Publicar opinión"}

                        </button>

                    </form>

                </div>

                {/* LISTA DE OPINIONES */}

                <div className="mt-10 space-y-4">

                    {opiniones.length === 0 ? (

                        <p className="text-slate-400">
                            Este producto todavía no tiene opiniones.
                        </p>

                    ) : (

                        opiniones.map((opinion) => (

                            <div
                                key={opinion.id}
                                className="bg-slate-900 rounded-xl p-5"
                            >

                                <div className="flex items-center justify-between">

                                    <div className="text-yellow-400 text-lg">

                                        {"★".repeat(
                                            opinion.calificacion
                                        )}

                                    </div>

                                    <span className="text-slate-500 text-sm">

                                        {new Date(
                                            opinion.created_at
                                        )
                                            .toISOString()
                                            .slice(0, 10)}

                                    </span>

                                </div>

                                <p className="text-slate-300 mt-3">
                                    {opinion.comentario}
                                </p>

                            </div>

                        ))

                    )}

                </div>

            </section>

        </main>
    );
}