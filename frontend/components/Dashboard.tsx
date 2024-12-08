import React from 'react';
import Button from './Button';
import { ButtonProps } from '../types';

interface DashboardProps {
  buttons: ButtonProps[];
}

const Dashboard: React.FC<DashboardProps> = ({ buttons }) => {
  return (
    <div className="uk-grid-match uk-child-width-1-2@s uk-child-width-1-4@m" uk-grid="true" style={{
      minHeight: 'calc(100vh - 140px)', // Account for header and margins
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

export default Dashboard;