'use client';

import { ChevronDownIcon } from 'lucide-react';
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from 'react-aria-components';

const months = [
  { value: 'all', label: 'All' },
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export default function YearMonthPicker({
  selectedYear,
  selectedMonth,
  onYearChangeAction,
  onMonthChangeAction,
  onClearAction,
  startYear = 2007, // ✅ default fallback prop
}: {
  selectedYear: string;
  selectedMonth: string;
  onYearChangeAction: (year: string) => void;
  onMonthChangeAction: (month: string) => void;
  onClearAction: () => void;
  startYear?: number;
}) {
  const currentYear = new Date().getFullYear();

  const StartYear = !startYear || startYear > currentYear || startYear < 1900 ? 2007 : startYear;

  const years = [
    { value: 'all', label: 'All' },
    ...Array.from({ length: currentYear - StartYear + 1 }, (_, i) => {
      const year = StartYear + i;
      return { value: year.toString(), label: year.toString() };
    }).reverse(),
  ];

  return (
    <div className="w-full space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        {/* Year Selector */}
        <div className="space-y-2">
          <Label className="font-medium">Year</Label>
          <Select
            selectedKey={selectedYear || 'all'}
            onSelectionChange={(newYear) => {
              if (newYear) onYearChangeAction(newYear.toString());
            }}
            className="mt-3 relative"
          >
            <Button className="bg-background border-input hover:bg-accent w-full hover:text-accent-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 flex h-10 items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors outline-none data-focus-visible:ring-[3px]">
              <SelectValue className="text-primary font-medium text-[15px] data-has-selected-key:text-foreground">
                {selectedYear && selectedYear !== 'all'
                  ? years.find((y) => y.value === selectedYear)?.label
                  : 'All'}
              </SelectValue>
              <span className="bg-primary absolute w-[40px] flex items-center justify-center rounded-e-lg h-full right-0">
                <ChevronDownIcon
                  size={20}
                  className="text-white"
                />
              </span>
            </Button>
            <Popover className="bg-popover text-popover-foreground max-h-60 w-[304px] overflow-auto rounded-md border shadow-lg outline-hidden z-50">
              <ListBox className="p-1">
                {years.map((year) => (
                  <ListBoxItem
                    key={year.value}
                    id={year.value}
                    className="hover:bg-accent hover:text-accent-foreground data-focus-visible:bg-accent data-focus-visible:text-accent-foreground data-selected:bg-accent data-selected:text-accent-foreground relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors"
                  >
                    {year.label}
                  </ListBoxItem>
                ))}
              </ListBox>
            </Popover>
          </Select>
        </div>

        {/* Month Selector */}
        <div className="space-y-2">
          <Label className="font-medium">Month</Label>
          <Select
            selectedKey={selectedMonth || 'all'}
            onSelectionChange={(newMonth) => {
              if (newMonth) onMonthChangeAction(newMonth.toString());
            }}
            className="mt-3 relative"
          >
            <Button className="bg-background border-input hover:bg-accent hover:text-accent-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors outline-none data-focus-visible:ring-[3px]">
              <SelectValue className="text-primary font-medium text-[15px] data-has-selected-key:text-foreground">
                {selectedMonth && selectedMonth !== 'all'
                  ? months.find((m) => m.value === selectedMonth)?.label
                  : 'All'}
              </SelectValue>
              <span className="bg-primary absolute w-[40px] flex items-center justify-center rounded-e-lg h-full right-0">
                <ChevronDownIcon
                  size={20}
                  className="text-white"
                />
              </span>
            </Button>
            <Popover className="bg-popover text-popover-foreground max-h-60 w-[304px] overflow-auto rounded-md border shadow-lg outline-hidden z-50">
              <ListBox className="p-1">
                {months.map((month) => (
                  <ListBoxItem
                    key={month.value}
                    id={month.value}
                    className="hover:bg-accent hover:text-accent-foreground data-focus-visible:bg-accent data-focus-visible:text-accent-foreground data-selected:bg-accent data-selected:text-accent-foreground relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors"
                  >
                    {month.label}
                  </ListBoxItem>
                ))}
              </ListBox>
            </Popover>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {(selectedYear && selectedYear !== 'all') || (selectedMonth && selectedMonth !== 'all') ? (
          <div className="bg-muted/50 flex justify-between rounded-md px-3 py-1 mt-">
            <div>
              <p className="font-medium text-primary mb-2">Selected:</p>
              <p className="font-medium">
                {selectedMonth &&
                  selectedMonth !== 'all' &&
                  months.find((m) => m.value === selectedMonth)?.label}
                {selectedMonth &&
                  selectedMonth !== 'all' &&
                  selectedYear &&
                  selectedYear !== 'all' &&
                  ' '}
                {selectedYear && selectedYear !== 'all' && selectedYear}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Button
                onClick={onClearAction}
                 className="bg-red-500 hover:bg-red-600 text-sm text-white font-semibold rounded-md px-2 py-1"
              >
                Clear
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
