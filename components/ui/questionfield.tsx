'use client';

import { Question } from '@/app/utils/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface QuestionFieldProps {
  question: Question;
  value: string | number | boolean | string[] | number[] | null;
  onChange: (value: string | number | boolean | string[] | number[] | null) => void;
  error?: string;
}

export default function QuestionField({ question, value, onChange, error }: QuestionFieldProps) {
  const baseInputClasses =
    'mt-3 w-full border placeholder:font-normal bg-white dark:bg-secondary placeholder:text-gray-500 placeholder:text-sm border-gray-300 rounded-md px-4 h-[40px] text-xs focus-visible:ring-0';
  const textareaClasses =
    'mt-3 w-full border placeholder:font-normal bg-white placeholder:text-gray-500 placeholder:text-sm border-gray-300 rounded-md px-4 py-3 text-xs focus-visible:ring-0 min-h-[100px]';

  const renderField = () => {
    switch (question.type) {
      case 'text':
        return (
          <Input
            className={baseInputClasses}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            maxLength={question.validation?.maxLength}
          />
        );

      case 'textarea':
        return (
          <Textarea
            className={textareaClasses}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            maxLength={question.validation?.maxLength}
          />
        );

      case 'number':
        return (
          <Input
            type="text"
            className={baseInputClasses}
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value ? e.target.value : null)}
            placeholder={question.placeholder}
            min={question.validation?.minValue}
            max={question.validation?.minValue}
          />
        );

      case 'select':
        return (
          <Select
            value={
              typeof value === 'string' ? value : typeof value === 'number' ? String(value) : ''
            }
            onValueChange={(val) =>
              onChange(typeof question.options?.split(',')[0] === 'number' ? Number(val) : val)
            }
          >
            <SelectTrigger className={baseInputClasses}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.split(',').map((option) => (
                <SelectItem
                  key={String(option)}
                  value={String(option)}
                >
                  {String(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup
            value={
              typeof value === 'string' ? value : typeof value === 'number' ? String(value) : ''
            }
            onValueChange={(val) =>
              onChange(typeof question.options?.split(',')[0] === 'number' ? Number(val) : val)
            }
            className="mt-3 space-y-2"
          >
            {question.options?.split(',').map((option) => (
              <div
                key={String(option)}
                className="flex items-center space-x-2"
              >
                <RadioGroupItem
                  value={String(option)}
                  id={`${question.id}-${option}`}
                />
                <Label
                  htmlFor={`${question.id}-${option}`}
                  className="text-sm font-normal"
                >
                  {String(option)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="mt-3 space-y-2">
            {question.options?.split(',').map((option) => {
              const currentValues = Array.isArray(value) ? value : [];

              const isStringOptions = currentValues.every((v) => typeof v === 'string');
              const isNumberOptions = currentValues.every((v) => typeof v === 'number');

              const checked =
                isStringOptions && typeof option === 'string'
                  ? (currentValues as string[]).includes(option)
                  : isNumberOptions && typeof option === 'number'
                    ? (currentValues as number[]).includes(option)
                    : false;

              return (
                <div
                  key={String(option)}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`${question.id}-${option}`}
                    checked={checked}
                    onCheckedChange={(checkedValue) => {
                      if (checkedValue === true) {
                        if (isStringOptions && typeof option === 'string') {
                          onChange([...(currentValues as string[]), option]);
                        } else if (isNumberOptions && typeof option === 'number') {
                          onChange([...(currentValues as number[]), option]);
                        }
                      } else {
                        if (isStringOptions && typeof option === 'string') {
                          onChange((currentValues as string[]).filter((v) => v !== option));
                        } else if (isNumberOptions && typeof option === 'number') {
                          onChange((currentValues as number[]).filter((v) => v !== option));
                        }
                      }
                    }}
                  />
                  <Label
                    htmlFor={`${question.id}-${option}`}
                    className="text-sm font-normal"
                  >
                    {String(option)}
                  </Label>
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-[16px] leading-relaxed">
        {question.question}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {question.validation?.maxLength && question.type !== 'number' && (
        <p className="text-xs text-gray-500">
          {typeof value === 'string' ? value.length : 0}/{question.validation.maxLength} characters
        </p>
      )}
    </div>
  );
}
