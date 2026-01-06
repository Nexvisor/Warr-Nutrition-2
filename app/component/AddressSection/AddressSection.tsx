"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import AddressComponent from "./Address-Component";
import AddressForm from "./Address-Form";
import { Plus, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { Address, setSelectedAddressId } from "@/utils/DataSlice";

interface AddressSectionProps {
  isAddressDrawerOpen: boolean;
  setIsAddressDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddressSection({
  isAddressDrawerOpen,
  setIsAddressDrawerOpen,
}: AddressSectionProps) {
  const dispatch = useDispatch();
  const userAddress = useSelector((state: any) => state.dataSlice.address);
  const selectedAddressId = useSelector(
    (state: any) => state.dataSlice.selectedAddressId
  );

  const [showAddressForm, setShowAddressForm] = useState(false);

  return (
    <Sheet open={isAddressDrawerOpen} onOpenChange={setIsAddressDrawerOpen}>
      <SheetContent
        side="bottom"
        className="h-[80vh] overflow-y-auto p-5 md:p-8 bg-white rounded-t-2xl shadow-lg border-t-4 border-[#F9C2C7]" // 🌹
      >
        {/* 🌹 Header */}
        <SheetHeader className="border-b border-gray-100 pb-3">
          <SheetTitle className="text-xl font-semibold text-[#B50D27]">
            Select Delivery Address
          </SheetTitle>
        </SheetHeader>

        {/* 🌹 Content */}
        {!showAddressForm ? (
          <div className="mt-6 space-y-4">
            {/* Empty State */}
            {userAddress.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-10 bg-[#FFF6F7] rounded-lg border border-[#F9C2C7]">
                <Building className="h-10 w-10 text-[#B50D27] mb-3" />
                <h2 className="text-lg font-medium text-gray-800">
                  No Address Yet
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Add your first delivery address below.
                </p>
              </div>
            ) : (
              // Address List
              userAddress?.map((address: Address) => (
                <AddressComponent
                  key={address?.id}
                  address={address as Address}
                  isSelected={selectedAddressId === address.id}
                  onSelect={() => {
                    dispatch(setSelectedAddressId(address?.id));
                    setIsAddressDrawerOpen(false);
                  }}
                />
              ))
            )}

            {/* 🌹 Add New Address Button */}
            <Button
              onClick={() => setShowAddressForm(true)}
              className="mt-6 w-full bg-gradient-to-r from-[#B50D27] to-[#DA203A] hover:opacity-90 text-white font-semibold rounded-md py-3 shadow-md hover:shadow-lg transition-all"
              variant="default"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          </div>
        ) : (
          <div className="mt-6">
            <AddressForm onCancel={() => setShowAddressForm(false)} />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default AddressSection;
