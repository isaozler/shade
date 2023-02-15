import { Fragment, memo } from "react";
import clsx from "clsx";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import { useStateContext } from "contexts/State";

import ThemeBubble from "components/common/ThemeBubble";

import type {
  LanguageDefinition,
  ThemeDefinition,
  FontDefinition,
} from "lib/types";

interface SelectProps<T> {
  type: "language" | "theme" | "fontStyle";
  options: T[];
}

export default memo(function Select<
  T extends LanguageDefinition | ThemeDefinition | FontDefinition
>({ type, options }: SelectProps<T>) {
  const { state, setState } = useStateContext();

  const getInitialValue = (type: string) => {
    switch (type) {
      case "language":
        return <span>{state.language.label}</span>;
      case "theme":
        return <ThemeBubble colors={state.theme.class} />;
      case "fontStyle":
        return (
          <span className={clsx(state.fontStyle.class)}>
            {state.fontStyle.label}
          </span>
        );

      default:
        return null;
    }
  };

  const getOptionContent = (
    type: string,
    option: LanguageDefinition | ThemeDefinition | FontDefinition
  ) => {
    switch (type) {
      case "language":
        return (
          <span className="block truncate pr-9">
            {(option as LanguageDefinition).label}
          </span>
        );
      case "theme":
        return (
          <>
            <ThemeBubble colors={(option as ThemeDefinition).class} />
            <span className="block truncate">
              {(option as ThemeDefinition).label}
            </span>
          </>
        );
      case "fontStyle":
        return (
          <span
            className={clsx(
              "block truncate pr-9",
              (option as FontDefinition).class
            )}
          >
            {(option as FontDefinition).label}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Listbox
      value={state[type]}
      onChange={(value: T) => setState({ ...state, [type]: value })}
    >
      <div className="relative">
        <Listbox.Button
          className={clsx(
            "flex w-auto select-none items-center justify-between gap-3 rounded-lg p-2 text-xs",
            "border-[1px] border-white/20 bg-black",
            "transition-colors duration-200 ease-in-out",
            "hover:cursor-pointer hover:bg-white/20 focus:outline-none",
            type === "language" && "w-32",
            type === "fontStyle" && "w-40"
          )}
        >
          {getInitialValue(type)}

          <span className="pointer-events-none">
            <ChevronDownIcon className="h-3 w-3 " aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Listbox.Options
            className={clsx(
              "absolute z-10 max-h-80 origin-bottom -translate-x-1/4 -translate-y-3/4 space-y-1 overflow-auto rounded-xl p-2",
              "border-[1px] border-white/20 bg-black",
              "focus:outline-none"
            )}
          >
            {options.map((option) => (
              <Listbox.Option
                key={`${type}-${option.id}`}
                value={option}
                className={clsx(
                  "flex items-center gap-3 rounded-lg p-2 text-xs",
                  "cursor-pointer select-none",
                  "transition-colors duration-200 ease-in-out",
                  "ui-active:bg-white/20 ui-active:text-white",
                  "ui-selected:bg-white/20 ui-selected:text-white"
                )}
              >
                {getOptionContent(type, option)}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
});
