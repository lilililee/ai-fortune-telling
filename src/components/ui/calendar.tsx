import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout,
  ...props
}: CalendarProps) {
  const isDropdown = captionLayout === "dropdown";

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: isDropdown ? "sr-only" : "text-sm font-medium text-white",
        nav: "flex items-center gap-1",
        button_previous: "absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center text-white hover:bg-white/10 rounded",
        button_next: "absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center text-white hover:bg-white/10 rounded",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-cyber-cyan/60 rounded-md w-9 font-normal text-[0.8rem] text-center",
        week: "flex w-full mt-2",
        day: "h-9 w-9 text-center text-sm p-0 relative flex items-center justify-center",
        day_button: "h-9 w-9 p-0 font-normal text-white hover:bg-cyber-cyan/20 rounded transition-colors cursor-pointer flex items-center justify-center",
        selected: "bg-cyber-cyan text-cyber-black hover:bg-cyber-cyan hover:text-cyber-black focus:bg-cyber-cyan focus:text-cyber-black rounded",
        today: "bg-white/10 text-cyber-cyan rounded",
        outside: "text-white/30 opacity-50",
        disabled: "text-white/20 opacity-50",
        hidden: "invisible",
        dropdowns: "flex gap-4 justify-center items-center",
        dropdown: "appearance-none bg-cyber-black border border-white/20 text-white px-3 py-1.5 rounded text-sm cursor-pointer hover:border-cyber-cyan focus:border-cyber-cyan focus:outline-none",
        dropdown_root: "relative inline-flex",
        chevron: "hidden",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
