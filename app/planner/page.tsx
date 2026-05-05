"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlannerHeader from "@/components/PlannerHeader";
import ScheduleBoard from "@/components/ScheduleBoard";
import EventEditor from "@/components/EventEditor";
import {
  getEvents,
  getEventsByTag,
  getTags,
  createEvent,
  updateEvent,
  deleteEvent,
  getStats,
  getBusiestDay,
} from "@/lib/api";
import { EventFormData, EventItem, User } from "@/lib/types";

const makeEmptyForm = (): EventFormData => ({
  title: "",
  description: "",
  date: "2026-05-04",
  start: "09:00",
  end: "10:00",
  location: "",
  is_important: false,
  tags: "",
});

export default function PlannerPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selected, setSelected] = useState<EventItem | null>(null);
  const [form, setForm] = useState<EventFormData>(makeEmptyForm());
  const [editorOpen, setEditorOpen] = useState(false);
  const [tagFilter, setTagFilter] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [busiest, setBusiest] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("planner_user");

    if (!stored) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(stored);
    setUser(parsed);

    refreshAll(parsed.UserID, "");
  }, []);

  async function loadEvents(userId: number) {
    const data = await getEvents(userId);
    setEvents(data);
  }

  async function loadTags(userId: number) {
    const data = await getTags(userId);
    setTags(data.map((tag: any) => tag.Name_));
  }

  async function loadStats(userId: number) {
    const data = await getStats(userId);
    setStats(data);
  }

  async function loadBusiest(userId: number) {
    const data = await getBusiestDay(userId);
    setBusiest(data);
  }

  async function filterByTag(tag: string, userId: number) {
    const data = await getEventsByTag(userId, tag);
    setEvents(data);
  }

  async function refreshAll(userId: number, activeTag = tagFilter) {
    if (activeTag) {
      await filterByTag(activeTag, userId);
    } else {
      await loadEvents(userId);
    }

    await loadTags(userId);
    await loadStats(userId);
    await loadBusiest(userId);
  }

  async function clearFilter() {
    if (!user?.UserID) return;

    setTagFilter("");
    await refreshAll(user.UserID, "");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!user?.UserID) {
      localStorage.removeItem("planner_user");
      router.push("/login");
      return;
    }

    const payload = {
      user_id: user.UserID,
      title: form.title,
      description: form.description,
      start_time: `${form.date}T${form.start}:00`,
      end_time: `${form.date}T${form.end}:00`,
      location: form.location,
      is_important: form.is_important,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    if (selected) {
      await updateEvent(selected.EventID, payload);
    } else {
      await createEvent(payload);
    }

    setSelected(null);
    setForm(makeEmptyForm());
    setEditorOpen(false);

    await refreshAll(user.UserID);
  }

  function openEditor(event: EventItem) {
    setSelected(event);

    setForm({
      title: event.Title,
      description: event.Descr || "",
      date: event.StartTime.slice(0, 10),
      start: toTime(event.StartTime),
      end: toTime(event.EndTime),
      location: event.Location || "",
      is_important: Boolean(event.IsImportant),
      tags: event.Tags || "",
    });
  }

  async function handleDelete(id: number) {
    if (!user?.UserID) return;

    await deleteEvent(id);

    setSelected(null);
    setForm(makeEmptyForm());
    setEditorOpen(false);

    await refreshAll(user.UserID);
  }

  async function handleDrop(eventId: number, newDate: string) {
    if (!user?.UserID) return;

    const event = events.find((e) => e.EventID === eventId);
    if (!event) return;

    await updateEvent(eventId, {
      title: event.Title,
      description: event.Descr,
      start_time: `${newDate}T${toTime(event.StartTime)}:00`,
      end_time: `${newDate}T${toTime(event.EndTime)}:00`,
      location: event.Location,
      is_important: Boolean(event.IsImportant),
      tags: event.Tags
        ? event.Tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    });

    await refreshAll(user.UserID);
  }

  function logout() {
    localStorage.removeItem("planner_user");
    router.push("/login");
  }

  if (!user) return null;

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-white px-3 py-4 text-black sm:px-5 lg:px-8">
      <div className="mx-auto w-full max-w-[1800px]">
        <PlannerHeader
          user={user}
          onLogout={logout}
          onCreate={() => {
            setSelected(null);
            setForm(makeEmptyForm());
            setEditorOpen(true);
          }}
          tagFilter={tagFilter}
          setTagFilter={setTagFilter}
          onFilterTag={(tag) => {
            setTagFilter(tag);
            filterByTag(tag, user.UserID);
          }}
          onClearFilter={clearFilter}
          tags={tags}
          stats={stats}
          busiest={busiest}
        />

        {editorOpen && (
          <EventEditor
            selected={selected}
            form={form}
            setForm={setForm}
            onSave={handleSave}
            onDelete={handleDelete}
            onCancel={() => {
              setEditorOpen(false);
              setSelected(null);
              setForm(makeEmptyForm());
            }}
          />
        )}

        <div className="w-full overflow-hidden">
          <ScheduleBoard
            events={events}
            onEventClick={(event) => {
              openEditor(event);
              setEditorOpen(true);
            }}
            onEventDrop={handleDrop}
          />
        </div>
      </div>
    </main>
  );
}

function toTime(value: string) {
  const d = new Date(value);
  return d.toTimeString().slice(0, 5);
}