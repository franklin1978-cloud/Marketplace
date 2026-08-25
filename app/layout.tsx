import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";

export const metadata: Metadata = {
    title: "Marketplace",
    description: "Marketplace de productos",
};
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="es">

            <body className="bg-slate-950 text-white min-h-screen">

                <CartProvider>

                    <Navbar />

                    <main>
                        {children}
                    </main>

                </CartProvider>

            </body>

        </html>
    );
}