import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface TrainingFormProps {
    onSubmit: (formData: any) => void;
    isLoading: boolean;
}

const FluxTrainingForm: React.FC<TrainingFormProps> = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        pretrained_model_name_or_path: "runwayml/stable-diffusion-v1-5",
        instance_data_dir: "",
        output_dir: "output",
        instance_prompt: "",
        learning_rate: "5e-6",
        max_train_steps: "400",
        save_steps: "100"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="uk-form-stacked">
            <div className="uk-margin">
                <label className="uk-form-label">Model Path</label>
                <div className="uk-form-controls">
                    <input
                        className="uk-input"
                        type="text"
                        name="pretrained_model_name_or_path"
                        value={formData.pretrained_model_name_or_path}
                        onChange={handleChange}
                        placeholder="Enter model path"
                    />
                </div>
            </div>

            <div className="uk-margin">
                <label className="uk-form-label">Training Data Directory</label>
                <div className="uk-form-controls">
                    <input
                        className="uk-input"
                        type="text"
                        name="instance_data_dir"
                        value={formData.instance_data_dir}
                        onChange={handleChange}
                        placeholder="Enter training data directory path"
                        required
                    />
                </div>
            </div>

            <div className="uk-margin">
                <label className="uk-form-label">Output Directory</label>
                <div className="uk-form-controls">
                    <input
                        className="uk-input"
                        type="text"
                        name="output_dir"
                        value={formData.output_dir}
                        onChange={handleChange}
                        placeholder="Enter output directory path"
                    />
                </div>
            </div>

            <div className="uk-margin">
                <label className="uk-form-label">Instance Prompt</label>
                <div className="uk-form-controls">
                    <input
                        className="uk-input"
                        type="text"
                        name="instance_prompt"
                        value={formData.instance_prompt}
                        onChange={handleChange}
                        placeholder="Enter instance prompt"
                        required
                    />
                </div>
            </div>

            <div className="uk-margin">
                <label className="uk-form-label">Learning Rate</label>
                <div className="uk-form-controls">
                    <input
                        className="uk-input"
                        type="text"
                        name="learning_rate"
                        value={formData.learning_rate}
                        onChange={handleChange}
                        placeholder="Enter learning rate"
                    />
                </div>
            </div>

            <div className="uk-margin">
                <label className="uk-form-label">Max Training Steps</label>
                <div className="uk-form-controls">
                    <input
                        className="uk-input"
                        type="number"
                        name="max_train_steps"
                        value={formData.max_train_steps}
                        onChange={handleChange}
                        placeholder="Enter max training steps"
                    />
                </div>
            </div>

            <div className="uk-margin">
                <label className="uk-form-label">Save Steps</label>
                <div className="uk-form-controls">
                    <input
                        className="uk-input"
                        type="number"
                        name="save_steps"
                        value={formData.save_steps}
                        onChange={handleChange}
                        placeholder="Enter save steps interval"
                    />
                </div>
            </div>

            <button 
                className="uk-button uk-button-primary" 
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? (
                    <><FontAwesomeIcon icon={faSpinner} spin /> Training...</>
                ) : (
                    'Start Training'
                )}
            </button>
        </form>
    );
};

export default FluxTrainingForm;
