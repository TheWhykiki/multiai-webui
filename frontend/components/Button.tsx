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
      <div className="uk-card uk-card-default uk-card-hover uk-height-1-1 dashboard-card">
        <div className="uk-card-body uk-text-center uk-flex uk-flex-column uk-flex-middle" style={{
          padding: '30px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="uk-margin-small-bottom icon-container" style={{
            position: 'relative',
            zIndex: 1
          }}>
            <FontAwesomeIcon 
              icon={icon} 
              size="3x" 
              style={{ 
                color: 'var(--color-primary)',
                width: '48px',
                height: '48px',
                transition: 'all 0.3s ease'
              }} 
            />
          </div>
          <h3 className="uk-card-title uk-margin-remove" style={{ 
            color: '#fff',
            fontSize: '1.2rem',
            fontWeight: 500,
            position: 'relative',
            zIndex: 1
          }}>
            {label}
          </h3>
          <div className="card-background" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
            background: 'radial-gradient(circle at center, var(--color-primary) 0%, transparent 70%)',
            transition: 'opacity 0.3s ease',
            zIndex: 0
          }} />
        </div>
      </div>
    </Link>
  );
};

export default Button;