import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ConfirmDeleteProps {
  isLoading: boolean;
  deleteHandler: () => void;
  onClose: () => void;
  message?: string;
}

function ConfirmDeleteCompo({
  isLoading,
  deleteHandler,
  onClose,
  message,
}: ConfirmDeleteProps) {
  return (
    <div className="p-6 text-center">
      <h3 className="text-xl font-bold text-gray-900">Are you sure?</h3>
      <p className="text-sm text-gray-500 mt-2 mb-8">
        {message ||
          "This action cannot be undone. This will permanently delete the item."}
      </p>
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={deleteHandler}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}

export default ConfirmDeleteCompo;
