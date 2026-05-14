'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check, CheckCircle } from 'lucide-react';
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
  const [isInternational, setIsInternational] = useState(data.isInternational ?? false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(
    data.subscription?.plan_id || null,
  );

  const activeCurrency = isInternational ? 'USD' : 'INR';
  const currencySymbol = isInternational ? '$' : '₹';
  const filteredPlans = plans.filter((p) => p.currency === activeCurrency);

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

  const handleMarketToggle = (international: boolean) => {
    setIsInternational(international);
    setData('isInternational', international);
    // Deselect plan if it doesn't match the new currency
    if (selectedPlanId !== null) {
      const currentPlan = plans.find((p) => p.id === selectedPlanId);
      if (currentPlan && currentPlan.currency !== (international ? 'USD' : 'INR')) {
        setSelectedPlanId(null);
        setValue('plan_id', undefined as unknown as number);
      }
    }
    // Force auto_renew off for international
    if (international) {
      setData('subscription', {
        plan_id: data.subscription?.plan_id || 0,
        auto_renew: false,
      });
    }
  };

  const handlePlanSelect = (planId: number) => {
    setSelectedPlanId(planId);
    setValue('plan_id', planId);
  };

  const onSubmit = (formData: PlanFormData) => {
    const selectedPlan = plans.find((p) => p.id === formData.plan_id);
    if (!selectedPlan) return;

    const actualAmount =
      selectedPlan.offer_price == null
        ? selectedPlan.price
        : selectedPlan.offer_price === selectedPlan.price
          ? selectedPlan.price
          : selectedPlan.offer_price;

    const currentAutoRenew = isInternational ? false : (data.subscription?.auto_renew ?? false);

    setData('subscription', {
      plan_id: selectedPlan.id,
      auto_renew: currentAutoRenew,
    });

    setData('payment', {
      amount: actualAmount,
    });

    setData('isInternational', isInternational);
    setData('currentStep', 3);
  };

  return (
    <div className="space-y-6 lg:w-[750px]">
      <button
        type="button"
        onClick={() => setData('currentStep', 1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* India / International toggle */}
      <div className="flex rounded-lg overflow-hidden border border-gray-300 w-fit">
        <button
          type="button"
          onClick={() => handleMarketToggle(false)}
          className={`w-40 py-2 text-sm font-medium transition-colors ${
            !isInternational
              ? 'bg-primary text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          🇮🇳 India (INR)
        </button>
        <button
          type="button"
          onClick={() => handleMarketToggle(true)}
          className={`w-40 py-2 text-sm font-medium transition-colors ${
            isInternational
              ? 'bg-primary text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          🌐 Overseas (USD)
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {filteredPlans.length === 0 ? (
          <p className="text-gray-500 text-sm">No plans available for this market.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
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
                  <h3 className="text-lg md:text-center">
                    {plan.duration_period}{' '}
                    {plan.duration_type === 'yearly' ? 'Year' : 'Month'} Subscription
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
                    {currencySymbol}
                    {plan.offer_price == null
                      ? plan.price
                      : plan.offer_price === plan.price
                        ? plan.price
                        : plan.offer_price}
                  </span>

                  {plan.offer_price != null && plan.offer_price < plan.price && (
                    <>
                      <span className="text-lg text-gray-700 line-through">
                        {currencySymbol}{plan.price}
                      </span>
                      <div className="text-sm font-medium">
                        (Save {currencySymbol}{plan.price - plan.offer_price})
                      </div>
                    </>
                  )}
                </div>

                {Array.isArray(plan.features) && (
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {errors.plan_id && (
          <p className="text-sm text-red-500 font-medium text-center">{errors.plan_id.message}</p>
        )}

        {/* Auto-renewal only available for India (INR) plans */}
        {!isInternational && <SubscriptionAutoRenewal />}

        <div className="flex space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setData('currentStep', 1)}
            className="flex-1"
          >
            Previous
          </Button>
          <Button type="submit" className="flex-1 dark:text-white!">
            Continue to Address
          </Button>
        </div>
      </form>
    </div>
  );
}
