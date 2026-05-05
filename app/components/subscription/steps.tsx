'use client';

import { Mail, MapPinHouse, SquareChartGantt } from 'lucide-react';

import { Stepper, StepperIndicator, StepperItem, StepperSeparator } from '@/components/ui/stepper';
import { useSubStore } from '@/store/subscriptionStore';

export default function Steps() {
  const { data } = useSubStore();
  return (
    <div className="mx-auto space-y-8 pb-5 mb-10 border-b border-gray-200 dark:border-gray-500 text-center">
      <Stepper
        value={data.currentStep - 1}
        className="z-1"
      >
        <StepperItem
          step={1}
          className="not-last:flex-1"
        >
          <StepperIndicator
            asChild
            className="w-[40px] bg-white h-[40px]"
          >
            <Mail size={18} />
          </StepperIndicator>
          <StepperSeparator />
        </StepperItem>
        <StepperItem
          step={2}
          className="not-last:flex-1"
          loading
        >
          <StepperIndicator
            asChild
            className="w-[40px] bg-white h-[40px]"
          >
            <SquareChartGantt size={18} />
          </StepperIndicator>
          <StepperSeparator />
        </StepperItem>
        <StepperItem
          step={3}
          className="not-last:flex-1"
        >
          <StepperIndicator
            asChild
            className="w-[40px] bg-white h-[40px]"
          >
            <MapPinHouse
              size={18}
              aria-hidden="true"
            />
          </StepperIndicator>
        </StepperItem>
      </Stepper>
    </div>
  );
}
