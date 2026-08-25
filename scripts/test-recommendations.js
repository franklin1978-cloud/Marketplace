const fs = require("fs");

const file =
    "data/recommendations.json";

const recommendations =
    JSON.parse(
        fs.readFileSync(file, "utf8")
    );

const itemid = "1510";

console.log("=================================");
console.log("PRUEBA DE RECOMENDACIÓN");
console.log("=================================");

console.log("");

console.log(
    "Producto:",
    itemid
);

console.log("");

console.log(
    recommendations[itemid] || []
);