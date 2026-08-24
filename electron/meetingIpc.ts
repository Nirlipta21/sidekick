import type { IpcMain } from 'electron';
import { createMeeting, deleteMeeting, getMeeting, listMeetings, updateMeeting } from './db';

export function registerMeetingIpc(ipcMain: IpcMain) {
  ipcMain.handle('meetings:list', () => listMeetings());
  ipcMain.handle('meetings:create', (_event, input: { title: string }) => createMeeting(input.title.trim() || 'Untitled meeting'));
  ipcMain.handle('meetings:get', (_event, id: string) => getMeeting(id) ?? null);
  ipcMain.handle('meetings:update', (_event, id: string, patch: { title?: string; transcript?: string; notes?: string }) =>
    updateMeeting(id, patch) ?? null
  );
  ipcMain.handle('meetings:delete', (_event, id: string) => {
    deleteMeeting(id);
    return true;
  });
}
