// JaegerGRS Rig Agent: a tiny background tray app that reports this PC's specs and live load to jaegergrs.com.
// The pairing key is typed into the app once and stored encrypted for this Windows user (DPAPI).
// Built with the .NET Framework compiler that ships with Windows; see build.ps1.
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Management;
using System.Net;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Windows.Forms;
using Microsoft.Win32;

namespace JaegerGRS
{
    static class Native
    {
        [StructLayout(LayoutKind.Sequential)] public struct FILETIME { public uint Low, High; public ulong Value { get { return ((ulong)High << 32) | Low; } } }
        [DllImport("kernel32.dll")] public static extern bool GetSystemTimes(out FILETIME idle, out FILETIME kernel, out FILETIME user);
        [DllImport("kernel32.dll")] public static extern ulong GetTickCount64();
        [DllImport("kernel32.dll")] public static extern bool AttachConsole(int pid);
        [DllImport("user32.dll")] public static extern bool DestroyIcon(IntPtr h);
        [StructLayout(LayoutKind.Sequential)]
        public class MEMORYSTATUSEX
        {
            public uint dwLength = (uint)Marshal.SizeOf(typeof(MEMORYSTATUSEX));
            public uint dwMemoryLoad; public ulong ullTotalPhys, ullAvailPhys, ullTotalPageFile, ullAvailPageFile, ullTotalVirtual, ullAvailVirtual, ullAvailExtendedVirtual;
        }
        [DllImport("kernel32.dll", SetLastError = true)] public static extern bool GlobalMemoryStatusEx([In, Out] MEMORYSTATUSEX m);
    }

    static class Json
    {
        public static string S(string v)
        {
            var sb = new StringBuilder("\"");
            foreach (char c in v ?? "")
            {
                if (c == '"' || c == '\\') sb.Append('\\').Append(c);
                else if (c < 32) sb.Append(' ');
                else sb.Append(c);
            }
            return sb.Append('"').ToString();
        }
        public static string N(double v) { return v.ToString("0.#", CultureInfo.InvariantCulture); }
        public static string Obj(List<string> parts) { return "{" + string.Join(",", parts.ToArray()) + "}"; }
        public static void Add(List<string> l, string k, string v) { if (!string.IsNullOrEmpty(v)) l.Add(S(k) + ":" + S(v)); }
        public static void Add(List<string> l, string k, double? v) { if (v.HasValue) l.Add(S(k) + ":" + N(v.Value)); }
    }

    class Config
    {
        public string Url = "https://jaegergrs.com";
        public string Key = "";
        static readonly byte[] Entropy = Encoding.UTF8.GetBytes("JaegerGRS.RigAgent.v1");
        public static string Dir { get { return Environment.GetEnvironmentVariable("JGRS_CONFIG_DIR") ?? Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "JaegerGRS"); } }
        static string FilePath { get { return Path.Combine(Dir, "rig-agent.dat"); } }

        public static Config Load()
        {
            try
            {
                if (!File.Exists(FilePath)) return null;
                var lines = File.ReadAllLines(FilePath);
                var key = Encoding.UTF8.GetString(ProtectedData.Unprotect(Convert.FromBase64String(lines[1]), Entropy, DataProtectionScope.CurrentUser));
                return new Config { Url = lines[0].Trim(), Key = key };
            }
            catch { return null; }
        }

        public void Save()
        {
            Directory.CreateDirectory(Dir);
            var enc = Convert.ToBase64String(ProtectedData.Protect(Encoding.UTF8.GetBytes(Key), Entropy, DataProtectionScope.CurrentUser));
            File.WriteAllLines(FilePath, new[] { Url, enc });
        }

        public static string Validate(string url, string key)
        {
            if (!Regex.IsMatch(url, @"^https://[A-Za-z0-9.-]+(:\d+)?$") && !Regex.IsMatch(url, @"^http://localhost(:\d+)?$"))
                return "The site address must look like https://jaegergrs.com";
            if (!Regex.IsMatch(key, @"^[A-Za-z0-9_-]{32,200}$"))
                return "The key must be 32 to 200 characters (letters, numbers, - and _).";
            return null;
        }
    }

    // Everything here is deliberately cheap: a couple of kernel calls per sample, and one short nvidia-smi call.
    class Sampler
    {
        Native.FILETIME pi, pk, pu;
        bool nvOk = true;
        public string GpuName; public double? GpuVramMb;

        public Sampler() { Native.GetSystemTimes(out pi, out pk, out pu); }

        double? CpuLoad()
        {
            Native.FILETIME i, k, u;
            if (!Native.GetSystemTimes(out i, out k, out u)) return null;
            double total = (double)(k.Value - pk.Value) + (u.Value - pu.Value);
            double idle = i.Value - pi.Value;
            pi = i; pk = k; pu = u;
            return total > 0 ? Math.Max(0, Math.Min(100, (1 - idle / total) * 100)) : (double?)null;
        }

        double?[] Nvidia()
        {
            if (!nvOk) return null;
            try
            {
                var psi = new ProcessStartInfo("nvidia-smi", "--query-gpu=name,utilization.gpu,temperature.gpu,clocks.gr,power.draw,fan.speed,memory.used,memory.total --format=csv,noheader,nounits")
                { UseShellExecute = false, CreateNoWindow = true, RedirectStandardOutput = true, RedirectStandardError = true };
                using (var p = Process.Start(psi))
                {
                    if (!p.WaitForExit(4000)) { try { p.Kill(); } catch { } return null; }
                    var line = (p.StandardOutput.ReadLine() ?? "").Split(',');
                    if (line.Length < 8) return null;
                    GpuName = line[0].Trim();
                    var r = new double?[7];
                    for (int n = 0; n < 7; n++) { double d; r[n] = double.TryParse(line[n + 1].Trim(), NumberStyles.Float, CultureInfo.InvariantCulture, out d) ? d : (double?)null; }
                    GpuVramMb = r[6];
                    return r;
                }
            }
            catch (System.ComponentModel.Win32Exception) { nvOk = false; return null; }
            catch { return null; }
        }

        public string Live()
        {
            var m = new Native.MEMORYSTATUSEX();
            Native.GlobalMemoryStatusEx(m);
            double total = m.ullTotalPhys, used = total - m.ullAvailPhys;
            var l = new List<string>();
            Json.Add(l, "cpuLoad", CpuLoad());
            Json.Add(l, "ramPct", total > 0 ? used / total * 100 : (double?)null);
            Json.Add(l, "ramUsedGb", used / 1073741824.0);
            Json.Add(l, "uptimeHours", Native.GetTickCount64() / 3600000.0);
            var g = Nvidia();
            if (g != null)
            {
                Json.Add(l, "gpuLoad", g[0]); Json.Add(l, "gpuTemp", g[1]); Json.Add(l, "gpuClock", g[2]);
                Json.Add(l, "gpuPower", g[3]); Json.Add(l, "gpuFan", g[4]); Json.Add(l, "gpuVramUsedMb", g[5]); Json.Add(l, "gpuVramMb", g[6]);
            }
            return Json.Obj(l);
        }

        static string Clean(object o) { return Regex.Replace(Convert.ToString(o) ?? "", @"\s+", " ").Trim(); }
        static ManagementObject First(string cls, string props)
        {
            using (var s = new ManagementObjectSearcher("SELECT " + props + " FROM " + cls))
                foreach (ManagementObject o in s.Get()) return o;
            return null;
        }

        public string Specs()
        {
            var root = new List<string>();
            try
            {
                var c = First("Win32_Processor", "Name,NumberOfCores,NumberOfLogicalProcessors,MaxClockSpeed");
                var cpu = new List<string>();
                if (c != null)
                {
                    Json.Add(cpu, "name", Clean(c["Name"]));
                    Json.Add(cpu, "cores", Convert.ToDouble(c["NumberOfCores"]));
                    Json.Add(cpu, "threads", Convert.ToDouble(c["NumberOfLogicalProcessors"]));
                    Json.Add(cpu, "baseMhz", Convert.ToDouble(c["MaxClockSpeed"]));
                }
                root.Add("\"cpu\":" + Json.Obj(cpu));

                Nvidia();
                var gpus = new List<string>();
                using (var s = new ManagementObjectSearcher("SELECT Name,DriverVersion FROM Win32_VideoController"))
                    foreach (ManagementObject o in s.Get())
                    {
                        var name = Clean(o["Name"]);
                        if (name == "" || Regex.IsMatch(name, "basic|remote|virtual", RegexOptions.IgnoreCase)) continue;
                        var g = new List<string>();
                        Json.Add(g, "name", name); Json.Add(g, "driver", Clean(o["DriverVersion"]));
                        if (GpuName != null && name == GpuName) Json.Add(g, "vramMb", GpuVramMb);
                        gpus.Add(Json.Obj(g));
                    }
                root.Add("\"gpus\":[" + string.Join(",", gpus.ToArray()) + "]");

                var ram = new List<string>();
                var mem = new Native.MEMORYSTATUSEX(); Native.GlobalMemoryStatusEx(mem);
                Json.Add(ram, "totalGb", Math.Round(mem.ullTotalPhys / 1073741824.0));
                var m = First("Win32_PhysicalMemory", "Speed,SMBIOSMemoryType");
                if (m != null)
                {
                    Json.Add(ram, "speedMhz", Convert.ToDouble(m["Speed"]));
                    var t = Convert.ToInt32(m["SMBIOSMemoryType"]);
                    Json.Add(ram, "type", t == 26 ? "DDR4" : t == 34 ? "DDR5" : t == 24 ? "DDR3" : null);
                }
                root.Add("\"ram\":" + Json.Obj(ram));

                var b = First("Win32_BaseBoard", "Manufacturer,Product");
                var board = new List<string>();
                if (b != null) { Json.Add(board, "maker", Clean(b["Manufacturer"])); Json.Add(board, "model", Clean(b["Product"])); }
                root.Add("\"board\":" + Json.Obj(board));

                var o2 = First("Win32_OperatingSystem", "Caption,BuildNumber");
                var os = new List<string>();
                if (o2 != null) { Json.Add(os, "name", Regex.Replace(Clean(o2["Caption"]), "^Microsoft ", "")); Json.Add(os, "build", Clean(o2["BuildNumber"])); }
                Json.Add(os, "arch", Environment.Is64BitOperatingSystem ? "x64" : "x86");
                root.Add("\"os\":" + Json.Obj(os));

                double drives = 0, bytes = 0;
                using (var s = new ManagementObjectSearcher("SELECT Size,MediaType FROM Win32_DiskDrive"))
                    foreach (ManagementObject d in s.Get())
                        if (Clean(d["MediaType"]).StartsWith("Fixed", StringComparison.OrdinalIgnoreCase)) { drives++; bytes += Convert.ToDouble(d["Size"] ?? 0); }
                var st = new List<string>();
                Json.Add(st, "drives", drives); Json.Add(st, "totalGb", Math.Round(bytes / 1e9));
                root.Add("\"storage\":" + Json.Obj(st));
            }
            catch { }
            return Json.Obj(root);
        }
    }

    class Reporter
    {
        public volatile string Status = "Starting…";
        public volatile int State; // 0 starting, 1 online, 2 retrying, 3 key rejected
        readonly Config cfg;
        readonly ManualResetEvent stop = new ManualResetEvent(false);
        Thread thread;

        public Reporter(Config c) { cfg = c; }
        void Set(int state, string text) { State = state; Status = text; }

        public void Start()
        {
            thread = new Thread(Loop) { IsBackground = true, Priority = ThreadPriority.BelowNormal, Name = "rig" };
            thread.Start();
        }
        public void Stop() { stop.Set(); }

        // Returns whether someone is watching the site; throws on failure.
        static bool Post(Config c, string body)
        {
            var req = (HttpWebRequest)WebRequest.Create(c.Url + "/api/rig");
            req.Method = "POST"; req.ContentType = "application/json"; req.Timeout = 10000; req.ReadWriteTimeout = 10000;
            req.UserAgent = "JaegerGRS-RigAgent/1";
            req.Headers["Authorization"] = "Bearer " + c.Key;
            var data = Encoding.UTF8.GetBytes(body);
            using (var s = req.GetRequestStream()) s.Write(data, 0, data.Length);
            try
            {
                using (var res = (HttpWebResponse)req.GetResponse())
                using (var r = new StreamReader(res.GetResponseStream()))
                    return r.ReadToEnd().Contains("\"watching\":true");
            }
            catch (WebException ex)
            {
                var hr = ex.Response as HttpWebResponse;
                if (hr != null && (int)hr.StatusCode == 429) return true;
                throw;
            }
        }

        void Loop()
        {
            var sampler = new Sampler();
            string specs = null; DateTime specsAt = DateTime.MinValue;
            int errors = 0, wait = 3000;
            while (!stop.WaitOne(wait))
            {
                try
                {
                    if (specs == null) specs = sampler.Specs();
                    bool withSpecs = DateTime.UtcNow - specsAt > TimeSpan.FromMinutes(10);
                    string body = "{" + (withSpecs ? "\"specs\":" + specs + "," : "") + "\"live\":" + sampler.Live() + "}";
                    bool watched = Post(cfg, body);
                    if (withSpecs) specsAt = DateTime.UtcNow;
                    errors = 0;
                    wait = watched ? 5000 : 15000;
                    Set(1, "Online · " + (watched ? "someone is watching" : "idle"));
                }
                catch (WebException ex)
                {
                    var hr = ex.Response as HttpWebResponse;
                    int code = hr != null ? (int)hr.StatusCode : 0;
                    if (code == 401) { Set(3, "Key rejected by the site"); return; }
                    errors++;
                    wait = (int)Math.Min(60000, 5000 * Math.Pow(2, Math.Min(errors, 4)));
                    Set(2, code == 503 ? "Site has no key set yet; retrying" : "Cannot reach the site; retrying");
                }
                catch (Exception) { errors++; wait = 30000; Set(2, "Error; retrying"); }
            }
        }
    }

    class SetupForm : Form
    {
        public Config Result;
        readonly TextBox url = new TextBox(), key = new TextBox();
        readonly CheckBox boot = new CheckBox();
        public bool StartWithWindows { get { return boot.Checked; } }

        public SetupForm(Config existing, bool bootOn)
        {
            Text = "JaegerGRS Rig Agent"; FormBorderStyle = FormBorderStyle.FixedDialog; MaximizeBox = false; MinimizeBox = false;
            StartPosition = FormStartPosition.CenterScreen; ClientSize = new Size(420, 236); Font = new Font("Segoe UI", 9F);
            Controls.Add(new Label { Text = "Site address", Left = 16, Top = 16, Width = 380 });
            url.SetBounds(16, 38, 388, 24); url.Text = existing != null ? existing.Url : "https://jaegergrs.com"; Controls.Add(url);
            Controls.Add(new Label { Text = existing != null ? "Pairing key (leave empty to keep the saved one)" : "Pairing key (the same value as RIG_TOKEN on Cloudflare)", Left = 16, Top = 74, Width = 388 });
            key.SetBounds(16, 96, 388, 24); key.UseSystemPasswordChar = true; Controls.Add(key);
            boot.Text = "Start with Windows (runs quietly in the background)"; boot.SetBounds(16, 134, 388, 22); boot.Checked = bootOn; Controls.Add(boot);
            Controls.Add(new Label { Text = "The key is stored encrypted for your Windows account. Only hardware names and load numbers are sent.", Left = 16, Top = 160, Width = 388, Height = 32, ForeColor = Color.DimGray });
            var ok = new Button { Text = "Save and start", Left = 276, Top = 196, Width = 128, Height = 28 };
            var cancel = new Button { Text = "Cancel", Left = 196, Top = 196, Width = 72, Height = 28, DialogResult = DialogResult.Cancel };
            ok.Click += delegate
            {
                var k = key.Text.Trim(); var u = url.Text.Trim().TrimEnd('/');
                if (k == "" && existing != null) k = existing.Key;
                var err = Config.Validate(u, k);
                if (err != null) { MessageBox.Show(this, err, Text, MessageBoxButtons.OK, MessageBoxIcon.Warning); return; }
                Result = new Config { Url = u, Key = k }; DialogResult = DialogResult.OK;
            };
            var fetchKey = new Button { Text = "Get key from site", Left = 16, Top = 196, Width = 116, Height = 28 };
            fetchKey.Click += delegate
            {
                var u = url.Text.Trim().TrimEnd('/');
                var uerr = Config.Validate(u, new string('a', 32));
                if (uerr != null) { MessageBox.Show(this, uerr, Text, MessageBoxButtons.OK, MessageBoxIcon.Warning); return; }
                string msg; var k = Claim(u, out msg);
                if (k == null) { MessageBox.Show(this, msg, Text, MessageBoxButtons.OK, MessageBoxIcon.Warning); return; }
                key.Text = k; key.UseSystemPasswordChar = true;
                MessageBox.Show(this, "A new key was created by the site and filled in. Click Save and start.", Text, MessageBoxButtons.OK, MessageBoxIcon.Information);
            };
            Controls.Add(fetchKey);
            Controls.Add(ok); Controls.Add(cancel); AcceptButton = ok; CancelButton = cancel;
        }

        // Asks the site to create the pairing key. This only works while setup is switched on in Cloudflare.
        static string Claim(string baseUrl, out string message)
        {
            try
            {
                var req = (HttpWebRequest)WebRequest.Create(baseUrl + "/api/rig/claim");
                req.Method = "POST"; req.ContentLength = 0; req.Timeout = 15000; req.UserAgent = "JaegerRigAgent/1";
                using (var res = (HttpWebResponse)req.GetResponse())
                using (var sr = new StreamReader(res.GetResponseStream()))
                {
                    var m = System.Text.RegularExpressions.Regex.Match(sr.ReadToEnd(), "\"key\"\\s*:\\s*\"([A-Za-z0-9_-]{32,200})\"");
                    if (m.Success) { message = null; return m.Groups[1].Value; }
                    message = "The site did not return a key."; return null;
                }
            }
            catch (WebException ex)
            {
                var r = ex.Response as HttpWebResponse;
                if (r != null && r.StatusCode == HttpStatusCode.Forbidden) message = "Setup is closed. In Cloudflare, set the variable RIG_SETUP to open, then try again.";
                else if (r != null && r.StatusCode == HttpStatusCode.Conflict) message = "A key already exists. Set RIG_SETUP to rotate in Cloudflare to replace it (or paste the key you already have).";
                else message = "Could not reach the site: " + ex.Message;
                return null;
            }
        }
    }

    class TrayApp : ApplicationContext
    {
        const string RunKey = @"Software\Microsoft\Windows\CurrentVersion\Run", RunName = "JaegerGRS Rig Agent";
        readonly NotifyIcon tray = new NotifyIcon();
        readonly ToolStripMenuItem statusItem = new ToolStripMenuItem("Starting…") { Enabled = false };
        readonly ToolStripMenuItem bootItem = new ToolStripMenuItem("Start with Windows") { CheckOnClick = true };
        readonly System.Windows.Forms.Timer ui = new System.Windows.Forms.Timer { Interval = 2000 };
        Reporter reporter; Config cfg; int lastState = -1; IntPtr hIcon = IntPtr.Zero;

        public TrayApp(Config existing)
        {
            var menu = new ContextMenuStrip();
            menu.Items.Add(statusItem); menu.Items.Add(new ToolStripSeparator());
            var setKey = new ToolStripMenuItem("Set or change key…"); setKey.Click += delegate { Prompt(); };
            menu.Items.Add(setKey);
            bootItem.Checked = BootEnabled(); bootItem.Click += delegate { SetBoot(bootItem.Checked); };
            menu.Items.Add(bootItem);
            var open = new ToolStripMenuItem("Open site"); open.Click += delegate { try { Process.Start(cfg != null ? cfg.Url : "https://jaegergrs.com"); } catch { } };
            menu.Items.Add(open);
            var exit = new ToolStripMenuItem("Exit"); exit.Click += delegate { Quit(); };
            menu.Items.Add(exit);
            tray.ContextMenuStrip = menu; tray.Visible = true;
            tray.DoubleClick += delegate { Prompt(); };
            ui.Tick += delegate { RefreshStatus(); }; ui.Start();
            SetIcon(Color.Gray);

            if (existing != null) { cfg = existing; StartReporter(); }
            else { Prompt(); if (cfg == null) Quit(); }
        }

        static bool BootEnabled() { using (var k = Registry.CurrentUser.OpenSubKey(RunKey)) return k != null && k.GetValue(RunName) != null; }
        static void SetBoot(bool on)
        {
            using (var k = Registry.CurrentUser.OpenSubKey(RunKey, true))
            {
                if (on) k.SetValue(RunName, "\"" + Application.ExecutablePath + "\" --background");
                else k.DeleteValue(RunName, false);
            }
        }

        void Prompt()
        {
            using (var f = new SetupForm(cfg, BootEnabled()))
            {
                if (f.ShowDialog() != DialogResult.OK) return;
                cfg = f.Result; cfg.Save();
                SetBoot(f.StartWithWindows); bootItem.Checked = f.StartWithWindows;
                if (reporter != null) reporter.Stop();
                StartReporter();
            }
        }

        void StartReporter() { reporter = new Reporter(cfg); reporter.Start(); lastState = -1; }

        void SetIcon(Color c)
        {
            using (var bmp = new Bitmap(16, 16))
            {
                using (var g = Graphics.FromImage(bmp))
                {
                    g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
                    using (var b = new SolidBrush(c)) g.FillEllipse(b, 1, 1, 13, 13);
                }
                var old = hIcon; hIcon = bmp.GetHicon();
                tray.Icon = Icon.FromHandle(hIcon);
                if (old != IntPtr.Zero) Native.DestroyIcon(old);
            }
        }

        void RefreshStatus()
        {
            if (reporter == null) return;
            var text = reporter.Status;
            statusItem.Text = text;
            var tip = "JaegerGRS Rig: " + text;
            tray.Text = tip.Length > 63 ? tip.Substring(0, 63) : tip;
            int s = reporter.State;
            if (s == lastState) return;
            lastState = s;
            SetIcon(s == 1 ? Color.FromArgb(0x2e, 0xc9, 0x9b) : s == 3 ? Color.IndianRed : s == 2 ? Color.Orange : Color.Gray);
            if (s == 3) tray.ShowBalloonTip(5000, "JaegerGRS Rig Agent", "The site rejected the key. Right-click the icon and choose Set or change key.", ToolTipIcon.Warning);
        }

        void Quit()
        {
            ui.Stop(); if (reporter != null) reporter.Stop();
            tray.Visible = false; tray.Dispose();
            if (hIcon != IntPtr.Zero) Native.DestroyIcon(hIcon);
            ExitThread();
        }
    }

    static class Program
    {
        [STAThread]
        static int Main(string[] args)
        {
            var a = new List<string>(args);
            if (a.Contains("--dry-run"))
            {
                Native.AttachConsole(-1);
                var s = new Sampler(); var specs = s.Specs(); Thread.Sleep(1000);
                Console.WriteLine("{\"specs\":" + specs + ",\"live\":" + s.Live() + "}");
                return 0;
            }
            bool created;
            using (new Mutex(true, @"Local\JaegerGRS.RigAgent", out created))
            {
                if (!created) return 0;
                try { Process.GetCurrentProcess().PriorityClass = ProcessPriorityClass.BelowNormal; } catch { }
                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072 | (SecurityProtocolType)768;
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);
                Application.Run(new TrayApp(Config.Load()));
            }
            return 0;
        }
    }
}
