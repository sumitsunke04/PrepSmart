"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#4ade80", "#f87171"]; // Green for correct, Red for incorrect

export default function ResultPage() {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Hello")
                const res = await fetch("http://localhost:5000/getFeedback", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        std_id: "user_2tAEeH1tHSbpqT5T8YDGvvanAzN",
                        quiz_id: "42",
                    }),
                });

                const data = await res.json();
                console.log(data)
                setFeedback(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching feedback:", error);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl">Loading result...</p>
            </div>
        );
    }

    const correct = feedback.filter((q) => q.isCorrect).length;
    const incorrect = feedback.length - correct;

    const pieData = [
        { name: "Correct", value: correct },
        { name: "Incorrect", value: incorrect },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#111827]">
            <h1 className="text-3xl font-bold mb-6 text-white-800">Quiz Result Analysis</h1>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>

            <div className="mt-6 text-lg text-white-700">
                <p>Total Questions: {feedback.length}</p>
                <p>Score : {correct}/{feedback.length}</p>
                <p>
                Accuracy: {((correct / feedback.length) * 100).toFixed(2)}%
                </p>
                <p>Correct Answers: {correct}</p>
                <p>Incorrect Answers: {incorrect}</p>
            </div>
        </div>
    );
}
