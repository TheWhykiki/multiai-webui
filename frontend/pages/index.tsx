import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import { ButtonProps } from '../types';
import { faImage, faRobot, faCog, faServer, faDatabase, faCode, faCloud, faMagic, faVideo } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [buttons, setButtons] = useState<ButtonProps[]>([]);

  useEffect(() => {
    const buttonData: ButtonProps[] = [
      { 
        id: '1', 
        label: 'Image Generation', 
        link: '/image', 
        icon: faImage 
      },
      { 
        id: '2', 
        label: 'Video Generation', 
        link: '/video', 
        icon: faVideo 
      },
      { 
        id: '3', 
        label: 'Gradio Apps', 
        link: '/gradio', 
        icon: faRobot 
      },
      { 
        id: '4', 
        label: 'AI Models', 
        link: '/models', 
        icon: faRobot 
      },
      { 
        id: '5', 
        label: 'Settings', 
        link: '/settings', 
        icon: faCog 
      },
      { 
        id: '6', 
        label: 'API Services', 
        link: '/services', 
        icon: faServer 
      },
      { 
        id: '7', 
        label: 'Database', 
        link: '/database', 
        icon: faDatabase 
      },
      { 
        id: '8', 
        label: 'Development', 
        link: '/development', 
        icon: faCode 
      },
      { 
        id: '9', 
        label: 'Cloud Storage', 
        link: '/storage', 
        icon: faCloud 
      },
      { 
        id: '10', 
        label: 'AI Tools', 
        link: '/tools', 
        icon: faMagic 
      },
    ];
    setButtons(buttonData);
  }, []);

  return (
    <Layout title="Dashboard">
      <div className="uk-container uk-container-expand" style={{ padding: '20px' }}>
        <h2 className="uk-heading-small" style={{ color: '#fff', marginBottom: '30px' }}>
          Dashboard
        </h2>
        <Dashboard buttons={buttons} />
      </div>
    </Layout>
  );
};