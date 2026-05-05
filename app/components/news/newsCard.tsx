'use client';

import { CalendarDays } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import formatDate from '@/app/utils/convertDate';
import { CreateSlug } from '@/app/utils/createSlug';

type NewsCardProps = {
  title: string;
  content?: string;
  imageUrl: string;
  date: string;
  type: string;
  altText?: string;
  category?: string;
  categorySlug?: string;
  slug: string;
};

const ListCard = ({
  title,
  content,
  category,
  altText,
  categorySlug,
  type,
  imageUrl,
  date,
  slug,
}: NewsCardProps) => {
  return (
    <div className="flex w-full flex-col items-center group lg:flex-row border relative  p-4 gap-8  rounded-xl shadow-sm overflow-hidden mb-4">
      <div className={`w-full lg:w-3/12 overflow-hidden rounded-xl relative  aspect-square`}>
        {imageUrl && (
          <Image
            src={imageUrl}
            fill
            alt={altText || title}
            className="object-cover group-hover:scale-105 transition-all duration-300 !rounded-xl"
          />
        )}
      </div>

      <div className="flex flex-col justify-between w-full lg:w-2/3">
        <div>
          {category && <p className="text-primary capitalize text-lg font-medium">{category}</p>}

          <h2 className="sub-heading text-[18px] font-bold  mt-1 line-clamp-2">{title}</h2>

          <div className="flex items-center gap-4  text-sm mt-2">
            <div className="flex items-center gap-1">
              <CalendarDays size={16} />
              <span>{formatDate(date)}</span>
            </div>
          </div>

          {content && (
            <div
              className="sub-content mt-2 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: content }}
            ></div>
          )}

          <div className="mt-3">
            <Link
              href={`/${CreateSlug(type)}/${categorySlug ? `${categorySlug}/` : ''}${slug}`}
              className="flex after:content-['']  after:absolute after:top-0 after:left-0 after:w-full after:h-full items-center text-primary font-medium"
            >
              {/*<PlusCircle
                size={18}
                className="mr-2"
              />
              Read More*/}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCard;
