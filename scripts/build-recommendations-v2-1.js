const fs = require("fs");
const path = require("path");

const EVENTS_FILE =
    "C:/Users/USUARIO/Downloads/Retailrocket/events.csv";

const OUTPUT_FILE =
    path.join(
        __dirname,
        "../data/recommendations-v2-1.json"
    );

console.log("=================================");
console.log("CONSTRUCCIÓN DE RECOMENDACIONES V2.1");
console.log("=================================");
console.log("");

console.log("Leyendo events.csv...");
console.log("Esto puede tardar unos segundos.");
console.log("");

const data = fs.readFileSync(
    EVENTS_FILE,
    "utf8"
);

const lines = data.split(/\r?\n/);

const header = lines[0].split(",");

console.log("Columnas:");
console.log(header.join(","));
console.log("");

const visitorIndex =
    header.indexOf("visitorid");

const eventIndex =
    header.indexOf("event");

const itemIndex =
    header.indexOf("itemid");


// ==========================================
// PESOS DE INTERACCIÓN
// ==========================================

const EVENT_WEIGHTS = {
    view: 1,
    addtocart: 3,
    transaction: 5
};


// ==========================================
// LÍMITE DE PRODUCTOS POR VISITANTE
// ==========================================

const MAX_PRODUCTS_PER_VISITOR = 20;


// ==========================================
// AGRUPAR INTERACCIONES POR VISITANTE
// ==========================================

console.log(
    "Procesando comportamiento de visitantes..."
);

const visitors = new Map();

let views = 0;
let addToCart = 0;
let transactions = 0;

for (let i = 1; i < lines.length; i++) {

    if (!lines[i].trim()) {
        continue;
    }

    const columns = lines[i].split(",");

    const visitorid =
        columns[visitorIndex];

    const event =
        columns[eventIndex];

    const itemid =
        columns[itemIndex];

    if (!visitorid || !itemid) {
        continue;
    }

    if (!EVENT_WEIGHTS[event]) {
        continue;
    }

    if (!visitors.has(visitorid)) {

        visitors.set(
            visitorid,
            new Map()
        );
    }

    const visitorItems =
        visitors.get(visitorid);

    if (!visitorItems.has(itemid)) {

        visitorItems.set(
            itemid,
            {
                view: 0,
                addtocart: 0,
                transaction: 0
            }
        );
    }

    const itemEvents =
        visitorItems.get(itemid);

    itemEvents[event]++;

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
// CALCULAR FUERZA DE INTERACCIÓN
// ==========================================

console.log(
    "Calculando fuerza de interacción..."
);

for (const visitorItems of visitors.values()) {

    for (const [
        itemid,
        events
    ] of visitorItems.entries()) {

        /*
         * log(1 + interacciones)
         *
         * Reduce la influencia excesiva
         * de usuarios extremadamente activos.
         */

        const viewScore =
            Math.log1p(events.view) *
            EVENT_WEIGHTS.view;

        const cartScore =
            Math.log1p(events.addtocart) *
            EVENT_WEIGHTS.addtocart;

        const transactionScore =
            Math.log1p(events.transaction) *
            EVENT_WEIGHTS.transaction;

        const score =
            viewScore +
            cartScore +
            transactionScore;

        visitorItems.set(
            itemid,
            score
        );
    }
}

console.log(
    "Fuerzas de interacción calculadas."
);

console.log("");


// ==========================================
// CONSTRUIR RELACIONES ENTRE PRODUCTOS
// ==========================================

console.log(
    "Construyendo relaciones entre productos..."
);

const relationships = new Map();

let visitorsWithMultipleProducts = 0;
let visitorsLimited = 0;

for (const visitorItems of visitors.values()) {

    let products =
        Array.from(
            visitorItems.entries()
        );

    if (products.length < 2) {
        continue;
    }

    visitorsWithMultipleProducts++;

    /*
     * Si el visitante interactuó con más de
     * 20 productos, conservamos únicamente
     * los 20 con mayor fuerza de interacción.
     */

    if (
        products.length >
        MAX_PRODUCTS_PER_VISITOR
    ) {

        products.sort(
            (a, b) => b[1] - a[1]
        );

        products =
            products.slice(
                0,
                MAX_PRODUCTS_PER_VISITOR
            );

        visitorsLimited++;
    }

    /*
     * Crear relaciones entre los productos
     * seleccionados del visitante.
     */

    for (
        let i = 0;
        i < products.length;
        i++
    ) {

        const [
            itemA,
            scoreA
        ] = products[i];

        if (!relationships.has(itemA)) {

            relationships.set(
                itemA,
                new Map()
            );
        }

        const relatedProducts =
            relationships.get(itemA);

        for (
            let j = 0;
            j < products.length;
            j++
        ) {

            if (i === j) {
                continue;
            }

            const [
                itemB,
                scoreB
            ] = products[j];

            /*
             * Fuerza de relación:
             *
             * score del producto A
             * multiplicado por
             * score del producto B.
             */

            const relationScore =
                scoreA * scoreB;

            const currentScore =
                relatedProducts.get(itemB) || 0;

            relatedProducts.set(
                itemB,
                currentScore +
                relationScore
            );
        }
    }
}

console.log(
    "Visitantes con múltiples productos:",
    visitorsWithMultipleProducts
);

console.log(
    "Visitantes limitados a",
    MAX_PRODUCTS_PER_VISITOR,
    "productos:",
    visitorsLimited
);

console.log("");


// ==========================================
// LIBERAR MEMORIA
// ==========================================

visitors.clear();


// ==========================================
// GENERAR TOP 5
// ==========================================

console.log(
    "Generando Top 5 recomendaciones..."
);

const recommendations = {};

for (
    const [
        itemid,
        relatedProducts
    ] of relationships
) {

    const sorted =
        Array.from(
            relatedProducts.entries()
        )
        .sort(
            (a, b) => b[1] - a[1]
        )
        .slice(0, 5);

    recommendations[itemid] =
        sorted.map(
            ([relatedItem, score]) => ({
                itemid: relatedItem,
                score: Number(
                    score.toFixed(4)
                )
            })
        );
}


// ==========================================
// CREAR CARPETA DATA
// ==========================================

const dataDirectory =
    path.dirname(
        OUTPUT_FILE
    );

if (
    !fs.existsSync(
        dataDirectory
    )
) {

    fs.mkdirSync(
        dataDirectory,
        {
            recursive: true
        }
    );
}


// ==========================================
// GUARDAR RESULTADOS
// ==========================================

fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(
        recommendations,
        null,
        2
    ),
    "utf8"
);


// ==========================================
// RESULTADO FINAL
// ==========================================

console.log("");
console.log("=================================");
console.log("RESULTADO V2.1");
console.log("=================================");

console.log(
    "Productos con recomendaciones:",
    Object.keys(
        recommendations
    ).length
);

console.log(
    "Archivo generado:",
    OUTPUT_FILE
);

console.log("");

console.log("Configuración:");

console.log(
    "view        =",
    EVENT_WEIGHTS.view
);

console.log(
    "addtocart   =",
    EVENT_WEIGHTS.addtocart
);

console.log(
    "transaction =",
    EVENT_WEIGHTS.transaction
);

console.log(
    "Máximo de productos por visitante =",
    MAX_PRODUCTS_PER_VISITOR
);

console.log(
    "Transformación = log(1 + interacciones)"
);

console.log("");

console.log(
    "Proceso terminado."
);