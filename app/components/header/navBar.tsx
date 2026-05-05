'use client';

import { ChevronDown, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { Category, MenuItem } from '@/app/utils/types';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Navbar({
  category,
  magazineCat,
}: {
  category: Category[];
  magazineCat: Category[];
}) {
  const navRef = useRef<HTMLDivElement>(null);
  // const [useSheet, setUseSheet] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const path = usePathname();

  const menu: MenuItem[] = [
    { name: 'Home', link: '/' },
    {
      name: 'News',
      submenus: category,
    },
    {
      name: 'Magazines',
      submenus: magazineCat,
    },
    { name: 'Media Kit', link: '/media-kit' },
    { name: 'Podcasts', link: '/podcasts' },
    { name: 'Videos', link: '/videos' },
    { name: 'Interviews', link: '/interviews' },
    { name: 'Gallery', link: '/gallery' },
  ];

  // useEffect(() => {
  //   const checkOverflow = () => {
  //     const el = navRef.current;
  //     if (!el) return;
  //     const isOverflowing = el.scrollWidth > el.clientWidth;
  //     setUseSheet(isOverflowing);
  //   };

  //   checkOverflow();
  //   window.addEventListener('resize', checkOverflow);
  //   return () => window.removeEventListener('resize', checkOverflow);
  // }, []);

  return (
    <div
      ref={navRef}
      className="flex items-center"
    >
      {/* Desktop Navbar */}
      <nav className="hidden lg:flex gap-2 items-center">
        {menu.map((item, index) => (
          <div
            key={index}
            className="relative"
          >
            {item.submenus ? (
              <div
                className="flex items-center px-3 py-1 rounded-sm gap-1.5 cursor-pointer hover:text-primary"
                onMouseEnter={() => setOpenIndex(index)}
                onMouseLeave={() => setOpenIndex(null)}
              >
                {item.link ? (
                  <Link
                    href={item.link}
                    className="font-normal text-[15px]"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="font-normal text-[15px]">{item.name}</span>
                )}
                <ChevronDown size={15} />
              </div>
            ) : (
              <>
                {item.link && (
                  <Link
                    href={item.link}
                    className={`${
                      path === item.link ? 'bg-primary text-white' : 'hover:text-primary'
                    } px-3 py-1 rounded-[3px] font-medium text-[15px]`}
                  >
                    {item.name}
                  </Link>
                )}
              </>
            )}

            {/* Dropdown */}
            {item.submenus && openIndex === index && (
              <div
                className="absolute z-50 left-0 w-max bg-white dark:bg-secondary overflow-hidden  shadow-lg rounded-md"
                onMouseEnter={() => setOpenIndex(index)}
                onMouseLeave={() => setOpenIndex(null)}
              >
                <ul>
                  {item.submenus.map((submenu, subIndex) => (
                    <li key={subIndex}>
                      {submenu.name && (
                        <Link
                          href={`/${item.name === 'News' ? 'news' : 'magazines'}/${submenu.slug}`}
                          className={`${path.includes(submenu.slug) ? 'bg-primary text-white' : 'text-gray-800 dark:text-foreground hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-primary'} transition-all duration-300 block px-4 py-2  text-[14px]`}
                        >
                          {submenu.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Mobile Menu */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger className="p-2 text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
            <Menu size={24} />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[280px] sm:w-[320px] p-0 flex flex-col"
          >
            <SheetHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
              <SheetTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Menu
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <nav className="space-y-1">
                {menu.map((item, index) => (
                  <div
                    key={index}
                    className="space-y-1"
                  >
                    {item.link ? (
                      <SheetClose asChild>
                        <Link
                          href={item.link}
                          className={`flex items-center px-3 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-200 ${
                            path === item.link
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-primary dark:hover:bg-gray-800/50'
                          }`}
                        >
                          {item.name}
                        </Link>
                      </SheetClose>
                    ) : (
                      <div className="px-3 py-2.5 text-[15px] font-medium text-gray-900 dark:text-gray-100">
                        {item.name}
                      </div>
                    )}

                    {item.submenus && item.submenus.length > 0 && (
                      <div className="ml-4 pl-3 border-l-2 border-gray-100 dark:border-gray-800 space-y-0.5">
                        {item.submenus.map(
                          (sub, subIndex) =>
                            sub.name && (
                              <SheetClose
                                key={subIndex}
                                asChild
                              >
                                <Link
                                  href={`/${item.name === 'News' ? 'news' : 'magazines'}/${sub.slug}`}
                                  className={`block px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                                    path === `/news/${sub.slug}`
                                      ? 'text-primary bg-primary/10 font-medium'
                                      : 'text-gray-600 hover:text-primary hover:bg-gray-50 dark:text-gray-400 dark:hover:text-primary dark:hover:bg-gray-800/30'
                                  }`}
                                >
                                  {sub.name}
                                </Link>
                              </SheetClose>
                            ),
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <SheetClose asChild>
                  <Link
                    href={'/newsletter'}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-200 ${
                      path === '/newsletter'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:text-primary dark:hover:bg-gray-800/50'
                    }`}
                  >
                    Newsletter
                  </Link>
                </SheetClose>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
