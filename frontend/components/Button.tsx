import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface ButtonProps {
  id: string;
  label: string;
  link: string;
  icon: IconDefinition;
}

const Button: React.FC<ButtonProps> = ({ id, label, link, icon }) => {
  return (
    <Link href={link}>
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-700 transition-all cursor-pointer flex flex-col items-center justify-center h-32 w-full">
        <div className="mb-2">
          <FontAwesomeIcon 
            icon={icon} 
            className="text-indigo-500 w-6 h-6"
          />
        </div>
        <h3 className="text-white text-sm font-medium">
          {label}
        </h3>
      </div>
    </Link>
  );
};

export default Button;