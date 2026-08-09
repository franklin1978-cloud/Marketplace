import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
export const metadata: Metadata = { title: "DevPort - Portal de empleo tech", description: "Encuentra empleos y proyectos tecnológicos." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body className="min-h-screen bg-white text-slate-900 antialiased"><Navbar />{children}</body></html>; }
