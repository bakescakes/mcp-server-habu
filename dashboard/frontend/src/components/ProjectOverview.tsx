import React from 'react';
import { Card, Row, Col, Typography, Progress, Statistic, Space, Tag, Timeline, Avatar } from 'antd';
import { CheckCircle, Clock, PlayCircle, Archive, Wrench, Target, TrendingUp, Calendar } from 'lucide-react';

const { Title, Text, Paragraph } = Typography;

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

interface ProjectOverviewProps {
  data: StatusData;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ data }) => {
  const completionRate = Math.round((data.implementation.completedTools / data.implementation.totalTools) * 100);
  
  const getStatusColor = (rate: number) => {
    if (rate >= 80) return '#52c41a';
    if (rate >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completion':
        return <CheckCircle size={16} style={{ color: '#52c41a' }} />;
      case 'progress':
        return <PlayCircle size={16} style={{ color: '#1890ff' }} />;
      default:
        return <Clock size={16} style={{ color: '#faad14' }} />;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '32px' }}>
        <Space align="start" size="large">
          <Avatar 
            size={64} 
            style={{ backgroundColor: '#1890ff' }}
            icon={<Wrench size={32} />}
          />
          <div>
            <Title level={1} style={{ margin: 0, marginBottom: '8px' }}>
              {data.project.name}
            </Title>
            <Paragraph style={{ fontSize: '16px', margin: 0, marginBottom: '8px' }}>
              {data.project.description}
            </Paragraph>
            <Space>
              <Tag color="blue">
                Repository: {data.project.repository}
              </Tag>
              <Tag color="green">
                {completionRate}% Complete
              </Tag>
            </Space>
          </div>
        </Space>
      </div>

      {/* Key Metrics */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Tools"
              value={data.implementation.totalTools}
              prefix={<Archive style={{ color: '#1890ff' }} size={20} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completed"
              value={data.implementation.completedTools}
              prefix={<CheckCircle style={{ color: '#52c41a' }} size={20} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="In Progress"
              value={data.implementation.inProgressTools}
              prefix={<PlayCircle style={{ color: '#faad14' }} size={20} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Planned"
              value={data.implementation.plannedTools}
              prefix={<Target style={{ color: '#8c8c8c' }} size={20} />}
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Progress and Activity */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card title={
            <Space>
              <TrendingUp size={18} />
              <span>Implementation Progress</span>
            </Space>
          }>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text>Overall Completion</Text>
                <Text strong>{completionRate}%</Text>
              </div>
              <Progress 
                percent={completionRate} 
                strokeColor={getStatusColor(completionRate)}
                trailColor="#2a2f3a"
                strokeWidth={8}
              />
            </div>

            {/* Category Breakdown */}
            <Title level={5} style={{ marginTop: '32px', marginBottom: '16px' }}>
              Category Progress
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(data.categories).map(([category, stats]) => {
                const categoryRate = Math.round((stats.completed / stats.tools) * 100);
                return (
                  <div key={category}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '4px' 
                    }}>
                      <Text style={{ textTransform: 'capitalize' }}>
                        {category.replace('_', ' ')}
                      </Text>
                      <Text type="secondary">
                        {stats.completed}/{stats.tools} ({categoryRate}%)
                      </Text>
                    </div>
                    <Progress 
                      percent={categoryRate} 
                      size="small"
                      strokeColor={getStatusColor(categoryRate)}
                      trailColor="#2a2f3a"
                      showInfo={false}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title={
            <Space>
              <Calendar size={18} />
              <span>Recent Activity</span>
            </Space>
          }>
            <Timeline
              items={data.recent_activity.map((activity, index) => ({
                dot: getActivityIcon(activity.type),
                children: (
                  <div key={index}>
                    <div style={{ marginBottom: '4px' }}>
                      <Text>{activity.description}</Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {new Date(activity.date).toLocaleDateString()}
                    </Text>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProjectOverview;