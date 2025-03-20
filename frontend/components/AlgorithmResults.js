import { useEffect, useState } from "react";

const AlgorithmResults = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("time");

    useEffect(() => {
        fetch("http://localhost:5000/run-algorithms")
            .then((response) => response.json())
            .then((results) => {
                setData(results);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p className="text-center text-lg font-semibold">Cargando...</p>;
    }

    const fastest = [...data].sort((a, b) => a.time - b.time)[0];
    const mostMemory = [...data].sort((a, b) => b.memory - a.memory)[0];

    const sortedData = [...data].sort((a, b) => (sortBy === "time" ? a.time - b.time : b.memory - a.memory));

    return (
        <div className="mt-6">
            <div className="flex justify-center space-x-4 mb-4">
                <button
                    className={`px-4 py-2 rounded-md font-semibold shadow-md ${
                        sortBy === "time" ? "bg-blue-600 text-white" : "bg-gray-300 text-black hover:bg-gray-400"
                    }`}
                    onClick={() => setSortBy("time")}
                >
                    🔵 Ordenar por Tiempo
                </button>
                <button
                    className={`px-4 py-2 rounded-md font-semibold shadow-md ${
                        sortBy === "memory" ? "bg-red-600 text-white" : "bg-gray-300 text-black hover:bg-gray-400"
                    }`}
                    onClick={() => setSortBy("memory")}
                >
                    🔴 Ordenar por Memoria
                </button>
            </div>

            <table className="w-full border-collapse border border-gray-300 text-gray-900 bg-white rounded-lg shadow-md">
                <thead>
                <tr className="bg-gray-200 text-left">
                    <th className="border border-gray-300 px-4 py-2">Algoritmo</th>
                    <th className="border border-gray-300 px-4 py-2">Tiempo de Ejecución (s) ⬍</th>
                    <th className="border border-gray-300 px-4 py-2">Memoria Utilizada (KB) ⬍</th>
                </tr>
                </thead>
                <tbody>
                {sortedData.map((algo, index) => (
                    <tr
                        key={index}
                        className={`text-center ${
                            algo.algorithm === fastest.algorithm ? "bg-green-600 text-white font-bold" :
                                algo.algorithm === mostMemory.algorithm ? "bg-red-600 text-white font-bold" :
                                    "bg-gray-50"
                        }`}
                    >
                        <td className="border border-gray-300 px-4 py-2">{algo.algorithm.replace("_", " ")}</td>
                        <td className="border border-gray-300 px-4 py-2">{parseFloat(algo.time).toFixed(6)}</td>
                        <td className="border border-gray-300 px-4 py-2">{algo.memory}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AlgorithmResults;