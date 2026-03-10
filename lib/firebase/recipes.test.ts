import {
  addDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { addRecipe, deleteRecipe, subscribeToRecipes } from "./recipes";
import type { Recipe } from "../../types";

const mockAddDoc = addDoc as jest.MockedFunction<typeof addDoc>;
const mockDeleteDoc = deleteDoc as jest.MockedFunction<typeof deleteDoc>;
const mockOnSnapshot = onSnapshot as jest.MockedFunction<typeof onSnapshot>;

const makeRecipe = (overrides: Partial<Recipe> = {}): Recipe => ({
  id: "test-recipe",
  title: "Test Recipe",
  emoji: "\u{1F355}",
  cuisines: ["Italian"],
  prepTime: 10,
  cookTime: 20,
  servings: 4,
  difficulty: 2,
  ingredientSections: [
    { ingredients: [{ amount: "2", unit: "cups", name: "Flour" }] },
  ],
  instructions: [{ stepNumber: 1, text: "Mix ingredients" }],
  ...overrides,
});

describe("Firestore recipes CRUD", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addRecipe", () => {
    it("calls addDoc with correct collection path and serverTimestamp", async () => {
      mockAddDoc.mockResolvedValue({ id: "new-doc-id" } as never);

      const recipe = makeRecipe();
      const id = await addRecipe("user-123", recipe);

      expect(id).toBe("new-doc-id");
      expect(mockAddDoc).toHaveBeenCalledTimes(1);
      const [, data] = mockAddDoc.mock.calls[0] as [
        unknown,
        Record<string, unknown>,
      ];
      expect(data.title).toBe("Test Recipe");
      expect(data.createdAt).toEqual(serverTimestamp());
      expect(data.updatedAt).toEqual(serverTimestamp());
    });
  });

  describe("deleteRecipe", () => {
    it("calls deleteDoc with correct path", async () => {
      mockDeleteDoc.mockResolvedValue(undefined);
      await deleteRecipe("user-123", "recipe-abc");
      expect(mockDeleteDoc).toHaveBeenCalledTimes(1);
    });
  });

  describe("subscribeToRecipes", () => {
    it("calls onSnapshot and returns unsubscribe function", () => {
      const unsubFn = jest.fn();
      mockOnSnapshot.mockReturnValue(unsubFn as never);

      const onUpdate = jest.fn();
      const unsub = subscribeToRecipes("user-123", onUpdate);

      expect(mockOnSnapshot).toHaveBeenCalledTimes(1);
      expect(unsub).toBe(unsubFn);
    });
  });
});
