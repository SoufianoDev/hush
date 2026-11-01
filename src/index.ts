import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const marker = "<hush-plugin-instructions>"
const skillPath = fileURLToPath(new URL("../skills/hush/SKILL.md", import.meta.url))
const skillFile = readFileSync(skillPath, "utf8")
const instructions = skillFile.replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, "").trim()
const systemInstruction = `${marker}\n${instructions}`

type V1Output = { system: string[] }
type V1Input = { sessionID?: string; model?: unknown }
type V2SystemPart = { type: string; text?: string; [key: string]: unknown }
type V2ContextEvent = { system: V2SystemPart[] }
type V2Context = {
  session: {
    hook: (
      name: "context",
      callback: (event: V2ContextEvent) => void | Promise<void>,
    ) => Promise<unknown>
  }
}

function addV1Instruction(output: V1Output): void {
  if (!Array.isArray(output.system)) return
  if (output.system.some((part) => part.includes(marker))) return
  output.system.push(systemInstruction)
}

function addV2Instruction(event: V2ContextEvent): void {
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
  await ctx.session.hook("context", addV2Instruction)
}

export default {
  id: "hush",
  server,
  setup,
}
