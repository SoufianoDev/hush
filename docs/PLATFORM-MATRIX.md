# Platform integration matrix

| Host / version | Plugin contract | Hush entrypoint | What the install gives you |
|---|---|---|---|
| Claude Code | Claude Code plugin and Agent Skills | `.claude-plugin/plugin.json`, `.claude/skills/hush/SKILL.md`, `skills/hush/SKILL.md` | Install through the Claude plugin marketplace or Skills CLI. |
| Codex | Agent Plugin and Agent Skills | `plugin.json`, `.agents/skills/hush/SKILL.md` | Plugin marketplace or Skills CLI; shared project skill discovery. |
| Cursor | Agent Plugins standard and Agent Skills | root `plugin.json`, `.cursor/skills/hush/SKILL.md`, `.agents/skills/hush/SKILL.md` | Native Cursor skill path and shared Agent Skills path. |
| Cline | Native project skills | `.cline/skills/hush/SKILL.md` | Cline's Skills menu and slash-command discovery. |
| Roo Code | Native and shared Agent Skills | `.roo/skills/hush/SKILL.md`, `.agents/skills/hush/SKILL.md` | Roo-specific skills take precedence; the shared path remains available to other agents. |
| Junie | Native and shared Agent Skills | `.junie/skills/hush/SKILL.md`, `.agents/skills/hush/SKILL.md` | Junie CLI and IDEs discover both project and shared skill locations. |
| Windsurf | Agent Skills | `.windsurf/skills/hush/SKILL.md` | Project skill path; global installs use `~/.codeium/windsurf/skills/`. |
| Gemini CLI | Native and shared Agent Skills | `.gemini/skills/hush/SKILL.md`, `.agents/skills/hush/SKILL.md`, `GEMINI.md` | Native Gemini skill path, shared skill discovery, and project context. |
| GitHub Copilot | Native and shared Agent Skills | `.github/skills/hush/SKILL.md`, `.agents/skills/hush/SKILL.md` | Supported in Copilot CLI, IDE agent mode, code review, app, and cloud agent. |
| OpenCode V1 | V1 module with `server()` and `experimental.chat.system.transform` plus native skill file | `.opencode/plugins/hush.ts` and `.opencode/skills/hush/SKILL.md` | Project-local plugin and skill discovery; global skill path is `~/.config/opencode/skills/hush/SKILL.md`. |
| OpenCode V2 | V2 module with `id` and `setup(ctx)`; registers a native skill with `ctx.skill.transform()` | `.opencode/plugins/hush.ts` re-exports `src/index.ts` | Project-local or global plugin install; invoke with `@hush`, or let OpenCode select it automatically when relevant. |
| Antigravity | Native plugin manifest and Agent Skills | `.antigravity-plugin/plugin.json`, `.agents/skills/hush/SKILL.md` | CLI plugin install, Customizations, or Skills CLI. |
| MiMo Code | MiMo's V1-compatible `server()` plugin contract | `.mimocode/plugin/hush.ts` re-exports `src/index.ts` | Project-local loading; global package installation uses MiMo's `plugin` config key after npm publication. |
| Gemini Code Assist / Google Cloud Code | Project context file; no separate Hush skill plugin API | `GEMINI.md` | Agent mode is instructed to read the canonical Hush skill; availability depends on the Gemini Code Assist surface. |
| Aider | Read-only context file | `.aider.conf.yml` or `aider --read skills/hush/SKILL.md` | Hush is loaded as read-only context; no native progressive Agent Skills discovery is claimed. |
| AiderDesk | Agent Skills | Skills CLI `aider-desk` target | Separate product from Aider; installs to its own skill directory. |
| Claude Web | Claude plugin marketplace or custom plugin ZIP | `.claude-plugin/marketplace.json` and `dist/hush-claude-plugin.zip` | The same Claude plugin is installed into the Claude account and is available across Chat, Cowork, and Claude Code. |
| ChatGPT Web | public Agent Plugin | generated `hush-openai-plugin.zip` | Skill available after OpenAI checks, review, and publication. |
| AiderDesk, Amp, Augment, Continue, Goose, Kiro CLI, Kilo Code, OpenHands, Pi, Qwen Code, Replit, Trae, Warp, Zed, Zencoder | Agent Skills | Installed by the Skills CLI into each host-specific path | Shared canonical Hush instructions; no separate plugin API is claimed. |

## Compatibility boundaries

- The Vercel Skills CLI installs the canonical `skills/hush` directory into each selected agent's supported project or user path. Its supported-agent list includes many additional hosts; the README links to the live list rather than freezing every target identifier here. Hush documents the CLI target identifiers in the README; consult the CLI's current supported-agent list before adding new targets.
- The shared `.agents/skills/hush/SKILL.md` supports agents that implement the cross-agent Agent Skills path. The repository also generates native project mirrors for Claude Code, Cursor, Gemini CLI, GitHub Copilot, Cline, Roo Code, Junie, Windsurf, and OpenCode. All copies must match `skills/hush/SKILL.md`.
- Aider itself is not listed as a native Agent Skills host by the Skills CLI. The repository config uses Aider's read-only `read` setting to load the canonical file; this is context loading, not automatic or on-demand skill discovery.
- Gemini Code Assist / Google Cloud Code uses the `GEMINI.md` context-file bridge. That does not make it a Gemini CLI extension or a native skill registry integration.

- OpenCode V1 and V2 use different plugin APIs. The package carries both entrypoints in one default export. The V1 object-form export is documented for OpenCode V1.18.29 and later; older V1 builds are not in the support claim.
- OpenCode V2's `setup()` registers Hush through the native skill registry. The agent loads the skill on demand; users can explicitly invoke it with `@hush`. Older V2 builds without `ctx.skill.transform()` retain the legacy context-hook fallback.
- MiMo Code is an OpenCode fork but uses its own `.mimocode` plugin search directories and `@mimo-ai/plugin` host contract. The exported `server(input)` hook uses the compatible V1 system-transform shape. Do not put MiMo-specific plugins under `.opencode/plugins/`.
- Claude Web supports adding a repository marketplace or uploading a custom plugin ZIP. The Claude Web and Claude Code plugin use the same `.claude-plugin/plugin.json` and skill source.
- ChatGPT Web's public directory is gated by publisher verification and OpenAI's submission review. Local marketplaces documented for Codex desktop/CLI are not the ChatGPT Web public directory.
