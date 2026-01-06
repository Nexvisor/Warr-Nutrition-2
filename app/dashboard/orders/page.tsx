"use client";
import Loader from "@/app/component/Loader";

import axios from "axios";
import { useEffect, useState, useTransition } from "react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Order, OrderItems } from "@/utils/DataSlice";

const ORDER_STATUS = ["PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
export default function Orders() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await axios.get("/api/order/getAllOrders");
        const allOrderInfo = res.data.allOrders;

        setAllOrders(allOrderInfo);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.message || "Failed to fetch orders");
      }
    });
  }, []);

  async function onStatusChange(updatedStatus: string, orderId: string) {
    await axios.post("/api/order/update-order-status", {
      orderId,
      orderStatus: updatedStatus,
    });

    const updatedOrders = allOrders.map((order: Order) => {
      if (order.id === orderId) {
        return { ...order, status: updatedStatus };
      }
      return order;
    });
    setAllOrders(updatedOrders as Order[]);
  }

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="flex py-6 px-8 justify-center items-center bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-4 w-full max-w-7xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800">All Orders</h2>

        <Accordion type="single" collapsible className="space-y-3">
          {allOrders.map((order) => (
            <AccordionItem
              key={order.id}
              value={order.id}
              className="rounded-xl border bg-white shadow-sm"
            >
              {/* ================= HEADER ================= */}
              <AccordionTrigger className="px-5 py-4 hover:no-underline">
                <div className="flex w-full items-center justify-between">
                  {/* Left */}
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(order.createdAt), "dd MMM yyyy")}
                    </p>
                  </div>

                  {/* Right */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{order.total}
                    </p>

                    <span
                      className={`mt-1 inline-block rounded-md px-2 py-0.5 text-xs font-medium ${
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : order.status === "SHIPPED"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "PAID"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>

              {/* ================= CONTENT ================= */}
              <AccordionContent className="px-5 pb-5">
                <div className="space-y-5 text-sm text-gray-700">
                  {/* ITEMS */}
                  <div className="space-y-3">
                    {order.orderItems.map((item: OrderItems) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.product.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty × {item.quantity}
                          </p>
                        </div>

                        <p className="font-medium">
                          ₹{item.orderPrice * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* PROMO */}
                  {order.promoCode ? (
                    <div className="inline-flex w-fit items-center gap-2 rounded-md bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700">
                      Promo: {order.promoCode.code} −{order.promoCode.discount}%
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">
                      No promo code applied
                    </p>
                  )}

                  {/* ADDRESS */}
                  <div className="rounded-lg bg-gray-50 p-3 text-xs">
                    <p>{order.address.address1}</p>
                    {order.address.address2 && <p>{order.address.address2}</p>}
                    <p>
                      {order.address.city}, {order.address.state}{" "}
                      {order.address.pincode}
                    </p>
                  </div>

                  {/* USER */}
                  <div className="text-xs text-gray-600">
                    <p>
                      <span className="font-medium">User:</span>{" "}
                      {order.user.username || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {order.user.phoneNumber}
                    </p>
                    {order.user.email && (
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {order.user.email}
                      </p>
                    )}
                  </div>

                  {/* STATUS UPDATE (ADMIN OPTIONAL) */}
                  {onStatusChange && order.status !== "DELIVERED" && (
                    <div className="w-40">
                      <Select
                        defaultValue={order.status}
                        onValueChange={(val) => onStatusChange(val, order.id)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {ORDER_STATUS.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
