"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import '../../../styles/load.css';

export default function QuizPage() {
    const params = useParams();
    const { getToken } = useAuth();
    const { user } = useUser(); // Clerk user info
    const router = useRouter();
    
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [timeLeft, setTimeLeft] = useState(60 * 15); // 15 minutes
    const [isLoading, setIsLoading] = useState(true);
    const quizId = params.test;
   console.log("quiz",quizId);
   console.log("user",user);
    // Fetch first question
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
                console.log("respone -->>",res);
                if (!res.ok) throw new Error('Failed to load questions');

                const data = await res.json();
                setQuestions([data[0]]);
            } catch (err) {
                toast.error(err.message || 'Failed to load quiz');
                // router.push('/assessments');
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.id) fetchQuestions();
    }, [quizId,user]);

    // Timer logic
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
                    std_id:user?.id,
                    quiz_id: quizId
                })
            });

            // router.push(`/questions/${quizId}/results`);
            router.push(`/questions/results`);
        } catch (err) {
            toast.error('Error submitting quiz');
            console.error(err);
        }
    };

    if (isLoading || !questions.length) {
      return (
          <div className="flex flex-col items-center justify-center h-screen bg-[#111827] space-y-4">
              <div className="bounce-loader">
                  <div></div>
                  <div></div>
                  <div></div>
              </div>
              <p className="text-gray-700 text-lg">Loading quiz...</p>
          </div>
    );
}


    const currentQuestion = questions[currentIndex];

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Mock Test</h1>
                <div className="text-xl">
                    Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
            </div>

            <div className="bg-[#111827] rounded-lg shadow p-6">
                <div className="mb-4">Question {currentIndex + 1} of 6</div>

                <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>

                <div className="space-y-3 mb-8">
                    {currentQuestion.options.map(option => (
                        <button
                            key={option.opt_id}
                            className={`w-full text-left p-4 rounded-lg border ${selectedOptions[currentQuestion.que_id] === option.opt_id
                                    ? 'border-blue-500 bg-blue-600'
                                    : 'border-gray-200 hover:bg-blue-500'
                                }`}
                            onClick={() => handleOptionSelect(currentQuestion.que_id, option.opt_id)}
                        >
                            {option.text}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    disabled={!selectedOptions[currentQuestion.que_id]}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-red-500"
                >
                    {currentIndex < 5 ? 'Next Question' : 'Submit Test'}
                </button>
            </div>
        </div>
    );
}