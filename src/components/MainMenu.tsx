import { getAllModes, type EditingMode } from "../config/modes";
import { MenuItem } from "./MenuItem";

interface MainMenuProps {
  onSelectMode: (mode: EditingMode) => void;
}

export function MainMenu({ onSelectMode }: MainMenuProps) {
  const modes = getAllModes();

  return (
    <div className="max-w-xl mx-auto sm:p-4 space-y-6">
      <div className="text-center px-0">
        <h1 className="text-3xl font-bold mb-3 text-gray-800">Free Image Editor</h1>
        <p className="text-gray-600">Choose what you'd like to do with your image</p>
      </div>

      <div className="space-y-6 sm:px-0">
        {modes.map((mode) => (
          <MenuItem
            key={mode.id}
            mode={mode}
            onSelect={onSelectMode}
          />
        ))}
      </div>

      <div className="text-center text-xs text-gray-500 px-4 sm:px-0">
        <p>More editing modes coming soon! 🚀</p>
      </div>
    </div>
  );
}