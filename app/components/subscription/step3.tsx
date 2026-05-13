"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Script from "next/script";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Slide, toast } from "react-toastify";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INDIA_CITIES, INDIA_STATES } from "@/lib/india-locations";
import { submitSubscription } from "@/lib/action/submitSubscription";
import { verifySubscription } from "@/lib/action/verifySubscription";
import {
  type Address,
  type Subscriber,
  useSubStore,
} from "@/store/subscriptionStore";

export interface RazorResponse {
  razorpay_subscription_id?: string;
  razorpay_order_id?: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
}

const addressSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    company_name: z.string().optional(),
    phone_number: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number is too long"),
    billingAddress: z.object({
      address1: z.string().min(1, "Address is required"),
      address2: z.string().optional(),
      state: z.string().min(1, "State is required"),
      city: z.string().min(1, "City is required"),
      pincode: z
        .string()
        .min(6, "Pincode must be at least 6 digits")
        .max(6, "Pincode must be exactly 6 digits"),
    }),
    sameAsBilling: z.boolean(),
    shippingAddress: z
      .object({
        address1: z.string(),
        address2: z.string().optional(),
        state: z.string(),
        city: z.string(),
        pincode: z.string(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.sameAsBilling && data.shippingAddress) {
        return (
          data.shippingAddress.address1.length > 0 &&
          data.shippingAddress.state.length > 0 &&
          data.shippingAddress.city.length > 0 &&
          data.shippingAddress.pincode.length >= 6
        );
      }
      return true;
    },
    {
      message: "Shipping address is required when not same as billing",
      path: ["shippingAddress"],
    },
  );

type AddressFormData = z.infer<typeof addressSchema>;

export default function Step3() {
  const { data, setData } = useSubStore();
  const [isLoading, setIsLoading] = useState(false);
  const [billingCityIsOther, setBillingCityIsOther] = useState(false);
  const [shippingCityIsOther, setShippingCityIsOther] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: data.subscriber?.billing_address?.name || "",
      company_name: data.subscriber?.company_name || "",
      phone_number: data.subscriber?.billing_address?.phone_number || "",
      billingAddress: {
        address1: data.subscriber?.billing_address?.address1 || "",
        address2: data.subscriber?.billing_address?.address2 || "",
        state: data.subscriber?.billing_address?.state || "",
        city: data.subscriber?.billing_address?.city || "",
        pincode: data.subscriber?.billing_address?.pincode || "",
      },
      sameAsBilling: data.sameAsBilling,
      shippingAddress: {
        address1: data.subscriber?.shipping_address?.address1 || "",
        address2: data.subscriber?.shipping_address?.address2 || "",
        state: data.subscriber?.shipping_address?.state || "",
        city: data.subscriber?.shipping_address?.city || "",
        pincode: data.subscriber?.shipping_address?.pincode || "",
      },
    },
  });

  const watchSameAsBilling = watch("sameAsBilling");
  const watchBillingState = watch("billingAddress.state");
  const watchShippingState = watch("shippingAddress.state");

  const billingCities = watchBillingState
    ? (INDIA_CITIES[watchBillingState as keyof typeof INDIA_CITIES] ?? [])
    : [];
  const shippingCities = watchShippingState
    ? (INDIA_CITIES[watchShippingState as keyof typeof INDIA_CITIES] ?? [])
    : [];

  const onSubmit = async (formData: AddressFormData) => {
    setIsLoading(true);

    // Create billing address
    const billingAddress: Address = {
      email: data.email || "",
      name: formData.name,
      phone_number: formData.phone_number,
      address1: formData.billingAddress.address1,
      address2: formData.billingAddress.address2 || "",
      city: formData.billingAddress.city,
      state: formData.billingAddress.state,
      pincode: formData.billingAddress.pincode,
    };

    // Create shipping address (same as billing or separate)
    const shippingAddress: Address = formData.sameAsBilling
      ? billingAddress
      : {
          email: data.email || "",
          name: formData.name,
          phone_number: formData.phone_number,
          address1: formData.shippingAddress?.address1 || "",
          address2: formData.shippingAddress?.address2 || "",
          city: formData.shippingAddress?.city || "",
          state: formData.shippingAddress?.state || "",
          pincode: formData.shippingAddress?.pincode || "",
        };

    // Create subscriber object
    const subscriber: Subscriber = {
      email: data.email || "",
      company_name: formData.company_name || undefined,
      billing_address: billingAddress,
      shipping_address: shippingAddress,
    };

    // Update store with subscriber data
    setData("subscriber", subscriber);
    setData("sameAsBilling", formData.sameAsBilling);

    if (!subscriber || !data.subscription || !data.payment) return;

    if (data.subscription.auto_renew === undefined) {
      console.warn("WARNING: auto_renew is undefined, defaulting to false");
    }

    const apiPayload = {
      step: "2",
      subscriber: subscriber,
      subscription: data.subscription,
      payment: data.payment,
    };

    try {
      const result = await submitSubscription(apiPayload);
      if (result.success) {
        const paymentData = {
          key: result.data.key_id,

          // Use subscription OR order based on auto_renew
          subscription_id:
            data.subscription.auto_renew === true
              ? result.data.razorpay_subscription_id
              : undefined,

          order_id:
            data.subscription.auto_renew === false
              ? result.data.razorpay_order_id
              : undefined,

          handler: async function (response: RazorResponse) {
            const verifyPayload = {
              step: "payment_verify",

              ...(data.subscription?.auto_renew === true
                ? {
                    razorpay_subscription_id: response.razorpay_subscription_id,
                  }
                : { razorpay_order_id: response.razorpay_order_id }),

              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };
            console.log("verifySubscription payload:", verifyPayload);
            const res = await verifySubscription(verifyPayload);
            console.log("verifySubscription response:", res);
            if (res.success) {
              setData('currentStep', 4);
            } else {
              const errorMsg = res.error || res.message || 'Verification failed. Contact support.';
              toast.error(
                `Payment received but verification failed: ${errorMsg}. Please contact support with payment ID: ${response.razorpay_payment_id}`,
                {
                  position: 'bottom-right',
                  autoClose: 10000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: false,
                  theme: 'light',
                },
              );
            }
          },
        };

        if (!paymentData.key) {
          throw new Error("Razorpay key is missing from the response");
        }

        const payment = new window.Razorpay(paymentData);
        payment.open();
      } else {
        // Show error message from backend or generic error
        const errorMessage = result.error || "Something went wrong";
        const errorDetails = result.status ? ` (Error ${result.status})` : "";

        toast.error(`Oops! ${errorMessage}${errorDetails}`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
          transition: Slide,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("An error occurred. Please try again.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        theme: "light",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

      <div className="space-y-6 lg:w-[700px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[16px]">
              Full Name
            </Label>
            <Input
              className="mt-3 w-full border placeholder:font-normal bg-white placeholder:text-gray-500 placeholder:text-sm lg:min-w-[400px] border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
              id="name"
              type="text"
              placeholder="Enter your full name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="company_name" className="text-[16px]">
              Company Name
            </Label>
            <Input
              className="mt-3 w-full border placeholder:font-normal bg-white placeholder:text-gray-500 placeholder:text-sm lg:min-w-[400px] border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
              id="company_name"
              type="text"
              placeholder="Enter your company name"
              {...register("company_name")}
            />
            {errors.company_name && (
              <p className="text-sm text-red-500">
                {errors.company_name.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone_number" className="text-[16px]">
              Phone Number
            </Label>
            <Input
              className="mt-3 w-full border placeholder:font-normal bg-white placeholder:text-gray-500 placeholder:text-sm lg:min-w-[400px] border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
              id="phone_number"
              type="tel"
              placeholder="Enter your phone number"
              {...register("phone_number")}
            />
            {errors.phone_number && (
              <p className="text-sm text-red-500">
                {errors.phone_number.message}
              </p>
            )}
          </div>

          {/* Billing Address */}
          <div>
            <h3 className="text-lg mb-4 font-semibold text-primary">
              Billing Address
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="billing-address1" className="text-[16px]">
                  Address Line 1
                </Label>
                <Input
                  className="mt-3 w-full border placeholder:font-normal bg-white placeholder:text-gray-500 placeholder:text-sm lg:min-w-[400px] border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
                  id="billing-address1"
                  placeholder="Enter your address"
                  {...register("billingAddress.address1")}
                />
                {errors.billingAddress?.address1 && (
                  <p className="text-sm text-red-500">
                    {errors.billingAddress.address1.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="billing-address2" className="text-[16px]">
                  Address Line 2 (Optional)
                </Label>
                <Input
                  className="mt-3 w-full border placeholder:font-normal bg-white placeholder:text-gray-500 placeholder:text-sm lg:min-w-[400px] border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
                  id="billing-address2"
                  placeholder="Apartment, suite, etc."
                  {...register("billingAddress.address2")}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[16px]">State</Label>
                  <Controller
                    name="billingAddress.state"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                            field.onChange(val);
                            setValue("billingAddress.city", "");
                            setBillingCityIsOther(false);
                          }}
                      >
                        <SelectTrigger className="mt-3 w-full border bg-white border-gray-300 rounded-md px-4 h-[40px] text-xs focus:ring-0">
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[260px]">
                          {INDIA_STATES.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.billingAddress?.state && (
                    <p className="text-sm text-red-500">
                      {errors.billingAddress.state.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-[16px]">City</Label>
                  <Controller
                    name="billingAddress.city"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select
                          value={billingCityIsOther ? "__other__" : field.value}
                          onValueChange={(val) => {
                            if (val === "__other__") {
                              setBillingCityIsOther(true);
                              field.onChange("");
                            } else {
                              setBillingCityIsOther(false);
                              field.onChange(val);
                            }
                          }}
                          disabled={!watchBillingState}
                        >
                          <SelectTrigger className="mt-3 w-full border bg-white border-gray-300 rounded-md px-4 h-[40px] text-xs focus:ring-0">
                            <SelectValue
                              placeholder={
                                watchBillingState ? "Select City" : "Select state first"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent className="max-h-[260px]">
                            {billingCities.map((c) => (
                              <SelectItem key={c} value={c} className="text-xs">
                                {c}
                              </SelectItem>
                            ))}
                            <SelectItem value="__other__" className="text-xs font-medium">
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {billingCityIsOther && (
                          <Input
                            className="mt-2 w-full border placeholder:font-normal bg-white placeholder:text-gray-500 placeholder:text-sm border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
                            placeholder="Enter your city"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            autoFocus
                          />
                        )}
                      </>
                    )}
                  />
                  {errors.billingAddress?.city && (
                    <p className="text-sm text-red-500">
                      {errors.billingAddress.city.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="billing-pincode" className="text-[16px]">
                  Pincode
                </Label>
                <Input
                  className="mt-3 w-full border placeholder:font-normal bg-white placeholder:text-gray-500 placeholder:text-sm lg:min-w-[400px] border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
                  id="billing-pincode"
                  placeholder="Pincode"
                  {...register("billingAddress.pincode")}
                />
                {errors.billingAddress?.pincode && (
                  <p className="text-sm text-red-500">
                    {errors.billingAddress.pincode.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Same as Billing Checkbox */}
          <div className="flex items-center space-x-2">
            <Controller
              name="sameAsBilling"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="same-as-billing"
                  checked={field.value}
                  className="bg-white"
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setData("sameAsBilling", checked as boolean);
                  }}
                />
              )}
            />
            <Label htmlFor="same-as-billing">
              Shipping address is same as billing address
            </Label>
          </div>

          {/* Shipping Address */}
          {!watchSameAsBilling && (
            <div>
              <h3 className="text-lg mb-4 font-semibold text-primary">
                Shipping Address
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shipping-address1" className="text-[16px]">
                    Address Line 1
                  </Label>
                  <Input
                    className="mt-3 w-full border placeholder:font-normal bg-white placeholder:text-gray-500 placeholder:text-sm lg:min-w-[400px] border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
                    id="shipping-address1"
                    placeholder="Enter shipping address"
                    {...register("shippingAddress.address1")}
                  />
                  {errors.shippingAddress?.address1 && (
                    <p className="text-sm text-red-500">
                      {errors.shippingAddress.address1.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping-address2" className="text-[16px]">
                    Address Line 2 (Optional)
                  </Label>
                  <Input
                    className="mt-3 w-full border placeholder:font-normal bg-white placeholder:text-gray-500 placeholder:text-sm lg:min-w-[400px] border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
                    id="shipping-address2"
                    placeholder="Apartment, suite, etc."
                    {...register("shippingAddress.address2")}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[16px]">State</Label>
                    <Controller
                      name="shippingAddress.state"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(val) => {
                            field.onChange(val);
                            setValue("shippingAddress.city", "");
                            setShippingCityIsOther(false);
                          }}
                        >
                          <SelectTrigger className="mt-3 w-full border bg-white border-gray-300 rounded-md px-4 h-[40px] text-xs focus:ring-0">
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[260px]">
                            {INDIA_STATES.map((s) => (
                              <SelectItem key={s} value={s} className="text-xs">
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.shippingAddress?.state && (
                      <p className="text-sm text-red-500">
                        {errors.shippingAddress.state.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[16px]">City</Label>
                    <Controller
                      name="shippingAddress.city"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Select
                            value={shippingCityIsOther ? "__other__" : field.value}
                            onValueChange={(val) => {
                              if (val === "__other__") {
                                setShippingCityIsOther(true);
                                field.onChange("");
                              } else {
                                setShippingCityIsOther(false);
                                field.onChange(val);
                              }
                            }}
                            disabled={!watchShippingState}
                          >
                            <SelectTrigger className="mt-3 w-full border bg-white border-gray-300 rounded-md px-4 h-[40px] text-xs focus:ring-0">
                              <SelectValue
                                placeholder={
                                  watchShippingState ? "Select City" : "Select state first"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent className="max-h-[260px]">
                              {shippingCities.map((c) => (
                                <SelectItem key={c} value={c} className="text-xs">
                                  {c}
                                </SelectItem>
                              ))}
                              <SelectItem value="__other__" className="text-xs font-medium">
                                Other
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {shippingCityIsOther && (
                            <Input
                              className="mt-2 w-full border placeholder:font-normal bg-white placeholder:text-gray-500 placeholder:text-sm border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
                              placeholder="Enter your city"
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              autoFocus
                            />
                          )}
                        </>
                      )}
                    />
                    {errors.shippingAddress?.city && (
                      <p className="text-sm text-red-500">
                        {errors.shippingAddress.city.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping-pincode" className="text-[16px]">
                    Pincode
                  </Label>
                  <Input
                    className="mt-3 w-full border placeholder:font-normal bg-white placeholder:text-gray-500 placeholder:text-sm lg:min-w-[400px] border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
                    id="shipping-pincode"
                    placeholder="Pincode"
                    {...register("shippingAddress.pincode")}
                  />
                  {errors.shippingAddress?.pincode && (
                    <p className="text-sm text-red-500">
                      {errors.shippingAddress.pincode.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {errors.shippingAddress && (
            <p className="text-sm text-red-500">
              {errors.shippingAddress.message}
            </p>
          )}

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setData("currentStep", 2)}
              className="flex-1"
            >
              Previous
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Subscription"
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
