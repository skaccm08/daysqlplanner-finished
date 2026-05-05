export type User = {
  UserID: number;
  Name_: string;
  Email: string;
};

export type EventItem = {
  EventID: number;
  UserID: number;
  Title: string;
  Descr: string | null;
  StartTime: string;
  EndTime: string;
  Location: string | null;
  IsImportant: number | boolean;
  Tags?: string | null;
};

export type EventFormData = {
  title: string;
  description: string;
  date: string;
  start: string;
  end: string;
  location: string;
  is_important: boolean;
  tags: string;
};