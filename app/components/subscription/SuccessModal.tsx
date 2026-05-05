"use client";

import { CheckCircle, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SuccessModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const isSuccess = searchParams.get("success") === "true";
  const email = searchParams.get("email") || "your email";
  const magazineName = "Aeromagasia";

  useEffect(() => {
    if (isSuccess) {
      setIsOpen(true);
    }
  }, [isSuccess]);

  const handleClose = () => {
    setIsOpen(false);
    // Remove query params from URL without refreshing
    const params = new URLSearchParams(searchParams.toString());
    params.delete("success");
    params.delete("email");
    params.delete("plan_id");
    router.replace(`/${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <DialogTitle className="text-2xl font-semibold text-center">
            Thank You for Subscribing!
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-300 text-center">
            Your subscription to {magazineName} has been successfully processed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Check your email</p>
                <p className="text-sm">
                  We&apos;ve sent a confirmation email to{" "}
                  <span className="font-medium">{email}</span> with your
                  subscription details and next steps.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <Button onClick={handleClose} className="w-full sm:w-auto">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
