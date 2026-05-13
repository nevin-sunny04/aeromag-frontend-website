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

export async function submitSubscription(
  data: SubscriptionPayload | verifyemail,
) {
  try {
    const response = await apiRequest("subscribe/", {
      method: "POST",
      body: data,
    });

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
