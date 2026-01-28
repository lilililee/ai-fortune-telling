import * as React from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  fromYear?: number;
  toYear?: number;
}

export function DatePicker({
  date,
  onSelect,
  placeholder = "选择日期",
  className,
  fromYear = 1920,
  toYear = new Date().getFullYear(),
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full bg-black/50 border border-white/20 p-3 text-left font-display",
            "focus:border-cyber-cyan focus:outline-none transition-colors",
            "flex items-center justify-between",
            !date && "text-white/50",
            date && "text-white",
            className
          )}
        >
          {date ? format(date, "yyyy年MM月dd日", { locale: zhCN }) : placeholder}
          <CalendarIcon className="h-4 w-4 text-white/50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={date}
          onSelect={(day) => {
            onSelect?.(day);
            setOpen(false);
          }}
          defaultMonth={date || new Date(2000, 0)}
          startMonth={new Date(fromYear, 0)}
          endMonth={new Date(toYear, 11)}
          locale={zhCN}
        />
      </PopoverContent>
    </Popover>
  );
}
