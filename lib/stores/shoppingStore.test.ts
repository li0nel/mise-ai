import { useShoppingStore } from "./shoppingStore";
import type { ShoppingItem } from "../../types";

describe("shoppingStore", () => {
  beforeEach(() => {
    // Reset store to a known state before each test
    useShoppingStore.setState({ items: [], sortMode: "aisle" });
  });

  describe("initial state", () => {
    it("starts with empty items after reset", () => {
      const { items } = useShoppingStore.getState();
      expect(items).toEqual([]);
    });

    it("starts with aisle sort mode", () => {
      const { sortMode } = useShoppingStore.getState();
      expect(sortMode).toBe("aisle");
    });
  });

  describe("addItems", () => {
    it("adds items to the list", () => {
      const newItems: ShoppingItem[] = [
        { id: "item-1", name: "Flour", amount: "2", unit: "cups", checked: false },
        { id: "item-2", name: "Sugar", amount: "1", unit: "cup", checked: false },
      ];

      useShoppingStore.getState().addItems(newItems);

      const { items } = useShoppingStore.getState();
      expect(items).toHaveLength(2);
      expect(items[0]?.name).toBe("Flour");
      expect(items[1]?.name).toBe("Sugar");
    });

    it("appends to existing items", () => {
      useShoppingStore.setState({
        items: [{ id: "existing", name: "Eggs", amount: "3", checked: false }],
      });

      useShoppingStore.getState().addItems([
        { id: "new-item", name: "Butter", amount: "1", unit: "stick", checked: false },
      ]);

      const { items } = useShoppingStore.getState();
      expect(items).toHaveLength(2);
    });

    it("handles adding an empty array", () => {
      useShoppingStore.getState().addItems([]);
      expect(useShoppingStore.getState().items).toHaveLength(0);
    });
  });

  describe("removeItem", () => {
    it("removes an item by ID", () => {
      useShoppingStore.setState({
        items: [
          { id: "item-1", name: "Flour", amount: "2", checked: false },
          { id: "item-2", name: "Sugar", amount: "1", checked: false },
        ],
      });

      useShoppingStore.getState().removeItem("item-1");

      const { items } = useShoppingStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0]?.id).toBe("item-2");
    });

    it("does nothing when removing non-existent ID", () => {
      useShoppingStore.setState({
        items: [{ id: "item-1", name: "Flour", amount: "2", checked: false }],
      });

      useShoppingStore.getState().removeItem("non-existent");

      expect(useShoppingStore.getState().items).toHaveLength(1);
    });
  });

  describe("toggleItem", () => {
    it("toggles checked state from false to true", () => {
      useShoppingStore.setState({
        items: [{ id: "item-1", name: "Flour", amount: "2", checked: false }],
      });

      useShoppingStore.getState().toggleItem("item-1");

      const item = useShoppingStore.getState().items[0];
      expect(item?.checked).toBe(true);
    });

    it("toggles checked state from true to false", () => {
      useShoppingStore.setState({
        items: [{ id: "item-1", name: "Flour", amount: "2", checked: true }],
      });

      useShoppingStore.getState().toggleItem("item-1");

      const item = useShoppingStore.getState().items[0];
      expect(item?.checked).toBe(false);
    });

    it("only toggles the targeted item", () => {
      useShoppingStore.setState({
        items: [
          { id: "item-1", name: "Flour", amount: "2", checked: false },
          { id: "item-2", name: "Sugar", amount: "1", checked: false },
        ],
      });

      useShoppingStore.getState().toggleItem("item-1");

      const { items } = useShoppingStore.getState();
      expect(items[0]?.checked).toBe(true);
      expect(items[1]?.checked).toBe(false);
    });
  });

  describe("setSortMode", () => {
    it("changes sort mode to recipe", () => {
      useShoppingStore.getState().setSortMode("recipe");
      expect(useShoppingStore.getState().sortMode).toBe("recipe");
    });

    it("changes sort mode to aisle", () => {
      useShoppingStore.setState({ sortMode: "recipe" });
      useShoppingStore.getState().setSortMode("aisle");
      expect(useShoppingStore.getState().sortMode).toBe("aisle");
    });
  });

  describe("clearAll", () => {
    it("removes all items", () => {
      useShoppingStore.setState({
        items: [
          { id: "item-1", name: "Flour", amount: "2", checked: false },
          { id: "item-2", name: "Sugar", amount: "1", checked: true },
        ],
      });

      useShoppingStore.getState().clearAll();

      expect(useShoppingStore.getState().items).toHaveLength(0);
    });
  });

  describe("clearChecked", () => {
    it("removes only checked items", () => {
      useShoppingStore.setState({
        items: [
          { id: "item-1", name: "Flour", amount: "2", checked: true },
          { id: "item-2", name: "Sugar", amount: "1", checked: false },
          { id: "item-3", name: "Butter", amount: "1", checked: true },
        ],
      });

      useShoppingStore.getState().clearChecked();

      const { items } = useShoppingStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0]?.id).toBe("item-2");
    });

    it("does nothing when no items are checked", () => {
      useShoppingStore.setState({
        items: [
          { id: "item-1", name: "Flour", amount: "2", checked: false },
          { id: "item-2", name: "Sugar", amount: "1", checked: false },
        ],
      });

      useShoppingStore.getState().clearChecked();

      expect(useShoppingStore.getState().items).toHaveLength(2);
    });

    it("removes all items when all are checked", () => {
      useShoppingStore.setState({
        items: [
          { id: "item-1", name: "Flour", amount: "2", checked: true },
          { id: "item-2", name: "Sugar", amount: "1", checked: true },
        ],
      });

      useShoppingStore.getState().clearChecked();

      expect(useShoppingStore.getState().items).toHaveLength(0);
    });
  });
});
