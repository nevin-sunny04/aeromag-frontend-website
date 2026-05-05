import { CalendarDays, Folder, User } from 'lucide-react';
import formatDate from '../utils/convertDate';

export default function Byline({
  category,
  author,
  date,
}: {
  category?: string;
  author?: string;
  date: string;
}) {
  return (
    <div className="flex gap-5 flex-wrap text-[15px]">
      <div className="flex items-center gap-1 dark:text-gray-300 text-black font-medium mt-1">
        <CalendarDays size={17} />
        <span>{formatDate(date)}</span>
      </div>
      {category && (
        <div className="flex items-center gap-1  dark:text-gray-300 text-black font-medium mt-1">
          <Folder size={17} />
          <span>{category}</span>
        </div>
      )}

      {author && (
        <div className="flex items-center gap-1  dark:text-gray-300 text-black font-medium mt-1">
          <User size={17} />
          <span>{author}</span>
        </div>
      )}
    </div>
  );
}
