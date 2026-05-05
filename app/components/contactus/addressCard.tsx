'use client';

import { Mail, Phone } from 'lucide-react';
import { ContactInfo } from '@/app/utils/types';

interface AddressCardProps {
  address: ContactInfo;
  isSelected: boolean;
  onClick: () => void;
}

export function AddressCard({ address, isSelected, onClick }: AddressCardProps) {
  return (
    <div
      className={`cursor-pointer rounded-md transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-red-500 shadow-md' : ''
      }`}
      onClick={onClick}
    >
      <div className="p-6 space-y-4">
        <h3 className="text-red-500 font-semibold text-lg">Address</h3>

        <p
          className="text-gray-600 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: address.address }}
        />

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Call Now</p>
              <p className="font-medium text-gray-800">{address.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Mail Id</p>
              <p className="font-medium text-gray-800">{address.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
