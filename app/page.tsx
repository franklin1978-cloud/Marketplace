"use client";

import { useState } from "react";
import PostCard from "./components/PostCard";
import SearchBar from "./components/SearchBar";

const posts = [
    {
        id: 1,
        titulo: "Desarrollador Frontend",
        empresa: "Google · San Francisco, CA",
        tipo: "Trabajo" as const,
        tags: ["React", "TypeScript", "Tailwind CSS"],
        fecha: "Publicado hace 2 días",
    },
    {
        id: 2,
        titulo: "Proyecto de Desarrollo Web",
        empresa: "Innovate Labs",
        tipo: "Proyecto" as const,
        tags: ["Next.js", "Node.js", "MongoDB"],
        fecha: "Publicado hace 5 días",
    },
    {
        id: 3,
        titulo: "Diseñador UI/UX",
        empresa: "Creative Studio",
        tipo: "Trabajo" as const,
        tags: ["Figma", "Adobe XD", "Prototyping"],
        fecha: "Publicado hace 1 semana",
    },
    {
        id: 4,
        titulo: "Proyecto de Aplicación Móvil",
        empresa: "Startup Innovadora",
        tipo: "Proyecto" as const,
        tags: ["React Native", "JavaScript", "Firebase"],
        fecha: "Publicado hace 3 días",
    },
];

export default function Page() {

    const [query, setQuery] = useState("");

    const filtered = posts.filter((post) =>
        post.titulo.toLowerCase().includes(query.toLowerCase()) ||
        post.empresa.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
        )
    );

    return (
        <main className="max-w-4xl mx-auto px-6 py-10">

            <h1 className="text-3xl font-bold text-white mb-8">
                Publicaciones
            </h1>

            <SearchBar
                query={query}
                onQueryChange={setQuery}
            />

            <p className="text-sm text-slate-400 mb-6">
                {filtered.length} publicaciones encontradas
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {filtered.map((post) => (
                    <PostCard
                        key={post.id}
                        {...post}
                    />
                ))}

            </div>

            {filtered.length === 0 && (
                <p className="text-slate-400 mt-6">
                    No se encontraron publicaciones para{" "}
                    <b>{query}</b>.
                </p>
            )}

        </main>
    );
}