import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("../", import.meta.url))
const errors = []

async function json(relative) {
  try {
    return JSON.parse(await readFile(path.join(root, relative), "utf8"))
  } catch (error) {
    errors.push(`${relative}: ${error.message}`)
  }
}

const packageManifest = await json("package.json")
const manifestPaths = [
  "plugin.json",
  ".claude-plugin/plugin.json",
  ".claude-plugin/marketplace.json",
  ".codex-plugin/plugin.json",
  ".antigravity-plugin/plugin.json",
  ".agents/plugins/marketplace.json",
]
for (const file of manifestPaths) await json(file)

if (packageManifest) {
  const scripts = packageManifest.scripts ?? {}
  for (const name of ["build", "prepare", "preinstall", "install", "postinstall", "prepack"]) {
    if (Object.hasOwn(scripts, name)) {
      errors.push(`package.json: "${name}" is incompatible with OpenCode V2 Git plugin installation; use a non-lifecycle script name`)
    }
  }
  if (Object.hasOwn(packageManifest, "workspaces")) {
    errors.push("package.json: workspaces are incompatible with OpenCode V2 Git plugin installation")
  }
  if (scripts.bundle !== "node scripts/build.mjs") {
    errors.push('package.json: bundle must run "node scripts/build.mjs"')
  }
}

const skill = await readFile(path.join(root, "skills/hush/SKILL.md"), "utf8")
const frontmatter = skill.match(/^---\r?\n([\s\S]*?)\r?\n---/)
if (!frontmatter) errors.push("skills/hush/SKILL.md: missing YAML frontmatter")
else {
  if (!/^name:\s*hush\s*$/m.test(frontmatter[1])) errors.push("skills/hush/SKILL.md: name must be hush")
  if (!/^description:\s*.+$/m.test(frontmatter[1])) errors.push("skills/hush/SKILL.md: description is required")
  if (!/^compatibility:\s*.+$/m.test(frontmatter[1])) errors.push("skills/hush/SKILL.md: compatibility metadata is required")
}

const antigravity = await json(".antigravity-plugin/plugin.json")
if (antigravity) {
  if (antigravity.$schema !== "https://antigravity.google/schemas/v1/plugin.json") {
    errors.push(".antigravity-plugin/plugin.json: incorrect Antigravity schema URL")
  }
  if (antigravity.name !== "hush") errors.push(".antigravity-plugin/plugin.json: name must be hush")
  if (antigravity.logo !== "assets/hush-icon.png") errors.push(".antigravity-plugin/plugin.json: logo must point to the bundled square icon")
}

const openai = await json("plugin.json")
if (openai) {
  const icon = openai.extensions?.["com.openai"]?.interface?.composerIcon
  const logo = openai.extensions?.["com.openai"]?.interface?.logo
  if (icon !== "./assets/hush-icon.png" || logo !== "./assets/hush-icon.png") {
    errors.push("plugin.json: OpenAI composer icon and logo must use the bundled square icon")
  }
}

for (const [file, target] of [
  [".opencode/plugins/hush.ts", "../../src/index.ts"],
  [".mimocode/plugin/hush.ts", "../../src/index.ts"],
]) {
  const shim = await readFile(path.join(root, file), "utf8")
  if (!shim.includes(target)) errors.push(`${file}: expected to re-export the canonical TypeScript entrypoint`)
}

const mirroredSkills = [
  ".agents/skills/hush/SKILL.md",
  ".claude/skills/hush/SKILL.md",
  ".cursor/skills/hush/SKILL.md",
  ".gemini/skills/hush/SKILL.md",
  ".github/skills/hush/SKILL.md",
  ".cline/skills/hush/SKILL.md",
  ".roo/skills/hush/SKILL.md",
  ".junie/skills/hush/SKILL.md",
  ".windsurf/skills/hush/SKILL.md",
  ".opencode/skills/hush/SKILL.md",
]
for (const file of mirroredSkills) {
  try {
    const copy = await readFile(path.join(root, file), "utf8")
    if (copy !== skill) errors.push(`${file}: must stay identical to the canonical skills/hush/SKILL.md`)
  } catch (error) {
    errors.push(`${file}: ${error.message}`)
  }
}

const aiderConfig = await readFile(path.join(root, ".aider.conf.yml"), "utf8")
if (!aiderConfig.includes("skills/hush/SKILL.md")) errors.push(".aider.conf.yml: must load the canonical Hush skill as read-only context")

const geminiContext = await readFile(path.join(root, "GEMINI.md"), "utf8")
if (!geminiContext.includes("skills/hush/SKILL.md") || !geminiContext.includes("Google Cloud Code")) {
  errors.push("GEMINI.md: must direct Gemini Code Assist to the canonical Hush skill")
}

const entry = await readFile(path.join(root, "src/index.ts"), "utf8")
for (const token of ["experimental.chat.system.transform", "ctx.skill?.transform", "ctx.session?.hook", "ctx.session.hook(\"context\"", "server,", "setup,"]) {
  if (!entry.includes(token)) errors.push(`src/index.ts: missing ${token}`)
}
if (!entry.includes("../skills/hush/SKILL.md")) errors.push("src/index.ts: plugin must load the bundled skill source")
if (!entry.includes("marker")) errors.push("src/index.ts: duplicate-injection guard missing")

const claudeManifest = await json(".claude-plugin/plugin.json")
if (claudeManifest) {
  if (claudeManifest.name !== "hush") errors.push(".claude-plugin/plugin.json: name must be hush")
  if (!claudeManifest.description) errors.push(".claude-plugin/plugin.json: description is required")
  if (!claudeManifest.version) errors.push(".claude-plugin/plugin.json: version is required for release tracking")
}

const readme = await readFile(path.join(root, "README.md"), "utf8")
if (!readme.includes("Customize → Plugins") || !readme.includes("Add marketplace")) {
  errors.push("README.md: Claude Web must document the native Plugins marketplace install flow")
}
for (const agent of ["cursor", "cline", "codex", "antigravity", "gemini-cli", "github-copilot", "junie", "opencode", "roo", "windsurf", "claude-code"]) {
  if (!readme.includes(agent)) errors.push(`README.md: missing Skills CLI target ${agent}`)
}
if (!readme.includes("aider --read skills/hush/SKILL.md")) {
  errors.push("README.md: missing the documented Aider read-only integration")
}
if (!readme.includes("GEMINI.md")) {
  errors.push("README.md: missing the Gemini Code Assist context-file integration")
}
const website = await readFile(path.join(root, "website/index.html"), "utf8")
if (!website.includes("hush-claude-plugin.zip") || website.includes("hush-web-skill.zip")) {
  errors.push("website/index.html: expected the Claude plugin archive, not a standalone Skill upload")
}

if (errors.length) {
  process.stderr.write(`${errors.map((error) => `- ${error}`).join("\n")}\n`)
  process.exitCode = 1
} else {
  process.stdout.write("Hush manifests, skill metadata, web install routes, and V1/V2 entrypoints passed structural validation.\n")
}
