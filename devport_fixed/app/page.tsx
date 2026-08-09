import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-73px)] bg-white text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-20"><div className="max-w-3xl">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">Portal tecnológico</span>
        <h1 className="mt-5 text-5xl font-bold tracking-tight text-slate-900">Encuentra oportunidades tech.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">DevPort conecta profesionales, empresas y proyectos tecnológicos en un solo lugar.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/posts" className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500">Explorar publicaciones</Link><Link href="/login" className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50">Ingresar</Link></div>
      </div></section>
    </main>
  );
}
