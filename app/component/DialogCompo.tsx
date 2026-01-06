import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
interface DialogCompoType {
  isOpen: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  title?: string;
  discription?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}
function DialogCompo({
  isOpen,
  title,
  onOpenChange,
  discription,
  children,
  icon,
  className,
}: DialogCompoType) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("sm:max-w-md max-w-[95vw] p-4 sm:p-6", className)}
      >
        <DialogHeader>
          <DialogTitle className="flex gap-3">
            {icon}
            {title}
          </DialogTitle>
          <DialogDescription>{discription}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default DialogCompo;
