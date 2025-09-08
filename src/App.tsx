import { useState } from "react";
import { MainMenu } from "./components/MainMenu";
import { ImageEditor } from "./components/ImageEditor";
import { type EditingMode } from "./config/modes";
import "../styles/globals.css";

export function App() {
  const [currentMode, setCurrentMode] = useState<EditingMode | null>(null);

  const handleSelectMode = (mode: EditingMode) => {
    setCurrentMode(mode);
  };

  const handleBackToMenu = () => {
    setCurrentMode(null);
  };

  return (
    <div className="max-sm:py-6">
      {currentMode ? (
        <ImageEditor mode={currentMode} onBack={handleBackToMenu} />
      ) : (
        <MainMenu onSelectMode={handleSelectMode} />
      )}
    </div>
  );
}

export default App;
