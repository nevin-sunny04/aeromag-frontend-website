"use server";

import { apiRequest } from "../apiClient";

export interface verifyData {
  step: string;
  razorpay_subscription_id?: string;
  razorpay_order_id?: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function verifySubscription(data: verifyData) {
  try {
    const response = await apiRequest("subscribe/", {
      method: "POST",
      body: data,
    });
    console.log("verifySubscription server response:", response);
    return response;
  } catch (error) {
    console.error("verify subscription error:", error);
    return { success: false, error: String(error) };
  }
}
