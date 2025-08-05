import React, { useState } from 'react';
import type { UseStatusResult } from '../types/status';

interface ToolsExplorerProps {
  statusResult: UseStatusResult;
}

// Mock tools data based on the STATUS.json structure
// In a real implementation, this would come from the API
const generateMockTools = (totalTools: number, testedTools: number) => {
  const categories = [
    'Core API',
    'Clean Rooms', 
    'Analytics',
    'Data Connections',
    'Partner Management',
    'Advanced Features'
  ];
  
  const tools = [];
  for (let i = 1; i <= totalTools; i++) {
    const category = categories[Math.floor((i - 1) / (totalTools / categories.length))] || categories[0];
    const status = i <= testedTools ? 'verified' : 'untested';
    
    tools.push({
      id: i,
      name: `habu_tool_${i.toString().padStart(2, '0')}`,
      category,
      status,
      description: `MCP tool for ${category.toLowerCase()} operations`,
      lastTested: i <= testedTools ? '2025-01-28' : null,
    });
  }
  
  return tools;
};

const ToolsExplorer: React.FC<ToolsExplorerProps> = ({ statusResult }) => {
  const { data, loading } = statusResult;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex space-x-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
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
        <p className="text-gray-500">No tools data available</p>
      </div>
    );
  }

  const tools = generateMockTools(data.tools.total, data.tools.tested);
  const categories = ['all', ...Array.from(new Set(tools.map(t => t.category)))];
  
  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || tool.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="status-verified">✅ Verified</span>;
      case 'partial':
        return <span className="status-partial">🟡 Partial</span>;
      case 'issues':
        return <span className="status-issues">❌ Issues</span>;
      default:
        return <span className="status-untested">⚪ Untested</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tools Explorer</h1>
          <p className="text-gray-600 mt-1">
            Browse all {data.tools.total} MCP tools • {data.tools.tested} tested ({data.tools.testingProgress})
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">{data.tools.successRate}</div>
          <div className="text-sm text-gray-500">Success Rate</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="partial">Partial</option>
              <option value="issues">Issues</option>
              <option value="untested">Untested</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredTools.length} of {tools.length} tools</span>
          {(searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <div key={tool.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium text-gray-900 truncate">{tool.name}</h3>
              {getStatusBadge(tool.status)}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">{tool.category}</span>
              {tool.lastTested && (
                <span>Tested: {tool.lastTested}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tools found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="card bg-gray-50">
        <h3 className="font-medium text-gray-900 mb-3">Category Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.slice(1).map(category => {
            const categoryTools = tools.filter(t => t.category === category);
            const testedInCategory = categoryTools.filter(t => t.status === 'verified').length;
            
            return (
              <div key={category} className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {testedInCategory}/{categoryTools.length}
                </div>
                <div className="text-sm text-gray-500">{category}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ToolsExplorer;