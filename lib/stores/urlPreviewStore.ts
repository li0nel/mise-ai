import { create } from "zustand";
import type { FullRecipeBlock } from "@/types/chat";
import { extractUrls } from "../recipeImport";
import { extractRecipeFromUrl } from "../ai/urlExtract";

type PreviewStatus = "idle" | "loading" | "success" | "not_recipe" | "error";

interface UrlPreviewState {
  detectedUrl: string | null;
  status: PreviewStatus;
  recipeData: FullRecipeBlock["data"] | null;
  message: string | null;
  _abortController: AbortController | null;

  /** Called on input text change — detects URLs and triggers extraction */
  detectAndExtract: (text: string) => void;
  /** Reset state and abort any in-flight request */
  clear: () => void;
}

export const useUrlPreviewStore = create<UrlPreviewState>((set, get) => ({
  detectedUrl: null,
  status: "idle",
  recipeData: null,
  message: null,
  _abortController: null,

  detectAndExtract: (text: string) => {
    const urls = extractUrls(text);
    const url = urls[0] ?? null;

    // No URL in text — auto-clear
    if (!url) {
      const { _abortController } = get();
      if (_abortController) _abortController.abort();
      set({
        detectedUrl: null,
        status: "idle",
        recipeData: null,
        message: null,
        _abortController: null,
      });
      return;
    }

    // Same URL already being processed — no-op
    if (url === get().detectedUrl) return;

    // New URL — abort previous, start extraction
    const { _abortController: prev } = get();
    if (prev) prev.abort();

    const controller = new AbortController();
    set({
      detectedUrl: url,
      status: "loading",
      recipeData: null,
      message: null,
      _abortController: controller,
    });

    void extractRecipeFromUrl(url, controller.signal).then((result) => {
      // Only update if this URL is still the active one
      if (get().detectedUrl !== url) return;

      switch (result.status) {
        case "success":
          set({
            status: "success",
            recipeData: result.data,
            message: null,
            _abortController: null,
          });
          break;
        case "not_recipe":
          set({
            status: "not_recipe",
            recipeData: null,
            message: result.message,
            _abortController: null,
          });
          break;
        case "error":
          set({
            status: "error",
            recipeData: null,
            message: result.message,
            _abortController: null,
          });
          break;
      }
    });
  },

  clear: () => {
    const { _abortController } = get();
    if (_abortController) _abortController.abort();
    set({
      detectedUrl: null,
      status: "idle",
      recipeData: null,
      message: null,
      _abortController: null,
    });
  },
}));
