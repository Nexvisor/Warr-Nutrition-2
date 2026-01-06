"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { Package, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { Order, OrderItems } from "@/utils/DataSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/store";

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([] as Order[]);
  const userInfo = useSelector((state: RootState) => state.dataSlice.userInfo);

  useEffect(() => {
    if (!userInfo?.id) return;

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const ordersRes = await axios.get(
          `/api/order/getOrder?userId=${userInfo.id}`,
          {
            signal: controller.signal,
          }
        );
        setOrders(ordersRes.data.orders);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Fetch Orders Error:", err);
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, [userInfo.id]);

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">Your Orders</h2>

      {orders.length === 0 ? (
        <div className="py-16 text-center">
          <Package className="mx-auto mb-4 h-14 w-14 text-rose-300" />
          <h3 className="text-lg font-semibold text-gray-900">No orders yet</h3>
          <p className="mt-1 text-gray-500">
            When you place orders, they will appear here.
          </p>

          <Button
            className="mt-5 bg-rose-600 text-white hover:bg-rose-700"
            onClick={() => router.push("/")}
          >
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: Order) => (
            <Card
              key={order.id}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between bg-rose-50 px-5 py-4 border-b">
                <div>
                  <p className="font-medium text-gray-900">
                    Order #{String(order.id).slice(0, 8)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    order.status === "DELIVERED"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* BODY */}
              <div className="p-5 space-y-4">
                {/* ITEMS */}
                {order.orderItems.map((item: OrderItems, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.product?.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-gray-900">
                      ₹{Number(item.orderPrice) * Number(item.quantity)}
                    </p>
                  </div>
                ))}

                <Separator />

                {/* FOOTER */}
                <div className="flex flex-wrap justify-between gap-4">
                  {/* ADDRESS */}
                  <div className="flex max-w-[65%] gap-2 text-sm text-gray-600">
                    <Building className="mt-0.5 h-4 w-4 text-rose-600" />
                    <div className="space-y-0.5">
                      <p>{order.address?.address1}</p>
                      {order.address?.address2 && (
                        <p>{order.address.address2}</p>
                      )}
                      <p>
                        {order.address?.city}, {order.address?.state}{" "}
                        {order.address?.pincode}
                      </p>
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div className="text-right space-y-1">
                    {order.promoCode && (
                      <div className="mb-1 inline-flex items-center gap-2 rounded-md bg-rose-100 px-2 py-1 text-xs text-rose-700">
                        <span className="font-medium">
                          {order.promoCode.code}
                        </span>
                        <span>−{order.promoCode.discount}%</span>
                      </div>
                    )}

                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-bold text-gray-900">
                      ₹{order.total}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
