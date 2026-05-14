"use server";

import { apiRequest } from "@/lib/apiClient";

interface Address {
  email: string;
  name: string;
  phone_number: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}
interface Subscriber {
  email: string;
  billing_address: Address;
  shipping_address: Address;
}
interface Subscription {
  plan_id: number;
  auto_renew: boolean;
}
interface Payment {
  amount: number;
}

interface SubscriptionPayload {
  step: string;
  subscriber: Subscriber;
  subscription: Subscription;
  payment: Payment;
}

interface verifyemail {
  step: string;
  email: string;
}

export async function checkSubscriberName(email: string, name: string) {
  try {
    const response = await apiRequest("subscribe/", {
      method: "POST",
      body: { step: "check_name", email, name },
    });
    if (response.has_active_subscription) {
      return {
        hasActiveSubscription: true,
        planName: response.plan_name as string,
        endDate: response.end_date as string,
      };
    }
    return { hasActiveSubscription: false };
  } catch {
    return { hasActiveSubscription: false };
  }
}

export async function submitSubscription(
  data: SubscriptionPayload | verifyemail,
) {
  try {
    const response = await apiRequest("subscribe/", {
      method: "POST",
      body: data,
    });

    // Step 1: check for active subscription warning (success but with warning data)
    if (response.success === true && response.has_active_subscription === true) {
      return {
        success: true,
        hasActiveSubscription: true,
        subscriberName: response.subscriber_name as string,
        planName: response.plan_name as string,
        endDate: response.end_date as string,
        daysRemaining: response.days_remaining as number,
        data: response,
      };
    }

    // Extract field-level validation errors (e.g. { email: ['...message...'] })
    const fieldErrors: Record<string, string[]> = {};
    let fieldErrorMessage: string | null = null;
    for (const [key, value] of Object.entries(response)) {
      if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === "string"
      ) {
        fieldErrors[key] = value as string[];
        if (!fieldErrorMessage) fieldErrorMessage = value[0] as string;
      }
    }

    if (response.error || response.detail || fieldErrorMessage) {
      const errorMessage =
        response.error || response.detail || fieldErrorMessage || "Something went wrong";
      const alreadySubscribed =
        typeof errorMessage === "string" &&
        errorMessage.toLowerCase().includes("renewal not allowed");

      return {
        success: false,
        error: errorMessage,
        alreadySubscribed,
        status: response.status,
        statusText: response.statusText,
      };
    }
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
