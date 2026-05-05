'use client';

import { ContactInfo } from '@/app/utils/types';

interface MapViewProps {
  address: ContactInfo;
}

export function MapView({ address }: MapViewProps) {
  return (
    <div className="w-full bg-gray-200 rounded-lg relative group overflow-hidden">
      <iframe
        src={address.map_url}
        width="100%"
        height="350"
        loading="lazy"
      ></iframe>
      <div className="absolute bottom-4 left-4 bg-white px-3 py-2 z-999 rounded shadow-md">
        <p className="text-xs text-primary">Click address cards to change location</p>
      </div>
    </div>
  );
}
