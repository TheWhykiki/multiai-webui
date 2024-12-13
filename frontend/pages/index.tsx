import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import { ButtonProps } from '../types';
import { faImage, faRobot, faCog, faServer, faDatabase, faCode, faCloud, faMagic, faVideo } from '@fortawesome/free-solid-svg-icons';

const mainButtons: ButtonProps[] = [
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

export default function Home() {
  return (
    <Layout title="Dashboard">
      <Dashboard buttons={mainButtons} columns="4" />
    </Layout>
  );
}