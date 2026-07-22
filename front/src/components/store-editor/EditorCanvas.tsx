"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useCanvasBridge } from "./useCanvasBridge";
import { useEditor } from "./editor-store";

const VIEWPORT_WIDTH: Record<string, string> = {
  desktop: "100%",
  tablet: "834px",
  mobile: "390px",
};

export function EditorCanvas() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const { state } = useEditor();
  useCanvasBridge(frameRef);

  return (
    <div className="relative flex-1 overflow-auto bg-surface-2">
      <div className="min-h-full px-4 py-6 sm:px-8">
        <div
          className={cn(
            "mx-auto overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--elevation-2)] transition-[width] duration-200",
            state.viewport === "desktop" ? "min-h-[calc(100vh-8rem)]" : "min-h-[70vh]",
          )}
          style={{ width: VIEWPORT_WIDTH[state.viewport], maxWidth: "100%" }}
        >
          <iframe
            ref={frameRef}
            src="/editeur/canvas"
            title="Aperçu de la boutique"
            className="h-[calc(100vh-8rem)] w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
