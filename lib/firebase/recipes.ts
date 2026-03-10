import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import type { Unsubscribe } from "firebase/firestore";
import { db } from "../firebase";
import type { Recipe } from "../../types";

/** Returns the Firestore collection reference for a user's recipes */
function userRecipesRef(uid: string) {
  return collection(db, "users", uid, "recipes");
}

/** Add a recipe to the user's Firestore collection. Returns the new doc ID. */
export async function addRecipe(uid: string, recipe: Recipe): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip client-side Date fields before write
  const { createdAt, updatedAt, ...recipeData } = recipe;
  const docRef = await addDoc(userRecipesRef(uid), {
    ...recipeData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/** Delete a recipe from the user's Firestore collection */
export async function deleteRecipe(
  uid: string,
  recipeId: string,
): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "recipes", recipeId));
}

/** Subscribe to real-time updates of the user's recipe collection */
export function subscribeToRecipes(
  uid: string,
  onUpdate: (recipes: Recipe[]) => void,
): Unsubscribe {
  const q = query(userRecipesRef(uid), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const recipes: Recipe[] = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        ...data,
        id: d.id,
        createdAt: data.createdAt?.toDate() as Date | undefined,
        updatedAt: data.updatedAt?.toDate() as Date | undefined,
      } as Recipe;
    });
    onUpdate(recipes);
  });
}
