const fs = require("fs");
const readline = require("readline");

const archivo =
    "C:/Users/USUARIO/Downloads/Retailrocket/events.csv";

const eventos = {
    view: 0,
    addtocart: 0,
    transaction: 0
};

const visitantes = new Set();
const productos = new Set();

async function analizar() {

    console.log("Analizando events.csv...");
    console.log("Esto puede tardar unos segundos.\n");

    const stream = fs.createReadStream(archivo);

    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    let primeraLinea = true;
    let totalLineas = 0;

    for await (const linea of rl) {

        if (primeraLinea) {

            primeraLinea = false;

            console.log("Columnas detectadas:");
            console.log(linea);
            console.log("");

            continue;
        }

        if (!linea.trim()) {
            continue;
        }

        const partes = linea.split(",");

        if (partes.length < 4) {
            continue;
        }

        const visitorid = partes[1];
        const event = partes[2];
        const itemid = partes[3];

        totalLineas++;

        visitantes.add(visitorid);
        productos.add(itemid);

        if (eventos[event] !== undefined) {
            eventos[event]++;
        }
    }

    console.log("=================================");
    console.log("RESULTADO DEL DATASET");
    console.log("=================================");

    console.log(
        "Total de eventos:",
        totalLineas.toLocaleString()
    );

    console.log(
        "Visitantes únicos:",
        visitantes.size.toLocaleString()
    );

    console.log(
        "Productos únicos:",
        productos.size.toLocaleString()
    );

    console.log("");

    console.log("Eventos:");

    console.log(
        "Views:",
        eventos.view.toLocaleString()
    );

    console.log(
        "Add to cart:",
        eventos.addtocart.toLocaleString()
    );

    console.log(
        "Transactions:",
        eventos.transaction.toLocaleString()
    );

    console.log("");
    console.log("Análisis terminado.");
}

analizar().catch((error) => {

    console.error(
        "Error analizando dataset:",
        error
    );

});