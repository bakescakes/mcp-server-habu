import React from 'react';
import type { UseStatusResult } from '../types/status';

interface DashboardProps {
  statusResult: UseStatusResult;
}

const Dashboard: React.FC<DashboardProps> = ({ statusResult }) => {
  const { data, loading } = statusResult;

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No status data available</h3>
        <p className="mt-1 text-sm text-gray-500">Unable to load STATUS.json from GitHub repository.</p>
      </div>
    );
  }

  const progressPercentage = parseInt(data.tools.testingProgress.replace('%', ''));
  const successRate = parseInt(data.tools.successRate.replace('%', ''));

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">{data.project.name}</h1>
          <p className="text-primary-100 text-lg mb-4">{data.project.phase}</p>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
              {data.project.status}
            </span>
            <span className="text-primary-200 text-sm">
              Next: {data.project.nextMilestone}
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 11.172V5L8 4z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{data.tools.total}</p>
              <p className="text-sm font-medium text-gray-500">Total MCP Tools</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{data.tools.tested}</p>
              <p className="text-sm font-medium text-gray-500">Tools Tested</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{data.tools.testingProgress}</p>
              <p className="text-sm font-medium text-gray-500">Testing Progress</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{data.tools.successRate}</p>
              <p className="text-sm font-medium text-gray-500">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Testing Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Tools Tested ({data.tools.tested}/{data.tools.total})</span>
                <span>{data.tools.testingProgress}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Success Rate</span>
                <span>{data.tools.successRate}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-success-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${successRate}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                <strong>Next Tool:</strong> {data.testing.nextTool}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Environment:</strong> {data.testing.environment}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {data.recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-success-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">{achievement}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testing Methodology */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Testing Methodology</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-700">{data.testing.methodology}</p>
          <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
            <span>Verified: {data.tools.verified}</span>
            <span>Environment: {data.testing.environment}</span>
          </div>
        </div>
      </div>

      {/* Data Source Information */}
      {data._meta && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-medium text-blue-900">Data Source</h4>
          </div>
          <p className="text-sm text-blue-800">
            {data._meta.note} • Generated from: {data._meta.generated_from}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Last updated: {new Date(data._meta.generated_at).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;