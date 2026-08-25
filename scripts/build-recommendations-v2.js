const fs = require("fs");
const path = require("path");

const EVENTS_FILE =
    "C:/Users/USUARIO/Downloads/Retailrocket/events.csv";

const OUTPUT_FILE =
    path.join(__dirname, "../data/recommendations-v2.json");

console.log("=================================");
console.log("CONSTRUCCIÓN DE RECOMENDACIONES V2");
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

const visitorIndex = header.indexOf("visitorid");
const eventIndex = header.indexOf("event");
const itemIndex = header.indexOf("itemid");


// ==========================================
// PESOS DE LAS INTERACCIONES
// ==========================================

const EVENT_WEIGHTS = {
    view: 1,
    addtocart: 3,
    transaction: 5
};


// ==========================================
// AGRUPAR INTERACCIONES POR VISITANTE
// ==========================================

console.log("Procesando comportamiento de visitantes...");

const visitors = new Map();

let views = 0;
let addToCart = 0;
let transactions = 0;

for (let i = 1; i < lines.length; i++) {

    if (!lines[i].trim()) {
        continue;
    }

    const columns = lines[i].split(",");

    const visitorid = columns[visitorIndex];
    const event = columns[eventIndex];
    const itemid = columns[itemIndex];

    if (!visitorid || !itemid) {
        continue;
    }

    if (!EVENT_WEIGHTS[event]) {
        continue;
    }

    if (!visitors.has(visitorid)) {
        visitors.set(visitorid, new Map());
    }

    const visitorItems = visitors.get(visitorid);

    const currentScore =
        visitorItems.get(itemid) || 0;

    visitorItems.set(
        itemid,
        currentScore + EVENT_WEIGHTS[event]
    );

    if (event === "view") {
        views++;
    }

    if (event === "addtocart") {
        addToCart++;
    }

    if (event === "transaction") {
        transactions++;
    }
}

console.log("");
console.log("Interacciones procesadas:");
console.log("Views:", views);
console.log("Add to cart:", addToCart);
console.log("Transactions:", transactions);
console.log("Visitantes:", visitors.size);
console.log("");


// ==========================================
// CONSTRUIR RELACIONES ENTRE PRODUCTOS
// ==========================================

console.log("Construyendo relaciones entre productos...");

const relationships = new Map();

let visitorsWithMultipleProducts = 0;

for (const visitorItems of visitors.values()) {

    const products = Array.from(visitorItems.entries());

    if (products.length < 2) {
        continue;
    }

    visitorsWithMultipleProducts++;

    for (let i = 0; i < products.length; i++) {

        const [itemA, scoreA] = products[i];

        if (!relationships.has(itemA)) {
            relationships.set(itemA, new Map());
        }

        const relatedProducts =
            relationships.get(itemA);

        for (let j = 0; j < products.length; j++) {

            if (i === j) {
                continue;
            }

            const [itemB, scoreB] = products[j];

            /*
             * La relación se calcula multiplicando
             * la fuerza de interacción del producto A
             * por la fuerza de interacción del producto B.
             *
             * Ejemplo:
             *
             * A visto     = 1
             * B comprado = 5
             *
             * Relación = 1 × 5 = 5
             */

            const relationScore =
                scoreA * scoreB;

            const currentScore =
                relatedProducts.get(itemB) || 0;

            relatedProducts.set(
                itemB,
                currentScore + relationScore
            );
        }
    }
}

console.log(
    "Visitantes con múltiples productos:",
    visitorsWithMultipleProducts
);

console.log("");


// ==========================================
// GENERAR TOP 5
// ==========================================

console.log("Generando Top 5 recomendaciones...");

const recommendations = {};

for (const [itemid, relatedProducts] of relationships) {

    const sorted = Array.from(
        relatedProducts.entries()
    )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    recommendations[itemid] =
        sorted.map(([relatedItem, score]) => ({
            itemid: relatedItem,
            score: score
        }));
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
// GUARDAR RESULTADOS
// ==========================================

fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(recommendations, null, 2),
    "utf8"
);


// ==========================================
// RESULTADO
// ==========================================

console.log("");
console.log("=================================");
console.log("RESULTADO V2");
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

console.log("Pesos utilizados:");

console.log("view       =", EVENT_WEIGHTS.view);
console.log("addtocart  =", EVENT_WEIGHTS.addtocart);
console.log("transaction =", EVENT_WEIGHTS.transaction);

console.log("");

console.log("Proceso terminado.");