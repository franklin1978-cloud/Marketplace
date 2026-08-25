const fs = require("fs");
const readline = require("readline");

const archivo =
    "C:/Users/USUARIO/Downloads/Retailrocket/events.csv";

const transacciones = new Map();

async function analizar() {

    console.log("Analizando transacciones de Retailrocket...");
    console.log("Esto puede tardar unos segundos.\n");

    const stream = fs.createReadStream(archivo);

    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    let primeraLinea = true;

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

        // Solo nos interesan compras
        if (event !== "transaction") {
            continue;
        }

        if (!transactionid || !itemid) {
            continue;
        }

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

    let totalTransacciones = transacciones.size;
    let transaccionesMultiproducto = 0;
    let totalProductosComprados = 0;
    let mayorCantidadProductos = 0;

    for (const productos of transacciones.values()) {

        const cantidad = productos.size;

        totalProductosComprados += cantidad;

        if (cantidad > 1) {
            transaccionesMultiproducto++;
        }

        if (cantidad > mayorCantidadProductos) {
            mayorCantidadProductos = cantidad;
        }
    }

    const promedioProductos =
        totalTransacciones > 0
            ? totalProductosComprados / totalTransacciones
            : 0;

    console.log("=================================");
    console.log("ANÁLISIS DE TRANSACCIONES");
    console.log("=================================");

    console.log(
        "Transacciones únicas:",
        totalTransacciones.toLocaleString()
    );

    console.log(
        "Transacciones con varios productos:",
        transaccionesMultiproducto.toLocaleString()
    );

    console.log(
        "Productos comprados registrados:",
        totalProductosComprados.toLocaleString()
    );

    console.log(
        "Promedio de productos por transacción:",
        promedioProductos.toFixed(2)
    );

    console.log(
        "Mayor cantidad de productos en una transacción:",
        mayorCantidadProductos
    );

    console.log("");
    console.log("Análisis terminado.");
}

analizar().catch((error) => {

    console.error(
        "Error analizando transacciones:",
        error
    );

});