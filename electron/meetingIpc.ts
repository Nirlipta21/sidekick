import type { IpcMain } from 'electron';

const meetings = [
  {
    id: 'demo-1',
    title: 'Discovery Call',
    createdAt: new Date().toISOString()
  }
];

export function registerMeetingIpc(ipcMain: IpcMain) {
  ipcMain.handle('meetings:list', () => {
    console.log('[sidekick] meetings:list');
    return meetings;
  });
  ipcMain.handle('meetings:create', (_event, input: { title: string }) => {
    console.log('[sidekick] meetings:create');
    const meeting = { id: crypto.randomUUID(), title: input.title, createdAt: new Date().toISOString() };
    meetings.unshift(meeting);
    return meeting;
  });
}
