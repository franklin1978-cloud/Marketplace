import fs from "fs";
import path from "path";

interface Recomendacion {
    itemid: string;
    score: number;
}

interface RecommendationsData {
    [key: string]: Recomendacion[];
}

let recomendacionesCache: RecommendationsData | null = null;

function cargarRecomendaciones(): RecommendationsData {
    if (recomendacionesCache) {
        return recomendacionesCache;
    }

    try {
        const rutaArchivo = path.join(
            process.cwd(),
            "data",
            "recommendations-v2-1.json"
        );

        const contenido = fs.readFileSync(
            rutaArchivo,
            "utf-8"
        );

        recomendacionesCache =
            JSON.parse(contenido) as RecommendationsData;

        return recomendacionesCache;
    } catch (error) {
        console.error(
            "Error cargando recomendaciones:",
            error
        );

        return {};
    }
}

export function obtenerIdsRecomendados(
    productoId: string,
    limite: number = 5
): string[] {

    const recomendaciones =
        cargarRecomendaciones();

    const lista =
        recomendaciones[String(productoId)] || [];

    return lista
        .filter(
            (item) =>
                String(item.itemid) !==
                String(productoId)
        )
        .sort(
            (a, b) =>
                Number(b.score) -
                Number(a.score)
        )
        .slice(0, limite)
        .map(
            (item) =>
                String(item.itemid)
        );
}
