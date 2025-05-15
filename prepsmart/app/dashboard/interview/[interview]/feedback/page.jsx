"use client";
import { db } from "@/utils/db";
import { UserAnswer, MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState, useMemo } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [mockInterview, setMockInterview] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [emotionAnalysis, setEmotionAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([getFeedback(), getMockInterviewDetails()]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getMockInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interview))
        .limit(1);

      if (result.length > 0) {
        setMockInterview(result[0]);
      }
    } catch (error) {
      console.error("Failed to fetch mock interview details:", error);
    }
  };

  const getFeedback = async () => {
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interview))
        .orderBy(UserAnswer.id);

      setFeedbackList(result);

      if (result.length > 0) {
        const totalRating = result.reduce((sum, item) => sum + (Number(item.rating) || 0), 0);
        setAverageRating(parseFloat((totalRating / result.length).toFixed(1)));

        const answerWithEmotion = result.find(item => item.emotionFeedback);
        if (answerWithEmotion?.emotionFeedback) {
          try {
            const parsed = JSON.parse(answerWithEmotion.emotionFeedback);
            if (parsed.success) {
              setEmotionAnalysis(parsed);
            }
          } catch (e) {
            console.error("Failed to parse emotion feedback", e);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
    }
  };

  const emotionChartData = useMemo(() => {
    if (!emotionAnalysis?.insights?.emotion_distribution) return [];
    return Object.entries(emotionAnalysis.insights.emotion_distribution)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [emotionAnalysis]);

  const successRate = useMemo(() => {
    if (!emotionAnalysis?.statistics) return null;
    const { total_images, successful_analyses } = emotionAnalysis.statistics;
    return total_images > 0 ? (successful_analyses / total_images * 100).toFixed(0) : null;
  }, [emotionAnalysis]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-28 bg-gray-900 text-gray-100 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-400">Interview Feedback Report</h2>
            {mockInterview ? (
              <div className="mt-3 space-y-1">
                <p className="text-gray-300">
                  <span className="font-medium text-gray-400">Position:</span> {mockInterview.jobPosition}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium text-gray-400">Experience Level:</span> {mockInterview.jobExperience}
                </p>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <Skeleton className="h-4 w-48 bg-gray-800" />
                <Skeleton className="h-4 w-36 bg-gray-800" />
              </div>
            )}
          </div>
          <Badge className="text-blue-400 bg-gray-900 border border-blue-500/20">
            {new Date().toLocaleDateString()}
          </Badge>
        </div>

        {/* Performance Summary */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-white">
          <h3 className="text-xl font-semibold mb-6 text-white">Performance Summary</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {/* Questions Answered */}
            <div className="bg-gray-900 bg-gray-750 p-4 rounded-lg border border-gray-500">
              <p className="text-sm text-gray-400">Questions Answered</p>
              <p className="text-2xl font-bold text-blue-400">
                {feedbackList.length}
              </p>
            </div>

            {/* Average Rating */}
            <div className=" bg-gray-900 bg-gray-750 p-4 rounded-lg border border-gray-500">
              <p className="text-sm text-gray-400">Average Rating</p>
              <p className={`text-2xl font-bold ${
                averageRating && averageRating < 5 ? "text-red-400" : "text-green-400"
              }`}>
                {averageRating !== null ? `${averageRating}/10` : "N/A"}
              </p>
            </div>

            {/* Analysis Coverage */}
            {emotionAnalysis?.statistics && (
              <div className="bg-gray-900 bg-gray-750 p-4 rounded-lg border border-gray-500">
                <p className="text-sm text-gray-400">Analysis Coverage</p>
                <p className="text-2xl font-bold text-purple-400">{successRate}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {emotionAnalysis.statistics.successful_analyses} of {emotionAnalysis.statistics.total_images} analyzed
                </p>
              </div>
            )}
          </div>

          {/* Emotion Summary */}
          {emotionAnalysis && (
            <div className="border-t border-gray-500 pt-6">
              <h4 className="font-semibold text-lg mb-4 text-blue-400">Emotion Analysis Summary</h4>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={emotionChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {emotionChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#3c567db3',
                          borderColor: '#e0e0ff',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ color: '#f3f4f6' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="lg:w-1/2 space-y-5">
                  <div className=" bg-gray-900 bg-gray-750 p-4 rounded-lg border border-gray-500">
                    <h4 className="font-medium text-gray-400">Dominant Emotion</h4>
                    <p className="text-lg font-semibold capitalize text-blue-400">
                      {emotionAnalysis.insights.dominant_emotion.toLowerCase()}
                    </p>
                  </div>

                  <div className="bg-gray-900 bg-gray-750 p-4 rounded-lg border border-gray-500">
                    <h4 className="font-medium text-gray-400">Confidence Level</h4>
                    <p className="text-lg font-semibold text-green-400">
                      {(emotionAnalysis.insights.confidence_average * 100).toFixed(1)}%
                    </p>
                  </div>

                  <div className="bg-gray-900 bg-gray-750 p-4 rounded-lg border border-gray-500">
                    <h4 className="font-medium text-gray-400">Key Improvement Tip</h4>
                    <p className="text-md text-amber-400 mt-1">
                      {emotionAnalysis.insights.general_tip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Question Feedback */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="text-xl font-semibold text-blue-400">Question-by-Question Feedback</h3>
              <p className="text-sm text-gray-400 mt-1">
                Review each question, your response, and suggestions for improvement
              </p>
            </div>
            <div className="text-xs text-gray-500">
              Showing {feedbackList.length} questions
            </div>
          </div>

          <div className="space-y-4">
            {feedbackList.length > 0 ? (
              feedbackList.map((item, index) => {
                const emotionData = item.emotionFeedback
                  ? JSON.parse(item.emotionFeedback)
                  : null;

                return (
                  <Collapsible 
                    key={index} 
                    className="border rounded-lg overflow-hidden border-gray-500"
                  >
                    <CollapsibleTrigger className="w-full p-4 bg-gray-750 hover:bg-gray-700 text-left flex justify-between items-center transition-colors">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-medium text-gray-300">Question {index + 1}</span>
                        {item.rating && (
                          <Badge
                            variant={parseInt(item.rating) >= 7 ? "default" : "destructive"}
                            className="px-2 py-0.5 text-xs"
                          >
                            {item.rating}/10
                          </Badge>
                        )}
                        {emotionData?.insights && (
                          <Badge variant="outline" className="px-2 py-0.5 text-xs capitalize border-blue-400 text-blue-400">
                            {emotionData.insights.dominant_emotion.toLowerCase()}
                          </Badge>
                        )}
                      </div>
                      <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 space-y-4 bg-gray-750">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">Question</h4>
                        <p className="mt-1 text-gray-200">{item.question}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-850 p-3 rounded-lg border border-gray-700">
                          <h4 className="text-sm font-medium text-red-400">Your Answer</h4>
                          <p className="mt-1 text-gray-300">{item.userAnswer}</p>
                        </div>

                        <div className="bg-gray-850 p-3 rounded-lg border border-gray-700">
                          <h4 className="text-sm font-medium text-green-400">Suggested Answer</h4>
                          <p className="mt-1 text-gray-300">{item.correctAnswer}</p>
                        </div>
                      </div>

                      <div className="bg-gray-850 p-3 rounded-lg border border-gray-700">
                        <h4 className="text-sm font-medium text-blue-400">Feedback</h4>
                        <p className="mt-1 text-gray-300">{item.feedback}</p>
                      </div>

                      {emotionData?.insights && (
                        <div className="bg-gray-850 p-3 rounded-lg border border-gray-700">
                          <h4 className="text-sm font-medium text-purple-400">Emotion Analysis</h4>
                          <div className="mt-2 space-y-2">
                            <p className="text-sm text-gray-300">
                              <span className="font-medium text-gray-400">Dominant Emotion:</span>{" "}
                              <span className="capitalize text-blue-400">
                                {emotionData.insights.dominant_emotion.toLowerCase()}
                              </span>
                            </p>
                            {emotionData.insights.general_tip && (
                              <p className="text-sm text-gray-300">
                                <span className="font-medium text-gray-400">Tip:</span>{" "}
                                <span className="text-amber-400">{emotionData.insights.general_tip}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-400">
                No feedback data available for this interview
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={() => router.replace("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}