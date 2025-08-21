import React from 'react';
import type { UseStatusResult } from '../types/status';

interface ProgressTrackingProps {
  statusResult: UseStatusResult;
}

const ProgressTracking: React.FC<ProgressTrackingProps> = ({ statusResult }) => {
  const { data, loading } = statusResult;

  if (loading && !data) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No progress data available</p>
      </div>
    );
  }

  const progressPercentage = parseInt(data.tools.testingProgress.replace('%', ''));
  const successRate = parseInt(data.tools.successRate.replace('%', ''));
  const remainingTools = data.tools.total - data.tools.tested;

  // Mock milestone data for demonstration
  const milestones = [
    { name: 'Initial Setup', completed: true, date: '2025-01-15' },
    { name: 'Core API Tools', completed: true, date: '2025-01-20' },
    { name: 'Authentication System', completed: true, date: '2025-01-22' },
    { name: 'Tool Validation (27%)', completed: false, current: true, date: '2025-01-28' },
    { name: 'Advanced Features', completed: false, date: 'TBD' },
    { name: 'Production Release', completed: false, date: 'TBD' },
  ];

  const recentActivities = [
    { date: '2025-01-28', activity: 'Documentation overhaul complete', type: 'achievement' },
    { date: '2025-01-28', activity: 'STATUS.json automation implemented', type: 'achievement' },
    { date: '2025-01-27', activity: 'Testing validation expanded', type: 'progress' },
    { date: '2025-01-26', activity: 'API coverage analysis completed', type: 'milestone' },
    { date: '2025-01-25', activity: 'Production cleanroom environment setup', type: 'infrastructure' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Testing Progress</h1>
        <p className="text-gray-600 mt-1">
          Track the validation progress of all {data.tools.total} MCP tools
        </p>
      </div>

      {/* Overall Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Overall Testing Progress</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Tools Tested</span>
                <span className="text-sm text-gray-500">{data.tools.tested} of {data.tools.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-primary-600 h-3 rounded-full transition-all duration-500 relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white bg-opacity-30 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="text-center mt-2">
                <span className="text-2xl font-bold text-primary-600">{data.tools.testingProgress}</span>
                <span className="text-sm text-gray-500 ml-2">Complete</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Success Rate</span>
                <span className="text-sm text-gray-500">{data.tools.successRate}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-success-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${successRate}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600">{data.tools.tested}</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{remainingTools}</div>
                <div className="text-xs text-gray-500">Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{data.tools.total}</div>
                <div className="text-xs text-gray-500">Total Tools</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Current Focus</h3>
          <div className="space-y-4">
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-primary-800">Next Tool</span>
              </div>
              <p className="text-sm text-primary-700">{data.testing.nextTool}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Environment</h4>
              <p className="text-sm text-gray-600">{data.testing.environment}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Methodology</h4>
              <p className="text-sm text-gray-600">{data.testing.methodology}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Milestones */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Project Milestones</h3>
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 ${
                milestone.completed 
                  ? 'bg-success-500 border-success-500' 
                  : milestone.current
                  ? 'bg-primary-500 border-primary-500 animate-pulse'
                  : 'border-gray-300'
              }`}>
                {milestone.completed && (
                  <svg className="w-3 h-3 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${
                    milestone.completed ? 'text-gray-700' : 
                    milestone.current ? 'text-primary-700' : 'text-gray-500'
                  }`}>
                    {milestone.name}
                  </span>
                  <span className="text-sm text-gray-500">{milestone.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {data.recentAchievements.map((achievement, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-success-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-700">{achievement}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(data._meta.generated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'achievement' ? 'bg-success-500' :
                  activity.type === 'milestone' ? 'bg-primary-500' :
                  activity.type === 'progress' ? 'bg-warning-500' :
                  'bg-gray-400'
                }`}></div>
                <div>
                  <p className="text-sm text-gray-700">{activity.activity}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="card bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{data.tools.successRate}</div>
            <div className="text-sm text-gray-500">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">99%</div>
            <div className="text-sm text-gray-500">API Coverage</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-500">Failed Tests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Math.ceil(remainingTools / 2)}
            </div>
            <div className="text-sm text-gray-500">Est. Days Left</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;