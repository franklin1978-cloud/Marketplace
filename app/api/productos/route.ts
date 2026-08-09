import { NextResponse } from "next/server";

const productos = [
    {
        id: "1",
        nombre: "Laptop Lenovo IdeaPad",
        descripcion: "Laptop para trabajo, estudio y uso diario.",
        categoria: "Computación",
        precio: 799.99,
        stock: 15,
        calificacion: 4.8,
        foto: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"
    },
    {
        id: "2",
        nombre: "iPhone 15",
        descripcion: "Smartphone de última generación.",
        categoria: "Smartphones",
        precio: 899.99,
        stock: 20,
        calificacion: 4.7,
        foto: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a"
    },
    {
        id: "3",
        nombre: "Audífonos Sony",
        descripcion: "Audífonos inalámbricos con excelente calidad de sonido.",
        categoria: "Audio",
        precio: 149.99,
        stock: 30,
        calificacion: 4.6,
        foto: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
    },
    {
        id: "4",
        nombre: "Smartwatch",
        descripcion: "Reloj inteligente para actividad física y notificaciones.",
        categoria: "Tecnología",
        precio: 199.99,
        stock: 12,
        calificacion: 4.5,
        foto: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    },
    {
        id: "5",
        nombre: "Cámara Digital",
        descripcion: "Cámara digital para fotografía y video.",
        categoria: "Fotografía",
        precio: 549.99,
        stock: 8,
        calificacion: 4.9,
        foto: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
    }
];

export async function GET() {
    return NextResponse.json(productos);
}