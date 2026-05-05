'use client';

import { useCallback } from 'react';

export default function Filter({
  categories,
  selectedCategory,
  setSelectedCategory,
}: {
  categories: { id: number; name: string; slug: string }[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
}) {
  const handleCategoryChange = useCallback(
    (slug: string) => {
      setSelectedCategory(slug);
    },
    [setSelectedCategory],
  );

  return (
    <div
      className={`py-6 md:sticky top-5 px-4 xl:w-3/12 lg:w-4/12 md:w-4/12 w-full filterbox scrollbar  border-1 rounded-sm none lg:block `}
    >
      <div className="px-3 py-2 shadow-sm sub-heading rounded-sm bg-gray-100 dark:bg-secondary mb-4">
        <h5 className="small-heading ">Categories</h5>
      </div>
      {categories.map((item, index) => (
        <div
          key={`${item.name}_${index}`}
          className="mt-3 ps-3 flex items-center gap-3"
        >
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              checked={selectedCategory === item.slug}
              onChange={() => handleCategoryChange(item.slug)}
              id={`${item.name}_value_${index}`}
              className="hidden peer"
            />

            <div className="w-5 h-5 border-1 border-gray-400 rounded-full flex items-center justify-center transition peer-checked:border-primary">
              <div
                className={`w-3 h-3 rounded-full transition ${selectedCategory === item.slug ? 'bg-primary' : 'bg-transparent'}`}
              ></div>
            </div>

            <span className={`text-[15px] ${selectedCategory === item.slug ? 'text-primary' : ''}`}>
              {item.name}
            </span>
          </label>
        </div>
      ))}
    </div>
  );
}
