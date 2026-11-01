import { cp, mkdir, mkdtemp, rm } from "node:fs/promises"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import path from "node:path"
import { fileURLToPath } from "node:url"

const execFileAsync = promisify(execFile)
const root = fileURLToPath(new URL("../", import.meta.url))
const dist = path.join(root, "dist")
await mkdir(dist, { recursive: true })
const temp = await mkdtemp(path.join(dist, ".build-"))

async function archive(name, files) {
  const stage = path.join(temp, name.replace(/\.zip$/, ""))
  await mkdir(stage, { recursive: true })
  for (const relative of files) {
    await cp(path.join(root, relative), path.join(stage, relative), { recursive: true })
  }
  const target = path.join(dist, name)
  await rm(target, { force: true })
  await execFileAsync("zip", ["-qr", target, ...files], { cwd: stage })
  return target
}

try {
  const openaiTarget = await archive("hush-openai-plugin.zip", [
    "plugin.json",
    ".codex-plugin",
    "skills/hush",
    "assets",
  ])
  process.stdout.write(`${path.relative(root, openaiTarget)}\n`)

  const claudeTarget = await archive("hush-claude-plugin.zip", [
    ".claude-plugin/plugin.json",
    "skills/hush",
  ])
  process.stdout.write(`${path.relative(root, claudeTarget)}\n`)

  const downloads = path.join(root, "website/downloads")
  await mkdir(downloads, { recursive: true })
  await cp(path.join(dist, "hush-claude-plugin.zip"), path.join(downloads, "hush-claude-plugin.zip"))
  await cp(path.join(dist, "hush-openai-plugin.zip"), path.join(downloads, "hush-openai-plugin.zip"))

  for (const obsolete of ["hush-web-skill.zip", "hush-skill.zip", "hush-claude-code-plugin.zip", "hush-codex-plugin.zip", "hush-antigravity-plugin.zip"]) {
    await rm(path.join(dist, obsolete), { force: true })
    await rm(path.join(downloads, obsolete), { force: true })
  }
} finally {
  await rm(temp, { recursive: true, force: true })
}
