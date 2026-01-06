import { Benefit, Product, setProducts } from "@/utils/DataSlice";
import { RootState } from "@/utils/store";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Plus, Trash2 } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddProductBenefitsProps {
  product: Product;
  onClose: () => void;
}

function AddProductBenefits({ product, onClose }: AddProductBenefitsProps) {
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();
  const { products } = useSelector((state: RootState) => state.dataSlice);

  // State to manage a list of benefit input fields.
  const [benefits, setBenefits] = useState<Benefit[]>([
    { id: crypto.randomUUID(), topic: "", description: "" },
  ]);

  /**
   * Updates the value of a specific benefit field in the local state.
   * @param {string} id - The unique ID of the benefit to update.
   * @param {'topic' | 'description'} field - The field to update.
   * @param {string} value - The new value for the field.
   */
  const updateBenefitValue = (
    id: string,
    field: "topic" | "description",
    value: string
  ) => {
    const newBenefits = benefits.map((b) =>
      b.id === id ? { ...b, [field]: value } : b
    );
    setBenefits(newBenefits);
  };

  /**
   * Removes a benefit input field from the form.
   * @param {string} id - The unique ID of the benefit to remove.
   */
  const removeBenefit = (id: string) => {
    setBenefits((prev) => prev.filter((b) => b.id !== id));
  };

  /**
   * Adds a new, empty benefit input field to the form.
   */
  const addMoreBenefit = () => {
    setBenefits((prev) => [
      ...prev,
      { id: crypto.randomUUID(), topic: "", description: "" },
    ]);
  };

  /**
   * Handles the submission of new benefits to the backend API.
   */
  const handleAddBenefits = () => {
    startTransition(async () => {
      try {
        // Filter out any empty/incomplete benefit fields before sending to the API.
        const validBenefits = benefits.filter(
          (b) => b.topic.trim() !== "" && b.description.trim() !== ""
        );

        if (validBenefits.length === 0) {
          toast.error("Please enter at least one complete benefit.");
          return;
        }

        const res = await axios.post("/api/Products/add-product-benefits", {
          productId: product.id,
          benefits: validBenefits.map((b) => ({
            topic: b.topic,
            description: b.description,
          })),
        });

        const { success, message, data } = res.data;

        if (success) {
          // Update the specific product in the Redux store with the new benefits.
          const updatedProducts = products.map((p: Product) =>
            p.id === product.id
              ? { ...p, benifits: [...product.benifits, ...data] }
              : p
          );
         
          dispatch(setProducts(updatedProducts));
          toast.success(message);
          onClose(); // Close the dialog/modal on success.
        } else {
          toast.error(message);
        }
      } catch (error) {
        console.error("Error adding product benefits:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Add Key Benefits
      </h2>
      <div className="space-y-4 mb-6">
        <AnimatePresence>
          {benefits.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2"
            >
              <Input
                placeholder="Benefit Topic"
                value={item.topic}
                onChange={(e) =>
                  updateBenefitValue(item.id, "topic", e.target.value)
                }
                className="flex-1"
              />
              <Input
                placeholder="Benefit Description"
                value={item.description}
                onChange={(e) =>
                  updateBenefitValue(item.id, "description", e.target.value)
                }
                className="flex-1"
              />
              {benefits.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeBenefit(item.id)}
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
        <Button type="button" variant="outline" onClick={addMoreBenefit}>
          <Plus className="h-4 w-4 mr-2" /> Add More
        </Button>
        <Button
          onClick={handleAddBenefits}
          disabled={isPending}
          className="bg-red-800 hover:bg-red-900 text-white w-40"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Add Benefits"
          )}
        </Button>
      </div>
    </div>
  );
}

export default AddProductBenefits;
