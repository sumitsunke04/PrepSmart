"use client";
import { UserButton } from '@clerk/nextjs';
import React, { useState } from 'react';
import AddNewInterview from './_components/AddNewInterview';
import InterviewList from './_components/InterviewList';
import { FiPlus, FiBarChart2, FiAward, FiClock, FiChevronDown, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('recent');
  const [showStats, setShowStats] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for stats
  const stats = [
    { title: "Total Interviews", value: "24", icon: <FiBarChart2 size={20} />, change: "+12%", trend: 'up' },
    { title: "Highest Score", value: "89%", icon: <FiAward size={20} />, change: "+5%", trend: 'up' },
    { title: "Avg. Duration", value: "18m", icon: <FiClock size={20} />, change: "-2m", trend: 'down' },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className='mt-28'>
      {/* Header Section */}
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'>
            Interview Dashboard
          </h1>
          <p className='text-gray-400'>Track and improve your interview performance</p>
        </div>
        <div className='flex items-center gap-4'>
          <button 
            onClick={handleRefresh}
            className={`p-2 rounded-full ${refreshing ? 'animate-spin' : 'hover:bg-gray-700'}`}
            disabled={refreshing}
          >
            <FiRefreshCw className={refreshing ? 'text-blue-400' : 'text-gray-400'} />
          </button>
          
        </div>
      </div>

      {/* Stats Section */}
      <div className='mb-6 border-b border-gray-700 pb-2 flex justify-between items-center'>
        <button 
          onClick={() => setShowStats(!showStats)}
          className='flex items-center gap-2 text-gray-400 hover:text-white'
        >
          <FiChevronDown className={`transition-transform ${showStats ? 'rotate-0' : '-rotate-90'}`} size={18} />
          <span>Performance Overview</span>
        </button>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={false}
        animate={{
          height: showStats ? 'auto' : 0,
          opacity: showStats ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className='overflow-hidden'
      >
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className='bg-[#13142b] p-5 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-colors'
            >
              <div className='flex justify-between'>
                <div>
                  <p className='text-gray-400 text-sm'>{stat.title}</p>
                  <p className='text-xl font-bold mt-1'>{stat.value}</p>
                  <p className={`text-xs mt-1 ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change} {stat.trend === 'up' ? '↑' : '↓'}
                  </p>
                </div>
                <div className='bg-blue-500/10 p-2 rounded-lg text-blue-400'>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Add New Interview Section */}
      <div className='mb-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <AddNewInterview />
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className='bg-[#101127] p-6 rounded-lg border border-blue-500/20 col-span-2 flex items-center justify-center'
          >
            <div className='text-center'>
              <h3 className='text-lg font-semibold mb-2'>Quick Tips</h3>
              <p className='text-sm text-gray-400'>
                Prepare for common behavioral questions and practice your responses to stand out in interviews.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Interview List Section */}
      <div className='mb-8'>
        <div className='flex justify-between items-center mb-4'>
          {/* <h2 className='text-xl font-semibold'>Your Interview Sessions</h2> */}
          {/* <div className='flex space-x-2'>
            {['recent', 'completed', 'scheduled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-sm rounded-md capitalize ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div> */}
        </div>

        <div className=''>
          <InterviewList filter={activeTab} />
        </div>
      </div>

      {/* Progress Section */}
      {/* <div className='mt-8 bg-[#111233] p-6 rounded-lg border border-blue-500/20'>
        <h3 className='text-lg font-semibold mb-4'>Your Progress</h3>
        <div className='space-y-4'>
          {[
            { skill: 'Technical Questions', progress: 78, color: 'bg-blue-500' },
            { skill: 'Behavioral Questions', progress: 65, color: 'bg-purple-500' },
            { skill: 'Problem Solving', progress: 82, color: 'bg-green-500' },
          ].map((item, index) => (
            <div key={index}>
              <div className='flex justify-between mb-1 text-sm'>
                <span>{item.skill}</span>
                <span>{item.progress}%</span>
              </div>
              <div className='w-full bg-gray-700 rounded-full h-2'>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  transition={{ delay: index * 0.2 }}
                  className={`${item.color} h-2 rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;