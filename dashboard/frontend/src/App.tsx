import { useState } from 'react';
import { useStatus } from './hooks/useStatus';
import Dashboard from './components/Dashboard';
import ToolsExplorer from './components/ToolsExplorer';
import ProgressTracking from './components/ProgressTracking';
import Documentation from './components/Documentation';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

type ActiveTab = 'dashboard' | 'tools' | 'progress' | 'docs';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const statusResult = useStatus();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard statusResult={statusResult} />;
      case 'tools':
        return <ToolsExplorer statusResult={statusResult} />;
      case 'progress':
        return <ProgressTracking statusResult={statusResult} />;
      case 'docs':
        return <Documentation statusResult={statusResult} />;
      default:
        return <Dashboard statusResult={statusResult} />;
    }
  };

  return (
    <ErrorBoundary>
      <Layout 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        statusResult={statusResult}
      >
        {renderContent()}
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
