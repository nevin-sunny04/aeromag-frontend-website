import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Address {
  email: string;
  name: string;
  phone_number: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Subscriber {
  email: string;
  company_name?: string;
  billing_address: Address;
  shipping_address: Address;
}

export interface SubscriptionDetails {
  plan_id: number;
  auto_renew: boolean;
}

export interface PaymentDetails {
  amount: number;
}

export interface SubscriptionData {
  currentStep: 1 | 2 | 3 | 4;
  email?: string;
  subscriber?: Subscriber;
  subscription?: SubscriptionDetails;
  payment?: PaymentDetails;
  sameAsBilling: boolean;
}

export interface subsStore {
  data: SubscriptionData;
  setData: (key: keyof SubscriptionData, value: any) => void;
  setAutoRenew: (value: boolean) => void;
  resetSubs: () => void;
}

export const useSubStore = create<subsStore>()(
  devtools(
    (set) => ({
      data: {
        sameAsBilling: true,
        currentStep: 1,
        subscription: {
          plan_id: 0,
          auto_renew: false,
        },
      },
      setData: (step, value) =>
        set(
          (state) => ({
            data: { ...state.data, [step]: value },
          }),
          false,
          `setStepData: ${step}`,
        ),

      setAutoRenew: (value) =>
        set(
          (state) => ({
            data: {
              ...state.data,
              subscription: {
                ...state.data.subscription,
                plan_id: state.data.subscription?.plan_id || 0,
                auto_renew: value,
              },
            },
          }),
          false,
          `setAutoRenew: ${value}`,
        ),
      resetSubs: () =>
        set(
          {
            data: {
              sameAsBilling: true,
              currentStep: 1,
              subscription: {
                plan_id: 0,
                auto_renew: false,
              },
            },
          },
          false,
          'resetsubs',
        ),
    }),
    { name: 'BookingStore' },
  ),
);
