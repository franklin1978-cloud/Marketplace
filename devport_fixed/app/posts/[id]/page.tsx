import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "../../../lib/posts";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = posts.find((item) => item.id === Number(id));
  if (!post) notFound();
  return (
    <main className="min-h-[calc(100vh-73px)] bg-white px-6 py-14 text-slate-900"><div className="mx-auto max-w-3xl">
      <Link href="/posts" className="text-sm font-semibold text-blue-600 hover:text-blue-500">← Volver a publicaciones</Link>
      <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{post.tipo}</span><h1 className="mt-5 text-3xl font-bold">{post.titulo}</h1><p className="mt-2 text-slate-500">{post.empresa} — {post.ubicacion}</p><div className="mt-5 flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag} className="rounded-md bg-slate-100 px-3 py-1 text-xs text-slate-700">{tag}</span>)}</div><p className="mt-8 leading-7 text-slate-600">{post.descripcion}</p><button className="mt-8 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500">Postular / participar</button></article>
    </div></main>
  );
}
