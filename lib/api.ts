const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function handleResponse(res: Response) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || `${res.status}`);
  return data;
}

export async function registerUser(data: any) {
  return handleResponse(
    await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  );
}

export async function loginUser(data: any) {
  return handleResponse(
    await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  );
}

export async function createEvent(data: any) {
  return handleResponse(
    await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  );
}

export async function getEvents(userId: number) {
  return handleResponse(await fetch(`${API_URL}/events/user/${userId}`));
}

export async function updateEvent(eventId: number, data: any) {
  return handleResponse(
    await fetch(`${API_URL}/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  );
}

export async function deleteEvent(eventId: number) {
  return handleResponse(
    await fetch(`${API_URL}/events/${eventId}`, {
      method: "DELETE",
    })
  );
}


export async function getTags(userId: number) {
  return handleResponse(await fetch(`${API_URL}/tags/user/${userId}`));
}

export async function getEventsByTag(userId: number, tag: string) {
  return handleResponse(
    await fetch(`${API_URL}/events/user/${userId}/tag/${tag}`)
  );
}

export async function getStats(userId: number) {
  const res = await fetch(`${API_URL}/events/user/${userId}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function getBusiestDay(userId: number) {
  const res = await fetch(`${API_URL}/events/user/${userId}/busiest-day`);
  if (!res.ok) throw new Error("Failed to fetch busiest day");
  return res.json();
}