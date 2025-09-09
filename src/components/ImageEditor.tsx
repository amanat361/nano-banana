import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { EditingMode, ModeOption } from "../config/modes";

interface ImageEditorProps {
  mode: EditingMode;
  onBack: () => void;
}

export function ImageEditor({ mode, onBack }: ImageEditorProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPrimaryOption, setSelectedPrimaryOption] = useState<string | null>(
    mode.id === 'custom' ? 'custom' : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState<Record<string, string>>({});
  const [customPrompts, setCustomPrompts] = useState<Record<string, string>>({});
  const [finalPrompt, setFinalPrompt] = useState("");
  const [queueStatus, setQueueStatus] = useState<string>("");
  const [queueId, setQueueId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handlePrimaryOptionSelect = (optionId: string) => {
    const option = mode.primaryOptions.find(opt => opt.id === optionId);
    if (option) {
      setSelectedPrimaryOption(option.promptModifier || 'custom');
    }
  };

  const handleAdvancedOptionSelect = (categoryId: string, optionId: string) => {
    const category = mode.advancedCategories?.find(cat => cat.id === categoryId);
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
    if (!selectedImage || !finalPrompt) return;

    setIsLoading(true);
    setResult(null);

    try {
      const imageData = selectedImage.split(',')[1];
      
      const response = await fetch('/api/nano-banana', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData,
          prompt: finalPrompt,
        }),
      });

      const data = await response.json();

      if (data.success && data.imageData) {
        setResult(`data:${data.mimeType};base64,${data.imageData}`);
      } else {
        alert(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
        </CardContent>
      </Card>

      {selectedImage && (
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

          {mode.advancedCategories && mode.advancedCategories.length > 0 && (
            <Button
              onClick={() => setShowAdvanced(!showAdvanced)}
              variant="ghost"
              className="w-full"
              disabled={isLoading}
            >
              {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
            </Button>
          )}

          {showAdvanced && mode.advancedCategories && (
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
      )}

      {result && (
        <Card className="sm:rounded-lg rounded-none border-0 sm:border">
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