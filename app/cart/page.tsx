"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";

import {
  ChevronLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  CreditCard,
  TruckIcon,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useDispatch, useSelector } from "react-redux";

import {
  Cart,
  CartItems,
  setCart,
  User,
  setSelectedAddressId,
} from "@/utils/DataSlice";
import { useRouter } from "next/navigation";
import axios from "axios";

import { toast } from "sonner";
import { ImageCompo } from "@/app/component/comman/ImageCompo";
import { getActualPrice } from "@/helper/getActualPrice";
import DialogCompo from "@/app/component/comman/DialogCompo";
import EditUserInfo from "@/app/component/EditUserInfo/EditUserInfo";
import AddressSection from "@/app/component/AddressSection/AddressSection";

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const cart = useSelector((state: any) => state.dataSlice.cart) as Cart;
  let cartProducts = Array.isArray(cart.cartItems)
    ? (cart.cartItems as CartItems[])
    : ([] as CartItems[]);

  const userInfo = useSelector(
    (state: any) => state.dataSlice.userInfo
  ) as User;

  const selectedAddressId = useSelector(
    (state: any) => state.dataSlice.selectedAddressId
  );

  const [promoApplied, setPromoApplied] = useState(false);
  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);
  const [isopen, setIsOpen] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [isPaymentSuccess, setIsPaymentSuccess] = useState<boolean | null>(
    null
  );

  // Calculate cart totals
  const subtotal =
    cartProducts?.reduce(
      (total, item: CartItems) =>
        total +
        getActualPrice(item.product.price, item.product.discountPercentage) *
          item.quantity,
      0
    ) || 0;

  const shipping = subtotal > 100 ? 0 : 9.99;

  const totalAmount = promoApplied
    ? (subtotal * 0.9 + shipping).toFixed(2)
    : (subtotal + shipping).toFixed(2);

  useEffect(() => {
    if (!isPaymentSuccess) {
      dispatch(setSelectedAddressId(""));
    }
  }, [isPaymentSuccess]);

  // Update quantity
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    await axios.post("/api/cart/update-quantity", {
      itemId,
      newQuantity,
    });

    const updatedCart = {
      ...cart,
      cartItems: cartProducts.map((item: CartItems) => {
        if (item.id === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      }),
    };
    dispatch(setCart(updatedCart));
  };

  // Remove item
  const removeItem = async (itemId: string) => {
    try {
      await axios.delete(`/api/cart/delete-item?itemId=${itemId}`);
      const updatedCart = {
        ...cart,
        cartItems: cartProducts.filter((item) => item.id !== itemId),
      };
      dispatch(setCart(updatedCart));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to remove item. Please try again.");
    }
  };

  useEffect(() => {
    if (!selectedAddressId || selectedAddressId === "") return;
    confirmPayment();
  }, [selectedAddressId]);

  function checkout() {
    const { username, phoneNumber } = userInfo;

    if (!username || !phoneNumber) {
      setIsOpen(true);
      return;
    }

    setIsAddressDrawerOpen(true);
  }
  const confirmPayment = () => {
    startTransition(async () => {
      try {
        // 1️⃣ Create order on backend
        const orderRes = await axios.post("/api/order/create-order", {
          totalPrice: Number(totalAmount),
        });

        const { success, message, orderInfo } = orderRes.data;

        if (!success) {
          toast.error(message || "Unable to create order.", {
            position: "bottom-right",
            duration: 3000,
            className: "bg-red-700 text-white border border-red-600",
            style: {
              backgroundColor: "#C1292E",
              color: "white",
              border: "1px solid #3e5692",
            },
          });
          return;
        }

        // Validate required fields for Razorpay
        if (!orderInfo?.razorpayOrderId || !orderInfo?.amount) {
          toast.error("Invalid order data received from server.", {
            position: "bottom-right",
          });
          return;
        }

        // 2️⃣ Fetch Razorpay key
        const envRes = await axios.get("/api/getEnv");
        const { key_id } = envRes.data || {};
        if (!key_id) {
          toast.error("Payment configuration is missing.", {
            position: "bottom-right",
          });
          return;
        }

        // 3️⃣ Razorpay checkout config
        const options = {
          key: key_id,
          amount: orderInfo.amount,
          currency: orderInfo.currency || "INR",
          name: `${userInfo.username}`,
          description: "Order Payment",
          order_id: orderInfo.razorpayOrderId,
          method: {
            netbanking: true,
            card: true,
            upi: true,
            paylater: false,
          },
          handler: async function (response: any) {
            setIsPaymentSuccess(true); // ✅ Payment success
            try {
              // 4️⃣ Verify payment on backend
              const verifyRes = await axios.post("/api/order/verify-payment", {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                cartId: cart.id,
                products: cartProducts,
                userId: userInfo.id,
                addressId: selectedAddressId,
                totalPrice: Number(totalAmount),
              });

              const { success, message } = verifyRes.data;
              if (success) {
                // clearing cart
                dispatch(setCart({} as Cart));
                // clearing addressID from store
                //dispatch(setSelectedAddressId(""));
                toast.success("Order booked successfully!", {
                  position: "bottom-right",
                  duration: 3000,
                  className: "bg-green-700 text-white border border-green-600",
                  style: {
                    backgroundColor: "#285943",
                    color: "white",
                    border: "1px solid #3e5692",
                  },
                });
              } else {
                toast.error(message || "Payment verification failed.", {
                  position: "bottom-right",
                });
              }
            } catch (err: any) {
              console.error("Payment verification failed:", err.message);
              toast.error("Payment verification failed.", {
                position: "bottom-right",
              });
            }
          },
          modal: {
            ondismiss: function () {
              setIsPaymentSuccess(false); // ❌ User closed without paying
              toast.error("Payment window closed. Order not completed.", {
                position: "bottom-right",
              });
            },
          },
          prefill: {
            name: `${userInfo.username} `,
            contact: userInfo.phoneNumber,
          },
          theme: {
            color: "#092553",
          },
        };

        // 5️⃣ Open Razorpay Checkout
        const rzp = new (window as any).Razorpay(options);

        rzp.on("payment.failed", function (response: any) {
          setIsPaymentSuccess(false); // ❌ Payment failed
          console.error("Payment failed:", response.error);
          toast.error(
            response?.error?.description || "Payment was not completed.",
            { position: "bottom-right" }
          );
        });

        rzp.open();
      } catch (error: any) {
        console.error("Razorpay initialization failed:", error.message);
        toast.error("Something went wrong while processing your order.", {
          position: "bottom-right",
        });
      }
    });
  };

  return (
    <div>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Link
            href="/"
            className="flex items-center text-[#0047AB] hover:text-[#003380]"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="ml-auto text-2xl font-bold">Your Cart</h1>
        </div>

        {cartProducts.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="rounded-xl bg-white p-6 shadow-md">
                <div className="mb-4 flex justify-between border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-bold">Cart Items</h2>
                  <span className="text-sm text-gray-500">Price</span>
                </div>

                {/* Cart Item List */}
                <div className="space-y-6">
                  {cartProducts.map((item: CartItems, index) => (
                    <div
                      key={`${item.id}-${index}`}
                      className="flex flex-col border-b border-gray-100 pb-6 sm:flex-row cursor-pointer"
                    >
                      <div
                        className="flex-shrink-0"
                        onClick={() =>
                          router.push(`/Product/${item.product.id}`)
                        }
                      >
                        <div className="h-24 w-24 overflow-hidden rounded-lg bg-gray-50">
                          <ImageCompo
                            src={item?.product?.productImages?.[0]?.url}
                            alt={item?.product?.title || "Product image"}
                            width={96}
                            height={96}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex flex-1 flex-col justify-between sm:mt-0 sm:ml-6">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {item.product.title}
                            </h3>
                          </div>
                          <p className="font-medium text-[#0047AB]">
                            ₹
                            {getActualPrice(
                              item.product.price,
                              item.product.discountPercentage
                            )}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-gray-200">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-l-lg border-r border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="flex h-8 w-10 items-center justify-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-r-lg border-l border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex items-center text-sm text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 rounded-xl bg-white p-6 shadow-md">
                <h2 className="mb-4 text-lg font-bold">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold text-[#0047AB]">
                      ₹{(subtotal + shipping).toFixed(2)}
                    </span>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-br from-[#1e7ae4] to-[#052f5e] text-white px-6 py-2 rounded-md shadow-md hover:opacity-90 transition"
                    onClick={checkout}
                  >
                    {isPending ? "Please Wait..." : "CHECKOUT"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <div className="mt-4 space-y-3 rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <TruckIcon className="mr-2 h-4 w-4 text-[#0047AB]" />
                      Free shipping on orders over ₹100
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ShieldCheck className="mr-2 h-4 w-4 text-[#0047AB]" />
                      Secure checkout with SSL encryption
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CreditCard className="mr-2 h-4 w-4 text-[#0047AB]" />
                      We accept all major credit cards
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl bg-white p-12 text-center shadow-md">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0047AB]/10">
              <ShoppingBag className="h-10 w-10 text-[#0047AB]" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">Your cart is empty</h2>
            <p className="mt-2 text-gray-600">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link href="/" className="mt-6">
              <Button className="bg-[#0047AB] hover:bg-[#003380]">
                Start Shopping
              </Button>
            </Link>
          </div>
        )}
      </main>
      {/* Cart Floating Button for Mobile */}
      {cartProducts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 block lg:hidden">
          <Button
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0047AB] p-0 shadow-lg hover:bg-[#003380]"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {cartProducts.reduce((total, item) => total + item.quantity, 0)}
            </span>
          </Button>
        </div>
      )}
      <AddressSection
        isAddressDrawerOpen={isAddressDrawerOpen}
        setIsAddressDrawerOpen={setIsAddressDrawerOpen}
      />
      <DialogCompo isOpen={isopen} onOpenChange={() => setIsOpen(!isopen)}>
        <EditUserInfo setIsOpen={setIsOpen} />
      </DialogCompo>
    </div>
  );
}
