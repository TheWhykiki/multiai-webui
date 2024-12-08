import React from 'react';
import { useRouter } from 'next/router';
import Button from './Button';
import { ButtonProps } from '../types';

interface SubdashboardProps {
  buttons: ButtonProps[];
}

const ReplicateSubdashboard: React.FC<SubdashboardProps> = ({ buttons }) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {buttons.map((button) => (
        <Button key={button.id} {...button} />
      ))}
      <button
        onClick={() => router.push('/')}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Zurück
      </button>
    </div>
  );
};

export default ReplicateSubdashboard;