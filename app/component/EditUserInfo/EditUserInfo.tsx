import { Button } from "@/components/ui/button";
import { setUserInfo, User } from "@/utils/DataSlice";
import { RootState } from "@/utils/store";
import { Save, Phone, User as UserIcon } from "lucide-react";
import axios from "axios";
import React, { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomToast } from "../comman/customToast";
import useSaveProfile from "@/hooks/useSaveProfile";

type EdituserCompoType = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
function Edituser({ setIsOpen }: EdituserCompoType) {
  const { isPending, updateUserInfo } = useSaveProfile(setIsOpen);
  const dispatch = useDispatch();
  const userinfo = useSelector(
    (state: RootState) => state.dataSlice.userInfo
  ) as User;

  const [user, setuser] = useState<User>({} as User);

  useEffect(() => {
    setuser(userinfo);
  }, [user.id]);

  const saveuser = async (e: React.FormEvent<HTMLFormElement>) => {
    // 1. Prevent the default form submission behavior
    e.preventDefault();
    await updateUserInfo(
      user?.username as string,
      user.phoneNumber,
      user.email as string
    );
  };

  return (
    <div className="bg-[#FAFAFA] rounded-2xl shadow-xl border border-[#E5E5E5] overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#1E5BA8] to-[#2563eb] p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Complete Your Profile
        </h2>
        <p className="text-blue-50 text-sm">
          Please provide your information to continue
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={saveuser} className="p-6 space-y-5">
        {/* Username Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#333333] ml-1">
            Username
          </label>
          <div className="relative group">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#999999] group-focus-within:text-[#1E5BA8] transition-colors" />
            <input
              type="text"
              placeholder="Enter your username"
              value={user?.username || ""}
              required
              className="w-full p-3.5 pl-11 bg-white border border-[#D1D5DB] rounded-lg text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1E5BA8] focus:border-transparent transition-all shadow-sm"
              onChange={(e) =>
                setuser((prev: User) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
          </div>
        </div>

        {/* Phone Number Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#333333] ml-1">
            Phone Number
          </label>
          <div className="relative group">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#999999] group-focus-within:text-[#1E5BA8] transition-colors" />
            <input
              type="tel"
              placeholder="Enter your contact number"
              value={user?.phoneNumber || ""}
              required
              className="w-full p-3.5 pl-11 bg-white border border-[#D1D5DB] rounded-lg text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1E5BA8] focus:border-transparent transition-all shadow-sm"
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setuser((prev: User) => ({
                    ...prev,
                    phoneNumber: value,
                  }));
                }
              }}
            />
          </div>
        </div>

        {/* Email Input (Disabled) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#6B7280] ml-1">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full p-3.5 bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg text-[#6B7280] cursor-not-allowed shadow-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#059669] bg-[#D1FAE5] px-2.5 py-1 rounded-full font-medium">
              Verified
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#1E5BA8] to-[#2563eb] text-white font-semibold py-3.5 rounded-lg hover:from-[#2563eb] hover:to-[#1E5BA8] transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none mt-6"
          disabled={isPending}
        >
          <Save className="mr-2 h-5 w-5" />
          {isPending ? "SAVING..." : "SAVE & CONTINUE"}
        </Button>
      </form>

      {/* Footer Note */}
      <div className="px-6 pb-6">
        <p className="text-xs text-center text-[#6B7280]">
          🔒 Your information is secure and encrypted
        </p>
      </div>
    </div>
  );
}

export default Edituser;
