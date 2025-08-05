import React, { type ReactNode } from 'react';
import type { UseStatusResult } from '../types/status';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: 'dashboard' | 'tools' | 'progress' | 'docs') => void;
  statusResult: UseStatusResult;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, statusResult }) => {
  const { data, error, loading, lastFetch } = statusResult;

  const getConnectionStatus = () => {
    if (loading && !data) return { status: 'connecting', color: 'text-yellow-600 bg-yellow-50' };
    if (error) return { status: 'error', color: 'text-red-600 bg-red-50' };
    if (data) return { status: 'connected', color: 'text-green-600 bg-green-50' };
    return { status: 'unknown', color: 'text-gray-600 bg-gray-50' };
  };

  const connectionStatus = getConnectionStatus();
  
  const formatLastUpdate = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const tabs = [
    { id: 'dashboard', label: '🚀 Project Overview', description: 'Main dashboard' },
    { id: 'tools', label: '🛠️ Tools Explorer', description: '45 tools grid' },
    { id: 'progress', label: '📊 Testing Progress', description: 'Progress tracking' },
    { id: 'docs', label: '📚 Documentation', description: 'GitHub links' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">
                  Habu MCP Server Dashboard
                </h1>
                <p className="text-xs text-gray-500">
                  Production-ready dashboard consuming GitHub STATUS.json
                </p>
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${connectionStatus.color}`}>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus.status === 'connected' ? 'bg-green-500' :
                    connectionStatus.status === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                    'bg-red-500'
                  }`} />
                  <span className="capitalize">{connectionStatus.status}</span>
                </div>
              </div>
              
              {lastFetch && (
                <div className="text-xs text-gray-500">
                  Updated {formatLastUpdate(lastFetch)}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <span>{tab.label}</span>
                  <span className="text-xs opacity-75">{tab.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Global Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <span className="font-medium">Connection Error:</span> {error.message}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Unable to fetch STATUS.json from GitHub. Check API server and GitHub repository access.
                </p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() => statusResult.refetch()}
                  className="text-red-700 hover:text-red-900 text-sm font-medium underline"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <p>Real-time data from <strong>bakescakes/mcp-server-habu</strong> GitHub repository</p>
              <p className="text-xs mt-1">Auto-refresh every 30 seconds • Production-ready architecture</p>
            </div>
            
            {data?._api && (
              <div className="text-xs text-gray-400">
                <p>Source: {data._api.source}</p>
                <p>Fetched: {new Date(data._api.fetchedAt).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;