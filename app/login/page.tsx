export default function DashboardPage() {
    return (
        <section className="min-h-screen flex items-center justify-center px-4">
            {/* Encabezado */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Mi panel
                </h1>
                <p className="text-slate-400">
                    Bienvenido de vuelta. Gestiona tus publicaciones.
                </p>
            </div>
            {/* Cards placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-slate-800 rounded-xl p-6">
                    <p className="text-slate-400 text-sm mb-1">Publicaciones</p>
                    <p className="text-3xl font-bold text-white">0</p>
                </div>
                {/* Card 2 */}
                <div className="bg-slate-800 rounded-xl p-6">
                    <p className="text-slate-400 text-sm mb-1">Aplicaciones</p>
                    <p className="text-3xl font-bold text-white">0</p>
                </div>
                {/* Card 3 */}
                <div className="bg-slate-800 rounded-xl p-6">
                    <p className="text-slate-400 text-sm mb-1">Vistas</p>
                    <p className="text-3xl font-bold text-white">0</p>
                </div>
            </div>
        </section>
    )
}