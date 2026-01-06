"use client";
import React, { useState, useTransition } from "react";
import UploadImage from "@/app/component/UploadImage";
import { Toaster } from "sonner";
// import {
//   ImageKitAbortError,
//   ImageKitInvalidRequestError,
//   ImageKitServerError,
//   ImageKitUploadNetworkError,
//   upload,
// } from "@imagekit/next";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/utils/store";
import {
  Benefit,
  ProductCategory,
  ProductFlavor,
  setProducts,
} from "@/utils/DataSlice";
import DialogCompo from "@/app/component/DialogCompo";
import AddCategory from "@/app/component/AddProductSection/AddCategory";
import AddFlavour from "@/app/component/AddProductSection/AddFlavour";

import { FileWithPreview } from "@/FrontendSchema/FileWithPreview.Schema";
import uploadToImageKit from "@/helper/imageKitAuthanticator";
import { CustomToast } from "../comman/customToast";

interface AddProductCompoType {
  closeProductDialog: (value: React.SetStateAction<boolean>) => void;
}
function AddProductCompo({ closeProductDialog }: AddProductCompoType) {
  const dispatch = useDispatch();

  const products = useSelector((state: RootState) => state.dataSlice.products);

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isAddCategoryCompo, setIsCategoryCompo] = useState(false);
  const [isAddFlavorCompo, setIsAddFlavourCompo] = useState(false);
  const [isPending, startTransition] = useTransition();

  const productCategorys = useSelector(
    (state: RootState) => state.dataSlice.productCategories
  );
  const productFlavors = useSelector(
    (state: RootState) => state.dataSlice.productFlavors
  );

  const BenefitSchema = z.object({
    id: z.string(),
    topic: z.string().min(1, { message: "Topic is required" }),
    description: z.string().min(1, { message: "Description is required" }),
  });

  const NutritionSchema = z.object({
    id: z.string(),
    nutrition: z.string().min(1, { message: "Nutrition name is required" }),
    quantity: z.string().optional(),
  });

  const ProductSchema = z.object({
    title: z.string().min(1, { message: "Product name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    price: z.number().min(0, { message: "Price cannot be 0" }),
    discountPercentage: z.number().min(0).optional(),
    stock: z.number().min(0, { message: "Stock cannot be negative" }),
    category: z.string().min(1, { message: "Category is required" }),
    flavor: z.string().optional(),
    weight: z.string({ message: "Weight is required" }),
    keyBenefits: z
      .array(BenefitSchema)
      .min(1, { message: "At least one key benefit is required" }),
    productHighlights: z
      .array(
        z.object({
          value: z.string().min(1, { message: "Highlight is required" }),
        })
      )
      .min(1, { message: "At least one product highlight is required" }),
    nutritionInformation: z
      .array(NutritionSchema)
      .min(1, { message: "At least one nutrition item is required" }),
  });

  // useForm hook
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      discountPercentage: 0,
      stock: 0,
      category: "",
      flavor: "", // optional field
      weight: "",
      keyBenefits: [{ id: crypto.randomUUID(), topic: "", description: "" }],
      productHighlights: [{ value: "" }],
      nutritionInformation: [
        { id: crypto.randomUUID(), nutrition: "", quantity: "" },
      ],
    },
  });

  const addProduct = (values: z.infer<typeof ProductSchema>) => {
    let {
      title,
      description,
      price,
      discountPercentage,
      stock,
      category,
      flavor,
      weight,
      keyBenefits,
      productHighlights,
      nutritionInformation,
    } = values;

    startTransition(async () => {
      try {
        if (files.length === 0) {
          CustomToast({
            message: "Please add at least one product image",
            type: "error",
          });
          return;
        }

        const imageUrls = await uploadToImageKit(files);

        const filteredUrls = imageUrls.filter((url) => url !== null);

        const newProductHighlights = productHighlights.map(
          (highlight: any) => highlight.value
        );
        const categoryId = productCategorys.find(
          (cat: ProductCategory) => cat.category === category
        )?.id;
        const flavorId = productFlavors.find(
          (fav: ProductFlavor) => fav.flavor === flavor
        )?.id;

        try {
          const req = await axios.post("/api/Products/add-product", {
            title,
            description,
            imageUrls: filteredUrls,
            price: Number(price),
            discountPercentage: Number(discountPercentage),
            stock: Number(stock),
            categoryId,
            flavorId,
            weight,
            keyBenefits: keyBenefits.map((benefit: Benefit) => ({
              topic: benefit.topic,
              description: benefit.description,
            })),
            nutritionInformation: nutritionInformation.map(
              (nutrition: any) => ({
                nutrition: nutrition.nutrition,
                quantity: nutrition.quantity,
              })
            ),
            productHighlights: newProductHighlights,
          });
          const { success, message, data } = req.data;
          if (success) {
            dispatch(setProducts([...products, data]));
            closeProductDialog(false);
            CustomToast({
              message: "Product added successfully!",
              type: "success",
            });

            setFiles([]);
            form.reset();
          } else {
            CustomToast({
              message,
              type: "error",
            });
          }
        } catch (error) {
          console.error("Error adding product:", error);

          CustomToast({
            message: "Failed to add product",
            type: "error",
          });
        }
      } catch (err) {
        console.error("Unexpected error in product creation flow:", err);
        CustomToast({
          message: "Something went wrong",
          discription: "Unexpected error occurred. Try again later.",
          type: "error",
        });
      }
    });
  };

  const {
    fields: nutritionFields,
    append: addNutrition,
    remove: removeNutrition,
  } = useFieldArray({
    control: form.control,
    name: "nutritionInformation",
  });
  const {
    fields: keyBenefitFeilds,
    append: addKeyBenefit,
    remove: removeKeyBenfit,
  } = useFieldArray({
    control: form.control,
    name: "keyBenefits",
  });

  const {
    fields: productHighlights,
    append: addHighlight,
    remove: removeHighlight,
  } = useFieldArray({
    control: form.control,
    name: "productHighlights",
  });

  return (
    <div className="p-4 md:p-8">
      <Toaster richColors />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">
          Add New Product
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(addProduct)}
                className="space-y-6"
              >
                {/* Product Name */}
                <div className="space-y-1">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Product Name
                        </FormLabel>
                        <Input
                          placeholder="Enter product name"
                          required
                          className="rounded-lg border-gray-300 bg-gray-50 focus:border-red-500 focus:ring-red-500"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Description
                        </FormLabel>
                        <Textarea
                          rows={4}
                          placeholder="Enter product description"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Category
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              {field.value || "Select Category"}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <div>
                              {productCategorys.map(
                                (category: ProductCategory) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.category}
                                  >
                                    {category.category}
                                  </SelectItem>
                                )
                              )}
                              <Button
                                className="w-full mt-2"
                                onClick={() => setIsCategoryCompo(true)}
                              >
                                <Plus /> Add Category
                              </Button>
                            </div>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-1">
                  <Label>Product Images</Label>
                  <UploadImage files={files} setFiles={setFiles} />
                </div>

                {/* Pricing and Inventory */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing & Inventory</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-sm font-medium text-gray-700">
                                ₹ Price
                              </FormLabel>
                              <Input
                                placeholder="10"
                                type="number"
                                {...field}
                                onChange={(e) => {
                                  // Convert string input to number or empty string if invalid
                                  const value = e.target.value;
                                  const parsed =
                                    value === "" ? "" : Number(value);
                                  field.onChange(parsed);
                                }}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="discountPercentage"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Discount Percentage (%)
                              </FormLabel>
                              <Input
                                placeholder="10"
                                type="number"
                                {...field}
                                onChange={(e) => {
                                  // Convert string input to number or empty string if invalid
                                  const value = e.target.value;
                                  const parsed =
                                    value === "" ? "" : Number(value);
                                  field.onChange(parsed);
                                }}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="stock"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Stock Quantity *
                              </FormLabel>
                              <Input
                                placeholder="0"
                                type="number"
                                {...field}
                                onChange={(e) => {
                                  // Convert string input to number or empty string if invalid
                                  const value = e.target.value;
                                  const parsed =
                                    value === "" ? "" : Number(value);
                                  field.onChange(parsed);
                                }}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Weight
                              </FormLabel>
                              <Input
                                placeholder="e.g., 2 lbs, 1 kg"
                                {...field}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="flavor"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Flavor
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    {field.value || "Select Flavor"}
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <div>
                                    {productFlavors.map(
                                      (flavor: ProductFlavor) => (
                                        <SelectItem
                                          key={flavor.id}
                                          value={flavor.flavor}
                                        >
                                          {flavor.flavor}
                                        </SelectItem>
                                      )
                                    )}
                                    <Button
                                      className="w-full mt-2"
                                      onClick={() => setIsAddFlavourCompo(true)}
                                    >
                                      <Plus /> Add Flavor
                                    </Button>
                                  </div>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Nutrition Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      Nutrition Information
                      <Button
                        type="button"
                        onClick={() =>
                          addNutrition({
                            id: Date.now().toString(),
                            nutrition: "",
                            quantity: "",
                          })
                        }
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Nutrition
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {nutritionFields.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`nutritionInformation.${index}.nutrition`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <Input placeholder="e.g., Protein" {...field} />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`nutritionInformation.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem className="w-32">
                              <Input placeholder="e.g., 25g" {...field} />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {nutritionFields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeNutrition(index)}
                            className="mt-5 cursor-pointer bg-red-500 text-white hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Key Benefits */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      Key Benefits
                      <Button
                        type="button"
                        onClick={() =>
                          addKeyBenefit({
                            id: Date.now().toString(),
                            topic: "",
                            description: "",
                          })
                        }
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Benefit
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {keyBenefitFeilds.map((field, index) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`keyBenefits.${index}.topic`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <Input
                                placeholder="Benefit topic (e.g., Muscle Growth)"
                                {...field}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`keyBenefits.${index}.description`}
                          render={({ field }) => (
                            <FormItem className="w-64">
                              <Textarea
                                placeholder="Benefit description"
                                rows={2}
                                {...field}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {keyBenefitFeilds.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeKeyBenfit(index)}
                            className="mt-5 cursor-pointer bg-red-500 text-white hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Highlights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      Highlights
                      <Button
                        type="button"
                        onClick={() => addHighlight({ value: "" })}
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Highlight
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {productHighlights.map((field, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`productHighlights.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <Input
                                placeholder="Enter product highlight"
                                {...field}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {productHighlights.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeHighlight(index)}
                            className="mt-5 cursor-pointer bg-red-500 text-white hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <Button
                    type="submit"
                    className="bg-red-800 hover:bg-red-900 text-white w-32"
                  >
                    {isPending ? "Please Wait..." : "Add Product"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      {/* for adding new categories */}
      <DialogCompo
        isOpen={isAddCategoryCompo}
        onOpenChange={() => setIsCategoryCompo((prev: boolean) => !prev)}
      >
        <AddCategory onClose={() => setIsCategoryCompo(false)} />
      </DialogCompo>
      {/* for adding new flavours */}
      <DialogCompo
        isOpen={isAddFlavorCompo}
        onOpenChange={() => setIsAddFlavourCompo((prev: boolean) => !prev)}
      >
        <AddFlavour onClose={() => setIsAddFlavourCompo(false)} />
      </DialogCompo>
    </div>
  );
}

export default AddProductCompo;
