import Database from 'better-sqlite3';
import { app } from 'electron';
import fs from 'fs';
import path from 'path';

export type Meeting = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  transcript: string;
  notes: string;
};

let db: any = null;

function getDbPath() {
  const dir = path.join(app.getPath('userData'), 'data');
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, 'sidekick.sqlite3');
}

export function getDatabase() {
  if (db) return db;
  db = new Database(getDbPath());
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS meetings (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      transcript TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT ''
    );
  `);
  return db;
}

export function listMeetings(): Meeting[] {
  return getDatabase().prepare('SELECT * FROM meetings ORDER BY datetime(createdAt) DESC').all() as Meeting[];
}

export function getMeeting(id: string): Meeting | undefined {
  return getDatabase().prepare('SELECT * FROM meetings WHERE id = ?').get(id) as Meeting | undefined;
}

export function createMeeting(title: string): Meeting {
  const now = new Date().toISOString();
  const meeting: Meeting = {
    id: crypto.randomUUID(),
    title,
    createdAt: now,
    updatedAt: now,
    transcript: '',
    notes: ''
  };
  getDatabase().prepare('INSERT INTO meetings (id, title, createdAt, updatedAt, transcript, notes) VALUES (@id, @title, @createdAt, @updatedAt, @transcript, @notes)').run(meeting);
  return meeting;
}

export function updateMeeting(id: string, patch: Partial<Pick<Meeting, 'title' | 'transcript' | 'notes'>>) {
  const current = getMeeting(id);
  if (!current) return undefined;
  const updated: Meeting = { ...current, ...patch, updatedAt: new Date().toISOString() };
  getDatabase().prepare('UPDATE meetings SET title = @title, transcript = @transcript, notes = @notes, updatedAt = @updatedAt WHERE id = @id').run(updated);
  return updated;
}

export function deleteMeeting(id: string) {
  getDatabase().prepare('DELETE FROM meetings WHERE id = ?').run(id);
}
