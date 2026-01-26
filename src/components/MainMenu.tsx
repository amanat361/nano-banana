import { EDITING_MODES, getAllModes, type EditingMode } from "../config/modes";
import { MenuItem } from "./MenuItem";
import { Button } from "@/components/ui/button";

interface MainMenuProps {
  onSelectMode: (mode: EditingMode, preSelectedOption?: string) => void;
}

export function MainMenu({ onSelectMode }: MainMenuProps) {
  const allModes = getAllModes();
  const companionMode = EDITING_MODES.companion!;
  const secondaryModes = allModes.filter((mode) => mode.id !== "companion" && mode.id !== "coupleMashup");

  const handleCompanionSelect = (optionId: string) => {
    const option = companionMode.primaryOptions.find(
      (opt) => opt.id === optionId
    );
    if (option) {
      onSelectMode(companionMode, option.promptModifier);
    }
  };

  return (
    <div className="max-w-xl mx-auto sm:p-4 space-y-6">
      {/* Hero Section */}
      <div className="text-center px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
          Add Someone to Your Photo
        </h1>
        <p className="text-gray-600">One tap. AI magic. Done.</p>
      </div>

      {/* Before/After Preview */}
      <div className="px-4">
        <div className="flex gap-2 items-center justify-center">
          <div className="flex-1 max-w-[160px]">
            <div className="relative">
              <img
                src={companionMode.previewImages?.before}
                alt="Before"
                className="w-full h-32 sm:h-40 object-cover rounded-lg border border-gray-200"
              />
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white text-xs px-2 py-0.5 rounded">
                Before
              </div>
            </div>
          </div>
          <div className="text-gray-400 text-2xl">→</div>
          <div className="flex-1 max-w-[160px]">
            <div className="relative">
              <img
                src={companionMode.previewImages?.after}
                alt="After"
                className="w-full h-32 sm:h-40 object-cover rounded-lg border border-gray-200"
              />
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                After
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero CTA Buttons */}
      <div className="px-4 space-y-3">
        <Button
          onClick={() => handleCompanionSelect("boyfriend")}
          className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          <span className="mr-2 text-xl">👨</span>
          Add Boyfriend
        </Button>
        <Button
          onClick={() => handleCompanionSelect("girlfriend")}
          className="w-full py-6 text-lg font-semibold bg-pink-600 hover:bg-pink-700"
          size="lg"
        >
          <span className="mr-2 text-xl">👩</span>
          Add Girlfriend
        </Button>
        <Button
          onClick={() => onSelectMode(EDITING_MODES.coupleMashup!)}
          className="w-full py-6 text-lg font-semibold bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          <span className="mr-2 text-xl">💕</span>
          Couple Mashup
        </Button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 px-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-gray-500 text-sm">Or try other edits</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Secondary Modes */}
      <div className="space-y-3 px-4">
        {secondaryModes.map((mode) => (
          <MenuItem
            key={mode.id}
            mode={mode}
            onSelect={onSelectMode}
            compact
          />
        ))}
      </div>

      <div className="text-center text-xs text-gray-500 px-4 sm:px-0">
        <p>More editing modes coming soon!</p>
      </div>
    </div>
  );
}
