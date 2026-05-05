import Image from 'next/image';
import Link from 'next/link';

export default function MiddleBar({
  logo,
  ad,
}: {
  logo?: { image: string; alt_text: string };
  ad?: { url: string; file: string };
}) {
  if (!logo || !ad) {
    return (
      <div className="relative">
        <div className="container py-0.5 h-[100px] flex items-center justify-center text-white">
          {/* Fallback for missing header assets */}
          <span className="text-xl font-bold">{logo?.alt_text || 'Aeromag'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="container  py-0.5 text-white gap-10 flex after:content-[''] after:w-[31%] after:bg-white dark:after:bg-background after:absolute after:-left-2 after:-top-[16px] after:skew-x-50 after:h-[20px] items-center justify-between">
        <Link
          href="/"
          className="relative z-1"
        >
          <Image
            src={logo.image}
            width={324}
            height={188}
            className="md:w-[330px] w-[200px] mt-1 object-cover bg-center bg-no-repeat"
            alt={logo.alt_text || 'logo'}
          />
        </Link>
        <Link
          href={ad.url || '#'}
          target="_blank"
        >
          <Image
            src={ad.file}
            width={1820}
            height={230}
            className="md:w-[900px] w-full h-auto"
            alt={'advertisement'}
          />
        </Link>
      </div>
    </div>
  );
}
