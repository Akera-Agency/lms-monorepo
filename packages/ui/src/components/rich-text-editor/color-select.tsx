import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { Button } from "../button/button";
import { cn } from "../../lib/utils";
import { ChevronDown } from "lucide-react";
import { Editor } from "@tiptap/core";

const colors = [
  { name: "Slate", color: "bg-slate-700" },
  { name: "Dark Blue", color: "bg-dark-blue" },
  { name: "Lime Green", color: "bg-lime-green" },
  { name: "Citrus Yellow", color: "bg-citrous-yellow" },
  { name: "Bright Pink", color: "bg-bright-pink" },
  { name: "Violet", color: "bg-violet" },
  { name: "Light Blue", color: "bg-light-blue" },
  { name: "Bright Red", color: "bg-bright-red" },
  { name: "Orange", color: "bg-orange" },
];

type ColorSelectProps = {
  editor: Editor | null;
};

export function ColorSelect({ editor }: ColorSelectProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(
    "bg-slate-700",
  );

  const handleColorSelect = (color: string) => {
    if (!editor) return;
    setSelectedColor(color);

    const colorValue = `var(--${color.slice(3)})`;
    editor.chain().focus().setColor(colorValue).run();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex cursor-pointer gap-1">
          <Button
            variant="ghost"
            type="button"
            className={cn("h-4 w-4 rounded-full p-2", selectedColor)}
          ></Button>
          <ChevronDown className="h-4 w-4" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="grid w-[5rem] grid-cols-3 gap-2 p-2 shadow-lg"
        align="start"
      >
        {colors.map((color) => (
          <Button
            key={color.name}
            variant={"ghost"}
            className={cn(
              "h-4 w-4 rounded-full p-2",
              color.color,
              "hover:bg-opacity-75",
            )}
            onClick={() => handleColorSelect(color.color)}
            aria-label={color.name}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
}
