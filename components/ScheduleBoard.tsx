"use client";

import { useState } from "react";
import DayColumn from "@/components/DayColumn";
import { EventItem } from "@/lib/types";

const days = [
  { label: "Monday", date: "2026-05-04" },
  { label: "Tuesday", date: "2026-05-05" },
  { label: "Wednesday", date: "2026-05-06" },
  { label: "Thursday", date: "2026-05-07" },
  { label: "Friday", date: "2026-05-08" },
  { label: "Saturday", date: "2026-05-09" },
];

export default function ScheduleBoard({
  events,
  onEventClick,
  onEventDrop,
}: {
  events: EventItem[];
  onEventClick: (event: EventItem) => void;
  onEventDrop: (eventId: number, newDate: string) => void;
}) {
  const [openDay, setOpenDay] = useState<string>("2026-05-02");

  return (
    <section className="w-full max-w-full overflow-x-auto pb-6">
      <div className="flex w-max min-w-full gap-4 pr-4">
        {days.map((day) => {
          const isOpen = openDay === day.date;

          return (
            <DayColumn
              key={day.date}
              day={day}
              isOpen={isOpen}
              onToggle={() => setOpenDay(day.date)}
              events={events.filter(
                (event) => event.StartTime.slice(0, 10) === day.date
              )}
              onEventClick={onEventClick}
              onEventDrop={onEventDrop}
            />
          );
        })}
      </div>
    </section>
  );
}