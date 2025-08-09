import React from 'react';
import { Card, Row, Col, Typography, Statistic, Progress } from 'antd';
import { BarChart3, PieChart, TrendingUp, Target } from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const { Title } = Typography;

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

interface AnalyticsProps {
  data: StatusData;
}

const Analytics: React.FC<AnalyticsProps> = ({ data }) => {
  // Prepare data for charts
  const categoryData = Object.entries(data.categories).map(([name, stats]) => ({
    name: name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    completed: stats.completed,
    in_progress: stats.in_progress,
    remaining: stats.tools - stats.completed - stats.in_progress,
    total: stats.tools,
    completion_rate: Math.round((stats.completed / stats.tools) * 100)
  }));

  const statusData = [
    { name: 'Completed', value: data.implementation.completedTools, color: '#52c41a' },
    { name: 'In Progress', value: data.implementation.inProgressTools, color: '#faad14' },
    { name: 'Planned', value: data.implementation.plannedTools, color: '#8c8c8c' }
  ];

  const COLORS = ['#52c41a', '#faad14', '#8c8c8c'];

  const completionRate = Math.round((data.implementation.completedTools / data.implementation.totalTools) * 100);
  
  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ marginBottom: '16px' }}>
          📊 Analytics Dashboard
        </Title>
      </div>

      {/* Key Performance Indicators */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completion Rate"
              value={completionRate}
              suffix="%"
              valueStyle={{ color: completionRate >= 80 ? '#52c41a' : completionRate >= 60 ? '#faad14' : '#ff4d4f' }}
              prefix={<Target size={20} />}
            />
            <Progress 
              percent={completionRate} 
              showInfo={false} 
              strokeColor={completionRate >= 80 ? '#52c41a' : completionRate >= 60 ? '#faad14' : '#ff4d4f'}
              trailColor="#2a2f3a"
              size="small"
              style={{ marginTop: '8px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average per Category"
              value={Math.round(data.implementation.totalTools / Object.keys(data.categories).length)}
              valueStyle={{ color: '#1890ff' }}
              prefix={<BarChart3 size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Categories"
              value={Object.keys(data.categories).length}
              valueStyle={{ color: '#722ed1' }}
              prefix={<PieChart size={20} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Progress Velocity"
              value={Math.round((data.implementation.completedTools / (data.implementation.completedTools + data.implementation.inProgressTools)) * 100)}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
              prefix={<TrendingUp size={20} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[24, 24]}>
        {/* Status Distribution Pie Chart */}
        <Col xs={24} lg={12}>
          <Card title="Implementation Status Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <defs>
                  <style>
                    {`
                      .recharts-text {
                        fill: #e6e6e6 !important;
                      }
                      .recharts-legend-item-text {
                        color: #e6e6e6 !important;
                      }
                    `}
                  </style>
                </defs>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1f29', 
                    border: '1px solid #2a2f3a',
                    borderRadius: '6px',
                    color: '#e6e6e6'
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: '#e6e6e6' }}
                />
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </RechartsPieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '16px' }}>
              {statusData.map((item, index) => (
                <div key={item.name} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: index < statusData.length - 1 ? '1px solid #2a2f3a' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: item.color,
                      borderRadius: '2px'
                    }} />
                    <span>{item.name}</span>
                  </div>
                  <span style={{ fontWeight: 'bold' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Category Progress Bar Chart */}
        <Col xs={24} lg={12}>
          <Card title="Progress by Category">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={categoryData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <style>
                    {`
                      .recharts-text {
                        fill: #e6e6e6 !important;
                      }
                      .recharts-cartesian-axis-tick-value {
                        fill: #e6e6e6 !important;
                      }
                    `}
                  </style>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2f3a" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#e6e6e6', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: '#e6e6e6' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1f29', 
                    border: '1px solid #2a2f3a',
                    borderRadius: '6px',
                    color: '#e6e6e6'
                  }}
                />
                <Legend wrapperStyle={{ color: '#e6e6e6' }} />
                <Bar dataKey="completed" fill="#52c41a" name="Completed" />
                <Bar dataKey="in_progress" fill="#faad14" name="In Progress" />
                <Bar dataKey="remaining" fill="#8c8c8c" name="Remaining" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Completion Rate by Category */}
        <Col xs={24}>
          <Card title="Completion Rate by Category">
            <Row gutter={[16, 16]}>
              {categoryData.map((category) => (
                <Col xs={24} sm={12} md={6} key={category.name}>
                  <div style={{ 
                    padding: '16px',
                    background: 'linear-gradient(135deg, #1a1f29 0%, #2a2f3a 100%)',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <Title level={5} style={{ margin: '0 0 8px 0' }}>
                      {category.name}
                    </Title>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                      {category.completion_rate}%
                    </div>
                    <Progress 
                      percent={category.completion_rate}
                      showInfo={false}
                      strokeColor={category.completion_rate >= 80 ? '#52c41a' : category.completion_rate >= 60 ? '#faad14' : '#ff4d4f'}
                      trailColor="#2a2f3a"
                      size="small"
                    />
                    <div style={{ fontSize: '12px', marginTop: '4px', color: '#8c8c8c' }}>
                      {category.completed}/{category.total} tools
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;