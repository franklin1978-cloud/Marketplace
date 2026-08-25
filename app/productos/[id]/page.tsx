"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { createClient } from "../../../lib/supabase/client";
import RecommendedProducts from "../../components/RecommendedProducts";

interface Producto {
    id: string;
    nombre: string;
    descripcion: string;
    categoria: string;
    precio: number;
    stock: number;
    calificacion: number;
    foto: string | null;
}

interface Opinion {
    id: string;
    usuario_id: string;
    calificacion: number;
    comentario: string;
    created_at: string;
}

export default function ProductoDetallePage() {

    const params = useParams();
    const id = params.id as string;

    const { agregarAlCarrito } = useCart();

    const supabase = createClient();

    const [producto, setProducto] =
        useState<Producto | null>(null);

    const [opiniones, setOpiniones] =
        useState<Opinion[]>([]);

    const [calificacion, setCalificacion] =
        useState(5);

    const [comentario, setComentario] =
        useState("");

    const [puedeOpinar, setPuedeOpinar] =
        useState(false);

    const [yaOpino, setYaOpino] =
        useState(false);

    const [enviandoOpinion, setEnviandoOpinion] =
        useState(false);

    const [mensajeOpinion, setMensajeOpinion] =
        useState("");

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState("");

    /*
     * ==========================================
     * CARGAR PRODUCTO Y OPINIONES
     * ==========================================
     */

    useEffect(() => {

        const cargarDatos = async () => {

            try {

                setCargando(true);
                setError("");

                /*
                 * OBTENER PRODUCTOS DESDE EL API
                 */

                const respuesta =
                    await fetch("/api/productos", {
                        cache: "no-store"
                    });

                if (!respuesta.ok) {

                    throw new Error(
                        "No se pudieron obtener los productos."
                    );
                }

                const productos: Producto[] =
                    await respuesta.json();

                const productoEncontrado =
                    productos.find(
                        (item) =>
                            String(item.id) ===
                            String(id)
                    );

                if (!productoEncontrado) {

                    setError(
                        "Producto no encontrado."
                    );

                    return;
                }

                setProducto(productoEncontrado);

                /*
                 * OBTENER OPINIONES
                 */

                const {
                    data: opinionesData,
                    error: errorOpiniones
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

                if (errorOpiniones) {

                    console.error(
                        "Error obteniendo opiniones:",
                        errorOpiniones
                    );

                } else {

                    setOpiniones(
                        opinionesData || []
                    );

                }

                /*
                 * OBTENER USUARIO
                 */

                const {
                    data: {
                        user
                    }
                } = await supabase.auth.getUser();

                if (!user) {
                    return;
                }

                /*
                 * COMPROBAR SI COMPRÓ EL PRODUCTO
                 */

                const {
                    data: detallesCompra,
                    error: errorCompra
                } = await supabase
                    .from("detalle_pedidos")
                    .select(`
                        id,
                        pedido_id,
                        pedidos!inner (
                            id,
                            usuario_id
                        )
                    `)
                    .eq("producto_id", id)
                    .eq(
                        "pedidos.usuario_id",
                        user.id
                    );

                if (errorCompra) {

                    console.error(
                        "Error verificando compra:",
                        errorCompra
                    );

                } else if (
                    detallesCompra &&
                    detallesCompra.length > 0
                ) {

                    setPuedeOpinar(true);

                }

                /*
                 * COMPROBAR SI YA OPINÓ
                 */

                const opinionExistente =
                    (opinionesData || []).find(
                        (opinion) =>
                            opinion.usuario_id ===
                            user.id
                    );

                if (opinionExistente) {

                    setYaOpino(true);

                }

            } catch (error) {

                console.error(
                    "Error cargando detalle:",
                    error
                );

                setError(
                    "No se pudo cargar el producto."
                );

            } finally {

                setCargando(false);

            }

        };

        if (id) {
            cargarDatos();
        }

    }, [id, supabase]);

    /*
     * ==========================================
     * PUBLICAR OPINIÓN
     * ==========================================
     */

    const publicarOpinion = async (
        event: React.FormEvent<HTMLFormElement>
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

            /*
             * OBTENER USUARIO
             */

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

            /*
             * COMPROBAR COMPRA
             */

            const {
                data: detallesCompra,
                error: errorCompra
            } = await supabase
                .from("detalle_pedidos")
                .select(`
                    id,
                    pedido_id,
                    pedidos!inner (
                        id,
                        usuario_id
                    )
                `)
                .eq("producto_id", id)
                .eq(
                    "pedidos.usuario_id",
                    user.id
                );

            if (errorCompra) {

                console.error(
                    "Error verificando compra:",
                    errorCompra
                );

                setMensajeOpinion(
                    "No se pudo verificar tu compra."
                );

                return;
            }

            if (
                !detallesCompra ||
                detallesCompra.length === 0
            ) {

                setMensajeOpinion(
                    "Solo puedes opinar sobre productos que hayas comprado."
                );

                return;
            }

            /*
             * COMPROBAR OPINIÓN EXISTENTE
             */

            const {
                data: opinionExistente,
                error: errorOpinion
            } = await supabase
                .from("opiniones")
                .select("id")
                .eq("producto_id", id)
                .eq("usuario_id", user.id)
                .maybeSingle();

            if (errorOpinion) {

                console.error(
                    "Error verificando opinión:",
                    errorOpinion
                );

                setMensajeOpinion(
                    "No se pudo verificar la opinión."
                );

                return;
            }

            if (opinionExistente) {

                setYaOpino(true);

                setMensajeOpinion(
                    "Ya has publicado una opinión para este producto."
                );

                return;
            }

            /*
             * INSERTAR OPINIÓN
             */

            const {
                error: errorInsertar
            } = await supabase
                .from("opiniones")
                .insert({
                    producto_id: id,
                    usuario_id: user.id,
                    calificacion,
                    comentario: comentario.trim()
                });

            if (errorInsertar) {

                console.error(
                    "Error publicando opinión:",
                    errorInsertar
                );

                setMensajeOpinion(
                    "No se pudo publicar la opinión."
                );

                return;
            }

            /*
             * LIMPIAR FORMULARIO
             */

            setComentario("");
            setCalificacion(5);
            setYaOpino(true);

            setMensajeOpinion(
                "Opinión publicada correctamente."
            );

            /*
             * RECARGAR OPINIONES
             */

            const {
                data: opinionesActualizadas
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

            setOpiniones(
                opinionesActualizadas || []
            );

        } catch (error) {

            console.error(
                "Error publicando opinión:",
                error
            );

            setMensajeOpinion(
                "Ocurrió un error inesperado."
            );

        } finally {

            setEnviandoOpinion(false);

        }
    };

    /*
     * ==========================================
     * CARGANDO
     * ==========================================
     */

    if (cargando) {

        return (

            <main className="max-w-6xl mx-auto px-6 py-10">

                <p className="text-slate-400">
                    Cargando producto...
                </p>

            </main>
        );
    }

    /*
     * ==========================================
     * ERROR
     * ==========================================
     */

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
                    className="inline-block mt-6 bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg"
                >
                    ← Volver a productos
                </Link>

            </main>
        );
    }

    /*
     * ==========================================
     * PÁGINA PRINCIPAL
     * ==========================================
     */

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

                    {producto.foto ? (

                        <img
                            src={producto.foto}
                            alt={producto.nombre}
                            className="w-full h-[450px] object-cover"
                        />

                    ) : (

                        <div className="w-full h-[450px] bg-slate-700 flex items-center justify-center">

                            <span className="text-7xl">
                                📦
                            </span>

                        </div>

                    )}

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
                                Math.max(
                                    0,
                                    Math.min(
                                        5,
                                        Math.round(
                                            Number(
                                                producto.calificacion
                                            ) || 0
                                        )
                                    )
                                )
                            )}

                        </span>

                        <span className="text-slate-400 ml-3">
                            {Number(
                                producto.calificacion || 0
                            ).toFixed(1)}
                            / 5
                        </span>

                    </div>

                    {/* DESCRIPCIÓN */}

                    <p className="text-slate-300 text-lg mt-6 leading-relaxed">
                        {producto.descripcion}
                    </p>

                    {/* PRECIO */}

                    <div className="mt-8">

                        <span className="text-4xl font-bold text-white">
                            $
                            {Number(
                                producto.precio
                            ).toFixed(2)}
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

                    {/* AGREGAR AL CARRITO */}

                    <button
                        type="button"
                        disabled={producto.stock <= 0}
                        onClick={() => {

                            agregarAlCarrito(
                                producto
                            );

                            alert(
                                "Producto agregado al carrito."
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

                    {puedeOpinar && !yaOpino ? (

                        <>

                            <h3 className="text-lg font-semibold text-white">
                                Publicar una opinión
                            </h3>

                            <form
                                onSubmit={
                                    publicarOpinion
                                }
                                className="mt-4 space-y-4"
                            >

                                <div>

                                    <label className="block text-slate-300 mb-2">
                                        Calificación
                                    </label>

                                    <select
                                        value={
                                            calificacion
                                        }
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

                                <div>

                                    <label className="block text-slate-300 mb-2">
                                        Comentario
                                    </label>

                                    <textarea
                                        value={
                                            comentario
                                        }
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

                                {mensajeOpinion && (

                                    <p className="text-blue-400">
                                        {mensajeOpinion}
                                    </p>

                                )}

                                <button
                                    type="submit"
                                    disabled={
                                        enviandoOpinion
                                    }
                                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 text-white font-semibold px-6 py-3 rounded-lg"
                                >
                                    {enviandoOpinion
                                        ? "Publicando..."
                                        : "Publicar opinión"}
                                </button>

                            </form>

                        </>

                    ) : yaOpino ? (

                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">

                            <p className="text-green-400 font-semibold">
                                ✓ Ya has publicado una opinión sobre este producto.
                            </p>

                        </div>

                    ) : (

                        <div className="bg-slate-900 rounded-xl p-5">

                            <p className="text-slate-400">
                                Solo los compradores de este producto pueden publicar una opinión.
                            </p>

                        </div>

                    )}

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
                                            Math.max(
                                                0,
                                                Math.min(
                                                    5,
                                                    Number(
                                                        opinion.calificacion
                                                    )
                                                )
                                            )
                                        )}

                                    </div>

                                    <span className="text-slate-500 text-sm">

                                        {new Date(
                                            opinion.created_at
                                        ).toLocaleDateString(
                                            "es-EC"
                                        )}

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

            <RecommendedProducts
                productoId={producto.id}
            />

        </main>
    );
}