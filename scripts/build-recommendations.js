const fs = require("fs");
const path = require("path");

const EVENTS_FILE =
    "C:/Users/USUARIO/Downloads/Retailrocket/events.csv";

const OUTPUT_FILE =
    path.join(__dirname, "../data/recommendations.json");

console.log("=================================");
console.log("CONSTRUCCIÓN DE RECOMENDACIONES");
console.log("=================================");
console.log("");

console.log("Leyendo events.csv...");
console.log("Esto puede tardar unos segundos.");
console.log("");

const data = fs.readFileSync(EVENTS_FILE, "utf8");

const lines = data.split(/\r?\n/);

const header = lines[0].split(",");

console.log("Columnas:");
console.log(header.join(","));
console.log("");

const transactionIndex = header.indexOf("transactionid");
const itemIndex = header.indexOf("itemid");
const eventIndex = header.indexOf("event");

const transactions = new Map();

let transactionEvents = 0;

for (let i = 1; i < lines.length; i++) {

    if (!lines[i].trim()) {
        continue;
    }

    const columns = lines[i].split(",");

    const event = columns[eventIndex];
    const itemid = columns[itemIndex];
    const transactionid = columns[transactionIndex];

    if (event !== "transaction") {
        continue;
    }

    if (!transactionid || !itemid) {
        continue;
    }

    transactionEvents++;

    if (!transactions.has(transactionid)) {
        transactions.set(transactionid, new Set());
    }

    transactions.get(transactionid).add(itemid);
}

console.log("Eventos transaction encontrados:", transactionEvents);
console.log("Transacciones:", transactions.size);
console.log("");


// ==========================================
// CONSTRUIR RELACIONES ENTRE PRODUCTOS
// ==========================================

console.log("Construyendo relaciones entre productos...");

const relationships = new Map();

let multiProductTransactions = 0;

for (const productsSet of transactions.values()) {

    const products = Array.from(productsSet);

    if (products.length < 2) {
        continue;
    }

    multiProductTransactions++;

    for (let i = 0; i < products.length; i++) {

        const itemA = products[i];

        if (!relationships.has(itemA)) {
            relationships.set(itemA, new Map());
        }

        const relatedProducts = relationships.get(itemA);

        for (let j = 0; j < products.length; j++) {

            if (i === j) {
                continue;
            }

            const itemB = products[j];

            const currentScore =
                relatedProducts.get(itemB) || 0;

            relatedProducts.set(
                itemB,
                currentScore + 1
            );
        }
    }
}

console.log(
    "Transacciones con varios productos:",
    multiProductTransactions
);

console.log("");


// ==========================================
// GENERAR TOP 5
// ==========================================

console.log("Generando recomendaciones...");

const recommendations = {};

for (const [itemid, relatedProducts] of relationships) {

    const sorted = Array.from(
        relatedProducts.entries()
    )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    recommendations[itemid] = sorted.map(
        ([relatedItem, score]) => ({
            itemid: relatedItem,
            score: score
        })
    );
}


// ==========================================
// CREAR CARPETA DATA
// ==========================================

const dataDirectory =
    path.dirname(OUTPUT_FILE);

if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, {
        recursive: true
    });
}


// ==========================================
// GUARDAR
// ==========================================

fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(recommendations, null, 2),
    "utf8"
);

console.log("");
console.log("=================================");
console.log("RESULTADO");
console.log("=================================");

console.log(
    "Productos con recomendaciones:",
    Object.keys(recommendations).length
);

console.log(
    "Archivo generado:",
    OUTPUT_FILE
);

console.log("");
console.log("Proceso terminado.");