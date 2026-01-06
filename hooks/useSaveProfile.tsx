import { useTransition } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "@/utils/DataSlice";
import { RootState } from "@/utils/store";
import axios from "axios";
import { CustomToast } from "@/app/component/comman/customToast";

/**

Custom hook to handle updating user profile information.

Automatically updates the Redux store, closes dialogs, and shows toast messages.
*/
export default function useSaveProfile(
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  const [isPending, startTransition] = useTransition();
  const user = useSelector((state: RootState) => state.dataSlice.userInfo);
  const dispatch = useDispatch();

  /**

Updates the user's profile information.

@param updatedUsername - The new username.

@param updatedPhoneNumber - The new phone number.

@param updatedEmail - The new email address.
*/
  const updateUserInfo = async (
    updatedUsername: string,
    updatedPhoneNumber: string,
    updatedEmail: string
  ) => {
    startTransition(async () => {
      try {
        // ✅ Send request to backend
        const res = await axios.post("/api/user/update-user-info", {
          id: user.id,
          username: updatedUsername,
          email: updatedEmail,
          phoneNumber: updatedPhoneNumber,
        });

        const { success, message } = res.data;

        if (!success) {
          // ❌ Show error toast from server response
          CustomToast({
            type: "error",
            message: message || "Failed to save information.",
          });
          return;
        }

        // ✅ Update Redux store with new info
        dispatch(
          setUserInfo({
            ...user,
            username: updatedUsername,
            email: updatedEmail,
            phoneNumber: updatedPhoneNumber,
          })
        );

        // ✅ Close dialog

        setIsOpen(false);

        // ✅ Show success toast
        CustomToast({
          type: "success",
          message: message || "Information saved successfully!",
        });
      } catch (error) {
        console.error("Failed to update user info:", error);
        CustomToast({
          type: "error",
          message: "An unexpected error occurred. Please try again later.",
        });
      }
    });
  };

  return { isPending, updateUserInfo };
}
