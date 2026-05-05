import Image from 'next/image';
import Link from 'next/link';
import { ad } from '@/app/utils/types';

export default function Advertisement({ ad }: { ad: ad }) {
  return (
    <div className="container my-4 lg:my-8 rounded-md overflow-hidden">
      <Link
        href={ad?.link || `${process.env.NEXT_PUBLIC_BASE_URL}`}
        target="_blank"
      >
        {ad?.image && (
          <Image
            src={ad?.image}
            alt="advertisement"
            width={1500}
            height={300}
            className="w-full h-auto rounded-md"
          />
        )}
      </Link>
    </div>
  );
}
