export {};

declare global {
  interface Window {
    sidekick: {
      getMeetings: () => Promise<Array<{ id: string; title: string; createdAt: string }>>;
      createMeeting: (title: string) => Promise<{ id: string; title: string; createdAt: string }>;
      openCompanion: () => Promise<boolean>;
    };
  }
}
