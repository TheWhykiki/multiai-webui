import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import FluxTrainingForm from '../../components/FluxTrainingForm';

const TrainingPage: React.FC = () => {
    const [isTraining, setIsTraining] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleStartTraining = async (formData: any) => {
        try {
            setIsTraining(true);
            setError(null);
            
            const response = await fetch('http://localhost:5000/api/train/flux', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to start training');
            }

            // Start polling for status
            pollTrainingStatus();
        } catch (err: any) {
            setError(err.message);
            setIsTraining(false);
        }
    };

    const pollTrainingStatus = async () => {
        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch('http://localhost:5000/api/train/flux/status');
                const data = await response.json();

                if (data.new_logs) {
                    setLogs(prev => [...prev, ...data.new_logs]);
                }

                if (data.error) {
                    setError(data.error);
                    setIsTraining(false);
                    clearInterval(pollInterval);
                }

                if (data.status === 'completed' || data.status === 'failed') {
                    setIsTraining(false);
                    clearInterval(pollInterval);
                }
            } catch (err) {
                console.error('Error polling status:', err);
            }
        }, 1000);
    };

    return (
        <Layout>
            <div className="uk-container uk-container-small">
                <h1 className="uk-heading-medium uk-margin-medium-bottom">Flux Dreambooth Training</h1>
                
                {error && (
                    <div className="uk-alert-danger" uk-alert>
                        <p>{error}</p>
                    </div>
                )}

                <div className="uk-grid uk-grid-medium" uk-grid>
                    <div className="uk-width-1-2@m">
                        <div className="uk-card uk-card-default uk-card-body">
                            <h3 className="uk-card-title">Training Configuration</h3>
                            <FluxTrainingForm 
                                onSubmit={handleStartTraining}
                                isLoading={isTraining}
                            />
                        </div>
                    </div>

                    <div className="uk-width-1-2@m">
                        <div className="uk-card uk-card-default uk-card-body">
                            <h3 className="uk-card-title">Training Logs</h3>
                            <div 
                                className="uk-height-medium uk-overflow-auto uk-background-muted uk-padding-small"
                                style={{ 
                                    fontFamily: 'monospace',
                                    whiteSpace: 'pre-wrap'
                                }}
                            >
                                {logs.map((log, index) => (
                                    <div key={index}>{log}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default TrainingPage;
