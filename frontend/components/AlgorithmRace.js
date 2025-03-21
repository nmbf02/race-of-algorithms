import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function AlgorithmRace() {
    const [selectedAlgorithms, setSelectedAlgorithms] = useState([
        "Bubble sort",
        "Quick sort",
        "Insertion sort",
        "Sequential search",
        "Binary search"
    ]);
    const [dataSize, setDataSize] = useState(3000);
    const [dataType, setDataType] = useState("Random");
    const [raceResults, setRaceResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("chart");

    const handleStartRace = async () => {
        setLoading(true);
        console.log("🚀 Ejecutando simulación...");

        try {
            const response = await fetch("http://localhost:5000/run-race");

            if (!response.ok) {
                throw new Error("❌ Error en la respuesta del servidor");
            }

            const data = await response.json();
            console.log("📊 Datos recibidos en frontend:", data);

            if (!Array.isArray(data) || data.length === 0) {
                console.error("⚠️ La respuesta del servidor no contiene datos válidos.");
                alert("⚠️ No se recibieron datos válidos del servidor.");
                return;
            }

            setRaceResults(data);
        } catch (error) {
            console.error("❌ Error en la simulación:", error);
            alert("⚠️ Hubo un error en la simulación. Verifica el servidor.");
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: [100, 500, 1000, 5000, 10000],
        datasets: raceResults.map((algo, index) => ({
            label: algo.algorithm,
            data: Array.isArray(algo.executionTimes) && algo.executionTimes.length > 0
                ? algo.executionTimes
                : [0, 0, 0, 0, 0], // Evita errores si `executionTimes` es null
            borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"][index % 5],
            fill: false,
        })),
    };

    return (
        <div className="bg-white text-gray-900 rounded-lg shadow-lg p-8 w-full">
            <h2 className="text-3xl font-bold text-purple-600 text-center">
                ⚡ Algorithm Race Simulator
            </h2>

            <p className="text-center text-gray-600 mt-2">
                Visualiza y compara el rendimiento de diferentes algoritmos en tiempo real.
            </p>

            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-semibold">🏁 Configuración de la Carrera</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                    {["Binary Search","Bubble Sort","Insertion Sort","Quick Sort","Sequential Search"].map((algo) => (
                        <button
                            key={algo}
                            className={`px-3 py-1 rounded-full text-sm ${
                                selectedAlgorithms.includes(algo)
                                    ? "bg-purple-500 text-white"
                                    : "bg-gray-200 text-gray-700"
                            }`}
                            onClick={() =>
                                setSelectedAlgorithms((prev) =>
                                    prev.includes(algo) ? prev.filter((a) => a !== algo) : [...prev, algo]
                                )
                            }
                        >
                            {algo}
                        </button>
                    ))}
                </div>

                <div className="mt-4">
                    <label className="text-sm font-medium">Tamaño de Datos: {dataSize}</label>
                    <input
                        type="range"
                        min="100"
                        max="10000"
                        step="100"
                        value={dataSize}
                        onChange={(e) => setDataSize(parseInt(e.target.value))}
                        className="w-full mt-1"
                    />
                </div>

                <div className="mt-4">
                    <label className="text-sm font-medium">Tipo de Datos</label>
                    <select
                        className="w-full p-2 mt-1 border rounded"
                        value={dataType}
                        onChange={(e) => setDataType(e.target.value)}
                    >
                        <option value="Random">Random</option>
                        <option value="Sorted">Sorted</option>
                        <option value="Reversed">Reversed</option>
                    </select>
                </div>

                <button
                    onClick={handleStartRace}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-700 transition font-semibold mt-6 w-full"
                    disabled={loading}
                >
                    {loading ? "🚀 Ejecutando..." : "🚀 Iniciar Simulación"}
                </button>
            </div>

            {raceResults.length > 0 && (
                <div className="mt-8">
                    <div className="flex justify-center space-x-4">
                        <button
                            className={`px-4 py-2 rounded-md font-semibold shadow-md ${
                                activeTab === "chart" ? "bg-gray-900 text-white" : "bg-gray-300 text-black"
                            }`}
                            onClick={() => setActiveTab("chart")}
                        >
                            📊 Performance Chart
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md font-semibold shadow-md ${
                                activeTab === "metrics" ? "bg-gray-900 text-white" : "bg-gray-300 text-black"
                            }`}
                            onClick={() => setActiveTab("metrics")}
                        >
                            ⏱️ Detailed Metrics
                        </button>
                    </div>

                    <div className="mt-6">
                        {activeTab === "chart" ? (
                            <div className="flex justify-center mt-4">
                                <div style={{ width: "100%" }}>
                                    <Line data={chartData} />
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold text-center">📊 Algorithm Metrics</h3>
                                <table className="w-full mt-4 border-collapse border border-gray-300">
                                    <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2">Algorithm</th>
                                        <th className="border p-2">Time (ms)</th>
                                        <th className="border p-2">Comparisons</th>
                                        <th className="border p-2">Swaps/Operations</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {raceResults.length > 0 ? (
                                        raceResults.map((algo, index) => (
                                            <tr key={index} className="text-center">
                                                <td className="border p-2">{algo.algorithm}</td>
                                                <td className="border p-2">{Array.isArray(algo.executionTimes) && algo.executionTimes[0] !== null ? algo.executionTimes[0] : "N/A"}</td>
                                                <td className="border p-2">{algo.comparisons !== undefined ? algo.comparisons : "N/A"}</td>
                                                <td className="border p-2">{algo.swaps !== undefined ? algo.swaps : "N/A"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="border p-2 text-center text-gray-500">
                                                No hay datos disponibles
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
