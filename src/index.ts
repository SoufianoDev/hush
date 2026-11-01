import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const marker = "<hush-plugin-instructions>"
const skillPath = fileURLToPath(new URL("../skills/hush/SKILL.md", import.meta.url))
const skillFile = readFileSync(skillPath, "utf8")
const instructions = skillFile.replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, "").trim()
const skillDescription = skillFile.match(/^description:\s*(.+)$/m)?.[1].trim()
if (!skillDescription) throw new Error("Hush SKILL.md must define a description in its frontmatter")
const systemInstruction = `${marker}\n${instructions}`

type V1Output = { system: string[] }
type V1Input = { sessionID?: string; model?: unknown }
type V2Skill = {
  id: string
  name: string
  description: string
  autoinvoke: boolean
  path: string
  content: string
}
type V2SkillEditor = {
  get(id: string): unknown
  add(skill: V2Skill): void
}
type V2Context = {
  skill?: {
    transform(callback: (editor: V2SkillEditor) => void): Promise<unknown>
  }
  session?: {
    hook: (
      name: "context",
      callback: (event: { system: Array<{ type: string; text?: string }> }) => void | Promise<void>,
    ) => Promise<unknown>
  }
}

function addV1Instruction(output: V1Output): void {
  if (!Array.isArray(output.system)) return
  if (output.system.some((part) => part.includes(marker))) return
  output.system.push(systemInstruction)
}

function addV2FallbackInstruction(event: { system: Array<{ type: string; text?: string }> }): void {
  if (!Array.isArray(event.system)) return
  if (event.system.some((part) => typeof part.text === "string" && part.text.includes(marker))) return
  event.system.push({ type: "text", text: systemInstruction })
}

async function server() {
  return {
    "experimental.chat.system.transform": async (_input: V1Input, output: V1Output) => {
      addV1Instruction(output)
    },
  }
}

async function setup(ctx: V2Context): Promise<void> {
  if (ctx.skill?.transform) {
    await ctx.skill.transform((editor) => {
      if (editor.get("hush")) return
      editor.add({
        id: "hush",
        name: "Hush",
        description: skillDescription,
        autoinvoke: true,
        path: skillPath,
        content: instructions,
      })
    })
    return
  }

  if (ctx.session?.hook) {
    await ctx.session.hook("context", addV2FallbackInstruction)
    return
  }

  throw new Error("This OpenCode version does not expose skill registration or context hooks")
}

export default {
  id: "hush",
  server,
  setup,
}
