import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('sidekick', {
  getMeetings: () => ipcRenderer.invoke('meetings:list'),
  createMeeting: (title: string) => ipcRenderer.invoke('meetings:create', { title }),
  openCompanion: () => ipcRenderer.invoke('window:companion:show')
});
