'use client';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface MonthYearPickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label: string;
  error?: string;
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const minYear = currentYear - 50; // 50 years back

export default function MonthYearPickerLimited({
  value,
  onChange,
  placeholder = 'Select month/year',
  disabled = false,
  label,
  error,
}: MonthYearPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(currentYear);

  const selectedDate = value
    ? {
        month: Number.parseInt(value.split('/')[0]) - 1,
        year: Number.parseInt(value.split('/')[1]),
      }
    : null;

  const formatDisplayValue = (month: number, year: number) => {
    return `${months[month]} ${year}`;
  };

  const handleMonthSelect = (monthIndex: number) => {
    // Don't allow future months in current year
    if (viewYear === currentYear && monthIndex > currentMonth) {
      return;
    }

    const formattedMonth = (monthIndex + 1).toString().padStart(2, '0');
    onChange(`${formattedMonth}/${viewYear}`);
    setIsOpen(false);
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && viewYear > minYear) {
      setViewYear((prev) => prev - 1);
    } else if (direction === 'next' && viewYear < currentYear) {
      setViewYear((prev) => prev + 1);
    }
  };

  const isMonthDisabled = (monthIndex: number) => {
    // Disable future months in current year
    return viewYear === currentYear && monthIndex > currentMonth;
  };

  const canNavigateNext = viewYear < currentYear;
  const canNavigatePrev = viewYear > minYear;

  return (
    <div className="space-y-2">
      <Label className="text-[16px]">{label}</Label>
      <Popover
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'mt-3 w-full justify-start text-left font-normal bg-white border-gray-300 h-[40px] px-4 focus-visible:ring-0',
              !selectedDate && 'text-gray-500',
              error && 'border-red-500',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? formatDisplayValue(selectedDate.month, selectedDate.year) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 p-0"
          align="start"
        >
          <div className="p-4">
            {/* Year Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  'h-8 w-8 bg-transparent',
                  !canNavigatePrev && 'opacity-50 cursor-not-allowed',
                )}
                onClick={() => navigateYear('prev')}
                disabled={!canNavigatePrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-semibold text-lg">{viewYear}</div>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  'h-8 w-8 bg-transparent',
                  !canNavigateNext && 'opacity-50 cursor-not-allowed',
                )}
                onClick={() => navigateYear('next')}
                disabled={!canNavigateNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => {
                const isSelected = selectedDate?.month === index && selectedDate?.year === viewYear;
                const isCurrent = index === currentMonth && viewYear === currentYear;
                const isDisabled = isMonthDisabled(index);

                return (
                  <Button
                    key={month}
                    variant={isSelected ? 'default' : 'ghost'}
                    size="sm"
                    disabled={isDisabled}
                    className={cn(
                      'h-9 text-sm font-normal',
                      isSelected && 'bg-primary text-primary-foreground',
                      isCurrent && !isSelected && 'bg-accent text-accent-foreground',
                      isDisabled && 'opacity-50 cursor-not-allowed',
                    )}
                    onClick={() => handleMonthSelect(index)}
                  >
                    {month.slice(0, 3)}
                  </Button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
