const fs = require("fs");
const path = require("path");

const RECOMMENDATIONS_FILE =
    path.join(__dirname, "../data/recommendations-v2.json");

console.log("=================================");
console.log("PRUEBA DE RECOMENDACIONES V2");
console.log("=================================");
console.log("");


// ==========================================
// LEER RECOMENDACIONES
// ==========================================

if (!fs.existsSync(RECOMMENDATIONS_FILE)) {
    console.error("ERROR: No existe:");
    console.error(RECOMMENDATIONS_FILE);
    process.exit(1);
}

console.log("Leyendo recommendations-v2.json...");

const data = fs.readFileSync(
    RECOMMENDATIONS_FILE,
    "utf8"
);

const recommendations = JSON.parse(data);

console.log(
    "Productos disponibles:",
    Object.keys(recommendations).length
);

console.log("");


// ==========================================
// FUNCIÓN PARA PROBAR UN PRODUCTO
// ==========================================

function testProduct(itemid) {

    console.log("---------------------------------");
    console.log("Producto:", itemid);
    console.log("---------------------------------");

    const results = recommendations[itemid];

    if (!results) {
        console.log(
            "No existen recomendaciones para este producto."
        );
        console.log("");
        return;
    }

    if (results.length === 0) {
        console.log(
            "El producto no tiene recomendaciones."
        );
        console.log("");
        return;
    }

    console.log("Top", results.length, "recomendaciones:");
    console.log("");

    results.forEach((recommendation, index) => {

        console.log(
            `${index + 1}. Producto: ${recommendation.itemid}`
        );

        console.log(
            `   Score: ${recommendation.score}`
        );

        console.log("");
    });
}


// ==========================================
// PRODUCTOS A PROBAR
// ==========================================

const productsToTest = [
    "1510",
    "231313",
    "329587",
    "199279",
    "283776"
];


// ==========================================
// EJECUTAR PRUEBAS
// ==========================================

for (const itemid of productsToTest) {
    testProduct(itemid);
}


// ==========================================
// BUSCAR PRODUCTOS CON MAYORES SCORES
// ==========================================

console.log("=================================");
console.log("ANÁLISIS DE SCORES");
console.log("=================================");
console.log("");

let highestScore = 0;
let highestProduct = null;
let highestRecommendation = null;

for (const [itemid, results] of Object.entries(recommendations)) {

    for (const recommendation of results) {

        if (recommendation.score > highestScore) {

            highestScore = recommendation.score;
            highestProduct = itemid;
            highestRecommendation =
                recommendation.itemid;
        }
    }
}

console.log(
    "Mayor score encontrado:",
    highestScore
);

console.log(
    "Producto origen:",
    highestProduct
);

console.log(
    "Producto recomendado:",
    highestRecommendation
);

console.log("");


// ==========================================
// ESTADÍSTICAS
// ==========================================

let totalRecommendations = 0;
let totalScore = 0;

for (const results of Object.values(recommendations)) {

    for (const recommendation of results) {

        totalRecommendations++;
        totalScore += recommendation.score;
    }
}

const averageScore =
    totalScore / totalRecommendations;

console.log("Total de recomendaciones:", totalRecommendations);

console.log(
    "Score promedio:",
    averageScore.toFixed(2)
);

console.log("");

console.log("=================================");
console.log("PRUEBA FINALIZADA");
console.log("=================================");