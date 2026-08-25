const fs = require("fs");
const path = require("path");

console.log("=================================");
console.log("COMPARACIÓN V1 vs V2 vs V2.1");
console.log("=================================");
console.log("");


// ==========================================
// ARCHIVOS
// ==========================================

const V1_FILE =
    path.join(
        __dirname,
        "../data/recommendations.json"
    );

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
// CARGAR ARCHIVOS
// ==========================================

function loadRecommendations(
    file,
    name
) {

    if (!fs.existsSync(file)) {

        console.error(
            `ERROR: No existe el archivo de ${name}:`
        );

        console.error(file);
        process.exit(1);
    }

    console.log(
        `Leyendo ${name}...`
    );

    return JSON.parse(
        fs.readFileSync(
            file,
            "utf8"
        )
    );
}

const v1 =
    loadRecommendations(
        V1_FILE,
        "V1"
    );

const v2 =
    loadRecommendations(
        V2_FILE,
        "V2"
    );

const v21 =
    loadRecommendations(
        V21_FILE,
        "V2.1"
    );

console.log("");


// ==========================================
// INFORMACIÓN GENERAL
// ==========================================

function countRecommendations(
    recommendations
) {

    let total = 0;

    for (
        const results
        of Object.values(
            recommendations
        )
    ) {

        total += results.length;
    }

    return total;
}

const v1Products =
    Object.keys(v1).length;

const v2Products =
    Object.keys(v2).length;

const v21Products =
    Object.keys(v21).length;

const v1Total =
    countRecommendations(v1);

const v2Total =
    countRecommendations(v2);

const v21Total =
    countRecommendations(v21);

console.log("=================================");
console.log("COBERTURA");
console.log("=================================");
console.log("");

console.log(
    "V1  - Productos:",
    v1Products
);

console.log(
    "V2  - Productos:",
    v2Products
);

console.log(
    "V2.1- Productos:",
    v21Products
);

console.log("");

console.log(
    "V1  - Recomendaciones:",
    v1Total
);

console.log(
    "V2  - Recomendaciones:",
    v2Total
);

console.log(
    "V2.1- Recomendaciones:",
    v21Total
);

console.log("");


// ==========================================
// DIFERENCIAS
// ==========================================

function percentageChange(
    oldValue,
    newValue
) {

    if (oldValue === 0) {
        return 0;
    }

    return (
        (newValue - oldValue) /
        oldValue
    ) * 100;
}

console.log("=================================");
console.log("CAMBIOS");
console.log("=================================");
console.log("");

console.log(
    "V2 vs V1:",
    percentageChange(
        v1Products,
        v2Products
    ).toFixed(2),
    "%"
);

console.log(
    "V2.1 vs V2:",
    percentageChange(
        v2Products,
        v21Products
    ).toFixed(2),
    "%"
);

console.log(
    "V2.1 vs V1:",
    percentageChange(
        v1Products,
        v21Products
    ).toFixed(2),
    "%"
);

console.log("");


// ==========================================
// PRODUCTO DE PRUEBA 1510
// ==========================================

const TEST_PRODUCT = "1510";

console.log("=================================");
console.log(
    `COMPARACIÓN DEL PRODUCTO ${TEST_PRODUCT}`
);
console.log("=================================");
console.log("");

function printRecommendations(
    name,
    recommendations
) {

    console.log(
        `--- ${name} ---`
    );

    const results =
        recommendations[
            TEST_PRODUCT
        ];

    if (!results) {

        console.log(
            "Sin recomendaciones"
        );

        console.log("");

        return;
    }

    results.forEach(
        (item, index) => {

            console.log(
                `${index + 1}. ${item.itemid} → ${item.score}`
            );
        }
    );

    console.log("");
}

printRecommendations(
    "V1",
    v1
);

printRecommendations(
    "V2",
    v2
);

printRecommendations(
    "V2.1",
    v21
);


// ==========================================
// COINCIDENCIAS TOP 5
// ==========================================

function getTopIds(
    recommendations
) {

    if (
        !recommendations[
            TEST_PRODUCT
        ]
    ) {

        return [];
    }

    return recommendations[
        TEST_PRODUCT
    ].map(
        item => item.itemid
    );
}

const topV1 =
    getTopIds(v1);

const topV2 =
    getTopIds(v2);

const topV21 =
    getTopIds(v21);

function intersection(
    arrayA,
    arrayB
) {

    return arrayA.filter(
        value =>
            arrayB.includes(value)
    );
}

const v1v2 =
    intersection(
        topV1,
        topV2
    );

const v2v21 =
    intersection(
        topV2,
        topV21
    );

const v1v21 =
    intersection(
        topV1,
        topV21
    );

console.log(
    "================================="
);

console.log(
    "ESTABILIDAD DEL TOP 5"
);

console.log(
    "================================="
);

console.log("");

console.log(
    "Coincidencias V1 ↔ V2:",
    v1v2.length,
    "/ 5"
);

console.log(
    "Coincidencias V2 ↔ V2.1:",
    v2v21.length,
    "/ 5"
);

console.log(
    "Coincidencias V1 ↔ V2.1:",
    v1v21.length,
    "/ 5"
);

console.log("");


// ==========================================
// PRODUCTOS COMPARTIDOS
// ==========================================

const allProducts =
    new Set([
        ...Object.keys(v1),
        ...Object.keys(v2),
        ...Object.keys(v21)
    ]);

let onlyV1 = 0;
let onlyV2 = 0;
let onlyV21 = 0;

let inAllThree = 0;

for (
    const product
    of allProducts
) {

    const hasV1 =
        Object.prototype.hasOwnProperty.call(
            v1,
            product
        );

    const hasV2 =
        Object.prototype.hasOwnProperty.call(
            v2,
            product
        );

    const hasV21 =
        Object.prototype.hasOwnProperty.call(
            v21,
            product
        );

    if (
        hasV1 &&
        !hasV2 &&
        !hasV21
    ) {
        onlyV1++;
    }

    if (
        !hasV1 &&
        hasV2 &&
        !hasV21
    ) {
        onlyV2++;
    }

    if (
        !hasV1 &&
        !hasV2 &&
        hasV21
    ) {
        onlyV21++;
    }

    if (
        hasV1 &&
        hasV2 &&
        hasV21
    ) {
        inAllThree++;
    }
}

console.log(
    "================================="
);

console.log(
    "PRODUCTOS COMPARTIDOS"
);

console.log(
    "================================="
);

console.log("");

console.log(
    "Solo V1:",
    onlyV1
);

console.log(
    "Solo V2:",
    onlyV2
);

console.log(
    "Solo V2.1:",
    onlyV21
);

console.log(
    "Presentes en V1, V2 y V2.1:",
    inAllThree
);

console.log("");


// ==========================================
// RESUMEN
// ==========================================

console.log(
    "================================="
);

console.log(
    "RESUMEN DE COMPARACIÓN"
);

console.log(
    "================================="
);

console.log("");

console.log(
    "V1:",
    v1Products,
    "productos /",
    v1Total,
    "recomendaciones"
);

console.log(
    "V2:",
    v2Products,
    "productos /",
    v2Total,
    "recomendaciones"
);

console.log(
    "V2.1:",
    v21Products,
    "productos /",
    v21Total,
    "recomendaciones"
);

console.log("");

console.log(
    "Comparación finalizada."
);