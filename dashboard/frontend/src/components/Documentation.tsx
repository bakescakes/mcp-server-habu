import React from 'react';
import type { UseStatusResult } from '../types/status';

interface DocumentationProps {
  statusResult: UseStatusResult;
}

const Documentation: React.FC<DocumentationProps> = ({ statusResult }) => {
  const { data, loading } = statusResult;

  const documentationLinks = [
    {
      name: 'STATUS.json',
      description: 'Main dashboard data (auto-generated)',
      url: 'https://github.com/bakescakes/mcp-server-habu/blob/main/STATUS.json',
      icon: '📊',
      category: 'Primary Data'
    },
    {
      name: 'CURRENT_STATUS.md',
      description: 'Source of truth (human-readable)',
      url: 'https://github.com/bakescakes/mcp-server-habu/blob/main/CURRENT_STATUS.md',
      icon: '📝',
      category: 'Primary Data'
    },
    {
      name: 'README.md',
      description: 'Project overview and setup guide',
      url: 'https://github.com/bakescakes/mcp-server-habu/blob/main/README.md',
      icon: '📖',
      category: 'Documentation'
    },
    {
      name: 'MCP_TOOLS_REFERENCE.md',
      description: 'Complete listing of all 45 MCP tools',
      url: 'https://github.com/bakescakes/mcp-server-habu/blob/main/MCP_TOOLS_REFERENCE.md',
      icon: '🛠️',
      category: 'Documentation'
    },
    {
      name: 'MCP_TOOLS_REFERENCE_DETAILED.md',
      description: 'Detailed technical documentation for tools',
      url: 'https://github.com/bakescakes/mcp-server-habu/blob/main/MCP_TOOLS_REFERENCE_DETAILED.md',
      icon: '🔧',
      category: 'Documentation'
    },
    {
      name: 'DEVELOPMENT_GUIDE.md',
      description: 'Development workflows and setup procedures',
      url: 'https://github.com/bakescakes/mcp-server-habu/blob/main/DEVELOPMENT_GUIDE.md',
      icon: '⚡',
      category: 'Documentation'
    },
    {
      name: 'API_COVERAGE_ANALYSIS.md',
      description: 'Technical achievements and API coverage details',
      url: 'https://github.com/bakescakes/mcp-server-habu/blob/main/API_COVERAGE_ANALYSIS.md',
      icon: '📈',
      category: 'Analysis'
    },
    {
      name: 'DOCS_OVERHAUL_PROJECT.md',
      description: 'Documentation transformation story',
      url: 'https://github.com/bakescakes/mcp-server-habu/blob/main/DOCS_OVERHAUL_PROJECT.md',
      icon: '🔄',
      category: 'Historical'
    }
  ];

  const categories = Array.from(new Set(documentationLinks.map(link => link.category)));

  if (loading && !data) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
        <p className="text-gray-600 mt-1">
          Access GitHub repository files and project documentation
        </p>
      </div>

      {/* Repository Info */}
      {data && (
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">bakescakes/mcp-server-habu</h2>
              <p className="text-primary-100">
                Production-ready MCP server with {data.tools.total} tools • {data.project.status}
              </p>
            </div>
            <div className="ml-auto">
              <a
                href="https://github.com/bakescakes/mcp-server-habu"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                View Repository
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Documentation by Category */}
      {categories.map(category => (
        <div key={category} className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{category}</h3>
          <div className="space-y-3">
            {documentationLinks
              .filter(link => link.category === category)
              .map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                >
                  <div className="flex-shrink-0 text-2xl">{link.icon}</div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-900 group-hover:text-primary-700">
                      {link.name}
                    </h4>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              ))}
          </div>
        </div>
      ))}

      {/* Quick Actions */}
      <div className="card bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => window.open('https://github.com/bakescakes/mcp-server-habu/issues', '_blank')}
            className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
          >
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-gray-600 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 group-hover:text-primary-700">Report Issues</div>
              <div className="text-sm text-gray-600">Submit bugs or feature requests</div>
            </div>
          </button>

          <button
            onClick={() => window.open('https://github.com/bakescakes/mcp-server-habu/pulls', '_blank')}
            className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
          >
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-gray-600 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900 group-hover:text-primary-700">Pull Requests</div>
              <div className="text-sm text-gray-600">View contributions and changes</div>
            </div>
          </button>
        </div>
      </div>

      {/* Data Source Information */}
      {data?._meta && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">About This Dashboard</h4>
              <p className="text-sm text-blue-800 mb-3">
                This dashboard consumes real-time data from the GitHub repository's STATUS.json file, 
                which is automatically generated from CURRENT_STATUS.md using automated workflows.
              </p>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Data Source:</strong> {data._meta.generated_from}</p>
                <p><strong>Last Generated:</strong> {new Date(data._meta.generated_at).toLocaleString()}</p>
                <p><strong>Auto-refresh:</strong> Every 30 seconds</p>
                <p><strong>Note:</strong> {data._meta.note}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documentation;