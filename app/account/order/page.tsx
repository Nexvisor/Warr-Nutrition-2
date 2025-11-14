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

  const getOrderTotal = (order: Order) =>
    order.orderItems.reduce(
      (acc, item) => acc + Number(item.orderPrice) * Number(item.quantity),
      0
    );

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-14">
          <Package className="h-14 w-14 mx-auto text-rose-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No orders yet</h3>
          <p className="text-gray-500 mt-1">
            When you place orders, they will appear here.
          </p>

          <Button
            className="mt-4 bg-gradient-to-r from-rose-600 to-rose-700 text-white hover:opacity-90 shadow-md"
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
              className="border border-gray-200 shadow-sm rounded-xl overflow-hidden"
            >
              {/* ORDER HEADER */}
              <div className="bg-rose-50 p-4 flex justify-between items-center border-b border-rose-100">
                <div>
                  <p className="text-gray-900 font-medium">
                    Order #{String(order.id).slice(0, 8)}
                  </p>

                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* ORDER BODY */}
              <div className="p-5">
                <div className="space-y-3">
                  {order.orderItems.map((item: OrderItems, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.product?.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900">
                        ₹{Number(item.orderPrice) * Number(item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* ADDRESS & Total */}
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div className="text-sm text-gray-600 max-w-[60%]">
                    <div className="flex items-start gap-1">
                      <Building className="h-4 w-4 text-rose-600" />
                      <div className="space-y-0.5">
                        <p>{order.address?.address1}</p>
                        {order.address?.address2 && (
                          <p>{order.address?.address2}</p>
                        )}
                        <p>
                          {order.address?.city}, {order.address?.state}{" "}
                          {order.address?.pincode}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-bold text-gray-900">
                      ₹{getOrderTotal(order)}
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
