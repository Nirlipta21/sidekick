# Sidekick

Sidekick is a local-first Electron desktop app.

## Launch

Run the app in development with one command:

```bash
npm run dev
```

That command starts:

- the Vite renderer server
- the Electron main process build watcher
- the Electron desktop app

## Build

```bash
npm run build
```

## Package

```bash
npm run dist
```

## Notes

- Do not open `renderer/index.html` directly in a browser.
- The Electron main process is the app entry point.
- The renderer is loaded inside Electron BrowserWindows.
