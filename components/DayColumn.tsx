import EventCard from "@/components/EventCard";
import { EventItem } from "@/lib/types";

export default function DayColumn({
  day,
  events,
  isOpen,
  onToggle,
  onEventClick,
  onEventDrop,
}: {
  day: { label: string; date: string };
  events: EventItem[];
  isOpen: boolean;
  onToggle: () => void;
  onEventClick: (event: EventItem) => void;
  onEventDrop: (eventId: number, newDate: string) => void;
}) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const id = Number(e.dataTransfer.getData("eventId"));
        if (id) onEventDrop(id, day.date);
      }}
      className={`min-h-[560px] shrink-0 transition-all duration-500 ease-out ${
        isOpen
          ? "w-[260px] sm:w-[320px] lg:w-[380px]"
          : "w-[115px] sm:w-[145px] lg:w-[170px]"
      }`}
    >
      <button
        onClick={onToggle}
        className="mb-4 flex min-h-[70px] w-full items-end border-b-4 border-black pb-3 text-left"
      >
        <h2
          className={`break-words font-black leading-none tracking-tight transition-all duration-500 ${
            isOpen ? "text-4xl sm:text-5xl" : "text-xl sm:text-2xl"
          }`}
        >
          {day.label}
        </h2>
      </button>

      <div
        className={`space-y-3 overflow-hidden transition-all duration-500 ${
          isOpen ? "opacity-100" : "opacity-80"
        }`}
      >
        {events.map((event) => (
          <EventCard
            key={event.EventID}
            event={event}
            onClick={() => onEventClick(event)}
          />
        ))}

        {Array.from({ length: Math.max(9 - events.length, 3) }).map((_, i) => (
          <div key={i} className="h-12 border-b border-neutral-300" />
        ))}
      </div>
    </div>
  );
}