import { ProductCategory, setProductCategory } from "@/utils/DataSlice";
import React, { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/store";
import { toast } from "sonner";

interface AddCategoryProps {
  onClose: () => void;
}

function AddCategory({ onClose }: AddCategoryProps) {
  // Redux dispatch function to send actions.
  const dispatch = useDispatch();

  // Selects all existing product categories from the Redux store.
  const allPreviousCategories = useSelector(
    (state: RootState) => state.dataSlice.productCategories
  );

  // State to manage the list of new categories being added.
  // Initializes with one empty category field.
  const [categories, setCategories] = useState<ProductCategory[]>([
    { id: crypto.randomUUID(), category: "" },
  ]);

  // `useTransition` hook to manage pending states for non-blocking UI updates.
  const [isPending, startTransition] = useTransition();

  /**
   * Updates the name of a specific category in the local state.
   * @param {string} categoryName - The new name for the category.
   * @param {string} categoryId - The unique ID of the category to update.
   */
  const updateCategoryName = (categoryName: string, categoryId: string) => {
    const findIndex = categories.findIndex((cat) => cat.id === categoryId);
    const updatedCategories = [...categories];
    updatedCategories[findIndex].category = categoryName;
    setCategories(updatedCategories);
  };

  /**
   * Removes a category field from the form.
   * @param {string} id - The unique ID of the category to remove.
   */
  const removeCategory = (id: string) => {
    const filteredCategories = categories.filter((cat) => cat.id !== id);
    setCategories(filteredCategories);
  };

  /**
   * Adds a new, empty category field to the form.
   */
  const addMoreCategory = () => {
    setCategories([...categories, { id: crypto.randomUUID(), category: "" }]);
  };

  /**
   * Handles the submission of new categories to the backend API.
   */
  function handleAddCategories() {
    startTransition(async () => {
      try {
        // POST request to the API endpoint to add new categories.
        const res = await axios.post("/api/Products/add-category", {
          categories: categories.map(
            (category: ProductCategory) => category.category
          ),
        });

        const { success, message, productCategories } = res.data;
        console.log(productCategories);
        if (success) {
          // On success, show a success toast.

          dispatch(
            setProductCategory([...allPreviousCategories, ...productCategories])
          );
          onClose();

          toast.success(message, {
            position: "bottom-right",
            duration: 3000,
          });
        } else {
          // On failure, show an error toast with the message from the server.
          toast.error(message, {
            position: "bottom-right",
            duration: 3000,
          });
        }
      } catch (error) {
        // Log and show a generic error toast if the API call fails.
        console.error("Error adding categories:", error);
        toast.error("An unexpected error occurred. Please try again.", {
          position: "bottom-right",
          duration: 3000,
        });
      }
    });
  }

  // The component's JSX for rendering the category management UI.
  return (
    <div className="p-4 md:p-6 bg-white rounded-lg">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Manage Categories
        </h2>
        <AnimatePresence>
          {/* Container for the list of category input fields */}
          <div className="space-y-4 mb-6">
            {categories.map((category: ProductCategory, index: number) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <div className="flex-1">
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium text-gray-600 sr-only"
                  >
                    Category Name
                  </label>
                  <Input
                    id={`category-${category.id}`}
                    placeholder="Enter category name"
                    value={category.category}
                    onChange={(e) =>
                      updateCategoryName(String(e.target.value), category.id)
                    }
                    className="rounded-lg border-gray-300 bg-gray-50 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                {categories.length > 1 && (
                  // Button to remove a category field, only shown if there's more than one.
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeCategory(category.id)}
                    className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 border-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
        {/* Button to add more category fields */}
        <Button type="button" variant="outline" onClick={addMoreCategory}>
          <Plus className="h-4 w-4 mr-2" /> Add More
        </Button>
      </div>
      {/* Submission button area */}
      <div className="mt-8 flex justify-end">
        <Button
          className="bg-red-800 hover:bg-red-900 text-white w-40"
          onClick={handleAddCategories}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Adding..." : "Add Categories"}
        </Button>
      </div>
    </div>
  );
}

export default AddCategory;
