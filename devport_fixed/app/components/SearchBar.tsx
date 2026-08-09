"use client";

interface SearchBarProps { query: string; onQueryChange: (newQuery: string) => void; }

export default function SearchBar({ query, onQueryChange }: SearchBarProps) {
  return (
    <div className="relative mb-6">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">Buscar</span>
      <input type="text" value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Buscar por título, empresa o tecnología..." aria-label="Buscar publicaciones" className="w-full rounded-xl border border-slate-600 bg-slate-800 py-3 pl-20 pr-4 text-sm text-white placeholder:text-slate-500 shadow-md outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
    </div>
  );
}
