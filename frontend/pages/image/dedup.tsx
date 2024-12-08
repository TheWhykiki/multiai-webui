import { useState } from 'react';
import Layout from '../../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function ImageDedup() {
  const [inputFolder, setInputFolder] = useState('');
  const [outputFolder, setOutputFolder] = useState('');
  const [similarity, setSimilarity] = useState(25);
  const [useTrash, setUseTrash] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/image/dedup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_folder: inputFolder,
          output_folder: outputFolder,
          similarity_threshold: similarity,
          use_trash: useTrash,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'An error occurred during deduplication');
      }
    } catch (err) {
      setError('Failed to process request');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout title="Image Deduplication">
      <div className="uk-container uk-container-small" style={{ padding: '20px' }}>
        <h2 className="uk-heading-small" style={{ color: '#fff', marginBottom: '30px' }}>
          Image Deduplication
        </h2>

        <div className="uk-card uk-card-default uk-card-body" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
          <form onSubmit={handleSubmit} className="uk-form-stacked">
            <div className="uk-margin">
              <label className="uk-form-label">Input Folder Path</label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  type="text"
                  value={inputFolder}
                  onChange={(e) => setInputFolder(e.target.value)}
                  placeholder="/path/to/input/folder"
                  required
                />
              </div>
            </div>

            <div className="uk-margin">
              <label className="uk-form-label">Output Folder Path</label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  type="text"
                  value={outputFolder}
                  onChange={(e) => setOutputFolder(e.target.value)}
                  placeholder="/path/to/output/folder"
                  required
                />
              </div>
            </div>

            <div className="uk-margin">
              <label className="uk-form-label">Similarity Threshold (1-100)</label>
              <div className="uk-form-controls">
                <input
                  className="uk-range"
                  type="range"
                  min="1"
                  max="100"
                  value={similarity}
                  onChange={(e) => setSimilarity(parseInt(e.target.value))}
                />
                <span className="uk-text-small">{similarity}</span>
              </div>
            </div>

            <div className="uk-margin">
              <label>
                <input
                  className="uk-checkbox"
                  type="checkbox"
                  checked={useTrash}
                  onChange={(e) => setUseTrash(e.target.checked)}
                />
                <span className="uk-margin-small-left">Move duplicates to trash (instead of deleting)</span>
              </label>
            </div>

            <button
              className="uk-button uk-button-primary uk-width-1-1"
              type="submit"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span>
                  <FontAwesomeIcon icon={faSpinner} spin /> Processing...
                </span>
              ) : (
                'Start Deduplication'
              )}
            </button>
          </form>

          {error && (
            <div className="uk-alert uk-alert-danger" style={{ marginTop: '20px' }}>
              {error}
            </div>
          )}

          {result && (
            <div className="uk-alert uk-alert-success" style={{ marginTop: '20px' }}>
              <h4>Deduplication Complete</h4>
              <ul className="uk-list">
                <li>Processed Files: {result.processed_files}</li>
                <li>Duplicates Found: {result.duplicates_found}</li>
                <li>Unique Files: {result.unique_files}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
