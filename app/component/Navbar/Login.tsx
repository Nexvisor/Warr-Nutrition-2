"use client";
import React, { useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { OTPVerification } from "@/app/component/comman/OtpVerification";
import { CustomToast } from "../comman/customToast";

// Taking email only for login
const FormSchema = z.object({
  email: z.email("Email is required"),
});

function Login() {
  const [isPending, startTransition] = useTransition();
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState({});
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  // Function to handle form submission
  function onSubmit(values: z.infer<typeof FormSchema>) {
    // Start a transition for async UI updates (prevents blocking the UI)
    startTransition(async () => {
      try {
        // Send a POST request to the backend API to register or request OTP
        const res = await axios.post("/api/auth/register", {
          email: values.email,
        });

        // Destructure response data
        const { success, message, user } = res.data;

        // If registration/OTP request succeeded
        if (success) {
          // Show success notification with green color and icon
          CustomToast({
            message,
            type: "success",
            icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          });

          // Save the entered email in state
          setEmail(values.email);

          // Display the OTP input form
          setShowOtpForm(true);

          // Store user details in state
          setUser(user);

          // Save user ID in local storage for later use
          localStorage.setItem("userId", user.id);
        } else {
          // If server responded with failure, show error toast with red color and icon
          CustomToast({
            message,
            type: "error",
            icon: <XCircle className="w-5 h-5 text-red-600" />,
          });
        }
      } catch (error: any) {
        // Handle errors (e.g., network issues or API failure)
        console.error("Login error:", error);

        // Show an error toast with message from server or default message
        CustomToast({
          message: "Failed to send OTP. Please try again",
          type: "error",
          icon: <XCircle className="w-5 h-5 text-red-600" />,
        });
      }
    });
  }

  if (showOtpForm) {
    return (
      <OTPVerification
        email={email}
        user={user}
        onBack={() => {
          setShowOtpForm(false);
          setEmail("");
        }}
        title="OTP Verification"
        description="Enter the OTP sent to your email to continue."
      />
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#D7223B]">Welcome Back!</h2>
        <p className="text-gray-500 text-sm mt-1">Enter your email to login.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-10 border-gray-300 focus:border-[#32C5F8] focus:ring-[#32C5F8]"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-br from-[#B50D27] to-[#DA203A] text-white px-6 py-2.5 rounded-md shadow-md hover:opacity-90 transition-all duration-300"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Sending OTP..." : "Continue with Email"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default Login;
