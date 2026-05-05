"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitSubscription } from "@/lib/action/submitSubscription";
import { useSubStore } from "@/store/subscriptionStore";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailFormData = z.infer<typeof emailSchema>;

export default function Step1() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [alreadySubscribed, setAlreadySubscribed] = useState<string | null>(
    null,
  );
  const { data, setData, resetSubs } = useSubStore();

  const goHome = () => {
    resetSubs();
    router.push("/");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: data.email,
    },
  });

  const sendVerificationEmail = async (formData: EmailFormData) => {
    setIsLoading(true);
    setError("");
    setAlreadySubscribed(null);
    const response = await submitSubscription({
      step: "1",
      email: formData.email,
    });
    if (response.success) {
      setData("email", formData.email);
      setData("currentStep", 2);
    } else if (response.alreadySubscribed) {
      setAlreadySubscribed(
        response.error ?? "You already have an active subscription.",
      );
      setIsLoading(false);
    } else if (response.error) {
      setError(response.error);
      setIsLoading(false);
    } else {
      setError("Failed to send verification email. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 ">
      <form
        onSubmit={handleSubmit(sendVerificationEmail)}
        className="space-y-4"
      >
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
            className="mt-3 w-full bg-white border placeholder:font-normal placeholder:text-gray-500 placeholder:text-sm md:min-w-[400px]  border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
            placeholder="Enter your email address"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm font-medium text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )} */}

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

      {/* Already subscribed modal */}
      <Dialog
        open={!!alreadySubscribed}
        onOpenChange={(open) => {
          if (!open) goHome();
        }}
        modal={true}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-amber-500" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-center">
              Active Subscription
            </DialogTitle>
            <DialogDescription className="text-base text-center">
              {alreadySubscribed}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center pt-4">
            <Button onClick={goHome} className="w-full sm:w-auto">
              Go Home
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
