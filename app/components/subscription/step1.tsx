"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitSubscription } from "@/lib/action/submitSubscription";
import { useSubStore } from "@/store/subscriptionStore";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface ActiveSubWarning {
  subscriberName: string;
  planName: string;
  endDate: string;
  daysRemaining: number;
}

export default function Step1() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSubWarning, setActiveSubWarning] = useState<ActiveSubWarning | null>(null);
  const [pendingEmail, setPendingEmail] = useState("");
  const { data, setData } = useSubStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: data.email,
    },
  });

  const proceed = (email: string) => {
    setData("email", email);
    setData("currentStep", 2);
  };

  const sendVerificationEmail = async (formData: EmailFormData) => {
    setIsLoading(true);
    setError("");
    setActiveSubWarning(null);
    const response = await submitSubscription({
      step: "1",
      email: formData.email,
    });

    if (response.success && response.hasActiveSubscription) {
      setPendingEmail(formData.email);
      setActiveSubWarning({
        subscriberName: response.subscriberName ?? "",
        planName: response.planName ?? "",
        endDate: response.endDate ?? "",
        daysRemaining: response.daysRemaining ?? 0,
      });
      setIsLoading(false);
    } else if (response.success) {
      proceed(formData.email);
    } else if (response.error) {
      setError(response.error);
      setIsLoading(false);
    } else {
      setError("Failed to verify email. Please try again.");
      setIsLoading(false);
    }
  };

  if (activeSubWarning) {
    return (
      <div className="space-y-6 max-w-md">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 text-base">Active Subscription Found</h3>
              <p className="text-sm text-amber-800 mt-1">
                <strong>{activeSubWarning.subscriberName}</strong> already has an active{" "}
                <strong>{activeSubWarning.planName}</strong> subscription valid until{" "}
                <strong>{activeSubWarning.endDate}</strong> ({activeSubWarning.daysRemaining} days
                remaining).
              </p>
              <p className="text-sm text-amber-700 mt-2">
                A new subscription will start from today and overlap with the existing one.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              setActiveSubWarning(null);
              setPendingEmail("");
              reset({ email: "" });
            }}
          >
            Use Different Email
          </Button>
          <Button
            type="button"
            className="flex-1 dark:text-white!"
            onClick={() => proceed(pendingEmail)}
          >
            Continue Anyway
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(sendVerificationEmail)} className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-medium">Verify Email</h3>
          <p className="text-gray-500 text-[15px] mb-7">
            Please provide your email to proceed with the subscription process.
          </p>
          <Label htmlFor="email" className="text-[16px]">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            className="mt-3 w-full bg-white border placeholder:font-normal placeholder:text-gray-500 placeholder:text-sm md:min-w-[400px] border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
            placeholder="Enter your email address"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm font-medium text-red-500">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full dark:text-white! cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            "Next"
          )}
        </Button>

        {error && (
          <p className="text-center font-medium text-primary m-0">{error}</p>
        )}
      </form>
    </div>
  );
}
