"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, User, Mail, Phone, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Address, User as UserInfo } from "@/utils/DataSlice";
import { useSelector } from "react-redux";
import AddressComponent from "@/app/component/AddressSection/Address-Component";
import AddressForm from "@/app/component/AddressSection/Address-Form";
import useSaveProfile from "@/hooks/useSaveProfile";

export default function UserProfile() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [userData, setuserData] = useState<UserInfo>();

  const userInfo = useSelector((state: any) => state.dataSlice.userInfo);
  const addresses = useSelector((state: any) => state.dataSlice.address);
  const { isPending, updateUserInfo } = useSaveProfile(setIsEditingProfile);

  useEffect(() => {
    if (userInfo?.username) {
      setuserData(userInfo as UserInfo);
    }
  }, [userInfo]);

  const handleSaveProfile = async () => {
    await updateUserInfo(
      userData?.username as string,
      userData?.phoneNumber as string,
      userData?.email as string
    );
  };

  const cancelHandler = () => {
    setIsEditingProfile(false);
  };

  return (
    <div className="space-y-10">
      {/* PROFILE SECTION */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Personal Information
          </h2>
          {!isEditingProfile && (
            <Button
              variant="outline"
              className="text-rose-700 border-rose-700 hover:bg-rose-50 transition"
              onClick={() => setIsEditingProfile(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        <Card className="p-6 shadow-sm border border-gray-200 rounded-xl">
          {isEditingProfile ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Full Name</Label>
                  <Input
                    id="username"
                    defaultValue={userData?.username || ""}
                    onChange={(e) =>
                      setuserData((prev) => ({
                        ...prev!,
                        username: e.target.value,
                      }))
                    }
                    className="focus:border-rose-600 focus:ring-rose-600"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={userData?.email || ""}
                    onChange={(e) =>
                      setuserData((prev) => ({
                        ...prev!,
                        email: e.target.value,
                      }))
                    }
                    className="focus:border-rose-600 focus:ring-rose-600"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    maxLength={10}
                    defaultValue={userData?.phoneNumber}
                    onChange={(e) =>
                      setuserData((prev) => ({
                        ...prev!,
                        phoneNumber: e.target.value,
                      }))
                    }
                    className="focus:border-rose-600 focus:ring-rose-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-2">
                <Button variant="outline" onClick={cancelHandler}>
                  Cancel
                </Button>
                <Button
                  className="bg-rose-700 text-white hover:bg-rose-800 transition"
                  onClick={handleSaveProfile}
                >
                  {isPending ? "Please Wait..." : "Save Changes"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-5 text-gray-800">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-rose-600" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{userData?.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-rose-600" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userData?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-rose-600" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{userData?.phoneNumber}</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ADDRESS SECTION */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Saved Addresses
          </h2>

          {!isAddingAddress && (
            <Button
              className="bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md hover:opacity-90 transition px-5"
              onClick={() => setIsAddingAddress(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          )}
        </div>

        {/* Address List */}
        {!isAddingAddress && addresses?.length > 0 && (
          <div className="grid gap-4">
            {addresses.map((address: Address) => (
              <AddressComponent key={address?.id} address={address} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isAddingAddress && addresses?.length === 0 && (
          <p className="text-gray-500 text-sm">No addresses saved yet.</p>
        )}

        {/* Address Form */}
        {isAddingAddress && (
          <div className="mt-2">
            <AddressForm onCancel={() => setIsAddingAddress(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
