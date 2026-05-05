import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function PopContent({ content }: { content: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <p className="mb-2 text-gray-500 w-max cursor-pointer hover:text-primary">
          What&apos;s in the issue
        </p>
      </PopoverTrigger>
      <PopoverContent
        dangerouslySetInnerHTML={{ __html: content }}
        className="text-sm text-gray-700 max-w-[700px] leading-7 w-full"
      ></PopoverContent>
    </Popover>
  );
}
