import Layout from '../../components/Layout';
import Dashboard from '../../components/Dashboard';
import { ButtonProps } from '../../types';
import { faRobot, faServer, faCode } from '@fortawesome/free-solid-svg-icons';

const gradioButtons: ButtonProps[] = [
  {
    id: 'llama',
    label: 'Llama Chat',
    link: '/gradio/llama',
    icon: faRobot
  },
  {
    id: 'stable-diffusion',
    label: 'Stable Diffusion',
    link: '/gradio/sd',
    icon: faServer
  },
  {
    id: 'code-llama',
    label: 'Code Llama',
    link: '/gradio/code',
    icon: faCode
  }
];

export default function GradioPage() {
  return (
    <Layout title="Gradio Apps">
      <Dashboard buttons={gradioButtons} columns="3" />
    </Layout>
  );
}
