"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Edit, User, Mail, Phone, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Address, User as UserInfo } from "@/utils/DataSlice";

import Loader from "@/app/component/Loader";
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

  function cancelHandler() {
    setuserData(userData);
    setIsEditingProfile(false);
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Personal Information
          </h2>
          {!isEditingProfile && (
            <Button
              variant="outline"
              className="text-blue-700 border-blue-700 hover:bg-blue-50"
              onClick={() => setIsEditingProfile(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        <Card className="p-6">
          {isEditingProfile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    defaultValue={userData?.username as string}
                    onChange={(e) =>
                      setuserData((prev) => ({
                        ...prev!,
                        username: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={userData?.email as string}
                    onChange={(e) =>
                      setuserData((prev) => ({
                        ...prev!,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    defaultValue={userData?.phoneNumber as string}
                    onChange={(e) =>
                      setuserData((prev) => ({
                        ...prev!,
                        phoneNumber: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-evenly gap-3 pt-2">
                <Button variant="outline" onClick={cancelHandler}>
                  Cancel
                </Button>
                <Button
                  className="bg-blue-700 hover:bg-blue-800  "
                  onClick={handleSaveProfile}
                >
                  {isPending ? "Please Wait..." : "Save Changes"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">{`${userData?.username}`}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{userData?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">
                    {userData?.phoneNumber}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4 gap-5">
          <h2 className="text-md font-semibold text-gray-800 md:text-xl">
            Saved Addresses
          </h2>
          {!isAddingAddress && (
            <Button
              className="bg-gradient-to-br from-[#1e7ae4] to-[#052f5e] text-white px-6 py-2 rounded-md shadow-md hover:opacity-90 transition"
              onClick={() => setIsAddingAddress(true)}
            >
              <Plus />
              Add New Address
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-4">
          {!isAddingAddress &&
            addresses?.map((address: Address) => (
              <AddressComponent
                key={address?.id}
                address={address as Address}
              />
            ))}
        </div>

        {isAddingAddress && (
          <AddressForm onCancel={() => setIsAddingAddress(false)} />
        )}
      </div>
    </div>
  );
}
