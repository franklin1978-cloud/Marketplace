const fs = require("fs");
const readline = require("readline");

const archivo =
    "C:/Users/USUARIO/Downloads/Retailrocket/events.csv";

const archivoSalida =
    "C:/Users/USUARIO/Downloads/Marketplace/devport/recommendations.json";

// ======================================================
// CONFIGURACIÓN
// ======================================================

// Mínimo de veces que dos productos deben aparecer
// juntos para considerarlos una relación válida.
const MIN_COOCURRENCIA = 2;

// Máximo de recomendaciones que guardaremos
// por producto.
const MAX_RECOMENDACIONES = 10;


// ======================================================
// ESTRUCTURAS
// ======================================================

// transactionId -> Set de productos
const transacciones = new Map();

// producto -> Map(productoRelacionado -> cantidad)
const relaciones = new Map();


// ======================================================
// LEER EVENTS.CSV
// ======================================================

async function cargarTransacciones() {

    console.log("=================================");
    console.log("CARGANDO RETAILROCKET");
    console.log("=================================");
    console.log("");

    const stream = fs.createReadStream(archivo);

    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    let primeraLinea = true;
    let eventosTransaction = 0;

    for await (const linea of rl) {

        if (primeraLinea) {

            primeraLinea = false;

            continue;
        }

        if (!linea.trim()) {
            continue;
        }

        const partes = linea.split(",");

        if (partes.length < 5) {
            continue;
        }

        const event = partes[2];
        const itemid = partes[3];
        const transactionid = partes[4];

        // Solo utilizamos compras
        if (event !== "transaction") {
            continue;
        }

        if (!transactionid || !itemid) {
            continue;
        }

        eventosTransaction++;

        if (!transacciones.has(transactionid)) {

            transacciones.set(
                transactionid,
                new Set()
            );
        }

        transacciones
            .get(transactionid)
            .add(itemid);
    }

    console.log(
        "Eventos de transaction:",
        eventosTransaction.toLocaleString()
    );

    console.log(
        "Transacciones únicas:",
        transacciones.size.toLocaleString()
    );

    console.log("");
}


// ======================================================
// CREAR RELACIONES
// ======================================================

function construirRelaciones() {

    console.log("=================================");
    console.log("CONSTRUYENDO RELACIONES");
    console.log("=================================");
    console.log("");

    let transaccionesMultiproducto = 0;

    for (const productosSet of transacciones.values()) {

        const productos = Array.from(productosSet);

        // Si solamente existe un producto,
        // no podemos obtener una relación.
        if (productos.length < 2) {
            continue;
        }

        transaccionesMultiproducto++;

        // Comparamos todos los productos de
        // la misma transacción.
        for (let i = 0; i < productos.length; i++) {

            const productoA = productos[i];

            if (!relaciones.has(productoA)) {

                relaciones.set(
                    productoA,
                    new Map()
                );
            }

            const mapaRelacionados =
                relaciones.get(productoA);

            for (
                let j = 0;
                j < productos.length;
                j++
            ) {

                if (i === j) {
                    continue;
                }

                const productoB = productos[j];

                const cantidadActual =
                    mapaRelacionados.get(
                        productoB
                    ) || 0;

                mapaRelacionados.set(
                    productoB,
                    cantidadActual + 1
                );
            }
        }
    }

    console.log(
        "Transacciones con varios productos:",
        transaccionesMultiproducto.toLocaleString()
    );

    console.log(
        "Productos con relaciones:",
        relaciones.size.toLocaleString()
    );

    console.log("");
}


// ======================================================
// GENERAR RECOMENDACIONES
// ======================================================

function generarRecomendaciones() {

    console.log("=================================");
    console.log("GENERANDO RECOMENDACIONES");
    console.log("=================================");
    console.log("");

    const recomendaciones = {};

    let productosProcesados = 0;

    for (const [
        producto,
        mapaRelacionados
    ] of relaciones.entries()) {

        const lista = [];

        for (const [
            productoRelacionado,
            cantidad
        ] of mapaRelacionados.entries()) {

            if (
                cantidad <
                MIN_COOCURRENCIA
            ) {
                continue;
            }

            lista.push({

                itemid:
                    productoRelacionado,

                score:
                    cantidad
            });
        }

        // Ordenar por mayor cantidad
        // de compras conjuntas.
        lista.sort(
            (a, b) =>
                b.score - a.score
        );

        // Limitar recomendaciones.
        const mejores =
            lista.slice(
                0,
                MAX_RECOMENDACIONES
            );

        if (mejores.length > 0) {

            recomendaciones[producto] =
                mejores;
        }

        productosProcesados++;
    }

    console.log(
        "Productos procesados:",
        productosProcesados.toLocaleString()
    );

    console.log(
        "Productos con recomendaciones:",
        Object.keys(
            recomendaciones
        ).length.toLocaleString()
    );

    console.log("");

    return recomendaciones;
}


// ======================================================
// GUARDAR JSON
// ======================================================

function guardarRecomendaciones(
    recomendaciones
) {

    console.log("=================================");
    console.log("GUARDANDO ARCHIVO");
    console.log("=================================");
    console.log("");

    fs.writeFileSync(
        archivoSalida,
        JSON.stringify(
            recomendaciones,
            null,
            2
        ),
        "utf8"
    );

    console.log(
        "Archivo creado:"
    );

    console.log(
        archivoSalida
    );

    console.log("");
}


// ======================================================
// MOSTRAR EJEMPLO
// ======================================================

function mostrarEjemplo(
    recomendaciones
) {

    const productos =
        Object.keys(
            recomendaciones
        );

    if (productos.length === 0) {

        console.log(
            "No se encontraron recomendaciones."
        );

        return;
    }

    const producto =
        productos[0];

    console.log(
        "================================="
    );

    console.log(
        "EJEMPLO DE RECOMENDACIÓN"
    );

    console.log(
        "================================="
    );

    console.log("");

    console.log(
        "Producto:",
        producto
    );

    console.log("");

    console.log(
        recomendaciones[producto]
    );

    console.log("");
}


// ======================================================
// EJECUCIÓN PRINCIPAL
// ======================================================

async function main() {

    try {

        await cargarTransacciones();

        construirRelaciones();

        const recomendaciones =
            generarRecomendaciones();

        guardarRecomendaciones(
            recomendaciones
        );

        mostrarEjemplo(
            recomendaciones
        );

        console.log(
            "================================="
        );

        console.log(
            "PROCESO TERMINADO"
        );

        console.log(
            "================================="
        );

    } catch (error) {

        console.error(
            "Error generando recomendaciones:"
        );

        console.error(error);

    }
}


main();