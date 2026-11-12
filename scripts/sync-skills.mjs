import { readFile, mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("../", import.meta.url))
const content = await readFile(path.join(root, "skills/hush/SKILL.md"), "utf8")
const destinations = [
  ".agents/skills/hush/SKILL.md",
  ".cline/skills/hush/SKILL.md",
  ".roo/skills/hush/SKILL.md",
  ".junie/skills/hush/SKILL.md",
  ".windsurf/skills/hush/SKILL.md",
  ".opencode/skills/hush/SKILL.md",
]

for (const relative of destinations) {
  const destination = path.join(root, relative)
  await mkdir(path.dirname(destination), { recursive: true })
  await writeFile(destination, content)
}

process.stdout.write(`Synchronized Hush to ${destinations.length} agent skill locations.\n`)
