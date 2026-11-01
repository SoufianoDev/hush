# Platform integration matrix

| Host / version | Plugin contract | Hush entrypoint | What the install gives you |
|---|---|---|---|
| Claude Code | `.claude-plugin/plugin.json`, marketplace catalog, `skills/` | `skills/hush/SKILL.md` | Claude Code discovers the installed Hush skill as a plugin component. |
| Codex | portable `plugin.json`, plugin marketplace, `skills/` | `skills/hush/SKILL.md` | Codex loads the bundled skill through the plugin. |
| OpenCode V1 | V1 module with `server()` and `experimental.chat.system.transform` | `.opencode/plugins/hush.ts` re-exports `src/index.ts` | Project-local loading is automatic when this repository is the active workspace; global use can load the published package. |
| OpenCode V2 | V2 module with `id` and `setup(ctx)`; `ctx.session.hook("context")` | `.opencode/plugins/hush.ts` re-exports `src/index.ts` | Project-local discovery or Git-backed `opencode plugin add` for global use. |
| Antigravity | `.antigravity-plugin/plugin.json` and `skills/` | `skills/hush/SKILL.md` | Antigravity uses its own strict manifest while sharing the canonical Hush skill. |
| MiMo Code | MiMo's V1-compatible `server()` plugin contract | `.mimocode/plugin/hush.ts` re-exports `src/index.ts` | Project-local loading; global package installation uses MiMo's `plugin` config key after npm publication. |
| Claude Web | Claude plugin marketplace or custom plugin ZIP | `.claude-plugin/marketplace.json` and `dist/hush-claude-plugin.zip` | The same Claude plugin is installed into the Claude account and is available across Chat, Cowork, and Claude Code. |
| ChatGPT Web | public Agent Plugin | generated `hush-openai-plugin.zip` | Skill available after OpenAI checks, review, and publication. |

## Compatibility boundaries

- OpenCode V1 and V2 use different plugin APIs. The package carries both entrypoints in one default export. The V1 object-form export is documented for OpenCode V1.18.29 and later; older V1 builds are not in the support claim.
- OpenCode V2's `setup()` registers the `context` hook. The hook runs for the agent loop, including tool-driven continuations. The plugin does not edit files itself.
- MiMo Code is an OpenCode fork but uses its own `.mimocode` plugin search directories and `@mimo-ai/plugin` host contract. The exported `server(input)` hook uses the compatible V1 system-transform shape. Do not put MiMo-specific plugins under `.opencode/plugins/`.
- Claude Web supports adding a repository marketplace or uploading a custom plugin ZIP. The Claude Web and Claude Code plugin use the same `.claude-plugin/plugin.json` and skill source.
- ChatGPT Web's public directory is gated by publisher verification and OpenAI's submission review. Local marketplaces documented for Codex desktop/CLI are not the ChatGPT Web public directory.
