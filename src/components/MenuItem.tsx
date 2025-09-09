import { Card, CardContent } from "@/components/ui/card";
import { type EditingMode } from "../config/modes";

interface MenuItemProps {
  mode: EditingMode;
  onSelect: (mode: EditingMode) => void;
}

// Function to get preview images for each mode
function getPreviewImages(modeId: string): { before: string; after: string } {
  const baseUrl = "https://images.unsplash.com";
  
  switch (modeId) {
    case 'companion':
      return {
        before: `${baseUrl}/150x100?woman+portrait&bg=f3f4f6`,
        after: `${baseUrl}/150x100?couple+happy&bg=f3f4f6`
      };
    case 'product':
      return {
        before: `${baseUrl}/150x100?object+messy&bg=f3f4f6`,
        after: `${baseUrl}/150x100?product+clean+white&bg=ffffff`
      };
    case 'remove':
      return {
        before: `${baseUrl}/150x100?photo+crowded&bg=f3f4f6`,
        after: `${baseUrl}/150x100?photo+clean&bg=f3f4f6`
      };
    case 'custom':
      return {
        before: `${baseUrl}/150x100?photo+ordinary&bg=f3f4f6`,
        after: `${baseUrl}/150x100?photo+artistic&bg=f3f4f6`
      };
    default:
      return {
        before: `${baseUrl}/150x100?photo+before&bg=f3f4f6`,
        after: `${baseUrl}/150x100?photo+after&bg=f3f4f6`
      };
  }
}

export function MenuItem({ mode, onSelect }: MenuItemProps) {
  // Use mode's preview images if available, otherwise fall back to generated ones
  const { before, after } = mode.previewImages || getPreviewImages(mode.id);

  return (
    <Card 
      className="sm:rounded-lg rounded-none border cursor-pointer hover:shadow-md transition-shadow "
      onClick={() => onSelect(mode)}
    >
      <CardContent className="p-2">
        {/* Before/After Preview Images */}
        <div className="mb-4">
          <div className="flex gap-1">
            <div className="flex-1">
              <div className="relative">
                <img 
                  src={before} 
                  alt="Before preview"
                  className="w-full h-32 sm:h-40 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white text-xs px-2 py-0.5 rounded">
                  Before
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center px-0">
              <div className="text-gray-400 text-xl">→</div>
            </div>
            
            <div className="flex-1">
              <div className="relative">
                <img 
                  src={after} 
                  alt="After preview"
                  className="w-full h-32 sm:h-40 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                  After
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Info */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="text-3xl">{mode.emoji}</div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{mode.title}</h3>
            <p className="text-sm text-gray-600">{mode.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
