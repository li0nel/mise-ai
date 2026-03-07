import { create } from "zustand";
import type { ShoppingItem } from "../../types";
import { MOCK_SHOPPING_ITEMS } from "../../data/mockShopping";

interface ShoppingState {
  items: ShoppingItem[];
  sortMode: "aisle" | "recipe";
  addItems: (items: ShoppingItem[]) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  setSortMode: (mode: "aisle" | "recipe") => void;
  clearAll: () => void;
  clearChecked: () => void;
}

export const useShoppingStore = create<ShoppingState>((set) => ({
  items: MOCK_SHOPPING_ITEMS.map((item) => ({ ...item })),
  sortMode: "aisle",

  addItems: (newItems: ShoppingItem[]) =>
    set((state) => ({ items: [...state.items, ...newItems] })),

  removeItem: (id: string) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

  toggleItem: (id: string) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    })),

  setSortMode: (mode: "aisle" | "recipe") => set({ sortMode: mode }),

  clearAll: () => set({ items: [] }),

  clearChecked: () =>
    set((state) => ({ items: state.items.filter((item) => !item.checked) })),
}));
