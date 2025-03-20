const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

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
            const [timeTaken, memoryUsed] = output.trim().split(",");

            results.push({
                algorithm: algo.replace(".py", ""),
                time: parseFloat(timeTaken),
                memory: parseFloat(memoryUsed) // Almacenamos la memoria utilizada
            });

            completed++;
            if (completed === algorithms.length) {
                res.json(results);
            }
        });
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend corriendo en http://localhost:${PORT}`));