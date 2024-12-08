import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faSpinner } from '@fortawesome/free-solid-svg-icons';
import * as Icons from '@fortawesome/free-solid-svg-icons';

interface GradioApp {
  id: string;
  name: string;
  status: string;
  url?: string;
  icon: string;
}

export default function GradioDashboard() {
  const [apps, setApps] = useState<GradioApp[]>([]);
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});

  const fetchApps = async () => {
    try {
      const response = await fetch('/api/gradio/apps');
      const data = await response.json();
      setApps(data);
    } catch (error) {
      console.error('Failed to fetch apps:', error);
    }
  };

  useEffect(() => {
    fetchApps();
    const interval = setInterval(fetchApps, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (appId: string, action: 'start' | 'stop') => {
    setLoading(prev => ({ ...prev, [appId]: true }));
    try {
      await fetch(`/api/gradio/apps/${appId}/${action}`, { method: 'POST' });
      await fetchApps();
    } catch (error) {
      console.error(`Failed to ${action} app:`, error);
    }
    setLoading(prev => ({ ...prev, [appId]: false }));
  };

  const getIcon = (iconName: string) => {
    return Icons[iconName as keyof typeof Icons] || Icons.faRobot;
  };

  return (
    <Layout title="Gradio Apps">
      <div className="uk-container uk-container-expand" style={{ padding: '20px' }}>
        <h2 className="uk-heading-small" style={{ color: '#fff', marginBottom: '30px' }}>
          Gradio Applications
        </h2>
        
        <div className="uk-grid uk-grid-match uk-child-width-1-3@m" uk-grid>
          {apps.map(app => (
            <div key={app.id}>
              <div className="uk-card uk-card-default uk-card-body" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
                <h3 className="uk-card-title">
                  <FontAwesomeIcon icon={getIcon(app.icon)} className="uk-margin-small-right" />
                  {app.name}
                </h3>
                
                <div className="uk-flex uk-flex-middle">
                  <span className={`uk-badge ${
                    app.status === 'running' ? 'uk-background-success' : 
                    app.status === 'stopped' ? 'uk-background-danger' : 
                    'uk-background-warning'
                  }`}>
                    {app.status}
                  </span>
                  
                  <div className="uk-margin-left">
                    {loading[app.id] ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : app.status === 'running' ? (
                      <>
                        <button 
                          className="uk-button uk-button-danger uk-button-small"
                          onClick={() => handleAction(app.id, 'stop')}
                        >
                          <FontAwesomeIcon icon={faStop} /> Stop
                        </button>
                        <a 
                          href={app.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="uk-button uk-button-primary uk-button-small uk-margin-small-left"
                        >
                          Open
                        </a>
                      </>
                    ) : (
                      <button 
                        className="uk-button uk-button-primary uk-button-small"
                        onClick={() => handleAction(app.id, 'start')}
                      >
                        <FontAwesomeIcon icon={faPlay} /> Start
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
