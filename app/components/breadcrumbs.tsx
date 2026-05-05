'use client';

import { ChevronRight, Home, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

const Breadcrumb = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;
  const knownPaths = ['/news', '/magazines', '/policy'];

  const isLinkable = (href: string) => {
    return knownPaths.includes(href);
  };

  return (
    <nav
      aria-label="breadcrumb"
      className="text-[16px]  gap-2  flex items-center flex-wrap"
    >
      {pathname.match(/\/news(\/|$)/) ? (
        <Newspaper size={16} />
      ) : (
        <>
          <Home size={16} />
          <Link
            className="capitalize font-medium"
            href="/"
          >
            Home
          </Link>
          <span>
            <ChevronRight size={16} />
          </span>
        </>
      )}

      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        const label = decodeURIComponent(segment).replace(/-/g, ' ');

        return (
          <Fragment key={href}>
            {index > 0 && (
              <span className="">
                <ChevronRight size={16} />
              </span>
            )}
            {isLast ? (
              <span className="text-primary font-medium capitalize">{label}</span>
            ) : !isLinkable(href) ? (
              <Link
                href={href}
                className="capitalize font-medium"
              >
                {label}
              </Link>
            ) : (
              <span className="capitalize font-medium text-gray-600">{label}</span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
