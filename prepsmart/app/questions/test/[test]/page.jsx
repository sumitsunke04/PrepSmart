"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { Clock, ChevronRight, Check, BookOpen } from 'lucide-react';
import '../../../styles/load.css';

export default function QuizPage() {
    const params = useParams();
    const { getToken } = useAuth();
    const { user } = useUser();
    const router = useRouter();

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [timeLeft, setTimeLeft] = useState(60 * 15); // 15 minutes
    const [isLoading, setIsLoading] = useState(true);
    const quizId = params.test;

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setIsLoading(true);
                const token = await getToken();

                const res = await fetch('http://localhost:5000/question', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        questionNumber: currentIndex,
                        quizID: quizId,
                        studentID: user?.id
                    })
                });

                if (!res.ok) throw new Error('Failed to load questions');
                const data = await res.json();
                setQuestions([data[0]]);
            } catch (err) {
                toast.error(err.message || 'Failed to load quiz');
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.id) fetchQuestions();
    }, [quizId, user]);

    useEffect(() => {
        const timer = timeLeft > 0 && setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        if (timeLeft === 0) handleSubmit();
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleOptionSelect = (queId, optId) => {
        setSelectedOptions(prev => ({
            ...prev,
            [queId]: optId
        }));
    };

    const fetchNextQuestion = async () => {
        try {
            setIsLoading(true);
            const token = await getToken();

            const res = await fetch('http://localhost:5000/question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    questionNumber: currentIndex + 1,
                    quizID: quizId,
                    studentID: user?.id
                })
            });

            if (!res.ok) throw new Error('Failed to fetch next question');

            const newQuestion = await res.json();
            setQuestions(prev => [...prev, newQuestion[0]]);
            setCurrentIndex(prev => prev + 1);
        } catch (err) {
            toast.error(err.message || 'Error loading next question');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = async () => {
        const currentQuestion = questions[currentIndex];
        const selectedOption = selectedOptions[currentQuestion.que_id];

        if (!selectedOption) {
            toast.error('Please select an answer');
            return;
        }

        try {
            const token = await getToken();
            await fetch('http://localhost:5000/submitAnswer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    que_id: currentQuestion.que_id,
                    selected_opt_id: selectedOption,
                    quiz_id: quizId,
                    std_id: user?.id
                })
            });
        } catch (err) {
            console.error('Error submitting answer:', err);
        }

        if (currentIndex < 5) {
            await fetchNextQuestion();
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        try {
            const token = await getToken();
            await fetch('http://localhost:5000/getFeedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    std_id: user?.id,
                    quiz_id: quizId
                })
            });

            router.push(`/questions/results`);
        } catch (err) {
            toast.error('Error submitting quiz');
            console.error(err);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading || !questions.length) {
        return (
            <div className="min-h-screen from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center space-y-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 text-center">
                    <div className="bounce-loader mb-4">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <p className="text-slate-300 text-lg font-medium">Loading your assessment...</p>
                    <p className="text-slate-400 text-sm mt-2">Please wait while we prepare your questions</p>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / 6) * 100;

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
            {/* Header Section - Left */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 flex-1 md:max-w-sm">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">MOCK INTERVIEW</h1>
                            <p className="text-slate-400 text-sm">Technical Assessment</p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm
                        ${timeLeft < 300 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                        <Clock className="w-4 h-4" />
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <div className="mt-6">
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span>Progress</span>
                        <span>{currentIndex + 1} of 6</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Question Card - Right */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 shadow-2xl flex-1">
                <div className="mb-6">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 text-sm mb-4">
                        Question {currentIndex + 1}
                    </div>
                    <h2 className="text-2xl font-semibold text-white leading-relaxed">
                        {currentQuestion.text}
                    </h2>
                </div>

                <div className="space-y-3 mb-8">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedOptions[currentQuestion.que_id] === option.opt_id;
                        const optionLabel = String.fromCharCode(65 + index); // A, B, C, D

                        return (
                            <button
                                key={option.opt_id}
                                onClick={() => handleOptionSelect(currentQuestion.que_id, option.opt_id)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group
                                    ${isSelected
                                        ? 'border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/20'
                                        : 'border-slate-600 text-slate-300 hover:bg-white/5 hover:border-slate-500 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-all
                                        ${isSelected
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600'
                                        }`}>
                                        {isSelected ? <Check className="w-4 h-4" /> : optionLabel}
                                    </div>
                                    <span className="font-medium">{option.text}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={handleNext}
                    disabled={!selectedOptions[currentQuestion.que_id] || isLoading}
                    className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2
                        ${!selectedOptions[currentQuestion.que_id] || isLoading
                            ? 'bg-slate-700 cursor-not-allowed text-slate-500'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                        }`}
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                            Loading...
                        </>
                    ) : currentIndex < 5 ? (
                        <>
                            Next Question
                            <ChevronRight className="w-5 h-5" />
                        </>
                    ) : (
                        <>
                            <Check className="w-5 h-5" />
                            Submit Assessment
                        </>
                    )}
                </button>

                {/* Footer */}
                <div className="text-center mt-8 text-slate-400 text-sm">
                    <p>Take your time and read each question carefully</p>
                </div>
            </div>
        </div>
    );
}
