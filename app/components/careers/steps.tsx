'use client';

import { useEffect } from 'react';
import { Stepper, StepperIndicator, StepperItem, StepperSeparator } from '@/components/ui/stepper';
import { useJobStore } from '@/store/jobStore';

const steps = [1, 2, 3, 4];

export default function Steps({ jobId }: { jobId?: string }) {
  const { data } = useJobStore();

  useEffect(() => {
    if (jobId) {
      localStorage.setItem('jobRequisitionId', jobId);
    }
  }, [jobId]);

  return (
    <div className="mx-auto space-y-8 pb-5 mb-10 border-b border-gray-200 dark:border-gray-500 text-center">
      <Stepper value={data.currentStep}>
        {steps.map((step) => (
          <StepperItem
            key={step}
            step={step}
            className="not-last:flex-1"
          >
            <StepperIndicator />
            {step < steps.length && <StepperSeparator />}
          </StepperItem>
        ))}
      </Stepper>
    </div>
  );
}
