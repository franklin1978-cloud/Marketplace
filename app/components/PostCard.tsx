interface PostCardProps {
    id: number;
    titulo: string;
    empresa: string;
    tipo: "Trabajo" | "Proyecto";
    tags: string[];
    fecha?: string;
}

export default function PostCard({
    id,
    titulo,
    empresa,
    tipo,
    tags = [],
    fecha,
}: PostCardProps) {

    return (
        <article className="bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-blue-500/50 transition-shadow">

            {/* Badge de tipo y fecha */}
            <div className="flex justify-between items-start mb-4">

                <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        tipo === "Trabajo"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-purple-500/20 text-purple-400"
                    }`}
                >
                    {tipo}
                </span>

                {fecha && (
                    <span className="text-xs text-slate-500">
                        {fecha}
                    </span>
                )}

            </div>

            {/* Título */}
            <h2 className="text-xl font-bold text-white mt-4">
                {titulo}
            </h2>

            {/* Empresa */}
            <p className="text-slate-400 text-sm mt-1">
                {empresa}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">

                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded"
                    >
                        {tag}
                    </span>
                ))}

            </div>

            {/* Botón */}
            <button
                type="button"
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors"
            >
                Ver más
            </button>

        </article>
    );
}