import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, ConfigProvider, theme, Space, Badge, Spin } from 'antd';
import { 
  RocketIcon, 
  Settings, 
  BarChart3, 
  Clock,
  Activity,
  Wrench
} from 'lucide-react';
import axios from 'axios';
import ProjectOverview from './components/ProjectOverview';
import ToolsExplorer from './components/ToolsExplorer';
import Analytics from './components/Analytics';
import RecentActivity from './components/RecentActivity';
import SystemStatus from './components/SystemStatus';

const { Header, Sider, Content } = Layout;
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

const App: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mcp-server-habu-production.up.railway.app';

  const fetchStatusData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/status`);
      setStatusData(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch status data:', err);
      setError('Failed to fetch data from API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusData();
    const interval = setInterval(fetchStatusData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const navigationItems = [
    {
      key: 'overview',
      label: 'Project Overview',
      icon: <RocketIcon size={16} />,
    },
    {
      key: 'tools',
      label: 'Tools Explorer',
      icon: <Settings size={16} />,
    },
    {
      key: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 size={16} />,
    },
    {
      key: 'activity',
      label: 'Recent Activity',
      icon: <Clock size={16} />,
    },
    {
      key: 'system',
      label: 'System Status',
      icon: <Activity size={16} />,
    },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <Spin size="large" />
          <Typography.Text type="secondary">Loading MCP Server data...</Typography.Text>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ 
          textAlign: 'center', 
          padding: '48px',
          background: '#1a1f29',
          borderRadius: '12px',
          border: '1px solid #ff4d4f',
          margin: '24px'
        }}>
          <Typography.Title level={4} style={{ color: '#ff4d4f', marginBottom: '16px' }}>
            ⚠️ Connection Error
          </Typography.Title>
          <Typography.Text type="secondary">
            {error}
          </Typography.Text>
        </div>
      );
    }

    if (!statusData) return null;

    switch (selectedKey) {
      case 'overview':
        return <ProjectOverview data={statusData} />;
      case 'tools':
        return <ToolsExplorer data={statusData} />;
      case 'analytics':
        return <Analytics data={statusData} />;
      case 'activity':
        return <RecentActivity data={statusData} />;
      case 'system':
        return <SystemStatus data={statusData} />;
      default:
        return <ProjectOverview data={statusData} />;
    }
  };

  const currentNav = navigationItems.find(item => item.key === selectedKey);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgBase: '#0f1419',
          colorBgContainer: '#1a1f29',
          colorBgElevated: '#1a1f29',
          colorBgLayout: '#0f1419',
          colorBorder: '#2a2f3a',
          colorBorderSecondary: '#2a2f3a',
          colorText: '#e6e6e6',
          colorTextBase: '#e6e6e6',
          colorTextSecondary: '#b3b3b3',
          colorTextTertiary: '#8c8c8c',
          colorTextQuaternary: '#666666',
          colorPrimary: '#1890ff',
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#ff4d4f',
          colorBgMask: 'rgba(0, 0, 0, 0.95)',
          colorWhite: '#1a1f29',
        },
        components: {
          Layout: {
            colorBgBody: '#0f1419',
            colorBgHeader: '#1a1f29',
            colorBgTrigger: '#1a1f29',
          },
          Card: {
            colorBgContainer: '#1a1f29',
            colorBorderSecondary: 'transparent',
            boxShadowTertiary: '0 4px 12px rgba(0, 0, 0, 0.4)',
            borderRadiusLG: 12,
          },
          Menu: {
            colorBgContainer: '#1a1f29',
            colorItemBg: 'transparent',
            colorItemBgSelected: '#1890ff20',
            colorItemBgHover: '#ffffff10',
            colorItemText: '#b3b3b3',
            colorItemTextSelected: '#1890ff',
            colorItemTextHover: '#e6e6e6',
          },
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider 
          collapsible 
          collapsed={collapsed} 
          onCollapse={setCollapsed}
          width={280}
          style={{ 
            background: '#1a1f29',
            boxShadow: '2px 0 6px rgba(0,0,0,.35)'
          }}
        >
          <div style={{ 
            padding: '24px 16px', 
            borderBottom: '1px solid #1f2937',
            textAlign: 'center'
          }}>
            {!collapsed && (
              <>
                <div style={{ marginBottom: '8px' }}>
                  <Wrench size={32} style={{ color: '#1890ff' }} />
                </div>
                <Title level={4} style={{ margin: 0, color: '#e6e6e6' }}>
                  MCP Server
                </Title>
                <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                  Habu Dashboard
                </Typography.Text>
              </>
            )}
          </div>
          
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={({ key }) => setSelectedKey(key)}
            items={navigationItems}
            style={{ background: 'transparent', border: 'none' }}
          />
        </Sider>
        
        <Layout>
          <Header style={{ 
            background: '#1a1f29',
            borderBottom: '1px solid #2a2f3a',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Space align="center">
              <Title level={3} style={{ margin: 0, color: '#e6e6e6' }}>
                {currentNav?.label}
              </Title>
            </Space>
            
            <Space align="center">
              {statusData && (
                <Badge 
                  color={loading ? 'processing' : error ? 'error' : 'success'}
                  text={
                    <span style={{ color: '#b3b3b3' }}>
                      {loading ? 'Refreshing...' : error ? 'Offline' : 'Live Data'}
                    </span>
                  }
                />
              )}
              <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                Last update: {statusData ? new Date(statusData.lastUpdated).toLocaleTimeString() : '--:--'}
              </Typography.Text>
            </Space>
          </Header>
          
          <Content style={{ 
            margin: '24px',
            background: '#0f1419',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
