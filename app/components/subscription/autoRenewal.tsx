'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useSubStore } from '@/store/subscriptionStore';

export function SubscriptionAutoRenewal() {
  const { data, setData } = useSubStore();
  const autoRenew = data.subscription?.auto_renew;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingState, setPendingState] = useState<boolean | null>(null);

  const handleToggleClick = () => {
    setPendingState(!autoRenew);
    setShowConfirmDialog(true);
  };

  const confirmChange = () => {
    if (pendingState !== null) {
      setData('subscription', {
        ...data.subscription,
        auto_renew: pendingState,
      });
    }
    setShowConfirmDialog(false);
  };

  const cancelChange = () => {
    setPendingState(!autoRenew);

    setShowConfirmDialog(false);
  };

  return (
    <div className="w-full">
      <div className="border-t pt-4">
        <div className="flex items-center gap-5">
          <div className="space-y-0.5">
            <h3 className="font-medium">Auto-Renewal</h3>
          </div>
          <Switch
            checked={autoRenew}
            onCheckedChange={handleToggleClick}
          />
        </div>
      </div>

      <Dialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Subscription Change</DialogTitle>
            <DialogDescription className="text-sm leading-7 mt-3">
              {pendingState
                ? 'Are you sure you want to enable auto-renewal for your subscription?'
                : 'Are you sure you want to disable auto-renewal? Your subscription will expire after the current billing period.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelChange}
            >
              Cancel
            </Button>
            <Button onClick={confirmChange}>{pendingState ? 'Enable' : 'Disable'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
