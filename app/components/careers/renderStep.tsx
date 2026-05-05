'use client';

import { useJobStore } from '@/store/jobStore';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Step4 from './step4';

export default function RenderStep() {
  const { data } = useJobStore();
  switch (data.currentStep) {
    case 1:
      return <Step1 />;
    case 2:
      return <Step2 />;
    case 3:
      return <Step3 />;
    case 4:
      return <Step4 />;
    default:
      return null;
  }
}
