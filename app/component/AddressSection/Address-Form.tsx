"use client";

import type React from "react";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { MapPin, Building, Hash, Globe, Flag, Save, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAddress } from "@/utils/DataSlice";
import { CustomToast } from "../comman/customToast"; // ✅ Updated Toast

interface AddressFormProps {
  onCancel: () => void;
}

function AddressForm({ onCancel }: AddressFormProps) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.dataSlice.userInfo);
  const userAddress = useSelector((state: any) => state.dataSlice.address);

  const [isPending, startTransition] = useTransition();

  const formSchema = z.object({
    address1: z.string().min(1, "Address Line 1 is required"),
    address2: z.string().optional(),
    pincode: z
      .string()
      .min(1, "Pincode is required")
      .max(6, "PinCode must be exactly 6"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address1: "",
      address2: "",
      pincode: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { address1, address2, city, state, pincode } = values;

    startTransition(async () => {
      try {
        const res = await axios.post("/api/address/createAddress", {
          userId: userInfo.id,
          address1,
          address2,
          city,
          state,
          pincode,
        });

        const { success, message, data } = res.data;

        if (success) {
          dispatch(setAddress([...userAddress, data]));
          onCancel();

          CustomToast({
            message,
            type: "success",
          });
        } else {
          CustomToast({
            message,
            type: "error",
          });
        }
      } catch (error: any) {
        CustomToast({
          message:
            error?.response?.data?.message ||
            "Something went wrong. Please try again.",
          type: "error",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Address Line 1 */}
        <FormField
          control={form.control}
          name="address1"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-rose-600" />
                Address Line 1
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  className="rounded-lg border-gray-300 bg-gray-50 focus:border-rose-600 focus:ring-rose-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address Line 2 */}
        <FormField
          control={form.control}
          name="address2"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <Building className="mr-2 h-4 w-4 text-rose-600" />
                Address Line 2
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  className="rounded-lg border-gray-300 bg-gray-50 focus:border-rose-600 focus:ring-rose-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pincode + City */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <Hash className="mr-2 h-4 w-4 text-rose-600" />
                  Pincode
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    maxLength={6}
                    {...field}
                    className="rounded-lg border-gray-300 bg-gray-50 focus:border-rose-600 focus:ring-rose-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <Globe className="mr-2 h-4 w-4 text-rose-600" />
                  City
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    className="rounded-lg border-gray-300 bg-gray-50 focus:border-rose-600 focus:ring-rose-600"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* State */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <Flag className="mr-2 h-4 w-4 text-rose-600" />
                State
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  className="rounded-lg border-gray-300 bg-gray-50 focus:border-rose-600 focus:ring-rose-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-gray-300 hover:border-gray-400"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>

          <Button
            type="submit"
            className="bg-gradient-to-br from-rose-600 to-rose-800 text-white px-6 py-2 rounded-md shadow-md hover:opacity-90 transition"
          >
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Please Wait..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default AddressForm;
