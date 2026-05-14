"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Script from "next/script";
import { useState, useRef } from "react";
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
import { submitSubscription, checkSubscriberName } from "@/lib/action/submitSubscription";
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

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bolivia", "Brazil",
  "Cambodia", "Canada", "Chile", "China", "Colombia", "Croatia", "Czech Republic",
  "Denmark", "Ecuador", "Egypt", "Estonia", "Ethiopia", "Finland", "France", "Germany",
  "Ghana", "Greece", "Guatemala", "Hungary", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Latvia",
  "Lebanon", "Lithuania", "Malaysia", "Mexico", "Moldova", "Morocco", "Myanmar", "Nepal",
  "Netherlands", "New Zealand", "Nigeria", "Norway", "Oman", "Pakistan", "Paraguay",
  "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
  "Saudi Arabia", "Serbia", "Singapore", "Slovakia", "Slovenia", "South Africa",
  "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Taiwan", "Tanzania",
  "Thailand", "Turkey", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Zimbabwe",
];

const PHONE_CODES = [
  { code: "+91",  label: "🇮🇳 +91"  },
  { code: "+1",   label: "🇺🇸 +1"   },
  { code: "+44",  label: "🇬🇧 +44"  },
  { code: "+61",  label: "🇦🇺 +61"  },
  { code: "+64",  label: "🇳🇿 +64"  },
  { code: "+971", label: "🇦🇪 +971" },
  { code: "+966", label: "🇸🇦 +966" },
  { code: "+974", label: "🇶🇦 +974" },
  { code: "+965", label: "🇰🇼 +965" },
  { code: "+968", label: "🇴🇲 +968" },
  { code: "+973", label: "🇧🇭 +973" },
  { code: "+65",  label: "🇸🇬 +65"  },
  { code: "+60",  label: "🇲🇾 +60"  },
  { code: "+62",  label: "🇮🇩 +62"  },
  { code: "+63",  label: "🇵🇭 +63"  },
  { code: "+66",  label: "🇹🇭 +66"  },
  { code: "+84",  label: "🇻🇳 +84"  },
  { code: "+95",  label: "🇲🇲 +95"  },
  { code: "+855", label: "🇰🇭 +855" },
  { code: "+81",  label: "🇯🇵 +81"  },
  { code: "+82",  label: "🇰🇷 +82"  },
  { code: "+86",  label: "🇨🇳 +86"  },
  { code: "+886", label: "🇹🇼 +886" },
  { code: "+852", label: "🇭🇰 +852" },
  { code: "+92",  label: "🇵🇰 +92"  },
  { code: "+880", label: "🇧🇩 +880" },
  { code: "+94",  label: "🇱🇰 +94"  },
  { code: "+977", label: "🇳🇵 +977" },
  { code: "+49",  label: "🇩🇪 +49"  },
  { code: "+33",  label: "🇫🇷 +33"  },
  { code: "+39",  label: "🇮🇹 +39"  },
  { code: "+34",  label: "🇪🇸 +34"  },
  { code: "+31",  label: "🇳🇱 +31"  },
  { code: "+46",  label: "🇸🇪 +46"  },
  { code: "+47",  label: "🇳🇴 +47"  },
  { code: "+45",  label: "🇩🇰 +45"  },
  { code: "+358", label: "🇫🇮 +358" },
  { code: "+41",  label: "🇨🇭 +41"  },
  { code: "+43",  label: "🇦🇹 +43"  },
  { code: "+32",  label: "🇧🇪 +32"  },
  { code: "+351", label: "🇵🇹 +351" },
  { code: "+48",  label: "🇵🇱 +48"  },
  { code: "+7",   label: "🇷🇺 +7"   },
  { code: "+380", label: "🇺🇦 +380" },
  { code: "+36",  label: "🇭🇺 +36"  },
  { code: "+40",  label: "🇷🇴 +40"  },
  { code: "+420", label: "🇨🇿 +420" },
  { code: "+30",  label: "🇬🇷 +30"  },
  { code: "+90",  label: "🇹🇷 +90"  },
  { code: "+972", label: "🇮🇱 +972" },
  { code: "+962", label: "🇯🇴 +962" },
  { code: "+961", label: "🇱🇧 +961" },
  { code: "+55",  label: "🇧🇷 +55"  },
  { code: "+52",  label: "🇲🇽 +52"  },
  { code: "+54",  label: "🇦🇷 +54"  },
  { code: "+57",  label: "🇨🇴 +57"  },
  { code: "+56",  label: "🇨🇱 +56"  },
  { code: "+27",  label: "🇿🇦 +27"  },
  { code: "+234", label: "🇳🇬 +234" },
  { code: "+254", label: "🇰🇪 +254" },
  { code: "+20",  label: "🇪🇬 +20"  },
  { code: "+212", label: "🇲🇦 +212" },
  { code: "+233", label: "🇬🇭 +233" },
];

const addressSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    company_name: z.string().optional(),
    phone_code: z.string().min(1, "Please select a country code"),
    phone_number: z
      .string()
      .min(7, "Phone number must be at least 7 digits")
      .max(15, "Phone number is too long"),
    isInternational: z.boolean(),
    billingAddress: z.object({
      address1: z.string().min(1, "Address is required"),
      address2: z.string().optional(),
      state: z.string().min(1, "State / Province is required"),
      city: z.string().min(1, "City is required"),
      pincode: z.string(),
      country: z.string().optional(),
    }),
    sameAsBilling: z.boolean(),
    shippingAddress: z
      .object({
        address1: z.string(),
        address2: z.string().optional(),
        state: z.string(),
        city: z.string(),
        pincode: z.string(),
        country: z.string().optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isInternational) {
      // India: pincode must be exactly 6 digits
      if (!/^\d{6}$/.test(data.billingAddress.pincode)) {
        ctx.addIssue({
          code: "custom",
          path: ["billingAddress", "pincode"],
          message: "Pincode must be exactly 6 digits",
        });
      }
      if (!data.sameAsBilling && data.shippingAddress) {
        if (!data.shippingAddress.address1 || data.shippingAddress.address1.length === 0) {
          ctx.addIssue({ code: "custom", path: ["shippingAddress", "address1"], message: "Address is required" });
        }
        if (!data.shippingAddress.state || data.shippingAddress.state.length === 0) {
          ctx.addIssue({ code: "custom", path: ["shippingAddress", "state"], message: "State is required" });
        }
        if (!data.shippingAddress.city || data.shippingAddress.city.length === 0) {
          ctx.addIssue({ code: "custom", path: ["shippingAddress", "city"], message: "City is required" });
        }
        if (!data.shippingAddress.pincode || !/^\d{6}$/.test(data.shippingAddress.pincode)) {
          ctx.addIssue({ code: "custom", path: ["shippingAddress", "pincode"], message: "Pincode must be exactly 6 digits" });
        }
      }
    } else {
      // International: country required, postal code optional
      if (!data.billingAddress.country || data.billingAddress.country.length === 0) {
        ctx.addIssue({ code: "custom", path: ["billingAddress", "country"], message: "Country is required" });
      }
      if (!data.sameAsBilling && data.shippingAddress) {
        if (!data.shippingAddress.address1 || data.shippingAddress.address1.length === 0) {
          ctx.addIssue({ code: "custom", path: ["shippingAddress", "address1"], message: "Address is required" });
        }
        if (!data.shippingAddress.state || data.shippingAddress.state.length === 0) {
          ctx.addIssue({ code: "custom", path: ["shippingAddress", "state"], message: "State / Province is required" });
        }
        if (!data.shippingAddress.city || data.shippingAddress.city.length === 0) {
          ctx.addIssue({ code: "custom", path: ["shippingAddress", "city"], message: "City is required" });
        }
        if (!data.shippingAddress.country || data.shippingAddress.country.length === 0) {
          ctx.addIssue({ code: "custom", path: ["shippingAddress", "country"], message: "Country is required" });
        }
      }
    }
  });

type AddressFormData = z.infer<typeof addressSchema>;

export default function Step3() {
  const { data, setData } = useSubStore();
  const isInternational = data.isInternational ?? false;
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
      phone_code: isInternational ? "" : "+91",
      phone_number: data.subscriber?.billing_address?.phone_number || "",
      isInternational,
      billingAddress: {
        address1: data.subscriber?.billing_address?.address1 || "",
        address2: data.subscriber?.billing_address?.address2 || "",
        state: data.subscriber?.billing_address?.state || "",
        city: data.subscriber?.billing_address?.city || "",
        pincode: data.subscriber?.billing_address?.pincode || "",
        country: data.subscriber?.billing_address?.country || (isInternational ? "" : "India"),
      },
      sameAsBilling: data.sameAsBilling,
      shippingAddress: {
        address1: data.subscriber?.shipping_address?.address1 || "",
        address2: data.subscriber?.shipping_address?.address2 || "",
        state: data.subscriber?.shipping_address?.state || "",
        city: data.subscriber?.shipping_address?.city || "",
        pincode: data.subscriber?.shipping_address?.pincode || "",
        country: data.subscriber?.shipping_address?.country || (isInternational ? "" : "India"),
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
    if (nameError) return;
    setIsLoading(true);

    const billingAddress: Address = {
      email: data.email || "",
      name: formData.name,
      phone_number: `${formData.phone_code}${formData.phone_number}`,
      address1: formData.billingAddress.address1,
      address2: formData.billingAddress.address2 || "",
      city: formData.billingAddress.city,
      state: formData.billingAddress.state,
      pincode: formData.billingAddress.pincode || "",
      country: isInternational ? (formData.billingAddress.country || "") : "India",
    };

    const shippingAddress: Address = formData.sameAsBilling
      ? billingAddress
      : {
          email: data.email || "",
          name: formData.name,
          phone_number: `${formData.phone_code}${formData.phone_number}`,
          address1: formData.shippingAddress?.address1 || "",
          address2: formData.shippingAddress?.address2 || "",
          city: formData.shippingAddress?.city || "",
          state: formData.shippingAddress?.state || "",
          pincode: formData.shippingAddress?.pincode || "",
          country: isInternational
            ? (formData.shippingAddress?.country || "")
            : "India",
        };

    const subscriber: Subscriber = {
      email: data.email || "",
      company_name: formData.company_name || undefined,
      billing_address: billingAddress,
      shipping_address: shippingAddress,
    };

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

          subscription_id:
            data.subscription.auto_renew === true
              ? result.data.razorpay_subscription_id
              : undefined,

          order_id:
            data.subscription.auto_renew === false
              ? result.data.razorpay_order_id
              : undefined,

          handler: async function (response: RazorResponse) {
            if (keepAliveRef.current) {
              clearInterval(keepAliveRef.current);
              keepAliveRef.current = null;
            }
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
            const res = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(verifyPayload),
            }).then(r => r.json());
            console.log("verifySubscription response:", res);
            if (res.success) {
              setVerifyError(null);
              setData('currentStep', 4);
            } else {
              const errorMsg = res.error || res.message || 'Verification failed. Contact support.';
              setVerifyError(
                `Payment received but verification failed: ${errorMsg}. Please contact support with your payment ID: ${response.razorpay_payment_id}`
              );
            }
          },
        };

        if (!paymentData.key) {
          throw new Error("Razorpay key is missing from the response");
        }

        const payment = new window.Razorpay(paymentData);
        keepAliveRef.current = setInterval(() => {
          fetch('/api/keepalive').catch(() => {});
        }, 30_000);
        payment.open();
      } else {
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

  const inputClass =
    "mt-3 w-full border placeholder:font-normal bg-white placeholder:text-gray-500 placeholder:text-sm lg:min-w-[400px] border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0";
  const selectTriggerClass =
    "mt-3 w-full border bg-white border-gray-300 rounded-md px-4 h-[40px] text-xs focus:ring-0";

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

      <div className="space-y-6 lg:w-[700px]">
        <button
          type="button"
          onClick={() => setData("currentStep", 2)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[16px]">Full Name</Label>
            <Input
              className={inputClass}
              id="name"
              type="text"
              placeholder="Enter your full name"
              {...register("name")}
              onBlur={async (e) => {
                const name = e.target.value.trim();
                setNameError(null);
                if (!name || !data.email) return;
                const result = await checkSubscriberName(data.email, name);
                if (result.hasActiveSubscription) {
                  setNameError(
                    `${name} already has an active ${result.planName} subscription under this email (valid until ${result.endDate}). Please use a different name.`
                  );
                }
              }}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="company_name" className="text-[16px]">Company Name</Label>
            <Input className={inputClass} id="company_name" type="text" placeholder="Enter your company name" {...register("company_name")} />
            {errors.company_name && <p className="text-sm text-red-500">{errors.company_name.message}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label className="text-[16px]">Phone Number</Label>
            <div className="flex gap-2 mt-3">
              <Controller
                name="phone_code"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-28 shrink-0 border bg-white border-gray-300 rounded-md px-3 h-[40px] text-xs focus:ring-0">
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[260px]">
                      {PHONE_CODES.map((p) => (
                        <SelectItem key={p.code} value={p.code} className="text-xs">
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Input
                className="flex-1 border placeholder:font-normal bg-white placeholder:text-gray-500 placeholder:text-sm border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0"
                id="phone_number"
                type="tel"
                placeholder="Enter your phone number"
                {...register("phone_number")}
              />
            </div>
            {errors.phone_code && (
              <p className="text-sm text-red-500">{errors.phone_code.message}</p>
            )}
            {errors.phone_number && (
              <p className="text-sm text-red-500">{errors.phone_number.message}</p>
            )}
          </div>

          {/* Billing Address */}
          <div>
            <h3 className="text-lg mb-4 font-semibold text-primary">Billing Address</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="billing-address1" className="text-[16px]">Address Line 1</Label>
                <Input className={inputClass} id="billing-address1" placeholder="Enter your address" {...register("billingAddress.address1")} />
                {errors.billingAddress?.address1 && <p className="text-sm text-red-500">{errors.billingAddress.address1.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="billing-address2" className="text-[16px]">Address Line 2 (Optional)</Label>
                <Input className={inputClass} id="billing-address2" placeholder="Apartment, suite, etc." {...register("billingAddress.address2")} />
              </div>

              {isInternational ? (
                /* International: free-text state & city + country dropdown */
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[16px]">State / Province</Label>
                      <Input className={inputClass} placeholder="State or Province" {...register("billingAddress.state")} />
                      {errors.billingAddress?.state && <p className="text-sm text-red-500">{errors.billingAddress.state.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[16px]">City</Label>
                      <Input className={inputClass} placeholder="City" {...register("billingAddress.city")} />
                      {errors.billingAddress?.city && <p className="text-sm text-red-500">{errors.billingAddress.city.message}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[16px]">Country</Label>
                      <Controller
                        name="billingAddress.country"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className={selectTriggerClass}>
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[260px]">
                              {COUNTRIES.map((c) => (
                                <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.billingAddress?.country && <p className="text-sm text-red-500">{errors.billingAddress.country.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing-pincode" className="text-[16px]">Postal Code (Optional)</Label>
                      <Input className={inputClass} id="billing-pincode" placeholder="Postal Code" {...register("billingAddress.pincode")} />
                    </div>
                  </div>
                </>
              ) : (
                /* India: state & city dropdowns + 6-digit pincode */
                <>
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
                            <SelectTrigger className={selectTriggerClass}>
                              <SelectValue placeholder="Select State" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[260px]">
                              {INDIA_STATES.map((s) => (
                                <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.billingAddress?.state && <p className="text-sm text-red-500">{errors.billingAddress.state.message}</p>}
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
                              <SelectTrigger className={selectTriggerClass}>
                                <SelectValue placeholder={watchBillingState ? "Select City" : "Select state first"} />
                              </SelectTrigger>
                              <SelectContent className="max-h-[260px]">
                                {billingCities.map((c) => (
                                  <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                                ))}
                                <SelectItem value="__other__" className="text-xs font-medium">Other</SelectItem>
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
                      {errors.billingAddress?.city && <p className="text-sm text-red-500">{errors.billingAddress.city.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billing-pincode" className="text-[16px]">Pincode</Label>
                    <Input className={inputClass} id="billing-pincode" placeholder="Pincode" {...register("billingAddress.pincode")} />
                    {errors.billingAddress?.pincode && <p className="text-sm text-red-500">{errors.billingAddress.pincode.message}</p>}
                  </div>
                </>
              )}
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
              <h3 className="text-lg mb-4 font-semibold text-primary">Shipping Address</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shipping-address1" className="text-[16px]">Address Line 1</Label>
                  <Input className={inputClass} id="shipping-address1" placeholder="Enter shipping address" {...register("shippingAddress.address1")} />
                  {errors.shippingAddress?.address1 && <p className="text-sm text-red-500">{errors.shippingAddress.address1.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping-address2" className="text-[16px]">Address Line 2 (Optional)</Label>
                  <Input className={inputClass} id="shipping-address2" placeholder="Apartment, suite, etc." {...register("shippingAddress.address2")} />
                </div>

                {isInternational ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[16px]">State / Province</Label>
                        <Input className={inputClass} placeholder="State or Province" {...register("shippingAddress.state")} />
                        {errors.shippingAddress?.state && <p className="text-sm text-red-500">{errors.shippingAddress.state.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[16px]">City</Label>
                        <Input className={inputClass} placeholder="City" {...register("shippingAddress.city")} />
                        {errors.shippingAddress?.city && <p className="text-sm text-red-500">{errors.shippingAddress.city.message}</p>}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[16px]">Country</Label>
                        <Controller
                          name="shippingAddress.country"
                          control={control}
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className={selectTriggerClass}>
                                <SelectValue placeholder="Select Country" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[260px]">
                                {COUNTRIES.map((c) => (
                                  <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.shippingAddress?.country && <p className="text-sm text-red-500">{errors.shippingAddress.country.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shipping-pincode" className="text-[16px]">Postal Code (Optional)</Label>
                        <Input className={inputClass} id="shipping-pincode" placeholder="Postal Code" {...register("shippingAddress.pincode")} />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
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
                              <SelectTrigger className={selectTriggerClass}>
                                <SelectValue placeholder="Select State" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[260px]">
                                {INDIA_STATES.map((s) => (
                                  <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.shippingAddress?.state && <p className="text-sm text-red-500">{errors.shippingAddress.state.message}</p>}
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
                                <SelectTrigger className={selectTriggerClass}>
                                  <SelectValue placeholder={watchShippingState ? "Select City" : "Select state first"} />
                                </SelectTrigger>
                                <SelectContent className="max-h-[260px]">
                                  {shippingCities.map((c) => (
                                    <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                                  ))}
                                  <SelectItem value="__other__" className="text-xs font-medium">Other</SelectItem>
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
                        {errors.shippingAddress?.city && <p className="text-sm text-red-500">{errors.shippingAddress.city.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shipping-pincode" className="text-[16px]">Pincode</Label>
                      <Input className={inputClass} id="shipping-pincode" placeholder="Pincode" {...register("shippingAddress.pincode")} />
                      {errors.shippingAddress?.pincode && <p className="text-sm text-red-500">{errors.shippingAddress.pincode.message}</p>}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {verifyError && (
            <div className="p-4 rounded-md bg-red-50 border border-red-200 text-sm text-red-800">
              {verifyError}
            </div>
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
