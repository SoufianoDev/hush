# Hush

Hush is one cross-agent plugin project. The original `SKILL.md` remains the source of truth; each host receives the native package or plugin entrypoint it expects.

Hush teaches coding agents to avoid comments that merely restate code, preserve comments that carry real information or tooling directives, limit cleanup to code changed in the current task, and use the project's existing formatter.

## Platform support

| Host | Native integration | Install surface |
|---|---|---|
| Claude Code | Claude Code plugin and native Agent Skills | Plugin marketplace / `/plugin`, `.claude/skills/` |
| Codex | Agent Plugin and shared Agent Skills | Codex plugin browser, marketplace, `.agents/skills/`, or Skills CLI |
| Cursor | Agent Plugin plus native and shared Agent Skills | `plugin.json`, `.cursor/skills/`, `.agents/skills/` |
| Cline | Agent Skills with native Cline project path | Skills CLI or `.cline/skills/` |
| Roo Code | Agent Skills with Roo-specific and shared discovery | Skills CLI or `.roo/skills/` |
| Junie | Agent Skills; also discovers shared `.agents/skills/` | Skills CLI / Junie skill locations |
| Windsurf | Agent Skills | Skills CLI or `.windsurf/skills/` |
| Gemini CLI | Native and shared Agent Skills | `.gemini/skills/`, `.agents/skills/`, or Skills CLI |
| GitHub Copilot | Native and shared Agent Skills for CLI, IDE, code review, and cloud agent | `.github/skills/`, `.agents/skills/`, or Skills CLI |
| OpenCode V1 | V1 plugin hook and native skill file | Project shim or npm package in `plugin` config |
| OpenCode V2 | V2 plugin hook and native skill registry | `opencode plugin add` or `plugins` config |
| Antigravity | Native plugin bundle and Agent Skills | `agy plugin install` / Customizations |
| MiMo Code | Host-compatible V1 plugin hook | Project shim or npm package in `plugin` config |
| Claude Web | Claude plugin marketplace / custom plugin upload | Customize → Plugins |
| ChatGPT Web | Portable Plugin package | Public Plugins Directory after OpenAI review and publication |
| Gemini Code Assist / Google Cloud Code | `GEMINI.md` project-context bridge; not a separate Skills plugin | Open the project in the Gemini Code Assist host |
| Aider | Read-only Hush instructions via `--read`; no native Agent Skills discovery | `aider --read skills/hush/SKILL.md` |
| AiderDesk | Agent Skills | Skills CLI (`aider-desk` target) |

These are native host integrations where the host offers them. Claude Web now supports adding a Git repository marketplace or uploading a custom plugin ZIP; the same `.claude-plugin` package works in Claude Web and Claude Code. ChatGPT Web's public plugin path is not an immediate GitHub import: it requires a verified publisher, a package upload, automated checks, review, and publication.

## Agent Skills installation

Hush keeps one canonical skill at `skills/hush/SKILL.md`. For agents that
implement the open Agent Skills format, the Vercel Skills CLI installs it into
the correct project or user directory for the selected host.

Install Hush for the agents you use:

```bash
npx skills add SoufianoDev/hush --skill hush --agent cursor cline codex antigravity gemini-cli github-copilot junie opencode roo windsurf claude-code amp aider-desk augment continue goose kiro-cli kilo openhands pi qwen-code replit trae warp zed zencoder
```


The Skills CLI also supports additional compatible agents, including Amp,
AiderDesk, Augment, Continue, Goose, Kiro CLI, Kilo Code, OpenHands, Pi,
Qwen Code, Replit, Trae, Warp, Zed, and Zencoder. These use the same canonical
Agent Skills package; they do not require separate Hush implementations.
Check the current [supported-agent list](https://github.com/vercel-labs/skills/blob/main/docs/agents.md)
for newly added hosts and their exact target identifiers.

Add `--global` for user-level installation. To let the CLI detect installed
agents and prompt for a target, omit `--agent`:

```bash
npx skills add SoufianoDev/hush --skill hush
```

Update Skills CLI-managed copies with:

```bash
npx skills update hush -y
```

The repository contains shared discovery at `.agents/skills/hush/SKILL.md`
and native project paths for Cline, Roo Code, Junie, Windsurf, and OpenCode.
They mirror the canonical file and are checked by `npm run validate`. After
editing `skills/hush/SKILL.md`, run `npm run sync:skills`; do not edit the
copies directly.

### Gemini Code Assist and Google Cloud Code

Gemini Code Assist agent mode reads project context from `GEMINI.md`. The
root context file points the agent to Hush's canonical skill before code edits.
This is a context-file integration, not a standalone Google Cloud Code plugin
or a native Agent Skills registry. Gemini CLI has native Agent Skills support
and can install Hush using the Skills CLI command above.

### Aider

Aider does not provide native Agent Skills discovery. Load Hush as read-only
context when starting Aider:

```bash
aider --read skills/hush/SKILL.md
```

For persistent use, add the absolute path to `skills/hush/SKILL.md` under
`read:` in `.aider.conf.yml`. AiderDesk is a separate product and has its
own Skills CLI target (`aider-desk`); it is not the same as Aider.

## Build the distribution files

Requirements: Node.js 20+ and the `zip` utility.

```bash
npm run validate
npm run bundle
```

The script is named `bundle` rather than `build` because OpenCode V2 currently fails to install Git dependencies whose package manifest declares a `build` script. The underlying `scripts/build.mjs` and generated archives are unchanged.

The root `plugin.json` follows the portable Agent Plugins format and is also
accepted by Cursor. Hosts with native plugin APIs continue to use their
dedicated integration files; the Skills CLI is the common route for hosts that
consume Agent Skills.

The build creates two upload archives from this one source tree: `dist/hush-claude-plugin.zip` for Claude Web's custom-plugin upload fallback, and `dist/hush-openai-plugin.zip` for ChatGPT's public Plugins submission. Claude Web can instead install directly from the Git repository marketplace. Claude Code, Codex, OpenCode, Antigravity, and MiMo Code use their native application installation paths; they do not need separate downloadable project ZIPs. Both archives are generated from the same canonical `skills/hush/SKILL.md`; do not edit generated copies.

## Install

Use `SoufianoDev/hush` as the public GitHub repository. Open the matching application and follow its install flow.

### Claude Code

```text
/plugin marketplace add SoufianoDev/hush
/plugin install hush@hush
```

Or from the terminal:

```bash
claude plugin marketplace add SoufianoDev/hush
claude plugin install hush@hush
```

Use `/plugin` to manage the installation and choose user, project, or local scope.

### Codex

Add the repository marketplace:

```bash
codex plugin marketplace add SoufianoDev/hush
```

Then open Codex's plugin browser with `/plugins`, find Hush under the added marketplace, and install it. The repo marketplace descriptor is `.agents/plugins/marketplace.json`.

Codex CLI and the ChatGPT desktop app support plugin installation. The ChatGPT web directory uses the public plugin submission and publication flow described below.

### OpenCode V1

The repository includes `.opencode/plugins/hush.ts`, which re-exports the one TypeScript implementation. When you work from a clone of this repository, OpenCode V1 discovers that local plugin automatically. For a global installation across other projects, OpenCode V1 uses the singular `plugin` config key. Add the published npm package to the config file used by OpenCode:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["hush-agent-plugin"]
}
```

For global scope, edit `~/.config/opencode/opencode.json`. For project scope, put the entry in `opencode.json` at the project root. V1 package auto-install is handled by OpenCode at startup.

The repository includes the native skill file at `.opencode/skills/hush/SKILL.md`. For a global V1 skill outside this repository, copy the canonical file to `~/.config/opencode/skills/hush/SKILL.md`. The dual V1/V2 package entrypoint requires OpenCode V1.18.29 or later. Older V1 releases need a V1-only function-export build and are not claimed as supported by this package.

### OpenCode V2

The same `.opencode/plugins/hush.ts` shim is discovered automatically when this repository is the current project. For a global installation from another project, use the V2 terminal plugin manager:

```bash
opencode plugin add github:SoufianoDev/hush
```

V2 uses the plural `plugins` setting internally. The plugin registers Hush with OpenCode's native skill registry through `ctx.skill.transform()`, including when installed globally. In a conversation, type `@hush` and select the skill (or enter `@hush` directly) to load its full instructions for that message. OpenCode can also invoke it automatically when a task matches its description. The V2 hook no longer injects a second copy of the full skill into every model request; older V2 builds without the native skill registry retain the previous context-hook fallback. The same package keeps the V1 `server()` implementation.

### Antigravity

From Antigravity CLI:

```bash
agy plugin install https://github.com/SoufianoDev/hush
agy plugin list
```

In Antigravity, open **Customizations → Plugins** to inspect installed plugins and enable or disable them. The official marketplace listing is a separate Google partner submission; GitHub installation does not publish Hush to Google's public catalog.

For manual project installation, place this repository's plugin directory under `.agents/plugins/hush/` in the workspace. For a global installation, use `~/.gemini/config/plugins/hush/`.

### MiMo Code

MiMo Code uses its own `.mimocode` plugin directories and the V1 server plugin contract. It does not scan OpenCode's `.opencode/plugins/` directories. This repository includes `.mimocode/plugin/hush.ts`, which re-exports the canonical TypeScript entrypoint; opening a clone as the current project makes MiMo Code discover that project plugin.

For a global installation across other projects, publish the npm package first, then add it to `.mimocode/mimocode.json` for a project or `~/.config/mimocode/mimocode.jsonc` for the user:

```json
{
  "$schema": "https://mimo.xiaomi.com/mimocode/config.json",
  "plugin": ["hush-agent-plugin"]
}
```

The package route must first be published to npm; this source archive does not publish it or claim that a registry package already exists. MiMo Code's documented config supports npm plugin specifiers but does not expose the same documented `plugin add` flow as OpenCode V2. The project-local shim is the direct no-registry route; the config entry is for a global package installation.

### Claude Web

Claude Web supports the same Hush plugin through a repository marketplace or a custom plugin ZIP. The repository route is the direct installation path and keeps the project as the single source of truth:

1. Open **Claude → Customize → Plugins**.
2. Select **Add → Add marketplace → Add from a repository**.
3. Enter the public GitHub repository as `SoufianoDev/hush` (or its repository URL).
4. Open **Discover**, find Hush in the newly added marketplace, and click **Add**.

Alternatively, build the project with `npm run bundle`, then use Claude's custom-plugin upload flow and select `dist/hush-claude-plugin.zip`. Plugins added in Claude Web are saved to the account and follow the user across Chat, Cowork, and Claude Code. Organization policies may restrict adding external marketplaces or plugins.

### ChatGPT Web

Hush is packaged as a skills-only portable Agent Plugin. To make it installable from ChatGPT Web's universal Plugins Directory:

1. Publish this repository and a public website containing `website/privacy.html`.
2. Set the real website and privacy-policy URLs in the plugin listing metadata, and provide a verified publisher identity and support contact.
3. Run `npm run bundle`, then upload `dist/hush-openai-plugin.zip` from the OpenAI Plugins submission portal.
4. Resolve automated findings, submit for review, wait for approval, and publish the approved version.
5. Users can then find and install Hush from **ChatGPT → Plugins**.

The web directory is shared with supported Codex surfaces. A local Codex marketplace is not, by itself, an install source for ChatGPT Web. For a skills-only package, OpenAI does not require MCP review test cases or MCP server configuration; it still requires the public listing information, verified publisher, automated checks, and review flow.

## Website

Deploy the `website/` folder to any static host. Set the public repository in `website/config.js` before publishing. The page renders the native install instructions and download links from that configuration.

## Package validation

```bash
npm run validate
```

The validator checks JSON manifests, the Agent Skills frontmatter, the Antigravity manifest schema identifier, expected plugin entrypoints, and the platform-specific package layout. Build archives and inspect them with `unzip -l dist/<archive>.zip`. Before release, also run `agy plugin validate --strict` against the Antigravity plugin directory and test each integration in the actual host. A passing local validation is not a substitute for those host tests or approval by a public marketplace.
