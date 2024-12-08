import { useState, useCallback, useRef, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Layout from '../../components/Layout';
import { runReplicateMassgenerate } from '../../services/api';

export default function ReplicateMassgenerate() {
  const [model, setModel] = useState('');
  const [outputFolder, setOutputFolder] = useState('');
  const [promptFile, setPromptFile] = useState<File | null>(null);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shouldStop, setShouldStop] = useState(false);
  const isGeneratingRef = useRef(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});
  const retryCount = useRef<{[key: string]: number}>({});
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [debugInfo, setDebugInfo] = useState<Array<{time: string, message: string}>>([]);
  
  // Add debug log function
  const addDebugLog = useCallback((message: string) => {
    const time = new Date().toLocaleTimeString();
    setDebugInfo(prev => [...prev, { time, message }]);
  }, []);

  // Update progress calculation
  const updateProgress = useCallback((current: number, total: number) => {
    const percentage = (current / total) * 100;
    setProgress(Math.round(percentage));
  }, []);

  // Model parameters
  const [loraScale, setLoraScale] = useState(1.1);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [guidanceScale, setGuidanceScale] = useState(3.5);
  const [outputQuality, setOutputQuality] = useState(90);
  const [outputFormat, setOutputFormat] = useState('png');

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [userInteracting, setUserInteracting] = useState<boolean>(false);
  const userInteractionTimer = useRef<NodeJS.Timeout | null>(null);

  // Update current image index when new images are generated
  useEffect(() => {
    if (!userInteracting && generatedImages.length > 0) {
      setCurrentImageIndex(generatedImages.length - 1);
    }
  }, [generatedImages, userInteracting]);

  // Handle user interaction with the slider
  const handleSliderInteraction = () => {
    setUserInteracting(true);
    
    // Clear existing timer if any
    if (userInteractionTimer.current) {
      clearTimeout(userInteractionTimer.current);
    }

    // Set new timer
    userInteractionTimer.current = setTimeout(() => {
      setUserInteracting(false);
    }, 10000); // 10 seconds delay
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (userInteractionTimer.current) {
        clearTimeout(userInteractionTimer.current);
      }
    };
  }, []);

  // Calculate aspect ratio for the main image container
  const getAspectRatioStyle = () => {
    let paddingTop = '100%'; // default square
    switch (aspectRatio) {
      case '1:1':
        paddingTop = '100%';
        break;
      case '4:3':
        paddingTop = '75%';
        break;
      case '3:4':
        paddingTop = '133.33%';
        break;
      case '16:9':
        paddingTop = '56.25%';
        break;
      case '9:16':
        paddingTop = '177.78%';
        break;
    }
    return {
      position: 'relative' as const,
      width: '100%',
      paddingTop,
      overflow: 'hidden'
    };
  };

  const slideshowRef = useRef<any>(null);

  useEffect(() => {
    const loadUIkit = async () => {
      const UIkit = (await import('uikit')).default;
      if (slideshowRef.current) {
        UIkit.slideshow(slideshowRef.current);
      }
    };
    loadUIkit();
  }, []);

  const handleImageLoad = (imageUrl: string) => {
    console.log('Image loaded successfully:', imageUrl);
    setLoadingStates(prev => ({
      ...prev,
      [imageUrl]: false
    }));
  };

  const handleImageError = (index: number, imageUrl: string) => {
    console.error(`Error loading image ${index}:`, imageUrl);
    
    // Initialize retry count if not exists
    if (!retryCount.current[imageUrl]) {
      retryCount.current[imageUrl] = 0;
    }
    
    // Try reloading up to 3 times
    if (retryCount.current[imageUrl] < 3) {
      retryCount.current[imageUrl]++;
      console.log(`Retrying image load (attempt ${retryCount.current[imageUrl]}/3):`, imageUrl);
      
      // Remove any existing timestamp parameters and clean the URL
      const baseUrl = imageUrl.split('?')[0];
      const timestamp = new Date().getTime();
      const newUrl = `${baseUrl}?t=${timestamp}`;
      
      setTimeout(() => {
        setGeneratedImages(prev => {
          const newImages = [...prev];
          newImages[index] = newUrl;
          return newImages;
        });
      }, 2000);
    } else {
      console.error(`Failed to load image after 3 attempts:`, imageUrl);
      setLoadingStates(prev => ({
        ...prev,
        [imageUrl]: false
      }));
      toast.error(`Bild ${index + 1} konnte nicht geladen werden. Bitte überprüfen Sie die Serververbindung.`);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPromptFile(file);
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          setPrompts(data);
          toast.success(`${data.length} Prompts geladen`);
        } else if (typeof data === 'object' && Array.isArray(data.prompts)) {
          setPrompts(data.prompts);
          toast.success(`${data.prompts.length} Prompts geladen`);
        } else {
          toast.error('Ungültiges JSON-Format. Erwartet wird ein Array von Prompts.');
        }
      } catch (error) {
        console.error('Error reading file:', error);
        toast.error('Fehler beim Lesen der Datei');
      }
    }
  };

  const handleStop = () => {
    setShouldStop(true);
    isGeneratingRef.current = false;
    setIsGenerating(false);
    addDebugLog('Stopping generation process...');
    toast('Stopping generation...', {
      icon: '⏹️',
      duration: 2000,
    });
  };

  const generateImage = useCallback(async (prompt: string) => {
    if (!isGeneratingRef.current) {
      addDebugLog('Generation stopped, returning early');
      return;
    }

    try {
      setCurrentPrompt(prompt);
      addDebugLog(`Starting generation with prompt: ${prompt.substring(0, 100)}...`);
      
      const abortController = new AbortController();
      const result = await runReplicateMassgenerate(
        model,
        prompt,
        outputFolder,
        loraScale,
        aspectRatio,
        outputFormat,
        guidanceScale,
        outputQuality,
        abortController.signal
      );

      if (!isGeneratingRef.current) {
        abortController.abort();
        addDebugLog('Generation was stopped during API call');
        return;
      }

      const imageUrl = result.result;
      addDebugLog(`Image generated successfully: ${imageUrl}`);
      
      setLoadingStates(prev => ({
        ...prev,
        [imageUrl]: true
      }));
      
      retryCount.current[imageUrl] = 0;
      
      setGeneratedImages(prev => {
        const newImages = [...prev, imageUrl];
        updateProgress(newImages.length, prompts.length);
        return newImages;
      });
      
      if (prompts.length > 0 && isGeneratingRef.current) {
        const randomIndex = Math.floor(Math.random() * prompts.length);
        const nextPrompt = prompts[randomIndex];
        addDebugLog(`Selected next prompt for generation`);
        toast.success(`Image generated! Starting next generation...`);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (isGeneratingRef.current) {
          await generateImage(nextPrompt);
        } else {
          addDebugLog('Generation was stopped during delay');
        }
      } else {
        addDebugLog('Generation completed or stopped');
        setIsGenerating(false);
        isGeneratingRef.current = false;
        toast.success('All images have been generated!');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      addDebugLog(`Error in generation: ${errorMessage}`);
      console.error('Error in generation:', error);
      toast.error(`Generation failed: ${errorMessage}`);
      setIsGenerating(false);
      isGeneratingRef.current = false;
    }
  }, [model, outputFolder, loraScale, aspectRatio, outputFormat, guidanceScale, outputQuality, prompts, addDebugLog, updateProgress]);

  const startGeneration = useCallback(async () => {
    if (prompts.length === 0) {
      toast.error('No prompts loaded');
      return;
    }

    setShouldStop(false);
    isGeneratingRef.current = true;
    setIsGenerating(true);
    setProgress(0);
    addDebugLog('Starting generation process...');

    // Start with a random prompt
    const randomIndex = Math.floor(Math.random() * prompts.length);
    const firstPrompt = prompts[randomIndex];
    await generateImage(firstPrompt);
  }, [prompts, generateImage, addDebugLog]);

  return (
    <Layout title="Mass Image Generation">
      <div className="uk-grid uk-grid-medium" uk-grid>
        {/* Left Column - Controls */}
        <div className="uk-width-1-3@m">
          <div className="uk-card uk-card-default uk-card-body uk-card-small">
            <h2 className="uk-card-title">Mass Image Generation</h2>
            
            <form onSubmit={(e) => e.preventDefault()} className="uk-form-stacked">
              {/* Load Prompts Button at the top */}
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="promptFile">Load Prompts</label>
                <div className="uk-form-controls">
                  <div className="uk-flex uk-flex-middle">
                    <input
                      id="promptFile"
                      name="promptFile"
                      type="file"
                      accept=".json"
                      onChange={handleFileChange}
                      className="uk-input uk-width-1-1"
                      style={{ display: 'none' }}
                    />
                    <button
                      onClick={() => document.getElementById('promptFile')?.click()}
                      className="uk-button uk-button-primary uk-width-1-1"
                    >
                      <span uk-icon="upload"></span> Load Prompts
                    </button>
                  </div>
                </div>
              </div>

              {/* Model Input */}
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="model">Model</label>
                <div className="uk-form-controls">
                  <input
                    id="model"
                    name="model"
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="uk-input uk-width-1-1"
                    placeholder="Enter model name"
                  />
                </div>
              </div>

              {/* Output Folder */}
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="outputFolder">Output Folder</label>
                <div className="uk-form-controls">
                  <input
                    id="outputFolder"
                    name="outputFolder"
                    type="text"
                    value={outputFolder}
                    onChange={(e) => setOutputFolder(e.target.value)}
                    className="uk-input uk-width-1-1"
                    placeholder="Enter output folder path"
                  />
                </div>
              </div>

              {/* Full width sliders */}
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="loraScale">Lora Scale ({loraScale})</label>
                <div className="uk-form-controls">
                  <input
                    id="loraScale"
                    name="loraScale"
                    type="range"
                    value={loraScale}
                    onChange={(e) => setLoraScale(parseFloat(e.target.value))}
                    min="0"
                    max="2"
                    step="0.1"
                    className="uk-range uk-width-1-1"
                  />
                </div>
              </div>

              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="guidanceScale">Guidance Scale ({guidanceScale})</label>
                <div className="uk-form-controls">
                  <input
                    id="guidanceScale"
                    name="guidanceScale"
                    type="range"
                    value={guidanceScale}
                    onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                    min="1"
                    max="20"
                    step="0.1"
                    className="uk-range uk-width-1-1"
                  />
                </div>
              </div>

              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="outputQuality">Output Quality ({outputQuality}%)</label>
                <div className="uk-form-controls">
                  <input
                    id="outputQuality"
                    name="outputQuality"
                    type="range"
                    value={outputQuality}
                    onChange={(e) => setOutputQuality(parseInt(e.target.value))}
                    min="1"
                    max="100"
                    step="1"
                    className="uk-range uk-width-1-1"
                  />
                </div>
              </div>

              {/* Dropdowns full width */}
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="aspectRatio">Aspect Ratio</label>
                <div className="uk-form-controls">
                  <select
                    id="aspectRatio"
                    name="aspectRatio"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="uk-select uk-width-1-1"
                  >
                    <option value="16:9">16:9</option>
                    <option value="4:3">4:3</option>
                    <option value="1:1">1:1</option>
                    <option value="9:16">9:16</option>
                    <option value="3:2">3:2</option>
                    <option value="2:3">2:3</option>
                    <option value="21:9">21:9 (Ultrawide)</option>
                    <option value="32:9">32:9 (Super Ultrawide)</option>
                    <option value="4:5">4:5 (Instagram Portrait)</option>
                    <option value="2:1">2:1 (Cinematic)</option>
                    <option value="1:2">1:2 (Tall Portrait)</option>
                    <option value="5:4">5:4 (Classic Photo)</option>
                    <option value="7:5">7:5 (Standard Photo)</option>
                    <option value="8:5">8:5 (Widescreen Photo)</option>
                  </select>
                </div>
              </div>

              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="outputFormat">Output Format</label>
                <div className="uk-form-controls">
                  <select
                    id="outputFormat"
                    name="outputFormat"
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="uk-select uk-width-1-1"
                  >
                    <option value="png">PNG</option>
                    <option value="jpg">JPG</option>
                    <option value="webp">WebP</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons stacked vertically */}
              <div className="uk-margin">
                <div className="uk-flex uk-flex-column uk-flex-middle">
                  {!isGenerating ? (
                    <button
                      onClick={startGeneration}
                      className="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom"
                      disabled={!prompts || prompts.length === 0}
                    >
                      <span uk-icon="play" className="uk-margin-small-right"></span>
                      Start Generation
                    </button>
                  ) : (
                    <button
                      onClick={handleStop}
                      className="uk-button uk-button-danger uk-width-1-1 uk-margin-small-bottom"
                    >
                      <span uk-icon="close" className="uk-margin-small-right"></span>
                      Stop Generation
                    </button>
                  )}
                  
                  <button
                    onClick={() => setGeneratedImages([])}
                    className="uk-button uk-button-default uk-width-1-1"
                  >
                    <span uk-icon="trash" className="uk-margin-small-right"></span>
                    Clear Images
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Image Preview */}
        <div className="uk-width-2-3@m">
          <div className="uk-card uk-card-default uk-card-body uk-card-small">
            {generatedImages.length > 0 && (
              <div className="uk-margin">
                {/* Main Image Display with aspect ratio container */}
                <div style={getAspectRatioStyle()}>
                  <img
                    src={generatedImages[currentImageIndex]}
                    alt={`Generated image ${currentImageIndex + 1}`}
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      backgroundColor: '#1a1a1a'
                    }}
                  />
                </div>

                {/* Thumbnail Navigation */}
                <div 
                  className="uk-position-relative uk-visible-toggle uk-margin-small-top" 
                  tabIndex={-1} 
                  uk-slider="sets: true"
                >
                  <ul className="uk-slider-items uk-child-width-1-2 uk-child-width-1-3@s uk-child-width-1-4@m uk-child-width-1-6@l uk-grid uk-grid-small">
                    {generatedImages.map((image, index) => (
                      <li key={index} onClick={() => {
                        setCurrentImageIndex(index);
                        handleSliderInteraction();
                      }}>
                        <div style={{
                          position: 'relative',
                          paddingTop: '100%',
                          cursor: 'pointer',
                          border: currentImageIndex === index ? '2px solid #1e87f0' : '2px solid transparent'
                        }}>
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            style={{
                              position: 'absolute',
                              top: '0',
                              left: '0',
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                  <a className="uk-position-center-left uk-position-small uk-hidden-hover" href="#" uk-slidenav-previous="true" uk-slider-item="previous"></a>
                  <a className="uk-position-center-right uk-position-small uk-hidden-hover" href="#" uk-slidenav-next="true" uk-slider-item="next"></a>
                </div>
              </div>
            )}
            {generatedImages.length === 0 && (
              <div className="uk-flex uk-flex-center uk-flex-middle" style={{ minHeight: '300px' }}>
                <div className="uk-text-center uk-text-muted">
                  <span uk-icon="icon: image; ratio: 3"></span>
                  <p className="uk-margin-small-top">No images generated yet</p>
                </div>
              </div>
            )}
          </div>

          {/* Progress and Debug Information Card */}
          <div className="uk-card uk-card-default uk-card-body uk-card-small uk-margin-top">
            <h3 className="uk-card-title">Generation Progress</h3>
            
            {/* Progress Bar */}
            <div className="uk-margin">
              <div className="uk-progress">
                <progress 
                  className="uk-progress" 
                  value={progress} 
                  max="100"
                  style={{
                    height: '15px',
                    backgroundColor: 'var(--theme-background)',
                    border: `1px solid var(--theme-border)`
                  }}
                ></progress>
                <div className="uk-text-small uk-text-muted uk-margin-small-top">
                  Progress: {progress}%
                </div>
              </div>
            </div>

            {/* Current Operation */}
            {currentPrompt && (
              <div className="uk-margin">
                <div className="uk-text-small">
                  <span className="uk-text-muted">Current Prompt:</span>
                  <div className="uk-text-small uk-margin-small-top" style={{ wordBreak: 'break-word' }}>
                    {currentPrompt}
                  </div>
                </div>
              </div>
            )}

            {/* Debug Log */}
            <div className="uk-margin">
              <h4 className="uk-heading-line uk-text-small"><span>Debug Log</span></h4>
              <div 
                className="uk-height-small uk-overflow-auto uk-background-muted uk-padding-small"
                style={{
                  backgroundColor: 'var(--theme-background)',
                  border: `1px solid var(--theme-border)`,
                  borderRadius: '4px'
                }}
              >
                {debugInfo.map((log, index) => (
                  <div key={index} className="uk-text-small">
                    <span className="uk-text-muted">[{log.time}]</span> {log.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </Layout>
  );
}