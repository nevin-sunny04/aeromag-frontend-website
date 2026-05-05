import Image from 'next/image';
import Link from 'next/link';

export default function Placeholder() {
  return (
    <div className="border-1 overflow-hidden rounded-sm">
      <div className="p-5">
        <Image
          src={process.env.NEXT_PUBLIC_BASE_URL + 'logo1.svg'}
          className="w-[50%] h-auto"
          width={322}
          height={68}
          alt="logo"
        />
        <div className="py-3 bg-primary text-center my-5 uppercase text-lg font-semibold text-white">
          Advertise Here
        </div>
        <div className="text-center mt-6 mb-4 text-md">
          <Link
            href="mailto:editor@aeromagasia.com"
            className="block"
          >
            editor@aeromagasia.com
          </Link>
        </div>
      </div>

      <Image
        src={process.env.NEXT_PUBLIC_BASE_URL + 'pattern1.png'}
        className="w-full -mt-10 h-auto"
        width={414}
        height={516}
        alt="pattern"
      />
    </div>
  );
}
