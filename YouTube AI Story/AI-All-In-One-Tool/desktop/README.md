# Creator Studio Desktop

This is the Tauri-only desktop application for Creator Studio. It uses a native Rust backend and a lightweight TypeScript interface. Electron is not used.

## Operating Modes

- **Idle workspace:** The app checks local paths and lightweight command availability only. It does not load Ollama models, TTS models, MoviePy, or video-rendering processes.
- **Video job:** The local generation pipeline is initialized only after a creator explicitly starts a video. Dependencies, local models, TTS, rendering, and output validation are activated at that point.

## Development

From this folder, run:

```powershell
npm install
npm run build
npm run tauri dev
```

`npm run build` validates the frontend. `npm run tauri dev` launches the native desktop development application.

## Windows Native Build Requirement

Tauri's Rust backend requires Microsoft Visual C++ Build Tools with the **Desktop development with C++** workload, including MSVC and a Windows SDK. Without them, Rust reports that `link.exe` is missing.

## Local Data

Creator Studio creates and reads its workspace at `%USERPROFILE%\Documents\Creator Studio`. It contains `videos`, `thumbnails`, `scripts`, `projects`, and `manifests` folders. The Tauri asset protocol is restricted to this workspace for local video preview.

Third-party research requests occur only when users explicitly connect a provider with their credentials. The current Create page is a lightweight job setup view; the on-demand generation worker still needs to be migrated from the legacy Python pipeline before it can produce a video from the desktop app.
