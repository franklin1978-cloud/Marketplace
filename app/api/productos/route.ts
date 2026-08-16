import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET() {
    try {

        const supabase = await createClient();

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
            .order("created_at", {
                ascending: false
            });

        if (error) {

            console.error(
                "Error obteniendo productos:",
                error
            );

            return NextResponse.json(
                {
                    error: "No se pudieron obtener los productos"
                },
                {
                    status: 500
                }
            );
        }

        return NextResponse.json(data);

    } catch (error) {

        console.error(
            "Error inesperado:",
            error
        );

        return NextResponse.json(
            {
                error: "Error interno del servidor"
            },
            {
                status: 500
            }
        );
    }
}