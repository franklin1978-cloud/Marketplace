const fs = require("fs");
const path = require("path");

console.log("=================================");
console.log("ANÁLISIS DE CONCENTRACIÓN");
console.log("V2 vs V2.1");
console.log("=================================");
console.log("");

const V2_FILE =
    path.join(
        __dirname,
        "../data/recommendations-v2.json"
    );

const V21_FILE =
    path.join(
        __dirname,
        "../data/recommendations-v2-1.json"
    );


// ==========================================
// CARGAR
// ==========================================

const v2 =
    JSON.parse(
        fs.readFileSync(
            V2_FILE,
            "utf8"
        )
    );

const v21 =
    JSON.parse(
        fs.readFileSync(
            V21_FILE,
            "utf8"
        )
    );


// ==========================================
// CONTAR APARICIONES
// ==========================================

function calculateCounts(
    recommendations
) {

    const counts =
        new Map();

    let total = 0;

    for (
        const results
        of Object.values(
            recommendations
        )
    ) {

        for (
            const recommendation
            of results
        ) {

            const itemid =
                recommendation.itemid;

            const current =
                counts.get(
                    itemid
                ) || 0;

            counts.set(
                itemid,
                current + 1
            );

            total++;
        }
    }

    return {
        counts,
        total
    };
}


const resultV2 =
    calculateCounts(v2);

const resultV21 =
    calculateCounts(v21);


// ==========================================
// ANÁLISIS
// ==========================================

function analyze(
    name,
    result
) {

    const sorted =
        Array.from(
            result.counts.entries()
        )
        .sort(
            (a, b) => b[1] - a[1]
        );

    console.log(
        `=================================`
    );

    console.log(
        `${name}`
    );

    console.log(
        `=================================`
    );

    console.log("");

    console.log(
        "Total recomendaciones:",
        result.total
    );

    console.log(
        "Productos recomendados:",
        sorted.length
    );

    console.log("");

    const limits = [
        1,
        5,
        10,
        20,
        50,
        100
    ];

    for (
        const limit of limits
    ) {

        const top =
            sorted
                .slice(0, limit)
                .reduce(
                    (sum, item) =>
                        sum + item[1],
                    0
                );

        const percentage =
            (
                top /
                result.total
            ) * 100;

        console.log(
            `Top ${limit}:`,
            top,
            "apariciones",
            `(${percentage.toFixed(2)}%)`
        );
    }

    console.log("");

    console.log(
        "Top 10 productos:"
    );

    sorted
        .slice(0, 10)
        .forEach(
            ([itemid, count], index) => {

                console.log(
                    `${index + 1}. ${itemid} → ${count}`
                );
            }
        );

    console.log("");
}


analyze(
    "V2",
    resultV2
);

analyze(
    "V2.1",
    resultV21
);


// ==========================================
// COMPARACIÓN
// ==========================================

console.log(
    "================================="
);

console.log(
    "COMPARACIÓN FINAL"
);

console.log(
    "================================="
);

console.log("");

console.log(
    "El objetivo es que V2.1 tenga"
);

console.log(
    "menor concentración que V2."
);

console.log("");

console.log(
    "Análisis terminado."
);