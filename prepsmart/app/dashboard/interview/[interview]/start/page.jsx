"use client"
import { db } from '@/utils/db';
import { MockInterview, UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState, useRef, useCallback } from 'react'
import QustionsSection from './_components/QustionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Webcam from 'react-webcam';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiClock, FiCamera } from 'react-icons/fi';

const StartInterview = ({ params }) => {
    const router = useRouter();
    const [interviewData, setInterviewData] = useState(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [interviewQuestion, setInterviewQuestion] = useState([]);
    const [DEFAULT_INTERVIEW_DURATION, setDID] = useState(localStorage.getItem(`noOfQuestions_${params?.interview}`) * 3 * 60 * 1000);
    const [timeRemaining, setTimeRemaining] = useState(DEFAULT_INTERVIEW_DURATION);
    const [timerActive, setTimerActive] = useState(true);
    const [snapshots, setSnapshots] = useState([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const webcamRef = useRef(null);
    const captureIntervalRef = useRef(null);
    const snapshotCountRef = useRef(0);
    const user = useUser();

    useEffect(() => {
        if (params.interview) {
            GetInterviewDetails();
            initializeTimer();
        }

        return () => {
            if (window.timerInterval) clearInterval(window.timerInterval);
            if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);
        };
    }, [params.interview]);

    const startSnapshotCapture = useCallback(() => {
        if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);

        setIsCapturing(true);
        captureIntervalRef.current = setInterval(captureSnapshot, 5000);
    }, []);

    const stopSnapshotCapture = useCallback(() => {
        if (captureIntervalRef.current) {
            clearInterval(captureIntervalRef.current);
            captureIntervalRef.current = null;
        }
        setIsCapturing(false);
    }, []);

    const captureSnapshot = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                const timestamp = new Date().toISOString();
                const snapshot = {
                    id: snapshotCountRef.current++,
                    data: imageSrc,
                    timestamp,
                    questionIndex: activeQuestionIndex
                };
                setSnapshots(prev => [...prev, snapshot]);
            }
        }
    }, [activeQuestionIndex]);

    const initializeTimer = () => {
        const storedEndTime = localStorage.getItem(`interviewTimer_${params.interview}`);
        const now = new Date().getTime();

        if (storedEndTime) {
            const remaining = parseInt(storedEndTime) - now;
            if (remaining > 0) {
                setTimeRemaining(remaining);
                startTimer(remaining);
                startSnapshotCapture();
            } else {
                handleTimeExpired();
            }
        } else {
            const endTime = now + DEFAULT_INTERVIEW_DURATION;
            localStorage.setItem(`interviewTimer_${params.interview}`, endTime.toString());
            setTimeRemaining(DEFAULT_INTERVIEW_DURATION);
            startTimer(DEFAULT_INTERVIEW_DURATION);
            startSnapshotCapture();
        }
    };

    const startTimer = (duration) => {
        if (window.timerInterval) clearInterval(window.timerInterval);

        window.timerInterval = setInterval(() => {
            setTimeRemaining(prev => {
                const newTime = prev - 1000;
                if (newTime <= 0) {
                    clearInterval(window.timerInterval);
                    handleTimeExpired();
                    return 0;
                }
                return newTime;
            });
        }, 1000);
    };

    const createSnapshotZip = async () => {
        const zip = new JSZip();
        const imagesFolder = zip.folder("images");

        snapshots.forEach((snapshot, index) => {
            const base64Data = snapshot.data.replace(/^data:image\/\w+;base64,/, '');
            imagesFolder.file(`snapshot_${snapshot.questionIndex}_${index}.png`, base64Data, { base64: true });
        });

        return await zip.generateAsync({ type: "blob" });
    };

    const handleTimeExpired = async () => {
        stopSnapshotCapture();
        setTimerActive(false);

        try {
            const zipBlob = await createSnapshotZip();
            saveAs(zipBlob, `interview_snapshots_${params.interview}.zip`);

            const formData = new FormData();
            formData.append('zipfile', zipBlob, `interview_snapshots_${params.interview}.zip`);

            const uploadResponse = await fetch('http://localhost:4000/upload', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (!uploadResponse.ok) throw new Error(`Upload failed: ${uploadResponse.statusText}`);

            const analysisResult = await uploadResponse.json();
            console.log("Analysis result:", analysisResult);

            await db.update(UserAnswer)
                .set({ emotionFeedback: JSON.stringify(analysisResult) })
                .where(eq(UserAnswer.mockIdRef, params?.interview));

        } catch (error) {
            console.error("Error in handleTimeExpired:", error);
        }

        localStorage.removeItem(`interviewTimer_${params.interview}`);
        localStorage.removeItem(`noOfQuestions_${params.interview}`);
        router.push(`/dashboard/interview/${interviewData?.mockId}/feedback`);
    };

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const GetInterviewDetails = async () => {
        try {
            const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interview));

            if (result.length > 0) {
                setInterviewData(result[0]);
                setInterviewQuestion(JSON.parse(result[0].jsonMockResp));
            }
        } catch (error) {
            console.error("Error fetching interview details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-300">Loading interview session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 mt-28 text-gray-100 min-h-screen p-4 md:p-8">
            <div>
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Mock Interview Session
                        </h1>
                        <p className="text-gray-400">Practice your responses with AI feedback</p>
                    </div>

                    {/* Timer Display */}
                    <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                        <FiClock className="text-blue-400" />
                        <span className="font-mono font-medium">
                            {formatTime(timeRemaining)}
                        </span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Questions Section - Wider Column */}
                    <div className="lg:col-span-3 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-blue-400">
                                Question {activeQuestionIndex + 1} of {interviewQuestion?.length}
                            </h2>
                            <div className="flex space-x-2">
                                {Array.from({ length: interviewQuestion?.length || 0 }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveQuestionIndex(index)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${index === activeQuestionIndex
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <QustionsSection
                            mockInterviewQuestion={interviewQuestion}
                            activeQuestionIndex={activeQuestionIndex}
                        />
                    </div>
                    {/* Recording Section - Narrower Column */}
                    <div className="lg:col-span-2 flex flex-col justify-between space-y-6 ">
                        <div>
                            {/* Webcam Feed */}
                            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <FiCamera className="text-blue-400" />
                                        Video Recording
                                    </h2>
                                    <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded">
                                        {isCapturing ? 'Recording' : 'Ready'}
                                    </span>
                                </div>

                                <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                                    {!isCapturing && (
                                        <Image
                                            src="/webcam.png"
                                            alt="Webcam placeholder"
                                            width={200}
                                            height={200}
                                            className="opacity-30"
                                        />
                                    )}
                                    <Webcam
                                        ref={webcamRef}
                                        audio={false}
                                        screenshotFormat="image/jpeg"
                                        mirrored={true}
                                        className={`w-full h-full object-cover ${!isCapturing ? 'hidden' : 'block'}`}
                                    />
                                </div>
                            </div>

                            {/* Answer Recording Section */}
                            <div className='mt-2'>
                                <RecordAnswerSection
                                    interviewData={interviewData}
                                    mockInterviewQuestion={interviewQuestion}
                                    activeQuestionIndex={activeQuestionIndex}
                                />
                            </div>
                        </div>
                        {/* Navigation Controls */}
                        <div className="mt-8 flex justify-between">
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                    className={`bg-blue-600 hover:bg-blue-700 ${activeQuestionIndex === 0 ? 'invisible' : ''}`}
                                    onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                                >
                                    <FiChevronLeft className="mr-2" />
                                    Previous Question
                                </Button>
                            </motion.div>

                            <div className="flex gap-4">
                                {activeQuestionIndex !== (interviewQuestion?.length - 1) ? (
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                        <Button
                                            className="bg-blue-600 hover:bg-blue-700"
                                            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                                        >
                                            Next Question
                                            <FiChevronRight className="ml-2" />
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                        <Button
                                            className="bg-red-600 hover:bg-red-700"
                                            onClick={handleTimeExpired}
                                        >
                                            End Interview
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StartInterview;