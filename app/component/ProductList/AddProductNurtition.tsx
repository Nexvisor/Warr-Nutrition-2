import { Nutrition, Product, setProducts } from "@/utils/DataSlice";
import { RootState } from "@/utils/store";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Plus, Trash2 } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddProductNutritionProps {
  product: Product;
  onClose: () => void;
}

function AddProductNurtition({ product, onClose }: AddProductNutritionProps) {
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();
  const { products } = useSelector((state: RootState) => state.dataSlice);

  // State to manage a list of nutrition input fields.
  const [nutritions, setNutritions] = useState<Nutrition[]>([
    { id: crypto.randomUUID(), nutrition: "", quantity: "" },
  ]);

  /**
   * Updates the value of a specific nutrition field in the local state.
   * @param {number} index - The index of the nutrition item to update.
   * @param {'nutrition' | 'quantity'} field - The field to update.
   * @param {string} value - The new value for the field.
   */
  const updateNutritionValue = (
    index: number,
    field: "nutrition" | "quantity",
    value: string
  ) => {
    const newNutritions = [...nutritions];
    newNutritions[index][field] = value;
    setNutritions(newNutritions);
  };

  /**
   * Removes a nutrition input field from the form.
   * @param {number} index - The index of the nutrition item to remove.
   */
  const removeNutrition = (index: number) => {
    setNutritions((prev) => prev.filter((_, idx) => idx !== index));
  };

  /**
   * Adds a new, empty nutrition input field to the form.
   */
  const addMoreNutrition = () => {
    setNutritions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), nutrition: "", quantity: "" },
    ]);
  };

  /**
   * Handles the submission of new nutrition info to the backend API.
   */
  const handleAddNutritions = () => {
    startTransition(async () => {
      try {
        // Filter out any empty/incomplete nutrition fields before sending to the API.
        const validNutritions = nutritions.filter(
          (n) => n.nutrition.trim() !== ""
        );

        if (validNutritions.length === 0) {
          toast.error("Please enter at least one nutrition item.");
          return;
        }

        const res = await axios.post("/api/Products/add-product-nutrition", {
          productId: product.id,
          nutrition: validNutritions.map((n) => ({
            nutrition: n.nutrition,
            quantity: n.quantity,
          })),
        });

        const { success, message, data } = res.data;

        if (success) {
          // Update the specific product in the Redux store with the new nutrition info.
          const updatedProducts = products.map((p: Product) =>
            p.id === product.id
              ? { ...p, nutrition: [...p.nutrition, ...data] }
              : p
          );
          dispatch(setProducts(updatedProducts));
          toast.success(message);
          onClose(); // Close the dialog/modal on success.
        } else {
          toast.error(message);
        }
      } catch (error) {
        console.error("Error adding product nutrition:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Add Nutrition Information
      </h2>
      <div className="space-y-4 mb-6">
        <AnimatePresence>
          {nutritions.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <Input
                placeholder="e.g., Protein"
                value={item.nutrition}
                onChange={(e) =>
                  updateNutritionValue(index, "nutrition", e.target.value)
                }
                className="flex-1"
              />
              <Input
                placeholder="e.g., 25g"
                value={item.quantity}
                onChange={(e) =>
                  updateNutritionValue(index, "quantity", e.target.value)
                }
                className="w-32"
              />
              {nutritions.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeNutrition(index)}
                  className="bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center mt-8">
        <Button type="button" variant="outline" onClick={addMoreNutrition}>
          <Plus className="h-4 w-4 mr-2" /> Add More
        </Button>
        <Button
          onClick={handleAddNutritions}
          disabled={isPending}
          className="bg-red-800 hover:bg-red-900 text-white w-48"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Add Nutrition Info"
          )}
        </Button>
      </div>
    </div>
  );
}

export default AddProductNurtition;
