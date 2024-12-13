import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Layout from '../../components/Layout';
import { toast, Toaster } from 'react-hot-toast';

export default function FluxTrainingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        modelName: '',
        datasetPath: '',
        epochs: '100',
        batchSize: '1',
        learningRate: '0.0001',
        resolution: '512',
        mixedPrecision: 'fp16',
        useXformers: true,
        gradientCheckpointing: true,
        gradientAccumulation: '1',
        clipSkip: '2',
        networkDim: '32',
        networkAlpha: '16',
        saveEveryNEpochs: '10',
        textEncoder: 'XL',
        shuffle: true,
        keepTokens: '0'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/train/flux', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            if (!response.ok) {
                throw new Error('Training failed to start');
            }
            
            toast.success('Training started successfully!');
        } catch (error) {
            console.error('Training error:', error);
            toast.error('Failed to start training');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    return (
        <Layout title="Flux Training">
            <div className="uk-container uk-container-small">
                <Toaster position="top-right" />
                <form onSubmit={handleSubmit} className="uk-form-stacked">
                    <div className="uk-margin">
                        <label className="uk-form-label">Model Name:</label>
                        <div className="uk-form-controls">
                            <input
                                className="uk-input"
                                type="text"
                                name="modelName"
                                value={formData.modelName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="uk-margin">
                        <label className="uk-form-label">Dataset Path:</label>
                        <div className="uk-form-controls">
                            <input
                                className="uk-input"
                                type="text"
                                name="datasetPath"
                                value={formData.datasetPath}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="uk-grid-small uk-child-width-1-2@s" uk-grid>
                        <div>
                            <label className="uk-form-label">Epochs:</label>
                            <div className="uk-form-controls">
                                <input
                                    className="uk-input"
                                    type="number"
                                    name="epochs"
                                    value={formData.epochs}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="uk-form-label">Batch Size:</label>
                            <div className="uk-form-controls">
                                <input
                                    className="uk-input"
                                    type="number"
                                    name="batchSize"
                                    value={formData.batchSize}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="uk-margin">
                        <button 
                            className="uk-button uk-button-primary" 
                            type="submit" 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <><FontAwesomeIcon icon={faSpinner} spin /> Starting Training...</>
                            ) : (
                                'Start Training'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
