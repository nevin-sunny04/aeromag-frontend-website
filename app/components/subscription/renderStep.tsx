'use client';

import { Plan } from '@/app/utils/types';
import { useSubStore } from '@/store/subscriptionStore';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';

export default function RenderStep({ plans }: { plans: Plan[] }) {
  const { data } = useSubStore();
  switch (data.currentStep) {
    case 1:
      return <Step1 />;
    case 2:
      return <Step2 plans={plans} />;
    case 3:
      return <Step3 />;
    default:
      return null;
  }
}
