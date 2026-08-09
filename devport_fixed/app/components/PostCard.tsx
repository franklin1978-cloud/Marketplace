import Link from "next/link";
import type { Post } from "../../lib/posts";

export default function PostCard({ id, titulo, empresa, ubicacion, tipo, tags, fecha }: Post) {
  const badgeClass = tipo === "Trabajo" ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/20" : "bg-purple-500/15 text-purple-300 border border-purple-400/20";
  return (
    <article className="flex min-h-[285px] flex-col rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-lg transition duration-200 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3"><span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${badgeClass}`}>{tipo}</span><span className="text-[11px] text-slate-500">{fecha}</span></div>
      <h2 className="mt-4 text-lg font-bold text-white">{titulo}</h2>
      <p className="mt-1 text-sm text-slate-400">{empresa} — {ubicacion}</p>
      <div className="mt-4 flex flex-wrap gap-2">{tags.map((tag) => <span key={tag} className="rounded-md bg-slate-700 px-2.5 py-1 text-[11px] text-blue-200">{tag}</span>)}</div>
      <Link href={`/posts/${id}`} className="mt-auto block w-full rounded-lg bg-blue-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-500">Ver detalles →</Link>
    </article>
  );
}
