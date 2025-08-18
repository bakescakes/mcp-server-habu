import React from 'react';
import { Card, Typography, Timeline, Space, Tag, Empty } from 'antd';
import { Calendar, CheckCircle, PlayCircle, Clock, Activity } from 'lucide-react';

const { Title, Text } = Typography;

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

interface RecentActivityProps {
  data: StatusData;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ data }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completion':
        return <CheckCircle size={16} style={{ color: '#52c41a' }} />;
      case 'progress':
        return <PlayCircle size={16} style={{ color: '#1890ff' }} />;
      case 'start':
        return <Activity size={16} style={{ color: '#722ed1' }} />;
      default:
        return <Clock size={16} style={{ color: '#faad14' }} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'completion':
        return 'success';
      case 'progress':
        return 'processing';
      case 'start':
        return 'purple';
      default:
        return 'warning';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Less than an hour ago';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ marginBottom: '16px' }}>
          <Space>
            <Calendar size={24} />
            Recent Activity
          </Space>
        </Title>
        <Text type="secondary">
          Latest updates and progress on the MCP server development
        </Text>
      </div>

      {/* Activity Timeline */}
      <Card>
        {data.recent_activity && data.recent_activity.length > 0 ? (
          <Timeline
            items={data.recent_activity.map((activity, index) => ({
              dot: getActivityIcon(activity.type),
              children: (
                <div key={index} style={{ paddingBottom: '16px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <Text style={{ fontSize: '16px', fontWeight: 500 }}>
                      {activity.description}
                    </Text>
                    <Tag color={getActivityColor(activity.type)}>
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </Tag>
                  </div>
                  <Space size="middle" style={{ flexWrap: 'wrap' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      📅 {new Date(activity.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      🕐 {getTimeAgo(activity.date)}
                    </Text>
                  </Space>
                </div>
              ),
            }))}
          />
        ) : (
          <Empty
            image={<Activity size={64} style={{ color: '#8c8c8c' }} />}
            description={
              <div>
                <Title level={4} type="secondary">No Recent Activity</Title>
                <Text type="secondary">
                  Check back later for updates on the MCP server development progress.
                </Text>
              </div>
            }
          />
        )}
      </Card>

      {/* Activity Summary */}
      {data.recent_activity && data.recent_activity.length > 0 && (
        <Card title="Activity Summary" style={{ marginTop: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {/* Activity by Type */}
            <div style={{ 
              padding: '16px', 
              background: 'linear-gradient(135deg, #1a1f29 0%, #2a2f3a 100%)', 
              borderRadius: '8px' 
            }}>
              <Title level={5} style={{ margin: '0 0 12px 0' }}>By Type</Title>
              {Array.from(new Set(data.recent_activity.map(a => a.type))).map(type => {
                const count = data.recent_activity.filter(a => a.type === type).length;
                return (
                  <div key={type} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px' 
                  }}>
                    <Space size="small">
                      {getActivityIcon(type)}
                      <Text>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                    </Space>
                    <Text strong>{count}</Text>
                  </div>
                );
              })}
            </div>

            {/* Recent Dates */}
            <div style={{ 
              padding: '16px', 
              background: 'linear-gradient(135deg, #1a1f29 0%, #2a2f3a 100%)', 
              borderRadius: '8px' 
            }}>
              <Title level={5} style={{ margin: '0 0 12px 0' }}>Latest Updates</Title>
              <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
                Last activity: {getTimeAgo(data.recent_activity[0]?.date)}
              </div>
              <div style={{ fontSize: '14px', color: '#8c8c8c', marginTop: '4px' }}>
                Total activities: {data.recent_activity.length}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RecentActivity;