"use client";

import { Button } from "@/components/ui/button";
import { User } from "@/utils/DataSlice";
import { RootState } from "@/utils/store";
import { Save, Phone, User as UserIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    setUser(userinfo);
  }, [userinfo.id]);

  const saveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateUserInfo(
      user?.username as string,
      user.phoneNumber,
      user.email as string
    );
  };

  return (
    <div className="overflow-hidden rounded-lg shadow-md">
      {/* 🌹 Header Section */}
      <div className="bg-gradient-to-r from-[#B50D27] to-[#DA203A] p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Complete Your Profile
        </h2>
        <p className="text-rose-100 text-sm">
          Please provide your information to continue
        </p>
      </div>

      {/* 🌹 Form Section */}
      <form onSubmit={saveUser} className="p-6 space-y-5 bg-white">
        {/* Username Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#333333] ml-1">
            Username
          </label>
          <div className="relative group">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#B50D27] transition-colors" />
            <input
              type="text"
              placeholder="Enter your username"
              value={user?.username || ""}
              required
              className="w-full p-3.5 pl-11 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DA203A] focus:border-transparent transition-all shadow-sm"
              onChange={(e) =>
                setUser((prev: User) => ({
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
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#B50D27] transition-colors" />
            <input
              type="tel"
              placeholder="Enter your contact number"
              value={user?.phoneNumber || ""}
              required
              className="w-full p-3.5 pl-11 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DA203A] focus:border-transparent transition-all shadow-sm"
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setUser((prev: User) => ({
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
          <label className="block text-sm font-medium text-gray-600 ml-1">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full p-3.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed shadow-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#B50D27] bg-[#FFE6EA] px-2.5 py-1 rounded-full font-medium">
              Verified
            </span>
          </div>
        </div>

        {/* 🌹 Submit Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#B50D27] to-[#DA203A] text-white font-semibold py-3.5 rounded-lg hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-[#B50D27]/30 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          disabled={isPending}
        >
          <Save className="mr-2 h-5 w-5" />
          {isPending ? "SAVING..." : "SAVE & CONTINUE"}
        </Button>
      </form>

      {/* 🌹 Footer Note */}
      <div className="px-6 pb-6 bg-white border-t border-gray-100">
        <p className="text-xs text-center text-gray-500">
          🔒 Your information is secure and encrypted
        </p>
      </div>
    </div>
  );
}

export default Edituser;
