'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ad, Tab } from '@/app/utils/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ListCard from '../news/newsCard';

export default function OtherTabs({ tabsData, ad }: { tabsData: Tab[]; ad: ad }) {
  const [selectedTab, setSelectedTab] = useState(tabsData?.[0]?.title?.toLowerCase() ?? '');

  if (!tabsData || tabsData.length === 0) return null;

  return (
    <div className="container flex lg:flex-row flex-col items-center gap-5 my-8">
      {/* Tabs */}
      <div className="lg:w-6/12 w-full">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <TabsList className="bg-white dark:bg-background flex-wrap sm:gap-5 gap-0">
            {tabsData.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.title.toLowerCase()}
                className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary cursor-pointer text-[13px] rounded-[3px] uppercase data-[state=active]:text-white"
              >
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabsData.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.title.toLowerCase()}
            >
              {tab.item.map((item) => (
                <div key={item.id}>
                  {'featured_img' in item && (
                    <ListCard
                      title={item.title}
                      type={tab.title.toLowerCase()}
                      {...('content' in item && { content: item.content })}
                      imageUrl={item.featured_img}
                      date={item.publish_date}
                      slug={item.slug}
                    />
                  )}
                  {'images' in item && (
                    <ListCard
                      title={item.title}
                      type={tab.title.toLowerCase()}
                      imageUrl={item.images[0].image}
                      date={item.date}
                      slug={item.slug}
                    />
                  )}
                </div>
              ))}
              <Link
                href={`/${tab.title.toLowerCase()}`}
                className="mt-4 block w-max m-auto px-5 rounded-sm bg-primary text-white py-1   font-medium hover:bg-red-600 transition"
              >
                View All
              </Link>{' '}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Advertisement Image */}
      <div className="lg:w-6/12 rounded-md">
        <Link
          href={ad?.link || `${process.env.NEXT_PUBLIC_BASE_URL}`}
          target="_blank"
        >
          <Image
            src={ad?.image}
            // src={ad?.image || process.env.NEXT_PUBLIC_BASE_URL + 'ad4.webp'}
            width={903}
            height={578}
            className="w-full rounded-md"
            alt="Advertisement Banner"
          />
        </Link>
      </div>
    </div>
  );
}
