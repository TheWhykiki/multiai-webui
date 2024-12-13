import React from 'react';
import Button from './Button';
import { ButtonProps } from '../types';
import { faImage, faBrain, faClone } from '@fortawesome/free-solid-svg-icons';

const ImageDashboard: React.FC = () => {
  const buttons: ButtonProps[] = [
    {
      id: 'generate',
      label: 'Mass Generate Images',
      link: '/image/replicate_massgenerate',
      icon: faImage
    },
    {
      id: 'train',
      label: 'Train Model',
      link: '/image/train',
      icon: faBrain
    },
    {
      id: 'dedup',
      label: 'Deduplicate Images',
      link: '/image/dedup',
      icon: faClone
    }
  ];

  return (
    <div className="uk-grid-match uk-child-width-1-2@s uk-child-width-1-3@m" uk-grid="true" style={{
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

export default ImageDashboard;
