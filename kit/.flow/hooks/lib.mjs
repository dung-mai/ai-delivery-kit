// Shared helpers for the Claude Code hooks of AI Delivery Kit v2. No dependencies.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export async function readInput() {
  let s = '';
  for await (const chunk of process.stdin) s += chunk;
  try { return JSON.parse(s || '{}'); } catch { return {}; }
}

// folder that holds .flow/ (the kit can live in a sub-folder of the git repo)
export function kitBase(start = process.env.CLAUDE_PROJECT_DIR || process.cwd()) {
  for (let d = path.resolve(start); ; d = path.dirname(d)) {
    if (fs.existsSync(path.join(d, '.flow', 'config.json'))) return d;
    if (path.dirname(d) === d) return path.resolve(start);
  }
}

export function readJson(f, dflt) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return dflt; } }

export function flow(base, ...args) {
  return spawnSync(process.execPath, [path.join(base, '.flow', 'sensors', 'flow.mjs'), ...args], { cwd: base, encoding: 'utf8', timeout: 120_000 });
}

// desktop notification, best effort, never throws
export function notify(base, title, body = '') {
  const cfg = readJson(path.join(base, '.flow', 'config.json'), {});
  const kinds = cfg.notify || ['bell', 'desktop'];
  try {
    if (kinds.includes('bell')) process.stderr.write('\x07');
    if (kinds.includes('desktop')) {
      const o = { env: { ...process.env, AI_N_TITLE: title, AI_N_BODY: body }, stdio: 'ignore', timeout: 8000 };
      if (process.platform === 'win32') {
        const ps = "[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null; $x = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02); $t = $x.GetElementsByTagName('text'); $t.Item(0).AppendChild($x.CreateTextNode($env:AI_N_TITLE)) | Out-Null; $t.Item(1).AppendChild($x.CreateTextNode($env:AI_N_BODY)) | Out-Null; [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\\WindowsPowerShell\\v1.0\\powershell.exe').Show([Windows.UI.Notifications.ToastNotification]::new($x))";
        spawnSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', ps], o);
      } else if (process.platform === 'darwin') {
        spawnSync('osascript', ['-e', 'display notification (system attribute "AI_N_BODY") with title (system attribute "AI_N_TITLE")'], o);
      } else {
        spawnSync('notify-send', [title, body], o);
      }
    }
    // only a short status leaves the machine; the topic works like a password
    if (kinds.includes('ntfy') && cfg.ntfy_topic) spawnSync('curl', ['-s', '-m', '5', '-H', 'Title: ai-delivery-kit', '-d', `${title} ${body}`.trim(), `https://ntfy.sh/${encodeURIComponent(cfg.ntfy_topic)}`], { stdio: 'ignore', timeout: 8000 });
  } catch { /* best effort */ }
}
