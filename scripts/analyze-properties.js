const fs = require("fs");
const readline = require("readline");

const archivos = [
    "C:/Users/USUARIO/Downloads/Retailrocket/item_properties_part1.csv",
    "C:/Users/USUARIO/Downloads/Retailrocket/item_properties_part2.csv"
];

const productos = new Set();
const propiedades = new Map();
const valoresPorPropiedad = new Map();

async function analizarArchivo(archivo) {

    console.log("");
    console.log("Analizando:");
    console.log(archivo);
    console.log("");

    const stream = fs.createReadStream(archivo);

    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    let primeraLinea = true;
    let registros = 0;

    for await (const linea of rl) {

        if (primeraLinea) {

            primeraLinea = false;

            console.log(
                "Columnas:",
                linea
            );

            continue;
        }

        if (!linea.trim()) {
            continue;
        }

        const partes = linea.split(",");

        if (partes.length < 4) {
            continue;
        }

        const itemid = partes[1];
        const propiedad = partes[2];
        const valor = partes.slice(3).join(",");

        if (!itemid) {
            continue;
        }

        productos.add(itemid);

        registros++;

        // ==========================================
        // CONTAR PROPIEDADES
        // ==========================================

        if (!propiedades.has(propiedad)) {

            propiedades.set(
                propiedad,
                0
            );
        }

        propiedades.set(
            propiedad,
            propiedades.get(propiedad) + 1
        );

        // ==========================================
        // CONTAR VALORES
        // ==========================================

        if (!valoresPorPropiedad.has(propiedad)) {

            valoresPorPropiedad.set(
                propiedad,
                new Set()
            );
        }

        valoresPorPropiedad
            .get(propiedad)
            .add(valor);
    }

    console.log(
        "Registros procesados:",
        registros.toLocaleString()
    );
}


async function main() {

    console.log("=================================");
    console.log("ANÁLISIS DE ITEM PROPERTIES");
    console.log("=================================");

    for (const archivo of archivos) {

        await analizarArchivo(
            archivo
        );
    }

    console.log("");
    console.log("=================================");
    console.log("RESULTADO");
    console.log("=================================");
    console.log("");

    console.log(
        "Productos encontrados:",
        productos.size.toLocaleString()
    );

    console.log(
        "Tipos de propiedades:",
        propiedades.size.toLocaleString()
    );

    console.log("");

    console.log(
        "Propiedades encontradas:"
    );

    console.log("");

    const propiedadesOrdenadas =
        Array.from(
            propiedades.entries()
        )
        .sort(
            (a, b) =>
                b[1] - a[1]
        );

    for (
        const [
            propiedad,
            cantidad
        ]
        of propiedadesOrdenadas
    ) {

        const valores =
            valoresPorPropiedad
                .get(propiedad);

        console.log(
            `${propiedad} → ${cantidad.toLocaleString()} registros → ${valores.size.toLocaleString()} valores únicos`
        );
    }

    console.log("");
    console.log("=================================");
    console.log("ANÁLISIS TERMINADO");
    console.log("=================================");
}


main().catch((error) => {

    console.error(
        "Error analizando propiedades:"
    );

    console.error(error);

});