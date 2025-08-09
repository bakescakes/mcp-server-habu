import React, { useState } from 'react';
import { Card, Row, Col, Typography, Tag, Input, Select, Badge, Progress, Space } from 'antd';
import { Search, Settings, CheckCircle, PlayCircle, Clock } from 'lucide-react';

const { Title, Text } = Typography;
const { Option } = Select;

interface StatusData {
  _meta: {
    generated_at: string;
    generated_from: string;
    generator_version: string;
  };
  lastUpdated: string;
  project: {
    name: string;
    description: string;
    repository: string;
  };
  implementation: {
    totalTools: number;
    completedTools: number;
    inProgressTools: number;
    plannedTools: number;
  };
  categories: Record<string, {
    tools: number;
    completed: number;
    in_progress: number;
  }>;
  recent_activity: Array<{
    date: string;
    type: string;
    description: string;
  }>;
}

interface ToolsExplorerProps {
  data: StatusData;
}

const ToolsExplorer: React.FC<ToolsExplorerProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'data_management':
        return '📊';
      case 'analysis':
        return '🔍';
      case 'integration':
        return '🔗';
      case 'utilities':
        return '⚙️';
      default:
        return '🛠️';
    }
  };

  const getStatusColor = (completed: number, total: number) => {
    const rate = (completed / total) * 100;
    if (rate >= 80) return '#52c41a';
    if (rate >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const getStatusIcon = (completed: number, inProgress: number, total: number) => {
    if (completed === total) return <CheckCircle size={16} style={{ color: '#52c41a' }} />;
    if (inProgress > 0) return <PlayCircle size={16} style={{ color: '#faad14' }} />;
    return <Clock size={16} style={{ color: '#8c8c8c' }} />;
  };

  const filteredCategories = Object.entries(data.categories).filter(([category]) => {
    if (selectedCategory !== 'all' && category !== selectedCategory) return false;
    if (searchTerm && !category.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ marginBottom: '16px' }}>
          <Space>
            <Settings size={24} />
            Tools Explorer
          </Space>
        </Title>
        <Text type="secondary">
          Explore and manage the {data.implementation.totalTools} tools across {Object.keys(data.categories).length} categories
        </Text>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12}>
            <Input
              prefix={<Search size={16} />}
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filter by category"
              value={selectedCategory}
              onChange={setSelectedCategory}
            >
              <Option value="all">All Categories</Option>
              {Object.keys(data.categories).map(category => (
                <Option key={category} value={category}>
                  {getCategoryIcon(category)} {category.replace('_', ' ').toUpperCase()}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Category Cards */}
      <Row gutter={[24, 24]}>
        {filteredCategories.map(([category, stats]) => {
          const completionRate = Math.round((stats.completed / stats.tools) * 100);
          
          return (
            <Col xs={24} sm={12} lg={8} xl={6} key={category}>
              <Card 
                hoverable
                style={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #1a1f29 0%, #2a2f3a 100%)'
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                    {getCategoryIcon(category)}
                  </div>
                  <Title level={4} style={{ margin: 0, marginBottom: '4px' }}>
                    {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Title>
                  <Text type="secondary">
                    {stats.tools} tool{stats.tools !== 1 ? 's' : ''}
                  </Text>
                </div>

                {/* Progress */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text>Progress</Text>
                    <Text strong>{completionRate}%</Text>
                  </div>
                  <Progress 
                    percent={completionRate}
                    strokeColor={getStatusColor(stats.completed, stats.tools)}
                    trailColor="#2a2f3a"
                    strokeWidth={6}
                    showInfo={false}
                  />
                </div>

                {/* Status Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size="small">
                      <CheckCircle size={14} style={{ color: '#52c41a' }} />
                      <Text>Completed</Text>
                    </Space>
                    <Badge count={stats.completed} showZero style={{ backgroundColor: '#52c41a' }} />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size="small">
                      <PlayCircle size={14} style={{ color: '#faad14' }} />
                      <Text>In Progress</Text>
                    </Space>
                    <Badge count={stats.in_progress} showZero style={{ backgroundColor: '#faad14' }} />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size="small">
                      <Clock size={14} style={{ color: '#8c8c8c' }} />
                      <Text>Remaining</Text>
                    </Space>
                    <Badge 
                      count={stats.tools - stats.completed - stats.in_progress} 
                      showZero 
                      style={{ backgroundColor: '#8c8c8c' }} 
                    />
                  </div>
                </div>

                {/* Category Status */}
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <Tag 
                    color={completionRate === 100 ? 'success' : completionRate >= 50 ? 'warning' : 'error'}
                    style={{ borderRadius: '12px' }}
                  >
                    {getStatusIcon(stats.completed, stats.in_progress, stats.tools)}
                    <span style={{ marginLeft: '4px' }}>
                      {completionRate === 100 ? 'Complete' : 
                       stats.in_progress > 0 ? 'Active' : 'Pending'}
                    </span>
                  </Tag>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {filteredCategories.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '48px',
          background: '#1a1f29',
          borderRadius: '12px',
          marginTop: '24px'
        }}>
          <Settings size={48} style={{ color: '#8c8c8c', marginBottom: '16px' }} />
          <Title level={4} type="secondary">No categories found</Title>
          <Text type="secondary">Try adjusting your search or filter criteria</Text>
        </div>
      )}
    </div>
  );
};

export default ToolsExplorer;