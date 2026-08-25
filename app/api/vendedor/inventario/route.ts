import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/*
 * ==========================================
 * GET
 * Obtener productos del vendedor
 * ==========================================
 */

export async function GET() {

    try {

        const supabase = await createClient();

        const {
            data: {
                user
            }
        } = await supabase.auth.getUser();

        if (!user) {

            return NextResponse.json(
                {
                    error: "Usuario no autenticado."
                },
                {
                    status: 401
                }
            );
        }

        const {
            data,
            error
        } = await supabase
            .from("productos")
            .select(
                `
                id,
                nombre,
                descripcion,
                categoria,
                precio,
                stock,
                calificacion,
                foto,
                created_at
                `
            )
            .eq(
                "vendedor_id",
                user.id
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

        if (error) {

            console.error(
                "Error obteniendo inventario:",
                error
            );

            return NextResponse.json(
                {
                    error:
                        "No se pudo obtener el inventario."
                },
                {
                    status: 500
                }
            );
        }

        return NextResponse.json(
            data || [],
            {
                status: 200
            }
        );

    } catch (error) {

        console.error(
            "Error inesperado en inventario:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Error interno del servidor."
            },
            {
                status: 500
            }
        );
    }
}


/*
 * ==========================================
 * PATCH
 * Actualizar stock
 * ==========================================
 */

export async function PATCH(
    request: Request
) {

    try {

        const supabase = await createClient();

        const {
            data: {
                user
            }
        } = await supabase.auth.getUser();

        if (!user) {

            return NextResponse.json(
                {
                    error: "Usuario no autenticado."
                },
                {
                    status: 401
                }
            );
        }

        const body = await request.json();

        const productoId =
            body.producto_id;

        const nuevoStock =
            Number(body.stock);

        if (!productoId) {

            return NextResponse.json(
                {
                    error:
                        "El producto es obligatorio."
                },
                {
                    status: 400
                }
            );
        }

        if (
            !Number.isInteger(nuevoStock) ||
            nuevoStock < 0
        ) {

            return NextResponse.json(
                {
                    error:
                        "El stock debe ser un número entero mayor o igual a 0."
                },
                {
                    status: 400
                }
            );
        }

        /*
         * Primero comprobamos que el producto
         * pertenece al vendedor autenticado.
         */

        const {
            data: producto,
            error: errorProducto
        } = await supabase
            .from("productos")
            .select(
                "id, vendedor_id, stock"
            )
            .eq(
                "id",
                productoId
            )
            .eq(
                "vendedor_id",
                user.id
            )
            .single();

        if (
            errorProducto ||
            !producto
        ) {

            return NextResponse.json(
                {
                    error:
                        "Producto no encontrado o no pertenece al vendedor."
                },
                {
                    status: 404
                }
            );
        }

        /*
         * Actualizamos únicamente el stock.
         */

        const {
            data,
            error
        } = await supabase
            .from("productos")
            .update({
                stock: nuevoStock
            })
            .eq(
                "id",
                productoId
            )
            .eq(
                "vendedor_id",
                user.id
            )
            .select(
                `
                id,
                nombre,
                descripcion,
                categoria,
                precio,
                stock,
                calificacion,
                foto,
                created_at
                `
            )
            .single();

        if (error) {

            console.error(
                "Error actualizando stock:",
                error
            );

            return NextResponse.json(
                {
                    error:
                        "No se pudo actualizar el stock."
                },
                {
                    status: 500
                }
            );
        }

        return NextResponse.json(
            data,
            {
                status: 200
            }
        );

    } catch (error) {

        console.error(
            "Error inesperado actualizando inventario:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Error interno del servidor."
            },
            {
                status: 500
            }
        );
    }
}