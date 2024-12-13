import Layout from '../../components/Layout';
import Dashboard from '../../components/Dashboard';
import { ButtonProps } from '../../types';
import { faImage, faTrash, faMagic } from '@fortawesome/free-solid-svg-icons';

const imageButtons: ButtonProps[] = [
  {
    id: 'generate',
    label: 'Mass Generate Images',
    link: '/image/replicate_massgenerate',
    icon: faImage
  },
  {
    id: 'train',
    label: 'Train Model',
    link: '/train/flux',
    icon: faMagic
  },
  {
    id: 'dedup',
    label: 'Deduplicate Images',
    link: '/image/dedup',
    icon: faTrash
  }
];

export default function ImagePage() {
  return (
    <Layout title="Image Tools">
      <Dashboard buttons={imageButtons} columns="3" />
    </Layout>
  );
}