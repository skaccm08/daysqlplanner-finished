import { EventItem } from "@/lib/types";

export default function EventCard({
  event,
  onClick,
}: {
  event: EventItem;
  onClick: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) =>
        e.dataTransfer.setData("eventId", String(event.EventID))
      }
      onClick={onClick}
      className={`cursor-pointer bg-green-300 px-3 py-3 shadow-sm transition hover:scale-[1.02] sm:px-4 
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 break-words text-sm font-bold leading-tight lg:text-base">
          {event.Title}
        </h3>
        <span className="shrink-0 text-xs font-medium text-neutral-700 lg:text-sm">
          {toTime(event.StartTime)}
        </span>
      </div>

      {event.Descr && (
        <p className="mt-1 line-clamp-2 break-words text-xs text-neutral-700 lg:text-sm">
          {event.Descr}
        </p>
      )}
    </div>
  );
}

function toTime(value: string) {
  const d = new Date(value);
  return d.toTimeString().slice(0, 5);
}