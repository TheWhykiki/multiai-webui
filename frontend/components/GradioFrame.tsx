import React from 'react';

interface GradioFrameProps {
  url: string;
  title?: string;
  height?: string;
  width?: string;
}

const GradioFrame: React.FC<GradioFrameProps> = ({ 
  url, 
  title = 'Gradio App', 
  height = '800px',
  width = '100%'
}) => {
  return (
    <div className="gradio-container uk-card uk-card-default" style={{ backgroundColor: '#1a1a1a' }}>
      <iframe
        src={url}
        title={title}
        width={width}
        height={height}
        style={{ 
          border: 'none',
          borderRadius: '8px',
          backgroundColor: '#1a1a1a'
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default GradioFrame;
