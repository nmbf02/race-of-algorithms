const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Ejecuta los algoritmos de búsqueda y ordenamiento y devuelve sus tiempos de ejecución y memoria utilizada.
 */
app.get("/run-algorithms", (req, res) => {
    const algorithms = [
        "bubble_sort.py",
        "quick_sort.py",
        "insertion_sort.py",
        "sequential_search.py",
        "binary_search.py"
    ];

    let results = [];
    let completed = 0;

    algorithms.forEach((algo) => {
        const scriptPath = path.join(__dirname, "algorithms", algo);
        const process = spawn("python", [scriptPath]);

        let output = "";
        process.stdout.on("data", (data) => {
            output += data.toString();
        });

        process.stderr.on("data", (data) => {
            console.error(`❌ Error en ${algo}: ${data.toString()}`);
        });

        process.on("close", (code) => {
            try {
                const outputTrimmed = output.trim();
                if (!outputTrimmed) throw new Error(`Salida vacía para ${algo}`);

                const [executionTime, comparisons, swaps] = outputTrimmed.split(",");

                results.push({
                    algorithm: algo.replace(".py", ""),
                    executionTimes: executionTime ? parseFloat(executionTime) : "N/A",
                    comparisons: comparisons ? parseInt(comparisons) : "N/A",
                    swaps: swaps ? parseInt(swaps) : "N/A",
                    color: getRandomColor()
                });

                completed++;
                if (completed === algorithms.length) {
                    console.log("✅ Datos enviados:", results);
                    res.json(results);
                }
            } catch (error) {
                console.error(`⚠️ Error procesando salida de ${algo}:`, error);
            }
        });
    });
});

/**
 * Simulación en tiempo real para una "carrera de algoritmos".
 * Cada algoritmo se ejecuta y se mide su rendimiento en diferentes tamaños de entrada.
 */
app.get("/run-race", (req, res) => {
    console.log("🚀 Iniciando simulación en tiempo real...");

    const algorithms = [
        "bubble_sort.py",
        "quick_sort.py",
        "insertion_sort.py",
        "sequential_search.py",
        "binary_search.py"
    ];

    let results = [];
    let completed = 0;

    algorithms.forEach((algo) => {
        const scriptPath = path.join(__dirname, "algorithms", algo);
        const process = spawn("python", [scriptPath]);

        let output = "";
        process.stdout.on("data", (data) => {
            output += data.toString();
        });

        process.stderr.on("data", (data) => {
            console.error(`❌ Error en ${algo}: ${data.toString()}`);
        });

        process.on("close", (code) => {
            try {
                let executionTimes = output.trim().split(",").map((t) => parseFloat(t));

                // Validar si executionTimes contiene valores no válidos
                if (!executionTimes || executionTimes.some(isNaN)) {
                    executionTimes = ["N/A"];
                }

                results.push({
                    algorithm: algo.replace(".py", ""),
                    executionTimes: executionTimes.length > 0 ? executionTimes : ["N/A"],
                    comparisons: Math.floor(Math.random() * 10000), // Simulación de comparaciones
                    swaps: Math.floor(Math.random() * 5000), // Simulación de swaps/operaciones
                    color: getRandomColor()
                });

                completed++;
                if (completed === algorithms.length) {
                    console.log("✅ Datos enviados al frontend:", results);
                    res.json(results);
                }
            } catch (error) {
                console.error(`⚠️ Error procesando salida de ${algo}:`, error);
            }
        });
    });
});

/**
 * Genera un color aleatorio para cada algoritmo.
 */
function getRandomColor() {
    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
    return colors[Math.floor(Math.random() * colors.length)];
}

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend corriendo en http://localhost:${PORT}`));