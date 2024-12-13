import { useState, useCallback, useRef, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Layout from '../../components/Layout';
import { runReplicateMassgenerate } from '../../services/api';

export default function ReplicateMassgenerate() {
  const [model, setModel] = useState('');
  const [outputFolder, setOutputFolder] = useState('');
  const [promptFile, setPromptFile] = useState<File | null>(null);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [numImages, setNumImages] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPromptFile(file);
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim() !== '');
      setPrompts(lines);
      setTotalImages(lines.length * numImages);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!model || !outputFolder || prompts.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    abortControllerRef.current = new AbortController();

    try {
      await runReplicateMassgenerate({
        model,
        outputFolder,
        prompts,
        numImages,
        onProgress: (current: number) => {
          setProgress(current);
        },
        signal: abortControllerRef.current.signal,
      });
      toast.success('Generation completed successfully!');
    } catch (error: any) {
      if (error.name === 'AbortError') {
        toast.error('Generation cancelled');
      } else {
        console.error('Generation error:', error);
        toast.error('Error during generation: ' + error.message);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  }, [model, outputFolder, prompts, numImages]);

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  useEffect(() => {
    if (prompts.length > 0) {
      setTotalImages(prompts.length * numImages);
    }
  }, [prompts.length, numImages]);

  return (
    <Layout title="Mass Generate Images">
      <div className="uk-container uk-container-small">
        <Toaster position="top-right" />
        
        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="model">Model:</label>
          <div className="uk-form-controls">
            <input
              className="uk-input"
              id="model"
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Enter model name"
            />
          </div>
        </div>

        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="outputFolder">Output Folder:</label>
          <div className="uk-form-controls">
            <input
              className="uk-input"
              id="outputFolder"
              type="text"
              value={outputFolder}
              onChange={(e) => setOutputFolder(e.target.value)}
              placeholder="Enter output folder path"
            />
          </div>
        </div>

        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="promptFile">Prompt File:</label>
          <div className="uk-form-controls">
            <div className="uk-flex uk-flex-middle">
              <input
                className="uk-input"
                id="promptFile"
                type="file"
                onChange={handleFileChange}
                accept=".txt"
              />
              {promptFile && (
                <span className="uk-margin-left">
                  {prompts.length} prompts loaded
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="uk-margin">
          <label className="uk-form-label" htmlFor="numImages">Images per Prompt:</label>
          <div className="uk-form-controls">
            <input
              className="uk-input"
              id="numImages"
              type="number"
              min="1"
              value={numImages}
              onChange={(e) => setNumImages(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>

        {isGenerating && (
          <div className="uk-margin">
            <progress 
              className="uk-progress" 
              value={progress} 
              max={totalImages}
            ></progress>
            <div className="uk-text-center">
              Generated {progress} of {totalImages} images
            </div>
          </div>
        )}

        <div className="uk-margin uk-flex uk-flex-center">
          {!isGenerating ? (
            <button 
              className="uk-button uk-button-primary" 
              onClick={handleGenerate}
              disabled={!model || !outputFolder || prompts.length === 0}
            >
              Generate Images
            </button>
          ) : (
            <button 
              className="uk-button uk-button-danger" 
              onClick={handleCancel}
            >
              Cancel Generation
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
