'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Plan } from '@/app/utils/types';
import { Button } from '@/components/ui/button';
import { useSubStore } from '@/store/subscriptionStore';
import { SubscriptionAutoRenewal } from './autoRenewal';

const planSchema = z.object({
  plan_id: z.number({
    message: 'Please select a subscription plan',
  }),
});

type PlanFormData = z.infer<typeof planSchema>;

export default function Step2({ plans }: { plans: Plan[] }) {
  const { data, setData } = useSubStore();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(
    data.subscription?.plan_id || null,
  );

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      plan_id: data.subscription?.plan_id || undefined,
    },
  });

  const handlePlanSelect = (planId: number) => {
    setSelectedPlanId(planId);
    setValue('plan_id', planId);
  };

  const onSubmit = (formData: PlanFormData) => {
    const selectedPlan = plans.find((p) => p.id === formData.plan_id);
    if (!selectedPlan) return;

    // Calculate actual amount
    const actualAmount =
      selectedPlan.offer_price == null
        ? selectedPlan.price
        : selectedPlan.offer_price === selectedPlan.price
          ? selectedPlan.price
          : selectedPlan.offer_price;

    // Don't override it with undefined or false unless that's the user's choice
    const currentAutoRenew = data.subscription?.auto_renew ?? false;

    setData('subscription', {
      plan_id: selectedPlan.id,
      auto_renew: currentAutoRenew, // FIX: Preserve the auto_renew value
    });

    setData('payment', {
      amount: actualAmount,
    });

    setData('currentStep', 3);
  };

  return (
    <div className="space-y-6 lg:w-[750px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`cursor-pointer space-y-6 bg-white dark:bg-secondary border border-gray p-5 rounded-lg shadow-sm transition-all ${
                selectedPlanId === plan.id
                  ? 'ring-2 ring-primary border-primary/10'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              <div className="flex items-center relative gap-5 justify-between">
                <h3 className="text-lg  md:text-center ">
                  {plan.duration_period} {plan.duration_type === 'yearly' ? 'Year' : 'Month'}{' '}
                  Subscription
                </h3>
                {selectedPlanId === plan.id && (
                  <CheckCircle
                    strokeWidth={2.5}
                    className="w-4 absolute -right-3 -top-3 h-4 text-primary"
                  />
                )}
              </div>

              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg font-semibold">
                  ₹
                  {plan.offer_price == null
                    ? plan.price
                    : plan.offer_price === plan.price
                      ? plan.price
                      : plan.offer_price}
                </span>

                {plan.offer_price != null && plan.offer_price < plan.price && (
                  <>
                    <span className="text-lg text-gray-700 line-through">₹{plan.price}</span>
                    <div className="text-sm font-medium">
                      (Save ₹{plan.price - plan.offer_price})
                    </div>
                  </>
                )}
              </div>

              {Array.isArray(plan.features) && (
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {errors.plan_id && (
          <p className="text-sm text-red-500 font-medium text-center">{errors.plan_id.message}</p>
        )}

        {/* This component should use setAutoRenew from the store */}
        <SubscriptionAutoRenewal />

        <div className="flex space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setData('currentStep', 1)}
            className="flex-1"
          >
            Previous
          </Button>
          <Button
            type="submit"
            className="flex-1 dark:text-white!"
          >
            Continue to Address
          </Button>
        </div>
      </form>
    </div>
  );
}
