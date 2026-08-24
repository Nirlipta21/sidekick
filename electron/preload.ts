import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('sidekick', {
  getMeetings: () => ipcRenderer.invoke('meetings:list'),
  createMeeting: (title: string) => ipcRenderer.invoke('meetings:create', { title }),
  getMeeting: (id: string) => ipcRenderer.invoke('meetings:get', id),
  updateMeeting: (id: string, patch: { title?: string; transcript?: string; notes?: string }) =>
    ipcRenderer.invoke('meetings:update', id, patch),
  deleteMeeting: (id: string) => ipcRenderer.invoke('meetings:delete', id),
  openCompanion: () => ipcRenderer.invoke('window:companion:show')
});
