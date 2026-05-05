import { User } from "@/lib/types";

const days = [
  { label: "Monday", date: "2026-05-04" },
  { label: "Tuesday", date: "2026-05-05" },
  { label: "Wednesday", date: "2026-05-06" },
  { label: "Thursday", date: "2026-05-07" },
  { label: "Friday", date: "2026-05-08" },
  { label: "Saturday", date: "2026-05-09" },
];

export default function PlannerHeader({
  user,
  onLogout,
  onCreate,
  tagFilter,
  setTagFilter,
  onFilterTag,
  onClearFilter,
  tags,
  stats,
}: {
  user: User;
  onLogout: () => void;
  onCreate: () => void;
  tagFilter: string;
  setTagFilter: (value: string) => void;
  onFilterTag: (tag: string) => void;
  onClearFilter: () => void;
  tags: string[];
  stats: any[];
  busiest: any[];
}) {
  const today = new Date().toISOString().slice(0, 10);
  const plannerDates = days.map((d) => d.date);

  const weekStats = stats.filter((s) =>
    plannerDates.includes(String(s.day).slice(0, 10))
  );

  const todayCount =
    weekStats.find((s) => String(s.day).slice(0, 10) === today)?.event_count ||
    0;

  const busiestDay = weekStats.length
    ? weekStats.reduce((max, curr) =>
        Number(curr.event_count) > Number(max.event_count) ? curr : max
      )
    : null;

  const busiestLabel = busiestDay
    ? days.find((d) => d.date === String(busiestDay.day).slice(0, 10))?.label ||
      "N/A"
    : "N/A";

  return (
    <header className="mb-4 flex flex-col items-end gap-3">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <select
          value={tagFilter}
          onChange={(e) => {
            const value = e.target.value;
            setTagFilter(value);

            if (value === "") {
              onClearFilter();
            } else {
              onFilterTag(value);
            }
          }}
          className="h-12 border border-neutral-300 bg-white px-4 text-sm outline-none"
        >
          <option value="">All Tags</option>

          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <div className="relative group">
          <div className="flex h-12 w-12 items-center justify-center border border-black bg-black text-xl text-white">
            i
          </div>

          <div className="pointer-events-none absolute right-0 top-12 w-48 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
            <div className="border border-neutral-300 bg-white p-3 text-xs shadow-lg sm:text-sm">
              <p className="text-neutral-500">Today</p>
              <p className="mb-2 font-semibold text-black">
                {todayCount} events
              </p>

              <p className="text-neutral-500">Busiest Day</p>
              <p className="font-semibold text-black">{busiestLabel}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onCreate}
          className="flex h-12 w-12 items-center justify-center bg-black text-3xl font-light text-white shadow-sm transition hover:scale-105"
        >
          +
        </button>

        <button
          onClick={onLogout}
          className="h-12 bg-black px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Logout
        </button>
      </div>
    </header>
  );
}