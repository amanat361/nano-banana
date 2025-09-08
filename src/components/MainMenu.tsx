import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAllModes, type EditingMode } from "../config/modes";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

interface MainMenuProps {
  onSelectMode: (mode: EditingMode) => void;
}

export function MainMenu({ onSelectMode }: MainMenuProps) {
  const modes = getAllModes();

  return (
    <div className="max-w-md mx-auto sm:p-4 space-y-6">
      <div className="text-center px-0">
        <h1 className="text-2xl font-bold mb-2">Free Image Editor</h1>
        <p className="text-gray-600">Choose what you'd like to do with your image</p>
      </div>

      <div className="space-y-4 sm:px-0">
        {modes.map((mode) => (
          <Card 
            key={mode.id} 
            className="sm:rounded-lg rounded-none border-0 sm:border cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectMode(mode)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-3xl">{mode.emoji}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{mode.title}</h3>
                  <p className="text-sm text-gray-600">{mode.description}</p>
                </div>
                {/* <Button variant="outline" size="sm">
                  Select
                  <ArrowRightIcon className="size-3"/>
                </Button> */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-xs text-gray-500 px-4 sm:px-0">
        <p>More editing modes coming soon! 🚀</p>
      </div>
    </div>
  );
}