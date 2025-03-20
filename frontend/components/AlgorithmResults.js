import { useEffect, useState } from "react";

const AlgorithmResults = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h2 className="text-2xl font-bold text-center mb-4">Resultados de Algoritmos</h2>
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