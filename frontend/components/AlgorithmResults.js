import { useEffect, useState } from "react";

const AlgorithmResults = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState(null); // "time" o "memory"
    const [ascending, setAscending] = useState(true);

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

    const handleSort = (criteria) => {
        setSortBy(criteria);
        setAscending(prevAscending => (sortBy === criteria ? !prevAscending : true));

        const sortedData = [...data].sort((a, b) => {
            if (criteria === "time") {
                return ascending ? a.time - b.time : b.time - a.time;
            } else if (criteria === "memory") {
                return ascending ? a.memory - b.memory : b.memory - a.memory;
            }
            return 0;
        });

        setData(sortedData);
    };

    if (loading) {
        return <p className="text-center text-lg font-semibold">Cargando...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10">

            {/* Botones de Ordenamiento */}
            <div className="flex justify-center gap-4 mb-4">
                <button
                    onClick={() => handleSort("time")}
                    className={`px-4 py-2 rounded-md font-semibold shadow-md ${
                        sortBy === "time" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
                    }`}
                >
                    {ascending ? "↑" : "↓"} Ordenar por Tiempo
                </button>
                <button
                    onClick={() => handleSort("memory")}
                    className={`px-4 py-2 rounded-md font-semibold shadow-md ${
                        sortBy === "memory" ? "bg-red-600 text-white" : "bg-gray-300 text-black"
                    }`}
                >
                    {ascending ? "↑" : "↓"} Ordenar por Memoria
                </button>
            </div>

            {/* Tabla de Resultados */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Algoritmo</th>
                    <th className="border border-gray-300 px-4 py-2">Tiempo (s)</th>
                    <th className="border border-gray-300 px-4 py-2">Memoria (KB)</th>
                </tr>
                </thead>
                <tbody>
                {data.map((algo, index) => (
                    <tr key={index} className="text-center">
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
