'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header({ title }: { title: string }) {
  const router = useRouter();
  return (
    <div className="relative border-b-1 border-gray-100 dark:border-gray-500">
      <div className="container flex py-6 gap-10 items-center ">
        {/* <Link href="/" className="relative z-1">
          <Image src={logo.image} width={324} height={188} className="w-25" alt={logo.alt_text || 'logo'} />
        </Link> */}
        <span
          onClick={() => router.back()}
          className="hover:cursor-pointer"
        >
          <ArrowLeft />
        </span>
        <h1 className="font-medium  flex gap-4 items-start md:items-center">
          {title}
          <span className="text-primary text-xs bg-primary/5 font-[400] px-3 py-0.5 rounded-xs">
            In progress
          </span>
        </h1>
      </div>
    </div>
  );
}
