"use client";

import { useMemo, useState } from "react";
import PostCard from "../components/PostCard";
import SearchBar from "../components/SearchBar";
import { posts } from "../../lib/posts";

export default function PostsPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return posts;
    return posts.filter((post) => [post.titulo, post.empresa, post.ubicacion, post.tipo, ...post.tags].some((value) => value.toLowerCase().includes(term)));
  }, [query]);
  return (
    <main className="min-h-[calc(100vh-73px)] bg-white px-6 py-14 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <SearchBar query={query} onQueryChange={setQuery} />
        <p className="mb-5 text-sm font-medium text-slate-600">{filtered.length} {filtered.length === 1 ? "publicación encontrada" : "publicaciones encontradas"}</p>
        {filtered.length > 0 ? <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{filtered.map((post) => <PostCard key={post.id} {...post} />)}</div> : <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center"><p className="font-semibold text-slate-800">No se encontraron publicaciones</p><p className="mt-2 text-sm text-slate-500">Prueba con otro título, empresa o tecnología.</p></div>}
      </div>
    </main>
  );
}
