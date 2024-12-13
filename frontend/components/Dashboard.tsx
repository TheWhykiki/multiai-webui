import React from 'react';
import Button from './Button';
import { ButtonProps } from '../types';
import { faImage, faRobot, faCog, faServer, faDatabase, faCode, faCloud, faMagic, faVideo } from '@fortawesome/free-solid-svg-icons';

export interface DashboardProps {
  buttons: ButtonProps[];
  columns?: '2' | '3' | '4';
}

const Dashboard = ({ buttons, columns = '4' }: DashboardProps) => {
  const columnClass = {
    '2': 'uk-child-width-1-2@s',
    '3': 'uk-child-width-1-2@s uk-child-width-1-3@m',
    '4': 'uk-child-width-1-2@s uk-child-width-1-4@m'
  }[columns];

  return (
    <div className={`uk-grid-match ${columnClass}`} uk-grid="true" style={{
      minHeight: 'calc(100vh - 140px)',
      alignContent: 'flex-start',
      margin: '0'
    }}>
      {buttons.map((button) => (
        <div key={button.id} className="uk-margin-bottom">
          <Button {...button} />
        </div>
      ))}
    </div>
  );
};

const buttons: ButtonProps[] = [
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
    icon: faServer 
  },
  { 
    id: '4', 
    label: 'LLM Chat', 
    link: '/chat', 
    icon: faRobot 
  },
  { 
    id: '5', 
    label: 'Database', 
    link: '/database', 
    icon: faDatabase 
  },
  { 
    id: '6', 
    label: 'Code Generation', 
    link: '/code', 
    icon: faCode 
  },
  { 
    id: '7', 
    label: 'Cloud Services', 
    link: '/cloud', 
    icon: faCloud 
  },
  { 
    id: '8', 
    label: 'Settings', 
    link: '/settings', 
    icon: faCog 
  },
  { 
    id: 'flux-train', 
    label: 'Flux Training', 
    link: '/train/flux', 
    icon: faMagic 
  }
];

const App = () => {
  return (
    <Dashboard buttons={buttons} />
  );
};

export default Dashboard;