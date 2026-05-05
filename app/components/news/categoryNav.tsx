'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { Category } from '@/app/utils/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function CategoryNav({
  category,
  magazineCat,
}: {
  category: Category[];
  magazineCat: Category[];
}) {
  const pathname = usePathname();
  const params = useParams();

  if (params.news) return;
  if (!pathname.match(/\/(news|magazines)(\/|$)/)) return;

  const isMagazinePage = pathname.includes('magazines');
  const menu = isMagazinePage ? magazineCat : category;
  const baseSlug = isMagazinePage ? 'magazines' : 'news';

  return (
    <nav className="flex items-center justify-between  ">
      {/* Desktop Nav */}
      <ul className="hidden lg:flex gap-5">
        {menu.map((cat) => (
          <li key={`category_${cat.name}`}>
            <Link
              href={`/${baseSlug}/${cat.slug}`}
              className={`${pathname.includes(cat.slug) ? 'bg-primary !text-white !dark:text-foreground' : ''} px-3 hover:text-primary rounded-sm py-1 text-uppercase`}
            >
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile/Tablet Dropdown Menu */}
      <div className="lg:hidden block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
            >
              <Menu className="h-6 w-" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-white text-black"
          >
            {menu.map((cat) => (
              <DropdownMenuItem
                key={cat.name}
                asChild
              >
                <Link
                  href={`/${baseSlug}/${cat.slug}`}
                  className="w-full hover:underline"
                >
                  {cat.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
