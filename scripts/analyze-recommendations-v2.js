const fs = require("fs");
const path = require("path");

const FILE =
    path.join(__dirname, "../data/recommendations-v2.json");

console.log("=================================");
console.log("ANÁLISIS PROFUNDO DE V2");
console.log("=================================");
console.log("");


// ==========================================
// CARGAR DATOS
// ==========================================

if (!fs.existsSync(FILE)) {
    console.error("No existe:");
    console.error(FILE);
    process.exit(1);
}

const recommendations =
    JSON.parse(
        fs.readFileSync(FILE, "utf8")
    );


// ==========================================
// VARIABLES
// ==========================================

const appearanceCount = new Map();

const scores = [];


// ==========================================
// ANALIZAR
// ==========================================

for (const [sourceItem, results]
    of Object.entries(recommendations)) {

    for (const recommendation of results) {

        const itemid =
            recommendation.itemid;

        const score =
            recommendation.score;

        scores.push(score);

        const current =
            appearanceCount.get(itemid) || 0;

        appearanceCount.set(
            itemid,
            current + 1
        );
    }
}


// ==========================================
// ORDENAR PRODUCTOS MÁS RECOMENDADOS
// ==========================================

const mostRecommended =
    Array.from(
        appearanceCount.entries()
    )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);


// ==========================================
// ESTADÍSTICAS DE SCORES
// ==========================================

scores.sort((a, b) => a - b);

const total =
    scores.length;

const min =
    scores[0];

const max =
    scores[scores.length - 1];

const sum =
    scores.reduce(
        (acc, value) => acc + value,
        0
    );

const average =
    sum / total;

const median =
    total % 2 === 0
        ? (scores[total / 2 - 1] +
           scores[total / 2]) / 2
        : scores[Math.floor(total / 2)];


// ==========================================
// RESULTADOS
// ==========================================

console.log("Total de recomendaciones:");
console.log(total);
console.log("");

console.log("Score mínimo:");
console.log(min);
console.log("");

console.log("Score máximo:");
console.log(max);
console.log("");

console.log("Score promedio:");
console.log(average.toFixed(2));
console.log("");

console.log("Score mediano:");
console.log(median);
console.log("");


// ==========================================
// PRODUCTOS DOMINANTES
// ==========================================

console.log("=================================");
console.log("PRODUCTOS MÁS RECOMENDADOS");
console.log("=================================");
console.log("");

mostRecommended.forEach(
    ([itemid, count], index) => {

        console.log(
            `${index + 1}. Producto ${itemid} → ${count} apariciones`
        );
    }
);

console.log("");


// ==========================================
// PERCENTILES
// ==========================================

function percentile(values, p) {

    const index =
        Math.floor(
            values.length * p
        );

    return values[
        Math.min(
            index,
            values.length - 1
        )
    ];
}

console.log("=================================");
console.log("DISTRIBUCIÓN DE SCORES");
console.log("=================================");
console.log("");

console.log(
    "P50:",
    percentile(scores, 0.50)
);

console.log(
    "P75:",
    percentile(scores, 0.75)
);

console.log(
    "P90:",
    percentile(scores, 0.90)
);

console.log(
    "P95:",
    percentile(scores, 0.95)
);

console.log(
    "P99:",
    percentile(scores, 0.99)
);

console.log("");

console.log("=================================");
console.log("ANÁLISIS TERMINADO");
console.log("=================================");