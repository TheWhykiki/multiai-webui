import React from 'react';
import Button from './Button';
import { ButtonProps } from '../types';
import { faRobot, faServer, faCode } from '@fortawesome/free-solid-svg-icons';

const GradioDashboard: React.FC = () => {
  const buttons: ButtonProps[] = [
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

export default GradioDashboard;
