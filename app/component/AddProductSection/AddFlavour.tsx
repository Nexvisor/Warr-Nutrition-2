import { ProductFlavor, setProductFlavor } from "@/utils/DataSlice";
import React, { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/store";
import { CustomToast } from "../comman/customToast";

interface AddFlavorProps {
  onClose: () => void;
}

function AddFlavour({ onClose }: AddFlavorProps) {
  const dispatch = useDispatch();

  const allPreviousFlavors = useSelector(
    (state: RootState) => state.dataSlice.productFlavors
  );

  const [flavors, setFlavors] = useState<ProductFlavor[]>([
    { id: crypto.randomUUID(), flavor: "" },
  ]);

  const [isPending, startTransition] = useTransition();

  const updateFlavorName = (flavorName: string, flavorId: string) => {
    const updatedFlavors = flavors.map((flav) =>
      flav.id === flavorId ? { ...flav, flavor: flavorName } : flav
    );
    setFlavors(updatedFlavors);
  };

  const removeFlavor = (id: string) => {
    setFlavors((prev) => prev.filter((flav) => flav.id !== id));
  };

  const addMoreFlavor = () => {
    setFlavors((prev) => [...prev, { id: crypto.randomUUID(), flavor: "" }]);
  };

  const handleAddFlavors = () => {
    startTransition(async () => {
      try {
        const res = await axios.post("/api/Products/add-flavour", {
          flavours: flavors.map((flav) => flav.flavor),
        });

        const { success, message, productFlavours } = res.data;

        if (success) {
          dispatch(
            setProductFlavor([...allPreviousFlavors, ...productFlavours])
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
        console.error("Error adding flavors:", error);
        CustomToast({
          message: "An unexpected error occurred. Please try again.",
          type: "error",
        });
      }
    });
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Manage Flavors
        </h2>

        <AnimatePresence>
          <div className="space-y-4 mb-6">
            {flavors.map((flavor, index) => (
              <motion.div
                key={flavor.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <div className="flex-1">
                  <Input
                    placeholder="Enter flavor name"
                    value={flavor.flavor}
                    onChange={(e) =>
                      updateFlavorName(e.target.value, flavor.id)
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
                    className="bg-red-100 text-red-600 hover:bg-red-200 border-red-200"
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
