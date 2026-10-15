use serde::Serialize;
use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::time::Duration;

#[derive(Serialize)]
struct DependencyStatus {
    name: String,
    ready: bool,
    detail: String,
}

#[derive(Serialize)]
struct WorkspaceStatus {
    root: String,
    dependencies: Vec<DependencyStatus>,
    local_paths: Vec<String>,
    external_connections_note: String,
    studio_ready: bool,
}

#[derive(Serialize)]
struct ProjectFile {
    name: String,
    path: String,
    size_bytes: u64,
}

#[derive(Serialize)]
struct ProjectWorkspace {
    root: String,
    videos: Vec<ProjectFile>,
    thumbnails: Vec<ProjectFile>,
    scripts: Vec<ProjectFile>,
    manifests: Vec<ProjectFile>,
}

fn studio_root() -> PathBuf {
    let documents = std::env::var_os("USERPROFILE")
        .map(PathBuf::from)
        .map(|path| path.join("Documents"))
        .unwrap_or_else(|| PathBuf::from("Documents"));
    documents.join("Creator Studio")
}

fn ensure_workspace() -> PathBuf {
    let root = studio_root();
    for folder in ["videos", "thumbnails", "scripts", "projects", "manifests"] {
        let _ = fs::create_dir_all(root.join(folder));
    }
    root
}

fn engine_root(root: &PathBuf) -> PathBuf {
    root.join(".studio-engine")
}

fn engine_bin(root: &PathBuf) -> PathBuf {
    engine_root(root).join("bin")
}

fn files_in(path: PathBuf, extensions: &[&str]) -> Vec<ProjectFile> {
    let mut files: Vec<ProjectFile> = fs::read_dir(path)
        .into_iter()
        .flatten()
        .flatten()
        .filter_map(|entry| {
            let path = entry.path();
            let extension = path.extension()?.to_str()?.to_ascii_lowercase();
            if !extensions.contains(&extension.as_str()) {
                return None;
            }
            let metadata = entry.metadata().ok()?;
            Some(ProjectFile {
                name: entry.file_name().to_string_lossy().into_owned(),
                path: path.display().to_string(),
                size_bytes: metadata.len(),
            })
        })
        .collect();
    files.sort_by(|left, right| right.name.cmp(&left.name));
    files
}

fn command_version(command: &str, argument: &str) -> Option<String> {
    Command::new(command)
        .arg(argument)
        .output()
        .ok()
        .filter(|output| output.status.success())
        .map(|output| String::from_utf8_lossy(&output.stdout).trim().to_string())
}

fn command_version_at(path: &PathBuf, argument: &str) -> Option<String> {
    Command::new(path)
        .arg(argument)
        .output()
        .ok()
        .filter(|output| output.status.success())
        .map(|output| {
            let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
            if stdout.is_empty() {
                String::from_utf8_lossy(&output.stderr).trim().to_string()
            } else {
                stdout
            }
        })
}

fn find_executable_in_tree(root: &Path, names: &[&str]) -> Option<PathBuf> {
    let mut stack = vec![root.to_path_buf()];
    let mut seen = std::collections::HashSet::new();

    while let Some(current) = stack.pop() {
        let Ok(entries) = fs::read_dir(&current) else {
            continue;
        };

        for entry in entries.flatten() {
            let path = entry.path();
            if !seen.insert(path.clone()) {
                continue;
            }

            if path.is_dir() {
                stack.push(path);
                continue;
            }

            let filename = match path.file_name().and_then(|value| value.to_str()) {
                Some(name) => name,
                None => continue,
            };

            if names.iter().any(|candidate| filename.eq_ignore_ascii_case(candidate)) {
                return Some(path);
            }
        }
    }

    None
}

fn local_python_version(root: &PathBuf) -> Option<String> {
    let bin = engine_bin(root);
    let python = find_executable_in_tree(&bin, &["python.exe", "python3.exe", "python"]);
    python.and_then(|path| command_version_at(&path, "--version"))
}

fn local_ollama_version(root: &PathBuf) -> Option<String> {
    let bin = engine_bin(root);
    let ollama = find_executable_in_tree(&bin, &["ollama.exe", "ollama"]);
    ollama.and_then(|path| command_version_at(&path, "--version"))
}

fn local_ffmpeg_version(root: &PathBuf) -> Option<String> {
    let bin = engine_bin(root);
    let ffmpeg = find_executable_in_tree(&bin, &["ffmpeg.exe", "ffmpeg"]);
    ffmpeg.and_then(|path| command_version_at(&path, "-version"))
}

#[tauri::command]
fn get_workspace_status() -> WorkspaceStatus {
    let root = ensure_workspace();
    let python = local_python_version(&root);
    let ollama = local_ollama_version(&root);
    let ffmpeg = local_ffmpeg_version(&root);
    let bin_path = engine_bin(&root);
    let global_python = command_version("python", "--version").or_else(|| command_version("python3", "--version"));
    let global_ollama = command_version("ollama", "--version");
    let global_ffmpeg = command_version("ffmpeg", "-version");
    let required_paths = ["videos", "thumbnails", "scripts", "projects", "manifests"];

    let dependencies = vec![
        DependencyStatus {
            name: "Python runtime".into(),
            ready: python.is_some() || global_python.is_some(),
            detail: if let Some(version) = python.or_else(|| global_python.clone()) {
                format!("Ready. Python is available in the active workspace runtime or system path ({}).", version)
            } else {
                format!("Not installed in app runtime. Place Python into {}.", bin_path.display())
            },
        },
        DependencyStatus {
            name: "Local script engine".into(),
            ready: ollama.is_some() || global_ollama.is_some(),
            detail: if let Some(version) = ollama.or_else(|| global_ollama.clone()) {
                format!("Ready. Ollama is available in the active runtime or system path ({}). No account is needed.", version)
            } else {
                format!("Not installed in app runtime. Place Ollama into {}. No account is needed.", bin_path.display())
            },
        },
        DependencyStatus {
            name: "FFmpeg".into(),
            ready: ffmpeg.is_some() || global_ffmpeg.is_some(),
            detail: if let Some(version) = ffmpeg.or_else(|| global_ffmpeg.clone()) {
                format!("Ready. FFmpeg is available in the active runtime or system path ({}).", version)
            } else {
                format!("Not installed in app runtime. Place FFmpeg into {}.", bin_path.display())
            },
        },
    ];
    let studio_ready = dependencies.iter().all(|dependency| dependency.ready);

    WorkspaceStatus {
        root: root.display().to_string(),
        dependencies,
        local_paths: required_paths
            .iter()
            .map(|name| {
                let path = root.join(name);
                format!("{}: {}", name, path.display())
            })
            .chain(std::iter::once(format!(
                "engine_runtime: {}",
                engine_root(&root).display()
            )))
            .collect(),
        external_connections_note: "Projects, scripts, renders, and manifests remain local. Engine tools are expected in the app runtime folder and are not required as system installs. Research connections only use the credentials a user explicitly provides.".into(),
        studio_ready,
    }
}

#[derive(Serialize)]
struct SetupResult {
    success: bool,
    message: String,
}

#[derive(Serialize)]
struct YouTubeConnectionStatus {
    connected: bool,
    message: String,
    enabled_features: Vec<String>,
}

#[tauri::command]
fn download_and_extract_archive(url: &str, archive_name: &str, folder: &Path) -> Result<(), String> {
    let archive_path = folder.join(archive_name);
    let response = reqwest::blocking::get(url)
        .map_err(|error| format!("Could not start download from {}: {}", url, error))?
        .error_for_status()
        .map_err(|error| format!("Download rejected for {}: {}", url, error))?;

    let bytes = response
        .bytes()
        .map_err(|error| format!("Could not read download bytes from {}: {}", url, error))?;

    fs::write(&archive_path, bytes)
        .map_err(|error| format!("Could not save {} to {}: {}", archive_name, folder.display(), error))?;

    let file = fs::File::open(&archive_path)
        .map_err(|error| format!("Could not open {} for extraction: {}", archive_path.display(), error))?;
    let mut archive = zip::ZipArchive::new(file)
        .map_err(|error| format!("Could not read zip archive {}: {}", archive_path.display(), error))?;

    for index in 0..archive.len() {
        let mut entry = archive.by_index(index)
            .map_err(|error| format!("Could not inspect zip entry {}: {}", archive_path.display(), error))?;
        let outpath = folder.join(entry.name());
        if entry.name().ends_with('/') {
            fs::create_dir_all(&outpath)
                .map_err(|error| format!("Could not create folder {}: {}", outpath.display(), error))?;
            continue;
        }
        if let Some(parent) = outpath.parent() {
            fs::create_dir_all(parent)
                .map_err(|error| format!("Could not create parent folder {}: {}", parent.display(), error))?;
        }
        let mut outfile = fs::File::create(&outpath)
            .map_err(|error| format!("Could not extract {} to {}: {}", entry.name(), outpath.display(), error))?;
        std::io::copy(&mut entry, &mut outfile)
            .map_err(|error| format!("Could not write {}: {}", outpath.display(), error))?;
    }

    Ok(())
}

fn promote_runtime_executables(folder: &Path) -> Vec<String> {
    let mut found = Vec::new();
    let mut seen = std::collections::HashSet::new();
    let mut queue = vec![folder.to_path_buf()];

    while let Some(current) = queue.pop() {
        let Ok(entries) = fs::read_dir(&current) else {
            continue;
        };

        for entry in entries.flatten() {
            let candidate = entry.path();
            if !seen.insert(candidate.clone()) {
                continue;
            }

            if candidate.is_dir() {
                queue.push(candidate);
                continue;
            }

            if let Some(name) = candidate.file_name().and_then(|value| value.to_str()) {
                if matches!(name.to_ascii_lowercase().as_str(), "python.exe" | "python3.exe" | "ollama.exe" | "ffmpeg.exe" | "ffprobe.exe") {
                    let destination = folder.join(name);
                    if candidate != destination {
                        let _ = fs::copy(&candidate, &destination);
                    }
                    found.push(name.to_string());
                }
            }
        }
    }

    found.sort();
    found.dedup();
    found
}

#[tauri::command]
fn prepare_studio_engine() -> SetupResult {
    let root = ensure_workspace();
    let engine = engine_root(&root);
    let bin = engine.join("bin");
    let models = engine.join("models");
    let logs = engine.join("logs");
    let temp = engine.join("temp");

    for folder in [&engine, &bin, &models, &logs, &temp] {
        if let Err(error) = fs::create_dir_all(folder) {
            return SetupResult {
                success: false,
                message: format!("Could not prepare app runtime folder {}: {}", folder.display(), error),
            };
        }
    }

    let manifest = vec![
        (
            "python-3.11.9-embed-amd64.zip",
            "https://www.python.org/ftp/python/3.11.9/python-3.11.9-embed-amd64.zip",
        ),
        (
            "ollama-windows-amd64.zip",
            "https://ollama.com/download/ollama-windows-amd64.zip",
        ),
        (
            "ffmpeg.zip",
            "https://github.com/BtbN/FFmpeg-Builds/releases/latest/download/ffmpeg-master-latest-win64-gpl.zip",
        ),
    ];

    let mut downloaded = Vec::new();
    for (archive_name, url) in manifest {
        if let Err(error) = download_and_extract_archive(url, archive_name, &bin) {
            downloaded.push(error);
        } else {
            downloaded.push(format!("Downloaded {} to {}", archive_name, bin.display()));
        }
    }

    let _ = promote_runtime_executables(&bin);

    let readme_path = engine.join("README.txt");
    if let Ok(mut file) = fs::File::create(&readme_path) {
        let _ = writeln!(
            file,
            "Creator Studio local engine runtime\n\nThis runtime folder was prepared for local downloads.\n\nRequired executables are stored in:\n{}\n\nDownloaded setup status:\n{}\n\nThe app keeps engine dependencies app-local instead of relying on system installs.",
            bin.display(),
            downloaded.join("\n")
        );
    }

    let ready = downloaded.iter().any(|line| line.starts_with("Downloaded "));
    if ready {
        SetupResult {
            success: true,
            message: format!(
                "Download complete. Required local runtime files were placed into {}. Open the Studio app again to recheck the device status.",
                bin.display()
            ),
        }
    } else {
        SetupResult {
            success: false,
            message: format!(
                "The setup download could not complete. Please fetch the required runtime files manually into {}. Details: {}",
                bin.display(),
                downloaded.join(" | ")
            ),
        }
    }
}

#[tauri::command]
fn validate_youtube_api_key(api_key: String) -> YouTubeConnectionStatus {
    let key = api_key.trim();
    if key.is_empty() {
        return YouTubeConnectionStatus {
            connected: false,
            message: "Enter a YouTube API key to connect this app session.".into(),
            enabled_features: Vec::new(),
        };
    }

    if !(key.starts_with("AIza") && key.len() >= 35) {
        return YouTubeConnectionStatus {
            connected: false,
            message: "This key does not match expected YouTube API key format.".into(),
            enabled_features: Vec::new(),
        };
    }

    let client = match reqwest::blocking::Client::builder()
        .timeout(Duration::from_secs(8))
        .build()
    {
        Ok(client) => client,
        Err(error) => {
            return YouTubeConnectionStatus {
                connected: false,
                message: format!("Could not initialize YouTube connection test: {}", error),
                enabled_features: Vec::new(),
            };
        }
    };

    let response = client
        .get("https://www.googleapis.com/youtube/v3/search")
        .query(&[
            ("part", "snippet"),
            ("type", "video"),
            ("maxResults", "1"),
            ("q", "creator studio"),
            ("key", key),
        ])
        .send();

    match response {
        Ok(resp) if resp.status().is_success() => YouTubeConnectionStatus {
            connected: true,
            message: "YouTube API key connected for this app session.".into(),
            enabled_features: vec![
                "Title and hook comparison research".into(),
                "Keyword and topic signal checks".into(),
                "Metadata readiness guidance for shorts".into(),
                "Upload timing and publishing checklist".into(),
            ],
        },
        Ok(resp) => YouTubeConnectionStatus {
            connected: false,
            message: format!(
                "YouTube API rejected this key (HTTP {}). Check API enablement and quotas.",
                resp.status()
            ),
            enabled_features: Vec::new(),
        },
        Err(error) => YouTubeConnectionStatus {
            connected: false,
            message: format!("Could not reach YouTube API: {}", error),
            enabled_features: Vec::new(),
        },
    }
}

#[tauri::command]
fn get_project_workspace() -> ProjectWorkspace {
    let root = ensure_workspace();
    ProjectWorkspace {
        root: root.display().to_string(),
        videos: files_in(root.join("videos"), &["mp4", "mov", "webm", "mkv"]),
        thumbnails: files_in(root.join("thumbnails"), &["png", "jpg", "jpeg", "webp"]),
        scripts: files_in(root.join("scripts"), &["txt", "md", "json"]),
        manifests: files_in(root.join("manifests"), &["json"]),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_workspace_status,
            get_project_workspace,
            prepare_studio_engine,
            validate_youtube_api_key
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
