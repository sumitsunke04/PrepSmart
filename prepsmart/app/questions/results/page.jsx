"use client";
import React, { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    FiChevronDown,
    FiTrendingUp,
    FiTrendingDown,
} from "react-icons/fi";
import { motion } from "framer-motion";

const COLORS = ["#4ade80", "#f87171"]; // Green, Red

export default function ResultPage() {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showStats, setShowStats] = useState(true);
    const [levels, setLevels] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
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
                setFeedback(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching feedback:", error);
            }
        };

        const fetchTopicLevels = async () => {
            try {
                const res = await fetch("http://localhost:5000/getHighestLevel", {
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
                setLevels(data);
            } catch (error) {
                console.error("Error fetching topic levels:", error);
            }
        };

        fetchData();
        fetchTopicLevels();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#111827]">
                <p className="text-xl text-white">Loading result...</p>
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
        <div className="min-h-screen bg-[#111827] text-white px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-10">📊 Quiz Result Analysis</h1>

            {/* Toggle Button for Performance Overview */}
            <div className="mb-6 border-b border-gray-700 pb-2 flex justify-between items-center">
                <button
                    onClick={() => setShowStats(!showStats)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white"
                >
                    <FiChevronDown
                        className={`transition-transform ${showStats ? 'rotate-0' : '-rotate-90'}`}
                        size={18}
                    />
                    <span>Performance Overview by Topic</span>
                </button>
            </div>

            {/* Animated Stats Cards */}
            <motion.div
                initial={false}
                animate={{
                    height: showStats ? 'auto' : 0,
                    opacity: showStats ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {levels.map((level, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[#13142b] p-5 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-colors"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-400 text-sm">Topic</p>
                                    <p className="text-xl font-bold mt-1">{level.topic_name}</p>
                                    <p className="text-sm mt-1 text-green-400">
                                        Level Reached: {level.max_level}
                                    </p>
                                </div>
                                <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
                                    <FiTrendingUp size={20} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-10 justify-center items-center mb-12">
                <div className="w-full lg:w-1/2 h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                innerRadius={60}
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
                </div>

                <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-full lg:w-1/3 space-y-3">
                    <h2 className="text-2xl font-semibold mb-2">📈 Statistics</h2>
                    <p>Total Questions: <span className="font-bold">{feedback.length}</span></p>
                    <p>Score: <span className="font-bold">{correct}/{feedback.length}</span></p>
                    <p>Accuracy: <span className="font-bold text-green-400">{((correct / feedback.length) * 100).toFixed(2)}%</span></p>
                    <p className="text-green-400">✅ Correct Answers: {correct}</p>
                    <p className="text-red-400">❌ Incorrect Answers: {incorrect}</p>
                </div>
            </div>

            {/* Feedback List */}
            <div className="max-w-5xl mx-auto space-y-6">
                <h2 className="text-2xl font-semibold mb-4">📝 Detailed Feedback</h2>
                {feedback.map((item, index) => (
                    <div
                        key={index}
                        className={`p-5 rounded-lg shadow-md border-l-4 ${item.isCorrect ? "border-green-500 bg-green-900/30" : "border-red-500 bg-red-900/30"}`}
                    >
                        <p className="font-semibold mb-2">Q{index + 1}. {item.question}</p>
                        <p>
                            <span className="font-medium">Your Answer:</span>{" "}
                            <span className={`${item.isCorrect ? "text-green-400" : "text-red-400 line-through"}`}>
                                {item.selectedOption.text}
                            </span>
                        </p>
                        {!item.isCorrect && (
                            <p>
                                <span className="font-medium">Correct Answer:</span>{" "}
                                <span className="text-green-300">{item.correctOption.text}</span>
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
