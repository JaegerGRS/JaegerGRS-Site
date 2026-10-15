import { convertFileSrc, invoke } from "@tauri-apps/api/core";

type DependencyStatus = { name: string; ready: boolean; detail: string };
type WorkspaceStatus = {
  root: string;
  dependencies: DependencyStatus[];
  external_connections_note: string;
  studio_ready: boolean;
};
type ProjectFile = { name: string; path: string; size_bytes: number };
type ProjectWorkspace = { root: string; videos: ProjectFile[]; thumbnails: ProjectFile[]; scripts: ProjectFile[]; manifests: ProjectFile[] };
type SetupResult = { success: boolean; message: string };
type YouTubeConnectionStatus = { connected: boolean; message: string; enabled_features: string[] };

let workspace: ProjectWorkspace | undefined;
let lastStatus: WorkspaceStatus | undefined;

function formatFileSize(sizeBytes: number): string {
  return sizeBytes < 1024 * 1024 ? `${Math.max(1, Math.round(sizeBytes / 1024))} KB` : `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function createArtifactRow(file: ProjectFile, type: string): HTMLLIElement {
  const item = document.createElement("li");
  item.className = "artifact-row";
  const name = document.createElement("strong");
  name.textContent = file.name;
  const meta = document.createElement("span");
  meta.textContent = `${type} | ${formatFileSize(file.size_bytes)}`;
  item.append(name, meta);
  return item;
}

function animateNumber(element: HTMLElement, value: number, duration = 600): void {
  if (!microSettings.metricAnimations) {
    element.textContent = String(value);
    element.dataset.value = String(value);
    return;
  }
  const start = performance.now();
  const from = parseInt(element.dataset.value ?? "0", 10) || 0;
  element.dataset.value = String(value);
  if (from === value) { element.textContent = String(value); return; }
  const step = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(from + (value - from) * eased));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function renderPreview(path: string): void {
  const video = document.querySelector<HTMLVideoElement>("#video-preview");
  const empty = document.querySelector<HTMLElement>("#preview-empty");
  const title = document.querySelector<HTMLElement>("#preview-title");
  if (!video || !empty || !title) return;
  if (!path) {
    video.removeAttribute("src"); video.load(); video.hidden = true; empty.hidden = false; title.textContent = "Review a render";
    return;
  }
  video.src = convertFileSrc(path);
  video.hidden = false;
  empty.hidden = true;
  title.textContent = workspace?.videos.find((file) => file.path === path)?.name ?? "Review a render";
}

function renderWorkspace(currentWorkspace: ProjectWorkspace): void {
  const rootElement = document.querySelector<HTMLElement>("#studio-root");
  const projectCount = document.querySelector<HTMLElement>("#project-count");
  const videoCount = document.querySelector<HTMLElement>("#video-count");
  const thumbnailCount = document.querySelector<HTMLElement>("#thumbnail-count");
  const scriptCount = document.querySelector<HTMLElement>("#script-count");
  const videosElement = document.querySelector<HTMLElement>("#videos-list");
  const thumbnailsElement = document.querySelector<HTMLElement>("#thumbnails-list");
  const scriptsElement = document.querySelector<HTMLElement>("#scripts-list");
  const manifestsElement = document.querySelector<HTMLElement>("#manifests-list");
  const previewSelect = document.querySelector<HTMLSelectElement>("#video-select");
  if (!rootElement || !projectCount || !videoCount || !thumbnailCount || !scriptCount || !videosElement || !thumbnailsElement || !scriptsElement || !manifestsElement || !previewSelect) return;
  rootElement.textContent = currentWorkspace.root;
  animateNumber(projectCount, currentWorkspace.manifests.length);
  animateNumber(videoCount, currentWorkspace.videos.length);
  animateNumber(thumbnailCount, currentWorkspace.thumbnails.length);
  animateNumber(scriptCount, currentWorkspace.scripts.length);
  videosElement.replaceChildren(...currentWorkspace.videos.map((file) => createArtifactRow(file, "Video")));
  thumbnailsElement.replaceChildren(...currentWorkspace.thumbnails.map((file) => createArtifactRow(file, "Thumbnail")));
  scriptsElement.replaceChildren(...currentWorkspace.scripts.map((file) => createArtifactRow(file, "Script")));
  manifestsElement.replaceChildren(...currentWorkspace.manifests.map((file) => createArtifactRow(file, "Manifest")));
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = currentWorkspace.videos.length ? "Choose a render" : "No local renders yet";
  previewSelect.replaceChildren(placeholder, ...currentWorkspace.videos.map((file) => {
    const option = document.createElement("option"); option.value = file.path; option.textContent = file.name; return option;
  }));
  previewSelect.disabled = currentWorkspace.videos.length === 0;
  renderPreview("");
}

function renderDependencies(status: WorkspaceStatus): void {
  lastStatus = status;
  const root = document.querySelector<HTMLElement>("#settings-root");
  const dependencies = document.querySelector<HTMLElement>("#dependencies");
  const indicators = document.querySelector<HTMLElement>("#engine-indicators");
  const privacy = document.querySelector<HTMLElement>("#privacy-note");
  const summary = document.querySelector<HTMLElement>("#engine-summary");
  const mark = document.querySelector<HTMLElement>("#engine-mark-state");
  const markContainer = document.querySelector<HTMLElement>(".engine-mark");
  const setupPrompt = document.querySelector<HTMLElement>("#setup-prompt");
  const readyCountElement = document.querySelector<HTMLElement>("#engine-ready-count");
  const totalCountElement = document.querySelector<HTMLElement>("#engine-total-count");
  const healthFill = document.querySelector<HTMLElement>("#engine-health-fill");
  const healthLabel = document.querySelector<HTMLElement>("#engine-health-label");
  if (!root || !dependencies || !indicators || !privacy || !summary || !mark || !markContainer || !setupPrompt || !readyCountElement || !totalCountElement || !healthFill || !healthLabel) return;
  root.textContent = status.root;
  privacy.textContent = status.external_connections_note;
  const readyCount = status.dependencies.filter((dependency) => dependency.ready).length;
  const totalCount = status.dependencies.length;
  const readiness = totalCount ? Math.round((readyCount / totalCount) * 100) : 0;
  summary.textContent = status.studio_ready
    ? "Ready for production"
    : `${readyCount} of ${status.dependencies.length} engine components ready`;
  readyCountElement.textContent = String(readyCount);
  totalCountElement.textContent = String(totalCount);
  healthFill.style.width = `${readiness}%`;
  healthLabel.textContent = status.studio_ready ? "All engine components are ready." : `${readiness}% ready for short-form generation.`;
  mark.textContent = status.studio_ready ? "OK" : "CS";
  markContainer.classList.toggle("ready", status.studio_ready);
  markContainer.classList.toggle("pending", !status.studio_ready);
  setupPrompt.hidden = !microSettings.setupPrompt || status.studio_ready;
  dependencies.replaceChildren(...status.dependencies.map((dependency) => {
    const item = document.createElement("li"); item.className = dependency.ready ? "ready" : "pending";
    const indicator = document.createElement("span"); indicator.className = "status-indicator";
    const state = document.createElement("span"); state.className = dependency.ready ? "state-tag ready" : "state-tag missing";
    state.textContent = dependency.ready ? "Installed" : "Not installed";
    const name = document.createElement("strong"); name.textContent = dependency.name;
    const detail = document.createElement("span"); detail.textContent = dependency.detail;
    item.append(indicator, state, name, detail); return item;
  }));
  indicators.replaceChildren(...status.dependencies.map((dependency) => {
    const item = document.createElement("li"); item.className = "indicator-row";
    const dot = document.createElement("span"); dot.className = dependency.ready ? "dot ready" : "dot missing";
    const name = document.createElement("strong"); name.textContent = dependency.name;
    const state = document.createElement("span"); state.textContent = dependency.ready ? "Installed" : "Not installed";
    item.append(dot, name, state); return item;
  }));
}

function setStatus(message: string, state: "loading" | "ok" | "error" = "ok"): void {
  const statusElement = document.querySelector<HTMLElement>("#status");
  if (!statusElement) return;
  if (!microSettings.verboseStatus && state === "ok" && message === "Local workspace is ready.") {
    statusElement.textContent = "Ready";
  } else {
    statusElement.textContent = message;
  }
  statusElement.classList.remove("loading", "error");
  statusElement.classList.add(state === "ok" ? "loading" : state);
}

async function refreshStudio(): Promise<void> {
  const refreshButton = document.querySelector<HTMLButtonElement>("#refresh");
  if (refreshButton) refreshButton.disabled = true;
  setStatus("Refreshing local workspace...", "loading");
  try {
    const [currentWorkspace, deviceStatus] = await Promise.all([
      invoke<ProjectWorkspace>("get_project_workspace"),
      invoke<WorkspaceStatus>("get_workspace_status"),
    ]);
    workspace = currentWorkspace;
    renderWorkspace(currentWorkspace);
    renderDependencies(deviceStatus);
    setStatus("Local workspace is ready.", "ok");
  } catch (error) {
    setStatus(`Could not read the local workspace: ${String(error)}`, "error");
  } finally {
    if (refreshButton) refreshButton.disabled = false;
  }
}

async function prepareEngine(): Promise<void> {
  const button = document.querySelector<HTMLButtonElement>("#prepare-engine");
  const message = document.querySelector<HTMLElement>("#setup-message");
  if (!button || !message) return;
  button.disabled = true;
  button.textContent = "Downloading...";
  message.hidden = true;
  try {
    const result = await invoke<SetupResult>("prepare_studio_engine");
    message.textContent = result.message;
    message.hidden = false;
    if (result.success) await refreshStudio();
  } catch (error) {
    message.textContent = `Download failed: ${String(error)}`;
    message.hidden = false;
  } finally {
    button.disabled = false;
    button.textContent = "Download setup";
  }
}

function showPage(pageName: string): void {
  document.querySelectorAll<HTMLElement>("[data-page]").forEach((page) => { page.hidden = page.dataset.page !== pageName; });
  document.querySelectorAll<HTMLButtonElement>("[data-nav]").forEach((button) => {
    button.classList.toggle("active", button.dataset.nav === pageName);
    button.setAttribute("aria-current", button.dataset.nav === pageName ? "page" : "false");
  });
}

function openOnboarding(showSetup = false): void {
  const onboarding = document.querySelector<HTMLElement>("#onboarding");
  if (!onboarding) return;
  onboarding.hidden = false;
  onboarding.querySelector<HTMLButtonElement>("#onboarding-setup")?.focus();
  if (showSetup) showPage("settings");
}

function closeOnboarding(): void {
  const onboarding = document.querySelector<HTMLElement>("#onboarding");
  if (onboarding) onboarding.hidden = true;
}

type Theme = "dark" | "light" | "system";
const THEME_KEY = "creator-studio-theme";
type ThemePreset = "neon" | "ocean" | "sunset" | "mono";
const PRESET_KEY = "creator-studio-preset";

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light" || stored === "system") return stored;
  return "dark";
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);

  document.querySelectorAll<HTMLButtonElement>(".theme-option[data-theme]").forEach((button) => {
    const isActive = button.dataset.theme === theme;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-checked", String(isActive));
  });
}

function initTheme(): void {
  applyTheme(getStoredTheme());
}

function getStoredPreset(): ThemePreset {
  const stored = localStorage.getItem(PRESET_KEY);
  if (stored === "neon" || stored === "ocean" || stored === "sunset" || stored === "mono") return stored;
  return "neon";
}

function applyPreset(preset: ThemePreset): void {
  document.documentElement.setAttribute("data-preset", preset);
  localStorage.setItem(PRESET_KEY, preset);
  document.querySelectorAll<HTMLButtonElement>(".preset-option").forEach((button) => {
    const active = button.dataset.preset === preset;
    button.classList.toggle("active", active);
    button.setAttribute("aria-checked", String(active));
  });
}

function initPreset(): void {
  applyPreset(getStoredPreset());
}

type MicroSettings = {
  metricAnimations: boolean;
  soundEffects: boolean;
  setupPrompt: boolean;
  autoReview: boolean;
  devMode: boolean;
  verboseStatus: boolean;
};

const DEFAULT_MICRO: MicroSettings = {
  metricAnimations: true,
  soundEffects: false,
  setupPrompt: true,
  autoReview: false,
  devMode: false,
  verboseStatus: false,
};
const MICRO_KEY = "creator-studio-micro";
let microSettings: MicroSettings = { ...DEFAULT_MICRO };

function getStoredMicro(): MicroSettings {
  try {
    const stored = localStorage.getItem(MICRO_KEY);
    if (!stored) return { ...DEFAULT_MICRO };
    const parsed = JSON.parse(stored) as Partial<MicroSettings>;
    return { ...DEFAULT_MICRO, ...parsed };
  } catch {
    return { ...DEFAULT_MICRO };
  }
}

function saveMicroSettings(): void {
  localStorage.setItem(MICRO_KEY, JSON.stringify(microSettings));
}

function applyMicroSettings(): void {
  document.querySelectorAll<HTMLButtonElement>(".switch[data-micro]").forEach((button) => {
    const key = button.dataset.micro as keyof MicroSettings;
    const active = microSettings[key] ?? false;
    button.classList.toggle("active", active);
    button.setAttribute("aria-checked", String(active));
  });

  const setupPrompt = document.querySelector<HTMLElement>("#setup-prompt");
  if (setupPrompt) {
    setupPrompt.hidden = !microSettings.setupPrompt || (lastStatus?.studio_ready ?? true);
  }
}

function toggleMicro(key: keyof MicroSettings): void {
  microSettings[key] = !microSettings[key];
  saveMicroSettings();
  applyMicroSettings();
}

function initMicroSettings(): void {
  microSettings = getStoredMicro();
  applyMicroSettings();
}

let currentSettingsSection = "engine";

function showSettingsSection(sectionName: string): void {
  const validSection = sectionName && document.querySelector(`.settings-section[data-settings-section="${sectionName}"]`) ? sectionName : "engine";
  currentSettingsSection = validSection;

  document.querySelectorAll<HTMLElement>(".settings-section").forEach((section) => {
    section.hidden = section.dataset.settingsSection !== validSection;
  });

  document.querySelectorAll<HTMLButtonElement>(".settings-nav button").forEach((button) => {
    const isActive = button.dataset.settingsSection === validSection;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

function initSettingsNav(): void {
  document.querySelectorAll<HTMLButtonElement>(".settings-nav button").forEach((button) => {
    button.addEventListener("click", () => showSettingsSection(button.dataset.settingsSection ?? "engine"));
  });
  showSettingsSection(currentSettingsSection);
}

const YOUTUBE_KEY = "creator-studio-youtube-key";

function setYouTubeStatus(message: string, connected = false): void {
  const status = document.querySelector<HTMLElement>("#youtube-status");
  if (!status) return;
  status.textContent = message;
  status.classList.toggle("connected", connected);
}

function renderYouTubeFeatures(features: string[]): void {
  const list = document.querySelector<HTMLElement>("#youtube-features");
  if (!list) return;
  if (!features.length) {
    const item = document.createElement("li");
    item.className = "feature-muted";
    item.textContent = "Connect a key to preview YouTube research capabilities.";
    list.replaceChildren(item);
    return;
  }
  list.replaceChildren(...features.map((feature) => {
    const item = document.createElement("li");
    item.textContent = feature;
    return item;
  }));
}

function initYouTubeSettings(): void {
  const input = document.querySelector<HTMLInputElement>("#youtube-api-key");
  const connectButton = document.querySelector<HTMLButtonElement>("#connect-youtube");
  const clearButton = document.querySelector<HTMLButtonElement>("#clear-youtube");
  if (!input || !connectButton || !clearButton) return;

  const existingKey = sessionStorage.getItem(YOUTUBE_KEY) ?? "";
  renderYouTubeFeatures([]);
  if (existingKey) {
    input.value = existingKey;
    setYouTubeStatus("YouTube API key loaded for this app session.", true);
  } else {
    setYouTubeStatus("No key connected for this app session.");
  }

  connectButton.addEventListener("click", async () => {
    const apiKey = input.value.trim();
    connectButton.disabled = true;
    connectButton.textContent = "Connecting...";
    try {
      const result = await invoke<YouTubeConnectionStatus>("validate_youtube_api_key", { apiKey });
      setYouTubeStatus(result.message, result.connected);
      renderYouTubeFeatures(result.enabled_features);
      if (result.connected) {
        sessionStorage.setItem(YOUTUBE_KEY, apiKey);
      } else {
        sessionStorage.removeItem(YOUTUBE_KEY);
      }
    } catch (error) {
      setYouTubeStatus(`Could not validate this key: ${String(error)}`);
      renderYouTubeFeatures([]);
      sessionStorage.removeItem(YOUTUBE_KEY);
    } finally {
      connectButton.disabled = false;
      connectButton.textContent = "Connect key";
    }
  });

  clearButton.addEventListener("click", () => {
    sessionStorage.removeItem(YOUTUBE_KEY);
    input.value = "";
    setYouTubeStatus("No key connected for this app session.");
    renderYouTubeFeatures([]);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#refresh")?.addEventListener("click", refreshStudio);
  document.querySelector<HTMLSelectElement>("#video-select")?.addEventListener("change", (event) => renderPreview((event.target as HTMLSelectElement).value));
  document.querySelectorAll<HTMLButtonElement>("[data-nav]").forEach((button) => button.addEventListener("click", () => showPage(button.dataset.nav ?? "dashboard")));
  document.querySelector("#prepare-engine")?.addEventListener("click", prepareEngine);
  document.querySelector("#onboarding-setup")?.addEventListener("click", () => { closeOnboarding(); showPage("settings"); });
  document.querySelector("#onboarding-skip")?.addEventListener("click", closeOnboarding);
  document.querySelectorAll<HTMLButtonElement>(".theme-option[data-theme]").forEach((button) => {
    button.addEventListener("click", () => {
      const theme = button.dataset.theme as Theme;
      applyTheme(theme);
    });
  });
  document.querySelectorAll<HTMLButtonElement>(".preset-option").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = button.dataset.preset as ThemePreset;
      applyPreset(preset);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const onboarding = document.querySelector<HTMLElement>("#onboarding");
    if (onboarding && !onboarding.hidden && event.key === "Escape") { closeOnboarding(); return; }
    const pages = ["dashboard", "create", "projects", "preview", "settings"];
    const index = parseInt(event.key, 10) - 1;
    if (index >= 0 && index < pages.length) showPage(pages[index]);
    if (event.key === "r" || event.key === "R") refreshStudio();
  });

  initTheme();
  initPreset();
  initSettingsNav();
  initMicroSettings();
  initYouTubeSettings();

  document.querySelectorAll<HTMLButtonElement>(".switch[data-micro]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.micro as keyof MicroSettings;
      toggleMicro(key);
    });
  });

  showPage("dashboard");
  refreshStudio().then(() => {
    if (!lastStatus?.studio_ready) openOnboarding();
  });
});
