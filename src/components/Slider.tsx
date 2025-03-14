"use client";

import * as RadixSlider from "@radix-ui/react-slider";

import React, { FunctionComponent } from "react";

interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
}

export const Slider: FunctionComponent<SliderProps> = ({
  value = 1,
  onChange,
}) => {
  const handleOnChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  };
  return (
    <RadixSlider.Root
      className="relative flex items-center select-none touch-none w-full h-10"
      defaultValue={[1]}
      value={[value]}
      onValueChange={handleOnChange}
      max={1}
      step={0.01}
      aria-label="Volume"
    >
      <RadixSlider.Track className="bg-neutral-600 relative grow rounded-full h-[3px]">
        <RadixSlider.Range className="absolute bg-white rounded-full h-full" />
      </RadixSlider.Track>
    </RadixSlider.Root>
  );
};
