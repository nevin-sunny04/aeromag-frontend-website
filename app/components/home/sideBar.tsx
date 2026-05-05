'use client';

import '@/app/styles/sidebar.css';
import { LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Slide, toast } from 'react-toastify';
import { apiItem, Magazine } from '@/app/utils/types';
import Placeholder from '../sidebar-adplaceholder';
import { Subscribe } from './actions/subscribe';
import AdsSlider from './adsSlider';

export default function SideBar({
  data,
}: {
  data: { normal_add: apiItem[]; carousel_add: apiItem[]; featured_magazine: Magazine };
}) {
  const path = usePathname();
  const isMagazinePage = path.includes('magazines');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await Subscribe(email);
    if (response.status === 'success') {
      toast.success(`Subscription successful!`, {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: 'light',
        transition: Slide,
      });
      setEmail('');
    } else {
      toast.error(`Something went wrong. Please Try Again`, {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: 'light',
        transition: Slide,
      });
    }

    setLoading(false);
  };
  return (
    <div className="xl:w-3/12 overflow-hidden lg:w-3/12 md:w-4/12 w-full sticky top-5 left-0 flex flex-col gap-5">
      {!isMagazinePage && (
        <div className="p-5 border relative    rounded-sm">
          <h4 className="heading mb-3 text-center">{data.featured_magazine.title}</h4>
          <Link
            target="_blank"
            href={`/magazines/${data.featured_magazine.category[0].slug}/${data.featured_magazine.slug}`}
          >
            <Image
              src={data.featured_magazine.cover_image}
              width={528}
              height={352}
              unoptimized
              className="w-[70%] mx-auto h-auto"
              alt="featured_magazine"
            />
          </Link>
          <div className="flex mt-4 items-center gap-3 mb-2 flex-wrap">
            {/* <span className="text-[20px] font-[400] text-gray-500">{featuredmag.published_date}</span> */}
          </div>
          <Link
            href={`/magazines/${data.featured_magazine.category[0].slug}?whatsinissue=true`}
            className="text-lg text-gray-500 hover:text-primary"
          >
            What&apos;s in the issue
          </Link>
          <Link
            href={'/subscription'}
            className="w-full font-medium mb-0 mt-2 text-[17px] inline-block text-primary! md:w-auto"
          >
            Click here to subscribe
          </Link>
        </div>
      )}

      <div className="p-5 border rounded-lg  text-center">
        <div className="w-16 h-16 mx-auto flex items-center justify-center bg-primary rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-8 h-8"
          >
            <path d="M12 2a6 6 0 0 0-6 6v3a4 4 0 0 0-2 3.46V19a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-4.54A4 4 0 0 0 18 11V8a6 6 0 0 0-6-6Zm-4 6a4 4 0 0 1 8 0v3H8V8Zm10 5a2 2 0 0 1 2 2v4a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2h10Z" />
          </svg>
        </div>

        <h3 className="text-md font-medium mt-4">Subscribe Us & Get The Latest Updates</h3>
        <form onSubmit={handleSubscribe}>
          <div className="mt-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email Address"
              className="w-full px-4 py-2 border text-center text-sm text-gray-600 dark:text-white bg-gray-100 dark:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            disabled={loading}
            className="mt-4 w-full bg-primary text-center text-white py-2 cursor-pointer font-medium hover:bg-red-600 transition"
          >
            {loading ? (
              <LoaderCircle className="w-6 h-6 animate-spin text-white text-center block m-auto" />
            ) : (
              'Subscribe Now'
            )}
          </button>
        </form>
      </div>
      {data.normal_add.length === 0 && [1, 2, 3].map((_, i) => <Placeholder key={`holder_${i}`} />)}

      {data.normal_add.length === 1 && (
        <div className="flex flex-col gap-5 rounded-md overflow-hidden">
          <Link
            href={data.normal_add[0].url}
            target="_blank"
          >
            <Image
              src={data.normal_add[0].file}
              className="w-full h-auto rounded-md"
              width={414}
              height={516}
              unoptimized
              alt="pattern"
            />
          </Link>
          <Placeholder />
          <Placeholder />
        </div>
      )}

      {data.normal_add.length === 2 && (
        <div className="flex flex-col gap-5 rounded-md overflow-hidden">
          <Link
            href={data.normal_add[0].url}
            target="_blank"
          >
            <Image
              src={data.normal_add[0].file}
              className="w-full h-auto rounded-md"
              width={414}
              height={516}
              unoptimized
              alt="pattern"
            />
          </Link>
          <Link
            href={data.normal_add[1].url}
            target="_blank"
          >
            <Image
              src={data.normal_add[1].file}
              className="w-full h-auto rounded-md"
              width={414}
              height={516}
              unoptimized
              alt="pattern"
            />
          </Link>
          <Placeholder />
        </div>
      )}

      {data.normal_add.length > 2 &&
        data.normal_add.map((ad, index) => (
          <Link
            href={ad.url}
            key={`${index}_normal_add_${ad.url}`}
            target="_blank"
          >
            <Image
              src={ad.file}
              className="w-full h-auto rounded-md"
              width={414}
              height={516}
              unoptimized
              alt="pattern"
            />
          </Link>
        ))}

      <AdsSlider ads={data.carousel_add} />
    </div>
  );
}
