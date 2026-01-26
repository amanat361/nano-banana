import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { EditingMode, ModeOption, ModeOptionCategory } from "../config/modes";

interface ImageEditorProps {
  mode: EditingMode;
  onBack: () => void;
  preSelectedOption?: string | null;
}

export function ImageEditor({ mode, onBack, preSelectedOption }: ImageEditorProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPrimaryOption, setSelectedPrimaryOption] = useState<string | null>(
    preSelectedOption || (mode.id === 'custom' ? 'custom' : (mode.id === 'coupleMashup' ? (mode.primaryOptions[0]?.promptModifier ?? null) : null))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [advancedOptions, setAdvancedOptions] = useState<Record<string, string>>({});
  const [customPrompts, setCustomPrompts] = useState<Record<string, string>>({});
  const [finalPrompt, setFinalPrompt] = useState("");
  const [queueStatus, setQueueStatus] = useState<string>("");
  const [queueId, setQueueId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const generateButtonRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Multi-image mode support
  const isMultiImageMode = mode.maxImages && mode.maxImages > 1;
  const [selectedImages, setSelectedImages] = useState<(string | null)[]>(
    isMultiImageMode ? Array(mode.maxImages).fill(null) : []
  );
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Multi-image handlers
  const handleMultiImageUpload = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImages(prev => {
          const newImages = [...prev];
          newImages[index] = e.target?.result as string;
          return newImages;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultiImageClick = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  // Check if all required images are uploaded (for multi-image mode)
  const allImagesUploaded = isMultiImageMode
    ? selectedImages.every(img => img !== null)
    : selectedImage !== null;

  const handlePrimaryOptionSelect = (optionId: string) => {
    const option = mode.primaryOptions.find(opt => opt.id === optionId);
    if (option) {
      setSelectedPrimaryOption(option.promptModifier || 'custom');
    }
  };

  const handleAdvancedOptionSelect = (categoryId: string, optionId: string) => {
    // Handle both legacy advancedCategories and new categoryGroups
    let category: ModeOptionCategory | undefined;
    
    if (mode.categoryGroups) {
      // Find category in categoryGroups
      for (const group of mode.categoryGroups) {
        category = group.categories.find(cat => cat.id === categoryId);
        if (category) break;
      }
    } else {
      // Legacy path
      category = mode.advancedCategories?.find(cat => cat.id === categoryId);
    }
    
    const option = category?.options.find(opt => opt.id === optionId);
    
    if (option) {
      setAdvancedOptions(prev => ({
        ...prev,
        [categoryId]: option.promptModifier
      }));
    }
  };

  const handleCustomPromptChange = (categoryId: string, value: string) => {
    setCustomPrompts(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };

  useEffect(() => {
    if (selectedPrimaryOption) {
      let prompt = '';
      
      if (selectedPrimaryOption === 'custom') {
        prompt = '';
      } else {
        // Build prompt with basePrompt + selectedPrimaryOption
        if (mode.basePrompt) {
          prompt = `${mode.basePrompt} ${selectedPrimaryOption}`;
        } else {
          prompt = selectedPrimaryOption;
        }
      }
      
      const modifiers: string[] = [];
      
      if (showAdvanced) {
        Object.values(advancedOptions).forEach(modifier => {
          if (modifier) modifiers.push(modifier);
        });
        Object.values(customPrompts).forEach(customPrompt => {
          if (customPrompt.trim()) modifiers.push(customPrompt.trim());
        });
      }
      
      if (selectedPrimaryOption === 'custom' && modifiers.length > 0) {
        prompt = modifiers.join(', ');
      } else if (modifiers.length > 0 && prompt) {
        prompt = `${prompt}, ${modifiers.join(', ')}`;
      } else if (modifiers.length > 0) {
        prompt = modifiers.join(', ');
      }
      
      setFinalPrompt(prompt);
    }
  }, [selectedPrimaryOption, advancedOptions, customPrompts, showAdvanced, mode.basePrompt]);

  // Scroll to generate button when image is uploaded
  useEffect(() => {
    const hasImage = isMultiImageMode ? allImagesUploaded : selectedImage;
    if (hasImage && generateButtonRef.current) {
      setTimeout(() => {
        generateButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [selectedImage, selectedImages, allImagesUploaded, isMultiImageMode]);

  // Scroll to result when generated
  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);

  const pollQueueStatus = async (queueId: string) => {
    const response = await fetch(`/api/queue-status?queueId=${queueId}`);
    const status = await response.json();
    
    if (status.isCurrentlyProcessing) {
      setQueueStatus("Processing your request...");
    } else if (status.position === 1) {
      setQueueStatus("You're next in queue!");
    } else if (status.position > 1) {
      setQueueStatus(`Position ${status.position} in queue`);
    } else if (status.queueLength > 0 && !status.isProcessing) {
      setQueueStatus("Waiting to start...");
    } else {
      setQueueStatus("");
    }
  };

  const handleSubmit = async () => {
    // Check requirements based on mode
    if (isMultiImageMode) {
      if (!allImagesUploaded || !finalPrompt) return;
    } else {
      if (!selectedImage || !finalPrompt) return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      let imageData: string | string[];
      let mimeType: string | string[];

      if (isMultiImageMode) {
        // Multi-image mode: send arrays
        imageData = selectedImages.map(img => img!.split(',')[1] ?? '');
        mimeType = selectedImages.map(img => img!.split(';')[0]?.split(':')[1] ?? 'image/jpeg');
      } else {
        // Single image mode
        imageData = selectedImage!.split(',')[1] ?? '';
        mimeType = selectedImage!.split(';')[0]?.split(':')[1] ?? 'image/jpeg';
      }

      const response = await fetch('/api/nano-banana', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData,
          prompt: finalPrompt,
          mimeType,
          model: mode.model,
        }),
      });

      const data = await response.json();

      if (data.success && data.imageData) {
        setResult(`data:${data.mimeType};base64,${data.imageData}`);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Connection error. Please try again.');
    } finally {
      setIsLoading(false);
      setQueueId(null);
      setQueueStatus("");
    }
  };

  return (
    <div className="max-w-md mx-auto sm:p-4 space-y-6">
      <div className="px-4 sm:px-0">
        <Button onClick={onBack} variant="outline" size="sm" disabled={isLoading}>
          ← Back to Menu
        </Button>
        <div className="text-center mt-4">
          <h1 className="text-xl font-bold flex items-center justify-center gap-2">
            <span>{mode.emoji}</span>
            {mode.title}
          </h1>
          <p className="text-sm text-gray-600">{mode.description}</p>
        </div>
      </div>

      <Card className="sm:rounded-lg rounded-none border-0 sm:border">
        <CardContent className="p-2 sm:p-3">
          {isMultiImageMode ? (
            // Multi-image upload UI
            <>
              <div className="flex gap-3">
                {Array.from({ length: mode.maxImages! }).map((_, index) => (
                  <div key={index} className="flex-1">
                    <div
                      onClick={() => handleMultiImageClick(index)}
                      className="w-full aspect-square border-2 overflow-hidden border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      {selectedImages[index] ? (
                        <img
                          src={selectedImages[index]!}
                          alt={`Person ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-gray-500 p-2">
                          <p className="text-2xl mb-1">👤</p>
                          <p className="text-sm">Person {index + 1}</p>
                          <p className="text-xs">(click)</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={el => { fileInputRefs.current[index] = el; }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleMultiImageUpload(e, index)}
                      className="hidden"
                    />
                  </div>
                ))}
              </div>
              {!allImagesUploaded && (
                <p className="text-center text-gray-500 text-sm mt-3">
                  Please upload both photos
                </p>
              )}
            </>
          ) : (
            // Single image upload UI
            <>
              <div
                onClick={handleImageClick}
                className="w-full min-h-64 border-2 overflow-hidden border-dashed border-gray-300 sm:rounded-sm rounded-none flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <p>Click to upload image</p>
                    <p className="text-sm">or drag and drop</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </>
          )}
        </CardContent>
      </Card>

      {(isMultiImageMode ? allImagesUploaded : selectedImage) && (
        <div className="space-y-4 px-4 sm:px-0">
          {mode.primaryOptions.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {mode.primaryOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedPrimaryOption === option.promptModifier ? "default" : "outline"}
                  onClick={() => handlePrimaryOptionSelect(option.id)}
                  className="flex-1"
                  disabled={isLoading}
                >
                  {option.emoji} {option.label}
                </Button>
              ))}
            </div>
          )}

          {((mode.advancedCategories && mode.advancedCategories.length > 0) || (mode.categoryGroups && mode.categoryGroups.length > 0)) && (
            <Button
              onClick={() => {
                setShowAdvanced(!showAdvanced);
                if (mode.categoryGroups?.[0] && !showAdvanced) {
                  setActiveTab(mode.categoryGroups[0].id);
                }
              }}
              variant="ghost"
              className="w-full"
              disabled={isLoading}
            >
              {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
            </Button>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between gap-2">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 font-bold text-lg leading-none"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {showAdvanced && (
            <div className="space-y-4">
              {/* Tabbed interface for categoryGroups */}
              {mode.categoryGroups && mode.categoryGroups.length > 0 ? (
                <>
                  {/* Tab navigation */}
                  <div className="flex border-b border-gray-300 mb-4">
                    {mode.categoryGroups.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => setActiveTab(group.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium ${
                          activeTab === group.id
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                        disabled={isLoading}
                      >
                        <span>{group.icon}</span>
                        <span>{group.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  {mode.categoryGroups.map((group) => (
                    activeTab === group.id && (
                      <div key={group.id} className="space-y-4">
                        {group.categories.map((category) => (
                          <div key={category.id}>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              {category.label}:
                            </label>
                            {category.isCustom ? (
                              <input
                                type="text"
                                placeholder="Type your custom prompt here..."
                                value={customPrompts[category.id] || ''}
                                onChange={(e) => handleCustomPromptChange(category.id, e.target.value)}
                                disabled={isLoading}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            ) : (
                              <div className="grid grid-cols-3 gap-2">
                                {category.options.map((option) => (
                                  <Button
                                    key={option.id}
                                    variant={advancedOptions[category.id] === option.promptModifier ? "default" : "outline"}
                                    onClick={() => handleAdvancedOptionSelect(category.id, option.id)}
                                    className="text-sm"
                                    disabled={isLoading}
                                  >
                                    {option.emoji} {option.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  ))}
                </>
              ) : (
                /* Legacy interface for advancedCategories */
                mode.advancedCategories && (
                  <div className="space-y-4">
                    {mode.advancedCategories.map((category) => (
                      <div key={category.id}>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          {category.label}:
                        </label>
                        {category.isCustom ? (
                          <input
                            type="text"
                            placeholder="Type your custom prompt here..."
                            value={customPrompts[category.id] || ''}
                            onChange={(e) => handleCustomPromptChange(category.id, e.target.value)}
                            disabled={isLoading}
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="grid grid-cols-3 gap-2">
                            {category.options.map((option) => (
                              <Button
                                key={option.id}
                                variant={advancedOptions[category.id] === option.promptModifier ? "default" : "outline"}
                                onClick={() => handleAdvancedOptionSelect(category.id, option.id)}
                                className="text-sm"
                                disabled={isLoading}
                              >
                                {option.emoji} {option.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Prompt Preview:</label>
                <textarea
                  value={finalPrompt}
                  onChange={(e) => setFinalPrompt(e.target.value)}
                  disabled={isLoading}
                  className="w-full h-20 p-3 border border-gray-300 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Prompt will appear here..."
                />
              </div>
            </div>
          )}

          {mode.id === 'custom' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">What do you want to do with your photo?</label>
              <textarea
                value={finalPrompt}
                onChange={(e) => setFinalPrompt(e.target.value)}
                disabled={isLoading}
                className="w-full h-20 p-3 border border-gray-300 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type your custom prompt here..."
              />
            </div>
          )}

          <div ref={generateButtonRef}>
            <Button
              onClick={handleSubmit}
              disabled={!finalPrompt || isLoading}
              className="w-full relative"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {queueStatus || "Processing..."}
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </div>
      )}

      {result && (
        <Card ref={resultRef} className="sm:rounded-lg rounded-none border-0 sm:border">
          <CardContent className="p-2 sm:p-3">
            <h3 className="text-lg font-semibold mb-2 px-3 sm:px-1">Result:</h3>
            <img
              src={result}
              alt="Generated result"
              className="border-dashed border-gray-300 border-2 w-full sm:rounded-sm rounded-none"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}