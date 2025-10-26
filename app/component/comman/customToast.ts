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
      description: discription ? discription : "",
      position: "bottom-right",
      duration: 3000,
      style: {
        backgroundColor: "#334477",
        color: "white",
        border: "1px solid #3e5692",
      },
      icon,
    });
  }
  if (type === "error") {
    return toast.error(message, {
      position: "bottom-right",
      duration: 3000,
      style: {
        backgroundColor: "#C1292E",
        color: "white",
        border: "1px solid #3e5692",
      },
      icon,
    });
  }
};
