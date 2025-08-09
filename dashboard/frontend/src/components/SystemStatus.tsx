import React from 'react';
import { Card, Row, Col, Typography, Badge, Statistic, Space, Tag, Divider } from 'antd';
import { Activity, Server, Database, GitBranch, Clock, Zap, Shield, RefreshCw } from 'lucide-react';

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

interface SystemStatusProps {
  data: StatusData;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ data }) => {
  const getUptime = () => {
    const lastUpdate = new Date(data.lastUpdated);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60));
    return diffInHours < 24 ? `${diffInHours}h` : `${Math.floor(diffInHours / 24)}d`;
  };

  const getSystemHealth = () => {
    const completionRate = (data.implementation.completedTools / data.implementation.totalTools) * 100;
    if (completionRate >= 80) return { status: 'success', text: 'Excellent' };
    if (completionRate >= 60) return { status: 'warning', text: 'Good' };
    return { status: 'error', text: 'Needs Attention' };
  };

  const health = getSystemHealth();

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ marginBottom: '16px' }}>
          <Space>
            <Activity size={24} />
            System Status
          </Space>
        </Title>
        <Text type="secondary">
          Real-time monitoring and health status of the MCP server system
        </Text>
      </div>

      {/* System Health Overview */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <Badge 
                status={health.status as any}
                style={{ fontSize: '16px' }}
              />
              <Title level={3} style={{ margin: '8px 0' }}>
                {health.text}
              </Title>
              <Text type="secondary">Overall System Health</Text>
            </div>
          </Col>
          <Col xs={24} sm={18}>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Uptime"
                  value={getUptime()}
                  prefix={<Clock size={16} />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Active Tools"
                  value={data.implementation.completedTools}
                  prefix={<Zap size={16} />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Categories"
                  value={Object.keys(data.categories).length}
                  prefix={<Database size={16} />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Completion"
                  value={Math.round((data.implementation.completedTools / data.implementation.totalTools) * 100)}
                  suffix="%"
                  prefix={<Shield size={16} />}
                  valueStyle={{ color: health.status === 'success' ? '#52c41a' : health.status === 'warning' ? '#faad14' : '#ff4d4f' }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* System Information */}
        <Col xs={24} lg={12}>
          <Card title={
            <Space>
              <Server size={18} />
              <span>System Information</span>
            </Space>
          }>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <Text type="secondary">Project Repository</Text>
                <div style={{ marginTop: '4px' }}>
                  <Tag icon={<GitBranch size={12} />} color="blue">
                    {data.project.repository}
                  </Tag>
                </div>
              </div>

              <Divider style={{ margin: '8px 0' }} />

              <div>
                <Text type="secondary">Generator Information</Text>
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Version</Text>
                    <Text strong>{data._meta.generator_version}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Generated From</Text>
                    <Text strong>{data._meta.generated_from}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Last Generated</Text>
                    <Text strong>{new Date(data._meta.generated_at).toLocaleString()}</Text>
                  </div>
                </div>
              </div>

              <Divider style={{ margin: '8px 0' }} />

              <div>
                <Text type="secondary">Data Freshness</Text>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Text>Last Updated</Text>
                    <Text strong>{new Date(data.lastUpdated).toLocaleString()}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Data Age</Text>
                    <Text strong>{getUptime()} old</Text>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Performance Metrics */}
        <Col xs={24} lg={12}>
          <Card title={
            <Space>
              <RefreshCw size={18} />
              <span>Performance Metrics</span>
            </Space>
          }>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Progress by Category */}
              {Object.entries(data.categories).map(([category, stats]) => {
                const completionRate = Math.round((stats.completed / stats.tools) * 100);
                const getStatusColor = (rate: number) => {
                  if (rate >= 80) return '#52c41a';
                  if (rate >= 60) return '#faad14';
                  return '#ff4d4f';
                };

                return (
                  <div key={category}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '8px' 
                    }}>
                      <Text style={{ textTransform: 'capitalize' }}>
                        {category.replace('_', ' ')}
                      </Text>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {stats.completed}/{stats.tools}
                        </Text>
                        <Badge 
                          count={`${completionRate}%`}
                          style={{ 
                            backgroundColor: getStatusColor(completionRate),
                            fontSize: '10px'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              <Divider style={{ margin: '16px 0' }} />

              <div>
                <Text type="secondary">System Statistics</Text>
                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ textAlign: 'center', padding: '8px', background: '#2a2f3a', borderRadius: '6px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                      {data.implementation.completedTools}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Completed</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '8px', background: '#2a2f3a', borderRadius: '6px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#faad14' }}>
                      {data.implementation.inProgressTools}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>In Progress</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '8px', background: '#2a2f3a', borderRadius: '6px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#8c8c8c' }}>
                      {data.implementation.plannedTools}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Planned</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '8px', background: '#2a2f3a', borderRadius: '6px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                      {data.implementation.totalTools}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Total Tools</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SystemStatus;