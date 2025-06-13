"use client"
import React, { useEffect, useState, useCallback } from 'react';
import Link from "next/link";
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const QuestionsPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingTest, setGeneratingTest] = useState(false);
  const [generatingTestId, setGeneratingTestId] = useState(null);

  const { getToken } = useAuth();
  const { isLoaded, user } = useUser();
  const router = useRouter();

  console.log(user?.id);

  // Memoized helper functions
  const getIconBySubject = useCallback((name) => {
    const icons = {
      'OS': '🧠',
      'DBMS': '🗃️',
      'C Language': '💻',
      'Networking': '🌐',
      'DSA': '📊',
      'Algorithms': '⚙️'
    };
    return icons[name] || '📚';
  }, []);

  const getDescriptionBySubject = useCallback((name) => {
    const descriptions = {
      'OS': 'Master OS concepts like processes, memory management, and concurrency.',
      'DBMS': 'Practice SQL queries, normalization, transactions, and indexing techniques.',
      'C Language': 'Test your knowledge of pointers, memory management, and core logic.',
      'Networking': 'Explore networking fundamentals, protocols, and security concepts.',
      'DSA': 'Master arrays, linked lists, trees, and graph structures.',
      'Algorithms': 'Solve problems on sorting, searching, and algorithmic complexity.'
    };
    return descriptions[name] || `Test your knowledge of ${name} concepts`;
  }, []);

  const getColorBySubject = useCallback((name) => {
    const colors = {
      'OS': 'from-purple-600 to-purple-800',
      'OOP': 'from-green-600 to-green-800',
      'DBMS': 'from-red-600 to-red-800',
      'C Language': 'from-blue-600 to-blue-800',
      'Networking': 'from-green-600 to-green-800',
      'DSA': 'from-yellow-600 to-yellow-800',
      'Algorithms': 'from-pink-600 to-pink-800'
    };
    return colors[name] || 'from-indigo-600 to-indigo-800';
  }, []);

  const getBorderColorBySubject = useCallback((name) => {
    const colors = {
      'OS': 'border-purple-500',
      'DBMS': 'border-red-500',
      'C Language': 'border-blue-500',
      'Networking': 'border-green-500',
      'DSA': 'border-yellow-500',
      'Algorithms': 'border-pink-500'
    };
    return colors[name] || 'border-indigo-500';
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    let isMounted = true;

    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await getToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/getAllSubjects`,
          {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        if (!isMounted) return;

        const subjects = Array.isArray(result?.data) ? result.data :
          Array.isArray(result) ? result : [];

        const transformed = subjects.map(subject => ({
          id: subject.sub_id,
          title: subject.name,
          description: getDescriptionBySubject(subject.name),
          icon: getIconBySubject(subject.name),
          gradient: getColorBySubject(subject.name),
          borderColor: getBorderColorBySubject(subject.name)
        }));

        setAssessments(transformed);
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error('Fetch error:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSubjects();

    return () => { isMounted = false };
  }, [isLoaded, user, getToken, getDescriptionBySubject, getIconBySubject, getColorBySubject, getBorderColorBySubject]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setAssessments([]);
  };
  console.log(assessments);
  const generateMockTest = async (assessment) => {
    setGeneratingTest(true);setGeneratingTestId(assessment.id);
    try {
      const token = await getToken();

      // Get student ID from Clerk user
      const std_id = user?.id; // Or use user?.publicMetadata.studentId if you store it differently

      if (!std_id) {
        throw new Error('Student ID not found');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/addQuiz`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            quiz_name: `${assessment.title} Mock Test - ${new Date().toLocaleDateString()}`, // Customizable name
            sub_id: assessment.id,
            std_id: std_id
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create quiz: ${response.status} ${response.statusText}`);
      }

      const newQuiz = await response.json();
      if (newQuiz && newQuiz[0]?.quiz_id) {
        router.push(`/mocktest/test/${newQuiz[0].quiz_id}`);
      } else {
        throw new Error('Invalid quiz data received');
      }
    } catch (err) {
      console.error('Error generating mock test:', err);
      // Add error toast or notification here
      alert(`Error: ${err.message}`);
    } finally {
      setGeneratingTest(false);
    }
  };


  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-8">
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <div className="h-10 w-3/4 md:h-12 md:w-1/2 bg-gray-800 rounded-lg mx-auto animate-pulse"></div>
            <div className="h-4 w-5/6 md:w-2/3 bg-gray-800 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl border border-gray-800">
                <div className="relative h-full bg-gray-800/50 rounded-lg p-6 flex flex-col animate-pulse">
                  <div className="flex items-start space-x-4 mb-5">
                    <div className="h-12 w-12 bg-gray-700 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-3/4 bg-gray-700 rounded"></div>
                      <div className="h-1 w-12 bg-gray-700 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6 flex-grow">
                    <div className="h-3 bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                  </div>
                  <div className="h-10 w-full bg-gray-700 rounded-lg mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 border border-red-500 text-red-400 px-6 py-4 rounded-lg mb-6 max-w-md text-center shadow-lg">
          <div className="text-2xl mb-2">⚠️</div>
          <h3 className="text-xl font-bold mb-2">Connection Error</h3>
          <p className="text-gray-300">{error}</p>
        </div>
        <button
          onClick={handleRetry}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Ace Your Technical Interviews
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Practice with our curated mock tests and stand out in your next technical assessment.
            </p>
          </div>
        </div>

        {/* Assessments Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center relative">
            <span className="relative z-10 inline-block px-4 bg-gray-900">
              Available Assessments
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></span>
            </span>
          </h2>

          {assessments.length === 0 && !loading ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-xl bg-gray-800/50">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-medium text-gray-300 mb-2">No assessments available</h3>
              <p className="text-gray-500">We're preparing new tests for you</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className={`group relative overflow-hidden rounded-xl p-0.5 ${assessment.borderColor} transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${assessment.gradient}`}></div>
                  <div className="relative h-full bg-gray-800 rounded-lg p-6 flex flex-col">
                    <div className="flex items-start space-x-4 mb-5">
                      <div className={`bg-gradient-to-br ${assessment.gradient} p-3 rounded-lg text-white text-2xl flex items-center justify-center flex-shrink-0`}>
                        {assessment.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {assessment.title}
                        </h3>
                        <div className={`w-12 h-1 mt-2 rounded-full bg-gradient-to-r ${assessment.gradient}`}></div>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-6 flex-grow">
                      {assessment.description}
                    </p>

                    <button
                      onClick={() => generateMockTest(assessment)}
                      disabled={generatingTest}
                      className={`mt-auto w-full text-center bg-gradient-to-r ${assessment.gradient} hover:opacity-90 text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-300 transform group-hover:translate-y-[-2px] ${generatingTest ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      aria-label={`Start ${assessment.title} test`}
                    >
                      {generatingTestId == assessment.id ? 'Creating Test...' : 'Start Test →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <div className="bg-gray-800 rounded-2xl p-8 md:p-10 text-center border border-gray-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 opacity-60"></div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to test your skills?</h3>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              Select an assessment above to begin your practice session. Track your progress and improve with each attempt.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/dashboard"
                className="bg-white text-gray-900 hover:bg-gray-200 font-medium py-2.5 px-6 rounded-lg transition-all duration-300 relative z-10"
              >
                View Progress
              </Link>
              <Link
                href="/learn"
                className="bg-transparent border border-gray-600 hover:border-gray-400 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-300 relative z-10"
              >
                Learn Concepts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;