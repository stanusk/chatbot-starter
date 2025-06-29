"use client";

import { ChevronDownIcon } from "lucide-react";
import { models, modelID } from "@/lib/models";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ModelSelectorProps {
  selectedModelId: modelID;
  onModelChange: (modelId: modelID) => void;
}

export function ModelSelector({
  selectedModelId,
  onModelChange,
}: ModelSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <span className="text-muted-foreground">
            {models[selectedModelId]}
          </span>
          <ChevronDownIcon className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(models).map(([id, name]) => (
          <DropdownMenuItem
            key={id}
            onClick={() => onModelChange(id as modelID)}
            className={selectedModelId === id ? "bg-accent" : ""}
          >
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
