export type SessionStatus = "validated" | "in_progress" | "locked";

export type Session = {
  id: string;
  name: string;
  status: SessionStatus;
}