export enum JobState {
  Queued = 'queued',
  Running = 'running',
  Completed = 'completed',
  Failed = 'failed',
  Cancelled = 'cancelled',
}

export interface MirrorJobRecord {
  id: string;
  url: string;
  createdAt: string; // ISO
  startedAt?: string | null;
  completedAt?: string | null;
  state: JobState;
  message?: string;
  artifactPath?: string | null;
}
