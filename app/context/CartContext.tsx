"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

interface Producto {
    id: string;
    nombre: string;
    descripcion: string;
    categoria: string;
    precio: number;
    stock: number;
    calificacion: number;
    foto: string;
}

interface ProductoCarrito extends Producto {
    cantidad: number;
}

interface CartContextType {
    carrito: ProductoCarrito[];
    agregarAlCarrito: (producto: Producto) => void;
    eliminarDelCarrito: (id: string) => void;
    aumentarCantidad: (id: string) => void;
    disminuirCantidad: (id: string) => void;
    vaciarCarrito: () => void;
    cantidadTotal: number;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
    children,
}: {
    children: ReactNode;
}) {

    const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
    const [cargado, setCargado] = useState(false);

    // ==========================================
    // CARGAR CARRITO DESDE LOCALSTORAGE
    // ==========================================

    useEffect(() => {

        try {

            const carritoGuardado =
                localStorage.getItem("carrito");

            if (carritoGuardado) {

                const carritoParseado =
                    JSON.parse(carritoGuardado);

                if (Array.isArray(carritoParseado)) {
                    setCarrito(carritoParseado);
                }

            }

        } catch (error) {

            console.error(
                "Error al cargar el carrito:",
                error
            );

        } finally {

            setCargado(true);

        }

    }, []);

    // ==========================================
    // GUARDAR CARRITO
    // ==========================================

    useEffect(() => {

        if (!cargado) {
            return;
        }

        try {

            localStorage.setItem(
                "carrito",
                JSON.stringify(carrito)
            );

        } catch (error) {

            console.error(
                "Error al guardar el carrito:",
                error
            );

        }

    }, [carrito, cargado]);

    // ==========================================
    // AGREGAR PRODUCTO
    // ==========================================

    const agregarAlCarrito = (
        producto: Producto
    ) => {

        setCarrito((carritoActual) => {

            const productoExistente =
                carritoActual.find(
                    (item) =>
                        String(item.id) ===
                        String(producto.id)
                );

            // Si el producto ya existe
            if (productoExistente) {

                return carritoActual.map((item) => {

                    if (
                        String(item.id) !==
                        String(producto.id)
                    ) {
                        return item;
                    }

                    // No superar el stock disponible
                    if (
                        item.cantidad >=
                        item.stock
                    ) {
                        return item;
                    }

                    return {
                        ...item,
                        cantidad:
                            item.cantidad + 1,
                    };

                });

            }

            // Producto nuevo
            return [
                ...carritoActual,
                {
                    ...producto,
                    cantidad: 1,
                },
            ];

        });

    };

    // ==========================================
    // ELIMINAR PRODUCTO
    // ==========================================

    const eliminarDelCarrito = (
        id: string
    ) => {

        setCarrito((carritoActual) =>
            carritoActual.filter(
                (item) =>
                    String(item.id) !==
                    String(id)
            )
        );

    };

    // ==========================================
    // AUMENTAR CANTIDAD
    // ==========================================

    const aumentarCantidad = (
        id: string
    ) => {

        setCarrito((carritoActual) =>

            carritoActual.map((item) => {

                if (
                    String(item.id) !==
                    String(id)
                ) {
                    return item;
                }

                if (
                    item.cantidad >=
                    item.stock
                ) {
                    return item;
                }

                return {
                    ...item,
                    cantidad:
                        item.cantidad + 1,
                };

            })

        );

    };

    // ==========================================
    // DISMINUIR CANTIDAD
    // ==========================================

    const disminuirCantidad = (
        id: string
    ) => {

        setCarrito((carritoActual) =>

            carritoActual
                .map((item) => {

                    if (
                        String(item.id) !==
                        String(id)
                    ) {
                        return item;
                    }

                    return {
                        ...item,
                        cantidad:
                            item.cantidad - 1,
                    };

                })
                .filter(
                    (item) =>
                        item.cantidad > 0
                )

        );

    };

    // ==========================================
    // VACIAR CARRITO
    // ==========================================

    const vaciarCarrito = () => {

        setCarrito([]);

        try {
            localStorage.removeItem("carrito");
        } catch (error) {
            console.error(
                "Error al vaciar el carrito:",
                error
            );
        }

    };

    // ==========================================
    // CANTIDAD TOTAL
    // ==========================================

    const cantidadTotal =
        carrito.reduce(
            (total, producto) =>
                total + producto.cantidad,
            0
        );

    // ==========================================
    // PRECIO TOTAL
    // ==========================================

    const total =
        carrito.reduce(
            (total, producto) =>
                total +
                producto.precio *
                    producto.cantidad,
            0
        );

    // ==========================================
    // PROVIDER
    // ==========================================

    return (

        <CartContext.Provider
            value={{
                carrito,
                agregarAlCarrito,
                eliminarDelCarrito,
                aumentarCantidad,
                disminuirCantidad,
                vaciarCarrito,
                cantidadTotal,
                total,
            }}
        >

            {children}

        </CartContext.Provider>

    );
}

// ==========================================
// HOOK useCart
// ==========================================

export function useCart() {

    const context =
        useContext(CartContext);

    if (!context) {

        throw new Error(
            "useCart debe utilizarse dentro de CartProvider"
        );

    }

    return context;
}