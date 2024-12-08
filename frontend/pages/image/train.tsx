import { useState } from 'react';
import Layout from '../../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function FluxTraining() {
  const [formData, setFormData] = useState({
    pretrained_model: 'black-forest-labs/FLUX.1-dev',
    instance_prompt: '',
    class_prompt: '',
    instance_data_dir: '',
    output_dir: 'flux-dreambooth-output',
    num_train_epochs: 1,
    learning_rate: 1e-4,
    train_batch_size: 4,
    resolution: 512,
    center_crop: false,
    random_flip: false,
    with_prior_preservation: false,
    num_class_images: 100,
    train_text_encoder: false,
  });

  const [isTraining, setIsTraining] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTraining(true);
    setError('');
    setLogs([]);

    try {
      const response = await fetch('/api/train/flux', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        // Start polling for training progress
        const pollInterval = setInterval(async () => {
          const statusResponse = await fetch('/api/train/flux/status');
          const statusData = await statusResponse.json();
          
          setLogs(prev => [...prev, ...statusData.new_logs]);
          
          if (statusData.status === 'completed' || statusData.status === 'failed') {
            clearInterval(pollInterval);
            setIsTraining(false);
            if (statusData.status === 'failed') {
              setError(statusData.error || 'Training failed');
            }
          }
        }, 1000);
      } else {
        setError(data.error || 'Failed to start training');
        setIsTraining(false);
      }
    } catch (err) {
      setError('Failed to communicate with server');
      setIsTraining(false);
    }
  };

  return (
    <Layout title="Flux Training">
      <div className="uk-container uk-container-small" style={{ padding: '20px' }}>
        <h2 className="uk-heading-small" style={{ color: '#fff', marginBottom: '30px' }}>
          Flux Dreambooth Training
        </h2>

        <div className="uk-card uk-card-default uk-card-body" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
          <form onSubmit={handleSubmit} className="uk-form-stacked">
            <div className="uk-margin">
              <label className="uk-form-label">Pretrained Model</label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  type="text"
                  name="pretrained_model"
                  value={formData.pretrained_model}
                  onChange={handleInputChange}
                  required
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
                  onChange={handleInputChange}
                  placeholder="photo of a TOK dog"
                  required
                />
              </div>
            </div>

            <div className="uk-margin">
              <label className="uk-form-label">Instance Data Directory</label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  type="text"
                  name="instance_data_dir"
                  value={formData.instance_data_dir}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="uk-grid-small uk-child-width-1-2@s" uk-grid>
              <div>
                <label className="uk-form-label">Training Epochs</label>
                <div className="uk-form-controls">
                  <input
                    className="uk-input"
                    type="number"
                    name="num_train_epochs"
                    value={formData.num_train_epochs}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="uk-form-label">Learning Rate</label>
                <div className="uk-form-controls">
                  <input
                    className="uk-input"
                    type="number"
                    name="learning_rate"
                    value={formData.learning_rate}
                    onChange={handleInputChange}
                    step="0.0001"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="uk-margin">
              <label>
                <input
                  className="uk-checkbox"
                  type="checkbox"
                  name="with_prior_preservation"
                  checked={formData.with_prior_preservation}
                  onChange={handleInputChange}
                />
                <span className="uk-margin-small-left">Enable Prior Preservation</span>
              </label>
            </div>

            {formData.with_prior_preservation && (
              <div className="uk-margin">
                <label className="uk-form-label">Class Prompt</label>
                <div className="uk-form-controls">
                  <input
                    className="uk-input"
                    type="text"
                    name="class_prompt"
                    value={formData.class_prompt}
                    onChange={handleInputChange}
                    placeholder="photo of a dog"
                    required={formData.with_prior_preservation}
                  />
                </div>
              </div>
            )}

            <button
              className="uk-button uk-button-primary uk-width-1-1"
              type="submit"
              disabled={isTraining}
            >
              {isTraining ? (
                <span>
                  <FontAwesomeIcon icon={faSpinner} spin /> Training...
                </span>
              ) : (
                'Start Training'
              )}
            </button>
          </form>

          {error && (
            <div className="uk-alert uk-alert-danger" style={{ marginTop: '20px' }}>
              {error}
            </div>
          )}

          {logs.length > 0 && (
            <div className="uk-margin-large-top">
              <h3>Training Logs</h3>
              <div className="uk-card uk-card-default uk-card-body uk-padding-small" style={{ backgroundColor: '#000', maxHeight: '400px', overflow: 'auto' }}>
                {logs.map((log, index) => (
                  <div key={index} className="uk-text-small" style={{ fontFamily: 'monospace' }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
