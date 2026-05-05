import { CalendarDays } from 'lucide-react';
import Link from 'next/link';
import formatDate from '@/app/utils/convertDate';
import { Category, News } from '@/app/utils/types';

export default function RecentPosts({ category, data }: { category: Category; data: News }) {
  return (
    <div className="bg-gray-100 dark:bg-secondary relative p-4 rounded-md hover:bg-primary/10 space-y-4 transition-all duration-300 shadow-sm">
      <p className="sub-heading text-primary text-[17px] !font-[600]">{category.name}</p>
      <Link
        href={`/news/${category.slug}/${data.slug}`}
        className="font-medium after:content-[''] text-[15px]  after:absolute after:w-full after:h-full after:top-0 after:left-0 after:block line-clamp-2 my-2"
      >
        {data.title}
      </Link>
      <div className="flex items-center mt-4  text-sm font-medium gap-1">
        <CalendarDays size={17} />
        <span>{formatDate(data.publish_date)}</span>
      </div>
    </div>
  );
}
