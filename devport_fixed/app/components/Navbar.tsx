import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/80 bg-slate-950 shadow-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors">DevPort</Link>
        <div className="flex items-center gap-7 text-sm">
          <Link href="/" className="text-slate-300 hover:text-white transition-colors">Inicio</Link>
          <Link href="/posts" className="text-slate-300 hover:text-white transition-colors">Publicaciones</Link>
          <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
          <Link href="/login" className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md hover:bg-blue-500 transition-colors">Login</Link>
        </div>
      </nav>
    </header>
  );
}
