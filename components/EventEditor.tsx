import { EventFormData, EventItem } from "@/lib/types";

const days = [
  { label: "Monday", date: "2026-05-04" },
  { label: "Tuesday", date: "2026-05-05" },
  { label: "Wednesday", date: "2026-05-06" },
  { label: "Thursday", date: "2026-05-07" },
  { label: "Friday", date: "2026-05-08" },
  { label: "Saturday", date: "2026-05-09" },
];

export default function EventEditor({
  selected,
  form,
  setForm,
  onSave,
  onDelete,
  onCancel,
}: {
  selected: EventItem | null;
  form: EventFormData;
  setForm: React.Dispatch<React.SetStateAction<EventFormData>>;
  onSave: (e: React.FormEvent) => void;
  onDelete: (id: number) => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/20 px-3 py-6 sm:px-6 sm:py-10">
      <aside className="relative my-auto w-full max-w-3xl rounded-[1.5rem] bg-[#dfe3ff] p-5 shadow-2xl sm:rounded-[2rem] sm:p-8">

        <div className="absolute right-5 top-4 flex items-center gap-2">
          {selected && (
            <button
              onClick={() => onDelete(selected.EventID)}
              className="h-10 rounded-full bg-black px-4 text-sm font-semibold text-white"
              type="button"
            >
              Delete
            </button>
          )}

          <button
            onClick={onCancel}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50 text-3xl font-light transition hover:bg-white"
            type="button"
          >
            ×
          </button>
        </div>

        <div className="mb-6 pr-32 sm:mb-8">
          <h2 className="text-2xl font-black sm:text-3xl">
            {selected ? "Edit Activity" : "New Activity"}
          </h2>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border-b border-black bg-transparent px-1 py-3 text-3xl font-black outline-none placeholder:text-neutral-500 sm:text-5xl"
          />

          <textarea
            placeholder="Add extra notes here..."
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="min-h-28 w-full resize-none rounded-2xl bg-white/40 p-4 outline-none"
          />

          <select
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full rounded-2xl bg-white/60 px-4 py-3 outline-none"
          >
            {days.map((day) => (
              <option key={day.date} value={day.date}>
                {day.label}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="time"
              value={form.start}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
              className="rounded-2xl bg-white/60 px-4 py-3 outline-none"
            />

            <input
              type="time"
              value={form.end}
              onChange={(e) => setForm({ ...form, end: e.target.value })}
              className="rounded-2xl bg-white/60 px-4 py-3 outline-none"
            />
          </div>

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full rounded-2xl bg-white/60 px-4 py-3 outline-none"
          />

          <input
            placeholder="Tags: school, work, personal"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full rounded-2xl bg-white/60 px-4 py-3 outline-none"
          />

          <label className="flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-3">
            <input
              type="checkbox"
              checked={form.is_important}
              onChange={(e) =>
                setForm({ ...form, is_important: e.target.checked })
              }
            />
            Important
          </label>

          <button className="w-full rounded-2xl bg-black py-4 font-bold text-white transition hover:bg-neutral-800">
            {selected ? "Save Changes" : "Create Activity"}
          </button>
        </form>
      </aside>
    </div>
  );
}