"use client"
import React, { useEffect, useState, useCallback } from 'react';
import Link from "next/link";
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const QuestionsPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();
  const { isLoaded, user } = useUser();
  const router = useRouter();

  // Memoized helper functions
  const getIconBySubject = useCallback((name) => {
    const icons = {
      'Operating System': '🧠',
      'DBMS': '🗃',
      'C Language': '💻',
      'Networking': '🌐',
      'Data Structures': '📊',
      'Algorithms': '⚙'
    };
    return icons[name] || '📚';
  }, []);

  const getDescriptionBySubject = useCallback((name) => {
    const descriptions = {
      'Operating System': 'A comprehensive mock test to master OS concepts essential for interviews—covering processes, memory management, and concurrency.',
      'DBMS': 'Prepare for DBMS questions with this mock test, covering SQL queries, normalization, transactions, and indexing.',
      'C Language': 'Prepare for C language interviews with mock tests on pointers, memory management, and core logic building.',
      'Networking': 'Test your knowledge of networking fundamentals, protocols, and security concepts.',
      'Data Structures': 'Master arrays, linked lists, trees, and graphs with these practice questions.',
      'Algorithms': 'Solve problems related to sorting, searching, and algorithmic complexity.'
    };
    return descriptions[name] || `Test your knowledge of ${name} concepts`;
  }, []);

  const getColorBySubject = useCallback((name) => {
    const colors = {
      'Operating System': 'bg-purple-600',
      'DBMS': 'bg-red-600',
      'C Language': 'bg-blue-600',
      'Networking': 'bg-green-600',
      'Data Structures': 'bg-yellow-600',
      'Algorithms': 'bg-pink-600'
    };
    return colors[name] || 'bg-indigo-600';
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
          bgColor: getColorBySubject(subject.name)
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
  }, [isLoaded, user, getToken, getDescriptionBySubject, getIconBySubject, getColorBySubject]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setAssessments([]);
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <div className="text-lg">Loading assessments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button 
          onClick={handleRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
          Get Ready for your next Online Assessment
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Practice with our mock tests and ace your interviews
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-8 text-center text-gray-700 dark:text-gray-200">
          Explore the Assessments
        </h2>

        {assessments.length === 0 && !loading ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600 dark:text-gray-400">No assessments available</p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">Please check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((assessment) => (
              <div
                key={assessment.id}
                className="bg-white dark:bg-[#18163F] p-6 rounded-lg shadow-lg flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`${assessment.bgColor} p-3 rounded-full text-white text-xl w-12 h-12 flex items-center justify-center`}>
                      {assessment.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                      {assessment.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {assessment.description}
                  </p>
                </div>

                <Link
                  href={`/questions/test/${assessment.id}`}
                  className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 text-center"
                  aria-label={`Start ${assessment.title} test`}
                >
                  Start Test
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default QuestionsPage;