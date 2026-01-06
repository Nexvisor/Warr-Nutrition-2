import { toast } from "sonner";
type ToastType = {
  message: string;
  discription?: string;
  type: "success" | "error";
  icon?: React.ReactNode;
};

export const CustomToast = ({
  message,
  discription,
  type,
  icon,
}: ToastType) => {
  if (type === "success") {
    return toast.success(message, {
      description: discription || "",
      position: "bottom-right",
      duration: 3000,
      style: {
        backgroundColor: "#111111", // Deep black
        color: "#ffffff",
        border: "1px solid #2f2f2f",
      },
      icon,
    });
  }

  if (type === "error") {
    return toast.error(message, {
      position: "bottom-right",
      duration: 3000,
      style: {
        backgroundColor: "#B50D27", // Brand red for error
        color: "#ffffff",
        border: "1px solid #8e0b20",
      },
      icon,
    });
  }
};
