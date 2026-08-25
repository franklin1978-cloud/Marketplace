const fs = require("fs");
const path = require("path");

const FILE =
    path.join(
        __dirname,
        "../data/recommendations-v2-1.json"
    );

console.log("=================================");
console.log("ANÁLISIS PROFUNDO DE V2.1");
console.log("=================================");
console.log("");


// ==========================================
// CARGAR ARCHIVO
// ==========================================

if (!fs.existsSync(FILE)) {

    console.error(
        "No existe:"
    );

    console.error(FILE);

    process.exit(1);
}

const recommendations =
    JSON.parse(
        fs.readFileSync(
            FILE,
            "utf8"
        )
    );

console.log(
    "Productos disponibles:",
    Object.keys(
        recommendations
    ).length
);

console.log("");


// ==========================================
// PRODUCTO 1510
// ==========================================

console.log("=================================");
console.log("PRUEBA DEL PRODUCTO 1510");
console.log("=================================");
console.log("");

const product1510 =
    recommendations["1510"];

if (!product1510) {

    console.log(
        "El producto 1510 no tiene recomendaciones."
    );

} else {

    product1510.forEach(
        (recommendation, index) => {

            console.log(
                `${index + 1}. Producto: ${recommendation.itemid}`
            );

            console.log(
                `   Score: ${recommendation.score}`
            );

            console.log("");
        }
    );
}


// ==========================================
// ANALIZAR SCORES
// ==========================================

const scores = [];

const appearanceCount =
    new Map();

for (
    const [
        sourceItem,
        results
    ] of Object.entries(
        recommendations
    )
) {

    for (
        const recommendation
        of results
    ) {

        const itemid =
            recommendation.itemid;

        const score =
            recommendation.score;

        scores.push(score);

        const current =
            appearanceCount.get(
                itemid
            ) || 0;

        appearanceCount.set(
            itemid,
            current + 1
        );
    }
}


// ==========================================
// ORDENAR SCORES
// ==========================================

scores.sort(
    (a, b) => a - b
);


// ==========================================
// ESTADÍSTICAS
// ==========================================

const total =
    scores.length;

const min =
    scores[0];

const max =
    scores[total - 1];

const sum =
    scores.reduce(
        (acc, value) =>
            acc + value,
        0
    );

const average =
    sum / total;

const median =
    total % 2 === 0
        ? (
            scores[total / 2 - 1] +
            scores[total / 2]
        ) / 2
        : scores[
            Math.floor(total / 2)
        ];


// ==========================================
// PERCENTIL
// ==========================================

function percentile(
    values,
    p
) {

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


// ==========================================
// RESULTADOS ESTADÍSTICOS
// ==========================================

console.log(
    "================================="
);

console.log(
    "ESTADÍSTICAS DE SCORES"
);

console.log(
    "================================="
);

console.log("");

console.log(
    "Total de recomendaciones:",
    total
);

console.log(
    "Score mínimo:",
    min
);

console.log(
    "Score máximo:",
    max
);

console.log(
    "Score promedio:",
    average.toFixed(4)
);

console.log(
    "Score mediano:",
    median.toFixed(4)
);

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


// ==========================================
// PRODUCTOS MÁS RECOMENDADOS
// ==========================================

const mostRecommended =
    Array.from(
        appearanceCount.entries()
    )
    .sort(
        (a, b) => b[1] - a[1]
    )
    .slice(0, 20);

console.log(
    "================================="
);

console.log(
    "PRODUCTOS MÁS RECOMENDADOS"
);

console.log(
    "================================="
);

console.log("");

mostRecommended.forEach(
    ([itemid, count], index) => {

        console.log(
            `${index + 1}. Producto ${itemid} → ${count} apariciones`
        );
    }
);

console.log("");

console.log(
    "================================="
);

console.log(
    "ANÁLISIS V2.1 TERMINADO"
);

console.log(
    "================================="
);