import { memo } from "react";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { SUPPORTED_FONT_SIZES, SUPPORTED_PADDING_CHOICES } from "lib/values";

import { cn } from "lib/cn";
import { find } from "lib/find";
import { useStore } from "lib/store";

import type { ChoiceDefinition } from "lib/types";

export default memo(function Choices({
  type,
  choices,
}: {
  type: "fontSize" | "padding";
  choices: ChoiceDefinition[];
}) {
  const value = useStore((state) => state[type]);
  const update = useStore((state) => state.update);

  const get = {
    fontSize: {
      valueForKey: (key: string) => find(SUPPORTED_FONT_SIZES, key),
    },
    padding: {
      valueForKey: (key: string) => find(SUPPORTED_PADDING_CHOICES, key),
    },
  };

  return (
    <RadioGroupPrimitive.Root
      defaultValue={value.id}
      value={value.id}
      onValueChange={(value: string) =>
        update(type, get[type].valueForKey(value))
      }
      className={cn("flex h-full items-center justify-center")}
    >
      <div className={cn("flex h-full gap-3")}>
        {choices.map((choice) => (
          <RadioGroupPrimitive.Item
            key={`${type}-${choice.id}`}
            id={`${type}-${choice.id}`}
            value={choice.id}
            className={cn(
              "flex items-center justify-center rounded-lg px-2 py-1",
              "select-none outline-none",
              "border border-white/20 bg-black",
              "transition-all duration-100 ease-in-out",
              "hover:text-almost-white",
              "focus:text-almost-white focus:ring-1 focus:ring-almost-white focus:ring-offset-2 focus:ring-offset-black",
              "radix-state-checked:bg-white/20 radix-state-checked:text-almost-white"
            )}
          >
            {choice.label}
          </RadioGroupPrimitive.Item>
        ))}
      </div>
    </RadioGroupPrimitive.Root>
  );
});
