import { ProductFlavor, setProductFlavor } from "@/utils/DataSlice";
import React, { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/store";
import { toast } from "sonner";

interface AddFlavorProps {
  onClose: () => void;
}

function AddFlavour({ onClose }: AddFlavorProps) {
  const dispatch = useDispatch();

  // Selects all existing product flavors from Redux
  const allPreviousFlavors = useSelector(
    (state: RootState) => state.dataSlice.productFlavors
  );

  // Local state for dynamically adding new flavor fields
  const [flavors, setFlavors] = useState<ProductFlavor[]>([
    { id: crypto.randomUUID(), flavor: "" },
  ]);

  const [isPending, startTransition] = useTransition();

  /** Updates a specific flavor name by ID */
  const updateFlavorName = (flavorName: string, flavorId: string) => {
    const findIndex = flavors.findIndex((flav) => flav.id === flavorId);
    const updatedFlavors = [...flavors];
    updatedFlavors[findIndex].flavor = flavorName;
    setFlavors(updatedFlavors);
  };

  /** Removes a flavor field from the form */
  const removeFlavor = (id: string) => {
    const filteredFlavors = flavors.filter((flav) => flav.id !== id);
    setFlavors(filteredFlavors);
  };

  /** Adds a new empty flavor field */
  const addMoreFlavor = () => {
    setFlavors([...flavors, { id: crypto.randomUUID(), flavor: "" }]);
  };

  /** Handles submission to the backend */
  function handleAddFlavors() {
    startTransition(async () => {
      try {
        const res = await axios.post("/api/Products/add-flavour", {
          flavours: flavors.map((flav: ProductFlavor) => flav.flavor),
        });

        const { success, message, productFlavours } = res.data;

        if (success) {
          dispatch(
            setProductFlavor([...allPreviousFlavors, ...productFlavours])
          );
          onClose();

          toast.success(message, {
            position: "bottom-right",
            duration: 3000,
          });
        } else {
          toast.error(message, {
            position: "bottom-right",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Error adding flavors:", error);
        toast.error("An unexpected error occurred. Please try again.", {
          position: "bottom-right",
          duration: 3000,
        });
      }
    });
  }

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Manage Flavors
        </h2>
        <AnimatePresence>
          <div className="space-y-4 mb-6">
            {flavors.map((flavor: ProductFlavor, index: number) => (
              <motion.div
                key={flavor.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <div className="flex-1">
                  <label
                    htmlFor={`flavor-${flavor.id}`}
                    className="text-sm font-medium text-gray-600 sr-only"
                  >
                    Flavor Name
                  </label>
                  <Input
                    id={`flavor-${flavor.id}`}
                    placeholder="Enter flavor name"
                    value={flavor.flavor}
                    onChange={(e) =>
                      updateFlavorName(String(e.target.value), flavor.id)
                    }
                    className="rounded-lg border-gray-300 bg-gray-50 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                {flavors.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeFlavor(flavor.id)}
                    className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 border-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        <Button type="button" variant="outline" onClick={addMoreFlavor}>
          <Plus className="h-4 w-4 mr-2" /> Add More
        </Button>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          className="bg-red-800 hover:bg-red-900 text-white w-40"
          onClick={handleAddFlavors}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Adding..." : "Add Flavors"}
        </Button>
      </div>
    </div>
  );
}

export default AddFlavour;
