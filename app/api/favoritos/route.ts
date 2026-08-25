import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET() {
    try {

        const supabase = await createClient();

        const {
            data: { user },
            error: errorUsuario
        } = await supabase.auth.getUser();

        if (errorUsuario) {
            return NextResponse.json(
                { error: "No se pudo verificar el usuario." },
                { status: 401 }
            );
        }

        if (!user) {
            return NextResponse.json(
                { error: "Debes iniciar sesión." },
                { status: 401 }
            );
        }

        const {
            data,
            error
        } = await supabase
            .from("favoritos")
            .select(`
                id,
                usuario_id,
                producto_id,
                created_at,
                productos (
                    id,
                    nombre,
                    descripcion,
                    categoria,
                    precio,
                    stock,
                    calificacion,
                    foto
                )
            `)
            .eq("usuario_id", user.id)
            .order("created_at", {
                ascending: false
            });

        if (error) {
            console.error(
                "Error obteniendo favoritos:",
                error
            );

            return NextResponse.json(
                {
                    error: "No se pudieron obtener los favoritos."
                },
                {
                    status: 500
                }
            );
        }

        return NextResponse.json(data || []);

    } catch (error) {

        console.error(
            "Error inesperado:",
            error
        );

        return NextResponse.json(
            {
                error: "Error interno del servidor."
            },
            {
                status: 500
            }
        );
    }
}

export async function POST(request: Request) {

    try {

        const supabase = await createClient();

        const {
            data: { user },
            error: errorUsuario
        } = await supabase.auth.getUser();

        if (errorUsuario) {
            return NextResponse.json(
                { error: "No se pudo verificar el usuario." },
                { status: 401 }
            );
        }

        if (!user) {
            return NextResponse.json(
                { error: "Debes iniciar sesión." },
                { status: 401 }
            );
        }

        const body = await request.json();

        const producto_id = body.producto_id;

        if (!producto_id) {
            return NextResponse.json(
                {
                    error: "El producto es obligatorio."
                },
                {
                    status: 400
                }
            );
        }

        const {
            data,
            error
        } = await supabase
            .from("favoritos")
            .insert({
                usuario_id: user.id,
                producto_id
            })
            .select()
            .single();

        if (error) {

            if (error.code === "23505") {

                return NextResponse.json(
                    {
                        error: "El producto ya está en favoritos."
                    },
                    {
                        status: 409
                    }
                );
            }

            console.error(
                "Error agregando favorito:",
                error
            );

            return NextResponse.json(
                {
                    error: "No se pudo agregar el favorito."
                },
                {
                    status: 500
                }
            );
        }

        return NextResponse.json(
            data,
            {
                status: 201
            }
        );

    } catch (error) {

        console.error(
            "Error inesperado:",
            error
        );

        return NextResponse.json(
            {
                error: "Error interno del servidor."
            },
            {
                status: 500
            }
        );
    }
}

export async function DELETE(request: Request) {

    try {

        const supabase = await createClient();

        const {
            data: { user },
            error: errorUsuario
        } = await supabase.auth.getUser();

        if (errorUsuario) {
            return NextResponse.json(
                { error: "No se pudo verificar el usuario." },
                { status: 401 }
            );
        }

        if (!user) {
            return NextResponse.json(
                { error: "Debes iniciar sesión." },
                { status: 401 }
            );
        }

        const body = await request.json();

        const producto_id = body.producto_id;

        if (!producto_id) {
            return NextResponse.json(
                {
                    error: "El producto es obligatorio."
                },
                {
                    status: 400
                }
            );
        }

        const {
            error
        } = await supabase
            .from("favoritos")
            .delete()
            .eq("usuario_id", user.id)
            .eq("producto_id", producto_id);

        if (error) {

            console.error(
                "Error eliminando favorito:",
                error
            );

            return NextResponse.json(
                {
                    error: "No se pudo eliminar el favorito."
                },
                {
                    status: 500
                }
            );
        }

        return NextResponse.json({
            success: true
        });

    } catch (error) {

        console.error(
            "Error inesperado:",
            error
        );

        return NextResponse.json(
            {
                error: "Error interno del servidor."
            },
            {
                status: 500
            }
        );
    }
}