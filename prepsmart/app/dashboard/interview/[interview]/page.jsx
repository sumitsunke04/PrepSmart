"use client"
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';

const Interview = ({ params }) => {
    const [interviewData, setInterviewData] = useState();
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GetInterviewDetails();
    }, [])

    const GetInterviewDetails = async () => {
        try {
            const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interview));
            setInterviewData(result[0]);
            localStorage.setItem(`noOfQuestions_${params?.interview}`, result[0].noOfQuestions);
        } catch (error) {
            console.error("Error fetching interview details:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className=' mt-28 my-10 px-4 md:px-8 text-gray-100'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className='flex'>
                    <h1 className='text-3xl font-bold bg-gradient-to-r to-purple-500 from-white bg-clip-text text-transparent mb-2'>
                        Interview Prepara
                    </h1>
                    <h1 className='text-purple-500 text-3xl font-bold mb-2'>
                        tion
                    </h1>
                </div>
                
                <p className='text-gray-400 mb-8'>Review your details before starting the mock interview</p>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Left Column - Interview Details */}
                    <div className='space-y-6'>
                        <div className='bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg'>
                            <h2 className='text-xl font-semibold mb-4 bg-gradient-to-r to-purple-500 from-blue-300 bg-clip-text text-transparent'>Interview Details</h2>
                            <div className='space-y-4'>
                                <div>
                                    <p className='text-sm text-gray-400'>Job Role</p>
                                    <p className='text-lg text-green-400 font-medium'>{interviewData?.jobPosition}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-400'>Tech Stack</p>
                                    <p className='text-lg text-green-400 font-medium'>{interviewData?.jobDesc}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-400'>Experience Level</p>
                                    <p className='text-lg text-green-400 font-medium'>{interviewData?.jobExperience} years</p>
                                </div>
                            </div>
                        </div>

                        <div className='bg-yellow-100 p-6 rounded-xl shadow-inner border border-yellow-300'>
                            <div className='flex items-center gap-3 mb-4'>
                                <Lightbulb className='text-yellow-500' size={20} />
                                <h3 className='text-lg font-semibold text-yellow-500'>Tips for Success</h3>
                            </div>
                            <p className='text-yellow-500'>
                                {process.env.NEXT_PUBLIC_INFORMATION || 'Remember to maintain good posture, speak clearly, and think before answering each question.'}
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Webcam Setup */}
                    <div className='flex flex-col'>
                        <div className='bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg h-full flex flex-col'>
                            <h2 className='text-xl font-semibold mb-4 bg-gradient-to-r to-purple-500 from-blue-300 bg-clip-text text-transparent'>Camera Setup</h2>

                            {webCamEnabled ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className='flex-1 flex flex-col'
                                >
                                    <Webcam
                                        onUserMedia={() => setWebCamEnabled(true)}
                                        onUserMediaError={() => setWebCamEnabled(false)}
                                        mirrored={true}
                                        className='rounded-lg overflow-hidden flex-1 w-full'
                                    />
                                    <Button
                                        variant="outline"
                                        className='mt-4 border-red-500 text-red-500 hover:bg-red-500/10'
                                        onClick={() => setWebCamEnabled(false)}
                                    >
                                        Disable Camera
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className='flex-1 flex flex-col items-center justify-center space-y-6'
                                >
                                    <div className='bg-gray-700 p-8 rounded-full'>
                                        <WebcamIcon className='h-16 w-16 text-gray-400' />
                                    </div>
                                    <p className='text-gray-400 text-center'>
                                        Enable your camera to practice with video feedback
                                    </p>
                                    <Button
                                        className='bg-blue-600 hover:bg-blue-700 w-full'
                                        onClick={() => setWebCamEnabled(true)}
                                    >
                                        Enable Camera & Microphone
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Start Interview Button */}
                <div className='mt-10 flex justify-end'>
                    <Link href={`/dashboard/interview/${params?.interview}/start`} className='w-full md:w-auto'>
                        <Button className='w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'>
                            Start Interview
                            <ChevronRight className='ml-2' size={18} />
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}

export default Interview