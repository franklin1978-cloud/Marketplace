export default function DashboardPage() {
  const stats = [["Publicaciones", "3", "Activas"], ["Aplicaciones", "12", "En proceso"], ["Vistas", "248", "Este mes"]];
  return (
    <main className="min-h-[calc(100vh-73px)] bg-white px-6 py-14 text-slate-900"><section className="mx-auto max-w-5xl">
      <div className="mb-10"><p className="text-sm font-semibold text-blue-600">Dashboard</p><h1 className="mt-1 text-3xl font-bold">Mi panel</h1><p className="mt-2 text-slate-500">Gestiona tus publicaciones y consulta el rendimiento de tu perfil.</p></div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">{stats.map(([title, value, caption]) => <div key={title} className="rounded-2xl border border-slate-200 bg-slate-900 p-6 shadow-lg"><p className="text-sm text-slate-400">{title}</p><p className="mt-2 text-4xl font-bold text-white">{value}</p><p className="mt-2 text-xs text-slate-500">{caption}</p></div>)}</div>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6"><h2 className="font-bold text-slate-900">Actividad reciente</h2><p className="mt-2 text-sm text-slate-500">Tu panel está listo para conectarse con Supabase y almacenar datos reales.</p></div>
    </section></main>
  );
}
