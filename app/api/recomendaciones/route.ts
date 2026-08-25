import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { obtenerIdsRecomendados } from "../../../lib/recommendations";

export async function GET(
    request: NextRequest
) {

    try {

        const productoId =
            request.nextUrl.searchParams.get(
                "productoId"
            );

        if (!productoId) {

            return NextResponse.json(
                {
                    error: "Falta productoId"
                },
                {
                    status: 400
                }
            );

        }

        const supabase =
            await createClient();

        /*
         * ==========================================
         * OBTENER PRODUCTO ACTUAL
         * ==========================================
         */

        const {
            data: productoActual,
            error: errorProducto
        } = await supabase
            .from("productos")
            .select(`
                id,
                categoria
            `)
            .eq("id", productoId)
            .maybeSingle();

        if (errorProducto) {

            console.error(
                "Error obteniendo producto actual:",
                errorProducto
            );

            return NextResponse.json(
                {
                    error:
                        "No se pudo obtener el producto"
                },
                {
                    status: 500
                }
            );

        }

        if (!productoActual) {

            return NextResponse.json([]);

        }

        /*
         * ==========================================
         * RECOMENDACIONES DEL MODELO V2
         * ==========================================
         */

        const ids =
            obtenerIdsRecomendados(
                productoId,
                5
            );

        /*
         * ==========================================
         * BUSCAR ESOS IDS EN SUPABASE
         * ==========================================
         */

        let productos: any[] = [];

        if (ids.length > 0) {

            const {
                data,
                error
            } = await supabase
                .from("productos")
                .select(`
                    id,
                    nombre,
                    descripcion,
                    categoria,
                    precio,
                    stock,
                    calificacion,
                    foto
                `)
                .in("id", ids)
                .gt("stock", 0);

            if (error) {

                console.error(
                    "Error obteniendo recomendaciones V2:",
                    error
                );

            } else {

                productos =
                    data || [];

            }

        }

        /*
         * ==========================================
         * FALLBACK PARA PRODUCTOS REALES
         * ==========================================
         *
         * Si los IDs del modelo no corresponden
         * todavía a los productos actuales,
         * buscamos productos de la misma categoría.
         *
         * Esto también permite trabajar con productos
         * creados manualmente por vendedores.
         */

        if (productos.length < 5) {

            const idsExistentes =
                productos.map(
                    (producto) =>
                        String(producto.id)
                );

            const {
                data: productosCategoria,
                error: errorCategoria
            } = await supabase
                .from("productos")
                .select(`
                    id,
                    nombre,
                    descripcion,
                    categoria,
                    precio,
                    stock,
                    calificacion,
                    foto
                `)
                .eq(
                    "categoria",
                    productoActual.categoria
                )
                .neq(
                    "id",
                    productoId
                )
                .gt("stock", 0)
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                )
                .limit(10);

            if (errorCategoria) {

                console.error(
                    "Error obteniendo productos de categoría:",
                    errorCategoria
                );

            } else {

                for (
                    const producto
                    of productosCategoria || []
                ) {

                    if (
                        productos.length >= 5
                    ) {
                        break;
                    }

                    if (
                        idsExistentes.includes(
                            String(producto.id)
                        )
                    ) {
                        continue;
                    }

                    productos.push(
                        producto
                    );

                    idsExistentes.push(
                        String(producto.id)
                    );

                }

            }

        }

        /*
         * ==========================================
         * RESPUESTA FINAL
         * ==========================================
         */

        return NextResponse.json(
            productos.slice(0, 5)
        );

    } catch (error) {

        console.error(
            "Error inesperado en recomendaciones:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Error interno del servidor"
            },
            {
                status: 500
            }
        );

    }

}