'use client';

import { CheckCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSubStore } from '@/store/subscriptionStore';

export default function SuccessStep() {
  const { data, resetSubs } = useSubStore();
  const email = data.email || 'your email';

  return (
    <div className="flex flex-col items-center text-center space-y-6 py-8 lg:w-[500px]">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Thank You for Subscribing!</h2>
        <p className="text-gray-500">
          Your subscription to Aeromagasia has been successfully processed.
        </p>
      </div>

      <div className="w-full border border-gray-200 rounded-lg p-4 text-left">
        <div className="flex items-start space-x-3">
          <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Check your email</p>
            <p className="text-sm text-gray-500">
              A confirmation will be sent to{' '}
              <span className="font-medium text-gray-800">{email}</span> with your subscription
              details.
            </p>
          </div>
        </div>
      </div>

      <Button asChild className="w-full" onClick={resetSubs}>
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  );
}
