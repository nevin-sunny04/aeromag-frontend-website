'use client';

import { useEffect, useState } from 'react';
import { ContactInfo } from '@/app/utils/types';
import { AddressCard } from './addressCard';
import { MapView } from './mapView';

export default function AddHandler({ addresses }: { addresses: ContactInfo[] }) {
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        {addresses.map((address) => {
          return (
            hydrated && (
              <AddressCard
                key={address.id}
                address={address}
                isSelected={selectedAddress.id === address.id}
                onClick={() => setSelectedAddress(address)}
              />
            )
          );
        })}
      </div>

      {/* Map View */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <MapView address={selectedAddress} />
      </div>
    </>
  );
}
