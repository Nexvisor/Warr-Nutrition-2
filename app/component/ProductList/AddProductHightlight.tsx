import { Product, setProducts } from "@/utils/DataSlice";
import { RootState } from "@/utils/store";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Plus, Trash2 } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddProductHighlightProps {
  product: Product;
  onClose: () => void;
}

function AddProductHightlight({ product, onClose }: AddProductHighlightProps) {
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();
  const { products } = useSelector((state: RootState) => state.dataSlice);

  // State to manage a list of highlight input fields, each with a unique ID.
  const [highlights, setHighlights] = useState<string[]>([""]);

  /**
   * Updates the value of a specific highlight in the local state.
   * @param {number} index - The index of the highlight to update.
   * @param {string} value - The new text for the highlight.
   */
  const updateHighlightValue = (index: number, value: string) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
  };

  /**
   * Removes a highlight input field from the form.
   * @param {number} index - The index of the highlight to remove.
   */
  const removeHighlight = (index: number) => {
    setHighlights((prev) => prev.filter((h, idx) => idx !== index));
  };

  /**
   * Adds a new, empty highlight input field to the form.
   */
  const addMoreHighlight = () => {
    setHighlights((prev) => [...prev, ""]);
  };

  /**
   * Handles the submission of new highlights to the backend API.
   */
  const handleAddHighlights = () => {
    startTransition(async () => {
      try {
        // Filter out any empty highlight fields before sending to the API.
        const validHighlights = highlights
          .map((h) => h.trim())
          .filter((h) => h !== "");

        if (validHighlights.length === 0) {
          toast.error("Please enter at least one highlight.");
          return;
        }

        const res = await axios.post("/api/Products/add-product-highlights", {
          productId: product.id,
          productHighlights: validHighlights,
        });

        const { success, message } = res.data;

        if (success) {
          // Update the specific product in the Redux store with the new highlights.
          const updatedProducts = products.map((p: Product) =>
            p.id === product.id
              ? {
                  ...p,
                  productHighlights: [
                    ...product.productHighlights,
                    ...validHighlights,
                  ],
                }
              : p
          );
          dispatch(setProducts(updatedProducts));
          toast.success(message);
          onClose(); // Close the dialog/modal on success.
        } else {
          toast.error(message);
        }
      } catch (error) {
        console.error("Error adding product highlights:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Add Product Highlights
      </h2>
      <div className="space-y-4 mb-6">
        <AnimatePresence>
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <Input
                placeholder="e.g., 25g Protein per serving"
                value={highlight}
                onChange={(e) => updateHighlightValue(index, e.target.value)}
                className="flex-1"
              />
              {highlights.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeHighlight(index)}
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
        <Button type="button" variant="outline" onClick={addMoreHighlight}>
          <Plus className="h-4 w-4 mr-2" /> Add More
        </Button>
        <Button
          onClick={handleAddHighlights}
          disabled={isPending}
          className="bg-red-800 hover:bg-red-900 text-white w-40"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Add Highlights"
          )}
        </Button>
      </div>
    </div>
  );
}

export default AddProductHightlight;
