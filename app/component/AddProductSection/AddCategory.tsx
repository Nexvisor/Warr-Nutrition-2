import { ProductCategory, setProductCategory } from "@/utils/DataSlice";
import React, { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/store";
import { CustomToast } from "../comman/customToast"; // ✅ Updated Toast Import

interface AddCategoryProps {
  onClose: () => void;
}

function AddCategory({ onClose }: AddCategoryProps) {
  const dispatch = useDispatch();

  const allPreviousCategories = useSelector(
    (state: RootState) => state.dataSlice.productCategories
  );

  const [categories, setCategories] = useState<ProductCategory[]>([
    { id: crypto.randomUUID(), category: "" },
  ]);

  const [isPending, startTransition] = useTransition();

  const updateCategoryName = (categoryName: string, categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, category: categoryName } : cat
      )
    );
  };

  const removeCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const addMoreCategory = () => {
    setCategories((prev) => [
      ...prev,
      { id: crypto.randomUUID(), category: "" },
    ]);
  };

  function handleAddCategories() {
    startTransition(async () => {
      try {
        const res = await axios.post("/api/Products/add-category", {
          categories: categories.map((cat) => cat.category),
        });

        const { success, message, productCategories } = res.data;

        if (success) {
          dispatch(
            setProductCategory([...allPreviousCategories, ...productCategories])
          );
          onClose();

          CustomToast({
            message,
            type: "success",
          });
        } else {
          CustomToast({
            message,
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error adding categories:", error);
        CustomToast({
          message: "An unexpected error occurred. Please try again.",
          type: "error",
        });
      }
    });
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Manage Categories
        </h2>

        <AnimatePresence>
          <div className="space-y-4 mb-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <div className="flex-1">
                  <Input
                    placeholder="Enter category name"
                    value={category.category}
                    onChange={(e) =>
                      updateCategoryName(e.target.value, category.id)
                    }
                    className="rounded-lg border-gray-300 bg-gray-50 focus:border-red-500 focus:ring-red-500"
                  />
                </div>

                {categories.length > 1 && (
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

        <Button type="button" variant="outline" onClick={addMoreCategory}>
          <Plus className="h-4 w-4 mr-2" /> Add More
        </Button>
      </div>

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
