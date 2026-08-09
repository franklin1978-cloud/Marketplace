import Link from "next/link";

interface ProductCardProps {
    id: string;
    nombre: string;
    descripcion: string;
    categoria: string;
    precio: number;
    stock: number;
    calificacion: number;
    foto: string;
}

export default function ProductCard({
    id,
    nombre,
    descripcion,
    categoria,
    precio,
    stock,
    calificacion,
    foto
}: ProductCardProps) {

    return (
        <article className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-blue-500/30 transition-shadow">

            <img
                src={foto}
                alt={nombre}
                className="w-full h-52 object-cover"
            />

            <div className="p-5">

                <span className="inline-block bg-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {categoria}
                </span>

                <h2 className="text-xl font-bold text-white">
                    {nombre}
                </h2>

                <p className="text-slate-400 text-sm mt-2">
                    {descripcion}
                </p>

                <div className="flex items-center mt-3">

                    <span className="text-yellow-400">
                        {"★".repeat(Math.round(calificacion))}
                    </span>

                    <span className="text-slate-400 text-sm ml-2">
                        {calificacion}
                    </span>

                </div>

                <div className="flex justify-between items-center mt-4">

                    <span className="text-2xl font-bold text-white">
                        ${precio.toFixed(2)}
                    </span>

                    <span className="text-sm text-slate-400">
                        Stock: {stock}
                    </span>

                </div>

                <Link
                    href={`/productos/${id}`}
                    className="block text-center w-full mt-5 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                    Ver producto
                </Link>

            </div>

        </article>
    );
}