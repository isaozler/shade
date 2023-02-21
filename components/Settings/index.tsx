import { useState, useEffect } from "react";
import clsx from "clsx";
import { motion, useDragControls, useAnimationControls } from "framer-motion";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";

import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_THEMES,
  SUPPORTED_FONT_STYLES,
  SUPPORTED_PADDING_CHOICES,
} from "lib/values";

import Select from "components/Settings/Select";
import Toggle from "components/Settings/Toggle";
import Choices from "components/Settings/Choices";

export default function Settings() {
  const [mainDimensions, setMainDimensions] = useState<{
    height: number;
    width: number;
  }>({ height: 0, width: 0 });
  const [dragConstraints, setDragConstraints] = useState<{
    top: number;
    left: number;
    right: number;
    bottom: number;
  }>({ top: 0, left: 0, right: 0, bottom: 0 });
  const dragControls = useDragControls();
  const animationControls = useAnimationControls();

  useEffect(() => {
    const main = document.getElementById("main");
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setMainDimensions({
          height: main!.offsetHeight,
          width: main!.offsetWidth,
        });

        animationControls.start({
          x: 0,
          y: 0,
        });
      }, 500);
    };

    setMainDimensions({ height: main!.offsetHeight, width: main!.offsetWidth });

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);

      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const settings = document.getElementById("settings");

    setDragConstraints({
      top: -settings!.offsetTop + 88,
      left:
        -mainDimensions.width +
        settings!.offsetWidth +
        settings!.offsetLeft +
        24,
      right:
        mainDimensions.width -
        settings!.offsetWidth -
        settings!.offsetLeft -
        24,
      bottom:
        mainDimensions.height -
        settings!.offsetHeight -
        settings!.offsetTop -
        24,
    });
  }, [mainDimensions.height, mainDimensions.width]);

  return (
    <motion.div
      id="settings"
      drag
      dragListener={false}
      dragMomentum={false}
      dragControls={dragControls}
      dragConstraints={dragConstraints}
      animate={animationControls}
      className={clsx(
        "fixed bottom-32 z-10 rounded-xl p-5 text-xs",
        "transition-opacity will-change-transform duration-200 ease-in-out",
        "border-[1px] border-white/20 bg-black text-white/70 opacity-50 shadow-xl",
        "focus-within:opacity-100 hover:opacity-100"
      )}
    >
      <motion.div
        onPointerDown={(e) => dragControls.start(e, { snapToCursor: false })}
        whileTap={{
          cursor: "grabbing",
        }}
        className={clsx(
          "absolute -top-[10px] left-1/2 py-[1px] px-[6px]",
          "rounded-md border-[1px] border-white/20 bg-black",
          "transition-all will-change-transform duration-200 ease-in-out",
          "hover:scale-150 hover:cursor-grab hover:bg-gray-800 focus:outline-none"
        )}
      >
        <DragHandleDots2Icon className="rotate-90" />
      </motion.div>
      <div
        className={clsx(
          "flex gap-8",
          "[&>div>label]:font-bold [&>div]:relative [&>div]:flex [&>div]:min-w-max [&>div]:flex-col [&>div]:gap-2"
        )}
      >
        <div>
          <label htmlFor="language">Language</label>
          <Select type="language" options={SUPPORTED_LANGUAGES} />
        </div>
        <div>
          <label htmlFor="theme">Theme</label>
          <Select type="theme" options={SUPPORTED_THEMES} />
        </div>
        <div>
          <label htmlFor="font">Font</label>
          <Select type="fontStyle" options={SUPPORTED_FONT_STYLES} />
        </div>
        <div>
          <label htmlFor="lineNumbers">Line numbers</label>
          <Toggle type="lineNumbers" />
        </div>
        <div>
          <label htmlFor="padding">Padding</label>
          <Choices type="padding" choices={SUPPORTED_PADDING_CHOICES} />
        </div>
      </div>
    </motion.div>
  );
}