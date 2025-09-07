import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function NanoBanana() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [ageOption, setAgeOption] = useState<string | null>(null);
  const [styleOption, setStyleOption] = useState<string | null>(null);
  const [locationOption, setLocationOption] = useState<string | null>(null);
  const [finalPrompt, setFinalPrompt] = useState("");
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

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
  };

  const handleAgeSelect = (age: string) => {
    setAgeOption(age);
  };

  const handleStyleSelect = (style: string) => {
    setStyleOption(style);
  };

  const handleLocationSelect = (location: string) => {
    setLocationOption(location);
  };

  useEffect(() => {
    if (selectedPrompt) {
      let prompt = selectedPrompt;
      const modifiers = [];
      
      if (showAdvanced) {
        if (ageOption) modifiers.push(ageOption);
        if (styleOption) modifiers.push(styleOption);
        if (locationOption) modifiers.push(locationOption);
      }
      
      if (modifiers.length > 0) {
        prompt = `${selectedPrompt}, ${modifiers.join(', ')}`;
      }
      
      setFinalPrompt(prompt);
    }
  }, [selectedPrompt, ageOption, styleOption, locationOption, showAdvanced]);

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
    }
  };

  return (
    <div className="max-w-md mx-auto sm:p-4 space-y-6">
      <Card className="sm:rounded-lg rounded-none border-0 sm:border">
        <CardContent className="p-1 sm:p-2">
          <div
            onClick={handleImageClick}
            className="w-full h-64 border-2 border-dashed border-gray-300 sm:rounded-lg rounded-none flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-full object-cover sm:rounded-lg rounded-none"
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
          <div className="flex gap-2">
            <Button
              variant={selectedPrompt === "add a boyfriend" ? "default" : "outline"}
              onClick={() => handlePromptSelect("add a boyfriend")}
              className="flex-1"
              disabled={isLoading}
            >
              👨 Add Boyfriend
            </Button>
            <Button
              variant={selectedPrompt === "add a girlfriend" ? "default" : "outline"}
              onClick={() => handlePromptSelect("add a girlfriend")}
              className="flex-1"
              disabled={isLoading}
            >
              👩 Add Girlfriend
            </Button>
          </div>

          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="ghost"
            className="w-full"
            disabled={isLoading}
          >
            {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
          </Button>

          {showAdvanced && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Age:</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={ageOption === "young" ? "default" : "outline"}
                    onClick={() => handleAgeSelect("young")}
                    className="text-sm"
                    disabled={isLoading}
                  >
                    🧒 Young
                  </Button>
                  <Button
                    variant={ageOption === "middle-aged" ? "default" : "outline"}
                    onClick={() => handleAgeSelect("middle-aged")}
                    className="text-sm"
                    disabled={isLoading}
                  >
                    🧑 Adult
                  </Button>
                  <Button
                    variant={ageOption === "old" ? "default" : "outline"}
                    onClick={() => handleAgeSelect("old")}
                    className="text-sm"
                    disabled={isLoading}
                  >
                    👴 Old
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Style:</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={styleOption === "casual" ? "default" : "outline"}
                    onClick={() => handleStyleSelect("casual")}
                    className="text-sm"
                    disabled={isLoading}
                  >
                    👕 Casual
                  </Button>
                  <Button
                    variant={styleOption === "formal" ? "default" : "outline"}
                    onClick={() => handleStyleSelect("formal")}
                    className="text-sm"
                    disabled={isLoading}
                  >
                    👔 Formal
                  </Button>
                  <Button
                    variant={styleOption === "athletic" ? "default" : "outline"}
                    onClick={() => handleStyleSelect("athletic")}
                    className="text-sm"
                    disabled={isLoading}
                  >
                    🏃 Athletic
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Setting:</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={locationOption === "at the beach" ? "default" : "outline"}
                    onClick={() => handleLocationSelect("at the beach")}
                    className="text-sm"
                    disabled={isLoading}
                  >
                    🏖️ Beach
                  </Button>
                  <Button
                    variant={locationOption === "in a coffee shop" ? "default" : "outline"}
                    onClick={() => handleLocationSelect("in a coffee shop")}
                    className="text-sm"
                    disabled={isLoading}
                  >
                    ☕ Cafe
                  </Button>
                  <Button
                    variant={locationOption === "in a park" ? "default" : "outline"}
                    onClick={() => handleLocationSelect("in a park")}
                    className="text-sm"
                    disabled={isLoading}
                  >
                    🌳 Park
                  </Button>
                </div>
              </div>

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

          <Button
            onClick={handleSubmit}
            disabled={!finalPrompt || isLoading}
            className="w-full relative"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      )}

      {result && (
        <Card className="sm:rounded-lg rounded-none border-0 sm:border">
          <CardContent className="p-1 sm:p-2">
            <h3 className="text-lg font-semibold mb-2 px-3 sm:px-1">Result:</h3>
            <img
              src={result}
              alt="Generated result"
              className="w-full sm:rounded-lg rounded-none"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}