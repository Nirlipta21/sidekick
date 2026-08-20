import { useEffect, useState } from 'react';

export function App() {
  const path = window.location.hash.replace(/^#\/?/, '') || '';
  const [meetings, setMeetings] = useState<Array<{ id: string; title: string; createdAt: string }>>([]);

  useEffect(() => {
    window.sidekick.getMeetings().then(setMeetings).catch(() => setMeetings([]));
  }, []);

  if (path === 'companion') {
    return (
      <div className="companion-shell">
        <div className="chip">Recording</div>
        <h1>Sidekick</h1>
        <p>Transcript, commitments, and questions will live here.</p>
      </div>
    );
  }

  return (
    <main className="main-shell">
      <header>
        <div className="eyebrow">Sidekick</div>
        <h1>Your second brain during meetings.</h1>
        <p>Local-first meeting capture and memory, designed as a calm private workspace.</p>
      </header>
      <section className="panel">
        <h2>Meetings</h2>
        <button type="button" onClick={() => void window.sidekick.openCompanion()}>
          Open companion
        </button>
        <div style={{ marginTop: 16 }}>
          {meetings.length === 0 ? (
            <p>No meetings loaded yet.</p>
          ) : (
            meetings.map((meeting) => (
              <p key={meeting.id}>
                {meeting.title} · {new Date(meeting.createdAt).toLocaleString()}
              </p>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
